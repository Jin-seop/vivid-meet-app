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
import { SafeAreaView } from 'react-native-safe-area-context';
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
import { io, Socket } from 'socket.io-client';
import Config from 'react-native-config';
import EncryptedStorage from 'react-native-encrypted-storage';

import AMText from '../components/common/AMText';
import {
  RootStackParamList,
  RootStackScreenName,
} from './navigation/RootStack';
import { chatApi } from '../api/chat';
import { matchApi } from '../api/match';
import { useAuth } from '../context/AuthContext';

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
  const { id: matchId } = route.params;
  const { t } = useTranslation();
  const { user } = useAuth();

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [photosUnlocked, setPhotosUnlocked] = useState(false);

  const socketRef = useRef<Socket | null>(null);
  const flatListRef = useRef<FlatList>(null);

  const initChat = useCallback(async () => {
    try {
      // 1. 기존 메시지 내역 불러오기
      const response = await chatApi.getMessages(matchId);
      setMessages(response.data);

      // 2. 소켓 연결 및 룸 입장
      const token = await EncryptedStorage.getItem('user_token');
      const BASE_URL = Config.API_URL || 'https://api-dev.aimochat.com';

      socketRef.current = io(`${BASE_URL}/chat`, {
        auth: { token: `Bearer ${token}` },
        transports: ['websocket'],
      });

      socketRef.current.on('connect', () => {
        socketRef.current?.emit('joinRoom', { matchId });
      });

      // 3. 실시간 메시지 수신
      socketRef.current.on('newMessage', (payload: Message) => {
        setMessages(prev => [...prev, payload]);
      });

      // 4. 상대방 나감 감지
      socketRef.current.on('userLeft', (data: { message: string }) => {
        Alert.alert(t('common.error_title'), data.message);
      });
    } catch (error) {
      console.error('Chat Init Error:', error);
    }
  }, [matchId, t]);

  const handleSend = () => {
    if (!message.trim() || !socketRef.current) return;

    // 서버로 메시지 전송
    socketRef.current.emit('sendMessage', {
      matchId,
      content: message,
    });

    setMessage('');
  };

  const handleUnlockPhoto = async () => {
    try {
      await matchApi.unlockPhoto(matchId); //
      setPhotosUnlocked(true);
      Alert.alert(t('common.confirm'), t('chat_detail.system_unlocked'));
    } catch {
      Alert.alert(t('common.error_title'), t('profile.withdraw_failed'));
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isMe = item.senderId === user?.id; // 실제 연동 시 발신자 ID 비교 로직

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

  useEffect(() => {
    initChat();
    return () => {
      socketRef.current?.disconnect();
    };
  }, [initChat, matchId]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <AMText style={styles.userName} fontWeight={600}>
            {t('chat_list.title')}
          </AMText>
        </View>
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
              <AMText style={styles.bannerText}>
                {t('chat_detail.photo_locked', { count: 5 })}
              </AMText>
            </View>
            <TouchableOpacity
              style={styles.bannerButton}
              onPress={handleUnlockPhoto}
            >
              <Unlock size={14} color="#4A90E2" style={{ marginRight: 4 }} />
              <AMText style={styles.bannerButtonText} fontWeight={600}>
                {t('chat_detail.instant_unlock')}
              </AMText>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      )}

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
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
              placeholder={t('chat_detail.input_placeholder')}
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
            <Send size={20} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerCenter: { flex: 1, alignItems: 'center' },
  userName: { fontSize: 16, color: '#111827' },
  banner: { paddingVertical: 10, paddingHorizontal: 16 },
  bannerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bannerText: { color: 'white', fontSize: 13, marginLeft: 6 },
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
  bubbleText: { fontSize: 15, lineHeight: 20 },
  myBubbleText: { color: 'white' },
  theirBubbleText: { color: '#1F2937' },
  timestampText: { fontSize: 10, color: '#9CA3AF' },
  inputArea: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  inputIconButton: { padding: 8 },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    fontSize: 15,
    color: '#1F2937',
    paddingVertical: 8,
  },
  smileButton: { padding: 4 },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: { backgroundColor: '#D1D5DB' },
  row: { flexDirection: 'row', alignItems: 'center' },
});

export default ChatScreen;
