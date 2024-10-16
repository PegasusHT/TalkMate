//app/(root)/index.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '@/app/(root)/(tabs)/home';
import LearnScreen from '@/app/(root)/(tabs)/learn';
import DictionaryScreen from './(tabs)/dictionary';
import ProfileScreen from '@/app/(root)/(tabs)/profile';
import CustomHeader from '@/components/customHeader';
import CustomTabBar from '@/components/index/customTabBar';
import { useUser } from '@/context/UserContext';

export type RootTabParamList = {
  Home: undefined;
  Learn: undefined;
  Dictionary: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

const Home = () => {
  const { isGuest, firstname } = useUser();
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        header: () => <CustomHeader isGuest={isGuest} firstname={firstname} />,
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ title: 'Home' }}
      />
      <Tab.Screen 
        name="Dictionary" 
        component={DictionaryScreen}
        options={{ title: 'Dictionary' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
}

export default Home;