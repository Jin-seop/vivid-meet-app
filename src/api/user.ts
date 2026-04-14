import api from './index';

export interface CreateUserDto {
  email: string;
  nickname: string;
  provider: string;
  providerId: string;
  region: 'KR' | 'JP';
  gender: 'MALE' | 'FEMALE';
  posePhotoUrl?: string;
  realPhotos: string[];
}

export const userApi = {
  /** 회원가입 */
  signUp: (data: CreateUserDto) => api.post('/auth/signup', data),

  /** 추천 유저 목록 조회 */
  getRecommendedUsers: () => api.get('/users/recommend'),

  /** 내 포인트 잔액 조회 */
  getMyPoints: () => api.get('/users/me/points'),

  /** 닉네임 중복 체크 */
  checkNickname: (nickname: string) =>
    api.get<{ isAvailable: boolean }>(
      `/users/check-nickname?nickname=${nickname}`,
    ),

  /** AI 투명성 고지 동의 */
  acceptAiNotice: () => api.patch('/users/me/accept-ai-notice'),

  /** 실물 사진 업로드 (S3 URL 반환) */
  uploadPhotos: (formData: FormData) =>
    api.post('/users/upload/photos', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  /** 포인트 내역 조회 */
  getPointHistory: () => api.get('/users/me/point-history'),

  /** 회원 탈퇴 */
  withdraw: () => api.delete('/users/me/withdraw'),

  updateProfile: (data: any) => api.patch('/users/me', data),

  // 👉 통계 데이터 조회 API 추가
  getStats: () => api.get('/users/me/stats'),
};
