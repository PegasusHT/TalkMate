//path: components/dictionary/PronunciationPractice.tsx
import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
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

type PhoneticWord = {
  word: string;
  accuracy?: number;
};

type PronunciationPracticeProp= {
    sentence: string
}

const PronunciationPractice: React.FC<PronunciationPracticeProp> = ({sentence}) => {
  const route = useRoute<PronunciationPracticeRouteProp>();
  const navigation = useNavigation();
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [performanceResult, setPerformanceResult] = useState<PerformanceData | null>(null);
  const [showPerformanceModal, setShowPerformanceModal] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [phoneticWords, setPhoneticWords] = useState<PhoneticWord[]>([]);
  const recordingObject = React.useRef<Audio.Recording | null>(null);

  useEffect(() => {
    fetchPhonetic();
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sentence]);

  const fetchPhonetic = async () => {
    try {
      const formData = new FormData();
      formData.append('text', sentence);

      const response = await fetch(`${AI_BACKEND_URL}/get_phonetic/`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result && result.phonetic) {
        const words = result.phonetic.split(' ');
        setPhoneticWords(words.map((word: string) => ({ word })));
      }
    } catch (error) {
      console.error('Failed to fetch phonetic', error);
      Alert.alert('Error', 'Failed to fetch phonetic transcription. Please try again.');
    }
  };

  const getColorForAccuracy = (accuracy: number | undefined) => {
    if (accuracy === undefined) return 'text-gray-600';
    if (accuracy >= 80) return 'text-green-500';
    if (accuracy >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const playSound = async (rate: number = 1.0) => {
    if (sound) {
      await sound.playAsync();
      setIsPlaying(true);
    } else {
      try {
        // Create a FormData object to send the text
        const formData = new FormData();
        formData.append('text', sentence);
  
        // Make a POST request to the TTS endpoint
        const response = await fetch(`${AI_BACKEND_URL}/tts/`, {
          method: 'POST',
          body: formData,
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
        const audioBase64 = data.audio;
  
        // Create a data URI for the audio
        const audioUri = `data:audio/mp3;base64,${audioBase64}`;
  
        // Create and play the sound
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: audioUri },
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
            updatePhoneticAccuracy(result.current_words_pronunciation_accuracy);
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

  const updatePhoneticAccuracy = (accuracies: number[]) => {
    setPhoneticWords(prevWords => 
      prevWords.map((word, index) => ({
        ...word,
        accuracy: accuracies[index]
      }))
    );
  };

  const handleTryAgain = () => {
    setShowPerformanceModal(false);
    setPerformanceResult(null);
    setPhoneticWords(prevWords => prevWords.map(word => ({ word: word.word })));
  };

  return (
    <View className="flex-1 bg-white p-6 justify-between">
      <View className="flex-1 justify-start">
        <Text className="text-2xl font-bold mb-2 mt-4">{sentence}</Text>
        <View className="flex-row flex-wrap mb-4">
          {phoneticWords.map((phoneticWord, index) => (
            <Text 
              key={index} 
              className={`text-lg mr-1 ${getColorForAccuracy(phoneticWord.accuracy)}`}
            >
              {phoneticWord.word}
            </Text>
          ))}
        </View>
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