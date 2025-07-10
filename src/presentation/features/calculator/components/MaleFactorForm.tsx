import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Control, FieldValues, Path } from 'react-hook-form';
import Text from '@/presentation/components/common/Text';
import { ControlledTextInput } from '@/presentation/components/common/ControlledTextInput';
import { theme } from '@/config/theme';

type Props<TFormValues extends FieldValues> = {
  control: Control<TFormValues>;
};

export const MaleFactorForm = <TFormValues extends FieldValues>({ control }: Props<TFormValues>) => {
  return (
    <View style={styles.container}>
      <Text style={styles.groupLabel}>Factor Masculino (Espermatograma)</Text>

      <ControlledTextInput
        control={control}
        name={'spermConcentration' as Path<TFormValues>}
        label="Concentración (millones/mL)"
        keyboardType="decimal-pad"
        placeholder="Ej: 45"
      />
      <ControlledTextInput
        control={control}
        name={'spermMotility' as Path<TFormValues>}
        label="Motilidad Progresiva (%)"
        keyboardType="decimal-pad"
        placeholder="Ej: 50"
      />
      <ControlledTextInput
        control={control}
        name={'spermMorphology' as Path<TFormValues>}
        label="Morfología Normal (%)"
        keyboardType="decimal-pad"
        placeholder="Ej: 5"
      />
      <ControlledTextInput
        control={control}
        name={'semenVolume' as Path<TFormValues>}
        label="Volumen (mL)"
        keyboardType="decimal-pad"
        placeholder="Ej: 2.5"
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
