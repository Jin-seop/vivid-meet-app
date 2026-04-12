// src/types/react-native-config.d.ts

declare module 'react-native-config' {
  export interface NativeConfig {
    ENV: 'development' | 'production';
    API_URL: string;
    APP_NAME: string;
    APP_ID: string;
  }

  export const Config: NativeConfig;
  export default Config;
}
