//hooks/pronunciation/usePronunRecording.tsx
import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import ENV from '@/utils/envConfig';
import { useRecordingManager } from '@/hooks/Audio/useRecordingManger';
import { useAudioMode } from '@/hooks/Audio/useAudioMode';

export const usePronunciationRecording = (
  sentence: string,
  isScreenActive: boolean,
  updatePhoneticAccuracy: (accuracies: number[]) => void,
  setPerformanceResult: (result: any) => void,
  setShowPerformanceModal: (show: boolean) => void
) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { startRecording, stopRecording } = useRecordingManager();
  const { setRecordingMode } = useAudioMode();

  const handleMicPress = useCallback(async () => {
    if (!isScreenActive) return;

    if (isRecording) {
      setIsRecording(false);
      setIsProcessing(true);
      try {
        await setRecordingMode();
        const uri = await stopRecording();
        if (!uri) throw new Error('No recording URI found');

        const base64Audio = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        const formData = new FormData();
        formData.append('title', sentence);
        formData.append('base64Audio', `data:audio/m4a;base64,${base64Audio}`);

        const response = await fetch(`${ENV.AI_BACKEND_URL}/assess_pronunciation/`, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data',
          },
        });

        if (!isScreenActive) return;

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        let result = await response.json();
        
        if (typeof result === 'string') {
          try {
            result = JSON.parse(result);
          } catch (parseError) {
            console.log('Failed to parse double-encoded JSON:', parseError);
          }
        }

        if (result && typeof result === 'object' && 'recording_transcript' in result) {
          if (!result.recording_transcript || result.recording_transcript.trim() === '') {
            Alert.alert('Warning', 'No speech detected. Please try speaking louder or move to a quieter environment.');
          } else {
            setPerformanceResult({ ...result, audio_uri: uri });
            setShowPerformanceModal(true);
            if (Array.isArray(result.current_words_pronunciation_accuracy)) {
              updatePhoneticAccuracy(result.current_words_pronunciation_accuracy);
            } else {
              console.log('Unexpected accuracy format:', result.current_words_pronunciation_accuracy);
            }
          }
        } else {
          console.log('Unexpected server response:', result);
          throw new Error('Unexpected response format from the server');
        }
      } catch (error) {
        console.log('Error processing recording:', error);
        if (isScreenActive) {
          Alert.alert('Error', 'Failed to process your pronunciation. Please try again.');
        }
      } finally {
        setIsProcessing(false);
      }
    } else {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
        await startRecording();
        setIsRecording(true);
      } catch (error) {
        console.log('Failed to start recording', error);
        if (isScreenActive) {
          Alert.alert('Error', 'Failed to start recording. Please check your microphone permissions.');
        }
      }
    }
  }, [isScreenActive, isRecording, sentence, startRecording, stopRecording, setRecordingMode, updatePhoneticAccuracy, setPerformanceResult, setShowPerformanceModal]);

  return { isRecording, isProcessing, handleMicPress };
};