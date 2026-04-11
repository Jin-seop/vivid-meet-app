import { MotiView } from 'moti';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import VIText from '../common/VIText';
import { X, Upload, Camera } from 'lucide-react-native';
import VITouchableOpacity from '../common/VITouchableOpacity';

const { width } = Dimensions.get('window');

interface SignUpStep3Props {
  setStep: React.Dispatch<React.SetStateAction<number>>;
  uploadedPhotos: string[];
  removePhoto: (index: number) => void;
  handlePhotoUpload: () => Promise<void>;
}

const SignUpStep3 = ({
  setStep,
  uploadedPhotos,
  removePhoto,
  handlePhotoUpload,
}: SignUpStep3Props) => {
  return (
    <MotiView
      from={{ opacity: 0, translateX: 20 }}
      animate={{ opacity: 1, translateX: 0 }}
    >
      <VIText style={styles.title}>사진을 업로드해주세요</VIText>
      <VIText style={styles.subtitle}>최소 5장의 실물 사진이 필요합니다</VIText>

      <View style={styles.photoGrid}>
        {uploadedPhotos.map((photo, index) => (
          <View key={index} style={styles.photoBox}>
            <Image source={{ uri: photo }} style={styles.photoImage} />
            <VITouchableOpacity
              style={styles.removeIcon}
              onPress={() => removePhoto(index)}
            >
              <X size={14} color="white" />
            </VITouchableOpacity>
          </View>
        ))}
        {uploadedPhotos.length < 6 && (
          <VITouchableOpacity
            style={styles.uploadBox}
            onPress={handlePhotoUpload}
          >
            <Upload size={24} color="#9CA3AF" />
            <VIText style={styles.uploadCount}>
              {uploadedPhotos.length}/6
            </VIText>
          </VITouchableOpacity>
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

      <VITouchableOpacity
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
