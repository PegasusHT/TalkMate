import React from 'react';
import { Image, ImageProps, ImageStyle } from 'react-native';
import { getDeviceSize, DeviceSize } from './deviceSizeUtils';

type ResponsiveImageStyleProp = {
  [K in DeviceSize]?: Partial<ImageStyle>;
};

interface ResponsiveImageProps extends Omit<ImageProps, 'style'> {
  responsiveStyle: ResponsiveImageStyleProp;
  style?: ImageStyle;
}

const ResponsiveImage: React.FC<ResponsiveImageProps> = ({ 
  responsiveStyle, 
  style,
  ...props 
}) => {
  const deviceSize = getDeviceSize();
  
  const responsiveStyles = responsiveStyle[deviceSize] || 
    responsiveStyle.md || 
    { width: 100, height: 100 }; 
  
  return (
    <Image
      style={[responsiveStyles, style]}
      {...props}
    />
  );
};

export default ResponsiveImage;