import { useState, useCallback } from 'react';
import { ChatMessage } from '@/types/chat';

export const useTopicHandling = (
  sendMessage: (text: string) => Promise<void>,
  setChatHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>
) => {
  const [showTopics, setShowTopics] = useState(false);

  const handleTopicSelect = useCallback(async (topic: string) => {
    const params = topic === 'Fun' ? 'a fun' : topic === 'Interesting' ? 'an interesting' : 'a ';
    const userMessage = `Hey, Sophia! Ask me ${params} question.`;
    
    // Add the user message to chat history immediately
    const userChatMessage: ChatMessage = {
      role: 'user',
      content: userMessage,
      id: Date.now()
    };
    setChatHistory(prev => [...prev, userChatMessage]);

    // Hide topics after selection
    setShowTopics(false);

    // Send the message to the AI
    await sendMessage(userMessage);
  }, [sendMessage, setChatHistory]);

  return {
    showTopics,
    setShowTopics,
    handleTopicSelect,
  };
};