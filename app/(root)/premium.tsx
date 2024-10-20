// app/(root)/premium.tsx
import React, { useState, useEffect } from 'react';
import { View, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import Text from '@/components/customText';
import { useUser } from '@/context/UserContext';
import { ArrowLeft, Check } from 'lucide-react-native';
import { useIAP } from '@/hooks/Auth/useIAP';
import { Product } from 'react-native-iap';

interface PlanOption {
  productId: string;
  months: number;
  savings: number;
}

const PremiumScreen = () => {
  const { setIsPremium } = useUser();
  const { products, isLoading, purchaseItem, error } = useIAP();
  const [selectedPlan, setSelectedPlan] = useState<PlanOption | null>(null);

  const planOptions: PlanOption[] = [
    { productId: 'com.jimmydev.TalkMate.premium.yearly', months: 12, savings: 50 },
    { productId: 'com.jimmydev.TalkMate.premium.quarterly', months: 3, savings: 15 },
    { productId: 'com.jimmydev.TalkMate.premium.monthly', months: 1, savings: 0 },
    { productId: 'premium_test', months: 12, savings: 90 }
  ];

  useEffect(() => {
    if (products.length > 0 && !selectedPlan) {
      setSelectedPlan(planOptions.find(plan => plan.productId === products[0].productId) || null);
    }
  }, [products]);

  const handleUpgrade = async () => {
    if (selectedPlan) {
      const success = await purchaseItem(selectedPlan.productId);
      if (success) {
        setIsPremium(true);
        router.back();
      }
    }
  };

  const renderPlanOption = (plan: PlanOption) => {
    const product = products.find(p => p.productId === plan.productId);
    if (!product) {
      return null;
    }

    const monthlyPrice = parseFloat(product.price.replace(/[^0-9.-]+/g, '')) / plan.months;

    return (
      <TouchableOpacity
        key={plan.productId}
        className={`bg-white rounded-3xl p-5 mb-4 border-2 ${selectedPlan?.productId === plan.productId ? 'border-primary-500' : 'border-gray-200'}`}
        onPress={() => setSelectedPlan(plan)}
      >
        {plan.savings > 0 && (
          <View className="absolute top-2 right-2 bg-pink-500 rounded-lg px-2 py-1">
            <Text className="text-white text-xs font-NunitoSemiBold">SAVE {plan.savings}%*</Text>
          </View>
        )}
        <Text className="text-pink-500 mb-1">14 Day Free Trial **</Text>
        <Text className="text-lg font-NunitoSemiBold">Premium {plan.months} {plan.months === 1 ? 'Month' : 'Months'}</Text>
        <Text className="text-gray-600">{product.localizedPrice} / month</Text>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-slate-200 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-4">Loading products...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-slate-200 justify-center items-center">
        <Text className="text-red-500">{error}</Text>
      </SafeAreaView>
    );
  }

  const selectedProduct = selectedPlan ? products.find(p => p.productId === selectedPlan.productId) : null;
  const billingPeriod = selectedPlan?.months === 1 ? 'monthly' : selectedPlan?.months === 3 ? 'quarterly' : 'yearly';

  const openPrivacyPolicy = () => {
    router.push('/privacyPolicy');
  };

  const openTermsOfUse = () => {
    router.push('/termsOfUse');
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-200">
      <ScrollView className="p-5">
        <View className='flex flex-row mb-8'>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={28} color="#000" />
          </TouchableOpacity>
          <Text className="text-2xl ml-4 font-NunitoSemiBold">Upgrade to premium plan</Text>
        </View>

        {planOptions.map(renderPlanOption)}

        {products.length === 0 && (
          <Text className="text-red-500">No products available</Text>
        )}

        <View className="mt-4 bg-white rounded-3xl border-2 border-gray-200 p-4">
          <Text className="text-lg font-NunitoSemiBold mb-4">What you get with TalkMate Premium</Text>
          {['Unlimited practice', 'Roleplays & advanced modes', 'Personalized learning', 'Ads free'].map((feature, index) => (
            <View key={index} className="flex-row items-center mb-3">
              <Check size={24} color="#FF4785" />
              <Text className="ml-3 text-base">{feature}</Text>
            </View>
          ))}
        </View>
        <Text className='text-gray-600 mt-4'>
          By picking a plan, you agree with our{' '}
          <Text className='text-gray-600 underline' onPress={openTermsOfUse}>
            Terms of Use
          </Text>
          {' '}and the{' '}
          <Text className='text-gray-600 underline' onPress={openPrivacyPolicy}>
            Privacy Policy
          </Text>
          . *Compared to 1 Month plan. **Free trial applies only to first-time trial users.
        </Text>
      </ScrollView>

      {selectedProduct && (
        <View className="mt-4 items-center flex flex-row justify-center">
          <Text className="text-center text-[17px] font-NunitoSemiBold">
            {selectedProduct.localizedPrice} (billed {billingPeriod})
          </Text>
        </View>
      )}

      <TouchableOpacity
        className="mt-4 mx-6 rounded-3xl py-4 px-6 items-center bg-primary-500"
        onPress={handleUpgrade}
      >
        <Text className="text-white text-lg font-NunitoSemiBold">Select plan</Text>
      </TouchableOpacity>

      <Text className="text-center text-gray-600 mt-4 mb-6">No payment today. Cancel anytime</Text>
    </SafeAreaView>
  );
};

export default PremiumScreen;
