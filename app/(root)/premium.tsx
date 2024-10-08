//app/(root)/premium.tsx
import React from 'react';
import { View, SafeAreaView, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import Text from '@/components/customText';
import { useUser } from '@/context/UserContext';
import { ArrowLeft } from 'lucide-react-native';

const PremiumScreen = () => {
  const { setIsPremium } = useUser();

  const handleUpgrade = (plan: string) => {
    // Here you would normally integrate with a payment system
    // For this example, we'll just simulate a successful upgrade
    Alert.alert(
      "Upgrade Successful",
      `You've successfully upgraded to the ${plan} plan!`,
      [
        { text: "OK", onPress: () => {
          setIsPremium(true);
          router.back();
        }}
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-200">
      <View className="absolute top-24 left-6 z-10">
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={32} color="#000" />
        </TouchableOpacity>
      </View>
      <View className='p-4'> 
        <Text className="text-4xl text-center font-bold pt-24 mb-12">Upgrade to Premium</Text>
        <Text className="text-lg text-center mt-8 mb-12">Unlock all features and take your language learning to the next level!</Text>
        
        <TouchableOpacity
          className="p-4 mx-4 mb-6 bg-primary-500 rounded-lg"
          onPress={() => handleUpgrade('Monthly')}
        >
          <Text className="text-white text-lg font-bold">Monthly Plan</Text>
          <Text className="text-white">$9.99/month</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="p-4 mx-4 mb-6 bg-primary-500 rounded-lg"
          onPress={() => handleUpgrade('Yearly')}
        >
          <Text className="text-white text-lg font-bold">Yearly Plan</Text>
          <Text className="text-white">$99.99/year (Save 17%)</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default PremiumScreen;