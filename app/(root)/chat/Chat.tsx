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

const ChatSession: React.FC = () => {
    const {
      message,
      setMessage,
      chatHistory,
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
      handleTopicSelect,
      isProcessingAudio,
    } = useChatSession();

  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    initializeChat();
  }, [initializeChat]);

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [chatHistory]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        className="flex-1"
      >
        <ChatHeader />

        <FlatList
          ref={flatListRef}
          data={chatHistory}
          renderItem={({ item }) => (
            <ChatMessage 
              item={item} 
              onFeedbackPress={() => {
                setCurrentFeedback(item);
                setShowFeedbackModal(true);
              }} 
            />
          )}
          keyExtractor={item => item.id.toString()}
          className="flex-1"
          ListFooterComponent={isTyping ? TypingIndicator : null}
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