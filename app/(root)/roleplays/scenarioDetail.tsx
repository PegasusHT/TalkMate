import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Volume2, Clapperboard, Goal } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

interface ScenarioDetailProps {
  id: number;
  title: string;
  description: string;
  aiRole: {
    name: string;
    role: string;
    traits: string[];
    image: string;
    backgroundImage: string;
  };
  userRole: string;
  objectives: string[];
  usefulPhrases: {
    phrase: string;
    pronunciation: string;
  }[];
}

const ScenarioDetail: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const scenario: ScenarioDetailProps = route.params as ScenarioDetailProps;

  const handleStartConversation = () => {
    // Navigate to the conversation screen
    console.log('Start conversation');
  };

  const playAudio = (phrase: string) => {
    // Implement audio playback for the phrase
    console.log('Play audio for:', phrase);
  };

  return (
    <View className="flex-1">
      <ScrollView className="flex-1">
        <ImageBackground 
          source={{ uri: scenario.aiRole.backgroundImage }} 
          className="w-full h-64 justify-end"
        >
          <View className="flex-row justify-between items-end p-4 pb-0">
            <Image 
              source={{ uri: scenario.aiRole.image }} 
              className="w-32 h-32 rounded-full"
            />
            <View className="bg-gray-700 bg-opacity-80 rounded-lg p-3 mb-6 mr-6 w-2/5">
              <Text className="text-white font-semibold text-[20px] pb-2">AI's role: {scenario.aiRole.role}</Text>
              <View className="flex flex-wrap gap-1 mt-1">
                {scenario.aiRole.traits.map((trait, index) => (
                  <View key={index} className="bg-gray-600 rounded-full px-2">
                    <Text className="text-white text-sm">{trait}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </ImageBackground>
        
        <TouchableOpacity 
          className="absolute left-4 top-12 bg-gray-600 bg-opacity-50 rounded-full p-2" 
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <View className="px-4 mt-4 bg-indigo-900 rounded-2xl pt-6">
          <Text className="text-white text-3xl font-semibold mb-2">{scenario.title}</Text>
          <Text className="text-white mb-6">{scenario.description}</Text>

          <View className="mb-6">
            <View className='flex flex-row gap-2'>
              <Clapperboard size={16} color={'white'} />
              <Text className="text-white text-2lg font-semibold mb-2">Your Role</Text>
            </View>
            <Text className="text-white">{scenario.userRole}</Text>
          </View>

          <View className="mb-6 p-2 rounded-lg bg-pink-100 text">
            <View className="flex-row items-center mb-2">
              <Goal size={28} color={'#eb6207'} className='mx-2'/>
              <Text className="text-[#eb6207] text-3xl font-semibold">Objectives</Text>
            </View>
            {scenario.objectives.map((objective, index) => (
              <View key={index} className="flex-row items-center mb-2">
                <View className="w-2 h-2 bg-[#dd660c] mx-2 rounded-full mr-2" />
                <Text className="text-[#bf8d5f] mx-2 font-semibold" >{objective}</Text>
              </View>
            ))}
          </View>

          <View className="mb-6">
            <Text className="text-white text-xl font-semibold mb-2">Useful Phrases</Text>
            {scenario.usefulPhrases.map((phrase, index) => (
              <View key={index} className="bg-indigo-800 rounded-lg p-3 mb-3">
                <Text className="text-white font-semibold">{phrase.phrase}</Text>
                <Text className="text-gray-400 italic">{phrase.pronunciation}</Text>
                <TouchableOpacity onPress={() => playAudio(phrase.phrase)} className="absolute right-2 top-2">
                  <Volume2 color="white" size={20} />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <TouchableOpacity
            onPress={handleStartConversation}
            className="bg-blue-500 rounded-full py-3 px-6 mb-8"
          >
            <Text className="text-white text-center font-semibold text-lg">Start Conversation</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default ScenarioDetail;