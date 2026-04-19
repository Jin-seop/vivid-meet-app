import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootStack from './src/screens/navigation/RootStack';
import { AuthProvider } from './src/context/AuthContext';
import './src/locales/i18n';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { firebase } from '@react-native-firebase/messaging';
import notifee, { EventType } from '@notifee/react-native';
import { Alert, Linking } from 'react-native';
import { RootStackScreenName } from './src/screens/navigation/RootStack';
import { navigationRef } from './src/screens/navigation/NavigationService';
import { requestInitialPermissions } from './src/utils/permissions';

export default function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: 1, staleTime: 1000 * 60 * 5 },
    },
  });

  useEffect(() => {
    // 앱 초기 권한 요청 (알림, ATT 등)
    requestInitialPermissions();

    // 1. Notifee 이벤트 리스너 (포그라운드 알림 클릭 등)
    const unsubscribeNotifee = notifee.onForegroundEvent(({ type, detail }) => {
      if (type === EventType.PRESS && detail.notification?.data?.matchId) {
        navigationRef.current?.navigate(RootStackScreenName.Chat, {
          matchId: detail.notification.data.matchId as string,
        });
      }
    });

    const setupNotifications = async () => {
      try {
        // 2. 권한 요청
        const authStatus = await firebase.messaging().requestPermission();
        const enabled =
          authStatus === firebase.messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === firebase.messaging.AuthorizationStatus.PROVISIONAL;

        if (!enabled) {
          Alert.alert('알림 권한 필요', '설정에서 알림을 허용해주세요.', [
            { text: '취소', style: 'cancel' },
            { text: '설정 이동', onPress: () => Linking.openSettings() },
          ]);
          return;
        }
      } catch (error) {
        console.error('Notification Setup Error:', error);
      }
    };

    setupNotifications();

    // 5. 포그라운드 메시지 수신
    const unsubscribeForeground = firebase
      .messaging()
      .onMessage(async remoteMessage => {
        console.log('Foreground Message:', remoteMessage);

        // Notifee를 사용하여 로컬 알림 표시
        await notifee.displayNotification({
          title: remoteMessage.notification?.title,
          body: remoteMessage.notification?.body,
          android: {
            channelId: 'fcm_channel_id',
            pressAction: { id: 'default' },
          },
          data: remoteMessage.data, // matchId 등을 전달
        });
      });

    // 6. 종료된 상태에서 알림 클릭으로 앱 오픈 시
    firebase
      .messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage?.data?.matchId) {
          setTimeout(() => {
            navigationRef.current?.navigate(RootStackScreenName.Chat, {
              matchId: remoteMessage.data?.matchId as string,
            });
          }, 500); // 네비게이션 준비 시간 확보
        }
      });

    return () => {
      unsubscribeNotifee();
      unsubscribeForeground();
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
