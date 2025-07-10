import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Control, FieldValues, Path } from 'react-hook-form';
import Text from '@/presentation/components/common/Text';
import { ControlledTextInput } from '@/presentation/components/common/ControlledTextInput';
import { ControlledOptionSelector } from '@/presentation/components/common/ControlledOptionSelector';
import { ControlledSwitch } from '@/presentation/components/common/ControlledSwitch';
import { theme } from '@/config/theme';
import { MyomaType, AdenomyosisType, PolypType, HsgResult } from '@/core/domain/models';

type Props<TFormValues extends FieldValues> = {
  control: Control<TFormValues>;
};

export const GynecologyHistoryForm = <TFormValues extends FieldValues>({ control }: Props<TFormValues>) => {
  const options = {
    endometriosis: [
      { label: 'Sin endometriosis', value: '0' },
      { label: 'Grado 1 - Mínima', value: '1' },
      { label: 'Grado 2 - Leve', value: '2' },
      { label: 'Grado 3 - Moderada', value: '3' },
      { label: 'Grado 4 - Severa', value: '4' },
    ],
    myoma: [
      { label: 'Sin miomas', value: 'none' },
      { label: 'Submucoso (> 1 cm)', value: 'submucosal' },
      { label: 'Intramural (> 4 cm)', value: 'intramural_large' },
      { label: 'Subseroso', value: 'subserosal' },
    ],
    polyp: [
      { label: 'Sin pólipos', value: 'none' },
      { label: 'Pólipo pequeño (< 1 cm)', value: 'small' },
      { label: 'Pólipo grande (≥ 1 cm o múltiples)', value: 'large' },
      { label: 'Pólipo sobre ostium tubárico', value: 'ostium' },
    ],
    adenomyosis: [
      { label: 'Sin adenomiosis', value: 'none' },
      { label: 'Adenomiosis focal', value: 'focal' },
      { label: 'Adenomiosis difusa', value: 'diffuse' },
    ],
    hsg: [
      { label: 'No realizado / Desconocido', value: 'unknown' },
      { label: 'Normal', value: 'normal' },
      { label: 'Obstrucción unilateral', value: 'unilateral' },
      { label: 'Obstrucción bilateral', value: 'bilateral' },
      { label: 'Malformación uterina', value: 'malformacion' },
    ],
  };

  return (
    <View style={styles.container}>
      <Text style={styles.groupLabel}>Historia Ginecológica</Text>

      <ControlledTextInput
        control={control}
        name={'infertilityDuration' as Path<TFormValues>}
        label="Duración de infertilidad (años)"
        keyboardType="number-pad"
        placeholder="Ej: 2"
      />
      <ControlledTextInput
        control={control}
        name={'cycleLength' as Path<TFormValues>}
        label="Duración promedio del ciclo (días)"
        keyboardType="number-pad"
        placeholder="Ej: 28"
      />

      <ControlledOptionSelector
        control={control}
        name={'endometriosisStage' as Path<TFormValues>}
        label="Endometriosis"
        options={options.endometriosis}
      />
      <ControlledOptionSelector
        control={control}
        name={'myomaType' as Path<TFormValues>}
        label="Miomas Uterinos"
        options={options.myoma}
      />
      <ControlledOptionSelector
        control={control}
        name={'polypType' as Path<TFormValues>}
        label="Pólipos Endometriales"
        options={options.polyp}
      />
      <ControlledOptionSelector
        control={control}
        name={'adenomyosisType' as Path<TFormValues>}
        label="Adenomiosis"
        options={options.adenomyosis}
      />
      <ControlledOptionSelector
        control={control}
        name={'hsgResult' as Path<TFormValues>}
        label="Resultado Histerosalpingografía (HSG)"
        options={options.hsg}
      />

      <ControlledSwitch control={control} name={'hasPcos' as Path<TFormValues>} label="¿Tiene SOP diagnosticado?" />
      <ControlledSwitch
        control={control}
        name={'hasPelvicSurgery' as Path<TFormValues>}
        label="¿Cirugías pélvicas previas?"
      />
      {control._formValues.hasPelvicSurgery && (
        <ControlledTextInput
          control={control}
          name={'numberOfPelvicSurgeries' as Path<TFormValues>}
          label="Número de cirugías pélvicas"
          keyboardType="number-pad"
          placeholder="Ej: 1"
        />
      )}
      <ControlledSwitch control={control} name={'hasOtb' as Path<TFormValues>} label="¿Ligadura de trompas (OTB)?" />
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
