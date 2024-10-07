import React, { createContext, useState, useContext, ReactNode } from 'react';

interface UserContextType {
  isGuest: boolean;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  setIsGuest: (value: boolean) => void;
  setUsername: (value: string) => void;
  setEmail: (value: string) => void;
  setFirstName: (value: string) => void;
  setLastName: (value: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isGuest, setIsGuest] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  return (
    <UserContext.Provider
      value={{
        isGuest,
        username,
        email,
        firstName,
        lastName,
        setIsGuest,
        setUsername,
        setEmail,
        setFirstName,
        setLastName,
      }}
    >
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