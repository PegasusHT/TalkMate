import React from 'react';
import { View, SafeAreaView } from 'react-native';
import Text from '@/components/customText';
import { StatusBar } from 'expo-status-bar';

const LearnScreen: React.FC = () => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      <View className="flex-1 justify-center items-center px-4">
        <Text className="text-2xl font-NunitoBold text-primary-500">
          Welcome to the Learn Screen!
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default LearnScreen;