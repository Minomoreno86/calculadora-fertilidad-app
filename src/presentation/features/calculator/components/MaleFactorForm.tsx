import React from 'react';
import { StyleSheet, View } from 'react-native';
import Text from '@/presentation/components/common/Text';
import { ControlledTextInput } from '@/presentation/components/common/ControlledTextInput';
import { theme } from '@/config/theme';

import { Control, FieldValues, Path, FieldErrors } from 'react-hook-form';

type Props<TFormValues extends FieldValues> = {
  control: Control<TFormValues>;
  errors: FieldErrors<TFormValues>;
};

export const MaleFactorForm = <TFormValues extends FieldValues>({ control, errors }: Props<TFormValues>) => {
  return (
    <View style={styles.container}>
      <Text style={styles.groupLabel}>Factor Masculino (Espermatograma)</Text>

      <ControlledTextInput
        control={control}
        name={'spermConcentration' as Path<TFormValues>}
        label="Concentración (millones/mL)"
        keyboardType="decimal-pad"
        placeholder="Ej: 45"
        error={errors.spermConcentration as import('react-hook-form').FieldError}
      />
      <ControlledTextInput
        control={control}
        name={'spermMotility' as Path<TFormValues>}
        label="Motilidad Progresiva (%)"
        keyboardType="decimal-pad"
        placeholder="Ej: 50"
        error={errors.spermMotility as import('react-hook-form').FieldError}
      />
      <ControlledTextInput
        control={control}
        name={'spermMorphology' as Path<TFormValues>}
        label="Morfología Normal (%)"
        keyboardType="decimal-pad"
        placeholder="Ej: 5"
        error={errors.spermMorphology as import('react-hook-form').FieldError}
      />
      <ControlledTextInput
        control={control}
        name={'semenVolume' as Path<TFormValues>}
        label="Volumen (mL)"
        keyboardType="decimal-pad"
        placeholder="Ej: 2.5"
        error={errors.semenVolume as import('react-hook-form').FieldError}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.l,
  },
  groupLabel: {
    ...theme.typography.h3,
    marginBottom: theme.spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingBottom: theme.spacing.xs,
  },
});
