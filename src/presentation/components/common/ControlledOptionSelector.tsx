import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Text from './Text';
import { Control, Controller, FieldValues, Path, FieldError } from 'react-hook-form';
import { OptionSelectorModal } from './OptionSelectorModal';
import { useDynamicTheme } from '@/hooks/useDynamicTheme';

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
  // 🎨 TEMA DINÁMICO
  const theme = useDynamicTheme();
  
  // 🎨 Crear estilos dinámicos
  const styles = createStyles(theme);
  
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

// 🎨 Función para crear estilos dinámicos
const createStyles = (theme: ReturnType<typeof useDynamicTheme>) => StyleSheet.create({
  container: {
    marginBottom: theme.spacing.m,
  },
  label: {
    ...theme.typography.body,
    marginBottom: theme.spacing.xs,
    fontWeight: '600',
    color: theme.colors.text,
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: 8,
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
