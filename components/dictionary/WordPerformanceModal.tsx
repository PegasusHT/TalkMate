import React, { useState, useCallback } from 'react';
import { View, Modal, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import Text from '@/components/customText';
import { X, Volume2, Mic, Snail } from 'lucide-react-native';
import { primaryColor } from '@/constant/color';
import HalfCircularProgress from './utils/HalfCircularProgress';
import { Audio } from 'expo-av';
import axios from 'axios';
import ENV from '@/utils/envConfig';

interface WordPerformanceModalProps {
  isVisible: boolean;
  onClose: () => void;
  word: string;
  phonetic: string;
  score: number;
  phoneticDetails: Array<{
    phonetic: string;
    score: number;
    userSaid?: string;
  }>;
}

const WordPerformanceModal: React.FC<WordPerformanceModalProps> = ({
  isVisible,
  onClose,
  word,
  phonetic,
  score,
  phoneticDetails,
}) => {
  const [isPlayingWord, setIsPlayingWord] = useState(false);
  const [isPlayingSlowWord, setIsPlayingSlowWord] = useState(false);
  const [playingPhoneticIndex, setPlayingPhoneticIndex] = useState<number | null>(null);
  const intScore = parseInt(score.toFixed(0));

  const getPerformanceText = (score: number) => {
    if (score >= 80) return 'Awesome!';
    if (score >= 60) return 'You said ';
    return 'You said ';
  };

  const getColorForAccuracy = (accuracy: number | undefined) => {
    if (accuracy === undefined) return 'text-black';
    if (accuracy >= 80) return 'text-green-600';
    if (accuracy >= 60) return 'text-orange-400';
    return 'text-red-500';
  };

  const getProgressColor = (accuracy: number) => {
    if (accuracy >= 80) return '#16a34a'; // Tailwind's green-600
    if (accuracy >= 60) return '#fb923c'; // Tailwind's orange-400
    return '#ef4444'; // Tailwind's red-500
  };

  const playAudio = useCallback(async (text: string, rate: number = 1) => {
    try {
      const response = await axios.post(
        `${ENV.AI_BACKEND_URL}/tts/`,
        { text, speaker: 'p240' },
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );

      const { audio } = response.data;
      const audioUri = `data:audio/mp3;base64,${audio}`;
      const soundObject = new Audio.Sound();
      await soundObject.loadAsync({ uri: audioUri });
      await soundObject.setRateAsync(rate, true);
      await soundObject.playAsync();

      soundObject.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && !status.isPlaying) {
          setIsPlayingWord(false);
          setIsPlayingSlowWord(false);
          setPlayingPhoneticIndex(null);
        }
      });
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  }, []);

  const handlePlayWord = useCallback(() => {
    setIsPlayingWord(true);
    playAudio(word);
  }, [word, playAudio]);

  const handlePlaySlowWord = useCallback(() => {
    setIsPlayingSlowWord(true);
    playAudio(word, 0.75);
  }, [word, playAudio]);

  const handlePlayPhonetic = useCallback((phoneticText: string, index: number) => {
    setPlayingPhoneticIndex(index);
    playAudio(phoneticText);
  }, [playAudio]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View className="flex-1 w-screen justify-end">
        <View className="bg-white border-[1px] rounded-t-3xl p-4 pt-6 border-t-[1.8px]" style={{ height: '80%' }}>
          <TouchableOpacity onPress={onClose} className="absolute right-6 top-5 rounded-full border-[1.2px] p-2 z-10">
            <X size={24} color="#000" />
          </TouchableOpacity>
          
          <View className="items-center mb-4 mt-2">
            <HalfCircularProgress 
              size={150} 
              strokeWidth={10} 
              progress={intScore} 
              progressColor={getProgressColor(intScore)}
            />
            <Text className="text-4xl font-bold mt-4">{word}</Text>
            <Text className="text-xl">/{phonetic}/</Text>
          </View>
          
          <View className="flex-row justify-center space-x-4 mb-4">
            <TouchableOpacity 
              className="border-[0.4px] p-3 rounded-full" 
              onPress={handlePlayWord}
              disabled={isPlayingWord || isPlayingSlowWord}
            >
              {isPlayingWord ? (
                <ActivityIndicator color="black" size="small" />
              ) : (
                <Volume2 color="black" size={24} />
              )}
            </TouchableOpacity>
            <TouchableOpacity 
              className="border-[0.4px] p-3 rounded-full"
              onPress={handlePlaySlowWord}
              disabled={isPlayingWord || isPlayingSlowWord}
            >
              {isPlayingSlowWord ? (
                <ActivityIndicator color="black" size="small" />
              ) : (
                <Snail color="black" size={24} />
              )}
            </TouchableOpacity>
          </View>
          
          <ScrollView className='h-full mt-4'>
            {phoneticDetails.map((detail, index) => (
              <View key={index} className="flex-row border-b-[0.4px] justify-between items-center mb-4 pb-4 mt-4">
                <View className="flex-row items-center w-3/7">
                  <TouchableOpacity 
                    className="bg-gray-200 p-2 rounded-full mr-2"
                    onPress={() => handlePlayPhonetic(detail.phonetic, index)}
                    disabled={playingPhoneticIndex !== null}
                  >
                    {playingPhoneticIndex === index ? (
                      <ActivityIndicator color="black" size="small" />
                    ) : (
                      <Volume2 color="#000" size={20} />
                    )}
                  </TouchableOpacity>
                  <Text className="text-xl">{detail.phonetic}</Text>
                </View>
                <Text className='w-full text-lg flex flex-row px-4'>
                  <Text className={`${getColorForAccuracy(intScore)}`}>
                    {intScore}% {getPerformanceText(intScore)}
                  </Text>
                {intScore < 80 && detail.userSaid && (
                    <Text className="text-sm text-gray-500 font-NunitoSemiBold">
                    /{detail.userSaid}/
                    </Text>
                )}
                </Text>
              </View>
            ))}
          </ScrollView>
          
          <TouchableOpacity onPress={onClose} className="bg-primary-500 p-4 rounded-full mt-4 mb-6">
            <Text className="text-white text-center font-bold text-lg">Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default WordPerformanceModal;