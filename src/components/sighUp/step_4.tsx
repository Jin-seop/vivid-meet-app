import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { MotiView } from 'moti';
import LinearGradient from 'react-native-linear-gradient';
import { CheckCircle2 } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import AMText from '../common/AMText';
import AMTouchableOpacity from '../common/AMTouchableOpacity';
import {
  SignUpData,
  SignUpScreenNavigationProp,
} from '../../screens/SignUpScreen';
import { RootStackScreenName } from '../../screens/navigation/RootStack';

interface SignUpStep4Props {
  profileData: SignUpData;
  navigation: SignUpScreenNavigationProp;
}

const SignUpStep4 = ({ profileData, navigation }: SignUpStep4Props) => {
  const { t } = useTranslation();

  const onCompletePress = () => {
    navigation.replace(RootStackScreenName.HomeMain);
  };

  return (
    <MotiView
      from={{ opacity: 0, translateX: 20 }}
      animate={{ opacity: 1, translateX: 0 }}
    >
      <AMText style={styles.title} fontWeight={700}>
        {t('signup.step4_title')}
      </AMText>
      <AMText style={styles.subtitle}>{t('signup.step4_subtitle')}</AMText>

      <LinearGradient
        colors={['rgba(74, 144, 226, 0.1)', 'rgba(80, 227, 194, 0.1)']}
        style={styles.aiCard}
      >
        <View style={styles.aiAvatarContainer}>
          {profileData.aiPhotoUrl ? (
            <Image
              style={styles.aiAvatarImage}
              source={{ uri: profileData.aiPhotoUrl }}
            />
          ) : null}
        </View>
        <AMText style={styles.aiName} fontWeight={700}>
          {t('signup.ai_persona_name', { name: profileData.nickname })}
        </AMText>
      </LinearGradient>

      <View style={styles.infoCard}>
        <CheckCircle2 size={20} color="#4A90E2" />
        <View style={styles.infoTextWrapper}>
          <AMText style={styles.infoTitle} fontWeight={700}>
            {t('signup.ai_transparency_title')}
          </AMText>
          <AMText style={styles.infoDesc}>
            {t('signup.ai_transparency_desc')}
          </AMText>
        </View>
      </View>

      <AMTouchableOpacity
        style={styles.completeButton}
        onPress={onCompletePress}
      >
        <LinearGradient
          colors={['#4A90E2', '#50E3C2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradientButton}
        >
          <AMText style={styles.nextButtonText} fontWeight={700}>
            {t('signup.complete_btn')}
          </AMText>
        </LinearGradient>
      </AMTouchableOpacity>
    </MotiView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: { fontSize: 16, color: '#6B7280', marginBottom: 32 },
  form: { gap: 12 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  aiCard: {
    padding: 32,
    borderRadius: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  aiAvatarContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  aiAvatarImage: { width: '100%', height: '100%' },
  aiName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  aiInfo: { fontSize: 14, color: '#6B7280' },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    gap: 12,
  },
  infoTextWrapper: { flex: 1 },
  infoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E40AF',
    marginBottom: 4,
  },
  infoDesc: { fontSize: 12, color: '#1E40AF', opacity: 0.8 },
  completeButton: {
    height: 56,
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 32,
  },
  gradientButton: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  nextButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  disabledButton: { backgroundColor: '#E5E7EB' },
});

export default SignUpStep4;
