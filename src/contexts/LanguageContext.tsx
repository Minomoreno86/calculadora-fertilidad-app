import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Language = 'es' | 'en';

interface LanguageContextType {
  currentLanguage: Language;
  changeLanguage: (language: Language) => Promise<void>;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t, i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState<Language>('es');

  useEffect(() => {
    const loadSavedLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('userLanguage');
        if (savedLanguage && (savedLanguage === 'es' || savedLanguage === 'en')) {
          setCurrentLanguage(savedLanguage as Language);
          await i18n.changeLanguage(savedLanguage);
        }
      } catch (error) {
        console.log('Error loading saved language:', error);
      }
    };

    loadSavedLanguage();
  }, [i18n]);

  const changeLanguage = async (language: Language) => {
    try {
      await AsyncStorage.setItem('userLanguage', language);
      await i18n.changeLanguage(language);
      setCurrentLanguage(language);
      console.log(`🌍 Idioma cambiado a: ${language}`);
    } catch (error) {
      console.log('Error changing language:', error);
    }
  };

  const value: LanguageContextType = {
    currentLanguage,
    changeLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};