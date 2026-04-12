import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  Bell,
  ShieldCheck,
  Headphones,
  LogOut,
  UserX,
  ChevronRight,
  Settings,
} from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import AMText from '../components/common/AMText';
import CenterModal, { ModalButton } from '../components/common/CenterModal';

export function ProfileScreen() {
  const { t } = useTranslation();
  const { user, logout, withdraw } = useAuth();
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

  // 회원 탈퇴 실행
  const handleWithdraw = async () => {
    try {
      await withdraw();
      setIsWithdrawModalOpen(false);
      // AuthContext에서 isLoggedIn이 false가 되면 RootStack이 자동으로 Login 화면으로 이동시킵니다.
    } catch {
      Alert.alert(t('common.error'), t('profile.withdraw_failed'));
    }
  };

  // 메뉴 아이템 렌더링 함수
  const renderMenuItem = (
    icon: React.ReactNode,
    title: string,
    onPress: () => void,
    isLast = false,
    isDanger = false,
  ) => (
    <TouchableOpacity
      style={[styles.menuItem, isLast && styles.lastMenuItem]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.menuLeft}>
        <View style={[styles.iconContainer, isDanger && styles.dangerIcon]}>
          {icon}
        </View>
        <AMText style={[styles.menuTitle, isDanger && styles.dangerText]}>
          {title}
        </AMText>
      </View>
      <ChevronRight size={20} color="#9CA3AF" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 헤더 섹션 */}
        <View style={styles.header}>
          <AMText style={styles.headerTitle} fontWeight={700}>
            {t('profile.title')}
          </AMText>
          <TouchableOpacity>
            <Settings size={24} color="#374151" />
          </TouchableOpacity>
        </View>

        {/* 유저 정보 카드 */}
        <View style={styles.profileCard}>
          <View style={styles.avatarPlaceholder}>
            <AMText style={styles.avatarText}>
              {user?.nickname?.[0] || 'A'}
            </AMText>
          </View>
          <View style={styles.userInfo}>
            <AMText style={styles.userName} fontWeight={700}>
              {user?.nickname || 'User'}
            </AMText>
            <AMText style={styles.userEmail}>{user?.email}</AMText>
          </View>
        </View>

        {/* 통계 섹션 */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <AMText style={styles.statValue} fontWeight={700}>
              12
            </AMText>
            <AMText style={styles.statLabel}>
              {t('profile.stats.matches')}
            </AMText>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <AMText style={styles.statValue} fontWeight={700}>
              48
            </AMText>
            <AMText style={styles.statLabel}>{t('profile.stats.chats')}</AMText>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <AMText style={styles.statValue} fontWeight={700}>
              156
            </AMText>
            <AMText style={styles.statLabel}>{t('profile.stats.likes')}</AMText>
          </View>
        </View>

        {/* 메뉴 리스트 */}
        <View style={styles.menuSection}>
          {renderMenuItem(
            <Bell size={22} color="#4B5563" />,
            t('profile.menu.notification'),
            () => {},
          )}
          {renderMenuItem(
            <ShieldCheck size={22} color="#4B5563" />,
            t('profile.menu.privacy'),
            () => {},
          )}
          {renderMenuItem(
            <Headphones size={22} color="#4B5563" />,
            t('profile.menu.support'),
            () => {},
          )}
          {renderMenuItem(
            <LogOut size={22} color="#4B5563" />,
            t('profile.menu.logout'),
            logout,
          )}
          {renderMenuItem(
            <UserX size={22} color="#EF4444" />,
            t('common.withdraw'),
            () => setIsWithdrawModalOpen(true),
            true,
            true,
          )}
        </View>

        <AMText style={styles.versionText}>AimoChat v1.0.0</AMText>
      </ScrollView>

      {/* 회원 탈퇴 확인 모달 */}
      <CenterModal
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        title={t('common.withdraw')}
      >
        <View style={styles.modalContent}>
          <AMText style={styles.modalDescription}>
            {t('profile.withdraw_confirm')}
          </AMText>

          <View style={styles.modalButtonContainer}>
            <ModalButton
              variant="secondary"
              onClick={() => setIsWithdrawModalOpen(false)}
            >
              {t('common.cancel')}
            </ModalButton>
            <ModalButton variant="danger" onClick={handleWithdraw}>
              {t('common.withdraw')}
            </ModalButton>
          </View>
        </View>
      </CenterModal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 24,
    color: '#111827',
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 16,
    marginTop: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
    color: '#4B5563',
  },
  userInfo: {
    marginLeft: 15,
  },
  userName: {
    fontSize: 18,
    color: '#111827',
  },
  userEmail: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    paddingVertical: 15,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    color: '#111827',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#F3F4F6',
  },
  menuSection: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  lastMenuItem: {
    borderBottomWidth: 0,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dangerIcon: {
    backgroundColor: '#FEF2F2',
  },
  menuTitle: {
    fontSize: 16,
    color: '#374151',
    marginLeft: 12,
  },
  dangerText: {
    color: '#EF4444',
  },
  versionText: {
    textAlign: 'center',
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 30,
    marginBottom: 20,
  },
  modalContent: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  modalDescription: {
    fontSize: 16,
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
});
