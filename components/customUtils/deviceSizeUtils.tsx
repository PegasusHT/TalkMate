//components/customUtils/deviceSizeUtils.tsx
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export type DeviceSize = 'sm' | 'md' | 'lg' | 'xl';

export const getDeviceSize = (): DeviceSize => {
  const shortestSide = Math.min(width, height);
  
  if (shortestSide <= 390) return 'sm'; //iphone13 pro
  if (shortestSide <= 430) return 'md'; //iphone 15 pro max
  if (shortestSide <= 1024) return 'lg'; //ipad 13'
  return 'xl';
};

export const responsiveValue = (
  values: { [key in DeviceSize]?: number | string }
): number | string => {
  const deviceSize = getDeviceSize();
  return values[deviceSize] || values.md || 0;
};