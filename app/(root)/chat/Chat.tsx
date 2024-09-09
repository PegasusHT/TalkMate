import React, { useEffect, useRef } from 'react';
import { View, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ChatHeader from '@/components/chat/ChatHeader';
import ChatInput from '@/components/chat/ChatInput';
import ChatMessage from '@/components/chat/ChatMessage';
import FeedbackModal from '@/components/chat/FeedbackModal';
import TopicSelector from '@/components/chat/TopicSelector';
import { useChatSession } from '@/hooks/useChatSession';
import TypingIndicator from '@/components/chat/animation/TypingIndicator';
import { ChatMessage as ChatMessageType } from '@/types/chat';

const ChatSession: React.FC = () => {
  const {
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
    isRecording,
    stopRecording,
    sendAudio,
    initializeChat,
    isProcessingAudio,
    handleTopicSelect,
    playAudio,
    stopAudio,
    playingAudioId,
    isAudioLoading,
    stopAllAudio,
    startNewChat,
  } = useChatSession();

  const flatListRef = useRef<FlatList<ChatMessageType>>(null);

  useEffect(() => {
    initializeChat();
  }, []);

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [chatHistory]);

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

  const handleNewChat = () => {
    startNewChat();
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        className="flex-1"
      >
        <ChatHeader onNewChat={handleNewChat} />

        <FlatList
          ref={flatListRef}
          data={chatHistory}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          className="flex-1"
          ListFooterComponent={renderFooter}
        />

        {showTopics && <TopicSelector onTopicSelect={handleTopicSelect} />}

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

export default ChatSession;