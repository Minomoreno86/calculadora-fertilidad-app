import React from 'react';
import { TouchableOpacity, StyleSheet, View, ViewStyle, TextStyle } from 'react-native';
import Text from './Text';
import { useDynamicTheme } from '@/hooks/useDynamicTheme';

// Simple emoji helper
const getModernEmoji = (name: string): string => {
  const emojiMap: { [key: string]: string } = {
    loading: '⏳',
    check: '✅',
    heart: '❤️',
    star: '⭐',
    medical: '🏥',
    default: '📱'
  };
  return emojiMap[name] || emojiMap.default;
};

// Safe imports for React Native components con tipos específicos
let Animated: {
  Value: new (value: number) => {
    interpolate: (config: Record<string, unknown>) => unknown;
    setValue?: (value: number) => void;
  };
  View: React.ComponentType<Record<string, unknown>>;
  loop: (animation: unknown) => { start: (callback?: () => void) => void };
  sequence: (animations: unknown[]) => { start: (callback?: () => void) => void };
  timing: (value: unknown, config: Record<string, unknown>) => { start: (callback?: () => void) => void };
  spring: (value: unknown, config: Record<string, unknown>) => { start: (callback?: () => void) => void };
};

let ActivityIndicator: React.ComponentType<{
  size?: string | number;
  color?: string;
}>;

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const RN = require('react-native');
  Animated = RN.Animated;
  ActivityIndicator = RN.ActivityIndicator;
} catch {
  // Fallback for environments without components
  Animated = {
    Value: class AnimatedValue { 
      constructor(private value: number) {}
      interpolate = () => this;
      setValue = () => {};
    },
    View: View as React.ComponentType<Record<string, unknown>>,
    timing: () => ({ start: () => {} }),
    loop: () => ({ start: () => {} }),
    sequence: () => ({ start: () => {} }),
    spring: () => ({ start: () => {} })
  };
  const FallbackActivityIndicator = ({ size, color }: { size?: string | number; color?: string }) => (
    <View style={{ width: 20, height: 20, backgroundColor: color || '#ccc' }} />
  );
  FallbackActivityIndicator.displayName = 'FallbackActivityIndicator';
  
  ActivityIndicator = FallbackActivityIndicator;
}

// ===================================================================
// 🎨 BOTÓN UNIFICADO - Combina funcionalidad básica y efectos avanzados
// ===================================================================

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text' | 'medical' | 'clinical' | 'fertility';
type ButtonSize = 'small' | 'medium' | 'large' | 'clinical';

interface Props {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  iconName?: string;
  iconPosition?: 'left' | 'right';
  style?: ViewStyle;
  // 🆕 Características avanzadas (opcional)
  enhanced?: boolean; // Activa animaciones y efectos especiales
  completionPercentage?: number; // Solo para enhanced=true
}

