//components/boarding/boardingButtons.tsx
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import Text from '@/components/customText';
import { bgColor, primaryStrong } from '@/constant/color';
import ResponsiveView from '../customUtils/responsiveView';
import ResponsiveText from '../customUtils/responsiveText';

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
        <ResponsiveView responsiveStyle={{ 
            md: { paddingHorizontal:24, paddingBottom:40 },
            lg: { paddingHorizontal: 40, paddingBottom:60, gap:8 }
        }}
         className='bg-white'>
            <ResponsiveView 
             responsiveStyle={{
                md: {height:56},
                lg: { height:80, }
             }}>
                <TouchableOpacity
                    style={{ backgroundColor: primaryStrong }} 
                    className='w-full rounded-3xl h-full items-center justify-center'
                    onPress={handleGetStarted}
                >
                    <ResponsiveText
                     responsiveStyle={{
                        md: { fontSize:18 },
                        lg: { fontSize:30 }
                     }}
                     className='text-white font-NunitoSemiBold'>
                        Get started
                    </ResponsiveText>
                </TouchableOpacity>
            </ResponsiveView>
       
            <ResponsiveView 
             responsiveStyle={{
                md: {height:56},
                lg: { height:80, }
             }}>
              <TouchableOpacity 
                style={{ backgroundColor: bgColor }} 
                className='w-full mt-2 rounded-3xl h-full items-center justify-center'
                onPress={handleLogIn}
              >
                <ResponsiveText
                    responsiveStyle={{
                        md: { fontSize:18 },
                        lg: { fontSize:30 }
                     }}
                    style={{ color: primaryStrong }} 
                    className='font-NunitoSemiBold'
                >
                    Log in
                </ResponsiveText>
              </TouchableOpacity>
            </ResponsiveView>

            <ResponsiveView 
             responsiveStyle={{
                md: { marginTop: 12},
                lg: { marginTop: 24}
             }}>
              <TouchableOpacity 
                className='items-center'
                onPress={onGuestSignIn}
              >
                <ResponsiveText
                    responsiveStyle={{
                        md: { fontSize:18 },
                        lg: { fontSize:30 }
                     }}
                    className='text-gray-800 opacity-80'>
                    Guest mode
                </ResponsiveText>
              </TouchableOpacity>
            </ResponsiveView>
        </ResponsiveView>
    );
};

export default BoardingButtons;