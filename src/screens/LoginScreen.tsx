import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Image, StatusBar, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import LinearGradient from 'react-native-linear-gradient';
import { MotiView } from 'moti';
import { Sparkles, Check, ChevronRight } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AMText from '../components/common/AMText';
import {
  RootStackParamList,
  RootStackScreenName,
} from './navigation/RootStack';
import { useTranslation } from 'react-i18next';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useGoogleAuth } from '../hooks/useGoogleAuth';
import { useAppleAuth } from '../hooks/useAppleAuth';
import { useLineAuth } from '../hooks/useLineAuth';
import { GOOGLE_WEB_CLIENT_ID } from '@env';
import notifee, { AndroidImportance } from '@notifee/react-native';
import { Platform } from 'react-native';
import AMTouchableOpacity from '../components/common/AMTouchableOpacity';
import messaging from '@react-native-firebase/messaging';
import { userApi } from '../api/user';
import { useAuth } from '../context/AuthContext';
import BottomModal from '../components/common/BottomModal';

type LoginScreenProps = {
  navigation: StackNavigationProp<
    RootStackParamList,
    RootStackScreenName.Login
  >;
};

const LoginScreen = ({ navigation }: LoginScreenProps) => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const [isAgreementVisible, setIsAgreementVisible] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<'GooGle' | 'Apple' | 'Line' | null>(null);
  
  const [agreements, setAgreements] = useState({
    terms: false,
    privacy: false,
    ai: false,
  });

  const isAllAgreed = agreements.terms && agreements.privacy && agreements.ai;

  const toggleAll = () => {
    const nextValue = !isAllAgreed;
    setAgreements({
      terms: nextValue,
      privacy: nextValue,
      ai: nextValue,
    });
  };

  const handleSocialSuccess = async (
    data: any,
    provider: 'GooGle' | 'Apple' | 'Line',
  ) => {
    if (data.isNewUser) {
      navigation.navigate(RootStackScreenName.SignUp, {
        email: data.profile?.email || '',
        provider: provider,
        providerId: data.profile?.providerId || '',
      });
    } else {
      if (data.user) {
        login(data.user);
      }

      const token = await messaging().getToken();
      if (token) {
        await userApi.saveFcmToken(token);
      }

      if (Platform.OS === 'android') {
        await notifee.createChannel({
          id: 'fcm_channel_id',
          name: 'FCM Notifications',
          importance: AndroidImportance.HIGH,
        });
      }
      navigation.replace(RootStackScreenName.HomeMain);
    }
  };

  const googleAuth = useGoogleAuth(data => handleSocialSuccess(data, 'GooGle'));
  const appleAuth = useAppleAuth(data => handleSocialSuccess(data, 'Apple'));
  const lineAuth = useLineAuth(data => handleSocialSuccess(data, 'Line'));

  const onSocialLoginPress = (provider: 'GooGle' | 'Apple' | 'Line') => {
    setSelectedProvider(provider);
    setIsAgreementVisible(true);
  };

  const startLogin = () => {
    if (!isAllAgreed || !selectedProvider) return;
    
    setIsAgreementVisible(false);
    
    switch (selectedProvider) {
      case 'GooGle':
        googleAuth.mutate();
        break;
      case 'Apple':
        appleAuth.mutate();
        break;
      case 'Line':
        lineAuth.mutate();
        break;
    }
  };

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: GOOGLE_WEB_CLIENT_ID,
    });
  }, []);

  const renderAgreementItem = (
    label: string, 
    value: boolean, 
    onToggle: () => void, 
    onPressDetail?: () => void
  ) => (
    <View style={styles.agreementItem}>
      <TouchableOpacity 
        style={styles.checkboxRow} 
        onPress={onToggle}
        activeOpacity={0.7}
      >
        <View style={[styles.checkbox, value && styles.checkboxActive]}>
          {value && <Check size={14} color="white" strokeWidth={3} />}
        </View>
        <AMText style={styles.agreementLabel}>{label}</AMText>
      </TouchableOpacity>
      {onPressDetail && (
        <TouchableOpacity onPress={onPressDetail}>
          <ChevronRight size={20} color="#9CA3AF" />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient
        colors={['rgba(74, 144, 226, 0.1)', 'rgba(80, 227, 194, 0.1)']}
        style={styles.background}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.content}>
            <MotiView
              from={{ opacity: 0, translateY: -20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 1000 }}
              style={styles.header}
            >
              <View style={styles.logoRow}>
                <Sparkles size={32} color="#4A90E2" />
                <AMText style={styles.logoText}>AimoChat</AMText>
              </View>
              <AMText style={styles.description}>
                {t('login.slogan')}
              </AMText>
            </MotiView>

            <MotiView
              from={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'timing', duration: 1000, delay: 200 }}
              style={styles.imageContainer}
            >
              <Image
                source={{
                  uri: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop',
                }}
                style={styles.heroImage}
                resizeMode="cover"
              />
            </MotiView>

            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 1000, delay: 400 }}
              style={styles.buttonSection}
            >
              {/* Google Login */}
              <AMTouchableOpacity
                style={[styles.loginButton, styles.googleButton]}
                onPress={() => onSocialLoginPress('GooGle')}
              >
                <Image
                  source={{
                    uri: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg',
                  }}
                  style={{ width: 20, height: 20, marginRight: 10 }}
                />
                <AMText style={styles.googleButtonText}>{t('login.google')}</AMText>
              </AMTouchableOpacity>

              {/* Apple Login */}
              <AMTouchableOpacity
                style={[styles.loginButton, styles.appleButton]}
                onPress={() => onSocialLoginPress('Apple')}
              >
                <AMText style={styles.appleButtonText}>{t('login.apple')}</AMText>
              </AMTouchableOpacity>

              {/* Line Login */}
              <AMTouchableOpacity
                style={[styles.loginButton, styles.LineButton]}
                onPress={() => onSocialLoginPress('Line')}
              >
                <AMText style={styles.LineButtonText}>{t('login.line')}</AMText>
              </AMTouchableOpacity>
            </MotiView>

            {/* 하단 링크 */}
            <MotiView
              from={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 600 }}
              style={styles.footer}
            >
              <View style={styles.policyContainer}>
                <AMText style={styles.policyFooterText}>
                  {t('login.policy_prefix')}
                  <AMText 
                    style={[styles.policyFooterText, styles.link]} 
                    onPress={() => navigation.navigate(RootStackScreenName.Policy, { type: 'TERMS' })}
                  >
                    {t('login.terms')}
                  </AMText>
                  {t('login.policy_mid')}
                  <AMText 
                    style={[styles.policyFooterText, styles.link]} 
                    onPress={() => navigation.navigate(RootStackScreenName.Policy, { type: 'PRIVACY' })}
                  >
                    {t('login.privacy')}
                  </AMText>
                  {t('login.policy_suffix')}
                </AMText>
              </View>
            </MotiView>
          </View>
        </SafeAreaView>
      </LinearGradient>

      {/* Agreement Modal */}
      <BottomModal
        visible={isAgreementVisible}
        onClose={() => setIsAgreementVisible(false)}
        title={t('login.agreement_title')}
      >
        <View style={styles.modalContent}>
          <AMText style={styles.modalDesc}>{t('login.agreement_desc')}</AMText>
          
          <TouchableOpacity 
            style={styles.allAgreeRow} 
            onPress={toggleAll}
            activeOpacity={0.7}
          >
            <View style={[styles.checkboxLarge, isAllAgreed && styles.checkboxActive]}>
              {isAllAgreed && <Check size={18} color="white" strokeWidth={4} />}
            </View>
            <AMText style={styles.allAgreeLabel}>{t('login.agree_all')}</AMText>
          </TouchableOpacity>

          <View style={styles.divider} />

          {renderAgreementItem(
            t('login.agree_terms'), 
            agreements.terms, 
            () => setAgreements(prev => ({ ...prev, terms: !prev.terms })),
            () => navigation.navigate(RootStackScreenName.Policy, { type: 'TERMS' })
          )}
          {renderAgreementItem(
            t('login.agree_privacy'), 
            agreements.privacy, 
            () => setAgreements(prev => ({ ...prev, privacy: !prev.privacy })),
            () => navigation.navigate(RootStackScreenName.Policy, { type: 'PRIVACY' })
          )}
          {renderAgreementItem(
            t('login.agree_ai'), 
            agreements.ai, 
            () => setAgreements(prev => ({ ...prev, ai: !prev.ai }))
          )}

          <AMTouchableOpacity 
            style={[styles.startButton, !isAllAgreed && styles.startButtonDisabled]}
            onPress={startLogin}
            disabled={!isAllAgreed}
          >
            <AMText style={styles.startButtonText}>{t('login.start_with_agreement')}</AMText>
          </AMTouchableOpacity>
        </View>
      </BottomModal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  background: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  logoText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  description: {
    fontSize: 16,
    color: '#717182',
    textAlign: 'center',
    lineHeight: 24,
  },
  imageContainer: {
    marginBottom: 32,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  heroImage: {
    width: '100%',
    height: 200,
  },
  buttonSection: {
    gap: 12,
    marginBottom: 24,
  },
  loginButton: {
    height: 56,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  googleButton: {
    backgroundColor: 'white',
    borderColor: '#E5E7EB',
  },
  googleButtonText: {
    color: '#374151',
    fontSize: 16,
  },
  appleButton: {
    backgroundColor: 'black',
    borderColor: 'black',
  },
  appleButtonText: {
    color: 'white',
    fontSize: 16,
  },
  LineButton: {
    backgroundColor: '#06C755',
    borderColor: '#06C755',
  },
  LineButtonText: {
    color: 'white',
    fontSize: 16,
  },
  footer: {
    alignItems: 'center',
  },
  policyContainer: {
    paddingHorizontal: 40,
    alignItems: 'center',
  },
  link: {
    color: '#4A90E2',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  policyFooterText: {
    fontSize: 12,
    color: '#717182',
    textAlign: 'center',
    lineHeight: 18,
  },
  modalContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  modalDesc: {
    fontSize: 15,
    color: '#6B7280',
    lineHeight: 22,
    marginBottom: 24,
  },
  allAgreeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  checkboxLarge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkboxActive: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
  },
  allAgreeLabel: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 12,
  },
  agreementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  agreementLabel: {
    fontSize: 15,
    color: '#4B5563',
  },
  startButton: {
    height: 56,
    backgroundColor: '#4A90E2',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
  },
  startButtonDisabled: {
    backgroundColor: '#E5E7EB',
  },
  startButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
