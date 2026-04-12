import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootStack from './src/screens/navigation/RootStack';
import { AuthProvider } from './src/context/AuthContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <RootStack />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
