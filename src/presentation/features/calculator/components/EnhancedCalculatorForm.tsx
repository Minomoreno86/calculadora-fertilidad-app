// ===================================================================
// 🚀 CALCULADORA MEJORADA CON VALIDACIÓN PARALELA INTEGRADA
// ===================================================================

// Declaración global para React Native
declare const __DEV__: boolean;

import React, { memo, useState } from 'react';
import { ScrollView, StyleSheet, View, Alert, TouchableOpacity } from 'react-native';
import Text from '@/presentation/components/common/Text';
import Box from '@/presentation/components/common/Box';
import { theme } from '@/config/theme';

// Componentes de formulario existentes
import { DemographicsForm } from './DemographicsForm';
import { GynecologyHistoryForm } from './GynecologyHistoryForm';
import { LabTestsForm } from './LabTestsForm';
import { MaleFactorForm } from './MaleFactorForm';

// Componente nuevo de monitoreo
import { CalculatorPerformanceMonitor } from './CalculatorPerformanceMonitor';

// Hook integrado
import { useCalculatorWithParallelValidation } from '../hooks/useCalculatorWithParallelValidation';
import type { FormState } from '../useCalculatorForm';
import { Control, FieldErrors } from 'react-hook-form';

interface CalculatorStep {
  id: string;
  title: string;
  component: React.ComponentType<{
    control: Control<FormState>;
    errors: FieldErrors<FormState>;
    calculatedBmi?: number | null;
    calculatedHoma?: number | null;
  }>;
  icon: string;
}

const CALCULATOR_STEPS: CalculatorStep[] = [
  {
    id: 'demographics',
    title: 'Datos Demográficos',
    component: DemographicsForm,
    icon: '👤'
  },
  {
    id: 'gynecology',
    title: 'Historia Ginecológica',
    component: GynecologyHistoryForm,
    icon: '🩺'
  },
  {
    id: 'laboratory',
    title: 'Exámenes de Laboratorio',
    component: LabTestsForm,
    icon: '🧪'
  },
  {
    id: 'maleFactor',
    title: 'Factor Masculino',
    component: MaleFactorForm,
    icon: '👨‍⚕️'
  }
];

interface EnhancedCalculatorFormProps {
  onCalculationComplete?: (result: {
    calculation: unknown;
    validation: unknown;
    timestamp: Date;
  }) => void;
  showPerformanceMonitor?: boolean;
  enableParallelValidation?: boolean;
}

