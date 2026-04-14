import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Alert,
} from 'react-native';
import {
  ArrowLeft,
  MoreVertical,
  Send,
  Image as ImageIcon,
  Smile,
} from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTranslation } from 'react-i18next';
import { StackScreenProps } from '@react-navigation/stack';
import AMText from '../components/common/AMText';
import {
  RootStackParamList,
  RootStackScreenName,
} from './navigation/RootStack';
import { chatApi } from '../api/chat';
import { matchApi } from '../api/match';
import { useAuth } from '../context/AuthContext';
import { socketService } from '../api/socket'; // 👉 전역 소켓 서비스 임포트
import { SafeAreaView } from 'react-native-safe-area-context';

type ChatScreenProps = StackScreenProps<
  RootStackParamList,
  RootStackScreenName.Chat
>;

interface Message {
  id: string;
  senderId: string;
  content: string;
  isRead?: boolean; // 👉 추가
  createdAt: string;
  type?: 'text' | 'image' | 'system';
}

const ChatScreen = ({ navigation, route }: ChatScreenProps) => {
  // 이전 화면(목록이나 매칭)에서 전달받은 파라미터 추출
  // (임시로 any 단언을 사용하여 타입 에러 방지. 추후 RootStackParamList에 otherUser 추가 권장)
  const { matchId, otherUser } = route.params as any;

  const { t } = useTranslation();
  const { user } = useAuth();

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const flatListRef = useRef<FlatList>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const initChat = useCallback(async () => {
    try {
      // 1. 기존 메시지 내역 불러오기
      const response = await chatApi.getMessages(matchId);
      setMessages(response.data);

      // 2. 소켓 연결 확인 및 룸 입장
      await socketService.connect();
      socketService.joinRoom(matchId);

      // 3. 실시간 메시지 수신 리스너 등록
      socketService.socket?.on('newMessage', (payload: Message) => {
        setMessages(prev => [...prev, payload]);
      });

      // 4. 상대방이 채팅방을 나갔을 때 감지
      socketService.socket?.on('userLeft', (data: { message: string }) => {
        Alert.alert(t('common.notice', '알림'), data.message);
      });

      // 5. 입력 중 상태 감지
      socketService.socket?.on('userTyping', (data: { userId: string }) => {
        if (data.userId !== user?.id) {
          setIsTyping(true);
        }
      });

      socketService.socket?.on('userStopTyping', (data: { userId: string }) => {
        if (data.userId !== user?.id) {
          setIsTyping(false);
        }
      });

      // 6. 읽음 처리 감지 (내 메시지를 상대방이 읽었을 때)
      socketService.socket?.on('messagesRead', (data: { userId: string }) => {
        if (data.userId !== user?.id) {
          setMessages(prev =>
            prev.map(msg =>
              msg.senderId === user?.id ? { ...msg, isRead: true } : msg,
            ),
          );
        }
      });
    } catch (error) {
      console.error('Chat Init Error:', error);
    }
  }, [matchId, t, user?.id]);

  useEffect(() => {
    initChat();

    // 화면(채팅방)을 벗어날 때 리스너 해제 (중복 수신 방지)
    return () => {
      socketService.leaveRoom(matchId);
      socketService.socket?.off('newMessage');
      socketService.socket?.off('userLeft');
      socketService.socket?.off('userTyping');
      socketService.socket?.off('userStopTyping');
      socketService.socket?.off('messagesRead');
    };
  }, [initChat, matchId]);

  const handleTextChange = (text: string) => {
    setMessage(text);

    // Typing indicator 발송
    if (text.length > 0) {
      socketService.typing(matchId);

      // 2초 후 입력 중단 처리 (debounce)
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socketService.stopTyping(matchId);
      }, 2000);
    } else {
      socketService.stopTyping(matchId);
    }
  };

  const handleSend = () => {
    if (!message.trim()) return;

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    socketService.stopTyping(matchId);

    // 전역 소켓 서비스를 통해 서버로 메시지 발송
    socketService.sendMessage(matchId, message);

    // 보낸 후 입력창 초기화
    setMessage('');
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isMe = item.senderId === user?.id;

    return (
      <View
        style={[styles.messageRow, isMe ? styles.myMsgRow : styles.theirMsgRow]}
      >
        <View
          style={[styles.bubble, isMe ? styles.myBubble : styles.theirBubble]}
        >
          <AMText
            style={[
              styles.bubbleText,
              isMe ? styles.myBubbleText : styles.theirBubbleText,
            ]}
          >
            {item.content}
          </AMText>
        </View>
        <View style={isMe ? styles.myInfo : styles.theirInfo}>
          {isMe && item.isRead && (
            <AMText style={styles.readIndicator}>
              {t('chat_detail.read', '읽음')}
            </AMText>
          )}
          <AMText style={styles.timestampText}>
            {new Date(item.createdAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </AMText>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <AMText style={styles.userName} fontWeight={700}>
            {/* 상대방 이름 표시 (없으면 기본값) */}
            {otherUser?.nickname || t('chat_list.title', '채팅방')}
          </AMText>
          {isTyping && (
            <AMText style={styles.typingIndicatorSmall}>
              {t('chat_detail.typing', '입력 중...')}
            </AMText>
          )}
        </View>
        {/* 우측 상단 더보기 (채팅방 나가기 등에 사용 가능) */}
        <TouchableOpacity>
          <MoreVertical size={24} color="#1F2937" />
        </TouchableOpacity>
      </View>

      {/* Message List */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item, index) => (item.id ? item.id : index.toString())}
        contentContainerStyle={styles.messageList}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
      />

      {/* Input Area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={90}
      >
        <View style={styles.inputArea}>
          <TouchableOpacity style={styles.inputIconButton}>
            <ImageIcon size={22} color="#9CA3AF" />
          </TouchableOpacity>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={message}
              onChangeText={handleTextChange}
              placeholder={t(
                'chat_detail.input_placeholder',
                '메시지를 입력하세요...',
              )}
              placeholderTextColor="#9CA3AF"
              multiline
            />
            <TouchableOpacity style={styles.smileButton}>
              <Smile size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={[
              styles.sendButton,
              !message.trim() && styles.sendButtonDisabled,
            ]}
            onPress={handleSend}
            disabled={!message.trim()}
          >
            <Send size={20} color="white" style={{ marginLeft: 2 }} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerCenter: { flex: 1, alignItems: 'center' },
  userName: { fontSize: 18, color: '#111827' },
  typingIndicatorSmall: { fontSize: 10, color: '#4A90E2', marginTop: 2 },
  messageList: { padding: 16 },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
    gap: 8,
  },
  myMsgRow: { justifyContent: 'flex-end', flexDirection: 'row-reverse' },
  theirMsgRow: { justifyContent: 'flex-start' },
  myInfo: { alignItems: 'flex-end' },
  theirInfo: { alignItems: 'flex-start' },
  readIndicator: { fontSize: 10, color: '#4A90E2', marginBottom: 2 },
  bubble: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    maxWidth: '75%',
  },
  myBubble: { backgroundColor: '#4A90E2', borderBottomRightRadius: 4 },
  theirBubble: {
    backgroundColor: 'white',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  bubbleText: { fontSize: 15, lineHeight: 22 },
  myBubbleText: { color: 'white' },
  theirBubbleText: { color: '#1F2937' },
  timestampText: { fontSize: 10, color: '#9CA3AF' },
  inputArea: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  inputIconButton: { padding: 10, paddingBottom: 12 },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 12,
    marginHorizontal: 8,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    fontSize: 16,
    color: '#1F2937',
    paddingTop: Platform.OS === 'ios' ? 12 : 8,
    paddingBottom: Platform.OS === 'ios' ? 12 : 8,
  },
  smileButton: { padding: 10, paddingBottom: 12 },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  sendButtonDisabled: { backgroundColor: '#E5E7EB' },
  row: { flexDirection: 'row', alignItems: 'center' },
});

export default ChatScreen;
