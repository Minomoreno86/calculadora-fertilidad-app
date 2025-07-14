// ===================================================================
// 🎨 BOTÓN MEJORADO CON EFECTOS VISUALES E ICONOS MODERNOS
// ===================================================================

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Animated } from 'react-native';
import { theme } from '@/config/theme';
import { getModernEmoji } from './ModernIcon';

interface Props {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'outline' | 'text';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  iconName?: string;
  iconPosition?: 'left' | 'right';
  style?: any;
  completionPercentage?: number;
}

export const EnhancedButton: React.FC<Props> = ({
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
  completionPercentage
}) => {
  const [scaleAnimation] = React.useState(new Animated.Value(1));
  const [glowAnimation] = React.useState(new Animated.Value(0));

  React.useEffect(() => {
    if (variant === 'primary' && !disabled && !loading) {
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
    }
  }, [variant, disabled, loading]);

  const handlePressIn = () => {
    Animated.spring(scaleAnimation, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnimation, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const getButtonStyle = () => {
    const baseStyle = [styles.button, styles[size]];
    
    if (fullWidth) baseStyle.push(styles.fullWidth);
    if (disabled) baseStyle.push(styles.disabled);
    
    switch (variant) {
      case 'primary':
        baseStyle.push(styles.primary);
        break;
      case 'outline':
        baseStyle.push(styles.outline);
        break;
      case 'text':
        baseStyle.push(styles.text);
        break;
    }
    
    return baseStyle;
  };

  const getTextStyle = () => {
    const baseStyle = [styles.buttonText, styles[`${size}Text`]];
    
    if (disabled) baseStyle.push(styles.disabledText);
    
    switch (variant) {
      case 'primary':
        baseStyle.push(styles.primaryText);
        break;
      case 'outline':
        baseStyle.push(styles.outlineText);
        break;
      case 'text':
        baseStyle.push(styles.textButtonText);
        break;
    }
    
    return baseStyle;
  };

  const getIcon = () => {
    if (loading) return getModernEmoji('loading');
    if (!iconName) return null;
    return getModernEmoji(iconName);
  };

  const getProgressColor = () => {
    if (!completionPercentage) return theme.colors.primary;
    if (completionPercentage >= 70) return '#4caf50';
    if (completionPercentage >= 40) return '#2196f3';
    return '#ff9800';
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnimation }] }}>
      <TouchableOpacity
        style={[...getButtonStyle(), style]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={0.8}
      >
        {/* 🎯 Efecto de brillo para botón principal */}
        {variant === 'primary' && !disabled && !loading && (
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

        {/* 🎯 Barra de progreso integrada */}
        {variant === 'primary' && completionPercentage !== undefined && (
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

        {/* 🎯 Contenido del botón */}
        <View style={styles.content}>
          {iconName && iconPosition === 'left' && (
            <View style={styles.iconContainer}>
              <Text style={[...getTextStyle(), styles.iconLeft]}>
                {getIcon()}
              </Text>
            </View>
          )}
          
          <Text style={getTextStyle()}>
            {loading ? 'Generando...' : title}
          </Text>
          
          {iconName && iconPosition === 'right' && (
            <View style={styles.iconContainer}>
              <Text style={[...getTextStyle(), styles.iconRight]}>
                {getIcon()}
              </Text>
            </View>
          )}
        </View>

        {/* 🎯 Indicador de carga */}
        {loading && (
          <View style={styles.loadingOverlay}>
            <View style={styles.loadingSpinner} />
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  small: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 32,
  },
  medium: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 44,
  },
  large: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    minHeight: 52,
  },
  fullWidth: {
    width: '100%',
  },
  primary: {
    backgroundColor: theme.colors.primary,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  text: {
    backgroundColor: 'transparent',
  },
  disabled: {
    backgroundColor: '#e0e0e0',
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    fontWeight: 'bold',
    textAlign: 'center',
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
  primaryText: {
    color: '#ffffff',
  },
  outlineText: {
    color: theme.colors.primary,
  },
  textButtonText: {
    color: theme.colors.primary,
  },
  disabledText: {
    color: '#9e9e9e',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ scale: 1.1 }], // Iconos ligeramente más grandes
  },
  iconLeft: {
    marginRight: 8,
    fontSize: 18, // Tamaño consistente para iconos
  },
  iconRight: {
    marginLeft: 8,
    fontSize: 18, // Tamaño consistente para iconos
  },
  glowEffect: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 14,
    opacity: 0.3,
  },
  progressContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
  },
  progressBar: {
    height: '100%',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
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
