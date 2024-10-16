import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Pencil, BookOpen } from 'lucide-react-native';
import { useUser } from '@/context/UserContext';
import ResponsiveView from '@/components/customUtils/responsiveView';
import ResponsiveText from '@/components/customUtils/responsiveText';
import ResponsiveIcon from '@/components/customUtils/responsiveIcon';
import ResponsiveImage from '@/components/customUtils/responsiveImage';
import { router } from 'expo-router';

const roleplayIcon = require('@/assets/icons/roleplayIcon.png');

interface RoleplayFeatureProps {
  onPress: () => void;
}

const RoleplayFeature: React.FC<RoleplayFeatureProps> = ({ onPress }) => {
  const { isPremium } = useUser();

  const handlePress = () => {
    if (isPremium) {
      router.push('/roleplays' as never);
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
            <ResponsiveText 
              className="font-NunitoBold mb-4"
              responsiveStyle={{
                sm: { fontSize: 24 },
                md: { fontSize: 24 },
                lg: { fontSize: 42 },
              }}
            >
              Roleplays
            </ResponsiveText>
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
                      icon={{ type: 'lucide', icon: BookOpen }}
                      responsiveSize={{
                        sm: 16,
                        md: 16,
                        lg: 24,
                      }}
                      color="#6b7280"
                    />
                    <ResponsiveText 
                      className="ml-1 text-gray-600"
                      responsiveStyle={{
                        sm: { fontSize: 12 },
                        md: { fontSize: 12 },
                        lg: { fontSize: 20 },
                      }}
                    >
                      Vocabulary
                    </ResponsiveText>
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
                      icon={{ type: 'lucide', icon: Pencil }}
                      responsiveSize={{
                        sm: 16,
                        md: 16,
                        lg: 24,
                      }}
                      color="#6b7280"
                    />
                    <ResponsiveText 
                      className="ml-1 text-gray-600"
                      responsiveStyle={{
                        sm: { fontSize: 12 },
                        md: { fontSize: 12 },
                        lg: { fontSize: 20 },
                      }}
                    >
                      Writing
                    </ResponsiveText>
                  </ResponsiveView>
                </View>
                <ResponsiveText 
                  className="font-NunitoSemiBold mb-2 mr-28"
                  responsiveStyle={{
                    sm: { fontSize: 16 },
                    md: { fontSize: 16, marginTop: 0 },
                    lg: { fontSize: 24, marginTop: 20 },
                  }}
                >
                  Learn through practical, everyday situations.
                </ResponsiveText>
                <ResponsiveText 
                  className="text-gray-500"
                  responsiveStyle={{
                    sm: { fontSize: 14 },
                    md: { fontSize: 14 },
                    lg: { fontSize: 22 },
                  }}
                >
                  Various settings from real-life scenarios to special dialogues.
                </ResponsiveText>
              </View>
            </View>
          </ResponsiveView>
          <ResponsiveImage
            source={roleplayIcon}
            responsiveStyle={{
              sm: { width: 144, height: 176 },
              md: { width: 144, height: 176 },
              lg: { width: 192, height: 240 },
            }}
            style={{ position: 'absolute', right: 0, bottom: 0 }}
          />
        </TouchableOpacity>
      </ResponsiveView>
    </TouchableOpacity>
  );
};

export default RoleplayFeature;