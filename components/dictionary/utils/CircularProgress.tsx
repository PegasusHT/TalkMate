import React from 'react';
import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Text from '@/components/customText';
import { getDeviceSize } from '@/components/customUtils/deviceSizeUtils';

interface CircularProgressProps {
  progress: number;
}

const getColorForAccuracy = (accuracy: number | undefined) => {
  if (accuracy === undefined) return '#6B7280';
  if (accuracy >= 80) return '#20ae59';
  if (accuracy >= 60) return '#FB923C';
  return '#EF4444';
};

const CircularProgress: React.FC<CircularProgressProps> = ({ progress }) => {
  const deviceSize = getDeviceSize();
  
  const size = deviceSize === 'lg' || deviceSize === 'xl' ? 120 : 60;
  const strokeWidth = deviceSize === 'lg' || deviceSize === 'xl' ? 12 : 6;
  const textSize = deviceSize === 'lg' || deviceSize === 'xl' ? 24 : 16;

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const progressColor = getColorForAccuracy(progress);

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <Circle
          stroke="#E6E6E6"
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          transform={`rotate(0 ${size / 2} ${size / 2})`}
        />
        <Circle
          stroke={progressColor}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(0 ${size / 2} ${size / 2}) scale(-1, 1) translate(-${size}, 0)`}
        />
      </Svg>
      <View className='p-2'
       style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: progressColor, fontSize: textSize }} className="font-NunitoBold">{`${progress}%`}</Text>
      </View>
    </View>
  );
};

export default CircularProgress;