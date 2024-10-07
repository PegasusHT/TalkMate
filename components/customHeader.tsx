import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import Text from '@/components/customText';
import { Ionicons } from '@expo/vector-icons';
import { primaryColor } from '@/constant/color';

type CustomHeaderProps = {
  username: string;
  onGoalPress: () => void;
  onStreakPress: () => void;
};

const CustomHeader: React.FC<CustomHeaderProps> = ({ username, onGoalPress, onStreakPress }) => {
  return (
    <View className="flex-row justify-between items-center p-4 pt-16 bg-white pb-4">
      <View className="flex-row items-center pt-2 ">
        <Ionicons name="logo-octocat" size={30} color={primaryColor} />
        <Text className="ml-2 text-lg font-NunitoSemiBold">Hi, {username}!</Text>
      </View>
      {/* <View className="flex-row">
        <TouchableOpacity onPress={onGoalPress} className="mr-4 bg-slate-200 p-2 rounded-lg">
          <Ionicons name="flag-outline" size={26} color={primaryColor}  />
        </TouchableOpacity>
        <TouchableOpacity onPress={onStreakPress} className='bg-slate-200 p-2 rounded-lg'>
          <Ionicons name="flame-outline" size={26} color={primaryColor}  />
        </TouchableOpacity>
      </View> */}
    </View>
  );
};

export default CustomHeader;