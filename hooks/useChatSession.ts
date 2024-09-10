import { useState, useCallback, useRef, useEffect } from 'react';
import Constants from 'expo-constants';
import { ChatMessage } from '@/types/chat';
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';
import ENV from '@/utils/envConfig'; 
const { BACKEND_URL, AI_BACKEND_URL } = ENV;

const MAX_TOKENS = 4000;

export const useChatSession = () => {
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

  const playAudio = useCallback(async (messageId: number, text: string, audioUri?: string) => {
    if (playingAudioId === messageId) {
      await stopAudio();
      return;
    }

    try {
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
  }, [playingAudioId]);

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

  const sendMessage = useCallback(async (text: string) => {
    const userMessage: ChatMessage = { role: 'user', content: text, id: Date.now(), isLoading: true };
    setChatHistory(prev => [...prev, userMessage]);
    setIsTyping(true);
    setShowTopics(false);

    try {
      const conversationHistory = trimConversationHistory([...chatHistory, userMessage]);
      
      const response = await fetch(`${BACKEND_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: conversationHistory }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      let mateReply = 'Hi';
      if (data && data.reply) {
        mateReply = data.reply;
      }

      const assistantMessage: ChatMessage = { role: 'model', content: mateReply, id: Date.now() };
      
      setChatHistory(prev => [
        ...prev.slice(0, -1),
        { ...userMessage, feedback: data.feedback, isLoading: false },
        assistantMessage
      ]);

      await autoPlayMessage(assistantMessage);
    } catch (error) {
      console.error('Error sending message:', error);
      setChatHistory(prev => [
        ...prev.slice(0, -1),
        { ...prev[prev.length - 1], isLoading: false, feedback: { correctedVersion: '', explanation: 'Error occurred' } },
      ]);
    } finally {
      setIsTyping(false);
    }
  }, [chatHistory, autoPlayMessage]);

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
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        interruptionModeIOS: InterruptionModeIOS.DoNotMix,
        interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
    } catch (error) {
      console.error('Error stopping audio:', error);
    }
  }, [playingAudioId, stopAudio]);

  const handleMicPress = useCallback(async () => {
    try {
      await stopAllAudio();

      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access microphone was denied');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        interruptionModeIOS: InterruptionModeIOS.DoNotMix,
        interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      recordingObject.current = recording;
      setIsRecording(true);
    } catch (error) {
      console.error('Failed to start recording', error);
    }
  }, [stopAllAudio]);

  const stopRecording = useCallback(async () => {
    if (!recordingObject.current) return;

    try {
      await recordingObject.current.stopAndUnloadAsync();
      setIsRecording(false);
    } catch (error) {
      console.error('Failed to stop recording', error);
    }
  }, []);

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
          // Show popup for empty transcription
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
            body: JSON.stringify({ messages: conversationHistory }),
          });
  
          if (!chatResponse.ok) {
            throw new Error(`HTTP error! status: ${chatResponse.status}`);
          }
  
          const data = await chatResponse.json();
          let mateReply = 'Hi';
          if (data && data.reply) {
            mateReply = data.reply;
          }
  
          const assistantMessage: ChatMessage = { role: 'model', content: mateReply, id: Date.now() };
          
          setChatHistory(prev => [
            ...prev.slice(0, -1),
            { ...userMessage, feedback: data.feedback, isLoading: false },
            assistantMessage
          ]);
  
          await autoPlayMessage(assistantMessage);
        } catch (error) {
          console.error('Error sending message:', error);
          setChatHistory(prev => [
            ...prev.slice(0, -1),
            { ...userMessage, isLoading: false, feedback: { correctedVersion: '', explanation: 'Error occurred' } },
          ]);
        } finally {
          setIsTyping(false);
        }
      } else {
        // Show popup when no transcription is returned
        showPopup("I couldn't transcribe the audio. Please try again.");
      }
    } catch (error) {
      console.error('Failed to send audio', error);
      showPopup("An error occurred while processing your audio. Please try again.");
    } finally {
      setIsProcessingAudio(false);
      setIsRecording(false);
    }
  }, [chatHistory, autoPlayMessage, AI_BACKEND_URL, BACKEND_URL, showPopup]);

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
      const response = await fetch(`${BACKEND_URL}/session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (data.greetingMessage) {
        const greetingMessage: ChatMessage = { 
          role: 'model', 
          content: data.greetingMessage, 
          id: Date.now()
        };
        setChatHistory([greetingMessage]);
        setShowTopics(true);
        
        await autoPlayMessage(greetingMessage);
      }
    } catch (error) {
      console.error('Error creating new session:', error);
    }
  }, [stopAllAudio, autoPlayMessage]);

  const initializeChat = useCallback(async () => {
    if (!isInitializing || hasInitialized.current) return;
    hasInitialized.current = true;

    try {
      const response = await fetch(`${BACKEND_URL}/session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (data.greetingMessage) {
        const greetingMessage: ChatMessage = { 
          role: 'model', 
          content: data.greetingMessage, 
          id: Date.now()
        };
        setChatHistory(prev => [...prev, greetingMessage]);
        setShowTopics(true);
        
        await autoPlayMessage(greetingMessage);
      }
    } catch (error) {
      console.error('Error creating session:', error);
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
    chatHistory,
    isInitializing,
    isTyping,
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