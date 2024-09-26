import React from 'react';
import { View, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Send, Mic, Trash2 } from 'lucide-react-native';
import RecordingAnimation from '@/components/chat/animation/recordingAnimation';
import { primaryColor } from '@/constant/color';

type ChatInputProps = {
  message: string;
  setMessage: (message: string) => void;
  handleSend: () => void;
  handleMicPress: () => void;
  isRecording: boolean;
  stopRecording: () => void;
  sendAudio: () => void;
  isProcessingAudio: boolean;
  stopAllAudio: () => Promise<void>;
};

const ChatInput: React.FC<ChatInputProps> = ({
  message,
  setMessage,
  handleSend,
  handleMicPress,
  isRecording,
  stopRecording,
  sendAudio,
  isProcessingAudio,
  stopAllAudio, 
}) => {
  if (isProcessingAudio) {
    return (
      <View className="flex-row items-center justify-center p-2 border-t border-gray-200 h-20 mx-2">
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (isRecording) {
    return (
      <View className="flex-row items-center justify-between p-2 border-t border-gray-200 h-20 mx-2">
        <TouchableOpacity onPress={stopRecording} className="p-2">
          <Trash2 size={28} color="#FF3B30" />
        </TouchableOpacity>
        <View className="flex-1 items-center justify-center">
          <RecordingAnimation />
        </View>
        <TouchableOpacity onPress={sendAudio} className="p-2">
          <Send size={28} color="#007AFF" />
        </TouchableOpacity>
      </View>
    );
  }

  const handleMicPressWithAudioStop = async () => {
    await stopAllAudio();
    handleMicPress();
  };

  return (
    <View className="flex-row items-center p-2 border-t border-gray-200 h-20 mx-2">
      <TextInput
        className="flex-1 bg-gray-100 rounded-full px-4 py-2 mr-2 h-full"
        value={message}
        onChangeText={setMessage}
        placeholder="Type your message..."
      />
      <TouchableOpacity onPress={message ? handleSend : handleMicPressWithAudioStop}>
        {message ? (
          <Send size={28} color={primaryColor} />
        ) : (
          <Mic size={28} color={primaryColor} />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default ChatInput;