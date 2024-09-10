import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type CustomHeaderProps = {
  username: string;
  onGoalPress: () => void;
  onStreakPress: () => void;
};

const CustomHeader: React.FC<CustomHeaderProps> = ({ username, onGoalPress, onStreakPress }) => {
  return (
    <View className="flex-row justify-between items-center p-4 pt-16 bg-white">
      <View className="flex-row items-center">
        <Ionicons name="logo-octocat" size={30} color="blue" />
        <Text className="ml-2 text-lg font-semibold">Hi, {username}!</Text>
      </View>
      <View className="flex-row">
        <TouchableOpacity onPress={onGoalPress} className="mr-4 bg-slate-200 p-2 rounded-lg">
          <Ionicons name="flag-outline" size={26} color="blue" />
        </TouchableOpacity>
        <TouchableOpacity onPress={onStreakPress} className='bg-slate-200 p-2 rounded-lg'>
          <Ionicons name="flame-outline" size={26} color="blue" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CustomHeader;