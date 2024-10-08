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
          headerShown: false,
          headerBackTitleVisible: false  
        }} />
        <Stack.Screen name="chat" options={{ headerShown: false }} />
        <Stack.Screen name='roleplays' options={{ headerShown: false }} />
        <Stack.Screen name='customScenario' options={{ headerShown: false }} />

        <Stack.Screen name="premium" options={{ headerShown: false }} />

      </Stack>
    </GestureHandlerRootView>
   
  );
}

export default Layout;
