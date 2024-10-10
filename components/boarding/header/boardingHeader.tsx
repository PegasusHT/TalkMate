import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { Globe } from 'lucide-react-native';
import Text from '@/components/customText';
import { primaryColor } from '@/constant/color';

const logoSlate = require('@/assets/icons/logo-slate.png')
const BoardingHeader: React.FC = () => {
  return (
    <View className="flex-row justify-between items-center px-3 py-2 bg-slate-100">
        <Image source={logoSlate} className="w-8 h-12 mb-[-4]" />
        <TouchableOpacity className="flex-row items-center bg-gray-200 px-3 py-1 rounded-full">
        <Globe size={16} color={primaryColor} />
        <Text className="ml-2 text-primary-500 font-NunitoSemiBold">English</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BoardingHeader;