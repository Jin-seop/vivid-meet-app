import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Switch,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ChevronRight, Globe, Lock, Bell } from 'lucide-react-native';
import AMText from '../components/common/AMText';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList, RootStackScreenName } from './navigation/RootStack';

type SettingsScreenProps = StackScreenProps<RootStackParamList, RootStackScreenName.Settings>;

const SettingsScreen = ({ navigation }: SettingsScreenProps) => {
  const { t, i18n } = useTranslation();
  
  const [pushEnabled, setPushEnabled] = useState(true);
  const [marketingEnabled, setMarketingEnabled] = useState(false);

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'ko' ? 'ja' : 'ko';
    i18n.changeLanguage(nextLang);
  };

  const renderSettingItem = (
    icon: React.ReactNode,
    title: string,
    subtitle?: string,
    rightElement?: React.ReactNode,
    onPress?: () => void
  ) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={0.7}
    >
      <View style={styles.settingLeft}>
        <View style={styles.iconContainer}>{icon}</View>
        <View>
          <AMText style={styles.settingTitle} fontWeight={600}>
            {title}
          </AMText>
          {subtitle && <AMText style={styles.settingSubtitle}>{subtitle}</AMText>}
        </View>
      </View>
      {rightElement || <ChevronRight size={20} color="#9CA3AF" />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <AMText style={styles.headerTitle} fontWeight={700}>
          {t('profile.menu.settings', '환경 설정')}
        </AMText>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <AMText style={styles.sectionLabel} fontWeight={700}>
            {t('settings.notifications', '알림')}
          </AMText>
          {renderSettingItem(
            <Bell size={20} color="#4B5563" />,
            t('settings.push_notif', '푸시 알림'),
            t('settings.push_notif_desc', '메시지 및 매칭 알림을 받습니다.'),
            <Switch
              value={pushEnabled}
              onValueChange={setPushEnabled}
              trackColor={{ false: '#E5E7EB', true: '#4A90E2' }}
              thumbColor={Platform.OS === 'ios' ? undefined : '#FFFFFF'}
            />
          )}
          {renderSettingItem(
            <Bell size={20} color="#4B5563" />,
            t('settings.marketing', '마케팅 정보 수신'),
            t('settings.marketing_desc', '이벤트 및 혜택 정보를 받습니다.'),
            <Switch
              value={marketingEnabled}
              onValueChange={setMarketingEnabled}
              trackColor={{ false: '#E5E7EB', true: '#4A90E2' }}
              thumbColor={Platform.OS === 'ios' ? undefined : '#FFFFFF'}
            />
          )}
        </View>

        <View style={styles.section}>
          <AMText style={styles.sectionLabel} fontWeight={700}>
            {t('settings.language_privacy', '언어 및 보안')}
          </AMText>
          {renderSettingItem(
            <Globe size={20} color="#4B5563" />,
            t('settings.language', '언어 설정'),
            i18n.language === 'ko' ? '한국어' : '日本語',
            undefined,
            toggleLanguage
          )}
          {renderSettingItem(
            <Lock size={20} color="#4B5563" />,
            t('settings.privacy_policy', '개인정보 처리방침'),
            undefined,
            undefined,
            () => {}
          )}
          {renderSettingItem(
            <Lock size={20} color="#4B5563" />,
            t('settings.terms', '서비스 이용약관'),
            undefined,
            undefined,
            () => {}
          )}
        </View>

        <View style={styles.footer}>
          <AMText style={styles.versionText}>AimoChat Version 1.0.0</AMText>
        </View>
      </ScrollView>
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
  headerTitle: { fontSize: 18, color: '#111827' },
  backButton: { padding: 8 },
  headerSpacer: { width: 40 },
  scrollContent: { paddingVertical: 16 },
  section: {
    backgroundColor: 'white',
    marginBottom: 24,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F3F4F6',
  },
  sectionLabel: {
    fontSize: 13,
    color: '#6B7280',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#F9FAFB',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingTitle: { fontSize: 16, color: '#374151' },
  settingSubtitle: { fontSize: 12, color: '#9CA3AF', marginTop: 2 },
  footer: { padding: 40, alignItems: 'center' },
  versionText: { fontSize: 12, color: '#9CA3AF' },
});

export default SettingsScreen;