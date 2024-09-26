//app/(root)/index.tsx
import React from 'react';
import Text from '@/components/customText';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '@/app/(root)/(tabs)/home';
import LearnScreen from '@/app/(root)/(tabs)/learn';
import DictionaryScreen from './(tabs)/dictionary';
import ProfileScreen from '@/app/(root)/(tabs)/profile';
import CustomHeader from '@/components/customHeader';

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
    <Text className={`text-xs ${focused ? 'text-primary-500' : 'text-gray-500'}`}>
      {label}
    </Text>
  );
};

const Home = () => {

  const handleGoalPress = () => {
    // Implement goal modal logic here
    console.log('Goal pressed');
  };

  const handleStreakPress = () => {
    // Implement streak modal logic here
    console.log('Streak pressed');
  };
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: getTabBarIcon(route.name),
        tabBarActiveTintColor: '#585FF9',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: 'white',
          height: 90,
          paddingBottom: 35,
          paddingTop: 10,
          borderTopWidth: 1,
          borderTopColor: 'gray',
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
        header: () => (
          <CustomHeader
            username="Jimmy"
            onGoalPress={handleGoalPress}
            onStreakPress={handleStreakPress}
          />
        ),
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
        options={{ 
          tabBarLabel: getTabBarLabel('Dictionary'),
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ tabBarLabel: getTabBarLabel('Profile') }}
      />
    </Tab.Navigator>
  );
}

export default Home;