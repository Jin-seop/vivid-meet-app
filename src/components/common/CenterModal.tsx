import React, { ReactNode } from 'react';
import {
  StyleSheet,
  View,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import { X } from 'lucide-react-native';
import { MotiView } from 'moti';
import VIText from '../common/VIText';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface CenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  showCloseButton?: boolean;
  maxWidth?: 'sm' | 'md' | 'lg';
  footer?: ReactNode;
}

const CenterModal = ({
  isOpen,
  onClose,
  title,
  children,
  showCloseButton = true,
  maxWidth = 'sm',
  footer,
}: CenterModalProps) => {
  // 웹의 maxWidth 클래스를 네이티브 너비 값으로 변환
  const getModalWidth = () => {
    switch (maxWidth) {
      case 'lg':
        return SCREEN_WIDTH * 0.9;
      case 'md':
        return SCREEN_WIDTH * 0.85;
      case 'sm':
      default:
        return SCREEN_WIDTH * 0.8;
    }
  };

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="none" // Moti로 커스텀 애니메이션을 구현하기 위해 none 설정
      onRequestClose={onClose} // 안드로이드 백 버튼 대응
    >
      {/* 배경 오버레이 */}
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: 'timing', duration: 200 }}
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: 'rgba(0,0,0,0.5)' },
          ]}
        />

        {/* 모달 컨텐츠 */}
        <TouchableWithoutFeedback>
          <MotiView
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'timing', duration: 200 }}
            style={[styles.modalContent, { width: getModalWidth() }]}
          >
            {/* 헤더 */}
            {(title || showCloseButton) && (
              <View style={styles.header}>
                {title && (
                  <VIText style={styles.title} fontWeight={700}>
                    {title}
                  </VIText>
                )}
                {showCloseButton && (
                  <TouchableOpacity
                    onPress={onClose}
                    style={styles.closeButton}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <X size={20} color="#6B7280" />
                  </TouchableOpacity>
                )}
              </View>
            )}

            {/* 바디 */}
            <View style={styles.body}>{children}</View>

            {/* 푸터 */}
            {footer && <View style={styles.footer}>{footer}</View>}
          </MotiView>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
};

interface ModalButtonProps {
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  children: ReactNode;
  disabled?: boolean;
}

export function ModalButton({
  onClick,
  variant = 'primary',
  children,
  disabled = false,
}: ModalButtonProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return { bg: '#F3F4F6', text: '#374151' };
      case 'danger':
        return { bg: '#EF4444', text: '#FFFFFF' };
      case 'primary':
      default:
        return { bg: '#4A90E2', text: '#FFFFFF' };
    }
  };

  const { bg, text } = getVariantStyles();

  return (
    <TouchableOpacity
      onPress={onClick}
      disabled={disabled}
      style={[
        styles.button,
        { backgroundColor: bg },
        disabled && { opacity: 0.5 },
      ]}
    >
      <VIText style={[styles.buttonText, { color: text }]} fontWeight={600}>
        {children}
      </VIText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 12,
  },
  title: {
    fontSize: 18,
    color: '#111827',
  },
  closeButton: {
    marginLeft: 'auto',
    padding: 4,
  },
  body: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  button: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
  },
});

export default CenterModal;
