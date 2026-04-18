import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next'; // 추가
import HomeScreen from '../HomeScreen';
import { MessageCircle, Home, User } from 'lucide-react-native';
import ChatsListScreen from '../ChatsListScreen';
import { ProfileScreen } from '../ProfileScreen';

const Tab = createBottomTabNavigator();

const HomeIcon = ({ color }: { color: string }) => <Home color={color} size={24} />;
const ChatIcon = ({ color }: { color: string }) => <MessageCircle color={color} size={24} />;
const UserIcon = ({ color }: { color: string }) => <User color={color} size={24} />;

const HomeTabNavigator = () => {
  const { t } = useTranslation();

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
          tabBarIcon: HomeIcon,
          tabBarLabel: t('tab.home', '홈'),
        }}
      />
      <Tab.Screen
        name="ChatList"
        component={ChatsListScreen}
        options={{
          tabBarIcon: ChatIcon,
          tabBarLabel: t('tab.chat', '채팅'),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: UserIcon,
          tabBarLabel: t('tab.profile', '마이'),
        }}
      />
    </Tab.Navigator>
  );
};

export default HomeTabNavigator;
