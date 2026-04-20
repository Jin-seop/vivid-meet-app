import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useCallback,
} from 'react';
import { useTranslation } from 'react-i18next'; // 다국어 처리를 위해 추가

import { userApi } from '../api/user';
import EncryptedStorage from 'react-native-encrypted-storage';
import {
  setUserId,
  setUserProperties,
  logLogin,
  logEvent,
} from '../utils/analytics';

interface UserProfile {
  id?: string;
  email: string;
  nickname: string;
  provider: 'GooGle' | 'Apple' | 'Line';
  providerId: string;
  region: 'KR' | 'JP' | null;
  gender: 'MALE' | 'FEMALE' | null;
  mbti: string | null;
  aiPhotoUrl?: string;
  posePhotoUrl?: string;
  realPhotoUrl?: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  isLoading: boolean;
  user: UserProfile | null;
  login: (userData: UserProfile) => void;
  logout: () => void;
  withdraw: () => Promise<void>;
  updateUser: (updates: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { i18n } = useTranslation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);

  /**
   * 로그인 처리
   * 유저의 지역(region) 정보에 따라 앱 언어를 자동으로 변경합니다.
   */
  const login = useCallback(
    (userData: UserProfile) => {
      console.log('userData ==>', userData);

      setUser(userData);
      setIsLoggedIn(true);

      // EncryptedStorage에 유저 데이터 저장
      EncryptedStorage.setItem('user_data', JSON.stringify(userData));

      // Analytics 설정
      if (userData.id) {
        setUserId(userData.id);
        setUserProperties({
          gender: userData.gender || 'unknown',
          mbti: userData.mbti || 'unknown',
          region: userData.region || 'unknown',
        });
        logLogin(userData.provider);
      }

      // 지역 기반 자동 언어 설정
      if (userData.region === 'JP') {
        i18n.changeLanguage('ja');
      } else {
        i18n.changeLanguage('ko');
      }
    },
    [i18n],
  );

  // 자동 로그인 확인
  React.useEffect(() => {
    const checkAutoLogin = async () => {
      try {
        const token = await EncryptedStorage.getItem('user_token');
        const storedUser = await EncryptedStorage.getItem('user_data');

        if (token && storedUser) {
          // 1. 저장된 데이터가 있으면 즉시 로그인 상태로 설정
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setIsLoggedIn(true);

          if (parsedUser.region === 'JP') {
            i18n.changeLanguage('ja');
          } else {
            i18n.changeLanguage('ko');
          }

          // 2. 백그라운드에서 최신 정보 업데이트
          userApi
            .getProfile()
            .then(response => {
              if (response.data) {
                login(response.data);
              }
            })
            .catch(error => {
              // 💡 [추가] 토큰이 만료되었거나 탈퇴된 유저인 경우 강제 로그아웃
              console.log('Session validation failed, logging out:', error);
              logout();
            });
        }
      } catch (error) {
        console.log('Auto login failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAutoLogin();
  }, [i18n, login]);

  /**
   * 로그아웃 처리
   */
  const logout = async () => {
    await EncryptedStorage.removeItem('user_token');
    await EncryptedStorage.removeItem('user_data');
    setUser(null);
    setIsLoggedIn(false);

    // Analytics: 유저 식별자 초기화
    await setUserId(null);
    await logEvent('logout');
  };

  /**
   * 회원 탈퇴 처리
   * 서버 API를 호출하여 유저의 삭제 상태(isDeleted)를 업데이트하고 로컬 상태를 초기화합니다.
   */
  const withdraw = async () => {
    try {
      console.log('회원 탈퇴 처리 중...');
      await userApi.withdraw();

      // 탈퇴 성공 시 로컬 데이터 초기화
      await EncryptedStorage.removeItem('user_token');
      await EncryptedStorage.removeItem('user_data');
      setUser(null);
      setIsLoggedIn(false);
      console.log('회원 탈퇴 완료');

      // Analytics
      await logEvent('withdrawal');
      await setUserId(null);
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
      value={{
        isLoggedIn,
        isLoading,
        user,
        login,
        logout,
        withdraw,
        updateUser,
      }}
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
