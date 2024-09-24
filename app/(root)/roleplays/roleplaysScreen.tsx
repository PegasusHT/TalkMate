import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  ScrollView, 
  ActivityIndicator, 
  Modal, 
  FlatList,
  PanResponder,
  Animated
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
  const [modalType, setModalType] = useState<'category' | 'role'>('category');
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [modalY] = useState(new Animated.Value(0));

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      if (gestureState.dy > 0) {
        modalY.setValue(gestureState.dy);
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dy > 50) {
        closeModal();
      } else {
        Animated.spring(modalY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    },
  });

  const closeModal = () => {
    Animated.timing(modalY, {
      toValue: 300,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
      modalY.setValue(0);
    });
  };

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

  const openModal = (type: 'category' | 'role') => {
    setModalType(type);
    setModalVisible(true);
  };

  const selectOption = (option: string) => {
    if (modalType === 'category') {
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
            onPress={() => openModal('category')} 
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
                  Convo {`${scenario.id}`}: {`${scenario.title}`}
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
        onRequestClose={closeModal} 
      >
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}
          activeOpacity={1}
          onPressOut={closeModal}
        >
          <Animated.View
            {...panResponder.panHandlers}
            style={{
              transform: [{ translateY: modalY }],
              backgroundColor: 'white',
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              padding: 20,
              marginTop: 'auto',
            }}
          >
            <View className="w-16 h-1 bg-gray-300 rounded-full self-center mb-4" />
            <Text className="text-xl font-semibold mb-4 mt-4 text-center">
              {`Select ${modalType === 'category' ? 'a career field' : 'a role'}`}
            </Text>
            <FlatList
              data={modalType === 'category' ? Object.keys(optionsData?.mainCategories || {}) : availableRoles}
              keyExtractor={(item) => item} className='mb-6'
              renderItem={({ item }) => (
                <TouchableOpacity 
                  onPress={() => selectOption(item)}
                  className="flex-row items-center py-3 border-b border-gray-200"
                >
                  <View className={`w-6 h-6 rounded-full border-2 mr-4 ${
                    (modalType === 'category' ? card.mainCategory : card.role) === item
                      ? 'bg-gray-200 border-indigo-700'
                      : 'border-gray-300'
                  }`}>
                    {(modalType === 'category' ? card.mainCategory : card.role) === item && (
                      <View className="w-3 h-3 rounded-full bg-indigo-700 m-auto" />
                    )}
                  </View>
                  <Text className={`text-lg ${
                    (modalType === 'category' ? card.mainCategory : card.role) === item
                      ? 'text-indigo-700 font-semibold'
                      : 'text-gray-800'
                  }`}>
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

export default RoleplaysScreen;