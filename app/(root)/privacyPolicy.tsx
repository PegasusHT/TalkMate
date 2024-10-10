import React from 'react';
import { View, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import Text from '@/components/customText';
import { ArrowLeft } from 'lucide-react-native';

const PrivacyPolicy = () => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="p-5">
        <View className='flex flex-row mb-8'>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={28} color="#000" />
          </TouchableOpacity>
          <Text className="text-2xl ml-4 font-NunitoSemiBold">Privacy Policy</Text>
        </View>

        <Text className="text-lg mb-4">
          Last updated: {new Date().toLocaleDateString()}
        </Text>

        <Text className="mb-4">
          TalkMate AI ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and share information about you when you use our mobile application (the "App").
        </Text>

        <Text className="font-NunitoSemiBold text-lg mb-2">Information We Collect</Text>
        <Text className="mb-4">
          We collect the following information when you use our App:
          {'\n'}- Email address
          {'\n'}- Username
          {'\n'}- Last name
          {'\n'}This information is collected through the OAuth sign-in process.
        </Text>

        <Text className="font-NunitoSemiBold text-lg mb-2">How We Use Your Information</Text>
        <Text className="mb-4">
          We use the information we collect to:
          {'\n'}- Provide, maintain, and improve our App
          {'\n'}- Communicate with you about your account and our services
          {'\n'}- Personalize your experience within the App
        </Text>

        <Text className="font-NunitoSemiBold text-lg mb-2">Sharing of Information</Text>
        <Text className="mb-4">
          We do not sell your personal information. We do not share your information with any third parties except as necessary to provide our services through the App Store or Google Play Store.
        </Text>

        <Text className="font-NunitoSemiBold text-lg mb-2">Data Retention</Text>
        <Text className="mb-4">
          We do not have a specific data retention policy. Your information is retained as long as you maintain an active account with us. You may request deletion of your data at any time by contacting us.
        </Text>

        <Text className="font-NunitoSemiBold text-lg mb-2">Data Security</Text>
        <Text className="mb-4">
          We implement appropriate technical and organizational measures to protect your personal information against unauthorized or unlawful processing, accidental loss, destruction, or damage.
        </Text>

        <Text className="font-NunitoSemiBold text-lg mb-2">Your Rights</Text>
        <Text className="mb-4">
          You have the right to access, correct, or delete your personal information. To exercise these rights, please contact us at jimmybuidev@gmail.com.
        </Text>

        <Text className="font-NunitoSemiBold text-lg mb-2">Children's Privacy</Text>
        <Text className="mb-4">
          Our App is intended for use by individuals over 4 years old. We do not knowingly collect personal information from children under 4. If you are a parent or guardian and believe we may have collected information about a child under 4, please contact us.
        </Text>

        <Text className="font-NunitoSemiBold text-lg mb-2">Changes to This Policy</Text>
        <Text className="mb-4">
          We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
        </Text>

        <Text className="font-NunitoSemiBold text-lg mb-2">Contact Us</Text>
        <Text className="mb-4">
          If you have any questions about this Privacy Policy, please contact us at:
          {'\n\n'}
          Quoc Huy Bui
          {'\n'}
          Email: jimmybuidev@gmail.com
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PrivacyPolicy;