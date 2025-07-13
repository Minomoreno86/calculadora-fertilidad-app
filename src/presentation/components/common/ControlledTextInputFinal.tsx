import React from 'react';
import { View, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { Control, Controller, FieldError } from 'react-hook-form';
import { Ionicons } from '@expo/vector-icons';
import Text from './Text';
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
  rangeValidation?: RangeValidation; // 🎨 Nueva prop para colores
}

export const ControlledTextInputFinal: React.FC<Props> = ({
  control,
  name,
  label,
  placeholder,
  keyboardType = 'default',
  iconName,
  error,
  rangeValidation,
}) => {
  // 🎨 Determinar colores basados en validación de rango
  const getValidationColors = () => {
    if (!rangeValidation) {
      return {
        borderColor: theme.colors.border,
        backgroundColor: theme.colors.inputBackground,
        iconColor: theme.colors.text,
      };
    }

    console.log(`🎨 ControlledTextInputFinal[${name}] - rangeValidation:`, rangeValidation);

    // Usar las propiedades correctas de RangeValidation
    if (rangeValidation.isNormal) {
      return {
        borderColor: '#4CAF50', // Verde
        backgroundColor: '#E8F5E8',
        iconColor: '#4CAF50',
      };
    } else if (rangeValidation.isWarning) {
      return {
        borderColor: '#FF9800', // Naranja
        backgroundColor: '#FFF3E0',
        iconColor: '#FF9800',
      };
    } else if (rangeValidation.isError) {
      return {
        borderColor: '#F44336', // Rojo
        backgroundColor: '#FFEBEE',
        iconColor: '#F44336',
      };
    } else {
      return {
        borderColor: theme.colors.border,
        backgroundColor: theme.colors.inputBackground,
        iconColor: theme.colors.text,
      };
    }
  };

  const colors = getValidationColors();

  return (
    <View style={styles.container}>
      <Text variant="label" style={styles.label}>
        {label}
      </Text>
      
      <Controller
        control={control}
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
              placeholderTextColor={theme.colors.subtleText}
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

const styles = StyleSheet.create({
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
    borderRadius: theme.borderRadius.m,
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
    backgroundColor: '#FFEBEE',
  },
});
