import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Mic, Pen } from 'lucide-react-native';
import { useUser } from '@/context/UserContext';
import ResponsiveView from '@/components/customUtils/responsiveView';
import ResponsiveIcon from '@/components/customUtils/responsiveIcon';
import ResponsiveImage from '@/components/customUtils/responsiveImage';
import { router } from 'expo-router';
import Text from '@/components/customText'

const CustomIcon = require('@/assets/icons/customIcon.png');

interface CustomScenarioFeatureProps {
  onPress: () => void;
}

const CustomScenarioFeature: React.FC<CustomScenarioFeatureProps> = ({ onPress }) => {
  const { isPremium } = useUser();

  const handlePress = () => {
    if (isPremium) {
      router.push('/customScenario' as never);
    } else {
      router.push('/premium' as never);
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.7}
    className='w-full justify-start items-center'>
      <ResponsiveView 
        className="bg-white w-11/12 overflow-hidden shadow-xl"
        style={{ borderWidth: 1.2, borderColor: '#e5e7eb' }}
        responsiveStyle={{
          sm: { marginTop: 24, borderRadius:8 },
          md: { marginTop: 24, paddingHorizontal:0, borderRadius:8 },
          lg: { marginTop: 32, paddingHorizontal:16, borderRadius:24 },
        }}
      >
        <TouchableOpacity onPress={handlePress}>
          <ResponsiveView 
            className=""
            responsiveStyle={{
              sm: { padding: 16 },
              md: { padding: 16 },
              lg: { padding: 28 },
            }}
          >
            <Text className="font-NunitoBold mb-4 text-2xl lg:text-4xl">
              Custom Scenarios
            </Text>
            <View className="flex-row">
              <View className="flex-1 mr-4">
                <View className="flex-row mb-3">
                  <ResponsiveView 
                    className="flex-row items-center bg-gray-100 rounded-full mr-2"
                    responsiveStyle={{
                      sm: { paddingHorizontal: 8, paddingVertical: 4 },
                      md: { paddingHorizontal: 8, paddingVertical: 4 },
                      lg: { paddingHorizontal: 12, paddingVertical: 6 },
                    }}
                  >
                    <ResponsiveIcon
                      icon={{ type: 'lucide', icon: Mic }}
                      responsiveSize={{
                        sm: 16,
                        md: 16,
                        lg: 24,
                      }}
                      color="#6b7280"
                    />
                    <Text className="ml-1 text-gray-600 text-xs lg:text-xl">
                      Speaking
                    </Text>
                  </ResponsiveView>
                  <ResponsiveView 
                    className="flex-row items-center bg-gray-100 rounded-full"
                    responsiveStyle={{
                      sm: { paddingHorizontal: 8, paddingVertical: 4 },
                      md: { paddingHorizontal: 8, paddingVertical: 4 },
                      lg: { paddingHorizontal: 12, paddingVertical: 6 },
                    }}
                  >
                    <ResponsiveIcon
                      icon={{ type: 'lucide', icon: Pen }}
                      responsiveSize={{
                        sm: 16,
                        md: 16,
                        lg: 24,
                      }}
                      color="#6b7280"
                    />
                    <Text className="ml-1 text-gray-600 text-xs lg:text-xl">
                      Writing
                    </Text>
                  </ResponsiveView>
                </View>
                <Text className='font-NunitoSemiBold mb-2 mr-28 lg:text-2xl lg:mt-5'>
                  Create your own scenarios and practice with our AI teacher.
                </Text>
                <Text className='text-gray-500 text-sm lg:text-xl'>
                  Practice speaking and writing with custom scenarios.
                </Text>
              </View>
            </View>
          </ResponsiveView>
          <ResponsiveImage
            source={CustomIcon}
            responsiveStyle={{
              sm: { width: 128, height: 176 },
              md: { width: 128, height: 176 },
              lg: { width: 176, height: 240 },
            }}
            style={{ position: 'absolute', right: 0, bottom: 0 }}
          />
        </TouchableOpacity>
      </ResponsiveView>
    </TouchableOpacity>
  );
};

export default CustomScenarioFeature;