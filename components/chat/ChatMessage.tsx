import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Volume2, Pause, Check, AlertTriangle } from 'lucide-react-native';
import { ChatMessage as ChatMessageType } from '@/types/chat';

type ChatMessageProps = {
  item: ChatMessageType;
  onFeedbackPress: () => void;
  onAudioPress: (messageId: number, text: string, audioUri?: string) => void;
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
    onAudioPress(item.id, item.content, item.audioUri);
  };

  const renderAudioButton = () => {
    if (isAudioLoading) {
      return <ActivityIndicator size="small" color="#007AFF" />;
    } else if (isPlaying) {
      return <Pause size={22} color="#007AFF" />;
    } else {
      return <Volume2 size={22} color="#007AFF" />;
    }
  };

  const renderFeedbackIcon = () => {
    if (item.isLoading) {
      return <ActivityIndicator size="small" color="#007AFF" style={{ marginRight: 8 }} />;
    } else if (item.feedback) {
      if (item.feedback.explanation.includes("ppassed")) {
        return <Check size={22} className='mr-2' color="#008000" />;
      } else {
        return (
          <TouchableOpacity className="mr-2 rounded-lg" onPress={onFeedbackPress}>
            <AlertTriangle size={22} color="#FFA500" />
          </TouchableOpacity>
        );
      }
    }
    return null;
  };

  return (
    <View className=''>
      <View className={`flex flex-row items-center px-2 m-2 ${item.role === 'user' ? 'justify-end' : 'justify-start'}`}>
        {item.role === 'user' && (
          <View className='flex flex-row'>
            {renderFeedbackIcon()}
            {item.audioUri && (
              <TouchableOpacity className="mr-2" onPress={handleAudioPress} disabled={isAudioLoading}>
                {renderAudioButton()}
              </TouchableOpacity>
            )}
          </View>
        )}
        <View className={`rounded-lg p-3 max-w-[80%] ${item.role === 'user' ? 'bg-indigo-700' : 'bg-gray-200'}`}>
          <Text className={item.role === 'user' ? 'text-white' : 'text-black'}>{item.content}</Text>
        </View>
        {item.role === 'model' && (
          <TouchableOpacity className="ml-2" onPress={handleAudioPress} disabled={isAudioLoading}>
            {renderAudioButton()}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default ChatMessage;