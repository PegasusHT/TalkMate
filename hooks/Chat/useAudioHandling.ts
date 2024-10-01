import { useState, useCallback, useRef } from 'react';
import { Audio } from 'expo-av';
import { useAudioMode } from '../Audio/useAudioMode';
import ENV from '@/utils/envConfig';
import { ChatMessage, Feedback, FeedbackType } from '@/types/chat';

const { AI_BACKEND_URL, BACKEND_URL } = ENV;

const MAX_TOKENS = 4000; // Add this constant

export const useAudioHandling = (
  setChatHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  chatHistory: ChatMessage[],
  isSophiaChat: boolean,
  scenarioDetails?: any
) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessingAudio, setIsProcessingAudio] = useState(false);
  const [playingAudioId, setPlayingAudioId] = useState<number | null>(null);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [popupMessage, setPopupMessage] = useState<string | null>(null);
  const recordingObject = useRef<Audio.Recording | null>(null);
  const soundObject = useRef(new Audio.Sound());
  const { setPlaybackMode, setRecordingMode } = useAudioMode();

  const stopAudio = useCallback(async () => {
    try {
      const playbackStatus = await soundObject.current.getStatusAsync();
      if (playbackStatus.isLoaded) {
        await soundObject.current.stopAsync();
        await soundObject.current.unloadAsync();
      }
    } catch (error) {
      console.log('Error stopping audio:', error);
      try {
        await soundObject.current.unloadAsync();
      } catch (unloadError) {
        console.log('Error unloading audio:', unloadError);
      }
    } finally {
      setPlayingAudioId(null);
      setIsAudioLoading(false);
    }
  }, []);

  const stopAllAudio = useCallback(async () => {
    if (playingAudioId !== null) {
      await stopAudio();
    }
  }, [playingAudioId, stopAudio]);

  const playAudio = useCallback(async (messageId: number, text: string, audioUri?: string) => {
    let retryCount = 0;
    const maxRetries = 3;
  
    const attemptPlayback = async () => {
      try {
        if (playingAudioId === messageId) {
          await stopAudio();
          return;
        }
  
        await stopAudio();
        await setPlaybackMode();
        setIsAudioLoading(true);
        setPlayingAudioId(messageId);
  
        let uri: string;
        if (audioUri) {
          uri = audioUri;
        } else {
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
          uri = `data:audio/wav;base64,${data.audio}`;
        }
  
        await soundObject.current.unloadAsync();
        const { sound } = await Audio.Sound.createAsync(
          { uri },
          { shouldPlay: true }
        );
  
        soundObject.current = sound;
        setIsAudioLoading(false);
  
        soundObject.current.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && !status.isPlaying && status.didJustFinish) {
            setPlayingAudioId(null);
          }
        });
  
        await soundObject.current.playAsync();
      } catch (error) {
        console.error('Error playing audio:', error);
        if (retryCount < maxRetries) {
          retryCount++;
          console.log(`Retrying playback (attempt ${retryCount}/${maxRetries})`);
          await attemptPlayback();
        } else {
          setPlayingAudioId(null);
          setIsAudioLoading(false);
        }
      }
    };
  
    await attemptPlayback();
  }, [playingAudioId, setPlaybackMode, stopAudio]);

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

  const trimConversationHistory = useCallback((history: ChatMessage[]): ChatMessage[] => {
    let totalTokens = 0;
    return history.reverse().filter(msg => {
      totalTokens += msg.content.split(/\s+/).length;
      return totalTokens <= MAX_TOKENS;
    }).reverse();
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
        throw new Error(`HTTP error! status: ${response.status}`);
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
        
        try {
          const conversationHistory = trimConversationHistory([...chatHistory, userMessage]);
          
          const chatResponse = await fetch(`${BACKEND_URL}/chat`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              messages: conversationHistory,
              chatType: isSophiaChat ? 'main' : 'roleplay',
              scenarioDetails: !isSophiaChat ? scenarioDetails : undefined,
            }),
          });
  
          if (!chatResponse.ok) {
            throw new Error(`HTTP error! status: ${chatResponse.status}`);
          }
  
          const data = await chatResponse.json();
          const mateReply = data.reply || 'Hi';
  
          const feedback: Feedback = {
            correctedVersion: data.feedback.correctedVersion,
            explanation: data.feedback.explanation,
            feedbackType: data.feedback.feedbackType as FeedbackType,
            isCorrect: data.feedback.isCorrect,
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
          await playAudio(assistantMessage.id, assistantMessage.content);
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
                feedbackType: 'NONE',
                isCorrect:false,
              } 
            },
          ]);
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
  }, [chatHistory, playAudio, setChatHistory, showPopup, setPlaybackMode, isSophiaChat, scenarioDetails, trimConversationHistory]);

  return {
    isRecording,
    isProcessingAudio,
    playingAudioId,
    isAudioLoading,
    popupMessage,
    playAudio,
    stopAudio,
    stopAllAudio,
    handleMicPress,
    stopRecording,
    sendAudio,
  };
};