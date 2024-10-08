//context/UserContext.tsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type UserContextType = {
  isGuest: boolean;
  setIsGuest: (value: boolean) => void;
  email: string;
  setEmail: (value: string) => void;
  firstname: string;
  setFirstname: (value: string) => void;
  lastName: string;
  setLastName: (value: string) => void;
  isPremium: boolean;
  setIsPremium: (value: boolean) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isGuest, setIsGuest] = useState(true);
  const [email, setEmail] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastName, setLastName] = useState('');
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedIsGuest = await AsyncStorage.getItem('isGuest');
        const storedEmail = await AsyncStorage.getItem('email');
        const storedFirstname = await AsyncStorage.getItem('firstname');
        const storedLastName = await AsyncStorage.getItem('lastName');
        const storedIsPremium = await AsyncStorage.getItem('isPremium');

        if (storedIsGuest !== null) setIsGuest(JSON.parse(storedIsGuest));
        if (storedEmail !== null) setEmail(storedEmail);
        if (storedFirstname !== null) setFirstname(storedFirstname);
        if (storedLastName !== null) setLastName(storedLastName);
        if (storedIsPremium !== null) setIsPremium(JSON.parse(storedIsPremium));
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    loadUserData();
  }, []);

  useEffect(() => {
    const saveUserData = async () => {
      try {
        await AsyncStorage.setItem('isGuest', JSON.stringify(isGuest));
        await AsyncStorage.setItem('email', email);
        await AsyncStorage.setItem('firstname', firstname);
        await AsyncStorage.setItem('lastName', lastName);
        await AsyncStorage.setItem('isPremium', JSON.stringify(isPremium));
      } catch (error) {
        console.error('Error saving user data:', error);
      }
    };

    saveUserData();
  }, [isGuest, email, firstname, lastName, isPremium]);

  return (
    <UserContext.Provider value={{ 
      isGuest, setIsGuest, 
      email, setEmail, 
      firstname, setFirstname, 
      lastName, setLastName,
      isPremium, setIsPremium
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};