import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { ArrowRight, ArrowLeft } from 'lucide-react-native';
import { useNavigation } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack'; 

interface RolePlayingCard {
  name: string;
  careerField: string;
  position: string;
}

interface ScenarioDetails {
  id: number;
  title: string;
  description: string;
  aiRole: {
    name: string;
    role: string;
    traits: string[];
    image: string;
  };
  userRole: string;
  objectives: string[];
  usefulPhrases: {
    phrase: string;
    pronunciation: string;
  }[];
}
type RootStackParamList = {
  scenarioDetail: ScenarioDetails; 
};

interface ConversationScenario {
  id: number;
  title: string;
  image: string;
  isNew?: boolean;
}

const initialCard: RolePlayingCard = {
  name: 'Player',
  careerField: 'Finance and Banking',
  position: 'Retail banker',
};

const conversationScenarios: ConversationScenario[] = [
  { id: 1, title: 'Job interview', image: 'https://example.com/job-interview.jpg', isNew: true },
  { id: 2, title: 'First day at work', image: 'https://example.com/first-day.jpg' },
  { id: 3, title: 'Reporting to the Branch Director', image: 'https://example.com/reporting.jpg', isNew: true },
  { id: 4, title: 'Asking for a raise', image: 'https://example.com/raise.jpg', isNew: true },
  // Add more scenarios as needed
];

const RoleplaysUI: React.FC = () => {
  const [card, setCard] = useState<RolePlayingCard>(initialCard);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>(); 

  const handleChange = () => {
    // Implement logic to change the role-playing card
    console.log('Change card');
  };

  const handleScenarioPress = (id: number) => {
  // Fetch the full scenario details based on the id
  const scenarioDetails: ScenarioDetails = {
    id: id,
    title: "First day at work",
    description: "You enter a bustling bank, greeted by the Risk Manager. The atmosphere is professional yet welcoming. What are you waiting for? Get familiar with the environment and learn your role.",
    aiRole: {
      name: "Alex",
      role: "Risk Manager",
      traits: ["decisive", "practical", "smart"],
      image: "https://example.com/risk-manager.jpg"
    },
    userRole: "Retail banker",
    objectives: [
      "Introduce yourself to the Risk Manager",
      "Learn about bank protocols and systems",
      "Seek guidance on your responsibilities as a Retail Banker"
    ],
    usefulPhrases: [
      {
        phrase: "Good day! I'm a new Retail Banker.",
        pronunciation: "/gʊd deɪ aɪm ə njuː ˈriːteɪl ˈbæŋkər/"
      },
      {
        phrase: "This is my first day at work.",
        pronunciation: "/ðɪs ɪz maɪ fɜːrst deɪ æt wɜːrk/"
      },
      {
        phrase: "I'm so excited to start my work.",
        pronunciation: "/aɪm soʊ ɪkˈsaɪtɪd tuː stɑːrt maɪ wɜːrk/"
      }
    ]
  };

  navigation.navigate('scenarioDetail', scenarioDetails);
};

  return (
    <SafeAreaView className="flex-1 bg-indigo-900 px-4">     
      <TouchableOpacity className='pb-4'
       onPress={() => navigation.goBack()}>
        <ArrowLeft size={28} color="#FFFF" />
      </TouchableOpacity> 
      <View className="bg-indigo-800 rounded-xl p-4 mb-8 mt-6">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-white text-xl font-semibold">Role-playing Card</Text>
          <TouchableOpacity onPress={handleChange} className="bg-blue-500 px-3 py-1 rounded-full">
            <Text className="text-white">Change</Text>
          </TouchableOpacity>
        </View>
        <Text className="text-white">Name: {card.name}</Text>
        <Text className="text-white">Career field: {card.careerField}</Text>
        <Text className="text-white">Position: {card.position}</Text>
      </View>

      <View className="flex-row flex-wrap justify-between">
        {conversationScenarios.map((scenario) => (
          <TouchableOpacity
            key={scenario.id}
            onPress={() => handleScenarioPress(scenario.id)}
            className="w-[48%] bg-indigo-800 rounded-xl mb-4 overflow-hidden"
          >
            <Image source={{ uri: scenario.image }} className="w-full h-32" />
            <View className="flex-row justify-between items-center mt-2 p-2">
                <Text className="text-white font-semibold w-5/6">
                    {`Convo ${scenario.id}: ${scenario.title}`}
                </Text>
                <ArrowRight color="white" size={20} />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

export default RoleplaysUI;