import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Control, FieldErrors } from 'react-hook-form';
import Text from '@/presentation/components/common/Text';
import { ControlledTextInput } from '@/presentation/components/common/ControlledTextInput';
import { useDynamicTheme } from '@/hooks/useDynamicTheme';
import { useLanguage } from '@/contexts/LanguageContext';
import { FormState } from '../types/calculator.types';

type Props = {
  control: Control<FormState>;
  errors: FieldErrors<FormState>;
};

export const MaleFactorForm = React.memo<Props>(({ control, errors }) => {
  // 🎨 TEMA DINÁMICO
  const theme = useDynamicTheme();
  const { t } = useLanguage();
  
  // 🎨 Crear estilos dinámicos
  const styles = createStyles(theme);
  
  return (
    <View style={styles.container}>
      <Text style={styles.groupLabel}>{t('male_factor.factor_masculino_espermatograma')}</Text>

      <ControlledTextInput
        control={control}
        name="spermConcentration"
        label={t('male_factor.concentracion_label')}
        keyboardType="decimal-pad"
        placeholder={t('male_factor.concentracion_placeholder')}
        error={errors.spermConcentration}
      />
      <ControlledTextInput
        control={control}
        name="spermProgressiveMotility"
        label={t('male_factor.motilidad_label')}
        keyboardType="decimal-pad"
        placeholder={t('male_factor.motilidad_placeholder')}
        error={errors.spermProgressiveMotility}
      />
      <ControlledTextInput
        control={control}
        name="spermNormalMorphology"
        label={t('male_factor.morfologia_label')}
        keyboardType="decimal-pad"
        placeholder={t('male_factor.morfologia_placeholder')}
        error={errors.spermNormalMorphology}
      />
      <ControlledTextInput
        control={control}
        name="semenVolume"
        label={t('male_factor.volumen_label')}
        keyboardType="decimal-pad"
        placeholder={t('male_factor.volumen_placeholder')}
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