export const EnhancedButton: React.FC<Props> = React.memo(({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  loading = false,
  disabled = false,
  iconName,
  iconPosition = 'left',
  style,
  enhanced = false,
  completionPercentage
}) => {
  // 🎨 TEMA DINÁMICO
  const theme = useDynamicTheme();
  
  // 🎨 Crear estilos dinámicos locales
  const styles = createStyles(theme);
  
  // 🎭 Referencias para animaciones (solo si enhanced=true)
  const [scaleAnimation] = React.useState(new Animated.Value(1));
  const [glowAnimation] = React.useState(new Animated.Value(0));

  // 🌟 Efecto de brillo solo para botones enhanced
  React.useEffect(() => {
    if (enhanced && variant === 'primary' && !disabled && !loading) {
      const glow = Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnimation, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: false,
          }),
          Animated.timing(glowAnimation, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: false,
          }),
        ])
      );
      glow.start();
      return () => glow.stop();
    }
    return undefined;
  }, [enhanced, variant, disabled, loading, glowAnimation]);

  // 🎯 Animaciones de presión (solo si enhanced=true)
  const handlePressIn = () => {
    if (enhanced) {
      Animated.spring(scaleAnimation, {
        toValue: 0.95,
        useNativeDriver: true,
      }).start();
    }
  };

  const handlePressOut = () => {
    if (enhanced) {
      Animated.spring(scaleAnimation, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  };

  // 🎨 Estilos dinámicos - separar text y view styles
  const getButtonStyle = (): ViewStyle[] => {
    const variantStyle = variant === 'clinical' ? 'clinicalVariant' : variant;
    const baseStyle = [
      styles.button, 
      styles[size],
      styles[variantStyle],
      fullWidth && styles.fullWidth,
      disabled && styles.disabled,
    ].filter(Boolean) as ViewStyle[];
    return baseStyle;
  };

  const getTextStyle = (): TextStyle[] => {
    const sizeTextKey = size === 'clinical' ? 'clinicalSizeText' : `${size}Text`;
    // Solo incluir estilos que son específicamente para texto
    const textStyles: TextStyle[] = [];
    
    // Agregar solo propiedades de texto válidas
    textStyles.push(styles.buttonText);
    textStyles.push(styles[sizeTextKey as keyof typeof styles] as TextStyle);
    textStyles.push(styles[`${variant}Text` as keyof typeof styles] as TextStyle);
    
    if (disabled) {
      textStyles.push(styles.disabledText);
    }
    
    return textStyles.filter(Boolean);
  };

  // 🎯 Icono dinámico
  const getIcon = () => {
    if (loading) return enhanced ? getModernEmoji('loading') : '⏳';
    if (!iconName) return null;
    return getModernEmoji(iconName);
  };

  // 🌈 Color de progreso dinámico
  const getProgressColor = () => {
    if (!completionPercentage) return theme.colors.primary;
    if (completionPercentage >= 70) return '#4caf50';
    if (completionPercentage >= 40) return '#2196f3';
    return '#ff9800';
  };

  // 📏 Tamaño de icono
  const getIconSize = () => {
    switch (size) {
      case 'small': return 16;
      case 'large': return 24;
      default: return 20;
    }
  };

  // 🎯 Color de icono
  const getIconColor = () => {
    if (variant === 'primary' || variant === 'secondary') return theme.colors.white;
    return theme.colors.primary;
  };

  // 🖱️ Contenedor principal con animación condicional
  const ButtonContainer = enhanced ? Animated.View : View;
  const containerProps = enhanced 
    ? { style: { transform: [{ scale: scaleAnimation }] } }
    : {};

  return (
    <ButtonContainer {...containerProps}>
      <TouchableOpacity
        style={[...getButtonStyle(), style]}
        onPress={onPress}
        onPressIn={enhanced ? handlePressIn : undefined}
        onPressOut={enhanced ? handlePressOut : undefined}
        disabled={disabled || loading}
        activeOpacity={0.8}
      >
        {/* ✨ Efecto de brillo (solo enhanced) */}
        {enhanced && variant === 'primary' && !disabled && !loading && (
          <Animated.View
            style={[
              styles.glowEffect,
              {
                opacity: glowAnimation,
                backgroundColor: getProgressColor(),
              }
            ]}
          />
        )}

        {/* 📊 Barra de progreso (solo enhanced) */}
        {enhanced && variant === 'primary' && completionPercentage !== undefined && (
          <View style={styles.progressContainer}>
            <View 
              style={[
                styles.progressBar,
                {
                  width: `${completionPercentage}%`,
                  backgroundColor: 'rgba(255, 255, 255, 0.3)'
                }
              ]} 
            />
          </View>
        )}

        {/* 📱 Contenido del botón */}
        {loading ? (
          <ActivityIndicator color={getIconColor()} size="small" />
        ) : (
          <View style={styles.content}>
            {iconName && iconPosition === 'left' && (
              <Text style={[
                styles.buttonText, 
                styles.iconLeft,
                { fontSize: getIconSize() + 2, color: getIconColor() }
              ]}>
                {getIcon()}
              </Text>
            )}

            <Text style={getTextStyle()}>
              {title}
            </Text>

            {iconName && iconPosition === 'right' && (
              <Text style={[
                styles.buttonText, 
                styles.iconRight,
                { fontSize: getIconSize() + 2, color: getIconColor() }
              ]}>
                {getIcon()}
              </Text>
            )}
          </View>
        )}

        {/* 🔄 Overlay de carga (solo enhanced) */}
        {enhanced && loading && (
          <View style={styles.loadingOverlay}>
            <View style={styles.loadingSpinner} />
          </View>
        )}
      </TouchableOpacity>
    </ButtonContainer>
  );
});

