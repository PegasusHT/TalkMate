import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, ScrollView, TouchableWithoutFeedback, Keyboard, Platform } from 'react-native';
import Text from '@/components/customText';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootTabParamList } from '@/types/types';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import ResponsiveIcon from '@/components/customUtils/responsiveIcon';

type RootStackParamList = {
  dictionary: { screen: string; params: { sentence: string } };
};
type Props = NativeStackScreenProps<RootTabParamList, 'Dictionary'>;

const MAX_CHARACTERS = 300;
const SHOW_COUNT_THRESHOLD = 45;

const DictionaryScreen: React.FC<Props> = () => {
  const [inputText, setInputText] = useState('');
  const [isEmphasized, setIsEmphasized] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [isMultiline, setIsMultiline] = useState(false);
  const [inputWidth, setInputWidth] = useState(0);
  const [inputHeight, setInputHeight] = useState(0);

  const handleInputChange = (text: string) => {
    if (text.length <= MAX_CHARACTERS) {
      setInputText(text);
      if (text.length > 0 && !isEmphasized) {
        setIsEmphasized(true);
      }
    }
  };
  
  const handleContentSizeChange = (event: {nativeEvent: {contentSize: {height: number}}}) => {
    const { height } = event.nativeEvent.contentSize;
    const newIsMultiline = height > inputHeight / 4;
    setIsMultiline(newIsMultiline);
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
    setIsEmphasized(false);
    setInputText('')
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
      <View className={`flex-1 pt-6 lg:pt-12 lg:px-6 ${isEmphasized ? 'bg-gray-900' : 'bg-slate-100'}`}>
        <View className="p-4">
          <Text className="text-primary-500 text-2xl lg:text-5xl font-NunitoBold mb-4">
            What do you want to say?
          </Text>
          
          <View className={`bg-white flex-row p-4 lg:p-6 mb-2 ${isMultiline ? 'rounded-3xl items-start': 'rounded-full items-center'}`}>
            <ResponsiveIcon 
              icon={{ type: 'ionicon', name: 'search' }}
              responsiveSize={{
                  sm: 22,
                  md: 24,
                  lg: 46,
              }}
              color={'gray'}
            />
            <TextInput
              ref={inputRef}
              className="flex-1 ml-2 lg:ml-4 mt-[-1px] text-gray-700 lg:text-3xl font-NunitoRegular"
              placeholder="Type the phrase you want to speak"
              placeholderTextColor="gray"
              value={inputText}
              onChangeText={handleInputChange}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              onSubmitEditing={handleInputBlur}
              maxLength={MAX_CHARACTERS}
              multiline={true}
              onContentSizeChange={handleContentSizeChange}
            />
            {inputText && (
              <TouchableOpacity onPress={() => {
                setInputText('');
                setIsEmphasized(false);
              }}>
                <ResponsiveIcon 
                  icon={{ type: 'ionicon', name: "close-circle" }}
                  responsiveSize={{
                      sm: 22,
                      md: 24,
                      lg: 46,
                  }}
                  color={'gray'}
                />
              </TouchableOpacity>
            )}
          </View>

          {inputText.length > SHOW_COUNT_THRESHOLD && (
            <Text className="text-right text-gray-500 lg:text-xl mb-1">
              {inputText.length}/{MAX_CHARACTERS}
            </Text>
          )}

          {inputText ? (
            <TouchableOpacity 
              className={`bg-primary-500 rounded-full py-4 mb-6 lg:py-6 ${isMultiline ? 'mt-0 lg:mt-2': 'mt-2 lg:mt-6'}`}
              onPress={handleCheck}
            >
              <Text className="text-white text-center font-NunitoBold text-lg lg:text-3xl">Check</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default DictionaryScreen;