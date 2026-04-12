import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../HomeScreen';
import { MessageCircle, Home, User } from 'lucide-react-native';
import ChatsListScreen from '../ChatsListScreen';
import ProfileScreen from '../ProfileScreen';

const Tab = createBottomTabNavigator();

const HomeTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#4A90E2',
        tabBarInactiveTintColor: '#717182',
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => <Home color={color} size={24} />,
          tabBarLabel: '홈',
        }}
      />
      <Tab.Screen
        name="ChatList"
        component={ChatsListScreen} // 추후 채팅 목록 컴포넌트로 교체
        options={{
          tabBarIcon: ({ color }) => <MessageCircle color={color} size={24} />,
          tabBarLabel: '채팅',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen} // 추후 마이페이지 컴포넌트로 교체
        options={{
          tabBarIcon: ({ color }) => <User color={color} size={24} />,
          tabBarLabel: '마이',
        }}
      />
    </Tab.Navigator>
  );
};

export default HomeTabNavigator;
