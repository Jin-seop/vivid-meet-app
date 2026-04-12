import api from './index';

export const chatApi = {
  /** 내 채팅방 리스트 조회 */
  getRooms: () => api.get('/chat/rooms'),

  /** 특정 채팅방 메시지 내역 조회 */
  getMessages: (matchId: string) => api.get(`/chat/rooms/${matchId}/messages`),

  /** 채팅방 나가기 (EXITED 상태 전환) */
  leaveRoom: (matchId: string) => api.patch(`/chat/rooms/${matchId}/leave`),
};
