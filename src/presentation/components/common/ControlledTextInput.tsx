import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { Control, Controller, FieldValues, Path, FieldError } from 'react-hook-form';
import { theme } from '@/config/theme';
import { Ionicons } from '@expo/vector-icons';

type ControlledTextInputProps<TFormValues extends FieldValues> = TextInputProps & {
  control: Control<TFormValues>;
  name: Path<TFormValues>;
  label: string;
  iconName?: keyof typeof Ionicons.glyphMap;
  error?: FieldError;
};

export const ControlledTextInput = <TFormValues extends FieldValues>({
  control,
  name,
  label,
  iconName,
  error,
  ...textInputProps
}: ControlledTextInputProps<TFormValues>) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputContainer, error && styles.inputError]}>
        {iconName && <Ionicons name={iconName} size={20} color={theme.colors.text} style={styles.icon} />}
        <Controller
          control={control}
          name={name}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={(text) => {
                if (textInputProps.keyboardType === 'numeric' || textInputProps.keyboardType === 'decimal-pad') {
                  onChange(text.replace(',', '.'));
                } else {
                  onChange(text);
                }
              }}
              value={value}
              placeholderTextColor={theme.colors.placeholder}
              {...textInputProps}
            />
          )}
        />
      </View>
      {error && <Text style={styles.errorText}>{error.message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.m,
  },
  label: {
    ...theme.typography.label,
    marginBottom: theme.spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.inputBackground,
    borderRadius: theme.borderRadius.s,
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
