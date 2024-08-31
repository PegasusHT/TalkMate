import React from 'react';
import { View, Text, Image } from 'react-native';
import { Pencil, BookA } from 'lucide-react-native';

const roleplayIcon = require('../../assets/roleplayIcon.png');

const RoleplayFeature = () => {
  return (
    <View className="bg-white w-11/12 rounded-lg overflow-hidden shadow-xl mt-6"
      style={{ borderWidth: 1.2, borderColor: '#e5e7eb' }}
      >
      <View className="p-4">
        <Text className="text-2xl font-bold mb-4">Roleplays</Text>
        <View className="flex-row">
          <View className="flex-1 mr-4">
            <View className="flex-row mb-3">
              <View className="flex-row items-center bg-gray-100 rounded-full px-2 py-1 mr-2">
                <BookA size={16} color="#6b7280" />
                <Text className="ml-1 text-gray-600">Vocabulary</Text>
              </View>
              <View className="flex-row items-center bg-gray-100 rounded-full px-2 py-1">
                <Pencil size={16} color="#6b7280" />
                <Text className="ml-1 text-gray-600">Writing</Text>
              </View>
            </View>
            <Text className="text-cl font-semibold mb-2 mr-36">
              Practice through useful real-life scenarios.
            </Text>
            <Text className="text-sm text-gray-500 mr-36">
              Various settings from daily conversations to creative dialogues.
            </Text>
          </View>
        </View>
      </View>
      <Image
        source={roleplayIcon}
        className="absolute right-0 bottom-0 w-36 h-44"
      />
    </View>
  );
};

export default RoleplayFeature;