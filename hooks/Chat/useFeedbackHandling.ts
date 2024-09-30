// hooks/Chat/useFeedbackHandling.ts
import { useState } from 'react';
import { ChatMessage } from '@/types/chat';

export const useFeedbackHandling = () => {
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState<ChatMessage | null>(null);

  return {
    showFeedbackModal,
    setShowFeedbackModal,
    currentFeedback,
    setCurrentFeedback,
  };
};
