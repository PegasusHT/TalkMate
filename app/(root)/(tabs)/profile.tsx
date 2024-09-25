import React from 'react';
import { View } from 'react-native';
import Text from '@/components/customText';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootTabParamList } from '@/types/types'; 

type Props = NativeStackScreenProps<RootTabParamList, 'Profile'>;

const ProfileScreen: React.FC<Props> = () => {
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text className="text-2xl font-NunitoBold text-primary-500">Welcome to the Profile Screen!</Text>
    </View>
  );
};

export default ProfileScreen;