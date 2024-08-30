import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from './screens/HomeScreen';
import LearnScreen from './screens/LearnScreen';
import DictionaryScreen from './screens/DictionaryScreen';
import ProfileScreen from './screens/ProfileScreen';

export type RootTabParamList = {
  Home: undefined;
  Learn: undefined;
  Dictionary: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

type TabBarIconProps = {
  focused: boolean;
  color: string;
  size: number;
};

const getTabBarIcon = (routeName: keyof RootTabParamList) => {
  return ({ focused, color, size }: TabBarIconProps) => {
    let iconName: keyof typeof Ionicons.glyphMap;

    switch (routeName) {
      case 'Home':
        iconName = focused ? 'home' : 'home-outline';
        break;
      case 'Learn':
        iconName = focused ? 'book' : 'book-outline';
        break;
      case 'Dictionary':
        iconName = focused ? 'list' : 'list-outline';
        break;
      case 'Profile':
        iconName = focused ? 'person' : 'person-outline';
        break;
      default:
        iconName = 'alert-circle'; 
    }

    return <Ionicons name={iconName} size={size} color={color} />;
  };
};

const getTabBarLabel = (label: string) => {
  return ({ focused }: { focused: boolean }) => (
    <Text className={`text-xs ${focused ? 'text-blue-600' : 'text-gray-500'}`}>
      {label}
    </Text>
  );
};

export default function App() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: getTabBarIcon(route.name),
        tabBarActiveTintColor: 'blue',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: 'gray',
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ tabBarLabel: getTabBarLabel('Home') }}
      />
      <Tab.Screen 
        name="Learn" 
        component={LearnScreen}
        options={{ tabBarLabel: getTabBarLabel('Learn') }}
      />
      <Tab.Screen 
        name="Dictionary" 
        component={DictionaryScreen}
        options={{ tabBarLabel: getTabBarLabel('Dictionary') }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ tabBarLabel: getTabBarLabel('Profile') }}
      />
    </Tab.Navigator>
  );
}