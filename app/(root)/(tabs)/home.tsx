//app/(root)/(tabs)/home.tsx
import React from 'react';
import { ScrollView, View, TouchableOpacity, Alert } from 'react-native';
import Text from '@/components/customText';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootTabParamList } from '@/types/types'; 
import ChatFeature from '@/components/chatPage';
import RoleplayFeature from '@/components/roleplays';
import CustomScenarioFeature from '@/components/customScenario';
import { useUser } from '@/context/UserContext';
import { Lock } from 'lucide-react-native';
import { router } from 'expo-router';

type Props = NativeStackScreenProps<RootTabParamList, 'Home'>;

const HomeScreen: React.FC<Props> = () => {
  const { isGuest, isPremium } = useUser();
  
  const handleFeaturePress = (feature: string) => {
    if (feature === 'chat') {
      router.push('/chat');
    } else if (!isPremium) {
      Alert.alert(
        "Premium Feature",
        "This feature is only available for premium users. Would you like to upgrade?",
        [
          { text: "No, thanks", style: "cancel" },
          { text: "Yes, upgrade", onPress: () => router.push('/premium') }
        ]
      );
    } else {
      router.push(`/${feature.toLowerCase().replace(/\s+/g, '-')}`);
    }
  };

  return (
    <ScrollView className='flex-1 bg-slate-100' 
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <View className="flex-1 justify-start items-center bg-slate-100 pt-8">
        <View className='w-full pl-4'>
          <Text className="text-3xl font-NunitoBold text-primary-500">
            Practice modes
          </Text>
        </View>

        <TouchableOpacity onPress={() => handleFeaturePress('chat')} className="w-full justify-start items-center">
          <ChatFeature />
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => handleFeaturePress('roleplays')} 
          className={`w-full ${!isPremium ? 'opacity-70' : ''}`}
        >
          <View className="relative justify-start items-center">
            <RoleplayFeature />
            {!isPremium && (
              <View className="absolute top-6 right-4 bg-gray-800 rounded-lg p-2">
                <Lock size={20} color="white" />
              </View>
            )}
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => handleFeaturePress('customScenario')} 
          className={`w-full ${!isPremium ? 'opacity-70' : ''}`}
        >
          <View className="relative justify-start items-center">
            <CustomScenarioFeature />
            {!isPremium && (
              <View className="absolute top-6 right-4 bg-gray-800 rounded-lg p-2">
                <Lock size={20} color="white" />
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default HomeScreen;