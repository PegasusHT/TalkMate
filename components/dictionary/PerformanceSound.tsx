// components/PerformanceSound.tsx
import React, { useEffect, useCallback } from 'react';
import { Audio } from 'expo-av';

interface PerformanceSoundProps {
  score: number | null;
  isVisible: boolean;
}

const SUCCESS_SOUND = require('@/assets/sounds/success.mp3');
const OKAY_SOUND = require('@/assets/sounds/okay.wav');
const FAIL_SOUND = require('@/assets/sounds/fail.mp3');

const PerformanceSound: React.FC<PerformanceSoundProps> = ({ score, isVisible }) => {
  const playPerformanceSound = useCallback(async (performanceScore: number) => {
    let soundFile;
    if (performanceScore >= 80) {
      soundFile = SUCCESS_SOUND;
    } else if (performanceScore >= 60) {
      soundFile = OKAY_SOUND;
    } else {
      soundFile = FAIL_SOUND;
    }

    try {
      const { sound } = await Audio.Sound.createAsync(soundFile);
      await sound.playAsync();
      sound.setOnPlaybackStatusUpdate(async (status) => {
        if (status.isLoaded && status.didJustFinish) {
          await sound.unloadAsync();
        }
      });
    } catch (error) {
      console.error('Error playing performance sound:', error);
    }
  }, []);

  useEffect(() => {
    if (score !== null && isVisible) {
      playPerformanceSound(score);
    }
  }, [score, isVisible, playPerformanceSound]);

  return null; 
};

export default PerformanceSound;