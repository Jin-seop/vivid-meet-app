import React, { createContext, useState, useContext, ReactNode } from 'react';

// 유저 정보 타입 정의
interface UserProfile {
  name: string;
  birthYear: string;
  mbti: string;
  interests: string[];
  photos: string[];
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: UserProfile | null;
  login: (userData: UserProfile) => void;
  logout: () => void;
  updateUser: (updates: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);

  const login = (userData: UserProfile) => {
    setUser(userData);
    setIsLoggedIn(true);
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
  };

  const updateUser = (updates: Partial<UserProfile>) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, user, login, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// 커스텀 훅: 컨텍스트를 쉽게 사용하기 위함
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
