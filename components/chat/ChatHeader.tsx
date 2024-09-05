import React from 'react';
import { View, TouchableOpacity, Image, Text } from 'react-native';
import { ArrowLeft, MoreVertical } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

const faceIcon = require('@/assets/icons/chat-face.png');

const ChatHeader: React.FC = () => {
  const navigation = useNavigation();

  return (
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
  );
};

export default ChatHeader;