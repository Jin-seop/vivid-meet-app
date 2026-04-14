import { useMutation } from '@tanstack/react-query';
import auth, { AppleAuthProvider } from '@react-native-firebase/auth';
import { appleAuth } from '@invertase/react-native-apple-authentication';
import EncryptedStorage from 'react-native-encrypted-storage';
import { useAuth } from '../context/AuthContext';
import api from '../api/index';

export const useAppleAuth = (onSuccessCallback?: (data: any) => void) => {
  const { login } = useAuth();

  return useMutation({
    mutationFn: async () => {
      // 1. Apple 로그인 요청
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      const { identityToken, nonce } = appleAuthRequestResponse;

      if (!identityToken) {
        throw new Error('Apple Identity Token을 찾을 수 없습니다.');
      }

      // 2. Firebase 인증 정보 생성
      const appleCredential = AppleAuthProvider.credential(identityToken, nonce);
      const userCredential = await auth().signInWithCredential(appleCredential);

      // 3. 백엔드 검증을 위한 Firebase ID Token 추출
      const firebaseToken = await userCredential.user.getIdToken();

      // 4. 백엔드 서버 호출
      const backEndResponse = await api.post('/auth/apple', {
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
    onError: error => {
      console.error('Apple Auth Error:', error);
    },
  });
};
