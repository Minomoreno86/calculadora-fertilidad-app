/**
 * OptimizedNumericInput - Input numérico optimizado para evitar trabados
 * 
 * OPTIMIZACIONES:
 * - Debounce en onChange para evitar re-renders excesivos
 * - Manejo inteligente del teclado (auto-dismiss)
 * - Estados estables para evitar loops
 * - Performance mejorada en dispositivos móviles
 * 
 * @author AEC-D (Arquitecto Experto Clínico-Digital)
 * @version 1.0 - Solución de trabado de teclado
 */

import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Control, Controller, FieldError } from 'react-hook-form';
import { Ionicons } from '@expo/vector-icons';
import Text from './Text';
import { useDynamicTheme } from '../../../hooks/useDynamicTheme';
import { RangeValidation } from '../../features/calculator/utils/rangeValidation';

// Safe imports for React Native components
let TextInput: any;
let Keyboard: any;
try {
  const RN = require('react-native');
  TextInput = RN.TextInput;
  Keyboard = RN.Keyboard;
} catch {
  // Fallback for environments without TextInput/Keyboard
  TextInput = View;
  Keyboard = { dismiss: () => {} };
}

interface OptimizedNumericInputProps<T extends Record<string, unknown> = Record<string, unknown>> {
  control: Control<T>;
  name: keyof T;
  label: string;
  placeholder?: string;
  iconName?: keyof typeof Ionicons.glyphMap;
  error?: FieldError;
  rangeValidation?: RangeValidation;
  
  /** Tiempo de debounce para onChange (ms) - Default: 300 */
  debounceTime?: number;
  
  /** Auto-dismiss del teclado al perder foco - Default: true */
  autoDismissKeyboard?: boolean;
  
  /** Validación en tiempo real - Default: true */
  enableRealTimeValidation?: boolean;
}

