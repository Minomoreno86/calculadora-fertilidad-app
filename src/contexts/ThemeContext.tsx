import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';

export type ThemeMode = 'light' | 'dark' | 'auto';

interface ThemeContextType {
  themeMode: ThemeMode;
  isDark: boolean;
  effectiveTheme: 'light' | 'dark';
  systemTheme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@fertility_calculator_theme';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [themeMode, setThemeMode] = React.useState<ThemeMode>('auto');
  const [systemTheme, setSystemTheme] = React.useState<'light' | 'dark'>('light');
  const [isLoading, setIsLoading] = React.useState(true);

  // 🔄 Detectar tema del sistema (implementación básica)
  React.useEffect(() => {
    // Por ahora, detectamos basado en la hora para simular el comportamiento
    const detectSystemTheme = () => {
      const hour = new Date().getHours();
      // Modo oscuro entre 18:00 y 6:00
      const isDarkTime = hour >= 18 || hour < 6;
      const detectedTheme = isDarkTime ? 'dark' : 'light';
      setSystemTheme(detectedTheme);
      console.log('🎨 Tema del sistema detectado:', detectedTheme, `(hora: ${hour})`);
    };

    detectSystemTheme();
    
    // Actualizar cada hora
    const interval = setInterval(detectSystemTheme, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // 🔄 Cargar tema guardado al iniciar
  React.useEffect(() => {
    loadStoredTheme();
  }, []);

  // 💾 Cargar tema desde AsyncStorage
  const loadStoredTheme = async () => {
    try {
      const storedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (storedTheme && (storedTheme === 'light' || storedTheme === 'dark' || storedTheme === 'auto')) {
        setThemeMode(storedTheme as ThemeMode);
        console.log('🎨 Tema cargado:', storedTheme);
      } else {
        // Si no hay tema guardado, usar 'auto' por defecto
        setThemeMode('auto');
        console.log('🎨 Usando tema automático por defecto');
      }
    } catch (error) {
      console.error('🚨 Error cargando tema:', error);
      setThemeMode('auto'); // Fallback a auto en caso de error
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

  // 🧮 Calcular tema efectivo
  const effectiveTheme: 'light' | 'dark' = React.useMemo(() => {
    if (themeMode === 'auto') {
      return systemTheme;
    }
    return themeMode as 'light' | 'dark';
  }, [themeMode, systemTheme]);

  // 🔄 Alternar entre light, dark y auto
  const toggleTheme = React.useCallback(() => {
    let newMode: ThemeMode;
    switch (themeMode) {
      case 'light':
        newMode = 'dark';
        break;
      case 'dark':
        newMode = 'auto';
        break;
      case 'auto':
      default:
        newMode = 'light';
        break;
    }
    setThemeMode(newMode);
    saveTheme(newMode);
    console.log('🎨 Tema cambiado a:', newMode);
  }, [themeMode]);

  // 🎨 Establecer tema específico
  const setTheme = React.useCallback((mode: ThemeMode) => {
    setThemeMode(mode);
    saveTheme(mode);
    console.log('🎨 Tema establecido a:', mode);
  }, []);

  // 🎯 Valor del contexto memoizado para evitar re-renders
  const contextValue: ThemeContextType = React.useMemo(() => ({
    themeMode,
    isDark: effectiveTheme === 'dark',
    effectiveTheme,
    systemTheme,
    toggleTheme,
    setTheme,
  }), [themeMode, effectiveTheme, systemTheme, toggleTheme, setTheme]);

  // 🔄 No renderizar hasta cargar el tema
  if (isLoading) {
    return null;
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      {/* 📱 StatusBar dinámico según el tema efectivo */}
      <StatusBar style={effectiveTheme === 'dark' ? 'light' : 'dark'} />
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
