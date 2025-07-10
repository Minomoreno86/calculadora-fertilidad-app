
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Control, FieldValues, Path } from 'react-hook-form';
import Text from '../../../../presentation/components/common/Text';
import { ControlledTextInput } from '../../../../presentation/components/common/ControlledTextInput';
import { theme } from '../../../../config/theme';

type Props<TFormValues extends FieldValues> = {
  control: Control<TFormValues>;
  calculatedHoma: number | null;
};

export const LabTestsForm = <TFormValues extends FieldValues>({
  control,
  calculatedHoma,
}: Props<TFormValues>) => {
  return (
    <View style={styles.container}>
      <Text style={styles.groupLabel}>Resultados de Laboratorio</Text>

      <ControlledTextInput control={control} name={"amhValue" as Path<TFormValues>} label="Hormona Antimülleriana (AMH en ng/mL)" keyboardType="decimal-pad" placeholder="Ej: 1.8" />
      <ControlledTextInput control={control} name={"tshValue" as Path<TFormValues>} label="Hormona Tiroidea (TSH en µIU/mL)" keyboardType="decimal-pad" placeholder="Ej: 2.1" />
      <ControlledTextInput control={control} name={"prolactinValue" as Path<TFormValues>} label="Prolactina (ng/mL)" keyboardType="decimal-pad" placeholder="Ej: 15" />
      <ControlledTextInput control={control} name={"insulinValue" as Path<TFormValues>} label="Insulina Basal (µU/mL)" keyboardType="decimal-pad" placeholder="Ej: 10" />
      <ControlledTextInput control={control} name={"glucoseValue" as Path<TFormValues>} label="Glucosa en Ayunas (mg/dL)" keyboardType="decimal-pad" placeholder="Ej: 85" />

      {calculatedHoma && (
        <Text style={styles.calculatedValueText}>
          Índice HOMA-IR Calculado: {calculatedHoma.toFixed(2)}
        </Text>
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
