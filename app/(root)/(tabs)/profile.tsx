import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import Text from '@/components/customText';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootTabParamList } from '@/types/types'; 
import { ChevronLeft, ChevronDown } from 'lucide-react-native';
import TargetLanguageSelector from '@/components/profile/TargetLangSelector';

type Props = NativeStackScreenProps<RootTabParamList, 'Profile'>;

interface InputFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
}

const ProfileScreen: React.FC<Props> = () => {
  const [email] = useState<string>('jimmybui1995@gmail.com');
  const [firstName, setFirstName] = useState<string>('ajsnaj');
  const [lastName, setLastName] = useState<string>('nsadsa');

  const InputField: React.FC<InputFieldProps> = ({ label, value, onChangeText, placeholder }) => (
    <View className="mb-4">
      <Text className="mb-2">{label}</Text>
      <TextInput
        className="bg-white rounded-xl p-3"
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
      />
    </View>
  );

  const handleSave = () => {
    // Implement save functionality here
    console.log('Saving profile data...');
  }

  return (
    <View className="h-full p-4 pt-8 bg-slate-100">
      <View className='flex-1'>
        <View className=''>
            <Text className="text-2xl font-NunitoSemiBold ">
              Personal details
            </Text>
            
            <View className="mb-4 mt-4">
              <Text className="mb-2">Your email address</Text>
              <Text className="bg-gray-200 rounded-xl p-3 ">
                {email}
              </Text>
            </View>

            <InputField
              label="First name"
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Enter your first name"
            />

            <InputField
              label="Last name"
              value={lastName}
              onChangeText={setLastName}
              placeholder="Enter your last name"
            />
          </View>
      
          <View className='mt-6'>
            <Text className="text-2xl font-NunitoSemiBold ">
              Interface language
            </Text>
            <TargetLanguageSelector/>
          </View>
        </View>
      

      <TouchableOpacity 
        className="bg-primary-500 rounded-3xl p-2 mx-12 items-center mb-4"
        onPress={handleSave}
      >
        <Text className="text-white text-lg font-NunitoSemiBold">Save</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileScreen;