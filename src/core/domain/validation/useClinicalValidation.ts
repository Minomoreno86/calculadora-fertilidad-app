/**
 * Hook simple que extiende tu useCalculatorForm existente
 * Solución rápida sin romper tu código
 */

import { useState, useEffect, useMemo } from 'react';
import { ClinicalValidators } from './clinicalValidators';
import type { ValidationResult, FieldValidationResult } from './clinicalValidators';
import type { ValidationMessage } from './validationMessages';

// Tipos específicos para evitar 'any'
interface FormValues {
  age?: number;
  height?: number;
  weight?: number;
  amh?: number;
  infertilityDuration?: number;
  glucose?: number;
  insulin?: number;
  spermConcentration?: number;
  spermProgressiveMotility?: number;
  spermNormalMorphology?: number;
  cycleLength?: number;
  cycleRegularity?: 'regular' | 'irregular';
  [key: string]: unknown;
}

interface ClinicalValidationState {
  overallValidation: ValidationResult;
  fieldValidations: FieldValidationResult[];
  completionScore: number;
  canProceedWithCalculation: boolean;
}

interface ClinicalFeedback {
  type: 'success' | 'warning' | 'error';
  title: string;
  messages: string[];
}

interface UseClinicalValidationReturn {
  validation: ClinicalValidationState | null;
  getFieldValidation: (fieldName: string) => FieldValidationResult | null;
  getClinicalAlerts: () => ValidationMessage[];
  getClinicalWarnings: () => ValidationMessage[];
  getCompletionScore: () => number;
  canCalculate: boolean;
  getClinicalFeedback: () => ClinicalFeedback | null;
  isValid: boolean;
  completionScore: number;
  hasErrors: boolean;
  hasWarnings: boolean;
  hasCriticalAlerts: boolean;
}

/**
 * Hook que puedes usar junto a tu hook existente
 * @param formValues - Datos del formulario a validar
 * @returns Objeto con validaciones clínicas y funciones auxiliares
 */
export const useClinicalValidation = (
  formValues: FormValues | null | undefined
): UseClinicalValidationReturn => {
  const [validation, setValidation] = useState<ClinicalValidationState | null>(null);

  // Memoizar los valores relevantes para evitar re-renders innecesarios
  const memoizedValues = useMemo(() => {
    if (!formValues || typeof formValues !== 'object') {
      return null;
    }
    
    // Solo extraer los campos que necesitamos para validación
    return {
      age: formValues.age,
      height: formValues.height,
      weight: formValues.weight,
      amh: formValues.amh,
      timeToConception: formValues.infertilityDuration,
      glucose: formValues.glucose,
      insulin: formValues.insulin,
      spermConcentration: formValues.spermConcentration,
      spermProgressiveMotility: formValues.spermProgressiveMotility,
      spermNormalMorphology: formValues.spermNormalMorphology,
      cycleLength: formValues.cycleLength,
      cycleRegularity: formValues.cycleRegularity
    };
  }, [
    formValues?.age,
    formValues?.height,
    formValues?.weight,
    formValues?.amh,
    formValues?.infertilityDuration,
    formValues?.glucose,
    formValues?.insulin,
    formValues?.spermConcentration,
    formValues?.spermProgressiveMotility,
    formValues?.spermNormalMorphology,
    formValues?.cycleLength,
    formValues?.cycleRegularity
  ]);

  useEffect(() => {
    // Verificar que tenemos datos válidos antes de procesar
    if (!memoizedValues) {
      setValidation(null);
      return;
    }
    
    try {
      const clinicalValidation = ClinicalValidators.validateCompleteForm(memoizedValues);
      setValidation(clinicalValidation);
    } catch (error) {
      console.error('Error en validación clínica:', error);
      // Establecer estado de error seguro
      setValidation({
        overallValidation: {
          isValid: false,
          errors: [{ type: 'error', message: 'Error en validación clínica' }],
          warnings: [],
          criticalAlerts: [],
          recommendations: ['Verificar datos del formulario'],
          clinicalScore: 0
        },
        fieldValidations: [],
        completionScore: 0,
        canProceedWithCalculation: false
      });
    }
  }, [memoizedValues]);

  return {
    validation,
    getFieldValidation: (fieldName: string) => 
      validation?.fieldValidations.find(fv => fv.fieldName === fieldName) || null,
    getClinicalAlerts: () => validation?.overallValidation.criticalAlerts || [],
    getClinicalWarnings: () => validation?.overallValidation.warnings || [],
    getCompletionScore: () => validation?.completionScore || 0,
    canCalculate: validation?.canProceedWithCalculation || false,
    getClinicalFeedback: (): ClinicalFeedback | null => {
      if (!validation) return null;
      
      const { overallValidation } = validation;
      
      if (overallValidation.criticalAlerts.length > 0) {
        return {
          type: 'error',
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
    },
    
    // Propiedades adicionales para facilitar uso
    isValid: validation?.overallValidation.isValid || false,
    completionScore: validation?.completionScore || 0,
    hasErrors: (validation?.overallValidation.errors.length || 0) > 0,
    hasWarnings: (validation?.overallValidation.warnings.length || 0) > 0,
    hasCriticalAlerts: (validation?.overallValidation.criticalAlerts.length || 0) > 0
  };
};

/**
 * Hook de validación simplificado como fallback
 * Usado cuando los validadores complejos fallan
 */
export const useBasicClinicalValidation = (formValues: FormValues | null | undefined) => {
  return useMemo(() => {
    if (!formValues) {
      return {
        canCalculate: false,
        completionScore: 0,
        isValid: false,
        hasBasicData: false,
        message: 'Sin datos del formulario'
      };
    }

    // Validación básica sin dependencias externas
    const hasAge = typeof formValues.age === 'number' && formValues.age > 0;
    const hasHeight = typeof formValues.height === 'number' && formValues.height > 0;
    const hasWeight = typeof formValues.weight === 'number' && formValues.weight > 0;
    
    const basicFieldsCount = [hasAge, hasHeight, hasWeight].filter(Boolean).length;
    const hasBasicData = basicFieldsCount >= 2;
    
    // Conteo opcional
    const optionalFields = ['amh', 'glucose', 'insulin', 'infertilityDuration'];
    const optionalCount = optionalFields.filter(field => {
      const value = formValues[field as keyof FormValues];
      return typeof value === 'number' && value > 0;
    }).length;
    
    const completionScore = Math.round(
      (basicFieldsCount / 3) * 70 + (optionalCount / optionalFields.length) * 30
    );
    
    // Validaciones básicas de seguridad
    const ageValid = !hasAge || (formValues.age! >= 18 && formValues.age! <= 50);
    const isValid = hasBasicData && ageValid;
    
    return {
      canCalculate: hasBasicData && ageValid,
      completionScore,
      isValid,
      hasBasicData,
      message: hasBasicData 
        ? `Datos básicos completos (${completionScore}%)`
        : `Faltan datos básicos (${completionScore}%)`
    };
  }, [formValues]);
};