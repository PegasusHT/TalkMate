//hooks/pronunciation/usePronunAudio.tsx
import { useState, useCallback, useRef, useEffect } from 'react';
import { Alert } from 'react-native';
import { Audio } from 'expo-av';
import ENV from '@/utils/envConfig';

export const usePronunciationAudio = (sentence: string, isScreenActive: boolean) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const soundObject = useRef<Audio.Sound | null>(null);
  const audioBase64Ref = useRef<string | null>(null);

  const fetchAudio = useCallback(async () => {
    if (audioBase64Ref.current || !isScreenActive) return;

    setIsLoadingAudio(true);
    try {
      const formData = new FormData();
      formData.append('text', sentence);

      const response = await fetch(`${ENV.AI_BACKEND_URL}/tts/`, {
        method: 'POST',
        body: formData,
      });

      if (!isScreenActive) return;

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      audioBase64Ref.current = data.audio;
    } catch (error) {
      console.log('Error fetching audio:', error);
      if (isScreenActive) {
        Alert.alert('Error', 'Failed to fetch the audio. Please try again.');
      }
    } finally {
      setIsLoadingAudio(false);
    }
  }, [sentence, isScreenActive]);

  const playSound = useCallback(async (rate: number = 1.0) => {
    if (isPlaying || !isScreenActive) {
      await stopSound();
    }

    if (!audioBase64Ref.current) {
      await fetchAudio();
    }

    if (!audioBase64Ref.current || !isScreenActive) return;

    try {
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: `data:audio/mp3;base64,${audioBase64Ref.current}` },
        { shouldPlay: true, rate }
      );
      soundObject.current = newSound;
      setIsPlaying(true);

      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && !status.isPlaying) {
          setIsPlaying(false);
          if (status.didJustFinish) {
            newSound.unloadAsync();
          }
        }
      });
    } catch (error) {
      console.log('Error playing sound:', error);
      if (isScreenActive) {
        Alert.alert('Error', 'Failed to play the sentence. Please try again.');
      }
      setIsPlaying(false);
    }
  }, [isPlaying, isScreenActive, fetchAudio]);

  const stopSound = async () => {
    if (soundObject.current) {
      await soundObject.current.stopAsync();
      await soundObject.current.unloadAsync();
      soundObject.current = null;
    }
    setIsPlaying(false);
  };

  useEffect(() => {
    fetchAudio();
    return () => {
      stopSound();
    };
  }, [fetchAudio]);

  return { isPlaying, isLoadingAudio, playSound, stopSound };
};