// 🎨 Función para crear estilos dinámicos
const createStyles = (theme: ReturnType<typeof useDynamicTheme>) => StyleSheet.create({
  // 🎯 Base del botón - ViewStyle
  button: {
    borderRadius: 8,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    position: 'relative' as const,
    overflow: 'hidden' as const,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },

  // 📏 Tamaños
  small: {
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.s,
    minHeight: 32,
  },
  medium: {
    paddingHorizontal: theme.spacing.l,
    paddingVertical: theme.spacing.m,
    minHeight: 44,
  },
  large: {
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.l,
    minHeight: 52,
  },
  clinical: {
    paddingHorizontal: theme.spacing.l,
    paddingVertical: theme.spacing.m + 2,
    minHeight: 48,
  },

  // 🎨 Variantes
  primary: {
    backgroundColor: theme.colors.primary,
    shadowColor: theme.colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  secondary: {
    backgroundColor: theme.colors.secondary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: theme.colors.primary,
    shadowOpacity: 0,
    elevation: 0,
  },
  text: {
    backgroundColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
  },
  // 🏥 MEDICAL VARIANTS
  medical: {
    backgroundColor: '#2e7d32', // Verde médico
    shadowColor: '#2e7d32',
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4caf50',
  },
  clinicalVariant: {
    backgroundColor: '#1565c0', // Azul clínico
    shadowColor: '#1565c0',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    borderBottomWidth: 2,
    borderBottomColor: '#42a5f5',
  },
  fertility: {
    backgroundColor: '#7b1fa2', // Púrpura fertilidad
    shadowColor: '#7b1fa2',
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ab47bc',
  },

  // 🔧 Estados
  disabled: {
    backgroundColor: theme.colors.textTertiary,
    shadowOpacity: 0,
    elevation: 0,
  },
  fullWidth: {
    width: '100%',
  },

  // 📝 Texto - TextStyle only
  buttonText: {
    fontFamily: 'Lato-Bold',
    fontWeight: 'bold' as const,
    textAlign: 'center' as const,
  },
  smallText: {
    fontSize: 12,
  },
  mediumText: {
    fontSize: 14,
  },
  largeText: {
    fontSize: 16,
  },
  clinicalSizeText: {
    fontSize: 15,
    letterSpacing: 0.5,
  },
  primaryText: {
    color: theme.colors.white,
  },
  secondaryText: {
    color: theme.colors.white,
  },
  outlineText: {
    color: theme.colors.primary,
  },
  textText: {
    color: theme.colors.primary,
  },
  // 🏥 MEDICAL VARIANTS TEXT
  medicalText: {
    color: '#ffffff',
    fontWeight: '600' as const,
  },
  clinicalText: {
    color: '#ffffff',
    fontSize: 15,
  },
  fertilityText: {
    color: '#ffffff',
    fontWeight: '700' as const,
  },
  disabledText: {
    color: theme.colors.white,
  },

  // 🎯 Layout - ViewStyle only
  content: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    zIndex: 2,
  },

  // 🎨 Iconos - solo texto, sin ViewStyle properties
  iconLeft: {
    marginRight: theme.spacing.s,
    opacity: 0.9,
  },
  iconRight: {
    marginLeft: theme.spacing.s,
    opacity: 0.9,
  },

  // ✨ Efectos especiales (solo enhanced) - ViewStyle only
  glowEffect: {
    position: 'absolute' as const,
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 10,
    opacity: 0.3,
  },
  progressContainer: {
    position: 'absolute' as const,
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
  },
  progressBar: {
    height: '100%',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  loadingOverlay: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    borderRadius: 8,
  },
  loadingSpinner: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ffffff',
    borderTopColor: 'transparent',
  },
});

// 🎯 Asignar displayName para debugging
EnhancedButton.displayName = 'EnhancedButton';

// 🔄 Exportar también como Button para compatibilidad
export const Button = EnhancedButton;
