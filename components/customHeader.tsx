import React from 'react';
import { View } from 'react-native';
import Text from '@/components/customText';
import { Ionicons } from '@expo/vector-icons';
import { primaryColor } from '@/constant/color';

interface CustomHeaderProps {
  isGuest: boolean;
  firstname: string;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({ isGuest, firstname }) => {
  return (
    <View className="flex-row justify-between items-center p-4 pt-16 bg-white pb-4">
      <View className="flex-row items-center pt-2 ">
        <Ionicons name="logo-octocat" size={30} color={primaryColor} />
        <Text className="ml-2 text-lg font-NunitoSemiBold">
          {isGuest ? 'Hi!' : `Hi, ${firstname}!`}
        </Text>
      </View>
    </View>
  );
};

export default CustomHeader;