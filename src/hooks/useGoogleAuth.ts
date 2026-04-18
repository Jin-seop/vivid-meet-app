import { useMutation } from '@tanstack/react-query';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Alert } from 'react-native';
import auth, { GoogleAuthProvider } from '@react-native-firebase/auth';
import EncryptedStorage from 'react-native-encrypted-storage';
import { useAuth } from '../context/AuthContext';
import api from '../api/index'; //

export const useGoogleAuth = (onSuccessCallback?: (data: any) => void) => {
  const { login } = useAuth(); //

  return useMutation({
    mutationFn: async () => {
      // 1. 구글 로그인 시도
      const response = await GoogleSignin.signIn();

      // ✅ 최신 버전은 response.data.idToken 또는 response.idToken 구조입니다.
      // 라이브러리 버전마다 다를 수 있으므로 안전하게 추출합니다.
      const idToken = response.data
        ? response.data.idToken
        : (response as any).idToken;

      if (!idToken) {
        throw new Error('ID Token을 찾을 수 없습니다.');
      }

      // 2. Firebase 인증 정보 생성
      const googleCredential = GoogleAuthProvider.credential(idToken);
      const userCredential = await auth().signInWithCredential(
        googleCredential,
      );

      // 3. 백엔드 검증을 위한 Firebase ID Token 추출
      const firebaseToken = await userCredential.user.getIdToken();

      // 4. 우리 백엔드 서버 엔드포인트 호출
      const backEndResponse = await api.post('/auth/google', {
        token: firebaseToken,
      });
      return backEndResponse.data;
    },
    onSuccess: async data => {
      if (!data.isNewUser && data.accessToken) {
        await EncryptedStorage.setItem('user_token', data.accessToken);
        login(data.user);
      }

      if (onSuccessCallback) {
        onSuccessCallback(data);
      }
    },
    onError: (error: any) => {
      console.error('Google Auth Error:', error);
      const message =
        error.response?.data?.message ||
        '로그인 처리 중 오류가 발생했습니다. 다시 시도해주세요.';
      Alert.alert('로그인 실패', message);
    },
  });
};
