import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Dimensions,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import {
  ArrowLeft,
  Upload,
  X,
  CheckCircle2,
  Camera,
} from 'lucide-react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import LinearGradient from 'react-native-linear-gradient';
import VIText from '../components/common/VIText';

const { width } = Dimensions.get('window');

export function SignUpScreen({ navigation }: any) {
  const [step, setStep] = useState(1);
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [profileData, setProfileData] = useState({
    name: '',
    birthYear: '',
    mbti: '',
    interests: [] as string[],
  });

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  // 사진 업로드 로직
  const handlePhotoUpload = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 1,
      quality: 0.8,
    });

    if (result.assets && result.assets[0].uri) {
      setUploadedPhotos([...uploadedPhotos, result.assets[0].uri]);
    }
  };

  const removePhoto = (index: number) => {
    setUploadedPhotos(uploadedPhotos.filter((_, i) => i !== index));
  };

  const toggleInterest = (interest: string) => {
    if (profileData.interests.includes(interest)) {
      setProfileData({
        ...profileData,
        interests: profileData.interests.filter(i => i !== interest),
      });
    } else {
      setProfileData({
        ...profileData,
        interests: [...profileData.interests, interest],
      });
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => (step === 1 ? navigation.goBack() : setStep(step - 1))}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>
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

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Step 1: 기본 정보 */}
        {step === 1 && (
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
                onChangeText={text =>
                  setProfileData({ ...profileData, name: text })
                }
                placeholder="실명을 입력해주세요"
              />

              <VIText style={[styles.label, { marginTop: 20 }]}>
                출생년도
              </VIText>
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
                  <VIText style={styles.infoTitle}>
                    본인 인증이 필요합니다
                  </VIText>
                  <VIText style={styles.infoDesc}>
                    19세 미만 및 악성 유저 차단을 위해 국내 본인 확인 API를
                    사용합니다
                  </VIText>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.nextButton,
                (!profileData.name || !profileData.birthYear) &&
                  styles.disabledButton,
              ]}
              disabled={!profileData.name || !profileData.birthYear}
              onPress={() => setStep(2)}
            >
              <VIText style={styles.nextButtonText}>다음</VIText>
            </TouchableOpacity>
          </MotiView>
        )}

        {/* Step 2: 사진 업로드 */}
        {step === 2 && (
          <MotiView
            from={{ opacity: 0, translateX: 20 }}
            animate={{ opacity: 1, translateX: 0 }}
          >
            <VIText style={styles.title}>사진을 업로드해주세요</VIText>
            <VIText style={styles.subtitle}>
              최소 5장의 실물 사진이 필요합니다
            </VIText>

            <View style={styles.photoGrid}>
              {uploadedPhotos.map((photo, index) => (
                <View key={index} style={styles.photoBox}>
                  <Image source={{ uri: photo }} style={styles.photoImage} />
                  <TouchableOpacity
                    style={styles.removeIcon}
                    onPress={() => removePhoto(index)}
                  >
                    <X size={14} color="white" />
                  </TouchableOpacity>
                </View>
              ))}
              {uploadedPhotos.length < 6 && (
                <TouchableOpacity
                  style={styles.uploadBox}
                  onPress={handlePhotoUpload}
                >
                  <Upload size={24} color="#9CA3AF" />
                  <VIText style={styles.uploadCount}>
                    {uploadedPhotos.length}/6
                  </VIText>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.guideCard}>
              <Camera size={20} color="#D97706" />
              <View style={styles.infoTextWrapper}>
                <VIText style={styles.guideTitle}>사진 가이드</VIText>
                <VIText style={styles.guideText}>
                  • 얼굴이 명확하게 보이는 사진
                </VIText>
                <VIText style={styles.guideText}>• 다양한 각도와 표정</VIText>
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.nextButton,
                uploadedPhotos.length < 5 && styles.disabledButton,
              ]}
              disabled={uploadedPhotos.length < 5}
              onPress={() => setStep(3)}
            >
              <VIText style={styles.nextButtonText}>
                다음 ({uploadedPhotos.length}/5)
              </VIText>
            </TouchableOpacity>
          </MotiView>
        )}

        {/* Step 3: 취향 설정 */}
        {step === 3 && (
          <MotiView
            from={{ opacity: 0, translateX: 20 }}
            animate={{ opacity: 1, translateX: 0 }}
          >
            <VIText style={styles.title}>나를 표현해주세요</VIText>
            <VIText style={styles.subtitle}>AI 캐릭터 생성에 활용됩니다</VIText>

            <VIText style={styles.label}>MBTI (선택)</VIText>
            <View style={styles.interestGrid}>
              {[
                'INTJ',
                'INTP',
                'ENTJ',
                'ENTP',
                'INFJ',
                'INFP',
                'ENFJ',
                'ENFP',
              ].map(mbti => (
                <TouchableOpacity
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
                </TouchableOpacity>
              ))}
            </View>

            <VIText style={[styles.label, { marginTop: 24 }]}>
              관심사 (3개 이상 선택)
            </VIText>
            <View style={styles.interestGrid}>
              {[
                '운동',
                '음악',
                '영화',
                '여행',
                '요리',
                '게임',
                '독서',
                '사진',
                '춤',
              ].map(interest => (
                <TouchableOpacity
                  key={interest}
                  onPress={() => toggleInterest(interest)}
                  style={[
                    styles.chip,
                    profileData.interests.includes(interest) &&
                      styles.chipActive,
                  ]}
                >
                  <VIText
                    style={[
                      styles.chipText,
                      profileData.interests.includes(interest) &&
                        styles.chipTextActive,
                    ]}
                  >
                    {interest}
                  </VIText>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={[
                styles.nextButton,
                profileData.interests.length < 3 && styles.disabledButton,
              ]}
              disabled={profileData.interests.length < 3}
              onPress={() => setStep(4)}
            >
              <VIText style={styles.nextButtonText}>다음</VIText>
            </TouchableOpacity>
          </MotiView>
        )}

        {/* Step 4: AI 캐릭터 프리뷰 */}
        {step === 4 && (
          <MotiView
            from={{ opacity: 0, translateX: 20 }}
            animate={{ opacity: 1, translateX: 0 }}
          >
            <VIText style={styles.title}>AI 캐릭터가 생성되었습니다</VIText>
            <VIText style={styles.subtitle}>
              이 캐릭터로 첫 대화가 시작됩니다
            </VIText>

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

            <TouchableOpacity
              style={styles.completeButton}
              onPress={() => navigation.replace('HomeMain')}
            >
              <LinearGradient
                colors={['#4A90E2', '#50E3C2']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientButton}
              >
                <VIText style={styles.nextButtonText}>
                  VividMeet 시작하기
                </VIText>
              </LinearGradient>
            </TouchableOpacity>
          </MotiView>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
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
  scrollContent: { padding: 24 },
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
  photoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  photoBox: {
    width: (width - 68) / 3,
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  photoImage: { width: '100%', height: '100%' },
  removeIcon: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 10,
    padding: 2,
  },
  uploadBox: {
    width: (width - 68) / 3,
    aspectRatio: 1,
    borderRadius: 12,
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadCount: { fontSize: 12, color: '#9CA3AF', marginTop: 4 },
  guideCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFBEB',
    padding: 16,
    borderRadius: 12,
    marginTop: 24,
    gap: 12,
  },
  guideTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#92400E',
    marginBottom: 4,
  },
  guideText: { fontSize: 12, color: '#92400E' },
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
  completeButton: {
    height: 56,
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 32,
  },
  gradientButton: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
