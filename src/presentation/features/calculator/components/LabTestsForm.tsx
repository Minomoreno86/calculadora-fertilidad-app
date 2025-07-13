import React, { memo, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { Control, FieldErrors } from 'react-hook-form';
import Text from '@/presentation/components/common/Text';
import { ControlledTextInput } from '@/presentation/components/common/ControlledTextInput';
import { CalculatedValue } from '@/presentation/components/common/CalculatedValue';
import { theme } from '@/config/theme';
import { FormState } from '../useCalculatorForm';

type Props = {
  control: Control<FormState>;
  calculatedHoma: number | null;
  errors: FieldErrors<FormState>;
};

export const LabTestsForm = memo<Props>(({ control, calculatedHoma, errors }) => {
  // 🚀 FASE 2C: Memoizar función de interpretación
  const getHomaInterpretation = useCallback((homa: number) => {
    if (homa <= 2.5) return { text: 'Sensibilidad normal a la insulina', type: 'normal' as const };
    if (homa <= 3.8) return { text: 'Resistencia leve a la insulina', type: 'warning' as const };
    return { text: 'Resistencia significativa a la insulina', type: 'danger' as const };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.groupLabel}>Resultados de Laboratorio</Text>

      <ControlledTextInput
        control={control}
        name="amhValue"
        label="Hormona Antimülleriana (AMH en ng/mL)"
        keyboardType="decimal-pad"
        placeholder="Ej: 1.8 (Normal: 1-4, acepta cualquier valor)"
        error={errors.amhValue}
      />
      <ControlledTextInput
        control={control}
        name="tshValue"
        label="Hormona Tiroidea (TSH en µIU/mL)"
        keyboardType="decimal-pad"
        placeholder="Ej: 2.1 (Normal: 0.5-2.5, acepta cualquier valor)"
        error={errors.tshValue}
      />
      <ControlledTextInput
        control={control}
        name="prolactinValue"
        label="Prolactina (ng/mL)"
        keyboardType="decimal-pad"
        placeholder="Ej: 15 (Normal: <25, acepta cualquier valor)"
        error={errors.prolactinValue}
      />
      <ControlledTextInput
        control={control}
        name="insulinValue"
        label="Insulina Basal (µU/mL)"
        keyboardType="decimal-pad"
        placeholder="Ej: 10 (acepta cualquier valor)"
        error={errors.insulinValue}
      />
      <ControlledTextInput
        control={control}
        name="glucoseValue"
        label="Glucosa en Ayunas (mg/dL)"
        keyboardType="decimal-pad"
        placeholder="Ej: 85 (acepta cualquier valor)"
        error={errors.glucoseValue}
      />

      {calculatedHoma && (
        <CalculatedValue
          label="Índice HOMA-IR"
          value={calculatedHoma}
          interpretation={getHomaInterpretation(calculatedHoma).text}
          type={getHomaInterpretation(calculatedHoma).type}
        />
      )}
    </View>
  );
});

// 🚀 FASE 2C: Asignación de displayName para React DevTools
LabTestsForm.displayName = 'LabTestsForm';

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