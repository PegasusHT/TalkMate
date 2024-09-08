import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Mic, Volume2, VolumeX, Snail } from 'lucide-react-native';
import { Audio } from 'expo-av';
import Constants from 'expo-constants';
import * as FileSystem from 'expo-file-system';
import PronunciationPerformanceModal from '@/components/dictionary/PronunciationPerformanceModal';

const AI_BACKEND_URL = Constants.expoConfig?.extra?.AI_BACKEND_URL?.dev || '';

type RootStackParamList = {
  'pronunciation-practice': { sentence: string };
};

type PronunciationPracticeRouteProp = RouteProp<RootStackParamList, 'pronunciation-practice'>;

type PerformanceData = {
  recording_transcript: string;
  real_and_transcribed_words: [string, string][];
  real_and_transcribed_words_ipa: [string, string][];
  pronunciation_accuracy: number;
  current_words_pronunciation_accuracy: number[];
  pronunciation_categories: number[];
  real_words_phonetic: string[];
  recorded_words_phonetic: string[];
  audio_uri?: string;
};

const PronunciationPractice: React.FC = () => {
  const route = useRoute<PronunciationPracticeRouteProp>();
  const { sentence } = route.params;
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [performanceResult, setPerformanceResult] = useState<PerformanceData | null>(null);
  const [showPerformanceModal, setShowPerformanceModal] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const recordingObject = React.useRef<Audio.Recording | null>(null);

  const playSound = async (rate: number = 1.0) => {
    if (sound) {
      await sound.playAsync();
      setIsPlaying(true);
    } else {
      try {
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: `${AI_BACKEND_URL}/tts/?text=${encodeURIComponent(sentence)}` },
          { shouldPlay: true, rate }
        );
        setSound(newSound);
        setIsPlaying(true);
        newSound.setOnPlaybackStatusUpdate((status) => {
          if ('didJustFinish' in status && status.didJustFinish) {
            setIsPlaying(false);
          }
        });
      } catch (error) {
        console.error('Error playing sound:', error);
        Alert.alert('Error', 'Failed to play the sentence. Please try again.');
      }
    }
  };

  const stopSound = async () => {
    if (sound) {
      await sound.stopAsync();
      setIsPlaying(false);
    }
  };

  const handleMicPress = useCallback(async () => {
    if (isRecording) {
      setIsRecording(false);
      setIsProcessing(true);
      try {
        await recordingObject.current?.stopAndUnloadAsync();
        const uri = recordingObject.current?.getURI();
        if (!uri) throw new Error('No recording URI found');
  
        const base64Audio = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
  
        const formData = new FormData();
        formData.append('title', sentence);
        formData.append('base64Audio', `data:audio/m4a;base64,${base64Audio}`);
  
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);
  
        const response = await fetch(`${AI_BACKEND_URL}/assess_pronunciation/`, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data',
          },
          signal: controller.signal,
        });
  
        clearTimeout(timeoutId);
  
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Server response:', response.status, errorText);
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }
  
        let result = await response.json();
        
        // Check if the result is a string (double-encoded JSON)
        if (typeof result === 'string') {
          try {
            result = JSON.parse(result);
          } catch (parseError) {
            console.error('Failed to parse double-encoded JSON:', parseError);
          }
        }      
        
        if (result && typeof result === 'object' && 'recording_transcript' in result) {
          if (!result.recording_transcript || result.recording_transcript.trim() === '') {
            Alert.alert('Warning', 'No speech detected. Please try speaking louder or move to a quieter environment.');
          } else {
            setPerformanceResult({ ...result, audio_uri: uri });
            setShowPerformanceModal(true);
          }
        } else {
          throw new Error('Unexpected response format from the server');
        }
      } catch (error) {
        console.error('Failed to process audio', error);
        if (error instanceof Error) {
          console.error('Error message:', error.message);
        }
        Alert.alert('Error', 'Failed to process your pronunciation. Please try again.');
      } finally {
        setIsProcessing(false);
      }
    } else {
      try {
        await Audio.requestPermissionsAsync();
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
        const { recording } = await Audio.Recording.createAsync(
          Audio.RecordingOptionsPresets.HIGH_QUALITY
        );
        recordingObject.current = recording;
        setIsRecording(true);
      } catch (error) {
        console.error('Failed to start recording', error);
        Alert.alert('Error', 'Failed to start recording. Please check your microphone permissions.');
      }
    }
  }, [isRecording, sentence]);

  const handleTryAgain = () => {
    setShowPerformanceModal(false);
    setPerformanceResult(null);
  };

  return (
    <View className="flex-1 bg-white p-6 justify-between">
      <View className="flex-1 justify-start">
        <Text className="text-2xl font-bold mb-4 mt-4">{sentence}</Text>
        <View className="flex-row justify-start space-x-4 mb-8">
          <TouchableOpacity onPress={() => playSound()} disabled={isPlaying}>
            <Volume2 color={isPlaying ? "gray" : "black"} size={24} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => playSound(0.5)} disabled={isPlaying}>
            <Snail color={isPlaying ? "gray" : "black"} size={24} />
          </TouchableOpacity>
          {isPlaying && (
            <TouchableOpacity onPress={stopSound}>
              <VolumeX color="black" size={24} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <TouchableOpacity
        onPress={handleMicPress}
        disabled={isProcessing}
        className={`self-center p-6 rounded-full ${
          isRecording ? 'bg-red-500' : isProcessing ? 'bg-gray-500' : 'bg-blue-500'
        }`}
      >
        {isProcessing ? (
          <ActivityIndicator color="white" />
        ) : (
          <Mic color="white" size={32} />
        )}
      </TouchableOpacity>
      {performanceResult && (
        <PronunciationPerformanceModal
          isVisible={showPerformanceModal}
          onClose={() => setShowPerformanceModal(false)}
          performanceData={performanceResult}
          onTryAgain={handleTryAgain}
        />
      )}
    </View>
  );
};

export default PronunciationPractice;