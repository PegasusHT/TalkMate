import React, { useState, useEffect, useCallback } from 'react';
import { View, Modal, TouchableOpacity, ScrollView, Pressable, Alert } from 'react-native';
import Text from '@/components/customText';
import { Ear } from 'lucide-react-native';
import { Audio, AVPlaybackStatus } from 'expo-av';
import { useAudioMode } from '@/hooks/Audio/useAudioMode';

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
  
  const getPerformanceDetails = useCallback((score: number) => {
    if (score >= 80) return { emoji: '😄', text: 'Excellent!' };
    if (score >= 60) return { emoji: '🙂', text: 'Almost Correct' };
    return { emoji: '😕', text: 'Keep Practicing' };
  }, []);

  const { emoji, text } = getPerformanceDetails(performanceData.pronunciation_accuracy);

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

  const handleTryNewWord = useCallback(() => {
    console.log('pressed')
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
        <View className="bg-white border-[1px] rounded-t-3xl p-6" style={{ height: '48%' }}>
          <View className="flex-row items-center">
              <Text className="text-4xl mr-2">{emoji}</Text>
              <Text className="text-xl font-NunitoBold">{text}</Text>
            </View>
          <TouchableOpacity 
            onPress={playRecordedAudio} 
            className={`absolute right-4 top-4 rounded-full p-2 z-10 ${isPlaying ? 'bg-red-300' : 'bg-primary-500'}`}
          >
            <Ear color={isPlaying ? "black" : "white"} size={24} />
          </TouchableOpacity>

          <View className="mb-6 ">
            <View className="w-full h-16 rounded-full mt-12 bg-primary-100 items-start justify-center">
              <Text className='text-lg'>
                <Text className=''>You sound </Text>
                <Text className="text-lg font-NunitoSemiBold ">
                  {performanceData.pronunciation_accuracy !== undefined 
                    ? `${performanceData.pronunciation_accuracy.toFixed(0)}%`
                    : 'N/A'}
                </Text>
                <Text className=''> like a native speaker</Text>
              </Text>
             
            </View>
          </View>
            
          <TouchableOpacity
            onPress={handleTryAgain}
            className="bg-orange-400 p-4 rounded-full mt-4"
          >
            <Text className="text-white text-lg text-center font-NunitoSemiBold">Try Again</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleTryNewWord}
            className="bg-white border-[1px] p-4 rounded-full mt-4 mb-32"
          >
            <Text className=" text-center text-lg font-NunitoSemiBold">Try new word</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default PronunciationPerformanceModal;