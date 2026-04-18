import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { MotiView } from 'moti';
import { useTranslation } from 'react-i18next';
import AMText from '../common/AMText';
import AMTouchableOpacity from '../common/AMTouchableOpacity';
import { SignUpData } from '../../screens/SignUpScreen';
import { PretendardFont } from '../../utils/fonts';

interface SignUpStep3Props {
  onPhotoSelect: (isPose: boolean) => Promise<void>;
  profileData: SignUpData;
  makeAiPhoto: () => Promise<void>;
}

const SignUpStep3 = ({
  onPhotoSelect,
  profileData,
  makeAiPhoto,
}: SignUpStep3Props) => {
  const { t } = useTranslation();

  return (
    <MotiView
      from={{ opacity: 0, translateX: 20 }}
      animate={{ opacity: 1, translateX: 0 }}
    >
      <AMText style={styles.title} fontFamily={PretendardFont.Bold}>
        {t('signup.step3_title')}
      </AMText>
      <AMText style={styles.subtitle}>{t('signup.step3_subtitle')}</AMText>

      <View style={styles.photoGrid}>
        <View style={styles.uploadBoxContainer}>
          <AMTouchableOpacity
            style={styles.uploadBox}
            onPress={() => onPhotoSelect(true)}
          >
            {profileData.posePhotoUrl ? (
              <Image
                style={styles.photoImage}
                source={{ uri: profileData.posePhotoUrl }}
              />
            ) : null}
          </AMTouchableOpacity>
          <AMText style={styles.uploadBoxText} fontWeight={500}>
            {t('signup.pose_photo')}
          </AMText>
        </View>

        <View style={styles.uploadBoxContainer}>
          <AMTouchableOpacity
            style={styles.uploadBox}
            onPress={() => onPhotoSelect(false)}
          >
            {profileData.realPhotoUrl ? (
              <Image
                style={styles.photoImage}
                source={{ uri: profileData.realPhotoUrl }}
              />
            ) : null}
          </AMTouchableOpacity>
          <AMText style={styles.uploadBoxText} fontWeight={500}>
            {t('signup.real_photo')}
          </AMText>
        </View>
      </View>

      <AMTouchableOpacity
        style={[
          styles.nextButton,
          (!profileData.posePhotoUrl || !profileData.realPhotoUrl) &&
            styles.disabledButton,
        ]}
        disabled={
          !profileData.posePhotoUrl || !profileData.realPhotoUrl
        }
        onPress={makeAiPhoto}
      >
        <AMText style={styles.nextButtonText} fontWeight={700}>
          {t('common.next')}
        </AMText>
      </AMTouchableOpacity>
    </MotiView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: { fontSize: 16, color: '#6B7280', marginBottom: 32 },
  // photoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  // photoBox: {
  //   width: (width - 68) / 3,
  //   aspectRatio: 1,
  //   borderRadius: 12,
  //   overflow: 'hidden',
  // },
  // photoImage: { width: '100%', height: '100%' },
  photoGrid: { flexDirection: 'row', gap: 10, justifyContent: 'space-between' },
  uploadBoxContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  uploadBox: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 12,
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoImage: { width: '100%', height: '100%' },
  uploadBoxText: {
    marginTop: 12,
    textAlign: 'center',
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
  infoTextWrapper: { flex: 1 },
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
