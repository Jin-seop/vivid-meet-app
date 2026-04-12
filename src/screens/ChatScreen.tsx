import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import {
  ArrowLeft,
  MoreVertical,
  Send,
  Image as ImageIcon,
  Smile,
  Lock,
  Unlock,
  Gift,
} from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import AMText from '../components/common/AMText';

interface Message {
  id: string;
  sender: 'me' | 'them';
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'system';
}

const mockMessages: Message[] = [
  {
    id: '1',
    sender: 'them',
    content: '안녕하세요! 반갑습니다 😊',
    timestamp: '14:20',
    type: 'text',
  },
  {
    id: '2',
    sender: 'me',
    content: '네 안녕하세요! MBTI가 같네요!',
    timestamp: '14:21',
    type: 'text',
  },
  {
    id: '3',
    sender: 'them',
    content:
      '오! 그러게요 ㅎㅎ 저는 음악 듣는 걸 좋아하는데 취미가 어떻게 되세요?',
    timestamp: '14:22',
    type: 'text',
  },
  {
    id: '4',
    sender: 'me',
    content: '저도 음악 좋아해요! 요즘 뭐 듣고 계세요?',
    timestamp: '14:23',
    type: 'text',
  },
  {
    id: 'system',
    sender: 'them',
    content: '대화가 활발해졌어요! 사진 1장이 해제되었습니다 🎉',
    timestamp: '14:24',
    type: 'system',
  },
  {
    id: '5',
    sender: 'them',
    content: '요즘 인디 음악에 빠져있어요. 추천해드릴까요?',
    timestamp: '14:25',
    type: 'text',
  },
];

const ChatScreen = ({ navigation, route }: any) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [photosUnlocked, setPhotosUnlocked] = useState(2);
  const flatListRef = useRef<FlatList>(null);

  const chatUser = {
    name: '지수',
    mbti: 'ENFP',
    interests: ['음악', '영화', '여행'],
    online: true,
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
  };

  const handleSend = () => {
    if (!message.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'me',
      content: message,
      timestamp: new Date().toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      type: 'text',
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage('');

    // Simulate response
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'them',
        content: '네, 좋아요! 😊',
        timestamp: new Date().toLocaleTimeString('ko-KR', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        type: 'text',
      };
      setMessages(prev => [...prev, response]);
    }, 1000);
  };

  const renderMessage = ({ item }: { item: Message }) => {
    if (item.type === 'system') {
      return (
        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={styles.systemMsgContainer}
        >
          <View style={styles.systemMsgBadge}>
            <Gift size={14} color="#50E3C2" style={{ marginRight: 6 }} />
            <AMText style={styles.systemMsgText}>{item.content}</AMText>
          </View>
        </MotiView>
      );
    }

    const isMe = item.sender === 'me';
    return (
      <View
        style={[styles.messageRow, isMe ? styles.myMsgRow : styles.theirMsgRow]}
      >
        {!isMe && (
          <Image source={{ uri: chatUser.avatar }} style={styles.miniAvatar} />
        )}
        <View
          style={[
            styles.bubbleContainer,
            isMe ? styles.myBubbleContainer : styles.theirBubbleContainer,
          ]}
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
          <AMText style={styles.timestampText}>{item.timestamp}</AMText>
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
          <View style={styles.avatarWrapper}>
            <Image
              source={{ uri: chatUser.avatar }}
              style={styles.headerAvatar}
            />
            {chatUser.online && <View style={styles.onlineDot} />}
          </View>
          <View style={styles.userInfo}>
            <View style={styles.nameRow}>
              <AMText style={styles.userName} fontWeight={600}>
                {chatUser.name}
              </AMText>
              <View style={styles.dotRow}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.progressDot,
                      {
                        backgroundColor:
                          i < photosUnlocked ? '#50E3C2' : '#E5E7EB',
                      },
                    ]}
                  />
                ))}
              </View>
            </View>
            <AMText style={styles.userMeta}>
              {chatUser.mbti} • {chatUser.interests.slice(0, 2).join(', ')}
            </AMText>
          </View>
        </View>

        <TouchableOpacity>
          <MoreVertical size={24} color="#1F2937" />
        </TouchableOpacity>
      </View>

      {/* Photo Unlock Banner */}
      {photosUnlocked < 5 && (
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
                실물 사진 {5 - photosUnlocked}장 잠금됨
              </AMText>
            </View>
            <TouchableOpacity
              style={styles.bannerButton}
              onPress={() => setPhotosUnlocked(5)}
            >
              <Unlock size={14} color="#4A90E2" style={{ marginRight: 4 }} />
              <AMText style={styles.bannerButtonText} fontWeight={600}>
                즉시 해제
              </AMText>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      )}

      {/* Messages List */}
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
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
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
              placeholder="메시지를 입력하세요..."
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
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  avatarWrapper: { position: 'relative' },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#50E3C2',
    borderWidth: 2,
    borderColor: 'white',
  },
  userInfo: { marginLeft: 10 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  userName: { fontSize: 16, color: '#111827' },
  dotRow: { flexDirection: 'row', gap: 2 },
  progressDot: { width: 4, height: 4, borderRadius: 2 },
  userMeta: { fontSize: 11, color: '#9CA3AF' },
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
  messageList: { padding: 16, paddingBottom: 32 },
  systemMsgContainer: { alignItems: 'center', marginVertical: 16 },
  systemMsgBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(80, 227, 194, 0.15)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  systemMsgText: { fontSize: 13, color: '#50E3C2' },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  myMsgRow: { justifyContent: 'flex-end' },
  theirMsgRow: { justifyContent: 'flex-start' },
  miniAvatar: { width: 32, height: 32, borderRadius: 16, marginRight: 8 },
  bubbleContainer: { maxWidth: '75%', alignItems: 'flex-start' },
  myBubbleContainer: { alignItems: 'flex-end' },
  theirBubbleContainer: { alignItems: 'flex-start' },
  bubble: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20 },
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
  timestampText: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 4,
    marginHorizontal: 4,
  },
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
