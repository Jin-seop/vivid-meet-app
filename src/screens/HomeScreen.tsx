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
import { Sparkles, Zap, Heart, MessageCircle, User } from 'lucide-react-native';
import AMText from '../components/common/AMText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackScreenName } from './navigation/RootStack';
import { useTranslation } from 'react-i18next';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { matchApi } from '../api/match';
import { socketService } from '../api/socket';
import { logEvent } from '../utils/analytics';

const HomeScreen = ({ navigation }: any) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [isMatching, setIsMatching] = useState(false);

  // 1. 최근 매칭 목록 조회
  const { data: recentMatches } = useQuery({
    queryKey: ['recentMatches'],
    queryFn: () => matchApi.getMatchHistory().then(res => res.data),
  });

  useEffect(() => {
    socketService.connect();
    const handleMatchFound = (matchData: {
      matchId: string;
      partnerId: string;
    }) => {
      setIsMatching(false);
      queryClient.invalidateQueries({ queryKey: ['recentMatches'] }); // 목록 갱신

      // Analytics
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
  }, [navigation, queryClient]);

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
    } catch {
      setIsMatching(false);
      logEvent('match_error');
      Alert.alert('오류', '매칭 중 문제가 발생했습니다.');
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
});

export default HomeScreen;
