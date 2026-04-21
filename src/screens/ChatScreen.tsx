import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Alert,
  Image,
} from 'react-native';
import AMTouchableOpacity from '../components/common/AMTouchableOpacity';
import {
  ArrowLeft,
  MoreVertical,
  Send,
  Image as ImageIcon,
  Smile,
  AlertTriangle,
  UserX,
} from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { StackScreenProps } from '@react-navigation/stack';
import AMText from '../components/common/AMText';
import {
  RootStackParamList,
  RootStackScreenName,
} from './navigation/RootStack';
import { chatApi } from '../api/chat';
import { reportApi } from '../api/report';
import { matchApi } from '../api/match';
import { socketService } from '../api/socket';
import { logEvent } from '../utils/analytics';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import CenterModal, { ModalButton } from '../components/common/CenterModal';
import { launchImageLibrary } from 'react-native-image-picker';

type ChatScreenProps = StackScreenProps<
  RootStackParamList,
  RootStackScreenName.Chat
>;

interface Message {
  id: string;
  senderId: string;
  content: string; // 텍스트 또는 이미지 URL
  isRead?: boolean;
  createdAt: string;
  type?: 'text' | 'image' | 'system';
}

const ChatScreen = ({ navigation, route }: ChatScreenProps) => {
  const { matchId, otherUser } = route.params as any;

  const { t } = useTranslation();
  const { user } = useAuth();

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // 모달 및 메뉴 상태
  const [showMenu, setShowMenu] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [reportReason, setReportReason] = useState('');

  const flatListRef = useRef<FlatList>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const reportReasons = [
    t('report.reason_insult', '욕설 및 비하 발언'),
    t('report.reason_sexual', '성적인 대화 유도'),
    t('report.reason_scam', '사기 및 광고'),
    t('report.reason_inappropriate', '부적절한 프로필 사진'),
    t('report.reason_other', '기타'),
  ];

  const handleReport = async () => {
    if (!reportReason) {
      Alert.alert(t('common.error', '오류'), t('report.select_reason', '신고 사유를 선택해주세요.'));
      return;
    }

    try {
      await reportApi.createReport({
        targetId: otherUser?.id,
        reason: reportReason,
      });
      logEvent('user_report', {
        target_id: otherUser?.id,
        reason: reportReason,
      });
      Alert.alert(t('common.success', '성공'), t('report.success_msg', '신고가 접수되었습니다. 운영팀에서 검토 후 조치하겠습니다.'));
      setShowReportModal(false);
      setReportReason('');
    } catch {
      Alert.alert(t('common.error', '오류'), t('report.fail_msg', '신고 접수 중 오류가 발생했습니다.'));
    }
  };

  const handleBlock = async () => {
    try {
      await matchApi.blockUser(otherUser?.id);
      logEvent('user_block', {
        target_id: otherUser?.id,
      });
      Alert.alert(t('common.success', '성공'), t('block.success_msg', '상대방을 차단했습니다.'));
      setShowBlockModal(false);
      navigation.goBack(); // 차단 후 채팅방 퇴장
    } catch {
      Alert.alert(t('common.error', '오류'), t('block.fail_msg', '차단 처리 중 오류가 발생했습니다.'));
    }
  };

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

      socketService.sendMessage(matchId, imageUrl);
      logEvent('send_message', {
        match_id: matchId,
        type: 'image',
      });
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
    logEvent('send_message', {
      match_id: matchId,
      type: 'text',
    });
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
        <AMTouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="#1F2937" />
        </AMTouchableOpacity>
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
        <View>
          <AMTouchableOpacity onPress={() => setShowMenu(!showMenu)}>
            <MoreVertical size={24} color="#1F2937" />
          </AMTouchableOpacity>

          {showMenu && (
            <View style={styles.menuDropdown}>
              <AMTouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  setShowMenu(false);
                  setShowReportModal(true);
                }}
              >
                <AlertTriangle size={18} color="#EF4444" />
                <AMText style={styles.reportText} fontWeight={600}>
                  {t('chat_detail.report', '신고하기')}
                </AMText>
              </AMTouchableOpacity>
              <View style={styles.menuDivider} />
              <AMTouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  setShowMenu(false);
                  setShowBlockModal(true);
                }}
              >
                <UserX size={18} color="#374151" />
                <AMText style={styles.menuText} fontWeight={600}>
                  {t('chat_detail.block', '차단하기')}
                </AMText>
              </AMTouchableOpacity>
            </View>
          )}
        </View>
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
        onScrollBeginDrag={() => setShowMenu(false)} // 스크롤 시 메뉴 닫기
      />

      {/* Report Modal */}
      <CenterModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        title={t('report.title', '유저 신고')}
        footer={
          <View style={styles.modalButtons}>
            <ModalButton variant="secondary" onClick={() => setShowReportModal(false)}>
              {t('common.cancel', '취소')}
            </ModalButton>
            <ModalButton variant="danger" onClick={handleReport}>
              {t('report.submit', '신고하기')}
            </ModalButton>
          </View>
        }
      >
        <AMText style={styles.modalDesc}>
          {t('report.desc', '신고 사유를 선택해주세요. 허위 신고 시 이용 제한을 받을 수 있습니다.')}
        </AMText>
        <View style={styles.reasonList}>
          {reportReasons.map((reason, index) => (
            <AMTouchableOpacity
              key={index}
              style={[
                styles.reasonItem,
                reportReason === reason && styles.reasonItemSelected,
              ]}
              onPress={() => setReportReason(reason)}
            >
              <AMText
                style={[
                  styles.reasonText,
                  reportReason === reason && styles.reasonTextSelected,
                ]}
              >
                {reason}
              </AMText>
            </AMTouchableOpacity>
          ))}
        </View>
      </CenterModal>

      {/* Block Modal */}
      <CenterModal
        isOpen={showBlockModal}
        onClose={() => setShowBlockModal(false)}
        title={t('block.title', '유저 차단')}
        footer={
          <View style={styles.modalButtons}>
            <ModalButton variant="secondary" onClick={() => setShowBlockModal(false)}>
              {t('common.cancel', '취소')}
            </ModalButton>
            <ModalButton variant="danger" onClick={handleBlock}>
              {t('block.confirm', '차단하기')}
            </ModalButton>
          </View>
        }
      >
        <AMText style={styles.modalDesc}>
          {t('block.desc', '상대방을 차단하시겠습니까? 차단 시 서로 메시지를 주고받을 수 없으며, 매칭 목록에서도 삭제됩니다.')}
        </AMText>
      </CenterModal>

      {/* Input Area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={90}
      >
        <View style={styles.inputArea}>
          <AMTouchableOpacity style={styles.inputIconButton} onPress={pickImage}>
            <ImageIcon size={22} color="#9CA3AF" />
          </AMTouchableOpacity>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={message}
              onChangeText={handleTextChange}
              placeholder={otherUser?.isDeleted 
                ? t('chat_detail.withdrawn_user_input', '탈퇴한 유저와는 대화할 수 없습니다.')
                : t('chat_detail.input_placeholder', '메시지를 입력하세요...')}
              placeholderTextColor="#9CA3AF"
              multiline
              editable={!otherUser?.isDeleted}
            />
            <AMTouchableOpacity style={styles.smileButton} disabled={otherUser?.isDeleted}>
              <Smile size={20} color={otherUser?.isDeleted ? "#E5E7EB" : "#9CA3AF"} />
            </AMTouchableOpacity>
          </View>
          {selectedImage ? (
            <AMTouchableOpacity
              style={[styles.sendButton, otherUser?.isDeleted && styles.sendButtonDisabled]}
              onPress={sendImage}
              disabled={otherUser?.isDeleted}
            >
              <Send size={20} color="white" style={styles.sendIcon} />
            </AMTouchableOpacity>
          ) : (
            <AMTouchableOpacity
              style={[
                styles.sendButton,
                (!message.trim() || otherUser?.isDeleted) && styles.sendButtonDisabled,
              ]}
              onPress={handleSend}
              disabled={!message.trim() || otherUser?.isDeleted}
            >
              <Send size={20} color="white" style={styles.sendIcon} />
            </AMTouchableOpacity>
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
  // 메뉴 관련 스타일
  menuDropdown: {
    position: 'absolute',
    top: 30,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 8,
    width: 150,
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    gap: 10,
  },
  menuText: {
    fontSize: 15,
    color: '#374151',
  },
  reportText: {
    fontSize: 15,
    color: '#EF4444',
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginHorizontal: 8,
  },
  // 모달 관련 스타일
  modalDesc: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
    lineHeight: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  reasonList: {
    gap: 8,
  },
  reasonItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  reasonItemSelected: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FEE2E2',
  },
  reasonText: {
    fontSize: 15,
    color: '#374151',
  },
  reasonTextSelected: {
    color: '#EF4444',
  },
  sendIcon: {
    marginLeft: 2,
  },
});

export default ChatScreen;
