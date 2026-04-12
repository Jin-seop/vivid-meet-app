import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  StatusBar,
} from 'react-native';
import { MotiView } from 'moti';
import { Search, MoreVertical, Lock } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import VIText from '../components/common/VIText';
import { RootStackScreenName } from './navigation/RootStack';

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  online: boolean;
  avatar: string;
  photosUnlocked: number;
  totalPhotos: number;
}

const mockChats: Chat[] = [
  {
    id: '1',
    name: '지수',
    lastMessage: '오늘 날씨 정말 좋네요! 산책 가고 싶어요 😊',
    timestamp: '방금',
    unread: 3,
    online: true,
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    photosUnlocked: 2,
    totalPhotos: 5,
  },
  {
    id: '2',
    name: '민준',
    lastMessage: '음악 취향이 비슷하시네요! 저도 그 노래 좋아해요',
    timestamp: '5분 전',
    unread: 1,
    online: true,
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    photosUnlocked: 1,
    totalPhotos: 5,
  },
  {
    id: '3',
    name: '서연',
    lastMessage: '사진 감사해요! 저도 곧 보내드릴게요 ✨',
    timestamp: '1시간 전',
    unread: 0,
    online: false,
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    photosUnlocked: 3,
    totalPhotos: 5,
  },
  {
    id: '4',
    name: '준호',
    lastMessage: 'MBTI가 같네요! 반가워요 😄',
    timestamp: '어제',
    unread: 0,
    online: false,
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    photosUnlocked: 0,
    totalPhotos: 5,
  },
  {
    id: '5',
    name: '현지',
    lastMessage: '네! 저도 그 영화 재미있게 봤어요',
    timestamp: '2일 전',
    unread: 0,
    online: false,
    avatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
    photosUnlocked: 4,
    totalPhotos: 5,
  },
];

const ChatsListScreen = ({ navigation }: any) => {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <VIText style={styles.headerTitle} fontWeight={700}>
            채팅
          </VIText>
          <TouchableOpacity style={styles.iconButton}>
            <MoreVertical size={24} color="#1F2937" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Search size={18} color="#9CA3AF" style={styles.searchIcon} />
          <TextInput
            placeholder="대화 검색"
            style={styles.searchInput}
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {mockChats.map((chat, index) => (
          <MotiView
            key={chat.id}
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 300, delay: index * 50 }}
          >
            <TouchableOpacity
              style={styles.chatItem}
              onPress={() =>
                navigation.navigate(RootStackScreenName.Chat, { id: chat.id })
              }
            >
              {/* Avatar Section */}
              <View style={styles.avatarWrapper}>
                <Image source={{ uri: chat.avatar }} style={styles.avatar} />
                {chat.online && <View style={styles.onlineDot} />}

                {/* Photo Unlock Progress Badge */}
                {chat.photosUnlocked < chat.totalPhotos && (
                  <View style={styles.lockBadge}>
                    <Lock size={10} color="white" />
                  </View>
                )}
              </View>

              {/* Chat Info Section */}
              <View style={styles.chatInfo}>
                <View style={styles.chatInfoTop}>
                  <View style={styles.nameRow}>
                    <VIText style={styles.chatName} fontWeight={600}>
                      {chat.name}
                    </VIText>
                    {/* Progress Indicator dots */}
                    <View style={styles.dotRow}>
                      {Array.from({ length: chat.totalPhotos }).map((_, i) => (
                        <View
                          key={i}
                          style={[
                            styles.progressDot,
                            {
                              backgroundColor:
                                i < chat.photosUnlocked ? '#50E3C2' : '#E5E7EB',
                            },
                          ]}
                        />
                      ))}
                    </View>
                  </View>
                  <VIText style={styles.timestamp}>{chat.timestamp}</VIText>
                </View>

                <View style={styles.chatInfoBottom}>
                  <VIText style={styles.lastMessage} numberOfLines={1}>
                    {chat.lastMessage}
                  </VIText>
                  {chat.unread > 0 && (
                    <View style={styles.unreadBadge}>
                      <VIText style={styles.unreadText} fontWeight={600}>
                        {chat.unread}
                      </VIText>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          </MotiView>
        ))}

        {/* Empty State */}
        {mockChats.length === 0 && (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Search size={40} color="#D1D5DB" />
            </View>
            <VIText style={styles.emptyTitle} fontWeight={600}>
              아직 대화가 없습니다
            </VIText>
            <VIText style={styles.emptyDesc}>
              홈에서 즉시 매칭으로 새로운 친구를 만나보세요
            </VIText>
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
  lastMessage: { flex: 1, fontSize: 14, color: '#6B7280' },
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
