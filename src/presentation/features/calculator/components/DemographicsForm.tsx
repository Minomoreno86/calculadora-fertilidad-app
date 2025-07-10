import { StyleSheet, View } from 'react-native';
import { Control, FieldValues, Path } from 'react-hook-form';
import Text from '@/presentation/components/common/Text';
import { ControlledTextInput } from '@/presentation/components/common/ControlledTextInput';
import { theme } from '@/config/theme';

type Props<TFormValues extends FieldValues> = {
  control: Control<TFormValues>;
  calculatedBmi: number | null;
};

export const DemographicsForm = <TFormValues extends FieldValues>({ control, calculatedBmi }: Props<TFormValues>) => {
  return (
    <View style={styles.container}>
      <Text style={styles.groupLabel}>Perfil Básico</Text>

      <ControlledTextInput
        control={control}
        name={'age' as Path<TFormValues>}
        label="Edad (años)"
        keyboardType="number-pad"
        placeholder="Ej: 32"
        iconName="person-outline"
      />

      <ControlledTextInput
        control={control}
        name={'weight' as Path<TFormValues>}
        label="Peso (kg)"
        keyboardType="decimal-pad"
        placeholder="Ej: 65"
        iconName="fitness-outline"
      />

      <ControlledTextInput
        control={control}
        name={'height' as Path<TFormValues>}
        label="Altura (cm)"
        keyboardType="number-pad"
        placeholder="Ej: 165"
        iconName="resize-outline"
      />

      {calculatedBmi !== null && (
        <Text style={styles.calculatedValueText}>IMC Calculado: {calculatedBmi.toFixed(2)}</Text>
      )}
    </View>
  );
};

// Extract fontWeight logic to variables to ensure valid values for React Native
const resolveFontWeight = (fw: any): any => {
  if (typeof fw === 'string') {
    if (fw === 'regular') return '400';
    if (fw === 'bold') return '700';
    if (
      [
        'normal',
        'bold',
        '100',
        '200',
        '300',
        '400',
        '500',
        '600',
        '700',
        '800',
        '900',
        'ultralight',
        'thin',
        'light',
        'medium',
        'semibold',
        'extrabold',
        'black',
      ].includes(fw)
    ) {
      return fw;
    }
    // If it's a numeric string, return as is
    if (!isNaN(Number(fw))) return fw;
    return '400';
  }
  return fw;
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.l,
  },
  groupLabel: {
    ...theme.typography.h3,
    fontWeight: resolveFontWeight(theme.typography.h3.fontWeight),
    marginBottom: theme.spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingBottom: theme.spacing.xs,
  },
  calculatedValueText: {
    ...theme.typography.bodyBold,
    fontWeight: resolveFontWeight(theme.typography.bodyBold.fontWeight),
    textAlign: 'center',
    color: theme.colors.primary,
    marginTop: theme.spacing.m,
  },
});
