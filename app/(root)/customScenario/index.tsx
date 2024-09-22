//app/(root)/customScenario/index.tsx
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Sparkles, ArrowLeft } from 'lucide-react-native';
import axios from 'axios';
import ENV from '@/utils/envConfig';
import { useScenarioSuggester } from '@/components/customScenarios/scenarioSuggester';

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
    const { scenario, setScenario, aiName, aiRole, handleSuggest } = useScenarioSuggester();
    const navigation = useNavigation<CustomScenarioNavigationProp>();
  
    const handleStart = async () => {
      try {
        // Parse the scenario to extract key information
        const parsedScenario = parseScenario(scenario);
    
        const finalAiName = aiName || parsedScenario.aiName || 'English practice partner';
        const finalAiRole = aiRole || parsedScenario.aiRole || 'English practice partner';
    
        const response = await axios.post(`${BACKEND_URL}/session`, {
          customScenario: scenario,
          aiName: finalAiName,
          role: finalAiRole,
          traits: parsedScenario.aiTraits || 'adaptive,helpful',
          context: 'Custom English practice scenario',
          userRole: parsedScenario.userRole || 'Language learner',
          objectives: parsedScenario.objectives || ['Practice English in a custom scenario'],
        });
    
        const { greetingMessage } = response.data;
    
        navigation.navigate('chatScene', {
          aiName: finalAiName,
          aiRole: finalAiRole,
          aiTraits: parsedScenario.aiTraits ? parsedScenario.aiTraits.split(',') : ['adaptive', 'helpful'],
          userRole: parsedScenario.userRole || 'Language learner',
          objectives: parsedScenario.objectives || ['Practice English in a custom scenario'],
          scenarioTitle: 'Custom Scenario',
          scenarioId: 'custom',
          initialMessage: greetingMessage,
        });
      } catch (error) {
        console.error('Error creating custom scenario session:', error);
        // Handle error (e.g., show an error message to the user)
      }
    };
  
    const parseScenario = (text: string) => {
      const parsed: {
        userRole?: string;
        aiName?: string;
        aiRole?: string;
        aiTraits?: string;
        objectives?: string[];
      } = {};
    
      // Check if it's a suggested scenario or free-form input
      if (text.startsWith("I'm") && text.includes("who is") && text.includes("is approaching")) {
        // Parse suggested scenario format
        const userRoleMatch = text.match(/I'm (a |an )?(.*?) who/i);
        if (userRoleMatch) parsed.userRole = userRoleMatch[2];
    
        const aiRoleMatch = text.match(/(?:A|An) (.*?) is approaching/i);
        if (aiRoleMatch) {
          parsed.aiRole = aiRoleMatch[1];
          parsed.aiName = aiRoleMatch[1];
        }
    
        const aiTraitsMatch = text.match(/They seem (.*?)\./i);
        if (aiTraitsMatch) parsed.aiTraits = aiTraitsMatch[1];
    
        const objectivesMatch = text.match(/I'll try to (.*?)\./i);
        if (objectivesMatch) parsed.objectives = [objectivesMatch[1]];
      } else {
        // Parse free-form input
        parsed.userRole = "Language learner";
        parsed.aiName = "English practice partner";
        parsed.aiRole = "English practice partner";
        parsed.aiTraits = "adaptive,helpful";
        parsed.objectives = ["Practice English in a custom scenario"];
    
        // Try to extract some context from the free-form input
        const words = text.toLowerCase().split(/\s+/);
        const contextWords = words.filter(word => word.length > 3);  // Simple filtering for potentially meaningful words
        if (contextWords.length > 0) {
          parsed.objectives?.push(`Discuss topics related to: ${contextWords.join(', ')}`);
        }
      }
    
      return parsed;
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
        Enter any conversation topic or scenario you want to practice, or use the 'Suggest' button for a random scenario.
      </Text>
      <View className="bg-gray-100 border border-1 rounded-3xl pl-3 pr-2 pt-1 pb-12 mb-6">
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