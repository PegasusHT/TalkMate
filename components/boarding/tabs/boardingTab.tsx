import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import Text from '@/components/customText';
import { bgColor, primaryStrong } from '@/constant/color';

const BoardingTab: React.FC = () => {
    return (
        <View className='bg-white rounded-3xl px-6 pb-10 pt-2'>
            <TouchableOpacity
                style={{ backgroundColor: primaryStrong }} 
                className='w-full mt-2 rounded-3xl h-14 items-center justify-center'
            >
                <Text className='text-white text-lg font-NunitoSemiBold'>
                    Get started
                </Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={{ backgroundColor: bgColor }} 
                className='w-full mt-2 rounded-3xl h-14 items-center justify-center'
            >
                <Text
                    style={{ color: primaryStrong }} 
                    className='text-lg font-NunitoSemiBold'
                >
                    Log in
                </Text>
            </TouchableOpacity>
            <TouchableOpacity className='mt-3 items-center'>
                <Text className='text-gray-800 opacity-80 text-lg'>
                    Guest mode
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default BoardingTab;