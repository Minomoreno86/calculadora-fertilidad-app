import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Importar traducciones
import enTranslation from './locales/en/translation.json';
import esTranslation from './locales/es/translation.json';

const resources = {
  en: {
    translation: enTranslation
  },
  es: {
    translation: esTranslation
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'es', // idioma por defecto
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false
    }
  });

// Detectar idioma del dispositivo
const detectLanguage = async () => {
  try {
    const savedLanguage = await AsyncStorage.getItem('userLanguage');
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage);
    }
  } catch (error) {
    console.log('Error detecting language:', error);
  }
};

detectLanguage();

export default i18n; 