/**
 * DemographicsForm - Formulario demográfico profesional con tema dinámico
 * 
 * Características:
 * - Integración con validación clínica profesional
 * - Alertas clínicas contextuales
 * - Cálculo e interpretación médica del BMI
 * - Soporte completo para modo claro/oscuro
 * - Accesibilidad completa (a11y)
 * 
 * @author AEC-D (Arquitecto Experto Clínico-Digital)
 * @version 3.0 - Tema dinámico integrado
 */

import { StyleSheet, View } from 'react-native';
import { Control, FieldErrors } from 'react-hook-form';
import Text from '@/presentation/components/common/Text';
import { ControlledTextInputFinal } from '@/presentation/components/common/ControlledTextInputFinal';
import { OptimizedNumericInput } from '@/presentation/components/common/OptimizedNumericInput';
import { CalculatedValue } from '@/presentation/components/common/CalculatedValue';
import { useDynamicTheme } from '@/hooks/useDynamicTheme';
import { FormState } from '../useCalculatorFormOptimized';

type Props = {
  control: Control<FormState>;
  calculatedBmi: number | null;
  errors: FieldErrors<FormState>;
  getRangeValidation?: (fieldName: string) => import('../utils/rangeValidation').RangeValidation;
};

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
  fieldContainer: {
    marginBottom: theme.spacing.s,
  },
  bmiContainer: {
    marginTop: theme.spacing.m,
    padding: theme.spacing.m,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: theme.isDark ? theme.colors.black : '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: theme.isDark ? 0.3 : 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  clinicalNoteContainer: {
    marginTop: theme.spacing.xs,
    padding: theme.spacing.xs,
    backgroundColor: theme.colors.background,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.info,
  },
  clinicalNote: {
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
    lineHeight: 18,
  },
});

export const DemographicsForm = ({ 
  control, 
  calculatedBmi, 
  errors, 
  getRangeValidation
}: Props) => {
  
  // 🎨 TEMA DINÁMICO
  const theme = useDynamicTheme();

  // 🎨 Crear estilos dinámicos basados en el tema actual
  const styles = createStyles(theme);
  
  // 🏥 Interpretación clínica profesional del BMI basada en evidencia
  const getBmiClinicalInterpretation = (bmi: number) => {
    if (bmi < 18.5) {
      return { 
        text: 'Bajo peso (puede afectar fertilidad)', 
        type: 'warning' as const,
        clinicalNote: 'Riesgo de amenorrea y anovulación'
      };
    }
    if (bmi < 25) {
      return { 
        text: 'Peso saludable (óptimo para fertilidad)', 
        type: 'normal' as const,
        clinicalNote: 'Rango ideal para concepción'
      };
    }
    if (bmi < 30) {
      return { 
        text: 'Sobrepeso (puede reducir fertilidad)', 
        type: 'warning' as const,
        clinicalNote: 'Posible resistencia a insulina'
      };
    }
    return { 
      text: 'Obesidad (reduce significativamente fertilidad)', 
      type: 'danger' as const,
      clinicalNote: 'Mayor riesgo de anovulación y complicaciones'
    };
  };

  return (
    <View 
      style={styles.container}
      accessibilityLabel="Información demográfica"
    >
      <Text style={styles.groupLabel}>Información Demográfica</Text>
      
      {/* 🩺 Campo Edad */}
      <View style={styles.fieldContainer}>
        <OptimizedNumericInput
          control={control}
          name="age"
          label="Edad (años)"
          placeholder="Ej: 32 años"
          iconName="person-outline"
          error={errors.age}
          rangeValidation={getRangeValidation?.('age')}
          debounceTime={500}
          autoDismissKeyboard={true}
          enableRealTimeValidation={true}
        />
      </View>

      {/* 📏 Campo Altura */}
      <View style={styles.fieldContainer}>
        <OptimizedNumericInput
          control={control}
          name="height"
          label="Altura (cm)"
          placeholder="Ej: 165 cm"
          iconName="resize-outline"
          error={errors.height}
          rangeValidation={getRangeValidation?.('height')}
          debounceTime={300}
          autoDismissKeyboard={true}
          enableRealTimeValidation={true}
        />
      </View>

      {/* ⚖️ Campo Peso */}
      <View style={styles.fieldContainer}>
        <OptimizedNumericInput
          control={control}
          name="weight"
          label="Peso (kg)"
          placeholder="Ej: 65 kg"
          iconName="fitness-outline"
          error={errors.weight}
          rangeValidation={getRangeValidation?.('weight')}
          debounceTime={300}
          autoDismissKeyboard={true}
          enableRealTimeValidation={true}
        />
      </View>

      {/* 📊 BMI Calculado con Interpretación Clínica */}
      {calculatedBmi && (
        <View style={styles.bmiContainer}>
          <CalculatedValue
            label="Índice de Masa Corporal (BMI)"
            value={calculatedBmi}
            unit="kg/m²"
            interpretation={getBmiClinicalInterpretation(calculatedBmi)}
          />
          
          {/* 🏥 Nota clínica profesional */}
          <View style={styles.clinicalNoteContainer}>
            <Text style={styles.clinicalNote}>
              💡 {getBmiClinicalInterpretation(calculatedBmi).clinicalNote}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};
