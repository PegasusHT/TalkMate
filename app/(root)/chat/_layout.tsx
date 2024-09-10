//path: app/(root)/chat/_layout.tsx
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack } from 'expo-router';

const ChatLayout = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen name="Chat" options={{ headerShown: false }} />
        <Stack.Screen 
          name="pronunciation-practice" 
          options={{ 
            headerTitle: 'Pronunciation Practice',
            headerShown: true,
          }} 
        />
      </Stack>
    </GestureHandlerRootView>
  );
};

export default ChatLayout;
