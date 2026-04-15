import React, { useEffect, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { MotiView } from 'moti';
import { useTranslation } from 'react-i18next'; // 추가
import AMText from '../common/AMText';
import AMTouchableOpacity from '../common/AMTouchableOpacity';
import { SignUpData } from '../../screens/SignUpScreen';
import { userApi } from '../../api/user';
import { useQuery } from '@tanstack/react-query';

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
  const { t } = useTranslation(); // 추가

  const [debouncedNickname, setDebouncedNickname] = useState(
    profileData.nickname,
  );

  const { data } = useQuery({
    queryKey: ['nicknameCheck', debouncedNickname],
    queryFn: async () => {
      const response = await userApi.checkNickname(debouncedNickname);
      console.log('response ==>', response);

      return response.data;
    },
    enabled: debouncedNickname.length >= 2,
    placeholderData: { isAvailable: true },
    staleTime: 1000 * 60,
  });

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedNickname(profileData.nickname);
    }, 500);
    return () => clearTimeout(handler);
  }, [profileData.nickname]);

  return (
    <MotiView
      from={{ opacity: 0, translateX: 20 }}
      animate={{ opacity: 1, translateX: 0 }}
    >
      <AMText style={styles.title} fontWeight={700}>
        {t('signup.step1_title')}
      </AMText>
      <AMText style={styles.subtitle}>{t('signup.step1_subtitle')}</AMText>

      <View style={styles.form}>
        <AMText style={styles.label} fontWeight={600}>
          {t('signup.nickname')}
        </AMText>
        <TextInput
          style={[
            styles.input,
            profileData.nickname.length > 2 &&
              !data?.isAvailable &&
              styles.invalidInput,
          ]}
          value={profileData?.nickname}
          onChangeText={text =>
            setProfileData({ ...profileData, nickname: text })
          }
          placeholder={t('signup.nickname')} // 수정
          placeholderTextColor="#9CA3AF"
        />

        <AMText style={styles.label} fontWeight={600}>
          {t('signup.gender')}
        </AMText>
        <View style={styles.btnContainer}>
          <AMTouchableOpacity
            style={
              profileData.gender === 'MALE' ? styles.btnActive : styles.btn
            }
            onPress={() => setProfileData({ ...profileData, gender: 'MALE' })}
          >
            <AMText style={styles.btnText}>{t('signup.male')}</AMText>
          </AMTouchableOpacity>
          <AMTouchableOpacity
            style={
              profileData.gender === 'FEMALE' ? styles.btnActive : styles.btn
            }
            onPress={() => setProfileData({ ...profileData, gender: 'FEMALE' })}
          >
            <AMText style={styles.btnText}>{t('signup.female')}</AMText>
          </AMTouchableOpacity>
        </View>

        <AMText style={styles.label} fontWeight={600}>
          {t('signup.region')}
        </AMText>
        <View style={styles.btnContainer}>
          <AMTouchableOpacity
            style={profileData.region === 'KR' ? styles.btnActive : styles.btn}
            onPress={() => setProfileData({ ...profileData, region: 'KR' })}
          >
            <AMText style={styles.btnText}>{t('signup.korea')}</AMText>
          </AMTouchableOpacity>
          <AMTouchableOpacity
            style={profileData.region === 'JP' ? styles.btnActive : styles.btn}
            onPress={() => setProfileData({ ...profileData, region: 'JP' })}
          >
            <AMText style={styles.btnText}>{t('signup.japan')}</AMText>
          </AMTouchableOpacity>
        </View>
      </View>

      <AMTouchableOpacity
        style={[
          styles.nextButton,
          (!profileData?.nickname ||
            !profileData.gender ||
            !profileData.region ||
            !data?.isAvailable) &&
            styles.disabledButton,
        ]}
        disabled={
          !profileData?.nickname ||
          !profileData.gender ||
          !profileData.region ||
          !data?.isAvailable
        }
        onPress={() => setStep(2)}
      >
        <AMText style={styles.nextButtonText} fontWeight={700}>
          {t('common.next')}
        </AMText>
      </AMTouchableOpacity>
    </MotiView>
  );
};

const styles = StyleSheet.create({
  title: { fontSize: 24, color: '#111827', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#6B7280', marginBottom: 32 },
  form: { gap: 12 },
  label: { fontSize: 14, color: '#374151', marginBottom: 8 },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#111827',
  },
  invalidInput: {
    borderColor: '#EF4444',
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
  btnText: { fontSize: 16, color: '#374151' },
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