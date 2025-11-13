import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import fr from './locales/fr';
import es from './locales/es';
import en from './locales/en';

const resources = {
  en: {
    translation: en,
  },
  fr: {
    translation: fr,
  },
  es: {
    translation: es,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'fr', // default language
    fallbackLng: 'fr',
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });

export default i18n;