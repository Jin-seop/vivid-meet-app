import api from './index';

// 성별 및 국가 타입 정의 (Prisma Enum 대응)
export type TargetGender = 'MALE' | 'FEMALE' | 'ALL';
export type TargetCountry = 'KR' | 'JP' | 'ALL';

export const matchApi = {
  /** 좋아요 보내기 (매칭 요청) */
  sendLike: (receiverId: string) => api.post('/match/like', { receiverId }),

  /** 매칭 성공 리스트 조회 (채팅 가능 목록) */
  getMatchedList: () => api.get('/match/list'),

  /** 내 매칭 이력 조회 */
  getMatchHistory: () => api.get('/match/history'),

  /** * 랜덤 채팅 매칭 진입
   * @returns status: 'MATCHED' (즉시 매칭) 또는 'WAITING' (대기열 진입)
   */
  joinRandomChat: (data: {
    targetGender: TargetGender;
    targetCountry: TargetCountry;
  }) => api.post('/match/random/join', data),

  /** 랜덤 채팅 대기 취소 (이탈) */
  leaveRandomChat: () => api.delete('/match/random/leave'),
};
