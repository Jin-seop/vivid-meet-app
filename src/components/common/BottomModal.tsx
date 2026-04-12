import React, { ReactNode, useRef } from 'react';
import {
  StyleSheet,
  View,
  Modal,
  TouchableOpacity,
  Dimensions,
  Animated,
  PanResponder,
} from 'react-native';
import { X } from 'lucide-react-native';
import { MotiView } from 'moti';
import AMText from './AMText';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface BottomModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  showCloseButton?: boolean;
  showDragHandle?: boolean;
  height?: 'auto' | 'half' | 'full';
}

const BottomModal = ({
  isOpen,
  onClose,
  title,
  children,
  showCloseButton = true,
  showDragHandle = true,
  height = 'auto',
}: BottomModalProps) => {
  const panY = useRef(new Animated.Value(0)).current;

  // 드래그(Pan) 핸들러 설정
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          panY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100 || gestureState.vy > 0.5) {
          onClose();
          panY.setValue(0);
        } else {
          Animated.spring(panY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    }),
  ).current;

  const getModalHeight = () => {
    switch (height) {
      case 'full':
        return SCREEN_HEIGHT * 0.9;
      case 'half':
        return SCREEN_HEIGHT * 0.5;
      case 'auto':
      default:
        return undefined; // 컨텐츠에 맞춤
    }
  };

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* 배경 오버레이 */}
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={onClose}
        >
          <MotiView
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={[
              StyleSheet.absoluteFill,
              { backgroundColor: 'rgba(0,0,0,0.5)' },
            ]}
          />
        </TouchableOpacity>

        {/* 모달 컨텐츠 */}
        <Animated.View
          style={[
            styles.modalContent,
            {
              height: getModalHeight(),
              maxHeight: SCREEN_HEIGHT * 0.9,
              transform: [{ translateY: panY }],
            },
          ]}
        >
          {/* 드래그 핸들 영역 */}
          <View {...panResponder.panHandlers}>
            {showDragHandle && (
              <View style={styles.dragHandleContainer}>
                <View style={styles.dragHandle} />
              </View>
            )}

            {/* 헤더 */}
            {(title || showCloseButton) && (
              <View style={styles.header}>
                {title && (
                  <AMText style={styles.title} fontWeight={700}>
                    {title}
                  </AMText>
                )}
                {showCloseButton && (
                  <TouchableOpacity
                    onPress={onClose}
                    style={styles.closeButton}
                  >
                    <X size={20} color="#6B7280" />
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>

          {/* 바디 */}
          <View style={styles.body}>{children}</View>
        </Animated.View>
      </View>
    </Modal>
  );
};

export function BottomModalOption({
  icon,
  label,
  onClick,
  variant = 'default',
  disabled = false,
}: {
  icon?: ReactNode;
  label: string;
  onClick: () => void;
  variant?: 'default' | 'danger';
  disabled?: boolean;
}) {
  return (
    <TouchableOpacity
      onPress={onClick}
      disabled={disabled}
      style={[styles.optionButton, disabled && { opacity: 0.5 }]}
    >
      <View style={styles.optionLeft}>
        {icon && <View style={styles.optionIcon}>{icon}</View>}
        <AMText
          style={[
            styles.optionLabel,
            variant === 'danger' && { color: '#EF4444' },
          ]}
          fontWeight={500}
        >
          {label}
        </AMText>
      </View>
    </TouchableOpacity>
  );
}

export function BottomModalDivider({
  spacing = 'md',
}: {
  spacing?: 'sm' | 'md' | 'lg';
}) {
  const getMargin = () => {
    if (spacing === 'sm') return 4;
    if (spacing === 'lg') return 16;
    return 8;
  };
  return <View style={[styles.divider, { marginVertical: getMargin() }]} />;
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end' },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 40,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  dragHandleContainer: { alignItems: 'center', paddingVertical: 12 },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  title: { fontSize: 18, color: '#111827' },
  closeButton: { padding: 4 },
  body: { paddingVertical: 8 },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  optionLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  optionIcon: { marginRight: 12 },
  optionLabel: { fontSize: 16, color: '#1F2937' },
  divider: { height: 1, backgroundColor: '#F3F4F6' },
});

export default BottomModal;
