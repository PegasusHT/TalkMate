import React, { useState } from 'react';
import { View, TouchableOpacity, Image, Text, Modal } from 'react-native';
import { ArrowLeft, MoreVertical, MessageCirclePlus, Info } from 'lucide-react-native';
import { useNavigation } from 'expo-router';

const faceIcon = require('@/assets/icons/chat-face.png');

interface ChatHeaderProps {
  aiName: string;
  chatType: 'roleplay' | 'main';
  onNewChat?: () => void;
  onInfoPress?: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ aiName, chatType, onNewChat, onInfoPress }) => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);

  const handleNewSession = () => {
    setModalVisible(false);
    onNewChat && onNewChat();
  };

  return (
    <>
      <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeft size={24} color="#000" />
          </TouchableOpacity>
          <Image
            source={faceIcon}
            className="w-10 h-10 ml-2 mr-[-10px]"
          />
          <View className="absolute left-16 bottom-0 w-3 h-3 bg-green-500 rounded-full" />
          <Text className="text-lg font-semibold ml-4">{aiName}</Text>
        </View>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <MoreVertical size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity 
          className="flex-1 bg-opacity-50"
          activeOpacity={1} 
          onPress={() => setModalVisible(false)}
        >
          <View className="absolute bottom-0 left-0 right-0 bg-slate-400 opacity-90 h-44 justify-center">
            <View className="w-28 h-1 mt-[-30px] bg-white rounded-full self-center mb-4" />
            <View className="mx-4 bg-white rounded-3xl pb-5">
              <TouchableOpacity
                onPress={handleNewSession}
                className="flex-row items-center mx-6 mt-6 mb-2"
              >
                <View className="bg-blue-100 rounded-full p-2 mr-4">
                  <MessageCirclePlus color="#3b82f6" size={30} />
                </View>
                <View>
                  <Text className="text-black text-base font-semibold">Start a new chat</Text>
                  <Text className="text-gray-500 text-sm">End the current chat and start a new one.</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
      
    </>
  );
};

export default ChatHeader;