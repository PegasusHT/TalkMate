import React, { useEffect } from 'react';
import { Redirect } from 'expo-router';
import { Platform } from 'react-native';

const App = () => {
    useEffect(() => {
        if (__DEV__) {
            const originalHandler = ErrorUtils.getGlobalHandler();
            
            ErrorUtils.setGlobalHandler((error, isFatal) => {
                // Log the error
                console.error('Global error handler:', error);
                
                // can add custom logic here, like sending to a logging service
                
                originalHandler(error, isFatal);
            });

            // Cleanup function
            return () => {
                ErrorUtils.setGlobalHandler(originalHandler);
            };
        }
    }, []);

    return <Redirect href='/(root)' />;
};

export default App;