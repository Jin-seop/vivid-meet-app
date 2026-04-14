import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  Image,
} from 'react-native';
import {
  ArrowLeft,
  MoreVertical,
  Send,
  Image as ImageIcon,
  Smile,
} from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { StackScreenProps } from '@react-navigation/stack';
import AMText from '../components/common/AMText';
import {
  RootStackParamList,
  RootStackScreenName,
} from './navigation/RootStack';
import { chatApi } from '../api/chat';
import { socketService } from '../api/socket';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';

type ChatScreenProps = StackScreenProps<
  RootStackParamList,
  RootStackScreenName.Chat
>;

interface Message {
  id: string;
  senderId: string;
  content: string; // 텍스트 또는 이미지 URL
  isRead?: boolean; // 👉 추가
  createdAt: string;
  type?: 'text' | 'image' | 'system'; // 메시지 타입 구분
}

const ChatScreen = ({ navigation, route }: ChatScreenProps) => {
  const { matchId, otherUser } = route.params as any;

  const { t } = useTranslation();
  const { user } = useAuth();

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null); // 선택된 이미지 상태

  const flatListRef = useRef<FlatList>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const pickImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
    });

    if (result.assets && result.assets[0].uri) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const sendImage = async () => {
    if (!selectedImage) return;

    try {
      const formData = new FormData();
      formData.append('file', {
        uri: selectedImage,
        name: `chat-image-${Date.now()}.jpg`,
        type: 'image/jpeg',
      } as any);

      const uploadResponse = await chatApi.uploadImage(formData);
      const imageUrl = uploadResponse.data.url;

      socketService.sendMessage(matchId, imageUrl, 'IMAGE');
      setSelectedImage(null);
    } catch (error) {
      console.error('Image upload failed:', error);
      Alert.alert('오류', '이미지 전송에 실패했습니다.');
    }
  };

  const initChat = useCallback(async () => {
    try {
      const response = await chatApi.getMessages(matchId);
      setMessages(response.data);

      await socketService.connect();
      socketService.joinRoom(matchId);

      socketService.socket?.on('newMessage', (payload: Message) => {
        setMessages(prev => [...prev, payload]);
      });

      socketService.socket?.on('userLeft', (data: { message: string }) => {
        Alert.alert(t('common.notice', '알림'), data.message);
      });

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

    if (text.length > 0) {
      socketService.typing(matchId);
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

    socketService.sendMessage(matchId, message);
    setMessage('');
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isMe = item.senderId === user?.id;

    return (
      <View
        style={[styles.messageRow, isMe ? styles.myMsgRow : styles.theirMsgRow]}
      >
        {item.type === 'image' ? (
          <Image
            source={{ uri: item.content }}
            style={[
              styles.imageBubble,
              isMe ? styles.myImageBubble : styles.theirImageBubble,
            ]}
            resizeMode="cover"
          />
        ) : (
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
        )}
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
            {otherUser?.nickname || t('chat_list.title', '채팅방')}
          </AMText>
          {isTyping && (
            <AMText style={styles.typingIndicatorSmall}>
              {t('chat_detail.typing', '입력 중...')}
            </AMText>
          )}
        </View>
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
          <TouchableOpacity style={styles.inputIconButton} onPress={pickImage}>
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
          {selectedImage ? (
            <TouchableOpacity
              style={[styles.sendButton]}
              onPress={sendImage} // 이미지 전송
            >
              <Send size={20} color="white" style={{ marginLeft: 2 }} />
            </TouchableOpacity>
          ) : (
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
          )}
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
    justifyContent: 'space-between',
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
    color: '#111827',
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
  // 이미지 메시지 스타일 추가
  imageBubble: {
    padding: 0, // 이미지 자체에 패딩 제거
    borderRadius: 20,
    maxWidth: '75%',
    aspectRatio: 1, // 기본적으로 정사각형 비율 유지
  },
  myImageBubble: {
    backgroundColor: '#4A90E2',
    borderBottomRightRadius: 4,
  },
  theirImageBubble: {
    backgroundColor: 'white',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
});

export default ChatScreen;
