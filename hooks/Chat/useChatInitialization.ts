//hooks/Chat/useChatInitialization.ts
import { useState, useCallback, useRef } from 'react';
import axios from 'axios';
import { ObjectId } from 'mongodb';
import { ChatMessage } from '@/types/chat';
import ENV from '@/utils/envConfig';

const { BACKEND_URL } = ENV;

type ScenarioDetails = {
  aiName: string;
  aiRole: string;
  scenarioTitle: string;
  userRole: string;
  objectives: string[];
};

export const useChatInitialization = (
  isJennieChat: boolean,
  setChatHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  setShowTopics: React.Dispatch<React.SetStateAction<boolean>>,
  scenarioId?: ObjectId,
  scenarioDetails?: ScenarioDetails,
  playAudio?: (messageId: number, text: string) => Promise<void>
) => {
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const hasInitialized = useRef(false);

  const initializeChat = useCallback(async (initScenarioId?: ObjectId) => {
    if (!isInitializing || hasInitialized.current) return;
    hasInitialized.current = true;

    try {
      let response;
      if (isJennieChat) {
        response = await axios.post(`${BACKEND_URL}/session`, {
          aiName: 'Jennie',
          primaryRole: 'English practice buddy',
          traits: 'friendly,patient,encouraging',
          context: 'English language learning',
        });
      } else if (initScenarioId) {
        response = await axios.post(`${BACKEND_URL}/session`, { scenarioId: initScenarioId });
      } else {
        throw new Error('Invalid chat initialization: missing scenarioId for non-Jennie chat');
      }

      const { greetingMessage } = response.data;
      
      if (greetingMessage) {
        const greetingMessageObject: ChatMessage = { 
          role: 'model', 
          content: greetingMessage, 
          id: Date.now()
        };
        setChatHistory([greetingMessageObject]);
        setShowTopics(isJennieChat);
        
        if (playAudio) {
          await playAudio(greetingMessageObject.id, greetingMessageObject.content);
        }
      }
    } catch (error) {
      console.error('Error initializing chat:', error);
      if (isJennieChat) {
        const fallbackGreeting = "Hey there! 👋 I'm Jennie, your friendly English practice buddy! 😊 Ask me anything or select a topic below:";
        const fallbackGreetingObject: ChatMessage = {
          role: 'model',
          content: fallbackGreeting,
          id: Date.now()
        };
        setChatHistory([fallbackGreetingObject]);
        setShowTopics(true);
        if (playAudio) {
          await playAudio(fallbackGreetingObject.id, fallbackGreetingObject.content);
        }
      }
    } finally {
      setIsInitializing(false);
    }
  }, [isInitializing, isJennieChat, setChatHistory, setShowTopics, playAudio]);

  const startNewChat = useCallback(async () => {
    hasInitialized.current = false;
    setIsInitializing(true);
    setChatHistory([]);
    setShowTopics(false);

    await initializeChat(scenarioId);
  }, [initializeChat, scenarioId, setChatHistory, setShowTopics]);

  return {
    isInitializing,
    initializeChat,
    startNewChat,
  };
};