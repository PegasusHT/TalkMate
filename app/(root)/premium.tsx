import React, { useState } from 'react';
import { View, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import Text from '@/components/customText';
import { useUser } from '@/context/UserContext';
import { ArrowLeft, Check } from 'lucide-react-native';

interface PlanOption {
  months: number;
  price: number;
  savings: number;
}

const PremiumScreen = () => {
  const { setIsPremium } = useUser();
  const planOptions: PlanOption[] = [
    { months: 12, price: 8.24, savings: 50 },
    { months: 3, price: 13.99, savings: 15 },
    { months: 1, price: 16.49, savings: 0 },
  ];
  const [selectedPlan, setSelectedPlan] = useState<PlanOption>(planOptions[0]);

  const handleUpgrade = () => {
    if (selectedPlan) {
      // Here you would normally integrate with a payment system
      // For this example, we'll just simulate a successful upgrade
      setIsPremium(true);
      router.back();
    }
  };

  const renderPlanOption = (plan: PlanOption) => {
    const yearlyPrice = plan.price * plan.months;

    return (
      <TouchableOpacity
        key={plan.months}
        className={`bg-white rounded-3xl p-5 mb-4 border-2 ${selectedPlan.months === plan.months ? 'border-primary-500' : 'border-gray-200'}`}
        onPress={() => setSelectedPlan(plan)}
      >
        {plan.savings > 0 && (
          <View className="absolute top-2 right-2 bg-pink-500 rounded-lg px-2 py-1">
            <Text className="text-white text-xs font-bold">SAVE {plan.savings}%*</Text>
          </View>
        )}
        <Text className="text-pink-500 mb-1">14 Day Free Trial **</Text>
        <Text className="text-lg font-bold">Premium {plan.months} {plan.months === 1 ? 'Month' : 'Months'}</Text>
        <Text className="text-gray-600">${plan.price.toFixed(2)} / month</Text>
      </TouchableOpacity>
    );
  };

  const yearlyPrice = (selectedPlan.price * selectedPlan.months).toFixed(2);
  const originalPrice = (16.49 * selectedPlan.months).toFixed(2);
  const billingPeriod = selectedPlan.months === 1 ? 'monthly' : selectedPlan.months === 3 ? 'quarterly' : 'yearly';

  return (
    <SafeAreaView className="flex-1 bg-slate-200">
      <ScrollView className="p-5">
        <View className='flex flex-row mb-8'>
          <TouchableOpacity className="" onPress={() => router.back()}>
            <ArrowLeft size={28} color="#000" />
          </TouchableOpacity>
          <Text className="text-2xl ml-4 font-NunitoSemiBold ">Upgrade to premium plan</Text>
        </View>

        {planOptions.map(renderPlanOption)}

        <View className="mt-4 bg-white rounded-3xl border-2 border-gray-200 p-4">
          <Text className="text-lg font-NunitoSemiBold mb-4">What you get with TalkMate Premium</Text>
          {['Unlimited practice', 'Roleplays & advanced modes', 'Personalized learning', 'Ads free'].map((feature, index) => (
            <View key={index} className="flex-row items-center mb-3">
              <Check size={24} color="#FF4785" />
              <Text className="ml-3 text-base">{feature}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
      
      <View className="mt-4 items-center flex flex-row justify-center">
        <Text className="text-gray-700 line-through" style={{ textDecorationColor: 'red' }}>${originalPrice} </Text>
        <Text className="text-center text-[17px] font-NunitoSemiBold">
          ${yearlyPrice} (billed {billingPeriod})
        </Text>
      </View>
      
      <TouchableOpacity
        className="mt-4 mx-6 rounded-3xl py-4 px-6 items-center bg-primary-500"
        onPress={handleUpgrade}
      >
        <Text className="text-white text-lg font-NunitoSemiBold">Select plan</Text>
      </TouchableOpacity>

      <Text className="text-center text-gray-600 mt-4 ">No payment today. Cancel anytime</Text>
    </SafeAreaView>
  );
};

export default PremiumScreen;