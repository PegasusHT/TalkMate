import React from 'react';
import { Image, ImageProps, ImageStyle } from 'react-native';
import { getDeviceSize, DeviceSize } from './deviceSizeUtils';

type ResponsiveImageStyleProp = {
  [K in DeviceSize]?: {
    width: number;
    height: number;
  };
};

interface ResponsiveImageProps extends Omit<ImageProps, 'style'> {
  responsiveStyle: ResponsiveImageStyleProp;
  style?: Omit<ImageStyle, 'width' | 'height'>;
}

const ResponsiveImage: React.FC<ResponsiveImageProps> = ({ 
  responsiveStyle, 
  style,
  ...props 
}) => {
  const deviceSize = getDeviceSize();
  
  const { width, height } = responsiveStyle[deviceSize] || 
    responsiveStyle.md || 
    { width: 100, height: 100 }; 
  
  return (
    <Image
      style={[{ width, height }, style]}
      {...props}
    />
  );
};

export default ResponsiveImage;