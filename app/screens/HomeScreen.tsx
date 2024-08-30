import React from 'react';
import { View, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootTabParamList } from './types'; 

type Props = NativeStackScreenProps<RootTabParamList, 'Home'>;

const HomeScreen: React.FC<Props> = () => {
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text className="h-full flex justify-center items-center text-2xl font-bold text-blue-600">
        Welcome to the Home Screen!
      </Text>
    </View>
  );
};

export default HomeScreen;