import { MotiView } from 'moti';
import { StyleSheet, View } from 'react-native';
import VIText from '../common/VIText';
import { ArrowLeft } from 'lucide-react-native';
import { SignUpScreenNavigationProp } from '../../screens/SignUpScreen';
import VITouchableOpacity from '../common/VITouchableOpacity';

interface SignUpHeaderProps {
  step: number;
  navigation: SignUpScreenNavigationProp;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  progress: number;
  totalSteps: number;
}

const SignUpHeader = ({
  step,
  navigation,
  setStep,
  progress,
  totalSteps,
}: SignUpHeaderProps) => {
  return (
    <View style={styles.header}>
      <VITouchableOpacity
        onPress={() => (step === 1 ? navigation.goBack() : setStep(step - 1))}
        style={styles.backButton}
      >
        <ArrowLeft size={24} color="#1F2937" />
      </VITouchableOpacity>
      <View style={styles.progressWrapper}>
        <View style={styles.progressBg}>
          <MotiView
            animate={{ width: `${progress}%` }}
            style={styles.progressBar}
          />
        </View>
      </View>
      <VIText style={styles.stepIndicator}>
        {step}/{totalSteps}
      </VIText>
    </View>
  );
};
const styles = StyleSheet.create({
  header: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingHorizontal: 16,
  },
  backButton: { padding: 4 },
  progressWrapper: { flex: 1, marginHorizontal: 16 },
  progressBg: {
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: { height: '100%', backgroundColor: '#4A90E2' },
  stepIndicator: { fontSize: 14, color: '#6B7280', fontWeight: '500' },
});

export default SignUpHeader;
