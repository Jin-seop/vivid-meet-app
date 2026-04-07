import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../HomeScreen';
import LoginScreen from '../LoginScreen';

const Stack = createStackNavigator();

interface RootStackProps {
  isLoggedIn: boolean;
}

const RootStack = ({ isLoggedIn }: RootStackProps) => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isLoggedIn ? (
          <Stack.Screen name="Main" component={HomeScreen} />
        ) : (
          <Stack.Screen name="Auth" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootStack;
