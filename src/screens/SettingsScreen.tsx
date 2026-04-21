import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  StatusBar,
} from 'react-native';
import AMTouchableOpacity from '../components/common/AMTouchableOpacity';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ChevronRight, Globe, Lock, Bell, Megaphone, FileText, ShieldCheck } from 'lucide-react-native';
import AMText from '../components/common/AMText';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList, RootStackScreenName } from './navigation/RootStack';

type SettingsScreenProps = StackScreenProps<RootStackParamList, RootStackScreenName.Settings>;

export default function SettingsScreen({ navigation }: SettingsScreenProps) {
  const { t } = useTranslation();

  const renderSettingItem = (icon: React.ReactNode, title: string, onPress: () => void) => (
    <AMTouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingLeft}>
        <View style={styles.iconContainer}>{icon}</View>
        <AMText style={styles.settingTitle}>{title}</AMText>
      </View>
      <ChevronRight size={20} color="#9CA3AF" />
    </AMTouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <View style={styles.header}>
        <AMTouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="#111827" />
        </AMTouchableOpacity>
        <AMText style={styles.headerTitle} fontWeight={700}>
          {t('settings.title', '설정')}
        </AMText>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          {renderSettingItem(<Bell size={22} color="#4B5563" />, t('settings.notifications', '알림 설정'), () => {})}
          {renderSettingItem(<Globe size={22} color="#4B5563" />, t('settings.language', '언어 설정'), () => {})}
        </View>

        <View style={[styles.section, { marginTop: 16 }]}>
          {renderSettingItem(<Megaphone size={22} color="#4B5563" />, t('settings.notice', '공지사항'), () => {
            navigation.navigate(RootStackScreenName.NoticeList);
          })}
          {renderSettingItem(<FileText size={22} color="#4B5563" />, t('login.terms', '이용약관'), () => {
            navigation.navigate(RootStackScreenName.Policy, { type: 'TERMS' });
          })}
          {renderSettingItem(<ShieldCheck size={22} color="#4B5563" />, t('login.privacy', '개인정보 처리방침'), () => {
            navigation.navigate(RootStackScreenName.Policy, { type: 'PRIVACY' });
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

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
  content: { padding: 16 },
  section: { backgroundColor: 'white', borderRadius: 16, overflow: 'hidden' },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingLeft: { flexDirection: 'row', alignItems: 'center' },
  iconContainer: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  settingTitle: { fontSize: 16, color: '#374151' },
});
