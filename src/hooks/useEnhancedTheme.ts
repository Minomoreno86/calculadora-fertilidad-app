import { useMemo } from 'react';
import { useFeatureConfig } from './useAdvancedConfig';
import { useDynamicTheme } from './useDynamicTheme';

// 🎨 PALETA DE COLORES EXTENDIDA
const ACCENT_COLORS = {
  coral: {
    primary: '#FF6B6B',
    secondary: '#FF8E8E',
    light: '#FFB3B3',
    dark: '#E55555',
  },
  lavender: {
    primary: '#8B5FBF',
    secondary: '#A47FD9',
    light: '#C2A3E8',
    dark: '#7248A6',
  },
  mint: {
    primary: '#4ECDC4',
    secondary: '#6FDDD6',
    light: '#9EEAE5',
    dark: '#3BB7B0',
  },
  sunset: {
    primary: '#FF8A65',
    secondary: '#FFA382',
    light: '#FFBFA0',
    dark: '#E67348',
  },
};

// 🎯 CONFIGURACIONES DE FUENTE
const FONT_CONFIGS = {
  small: {
    h1: 26,
    h2: 22,
    h3: 18,
    body: 14,
    bodyLarge: 16,
    bodySmall: 12,
    caption: 10,
  },
  medium: {
    h1: 32,
    h2: 28,
    h3: 24,
    body: 16,
    bodyLarge: 18,
    bodySmall: 14,
    caption: 12,
  },
  large: {
    h1: 38,
    h2: 34,
    h3: 28,
    body: 18,
    bodyLarge: 20,
    bodySmall: 16,
    caption: 14,
  },
  xlarge: {
    h1: 44,
    h2: 40,
    h3: 32,
    body: 20,
    bodyLarge: 22,
    bodySmall: 18,
    caption: 16,
  },
};

// 🎯 CONFIGURACIONES DE ANIMACIÓN
const ANIMATION_CONFIGS = {
  enabled: {
    duration: 300,
    easing: 'ease-in-out',
    scale: 1.05,
    opacity: 0.8,
  },
  disabled: {
    duration: 0,
    easing: 'linear',
    scale: 1,
    opacity: 1,
  },
  reduced: {
    duration: 150,
    easing: 'linear',
    scale: 1.02,
    opacity: 0.9,
  },
};

// 🛠️ UTILIDADES PARA REDUCIR COMPLEJIDAD COGNITIVA

/**
 * Calcula el borderRadius según configuración
 */
const getBorderRadius = (enhancedProgress: boolean, variant: 'default' | 'elevated' = 'default'): number => {
  if (enhancedProgress) {
    return variant === 'elevated' ? 20 : 16;
  }
  return variant === 'elevated' ? 16 : 12;
};

/**
 * Calcula la opacidad de sombra según configuración
 */
const getShadowOpacity = (isDarkMode: boolean, animationsEnabled: boolean, baseOpacity = 0.1): number => {
  if (isDarkMode) return 0.3;
  return animationsEnabled ? 0.15 : baseOpacity;
};

/**
 * Obtiene el color de borde según configuración
 */
const getBorderColor = (
  isFocused: boolean, 
  smartHints: boolean, 
  accentColors: typeof ACCENT_COLORS.coral, 
  baseColors: { border: string }
): string => {
  if (isFocused) return accentColors.primary;
  return smartHints ? accentColors.light : baseColors.border;
};

/**
 * Genera configuración de componentes optimizada
 */
const generateComponentsConfig = (
  baseTheme: ReturnType<typeof useDynamicTheme>,
  accentColors: typeof ACCENT_COLORS.coral,
  enhancedProgress: boolean,
  animationsEnabled: boolean,
  smartHints: boolean,
  isDarkMode: boolean
) => ({
  ...baseTheme.components,
  
  card: {
    ...baseTheme.components.card,
    default: {
      ...baseTheme.components.card.default,
      borderRadius: getBorderRadius(enhancedProgress, 'default'),
      shadowOpacity: getShadowOpacity(isDarkMode, animationsEnabled, 0.1),
    },
    elevated: {
      ...baseTheme.components.card.elevated,
      borderRadius: getBorderRadius(enhancedProgress, 'elevated'),
      shadowOpacity: getShadowOpacity(isDarkMode, animationsEnabled, 0.15),
    },
  },

  button: {
    primary: {
      backgroundColor: accentColors.primary,
      borderRadius: enhancedProgress ? 24 : 20,
      paddingVertical: enhancedProgress ? 16 : 14,
      shadowOpacity: animationsEnabled ? 0.3 : 0.2,
    },
    secondary: {
      backgroundColor: accentColors.secondary,
      borderRadius: enhancedProgress ? 20 : 16,
      paddingVertical: enhancedProgress ? 14 : 12,
      shadowOpacity: animationsEnabled ? 0.2 : 0.15,
    },
  },

  input: {
    default: {
      borderRadius: enhancedProgress ? 12 : 8,
      borderWidth: enhancedProgress ? 2 : 1,
      borderColor: getBorderColor(false, smartHints, accentColors, baseTheme.colors),
      backgroundColor: baseTheme.colors.surface,
      paddingHorizontal: enhancedProgress ? 20 : 16,
      paddingVertical: enhancedProgress ? 16 : 14,
    },
    focused: {
      borderColor: accentColors.primary,
      shadowColor: accentColors.primary,
      shadowOpacity: animationsEnabled ? 0.3 : 0.1,
      shadowRadius: animationsEnabled ? 8 : 4,
    },
  },
});

