import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing } from 'react-native';

const RecordingAnimation: React.FC = () => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => animation.stop();
  }, [scaleAnim]);

  return (
    <View className="flex-1 items-center justify-center">
      <Animated.View
        style={{
          transform: [{ scale: scaleAnim }],
        }}
      >
        <View className="w-4 h-4 bg-red-500 rounded-full" />
      </Animated.View>
    </View>
  );
};

export default RecordingAnimation;