import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from '../LoginScreen';
import { SplashScreen } from '../SplashScreen';
import SignUpScreen from '../SignUpScreen';
import HomeTabNavigator from './HomeNavigator';

export enum RootStackScreenName {
  Splash = 'Splash',
  HomeMain = 'HomeMain',
  Login = 'Login',
  SignUp = 'SignUp',
}

const Stack = createStackNavigator();

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  SignUp: {
    email: string;
    provider: 'GooGle' | 'Apple' | 'Line';
    providerId: string;
  };
  HomeMain: undefined;
};

const RootStack = () => {
  // 실제 서비스 시에는 전역 상태(Zustand 등)를 통해 isLoggedIn 값을 가져옵니다.
  const isLoggedIn = false;
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={RootStackScreenName.Splash}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen
          name={RootStackScreenName.Splash}
          component={SplashScreen}
        />

        {isLoggedIn ? (
          <Stack.Screen
            name={RootStackScreenName.HomeMain}
            component={HomeTabNavigator}
          />
        ) : (
          <>
            <Stack.Screen
              name={RootStackScreenName.Login}
              component={LoginScreen}
            />
            <Stack.Screen
              name={RootStackScreenName.SignUp}
              component={SignUpScreen}
            />
            <Stack.Screen
              name={RootStackScreenName.HomeMain}
              component={HomeTabNavigator}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootStack;
