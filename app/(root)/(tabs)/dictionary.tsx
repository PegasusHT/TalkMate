//app/(root)/dictionary/Dictionary.tsx
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, TouchableWithoutFeedback, Keyboard, Platform } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootTabParamList } from '@/types/types';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  dictionary: { screen: string; params: { sentence: string } };
};
type Props = NativeStackScreenProps<RootTabParamList, 'Dictionary'>;

const DictionaryScreen: React.FC<Props> = () => {
  const [inputText, setInputText] = useState('');
  const [isEmphasized, setIsEmphasized] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const handleInputChange = (text: string) => {
    setInputText(text);
    if (text.length > 0 && !isEmphasized) {
      setIsEmphasized(true);
    }
  };

  const handleInputFocus = () => {
    setIsEmphasized(true);
  };

  const handleInputBlur = () => {
    if (inputText.length === 0) {
      setIsEmphasized(false);
    }
  };

  const handleOutsidePress = () => {
    Keyboard.dismiss();
    if (inputText.length === 0) {
      setIsEmphasized(false);
    }
  };

  const handleCheck = () => {
    if (inputText.trim()) {
      navigation.navigate('dictionary', {
        screen: 'pronunciation-practice',
        params: { sentence: inputText.trim() }
      });
    }
  };
 
  useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        if (inputText.length === 0) {
          setIsEmphasized(false);
        }
      }
    );

    return () => {
      keyboardDidHideListener.remove();
    };
  }, [inputText]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      setInputText('');
      setIsEmphasized(false);
    });

    return unsubscribe;
  }, [navigation]);

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        setIsEmphasized(false);
      };
    }, [])
  );

  return (
    <TouchableWithoutFeedback onPress={handleOutsidePress}>
      <View className={`flex-1 pt-6 ${isEmphasized ? 'bg-gray-900' : 'bg-indigo-900'}`}>
        <View className="p-4">
          <Text className="text-white text-2xl font-bold mb-4">What do you want to say?</Text>
          
          <View className="bg-white rounded-full flex-row items-center px-4 py-4 mb-4">
            <Ionicons name="search" size={24} color="gray" />
            <TextInput
              ref={inputRef}
              className="flex-1 ml-2 text-gray-700"
              placeholder="Type the phrase you want to speak"
              placeholderTextColor="gray"
              value={inputText}
              onChangeText={handleInputChange}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              onSubmitEditing={handleInputBlur}
            />
            {inputText && (
              <TouchableOpacity onPress={() => {
                setInputText('');
                setIsEmphasized(false);
              }}>
                <Ionicons name="close-circle" size={24} color="gray" />
              </TouchableOpacity>
            )}
          </View>

          {inputText ? (
            <TouchableOpacity 
              className="bg-blue-500 rounded-full py-4 mb-6"
              onPress={handleCheck}
            >
              <Text className="text-white text-center font-bold text-lg">Check</Text>
            </TouchableOpacity>
          ) : (<></>)}

          <View className={`flex-row justify-between mb-6 ${isEmphasized ? 'opacity-50' : ''}`}>
            <TouchableOpacity className="bg-cyan-600 rounded-xl p-4 w-[48%]" disabled={isEmphasized}>
              <View className="items-center">
                <Ionicons name="mic" size={24} color="white" />
                <Text className="text-white font-bold mt-2">Speak</Text>
                <Text className="text-white text-xs text-center mt-1">
                  Speak your phrase to check the score
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity className="bg-pink-500 rounded-xl p-4 w-[48%]" disabled={isEmphasized}>
              <View className="items-center">
                <Ionicons name="camera" size={24} color="white" />
                <Text className="text-white font-bold mt-2">Scan Image</Text>
                <Text className="text-white text-xs text-center mt-1">
                  Convert image to text and speak the phrases
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default DictionaryScreen;