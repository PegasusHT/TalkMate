import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import Text from '@/components/customText';
import ResponsiveView from '../customUtils/responsiveView';

type TopicSelectorProps = {
  onTopicSelect: (topic: string) => void;
};

const TopicSelector: React.FC<TopicSelectorProps> = ({ onTopicSelect }) => {
  return (
    <ResponsiveView
      responsiveStyle={{
        sm: { top: 200 },
        md: { top: 180 },
        lg: { top: 140}
      }}
     className="absolute right-0 flex flex-col">
      {['Fun', 'Interesting', 'You decide'].map(topic => (
        <TouchableOpacity key={topic} onPress={() => onTopicSelect(topic)} className="mr-2 mb-2 rounded-2xl bg-primary-500">
          <Text className="text-white px-3 py-1">{topic}</Text>
        </TouchableOpacity>
      ))}
    </ResponsiveView>
  );
};

export default TopicSelector;