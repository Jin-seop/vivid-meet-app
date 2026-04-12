import React, { useState, useRef, ReactNode } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';
import { MoreVertical } from 'lucide-react-native';
import { MotiView } from 'moti';
import AMText from './AMText';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export interface ActionOption {
  value: string;
  label: string;
  icon?: ReactNode;
  variant?: 'default' | 'danger';
  disabled?: boolean;
}

interface ActionDropdownProps {
  options: ActionOption[];
  onSelect: (value: string) => void;
  trigger?: ReactNode;
  align?: 'left' | 'right';
}

const ActionDropdown = ({
  options,
  onSelect,
  trigger,
  align = 'right',
}: ActionDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownLayout, setDropdownLayout] = useState({
    x: 0,
    y: 0,
    width: 0,
  });
  const anchorRef = useRef<View>(null);

  // 드롭다운 위치 계산 (웹의 absolute 위치 대용)
  const handleOpen = () => {
    if (anchorRef.current) {
      anchorRef.current.measure((fx, fy, w, h, px, py) => {
        // 화면 하단을 벗어날 경우 위로 띄우는 로직 등을 추가할 수 있습니다.
        setDropdownLayout({
          x: align === 'right' ? px + w - 180 : px,
          y: py + h,
          width: 180, // min-w-[180px] 반영
        });
        setIsOpen(true);
      });
    }
  };

  const handleSelect = (optionValue: string) => {
    onSelect(optionValue);
    setIsOpen(false);
  };

  return (
    <View style={styles.container}>
      {/* 트리거 버튼 영역 */}
      <View ref={anchorRef} collapsable={false}>
        <TouchableOpacity
          onPress={handleOpen}
          style={styles.trigger}
          activeOpacity={0.6}
        >
          {trigger || <MoreVertical size={20} color="#4B5563" />}
        </TouchableOpacity>
      </View>

      {/* 모달 기반 드롭다운 메뉴 */}
      <Modal
        visible={isOpen}
        transparent
        animationType="none"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <MotiView
            from={{ opacity: 0, scale: 0.95, translateY: -10 }}
            animate={{ opacity: 1, scale: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 150 }}
            style={[
              styles.dropdownMenu,
              {
                top: dropdownLayout.y + 4,
                left: Math.max(
                  16,
                  Math.min(dropdownLayout.x, SCREEN_WIDTH - 196),
                ), // 화면 밖 나감 방지
                width: dropdownLayout.width,
              },
            ]}
          >
            <View style={styles.optionsWrapper}>
              {options.map((option, index) => {
                const isDanger = option.variant === 'danger';
                const textColor = isDanger ? '#EF4444' : '#111827';
                const showBorder =
                  index > 0 && options[index - 1].variant !== option.variant;

                return (
                  <TouchableOpacity
                    key={option.value}
                    onPress={() =>
                      !option.disabled && handleSelect(option.value)
                    }
                    disabled={option.disabled}
                    style={[
                      styles.optionButton,
                      showBorder && styles.borderTop,
                      option.disabled && styles.disabledOption,
                    ]}
                  >
                    {option.icon && (
                      <View style={styles.iconWrapper}>{option.icon}</View>
                    )}
                    <AMText
                      style={[styles.optionLabel, { color: textColor }]}
                      fontWeight={500}
                    >
                      {option.label}
                    </AMText>
                  </TouchableOpacity>
                );
              })}
            </View>
          </MotiView>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
  },
  trigger: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  dropdownMenu: {
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    overflow: 'hidden',
  },
  optionsWrapper: {
    paddingVertical: 4,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  borderTop: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    marginTop: 4,
    paddingTop: 8,
  },
  iconWrapper: {
    marginRight: 12,
  },
  optionLabel: {
    fontSize: 15,
  },
  disabledOption: {
    opacity: 0.5,
  },
});
export default ActionDropdown;
