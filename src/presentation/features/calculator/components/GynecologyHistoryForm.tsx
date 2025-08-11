import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Control, FieldErrors, useWatch } from 'react-hook-form';

import Text from '@/presentation/components/common/Text';
import { ControlledTextInput } from '@/presentation/components/common/ControlledTextInput';
import { ControlledOptionSelector } from '@/presentation/components/common/ControlledOptionSelector';
import { ControlledSwitch } from '@/presentation/components/common/ControlledSwitch';
import { useDynamicTheme } from '@/hooks/useDynamicTheme';
import { useLanguage } from '@/contexts/LanguageContext';

import { OtbMethod } from '@/core/domain/models';
import { FormState } from '../types/calculator.types';

// 🚀 FASE 2C: Opciones memoizadas para evitar recreación en cada render
const ENDOMETRIOSIS_OPTIONS = [
  { label: 'Sin endometriosis', value: '0' },
  { label: 'Grado 1 - Mínima', value: '1' },
  { label: 'Grado 2 - Leve', value: '2' },
  { label: 'Grado 3 - Moderada', value: '3' },
  { label: 'Grado 4 - Severa', value: '4' },
];

const MYOMA_OPTIONS = [
  { label: 'Sin miomas', value: 'none' },
  { label: 'Submucoso (> 1 cm)', value: 'submucosal' },
  { label: 'Intramural (> 4 cm)', value: 'intramural_large' },
  { label: 'Subseroso', value: 'subserosal' },
];

const POLYP_OPTIONS = [
  { label: 'Sin pólipos', value: 'none' },
  { label: 'Pólipo pequeño (< 1 cm)', value: 'small' },
  { label: 'Pólipo grande (≥ 1 cm o múltiples)', value: 'large' },
  { label: 'Pólipo sobre ostium tubárico', value: 'ostium' },
];

const ADENOMYOSIS_OPTIONS = [
  { label: 'Sin adenomiosis', value: 'none' },
  { label: 'Adenomiosis focal', value: 'focal' },
  { label: 'Adenomiosis difusa', value: 'diffuse' },
];

const HSG_OPTIONS = [
  { label: 'No realizado / Desconocido', value: 'unknown' },
  { label: 'Normal', value: 'normal' },
  { label: 'Obstrucción unilateral', value: 'unilateral' },
  { label: 'Obstrucción bilateral', value: 'bilateral' },
  { label: 'Malformación uterina', value: 'malformacion' },
];

const OTB_METHOD_OPTIONS = [
  { label: 'Desconocido', value: OtbMethod.Unknown },
  { label: 'Clips', value: OtbMethod.Clips },
  { label: 'Anillos', value: OtbMethod.Rings },
  { label: 'Ligadura', value: OtbMethod.Ligation },
  { label: 'Cauterización Extensa', value: OtbMethod.ExtensiveCauterization },
  { label: 'Salpingectomía Parcial', value: OtbMethod.PartialSalpingectomy },
];

type Props = {
  control: Control<FormState>;
  errors: FieldErrors<FormState>;
};

