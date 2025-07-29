import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Control, FieldErrors, useWatch } from 'react-hook-form';
import Text from '@/presentation/components/common/Text';
import { ControlledTextInput } from '@/presentation/components/common/ControlledTextInput';
import { ControlledOptionSelector } from '@/presentation/components/common/ControlledOptionSelector';
import { ControlledSwitch } from '@/presentation/components/common/ControlledSwitch';
import { useDynamicTheme } from '@/hooks/useDynamicTheme';
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
  
  // 🎨 Crear estilos dinámicos
  const styles = createStyles(theme);
  
  const hasPelvicSurgery = useWatch({ control, name: 'hasPelvicSurgery' });
  const hasOtb = useWatch({ control, name: 'hasOtb' });

  // 🚀 FASE 2C: Usar opciones memoizadas en lugar de recrear en cada render
  const options = {
    endometriosis: ENDOMETRIOSIS_OPTIONS,
    myoma: MYOMA_OPTIONS,
    polyp: POLYP_OPTIONS,
    adenomyosis: ADENOMYOSIS_OPTIONS,
    hsg: HSG_OPTIONS,
    otbMethod: OTB_METHOD_OPTIONS,
  };

  return (
    <View style={styles.container}>
      <Text style={styles.groupLabel}>Historia Ginecológica</Text>

      <ControlledTextInput
        control={control}
        name="infertilityDuration"
        label="Duración de infertilidad (años)"
        keyboardType="numeric"
        placeholder="Ej: 2 (acepta cualquier duración)"
        error={errors.infertilityDuration}
      />
      <ControlledTextInput
        control={control}
        name="cycleLength"
        label="Duración promedio del ciclo (días)"
        keyboardType="numeric"
        placeholder="Ej: 28 (Normal: 21-35, acepta cualquier valor)"
        error={errors.cycleLength}
      />
      
      <ControlledOptionSelector
        control={control}
        name="endometriosisStage"
        label="Endometriosis"
        options={options.endometriosis}
        error={errors.endometriosisStage}
      />
      <ControlledOptionSelector
        control={control}
        name="myomaType"
        label="Miomas Uterinos"
        options={options.myoma}
        error={errors.myomaType}
      />
      <ControlledOptionSelector
        control={control}
        name="polypType"
        label="Pólipos Endometriales"
        options={options.polyp}
        error={errors.polypType}
      />
      <ControlledOptionSelector
        control={control}
        name="adenomyosisType"
        label="Adenomiosis"
        options={options.adenomyosis}
        error={errors.adenomyosisType}
      />
      <ControlledOptionSelector
        control={control}
        name="hsgResult"
        label="Resultado Histerosalpingografía (HSG)"
        options={options.hsg}
        error={errors.hsgResult}
      />
      <ControlledSwitch control={control} name="hasPcos" label="¿Tiene SOP diagnosticado?" />
      <ControlledSwitch
        control={control}
        name="hasPelvicSurgery"
        label="¿Cirugías pélvicas previas?"
      />
      {hasPelvicSurgery && (
        <ControlledTextInput
          control={control}
          name="numberOfPelvicSurgeries"
          label="Número de cirugías pélvicas"
          keyboardType="numeric"
          placeholder="Ej: 1"
          error={errors.numberOfPelvicSurgeries}
        />
      )}
      <ControlledSwitch control={control} name="hasOtb" label="¿Ligadura de trompas (OTB)?" />
      {hasOtb && (
        <ControlledOptionSelector
          control={control}
          name="otbMethod"
          label="Método de Ligadura de Trompas (OTB)"
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

export default GynecologyHistoryForm;