import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, ActivityIndicator } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { RootStackParamList, RootStackScreenName } from './navigation/RootStack';
import AMText from '../components/common/AMText';
import { getPolicies, Policy } from '../api/policy';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { ChevronLeft } from 'lucide-react-native';

type PolicyScreenRouteProp = RouteProp<RootStackParamList, 'Policy'>;

const PolicyScreen = () => {
  const { t } = useTranslation();
  const route = useRoute<PolicyScreenRouteProp>();
  const navigation = useNavigation();
  const { type } = route.params;
  
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        const policies = await getPolicies();
        const policy = policies.find(p => p.type === type);
        if (policy) {
          setContent(policy.content);
        } else {
          setContent(t('policy.no_content'));
        }
      } catch (error) {
        console.error('Failed to fetch policy:', error);
        setContent(t('policy.error'));
      } finally {
        setLoading(false);
      }
    };

    fetchPolicy();
  }, [type, t]);

  const getTitle = () => {
    if (type === 'TERMS') return t('login.terms');
    if (type === 'PRIVACY') return t('login.privacy');
    return t('settings.policy');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ChevronLeft size={24} color="#333" />
        </TouchableOpacity>
        <AMText style={styles.headerTitle}>{getTitle()}</AMText>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {loading ? (
          <ActivityIndicator size="large" color="#4A90E2" style={styles.loader} />
        ) : (
          <AMText style={styles.contentText}>{content}</AMText>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  backButton: {
    padding: 4,
  },
  placeholder: {
    width: 32,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  contentText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#4B5563',
  },
  loader: {
    marginTop: 40,
  },
});

export default PolicyScreen;
