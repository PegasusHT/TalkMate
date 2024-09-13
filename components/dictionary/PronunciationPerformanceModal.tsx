import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, Pressable, Alert } from 'react-native';
import { Ear } from 'lucide-react-native';
import { Audio, AVPlaybackStatus } from 'expo-av';
import { useAudioMode } from '@/hooks/useAudioMode';

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

interface PronunciationPerformanceModalProps {
  isVisible: boolean;
  onClose: () => void;
  performanceData: PerformanceData;
  onTryAgain: () => void;
}

const PronunciationPerformanceModal: React.FC<PronunciationPerformanceModalProps> = ({
  isVisible,
  onClose,
  performanceData,
  onTryAgain,
}) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const { mode, setPlaybackMode, setRecordingMode } = useAudioMode();

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const getColorForAccuracy = (accuracy: number | undefined) => {
    if (accuracy === undefined) return 'text-gray-500';
    if (accuracy >= 80) return 'text-green-500';
    if (accuracy >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const onPlaybackStatusUpdate = useCallback((status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      if (status.didJustFinish) {
        setIsPlaying(false);
      }
    }
  }, []);

  const playRecordedAudio = useCallback(async () => {
    if (performanceData.audio_uri) {
      try {
        if (sound) {
          if (isPlaying) {
            await sound.stopAsync();
            setIsPlaying(false);
          } else {
            await setPlaybackMode();
            await sound.playFromPositionAsync(0);
            setIsPlaying(true);
          }
        } else {
          const { sound: newSound } = await Audio.Sound.createAsync(
            { uri: performanceData.audio_uri },
            { shouldPlay: true },
            onPlaybackStatusUpdate
          );
          setSound(newSound);
          setIsPlaying(true);
        }
      } catch (error) {
        console.error('Error playing audio:', error);
        Alert.alert('Error', 'Failed to play the recorded audio. Please try again.');
        setIsPlaying(false);
        if (sound) {
          await sound.unloadAsync();
          setSound(null);
        }
      }
    } else {
      console.log('No audio URI available');
      Alert.alert('Error', 'No recorded audio available to play.');
    }
  }, [performanceData.audio_uri, sound, isPlaying, onPlaybackStatusUpdate]);

  const handleCloseModal = useCallback(() => {
    if (sound) {
      sound.stopAsync().then(() => {
        sound.unloadAsync();
        setSound(null);
      });
    }
    setIsPlaying(false);
    onClose();
  }, [sound, onClose]);

  const handleTryAgain = useCallback(() => {
    if (sound) {
      sound.stopAsync().then(() => {
        sound.unloadAsync();
        setSound(null);
      });
    }
    setIsPlaying(false);
    onTryAgain();
  }, [sound, onTryAgain]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={handleCloseModal}
    >
      <View className="flex-1 justify-end">
        <Pressable className="flex-1" onPress={handleCloseModal} />
        <View className="bg-slate-200 rounded-t-3xl p-6" style={{ height: '60%' }}>
          <TouchableOpacity 
            onPress={playRecordedAudio} 
            className={`absolute right-4 top-4 rounded-full p-2 z-10 ${isPlaying ? 'bg-red-300' : 'bg-blue-500'}`}
          >
            <Ear color={isPlaying ? "black" : "white"} size={24} />
          </TouchableOpacity>
          <ScrollView className="flex-1 mb-4">
            <Text className="text-lg mb-2">
              Overall Accuracy:{' '}
              <Text className={getColorForAccuracy(performanceData.pronunciation_accuracy)}>
                {performanceData.pronunciation_accuracy !== undefined 
                  ? `${performanceData.pronunciation_accuracy.toFixed(2)}%`
                  : 'N/A'}
              </Text>
            </Text>
            <Text className="text-lg font-semibold mb-2">Word Accuracies:</Text>
            {
              performanceData.real_and_transcribed_words && performanceData.real_and_transcribed_words.length > 0 ? (
                performanceData.real_and_transcribed_words.map((word, index) => (
                  <View key={index} className="mb-4">
                    <Text>
                      <Text className="font-bold">{word[0]}</Text> 
                      {performanceData.real_words_phonetic[index] && `(/${performanceData.real_words_phonetic[index]}/)`}:{' '}
                      <Text className={getColorForAccuracy(performanceData.current_words_pronunciation_accuracy[index])}>
                        {performanceData.current_words_pronunciation_accuracy[index] !== undefined
                          ? `${performanceData.current_words_pronunciation_accuracy[index].toFixed(2)}%`
                          : 'N/A'}
                      </Text>
                    </Text>
                    <Text>
                      Transcribed as: <Text className="font-bold">{word[1] || 'Not detected'}</Text> 
                      {word[1] !== '-' && performanceData.recorded_words_phonetic[index] && 
                        ` (/${performanceData.recorded_words_phonetic[index]}/)`}
                    </Text>
                    {performanceData.current_words_pronunciation_accuracy[index] !== undefined &&
                     performanceData.current_words_pronunciation_accuracy[index] < 80 && (
                      <Text className="text-red-500">
                        Mispronounced: Expected /{performanceData.real_words_phonetic[index] || 'N/A'}/, 
                        heard /{performanceData.recorded_words_phonetic[index] || 'N/A'}/
                      </Text>
                    )}
                  </View>
                ))
              ) : (
                <Text>No transcription available</Text>
              )}
            <Text className="text-lg font-semibold mt-4 mb-2">Your Transcription:</Text>
            <Text>{performanceData.recording_transcript || 'No transcription available'}</Text>
          </ScrollView>
          <TouchableOpacity
            onPress={handleTryAgain}
            className="bg-theme-500 p-4 rounded-full mt-4 mb-8"
          >
            <Text className="text-white text-center font-bold">Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default PronunciationPerformanceModal;