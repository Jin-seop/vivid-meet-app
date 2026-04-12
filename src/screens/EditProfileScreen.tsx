import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  Camera,
  User,
  Mail,
  MessageCircle,
  Save,
  Globe,
} from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { launchImageLibrary } from 'react-native-image-picker';

import AMText from '../components/common/AMText';
import AMTouchableOpacity from '../components/common/AMTouchableOpacity';
import Dropdown from '../components/common/Dropdown';
import MultiSelectDropdown from '../components/common/MultiSelectDropdown';
import CenterModal, { ModalButton } from '../components/common/CenterModal';
import { useAuth } from '../context/AuthContext';
import {
  RootStackParamList,
  RootStackScreenName,
} from './navigation/RootStack';
import { StackScreenProps } from '@react-navigation/stack';

type EditProfileScreenProps = StackScreenProps<
  RootStackParamList,
  RootStackScreenName.EditProfile
>;

const EditProfileScreen = ({ navigation }: EditProfileScreenProps) => {
  const { t } = useTranslation();
  const { user, updateUser } = useAuth();

  // 폼 상태
  const [nickname, setNickname] = useState(user?.nickname || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('010-1234-5678'); // 예시 데이터
  const [birthdate, setBirthdate] = useState('1995-05-15');
  const [gender, setGender] = useState(user?.gender?.toLowerCase() || 'male');
  const [language, setLanguage] = useState(user?.region === 'JP' ? 'ja' : 'ko');
  const [interests, setInterests] = useState<string[]>(['music', 'game']);
  const [statusMessage, setStatusMessage] = useState('안녕하세요! 반가워요 😊');
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // 모달 상태
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  // 옵션 데이터 (i18n 적용)
  const genderOptions = [
    { value: 'male', label: t('signup.male') },
    { value: 'female', label: t('signup.female') },
  ];

  const languageOptions = [
    {
      value: 'ko',
      label: t('signup.korea'),
      icon: <Globe size={16} color="#4B5563" />,
    },
    {
      value: 'ja',
      label: t('signup.japan'),
      icon: <Globe size={16} color="#4B5563" />,
    },
  ];

  const interestOptions = [
    { value: 'music', label: t('signup.step2_tags.kwebtoon') },
    { value: 'game', label: t('signup.step2_tags.anime') },
    { value: 'photo', label: t('signup.step2_tags.photorealistic') },
  ];

  const handleImagePicker = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
    });

    if (result.assets && result.assets[0].uri) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    // 실제 API 호출 로직이 들어갈 자리
    updateUser({ nickname, gender: gender.toUpperCase() as any });
    setShowSaveConfirm(false);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => setShowCancelConfirm(true)}
          style={styles.iconButton}
        >
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <AMText style={styles.headerTitle} fontWeight={700}>
          {t('edit_profile.title')}
        </AMText>
        <AMTouchableOpacity
          style={styles.saveButton}
          onPress={() => setShowSaveConfirm(true)}
        >
          <LinearGradient
            colors={['#4A90E2', '#50E3C2']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.saveGradient}
          >
            <Save size={16} color="white" style={{ marginRight: 4 }} />
            <AMText style={styles.saveText} fontWeight={600}>
              {t('edit_profile.save')}
            </AMText>
          </LinearGradient>
        </AMTouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 프로필 사진 섹션 */}
        <View style={styles.card}>
          <AMText style={styles.sectionTitle} fontWeight={700}>
            {t('edit_profile.photo_section')}
          </AMText>
          <View style={styles.photoContainer}>
            <View style={styles.avatarWrapper}>
              {profileImage || user?.aiPhotoUrl ? (
                <Image
                  source={{ uri: profileImage || user?.aiPhotoUrl }}
                  style={styles.avatar}
                />
              ) : (
                <LinearGradient
                  colors={['#4A90E2', '#50E3C2']}
                  style={styles.avatarPlaceholder}
                >
                  <AMText style={styles.avatarInitial} fontWeight={700}>
                    {nickname.charAt(0)}
                  </AMText>
                </LinearGradient>
              )}
              <TouchableOpacity
                style={styles.cameraBadge}
                onPress={handleImagePicker}
              >
                <Camera size={20} color="#4A90E2" />
              </TouchableOpacity>
            </View>
            <AMText style={styles.photoHelp}>
              {t('edit_profile.photo_help')}
            </AMText>
          </View>
        </View>

        {/* 기본 정보 섹션 */}
        <View style={styles.card}>
          <AMText style={styles.sectionTitle} fontWeight={700}>
            {t('edit_profile.basic_info')}
          </AMText>

          <View style={styles.inputGroup}>
            <AMText style={styles.label} fontWeight={600}>
              <User size={14} color="#374151" /> {t('edit_profile.nickname')}
            </AMText>
            <TextInput
              style={styles.input}
              value={nickname}
              onChangeText={setNickname}
              placeholder={t('edit_profile.nickname_placeholder')}
              maxLength={20}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.inputGroup}>
            <AMText style={styles.label} fontWeight={600}>
              <Mail size={14} color="#374151" /> {t('edit_profile.email')}
            </AMText>
            <TextInput
              style={[styles.input, styles.disabledInput]}
              value={email}
              editable={false}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <Dropdown
            label={t('edit_profile.gender')}
            options={genderOptions}
            value={gender}
            onChange={setGender}
            fullWidth
          />
        </View>

        {/* 추가 정보 섹션 */}
        <View style={styles.card}>
          <AMText style={styles.sectionTitle} fontWeight={700}>
            {t('edit_profile.additional_info')}
          </AMText>

          <Dropdown
            label={t('edit_profile.language')}
            options={languageOptions}
            value={language}
            onChange={setLanguage}
            fullWidth
          />

          <MultiSelectDropdown
            label={t('edit_profile.interests')}
            options={interestOptions}
            values={interests}
            onChange={setInterests}
            fullWidth
          />

          <View style={styles.inputGroup}>
            <AMText style={styles.label} fontWeight={600}>
              <MessageCircle size={14} color="#374151" />{' '}
              {t('edit_profile.status_msg')}
            </AMText>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={statusMessage}
              onChangeText={setStatusMessage}
              placeholder={t('edit_profile.status_msg_placeholder')}
              multiline
              numberOfLines={3}
              maxLength={100}
              placeholderTextColor="#9CA3AF"
            />
            <AMText style={styles.charCount}>{statusMessage.length}/100</AMText>
          </View>
        </View>

        <View style={styles.guideBox}>
          <AMText style={styles.guideText}>
            💡 {t('edit_profile.guide_msg')}
          </AMText>
        </View>
      </ScrollView>

      {/* 저장 확인 모달 */}
      <CenterModal
        isOpen={showSaveConfirm}
        onClose={() => setShowSaveConfirm(false)}
        title={t('edit_profile.save_modal_title')}
        footer={
          <View style={styles.modalButtons}>
            <ModalButton
              variant="secondary"
              onClick={() => setShowSaveConfirm(false)}
            >
              {t('common.cancel')}
            </ModalButton>
            <ModalButton variant="primary" onClick={handleSave}>
              {t('edit_profile.save')}
            </ModalButton>
          </View>
        }
      >
        <AMText style={styles.modalText}>
          {t('edit_profile.save_modal_desc')}
        </AMText>
      </CenterModal>

      {/* 취소 확인 모달 */}
      <CenterModal
        isOpen={showCancelConfirm}
        onClose={() => setShowCancelConfirm(false)}
        title={t('edit_profile.cancel_modal_title')}
        footer={
          <View style={styles.modalButtons}>
            <ModalButton
              variant="secondary"
              onClick={() => setShowCancelConfirm(false)}
            >
              {t('edit_profile.stay')}
            </ModalButton>
            <ModalButton variant="danger" onClick={() => navigation.goBack()}>
              {t('edit_profile.leave')}
            </ModalButton>
          </View>
        }
      >
        <AMText style={styles.modalText}>
          {t('edit_profile.cancel_modal_desc')}
        </AMText>
      </CenterModal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerTitle: { fontSize: 18, color: '#111827' },
  iconButton: { padding: 8 },
  saveButton: { borderRadius: 8, overflow: 'hidden' },
  saveGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  saveText: { color: 'white', fontSize: 14 },
  scrollContent: { padding: 16, paddingBottom: 40 },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  sectionTitle: { fontSize: 16, color: '#111827', marginBottom: 20 },
  photoContainer: { alignItems: 'center' },
  avatarWrapper: { position: 'relative' },
  avatar: { width: 120, height: 120, borderRadius: 60 },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: { color: 'white', fontSize: 40 },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    backgroundColor: 'white',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    elevation: 4,
  },
  photoHelp: { fontSize: 12, color: '#6B7280', marginTop: 12 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 14, color: '#374151', marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    fontSize: 16,
    color: '#111827',
  },
  disabledInput: { backgroundColor: '#F9FAFB', color: '#9CA3AF' },
  textArea: { height: 100, textAlignVertical: 'top' },
  charCount: {
    textAlign: 'right',
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
  guideBox: {
    padding: 16,
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  guideText: { fontSize: 13, color: '#1E40AF', lineHeight: 20 },
  modalText: {
    fontSize: 16,
    color: '#4B5563',
    textAlign: 'center',
    marginBottom: 24,
  },
  modalButtons: { flexDirection: 'row', gap: 12 },
});

export default EditProfileScreen;
