import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import Text from '@/presentation/components/common/Text';
import { ControlledTextInput } from '@/presentation/components/common/ControlledTextInput';
import { useDynamicTheme } from '@/hooks/useDynamicTheme';
import { Control, FieldErrors } from 'react-hook-form';
import { FormState } from '../useCalculatorFormOptimized';

type Props = {
  control: Control<FormState>;
  errors: FieldErrors<FormState>;
};

export const MaleFactorForm = memo<Props>(({ control, errors }) => {
  // 🎨 TEMA DINÁMICO
  const theme = useDynamicTheme();
  
  // 🎨 Crear estilos dinámicos
  const styles = createStyles(theme);
  
  return (
    <View style={styles.container}>
      <Text style={styles.groupLabel}>Factor Masculino (Espermatograma)</Text>

      <ControlledTextInput
        control={control}
        name="spermConcentration"
        label="Concentración (millones/mL)"
        keyboardType="decimal-pad"
        placeholder="Ej: 45 (Normal: ≥15, acepta cualquier valor)"
        error={errors.spermConcentration}
      />
      <ControlledTextInput
        control={control}
        name="spermProgressiveMotility"
        label="Motilidad Progresiva (%)"
        keyboardType="decimal-pad"
        placeholder="Ej: 50 (Normal: ≥32%, acepta cualquier valor)"
        error={errors.spermProgressiveMotility}
      />
      <ControlledTextInput
        control={control}
        name="spermNormalMorphology"
        label="Morfología Normal (%)"
        keyboardType="decimal-pad"
        placeholder="Ej: 5 (Normal: ≥4%, acepta cualquier valor)"
        error={errors.spermNormalMorphology}
      />
      <ControlledTextInput
        control={control}
        name="semenVolume"
        label="Volumen Seminal (mL)"
        keyboardType="decimal-pad"
        placeholder="Ej: 2.5 (Normal: ≥1.5, acepta cualquier valor)"
        error={errors.semenVolume}
      />
    </View>
  );
});

// 🚀 FASE 2C: Asignación de displayName para React DevTools
MaleFactorForm.displayName = 'MaleFactorForm';

// 🎨 Función para crear estilos dinámicos
const createStyles = (theme: ReturnType<typeof useDynamicTheme>) => StyleSheet.create({
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
