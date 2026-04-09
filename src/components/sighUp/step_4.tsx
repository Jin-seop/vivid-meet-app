import { MotiView } from 'moti';
import { StyleSheet, View } from 'react-native';
import VIText from '../common/VIText';
import LinearGradient from 'react-native-linear-gradient';
import { CheckCircle2 } from 'lucide-react-native';
import { SignUpScreenNavigationProp } from '../../screens/SignUpScreen';
import VITouchableOpacity from '../common/VITouchableOpacity';

interface SignUpStep4Props {
  profileData;
  navigation: SignUpScreenNavigationProp;
}

const SignUpStep4 = ({ profileData, navigation }: SignUpStep4Props) => {
  return (
    <MotiView
      from={{ opacity: 0, translateX: 20 }}
      animate={{ opacity: 1, translateX: 0 }}
    >
      <VIText style={styles.title}>AI 캐릭터가 생성되었습니다</VIText>
      <VIText style={styles.subtitle}>이 캐릭터로 첫 대화가 시작됩니다</VIText>

      <LinearGradient
        colors={['rgba(74, 144, 226, 0.1)', 'rgba(80, 227, 194, 0.1)']}
        style={styles.aiCard}
      >
        <View style={styles.aiAvatar}>
          <VIText style={styles.aiAvatarText}>AI</VIText>
        </View>
        <VIText style={styles.aiName}>
          {profileData.name}님의 AI 페르소나
        </VIText>
        <VIText style={styles.aiInfo}>
          {profileData.mbti && `${profileData.mbti} • `}
          {profileData.interests.slice(0, 2).join(', ')}
        </VIText>
      </LinearGradient>

      <View style={styles.infoCard}>
        <CheckCircle2 size={20} color="#4A90E2" />
        <View style={styles.infoTextWrapper}>
          <VIText style={styles.infoTitle}>AI 투명성 고지</VIText>
          <VIText style={styles.infoDesc}>
            상대방에게는 AI 캐릭터가 먼저 노출되며, 대화가 진행될수록 실물
            사진이 단계적으로 공개됩니다.
          </VIText>
        </View>
      </View>

      <VITouchableOpacity
        style={styles.completeButton}
        onPress={() => navigation.replace('HomeMain')}
      >
        <LinearGradient
          colors={['#4A90E2', '#50E3C2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradientButton}
        >
          <VIText style={styles.nextButtonText}>VividMeet 시작하기</VIText>
        </LinearGradient>
      </VITouchableOpacity>
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
  aiAvatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  aiAvatarText: { color: 'white', fontSize: 24, fontWeight: 'bold' },
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
