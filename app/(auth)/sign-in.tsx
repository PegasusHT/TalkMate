import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, View, TextInput, TouchableOpacity, Alert,
    KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback
 } from 'react-native';
import { router } from 'expo-router';
import { StackNavigationProp } from '@react-navigation/stack';
import * as Google from 'expo-auth-session/providers/google'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { makeRedirectUri } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import ENV from '@/utils/envConfig';

WebBrowser.maybeCompleteAuthSession();

const {GOOGLE_IOS_CLIENT_ID, GOOGLE_WEB_CLIENT_ID }=ENV

type RootStackParamList = {
  Register: undefined;
};

type SignInScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const SignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [request, response, promptAsync] = Google.useAuthRequest(
    {
      webClientId: GOOGLE_WEB_CLIENT_ID,
      iosClientId: GOOGLE_IOS_CLIENT_ID,
      scopes: ['profile', 'email'], 
    }
  );

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      router.replace('/(root)');
    } else if (response?.type === 'error') {
      setError('Authentication failed. Please try again.');
      console.error('Authentication error:', response.error);
    }
  }, [response]);

  const handleGoogleSignIn = async () => {
    // TODO: Implement Google Sign-In
    router.replace('/(root)')
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-100 px-4">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="flex-1 justify-center items-center">
            <View className="w-full max-w-[400px] bg-white p-6 rounded-lg border border-black">
              {error ? <Text className="text-red-500 mb-4">{error}</Text> : null}
              <Text className="text-2xl font-NunitoBold text-center mb-5">Sign In</Text>

              {/* <Text className="text-sm mb-1">Email</Text>
              <TextInput
                className="w-full h-10 border border-black rounded px-2 mb-4"
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              
              <Text className="text-sm mb-1">Password</Text>
              <TextInput
                className="w-full h-10 border border-black rounded px-2 mb-4"
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              
              <TouchableOpacity
                className="w-full bg-black p-2 rounded"
                onPress={handleSubmit}
              >
                <Text className="text-white text-center">Sign In</Text>
              </TouchableOpacity> */}
              
              <TouchableOpacity
                className="w-full mb-4 bg-white border border-black p-2 rounded-lg"
                onPress={() => promptAsync()} // Wrap promptAsync in an arrow function
              >
                <Text className="text-center">Sign in with Google</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                className="mt-4"
                onPress={() => {
                    router.replace('/(auth)/sign-up')
                }}
              >
                <Text className="text-sm text-gray-500">Don't have an account?</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignIn;