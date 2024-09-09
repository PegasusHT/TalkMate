//app/(root)/_layout.tsx
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const Layout = () => {
  return (
    <GestureHandlerRootView>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="dictionary" options={{ 
          headerTitle: "Pronunciation Practice",
          headerShown: true,
          headerBackTitleVisible: false  
        }} />
        <Stack.Screen name="chat" options={{ headerShown: false }} />
      </Stack>
    </GestureHandlerRootView>
   
  );
}

export default Layout;
