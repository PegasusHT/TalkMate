import { useState, useCallback, useEffect } from 'react';
import { ChatMessage } from '@/types/chat';
import { ObjectId } from 'mongodb';
import { useChatInitialization } from './Chat/useChatInitialization';
import { useAudioHandling } from './Chat/useAudioHandling';
import { useMessageHandling } from './Chat/useMessageHandling';
import { usePopupMessage } from './Chat/usePopupMessage';
import { useTopicHandling } from './Chat/useTopicHandling';
import { useFeedbackHandling } from './Chat/useFeedbackHandling';

export const useChatSession = (isSophiaChat = false, scenarioId?: ObjectId, scenarioDetails?: {
  aiName: string;
  aiRole: string;
  scenarioTitle: string;
  userRole: string;
  objectives: string[];
}) => {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  const { popupMessage, showPopup } = usePopupMessage();

  const {
    isRecording,
    isProcessingAudio,
    playingAudioId,
    isAudioLoading,
    playAudio,
    stopAudio,
    stopAllAudio,
    handleMicPress,
    stopRecording,
    sendAudio,
  } = useAudioHandling(setChatHistory, chatHistory, isSophiaChat, scenarioDetails);

  const {
    message,
    setMessage,
    isTyping,
    setIsTyping,
    showTopics,
    setShowTopics,
    sendMessage,
    handleSend,
    handleTopicSelect,
  } = useMessageHandling(isSophiaChat, scenarioDetails, playAudio);

  const {
    showFeedbackModal,
    setShowFeedbackModal,
    currentFeedback,
    setCurrentFeedback,
  } = useFeedbackHandling();

  const {
    isInitializing,
    initializeChat,
    startNewChat,
  } = useChatInitialization(
    isSophiaChat,
    setChatHistory,
    setShowTopics,
    scenarioId,
    scenarioDetails,
    playAudio
  );

  const wrappedInitializeChat = useCallback((initScenarioId?: ObjectId) => {
    initializeChat(initScenarioId || scenarioId);
  }, [initializeChat, scenarioId]);

  const handleStartNewChat = useCallback(async () => {
    await stopAllAudio();
    startNewChat();
  }, [stopAllAudio, startNewChat]);

  const wrappedSendMessage = useCallback((text: string, isInitialGreeting = false) => {
    sendMessage(text, chatHistory, setChatHistory, isInitialGreeting);
  }, [sendMessage, chatHistory]);

  const wrappedHandleSend = useCallback(() => {
    handleSend(chatHistory, setChatHistory);
  }, [handleSend, chatHistory]);

  const wrappedHandleTopicSelect = useCallback((topic: string) => {
    handleTopicSelect(topic, chatHistory, setChatHistory);
  }, [handleTopicSelect, chatHistory]);

  return {
    message,
    setMessage,
    chatHistory,
    setChatHistory,
    isInitializing,
    isTyping,
    setIsTyping,
    showFeedbackModal,
    setShowFeedbackModal,
    currentFeedback,
    setCurrentFeedback,
    showTopics,
    setShowTopics, 
    sendMessage: wrappedSendMessage,
    handleSend: wrappedHandleSend,
    handleMicPress,
    isRecording,
    stopRecording,
    sendAudio,
    isProcessingAudio,
    handleTopicSelect: wrappedHandleTopicSelect,
    playAudio,
    stopAudio,
    playingAudioId,
    isAudioLoading,
    stopAllAudio,
    startNewChat: handleStartNewChat,
    popupMessage,
    showPopup,
    initializeChat: wrappedInitializeChat
  };
};