import React from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  RefreshControl,
} from 'react-native';
import AMTouchableOpacity from '../components/common/AMTouchableOpacity';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ChevronRight, Megaphone } from 'lucide-react-native';
import AMText from '../components/common/AMText';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList, RootStackScreenName } from './navigation/RootStack';
import { useQuery } from '@tanstack/react-query';
import { noticeApi } from '../api/notice';

type NoticeListScreenProps = StackScreenProps<RootStackParamList, RootStackScreenName.NoticeList>;

export default function NoticeListScreen({ navigation }: NoticeListScreenProps) {
  const { t } = useTranslation();

  const { data: notices, refetch, isFetching } = useQuery({
    queryKey: ['notices'],
    queryFn: () => noticeApi.getNotices().then(res => res.data),
  });

  const renderItem = ({ item }: { item: any }) => (
    <AMTouchableOpacity
      style={styles.noticeItem}
      onPress={() => {
        // 공지사항 상세 이동 로직이 있다면 추가
      }}
    >
      <View style={styles.iconContainer}>
        <Megaphone size={20} color="#4A90E2" />
      </View>
      <View style={styles.noticeInfo}>
        <AMText style={styles.noticeTitle} fontWeight={600}>
          {item.title}
        </AMText>
        <AMText style={styles.noticeDate}>
          {new Date(item.createdAt).toLocaleDateString()}
        </AMText>
      </View>
      <ChevronRight size={20} color="#9CA3AF" />
    </AMTouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <AMTouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="#111827" />
        </AMTouchableOpacity>
        <AMText style={styles.headerTitle} fontWeight={700}>
          {t('notice.title', '공지사항')}
        </AMText>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={notices}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={isFetching} onRefresh={refetch} tintColor="#4A90E2" />
        }
      />
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
  listContent: { padding: 16 },
  noticeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  noticeInfo: { flex: 1 },
  noticeTitle: { fontSize: 15, color: '#111827', marginBottom: 4 },
  noticeDate: { fontSize: 12, color: '#6B7280' },
});
