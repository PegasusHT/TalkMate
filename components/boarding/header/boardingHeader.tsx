import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Globe } from 'lucide-react-native';
import Text from '@/components/customText';
import { primaryColor } from '@/constant/color';
import { Ionicons } from '@expo/vector-icons';

const BoardingHeader: React.FC = () => {
  return (
    <View className="flex-row justify-between items-center px-3 py-2 bg-slate-100">
      <Ionicons name="logo-octocat" size={32} color={primaryColor} />
      <TouchableOpacity className="flex-row items-center bg-gray-200 px-3 py-1 rounded-full">
        <Globe size={16} color={primaryColor} />
        <Text className="ml-2 text-primary-500 font-NunitoSemiBold">English</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BoardingHeader;