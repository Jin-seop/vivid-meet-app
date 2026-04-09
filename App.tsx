import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootStack from './src/screens/navigation/RootStack';

export default function App() {
  // 실제 서비스 시에는 전역 상태(Zustand 등)를 통해 isLoggedIn 값을 가져옵니다.
  const isLoggedIn = false;

  return (
    <SafeAreaProvider>
      <RootStack isLoggedIn={isLoggedIn} />
    </SafeAreaProvider>
  );
}
