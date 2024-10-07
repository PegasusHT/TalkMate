import React from 'react';
import { View } from 'react-native';
import Svg, { Path, Circle, Text as SvgText } from 'react-native-svg';

interface HalfCircularProgressProps {
  size: number;
  strokeWidth: number;
  progress: number;
  backgroundColor?: string;
  progressColor?: string;
}

const HalfCircularProgress: React.FC<HalfCircularProgressProps> = ({
  size,
  strokeWidth,
  progress,
  backgroundColor = '#E5E7EB',
  progressColor = '#3B82F6',
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * Math.PI;
  const progressValue = Math.min(Math.max(progress, 0), 100);
  const progressOffset = circumference - (progressValue / 100) * circumference;

  return (
    <View style={{ width: size, height: size / 2 }}>
      <Svg width={size} height={size / 2}>
        <Path
          d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
          fill="none"
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        <Path
          d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
          fill="none"
          stroke={progressColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={progressOffset}
        />
        <SvgText 
          x={size / 2}
          y={size / 2 - 5}
          fontSize={size / 5}
          fontWeight="bold"
          textAnchor="middle"
          fill="#000000"
        >
          {`${progressValue}%`}
        </SvgText>
      </Svg>
    </View>
  );
};

export default HalfCircularProgress;