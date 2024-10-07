import React from 'react';
import { View, Modal, TouchableOpacity, ScrollView } from 'react-native';
import Text from '@/components/customText';
import { X, Volume2, Mic, Snail } from 'lucide-react-native';
import { primaryColor } from '@/constant/color';
import HalfCircularProgress from './utils/HalfCircularProgress';

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
            <TouchableOpacity className="border-[0.4px] p-3 rounded-full">
              <Volume2 color="black" size={24} />
            </TouchableOpacity>
            <TouchableOpacity className="border-[0.4px] p-3 rounded-full">
              <Snail color="black" size={24} />
            </TouchableOpacity>
          </View>
          
          <ScrollView className='h-full'>
            {phoneticDetails.map((detail, index) => (
              <View key={index} className="flex-row justify-between items-center mb-4 mt-4">
                <View className="flex-row items-center  border-r-[0.4px] w-2/5">
                  <TouchableOpacity className="bg-gray-200 p-2 rounded-full mr-2">
                    <Volume2 color="#000" size={20} />
                  </TouchableOpacity>
                  <Text className="text-xl">{detail.phonetic}</Text>
                </View>
                <View className='w-full px-4'>
                  <Text className={`text-lg ${getColorForAccuracy(detail.score)}`}>
                    {detail.score}% {getPerformanceText(detail.score)}
                  </Text>
                  {detail.userSaid && <Text className="text-sm text-gray-500">You said: {detail.userSaid}</Text>}
                </View>
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