import React from 'react';
import { Text as RNText, TextProps } from 'react-native';

const font = 'Nunito-Regular'
const CustomText: React.FC<TextProps> = (props) => {
  return <RNText {...props} style={[{ fontFamily: font }, props.style]} />;
};

export default CustomText;