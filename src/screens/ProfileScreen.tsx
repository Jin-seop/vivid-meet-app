import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { MotiView } from 'moti';
import {
  Settings,
  Edit,
  Camera,
  Heart,
  MessageCircle,
  Star,
  ChevronRight,
  LogOut,
  Bell,
  Shield,
  HelpCircle,
  FileText,
  Sparkles,
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import VIText from '../components/common/VIText';

const { width } = Dimensions.get('window');

const ProfileScreen = ({ navigation }: any) => {
  const [isPremium, setIsPremium] = useState(false);

  const userProfile = {
    name: '김민지',
    age: 26,
    mbti: 'ENFP',
    interests: ['음악', '영화', '여행', '사진', '요리'],
    bio: '새로운 사람들과의 만남을 좋아하는 긍정적인 사람입니다 ✨',
    photos: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400',
      'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400',
      'https://images.unsplash.com/photo-1496440737103-cd596325d314?w=400',
    ],
    stats: {
      matches: 127,
      chats: 45,
      likes: 283,
    },
  };

  const renderMenuItem = (
    icon: React.ReactNode,
    title: string,
    onPress: () => void,
    isLast = false,
    isDestructive = false,
  ) => (
    <TouchableOpacity
      style={[styles.menuItem, isLast && styles.noBorder]}
      onPress={onPress}
    >
      <View style={styles.menuItemLeft}>
        {icon}
        <VIText
          style={[
            styles.menuItemTitle,
            isDestructive && styles.destructiveText,
          ]}
        >
          {title}
        </VIText>
      </View>
      <ChevronRight size={20} color="#9CA3AF" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header */}
      <SafeAreaView edges={['top']} style={styles.header}>
        <VIText style={styles.headerTitle} fontWeight={700}>
          마이페이지
        </VIText>
        <TouchableOpacity style={styles.iconButton}>
          <Settings size={24} color="#1F2937" />
        </TouchableOpacity>
      </SafeAreaView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Card */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
        >
          <View style={styles.profileCard}>
            <LinearGradient
              colors={['#4A90E2', '#50E3C2']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.cover}
            />

            <View style={styles.avatarSection}>
              <View style={styles.avatarWrapper}>
                <Image
                  source={{ uri: userProfile.photos[0] }}
                  style={styles.avatar}
                />
                <TouchableOpacity style={styles.cameraButton}>
                  <Camera size={16} color="white" />
                </TouchableOpacity>
              </View>
              {isPremium && (
                <LinearGradient
                  colors={['#8B5CF6', '#EC4899']}
                  style={styles.premiumBadge}
                >
                  <Sparkles
                    size={10}
                    color="white"
                    style={{ marginRight: 4 }}
                  />
                  <VIText style={styles.premiumBadgeText} fontWeight={600}>
                    프리미엄
                  </VIText>
                </LinearGradient>
              )}
            </View>

            <View style={styles.profileInfo}>
              <View style={styles.nameRow}>
                <View style={{ flex: 1 }}>
                  <VIText style={styles.userName} fontWeight={700}>
                    {userProfile.name}, {userProfile.age}
                  </VIText>
                  <View style={styles.badgeRow}>
                    <View style={styles.mbtiBadge}>
                      <VIText style={styles.mbtiText} fontWeight={600}>
                        {userProfile.mbti}
                      </VIText>
                    </View>
                    {userProfile.interests.slice(0, 2).map(interest => (
                      <View key={interest} style={styles.interestBadge}>
                        <VIText style={styles.interestText}>{interest}</VIText>
                      </View>
                    ))}
                  </View>
                </View>
                <TouchableOpacity style={styles.editButton}>
                  <Edit size={16} color="#4B5563" />
                  <VIText style={styles.editButtonText} fontWeight={600}>
                    편집
                  </VIText>
                </TouchableOpacity>
              </View>

              <VIText style={styles.bioText}>{userProfile.bio}</VIText>

              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <View style={styles.statIconRow}>
                    <Heart size={16} color="#4A90E2" />
                    <VIText style={styles.statValue} fontWeight={700}>
                      {userProfile.stats.matches}
                    </VIText>
                  </View>
                  <VIText style={styles.statLabel}>매칭</VIText>
                </View>
                <View style={[styles.statItem, styles.statBorder]}>
                  <View style={styles.statIconRow}>
                    <MessageCircle size={16} color="#50E3C2" />
                    <VIText style={styles.statValue} fontWeight={700}>
                      {userProfile.stats.chats}
                    </VIText>
                  </View>
                  <VIText style={styles.statLabel}>대화</VIText>
                </View>
                <View style={styles.statItem}>
                  <View style={styles.statIconRow}>
                    <Star size={16} color="#F59E0B" />
                    <VIText style={styles.statValue} fontWeight={700}>
                      {userProfile.stats.likes}
                    </VIText>
                  </View>
                  <VIText style={styles.statLabel}>받은 좋아요</VIText>
                </View>
              </View>
            </View>
          </View>
        </MotiView>

        {/* Photos Grid */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 100 }}
          style={styles.sectionCard}
        >
          <View style={styles.sectionHeader}>
            <VIText style={styles.sectionTitle} fontWeight={600}>
              내 사진
            </VIText>
            <TouchableOpacity style={styles.row}>
              <Edit size={14} color="#4A90E2" />
              <VIText style={styles.actionText} fontWeight={600}>
                관리
              </VIText>
            </TouchableOpacity>
          </View>
          <View style={styles.photoGrid}>
            {userProfile.photos.map((photo, index) => (
              <View key={index} style={styles.photoItem}>
                <Image source={{ uri: photo }} style={styles.photoImage} />
              </View>
            ))}
            <TouchableOpacity style={styles.addPhotoBox}>
              <Camera size={24} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        </MotiView>

        {/* Premium Banner */}
        {!isPremium && (
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 200 }}
          >
            <LinearGradient
              colors={['#8B5CF6', '#EC4899']}
              style={styles.upgradeCard}
            >
              <View style={styles.upgradeHeader}>
                <View style={{ flex: 1 }}>
                  <VIText style={styles.upgradeTitle} fontWeight={700}>
                    프리미엄 멤버십
                  </VIText>
                  <VIText style={styles.upgradeSubtitle}>
                    더 많은 기능으로 완벽한 만남을 경험하세요
                  </VIText>
                </View>
                <Sparkles size={32} color="white" />
              </View>
              <TouchableOpacity style={styles.upgradeButton}>
                <VIText style={styles.upgradeButtonText} fontWeight={700}>
                  지금 시작하기
                </VIText>
              </TouchableOpacity>
            </LinearGradient>
          </MotiView>
        )}

        {/* Settings Menu */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 300 }}
          style={styles.menuCard}
        >
          {renderMenuItem(
            <Bell size={20} color="#6B7280" />,
            '알림 설정',
            () => {},
          )}
          {renderMenuItem(
            <Shield size={20} color="#6B7280" />,
            '개인정보 보호',
            () => {},
          )}
          {renderMenuItem(
            <HelpCircle size={20} color="#6B7280" />,
            '고객 지원',
            () => {},
          )}
          {renderMenuItem(
            <FileText size={20} color="#6B7280" />,
            '이용약관 및 정책',
            () => {},
          )}
          {renderMenuItem(
            <LogOut size={20} color="#EF4444" />,
            '로그아웃',
            () => navigation.replace('Login'),
            true,
            true,
          )}
        </MotiView>

        <VIText style={styles.versionText}>AimoMeet v1.0.0</VIText>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingBottom: 12,
  },
  headerTitle: { fontSize: 24, color: '#111827' },
  iconButton: { padding: 4 },
  scrollContent: { padding: 20, gap: 20 },
  profileCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  cover: { height: 100 },
  avatarSection: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: -48,
  },
  avatarWrapper: { position: 'relative' },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 4,
    borderColor: 'white',
    backgroundColor: '#F3F4F6',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#4A90E2',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  premiumBadgeText: { color: 'white', fontSize: 12 },
  profileInfo: { padding: 16, paddingTop: 12 },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userName: { fontSize: 20, color: '#111827', marginBottom: 6 },
  badgeRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  mbtiBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  mbtiText: { fontSize: 12, color: '#4B5563' },
  interestBadge: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  interestText: { fontSize: 11, color: '#6B7280' },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  editButtonText: { fontSize: 13, color: '#4B5563' },
  bioText: { fontSize: 14, color: '#6B7280', lineHeight: 20, marginBottom: 16 },
  statsRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    pt: 16,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statBorder: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#F3F4F6',
  },
  statIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  statValue: { fontSize: 18, color: '#111827' },
  statLabel: { fontSize: 11, color: '#9CA3AF' },
  sectionCard: { backgroundColor: 'white', borderRadius: 16, padding: 16 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 16, color: '#1F2937' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  actionText: { fontSize: 14, color: '#4A90E2' },
  photoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  photoItem: {
    width: (width - 88) / 3,
    aspectRatio: 1,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
  },
  photoImage: { width: '100%', height: '100%' },
  addPhotoBox: {
    width: (width - 88) / 3,
    aspectRatio: 1,
    borderRadius: 8,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  upgradeCard: { padding: 24, borderRadius: 20 },
  upgradeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 12,
  },
  upgradeTitle: { fontSize: 20, color: 'white', marginBottom: 4 },
  upgradeSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 18,
  },
  upgradeButton: {
    height: 48,
    backgroundColor: 'white',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  upgradeButtonText: { color: '#8B5CF6', fontSize: 16 },
  menuCard: { backgroundColor: 'white', borderRadius: 16, overflow: 'hidden' },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  noBorder: { borderBottomWidth: 0 },
  menuItemLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  menuItemTitle: { fontSize: 15, color: '#374151' },
  destructiveText: { color: '#EF4444' },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#9CA3AF',
    paddingVertical: 10,
  },
});

export default ProfileScreen;
