import React from 'react';
import { Text as RNText, TextProps } from 'react-native';

const CustomText: React.FC<TextProps> = (props) => {
  return <RNText {...props} style={[{ fontFamily: 'Nunito-Regular' }, props.style]} />;
};

export default CustomText;