//hooks/Chat/useAudioHandling.ts
import { useState, useCallback, useRef, useEffect } from 'react';
import { AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import ENV from '@/utils/envConfig';
import { ChatMessage, Feedback, FeedbackType } from '@/types/chat';
import { useRecordingManager } from '../Audio/useRecordingManger';
import { useAudioMode } from '../Audio/useAudioMode';
import { NativeEventEmitter, NativeModules } from 'react-native';

const { AI_BACKEND_URL, BACKEND_URL } = ENV;

const MAX_TOKENS = 4000;
const MAX_CACHE_SIZE = 50;

type AudioCache = {
  [key: number]: {
    firstSentence?: string[];
    rest?: string[];
  };
};

export const splitText = (text: string) => {
  const splitIntoSentences = (text: string) => {
    const regex = /[^.!?]+[.!?]+|[^.!?]+$/g;
    const sentences = text.match(regex) || [];
    return sentences.map(sentence => sentence.trim());
  };

  const sentences = splitIntoSentences(text);

  const firstSentence = sentences[0] || '';
  const firstSentenceWordCount = firstSentence.split(/\s+/).filter(Boolean).length;

  const secondSentence = sentences[1] || '';
  const secondSentenceWordCount = secondSentence.split(/\s+/).filter(Boolean).length;

  let firstPart = '';
  let restText = '';

  if (firstSentenceWordCount >= 6) {
    firstPart = firstSentence;
    restText = text.substring(firstSentence.length).trim();
  } else {
    if (secondSentence) {
      if (secondSentenceWordCount < 6) {
        firstPart = firstSentence + ' ' + secondSentence;
        restText = text.substring(firstSentence.length + secondSentence.length).trim();
      } else {
        if (firstSentenceWordCount < 2) {
          firstPart = firstSentence + ' ' + secondSentence;
          restText = text.substring(firstSentence.length + secondSentence.length).trim();
        } else {
          firstPart = firstSentence;
          restText = text.substring(firstSentence.length).trim();
        }
      }
    } else {
      firstPart = firstSentence;
      restText = '';
    }
  }

  return { firstPart: firstPart.trim(), restText: restText.trim() };
};  

export const useAudioHandling = (
  setChatHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  chatHistory: ChatMessage[],
  isJennieChat: boolean,
  setShowTopics: React.Dispatch<React.SetStateAction<boolean>>,
  isTyping: boolean,
  showPopup: (message: string) => void,
  isScreenActive: React.MutableRefObject<boolean | null>,
  scenarioDetails?: any,
) => {
  const [isProcessingAudio, setIsProcessingAudio] = useState(false);
  const [playingAudioId, setPlayingAudioId] = useState<number | null>(null);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const soundObject = useRef(new Audio.Sound());
  const [audioCache, setAudioCache] = useState<AudioCache>({});
  const [isRecording, setIsRecording] = useState(false);
  const isRecordingRef = useRef(isRecording);
  const { startRecording, stopRecording, isAudioSessionPrepared } = useRecordingManager();
  const { mode, setPlaybackMode, setRecordingMode } = useAudioMode();

  useEffect(() => {
    isRecordingRef.current = isRecording;
  }, [isRecording]);

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

  useEffect(() => {
    const loadCache = async () => {
      try {
        const savedCache = await AsyncStorage.getItem('audioCache');
        if (savedCache) {
          setAudioCache(JSON.parse(savedCache));
        }
      } catch (error) {
        console.error('Error loading audio cache:', error);
      }
    };
    loadCache();
  }, []);

  useEffect(() => {
    const saveCache = async () => {
      try {
        await AsyncStorage.setItem('audioCache', JSON.stringify(audioCache));
      } catch (error) {
        console.error('Error saving audio cache:', error);
      }
    };
    saveCache();
  }, [audioCache]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'background') {
        setAudioCache({});
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const updateCache = useCallback((messageId: number, audioData: { firstSentence?: string[]; rest?: string[] }) => {
    setAudioCache(prevCache => {
      const existingData = prevCache[messageId] || {};
      const newData = { ...existingData, ...audioData };
      const newCache = { ...prevCache, [messageId]: newData };
  
      const cacheSize = Object.keys(newCache).length;
      if (cacheSize > MAX_CACHE_SIZE) {
        const oldestKey = Object.keys(newCache)[0];
        delete newCache[parseInt(oldestKey)];
      }
      return newCache;
    });
  }, []);

  useEffect(() => {
    return () => {
      isScreenActive.current = false;
    };
  }, []);
  
  const playAndWaitForFinish = async (uri: string) => {
    await soundObject.current.unloadAsync();
    await soundObject.current.loadAsync({ uri });
    await soundObject.current.setVolumeAsync(1.0);
    await soundObject.current.playAsync();
  
    return new Promise<void>((resolve) => {
      soundObject.current.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && !status.isPlaying && status.didJustFinish) {
          resolve();
        }
      });
    });
  };

  const playAudio = useCallback(
    async (messageId: number, text: string, audioUri?: string) => {
      if (isRecordingRef.current) {
        showPopup("Currently recording, skipping audio playback");
        return;
      }
  
      let retryCount = 0;
      const maxRetries = 1;
      await setPlaybackMode();
  
      const attemptPlayback = async () => {
        try {
          if (playingAudioId === messageId) {
            await stopAudio();
            return;
          }
  
          await stopAudio();
          setIsAudioLoading(true);
          setPlayingAudioId(messageId);
  
          if (audioUri) {
            await playAndWaitForFinish(audioUri);
          } else {
            const { firstPart, restText } = splitText(text);
  
            const restPromise = (async () => {
              if (!restText.trim()) return [];
              if (audioCache[messageId]?.rest) return audioCache[messageId].rest;
  
              const formData = new FormData();
              formData.append('text', restText);
              formData.append('is_first_part', 'false');
  
              const response = await fetch(`${AI_BACKEND_URL}/tts/`, {
                method: 'POST',
                body: formData,
              });
  
              if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  
              const data = await response.json();
              const restAudioData = data.audio_chunks.split(',');
  
              updateCache(messageId, { rest: restAudioData });
              return restAudioData;
            })();
  
            let firstAudioData: string[];
            if (audioCache[messageId]?.firstSentence) {
              firstAudioData = audioCache[messageId].firstSentence;
            } else {
              const formData = new FormData();
              formData.append('text', firstPart);
              formData.append('is_first_part', 'true');
  
              const response = await fetch(`${AI_BACKEND_URL}/tts/`, {
                method: 'POST',
                body: formData,
              });
  
              if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  
              const data = await response.json();
              firstAudioData = data.audio_chunks.split(',');
  
              updateCache(messageId, { firstSentence: firstAudioData });
            }
  
            for (const audioSegment of firstAudioData) {
              const uri = `data:audio/wav;base64,${audioSegment}`;
              if (!isScreenActive.current) return;
              setIsAudioLoading(false)
              await playAndWaitForFinish(uri);
            }
  
            const restAudioData = await restPromise;
            for (const audioSegment of restAudioData) {
              const uri = `data:audio/wav;base64,${audioSegment}`;
              if (!isScreenActive.current) return;
              await playAndWaitForFinish(uri);
            }
          }
  
          setPlayingAudioId(null);
        } catch (error) {
          console.error('Error playing audio:', error);
          if (retryCount < maxRetries) {
            retryCount++;
            await attemptPlayback();
          } else {
            setPlayingAudioId(null);
            setIsAudioLoading(false);
          }
        }
      };
  
      await attemptPlayback();
    },
    [playingAudioId, stopAudio, audioCache, updateCache, showPopup]
  );  
  
  const handleMicPress = useCallback(async () => {
    try {
      if (isAudioLoading) {
        showPopup("Audio is currently loading. Please wait for it to finish before recording.");
        return;
      }
      if (isTyping) {
        showPopup("A message is being processed. Please wait before starting a new recording.");
        return;
      }
  
      await stopAllAudio();
      await setRecordingMode();
      await startRecording();
      setIsRecording(true);
    } catch (error) {
      console.error('Failed to start recording', error);
      showPopup("There was an error starting the recording. Please try again.");
    }
  }, [stopAllAudio, startRecording, isAudioLoading, isTyping, showPopup]);

  const stopRecordingHandler = useCallback(async () => {
    try {
      await stopRecording();
      setIsRecording(false);
      await setPlaybackMode();
    } catch (error) {
      console.error('Failed to stop recording', error);
    }
  }, [stopRecording]);

  const trimConversationHistory = useCallback((history: ChatMessage[]): ChatMessage[] => {
    let totalTokens = 0;
    return history.reverse().filter(msg => {
      totalTokens += msg.content.split(/\s+/).length;
      return totalTokens <= MAX_TOKENS;
    }).reverse();
  }, []);

  const sendAudio = useCallback(async () => {
    try {
      setIsProcessingAudio(true);
      const uri = await stopRecording();
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
      setShowTopics(false);

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

        setIsProcessingAudio(false);
        setIsRecording(false);

        try {
          const conversationHistory = trimConversationHistory([...chatHistory, userMessage]);
          
          const chatResponse = await fetch(`${BACKEND_URL}/chat`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              messages: conversationHistory,
              chatType: isJennieChat ? 'main' : 'roleplay',
              scenarioDetails: !isJennieChat ? scenarioDetails : undefined,
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
                isCorrect: false,
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
    }
  }, [chatHistory, playAudio, setChatHistory, showPopup, stopRecording, isJennieChat, scenarioDetails, trimConversationHistory]);

  return {
    isRecording,
    setIsRecording,
    isProcessingAudio,
    playingAudioId,
    isAudioLoading,
    playAudio,
    stopAudio,
    stopAllAudio,
    handleMicPress,
    stopRecording: stopRecordingHandler,
    sendAudio,
    isAudioSessionPrepared,
  };
};