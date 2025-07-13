/**
 * SINERGIA PERFECTA - Calculadora con validación médica integrada
 * Todos los componentes trabajando en armonía total
 */

import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { Button } from '@/presentation/components/common/Button';
import { ProgressStepper } from '@/presentation/components/common/ProgressStepper';
import { InfoCard } from '@/presentation/components/common/InfoCard';
import { useSimpleValidation } from '@/core/domain/validation/useSimpleValidation';
import { useCalculatorForm } from './useCalculatorForm';
import { theme } from '@/config/theme';

// Componentes de formulario en perfecta sinergia
import { DemographicsFormFixed as DemographicsForm } from './components/DemographicsFormFixed';
import { GynecologyHistoryForm } from './components/GynecologyHistoryForm';
import { LabTestsForm } from './components/LabTestsForm';
import { MaleFactorForm } from './components/MaleFactorForm';

export const EnhancedCalculatorScreen = () => {
  // Hook principal del formulario
  const {
    control,
    calculatedBmi,
    calculatedHoma,
    handleCalculate,
    formState: { errors },
    isLoading,
    watch,
    currentStep,
    canCalculate: formCanCalculate
  } = useCalculatorForm();
  
  // Hook de validación en SINERGIA PERFECTA
  const watchedValues = watch();
  const {
    ageValidation,
    bmiValidation,
    cycleValidation,
    amhValidation,
    spermValidation,
    completeness,
    canCalculate: validationCanCalculate,
    completionPercentage,
    getClinicalScore,
    getRecommendations
  } = useSimpleValidation(watchedValues);

  const stepLabels = ['Demografia', 'Ginecología', 'Laboratorio', 'Factor Masculino'];
  
  // SINERGIA: Combinar validaciones del formulario y clínicas
  const finalCanCalculate = formCanCalculate && validationCanCalculate;
  const clinicalScore = getClinicalScore();
  const recommendations = getRecommendations();

  const handleCalculateWithValidation = () => {
    try {
      handleCalculate();
    } catch (error) {
      console.error('Error durante cálculo:', error);
    }
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      {/* Header con información de sinergia */}
      <View style={styles.header}>
        <InfoCard
          type="tip"
          title="Calculadora de Fertilidad Avanzada"
          message={`Esta calculadora acepta TODOS los valores, incluso fuera de rangos normales. Progreso: ${completionPercentage}% | Score clínico: ${clinicalScore}/100`}
        />
      </View>

      {/* Progreso inteligente */}
      <View style={styles.progressContainer}>
        <ProgressStepper
          currentStep={currentStep}
          totalSteps={4}
          stepLabels={stepLabels}
        />
      </View>

      {/* SINERGIA: Alertas clínicas dinámicas */}
      {ageValidation.type === 'warning' && (
        <InfoCard
          type="warning"
          title="Evaluación de Edad"
          message={ageValidation.message}
        />
      )}

      {bmiValidation.type === 'warning' && (
        <InfoCard
          type="warning"
          title="Evaluación Metabólica"
          message={bmiValidation.message}
        />
      )}

      {cycleValidation && cycleValidation.type === 'warning' && (
        <InfoCard
          type="warning"
          title="Ciclo Menstrual"
          message={cycleValidation.message}
        />
      )}

      {amhValidation && amhValidation.type === 'warning' && (
        <InfoCard
          type="warning"
          title="Reserva Ovárica"
          message={amhValidation.message}
        />
      )}

      {spermValidation && spermValidation.type === 'warning' && (
        <InfoCard
          type="warning"
          title="Factor Masculino"
          message={spermValidation.message}
        />
      )}

      {/* Formularios en sinergia perfecta */}
      <View style={styles.formContainer}>
        <DemographicsForm
          control={control}
          calculatedBmi={calculatedBmi}
          errors={errors}
        />
        
        <GynecologyHistoryForm 
          control={control} 
          errors={errors} 
        />
        
        <LabTestsForm 
          control={control} 
          calculatedHoma={calculatedHoma} 
          errors={errors} 
        />

        <MaleFactorForm 
          control={control} 
          errors={errors} 
        />
      </View>

      {/* Recomendaciones clínicas dinámicas */}
      {recommendations.length > 0 && (
        <View style={styles.recommendationsContainer}>
          <InfoCard
            type="tip"
            title="Recomendaciones Clínicas"
            message={recommendations.join(' • ')}
          />
        </View>
      )}

      {/* Botón con validación integrada */}
      <View style={styles.buttonContainer}>
        <Button
          title="Generar Informe de Fertilidad"
          onPress={handleCalculateWithValidation}
          variant="primary"
          size="large"
          fullWidth
          loading={isLoading}
          disabled={isLoading || !finalCanCalculate}
          iconName="document-text-outline"
        />
      </View>

      {/* Mensaje de estado con sinergia */}
      {!finalCanCalculate && (
        <InfoCard
          type="warning"
          title="Completar Datos"
          message={completeness.message}
        />
      )}

      {/* Score clínico final */}
      {finalCanCalculate && (
        <InfoCard
          type="success"
          title="Evaluación Lista"
          message={`Score clínico: ${clinicalScore}/100. Datos suficientes para análisis completo.`}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 20,
    backgroundColor: theme.colors.card,
    marginBottom: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  progressContainer: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  formContainer: {
    margin: 20,
    padding: 20,
    backgroundColor: theme.colors.card,
    borderRadius: 16,
  },
  recommendationsContainer: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  buttonContainer: {
    marginHorizontal: 20,
    marginBottom: 32,
  },
});

/**
 * RESUMEN DE MEJORAS AGREGADAS:
 * 
 * ✅ Validación clínica en tiempo real
 * ✅ Alertas médicas específicas por campo
 * ✅ Interpretaciones automáticas (ej: "AMH bajo para la edad")
 * ✅ Recomendaciones clínicas contextuales
 * ✅ Score de validación clínica
 * ✅ Prevención de cálculos con datos inválidos
 * ✅ Feedback visual de progreso
 * ✅ Referencias científicas (WHO 2021, ASRM, etc.)
 * 
 * TU CÓDIGO EXISTENTE PERMANECE INTACTO:
 * - Mismos formularios
 * - Misma navegación
 * - Mismos cálculos BMI/HOMA-IR
 * - Misma UI base
 * 
 * SOLO SE AGREGAN CAPAS DE VALIDACIÓN MÉDICA ENCIMA
 */