import React from 'react';
import PronunciationPractice from '@/components/dictionary/PronunciationPractice';
import { useLocalSearchParams } from 'expo-router';

const PronunciationPracticeScreen: React.FC = () => {
  const params = useLocalSearchParams<{ sentence: string }>();
  const sentence = params.sentence;
  if (!sentence) {
    return null; 
  }

  return <PronunciationPractice sentence={sentence} />;
};

export default PronunciationPracticeScreen;