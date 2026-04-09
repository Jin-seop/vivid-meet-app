import React, { useState } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { launchImageLibrary } from 'react-native-image-picker';
import SignUpHeader from '../components/sighUp/header';
import {
  RootStackParamList,
  RootStackScreenName,
} from './navigation/RootStack';
import { StackNavigationProp } from '@react-navigation/stack';
import SignUpStep1 from '../components/sighUp/step_1';
import SignUpStep2 from '../components/sighUp/step_2';
import SignUpStep4 from '../components/sighUp/step_4';
import SignUpStep3 from '../components/sighUp/step_3';
import { RouteProp, useRoute } from '@react-navigation/native';

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
  provider: string;
  providerId: string;
  region: string;
  gender: string;
  posePhotoUrl: string;
  realPhotos: string[];
}

const SignUpScreen = ({ navigation }: SignUpScreenProps) => {
  const route =
    useRoute<RouteProp<RootStackParamList, RootStackScreenName.SignUp>>();

  const [step, setStep] = useState(1);
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [profileData, setProfileData] = useState<SignUpData>({
    email: route.params.email,
    nickname: '',
    provider: '',
    providerId: '',
    region: '',
    gender: '',
    posePhotoUrl: '',
    realPhotos: [],
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

        {/* Step 2: 사진 업로드 */}
        {step === 2 && (
          <SignUpStep2
            setStep={setStep}
            uploadedPhotos={uploadedPhotos}
            removePhoto={removePhoto}
            handlePhotoUpload={handlePhotoUpload}
          />
        )}

        {/* Step 3: 취향 설정 */}
        {step === 3 && (
          <SignUpStep3
            profileData={profileData}
            setProfileData={setProfileData}
            setStep={setStep}
          />
        )}

        {/* Step 4: AI 캐릭터 프리뷰 */}
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
