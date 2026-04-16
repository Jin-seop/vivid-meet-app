import { Platform, Alert, Linking } from 'react-native';
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  Permission,
  openSettings,
} from 'react-native-permissions';

export const APP_PERMISSIONS = {
  CAMERA: Platform.select({
    ios: PERMISSIONS.IOS.CAMERA,
    android: PERMISSIONS.ANDROID.CAMERA,
  }) as Permission,
  PHOTO_LIBRARY: Platform.select({
    ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
    android:
      Number(Platform.Version) >= 33
        ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
        : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
  }) as Permission,
  LOCATION: Platform.select({
    ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    android: PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
  }) as Permission,
  NOTIFICATIONS: Platform.select({
    ios: PERMISSIONS.IOS.NOTIFICATIONS,
    android: PERMISSIONS.ANDROID.POST_NOTIFICATIONS,
  }) as Permission,
  APP_TRACKING: Platform.select({
    ios: PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY,
    android: undefined, // Android does not have ATT
  }) as Permission | undefined,
};

export const checkPermission = async (permission: Permission): Promise<boolean> => {
  try {
    const result = await check(permission);
    return result === RESULTS.GRANTED;
  } catch (error) {
    console.error(`Error checking permission ${permission}:`, error);
    return false;
  }
};

export const requestPermission = async (
  permission: Permission,
  title: string,
  message: string
): Promise<boolean> => {
  try {
    const result = await request(permission);

    if (result === RESULTS.GRANTED) {
      return true;
    }

    if (result === RESULTS.BLOCKED || result === RESULTS.DENIED) {
      Alert.alert(title, message, [
        { text: '취소', style: 'cancel' },
        { text: '설정으로 이동', onPress: () => openSettings() },
      ]);
    }

    return false;
  } catch (error) {
    console.error(`Error requesting permission ${permission}:`, error);
    return false;
  }
};

export const requestInitialPermissions = async () => {
  // 앱 시작 시 필요한 기본 권한 요청 (예: 알림)
  if (APP_PERMISSIONS.NOTIFICATIONS) {
    await request(APP_PERMISSIONS.NOTIFICATIONS);
  }
  
  if (Platform.OS === 'ios' && APP_PERMISSIONS.APP_TRACKING) {
    await request(APP_PERMISSIONS.APP_TRACKING);
  }
};
