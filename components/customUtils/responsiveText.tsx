// components/customUtils/ResponsiveText.tsx
import React from 'react';
import { Text, TextProps, TextStyle } from 'react-native';
import { getDeviceSize, DeviceSize } from './deviceSizeUtils';

type ResponsiveTextStyleProp = {
  [K in DeviceSize]?: TextStyle;
};

interface ResponsiveTextProps extends TextProps {
  responsiveStyle?: ResponsiveTextStyleProp;
  children: React.ReactNode;
}

const ResponsiveText: React.FC<ResponsiveTextProps> = ({ 
  responsiveStyle, 
  style, 
  children, 
  ...props 
}) => {
  const deviceSize = getDeviceSize();
  
  const appliedStyle = responsiveStyle 
    ? { ...responsiveStyle.sm, ...responsiveStyle.md, ...responsiveStyle.lg, ...responsiveStyle.xl, ...responsiveStyle[deviceSize] }
    : {};
  
  return (
    <Text style={[appliedStyle, style]} {...props}>
      {children}
    </Text>
  );
};

export default ResponsiveText;