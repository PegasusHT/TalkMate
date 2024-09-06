import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Mic } from 'lucide-react-native';

type RootStackParamList = {
  'pronunciation-practice': { sentence: string };
};

type PronunciationPracticeRouteProp = RouteProp<RootStackParamList, 'pronunciation-practice'>;

const PronunciationPractice: React.FC = () => {
  const route = useRoute<PronunciationPracticeRouteProp>();
  const { sentence } = route.params;
  const [isRecording, setIsRecording] = useState(false);

  const handleMicPress = () => {
    // TODO: Implement audio recording logic
    setIsRecording(!isRecording);
  };

  return (
    <View className="flex-1 bg-white p-6 justify-between">
      <View className="flex-1 justify-start ml-2 mt-4">
        <Text className="text-2xl font-bold">
          {sentence}
        </Text>
      </View>
      <TouchableOpacity
        onPress={handleMicPress}
        className={`self-center p-6 rounded-full ${isRecording ? 'bg-red-500' : 'bg-blue-500'}`}
      >
        <Mic color="white" size={32} />
      </TouchableOpacity>
    </View>
  );
};

export default PronunciationPractice;