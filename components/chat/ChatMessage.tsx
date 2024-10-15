import React from 'react';
import { View, TouchableOpacity, ActivityIndicator } from 'react-native';
import Text from '@/components/customText';
import { Volume2, Pause, Check, AlertTriangle } from 'lucide-react-native';
import { ChatMessage as ChatMessageType } from '@/types/chat';
import { primaryColor } from '@/constant/color';
import ResponsiveIcon from '@/components/customUtils/responsiveIcon';
import { getDeviceSize } from '@/components/customUtils/deviceSizeUtils';

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
  const deviceSize = getDeviceSize();
  const handleAudioPress = () => {
    onAudioPress(item.id, item.content, item.audioUri);
  };

  const renderAudioButton = () => {
    if (isAudioLoading) {
      return (
        <ActivityIndicator 
          size={deviceSize === 'lg' || deviceSize === 'xl' ? 'large' : 'small'} 
          color={primaryColor} 
        />
      )
    } else if (isPlaying) {
      return (
        <ResponsiveIcon
          icon={{ type: 'lucide', icon: Pause }}
          responsiveSize={{
            sm: 22,
            md: 24,
            lg: 40,
          }}
          color={primaryColor}
        />
      );
    } else {
      return (
        <ResponsiveIcon
          icon={{ type: 'lucide', icon: Volume2 }}
          responsiveSize={{
            sm: 22,
            md: 24,
            lg: 40,
          }}
          color={primaryColor}
        />
      );
    }
  };

  const renderFeedbackIcon = () => {
    if (item.isLoading) {
      return (
        <ActivityIndicator 
          size={deviceSize === 'lg' || deviceSize === 'xl' ? 'large' : 'small'} 
          color="#007AFF" 
          style={{ marginRight: 8 }} 
        />
      )
    } else if (item.feedback) {
      if (item.feedback.isCorrect) {
        return (
          <ResponsiveIcon
            icon={{ type: 'lucide', icon: Check }}
            responsiveSize={{
              sm: 22,
              md: 24,
              lg: 40,
            }}
            color="#008000"
            className="mr-2 lg:mr-4"
          />
        );
      } else {
        return (
          <TouchableOpacity className="mr-2 lg:mr-4 rounded-lg" onPress={onFeedbackPress}>
            <ResponsiveIcon
              icon={{ type: 'lucide', icon: AlertTriangle }}
              responsiveSize={{
                sm: 22,
                md: 24,
                lg: 40,
              }}
              color="#FFA500"
            />
          </TouchableOpacity>
        );
      }
    }
    return null;
  };

  return (
    <View className=''>
      <View className={`flex flex-row items-center px-1 lg:px-4 m-2 lg:m-5 ${item.role === 'user' ? 'justify-end' : 'justify-start'}`}>
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
        <View className={`rounded-2xl p-4 lg:p-6 max-w-[80%] ${item.role === 'user' ? 'bg-primary-500' : 'bg-[#F5F5F5]'}`}>
          <Text 
            className={`${item.role === 'user' ? 'text-white' : 'text-black'} lg:text-2xl`}
          >
            {item.content}
          </Text>
        </View>
        {item.role === 'model' && (
          <TouchableOpacity className="ml-2 lg:ml-4" onPress={handleAudioPress} disabled={isAudioLoading}>
            {renderAudioButton()}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default ChatMessage;