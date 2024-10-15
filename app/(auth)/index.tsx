//app/(auth)/welcome.tsx
import React, { useState, useRef, useCallback } from 'react';
import { View, Image, Dimensions, Animated, ScrollView, NativeSyntheticEvent, NativeScrollEvent, StatusBar, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import BoardingButtons from '@/components/boarding/boardingButtons';
import Text from '@/components/customText';
import { bgColor, primaryStrong } from '@/constant/color';
import { boardingData } from '@/data/boardingData';
import { Globe } from 'lucide-react-native';
import { useUser } from '@/context/UserContext';
import { getTextStyle, combineStyles } from '@/components/customUtils/responsiveFontSize';
import ResponsiveView from '@/components/customUtils/responsiveView';
import ResponsiveText from '@/components/customUtils/responsiveText';
import ResponsiveIcon from '@/components/customUtils/responsiveIcon';
import ResponsiveImage from '@/components/customUtils/responsiveImage';

const { width, height } = Dimensions.get('window');
const onboardingLogo = require('@/assets/images/onboarding-logo.png');

const WelcomeFlow: React.FC = () => {
    const { setIsGuest, setEmail, setFirstname, setLastName } = useUser();
    const [currentPage, setCurrentPage] = useState(0);
    const scrollViewRef = useRef<ScrollView>(null);
    const scrollX = useRef(new Animated.Value(0)).current;

    const onScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        const pageIndex = Math.round(offsetX / width);
        if (pageIndex !== currentPage) {
            setCurrentPage(pageIndex);
        }
    }, [currentPage]);
    const handleScroll = Animated.event(
        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
        { useNativeDriver: false, listener: onScroll }
    );
    
    const handleGuestSignIn = () => {
        setIsGuest(true);
        setEmail('');
        setFirstname('');
        setLastName('');
        router.replace('/(root)');
    };
    
    return (
        <View style={{ flex: 1, backgroundColor: bgColor }}>
            <StatusBar barStyle="dark-content" />
            <View style={{ flex: 1 }}>
                <Animated.ScrollView
                    ref={scrollViewRef}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                    bounces={false}
                    style={{ flex: 1 }}
                    contentContainerStyle={{ paddingTop: 54 }}
                >
                    {boardingData.map((screen, index) => (
                        <View key={index} style={{ width, height: height - 80 }}>
                            <View style={{ alignItems: 'center' }}>
                                <ResponsiveImage 
                                    source={screen.image}
                                    responsiveStyle={{
                                        sm: { width:240, height:320 },
                                        md: { width:270, height:360 },
                                        lg: { width:460, height:520 }
                                    }}
                                    resizeMode='contain'
                                />
                            </View>
                            <ResponsiveView 
                                responsiveStyle={{
                                    sm: { padding: 4, paddingBottom: 50 },
                                    md: { padding: 20, paddingBottom: 80 },
                                    lg: { padding: 40, }
                                }}
                                style={{ 
                                    position: 'absolute', 
                                    top: '42%',
                                    left: 0,
                                    right: 0,
                                    backgroundColor: 'white', 
                                }}
                                className='h-full'
                            >
                                <ResponsiveText
                                 responsiveStyle={{
                                    lg: {fontSize:54}
                                 }}
                                 className='mt-10 font-NunitoSemiBold text-center'>
                                    {screen.title}
                                </ResponsiveText>
                                <ResponsiveText
                                 responsiveStyle={{
                                    md: {fontSize: 16},
                                    lg: {fontSize: 28, paddingHorizontal:40, paddingVertical:10}
                                 }}
                                  className='mx-4 mt-6 opacity-60 text-center'>
                                    {screen.description}
                                </ResponsiveText>
                            </ResponsiveView>
                        </View>
                    ))}
                </Animated.ScrollView>
            
                <View
                 style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: '16%',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    zIndex: 20,
                    pointerEvents: 'none',
                }}>
                    <View 
                     style={{
                        flex: 1,
                        justifyContent: 'center',
                    }}>
                        <ResponsiveImage 
                            source={onboardingLogo}
                            responsiveStyle={{
                                sm: { width: 80, height: 80 },
                                md: { width: 100, height: 100 },
                                lg: { width: 160, height: 160 },
                            }}
                            resizeMode='contain'
                        />
                    </View>
                </View>

                <ResponsiveView 
                 responsiveStyle={{

                 }}
                 style={{
                    position: 'absolute',
                    bottom: 10,
                    left: 0,
                    right: 0,
                    alignItems: 'center',
                    zIndex:10
                }}>
                    <ResponsiveView
                     responsiveStyle={{
                        sm:{marginBottom:'56%'},
                        md:{marginBottom:'54%'},
                        lg: { marginBottom:'34%' }
                     }}
                     className="flex-row">
                        {boardingData.map((_, i) => (
                            <ResponsiveView
                                responsiveStyle={{
                                    md: { height:3, width:3, marginHorizontal:1 },
                                    lg: { height:26, width:26, marginHorizontal:8 }
                                }}
                                key={i}
                                className={`rounded-full ${
                                    i === currentPage ? 'bg-blue-500' : 'bg-gray-300'
                                }`}
                            />
                        ))}
                    </ResponsiveView>
                </ResponsiveView>
                <View style={{ 
                    position: 'absolute', 
                    top: '41%',
                    left: 0, 
                    right: 0, 
                    height: 46,
                    backgroundColor: 'white', 
                    borderTopLeftRadius: 30, 
                    borderTopRightRadius: 30, 
                    padding: 20,
                    paddingBottom: 20,
                }}/>
            </View>

            <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 30, backgroundColor: 'white' }} className='pt-6'>
                <BoardingButtons onGuestSignIn={handleGuestSignIn} />
            </View>

            <View
              style={{
                backgroundColor: bgColor,
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 40
              }} 
              className="flex-row justify-between items-center w-full">
                <ResponsiveView 
                 responsiveStyle={{
                    sm: { top: 60, left: 6  },
                    md: { top: 60, left: 6  },
                    lg: { top: 74, left: 22  },
                 }}
                 style={{ backgroundColor: bgColor, position: 'absolute'}}
                 className='rounded-full px-3 py-1'>
                    <ResponsiveText 
                        responsiveStyle={{
                            sm: { fontSize: 16 },
                            md: { fontSize: 17 },
                            lg: { fontSize: 30 },
                        }}
                        style={{ color: primaryStrong }} 
                        className=''>
                        <Text className='font-NunitoBold'>TalkMate </Text>
                        <Text className='font-NunitoRegular'>AI</Text>
                    </ResponsiveText>
                </ResponsiveView>

                <TouchableOpacity>
                    <ResponsiveView 
                        responsiveStyle={{
                            sm: { top: 60, right: 11, paddingVertical:1, paddingHorizontal:3 },
                            md: { top: 60, right: 11, paddingVertical:1, paddingHorizontal:3 },
                            lg: { top: 70, right: 22, paddingVertical:6, paddingHorizontal:18 },
                        }}
                        style={{position: 'absolute'}}
                        className='flex-row items-center bg-white rounded-full'>
                        <ResponsiveIcon 
                            icon={Globe}
                            responsiveSize={{
                                sm: 16,
                                md: 20,
                                lg: 30,
                            }}
                            color={primaryStrong}
                        />
                        <ResponsiveText
                         responsiveStyle={{
                            sm: { fontSize: 13 },
                            md: { fontSize: 14 },
                            lg: { fontSize: 28, marginLeft:8 },
                         }}
                         style={{ color: primaryStrong }}
                        className="font-NunitoSemiBold">English</ResponsiveText>
                    </ResponsiveView>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default WelcomeFlow;