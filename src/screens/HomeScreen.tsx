import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Image,
  StatusBar,
  Alert,
} from 'react-native';
import AMTouchableOpacity from '../components/common/AMTouchableOpacity';
import LinearGradient from 'react-native-linear-gradient';
import { MotiView } from 'moti';
import { Sparkles, Zap, Heart, MessageCircle, User, Info } from 'lucide-react-native';
import AMText from '../components/common/AMText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackScreenName } from './navigation/RootStack';
import { useTranslation } from 'react-i18next';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { matchApi } from '../api/match';
import { userApi } from '../api/user';
import { socketService } from '../api/socket';
import { logEvent } from '../utils/analytics';
import { useAuth } from '../context/AuthContext';
import CenterModal, { ModalButton } from '../components/common/CenterModal';
import { RewardedAd, RewardedAdEventType, TestIds } from 'react-native-google-mobile-ads';

const rewarded = RewardedAd.createForAdRequest(TestIds.REWARDED, {
  requestNonPersonalizedAdsOnly: true,
});

const HomeScreen = ({ navigation }: any) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { user, login } = useAuth();

  const [isMatching, setIsMatching] = useState(false);
  const [showAiNotice, setShowAiNotice] = useState(false);

  // 1. 최근 매칭 목록 조회
  const { data: recentMatches } = useQuery({
    queryKey: ['recentMatches'],
    queryFn: () => matchApi.getMatchHistory().then(res => res.data),
  });

  useEffect(() => {
    // 기존 유저 중 AI 고지 미동의자 팝업 노출
    if (user && !user.isAiNoticeAccepted) {
      setShowAiNotice(true);
    }

    socketService.connect();
    const handleMatchFound = (matchData: {
      matchId: string;
      partnerId: string;
    }) => {
      setIsMatching(false);
      queryClient.invalidateQueries({ queryKey: ['recentMatches'] });

      logEvent('match_found', {
        match_id: matchData.matchId,
        method: 'socket',
      });

      navigation.navigate(RootStackScreenName.Chat, {
        matchId: matchData.matchId,
      });
    };

    socketService.socket?.on('matchFound', handleMatchFound);
    return () => {
      socketService.socket?.off('matchFound', handleMatchFound);
    };
  }, [navigation, queryClient, user]);

  const handleAcceptAiNotice = async () => {
    try {
      await userApi.acceptAiNotice();
      setShowAiNotice(false);
      // 로컬 유저 상태 업데이트
      if (user) {
        login({ ...user, isAiNoticeAccepted: true });
      }
    } catch (error) {
      Alert.alert('오류', '동의 처리에 실패했습니다.');
    }
  };

  const handleInstantMatch = async () => {
    if (isMatching) {
      await matchApi.leaveRandomChat().catch(() => {});
      setIsMatching(false);
      logEvent('match_cancel');
      return;
    }

    try {
      setIsMatching(true);
      logEvent('match_start');
      const response = await matchApi.joinRandomChat({
        targetGender: 'ALL',
        targetCountry: 'ALL',
      });

      if (response.data.status === 'MATCHED') {
        setIsMatching(false);
        queryClient.invalidateQueries({ queryKey: ['recentMatches'] });

        logEvent('match_found', {
          match_id: response.data.matchId,
          method: 'api',
        });

        navigation.navigate(RootStackScreenName.Chat, {
          matchId: response.data.matchId,
        });
      }
    } catch (error: any) {
      setIsMatching(false);
      logEvent('match_error');
      if (error.response?.data?.message?.includes('무료 매칭 횟수를 모두 소진')) {
        Alert.alert('횟수 부족', '광고를 시청하고 1회 충전하시겠습니까?', [
          { text: '취소', style: 'cancel' },
          { text: '광고 시청', onPress: showRewardedAd }
        ]);
      } else {
        Alert.alert('오류', '매칭 중 문제가 발생했습니다.');
      }
    }
  };

  const showRewardedAd = () => {
    const unsubscribe = rewarded.addAdEventListener(RewardedAdEventType.EARNED_REWARD, async () => {
      try {
        await userApi.chargeMatchCount('test1ca-app-pub-8502781645264431/1288687661');
        Alert.alert('충전 완료', '매칭 횟수가 1회 충전되었습니다.');
      } catch (err) {
        Alert.alert('오류', '충전 처리 중 문제가 발생했습니다.');
      }
    });
    rewarded.load();
    rewarded.show();
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
                  {t('home.instant_match')}
                </AMText>
                <AMText style={styles.matchSubtitle}>
                  {t('home.instant_match_desc')}
                </AMText>
              </View>
              <Zap size={40} color="white" opacity={0.8} />
            </View>

            <AMTouchableOpacity
              style={styles.matchButton}
              onPress={handleInstantMatch}
            >
              <View style={styles.row}>
                {isMatching ? (
                  <AMText style={styles.matchButtonText} fontWeight={700}>
                    {t('home.matching_status')}
                  </AMText>
                ) : (
                  <>
                    <MessageCircle size={20} color="#4A90E2" />
                    <AMText style={styles.matchButtonText} fontWeight={700}>
                      {t('home.start_chat')}
                    </AMText>
                  </>
                )}
              </View>
            </AMTouchableOpacity>
          </LinearGradient>
        </MotiView>

        {/* Recent Matches Section */}
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
            {recentMatches && recentMatches.length > 0 ? (
              recentMatches.slice(0, 3).map((match: any) => (
                <AMTouchableOpacity
                  key={match.id}
                  style={styles.recentCard}
                  onPress={() =>
                    navigation.navigate(RootStackScreenName.Chat, {
                      matchId: match.id,
                    })
                  }
                >
                  <View style={styles.imageWrapper}>
                    {match.otherUser?.aiPhotoUrl ? (
                      <Image
                        source={{ uri: match.otherUser.aiPhotoUrl }}
                        style={styles.recentImage}
                      />
                    ) : (
                      <View style={styles.recentImagePlaceholder}>
                        <User size={30} color="#D1D5DB" />
                      </View>
                    )}
                  </View>
                  <View style={styles.recentInfo}>
                    <AMText
                      style={styles.recentName}
                      fontWeight={600}
                      numberOfLines={1}
                    >
                      {match.otherUser?.nickname}
                    </AMText>
                    <AMText style={styles.recentMbti}>
                      {match.otherUser?.mbti || 'AIMO'}
                    </AMText>
                  </View>
                </AMTouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyRecent}>
                <AMText style={styles.emptyRecentText}>
                  {t('home.no_recent_matches', '최근 매칭 내역이 없습니다.')}
                </AMText>
              </View>
            )}
          </View>
        </MotiView>
      </ScrollView>

      {/* AI 투명성 고지 모달 */}
      <CenterModal
        isOpen={showAiNotice}
        onClose={() => {}} // 강제 동의 필요 시 비워둠
        title={t('login.agreement_title')}
      >
        <View style={styles.modalContent}>
          <View style={styles.infoIconWrapper}>
            <Info size={40} color="#4A90E2" />
          </View>
          <AMText style={styles.modalDescription}>
            {t('login.agree_ai_desc', 'AimoChat은 AI 기술을 활용하여 생성된 가상의 캐릭터를 사용합니다.\n\n사용자는 서비스 내의 캐릭터가 AI에 의해 생성되었음을 인지하고 사용함에 동의합니다.')}
          </AMText>
          <ModalButton variant="primary" onClick={handleAcceptAiNotice}>
            {t('common.confirm', '동의하고 시작하기')}
          </ModalButton>
        </View>
      </CenterModal>
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
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 16, color: '#1F2937' },
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
  recentImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recentInfo: { padding: 8 },
  recentName: { fontSize: 14, color: '#1F2937' },
  recentMbti: { fontSize: 12, color: '#717182' },
  emptyRecent: { flex: 1, padding: 20, alignItems: 'center' },
  emptyRecentText: { color: '#9CA3AF', fontSize: 14 },
  // 모달 관련 스타일
  modalContent: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  infoIconWrapper: {
    marginBottom: 20,
  },
  modalDescription: {
    fontSize: 15,
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
});

export default HomeScreen;
