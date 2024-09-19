import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  ScrollView, 
  ActivityIndicator, 
  Modal, 
  FlatList
} from 'react-native';
import { ArrowRight, ArrowLeft, ChevronDown, X } from 'lucide-react-native';
import { useNavigation } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import axios from 'axios';
import ENV from '@/utils/envConfig';

const { BACKEND_URL } = ENV;

interface CharacterCard {
  name: string;
  role: string;
  context: string;
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
  scenarioDetail: { scenarioDetails: ScenarioDetails };
};

interface ConversationScenario {
  id: number;
  title: string;
  image: string;
  isNew?: boolean;
}

interface OptionsData {
  roles: string[];
  contexts: string[];
  roleContextMap: { [key: string]: string[] };
}

const RoleplaysScreen: React.FC = () => {
  const [card, setCard] = useState<CharacterCard>({ name: 'Jimmy', role: '', context: '' });
  const [scenarios, setScenarios] = useState<ConversationScenario[]>([]);
  const [optionsData, setOptionsData] = useState<OptionsData | null>(null);
  const [availableContexts, setAvailableContexts] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'role' | 'context'>('role');
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const fetchOptions = useCallback(async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/scenarios/options`);
      const data: OptionsData = response.data;
      setOptionsData(data);
      setAvailableContexts(data.contexts);
    } catch (error) {
      console.error('Error fetching options:', error);
    }
  }, []);

  useEffect(() => {
    fetchOptions();
  }, [fetchOptions]);

  const fetchScenarios = useCallback(async () => {
    if (!card.role || !card.context) return;
    setLoading(true);
    try {
      const response = await axios.get(`${BACKEND_URL}/scenarios/by-role-context`, {
        params: { role: card.role, context: card.context }
      });
      setScenarios(response.data);
    } catch (error) {
      console.error('Error fetching scenarios:', error);
    } finally {
      setLoading(false);
    }
  }, [card.role, card.context]);

  useEffect(() => {
    fetchScenarios();
  }, [fetchScenarios]);

  const handleScenarioPress = async (id: number) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/scenarios/${id}`);
      const scenarioDetails: ScenarioDetails = response.data;
      navigation.navigate('scenarioDetail', { scenarioDetails });
    } catch (error) {
      console.error('Error fetching scenario details:', error);
    }
  };

  const openModal = (type: 'role' | 'context') => {
    setModalType(type);
    setModalVisible(true);
  };

  const selectOption = (option: string) => {
    if (modalType === 'role') {
      setCard(prev => ({ ...prev, role: option, context: '' }));
      if (optionsData) {
        setAvailableContexts(optionsData.roleContextMap[option] || []);
      }
    } else {
      setCard(prev => ({ ...prev, context: option }));
    }
    setModalVisible(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-blue-600 p-4">
      <TouchableOpacity className="pb-4" onPress={() => navigation.goBack()}>
        <ArrowLeft size={28} color="#FFFFFF" />
      </TouchableOpacity>
      <View className="bg-indigo-700 rounded-xl p-4 mb-8 mt-6">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-white text-xl font-semibold">Character Card</Text>
        </View>
        <Text className="text-white">Name: {card.name}</Text>
        <View className="flex-row items-center mt-2">
          <TouchableOpacity 
            onPress={() => openModal('role')} 
            className="flex-1 flex-row justify-between items-center bg-indigo-800 p-2 rounded-md"
          >
            <Text className="text-white">{card.role || 'Select a role'}</Text>
            <ChevronDown color="white" size={20} />
          </TouchableOpacity>
        </View>
        <View className="flex-row items-center mt-2">
          <TouchableOpacity 
            onPress={() => openModal('context')} 
            className={`flex-1 flex-row justify-between items-center bg-indigo-800 p-2 rounded-md ${!card.role ? 'opacity-50' : ''}`}
            disabled={!card.role}
          >
            <Text className="text-white">{card.context || 'Select a context'}</Text>
            <ChevronDown color="white" size={20} />
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#FFFFFF" />
      ) : (
        <ScrollView contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          {scenarios.map((scenario) => (
            <TouchableOpacity
              key={scenario.id}
              onPress={() => handleScenarioPress(scenario.id)}
              className="w-[48%] bg-indigo-700 rounded-xl mb-4 overflow-hidden"
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
        </ScrollView>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black bg-opacity-50">
          <View className="bg-indigo-800 rounded-t-xl p-4">
            <Text className="text-white text-xl font-semibold mb-4">{`Select ${modalType}`}</Text>
            <FlatList
              data={modalType === 'role' ? optionsData?.roles : availableContexts}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  onPress={() => selectOption(item)}
                  className="py-2 border-b border-indigo-700"
                >
                  <Text className="text-white text-lg">{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity 
              onPress={() => setModalVisible(false)}
              className="mt-4 bg-indigo-600 p-3 rounded-md"
            >
              <Text className="text-white text-center font-semibold">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default RoleplaysScreen;