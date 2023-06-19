import React, { createContext, useState } from 'react';

interface AuthContextType {
  authCode: string;
  authStore: (value: string) => void;
}

// Create the AuthContext with the specified type
export const AuthContext = createContext<AuthContextType | null>(null);

// AuthProvider component
interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authCode, setAuthCode] = useState('');

  const authStore = (value: string) => {
    // Implement your logout logic here
    setAuthCode(value);
  };

  // Create an object with the authentication state and related functions
  const authContextValue: AuthContextType = {
    authCode,
    authStore,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
