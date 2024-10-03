import { useState, useEffect, useCallback } from 'react';
import { Audio } from 'expo-av';

export const useAudioRecordingManager = () => {
  const [recordingObject, setRecordingObject] = useState<Audio.Recording | null>(null);
  const [isAudioSessionPrepared, setIsAudioSessionPrepared] = useState(false);

  const prepareAudioSession = useCallback(async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      setIsAudioSessionPrepared(true);
    } catch (error) {
      console.error('Error preparing audio session:', error);
    }
  }, []);

  useEffect(() => {
    prepareAudioSession();
  }, [prepareAudioSession]);

  const startRecording = useCallback(async () => {
    try {
      if (!isAudioSessionPrepared) {
        await prepareAudioSession();
      }
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecordingObject(recording);
    } catch (error) {
      console.error('Failed to start recording', error);
    }
  }, [isAudioSessionPrepared, prepareAudioSession]);

  const stopRecording = useCallback(async () => {
    if (!recordingObject) return;
    try {
      await recordingObject.stopAndUnloadAsync();
      const uri = recordingObject.getURI();
      setRecordingObject(null);
      return uri;
    } catch (error) {
      console.error('Failed to stop recording', error);
    }
  }, [recordingObject]);

  return {
    startRecording,
    stopRecording,
    isAudioSessionPrepared,
  };
};