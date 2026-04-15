import React, { forwardRef } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import LoginScreen from '../LoginScreen';
import { SplashScreen } from '../SplashScreen';
import SignUpScreen from '../SignUpScreen';
import HomeTabNavigator from './HomeNavigator';
import ChatScreen from '../ChatScreen';
import EditProfileScreen from '../EditProfileScreen';
import SettingsScreen from '../SettingsScreen';
import NoticeListScreen from '../NoticeListScreen';

export enum RootStackScreenName {
  Splash = 'Splash',
  HomeMain = 'HomeMain',
  Login = 'Login',
  SignUp = 'SignUp',
  Chat = 'Chat',
  EditProfile = 'EditProfile',
  Settings = 'Settings',
  NoticeList = 'NoticeList',
}

export type RootStackParamList = {
  [RootStackScreenName.Splash]: undefined;
  [RootStackScreenName.Login]: undefined;
  [RootStackScreenName.SignUp]: {
    email: string;
    provider: 'GooGle' | 'Apple' | 'Line';
    providerId: string;
  };
  [RootStackScreenName.HomeMain]: undefined;
  [RootStackScreenName.Chat]: { matchId: string; otherUser?: any };
  [RootStackScreenName.EditProfile]: undefined;
  [RootStackScreenName.Settings]: undefined;
  [RootStackScreenName.NoticeList]: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const RootStack = forwardRef<NavigationContainerRef<RootStackParamList>>((props, ref) => {
  return (
    <NavigationContainer ref={ref}>
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
        <Stack.Screen
          name={RootStackScreenName.EditProfile}
          component={EditProfileScreen}
        />
        <Stack.Screen
          name={RootStackScreenName.Settings}
          component={SettingsScreen}
        />
        <Stack.Screen
          name={RootStackScreenName.NoticeList}
          component={NoticeListScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
});

export default RootStack;
