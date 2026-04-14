import { API_URL } from '@env';
import axios from 'axios';
import { Platform } from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage'; // 보안 저장소 사용

const api = axios.create({
  baseURL: API_URL,
  timeout: 600000, // 사진 업로드를 고려하여 10초 설정
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Platform': Platform.OS,
  },
});

/**
 * 요청 인터셉터:
 * 모든 API 요청 전에 실행되어 Authorization 헤더에 JWT 토큰을 주입합니다.
 */
api.interceptors.request.use(
  async config => {
    try {
      // 보안 저장소에서 유저 토큰을 가져옵니다.
      const token = await EncryptedStorage.getItem('user_token');

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  error => {
    return Promise.reject(error);
  },
);

/**
 * 응답 인터셉터:
 * 서버 응답 후 에러 코드에 따라 공통 로직(로그아웃 등)을 처리합니다.
 */
api.interceptors.response.use(
  response => response,
  async error => {
    const { response } = error;

    // 401 Unauthorized: 토큰 만료 시 처리
    if (response && response.status === 401) {
      // 토큰 삭제 및 로그아웃 로직 (예시)
      await EncryptedStorage.removeItem('user_token');
      // 여기서 필요 시 전역 상태 초기화 또는 로그인 화면 이동 로직을 수행합니다.
    }

    // 500 이상의 서버 에러 처리
    if (response && response.status >= 500) {
      console.error('서버 에러가 발생했습니다.');
    }

    return Promise.reject(error);
  },
);

export default api;
