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
  Lock,
  Unlock,
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
  const [photosUnlocked, setPhotosUnlocked] = useState(false);

  const flatListRef = useRef<FlatList>(null);

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
    } catch (error) {
      console.error('Chat Init Error:', error);
    }
  }, [matchId, t]);

  useEffect(() => {
    initChat();

    // 화면(채팅방)을 벗어날 때 리스너 해제 (중복 수신 방지)
    return () => {
      socketService.socket?.off('newMessage');
      socketService.socket?.off('userLeft');
    };
  }, [initChat]);

  const handleSend = () => {
    if (!message.trim()) return;

    // 전역 소켓 서비스를 통해 서버로 메시지 발송
    socketService.sendMessage(matchId, message);

    // 보낸 후 입력창 초기화
    setMessage('');
  };

  const handleUnlockPhoto = async () => {
    try {
      await matchApi.unlockPhoto(matchId);
      setPhotosUnlocked(true);
      Alert.alert(
        t('common.confirm'),
        t('chat_detail.system_unlocked', '사진 잠금이 해제되었습니다!'),
      );
    } catch {
      Alert.alert(
        t('common.error_title'),
        t('profile.withdraw_failed', '처리 중 오류가 발생했습니다.'),
      );
    }
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
        <AMText style={styles.timestampText}>
          {new Date(item.createdAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </AMText>
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
        </View>
        {/* 우측 상단 더보기 (채팅방 나가기 등에 사용 가능) */}
        <TouchableOpacity>
          <MoreVertical size={24} color="#1F2937" />
        </TouchableOpacity>
      </View>

      {/* Photo Unlock Banner */}
      {!photosUnlocked && (
        <LinearGradient
          colors={['#4A90E2', '#50E3C2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.banner}
        >
          <View style={styles.bannerContent}>
            <View style={styles.row}>
              <Lock size={14} color="white" />
              <AMText style={styles.bannerText} fontWeight={600}>
                {t(
                  'chat_detail.photo_locked',
                  '상대방의 진짜 얼굴이 블러 처리되어 있습니다.',
                )}
              </AMText>
            </View>
            <TouchableOpacity
              style={styles.bannerButton}
              onPress={handleUnlockPhoto}
            >
              <Unlock size={14} color="#4A90E2" style={{ marginRight: 4 }} />
              <AMText style={styles.bannerButtonText} fontWeight={700}>
                {t('chat_detail.instant_unlock', '잠금 해제')}
              </AMText>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      )}

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
              onChangeText={setMessage}
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
  banner: { paddingVertical: 12, paddingHorizontal: 16 },
  bannerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bannerText: { color: 'white', fontSize: 13, marginLeft: 8 },
  bannerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  bannerButtonText: { color: '#4A90E2', fontSize: 12 },
  messageList: { padding: 16 },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
    gap: 8,
  },
  myMsgRow: { justifyContent: 'flex-end', flexDirection: 'row-reverse' },
  theirMsgRow: { justifyContent: 'flex-start' },
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
