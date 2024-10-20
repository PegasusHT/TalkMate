//hooks/Audio/useAudioMode.tsx
import { useState, useCallback } from 'react';
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';

const playbackMode = {
  allowsRecordingIOS: false,
  playsInSilentModeIOS: true,
  staysActiveInBackground: false,
  interruptionModeIOS: InterruptionModeIOS.DoNotMix,
  interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
  shouldDuckAndroid: false,
  playThroughEarpieceAndroid: false,
  iosCategory: 'Playback',
  iosCategoryMode: 'Default',
  iosCategoryOptions: ['DefaultToSpeaker'], 
};

const recordingMode = {
  ...playbackMode,
  allowsRecordingIOS: true,
  iosCategory: 'PlayAndRecord', 
};

export const useAudioMode = () => {
  const [mode, setMode] = useState<'playback' | 'recording'>('playback');

  const setPlaybackMode = useCallback(async () => {
    await Audio.setAudioModeAsync(playbackMode);
    setMode('playback');
  }, []);

  const setRecordingMode = useCallback(async () => {
    await Audio.setAudioModeAsync(recordingMode);
    setMode('recording');
  }, []);

  const resetAudioMode = useCallback(async () => {
    await Audio.setAudioModeAsync(playbackMode);
    await new Promise(resolve => setTimeout(resolve, 200));
    await Audio.setAudioModeAsync(recordingMode);
    setMode('recording');
  }, []);

  return {
    mode,
    setPlaybackMode,
    setRecordingMode,
    resetAudioMode,
  };
};