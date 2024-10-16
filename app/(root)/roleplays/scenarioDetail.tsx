//app/(root)/roleplays/scenarioDetail.tsx
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
import ResponsiveIcon from '@/components/customUtils/responsiveIcon';

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

  const traitsArray = scenarioDetails.aiMate?.traits || [];

  return (
    <View className="flex-1">
      <ScrollView className="flex-1 bg-white" bounces={false}>
        <ImageBackground 
          source={bgImage} 
          className="w-full h-64 lg:h-[400] justify-end items-end"
        >        
          <View className="bg-gray-700 bg-opacity-80 rounded-lg p-3 lg:p-6 mb-6 lg:mb-12 mr-6 w-2/5">
            <Text className="text-white font-NunitoSemiBold text-[20px] lg:text-3xl pb-2">
              {scenarioDetails.aiMate?.role || 'AI Assistant'}
            </Text>
            <View className="flex flex-wrap lg:flex-row gap-1 mt-1 lg:mt-3">
              {traitsArray.map((trait, index) => (
                <View key={index} className="bg-gray-600 rounded-full px-2 lg:m-2">
                  <Text className="text-white text-sm lg:text-xl lg:mx-2 lg:my-1 ">{trait}</Text>
                </View>
              ))}
            </View>
          </View>
        </ImageBackground>
        
        <TouchableOpacity 
          className="absolute left-4 lg:left-10 top-14 lg:top-16 bg-gray-600 bg-opacity-50 rounded-full p-2 lg:p-3" 
          onPress={() => navigation.goBack()}
        >
          <ResponsiveIcon
            icon={{ type: 'lucide', icon: ArrowLeft }}
            responsiveSize={{
              sm: 24,
              md: 24,
              lg: 48,
            }}
            color="#FFFFFF"
          />
        </TouchableOpacity>

        <View className="px-4 mt-4 rounded-2xl pt-6 lg:px-12">
          <Text style={{color: subColor}} className="text-3xl lg:text-6xl lg:pt-2 font-NunitoSemiBold mb-2">
            {scenarioDetails.title}
          </Text>
          <Text className="mb-6 lg:mb-8 lg:text-xl">{scenarioDetails.description}</Text>

          <View className="mb-6 lg:mb-8">
            <View className='flex flex-row gap-2'>
              <ResponsiveIcon
                icon={{ type: 'lucide', icon: Clapperboard }}
                responsiveSize={{
                  sm: 16,
                  md: 16,
                  lg: 32,
                }}
                color={subColor}
              />
              <Text style={{color: subColor}} className="text-xl lg:text-3xl font-NunitoSemiBold mb-2">Your Role</Text>
            </View>
            <Text className="lg:text-xl">{scenarioDetails.userRole}</Text>
          </View>

          <View className="mb-6 lg:mb-8 p-2 lg:p-4 bg-slate-100 rounded-lg text">
            <View className="flex-row items-center mb-2">
              {/* <Goal size={28} color={'#FFC132'} className='mx-2'/> */}
              <ResponsiveIcon
                icon={{ type: 'lucide', icon: Goal }}
                responsiveSize={{
                  sm: 28,
                  md: 28,
                  lg: 44,
                }}
                color={'black'}
                className='mx-2 opacity-90'
              />
              <Text className="text-3xl lg:text-5xl lg:pt-6">Objectives</Text>
            </View>
            {scenarioDetails.objectives.map((objective, index) => (
              <View key={index} className="flex-row items-center mb-2 lg:mb-4">
                <View className="bg-black opacity-70 w-2 h-2 lg:w-3 lg:h-3 mx-2 lg:mx-4 rounded-full mr-2" />
                <Text className=" mx-2 lg:mx-3 font-NunitoLight lg:text-xl" >{objective}</Text>
              </View>
            ))}
          </View>

          <View className="mb-6 lg:mb-8">
            <Text className=" text-xl lg:text-4xl mb-2">Useful Phrases</Text>
            {scenarioDetails.usefulPhrases.map((phrase, index) => (
              <View key={index} className="bg-slate-100 rounded-lg p-3 lg:p-5 mb-3">
                <Text className=" font-Nunito pr-5 lg:text-xl">{phrase.phrase}</Text>
                <Text className="text-gray-400 italic lg:text-xl">{phrase.pronunciation}</Text>
                <TouchableOpacity 
                  onPress={() => handleAudioPress(phrase.phrase, index)} 
                  className="absolute right-3 top-3"
                >
                  {playingAudioId === index ? (
                    isAudioLoading ? (
                      <ActivityIndicator size="small" color="black" />
                    ) : (
                      <ResponsiveIcon
                        icon={{ type: 'lucide', icon: Pause }}
                        responsiveSize={{
                          sm: 20,
                          md: 20,
                          lg: 40,
                        }}
                        color={'black'}
                      />
                    )
                  ) : (
                    <ResponsiveIcon
                        icon={{ type: 'lucide', icon: Volume2 }}
                        responsiveSize={{
                          sm: 20,
                          md: 20,
                          lg: 36,
                        }}
                        color={'black'}
                      />
                  )}
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <TouchableOpacity
            onPress={handleStartConversation}
            className="bg-primary-500 rounded-full py-3 lg:py-6 px- mb-8 lg:mb-12 lg:mx-4"
          >
            <Text className="text-white text-center font-NunitoSemiBold text-lg lg:text-2xl">Start Conversation</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default ScenarioDetail;