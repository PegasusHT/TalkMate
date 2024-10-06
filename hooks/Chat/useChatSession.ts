//hooks/useChatSession.ts
import { useState, useCallback, useEffect, useRef } from 'react';
import { ChatMessage } from '@/types/chat';
import { ObjectId } from 'mongodb';
import { useChatInitialization } from './useChatInitialization';
import { useAudioHandling } from './useAudioHandling';
import { useMessageHandling } from './useMessageHandling';
import { usePopupMessage } from './usePopupMessage';
import { useFeedbackHandling } from './useFeedbackHandling';

export const useChatSession = (isSophiaChat = false, scenarioId?: ObjectId, scenarioDetails?: {
  aiName: string;
  aiRole: string;
  scenarioTitle: string;
  userRole: string;
  objectives: string[];
}) => {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const { popupMessage, showPopup } = usePopupMessage();
  const [showTopics, setShowTopics] = useState(false);
  const scrollToEndTrigger = useRef(0);
  const isScreenActive = useRef(true);

  const triggerScrollToEnd = useCallback(() => {
    scrollToEndTrigger.current += 1;
  }, []);

  const {
    isRecording,
    setIsRecording,
    isProcessingAudio,
    playingAudioId,
    isAudioLoading,
    playAudio,
    stopAudio,
    stopAllAudio,
    handleMicPress,
    stopRecording,
    sendAudio,
  } = useAudioHandling(
    setChatHistory, chatHistory, isSophiaChat, setShowTopics, isTyping,showPopup, isScreenActive, scenarioDetails);

  const {
    message,
    setMessage,
    sendMessage,
    handleSend,
    handleTopicSelect,
  } = useMessageHandling(isSophiaChat,setIsTyping, setShowTopics, scenarioDetails, playAudio);

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
    const canStartNewChat = await checkAndPrepareForNewChat();
    if (canStartNewChat) {
      await cleanupCurrentSession();
      startNewChat();
    }
  }, [isAudioLoading, isTyping, stopRecording, stopAllAudio, startNewChat, showPopup]);
  
  const checkAndPrepareForNewChat = async () => {
    if (isAudioLoading || isTyping) {
      const message = isAudioLoading
        ? "Please wait for the audio to finish loading before starting a new session."
        : "Please wait for the current message to be completed before starting a new session.";
      showPopup(message);
      return false;
    }
    return true;
  };
  const cleanupCurrentSession = async () => {
    await stopRecording();
    await stopAllAudio();
  };

  const wrappedSendMessage = useCallback(async (text: string, isInitialGreeting = false) => {
    await sendMessage(text, chatHistory, setChatHistory, isInitialGreeting);
    triggerScrollToEnd();
  }, [sendMessage, chatHistory, triggerScrollToEnd]);

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
    initializeChat: wrappedInitializeChat,
    triggerScrollToEnd,
    scrollToEndTrigger: scrollToEndTrigger.current,
    isScreenActive,
  };
};