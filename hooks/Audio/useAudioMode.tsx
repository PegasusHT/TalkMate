//hooks/Audio/useAudioMode.tsx
import { useEffect } from 'react';
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';

const audioMode = {
  allowsRecordingIOS: true,
  playsInSilentModeIOS: true,
  staysActiveInBackground: false,
  interruptionModeIOS: InterruptionModeIOS.DoNotMix,
  interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
  shouldDuckAndroid: false,
  playThroughEarpieceAndroid: false,
};

export const useAudioMode = () => {
  useEffect(() => {
    const initializeAudioMode = async () => {
      try {
        await Audio.setAudioModeAsync(audioMode);
      } catch (error) {
        console.error('Failed to set audio mode:', error);
      }
    };

    initializeAudioMode();
  }, []);

  return {};
};