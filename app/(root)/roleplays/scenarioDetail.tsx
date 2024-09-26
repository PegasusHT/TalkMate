import React from 'react';
import { View, Image, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import Text from '@/components/customText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Volume2, Clapperboard, Goal, Pause } from 'lucide-react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAudioPlayer } from '@/hooks/Audio/useAudioPlayer';
import { ActivityIndicator } from 'react-native';
import { ScenarioDetails } from '@/types/roleplays';
import { ObjectId } from 'mongodb';

const bgImage = require('@/assets/images/store-manager-bg.jpeg');
const subColor = 'black';

type RootStackParamList = {
  ScenarioDetail: { scenarioDetails: ScenarioDetails };
  chat: { 
    aiName: string;
    aiRole: string;
    aiTraits: string[];
    userRole: string;
    objectives: string[];
    scenarioTitle: string;
    scenarioId: ObjectId;
  };
};

type ScenarioDetailRouteProp = RouteProp<RootStackParamList, 'ScenarioDetail'>;
type ScenarioDetailNavigationProp = StackNavigationProp<RootStackParamList, 'ScenarioDetail'>;

const ScenarioDetail: React.FC = () => {
  const navigation = useNavigation<ScenarioDetailNavigationProp>();
  const route = useRoute<ScenarioDetailRouteProp>();
  const { scenarioDetails } = route.params;
  const { playAudio, stopAudio, playingAudioId, isAudioLoading } = useAudioPlayer();

  const handleStartConversation = () => {
    navigation.navigate('chat', {
      aiName: scenarioDetails.aiMate?.name || 'AI Assistant',
      aiRole: scenarioDetails.aiMate?.role || 'Assistant',
      aiTraits: scenarioDetails.aiMate?.traits || [],
      userRole: scenarioDetails.userRole,
      objectives: scenarioDetails.objectives,
      scenarioTitle: scenarioDetails.title,
      scenarioId: scenarioDetails._id,
    });
  };

  const handleAudioPress = (phrase: string, id: number) => {
    if (playingAudioId === id) {
      stopAudio();
    } else {
      playAudio(id, phrase);
    }
  };

  // The traits are already an array based on our updated type definition
  const traitsArray = scenarioDetails.aiMate?.traits || [];

  return (
    <View className="flex-1">
      <ScrollView className="flex-1 bg-white" bounces={false}>
        <ImageBackground 
          source={bgImage} 
          className="w-full h-64 justify-end items-end"
        >        
          <View className="bg-gray-700 bg-opacity-80 rounded-lg p-3 mb-6 mr-6 w-2/5">
            <Text className="text-white font-NunitoSemiBold text-[20px] pb-2">
              {scenarioDetails.aiMate?.role || 'AI Assistant'}
            </Text>
            <View className="flex flex-wrap gap-1 mt-1">
              {traitsArray.map((trait, index) => (
                <View key={index} className="bg-gray-600 rounded-full px-2">
                  <Text className="text-white text-sm">{trait}</Text>
                </View>
              ))}
            </View>
          </View>
        </ImageBackground>
        
        <TouchableOpacity 
          className="absolute left-4 top-14 bg-gray-600 bg-opacity-50 rounded-full p-2" 
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <View className="px-4 mt-4 rounded-2xl pt-6">
          <Text style={{color: subColor}} className="text-3xl font-NunitoSemiBold mb-2">
            {scenarioDetails.title}
          </Text>
          <Text className="mb-6">{scenarioDetails.description}</Text>

          <View className="mb-6">
            <View className='flex flex-row gap-2'>
              <Clapperboard size={16} color={subColor} />
              <Text style={{color: subColor}} className="text-2lg font-NunitoSemiBold mb-2">Your Role</Text>
            </View>
            <Text className="">{scenarioDetails.userRole}</Text>
          </View>

          <View className="mb-6 p-2 bg-slate-100 rounded-lg text">
            <View className="flex-row items-center mb-2">
              {/* <Goal size={28} color={'#FFC132'} className='mx-2'/> */}
              <Goal size={28} color={'black'} className='mx-2 opacity-90'/>
              <Text className="text-3xl ">Objectives</Text>
            </View>
            {scenarioDetails.objectives.map((objective, index) => (
              <View key={index} className="flex-row items-center mb-2">
                <View className="bg-black opacity-70 w-2 h-2 mx-2 rounded-full mr-2" />
                <Text className=" mx-2 font-NunitoLight" >{objective}</Text>
              </View>
            ))}
          </View>

          <View className="mb-6">
            <Text className=" text-xl d mb-2">Useful Phrases</Text>
            {scenarioDetails.usefulPhrases.map((phrase, index) => (
              <View key={index} className="bg-slate-100 rounded-lg p-3 mb-3">
                <Text className=" font-Nunito pr-5">{phrase.phrase}</Text>
                <Text className="text-gray-400 italic">{phrase.pronunciation}</Text>
                <TouchableOpacity 
                  onPress={() => handleAudioPress(phrase.phrase, index)} 
                  className="absolute right-2 top-2"
                >
                  {playingAudioId === index ? (
                    isAudioLoading ? (
                      <ActivityIndicator size="small" color="white" />
                    ) : (
                      <Pause color="black" size={20} />
                    )
                  ) : (
                    <Volume2 color="black" size={20} />
                  )}
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <TouchableOpacity
            onPress={handleStartConversation}
            className="bg-primary-500 rounded-full py-3 px-6 mb-8"
          >
            <Text className="text-white text-center font-NunitoSemiBold text-lg">Start Conversation</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default ScenarioDetail;