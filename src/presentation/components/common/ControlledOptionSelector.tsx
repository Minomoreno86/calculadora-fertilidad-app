import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Control, Controller, FieldValues, Path, FieldError } from 'react-hook-form';
import { OptionSelectorModal } from './OptionSelectorModal';
import { theme } from '@/config/theme';

type ControlledOptionSelectorProps<TFormValues extends FieldValues> = {
  control: Control<TFormValues>;
  name: Path<TFormValues>;
  label: string;
  options: { label: string; value: string }[];
  error?: FieldError;
};

export const ControlledOptionSelector = <TFormValues extends FieldValues>({
  control,
  name,
  label,
  options,
  error,
}: ControlledOptionSelectorProps<TFormValues>) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => (
          <>
            <TouchableOpacity style={[styles.input, error && styles.inputError]} onPress={() => setModalVisible(true)}>
              <Text style={styles.inputText}>
                {options.find((option) => option.value === value)?.label || 'Seleccionar...'}
              </Text>
            </TouchableOpacity>
            <OptionSelectorModal
              visible={modalVisible}
              options={options}
              selectedValue={value}
              onSelect={(selectedValue) => {
                onChange(selectedValue);
                setModalVisible(false);
              }}
              onClose={() => setModalVisible(false)}
            />
          </>
        )}
      />
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
  input: {
    backgroundColor: theme.colors.inputBackground,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.borderRadius.s,
    padding: theme.spacing.s,
    minHeight: 48,
    justifyContent: 'center',
  },
  inputError: {
    borderColor: theme.colors.error,
  },
  inputText: {
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
