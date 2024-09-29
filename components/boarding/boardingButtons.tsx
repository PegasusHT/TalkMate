//components/boarding/boardingButtons.tsx
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import Text from '@/components/customText';
import { bgColor, primaryStrong } from '@/constant/color';
  
const BoardingButtons: React.FC = () => {
    const handleGetStarted = () => {
        router.push('/(auth)/sign-up');
    };

    const handleLogIn = () => {
        router.push('/(auth)/sign-in');
    };

    const handleGuestMode = () => {
        router.push('/(root)');
    };

    return (
        <View className='bg-white rounded-3xl px-6 pb-10 pt-2'>
            <TouchableOpacity
                style={{ backgroundColor: primaryStrong }} 
                className='w-full mt-2 rounded-3xl h-14 items-center justify-center'
                onPress={handleGetStarted}
            >
                <Text className='text-white text-lg font-NunitoSemiBold'>
                    Get started
                </Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={{ backgroundColor: bgColor }} 
                className='w-full mt-2 rounded-3xl h-14 items-center justify-center'
                onPress={handleLogIn}
            >
                <Text
                    style={{ color: primaryStrong }} 
                    className='text-lg font-NunitoSemiBold'
                >
                    Log in
                </Text>
            </TouchableOpacity>
            <TouchableOpacity 
                className='mt-3 items-center'
                onPress={handleGuestMode}
            >
                <Text className='text-gray-800 opacity-80 text-lg'>
                    Guest mode
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default BoardingButtons;