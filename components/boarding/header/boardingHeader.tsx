import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { Globe } from 'lucide-react-native';
import Text from '@/components/customText';
import { primaryColor } from '@/constant/color';
import ResponsiveIcon from '@/components/customUtils/responsiveIcon';

const logoSlate = require('@/assets/icons/logo-slate.png')
const BoardingHeader: React.FC = () => {
  return (
    <View className="flex-row justify-between items-center px-3 lg:px-6 py-2 bg-slate-100">
        <Image source={logoSlate} className="w-8 h-12 lg:w-24 lg:h-24 mb-[-4]" />
        <TouchableOpacity className="flex-row items-center bg-gray-200 px-3 lg:px-4 py-1 lg:py-2 rounded-full">
        <ResponsiveIcon
            icon={{ type: 'lucide', icon: Globe }}
            responsiveSize={{
              sm: 16,
              md: 16,
              lg: 30,
            }}
            color={primaryColor}
            className='lg:mb-1'
          />
        <Text className="ml-2 text-primary-500 lg:text-2xl font-NunitoSemiBold">English</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BoardingHeader;