import React, { useState } from 'react';
import { View, TouchableOpacity, Modal, FlatList } from 'react-native';
import Text from '@/components/customText';
import { Search, ChevronDown } from 'lucide-react-native';

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'vi', name: 'Vietnamese', flag: '🇻🇳' },
];

const TargetLanguageSelector = () => {
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);
  const [modalVisible, setModalVisible] = useState(false);

  const toggleModal = () => setModalVisible(!modalVisible);

  const selectLanguage = (language: any) => {
    setSelectedLanguage(language);
    setModalVisible(false);
  };

  return (
    <View className="mt-2">
      <TouchableOpacity 
        onPress={toggleModal}
        className="bg-white rounded-2xl p-3 px-4 flex-row items-center justify-between"
      >
        <View className="flex-row items-center">
          <Text className="text-2xl mr-2">{selectedLanguage.flag}</Text>
          <Text>{selectedLanguage.name}</Text>
        </View>
        <Search size={20} color="#000" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={toggleModal}
      >
        <View className="flex-1 justify-end bg-black bg-opacity-50">
          <View className="bg-white rounded-t-3xl p-4">
            <Text className="text-xl font-semibold mb-4">Select Language</Text>
            <FlatList
              data={languages}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => selectLanguage(item)}
                  className="py-3 border-b border-gray-200 flex-row items-center"
                >
                  <Text className="text-2xl mr-2">{item.flag}</Text>
                  <Text>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              onPress={toggleModal}
              className="mt-4 bg-gray-200 p-3 rounded-full"
            >
              <Text className="text-center font-semibold">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default TargetLanguageSelector;