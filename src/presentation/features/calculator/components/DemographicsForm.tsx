import { StyleSheet, View, TextStyle } from 'react-native';
import { Control, FieldErrors } from 'react-hook-form';
import Text from '@/presentation/components/common/Text';
import { ControlledTextInputFinal } from '@/presentation/components/common/ControlledTextInputFinal';
import { CalculatedValue } from '@/presentation/components/common/CalculatedValue';
import { theme } from '@/config/theme';
import { FormState } from '../useCalculatorForm';

type Props = {
  control: Control<FormState>;
  calculatedBmi: number | null;
  errors: FieldErrors<FormState>;
  getRangeValidation?: (fieldName: string) => import('../utils/rangeValidation').RangeValidation; // 🆕 Agregar prop para colores
};

const resolveFontWeight = (fw: TextStyle['fontWeight']): TextStyle['fontWeight'] => {
  return fw;
};

export const DemographicsForm = ({ control, calculatedBmi, errors, getRangeValidation }: Props) => { // 🆕 Agregar getRangeValidation
  const getBmiInterpretation = (bmi: number) => {
    if (bmi < 18.5) return { text: 'Bajo peso', type: 'warning' as const };
    if (bmi < 25) return { text: 'Peso normal', type: 'normal' as const };
    if (bmi < 30) return { text: 'Sobrepeso', type: 'warning' as const };
    return { text: 'Obesidad', type: 'danger' as const };
  };

  return (
    <View style={styles.container}>
      <Text style={styles.groupLabel}>Información Demográfica</Text>
      
      {/* 🆕 Indicador de sistema activo */}
      {getRangeValidation && (
        <View style={styles.activeIndicator}>
          <Text style={styles.activeText}>✅ Validación visual activa</Text>
        </View>
      )}
      
      <ControlledTextInputFinal
        control={control}
        name="age"
        label="Edad (años)"
        keyboardType="number-pad"
        placeholder="Ej: 32 años (prueba 45 para rojo)"
        iconName="person-outline"
        error={errors.age}
        rangeValidation={getRangeValidation?.('age')} // 🆕 Validación de rango
      />

      <ControlledTextInputFinal
        control={control}
        name="weight"
        label="Peso (kg)"
        keyboardType="decimal-pad"
        placeholder="Ej: 65 kg (prueba 30 para naranja)"
        iconName="fitness-outline"
        error={errors.weight}
        rangeValidation={getRangeValidation?.('weight')} // 🆕 Validación de rango
      />

      <ControlledTextInputFinal
        control={control}
        name="height"
        label="Altura (cm)"
        keyboardType="number-pad"
        placeholder="Ej: 165 cm (prueba 130 para naranja)"
        iconName="resize-outline"
        error={errors.height}
        rangeValidation={getRangeValidation?.('height')} // 🆕 Validación de rango
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
  activeIndicator: {
    backgroundColor: '#E8F5E8',
    borderColor: '#4CAF50',
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
  },
  activeText: {
    color: '#4CAF50',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 14,
  },
});