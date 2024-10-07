import React from 'react';
import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Text from '@/components/customText';

interface CircularProgressProps {
  size: number;
  strokeWidth: number;
  progress: number;
}

const CircularProgress: React.FC<CircularProgressProps> = ({ size, strokeWidth, progress }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const getColorForAccuracy = (accuracy: number) => {
    if (accuracy >= 80) return '#22c55e'; 
    if (accuracy >= 60) return '#eab308'; 
    return '#ef4444'; 
  };

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
        <Text style={{ color: progressColor }} className="text-lg font-NunitoBold">{`${progress}%`}</Text>
      </View>
    </View>
  );
};

export default CircularProgress;