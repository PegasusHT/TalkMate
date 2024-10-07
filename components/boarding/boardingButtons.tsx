//components/boarding/boardingButtons.tsx
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import Text from '@/components/customText';
import { bgColor, primaryStrong } from '@/constant/color';

interface BoardingButtonsProps {
    onGuestSignIn: () => void;
  }
  
const BoardingButtons: React.FC<BoardingButtonsProps> = ({ onGuestSignIn }) => {
    const handleGetStarted = () => {
        router.push('/(auth)/sign-up');
    };

    const handleLogIn = () => {
        router.push('/(auth)/sign-in');
    };

    return (
        <View className='bg-white px-6 pb-10'>
            <TouchableOpacity
                style={{ backgroundColor: primaryStrong }} 
                className='w-full rounded-3xl h-14 items-center justify-center'
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
                onPress={onGuestSignIn}
            >
                <Text className='text-gray-800 opacity-80 text-lg'>
                    Guest mode
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default BoardingButtons;