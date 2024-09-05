import React from 'react';
import { View } from 'react-native';

const TypingIndicator: React.FC = () => (
  <View className="flex flex-row items-center space-x-2 p-3 bg-gray-200 rounded-lg self-start m-2">
    <View className="w-3 h-3 bg-gray-500 rounded-full" style={{ opacity: 0.6 }} />
    <View className="w-3 h-3 bg-gray-500 rounded-full" style={{ opacity: 0.8 }} />
    <View className="w-3 h-3 bg-gray-500 rounded-full" />
  </View>
);

export default TypingIndicator;