import React, { createContext, useState, useContext, ReactNode } from 'react';
import { useTranslation } from 'react-i18next'; // 다국어 처리를 위해 추가

// AimoChat 프로젝트의 데이터 구조에 맞게 수정된 유저 프로필 타입
interface UserProfile {
  id?: string;
  email: string;
  nickname: string;
  provider: 'GooGle' | 'Apple' | 'Line';
  providerId: string;
  region: 'KR' | 'JP' | null;
  gender: 'MALE' | 'FEMALE' | null;
  aiPhotoUrl?: string;
  posePhotoUrl?: string;
  realPhotos: string[];
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: UserProfile | null;
  login: (userData: UserProfile) => void;
  logout: () => void;
  withdraw: () => Promise<void>; // 회원 탈퇴 함수 추가
  updateUser: (updates: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { i18n } = useTranslation(); // i18n 훅 사용
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);

  /**
   * 로그인 처리
   * 유저의 지역(region) 정보에 따라 앱 언어를 자동으로 변경합니다.
   */
  const login = (userData: UserProfile) => {
    setUser(userData);
    setIsLoggedIn(true);

    // 지역 기반 자동 언어 설정
    if (userData.region === 'JP') {
      i18n.changeLanguage('ja');
    } else {
      i18n.changeLanguage('ko');
    }
  };

  /**
   * 로그아웃 처리
   */
  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
  };

  /**
   * 회원 탈퇴 처리
   * 서버 API를 호출하여 유저의 삭제 상태(isDeleted)를 업데이트하고 로컬 상태를 초기화합니다.
   */
  const withdraw = async () => {
    try {
      // TODO: 실제 서버 탈퇴 API 호출 로직 추가 (예: axios.delete('/users/me/withdraw'))
      console.log('회원 탈퇴 처리 중...');

      // 탈퇴 성공 시 로컬 데이터 초기화
      setUser(null);
      setIsLoggedIn(false);
    } catch (error) {
      console.error('회원 탈퇴 중 오류 발생:', error);
      throw error;
    }
  };

  /**
   * 유저 정보 업데이트
   */
  const updateUser = (updates: Partial<UserProfile>) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, user, login, logout, withdraw, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// 커스텀 훅
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
