import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ko from './ko.json';
import ja from './ja.json';
import * as RNLocalize from 'react-native-localize';

const locales = RNLocalize.getLocales();

i18n.use(initReactI18next).init({
  resources: {
    ko: { translation: ko },
    ja: { translation: ja },
  },
  lng: locales[0].languageCode,
  fallbackLng: 'ko',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
