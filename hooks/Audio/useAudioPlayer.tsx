import { useState, useCallback, useRef } from 'react';
import { Audio } from 'expo-av';
import ENV from '@/utils/envConfig';
import { useAudioMode } from './useAudioMode';

const { AI_BACKEND_URL } = ENV;

export const useAudioPlayer = () => {
  const [playingAudioId, setPlayingAudioId] = useState<number | null>(null);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const soundObject = useRef(new Audio.Sound());
  const { setPlaybackMode } = useAudioMode();

  const playAudio = useCallback(async (messageId: number, text: string, audioUri?: string) => {
    if (playingAudioId === messageId) {
      await stopAudio();
      return;
    }

    try {
      await setPlaybackMode();
      setIsAudioLoading(true);
      setPlayingAudioId(messageId);
      await stopAudio();

      if (audioUri) {
        // Play user's recorded audio
        await soundObject.current.unloadAsync();
        await soundObject.current.loadAsync({ uri: audioUri });
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
      }

      await soundObject.current.playAsync();
      setIsAudioLoading(false);

      soundObject.current.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && !status.isPlaying && status.didJustFinish) {
          setPlayingAudioId(null);
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

  return {
    playAudio,
    stopAudio,
    playingAudioId,
    isAudioLoading,
  };
};