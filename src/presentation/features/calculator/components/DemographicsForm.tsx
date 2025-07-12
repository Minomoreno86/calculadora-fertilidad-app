import { StyleSheet, View, TextStyle } from 'react-native';
import { Control, FieldErrors } from 'react-hook-form';
import Text from '@/presentation/components/common/Text';
import { ControlledTextInput } from '@/presentation/components/common/ControlledTextInput';
import { CalculatedValue } from '@/presentation/components/common/CalculatedValue';
import { theme } from '@/config/theme';
import { FormState } from '../useCalculatorForm';

type Props = {
  control: Control<FormState>;
  calculatedBmi: number | null;
  errors: FieldErrors<FormState>;
};

const resolveFontWeight = (fw: TextStyle['fontWeight']): TextStyle['fontWeight'] => {
  return fw;
};

export const DemographicsForm = ({ control, calculatedBmi, errors }: Props) => {
  const getBmiInterpretation = (bmi: number) => {
    if (bmi < 18.5) return { text: 'Bajo peso', type: 'warning' as const };
    if (bmi < 25) return { text: 'Peso normal', type: 'normal' as const };
    if (bmi < 30) return { text: 'Sobrepeso', type: 'warning' as const };
    return { text: 'Obesidad', type: 'danger' as const };
  };

  return (
    <View style={styles.container}>
      <Text style={styles.groupLabel}>Información Demográfica</Text>
      
      <ControlledTextInput
        control={control}
        name="age"
        label="Edad (años)"
        keyboardType="number-pad"
        placeholder="Ej: 32"
        iconName="person-outline"
        error={errors.age}
      />

      <ControlledTextInput
        control={control}
        name="weight"
        label="Peso (kg)"
        keyboardType="decimal-pad"
        placeholder="Ej: 65"
        iconName="fitness-outline"
        error={errors.weight}
      />

      <ControlledTextInput
        control={control}
        name="height"
        label="Altura (cm)"
        keyboardType="number-pad"
        placeholder="Ej: 165"
        iconName="resize-outline"
        error={errors.height}
      />

      {calculatedBmi !== null && (
        <CalculatedValue
          label="Índice de Masa Corporal (IMC)"
          value={calculatedBmi}
          unit="kg/m²"
          interpretation={getBmiInterpretation(calculatedBmi).text}
          type={getBmiInterpretation(calculatedBmi).type}
        />
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
    fontWeight: resolveFontWeight(theme.typography.h3.fontWeight),
    marginBottom: theme.spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingBottom: theme.spacing.xs,
    color: theme.colors.primary,
  },
});
