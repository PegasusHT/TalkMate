import React, { useState, useEffect, useCallback } from 'react';
import { View, Modal, TouchableOpacity, ScrollView, Pressable, Alert } from 'react-native';
import Text from '@/components/customText';
import { Ear, LightbulbIcon } from 'lucide-react-native';
import { Audio, AVPlaybackStatus } from 'expo-av';
import { useAudioMode } from '@/hooks/Audio/useAudioMode';
import { primaryColor } from '@/constant/color';
import Svg, { Circle } from 'react-native-svg';
import CircularProgress from './utils/CircularProgress'

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
  const pronunciation_accuracy = performanceData.pronunciation_accuracy.toFixed(0);

  const getPerformanceDetails = useCallback((score: number) => {
    if (score >= 80) return { emoji: '😄', text: 'Excellent!', color: '#22c55e' };
    if (score >= 60) return { emoji: '🙂', text: 'Almost Correct', color: '#eab308' };
    return { emoji: '😕', text: 'Keep Practicing', color: '#ef4444' };
  }, []);

  const { emoji, text, color } = getPerformanceDetails(performanceData.pronunciation_accuracy);

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const getColorForAccuracy = (accuracy: number | undefined) => {
    if (accuracy === undefined) return 'text-gray-500';
    if (accuracy >= 80) return 'text-green-600';
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
      <View className="bg-white border-[1px] rounded-t-3xl p-4 pt-6" style={{ height: '52%' }}>
        <View className="flex-row border-b-[0.17px] pb-4 items-center justify-between">
          <View className="flex-row items-center">
            <Text className="text-5xl pt-2 mr-2">{emoji}</Text>
            <Text style={{ color }} className="text-2xl ml-2 font-NunitoBold">{text}</Text>
          </View>
          <TouchableOpacity 
            onPress={playRecordedAudio} 
            className="rounded-full p-2 z-10"
          >
            <Ear color={isPlaying ? 'red' : primaryColor} size={28} />
          </TouchableOpacity>
        </View>

        <View className="mb-6 flex-1">
          <View className="w-full rounded-2xl mt-4 bg-primary-100 py-4 px-2">
            <View className='flex flex-row w-full items-center justify-between'>
              <Text className='text-lg flex-1 mr-4'>
                <Text className=''>Sound </Text>
                <Text className="font-NunitoBold" style={{ color }}>
                  {performanceData.pronunciation_accuracy !== undefined 
                    ? `${performanceData.pronunciation_accuracy.toFixed(0)}%`
                    : 'N/A'}
                </Text>
                <Text className=''> like a native speaker.</Text>
              </Text>
              <CircularProgress 
                size={60} 
                strokeWidth={6} 
                progress={parseInt(performanceData.pronunciation_accuracy.toFixed(0))} 
              />
            </View>

            <View className='bg-slate-200 w-full rounded-xl p-3 mt-6 flex flex-row items-center'>
              <LightbulbIcon className='mr-2' color="#666" />
              <Text className='text-lg flex-1'>
                Tap on each word for detailed feedback
              </Text>
            </View>
          </View>
        </View>
          
        <TouchableOpacity
          onPress={handleTryAgain}
          className="bg-primary-500 p-4 rounded-full mt-4"
        >
          <Text className="text-white text-xl text-center font-NunitoSemiBold">Try again!</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleTryNewWord}
          className="bg-white border-[1px] p-4 rounded-full mt-4 mb-8"
        >
          <Text className="text-center text-xl font-NunitoSemiBold">Try new word</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
  );
};

export default PronunciationPerformanceModal;