import { CheckCircle2 } from 'lucide-react-native';
import { MotiView } from 'moti';
import { StyleSheet, TextInput, View } from 'react-native';
import VIText from '../common/VIText';
import VITouchableOpacity from '../common/VITouchableOpacity';

interface SignUpStep1Props {
  profileData;
  setProfileData;
  setStep;
}

const SignUpStep1 = ({
  profileData,
  setProfileData,
  setStep,
}: SignUpStep1Props) => {
  return (
    <MotiView
      from={{ opacity: 0, translateX: 20 }}
      animate={{ opacity: 1, translateX: 0 }}
    >
      <VIText style={styles.title}>기본 정보를 입력해주세요</VIText>
      <VIText style={styles.subtitle}>
        안전한 만남을 위해 필요한 정보입니다
      </VIText>

      <View style={styles.form}>
        <VIText style={styles.label}>이름</VIText>
        <TextInput
          style={styles.input}
          value={profileData.name}
          onChangeText={text => setProfileData({ ...profileData, name: text })}
          placeholder="실명을 입력해주세요"
        />

        <VIText style={[styles.label, { marginTop: 20 }]}>출생년도</VIText>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={profileData.birthYear}
          onChangeText={text =>
            setProfileData({ ...profileData, birthYear: text })
          }
          placeholder="예: 1995"
        />

        <View style={styles.infoCard}>
          <CheckCircle2 size={20} color="#4A90E2" />
          <View style={styles.infoTextWrapper}>
            <VIText style={styles.infoTitle}>본인 인증이 필요합니다</VIText>
            <VIText style={styles.infoDesc}>
              19세 미만 및 악성 유저 차단을 위해 국내 본인 확인 API를 사용합니다
            </VIText>
          </View>
        </View>
      </View>

      <VITouchableOpacity
        style={[
          styles.nextButton,
          (!profileData.name || !profileData.birthYear) &&
            styles.disabledButton,
        ]}
        disabled={!profileData.name || !profileData.birthYear}
        onPress={() => setStep(2)}
      >
        <VIText style={styles.nextButtonText}>다음</VIText>
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
  nextButton: {
    height: 56,
    backgroundColor: '#4A90E2',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
  },
  nextButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  disabledButton: { backgroundColor: '#E5E7EB' },
});

export default SignUpStep1;
