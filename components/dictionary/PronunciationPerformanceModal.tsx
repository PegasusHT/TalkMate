import React, { useState, useEffect, useCallback } from 'react';
import { View, Modal, TouchableOpacity, ScrollView, Pressable, Alert } from 'react-native';
import Text from '@/components/customText';
import { Ear, LightbulbIcon } from 'lucide-react-native';
import { Audio, AVPlaybackStatus } from 'expo-av';
import { useAudioMode } from '@/hooks/Audio/useAudioMode';
import { primaryColor } from '@/constant/color';
import Svg, { Circle } from 'react-native-svg';
import CircularProgress from './utils/CircularProgress'
import { useNavigation } from 'expo-router';
import ResponsiveIcon from '../customUtils/responsiveIcon';

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
  setShowUnderline: React.Dispatch<React.SetStateAction<boolean>>;
  onTryNewWord: () => void;
}

export const getColorForAccuracy = (accuracy: number | undefined) => {
  if (accuracy === undefined) return 'text-black';
  if (accuracy >= 80) return 'text-green-600';
  if (accuracy >= 60) return 'text-orange-400';
  return 'text-red-500';
};

const PronunciationPerformanceModal: React.FC<PronunciationPerformanceModalProps> = ({
  isVisible,
  onClose,
  performanceData,
  onTryAgain,
  setShowUnderline,
  onTryNewWord
}) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const { mode, setPlaybackMode, setRecordingMode } = useAudioMode();
  const pronunciation_accuracy = performanceData.pronunciation_accuracy.toFixed(0);
  const navigation = useNavigation();

  const getPerformanceDetails = useCallback((score: number) => {
    if (score >= 80) return { emoji: '😄', text: 'Excellent!', color: '#20ae59' };
    if (score >= 60) return { emoji: '🙂', text: 'Almost Correct', color: '#FB923C' };
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
    setShowUnderline(false);
    onTryAgain();
  }, [sound, onTryAgain]);

  const handleTryNewWord = useCallback(() => {
    if (sound) {
      sound.stopAsync().then(() => {
        sound.unloadAsync();
        setSound(null);
      });
    }
    setIsPlaying(false);
    setShowUnderline(false);
    onTryNewWord();  
  }, [sound, setShowUnderline, onTryNewWord]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={handleCloseModal}
    >
     <View className="flex-1 justify-end">
      <Pressable className="flex-1" onPress={handleCloseModal} />
      <View 
          className="bg-white rounded-t-3xl p-4 lg:p-8 pt-6 lg:pt-10" 
          style={{ 
            height: '52%',
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: -2,
            },
            shadowOpacity: 0.15,
            shadowRadius: 4.65,
            elevation: 6,
          }}
        >
        <View className="flex-row border-b-[0.17px] lg:border-b-[1.17px] pb-4 items-center justify-between">
          <View className="flex-row items-center">
            <Text className="text-5xl lg:text-7xl pt-2 mr-2">{emoji}</Text>
            <Text style={{ color }} className="text-2xl lg:text-4xl ml-2 font-NunitoBold">{text}</Text>
          </View>
          <TouchableOpacity 
            onPress={playRecordedAudio} 
            className="rounded-full p-2 z-10 top-[-4]"
          >
            <ResponsiveIcon
              icon={{ type: 'lucide', icon: Ear }}
              responsiveSize={{
                sm: 28,
                md: 28,
                lg: 56,
              }}
              color={isPlaying ? 'red' : primaryColor} 
            />
          </TouchableOpacity>
        </View>

        <View className="mb-6 flex-1">
          <View className="w-full rounded-2xl mt-2 bg-primary-100 py-4 lg:py-8 px-2 lg:px-4">
            <View className='flex flex-row w-full items-center justify-between'>
              <Text className='text-lg lg:text-3xl flex-1 mr-4'>
                <Text className=''>Sound </Text>
                <Text className="font-NunitoBold" >
                  {performanceData.pronunciation_accuracy !== undefined 
                    ? `${performanceData.pronunciation_accuracy.toFixed(0)}%`
                    : 'N/A'}
                </Text>
                <Text className='text-lg lg:text-3xl'> like a native speaker.</Text>
              </Text>
              <CircularProgress 
                progress={parseInt(performanceData.pronunciation_accuracy.toFixed(0))} 
              />
            </View>

            <View className='bg-[#FEF1E1] w-full rounded-xl p-3 lg:p-6 mt-6 lg:mt-12 flex flex-row items-center'>
              <ResponsiveIcon
                icon={{ type: 'lucide', icon: LightbulbIcon }}
                responsiveSize={{
                  sm: 18,
                  md: 18,
                  lg: 36,
                }}
                color="#F7941F"
                className='mr-2'
              />
              <Text className='text-lg lg:text-3xl flex-1 text-[#F7941F]'>
                Tap on each word for detailed feedback
              </Text>
            </View>
          </View>
        </View>
          
        <TouchableOpacity
          onPress={handleTryAgain}
          className="bg-primary-500 p-4 lg:p-6 rounded-full mt-4 lg:mx-2"
        >
          <Text className="text-white text-xl lg:text-3xl text-center font-NunitoSemiBold">Try again!</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleTryNewWord}
          className="bg-white border-[1px] p-4 lg:p-6 rounded-full mt-4 mb-10 lg:mx-2"
        >
          <Text className="text-center text-xl lg:text-3xl font-NunitoSemiBold">Try new word</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
  );
};

export default PronunciationPerformanceModal;