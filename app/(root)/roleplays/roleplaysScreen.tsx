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
import { ArrowRight, ArrowLeft, ChevronDown } from 'lucide-react-native';
import { useNavigation } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import axios from 'axios';
import ENV from '@/utils/envConfig';
import { ScenarioDetails } from '@/types/roleplays';

const convoIcon = require('@/assets/images/store-manager.jpeg');

const { BACKEND_URL } = ENV;

interface CharacterCard {
  mainCategory: string;
  role: string;
}

interface ConversationScenario {
  id: number;
  title: string;
  image: string;
  isNew?: boolean;
  context: string;
}

interface OptionsData {
  mainCategories: { [key: string]: string[] };
  roles: string[];
}

type RootStackParamList = {
  scenarioDetail: { scenarioDetails: ScenarioDetails };
};

const RoleplaysScreen: React.FC = () => {
  const [card, setCard] = useState<CharacterCard>({ mainCategory: '', role: '' });
  const [scenarios, setScenarios] = useState<ConversationScenario[]>([]);
  const [optionsData, setOptionsData] = useState<OptionsData | null>(null);
  const [availableRoles, setAvailableRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'mainCategory' | 'role'>('mainCategory');
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const fetchOptions = useCallback(async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/scenarios/options`);
      setOptionsData(response.data);
    } catch (error) {
      console.error('Error fetching options:', error);
    }
  }, []);

  useEffect(() => {
    fetchOptions();
  }, [fetchOptions]);

  const fetchScenarios = useCallback(async (role: string) => {
    setLoading(true);
    try {
      const response = await axios.get(`${BACKEND_URL}/scenarios/by-role`, {
        params: { role }
      });
      setScenarios(response.data);
    } catch (error) {
      console.error('Error fetching scenarios:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleScenarioPress = async (id: number) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/scenarios/${id}`);
      const scenarioDetails: ScenarioDetails = response.data;
      navigation.navigate('scenarioDetail', { scenarioDetails });
    } catch (error) {
      console.error('Error fetching scenario details:', error);
    }
  };

  const openModal = (type: 'mainCategory' | 'role') => {
    setModalType(type);
    setModalVisible(true);
  };

  const selectOption = (option: string) => {
    if (modalType === 'mainCategory') {
      setCard({ mainCategory: option, role: '' });
      if (optionsData) {
        setAvailableRoles(optionsData.mainCategories[option] || []);
      }
    } else {
      setCard(prev => ({ ...prev, role: option }));
      fetchScenarios(option);
    }
    setModalVisible(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-100 p-4">
      <TouchableOpacity className="pb-4" onPress={() => navigation.goBack()}>
        <ArrowLeft size={28} color="black" />
      </TouchableOpacity>
      <View className="bg-white rounded-xl border-[0.6px] p-4 mb-8 mt-6">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-xl font-semibold">Character Card</Text>
        </View>
        <View className="flex-row items-center mt-2">
          <TouchableOpacity 
            onPress={() => openModal('mainCategory')} 
            className="flex-1 flex-row justify-between items-center bg-white border-t-[0.2px] p-2 rounded-md"
          >
            <Text>{card.mainCategory || 'Select a category'}</Text>
            <ChevronDown color="black" size={20} />
          </TouchableOpacity>
        </View>
        <View className="flex-row items-center mt-2">
          <TouchableOpacity 
            onPress={() => openModal('role')} 
            className={`flex-1 flex-row justify-between items-center p-2 border-t-[0.2px] rounded-md ${!card.mainCategory ? 'opacity-50' : ''}`}
            disabled={!card.mainCategory}
          >
            <Text>{card.role || 'Select a role'}</Text>
            <ChevronDown color="black" size={20} />
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#6366f1" />
      ) : (
        <ScrollView contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          {scenarios.map((scenario) => (
            <TouchableOpacity
              key={scenario.id}
              onPress={() => handleScenarioPress(scenario.id)}
              className="w-[48%] bg-indigo-700 rounded-xl mb-4 overflow-hidden"
            >
              <Image source={convoIcon} className="w-full h-32" />
              <View className="flex-row justify-between items-center mt-2 p-2">
                <Text className="text-white font-semibold w-5/6">
                  {`${scenario.title}`}
                </Text>
                <ArrowRight color="white" size={20} />
              </View>
              <Text className="text-white text-xs px-2 pb-2">{scenario.context}</Text>
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
        <View className="flex-1 justify-end">
          <View className="bg-white rounded-t-xl border-2 p-4">
            <Text className="text-xl font-semibold border-b-2 mb-4">{`Select ${modalType}`}</Text>
            <FlatList
              data={modalType === 'mainCategory' ? Object.keys(optionsData?.mainCategories || {}) : availableRoles}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  onPress={() => selectOption(item)}
                  className="py-2 border-b"
                >
                  <Text className="text-lg">{item}</Text>
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