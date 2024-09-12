import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { ArrowRight, ArrowLeft } from 'lucide-react-native';
import { useNavigation } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack'; 

interface CharacterCard {
  name: string;
  role: string;
  context?: string;
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

const initialCard: CharacterCard = {
  name: 'Player',
  role: 'Student',
  context: 'Grocery shopping',
};

const conversationScenarios: ConversationScenario[] = [
  { id: 1, title: 'Finding directions', image: 'https://example.com/job-interview.jpg', isNew: true },
  { id: 2, title: 'Buying groceries', image: 'https://example.com/groceries.jpg' },
  { id: 3, title: 'Ordering food delivery', image: 'https://example.com/food-delivery.jpg', isNew: true },
  { id: 4, title: 'Buying a car', image: 'https://example.com/car-dealership.jpg', isNew: true },
  // Add more scenarios as needed
];

const RoleplaysUI: React.FC = () => {
  const [card, setCard] = useState<CharacterCard>(initialCard);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>(); 

  const handleChange = () => {
    // Implement logic to change the character card
    console.log('Change card');
  };

  const handleScenarioPress = (id: number) => {
    // Fetch the full scenario details based on the id
    const scenarioDetails: ScenarioDetails = {
      id: id,
      title: "Buying groceries",
      description: "You're at a local supermarket, ready to buy groceries for the week. The store is bustling with activity, and you need to navigate the aisles, find items, and interact with store staff.",
      aiRole: {
        name: "Sam",
        role: "Store Assistant",
        traits: ["helpful", "patient", "knowledgeable"],
        image: "https://example.com/store-assistant.jpg"
      },
      userRole: "Customer",
      objectives: [
        "Greet the store assistant and ask for help",
        "Inquire about specific product locations",
        "Ask about any ongoing promotions or discounts"
      ],
      usefulPhrases: [
        {
          phrase: "Excuse me, could you help me find...?",
          pronunciation: "/ɪkˈskjuːz miː, kʊd juː help miː faɪnd.../"
        },
        {
          phrase: "Are there any special offers today?",
          pronunciation: "/ɑːr ðɛr ˈɛni ˈspɛʃəl ˈɔːfərz təˈdeɪ/"
        },
        {
          phrase: "Where can I find the fresh produce section?",
          pronunciation: "/wɛr kæn aɪ faɪnd ðə frɛʃ ˈprɒdjuːs ˈsɛkʃən/"
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
          <Text className="text-white text-xl font-semibold">Character Card</Text>
          <TouchableOpacity onPress={handleChange} className="bg-blue-500 px-3 py-1 rounded-full">
            <Text className="text-white">Change</Text>
          </TouchableOpacity>
        </View>
        <Text className="text-white">Name: {card.name}</Text>
        <Text className="text-white">Role: {card.role}</Text>
        {card.context && <Text className="text-white">Context: {card.context}</Text>}
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