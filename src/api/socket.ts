import { io, Socket } from 'socket.io-client';
import EncryptedStorage from 'react-native-encrypted-storage';
import { API_URL } from '@env';

class SocketService {
  public socket: Socket | null = null;

  async connect() {
    if (this.socket?.connected) return;

    const token = await EncryptedStorage.getItem('user_token');

    this.socket = io(`${API_URL}/chat`, {
      auth: {
        token: `Bearer ${token}`,
      },
      transports: ['websocket'],
    });

    this.socket.on('connect', () => {
      console.log('🚀 Socket Connected');
    });

    // --- 랜덤 매칭 관련 이벤트 추가 ---
    /** * 서버에서 매칭이 성사되었을 때 발생하는 이벤트
     * 프론트엔드에서는 이 이벤트를 받으면 해당 matchId 채팅방으로 내비게이션 처리를 해야 합니다.
     */
    this.socket.on(
      'matchFound',
      (data: { matchId: string; partnerId: string }) => {
        console.log('✅ Match Found!', data);
        // 이후 전역 상태(Redux/Zustand)나 콜백을 통해 UI에 알림
      },
    );

    this.socket.on('disconnect', () => {
      console.log('🔌 Socket Disconnected');
    });
  }

  joinRoom(matchId: string) {
    this.socket?.emit('joinRoom', { matchId });
  }

  sendMessage(matchId: string, content: string) {
    this.socket?.emit('sendMessage', { matchId, content });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const socketService = new SocketService();
