import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import Text from '@/components/customText';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootTabParamList } from '@/types/types'; 
import { ChevronLeft, ChevronDown } from 'lucide-react-native';
import TargetLanguageSelector from '@/components/profile/TargetLangSelector';
import { useUser } from '@/context/UserContext';
import { bgColor, primaryStrong } from '@/constant/color';
import ENV from '@/utils/envConfig';

type Props = NativeStackScreenProps<RootTabParamList, 'Profile'>;

interface InputFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  editable: boolean;
}

const ProfileScreen: React.FC<Props> = () => {
  const { 
    isGuest, 
    email, 
    firstname, 
    lastName, 
    setFirstname, 
    setLastName, 
    setIsGuest,
    setEmail
  } = useUser();

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = await AsyncStorage.getItem('authToken');
      setIsAuthenticated(!!token);
    };
    checkAuthStatus();
  }, []);
  
  const InputField: React.FC<InputFieldProps> = ({ label, value, onChangeText, placeholder, editable }) => (
    <View className="mb-4">
      <Text className="mb-2">{label}</Text>
      <TextInput
        className={`rounded-xl p-3 ${isGuest ? 'bg-gray-200' : 'bg-white'}`}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        editable={editable}
      />
    </View>
  );

  const handleSave = () => {
    if (isGuest) {
      // Optionally show a message that guest users cannot save profile details
      return;
    }
    // Implement save functionality here
    console.log('Saving profile data...');
  }

  const handleDeleteAccount = async () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('authToken');
              if (!token) {
                console.error('No authentication token found');
                Alert.alert('Error', 'You are not authenticated. Please log in again.');
                router.replace('/(auth)');
                return;
              }
  
              const response = await fetch(`${ENV.BACKEND_URL}/auth/delete-account`, {
                method: 'DELETE',
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                },
              });
  
              const responseText = await response.text();
              let responseData;
              try {
                responseData = JSON.parse(responseText);
              } catch (parseError) {
                console.error('Response is not JSON:', responseText);
                throw new Error('Server response is not in JSON format');
              }
  
              if (response.ok) {
                // Account deleted successfully
                await handleSuccessfulDeletion();
              } else if (responseData.message === "Invalid token") {
                console.error('Invalid token error:', responseData);
                await handleInvalidToken();
              } else {
                console.error('Error response:', responseData);
                Alert.alert('Error', responseData.message || 'Failed to delete account. Please try again.');
              }
            } catch (error) {
              console.error('Error deleting account:', error);
              Alert.alert('Error', `An error occurred while deleting your account: ${error}`);
            }
          }
        }
      ]
    );
  };
  
  const handleSuccessfulDeletion = async () => {
    // Clear user data from context
    setIsGuest(true);
    setEmail('');
    setFirstname('');
    setLastName('');
  
    // Remove the auth token from AsyncStorage
    await AsyncStorage.removeItem('authToken');
  
    // Navigate to the sign-in screen
    router.replace('/(auth)');
    Alert.alert('Account Deleted', 'Your account has been successfully deleted.');
  };
  
  const handleInvalidToken = async () => {
    // Clear the invalid token
    await AsyncStorage.removeItem('authToken');
  
    // Inform the user and redirect to login
    Alert.alert(
      'Session Expired',
      'Your session has expired. Please log in again.',
      [
        {
          text: 'OK',
          onPress: () => router.replace('/(auth)')
        }
      ]
    );
  };

  const handleSignOut = async () => {
    if (isGuest) {
      // If the user is a guest, just redirect to the sign-in page
      router.replace('/(auth)/');
    } else {
      // For logged-in users, show a confirmation dialog
      Alert.alert(
        "Sign Out",
        "Are you sure you want to sign out?",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          { 
            text: "OK", 
            onPress: async () => {
              try {
                // Clear user data from context
                setIsGuest(true);
                setEmail('');
                setFirstname('');
                setLastName('');

                // Remove the auth token from AsyncStorage
                await AsyncStorage.removeItem('authToken');

                // Navigate to the sign-in screen
                router.replace('/(auth)');
              } catch (error) {
                console.error('Error during sign out:', error);
                Alert.alert('Error', 'An error occurred while signing out. Please try again.');
              }
            }
          }
        ]
      );
    }
  };

  return (
    <View className="h-full p-4 pt-8 bg-slate-100">
      <View className='flex-1'>
        <Text className="text-2xl font-NunitoSemiBold">Personal details</Text>
        
        <View className="mb-4 mt-4">
          <Text className="mb-2">Your email address</Text>
          <TextInput
            className="bg-gray-200 rounded-xl p-3"
            value={email}
            editable={false}
          />
        </View>

        <InputField
          label="First name"
          value={firstname}
          onChangeText={setFirstname}
          placeholder="Enter your first name"
          editable={!isGuest}
        />

        <InputField
          label="Last name"
          value={lastName}
          onChangeText={setLastName}
          placeholder="Enter your last name"
          editable={!isGuest}
        />

        <View className='mt-6'>
          <Text className="text-2xl font-NunitoSemiBold">Interface language</Text>
          <TargetLanguageSelector/>
        </View>
      </View>

      {!isGuest && (
        <TouchableOpacity 
          style={{ backgroundColor: 'white' }} 
          className={`rounded-3xl p-2 mx-20 items-center mb-6 mt-8`}
          onPress={handleDeleteAccount}
        >
          <Text className="text-red-500 text-lg font-NunitoSemiBold">
            Delete Account
          </Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity 
        style={{ backgroundColor: primaryStrong }} 
        className={`rounded-3xl p-2 mx-20 items-center mb-4`}
        onPress={handleSignOut}
      >
        <Text className="text-white text-lg font-NunitoSemiBold">
          {isGuest ? 'Back to Main Page' : 'Sign Out'}
        </Text>
      </TouchableOpacity>
      {/* <TouchableOpacity 
        className={`rounded-3xl p-2 mx-12 items-center mb-4 ${isGuest ? 'bg-gray-400' : 'bg-primary-500'}`}
        onPress={handleSave}
        disabled={isGuest}
      >
        <Text className="text-white text-lg font-NunitoSemiBold">
          {isGuest ? 'Guest Mode' : 'Save'}
        </Text>
      </TouchableOpacity> */}
    </View>
  );
};

export default ProfileScreen;