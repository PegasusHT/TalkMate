import React from 'react';
import { View, TextInput, TouchableOpacity, SafeAreaView, Animated } from 'react-native';
import Text from '@/components/customText';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Sparkles, ArrowLeft } from 'lucide-react-native';
import axios from 'axios';
import ENV from '@/utils/envConfig';
import { useScenarioSuggester } from '@/components/customScenarios/scenarioSuggester';
import ResponsiveIcon from '@/components/customUtils/responsiveIcon';
import { usePopupMessage } from '@/hooks/Chat/usePopupMessage';

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
    const { scenario, setScenario, aiName, setAiName, aiRole, setAiRole, handleSuggest } = useScenarioSuggester();
    const navigation = useNavigation<CustomScenarioNavigationProp>();
    const { popupMessage, showPopup } = usePopupMessage();
  
    const handleStart = async () => {
      if (!scenario.trim()) {
        showPopup("Please enter a scenario or use the 'Suggest' button before starting.");
        return;
      }

      try {
        // Parse the scenario to extract key information
        const parsedScenario = parseScenario(scenario);
    
        const finalAiRole = aiRole || parsedScenario.aiRole || 'English practice partner';
        const finalAiName = aiName || parsedScenario.aiName || 'Lisa';

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
        showPopup("An error occurred while creating the scenario. Please try again.");
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
      if (text.startsWith("I'm") && text.includes("is approaching")) {
        // Parse suggested scenario format
        const userRoleMatch = text.match(/I'm (a |an )?(.*?) who/i);
        if (userRoleMatch) parsed.userRole = userRoleMatch[2];
    
        const aiNameMatch = text.match(/(.*?),\s*a/);
        if (aiNameMatch) parsed.aiName = aiNameMatch[1];

        const aiRoleMatch = text.match(/a (.*?) is approaching/i);
        if (aiRoleMatch) parsed.aiRole = aiRoleMatch[1];
    
        const aiTraitsMatch = text.match(/seems to be (.*?)\./i);
        if (aiTraitsMatch) parsed.aiTraits = aiTraitsMatch[1];
    
        const objectivesMatch = text.match(/I'll try to (.*?)\./i);
        if (objectivesMatch) parsed.objectives = [objectivesMatch[1]];
      } else {
        // Parse free-form input
        parsed.userRole = "Language learner";
        parsed.aiName = aiName || "Lisa";
        parsed.aiRole = aiRole || "English practice partner";
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
    <SafeAreaView className="flex-1 bg-white ">
     <View className='flex-1 p-4 lg:px-8'>
      <TouchableOpacity className='lg:pt-4'
       onPress={() => navigation.goBack()}>
        <ResponsiveIcon
          icon={{ type: 'lucide', icon: ArrowLeft }}
          responsiveSize={{
            sm: 24,
            md: 24,
            lg: 46,
          }}
          color='black'
        />
      </TouchableOpacity>
      <View className='flex justify-center items-center pt-4'>
        <Text className="text-2xl lg:text-4xl lg:mt-8 font-gilroy-bold text-primary-500 mb-4 lg:mb-6">
          Create custom conversation
        </Text>
      </View>
      <Text className="text-lg mb-6 lg:text-2xl lg:mb-8">
        Enter any conversation topic or scenario you want to practice, or use the 'Suggest' button for a random scenario.
      </Text>
      <View className="bg-gray-100 border border-1 rounded-3xl
           pl-3 pr-2 pt-1 pb-12 mb-6 lg:pl-6 lg:pr-4 lg:pt-2 ">
            <TextInput
              className="text-lg lg:text-2xl h-36 lg:h-72 font-Nunito" 
              placeholder="What do you want to talk about?"
              value={scenario}
              onChangeText={setScenario}
              multiline
              numberOfLines={4}
            />
            <TouchableOpacity
              onPress={handleSuggest}
              className="absolute flex flex-row justify-center items-center bottom-2 right-2 bg-white rounded-full p-2 lg:p-3"
            >
              <Sparkles size={24} color="#4B5563"/>
              <Text className='lg:text-2xl lg:ml-2 font-NunitoSemiBold'>Suggest</Text>
            </TouchableOpacity>
          </View>
          <View className='flex-1'/>
          <TouchableOpacity
            onPress={handleStart}
            className="bg-primary-500 rounded-full py-3 px-6 lg:py-6 lg:mx-12 lg:mb-8"
          >
            <Text className="text-white text-center font-NunitoSemiBold text-lg lg:text-3xl">Start</Text>
          </TouchableOpacity>
         </View>
          {popupMessage && (
            <Animated.View 
                style={{
                    position: 'absolute',
                    bottom: '20%',
                    left: 20,
                    right: 20,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    padding: 10,
                    borderRadius: 5,
                    alignItems: 'center',
                }}
            >
              <Text style={{ color: 'white', textAlign: 'center' }}>{popupMessage}</Text>
            </Animated.View>
          )}
        </SafeAreaView>
    );
};

export default CustomScenarioUI;