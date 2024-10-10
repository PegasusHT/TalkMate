import React from 'react';
import { View, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import Text from '@/components/customText';
import { ArrowLeft } from 'lucide-react-native';

const TermsOfUse = () => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="p-5">
        <View className='flex flex-row mb-8'>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={28} color="#000" />
          </TouchableOpacity>
          <Text className="text-2xl ml-4 font-NunitoSemiBold">Terms of Use</Text>
        </View>

        <Text className="text-lg mb-4">
          Last updated: {new Date().toLocaleDateString()}
        </Text>

        <Text className="mb-4">
          Please read these terms of use ("Terms") carefully before using the TalkMate AI application ("App") operated by Quoc Huy Bui ("us", "we", or "our").
        </Text>

        <Text className="font-NunitoSemiBold text-lg mb-2">1. Acceptance of Terms</Text>
        <Text className="mb-4">
          By downloading, accessing, or using our App, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access or use the App.
        </Text>

        <Text className="font-NunitoSemiBold text-lg mb-2">2. License Grant</Text>
        <Text className="mb-4">
          Subject to these Terms, we grant you a limited, non-exclusive, non-transferable, and revocable license to use the App on any Apple-branded products that you own or control and as permitted by the Usage Rules set forth in the App Store Terms of Service.
        </Text>

        <Text className="font-NunitoSemiBold text-lg mb-2">3. Restrictions</Text>
        <Text className="mb-4">
          You agree not to, and you will not permit others to:
          {'\n'}a) License, sell, rent, lease, assign, distribute, transmit, host, outsource, disclose or otherwise commercially exploit the App or make the App available to any third party.
          {'\n'}b) Modify, make derivative works of, disassemble, decrypt, reverse compile or reverse engineer any part of the App.
          {'\n'}c) Remove, alter or obscure any proprietary notice (including any notice of copyright or trademark) of the App or its affiliates, partners, suppliers or the licensors of the App.
        </Text>

        <Text className="font-NunitoSemiBold text-lg mb-2">4. Intellectual Property</Text>
        <Text className="mb-4">
          The App and its original content, features, and functionality are and will remain the exclusive property of Quoc Huy Bui and its licensors. The App is protected by copyright, trademark, and other laws of both the United States and foreign countries.
        </Text>

        <Text className="font-NunitoSemiBold text-lg mb-2">5. Termination</Text>
        <Text className="mb-4">
          We may terminate or suspend your access immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach these Terms. Upon termination, your right to use the App will immediately cease.
        </Text>

        <Text className="font-NunitoSemiBold text-lg mb-2">6. Limitation of Liability</Text>
        <Text className="mb-4">
          In no event shall Quoc Huy Bui, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the App.
        </Text>

        <Text className="font-NunitoSemiBold text-lg mb-2">7. Changes</Text>
        <Text className="mb-4">
          We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days' notice prior to any new terms taking effect.
        </Text>

        <Text className="font-NunitoSemiBold text-lg mb-2">8. Contact Us</Text>
        <Text className="mb-4">
          If you have any questions about these Terms, please contact us at:
          {'\n\n'}
          Quoc Huy Bui
          {'\n'}
          Email: jimmybuidev@gmail.com
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TermsOfUse;