import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../HomeScreen';
import { SignUpScreen } from '../SignUpScreen';
import LoginScreen from '../LoginScreen';
import { SplashScreen } from '../SplashScreen';

export enum RootStackScreenName {
  Main = 'Main',
  Login = 'Login',
  SignUp = 'SignUp',
}

const Stack = createStackNavigator();

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  SignUp: undefined;
  HomeMain: undefined;
};

interface RootStackProps {
  isLoggedIn: boolean;
}

const RootStack = ({ isLoggedIn }: RootStackProps) => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />

        {isLoggedIn ? (
          <Stack.Screen
            name={RootStackScreenName.Main}
            component={HomeScreen}
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
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootStack;
