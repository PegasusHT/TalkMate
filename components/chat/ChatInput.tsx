import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Send, Mic } from 'lucide-react-native';

type ChatInputProps = {
  message: string;
  setMessage: (message: string) => void;
  handleSend: () => void;
  handleMicPress: () => void;
};

const ChatInput: React.FC<ChatInputProps> = ({ message, setMessage, handleSend, handleMicPress }) => {
  return (
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
  );
};

export default ChatInput;