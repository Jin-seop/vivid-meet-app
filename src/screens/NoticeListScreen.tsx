import React from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ChevronRight, Megaphone } from 'lucide-react-native';
import AMText from '../components/common/AMText';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList, RootStackScreenName } from './navigation/RootStack';
import { useQuery } from '@tanstack/react-query';
import { noticeApi } from '../api/notice';

type NoticeListScreenProps = StackScreenProps<RootStackParamList, RootStackScreenName.NoticeList>;

const NoticeListScreen = ({ navigation }: NoticeListScreenProps) => {
  const { t } = useTranslation();

  const { data: notices, isLoading, refetch } = useQuery({
    queryKey: ['notices'],
    queryFn: () => noticeApi.getNotices().then(res => res.data),
  });

  const renderNoticeItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.noticeItem} activeOpacity={0.7}>
      <View style={styles.noticeLeft}>
        <View style={[styles.iconContainer, item.isFixed && styles.fixedIcon]}>
          <Megaphone size={18} color={item.isFixed ? '#4A90E2' : '#6B7280'} />
        </View>
        <View style={styles.noticeContent}>
          <View style={styles.noticeHeader}>
            {item.isFixed && (
              <View style={styles.fixedBadge}>
                <AMText style={styles.fixedBadgeText} fontWeight={700}>
                  {t('common.fixed', '중요')}
                </AMText>
              </View>
            )}
            <AMText style={styles.noticeDate}>
              {new Date(item.createdAt).toLocaleDateString()}
            </AMText>
          </View>
          <AMText style={styles.noticeTitle} fontWeight={600} numberOfLines={1}>
            {item.title}
          </AMText>
        </View>
      </View>
      <ChevronRight size={20} color="#9CA3AF" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <AMText style={styles.headerTitle} fontWeight={700}>
          {t('profile.menu.support', '고객 센터')}
        </AMText>
        <View style={styles.headerSpacer} />
      </View>

      <FlatList
        data={notices}
        renderItem={renderNoticeItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor="#4A90E2" />
        }
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.emptyContainer}>
              <AMText style={styles.emptyText}>
                {t('notice.empty', '등록된 공지사항이 없습니다.')}
              </AMText>
            </View>
          ) : null
        }
      />
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
  listContent: { paddingVertical: 8 },
  noticeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  noticeLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  fixedIcon: { backgroundColor: '#EBF5FF' },
  noticeContent: { flex: 1 },
  noticeHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  fixedBadge: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  fixedBadgeText: { fontSize: 10, color: 'white' },
  noticeDate: { fontSize: 12, color: '#9CA3AF' },
  noticeTitle: { fontSize: 15, color: '#374151' },
  emptyContainer: { padding: 40, alignItems: 'center' },
  emptyText: { color: '#9CA3AF', fontSize: 14 },
});

export default NoticeListScreen;