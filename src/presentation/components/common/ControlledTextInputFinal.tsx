import React from 'react';
import { View, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { Control, Controller, FieldError } from 'react-hook-form';
import { Ionicons } from '@expo/vector-icons';
import Text from './Text';
import { useDynamicTheme } from '@/hooks/useDynamicTheme';
import { RangeValidation } from '@/presentation/features/calculator/utils/rangeValidation';

interface Props<T extends Record<string, unknown> = Record<string, unknown>> {
  control: Control<T>;
  name: keyof T;
  label: string;
  placeholder?: string;
  keyboardType?: TextInputProps['keyboardType'];
  iconName?: keyof typeof Ionicons.glyphMap;
  error?: FieldError;
  rangeValidation?: RangeValidation;
}

export const ControlledTextInputFinal = <T extends Record<string, unknown> = Record<string, unknown>>({
  control,
  name,
  label,
  placeholder,
  keyboardType = 'default',
  iconName,
  error,
  rangeValidation,
}: Props<T>) => {
  // 🎨 TEMA DINÁMICO
  const theme = useDynamicTheme();
  
  // 🎨 Determinar colores basados en validación de rango
  const getValidationColors = () => {
    if (!rangeValidation) {
      return {
        borderColor: theme.colors.border,
        backgroundColor: theme.colors.surface,
        iconColor: theme.colors.textSecondary,
      };
    }

    // Usar las propiedades correctas de RangeValidation
    if (rangeValidation.isNormal) {
      return {
        borderColor: theme.colors.success,
        backgroundColor: theme.isDark ? '#0D4E1A' : '#E8F5E8',
        iconColor: theme.colors.success,
      };
    } else if (rangeValidation.isWarning) {
      return {
        borderColor: theme.colors.warning,
        backgroundColor: theme.isDark ? '#4E3A0D' : '#FFF3E0',
        iconColor: theme.colors.warning,
      };
    } else if (rangeValidation.isError) {
      return {
        borderColor: theme.colors.error,
        backgroundColor: theme.isDark ? '#4E0D0D' : '#FFEBEE',
        iconColor: theme.colors.error,
      };
    } else {
      return {
        borderColor: theme.colors.border,
        backgroundColor: theme.colors.surface,
        iconColor: theme.colors.textSecondary,
      };
    }
  };

  const colors = getValidationColors();
  
  // 🎨 Crear estilos dinámicos
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <Text variant="body" style={styles.label}>
        {label}
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
            error && styles.errorBorder,
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
              style={[
                styles.input,
                iconName && styles.inputWithIcon,
              ]}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value?.toString() || ''}
              placeholder={placeholder}
              placeholderTextColor={theme.colors.textSecondary}
              keyboardType={keyboardType}
            />
          </View>
        )}
      />

      {/* Mostrar mensaje de validación clínica */}
      {rangeValidation?.message && (
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
    marginBottom: theme.spacing.m,
  },
  label: {
    marginBottom: theme.spacing.xs,
    color: theme.colors.text,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2, // 🎨 Borde más grueso para mejor visibilidad
    borderRadius: 8,
    paddingHorizontal: theme.spacing.m,
    minHeight: 50,
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
  validationMessage: {
    marginTop: theme.spacing.xs,
    fontSize: 12,
    fontStyle: 'italic',
  },
  errorText: {
    marginTop: theme.spacing.xs,
    color: theme.colors.error,
    fontSize: 12,
  },
  errorBorder: {
    borderColor: theme.colors.error,
    backgroundColor: theme.isDark ? '#4E0D0D' : '#FFEBEE',
  },
});
