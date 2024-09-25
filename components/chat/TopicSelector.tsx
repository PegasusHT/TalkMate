import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import Text from '@/components/customText';

type TopicSelectorProps = {
  onTopicSelect: (topic: string) => void;
};

const TopicSelector: React.FC<TopicSelectorProps> = ({ onTopicSelect }) => {
  return (
    <View className="absolute right-0 top-40 flex flex-col">
      {['Fun', 'Interesting', 'You decide'].map(topic => (
        <TouchableOpacity key={topic} onPress={() => onTopicSelect(topic)} className="mr-2 mb-2 rounded-3xl bg-primary-500">
          <Text className="text-white px-3 py-1">{topic}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default TopicSelector;