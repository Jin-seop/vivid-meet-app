import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import { ChevronDown, Check, X } from 'lucide-react-native';
import { MotiView } from 'moti';
import AMText from './AMText';

export interface MultiSelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface MultiSelectDropdownProps {
  options: MultiSelectOption[];
  values?: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  error?: string;
  fullWidth?: boolean;
  maxDisplay?: number;
}

const MultiSelectDropdown = ({
  options,
  values = [],
  onChange,
  placeholder = '선택하세요',
  label,
  disabled = false,
  error,
  fullWidth = false,
  maxDisplay = 2,
}: MultiSelectDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownLayout, setDropdownLayout] = useState({
    x: 0,
    y: 0,
    width: 0,
  });
  const anchorRef = useRef<View>(null);

  const selectedOptions = options.filter(opt => values.includes(opt.value));

  const handleOpen = () => {
    if (!disabled && anchorRef.current) {
      anchorRef.current.measure((fx, fy, w, h, px, py) => {
        setDropdownLayout({ x: px, y: py + h, width: w });
        setIsOpen(true);
      });
    }
  };

  const handleToggle = (optionValue: string) => {
    if (values.includes(optionValue)) {
      onChange(values.filter(v => v !== optionValue));
    } else {
      onChange([...values, optionValue]);
    }
  };

  const handleRemove = (optionValue: string) => {
    onChange(values.filter(v => v !== optionValue));
  };

  const renderSelectedItems = () => {
    if (selectedOptions.length === 0) {
      return <AMText style={styles.placeholderText}>{placeholder}</AMText>;
    }

    const displayOptions = selectedOptions.slice(0, maxDisplay);
    const remaining = selectedOptions.length - maxDisplay;

    return (
      <View style={styles.badgeContainer}>
        {displayOptions.map(opt => (
          <MotiView
            key={opt.value}
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={styles.badge}
          >
            <AMText style={styles.badgeText} fontWeight={500}>
              {opt.label}
            </AMText>
            <TouchableOpacity
              onPress={() => handleRemove(opt.value)}
              style={styles.removeIcon}
            >
              <X size={12} color="#4A90E2" />
            </TouchableOpacity>
          </MotiView>
        ))}
        {remaining > 0 && (
          <View style={styles.remainingBadge}>
            <AMText style={styles.remainingText} fontWeight={500}>
              +{remaining}
            </AMText>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={[styles.container, fullWidth && styles.fullWidth]}>
      {label && (
        <AMText style={styles.label} fontWeight={600}>
          {label}
        </AMText>
      )}

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
          <View style={styles.selectorContent}>{renderSelectedItems()}</View>
          <ChevronDown
            size={20}
            color={disabled ? '#D1D5DB' : '#9CA3AF'}
            style={{ transform: [{ rotate: isOpen ? '180deg' : '0deg' }] }}
          />
        </TouchableOpacity>
      </View>

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
              {options.map(option => {
                const isSelected = values.includes(option.value);
                return (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.optionItem,
                      isSelected && styles.selectedOptionItem,
                    ]}
                    disabled={option.disabled}
                    onPress={() => handleToggle(option.value)}
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
                    <View
                      style={[
                        styles.checkbox,
                        isSelected && styles.checkboxActive,
                      ]}
                    >
                      {isSelected && <Check size={12} color="white" />}
                    </View>
                  </TouchableOpacity>
                );
              })}
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
    paddingHorizontal: 12,
    paddingVertical: 10,
    minHeight: 52,
  },
  activeSelector: { borderColor: '#4A90E2' },
  errorSelector: { borderColor: '#FCA5A5' },
  disabledSelector: { backgroundColor: '#F9FAFB', opacity: 0.6 },
  selectorContent: { flex: 1 },
  placeholderText: { color: '#9CA3AF', fontSize: 16 },
  badgeContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  badgeText: { fontSize: 13, color: '#4A90E2' },
  removeIcon: { padding: 2 },
  remainingBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  remainingText: { fontSize: 13, color: '#6B7280' },
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
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: { backgroundColor: '#4A90E2', borderColor: '#4A90E2' },
  iconPrefix: { marginRight: 10 },
  disabledText: { color: '#D1D5DB' },
  errorText: { fontSize: 12, color: '#EF4444', marginTop: 6 },
});
export default MultiSelectDropdown;
