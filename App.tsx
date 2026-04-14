import React, { useState, useEffect, useCallback, useRef } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootStack from './src/screens/navigation/RootStack';
import { AuthProvider } from './src/context/AuthContext';
import './src/locales/i18n';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import { Platform, Alert, Linking } from 'react-native';
import api from './src/api';
import { userApi } from './src/api/user';
import { RootStackScreenName } from './src/screens/navigation/RootStack';

// 네비게이션 인스턴스에 접근하기 위한 ref
import { navigationRef } from './src/screens/navigation/NavigationService'; // NavigationService에서 navigationRef를 export한다고 가정

export default function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        staleTime: 1000 * 60 * 5,
      },
    },
  });

  useEffect(() => {
    // PushNotification 초기화 (Android 채널 생성 등)
    PushNotification.configure({
      onNotification: function (notification) {
        console.log('NOTIFICATION:', notification);
        // 알림 탭 시 동작
        if (notification.data?.matchId) {
          console.log('Navigating to chat room from notification:', notification.data.matchId);
          navigationRef.current?.navigate(RootStackScreenName.Chat, { matchId: notification.data.matchId });
        }
      },
      requestPermissions: Platform.OS === 'ios', // iOS에서만 권한 요청
    });

    const registerForPushNotifications = async () => {
      try {
        // 1. 알림 권한 요청
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
          console.log('Authorization granted');
          const token = await messaging().getToken();
          if (token) {
            console.log('FCM Token:', token);
            await userApi.saveFcmToken(token);
          }
        } else {
          console.log('Authorization not granted');
          Alert.alert(
            '알림 권한 필요',
            '알림을 받기 위해 권한을 허용해주세요. 설정으로 이동하시겠습니까?',
            [
              { text: '취소', style: 'cancel' },
              { text: '설정 이동', onPress: () => Linking.openSettings() },
            ],
          );
        }
      } catch (error) {
        console.error('Error getting FCM token or setting up listeners:', error);
      }
    };

    registerForPushNotifications();

    // Foreground 메시지 수신 리스너
    const unsubscribeForeground = messaging().onMessage(async remoteMessage => {
      console.log('Foreground Message:', JSON.stringify(remoteMessage));
      const notification = remoteMessage.notification;
      const data = remoteMessage.data;

      // Foreground 상태에서는 localNotification으로 알림 표시
      PushNotification.localNotification({
        channelId: 'fcm_channel_id', // TODO: 실제 채널 ID 설정 필요 (안드로이드)
        title: notification?.title,
        message: notification?.body,
        playSound: true,
        soundName: 'default',
        data: data,
      });
    });

    // Background/Quit 메시지 수신 리스너
    const unsubscribeBackground = messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Background Message:', JSON.stringify(remoteMessage));
      // 백그라운드 메시지는 시스템 트레이에 자동 표시됨. 탭 시 동작은 getInitialNotification에서 처리.
    });

    // 앱이 종료된 상태에서 푸시를 통해 실행되었을 때 메시지 핸들링
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log('Initial Notification:', JSON.stringify(remoteMessage));
          // 알림 탭 시 채팅방으로 이동
          if (remoteMessage.data?.matchId) {
            console.log('Navigating to chat room from initial notification:', remoteMessage.data.matchId);
            navigationRef.current?.navigate(RootStackScreenName.Chat, { matchId: remoteMessage.data.matchId });
          }
        }
      });

    return () => {
      unsubscribeForeground();
      unsubscribeBackground();
    };
  }, []);

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RootStack ref={navigationRef} />
        </AuthProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
