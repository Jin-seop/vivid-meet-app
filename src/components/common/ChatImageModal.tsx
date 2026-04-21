import React from 'react';
import {
  Modal,
  StyleSheet,
  View,
  Image,
  Dimensions,
  Platform,
  StatusBar,
} from 'react-native';
import { X, Download, Share2 } from 'lucide-react-native';
import AMTouchableOpacity from './AMTouchableOpacity';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

interface ChatImageModalProps {
  isVisible: boolean;
  imageUrl: string | null;
  onClose: () => void;
}

const ChatImageModal = ({ isVisible, imageUrl, onClose }: ChatImageModalProps) => {
  if (!imageUrl) return null;

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <StatusBar barStyle="light-content" backgroundColor="black" />
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          {/* Header */}
          <View style={styles.header}>
            <AMTouchableOpacity onPress={onClose} style={styles.iconButton}>
              <X size={28} color="white" />
            </AMTouchableOpacity>
            
            <View style={styles.rightIcons}>
              <AMTouchableOpacity style={styles.iconButton}>
                <Download size={24} color="white" />
              </AMTouchableOpacity>
              <AMTouchableOpacity style={styles.iconButton}>
                <Share2 size={24} color="white" />
              </AMTouchableOpacity>
            </View>
          </View>

          {/* Image Content */}
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: imageUrl }}
              style={styles.fullImage}
              resizeMode="contain"
            />
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    zIndex: 10,
  },
  rightIcons: {
    flexDirection: 'row',
    gap: 16,
  },
  iconButton: {
    padding: 8,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: width,
    height: height * 0.8,
  },
});

export default ChatImageModal;
