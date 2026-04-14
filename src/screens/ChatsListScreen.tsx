import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  StatusBar,
  RefreshControl,
} from 'react-native';
import { MotiView } from 'moti';
import { Search, MoreVertical, Lock } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useFocusEffect } from '@react-navigation/native';

import AMText from '../components/common/AMText';
import { RootStackScreenName } from './navigation/RootStack';
import { chatApi } from '../api/chat'; // 👉 API 임포트

const ChatsListScreen = ({ navigation }: any) => {
  const { t } = useTranslation();

  // 👉 실제 데이터를 담을 상태 관리
  const [rooms, setRooms] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  // 👉 서버에서 채팅방 목록을 가져오는 함수
  const fetchChatRooms = async () => {
    try {
      const response = await chatApi.getRooms();
      if (response.status === 200) {
        setRooms(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch chat rooms:', error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  // 👉 화면에 포커스 될 때마다 목록 새로고침 (채팅방 나갔다 들어왔을 때 최신 메시지 반영)
  useFocusEffect(
    useCallback(() => {
      fetchChatRooms();
    }, []),
  );

  // 👉 당겨서 새로고침 액션
  const onRefresh = () => {
    setIsRefreshing(true);
    fetchChatRooms();
  };

  // 👉 시간 포맷팅 (오늘이면 시간, 아니면 날짜 표시)
  const formatTime = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
      return date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
    }
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <AMText style={styles.headerTitle} fontWeight={700}>
            {t('chat_list.title', '채팅')}
          </AMText>
          <TouchableOpacity style={styles.iconButton}>
            <MoreVertical size={24} color="#1F2937" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Search size={18} color="#9CA3AF" style={styles.searchIcon} />
          <TextInput
            placeholder={t('chat_list.search_placeholder', '채팅방 검색')}
            style={styles.searchInput}
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor="#4A90E2"
          />
        }
      >
        {rooms.map((room, index) => {
          // 백엔드 데이터 매핑 (API 응답 구조에 맞게 매핑)
          const otherUser = room.otherUser || {};
          const unreadCount = room.unreadCount || 0;
          // TODO: 백엔드에 사진 잠금해제 정보가 연동되면 실제 데이터로 교체
          const photosUnlocked = 0;
          const totalPhotos = 5;
          const isOnline = false; // 소켓 연동 시 상태 업데이트

          return (
            <MotiView
              key={room.id}
              from={{ opacity: 0, translateY: 10 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 300, delay: index * 50 }}
            >
              <TouchableOpacity
                style={styles.chatItem}
                onPress={() =>
                  navigation.navigate(RootStackScreenName.Chat, {
                    matchId: room.id, // 채팅방 화면에 방 ID 전달
                    otherUser: otherUser,
                  })
                }
              >
                {/* Avatar Section */}
                <View style={styles.avatarWrapper}>
                  {otherUser.aiPhotoUrl ? (
                    <Image
                      source={{ uri: otherUser.aiPhotoUrl }}
                      style={styles.avatar}
                    />
                  ) : (
                    <View style={[styles.avatar, styles.avatarPlaceholder]}>
                      <AMText style={styles.avatarInitial} fontWeight={600}>
                        {otherUser.nickname?.[0] || '?'}
                      </AMText>
                    </View>
                  )}
                  {isOnline && <View style={styles.onlineDot} />}

                  {/* Photo Unlock Progress Badge */}
                  {photosUnlocked < totalPhotos && (
                    <View style={styles.lockBadge}>
                      <Lock size={10} color="white" />
                    </View>
                  )}
                </View>

                {/* Chat Info Section */}
                <View style={styles.chatInfo}>
                  <View style={styles.chatInfoTop}>
                    <View style={styles.nameRow}>
                      <AMText style={styles.chatName} fontWeight={600}>
                        {otherUser.nickname || '알 수 없음'}
                      </AMText>
                      {/* Progress Indicator dots */}
                      <View style={styles.dotRow}>
                        {Array.from({ length: totalPhotos }).map((_, i) => (
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
                    <AMText style={styles.timestamp}>
                      {formatTime(room.lastMessageTime)}
                    </AMText>
                  </View>

                  <View style={styles.chatInfoBottom}>
                    <AMText style={styles.lastMessage} numberOfLines={1}>
                      {room.lastMessage ||
                        t('chat_list.no_messages', '메시지가 없습니다.')}
                    </AMText>
                    {unreadCount > 0 && (
                      <View style={styles.unreadBadge}>
                        <AMText style={styles.unreadText} fontWeight={600}>
                          {unreadCount}
                        </AMText>
                      </View>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            </MotiView>
          );
        })}

        {/* Empty State */}
        {!loading && rooms.length === 0 && (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Search size={40} color="#D1D5DB" />
            </View>
            <AMText style={styles.emptyTitle} fontWeight={600}>
              {t('chat_list.empty_title', '채팅방이 없습니다')}
            </AMText>
            <AMText style={styles.emptyDesc}>
              {t('chat_list.empty_desc', '새로운 친구와 매칭을 시작해보세요!')}
            </AMText>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 12,
  },
  headerTitle: { fontSize: 24, color: '#111827' },
  iconButton: { padding: 4 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, height: 44, fontSize: 16, color: '#1F2937' },
  chatItem: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F9FAFB',
  },
  avatarWrapper: { position: 'relative' },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F3F4F6',
  },
  avatarPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E5E7EB',
  },
  avatarInitial: { fontSize: 22, color: '#9CA3AF' },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#50E3C2',
    borderWidth: 2,
    borderColor: 'white',
  },
  lockBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'white',
  },
  chatInfo: { flex: 1, marginLeft: 16, justifyContent: 'center' },
  chatInfoTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  chatName: { fontSize: 16, color: '#111827' },
  dotRow: { flexDirection: 'row', gap: 2 },
  progressDot: { width: 4, height: 4, borderRadius: 2 },
  timestamp: { fontSize: 12, color: '#9CA3AF' },
  chatInfoBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: { flex: 1, fontSize: 14, color: '#6B7280', marginRight: 8 },
  unreadBadge: {
    backgroundColor: '#4A90E2',
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    marginLeft: 8,
  },
  unreadText: { fontSize: 11, color: 'white' },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
    paddingHorizontal: 40,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: { fontSize: 18, color: '#1F2937', marginBottom: 8 },
  emptyDesc: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default ChatsListScreen;
