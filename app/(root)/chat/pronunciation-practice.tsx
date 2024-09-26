// path: app/(root)/chat/pronunciation-practice.tsx
import React from 'react';
import { View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import PronunciationPractice from '@/components/dictionary/PronunciationPractice';

const ChatPronunciationPracticeScreen: React.FC = () => {
  const params = useLocalSearchParams<{ sentence: string }>();
  const sentence = params.sentence;

  if (!sentence) {
    return null;
  }

  return (
    <View style={{ flex: 1 }}>
      <PronunciationPractice sentence={sentence} />
    </View>
  );
};

export default ChatPronunciationPracticeScreen;