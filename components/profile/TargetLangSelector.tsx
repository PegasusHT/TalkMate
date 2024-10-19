import React, { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, FlatList, Animated, TouchableWithoutFeedback } from 'react-native';
import Text from '@/components/customText';
import { ChevronDown, ChevronUp } from 'lucide-react-native';

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'vi', name: 'Vietnamese', flag: '🇻🇳' },
];

const TargetLanguageSelector = () => {
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);
  const [isOpen, setIsOpen] = useState(false);
  const animatedHeight = useRef(new Animated.Value(0)).current;

  const toggleDropdown = () => {
    const toValue = isOpen ? 0 : languages.length * 50; // Adjust 50 based on your item height
    Animated.timing(animatedHeight, {
      toValue: toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setIsOpen(!isOpen);
  };

  const selectLanguage = (language: any) => {
    setSelectedLanguage(language);
    toggleDropdown();
  };

  useEffect(() => {
    const closeDropdown = () => {
      if (isOpen) {
        toggleDropdown();
      }
    };

  }, [isOpen]);

  return (
    <View className="mt-2">
      <TouchableOpacity 
        onPress={toggleDropdown}
        className="bg-white rounded-t-2xl p-3 lg:p-4 px-4 lg:px-8 flex-row items-center justify-between"
      >
        <View className="flex-row items-center">
          <Text className="text-2xl lg:text-4xl mr-2">{selectedLanguage.flag}</Text>
          <Text className='lg:text-2xl lg:mb-1'>{selectedLanguage.name}</Text>
        </View>
        {isOpen ? <ChevronUp size={20} color="#000" /> : <ChevronDown size={20} color="#000" />}
      </TouchableOpacity>

      <Animated.View style={{ height: animatedHeight, overflow: 'hidden' }}>
        <FlatList
          data={languages}
          keyExtractor={(item) => item.code}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => selectLanguage(item)}
              className="py-3 px-4 lg:px-7 border-t border-gray-200 bg-white flex-row items-center"
            >
              <Text className="text-2xl lg:text-4xl mr-2 lg:mr-3">{item.flag}</Text>
              <Text className='lg:text-2xl lg:mb-1'>{item.name}</Text>
            </TouchableOpacity>
          )}
          scrollEnabled={false}
        />
      </Animated.View>
    </View>
  );
};

export default TargetLanguageSelector;