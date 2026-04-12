import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import { ChevronDown, Check } from 'lucide-react-native';
import { MotiView } from 'moti';
import AMText from './AMText';
import { useTranslation } from 'react-i18next';

export interface DropdownOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface DropdownProps {
  options: DropdownOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  error?: string;
  fullWidth?: boolean;
}

const Dropdown = ({
  options,
  value,
  onChange,
  placeholder,
  label,
  disabled = false,
  error,
  fullWidth = false,
}: DropdownProps) => {
  const { t } = useTranslation();

  const [isOpen, setIsOpen] = useState(false);
  const [dropdownLayout, setDropdownLayout] = useState({
    x: 0,
    y: 0,
    width: 0,
  });
  const anchorRef = useRef<View>(null);

  const selectedOption = options.find(opt => opt.value === value);

  // 드롭다운 위치 계산
  const handleOpen = () => {
    if (!disabled && anchorRef.current) {
      anchorRef.current.measure((fx, fy, w, h, px, py) => {
        setDropdownLayout({ x: px, y: py + h, width: w });
        setIsOpen(true);
      });
    }
  };

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <View style={[styles.container, fullWidth && styles.fullWidth]}>
      {label && (
        <AMText style={styles.label} fontWeight={600}>
          {label}
        </AMText>
      )}

      {/* 선택 버튼 (Anchor) */}
      <View ref={anchorRef} collapsable={false}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleOpen}
          disabled={disabled}
          style={[
            styles.selector,
            disabled && styles.disabledSelector,
            error ? styles.errorSelector : isOpen && styles.activeSelector,
          ]}
        >
          <View style={styles.selectorContent}>
            {selectedOption?.icon && (
              <View style={styles.iconPrefix}>{selectedOption.icon}</View>
            )}
            <AMText
              style={[
                styles.selectedLabel,
                !selectedOption && styles.placeholderText,
              ]}
              numberOfLines={1}
            >
              {selectedOption?.label || placeholder || t('common.select')}
            </AMText>
          </View>
          <MotiView
            animate={{ rotate: isOpen ? '180deg' : '0deg' }}
            transition={{ type: 'timing', duration: 200 }}
          >
            <ChevronDown size={20} color={disabled ? '#D1D5DB' : '#9CA3AF'} />
          </MotiView>
        </TouchableOpacity>
      </View>

      {/* 드롭다운 목록 (Modal) */}
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
            from={{ opacity: 0, translateY: -10 }}
            animate={{ opacity: 1, translateY: 0 }}
            style={[
              styles.dropdownMenu,
              {
                top: dropdownLayout.y + 4,
                left: dropdownLayout.x,
                width: dropdownLayout.width,
              },
            ]}
          >
            <ScrollView bounces={false} style={{ maxHeight: 250 }}>
              {options.map(option => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.optionItem,
                    option.value === value && styles.selectedOptionItem,
                  ]}
                  disabled={option.disabled}
                  onPress={() => handleSelect(option.value)}
                >
                  {option.icon && (
                    <View style={styles.iconPrefix}>{option.icon}</View>
                  )}
                  <AMText
                    style={[
                      styles.optionLabel,
                      option.disabled && styles.disabledText,
                    ]}
                  >
                    {option.label}
                  </AMText>
                  {option.value === value && (
                    <Check size={18} color="#4A90E2" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </MotiView>
        </TouchableOpacity>
      </Modal>

      {error && <AMText style={styles.errorText}>{error}</AMText>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignSelf: 'flex-start' },
  fullWidth: { width: '100%', alignSelf: 'stretch' },
  label: { fontSize: 14, color: '#374151', marginBottom: 8 },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minWidth: 200,
  },
  activeSelector: { borderColor: '#4A90E2' },
  errorSelector: { borderColor: '#FCA5A5' },
  disabledSelector: { backgroundColor: '#F9FAFB', opacity: 0.6 },
  selectorContent: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  iconPrefix: { marginRight: 10 },
  selectedLabel: { fontSize: 16, color: '#111827' },
  placeholderText: { color: '#9CA3AF' },
  modalOverlay: { flex: 1, backgroundColor: 'transparent' },
  dropdownMenu: {
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F9FAFB',
  },
  selectedOptionItem: { backgroundColor: 'rgba(74, 144, 226, 0.05)' },
  optionLabel: { flex: 1, fontSize: 15, color: '#1F2937' },
  disabledText: { color: '#D1D5DB' },
  errorText: { fontSize: 12, color: '#EF4444', marginTop: 6 },
});
export default Dropdown;
