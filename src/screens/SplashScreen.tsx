import { View, Text, ActivityIndicator } from 'react-native';

const SplashScreen = () => (
  <View
    style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#ffffff',
    }}
  >
    <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
      VividMeet
    </Text>
    <ActivityIndicator size="large" color="#FF3B30" />
  </View>
);

export default SplashScreen;
