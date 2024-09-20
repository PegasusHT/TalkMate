import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

type TopicSelectorProps = {
  onTopicSelect: (topic: string) => void;
};

const TopicSelector: React.FC<TopicSelectorProps> = ({ onTopicSelect }) => {
  return (
    <View className="absolute right-0 top-48 flex flex-col">
      {['Fun', 'Interesting', 'You decide'].map(topic => (
        <TouchableOpacity key={topic} onPress={() => onTopicSelect(topic)} className="mr-2 mb-2 rounded-3xl bg-blue-500">
          <Text className="text-white px-3 py-1">{topic}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default TopicSelector;