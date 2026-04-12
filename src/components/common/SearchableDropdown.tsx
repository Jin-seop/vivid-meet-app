import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
} from 'react-native';
import { Search, X, Check, ChevronDown } from 'lucide-react-native';
import { MotiView } from 'moti';
import VIText from '../common/VIText';

export interface SearchableOption {
  value: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface SearchableDropdownProps {
  options: SearchableOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  label?: string;
  disabled?: boolean;
  error?: string;
  fullWidth?: boolean;
  noResultsText?: string;
}

const SearchableDropdown = ({
  options,
  value,
  onChange,
  placeholder = '선택하세요',
  searchPlaceholder = '검색...',
  label,
  disabled = false,
  error,
  fullWidth = false,
  noResultsText = '검색 결과가 없습니다',
}: SearchableDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownLayout, setDropdownLayout] = useState({
    x: 0,
    y: 0,
    width: 0,
  });
  const anchorRef = useRef<View>(null);

  const selectedOption = options.find(opt => opt.value === value);

  const filteredOptions = options.filter(option => {
    const query = searchQuery.toLowerCase();
    return (
      option.label.toLowerCase().includes(query) ||
      option.description?.toLowerCase().includes(query)
    );
  });

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
    setSearchQuery('');
  };

  return (
    <View style={[styles.container, fullWidth && styles.fullWidth]}>
      {label && (
        <VIText style={styles.label} fontWeight={600}>
          {label}
        </VIText>
      )}

      {/* 선택 버튼 (앵커) */}
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
            <View style={styles.textContainer}>
              <VIText
                style={[
                  styles.selectedLabel,
                  !selectedOption && styles.placeholderText,
                ]}
                numberOfLines={1}
              >
                {selectedOption?.label || placeholder}
              </VIText>
              {selectedOption?.description && (
                <VIText style={styles.descriptionText} numberOfLines={1}>
                  {selectedOption.description}
                </VIText>
              )}
            </View>
          </View>
          <ChevronDown size={20} color={disabled ? '#D1D5DB' : '#9CA3AF'} />
        </TouchableOpacity>
      </View>

      {/* 모달 기반 드롭다운 목록 */}
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
            {/* 검색 입력창 */}
            <View style={styles.searchHeader}>
              <Search size={18} color="#9CA3AF" style={styles.searchIcon} />
              <TextInput
                autoFocus
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder={searchPlaceholder}
                style={styles.searchInput}
                placeholderTextColor="#9CA3AF"
              />
              {searchQuery !== '' && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <X size={18} color="#9CA3AF" />
                </TouchableOpacity>
              )}
            </View>

            {/* 옵션 목록 */}
            <ScrollView
              style={styles.optionsList}
              bounces={false}
              keyboardShouldPersistTaps="handled"
            >
              {filteredOptions.length > 0 ? (
                filteredOptions.map(option => (
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
                    <View style={styles.textContainer}>
                      <VIText
                        style={[
                          styles.optionLabel,
                          option.disabled && styles.disabledText,
                        ]}
                      >
                        {option.label}
                      </VIText>
                      {option.description && (
                        <VIText style={styles.descriptionText}>
                          {option.description}
                        </VIText>
                      )}
                    </View>
                    {option.value === value && (
                      <Check size={18} color="#4A90E2" />
                    )}
                  </TouchableOpacity>
                ))
              ) : (
                <View style={styles.noResults}>
                  <VIText style={styles.noResultsText}>{noResultsText}</VIText>
                </View>
              )}
            </ScrollView>
          </MotiView>
        </TouchableOpacity>
      </Modal>

      {error && <VIText style={styles.errorText}>{error}</VIText>}
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
  textContainer: { flex: 1 },
  selectedLabel: { fontSize: 16, color: '#111827' },
  placeholderText: { color: '#9CA3AF' },
  descriptionText: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  iconPrefix: { marginRight: 10 },
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
    maxHeight: 300,
    overflow: 'hidden',
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  searchIcon: { marginRight: 8 },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 14,
    color: '#111827',
    padding: 0,
  },
  optionsList: { flex: 1 },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  selectedOptionItem: { backgroundColor: 'rgba(74, 144, 226, 0.05)' },
  optionLabel: { fontSize: 15, color: '#1F2937' },
  disabledText: { color: '#D1D5DB' },
  noResults: { paddingVertical: 32, alignItems: 'center' },
  noResultsText: { fontSize: 14, color: '#9CA3AF' },
  errorText: { fontSize: 12, color: '#EF4444', marginTop: 6 },
});

export default SearchableDropdown;
