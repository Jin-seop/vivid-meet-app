import React from 'react';
import { StyleSheet, View, Image, StatusBar } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import LinearGradient from 'react-native-linear-gradient';
import { MotiView } from 'moti';
import { Sparkles } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AMText from '../components/common/AMText';
import {
  RootStackParamList,
  RootStackScreenName,
} from './navigation/RootStack';
import AMTouchableOpacity from '../components/common/AMTouchableOpacity';

type LoginScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Login'>;
};

const LoginScreen = ({ navigation }: LoginScreenProps) => {
  const onSocialLoginPress = (provider: string) => {
    console.log(`Login with ${provider}`);
    // TODO: 실제 소셜 로그인 로직 구현 후 이메일 전달
    // setTimeout(() => navigation.replace('HomeMain'), 500);
    setTimeout(
      () =>
        navigation.navigate(RootStackScreenName.SignUp, {
          email: 'test@example.com',
          provider: 'GooGle',
          providerId: '123',
        }),
      500,
    );
  };

  // useEffect(() => {}, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient
        colors={['rgba(74, 144, 226, 0.1)', 'rgba(80, 227, 194, 0.1)']}
        style={styles.background}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.content}>
            {/* 로고 섹션 */}
            <MotiView
              from={{ opacity: 0, translateY: -20 }}
              animate={{ opacity: 1, translateY: 0 }}
              style={styles.header}
            >
              <View style={styles.logoRow}>
                <Sparkles size={40} color="#4A90E2" />
                <AMText style={styles.logoText} fontWeight={700}>
                  AimoChat
                </AMText>
              </View>
              <AMText style={styles.description}>
                기다림 없는 AI 반전 채팅,{'\n'}지금 바로 연결
              </AMText>
            </MotiView>

            {/* 히어로 이미지 */}
            <MotiView
              from={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 200 }}
              style={styles.imageContainer}
            >
              <Image
                source={{
                  uri: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800',
                }}
                style={styles.heroImage}
                resizeMode="cover"
              />
            </MotiView>

            {/* 로그인 버튼 섹션 */}
            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ delay: 400 }}
              style={styles.buttonSection}
            >
              {/* Google 로그인 */}
              <AMTouchableOpacity
                style={[styles.loginButton, styles.googleButton]}
                onPress={() => onSocialLoginPress('Google')}
              >
                <AMText style={styles.googleButtonText} fontWeight={600}>
                  Google로 시작하기
                </AMText>
              </AMTouchableOpacity>

              {/* Apple 로그인 */}
              <AMTouchableOpacity
                style={[styles.loginButton, styles.appleButton]}
                onPress={() => onSocialLoginPress('Apple')}
              >
                <AMText style={styles.appleButtonText} fontWeight={600}>
                  Apple로 시작하기
                </AMText>
              </AMTouchableOpacity>

              <AMTouchableOpacity
                style={[styles.loginButton, styles.LineButton]}
                onPress={() => onSocialLoginPress('Line')}
              >
                <AMText style={styles.LineButtonText} fontWeight={600}>
                  Line로 시작하기
                </AMText>
              </AMTouchableOpacity>
            </MotiView>

            {/* 하단 링크 */}
            <MotiView
              from={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 600 }}
              style={styles.footer}
            >
              <AMText style={styles.policyText}>
                로그인 시 AimoChat의 {'\n'}
                <AMText style={styles.underline}>이용약관</AMText> 및{' '}
                <AMText style={styles.underline}>개인정보 처리방침</AMText>에
                동의하게 됩니다.
              </AMText>
            </MotiView>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  background: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  logoText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  description: {
    fontSize: 16,
    color: '#717182',
    textAlign: 'center',
    lineHeight: 24,
  },
  imageContainer: {
    marginBottom: 32,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#eee',
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    // Elevation for Android
    elevation: 5,
  },
  heroImage: {
    width: '100%',
    height: 200,
  },
  buttonSection: {
    gap: 12,
    marginBottom: 24,
  },
  loginButton: {
    height: 56,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  googleButton: {
    backgroundColor: 'white',
    borderColor: '#E5E7EB',
  },
  googleButtonText: {
    color: '#374151',
    fontSize: 16,
  },
  appleButton: {
    backgroundColor: 'black',
    borderColor: 'black',
  },
  appleButtonText: {
    color: 'white',
    fontSize: 16,
  },
  LineButton: {
    backgroundColor: '#06C755',
    borderColor: '#06C755',
  },
  LineButtonText: {
    color: 'white',
    fontSize: 16,
  },
  footer: {
    alignItems: 'center',
  },
  signUpText: {
    fontSize: 14,
    color: '#717182',
    marginBottom: 24,
  },
  link: {
    color: '#4A90E2',
    fontWeight: 'bold',
  },
  policyText: {
    fontSize: 12,
    color: '#717182',
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 18,
  },
  underline: {
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
