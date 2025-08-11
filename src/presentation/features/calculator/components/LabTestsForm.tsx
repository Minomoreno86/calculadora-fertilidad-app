import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Control, FieldErrors } from 'react-hook-form';
import Text from '@/presentation/components/common/Text';
import { ControlledTextInput } from '@/presentation/components/common/ControlledTextInput';
import { CalculatedValue } from '@/presentation/components/common/CalculatedValue';
import { useDynamicTheme } from '@/hooks/useDynamicTheme';
import { useLanguage } from '@/contexts/LanguageContext';
import { FormState } from '../types/calculator.types';

type Props = {
  control: Control<FormState>;
  calculatedHoma: number | null;
  errors: FieldErrors<FormState>;
};

export const LabTestsForm = React.memo<Props>(({ control, calculatedHoma, errors }) => {
  // 🎨 TEMA DINÁMICO
  const theme = useDynamicTheme();
  const { t } = useLanguage();
  
  // 🎨 Crear estilos dinámicos
  const styles = createStyles(theme);
  
  // 🚀 FASE 2C: Memoizar función de interpretación
  const getHomaInterpretation = React.useCallback((homa: number) => {
    if (homa <= 2.5) return { text: t('laboratory.sensibilidad_normal'), type: 'normal' as const };
    if (homa <= 3.8) return { text: t('laboratory.resistencia_leve'), type: 'warning' as const };
    return { text: t('laboratory.resistencia_significativa'), type: 'danger' as const };
  }, [t]);

  return (
    <View style={styles.container}>
      <Text style={styles.groupLabel}>{t('laboratory.resultados_laboratorio')}</Text>

      <ControlledTextInput
        control={control}
        name="amhValue"
        label={t('laboratory.amh_label')}
        keyboardType="decimal-pad"
        placeholder={t('laboratory.amh_placeholder')}
        error={errors.amhValue}
      />
      <ControlledTextInput
        control={control}
        name="tshValue"
        label={t('laboratory.tsh_label')}
        keyboardType="decimal-pad"
        placeholder={t('laboratory.tsh_placeholder')}
        error={errors.tshValue}
      />
      <ControlledTextInput
        control={control}
        name="prolactinValue"
        label={t('laboratory.prolactina_label')}
        keyboardType="decimal-pad"
        placeholder={t('laboratory.prolactina_placeholder')}
        error={errors.prolactinValue}
      />
      <ControlledTextInput
        control={control}
        name="insulinValue"
        label={t('laboratory.insulina_label')}
        keyboardType="decimal-pad"
        placeholder={t('laboratory.insulina_placeholder')}
        error={errors.insulinValue}
      />
      <ControlledTextInput
        control={control}
        name="glucoseValue"
        label={t('laboratory.glucosa_label')}
        keyboardType="decimal-pad"
        placeholder={t('laboratory.glucosa_placeholder')}
        error={errors.glucoseValue}
      />

      {calculatedHoma && (
        <CalculatedValue
          label={t('laboratory.homa_label')}
          value={calculatedHoma}
          unit=""
          interpretation={getHomaInterpretation(calculatedHoma)}
        />
      )}
    </View>
  );
});

// 🚀 FASE 2C: Asignación de displayName para React DevTools
LabTestsForm.displayName = 'LabTestsForm';

// 🎨 Función para crear estilos dinámicos
const createStyles = (theme: ReturnType<typeof useDynamicTheme>) => StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 20,
    padding: 20,
    shadowColor: theme.colors.shadow || '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
    gap: 16,
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