export const EnhancedCalculatorForm = memo<EnhancedCalculatorFormProps>(({
  onCalculationComplete,
  showPerformanceMonitor = typeof __DEV__ !== 'undefined' && __DEV__,
  enableParallelValidation = true
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  // 🚀 Hook integrado con validación paralela
  const calculator = useCalculatorWithParallelValidation();

  const currentStep = CALCULATOR_STEPS[currentStepIndex];

  // 🎯 Función para avanzar al siguiente paso
  const handleNextStep = () => {
    if (currentStepIndex < CALCULATOR_STEPS.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  // 🎯 Función para retroceder
  const handlePreviousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  // 🎯 Función para calcular con validación
  const handleCalculateWithValidation = async () => {
    try {
      if (!calculator.isFormValid) {
        Alert.alert(
          'Validación incompleta',
          `Se encontraron ${calculator.criticalErrors.length} errores críticos que deben corregirse antes del cálculo.`,
          [{ text: 'Entendido' }]
        );
        return;
      }

      const result = await calculator.handleCalculate();
      
      if (result && onCalculationComplete) {
        onCalculationComplete(result);
      }
      
    } catch (calculationError) {
      console.error('Error en cálculo:', calculationError);
      Alert.alert(
        'Error en el cálculo',
        'Ocurrió un error durante el cálculo. Por favor, revise los datos ingresados.',
        [{ text: 'Entendido' }]
      );
    }
  };

  // 🎯 Renderizar el componente del paso actual
  const renderCurrentStep = () => {
    const StepComponent = currentStep.component;
    
    const commonProps = {
      control: calculator.control,
      errors: calculator.errors
    };

    switch (currentStep.id) {
      case 'demographics':
        return (
          <StepComponent
            {...commonProps}
            calculatedBmi={calculator.calculatedBmi}
            calculatedHoma={calculator.calculatedHoma}
          />
        );
      
      case 'laboratory':
        return (
          <StepComponent
            {...commonProps}
            calculatedHoma={calculator.calculatedHoma}
          />
        );
      
      default:
        return <StepComponent {...commonProps} />;
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* 📊 Monitor de rendimiento */}
      {showPerformanceMonitor && enableParallelValidation && (
        <CalculatorPerformanceMonitor
          isValidating={calculator.isValidating}
          progress={calculator.validationMetrics.validation.progress}
          metrics={calculator.validationMetrics}
          devData={calculator.devData?.parallelValidation}
        />
      )}

      {/* 🎯 Indicador de progreso */}
      <View style={styles.progressSection}>
        <Text style={styles.progressTitle}>
          {currentStep.icon} {currentStep.title}
        </Text>
        <Text style={styles.progressText}>
          Paso {currentStepIndex + 1} de {CALCULATOR_STEPS.length}
        </Text>
        
        {/* Barra de progreso de pasos */}
        <View style={styles.stepProgressContainer}>
          {CALCULATOR_STEPS.map((step, index) => (
            <View
              key={step.id}
              style={[
                styles.stepIndicator,
                {
                  backgroundColor: index <= currentStepIndex 
                    ? theme.colors.primary 
                    : theme.colors.border
                }
              ]}
            />
          ))}
        </View>
      </View>

      {/* ⚠️ Alertas de validación */}
      {calculator.criticalErrors.length > 0 && (
        <Box style={styles.errorBox}>
          <Text style={styles.errorTitle}>❌ Errores críticos:</Text>
          {calculator.criticalErrors.map((error, errorIndex) => (
            <Text key={`error-${errorIndex}`} style={styles.errorText}>• {error}</Text>
          ))}
        </Box>
      )}

      {calculator.warnings.length > 0 && (
        <Box style={styles.warningBox}>
          <Text style={styles.warningTitle}>⚠️ Advertencias:</Text>
          {calculator.warnings.map((warning, warningIndex) => (
            <Text key={`warning-${warningIndex}`} style={styles.warningText}>• {warning}</Text>
          ))}
        </Box>
      )}

      {/* 💡 Sugerencias */}
      {calculator.suggestions.length > 0 && (
        <Box style={styles.suggestionBox}>
          <Text style={styles.suggestionTitle}>💡 Sugerencias:</Text>
          {calculator.suggestions.slice(0, 2).map((suggestion, suggestionIndex) => (
            <Text key={`suggestion-${suggestionIndex}`} style={styles.suggestionText}>• {suggestion}</Text>
          ))}
        </Box>
      )}

      {/* 📝 Formulario del paso actual */}
      <Box style={styles.formContainer}>
        {renderCurrentStep()}
      </Box>

      {/* 🎯 Controles de navegación */}
      <View style={styles.navigationContainer}>
        <View style={styles.navigationButtons}>
          {currentStepIndex > 0 && (
            <TouchableOpacity
              style={[styles.navButton, styles.secondaryButton]}
              onPress={handlePreviousStep}
            >
              <Text style={styles.secondaryButtonText}>← Anterior</Text>
            </TouchableOpacity>
          )}
          
          {currentStepIndex < CALCULATOR_STEPS.length - 1 ? (
            <TouchableOpacity
              style={[styles.navButton, styles.primaryButton]}
              onPress={handleNextStep}
            >
              <Text style={styles.primaryButtonText}>Siguiente →</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[
                styles.navButton, 
                styles.calculateButton,
                !calculator.isFormValid && styles.disabledButton
              ]}
              onPress={handleCalculateWithValidation}
              disabled={calculator.isCalculating || !calculator.isFormValid}
            >
              <Text style={[
                styles.calculateButtonText,
                !calculator.isFormValid && styles.disabledButtonText
              ]}>
                {calculator.isCalculating ? '⏳ Calculando...' : '🎯 Calcular'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        
        {/* 📊 Estado de validación */}
        <View style={styles.validationStatus}>
          <Text style={[
            styles.validationText,
            { color: calculator.isFormValid ? theme.colors.success : theme.colors.warning }
          ]}>
            {calculator.isFormValid 
              ? '✅ Formulario válido' 
              : `⚠️ ${calculator.criticalErrors.length} errores, ${calculator.warnings.length} advertencias`
            }
          </Text>
        </View>
      </View>

      {/* 🔧 Información de desarrollo */}
      {typeof __DEV__ !== 'undefined' && __DEV__ && calculator.devData && (
        <Box style={styles.devSection}>
          <Text style={styles.devTitle}>🔧 Información de Desarrollo</Text>
          <Text style={styles.devText}>
            Eficiencia: {calculator.combinedMetrics.overall.efficiency}
          </Text>
          <Text style={styles.devText}>
            Estado: {calculator.combinedMetrics.overall.status}
          </Text>
          <Text style={styles.devText}>
            Preparado: {calculator.combinedMetrics.overall.readiness ? 'Sí' : 'No'}
          </Text>
        </Box>
      )}
    </ScrollView>
  );
});

EnhancedCalculatorForm.displayName = 'EnhancedCalculatorForm';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  
  progressSection: {
    padding: theme.spacing.m,
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  
  progressTitle: {
    ...theme.typography.h2,
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  
  progressText: {
    ...theme.typography.body,
    color: theme.colors.subtleText,
    marginBottom: theme.spacing.s,
  },
  
  stepProgressContainer: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
  },
  
  stepIndicator: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  
  errorBox: {
    margin: theme.spacing.m,
    backgroundColor: '#ffebee',
    borderColor: theme.colors.error,
    borderWidth: 1,
  },
  
  errorTitle: {
    ...theme.typography.body,
    fontWeight: '600',
    color: theme.colors.error,
    marginBottom: theme.spacing.xs,
  },
  
  errorText: {
    ...theme.typography.body,
    color: theme.colors.error,
    marginLeft: theme.spacing.s,
  },
  
  warningBox: {
    margin: theme.spacing.m,
    backgroundColor: '#fff8e1',
    borderColor: theme.colors.warning,
    borderWidth: 1,
  },
  
  warningTitle: {
    ...theme.typography.body,
    fontWeight: '600',
    color: theme.colors.warning,
    marginBottom: theme.spacing.xs,
  },
  
  warningText: {
    ...theme.typography.body,
    color: theme.colors.warning,
    marginLeft: theme.spacing.s,
  },
  
  suggestionBox: {
    margin: theme.spacing.m,
    backgroundColor: '#e3f2fd',
    borderColor: theme.colors.info,
    borderWidth: 1,
  },
  
  suggestionTitle: {
    ...theme.typography.body,
    fontWeight: '600',
    color: theme.colors.info,
    marginBottom: theme.spacing.xs,
  },
  
  suggestionText: {
    ...theme.typography.body,
    color: theme.colors.info,
    marginLeft: theme.spacing.s,
  },
  
  formContainer: {
    margin: theme.spacing.m,
  },
  
  navigationContainer: {
    padding: theme.spacing.m,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.card,
  },
  
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.m,
    marginBottom: theme.spacing.s,
  },
  
  navButton: {
    flex: 1,
    paddingVertical: theme.spacing.m,
    paddingHorizontal: theme.spacing.l,
    borderRadius: theme.borderRadius.m,
    alignItems: 'center',
  },
  
  primaryButton: {
    backgroundColor: theme.colors.primary,
  },
  
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  
  calculateButton: {
    backgroundColor: theme.colors.success,
  },
  
  disabledButton: {
    backgroundColor: theme.colors.border,
  },
  
  primaryButtonText: {
    ...theme.typography.body,
    fontWeight: '600',
    color: theme.colors.white,
  },
  
  secondaryButtonText: {
    ...theme.typography.body,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  
  calculateButtonText: {
    ...theme.typography.body,
    fontWeight: '700',
    color: theme.colors.white,
  },
  
  disabledButtonText: {
    color: theme.colors.subtleText,
  },
  
  validationStatus: {
    alignItems: 'center',
    marginTop: theme.spacing.xs,
  },
  
  validationText: {
    ...theme.typography.caption,
    fontWeight: '600',
  },
  
  devSection: {
    margin: theme.spacing.m,
    backgroundColor: theme.colors.card,
    borderColor: theme.colors.primary,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  
  devTitle: {
    ...theme.typography.body,
    fontWeight: '700',
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  
  devText: {
    ...theme.typography.caption,
    color: theme.colors.subtleText,
    marginBottom: 2,
  },
});

export default EnhancedCalculatorForm;
