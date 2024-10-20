import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, FlatList, KeyboardAvoidingView, Platform, Animated } from 'react-native';
import Text from '@/components/customText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useRoute, RouteProp } from '@react-navigation/native';
import axios from 'axios';
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
  chatScene: { 
    aiName: string;
    aiRole: string;
    aiTraits: string[];
    userRole: string;
    objectives: string[];
    scenarioTitle: string;
    scenarioId: ObjectId;
    initialMessage?: string;
  };
};

type ChatSceneRouteProp = RouteProp<RootStackParamList, 'chatScene'>;

const ChatScene: React.FC = () => {
  const route = useRoute<ChatSceneRouteProp>();
  const { aiName, aiRole, aiTraits, userRole, objectives, scenarioTitle, scenarioId, initialMessage } = route.params;
  const greetingFetched = useRef(false);
  const greetingPlayed = useRef(false);

  const {
    message,
    setMessage,
    chatHistory,
    setChatHistory,
    isTyping,
    setIsTyping,
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
    popupMessage,
    triggerScrollToEnd,
    scrollToEndTrigger,
    showPopup,
    isScreenActive
  } = useChatSession(false, scenarioId, {
    aiName,
    aiRole,
    scenarioTitle,
    userRole, objectives
  });

  const flatListRef = useRef<FlatList<ChatMessageType>>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [contentHeight, setContentHeight] = useState(0);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);

  useEffect(() => {
    const fetchGreeting = async () => {
      if (!greetingFetched.current) {
        greetingFetched.current = true;
        if (initialMessage) {
          await sendMessage(initialMessage, true);
        } else {
          await initializeChat(scenarioId);
        }
      }
    };

    fetchGreeting();
  }, [scenarioId, initializeChat, initialMessage, sendMessage]);

  useEffect(() => {
    if (chatHistory.length > 0 && !greetingPlayed.current) {
      const greetingMessage = chatHistory[0];
      playAudio(greetingMessage.id, greetingMessage.content);
      greetingPlayed.current = true;
    }
  }, [chatHistory, playAudio]);

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

  useFocusEffect(
    useCallback(() => {
      return () => {
        stopAllAudio();
      };
    }, [stopAllAudio])
  );

  useEffect(() => {
    return () => {
      stopAllAudio();
    };
  }, [stopAllAudio]);

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

  const startNewCustomChat = useCallback(async () => {
    await stopAllAudio();
    setChatHistory([]);
    setMessage('');
    setIsTyping(false);
    setShowFeedbackModal(false);
    setCurrentFeedback(null);

    try {
      const response = await axios.post(`${BACKEND_URL}/session`, {
        customScenario: scenarioTitle,
        aiName,
        role: aiRole,
        traits: aiTraits.join(','),
        context: 'Custom English practice scenario',
        userRole,
        objectives,
      });

      const { greetingMessage } = response.data;
      
      if (greetingMessage) {
        const greetingMessageObject: ChatMessageType = { 
          role: 'model', 
          content: greetingMessage, 
          id: Date.now()
        };
        setChatHistory([greetingMessageObject]);
        
        await playAudio(greetingMessageObject.id, greetingMessageObject.content);
      }
    } catch (error) {
      console.error('Error creating new custom session:', error);
      // Implement error handling (e.g., show an error message to the user)
    }
  }, [aiName, aiRole, aiTraits, userRole, objectives, scenarioTitle, stopAllAudio, playAudio, setChatHistory, setMessage]);

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
          onNewChat={startNewCustomChat}
          stopRecording={stopRecording}
          isScreenActive={isScreenActive}
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

export default ChatScene;