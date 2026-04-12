import React, { useState } from 'react';
import { StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { launchImageLibrary } from 'react-native-image-picker';
import SignUpHeader from '../components/sighUp/header';
import {
  RootStackParamList,
  RootStackScreenName,
} from './navigation/RootStack';
import { StackNavigationProp } from '@react-navigation/stack';
import SignUpStep1 from '../components/sighUp/step_1';
import SignUpStep3 from '../components/sighUp/step_3';
import SignUpStep4 from '../components/sighUp/step_4';
import SignUpStep2 from '../components/sighUp/step_2';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { aiApi } from '../api/ai';

export type SignUpScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  RootStackScreenName.SignUp
>;

interface SignUpScreenProps {
  navigation: SignUpScreenNavigationProp;
}

export interface SignUpData {
  email: string;
  nickname: string;
  provider: 'GooGle' | 'Apple' | 'Line';
  providerId: string;
  region: 'KR' | 'JP' | null;
  gender: 'MALE' | 'FEMALE' | null;
  aiPhotoUrl: string;
  posePhotoUrl: string;
  realPhotos: string[];
}
export interface AIData {
  mbti: string | null;
  tags: string[];
}

const SignUpScreen = ({ navigation }: SignUpScreenProps) => {
  const route =
    useRoute<RouteProp<RootStackParamList, RootStackScreenName.SignUp>>();
  const { login } = useAuth();

  const [step, setStep] = useState(1);
  const [profileData, setProfileData] = useState<SignUpData>({
    email: route.params.email,
    nickname: '',
    provider: route.params.provider,
    providerId: route.params.providerId,
    region: null,
    gender: null,
    aiPhotoUrl: '',
    posePhotoUrl: '',
    realPhotos: [],
  });
  const [aiData, setAIData] = useState<AIData>({
    mbti: null,
    tags: [],
  });

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  // 사진 선택 로직
  const onPhotoSelect = async (isPose: boolean) => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 1,
      quality: 0.8,
    });

    if (result.assets && result.assets[0].uri && isPose) {
      setProfileData({ ...profileData, posePhotoUrl: result.assets[0].uri });
    } else if (result.assets && result.assets[0].uri && !isPose) {
      setProfileData({
        ...profileData,
        realPhotos: [result.assets[0].uri],
      });
    }
  };

  const makeAiPhoto = async () => {
    if (!profileData.posePhotoUrl || profileData.realPhotos.length === 0) {
      Alert.alert('알림', '포즈 사진과 실물 사진을 모두 등록해주세요.');
      return;
    }

    try {
      const formData = new FormData();

      // 1. 이미지 데이터 FormData 구성
      formData.append('poseImage', {
        uri: profileData.posePhotoUrl,
        name: 'pose.jpg',
        type: 'image/jpeg',
      } as any);

      formData.append('personImage', {
        uri: profileData.realPhotos[0],
        name: 'real.jpg',
        type: 'image/jpeg',
      } as any);

      // 2. Step 2에서 선택한 태그 정보를 프롬프트로 변환하여 전달
      formData.append('pos', aiData.tags.join(', '));
      formData.append('neg', 'low quality, blurry, distorted');
      formData.append('seed', String(Math.floor(Math.random() * 1000000)));

      // 3. API 호출
      const response = await aiApi.generatePersona(formData);

      if (response.data && response.data.imageUrl) {
        // 4. 생성된 AI 이미지 URL 저장 및 다음 단계 이동
        setProfileData(prev => ({
          ...prev,
          aiPhotoUrl: response.data.imageUrl,
        }));
        setStep(4);
      }
    } catch (error) {
      console.error('AI Generation Error:', error);
      Alert.alert('오류', 'AI 캐릭터 생성에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const onSignUp = () => {
    // login({
    //   name: profileData.name,
    //   birthYear: profileData.birthYear,
    //   mbti: profileData.mbti,
    //   interests: profileData.interests,
    //   photos: uploadedPhotos,
    // });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <SignUpHeader
        step={step}
        navigation={navigation}
        setStep={setStep}
        progress={progress}
        totalSteps={totalSteps}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Step 1: 기본 정보 */}
        {step === 1 && (
          <SignUpStep1
            profileData={profileData}
            setProfileData={setProfileData}
            setStep={setStep}
          />
        )}

        {/* Step 2: 취향 설정 */}
        {step === 2 && (
          <SignUpStep2
            aiData={aiData}
            setAIData={setAIData}
            setStep={setStep}
          />
        )}

        {/* Step 3: ai 사진 선택 */}
        {step === 3 && (
          <SignUpStep3
            onPhotoSelect={onPhotoSelect}
            profileData={profileData}
            makeAiPhoto={makeAiPhoto}
          />
        )}

        {/* Step 4: AI 캐릭터 프리뷰하고 계정 생성 */}
        {step === 4 && (
          <SignUpStep4 profileData={profileData} navigation={navigation} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
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

export default SignUpScreen;
