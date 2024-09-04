import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack } from 'expo-router';

const ChatLayout = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
    </GestureHandlerRootView>
  );
};

export default ChatLayout;
