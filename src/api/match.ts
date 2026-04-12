import api from './index';

export const matchApi = {
  /** 좋아요 보내기 (매칭 요청) */
  sendLike: (receiverId: string) => api.post('/match/like', { receiverId }),

  /** 매칭 성공 리스트 조회 (채팅 가능 목록) */
  getMatchedList: () => api.get('/match/list'),

  /** 상대방 실물 사진 잠금 해제 (200P 소모) */
  unlockPhoto: (matchId: string) => api.patch(`/match/${matchId}/unlock`),

  /** 내 매칭 이력 조회 */
  getMatchHistory: () => api.get('/match/history'),
};
