import React from 'react';
import { ScrollView,View, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootTabParamList } from './types'; 
import ChatFeature from '../components/home/ChatFeature';
import RoleplayFeature from '../components/home/Roleplay';
import CustomeScenarioFeature from '../components/home/CustomScenario';

type Props = NativeStackScreenProps<RootTabParamList, 'Home'>;

const HomeScreen: React.FC<Props> = () => {
  return (
    <ScrollView className='flex-1' 
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <View className="flex-1 justify-start items-center bg-slate-100 pt-12">
        <View className='w-full pl-4'>
          <Text className="text-3xl font-bold text-blue-600">
            Practice modes
          </Text>
        </View>

        <ChatFeature />

        <RoleplayFeature />

        <CustomeScenarioFeature />
      </View>
    </ScrollView>
  );
};

export default HomeScreen;