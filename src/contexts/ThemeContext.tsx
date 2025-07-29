import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';

export type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  themeMode: ThemeMode;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@fertility_calculator_theme';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [themeMode, setThemeMode] = React.useState<ThemeMode>('light');
  const [isLoading, setIsLoading] = React.useState(true);

  // 🔄 Cargar tema guardado al iniciar
  React.useEffect(() => {
    loadStoredTheme();
  }, []);

  // 💾 Cargar tema desde AsyncStorage
  const loadStoredTheme = async () => {
    try {
      const storedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (storedTheme && (storedTheme === 'light' || storedTheme === 'dark')) {
        setThemeMode(storedTheme as ThemeMode);
      }
    } catch (error) {
      console.error('🚨 Error cargando tema:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 💾 Guardar tema en AsyncStorage
  const saveTheme = async (mode: ThemeMode) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch (error) {
      console.error('🚨 Error guardando tema:', error);
    }
  };

  // 🔄 Alternar entre light y dark
  const toggleTheme = React.useCallback(() => {
    const newMode: ThemeMode = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(newMode);
    saveTheme(newMode);
  }, [themeMode]);

  // 🎨 Establecer tema específico
  const setTheme = React.useCallback((mode: ThemeMode) => {
    setThemeMode(mode);
    saveTheme(mode);
  }, []);

  // 🎯 Valor del contexto memoizado para evitar re-renders
  const contextValue: ThemeContextType = React.useMemo(() => ({
    themeMode,
    isDark: themeMode === 'dark',
    toggleTheme,
    setTheme,
  }), [themeMode, toggleTheme, setTheme]);

  // 🔄 No renderizar hasta cargar el tema
  if (isLoading) {
    return null;
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      {/* 📱 StatusBar dinámico según el tema */}
      <StatusBar style={themeMode === 'dark' ? 'light' : 'dark'} />
      {children}
    </ThemeContext.Provider>
  );
};

// 🪝 Hook personalizado para usar el tema
export const useTheme = (): ThemeContextType => {
  const context = React.useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme debe ser usado dentro de un ThemeProvider');
  }
  return context;
};