/**
 * Hook que combina configuración avanzada con tema dinámico
 */
export const useEnhancedTheme = () => {
  const baseTheme = useDynamicTheme();
  const {
    themeAccent,
    fontSize,
    animationsEnabled,
    isDarkMode,
    enhancedProgress,
    smartHints,
  } = useFeatureConfig();

  const enhancedTheme = useMemo(() => {
    // 🎨 Colores de acento personalizados
    const accentColors = ACCENT_COLORS[themeAccent];
    
    // 📏 Tipografía personalizada
    const fontConfig = FONT_CONFIGS[fontSize];
    
    // ✨ Configuración de animaciones
    const animationConfig = animationsEnabled 
      ? ANIMATION_CONFIGS.enabled 
      : ANIMATION_CONFIGS.disabled;

    return {
      ...baseTheme,
      
      // 🎨 Colores extendidos con acento personalizado
      colors: {
        ...baseTheme.colors,
        primary: accentColors.primary,
        secondary: accentColors.secondary,
        primaryLight: accentColors.light,
        primaryDark: accentColors.dark,
        
        // 🌟 Colores específicos para estados
        accent: accentColors.primary,
        accentLight: accentColors.light,
        accentDark: accentColors.dark,
        
        // 🎯 Colores semánticos mejorados
        fertility: {
          high: enhancedProgress ? accentColors.primary : baseTheme.colors.success,
          medium: enhancedProgress ? accentColors.secondary : baseTheme.colors.warning,
          low: enhancedProgress ? accentColors.light : baseTheme.colors.error,
          optimal: accentColors.primary,
        },
      },

      // 📏 Tipografía personalizada
      typography: {
        ...baseTheme.typography,
        h1: { 
          ...baseTheme.typography.h1, 
          fontSize: fontConfig.h1,
        },
        h2: { 
          ...baseTheme.typography.h2, 
          fontSize: fontConfig.h2,
        },
        h3: { 
          ...baseTheme.typography.h3, 
          fontSize: fontConfig.h3,
        },
        body: { 
          ...baseTheme.typography.body, 
          fontSize: fontConfig.body,
        },
        bodyLarge: { 
          ...baseTheme.typography.bodyLarge, 
          fontSize: fontConfig.bodyLarge,
        },
        bodySmall: { 
          ...baseTheme.typography.body, 
          fontSize: fontConfig.bodySmall,
        },
        caption: { 
          ...baseTheme.typography.caption, 
          fontSize: fontConfig.caption,
        },
      },

      // ✨ Configuración de animaciones
      animations: animationConfig,

      // 🎯 Componentes mejorados con configuración
      components: generateComponentsConfig(
        baseTheme,
        accentColors,
        enhancedProgress,
        animationsEnabled,
        smartHints,
        isDarkMode
      ),

      // 🎯 Configuraciones específicas
      config: {
        themeAccent,
        fontSize,
        animationsEnabled,
        enhancedProgress,
        smartHints,
        isDarkMode,
      },

      // 🛠️ Utilidades de tema
      utils: {
        getAccentColor: (opacity = 1) => `${accentColors.primary}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`,
        getSpacing: (multiplier: number) => baseTheme.spacing.s * multiplier,
        getFontSize: (variant: keyof typeof fontConfig) => fontConfig[variant],
        getAnimationDuration: () => animationConfig.duration,
        
        // 🎨 Generadores de estilos dinámicos
        generateCardStyle: (variant: 'default' | 'elevated' = 'default') => ({
          backgroundColor: baseTheme.colors.surface,
          borderRadius: getBorderRadius(enhancedProgress, variant),
          padding: baseTheme.spacing.card,
          shadowColor: isDarkMode ? baseTheme.colors.black : '#000000',
          shadowOffset: { width: 0, height: variant === 'elevated' ? 4 : 2 },
          shadowOpacity: getShadowOpacity(isDarkMode, animationsEnabled, variant === 'elevated' ? 0.15 : 0.1),
          shadowRadius: variant === 'elevated' ? 8 : 4,
          elevation: variant === 'elevated' ? 8 : 3,
        }),

        generateButtonStyle: (variant: 'primary' | 'secondary' = 'primary') => ({
          backgroundColor: variant === 'primary' ? accentColors.primary : accentColors.secondary,
          borderRadius: enhancedProgress ? 24 : 20,
          paddingVertical: enhancedProgress ? 16 : 14,
          paddingHorizontal: enhancedProgress ? 32 : 24,
          shadowColor: accentColors.primary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: animationsEnabled ? 0.3 : 0.2,
          shadowRadius: 8,
          elevation: 6,
        }),

        generateInputStyle: (isFocused = false) => ({
          backgroundColor: baseTheme.colors.surface,
          borderWidth: enhancedProgress ? 2 : 1,
          borderColor: getBorderColor(isFocused, smartHints, accentColors, baseTheme.colors),
          borderRadius: enhancedProgress ? 12 : 8,
          paddingHorizontal: enhancedProgress ? 20 : 16,
          paddingVertical: enhancedProgress ? 16 : 14,
          ...(isFocused && animationsEnabled && {
            shadowColor: accentColors.primary,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 4,
          }),
        }),
      },
    };
  }, [
    baseTheme,
    themeAccent,
    fontSize,
    animationsEnabled,
    isDarkMode,
    enhancedProgress,
    smartHints,
  ]);

  return enhancedTheme;
};

/**
 * Hook simplificado para acceso rápido a utilidades de tema
 */
export const useThemeUtils = () => {
  const theme = useEnhancedTheme();
  return theme.utils;
};
