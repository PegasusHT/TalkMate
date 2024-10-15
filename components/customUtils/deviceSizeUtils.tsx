import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export type DeviceSize = 'sm' | 'md' | 'lg' | 'xl';

export const getDeviceSize = (): DeviceSize => {
  const shortestSide = Math.min(width, height);
  
  if (shortestSide >= 1280) return 'xl'; 
  if (shortestSide >= 1024) return 'lg';  //ipad 13': 1400
  if (shortestSide >= 420) return 'md';  //iphone 15 pro max: 430
  return 'sm';  //iphone13 pro: 390
};

export const responsiveValue = (
  values: { [key in DeviceSize]?: number | string }
): number | string => {
  const deviceSize = getDeviceSize();
  const sizes: DeviceSize[] = ['sm', 'md', 'lg', 'xl'];
  const sizeIndex = sizes.indexOf(deviceSize);

  for (let i = 0; i <= sizeIndex; i++) {
    if (values[sizes[i]] !== undefined) {
      return values[sizes[i]]!;
    }
  }

  return values.sm || 0;
};