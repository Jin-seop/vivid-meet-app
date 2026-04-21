import api from './index';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

export const userApi = {
  /** 닉네임 중복 체크 */
  checkNickname: (nickname: string) =>
    api.get(`/users/check-nickname?nickname=${nickname}`),

  /** 회원가입 */
  signUp: (userData: CreateUserDto) => api.post('/users', userData),

  /** 로그인 (이메일/비밀번호) */
  login: (userData: LoginDto) => api.post('/auth/login', userData),

  /** 토큰 갱신 */
  refresh: (userId: string, refreshToken: string) =>
    api.post('/auth/refresh', { userId, refreshToken }),

  /**
   * 소셜 로그인 (Google, Apple, Line)
   * @param provider 'GooGle' | 'Apple' | 'Line'
   * @param token Firebase ID Token 또는 Line Access Token
   * @param profile 유저 프로필 정보 (이메일, 닉네임, 사진 등)
   */
  socialLogin: (provider: string, token: string, profile?: any) =>
    api.post('/auth/google', { token, profile }), // Google, Apple, Line 모두 동일 엔드포인트 사용 (서버에서 provider로 구분)

  /**
   * 프로필 정보 조회
   */
  getProfile: () => api.get('/users/me'),

  /**
   * 프로필 정보 수정
   */
  updateProfile: (data: any) => api.patch('/users/me', data),

  /**
   * 실물 사진 업로드
   */
  uploadRealPhoto: (formData: FormData) =>
    api.post('/users/upload/photos', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  /** 회원 탈퇴 */
  withdraw: () => api.delete('/users/me/withdraw'),

  /** FCM 토큰 업데이트 */
  saveFcmToken: (fcmToken: string) =>
    api.put('/users/me/fcm-token', { fcmToken }),

  /** AI 투명성 고지 동의 처리 */
  acceptAiNotice: () => api.patch('/users/me/accept-ai-notice'),

  /** 유저 통계 정보 조회 */
  getStats: () => api.get('/users/me/stats'),
};
