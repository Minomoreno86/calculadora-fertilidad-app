import React from 'react';
import { StyleSheet, View } from 'react-native';
import Text from '@/presentation/components/common/Text';
import { ControlledTextInput } from '@/presentation/components/common/ControlledTextInput';
import { theme } from '@/config/theme';

import { Control, FieldErrors, Path } from 'react-hook-form';
import { FormState } from '../useCalculatorForm';

type Props = {
  control: Control<FormState>;
  errors: FieldErrors<FormState>;
};

export const MaleFactorForm = ({ control, errors }: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.groupLabel}>Factor Masculino (Espermatograma)</Text>

      <ControlledTextInput
        control={control}
        name="spermConcentration"
        label="Concentración (millones/mL)"
        keyboardType="decimal-pad"
        placeholder="Ej: 45"
        error={errors.spermConcentration}
      />
      <ControlledTextInput
        control={control}
        name="spermMotility"
        label="Motilidad Progresiva (%)"
        keyboardType="decimal-pad"
        placeholder="Ej: 50"
        error={errors.spermMotility}
      />
      <ControlledTextInput
        control={control}
        name="spermMorphology"
        label="Morfología Normal (%)"
        keyboardType="decimal-pad"
        placeholder="Ej: 5"
        error={errors.spermMorphology}
      />
      <ControlledTextInput
        control={control}
        name="semenVolume"
        label="Volumen (mL)"
        keyboardType="decimal-pad"
        placeholder="Ej: 2.5"
        error={errors.semenVolume}
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
    color: theme.colors.primary,
  },
});
