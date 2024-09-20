import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Sparkles, ArrowLeft } from 'lucide-react-native';
import axios from 'axios';
import ENV from '@/utils/envConfig';

const { BACKEND_URL } = ENV;

type RootStackParamList = {
  chatScene: { 
    aiName: string;
    aiRole: string;
    aiTraits: string[];
    userRole: string;
    objectives: string[];
    scenarioTitle: string;
    scenarioId: number | string;
    initialMessage?: string;
  };
};

type CustomScenarioNavigationProp = StackNavigationProp<RootStackParamList, 'chatScene'>;

const CustomScenarioUI = () => {
  const [scenario, setScenario] = useState('');
  const navigation = useNavigation<CustomScenarioNavigationProp>();

  const handleStart = async () => {
    try {
      const response = await axios.post(`${BACKEND_URL}/session`, {
        customScenario: scenario,
        aiName: 'CustomMate',
        role: 'English practice partner',
        traits: 'adaptive,helpful',
        context: 'Custom English practice scenario',
      });

      const { greetingMessage } = response.data;

      navigation.navigate('chatScene', {
        aiName: 'CustomMate',
        aiRole: 'English practice partner',
        aiTraits: ['adaptive', 'helpful'],
        userRole: 'Language learner',
        objectives: ['Practice English in a custom scenario'],
        scenarioTitle: 'Custom Scenario',
        scenarioId: 'custom',
        initialMessage: greetingMessage,
      });
    } catch (error) {
      console.error('Error creating custom scenario session:', error);
      // Handle error (e.g., show an error message to the user)
    }
  };

  const handleSuggest = () => {
    // Implement suggestion functionality here
    console.log('Suggest button pressed');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
     <View className='flex-1 p-4'>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <ArrowLeft size={24} color="#000" />
      </TouchableOpacity>
      <View className='flex justify-center items-center pt-4'>
        <Text className="text-2xl font-bold text-blue-800 mb-4">Create custom conversation</Text>
      </View>
      <Text className="text-lg mb-6">
        Enter the conversation scenario you want, and the intelligent AI will analyze your request and respond accurately.
      </Text>
      <View className="bg-gray-100 border border-1 rounded-3xl p-4 mb-6">
        <TextInput
          className="text-lg h-32" 
          placeholder="What do you want to talk about?"
          value={scenario}
          onChangeText={setScenario}
          multiline
          numberOfLines={4}
        />
        <TouchableOpacity
          onPress={handleSuggest}
          className="absolute flex flex-row justify-center items-center bottom-2 right-2 bg-white rounded-full p-2"
        >
          <Sparkles size={24} color="#4B5563" />
          <Text className='font-semibold'>Suggest</Text>
        </TouchableOpacity>
      </View>
      <View className='flex-1'/>
      <TouchableOpacity
        onPress={handleStart}
        className="bg-blue-500 rounded-full py-3 px-6"
      >
        <Text className="text-white text-center font-semibold text-lg">Start</Text>
      </TouchableOpacity>
     </View>
    </SafeAreaView>
  );
};

export default CustomScenarioUI;