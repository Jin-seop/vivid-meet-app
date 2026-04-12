import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from '../LoginScreen';
import { SplashScreen } from '../SplashScreen';
import SignUpScreen from '../SignUpScreen';
import HomeTabNavigator from './HomeNavigator';
import ChatScreen from '../ChatScreen';

export enum RootStackScreenName {
  Splash = 'Splash',
  HomeMain = 'HomeMain',
  Login = 'Login',
  SignUp = 'SignUp',
  Chat = 'Chat',
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
        <Stack.Screen name={RootStackScreenName.Chat} component={ChatScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootStack;
