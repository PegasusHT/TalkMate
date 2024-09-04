import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList,
    KeyboardAvoidingView, Platform, Image, Modal, ActivityIndicator
 } from 'react-native';
import { ArrowLeft, MoreVertical, Send, Mic, Volume2, Check, AlertOctagon, ChevronRight } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BACKEND_URL } from '@env';

const faceIcon = require('@/assets/icons/chat-face.png');

type ChatMessage = {
  role: 'user' | 'model';
  content: string;
  id: number;
  feedback?: {
    correctedVersion: string;
    explanation: string;
  };
  isLoading?: boolean;
};

type FeedbackModalProps = {
  isVisible: boolean;
  onClose: () => void;
  feedback: ChatMessage['feedback'];
  originalMessage: string;
};

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isVisible, onClose, feedback, originalMessage }) => {
    if (!feedback) return null;
  
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={isVisible}
        onRequestClose={onClose}
      >
        <TouchableOpacity 
          className="flex-1 justify-end" 
          onPress={onClose} 
        >
         <View className="justify-end p-5 h-4/6 bg-slate-300 bg-opacity-50">
          <View className="bg-white h-full rounded-t-3xl p-6">
            <View className="w-12 h-1 bg-gray-300 rounded-full self-center mb-4" />
            <Text className="text-2xl font-bold mb-4">Feedback</Text>
            <View className="bg-yellow-100 rounded-lg p-4 mb-4">
              <Text className="font-semibold mb-2">Your message</Text>
              <Text>{originalMessage}</Text>
            </View>
            <View className="bg-green-100 rounded-lg p-4 mb-4">
              <Text className="font-semibold mb-2">Corrected message</Text>
              <Text>{feedback.correctedVersion}</Text>
            </View>
            <View className="bg-orange-100 rounded-lg p-4 mb-4">
              <Text className="font-semibold mb-2">Explanation</Text>
              <Text>{feedback.explanation}</Text>
            </View>
            <TouchableOpacity onPress={onClose} className="bg-blue-500 p-4 rounded-full flex-row justify-center items-center">
              <Text className="text-white text-center font-bold mr-2">Learn more</Text>
              <ChevronRight color="white" size={20} />
            </TouchableOpacity>
          </View>
         </View>
        </TouchableOpacity>
       
      </Modal>
    );
  };

const MAX_TOKENS = 4000; // Adjust based on your AI model's limits

const ChatSession = () => {
  const navigation = useNavigation();
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState<ChatMessage | null>(null);
  const hasInitialized = useRef(false);
  const flatListRef = useRef<FlatList>(null);
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
      // Update the user message to show error state
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

  useEffect(() => {
    initializeChat();
  }, [initializeChat]);

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [chatHistory]);

  const renderMessage = useCallback(({ item }: { item: ChatMessage }) => (
    <View className=''>
      <View className={`flex flex-row items-center p-2 m-2 ${item.role === 'user' ? 'justify-end' : 'justify-start'}`}>
        {item.role === 'user' && (
          <View className='flex flex-row'>
            {item.isLoading ? (
              <ActivityIndicator size="small" color="#007AFF" style={{ marginRight: 8 }} />
            ) : item.feedback && !item.feedback.explanation.includes('pppassed') ? (
              <TouchableOpacity 
                className="mr-2 bg-yellow-300 rounded-lg"
                onPress={() => {
                  setCurrentFeedback(item);
                  setShowFeedbackModal(true);
                }}
              >
                <AlertOctagon size={22} color="#000000" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity className="mr-2">
                <Check size={22} color="#008000" />
              </TouchableOpacity>
            )}
            <TouchableOpacity className="mr-2">
              <Volume2 size={22} color="#007AFF" />
            </TouchableOpacity>
          </View>
        )}
        <View className={`rounded-lg p-3 max-w-[80%] ${item.role === 'user' ? 'bg-blue-500' : 'bg-gray-200'}`}>
          <Text className={item.role === 'user' ? 'text-white' : 'text-black'}>{item.content}</Text>
        </View>
        {item.role === 'model' && (
          <TouchableOpacity className="ml-2">
            <Volume2 size={22} color="#007AFF" />
          </TouchableOpacity>
        )}
      </View>
      {showTopics && (
        <View className="absolute right-0 top-24 flex flex-col">
          {['Fun', 'Interesting', 'You decide'].map(topic => (
            <TouchableOpacity key={topic} onPress={() => handleTopicSelect(topic)} className="mr-2 mb-2 rounded-3xl bg-blue-500">
              <Text className="text-white px-3 py-1">{topic}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  ), [showTopics, handleTopicSelect]);

  const TypingIndicator = () => (
    <View className="flex flex-row items-center space-x-2 p-3 bg-gray-200 rounded-lg self-start m-2">
      <View className="w-3 h-3 bg-gray-500 rounded-full" style={{ opacity: 0.6 }} />
      <View className="w-3 h-3 bg-gray-500 rounded-full" style={{ opacity: 0.8 }} />
      <View className="w-3 h-3 bg-gray-500 rounded-full" />
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        className="flex-1"
      >
        <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <ArrowLeft size={24} color="#000" />
            </TouchableOpacity>
            <Image
              source={faceIcon}
              className="w-10 h-10 ml-2 mr-[-10px]"
            />
            <View className="absolute right-8 bottom-0 w-3 h-3 bg-green-500 rounded-full" />
            <Text className="text-lg font-semibold ml-4">Mia</Text>
          </View>
          <TouchableOpacity>
            <MoreVertical size={24} color="#000" />
          </TouchableOpacity>
        </View>

        <FlatList
          ref={flatListRef}
          data={chatHistory}
          renderItem={renderMessage}
          keyExtractor={item => item.id.toString()}
          className="flex-1"
          ListFooterComponent={isTyping ? TypingIndicator : null}
        />

        <View className="flex-row items-center p-2 border-t border-gray-200 h-20 mx-2">
          <TextInput
            className="flex-1 bg-gray-100 rounded-full px-4 py-2 mr-2 h-full"
            value={message}
            onChangeText={setMessage}
            placeholder="Type a message..."
          />
          <TouchableOpacity onPress={message ? handleSend : handleMicPress}>
            {message ? (
              <Send size={28} color="#007AFF" />
            ) : (
              <Mic size={28} color="#007AFF" />
            )}
          </TouchableOpacity>
        </View>
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