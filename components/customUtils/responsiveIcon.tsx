import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Icon as LucideIcon } from 'lucide-react-native';
import { getDeviceSize, DeviceSize } from './deviceSizeUtils';

type ResponsiveSizeProp = {
  [K in DeviceSize]?: number;
};

type IconType = {
  type: 'ionicon';
  name: keyof typeof Ionicons.glyphMap;
} | {
  type: 'lucide';
  icon: React.ElementType;
};

interface ResponsiveIconProps {
  icon: IconType ;
  responsiveSize?: ResponsiveSizeProp;
  color?: string;
  [key: string]: any;
}

const ResponsiveIcon: React.FC<ResponsiveIconProps> = ({ 
  icon,
  responsiveSize,
  color,
  ...props 
}) => {
  const deviceSize = getDeviceSize();
  
  const size = responsiveSize 
    ? responsiveSize[deviceSize] || responsiveSize.md || 24
    : 24;

  if (icon.type === 'ionicon') {
    return <Ionicons name={icon.name} size={size} color={color} {...props} />;
  } else {
    const IconComponent = icon.icon;
    return <IconComponent size={size} color={color} {...props} />;
  }
};

export default ResponsiveIcon;