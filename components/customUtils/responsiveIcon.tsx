import React from 'react';
import { Icon as LucideIcon } from 'lucide-react-native';
import { getDeviceSize, DeviceSize } from './deviceSizeUtils';

type ResponsiveSizeProp = {
  [K in DeviceSize]?: number;
};

interface ResponsiveIconProps {
  icon: React.ElementType;
  responsiveSize?: ResponsiveSizeProp;
  color?: string;
  [key: string]: any; 
}

const ResponsiveIcon: React.FC<ResponsiveIconProps> = ({ 
  icon: IconComponent,
  responsiveSize,
  color,
  ...props 
}) => {
  const deviceSize = getDeviceSize();
  
  const size = responsiveSize 
    ? responsiveSize[deviceSize] || responsiveSize.md || 24
    : 24;
  return <IconComponent size={size} color={color} {...props} />;
};

export default ResponsiveIcon;