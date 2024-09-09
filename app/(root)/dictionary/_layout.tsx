//app/(root)/dictionary/_layout.tsx
import React from 'react';
import { Stack } from 'expo-router';

const DictionaryLayout = () => {
  return (
    <Stack>
        <Stack.Screen 
        name="pronunciation-practice" 
        options={{ 
            headerTitle: "Pronunciation Practice",
            headerShown: false,
        }} 
        />
    </Stack>
   
  );
};

export default DictionaryLayout;