import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const screenHeight = Math.max(width, height);

const fontSizes = {
  xs: Math.round(screenHeight * 0.02),
  sm: Math.round(screenHeight * 0.025),
  base: Math.round(screenHeight * 0.028),
  lg: Math.round(screenHeight * 0.035),
  xl: Math.round(screenHeight * 0.04),
  '2xl': Math.round(screenHeight * 0.045),
  '3xl': Math.round(screenHeight * 0.05),
};

export const getFontSize = (size) => fontSizes[size] || fontSizes.base;

export const getTextStyle = (size) => ({
  fontSize: getFontSize(size),
});

export const combineStyles = (...styles) => {
  return styles.reduce((acc, style) => ({ ...acc, ...style }), {});
};