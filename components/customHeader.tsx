import React from 'react';
import { View } from 'react-native';
import Text from '@/components/customText';
import ResponsiveView from '@/components/customUtils/responsiveView';
import ResponsiveText from '@/components/customUtils/responsiveText';
import ResponsiveImage from '@/components/customUtils/responsiveImage';
import { primaryColor } from '@/constant/color';

const appLogo = require('@/assets/images/phone-logo.png');

interface CustomHeaderProps {
  isGuest: boolean;
  firstname: string;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({ isGuest, firstname }) => {
  return (
    <ResponsiveView
      responsiveStyle={{
        sm: { paddingHorizontal: 8, paddingTop: 60, paddingBottom: 0 },
        md: { paddingHorizontal: 8, paddingTop: 60, paddingBottom: 0 },
        lg: { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 0 },
      }}
      className="flex-row justify-between items-center bg-white"
    >
      <View className="flex-row items-center">
        <ResponsiveImage
          source={appLogo}
          responsiveStyle={{
            sm: { width: 50, height: 56 },
            md: { width: 50, height: 56 },
            lg: { width: 80, height: 84 },
          }}
          resizeMode="contain"
        />
        <ResponsiveText
          responsiveStyle={{
            sm: { fontSize: 18, marginLeft: 4 },
            md: { fontSize: 18, marginLeft: 4 },
            lg: { fontSize: 32, marginLeft: 8 },
          }}
          className="font-NunitoSemiBold"
        >
          {isGuest ? 'Hi!' : `Hi, ${firstname}!`}
        </ResponsiveText>
      </View>
    </ResponsiveView>
  );
};

export default CustomHeader;