//path: app/(root)/roleplays/_layout.tsx
import { Stack } from 'expo-router';

const ChatLayout = () => {
  return (
    <Stack>
        <Stack.Screen name="roleplaysScreen" options={{ headerShown: false }} />
    
    </Stack>
  );
};

export default ChatLayout;
