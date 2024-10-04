//app/(root)/roleplays/chat.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, FlatList, KeyboardAvoidingView, Platform, Modal, ScrollView, Animated } from 'react-native';
import Text from '@/components/customText';
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
import { ObjectId } from 'mongodb';

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
    triggerScrollToEnd,
    scrollToEndTrigger,
    popupMessage,
    showPopup,
} = useChatSession(false, scenarioId, {
    aiName,
    aiRole,
    scenarioTitle,
    userRole, 
    objectives
  });

  const flatListRef = useRef<FlatList<ChatMessageType>>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [contentHeight, setContentHeight] = useState(0);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);

  useEffect(() => {
    if (!greetingFetched.current) {
      greetingFetched.current = true;
      initializeChat(scenarioId);
    }
  }, [scenarioId, initializeChat]);

  const scrollToEnd = useCallback((animated = true) => {
    if (flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated });
      }, 100);
    }
  }, []);

  useEffect(() => {
    if (chatHistory.length > 0 && contentHeight > scrollViewHeight) {
      scrollToEnd();
    }
  }, [chatHistory, contentHeight, scrollViewHeight, scrollToEnd]);

  useEffect(() => {
    if (scrollToEndTrigger) {
      scrollToEnd();
    }
  }, [scrollToEndTrigger, scrollToEnd]);

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
        Animated.delay(2700), 
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
          onContentSizeChange={(width, height) => {
            setContentHeight(height);
            if (height > scrollViewHeight) {
              scrollToEnd();
            }
          }}
          onLayout={(event) => {
            setScrollViewHeight(event.nativeEvent.layout.height);
          }}
        />

        <ChatInput
          message={message}
          setMessage={setMessage}
          handleSend={handleSend}
          handleMicPress={handleMicPress}
          isAudioLoading={isAudioLoading}
          isTyping={isTyping}
          showPopup={showPopup}
          isRecording={isRecording}
          stopRecording={stopRecording}
          sendAudio={sendAudio}
          isProcessingAudio={isProcessingAudio}
          stopAllAudio={stopAllAudio}
        />

        {popupMessage && (
          <Animated.View className='rounded-2xl'
            style={{
              opacity: fadeAnim,
              position: 'absolute',
              bottom: 100,
              left: 20,
              right: 20,
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              padding: 10,
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

export default Chat;