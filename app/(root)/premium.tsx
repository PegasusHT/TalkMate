// app/(root)/premium.tsx
import React, { useState, useEffect } from 'react';
import { View, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { router } from 'expo-router';
import Text from '@/components/customText';
import { useUser } from '@/context/UserContext';
import { ArrowLeft, Check, XCircle } from 'lucide-react-native';
import { useIAP } from '@/hooks/Auth/useIAP';

interface PlanOption {
  productId: string;
  months: number;
  savings: number;
}

const PremiumScreen = () => {
  const { setIsPremium } = useUser();
  const { products, isLoading, purchaseItem, error, isPurchasing, clearError } = useIAP();
  const [selectedPlan, setSelectedPlan] = useState<PlanOption | null>(null);

  const planOptions: PlanOption[] = [
    { productId: 'yearly_premium', months: 12, savings: 50 },
    { productId: 'quarterly_premium', months: 3, savings: 15 },
    { productId: 'monthly_premium', months: 1, savings: 0 },
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

        {error && (
          <View className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            <Text className="font-bold">Error</Text>
            <Text>{error}</Text>
            <TouchableOpacity
              className="absolute top-0 right-0 p-2"
              onPress={clearError}
            >
              <XCircle size={24} color="#991B1B" />
            </TouchableOpacity>
          </View>
        )}

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
        className={`mt-4 mx-6 rounded-3xl py-4 px-6 items-center ${isPurchasing ? 'bg-gray-400' : 'bg-primary-500'}`}
        onPress={handleUpgrade}
        disabled={isPurchasing}
      >
        <Text className="text-white text-lg font-NunitoSemiBold">
          {isPurchasing ? 'Processing...' : 'Select plan'}
        </Text>
      </TouchableOpacity>

      <Text className="text-center text-gray-600 mt-4 mb-6">
        {isPurchasing ? 'Please wait...' : 'No payment today. Cancel anytime'}
      </Text>
    </SafeAreaView>
  );
};

export default PremiumScreen;