import { useState, useCallback } from 'react';
import { ChatMessage, Feedback, FeedbackType } from '@/types/chat';
import ENV from '@/utils/envConfig';

const { BACKEND_URL } = ENV;

const MAX_TOKENS = 4000;

export const useMessageHandling = (
  isSophiaChat: boolean,
  setShowTopics: React.Dispatch<React.SetStateAction<boolean>>,
  scenarioDetails?: {
    aiName: string;
    aiRole: string;
    scenarioTitle: string;
    userRole: string;
    objectives: string[];
  },
  playAudio?: (messageId: number, text: string) => Promise<void>,
) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const estimateTokens = (text: string) => {
    return text.split(/\s+/).length;
  };

  const trimConversationHistory = (history: ChatMessage[]): ChatMessage[] => {
    let totalTokens = 0;
    return history.reverse().filter(msg => {
      totalTokens += estimateTokens(msg.content);
      return totalTokens <= MAX_TOKENS;
    }).reverse();
  };

  const sendMessage = useCallback(async (text: string, chatHistory: ChatMessage[], setChatHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>, isInitialGreeting = false) => {
    const userMessage: ChatMessage = { 
      role: isInitialGreeting ? 'model' : 'user', 
      content: text, 
      id: Date.now(), 
      isLoading: !isInitialGreeting 
    };
    setChatHistory(prev => [...prev, userMessage]);
    if (!isInitialGreeting) {
      setIsTyping(true);
      setShowTopics(false);

      try {
        const conversationHistory = trimConversationHistory([...chatHistory, userMessage]);
        
        const response = await fetch(`${BACKEND_URL}/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: conversationHistory,
            chatType: isSophiaChat ? 'main' : 'roleplay',
            scenarioDetails: !isSophiaChat ? scenarioDetails : undefined,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const mateReply = data.reply || 'Hi';

        const feedback: Feedback = {
          correctedVersion: data.feedback.correctedVersion,
          explanation: data.feedback.explanation,
          feedbackType: data.feedback.feedbackType as FeedbackType,
          isCorrect: data.feedback.isCorrect
        };

        const assistantMessage: ChatMessage = { 
          role: 'model', 
          content: mateReply, 
          id: Date.now() 
        };
        
        setChatHistory(prev => [
          ...prev.slice(0, -1),
          { ...userMessage, feedback, isLoading: false },
          assistantMessage
        ]);

        if (playAudio) {
          await playAudio(assistantMessage.id, assistantMessage.content);
        }
      } catch (error) {
        console.error('Error sending message:', error);
        setChatHistory(prev => [
          ...prev.slice(0, -1),
          { 
            ...prev[prev.length - 1], 
            isLoading: false, 
            feedback: { 
              correctedVersion: '', 
              explanation: 'Error occurred',
              feedbackType: 'NONE',
              isCorrect: false
            } 
          },
        ]);
      } finally {
        setIsTyping(false);
      }
    }
  }, [isSophiaChat, scenarioDetails, playAudio]);

  const handleSend = useCallback((chatHistory: ChatMessage[], setChatHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>) => {
    if (message.trim()) {
      sendMessage(message, chatHistory, setChatHistory);
      setMessage('');
      setShowTopics(false);
    }
  }, [message, sendMessage]);

  const handleTopicSelect = useCallback((topic: string, chatHistory: ChatMessage[], setChatHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>) => {
    const params = topic === 'Fun' ? 'a fun' : topic === 'Interesting' ? 'an interesting' : 'a ';
    const userMessage = `Hey, Sophia! Ask me ${params} question.`;
    sendMessage(userMessage, chatHistory, setChatHistory);
  }, [sendMessage]);

  return {
    message,
    setMessage,
    isTyping,
    setIsTyping,
    setShowTopics,
    sendMessage,
    handleSend,
    handleTopicSelect,
  };
};