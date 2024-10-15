import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, TextInput, TouchableOpacity, ActivityIndicator, LayoutChangeEvent } from 'react-native';
import { Send, Mic, Trash2 } from 'lucide-react-native';
import RecordingAnimation from '@/components/chat/animation/recordingAnimation';
import { primaryColor } from '@/constant/color';
import ResponsiveView from '@/components/customUtils/responsiveView';
import ResponsiveText from '@/components/customUtils/responsiveText';
import ResponsiveIcon from '@/components/customUtils/responsiveIcon';

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
  isAudioLoading: boolean;
  isTyping: boolean;
  showPopup: (message: string) => void;
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
  isAudioLoading,
  isTyping,
  showPopup,
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

  const handleMicPressWithAudioStop = useCallback(async () => {
    if (isAudioLoading) {
      showPopup("Audio is currently loading. Please wait for it to finish before recording.");
      return;
    }
    if (isTyping) {
      showPopup("A message is being processed. Please wait before starting a new recording.");
      return;
    }
    await stopAllAudio();
    handleMicPress();
  }, [stopAllAudio, isAudioLoading, isTyping, showPopup, handleMicPress]);

  if (isProcessingAudio) {
    return (
      <ResponsiveView 
        className="flex-row items-center justify-center border-t border-gray-200 mx-2"
        responsiveStyle={{
          sm: { height: 80, padding: 8 },
          md: { height: 80, padding: 8 },
          lg: { height: 160, padding: 12 },
        }}
      >
        <ActivityIndicator size="large" color="#007AFF" />
      </ResponsiveView>
    );
  }

  if (isRecording) {
    return (
      <ResponsiveView 
        className="flex-row items-center justify-between border-t border-gray-200 mx-2"
        responsiveStyle={{
          sm: { height: 80, padding: 8 },
          md: { height: 80, padding: 8 },
          lg: { height: 180, padding: 12 },
        }}
      >
        <TouchableOpacity onPress={stopRecording} className="p-2">
          <ResponsiveIcon
            icon={{ type: 'lucide', icon: Trash2 }}
            responsiveSize={{
              sm: 28,
              md: 28,
              lg: 50,
            }}
            color="#FF3B30"
          />
        </TouchableOpacity>
        <View className="flex-1 items-center justify-center">
          <RecordingAnimation />
        </View>
        <TouchableOpacity onPress={sendAudio} className="p-2">
          <ResponsiveIcon
            icon={{ type: 'lucide', icon: Send }}
            responsiveSize={{
              sm: 28,
              md: 28,
              lg: 50,
            }}
            color="#007AFF"
          />
        </TouchableOpacity>
      </ResponsiveView>
    );
  }

  return (
    <ResponsiveView 
      className={`flex-row mb-[-4px] lg:mb-6 p-2 lg:p-6 lg:h-40 items-center border-t border-gray-200 mx-2 ${isMultiline ? 'min-h-[100px]' : ''}`}
      onLayout={(event: LayoutChangeEvent) => {
        setInputWidth(event.nativeEvent.layout.width - 80);
        setInputHeight(event.nativeEvent.layout.height);
      }}
    >
      <TextInput
        ref={inputRef}
        className={`flex-1 lg:h-full lg:text-3xl bg-gray-100 mr-2 min-h-[60px] max-h-[160px] lg:min-h-100 lg:max-h-340 ${isMultiline ? 'rounded-xl lg:rounded-2xl py-2 ' : 'rounded-full py-5 px-2 lg:py-8 lg:px-8'}`}
        value={message}
        onChangeText={setMessage}
        multiline={true}
        placeholder="Type your message..."
        onContentSizeChange={handleContentSizeChange}
      />
      <TouchableOpacity className='lg:ml-4'
       onPress={message ? handleSend : handleMicPressWithAudioStop}>
        <ResponsiveIcon
          icon={{ type: 'lucide', icon: message ? Send : Mic }}
          responsiveSize={{
            sm: 28,
            md: 28,
            lg: 50,
          }}
          color={primaryColor}
        />
      </TouchableOpacity>
    </ResponsiveView>
  );
};

export default ChatInput;