import React from 'react';
import { View, StyleSheet } from 'react-native';
import Text from './Text';
import { Control, Controller, FieldValues, Path, FieldError } from 'react-hook-form';
import { useDynamicTheme } from '@/hooks/useDynamicTheme';
import { Ionicons } from '@expo/vector-icons';

// Safe TextInput import for React Native compatibility
let TextInput: any;
let TextInputProps: any;
try {
  const RN = require('react-native');
  TextInput = RN.TextInput;
  TextInputProps = RN.TextInputProps;
} catch {
  // Fallback for environments without TextInput
  TextInput = View;
  TextInputProps = {};
}

type ControlledTextInputProps<TFormValues extends FieldValues> = {
  control: Control<TFormValues>;
  name: Path<TFormValues>;
  label: string;
  iconName?: keyof typeof Ionicons.glyphMap;
  error?: FieldError;
  // Common TextInput props
  placeholder?: string;
  keyboardType?: 'default' | 'numeric' | 'decimal-pad' | 'email-address' | 'phone-pad';
  secureTextEntry?: boolean;
  multiline?: boolean;
  maxLength?: number;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
  editable?: boolean;
};

export const ControlledTextInput = <TFormValues extends FieldValues>({
  control,
  name,
  label,
  iconName,
  error,
  placeholder,
  keyboardType = 'default',
  secureTextEntry = false,
  multiline = false,
  maxLength,
  autoCapitalize = 'sentences',
  autoCorrect = true,
  editable = true,
}: ControlledTextInputProps<TFormValues>) => {
  // 🎨 TEMA DINÁMICO
  const theme = useDynamicTheme();
  
  // 🎨 Crear estilos dinámicos
  const styles = createStyles(theme);
  
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputContainer, error && styles.inputError]}>
        {iconName && <Ionicons name={iconName} size={20} color={theme.colors.textSecondary} style={styles.icon} />}
        <Controller
          control={control}
          name={name}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={(text) => {
                if (keyboardType === 'numeric' || keyboardType === 'decimal-pad') {
                  onChange(text.replace(',', '.'));
                } else {
                  onChange(text);
                }
              }}
              value={value}
              placeholderTextColor={theme.colors.placeholder}
              placeholder={placeholder}
              keyboardType={keyboardType}
              secureTextEntry={secureTextEntry}
              multiline={multiline}
              maxLength={maxLength}
              autoCapitalize={autoCapitalize}
              autoCorrect={autoCorrect}
              editable={editable}
            />
          )}
        />
      </View>
      {error && <Text style={styles.errorText}>{error.message}</Text>}
    </View>
  );
};

// 🎨 Función para crear estilos dinámicos
const createStyles = (theme: ReturnType<typeof useDynamicTheme>) => StyleSheet.create({
  container: {
    marginBottom: theme.spacing.m,
  },
  label: {
    ...theme.typography.body,
    marginBottom: theme.spacing.xs,
    fontWeight: '600' as const,
    color: theme.colors.text,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  inputError: {
    borderColor: theme.colors.error,
  },
  icon: {
    paddingHorizontal: theme.spacing.s,
  },
  input: {
    flex: 1,
    padding: theme.spacing.s,
    ...theme.typography.body,
    color: theme.colors.text,
  },
  errorText: {
    ...theme.typography.caption,
    color: theme.colors.error,
    marginTop: theme.spacing.xxs,
    marginLeft: theme.spacing.xs,
  },
});
