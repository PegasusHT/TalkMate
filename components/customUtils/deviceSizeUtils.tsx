//components/customUtils/deviceSizeUtils.tsx
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export type DeviceSize = 'sm' | 'md' | 'lg' | 'xl';

export const getDeviceSize = (): DeviceSize => {
  const shortestSide = Math.min(width, height);
  
  if (shortestSide <= 390) return 'sm'; //iphone13 pro: 390
  if (shortestSide <= 600) return 'md'; //iphone 15 pro max: 430
  if (shortestSide <= 1400) return 'lg'; //ipad 13'
  return 'xl';
};

export const responsiveValue = (
  values: { [key in DeviceSize]?: number | string }
): number | string => {
  const deviceSize = getDeviceSize();
  return values[deviceSize] || values.md || 0;
};