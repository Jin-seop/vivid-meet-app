import React, { useEffect } from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import LinearGradient from 'react-native-linear-gradient';
import { MotiView, MotiText } from 'moti';
import { Sparkles } from 'lucide-react-native';
import BootSplash from 'react-native-bootsplash';
import { getPretendardFont } from '../utils/fonts';
import { RootStackScreenName } from './navigation/RootStack';

// 내비게이션 타입 정의
type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
};

type SplashScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  RootStackScreenName.Splash
>;

interface Props {
  navigation: SplashScreenNavigationProp;
}

export function SplashScreen({ navigation }: Props) {
  useEffect(() => {
    BootSplash.hide({ fade: true });
    // 웹 코드와 동일하게 2.5초 후 로그인 화면으로 이동
    const timer = setTimeout(() => {
      navigation.replace(RootStackScreenName.Login);
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigation]);

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
            VividMeet
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
