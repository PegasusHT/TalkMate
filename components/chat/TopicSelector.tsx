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
        lg: { top: 300}
      }}
     className="absolute right-0 flex flex-col">
      {['Fun', 'Interesting', 'You decide'].map(topic => (
        <TouchableOpacity key={topic} onPress={() => onTopicSelect(topic)} className="mr-2 lg:mr-6 mb-2 rounded-2xl bg-primary-500">
          <Text className="text-white lg:text-2xl px-3 lg:px-6 py-1 lg:py-3">{topic}</Text>
        </TouchableOpacity>
      ))}
    </ResponsiveView>
  );
};

export default TopicSelector;