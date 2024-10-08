import React from 'react';
import { View, Image } from 'react-native';
import Text from '@/components/customText';
import { Mic, Pen } from 'lucide-react-native';
const CustomIcon = require('@/assets/icons/customIcon.png');
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useUser } from '@/context/UserContext';

const CustomeScenarioFeature = () => {
  const navigation = useNavigation();
  const { isPremium } = useUser();

  const handlePress = () => {
    if (isPremium) {
      navigation.navigate('customScenario' as never);
    }
  };

  return (
    <View className="bg-white w-11/12 rounded-lg overflow-hidden shadow-xl my-6"
      style={{ borderWidth: 1.2, borderColor: '#e5e7eb' }}
      >
      <TouchableOpacity onPress={handlePress}>
      <View className="p-4">
        <Text className="text-2xl font-NunitoBold mb-4">Custom Scenarios</Text>
        <View className="flex-row">
          <View className="flex-1 mr-4">
            <View className="flex-row mb-3">
              <View className="flex-row items-center bg-gray-100 rounded-full px-2 py-1 mr-2">
                <Mic size={16} color="#6b7280" />
                <Text className="ml-1 text-gray-600">Speaking</Text>
              </View>
              <View className="flex-row items-center bg-gray-100 rounded-full px-2 py-1">
                <Pen size={16} color="#6b7280" />
                <Text className="ml-1 text-gray-600">Writing</Text>
              </View>
            </View>
            <Text className="text-cl font-NunitoSemiBold mb-2 mr-28">
              Create your own scenarios and practice with our AI teacher.
            </Text>
            <Text className="text-sm text-gray-500 mr-32">
                Practice speaking and writing with custom scenarios.
            </Text>
          </View>
        </View>
      </View>
      <Image
        source={CustomIcon}
        className="absolute right-0 bottom-0 w-32 h-44"
      />
      </TouchableOpacity>
    </View>
  );
};

export default CustomeScenarioFeature;