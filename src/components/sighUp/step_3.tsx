import { MotiView } from 'moti';
import { StyleSheet, View } from 'react-native';
import VIText from '../common/VIText';
import VITouchableOpacity from '../common/VITouchableOpacity';
import { SignUpData } from '../../screens/SignUpScreen';

interface SignUpStep3Props {
  profileData: SignUpData;
  setProfileData: React.Dispatch<React.SetStateAction<SignUpData>>;
  setStep: React.Dispatch<React.SetStateAction<number>>;
}

const SignUpStep3 = ({
  profileData,
  setProfileData,
  setStep,
}: SignUpStep3Props) => {
  return (
    <MotiView
      from={{ opacity: 0, translateX: 20 }}
      animate={{ opacity: 1, translateX: 0 }}
    >
      <VIText style={styles.title}>나를 표현해주세요</VIText>
      <VIText style={styles.subtitle}>AI 캐릭터 생성에 활용됩니다</VIText>

      <VIText style={styles.label}>MBTI (선택)</VIText>
      <View style={styles.interestGrid}>
        {/* {['INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP'].map(
          mbti => (
            <VITouchableOpacity
              key={mbti}
              onPress={() => setProfileData({ ...profileData, mbti })}
              style={[
                styles.chip,
                profileData.mbti === mbti && styles.chipActive,
              ]}
            >
              <VIText
                style={[
                  styles.chipText,
                  profileData.mbti === mbti && styles.chipTextActive,
                ]}
              >
                {mbti}
              </VIText>
            </VITouchableOpacity>
          ),
        )} */}
      </View>

      <VITouchableOpacity
        style={[
          styles.nextButton,
          // profileData.interests.length < 3 && styles.disabledButton,
        ]}
        // disabled={profileData.interests.length < 3}
        onPress={() => setStep(4)}
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
  interestGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  chipActive: { backgroundColor: '#4A90E2', borderColor: '#4A90E2' },
  chipText: { color: '#4B5563' },
  chipTextActive: { color: 'white', fontWeight: 'bold' },

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

export default SignUpStep3;
