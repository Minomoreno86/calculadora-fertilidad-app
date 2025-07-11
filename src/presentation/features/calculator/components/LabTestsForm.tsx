import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Control, FieldErrors } from 'react-hook-form';
import Text from '@/presentation/components/common/Text';
import { ControlledTextInput } from '@/presentation/components/common/ControlledTextInput';
import { theme } from '@/config/theme';
import { FormState } from '../useCalculatorForm';

type Props = {
  control: Control<FormState>;
  calculatedHoma: number | null;
  errors: FieldErrors<FormState>;
};

export const LabTestsForm = ({ control, calculatedHoma, errors }: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.groupLabel}>Resultados de Laboratorio</Text>

      <ControlledTextInput
        control={control}
        name="amhValue"
        label="Hormona Antimülleriana (AMH en ng/mL)"
        keyboardType="decimal-pad"
        placeholder="Ej: 1.8"
        error={errors.amhValue}
      />
      <ControlledTextInput
        control={control}
        name="tshValue"
        label="Hormona Tiroidea (TSH en µIU/mL)"
        keyboardType="decimal-pad"
        placeholder="Ej: 2.1"
        error={errors.tshValue}
      />
      <ControlledTextInput
        control={control}
        name="prolactinValue"
        label="Prolactina (ng/mL)"
        keyboardType="decimal-pad"
        placeholder="Ej: 15"
        error={errors.prolactinValue}
      />
      <ControlledTextInput
        control={control}
        name="insulinValue"
        label="Insulina Basal (µU/mL)"
        keyboardType="decimal-pad"
        placeholder="Ej: 10"
        error={errors.insulinValue}
      />
      <ControlledTextInput
        control={control}
        name="glucoseValue"
        label="Glucosa en Ayunas (mg/dL)"
        keyboardType="decimal-pad"
        placeholder="Ej: 85"
        error={errors.glucoseValue}
      />

      {calculatedHoma && (
        <Text style={styles.calculatedValueText}>Índice HOMA-IR Calculado: {calculatedHoma.toFixed(2)}</Text>
      )}
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
  calculatedValueText: {
    ...theme.typography.bodyBold,
    textAlign: 'center',
    color: theme.colors.primary,
    marginTop: theme.spacing.m,
  },
});