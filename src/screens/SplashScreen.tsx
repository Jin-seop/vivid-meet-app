import React, { useEffect } from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import LinearGradient from 'react-native-linear-gradient';
import { MotiView, MotiText } from 'moti';
import { Sparkles } from 'lucide-react-native';
import BootSplash from 'react-native-bootsplash';
import { getPretendardFont } from '../utils/fonts';
import {
  RootStackParamList,
  RootStackScreenName,
} from './navigation/RootStack';
import { useAuth } from '../context/AuthContext';

type SplashScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  RootStackScreenName.Splash
>;

interface Props {
  navigation: SplashScreenNavigationProp;
}

export function SplashScreen({ navigation }: Props) {
  const { isLoggedIn, isLoading } = useAuth();

  useEffect(() => {
    BootSplash.hide({ fade: true });

    // 자동 로그인 확인이 끝날 때까지 대기
    if (isLoading) return;

    // 최소 노출 시간(2.5초)을 보장하기 위해 timer 설정 가능하지만,
    // 여기서는 로딩이 끝나면 바로 이동하도록 처리 (혹은 필요시 타이머 유지)
    const timer = setTimeout(() => {
      if (isLoggedIn) {
        navigation.replace(RootStackScreenName.HomeMain);
      } else {
        navigation.replace(RootStackScreenName.Login);
      }
    }, 1500); // 로딩 시간을 고려하여 약간 단축

    return () => clearTimeout(timer);
  }, [isLoggedIn, isLoading, navigation]);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      <LinearGradient
        // 웹 코드의 그라데이션 색상 반영
        colors={['#4A90E2', '#5FA3E8', '#50E3C2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <MotiView
          from={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'timing', duration: 600 }}
          style={styles.content}
        >
          {/* 로고 회전 애니메이션 */}
          <MotiView
            from={{ rotate: '0deg' }}
            animate={{ rotate: '360deg' }}
            transition={{
              type: 'timing',
              duration: 2000,
              loop: true,
              repeatReverse: false,
            }}
            style={styles.iconWrapper}
          >
            <Sparkles size={80} color="white" />
          </MotiView>

          {/* 타이틀 페이드인 및 이동 */}
          <MotiText
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', delay: 300 }}
            style={styles.title}
          >
            AimoChat
          </MotiText>

          {/* 슬로건 */}
          <MotiText
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', delay: 500 }}
            style={styles.subtitle}
          >
            기다림 없는 AI 반전 채팅
          </MotiText>

          {/* 하단 로딩 도트 애니메이션 */}
          <View style={styles.dotContainer}>
            {[0, 1, 2].map(i => (
              <MotiView
                key={i}
                from={{ scale: 1 }}
                animate={{ scale: 1.3 }}
                transition={{
                  type: 'timing',
                  duration: 1000,
                  loop: true,
                  delay: i * 200,
                }}
                style={styles.dot}
              />
            ))}
          </View>
        </MotiView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  iconWrapper: {
    marginBottom: 24,
  },
  title: {
    fontSize: 48,
    fontFamily: getPretendardFont(700),
    color: 'white',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 40,
    fontFamily: getPretendardFont(400),
  },
  dotContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 10,
    height: 10,
    backgroundColor: 'white',
    borderRadius: 5,
  },
});
