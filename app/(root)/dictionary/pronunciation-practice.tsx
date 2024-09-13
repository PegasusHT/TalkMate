//path: app/(root)/dictionary/pronunciation-practice.tsx
import React from 'react';
import PronunciationPractice from '@/components/dictionary/PronunciationPractice';
import { useLocalSearchParams } from 'expo-router';
import { useAudioMode } from '@/hooks/useAudioMode';
import { useEffect } from 'react';

const PronunciationPracticeScreen: React.FC = () => {
  const params = useLocalSearchParams<{ sentence: string }>();
  const { mode, setPlaybackMode, setRecordingMode } = useAudioMode();
  const sentence = params.sentence;
  if (!sentence) {
    return null; 
  }

  useEffect(() => {
    setPlaybackMode();
  }, [setPlaybackMode]);

  return <PronunciationPractice sentence={sentence} />;
};

export default PronunciationPracticeScreen;