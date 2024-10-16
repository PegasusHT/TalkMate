import React from 'react';
import { ScrollView, View, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootTabParamList } from '@/types/types'; 
import ChatFeature from '@/components/chatPage';
import RoleplayFeature from '@/components/roleplays';
import CustomScenarioFeature from '@/components/customScenario';
import { useUser } from '@/context/UserContext';
import { Lock } from 'lucide-react-native';
import { router } from 'expo-router';
import ResponsiveView from '@/components/customUtils/responsiveView';
import ResponsiveText from '@/components/customUtils/responsiveText';
import ResponsiveIcon from '@/components/customUtils/responsiveIcon';

type Props = NativeStackScreenProps<RootTabParamList, 'Home'>;

const HomeScreen: React.FC<Props> = () => {
  const { isGuest, isPremium } = useUser();

  const handleFeaturePress = (feature: string) => {
    console.log()
    if (feature === 'chat') {
      router.push('/chat' as never);
    } else if (!isPremium) {
       router.push('/premium') 
    } else {
      const route = `/${feature.toLowerCase().replace(/\s+/g, '-')}`;
      router.push(route as any);
    }
  };

  return (
    <ScrollView 
      className='flex-1 bg-slate-100' 
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <ResponsiveView 
        className="flex-1 justify-start items-center bg-slate-100"
        responsiveStyle={{
          sm: { paddingTop: 32 },
          md: { paddingTop: 32 },
          lg: { paddingTop: 48 },
        }}
      >
        <ResponsiveView 
          className='w-full'
          responsiveStyle={{
            sm: { paddingLeft: 16 },
            md: { paddingLeft: 16 },
            lg: { paddingLeft: 36 },
          }}
        >
          <ResponsiveText 
            className="font-NunitoBold text-primary-500"
            responsiveStyle={{
              sm: { fontSize: 24 },
              md: { fontSize: 24 },
              lg: { fontSize: 48 },
            }}
          >
            Practice modes
          </ResponsiveText>
        </ResponsiveView>

        <TouchableOpacity onPress={() => handleFeaturePress('chat')} className="w-full justify-start items-center">
          <ChatFeature />
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => handleFeaturePress('roleplays')} 
          className={`w-full ${!isPremium ? 'opacity-70' : ''}`}
        >
          <View className="relative justify-start items-center">
            <RoleplayFeature />
            {!isPremium && (
              <ResponsiveView 
                className="absolute bg-gray-800"
                responsiveStyle={{
                  sm: { padding: 8, top:6, right:4, borderRadius:8 },
                  md: { padding: 8, top:20, right:14, borderRadius:8  },
                  lg: { padding: 12, top:28, right:32, borderRadius:12  },
                }}
              >
                <ResponsiveIcon
                  icon={{ type: 'lucide', icon: Lock }}
                  responsiveSize={{
                    sm: 20,
                    md: 20,
                    lg: 28,
                  }}
                  color="white"
                />
              </ResponsiveView>
            )}
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => handleFeaturePress('customScenario')} 
          className={`w-full ${!isPremium ? 'opacity-70' : ''}`}
        >
          <View className="relative justify-start items-center">
            <CustomScenarioFeature />
            {!isPremium && (
              <ResponsiveView 
                className="absolute bg-gray-800"
                responsiveStyle={{
                  sm: { padding: 8, top:6, right:4, borderRadius:8 },
                  md: { padding: 8, top:20, right:14, borderRadius:8  },
                  lg: { padding: 12, top:28, right:32, borderRadius:12  },
                }}
              >
                <ResponsiveIcon
                  icon={{ type: 'lucide', icon: Lock }}
                  responsiveSize={{
                    sm: 20,
                    md: 20,
                    lg: 28,
                  }}
                  color="white"
                />
              </ResponsiveView>
            )}
          </View>
        </TouchableOpacity>
      </ResponsiveView>
    </ScrollView>
  );
};

export default HomeScreen;