export const OptimizedNumericInput = <T extends Record<string, unknown> = Record<string, unknown>>({
  control,
  name,
  label,
  placeholder,
  iconName,
  error,
  rangeValidation,
  debounceTime = 300,
  autoDismissKeyboard = true,
  enableRealTimeValidation = true,
}: OptimizedNumericInputProps<T>) => {
  
  // 🛡️ QUANTUM CONSCIOUSNESS SAFETY GUARD V14.0 - Validar control
  if (!control) {
    console.warn('⚠️ OptimizedNumericInput: control es undefined para campo:', name);
    return (
      <View style={{ padding: 10, backgroundColor: '#ffebee', borderRadius: 8 }}>
        <Text style={{ color: '#d32f2f', fontSize: 14 }}>
          Error: Control no disponible para {String(name)}
        </Text>
      </View>
    );
  }
  
  // 🎨 TEMA DINÁMICO
  const theme = useDynamicTheme();
  
  // 🚀 Estados optimizados
  const [localValue, setLocalValue] = React.useState<string>('');
  const [isFocused, setIsFocused] = React.useState(false);
  const [isValidating, setIsValidating] = React.useState(false);
  
  // 🚀 Referencias para debounce y cleanup
  const debounceTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = React.useRef<any>(null);
  const isMountedRef = React.useRef(true);
  
  // 🚀 Cleanup al desmontar
  React.useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (debounceTimeoutRef?.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);
  
  // 🎨 Determinar colores para estados de error
  const getErrorColors = React.useCallback(() => {
    if (!error) return null;
    return {
      borderColor: theme?.colors?.error,
      backgroundColor: theme.isDark ? '#4E0D0D' : '#FFEBEE',
      iconColor: theme?.colors?.error,
    };
  }, [error, theme]);

  // 🎨 Determinar colores para validación de rango
  const getRangeValidationColors = React.useCallback(() => {
    if (!rangeValidation) return null;

    if (rangeValidation?.isNormal) {
      return {
        borderColor: theme?.colors?.success,
        backgroundColor: theme.isDark ? '#0D4E1A' : '#E8F5E8',
        iconColor: theme?.colors?.success,
      };
    }
    
    if (rangeValidation?.isWarning) {
      return {
        borderColor: theme?.colors?.warning,
        backgroundColor: theme.isDark ? '#4E3A0D' : '#FFF3E0',
        iconColor: theme?.colors?.warning,
      };
    }
    
    if (rangeValidation?.isError) {
      return {
        borderColor: theme?.colors?.error,
        backgroundColor: theme.isDark ? '#4E0D0D' : '#FFEBEE',
        iconColor: theme?.colors?.error,
      };
    }

    return null;
  }, [rangeValidation, theme]);

  // 🎨 Determinar colores por defecto
  const getDefaultColors = React.useCallback(() => ({
    borderColor: isFocused ? theme?.colors?.primary : theme?.colors?.border,
    backgroundColor: theme?.colors?.surface,
    iconColor: isFocused ? theme?.colors?.primary : theme?.colors?.textSecondary,
  }), [isFocused, theme]);

  // 🎨 Combinar colores basados en prioridad
  const colors = getErrorColors() || getRangeValidationColors() || getDefaultColors();
  
  // 🚀 Función de debounce optimizada
  const debouncedOnChange = React.useCallback((value: string, onChange: (value: string) => void) => {
    // Limpiar timeout anterior
    if (debounceTimeoutRef?.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    // Programar nueva actualización
    debounceTimeoutRef.current = setTimeout(() => {
      if (isMountedRef?.current) {
        onChange(value);
        if (enableRealTimeValidation) {
          setIsValidating(false);
        }
      }
    }, debounceTime);
    
    if (enableRealTimeValidation) {
      setIsValidating(true);
    }
  }, [debounceTime, enableRealTimeValidation]);
  
  // 🚀 Manejo de foco optimizado
  const handleFocus = React.useCallback(() => {
    setIsFocused(true);
  }, []);
  
  // 🚀 Manejo de blur optimizado
  const handleBlur = React.useCallback(() => {
    setIsFocused(false);
    
    if (autoDismissKeyboard && Platform.OS !== 'web') {
      // Pequeño delay para permitir que el valor se actualice
      setTimeout(() => {
        Keyboard.dismiss();
      }, 100);
    }
  }, [autoDismissKeyboard]);
  
  // 🚀 Validación y formateo de input numérico
  const handleTextChange = React.useCallback((text: string, onChange: (value: string) => void) => {
    // Permitir solo números, punto decimal y coma
    const cleanText = text.replace(/[^0-9.,]/g, '');
    
    // Reemplazar coma por punto para consistencia
    const normalizedText = cleanText.replace(',', '.');
    
    // Evitar múltiples puntos decimales
    const parts = normalizedText.split('.');
    const formattedText = parts.length > 2 
      ? `${parts?.[0]}.${parts.slice(1).join('')}` 
      : normalizedText;
    
    // Actualizar valor local inmediatamente para UX responsiva
    setLocalValue(formattedText);
    
    // Aplicar debounce para el onChange del formulario
    debouncedOnChange(formattedText, onChange);
  }, [debouncedOnChange]);
  
  // 🎨 Crear estilos dinámicos
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <Text variant="body" style={styles.label}>
        {label}
        {isValidating && enableRealTimeValidation && (
          <Text style={styles.validatingText}> (validando...)</Text>
        )}
      </Text>
      
      <Controller
        control={control}
        // @ts-expect-error - Controller type compatibility issue with generic keyof T
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={[
            styles.inputContainer,
            {
              borderColor: colors.borderColor,
              backgroundColor: colors.backgroundColor,
            },
          ]}>
            {iconName && (
              <Ionicons
                name={iconName}
                size={20}
                color={colors.iconColor}
                style={styles.icon}
              />
            )}
            <TextInput
              ref={inputRef}
              style={[
                styles.input,
                iconName && styles.inputWithIcon,
              ]}
              onFocus={handleFocus}
              onBlur={() => {
                handleBlur();
                onBlur();
              }}
              onChangeText={(text) => handleTextChange(text, onChange)}
              value={localValue || value?.toString() || ''}
              placeholder={placeholder}
              placeholderTextColor={theme?.colors?.textSecondary}
              keyboardType="numeric"
              returnKeyType="done"
              maxLength={10}
              selectTextOnFocus={true}
            />
          </View>
        )}
      />

      {/* Mostrar mensaje de validación clínica */}
      {rangeValidation?.message && !isValidating && (
        <Text variant="caption" style={[
          styles.validationMessage,
          { color: colors.borderColor }
        ]}>
          {rangeValidation.message}
        </Text>
      )}

      {/* Mostrar error de formulario */}
      {error && (
        <Text variant="caption" style={styles.errorText}>
          {error.message}
        </Text>
      )}
    </View>
  );
};

// 🎨 Función para crear estilos dinámicos
const createStyles = (theme: ReturnType<typeof useDynamicTheme>) => StyleSheet.create({
  container: {
    marginBottom: theme?.spacing?.m,
  },
  label: {
    marginBottom: theme?.spacing?.xs,
    color: theme?.colors?.text,
    fontWeight: '600' as const,
  },
  validatingText: {
    color: theme?.colors?.textSecondary,
    fontSize: 12,
    fontStyle: 'italic' as const,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: theme?.spacing?.m,
    paddingVertical: theme?.spacing?.s,
    minHeight: 48,
    shadowColor: theme.isDark ? theme?.colors?.black : '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: theme.isDark ? 0.3 : 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  icon: {
    marginRight: theme?.spacing?.s,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: theme?.colors?.text,
    textAlign: 'left' as const,
    padding: 0,
  },
  inputWithIcon: {
    marginLeft: 0,
  },
  validationMessage: {
    marginTop: theme?.spacing?.xs,
    fontSize: 12,
    lineHeight: 16,
  },
  errorText: {
    marginTop: theme?.spacing?.xs,
    fontSize: 12,
    color: theme?.colors?.error,
    lineHeight: 16,
  },
});
