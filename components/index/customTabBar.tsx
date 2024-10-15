import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import Text from '@/components/customText';
import ResponsiveView from '@/components/customUtils/responsiveView';
import ResponsiveText from '@/components/customUtils/responsiveText';
import ResponsiveIcon from '@/components/customUtils/responsiveIcon';

const CustomTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  return (
    <ResponsiveView 
      responsiveStyle={{
        sm: { paddingBottom: 8 },
        md: { paddingBottom: 12,  paddingTop:0 },
        lg: { paddingBottom: 24, paddingTop:8 },
      }} className="flex-row bg-white border-t border-gray-200">
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        let iconName: keyof typeof Ionicons.glyphMap;
        switch (route.name) {
          case 'Home':
            iconName = isFocused ? 'home' : 'home-outline';
            break;
          case 'Dictionary':
            iconName = isFocused ? 'list' : 'list-outline';
            break;
          case 'Profile':
            iconName = isFocused ? 'person' : 'person-outline';
            break;
          default:
            iconName = 'alert-circle';
        }

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            className="flex-1 items-center justify-center py-1"
          >
            <ResponsiveView 
              responsiveStyle={{
                sm: { height: 60 },
                md: { height: 60 },
                lg: { height: 100 },
              }} className="flex-col items-center justify-center">
                <ResponsiveIcon
                icon={{ type: 'ionicon', name: iconName }}
                responsiveSize={{
                  sm: 24,
                  md: 24,
                  lg: 40,
                }}
                color={isFocused ?'#585FF9' : 'gray'}
              />
        
              <ResponsiveText
                responsiveStyle={{
                  sm: { fontSize: 12, marginTop: 4 },
                  md: { fontSize: 12, marginTop: 4 },
                  lg: { fontSize: 20, marginTop: 8 },
                }}
                className={`${
                  isFocused ? 'text-primary-500' : 'text-gray-500'
                }`}
              >
                {label.toString()}
              </ResponsiveText>
            </ResponsiveView>
          </TouchableOpacity>
        );
      })}
    </ResponsiveView>
  );
};

export default CustomTabBar;