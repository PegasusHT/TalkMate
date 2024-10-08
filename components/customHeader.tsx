import React from 'react';
import { View, Image } from 'react-native';
import Text from '@/components/customText';
import { Ionicons } from '@expo/vector-icons';
import { primaryColor } from '@/constant/color';

const appLogo = require('@/assets/images/phone-logo.png')
interface CustomHeaderProps {
  isGuest: boolean;
  firstname: string;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({ isGuest, firstname }) => {
  return (
    <View className="flex-row justify-between items-center p-4 pt-16 bg-white pb-0">
      <View className="flex-row items-center">
        <Image source={appLogo} className="w-8 h-12" />
        <Text className="ml-2 text-lg font-NunitoSemiBold">
          {isGuest ? 'Hi!' : `Hi, ${firstname}!`}
        </Text>
      </View>
    </View>
  );
};

export default CustomHeader;