import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Globe } from 'lucide-react-native';
import Text from '@/components/customText';
import { primaryColor, bgColor, primaryStrong } from '@/constant/color';

const WelcomeHeader: React.FC = () => {
  return (
    <View
     style={{ backgroundColor: bgColor }} 
     className="flex-row justify-between items-center px-4 py-2 pt-16">
      <Text style={{ color: primaryStrong }} 
       className='text-[17px]'>
        <Text className='font-NunitoBold'>TalkMate </Text>
        <Text className='font-NunitoRegular'>AI</Text>
      </Text>

      <TouchableOpacity 
       className="flex-row items-center bg-white px-3 py-1 rounded-full">
        <Globe size={16} color={primaryStrong} />
        <Text style={{ color: primaryStrong }}
         className="ml-2 font-NunitoSemiBold">English</Text>
      </TouchableOpacity>
    </View>
  );
};

export default WelcomeHeader;