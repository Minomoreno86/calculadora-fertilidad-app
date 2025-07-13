/**
 * Ejemplo de integración de validadores clínicos con useCalculatorForm
 * Este archivo muestra cómo agregar validación médica a tu hook existente
 */

import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { ClinicalValidators, ValidationResult, FieldValidationResult } from '@/core/domain/validation/clinicalValidators';

export const useEnhancedCalculatorForm = () => {
  // Tu lógica existente permanece igual
  const form = useForm();
  const [isLoading, setIsLoading] = useState(false);
  
  // NUEVA: Estado para validaciones clínicas
  const [clinicalValidation, setClinicalValidation] = useState<{
    overallValidation: ValidationResult;
    fieldValidations: FieldValidationResult[];
    completionScore: number;
    canProceedWithCalculation: boolean;
  } | null>(null);

  // Observar cambios en el formulario - CORREGIDO
  const watchedValues = form.watch();

  // NUEVA: Validación clínica en tiempo real
  useEffect(() => {
    if (!watchedValues) return;
    
    // Ejecutar validación clínica completa
    const validation = ClinicalValidators.validateCompleteForm({
      age: watchedValues.age,
      height: watchedValues.height,
      weight: watchedValues.weight,
      amh: watchedValues.amh,
      timeToConception: watchedValues.infertilityDuration,
      glucose: watchedValues.glucose,
      insulin: watchedValues.insulin,
      spermConcentration: watchedValues.spermConcentration,
      spermProgressiveMotility: watchedValues.spermProgressiveMotility,
      spermNormalMorphology: watchedValues.spermNormalMorphology,
      cycleLength: watchedValues.cycleLength,
      cycleRegularity: watchedValues.cycleRegularity
    });
    
    setClinicalValidation(validation);
  }, [watchedValues]);

  // Tu lógica de cálculo existente con validación añadida
  const handleCalculate = async () => {
    try {
      setIsLoading(true);
      
      // NUEVA: Verificar validación clínica antes de proceder
      if (!clinicalValidation?.canProceedWithCalculation) {
        throw new Error('Datos insuficientes o con errores clínicos para cálculo confiable');
      }
      
      // Tu lógica de cálculo existente aquí...
      const formData = form.getValues();
      console.log('Calculando con datos validados:', formData);
      
      // Aquí iría tu lógica de cálculo real
      // await generateReport(formData);
      
    } catch (error) {
      console.error('Error durante cálculo:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Tus cálculos existentes (BMI, HOMA-IR) permanecen igual
  const calculatedBmi = useMemo(() => {
    if (watchedValues?.height && watchedValues?.weight) {
      // Calcular BMI usando fórmula estándar consistente
      const heightInMeters = watchedValues.height / 100;
      const bmi = watchedValues.weight / (heightInMeters * heightInMeters);
      return Number(bmi.toFixed(1));
    }
    return null;
  }, [watchedValues?.height, watchedValues?.weight]);

  const calculatedHoma = useMemo(() => {
    if (watchedValues?.glucose && watchedValues?.insulin) {
      const homa = (watchedValues.glucose * watchedValues.insulin) / 405;
      return Number(homa.toFixed(2));
    }
    return null;
  }, [watchedValues?.glucose, watchedValues?.insulin]);

  return {
    // Tu API existente permanece igual
    ...form,
    control: form.control,
    formState: form.formState,
    getValues: form.getValues,
    setValue: form.setValue,
    isLoading,
    handleCalculate,
    calculatedBmi,
    calculatedHoma,
    
    // NUEVAS: Funciones de validación clínica
    clinicalValidation,
    getFieldValidation: (fieldName: string) => 
      clinicalValidation?.fieldValidations.find(fv => fv.fieldName === fieldName),
    getClinicalAlerts: () => clinicalValidation?.overallValidation.criticalAlerts || [],
    getClinicalWarnings: () => clinicalValidation?.overallValidation.warnings || [],
    getCompletionScore: () => clinicalValidation?.completionScore || 0,
    canCalculate: clinicalValidation?.canProceedWithCalculation || false,
    
    // Helper para mostrar alertas clínicas en UI
    getClinicalFeedback: () => {
      if (!clinicalValidation) return null;
      
      const { overallValidation } = clinicalValidation;
      
      if (overallValidation.criticalAlerts.length > 0) {
        return {
          type: 'critical',
          title: 'Alerta Clínica Crítica',
          messages: overallValidation.criticalAlerts.map(alert => alert.message)
        };
      }
      
      if (overallValidation.warnings.length > 0) {
        return {
          type: 'warning',
          title: 'Consideraciones Clínicas',
          messages: overallValidation.warnings.map(warning => warning.message)
        };
      }
      
      return {
        type: 'success',
        title: 'Validación Exitosa',
        messages: ['Datos clínicamente válidos para cálculo']
      };
    }
  };
};

// Ejemplo de uso en componente
export const ExampleUsage = () => {
  const {
    control,
    handleCalculate,
    calculatedBmi,
    calculatedHoma,
    getClinicalFeedback,
    getFieldValidation,
    canCalculate,
    isLoading
  } = useEnhancedCalculatorForm();

  const clinicalFeedback = getClinicalFeedback();
  const ageValidation = getFieldValidation('age');
  const bmiValidation = getFieldValidation('bmi');
  const amhValidation = getFieldValidation('amh');

  return {
    // Usar estas validaciones en tu UI para mostrar:
    // - Alertas clínicas en tiempo real
    // - Interpretaciones de valores (ej: "AMH bajo para la edad")
    // - Recomendaciones específicas
    // - Estados de validación por campo
    clinicalFeedback,
    ageValidation,
    bmiValidation,
    amhValidation,
    canCalculate,
    isLoading
  };
};