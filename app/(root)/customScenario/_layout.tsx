//path: app/(root)/customScenario/_layout.tsx
import { Stack } from 'expo-router';

const ChatLayout = () => {
  return (
    <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name='chatScene' options={{ headerShown: false }} />
    </Stack>
  );
};

export default ChatLayout;
