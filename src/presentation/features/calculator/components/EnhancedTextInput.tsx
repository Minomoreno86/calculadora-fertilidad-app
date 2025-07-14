// ===================================================================
// 🎨 COMPONENTE DE CAMPO MEJORADO - Input con animaciones y feedback visual
// ===================================================================

import React, { useEffect, useRef } from 'react';
import { View, TextInput, StyleSheet, TextInputProps, Animated } from 'react-native';
import { Control, Controller, FieldError } from 'react-hook-form';
import { Ionicons } from '@expo/vector-icons';
import Text from '@/presentation/components/common/Text';
import { theme } from '@/config/theme';
import { RangeValidation } from '@/presentation/features/calculator/utils/rangeValidation';

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<Record<string, any>>;
  name: string;
  label: string;
  placeholder?: string;
  keyboardType?: TextInputProps['keyboardType'];
  iconName?: keyof typeof Ionicons.glyphMap;
  error?: FieldError;
  rangeValidation?: RangeValidation;
  // 🎨 Nuevas props UX
  hint?: string;
  isActive?: boolean;
  onFocus?: (fieldName: string) => void;
  onBlur?: (fieldName: string) => void;
  validationState?: 'neutral' | 'valid' | 'warning' | 'error';
  showSuccessAnimation?: boolean;
  enableAnimations?: boolean;
}

export const EnhancedTextInput: React.FC<Props> = ({
  control,
  name,
  label,
  placeholder,
  keyboardType = 'default',
  iconName,
  error,
  rangeValidation,
  hint,
  isActive = false,
  onFocus,
  onBlur,
  validationState = 'neutral',
  showSuccessAnimation = false,
  enableAnimations = true,
}) => {
  // 🎭 Referencias para animaciones
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const borderAnim = useRef(new Animated.Value(0)).current;
  const successAnim = useRef(new Animated.Value(0)).current;
  const hintOpacity = useRef(new Animated.Value(0)).current;

  // 🎨 Efectos de animación basados en el estado
  useEffect(() => {
    if (!enableAnimations) return;

    if (isActive) {
      // Animación de foco
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1.02,
          useNativeDriver: true,
          tension: 300,
          friction: 10,
        }),
        Animated.timing(borderAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(hintOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Animación de blur
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 300,
          friction: 10,
        }),
        Animated.timing(borderAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(hintOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isActive, enableAnimations, scaleAnim, borderAnim, hintOpacity]);

  // 🏆 Animación de éxito
  useEffect(() => {
    if (!enableAnimations || !showSuccessAnimation) return;

    Animated.sequence([
      Animated.timing(successAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(successAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [showSuccessAnimation, enableAnimations, successAnim]);

  // 🎨 Colores basados en estado de validación
  const getValidationColors = () => {
    const colors = {
      neutral: {
        borderColor: theme.colors.border,
        backgroundColor: theme.colors.inputBackground,
        iconColor: theme.colors.subtleText,
      },
      valid: {
        borderColor: '#10B981',
        backgroundColor: '#ECFDF5',
        iconColor: '#10B981',
      },
      warning: {
        borderColor: '#F59E0B',
        backgroundColor: '#FFFBEB',
        iconColor: '#F59E0B',
      },
      error: {
        borderColor: '#EF4444',
        backgroundColor: '#FEF2F2',
        iconColor: '#EF4444',
      },
    };

    // Prioridad: rangeValidation > validationState
    if (rangeValidation) {
      if (rangeValidation.isError) return colors.error;
      if (rangeValidation.isWarning) return colors.warning;
      if (rangeValidation.isNormal || rangeValidation.isValid) return colors.valid;
    }

    return colors[validationState];
  };

  const colors = getValidationColors();

  // 🎯 Mensaje de validación inteligente
  const getValidationMessage = () => {
    if (rangeValidation?.message) return rangeValidation.message;
    if (error?.message) return error.message;
    if (hint && (isActive || validationState === 'neutral')) return hint;
    return null;
  };

  const validationMessage = getValidationMessage();

  return (
    <Animated.View 
      style={[
        styles.container,
        enableAnimations && {
          transform: [{ scale: scaleAnim }],
        }
      ]}
    >
      <Text variant="label" style={styles.label}>
        {label}
        {validationState === 'valid' && (
          <Animated.Text style={[styles.successIcon, { opacity: successAnim }]}>
            {' ✓'}
          </Animated.Text>
        )}
      </Text>
      
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur: fieldOnBlur, value } }) => (
          <Animated.View 
            style={[
              styles.inputContainer,
              {
                borderColor: colors.borderColor,
                backgroundColor: colors.backgroundColor,
              },
              enableAnimations && {
                borderWidth: borderAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [2, 3],
                }),
              },
              error && styles.errorBorder,
            ]}
          >
            {iconName && (
              <Ionicons
                name={iconName}
                size={20}
                color={colors.iconColor}
                style={styles.icon}
              />
            )}
            
            <TextInput
              style={[
                styles.input,
                iconName && styles.inputWithIcon,
              ]}
              onBlur={(e) => {
                fieldOnBlur();
                onBlur?.(name);
              }}
              onFocus={() => onFocus?.(name)}
              onChangeText={onChange}
              value={value?.toString() || ''}
              placeholder={placeholder}
              placeholderTextColor={theme.colors.subtleText}
              keyboardType={keyboardType}
            />

            {/* 🎯 Indicador de estado */}
            <View style={styles.statusIndicator}>
              {validationState === 'valid' && (
                <Ionicons name="checkmark-circle" size={16} color="#10B981" />
              )}
              {validationState === 'warning' && (
                <Ionicons name="warning" size={16} color="#F59E0B" />
              )}
              {validationState === 'error' && (
                <Ionicons name="close-circle" size={16} color="#EF4444" />
              )}
            </View>
          </Animated.View>
        )}
      />

      {/* 💬 Mensaje de validación/hint animado */}
      {validationMessage && (
        <Animated.View 
          style={[
            styles.messageContainer,
            { opacity: hintOpacity }
          ]}
        >
          <Text variant="caption" style={[
            styles.validationMessage,
            { color: error ? theme.colors.error : colors.borderColor }
          ]}>
            {validationMessage}
          </Text>
        </Animated.View>
      )}

      {/* 🎆 Overlay de éxito */}
      {enableAnimations && (
        <Animated.View 
          style={[
            styles.successOverlay,
            {
              opacity: successAnim,
              transform: [
                {
                  scale: successAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1.1],
                  })
                }
              ]
            }
          ]}
          pointerEvents="none"
        >
          <Ionicons name="checkmark-circle" size={24} color="#10B981" />
        </Animated.View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.m,
    position: 'relative',
  },
  label: {
    marginBottom: theme.spacing.xs,
    color: theme.colors.text,
    fontWeight: '600',
  },
  successIcon: {
    color: '#10B981',
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: theme.borderRadius.m,
    paddingHorizontal: theme.spacing.m,
    minHeight: 50,
    position: 'relative',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text,
    paddingVertical: theme.spacing.s,
  },
  inputWithIcon: {
    marginLeft: theme.spacing.s,
  },
  icon: {
    marginRight: theme.spacing.xs,
  },
  statusIndicator: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageContainer: {
    marginTop: theme.spacing.xs,
  },
  validationMessage: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  errorBorder: {
    borderColor: theme.colors.error,
    backgroundColor: '#FEF2F2',
  },
  successOverlay: {
    position: 'absolute',
    top: '50%',
    right: 16,
    transform: [{ translateY: -12 }],
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default EnhancedTextInput;
