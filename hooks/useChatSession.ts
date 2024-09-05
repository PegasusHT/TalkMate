import { useState, useCallback, useRef } from 'react';
import Constants from 'expo-constants';
import { ChatMessage } from '@/types/chat';

const BACKEND_URL = Constants.expoConfig?.extra?.BACKEND_URL?.dev || '';

const MAX_TOKENS = 4000;

export const useChatSession = () => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState<ChatMessage | null>(null);
  const hasInitialized = useRef(false);
  const [showTopics, setShowTopics] = useState(false);

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

  const sendMessage = useCallback(async (text: string) => {
    const userMessage: ChatMessage = { role: 'user', content: text, id: Date.now(), isLoading: true };
    setChatHistory(prev => [...prev, userMessage]);
    setIsTyping(true);
    setShowTopics(false);

    try {
      const conversationHistory = trimConversationHistory([...chatHistory, userMessage]);
      
      const response = await fetch(`${BACKEND_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: conversationHistory }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      let mateReply = 'Hi';
      if (data && data.reply) {
        mateReply = data.reply;
      }

      const assistantMessage: ChatMessage = { role: 'model', content: mateReply, id: Date.now() };
      
      setChatHistory(prev => [
        ...prev.slice(0, -1),
        { ...userMessage, feedback: data.feedback, isLoading: false },
        assistantMessage
      ]);
    } catch (error) {
      console.error('Error sending message:', error);
      setChatHistory(prev => [
        ...prev.slice(0, -1),
        { ...prev[prev.length - 1], isLoading: false, feedback: { correctedVersion: '', explanation: 'Error occurred' } },
      ]);
    } finally {
      setIsTyping(false);
    }
  }, [chatHistory]);

  const handleSend = useCallback(() => {
    if (message.trim()) {
      sendMessage(message);
      setMessage('');
    }
  }, [message, sendMessage]);

  const handleMicPress = useCallback(() => {
    // TODO: Implement voice input functionality
  }, []);

  const initializeChat = useCallback(async () => {
    if (!isInitializing || hasInitialized.current) return;
    hasInitialized.current = true;

    try {
      const response = await fetch(`${BACKEND_URL}/session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (data.greetingMessage) {
        setChatHistory(prev => [...prev, { 
          role: 'model', 
          content: data.greetingMessage, 
          id: Date.now()
        }]);
        setShowTopics(true);
      }
    } catch (error) {
      console.error('Error creating session:', error);
    } finally {
      setIsInitializing(false);
    }
  }, [isInitializing]);

  const handleTopicSelect = useCallback((topic: string) => {
    const params = topic === 'Fun' ? 'a fun' : topic === 'Interesting' ? 'an interesting' : '';
    const userMessage = `Hey, Mia! Ask me ${params} question.`;
    sendMessage(userMessage);
  }, [sendMessage]);

  return {
    message,
    setMessage,
    chatHistory,
    isInitializing,
    isTyping,
    showFeedbackModal,
    setShowFeedbackModal,
    currentFeedback,
    setCurrentFeedback,
    showTopics,
    sendMessage,
    handleSend,
    handleMicPress,
    initializeChat,
    handleTopicSelect,
  };
};