export const GynecologyHistoryForm = React.memo<Props>(({ control, errors }) => {
  // 🎨 TEMA DINÁMICO
  const theme = useDynamicTheme();
  const { t } = useLanguage();
  
  // 🎨 Crear estilos dinámicos
  const styles = createStyles(theme);
  
  const hasPelvicSurgery = useWatch({ control, name: 'hasPelvicSurgery' });
  const hasOtb = useWatch({ control, name: 'hasOtb' });

  // 🚀 FASE 2C: Usar opciones traducidas dinámicamente
  const options = {
    endometriosis: [
      { label: t('gynecology.sin_endometriosis'), value: '0' },
      { label: t('gynecology.grado_1_minima'), value: '1' },
      { label: t('gynecology.grado_2_leve'), value: '2' },
      { label: t('gynecology.grado_3_moderada'), value: '3' },
      { label: t('gynecology.grado_4_severa'), value: '4' },
    ],
    myoma: [
      { label: t('gynecology.sin_miomas'), value: 'none' },
      { label: t('gynecology.submucoso'), value: 'submucosal' },
      { label: t('gynecology.intramural_grande'), value: 'intramural_large' },
      { label: t('gynecology.subseroso'), value: 'subserosal' },
    ],
    polyp: [
      { label: t('gynecology.sin_polipos'), value: 'none' },
      { label: t('gynecology.polipo_pequeno'), value: 'small' },
      { label: t('gynecology.polipo_grande'), value: 'large' },
      { label: t('gynecology.polipo_ostium'), value: 'ostium' },
    ],
    adenomyosis: [
      { label: t('gynecology.sin_adenomiosis'), value: 'none' },
      { label: t('gynecology.adenomiosis_focal'), value: 'focal' },
      { label: t('gynecology.adenomiosis_difusa'), value: 'diffuse' },
    ],
    hsg: [
      { label: t('gynecology.hsg_no_realizado'), value: 'unknown' },
      { label: t('gynecology.hsg_normal'), value: 'normal' },
      { label: t('gynecology.hsg_obstruccion_unilateral'), value: 'unilateral' },
      { label: t('gynecology.hsg_obstruccion_bilateral'), value: 'bilateral' },
      { label: t('gynecology.hsg_malformacion'), value: 'malformacion' },
    ],
    otbMethod: [
      { label: t('gynecology.otb_desconocido'), value: OtbMethod.Unknown },
      { label: t('gynecology.otb_clips'), value: OtbMethod.Clips },
      { label: t('gynecology.otb_anillos'), value: OtbMethod.Rings },
      { label: t('gynecology.otb_ligadura'), value: OtbMethod.Ligation },
      { label: t('gynecology.otb_cauterizacion'), value: OtbMethod.ExtensiveCauterization },
      { label: t('gynecology.otb_salpingectomia'), value: OtbMethod.PartialSalpingectomy },
    ],
  };

  return (
    <View style={styles.container}>
      <Text style={styles.groupLabel}>{t('gynecology.historia_ginecologica')}</Text>

      <ControlledTextInput
        control={control}
        name="infertilityDuration"
        label={t('gynecology.duracion_infertilidad')}
        keyboardType="numeric"
        placeholder={t('gynecology.duracion_infertilidad_placeholder')}
        error={errors.infertilityDuration}
      />
      <ControlledTextInput
        control={control}
        name="cycleLength"
        label={t('gynecology.duracion_ciclo')}
        keyboardType="numeric"
        placeholder={t('gynecology.duracion_ciclo_placeholder')}
        error={errors.cycleLength}
      />
      
      <ControlledOptionSelector
        control={control}
        name="endometriosisStage"
        label={t('gynecology.endometriosis')}
        options={options.endometriosis}
        error={errors.endometriosisStage}
      />
      <ControlledOptionSelector
        control={control}
        name="myomaType"
        label={t('gynecology.miomas_uterinos')}
        options={options.myoma}
        error={errors.myomaType}
      />
      <ControlledOptionSelector
        control={control}
        name="polypType"
        label={t('gynecology.polipos_endometriales')}
        options={options.polyp}
        error={errors.polypType}
      />
      <ControlledOptionSelector
        control={control}
        name="adenomyosisType"
        label={t('gynecology.adenomiosis')}
        options={options.adenomyosis}
        error={errors.adenomyosisType}
      />
      <ControlledOptionSelector
        control={control}
        name="hsgResult"
        label={t('gynecology.histerosalpingografia')}
        options={options.hsg}
        error={errors.hsgResult}
      />
      <ControlledSwitch control={control} name="hasPcos" label={t('gynecology.tiene_sop')} />
      <ControlledSwitch
        control={control}
        name="hasPelvicSurgery"
        label={t('gynecology.cirugias_pelvicas')}
      />
      {hasPelvicSurgery && (
        <ControlledTextInput
          control={control}
          name="numberOfPelvicSurgeries"
          label={t('gynecology.numero_cirugias')}
          keyboardType="numeric"
          placeholder={t('gynecology.numero_cirugias_placeholder')}
          error={errors.numberOfPelvicSurgeries}
        />
      )}
      <ControlledSwitch control={control} name="hasOtb" label={t('gynecology.ligadura_trompas')} />
      {hasOtb && (
        <ControlledOptionSelector
          control={control}
          name="otbMethod"
          label={t('gynecology.metodo_ligadura')}
          options={options.otbMethod}
          error={errors.otbMethod}
        />
      )}
    </View>
  );
});

// 🚀 FASE 2C: Asignación de displayName para React DevTools
GynecologyHistoryForm.displayName = 'GynecologyHistoryForm';

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

export default GynecologyHistoryForm;