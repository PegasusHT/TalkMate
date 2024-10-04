import React, { useState } from 'react';
import { View, TouchableOpacity, Image, Modal } from 'react-native';
import Text from '@/components/customText';
import { ArrowLeft, MoreVertical, MessageCirclePlus, Info } from 'lucide-react-native';
import { useNavigation } from 'expo-router';

const faceIcon = require('@/assets/icons/chat-face.png');
const secondaryColor = "#FFC132";

interface ChatHeaderProps {
  aiName: string;
  chatType: 'roleplay' | 'main';
  onNewChat?: () => void;
  onInfoPress?: () => void;
  stopRecording: () => Promise<void>; 
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ aiName, chatType, onNewChat, onInfoPress, stopRecording }) => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);

  const handleNewSession = () => {
    setModalVisible(false);
    onNewChat && onNewChat();
  };
  const handleBackPress = async () => {
    await stopRecording(); 
    navigation.goBack();
  };

  return (
    <>
      <View className="flex-row items-center justify-between pb-1 px-4 border-b mb-2 border-gray-200">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={handleBackPress}>
            <ArrowLeft size={24} color="#000" />
          </TouchableOpacity>
          <Image
            source={faceIcon}
            className="w-10 h-10 ml-2 mr-[-10px]"
          />
          <View className="absolute left-16 bottom-0 w-3 h-3 bg-green-500 rounded-full" />
          <Text className="text-lg font-NunitoSemiBold ml-4">{aiName.charAt(0).toUpperCase() + aiName.slice(1)}</Text>
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
                <View className="bg-primary-500 rounded-full p-2 mr-4">
                  <MessageCirclePlus color={'white'} size={30} />
                </View>
                <View>
                  <Text className="text-black text-b=ase font-NunitoSemiBold">Start a new chat</Text>
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