import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, ActivityIndicator } from 'react-native';
import { theme } from '@/config/theme';
import { getModernEmoji } from './ModernIcon';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  iconName?: string; // 🔥 Ahora acepta nombres de nuestros iconos modernos
  iconPosition?: 'left' | 'right';
  style?: ViewStyle;
  fullWidth?: boolean;
}

export const Button = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  iconName,
  iconPosition = 'left',
  style,
  fullWidth = false,
}: ButtonProps) => {
  const buttonStyle = [
    styles.base,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    style,
  ];

  const textStyle = [
    styles.textBase,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    disabled && styles.disabledText,
  ];

  const iconColor = variant === 'primary' ? theme.colors.white : theme.colors.primary;
  
  let iconSize = 20;
  if (size === 'small') iconSize = 16;
  else if (size === 'large') iconSize = 24;

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={iconColor} size="small" />
      ) : (
        <>
          {iconName && iconPosition === 'left' && (
            <Text style={[textStyle, styles.iconLeft, { fontSize: iconSize + 2 }]}>
              {getModernEmoji(iconName)}
            </Text>
          )}
          <Text style={textStyle}>{title}</Text>
          {iconName && iconPosition === 'right' && (
            <Text style={[textStyle, styles.iconRight, { fontSize: iconSize + 2 }]}>
              {getModernEmoji(iconName)}
            </Text>
          )}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.borderRadius.m,
    paddingVertical: theme.spacing.m,
    paddingHorizontal: theme.spacing.l,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  fullWidth: {
    width: '100%',
  },
  // Variants
  primary: {
    backgroundColor: theme.colors.primary,
  },
  secondary: {
    backgroundColor: theme.colors.secondary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  text: {
    backgroundColor: 'transparent',
  },
  // Sizes
  small: {
    paddingVertical: theme.spacing.s,
    paddingHorizontal: theme.spacing.m,
  },
  medium: {
    paddingVertical: theme.spacing.m,
    paddingHorizontal: theme.spacing.l,
  },
  large: {
    paddingVertical: theme.spacing.l,
    paddingHorizontal: theme.spacing.xl,
  },
  // Text styles
  textBase: {
    fontFamily: 'Lato-Bold',
    textAlign: 'center',
  },
  primaryText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  outlineText: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  textText: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
  // States
  disabled: {
    backgroundColor: theme.colors.placeholder,
    shadowOpacity: 0,
    elevation: 0,
  },
  disabledText: {
    color: theme.colors.white,
  },
  // Icons - Modernizados
  iconLeft: {
    marginRight: theme.spacing.s,
    opacity: 0.9,
    transform: [{ scale: 1.1 }], // Iconos ligeramente más grandes
  },
  iconRight: {
    marginLeft: theme.spacing.s,
    opacity: 0.9,
    transform: [{ scale: 1.1 }], // Iconos ligeramente más grandes
  },
});
