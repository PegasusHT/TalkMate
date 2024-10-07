//components/dictionary/PhoneticDisplay.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { PhoneticWord } from '@/types/dictionary';

type PhoneticDisplayProps = {
  phoneticWords: PhoneticWord[];
  getColorForAccuracy: (accuracy: number | undefined) => string;
};

const PhoneticDisplay: React.FC<PhoneticDisplayProps> = ({ phoneticWords, getColorForAccuracy }) => {
  return (
    <View className="flex-row flex-wrap mb-2">
      <Text className="text-lg mr-1">/</Text>
      {phoneticWords.map((phoneticWord, index) => (
        <Text 
          key={index} 
          className={`text-lg mr-1 ${getColorForAccuracy(phoneticWord.accuracy)}`}
        >
          {phoneticWord.word}
        </Text>
      ))}
      <Text className="text-lg mr-1">/</Text>
    </View>
  );
};

export default PhoneticDisplay;