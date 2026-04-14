import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { MotiView } from 'moti';
import {
  Sparkles,
  Zap,
  Heart,
  MessageCircle,
  Filter,
  Star,
} from 'lucide-react-native';
import AMText from '../components/common/AMText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackScreenName } from './navigation/RootStack';
import { useTranslation } from 'react-i18next';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { userApi } from '../api/user';
import { matchApi } from '../api/match';
import { socketService } from '../api/socket'; // 👉 소켓 이벤트 수신을 위해 임포트

const HomeScreen = ({ navigation }: any) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [isMatching, setIsMatching] = useState(false);

  // 포인트 및 무료 횟수 조회 쿼리
  const { data } = useQuery({
    queryKey: ['myPoints'],
    queryFn: () => userApi.getMyPoints().then(res => res.data),
  });

  // API에서 무료 횟수를 받아오면 사용하고, 없으면 기본값 10
  const freeMatches = data?.freeMatchCount ?? 10;

  // 👉 소켓 연결 및 'matchFound' 이벤트 리스너 등록
  useEffect(() => {
    // 앱 접속 시 소켓 연결
    socketService.connect();

    // 누군가 나와 매칭되었을 때 (내가 WAITING 상태일 때)
    const handleMatchFound = (matchData: {
      matchId: string;
      partnerId: string;
    }) => {
      console.log('✅ Match Found Event Received:', matchData);
      setIsMatching(false);
      queryClient.invalidateQueries({ queryKey: ['myPoints'] }); // 무료 횟수 갱신

      Alert.alert('매칭 성공!', '새로운 인연과 대화방이 열렸습니다.', [
        {
          text: '채팅방 가기',
          onPress: () =>
            navigation.navigate(RootStackScreenName.Chat, {
              matchId: matchData.matchId,
            }),
        },
      ]);
    };

    if (socketService.socket) {
      socketService.socket.on('matchFound', handleMatchFound);
    }

    // 컴포넌트 언마운트 시 리스너 해제 및 큐에서 제거
    return () => {
      if (socketService.socket) {
        socketService.socket.off('matchFound', handleMatchFound);
      }
      matchApi.leaveRandomChat().catch(() => {});
    };
  }, [navigation, queryClient]);

  // 👉 실제 매칭 API 호출 로직
  const handleInstantMatch = async () => {
    // 1. 이미 매칭 대기 중이라면 취소 처리
    if (isMatching) {
      try {
        await matchApi.leaveRandomChat();
        setIsMatching(false);
      } catch (error) {
        console.error('Failed to leave queue:', error);
      }
      return;
    }

    // 2. 무료 횟수가 없는 경우 방어 로직 (버튼 disabled 로도 막혀있음)
    if (freeMatches <= 0) {
      Alert.alert(
        '알림',
        t('home.reset_notice', '오늘의 무료 매칭을 모두 사용했습니다.'),
      );
      return;
    }

    // 3. 매칭 시작
    try {
      setIsMatching(true);

      // (추후 필터 상태값을 연동할 수 있도록 ALL로 임시 고정)
      const response = await matchApi.joinRandomChat({
        targetGender: 'ALL',
        targetCountry: 'ALL',
      });

      if (response.data.status === 'MATCHED') {
        // 상대방이 이미 큐에 있어서 즉시 매칭 성공
        setIsMatching(false);
        queryClient.invalidateQueries({ queryKey: ['myPoints'] });
        navigation.navigate(RootStackScreenName.Chat, {
          matchId: response.data.matchId,
        });
      } else if (response.data.status === 'WAITING') {
        // 큐에 등록됨. 소켓의 'matchFound' 이벤트를 기다림
        console.log('⏳ 대기열 진입 완료, 상대방을 찾고 있습니다...');
      }
    } catch (error: any) {
      setIsMatching(false);
      console.error('Match error:', error);
      const msg =
        error.response?.data?.message || '매칭 요청 중 오류가 발생했습니다.';
      Alert.alert('알림', msg);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Sparkles size={24} color="#4A90E2" />
          <AMText style={styles.logoText} fontWeight={700}>
            AimoChat
          </AMText>
        </View>
        <View style={styles.badge}>
          <Zap size={12} color="#50E3C2" />
          <AMText style={styles.badgeText} fontWeight={600}>
            {t('home.free_remains', { count: freeMatches })}
          </AMText>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Instant Match Card */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          style={styles.matchCardContainer}
        >
          <LinearGradient
            colors={['#4A90E2', '#50E3C2']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.matchCard}
          >
            <View style={styles.matchCardHeader}>
              <View>
                <AMText style={styles.matchTitle} fontWeight={700}>
                  {t('home.instant_match', '랜덤 매칭 시작')}
                </AMText>
                <AMText style={styles.matchSubtitle}>
                  {t(
                    'home.instant_match_desc',
                    '지금 당장 대화할 친구를 찾아보세요!',
                  )}
                </AMText>
              </View>
              <Zap size={40} color="white" opacity={0.8} />
            </View>

            <TouchableOpacity
              style={[
                styles.matchButton,
                // 매칭 중이 아니면서 횟수가 0일 때만 버튼 완전 비활성화
                !isMatching && freeMatches <= 0 && styles.disabledButton,
              ]}
              onPress={handleInstantMatch}
              disabled={!isMatching && freeMatches <= 0}
            >
              {isMatching ? (
                <View style={styles.row}>
                  <MotiView
                    from={{ rotate: '0deg' }}
                    animate={{ rotate: '360deg' }}
                    transition={{
                      type: 'timing',
                      duration: 1000,
                      loop: true,
                      repeatReverse: false,
                    }}
                  >
                    <Sparkles size={20} color="#4A90E2" />
                  </MotiView>
                  <AMText style={styles.matchButtonText} fontWeight={700}>
                    {t('home.matching_status', '상대방 찾는 중... (취소)')}
                  </AMText>
                </View>
              ) : (
                <View style={styles.row}>
                  <MessageCircle size={20} color="#4A90E2" />
                  <AMText style={styles.matchButtonText} fontWeight={700}>
                    {t('home.start_chat', '채팅 시작하기')}
                  </AMText>
                </View>
              )}
            </TouchableOpacity>

            {freeMatches <= 0 && (
              <AMText style={styles.resetText}>
                {t(
                  'home.reset_notice',
                  '매일 밤 자정에 무료 횟수가 초기화됩니다.',
                )}
              </AMText>
            )}
          </LinearGradient>
          <View style={styles.matchCardFooter}>
            <Star size={16} color="#4A90E2" />
            <AMText style={styles.matchCardFooterText}>
              {t(
                'home.footer_info',
                '매칭 후 24시간 동안 무료로 대화가 가능합니다.',
              )}
            </AMText>
          </View>
        </MotiView>

        {/* Filter Settings */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 100 }}
          style={styles.sectionCard}
        >
          <View style={styles.sectionHeader}>
            <View style={styles.row}>
              <Filter size={18} color="#717182" />
              <AMText style={styles.sectionTitle} fontWeight={600}>
                {t('home.filter_title', '매칭 필터 설정')}
              </AMText>
            </View>
            <TouchableOpacity>
              <AMText style={styles.actionText} fontWeight={600}>
                {t('home.filter_change', '변경')}
              </AMText>
            </TouchableOpacity>
          </View>

          <View style={styles.filterItem}>
            <AMText style={styles.filterLabel}>
              {t('signup.gender', '성별')}
            </AMText>
            <View style={styles.filterBadge}>
              <AMText style={styles.filterBadgeText}>
                {t('signup.male', '남성')}/{t('signup.female', '여성')}
              </AMText>
            </View>
          </View>
          <View style={styles.filterItem}>
            <AMText style={styles.filterLabel}>
              {t('signup.region', '국가')}
            </AMText>
            <View style={styles.filterBadge}>
              <AMText style={styles.filterBadgeText}>
                {t('signup.korea', '한국')}/{t('signup.japan', '일본')}
              </AMText>
            </View>
          </View>
        </MotiView>

        {/* Recent Matches */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 200 }}
        >
          <View style={styles.sectionHeader}>
            <AMText style={styles.sectionTitle} fontWeight={600}>
              {t('home.recent_matches', '최근 매칭된 친구들')}
            </AMText>
          </View>

          <View style={styles.recentGrid}>
            {[
              {
                name: '지수',
                mbti: 'ENFP',
                image:
                  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
              },
              {
                name: '민준',
                mbti: 'INTJ',
                image:
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
              },
              {
                name: '서연',
                mbti: 'ISFJ',
                image:
                  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
              },
            ].map((person, index) => (
              <TouchableOpacity key={index} style={styles.recentCard}>
                <View style={styles.imageWrapper}>
                  <Image
                    source={{ uri: person.image }}
                    style={styles.recentImage}
                  />
                  <View style={styles.onlineStatus} />
                </View>
                <View style={styles.recentInfo}>
                  <AMText
                    style={styles.recentName}
                    fontWeight={600}
                    numberOfLines={1}
                  >
                    {person.name}
                  </AMText>
                  <AMText style={styles.recentMbti}>{person.mbti}</AMText>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </MotiView>

        {/* Premium Banner */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 300 }}
        >
          <LinearGradient
            colors={['#8B5CF6', '#EC4899']}
            style={styles.premiumCard}
          >
            <View style={styles.premiumHeader}>
              <View>
                <AMText style={styles.premiumTitle} fontWeight={700}>
                  {t('home.premium_title', 'Aimo 프리미엄')}
                </AMText>
                <AMText style={styles.premiumSubtitle}>
                  {t(
                    'home.premium_desc',
                    '무제한 매칭과 광고 없는 쾌적한 환경',
                  )}
                </AMText>
              </View>
              <Heart size={32} color="white" />
            </View>
            <TouchableOpacity style={styles.premiumButton}>
              <AMText style={styles.premiumButtonText} fontWeight={700}>
                {t('home.premium_subscribe', '프리미엄 구독하기')}
              </AMText>
            </TouchableOpacity>
          </LinearGradient>
        </MotiView>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoText: { fontSize: 20, color: '#4A90E2' },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F9F5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  badgeText: { fontSize: 12, color: '#50E3C2' },
  scrollContent: { padding: 20, gap: 24 },
  matchCardContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  matchCard: { padding: 24 },
  matchCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  matchTitle: { fontSize: 24, color: 'white', marginBottom: 4 },
  matchSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.9)' },
  matchButton: {
    height: 56,
    backgroundColor: 'white',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  matchButtonText: { fontSize: 18, color: '#4A90E2' },
  disabledButton: { opacity: 0.8 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  resetText: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 12,
    opacity: 0.8,
  },
  matchCardFooter: {
    padding: 12,
    backgroundColor: '#F0F7FF',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  matchCardFooterText: { fontSize: 12, color: '#4A90E2' },
  sectionCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 16, color: '#1F2937' },
  actionText: { fontSize: 14, color: '#4A90E2' },
  filterItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  filterLabel: { fontSize: 14, color: '#717182' },
  filterBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  filterBadgeText: { fontSize: 12, color: '#374151' },
  recentGrid: { flexDirection: 'row', gap: 12 },
  recentCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  imageWrapper: { width: '100%', aspectRatio: 1 },
  recentImage: { width: '100%', height: '100%' },
  onlineStatus: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#50E3C2',
    borderWidth: 2,
    borderColor: 'white',
  },
  recentInfo: { padding: 8 },
  recentName: { fontSize: 14, color: '#1F2937' },
  recentMbti: { fontSize: 12, color: '#717182' },
  premiumCard: { padding: 24, borderRadius: 20 },
  premiumHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  premiumTitle: { fontSize: 20, color: 'white', marginBottom: 4 },
  premiumSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.9)' },
  premiumButton: {
    height: 48,
    backgroundColor: 'white',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  premiumButtonText: { color: '#8B5CF6', fontSize: 16 },
});

export default HomeScreen;
