//app/(root)/roleplays/chat.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, FlatList, KeyboardAvoidingView, Platform, Text, Modal, ScrollView, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useRoute, RouteProp } from '@react-navigation/native';
import ChatHeader from '@/components/chat/ChatHeader';
import ChatInput from '@/components/chat/ChatInput';
import ChatMessage from '@/components/chat/ChatMessage';
import FeedbackModal from '@/components/chat/FeedbackModal';
import { useChatSession } from '@/hooks/useChatSession';
import TypingIndicator from '@/components/chat/animation/TypingIndicator';
import { ChatMessage as ChatMessageType } from '@/types/chat';
import ENV from '@/utils/envConfig';
import { ObjectId } from 'mongodb';

const { BACKEND_URL } = ENV;
type RootStackParamList = {
  chat: { 
    aiName: string;
    aiRole: string;
    aiTraits: string[];
    userRole: string;
    objectives: string[];
    scenarioTitle: string;
    scenarioId: ObjectId; 
  };
};

type ChatRouteProp = RouteProp<RootStackParamList, 'chat'>;

const Chat: React.FC = () => {
  const route = useRoute<ChatRouteProp>();
  const { aiName, aiRole, aiTraits, userRole, objectives, scenarioTitle, scenarioId } = route.params;
  const greetingFetched = useRef(false);

  const {
    message,
    setMessage,
    chatHistory,
    isTyping,
    showFeedbackModal,
    setShowFeedbackModal,
    currentFeedback,
    setCurrentFeedback,
    sendMessage,
    handleSend,
    handleMicPress,
    isRecording,
    stopRecording,
    sendAudio,
    isProcessingAudio,
    playAudio,
    stopAudio,
    playingAudioId,
    isAudioLoading,
    stopAllAudio,
    startNewChat,
    initializeChat,
} = useChatSession(false, scenarioId, {
    aiName,
    aiRole,
    scenarioTitle,
    userRole
  });

  const flatListRef = useRef<FlatList<ChatMessageType>>(null);

  useEffect(() => {
    if (!greetingFetched.current) {
      greetingFetched.current = true;
      initializeChat(scenarioId);
    }
  }, [scenarioId, initializeChat]);

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [chatHistory]);

  useEffect(() => {
    return () => {
      stopAllAudio();
    };
  }, [stopAllAudio]);

  useFocusEffect(
    useCallback(() => {
      return () => {
        stopAllAudio();
      };
    }, [stopAllAudio])
  );

  const handleAudioPress = (messageId: number, text: string, audioUri?: string) => {
    playAudio(messageId, text, audioUri);
  };

  const renderItem = ({ item }: { item: ChatMessageType }) => (
    <ChatMessage 
      item={item} 
      onFeedbackPress={() => {
        setCurrentFeedback(item);
        setShowFeedbackModal(true);
      }}
      onAudioPress={handleAudioPress}
      isPlaying={playingAudioId === item.id}
      isAudioLoading={isAudioLoading && playingAudioId === item.id}
    />
  );

  const renderFooter = () => {
    if (isTyping && chatHistory[chatHistory.length - 1]?.role !== 'model') {
      return <TypingIndicator />;
    }
    return null;
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        className="flex-1"
      >
        <ChatHeader 
          aiName={aiName}
          chatType="roleplay"
          onNewChat={startNewChat}
        />

        <FlatList
          ref={flatListRef}
          data={chatHistory}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          className="flex-1"
          ListFooterComponent={renderFooter}
        />

        <ChatInput
          message={message}
          setMessage={setMessage}
          handleSend={handleSend}
          handleMicPress={handleMicPress}
          isRecording={isRecording}
          stopRecording={stopRecording}
          sendAudio={sendAudio}
          isProcessingAudio={isProcessingAudio}
          stopAllAudio={stopAllAudio}
        />
      </KeyboardAvoidingView>

      <FeedbackModal
        isVisible={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        feedback={currentFeedback?.feedback}
        originalMessage={currentFeedback?.content || ''}
      />
    </SafeAreaView>
  );
};

export default Chat;