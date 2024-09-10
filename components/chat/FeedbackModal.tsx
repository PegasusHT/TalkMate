import React from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { ChatMessage } from '@/types/chat';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  'pronunciation-practice': { sentence: string };
};

type FeedbackModalProps = {
  isVisible: boolean;
  onClose: () => void;
  feedback: ChatMessage['feedback'];
  originalMessage: string;
};

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isVisible, onClose, feedback, originalMessage }) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  if (!feedback) return null;

  const handlePracticePronunciation = () => {
    onClose();
    navigation.navigate('pronunciation-practice', { 
      sentence: feedback.correctedVersion 
    });
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        className="flex-1 justify-end" 
        onPress={onClose} 
      >
        <View className="justify-end p-5 h-[74%] bg-slate-300 bg-opacity-50 pb-6">
          <View className="bg-white h-full rounded-t-3xl p-6">
            <View className="w-12 h-1 bg-gray-300 rounded-full self-center mb-4" />
            <View className="bg-yellow-100 rounded-lg p-4 mb-4">
              <Text className="font-semibold mb-2">Your message</Text>
              <Text>{originalMessage}</Text>
            </View>
            <View className="bg-green-100 rounded-lg p-4 mb-4">
              <Text className="font-semibold mb-2">Improved message</Text>
              <Text>{feedback.correctedVersion}</Text>
            </View>
            <View className="bg-orange-100 rounded-lg p-4 mb-4 pb-8">
              <Text className="font-semibold mb-2">Explanation</Text>
              <Text>{feedback.explanation}</Text>
            </View>
            <View className='flex-1'/>
            <TouchableOpacity onPress={handlePracticePronunciation} className="bg-blue-500 p-4 rounded-full flex-row justify-center items-center">
              <Text className="text-white text-center font-bold mr-2">
                Practice pronunciation
              </Text>
              <ChevronRight color="white" size={20} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default FeedbackModal;