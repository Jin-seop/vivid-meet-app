import { MotiView } from 'moti';
import { StyleSheet, TextInput, View } from 'react-native';
import AMText from '../common/AMText';
import AMTouchableOpacity from '../common/AMTouchableOpacity';
import { SignUpData } from '../../screens/SignUpScreen';

interface SignUpStep1Props {
  profileData: SignUpData;
  setProfileData: React.Dispatch<React.SetStateAction<SignUpData>>;
  setStep: React.Dispatch<React.SetStateAction<number>>;
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
      <AMText style={styles.title}>기본 정보를 입력해주세요</AMText>
      <AMText style={styles.subtitle}>
        안전한 만남을 위해 필요한 정보입니다
      </AMText>

      <View style={styles.form}>
        <AMText style={styles.label}>닉네임</AMText>
        <TextInput
          style={styles.input}
          value={profileData?.nickname}
          onChangeText={text =>
            setProfileData({ ...profileData, nickname: text })
          }
          placeholder="닉네임을 입력해주세요"
        />
        <AMText style={styles.label}>성별</AMText>
        <View style={styles.btnContainer}>
          <AMTouchableOpacity
            style={
              profileData.gender === 'MALE' ? styles.btnActive : styles.btn
            }
            onPress={() => setProfileData({ ...profileData, gender: 'MALE' })}
          >
            <AMText style={styles.btnText}>남</AMText>
          </AMTouchableOpacity>
          <AMTouchableOpacity
            style={
              profileData.gender === 'FEMALE' ? styles.btnActive : styles.btn
            }
            onPress={() => setProfileData({ ...profileData, gender: 'FEMALE' })}
          >
            <AMText style={styles.btnText}>여</AMText>
          </AMTouchableOpacity>
        </View>

        <AMText style={styles.label}>지역</AMText>
        <View style={styles.btnContainer}>
          <AMTouchableOpacity
            style={profileData.region === 'KR' ? styles.btnActive : styles.btn}
            onPress={() => setProfileData({ ...profileData, region: 'KR' })}
          >
            <AMText style={styles.btnText}>한국</AMText>
          </AMTouchableOpacity>
          <AMTouchableOpacity
            style={profileData.region === 'JP' ? styles.btnActive : styles.btn}
            onPress={() => setProfileData({ ...profileData, region: 'JP' })}
          >
            <AMText style={styles.btnText}>일본</AMText>
          </AMTouchableOpacity>
        </View>
        {/* <View style={styles.infoCard}>
          <CheckCircle2 size={20} color="#4A90E2" />
          <View style={styles.infoTextWrapper}>
            <VIText style={styles.infoTitle}>본인 인증이 필요합니다</VIText>
            <VIText style={styles.infoDesc}>
              19세 미만 및 악성 유저 차단을 위해 국내 본인 확인 API를 사용합니다
            </VIText>
          </View>
        </View> */}
      </View>

      <AMTouchableOpacity
        style={[
          styles.nextButton,
          (!profileData?.nickname ||
            !profileData.gender ||
            !profileData.region ||
            !profileData.region) &&
            styles.disabledButton,
        ]}
        disabled={
          !profileData?.nickname ||
          !profileData.gender ||
          !profileData.region ||
          !profileData.region
        }
        onPress={() => setStep(2)}
      >
        <AMText style={styles.nextButtonText}>다음</AMText>
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
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    columnGap: 8,
  },
  btnActive: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    paddingVertical: 10,
    borderRadius: 12,
    borderColor: '#1E40AF',
  },
  btn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    paddingVertical: 10,
    borderRadius: 12,
    borderColor: '#E5E7EB',
  },
  btnText: {
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
