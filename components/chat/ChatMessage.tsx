import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Volume2, Pause, Check, AlertOctagon } from 'lucide-react-native';
import { ChatMessage as ChatMessageType } from '@/types/chat';

type ChatMessageProps = {
  item: ChatMessageType;
  onFeedbackPress: () => void;
  onAudioPress: (messageId: number, text: string) => void;
  isPlaying: boolean;
  isAudioLoading: boolean;
};

const ChatMessage: React.FC<ChatMessageProps> = ({ 
  item, 
  onFeedbackPress, 
  onAudioPress, 
  isPlaying, 
  isAudioLoading 
}) => {
  const handleAudioPress = () => {
    onAudioPress(item.id, item.content);
  };

  const renderAudioButton = () => {
    if (isPlaying) {
      return <Pause size={22} color="#007AFF" />;
    } else if (isAudioLoading) {
      return <ActivityIndicator size="small" color="#007AFF" />;
    } else {
      return <Volume2 size={22} color="#007AFF" />;
    }
  };

  return (
    <View className=''>
      <View className={`flex flex-row items-center p-2 m-2 ${item.role === 'user' ? 'justify-end' : 'justify-start'}`}>
        {item.role === 'user' ? (
          <View className='flex flex-row'>
            {item.isLoading ? (
              <ActivityIndicator size="small" color="#007AFF" style={{ marginRight: 8 }} />
            ) : item.feedback && !item.feedback.explanation.includes('pppassed') ? (
              <TouchableOpacity 
                className="mr-2 bg-yellow-300 rounded-lg"
                onPress={onFeedbackPress}
              >
                <AlertOctagon size={22} color="#000000" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity className="mr-2">
                <Check size={22} color="#008000" />
              </TouchableOpacity>
            )}
            <TouchableOpacity className="mr-2" onPress={handleAudioPress}>
              {renderAudioButton()}
            </TouchableOpacity>
          </View>
        ) : null}
        <View className={`rounded-lg p-3 max-w-[80%] ${item.role === 'user' ? 'bg-blue-500' : 'bg-gray-200'}`}>
          <Text className={item.role === 'user' ? 'text-white' : 'text-black'}>{item.content}</Text>
        </View>
        {item.role === 'model' && (
          
          <TouchableOpacity className="ml-2" onPress={handleAudioPress}>
            {renderAudioButton()}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default ChatMessage;