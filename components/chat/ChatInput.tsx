//components/chat/ChatInput.tsx
import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, ActivityIndicator, LayoutChangeEvent } from 'react-native';
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
  const [isMultiline, setIsMultiline] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const [inputWidth, setInputWidth] = useState(0);
  const [inputHeight, setInputHeight] = useState(0);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.measure((x, y, width, height, pageX, pageY) => {
        setInputWidth(width);
        setInputHeight(height);
      });
    }
  }, []);

  const handleContentSizeChange = (event: {nativeEvent: {contentSize: {height: number}}}) => {
    const { height } = event.nativeEvent.contentSize;
    const newIsMultiline = height > inputHeight/4;
    setIsMultiline(newIsMultiline);
  };

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
    <View 
      className={`flex-row mb-[-4px] items-center p-2 border-t border-gray-200 mx-2 ${isMultiline ? 'min-h-[100px]' : 'h-20'}`}
      onLayout={(event: LayoutChangeEvent) => {
        setInputWidth(event.nativeEvent.layout.width - 80);
        setInputHeight(event.nativeEvent.layout.height);
      }}
    >
      <TextInput
        ref={inputRef}
        className={`flex-1 bg-gray-100 px-4 py-2 mr-2 h-full ${isMultiline ? 'rounded-xl py-2' : 'rounded-full py-5'}`}
        style={{ minHeight: 60, maxHeight: 160 }}
        value={message}
        onChangeText={setMessage}
        multiline={true}
        placeholder="Type your message..."
        onContentSizeChange={handleContentSizeChange}
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