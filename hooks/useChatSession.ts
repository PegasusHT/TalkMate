import { useState, useCallback, useRef, useEffect } from 'react';
import { ChatMessage, Feedback, FeedbackType } from '@/types/chat';
import { Audio } from 'expo-av';
import ENV from '@/utils/envConfig'; 
import { useAudioMode } from './useAudioMode'; 
import axios from 'axios';

const { BACKEND_URL, AI_BACKEND_URL } = ENV;

const MAX_TOKENS = 4000;

export const useChatSession = (isMiaChat = false, scenarioId?: number, scenarioDetails?: {
  aiName: string;
  aiRole: string;
  scenarioTitle: string;
  userRole: string;
}) => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState<ChatMessage | null>(null);
  const hasInitialized = useRef(false);
  const [showTopics, setShowTopics] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const recordingObject = useRef<Audio.Recording | null>(null);
  const [isProcessingAudio, setIsProcessingAudio] = useState(false);
  const [playingAudioId, setPlayingAudioId] = useState<number | null>(null);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const soundObject = useRef(new Audio.Sound());
  const [popupMessage, setPopupMessage] = useState<string | null>(null);
  const { mode, setPlaybackMode, setRecordingMode } = useAudioMode();

  useEffect(() => {
    setPlaybackMode();
  }, [setPlaybackMode]);

  const playAudio = useCallback(async (messageId: number, text: string, audioUri?: string) => {
    if (playingAudioId === messageId) {
      await stopAudio();
      return;
    }

    try {
      await setPlaybackMode();
      setIsAudioLoading(true);
      await stopAudio();

      if (audioUri) {
        // Play user's recorded audio
        await soundObject.current.unloadAsync();
        await soundObject.current.loadAsync({ uri: audioUri });
        await soundObject.current.playAsync();
      } else {
        // Play AI-generated audio
        const formData = new FormData();
        formData.append('text', text);

        const response = await fetch(`${AI_BACKEND_URL}/tts/`, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const audioBase64 = data.audio;

        const aiAudioUri = `data:audio/mp3;base64,${audioBase64}`;

        await soundObject.current.unloadAsync();
        await soundObject.current.loadAsync({ uri: aiAudioUri });
        await soundObject.current.playAsync();
      }

      setPlayingAudioId(messageId);

      soundObject.current.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && !status.isPlaying && !('didJustFinish' in status)) {
          setIsAudioLoading(false);
        }
        if ('didJustFinish' in status && status.didJustFinish) {
          setPlayingAudioId(null);
          setIsAudioLoading(false);
        }
      });
    } catch (error) {
      console.error('Error playing audio:', error);
      setPlayingAudioId(null);
      setIsAudioLoading(false);
    }
  }, [playingAudioId, setPlaybackMode]);

  const stopAudio = useCallback(async () => {
    if (playingAudioId !== null) {
      await soundObject.current.stopAsync();
      setPlayingAudioId(null);
      setIsAudioLoading(false);
    }
  }, [playingAudioId]);

  const autoPlayMessage = useCallback(async (message: ChatMessage) => {
    if (message.role === 'model') {
      await playAudio(message.id, message.content);
    }
  }, [playAudio]);

  const estimateTokens = (text: string) => {
    return text.split(/\s+/).length;
  };

  const trimConversationHistory = (history: ChatMessage[]): ChatMessage[] => {
    let totalTokens = 0;
    return history.reverse().filter(msg => {
      totalTokens += estimateTokens(msg.content);
      return totalTokens <= MAX_TOKENS;
    }).reverse();
  };

  const sendMessage = useCallback(async (text: string, isInitialGreeting = false) => {
    const userMessage: ChatMessage = { 
      role: isInitialGreeting ? 'model' : 'user', 
      content: text, 
      id: Date.now(), 
      isLoading: !isInitialGreeting 
    };
    setChatHistory(prev => [...prev, userMessage]);
    if (!isInitialGreeting) {
      setIsTyping(true);
      setShowTopics(false);

      try {
        const conversationHistory = trimConversationHistory([...chatHistory, userMessage]);
        
        const response = await fetch(`${BACKEND_URL}/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: conversationHistory,
            chatType: isMiaChat ? 'main' : 'roleplay',
            scenarioDetails: !isMiaChat ? scenarioDetails : undefined,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        let mateReply = 'Hi';
        if (data && data.reply) {
          mateReply = data.reply;
        }

        const feedback: Feedback = {
          correctedVersion: data.feedback.correctedVersion,
          explanation: data.feedback.explanation,
          feedbackType: data.feedback.feedbackType as FeedbackType
        };

        const assistantMessage: ChatMessage = { 
          role: 'model', 
          content: mateReply, 
          id: Date.now() 
        };
        
        setChatHistory(prev => [
          ...prev.slice(0, -1),
          { ...userMessage, feedback, isLoading: false },
          assistantMessage
        ]);

        await autoPlayMessage(assistantMessage);
      } catch (error) {
        console.error('Error sending message:', error);
        setChatHistory(prev => [
          ...prev.slice(0, -1),
          { 
            ...prev[prev.length - 1], 
            isLoading: false, 
            feedback: { 
              correctedVersion: '', 
              explanation: 'Error occurred',
              feedbackType: 'NONE'
            } 
          },
        ]);
      } finally {
        setIsTyping(false);
      }
    }
  }, [chatHistory, autoPlayMessage, isMiaChat, scenarioDetails]);

  const handleSend = useCallback(() => {
    if (message.trim()) {
      sendMessage(message);
      setMessage('');
    }
  }, [message, sendMessage]);

  const stopAllAudio = useCallback(async () => {
    try {
      if (playingAudioId !== null) {
        await stopAudio();
      }
    } catch (error) {
      console.log('Error stopping audio:', error);
    }
  }, [playingAudioId, stopAudio]);

  const handleMicPress = useCallback(async () => {
    await setRecordingMode();
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access microphone was denied');
        return;
      }

      await stopAllAudio();

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      recordingObject.current = recording;
      setIsRecording(true);
    } catch (error) {
      console.error('Failed to start recording', error);
    }
  }, [setRecordingMode, stopAllAudio]);

  const stopRecording = useCallback(async () => {
    if (!recordingObject.current) return;

    try {
      await recordingObject.current.stopAndUnloadAsync();
      await setPlaybackMode();
    } catch (error) {
      console.error('Failed to stop recording', error);
    } finally {
      setIsRecording(false);
      recordingObject.current = null;
    }
  }, [setPlaybackMode]);

  const showPopup = useCallback((message: string) => {
    setPopupMessage(message);
    setTimeout(() => setPopupMessage(null), 2000); 
  }, []);

  const sendAudio = useCallback(async () => {
    if (!recordingObject.current) return;
  
    try {
      setIsProcessingAudio(true);
      await recordingObject.current.stopAndUnloadAsync();
      const uri = recordingObject.current.getURI();
      if (!uri) throw new Error('No recording URI found');
  
      const formData = new FormData();
      formData.append('files', {
        uri,
        type: 'audio/wav',
        name: 'audio.wav',
      } as any);
  
      const response = await fetch(`${AI_BACKEND_URL}/whisper/`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
  
      const result = await response.json();
  
      if (result.results && result.results.length > 0) {
        const transcribedText = result.results[0].transcript;
        
        if (!transcribedText || transcribedText.trim() === '') {
          showPopup("I couldn't hear anything. Please try speaking again.");
          return;
        }
        
        const userMessage: ChatMessage = { 
          role: 'user', 
          content: transcribedText, 
          id: Date.now(), 
          audioUri: uri,
          isLoading: true
        };
        
        setChatHistory(prev => [...prev, userMessage]);
        
        setIsTyping(true);
        setShowTopics(false);
  
        try {
          const conversationHistory = trimConversationHistory([...chatHistory, userMessage]);
          
          const chatResponse = await fetch(`${BACKEND_URL}/chat`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              messages: conversationHistory,
              chatType: isMiaChat ? 'main' : 'roleplay',
              scenarioDetails: !isMiaChat ? scenarioDetails : undefined,
            }),
          });
  
          if (!chatResponse.ok) {
            throw new Error(`HTTP error! status: ${chatResponse.status}`);
          }
  
          const data = await chatResponse.json();
          let mateReply = 'Hi';
          if (data && data.reply) {
            mateReply = data.reply;
          }
  
          const feedback: Feedback = {
            correctedVersion: data.feedback.correctedVersion,
            explanation: data.feedback.explanation,
            feedbackType: data.feedback.feedbackType as FeedbackType
          };

          const assistantMessage: ChatMessage = { 
            role: 'model', 
            content: mateReply, 
            id: Date.now() 
          };
          
          setChatHistory(prev => [
            ...prev.slice(0, -1),
            { ...userMessage, feedback, isLoading: false },
            assistantMessage
          ]);
          
          await setPlaybackMode();
          await autoPlayMessage(assistantMessage);
        } catch (error) {
          console.error('Error sending message:', error);
          setChatHistory(prev => [
            ...prev.slice(0, -1),
            { 
              ...userMessage, 
              isLoading: false, 
              feedback: { 
                correctedVersion: '', 
                explanation: 'Error occurred',
                feedbackType: 'NONE'
              } 
            },
          ]);
        } finally {
          setIsTyping(false);
        }
      } else {
        showPopup("I couldn't transcribe the audio. Please try again.");
      }
    } catch (error) {
      console.error('Failed to send audio', error);
      showPopup("An error occurred while processing your audio. Please try again.");
    } finally {
      setIsProcessingAudio(false);
      setIsRecording(false);
    }
  }, [chatHistory, autoPlayMessage, AI_BACKEND_URL, BACKEND_URL, showPopup, setPlaybackMode, isMiaChat, scenarioDetails]);

  const startNewChat = useCallback(async () => {
    await stopAllAudio();

    setChatHistory([]);
    setMessage('');
    setIsTyping(false);
    setShowFeedbackModal(false);
    setCurrentFeedback(null);
    setShowTopics(false);
    setIsRecording(false);
    setIsProcessingAudio(false);
    setPlayingAudioId(null);
    setIsAudioLoading(false);

    try {
      let response;
      if (isMiaChat) {
        response = await axios.post(`${BACKEND_URL}/session`, {
          aiName: 'Mia',
          role: 'English practice buddy',
          traits: 'friendly,patient,encouraging',
          context: 'English language learning',
        });
      } else if (scenarioId) {
        response = await axios.post(`${BACKEND_URL}/session`, { scenarioId });
      } else {
        throw new Error('Invalid chat initialization: missing scenarioId for non-Mia chat');
      }

      const { greetingMessage } = response.data;
      
      if (greetingMessage) {
        const greetingMessageObject: ChatMessage = { 
          role: 'model', 
          content: greetingMessage, 
          id: Date.now()
        };
        setChatHistory([greetingMessageObject]);
        setShowTopics(isMiaChat); // Only show topics for Mia's chat
        
        await autoPlayMessage(greetingMessageObject);
      }
    } catch (error) {
      console.error('Error creating new session:', error);
      // Fallback greeting for Mia if the request fails
      if (isMiaChat) {
        const fallbackGreeting = "Hey there! 👋 I'm Mia, your friendly English practice buddy! 😊 Ask me anything or select a topic below:";
        const fallbackGreetingObject: ChatMessage = {
          role: 'model',
          content: fallbackGreeting,
          id: Date.now()
        };
        setChatHistory([fallbackGreetingObject]);
        setShowTopics(true);
        await autoPlayMessage(fallbackGreetingObject);
      }
    }
  }, [isMiaChat, scenarioId, stopAllAudio, autoPlayMessage]);

  const initializeChat = useCallback(async (scenarioId?: number) => {
    if (!isInitializing || hasInitialized.current) return;
    hasInitialized.current = true;

    try {
      let response;
      if (isMiaChat) {
        // For Mia's main chat
        response = await axios.post(`${BACKEND_URL}/session`, {
          aiName: 'Mia',
          role: 'English practice buddy',
          traits: 'friendly,patient,encouraging',
          context: 'English language learning',
        });
      } else if (scenarioId) {
        // For roleplay scenarios
        response = await axios.post(`${BACKEND_URL}/session`, { scenarioId });
      } else {
        throw new Error('Invalid chat initialization: missing scenarioId for non-Mia chat');
      }

      const { greetingMessage } = response.data;
      
      if (greetingMessage) {
        const greetingMessageObject: ChatMessage = { 
          role: 'model', 
          content: greetingMessage, 
          id: Date.now()
        };
        setChatHistory([greetingMessageObject]);
        setShowTopics(isMiaChat); // Only show topics for Mia's chat
        
        await autoPlayMessage(greetingMessageObject);
      }
    } catch (error) {
      console.error('Error initializing chat:', error);
      // Fallback greeting for Mia if the request fails
      if (isMiaChat) {
        const fallbackGreeting = "Hey there! 👋 I'm Mia, your friendly English practice buddy! 😊 Ask me anything or select a topic below:";
        const fallbackGreetingObject: ChatMessage = {
          role: 'model',
          content: fallbackGreeting,
          id: Date.now()
        };
        setChatHistory([fallbackGreetingObject]);
        setShowTopics(true);
        await autoPlayMessage(fallbackGreetingObject);
      }
    } finally {
      setIsInitializing(false);
    }
  }, [isInitializing, autoPlayMessage]);

  const handleTopicSelect = useCallback((topic: string) => {
    const params = topic === 'Fun' ? 'a fun' : topic === 'Interesting' ? 'an interesting' : 'a ';
    const userMessage = `Hey, Mia! Ask me ${params} question.`;
    sendMessage(userMessage);
  }, [sendMessage]);

  return {
    message,
    setMessage,
    chatHistory, setChatHistory,
    isInitializing,
    isTyping, setIsTyping,
    showFeedbackModal,
    setShowFeedbackModal,
    currentFeedback,
    setCurrentFeedback,
    showTopics,
    sendMessage,
    handleSend,
    handleMicPress,
    isRecording,
    stopRecording,
    sendAudio,
    initializeChat,
    isProcessingAudio,
    handleTopicSelect,
    playAudio,
    stopAudio,
    playingAudioId,
    isAudioLoading,
    stopAllAudio, 
    startNewChat,
    popupMessage
  };
};