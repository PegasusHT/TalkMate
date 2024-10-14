//components/customUtils/responsiveView.tsx
import React from 'react';
import { View, ViewProps, ViewStyle } from 'react-native';
import { getDeviceSize, DeviceSize } from './deviceSizeUtils'

type ResponsiveStyleProp = {
  [K in DeviceSize]?: ViewStyle;
};

interface ResponsiveViewProps extends ViewProps {
  responsiveStyle?: ResponsiveStyleProp;
}

const ResponsiveView: React.FC<ResponsiveViewProps> = ({ 
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
    <View style={[appliedStyle, style]} {...props}>
      {children}
    </View>
  );
};

export default ResponsiveView;