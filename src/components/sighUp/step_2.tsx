import { MotiView } from 'moti';
import { StyleSheet, View, ScrollView } from 'react-native';
import AMText from '../common/AMText';
import AMTouchableOpacity from '../common/AMTouchableOpacity';
import { AIData } from '../../screens/SignUpScreen';

interface SignUpStep2Props {
  aiData: AIData;
  setAIData: React.Dispatch<React.SetStateAction<AIData>>;
  setStep: React.Dispatch<React.SetStateAction<number>>;
}

// 프론트엔드 노출용 한글 태그와 서버 전송용 영문 프롬프트 매핑
const TAG_CATEGORIES = {
  style: [
    { label: 'K-웹툰', value: 'K-Webtoon style' },
    { label: '애니메이션', value: 'Anime style' },
    { label: '실사풍', value: 'Photorealistic' },
    { label: '디지털 아트', value: 'Digital art' },
  ],
  mood: [
    { label: '따뜻한 햇살', value: 'Golden hour' },
    { label: '네온 사인', value: 'Neon light' },
    { label: '스튜디오', value: 'Studio lighting' },
    { label: '몽환적인', value: 'Dreamy' },
    { label: '차분한', value: 'Calm' },
  ],
};

const SignUpStep2 = ({ aiData, setAIData, setStep }: SignUpStep2Props) => {
  // 태그 선택 및 해제 로직
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
        <AMText style={styles.title}>나를 표현해주세요</AMText>
        <AMText style={styles.subtitle}>AI 캐릭터 생성에 활용됩니다</AMText>

        {/* 1. MBTI 섹션 */}
        <AMText style={styles.label}>MBTI (선택)</AMText>
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

        {/* 2. AI 스타일 및 분위기 태그 섹션 */}
        <View style={styles.tagSection}>
          <AMText style={styles.label}>원하는 스타일 및 분위기 (선택)</AMText>

          {Object.entries(TAG_CATEGORIES).map(([category, tags]) => (
            <View key={category} style={styles.categoryContainer}>
              <AMText style={styles.subLabel}>
                {category === 'style' ? '그림체' : '조명 및 감성'}
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
                        {tag.label}
                      </AMText>
                    </AMTouchableOpacity>
                  );
                })}
              </View>
            </View>
          ))}
        </View>

        {/* 하단 버튼 */}
        <AMTouchableOpacity
          style={[styles.nextButton]}
          onPress={() => setStep(3)}
        >
          <AMText style={styles.nextButtonText}>다음</AMText>
        </AMTouchableOpacity>
      </MotiView>
    </ScrollView>
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
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  interestGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },

  // MBTI 칩 스타일
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

  // 스타일/분위기 태그 전용 스타일
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
  tagChipActive: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
  },
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
