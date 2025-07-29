import { useTheme } from '../contexts/ThemeContext';
import { TextStyle } from 'react-native';

// 🎨 PALETA COMPLETA FERTILIDAD PROFESIONAL
const PALETTE = {
  light: {
    primary: '#D96B84',      // Rosa coral profundo – confiable, cálido, profesional
    secondary: '#F2C9D1',    // Rosa lavanda/nude – complementario, elegante
    background: '#FFF7F9',   // Blanco rosado suave
    surface: '#FFFFFF',      // Tarjetas, formularios blancos puros
    textPrimary: '#2E2E2E',  // Negro suave para máxima legibilidad
    textSecondary: '#7A7A7A', // Subtítulos, notas en gris medio
    error: '#C62828',        // Alerta clara y profesional
    success: '#388E3C',      // Verde para resultados positivos
    warning: '#F57C00',      // Naranja para advertencias
    info: '#1976D2',         // Azul para información
    neutralGray: '#E0E0E0',  // Líneas, bordes, elementos desactivados
  },
  
  dark: {
    primary: '#F48FB1',      // Rosa coral claro para contraste nocturno
    secondary: '#CE93D8',    // Rosa lavanda más intenso para oscuro
    background: '#121212',   // Negro puro
    surface: '#1E1E1E',     // Superficies elevadas oscuras
    textPrimary: '#FAFAFA',  // Blanco suave
    textSecondary: '#BDBDBD', // Gris claro para texto secundario
    error: '#EF9A9A',       // Error suave en modo oscuro
    success: '#81C784',     // Verde claro para éxito
    warning: '#FFB74D',     // Naranja claro para advertencias
    info: '#64B5F6',        // Azul claro para información
    neutralGray: '#3A3A3A', // Gris oscuro para elementos neutros
  },
  
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

// 🪝 Hook para obtener tema dinámico basado en contexto
export const useDynamicTheme = () => {
  const { themeMode, isDark, toggleTheme, setTheme } = useTheme();
  
  // 🎨 Seleccionar paleta según modo actual
  const currentPalette = isDark ? PALETTE.dark : PALETTE.light;
  
  // 🌈 Tema dinámico completo
  const dynamicTheme = {
    colors: {
      // 🌸 COLORES PRINCIPALES DINÁMICOS
      primary: currentPalette.primary,
      secondary: currentPalette.secondary,
      background: currentPalette.background,
      surface: currentPalette.surface,
      
      // 📝 TEXTOS DINÁMICOS
      text: currentPalette.textPrimary,
      textSecondary: currentPalette.textSecondary,
      textTertiary: '#9E9E9E',
      placeholder: isDark ? '#757575' : '#BDBDBD',
      
      // 🎯 ESTADOS DE FERTILIDAD DINÁMICOS
      error: currentPalette.error,
      success: currentPalette.success,
      warning: currentPalette.warning,
      info: currentPalette.info,
      
      // 🔲 BORDES Y LÍNEAS DINÁMICAS
      border: currentPalette.neutralGray,
      borderLight: isDark ? '#2A2A2A' : '#F5F5F5',
      divider: currentPalette.neutralGray,
      
      // 🔘 BOTONES DINÁMICOS
      buttonPrimary: currentPalette.primary,
      buttonSecondary: currentPalette.surface,
      buttonText: isDark ? currentPalette.textPrimary : PALETTE.white,
      buttonTextSecondary: currentPalette.textPrimary,
      
      // 📱 INPUTS DINÁMICOS
      inputBackground: currentPalette.surface,
      inputBorder: currentPalette.neutralGray,
      inputFocus: currentPalette.primary,
      inputError: currentPalette.error,
      
      // 🌸 COLORES ESPECÍFICOS DE FERTILIDAD DINÁMICOS
      fertility: {
        high: currentPalette.success,
        medium: currentPalette.warning,
        low: currentPalette.error,
        optimal: isDark ? '#81C784' : '#4CAF50',
        coral: currentPalette.primary,
        nude: currentPalette.secondary,
      },
      
      // 🌈 ACCESO A PALETAS COMPLETAS
      lightMode: PALETTE.light,
      darkMode: PALETTE.dark,
      white: PALETTE.white,
      black: PALETTE.black,
    },
    
    spacing: {
      xxxs: 2,
      xxs: 4,
      xs: 8,
      s: 12,
      m: 16,
      l: 24,
      xl: 32,
      xxl: 48,
      xxxl: 64,
      component: 16,
      section: 24,
      screen: 20,
      card: 20,
      input: 16,
      button: 12,
      field: 16,
      group: 24,
      modal: 24,
      touchable: 44,
    },
    
    typography: {
      h1: {
        fontSize: 30,
        fontWeight: '700' as const as TextStyle['fontWeight'],
        lineHeight: 36,
        letterSpacing: -0.5,
        color: currentPalette.primary,
      },
      h2: {
        fontSize: 24,
        fontWeight: '600' as const as TextStyle['fontWeight'],
        lineHeight: 30,
        letterSpacing: -0.3,
        color: currentPalette.textPrimary,
      },
      h3: {
        fontSize: 20,
        fontWeight: '600' as TextStyle['fontWeight'],
        lineHeight: 26,
        letterSpacing: -0.2,
        color: currentPalette.textPrimary,
      },
      h4: {
        fontSize: 18,
        fontWeight: '500' as TextStyle['fontWeight'],
        lineHeight: 24,
        color: currentPalette.textPrimary,
      },
      bodyLarge: {
        fontSize: 16,
        fontWeight: '400' as TextStyle['fontWeight'],
        lineHeight: 24,
        color: currentPalette.textPrimary,
      },
      body: {
        fontSize: 14,
        fontWeight: '400' as TextStyle['fontWeight'],
        lineHeight: 20,
        color: currentPalette.textPrimary,
      },
      caption: {
        fontSize: 12,
        fontWeight: '400' as TextStyle['fontWeight'],
        lineHeight: 16,
        color: currentPalette.textSecondary,
      },
      overline: {
        fontSize: 10,
        fontWeight: '500' as TextStyle['fontWeight'],
        lineHeight: 14,
        letterSpacing: 1.5,
        textTransform: 'uppercase' as TextStyle['textTransform'],
        color: currentPalette.textSecondary,
      },
      button: {
        fontSize: 16,
        fontWeight: '600' as TextStyle['fontWeight'],
        lineHeight: 20,
        textTransform: 'none' as TextStyle['textTransform'],
      },
    },
    
    components: {
      card: {
        default: {
          backgroundColor: currentPalette.surface,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: isDark ? '#2A2A2A' : '#F0F0F0',
          shadowColor: isDark ? PALETTE.black : '#000000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isDark ? 0.3 : 0.1,
          shadowRadius: 4,
          elevation: 3,
        },
        elevated: {
          backgroundColor: currentPalette.surface,
          borderRadius: 16,
          shadowColor: isDark ? PALETTE.black : '#000000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: isDark ? 0.4 : 0.15,
          shadowRadius: 8,
          elevation: 6,
        },
      },
      button: {
        primary: {
          backgroundColor: currentPalette.primary,
          borderRadius: 8,
        },
        secondary: {
          backgroundColor: 'transparent',
          borderRadius: 8,
          borderWidth: 1,
          borderColor: currentPalette.primary,
        },
      },
    },
    
    // 🎭 PROPIEDADES DEL TEMA
    mode: themeMode,
    isDark,
    toggleTheme,
    setTheme,
  };
  
  return dynamicTheme;
};
