//path: app/(root)/chat/Chat.tsx
import React, { useEffect, useRef, useCallback } from 'react';
import { View, FlatList, KeyboardAvoidingView, Platform, Animated } from 'react-native';
import Text from '@/components/customText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
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
    setShowTopics, 
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
    popupMessage,
  } = useChatSession(true);

  const flatListRef = useRef<FlatList<ChatMessageType>>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    initializeChat();
  }, []);

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

  useEffect(() => {
    if (popupMessage) {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(1400),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [popupMessage, fadeAnim]);

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
          aiName="Sophia"
          chatType="main"
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

        {popupMessage && (
          <Animated.View 
            style={{
              opacity: fadeAnim,
              position: 'absolute',
              bottom: 100,
              left: 20,
              right: 20,
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              padding: 10,
              borderRadius: 5,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: 'white', textAlign: 'center' }}>{popupMessage}</Text>
          </Animated.View>
        )}
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