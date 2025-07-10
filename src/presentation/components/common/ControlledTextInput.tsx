import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { theme } from '@/config/theme';
import { Ionicons } from '@expo/vector-icons';

type ControlledTextInputProps<TFormValues extends FieldValues> = TextInputProps & {
  control: Control<TFormValues>;
  name: Path<TFormValues>;
  label: string;
  iconName?: keyof typeof Ionicons.glyphMap;
};

export const ControlledTextInput = <TFormValues extends FieldValues>({
  control,
  name,
  label,
  iconName,
  ...textInputProps
}: ControlledTextInputProps<TFormValues>) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputContainer}>
        {iconName && <Ionicons name={iconName} size={20} color={theme.colors.text} style={styles.icon} />}
        <Controller
          control={control}
          name={name}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholderTextColor={theme.colors.placeholder}
              {...textInputProps}
            />
          )}
        />
      </View>
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
  icon: {
    paddingHorizontal: theme.spacing.s,
  },
  input: {
    flex: 1,
    padding: theme.spacing.s,
    ...theme.typography.body,
    color: theme.colors.text,
  },
});
