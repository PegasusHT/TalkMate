import React from 'react';
import { View, Image } from 'react-native';
import Text from '@/components/customText';
import { Pencil, Book } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';

const ChatIcon = require('@/assets/icons/chatIcon.png');

const ChatFeature = () => {
  const navigation = useNavigation();
  const handlePress = () => {
    navigation.navigate('chat' as never);
  };

  return (
    <View className="bg-white w-11/12 rounded-lg overflow-hidden shadow-xl mt-6"
      style={{ borderWidth: 1.2, borderColor: '#e5e7eb' }}
      >
      <TouchableOpacity onPress={handlePress}>
      <View className="p-4">
        <Text className="text-2xl font-NunitoBold mb-4">Chat</Text>
        <View className="flex-row">
          <View className="flex-1 mr-4">
            <View className="flex-row mb-3">
              <View className="flex-row items-center bg-gray-100 rounded-full px-2 py-1 mr-2">
                <Pencil size={16} color="#6b7280" />
                <Text className="ml-1 text-gray-600">Writing</Text>
              </View>
              <View className="flex-row items-center bg-gray-100 rounded-full px-2 py-1">
                <Book size={16} color="#6b7280" />
                <Text className="ml-1 text-gray-600">Reading</Text>
              </View>
            </View>
            <Text className="text-cl font-NunitoSemiBold mb-2 mr-28">
              Enhance your language skills by chatting with our AI teacher.
            </Text>
            <Text className="text-sm text-gray-500">
              Pick a topic and get started.
            </Text>
          </View>
        </View>
      </View>
      <Image
        source={ChatIcon}
        className="absolute right-0 bottom-0 w-28 h-40"
      />
      </TouchableOpacity>
    </View>
    
  );
};

export default ChatFeature;