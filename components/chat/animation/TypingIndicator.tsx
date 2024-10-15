import React from 'react';
import { View } from 'react-native';

const TypingIndicator: React.FC = () => (
  <View className="flex flex-row items-center space-x-2 lg:space-x-4 p-3 lg:p-6 bg-gray-200 rounded-lg self-start m-2 lg:m-10">
    <View className="w-3 h-3 lg:w-6 lg:h-6 bg-gray-500 rounded-full" style={{ opacity: 0.6 }} />
    <View className="w-3 h-3 lg:w-6 lg:h-6 bg-gray-500 rounded-full" style={{ opacity: 0.8 }} />
    <View className="w-3 h-3 lg:w-6 lg:h-6 bg-gray-500 rounded-full" />
  </View>
);

export default TypingIndicator;