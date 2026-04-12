import { io, Socket } from 'socket.io-client';
import EncryptedStorage from 'react-native-encrypted-storage';
import { API_BASE } from '@env';

class SocketService {
  public socket: Socket | null = null;

  // 소켓 연결 초기화
  async connect() {
    if (this.socket?.connected) return;

    const token = await EncryptedStorage.getItem('user_token');
    const BASE_URL = API_BASE;

    this.socket = io(`${BASE_URL}/chat`, {
      auth: {
        token: `Bearer ${token}`, // 백엔드 WsJwtGuard에서 검증
      },
      transports: ['websocket'],
    });

    this.socket.on('connect', () => {
      console.log('🚀 Socket Connected');
    });

    this.socket.on('disconnect', () => {
      console.log('🔌 Socket Disconnected');
    });
  }

  // 채팅방 입장
  joinRoom(matchId: string) {
    this.socket?.emit('joinRoom', { matchId });
  }

  // 메시지 전송
  sendMessage(matchId: string, content: string) {
    this.socket?.emit('sendMessage', { matchId, content });
  }

  // 연결 종료
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const socketService = new SocketService();
