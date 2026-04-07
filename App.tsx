import React, { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import RootStack from './src/screens/navigation/RootStack';
import RNBootSplash from 'react-native-bootsplash';
import EncryptedStorage from 'react-native-encrypted-storage';

// 클라이언트 생성
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2, // 실패 시 2번 재시도
      staleTime: 1000 * 60 * 5, // 5분 동안은 데이터를 '신선'하다고 판단 (캐시 활용)
    },
  },
});

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        // 1. 여기서 토큰 체크나 API 초기화 등을 수행합니다.
        const token = await EncryptedStorage.getItem('accessToken');
        setIsLoggedIn(!!token);
      } catch (e) {
        console.error('초기화 에러:', e);
      } finally {
        // 2. 모든 준비가 끝나면 스플래시 화면을 숨깁니다.
        // fade: true를 주면 부드럽게 사라집니다.
        await RNBootSplash.hide({ fade: true });
      }
    };

    init();
  }, []);

  if (isLoggedIn === null) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <RootStack isLoggedIn={isLoggedIn} />
    </QueryClientProvider>
  );
};

export default App;
