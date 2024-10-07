//app/(auth)/sign-in.tsx
import React, { useEffect } from 'react';
import { SafeAreaView, View, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import ENV from '@/utils/envConfig';
import Text from '@/components/customText';
import BoardingHeader from '@/components/boarding/header/boardingHeader';
import { SvgXml } from 'react-native-svg';
import { AuthSessionResult } from 'expo-auth-session';
import { useUser } from '@/context/UserContext';

WebBrowser.maybeCompleteAuthSession();

const { GOOGLE_IOS_CLIENT_ID, GOOGLE_WEB_CLIENT_ID } = ENV;

const AuthIcon = require('@/assets/icons/auth.png');

const SignIn: React.FC = () => {
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: GOOGLE_WEB_CLIENT_ID,
    iosClientId: GOOGLE_IOS_CLIENT_ID,
    scopes: ['profile', 'email'],
  });
  const { setIsGuest, setEmail, setFirstname, setLastName } = useUser();

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      // Here you would typically send the authentication token to your backend
      // and receive a response indicating whether the sign-in was successful
      // For this example, we'll simulate a successful sign-in
      handleSignInSuccess(response);
    } else if (response?.type === 'error') {
      handleSignInError();
    }
  }, [response]);

  const decodeJwt = (token: string) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  };

  const handleSignInSuccess = (response: AuthSessionResult) => {
    if (response.type === 'success') {
      const { id_token } = response.params;
      if (id_token) {
        const decodedToken = decodeJwt(id_token);
        const userEmail = decodedToken.email;
        const userName = decodedToken.given_name || 'User';
        
        setIsGuest(false);
        setFirstname(userName);
        setEmail(userEmail);
        setFirstname(decodedToken.given_name || '');
        setLastName(decodedToken.family_name || '');

        router.replace('/(root)');
        setTimeout(() => {
          Alert.alert('Sign In Successful', `Welcome back, ${userEmail}!`);
        }, 700);
      } else {
        Alert.alert('Sign In Error', 'Unable to retrieve user information.');
      }
    } else {
      Alert.alert('Sign In Error', 'Authentication was not successful.');
    }
  };

  const handleSignInError = () => {
    Alert.alert('Sign In Failed', 'Please try again.', [
      { text: 'OK' }
    ]);
  };

  const handleGoogleSignIn = () => {
    promptAsync();
  };

  const handleAppleSignIn = () => {
    // Implement Apple Sign-In
    Alert.alert('Sorry, only Google Sign In is available at the moment.')
  };

  const handleFacebookSignIn = () => {
    // Implement Facebook Sign-In
    Alert.alert('Sorry, only Google Sign In is available at the moment.')
  };

  const googleSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    <path fill="none" d="M1 1h22v22H1z"/>
  </svg>
  `;

  const appleSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
  </svg>
  `;

  const facebookSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
    <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
  `;
  
  const SocialButton = ({ onPress, icon, text }: { onPress: () => void; icon: string; text: string }) => (
    <TouchableOpacity
      className="mx-4 mb-3 bg-white border border-gray-300 p-4 rounded-2xl flex-row items-center justify-center"
      onPress={onPress}
    >
      <SvgXml xml={icon} width={22} height={22} style={{ marginRight: 10 }} />
      <Text className="text-center text-lg font-NunitoSemiBold">{text}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-slate-100 mx-2">
      <BoardingHeader />
      <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }} bounces={false}>
        <View className='px-2 pb-6 pt-3'>
          <View className=" flex flex-row">
            <TouchableOpacity
              onPress={() => router.back()}
              className="pt-1 mr-2"
            >
              <ArrowLeft size={22} color="black" />
            </TouchableOpacity>
            <Text className="text-2xl font-NunitoBold mb-2">Login</Text>
          </View>
        </View>

        <View className="flex-1 justify-end mb-8">
          <View className='items-center pb-6'>
            <Image
              source={AuthIcon}
              className="h-[340px] w-[200px] mt-[-20px] mr-[-20px]"
            />
          </View>
          
          <View className="space-y-4">
            <SocialButton
              onPress={handleGoogleSignIn}
              icon={googleSvg}
              text="Continue with Google"
            />
            <SocialButton
              onPress={handleAppleSignIn}
              icon={appleSvg}
              text="Continue with Apple"
            />
            <SocialButton
              onPress={handleFacebookSignIn}
              icon={facebookSvg}
              text="Continue with Facebook"
            />
          </View>

          <View className="mt-6 flex-row justify-center ">
            <Text className="text-gray-600 text-lg">Not a member yet? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/sign-up')}>
              <Text className="text-primary-500 underline text-lg font-NunitoSemiBold">Sign up</Text>
            </TouchableOpacity>
          </View>

          <Text className="text-gray-500 text-xs text-center mt-6">
            By selecting Continue, if your Google, Apple, or Facebook email does not
            match the email you provided during the sign up, we will create a new
            account for you. 
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;