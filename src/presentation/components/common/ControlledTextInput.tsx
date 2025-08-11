import React from 'react';
import { View, StyleSheet } from 'react-native';
import Text from './Text';
import { Control, Controller, FieldValues, Path, FieldError } from 'react-hook-form';
import { useDynamicTheme } from '@/hooks/useDynamicTheme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { theme as designTheme } from '../../../config/theme';

// Safe TextInput import for React Native compatibility
let TextInput: unknown;
let TextInputProps: unknown;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
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
      <View style={styles.inputWrapper}>
        {/* 🎨 Gradiente de fondo para inputs */}
        <LinearGradient
          colors={[
            designTheme.colors.primary + '15', // 15% opacity
            designTheme.colors.secondary + '10', // 10% opacity
            '#4a90e2' + '08', // 8% opacity
          ]}
          style={styles.inputGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        
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
