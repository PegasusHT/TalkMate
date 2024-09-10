import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const LearnScreen: React.FC = () => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      <View className="flex-1 justify-center items-center px-4">
        <Text className="text-2xl font-bold text-blue-600">
          Welcome to the Learn Screen!
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default LearnScreen;