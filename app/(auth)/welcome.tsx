import React, { useState, useRef, useCallback } from 'react';
import { View, Image, Dimensions, Animated, ScrollView, NativeSyntheticEvent, NativeScrollEvent, StatusBar, TouchableOpacity } from 'react-native';
import BoardingTab from '@/components/boarding/tabs/boardingTab';
import Text from '@/components/customText';
import { bgColor, primaryStrong } from '@/constant/color';
import { Ionicons } from '@expo/vector-icons';
import { boardingData } from '@/data/boardingData';
import { Globe } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

const WelcomeFlow: React.FC = () => {
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

    const opacity = scrollX.interpolate({
        inputRange: boardingData.map((_, i) => i * width),
        outputRange: boardingData.map(() => 1),
        extrapolate: 'clamp',
    });

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
                    className='pt-[44]'
                >
                    {boardingData.map((screen, index) => (
                        <View key={index} style={{ width, height: height - 80 }}>
                            <Animated.View style={{ flex: 1, opacity }}>
                                <View style={{zIndex:-1}}
                                 className={`items-center `}>

                                    <Image 
                                        source={screen.image}
                                        style={{ width: 280, height: 360 }}
                                        resizeMode='contain'
                                    />
                                </View>
                            </Animated.View>
                        </View>
                    ))}
                </Animated.ScrollView>
                
                <View style={{ 
                    position: 'absolute', 
                    top:385,
                    bottom: 0, 
                    left: 0, 
                    right: 0, 
                    backgroundColor: 'white', 
                    borderTopLeftRadius: 30, 
                    borderTopRightRadius: 30, 
                    padding: 20,
                    paddingBottom: 80,
                }}>
                    <Animated.View style={{  opacity }}>
                        <Text className='text-3xl mt-14 font-NunitoSemiBold text-center'>
                            {boardingData[currentPage].title}
                        </Text>
                        <Text className='mx-4 mt-6 text-[16px] opacity-60 text-center'>
                            {boardingData[currentPage].description}
                        </Text>
                        <View className='mt-6 items-center'>
                            <View className="flex-row mb-6">
                                {boardingData.map((_, i) => (
                                    <View
                                        key={i}
                                        className={`h-2 w-2 rounded-full mx-1 ${
                                            i === currentPage ? 'bg-blue-500' : 'bg-gray-300'
                                        }`}
                                    />
                                ))}
                            </View>
                        </View>
                    </Animated.View>
                </View>
            </View>
            
            <View style={{ position: 'absolute', top: height / 2 - 130, left: width / 2 - 43, zIndex: 10 }}>
                <View style={{ backgroundColor: bgColor }} className="rounded-full p-5">
                    <Ionicons name="logo-octocat" size={60} color={primaryStrong} />
                </View>
            </View>

            <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
                <BoardingTab />
            </View>

            <View
              style={{
                backgroundColor: bgColor,
                position:'absolute'
              }} 
              className="flex-row justify-between items-center w-full ">
                <View style={{ backgroundColor: bgColor, position: 'absolute', top: 60, left:15, zIndex: 20 }}
                 className='rounded-full px-3 py-1'>
                  <Text style={{ color: primaryStrong }} className='text-[17px]'>
                    <Text className='font-NunitoBold'>TalkMate </Text>
                    <Text className='font-NunitoRegular'>AI</Text>
                  </Text>
                </View>

                <TouchableOpacity style={{position: 'absolute', top: 60, right:15, zIndex: 20  }}
                className="flex-row items-center bg-white px-3 py-1 rounded-full">
                    <Globe size={16} color={primaryStrong} />
                    <Text style={{ color: primaryStrong }}
                    className="ml-2 font-NunitoSemiBold">English</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default WelcomeFlow;