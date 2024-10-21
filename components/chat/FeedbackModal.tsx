import React from 'react';
import { View, Modal, TouchableOpacity } from 'react-native';
import Text from '@/components/customText';
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
    let practiceSentence = feedback.correctedVersion;
    
    if (practiceSentence.length > 300) {
      practiceSentence = practiceSentence.substring(0, 297) + '...';
    }

    navigation.navigate('pronunciation-practice', { 
      sentence: practiceSentence 
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
        <View className="justify-end p-5 lg:p-10 h-[74%] bg-slate-300 bg-opacity-50 pb-6 lg:pb-8">
          <View className="bg-white h-full rounded-t-3xl p-6 lg:p-8">
            <View className="w-12 lg:w-48 h-1 lg:h-3 bg-gray-300 rounded-full self-center mb-4 lg:mb-12 lg:mt-4" />
            <View className="bg-yellow-100 rounded-lg p-4 lg:p-8 mb-4 lg:mb-8">
              <Text className="text-lg lg:text-3xl font-NunitoBold mb-2 lg:mb-4">Your message</Text>
              <Text className='lg:text-2xl'>{originalMessage}</Text>
            </View>
            <View className="bg-green-100 rounded-lg p-4 lg:p-8 mb-4 lg:mb-8">
              <Text className="text-lg lg:text-3xl font-NunitoBold mb-2 lg:mb-4">Improved message</Text>
              <Text className='lg:text-2xl'>{feedback.correctedVersion}</Text>
            </View>
            <View className="bg-orange-100 rounded-lg p-4 lg:p-8 mb-4 lg:mb-8">
              <Text className="text-lg lg:text-3xl font-NunitoBold mb-2 lg:mb-4">Explanation</Text>
              <Text className='lg:text-2xl'>{feedback.explanation}</Text>
            </View>
            <View className='flex-1'/>
            <TouchableOpacity onPress={handlePracticePronunciation} className="bg-primary-500 p-4 lg:p-6 w-full lg:w-10/12 rounded-full self-center flex-row justify-center items-center">
              <Text className="text-white text-center font-NunitoBold lg:text-3xl mr-2">
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