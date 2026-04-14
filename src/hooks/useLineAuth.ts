import { useMutation } from '@tanstack/react-query';
import Line from '@xmartlabs/react-native-line';
import EncryptedStorage from 'react-native-encrypted-storage';
import { useAuth } from '../context/AuthContext';
import api from '../api/index';

export const useLineAuth = (onSuccessCallback?: (data: any) => void) => {
  const { login } = useAuth();

  return useMutation({
    mutationFn: async () => {
      // 1. Line 로그인 요청 (@xmartlabs/react-native-line 사용)
      const result = await Line.login();
      
      const accessToken = result.accessToken?.access_token;

      if (!accessToken) {
        throw new Error('Line Access Token을 찾을 수 없습니다.');
      }

      // 2. 백엔드 서버 호출
      const backEndResponse = await api.post('/auth/line', {
        token: accessToken,
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
      console.error('Line Auth Error:', error);
    },
  });
};
