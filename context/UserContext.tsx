import React, { createContext, useState, useContext, ReactNode } from 'react';

interface UserContextType {
  isGuest: boolean;
  email: string;
  firstname: string;
  lastName: string;
  setIsGuest: (value: boolean) => void;
  setEmail: (value: string) => void;
  setFirstname: (value: string) => void;
  setLastName: (value: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isGuest, setIsGuest] = useState(true);
  const [firstname, setFirstname] = useState('');
  const [email, setEmail] = useState('');
  const [lastName, setLastName] = useState('');

  return (
    <UserContext.Provider
      value={{
        isGuest,
        firstname,
        email,
        lastName,
        setIsGuest,
        setFirstname,
        setEmail,
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