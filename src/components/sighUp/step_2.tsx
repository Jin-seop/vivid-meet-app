import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { MotiView } from 'moti';
import { useTranslation } from 'react-i18next';
import AMText from '../common/AMText';
import AMTouchableOpacity from '../common/AMTouchableOpacity';
import { AIData } from '../../screens/SignUpScreen';

interface SignUpStep2Props {
  aiData: AIData;
  setAIData: React.Dispatch<React.SetStateAction<AIData>>;
  setStep: React.Dispatch<React.SetStateAction<number>>;
}

const SignUpStep2 = ({ aiData, setAIData, setStep }: SignUpStep2Props) => {
  const { t } = useTranslation();

  // 태그 리스트를 번역 키 구조로 관리
  const TAG_CATEGORIES = {
    style: [
      { labelKey: 'signup.step2_tags.kwebtoon', value: 'K-Webtoon style' },
      { labelKey: 'signup.step2_tags.anime', value: 'Anime style' },
      { labelKey: 'signup.step2_tags.photorealistic', value: 'Photorealistic' },
      { labelKey: 'signup.step2_tags.digital_art', value: 'Digital art' },
    ],
    mood: [
      { labelKey: 'signup.step2_tags.golden_hour', value: 'Golden hour' },
      { labelKey: 'signup.step2_tags.neon_light', value: 'Neon light' },
      { labelKey: 'signup.step2_tags.studio', value: 'Studio lighting' },
      { labelKey: 'signup.step2_tags.dreamy', value: 'Dreamy' },
      { labelKey: 'signup.step2_tags.calm', value: 'Calm' },
    ],
  };

  const toggleTag = (tagValue: string) => {
    const currentTags = aiData.tags || [];
    const nextTags = currentTags.includes(tagValue)
      ? currentTags.filter(t => t !== tagValue)
      : [...currentTags, tagValue];
    setAIData({ ...aiData, tags: nextTags });
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <MotiView
        from={{ opacity: 0, translateX: 20 }}
        animate={{ opacity: 1, translateX: 0 }}
      >
        <AMText style={styles.title} fontWeight={700}>
          {t('signup.step2_title')}
        </AMText>
        <AMText style={styles.subtitle}>{t('signup.step2_subtitle')}</AMText>

        <AMText style={styles.label} fontWeight={600}>
          MBTI (선택)
        </AMText>
        <View style={styles.interestGrid}>
          {['INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP'].map(
            mbti => (
              <AMTouchableOpacity
                key={mbti}
                onPress={() => setAIData({ ...aiData, mbti })}
                style={[styles.chip, aiData.mbti === mbti && styles.chipActive]}
              >
                <AMText
                  style={[
                    styles.chipText,
                    aiData.mbti === mbti && styles.chipTextActive,
                  ]}
                >
                  {mbti}
                </AMText>
              </AMTouchableOpacity>
            ),
          )}
        </View>

        <View style={styles.tagSection}>
          <AMText style={styles.label} fontWeight={600}>
            {t('signup.step2_subtitle')} {/* 혹은 적절한 키로 대체 가능 */}
          </AMText>

          {Object.entries(TAG_CATEGORIES).map(([category, tags]) => (
            <View key={category} style={styles.categoryContainer}>
              <AMText style={styles.subLabel} fontWeight={700}>
                {category === 'style'
                  ? t('signup.step2_tags.style_label')
                  : t('signup.step2_tags.mood_label')}
              </AMText>
              <View style={styles.interestGrid}>
                {tags.map(tag => {
                  const isSelected = aiData.tags?.includes(tag.value);
                  return (
                    <AMTouchableOpacity
                      key={tag.value}
                      onPress={() => toggleTag(tag.value)}
                      style={[
                        styles.tagChip,
                        isSelected && styles.tagChipActive,
                      ]}
                    >
                      <AMText
                        style={[
                          styles.tagText,
                          isSelected && styles.tagTextActive,
                        ]}
                      >
                        {t(tag.labelKey)} {/* 번역 키 호출 */}
                      </AMText>
                    </AMTouchableOpacity>
                  );
                })}
              </View>
            </View>
          ))}
        </View>

        <AMTouchableOpacity
          style={styles.nextButton}
          onPress={() => setStep(3)}
        >
          <AMText style={styles.nextButtonText} fontWeight={700}>
            {t('common.next')}
          </AMText>
        </AMTouchableOpacity>
      </MotiView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  title: { fontSize: 24, color: '#111827', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#6B7280', marginBottom: 32 },
  label: { fontSize: 14, color: '#374151', marginBottom: 12 },
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
  tagSection: { marginTop: 24 },
  categoryContainer: { marginBottom: 16 },
  subLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 8,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  tagChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  tagChipActive: { backgroundColor: '#4A90E2', borderColor: '#4A90E2' },
  tagText: { fontSize: 14, color: '#374151' },
  tagTextActive: { color: 'white' },
  nextButton: {
    height: 56,
    backgroundColor: '#4A90E2',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 40,
  },
  nextButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});

export default SignUpStep2;
