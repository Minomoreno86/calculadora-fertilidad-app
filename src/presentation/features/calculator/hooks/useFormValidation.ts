// ===================================================================
// 🚀 FASE 2C: HOOK ESPECIALIZADO PARA VALIDACIÓN
// ===================================================================

import { useMemo } from 'react';
import { ClinicalValidators, ValidationResult } from '@/core/domain/validation/clinicalValidators';
import { FormState } from '../useCalculatorForm';

interface UseFormValidationReturn {
  validateField: (fieldName: keyof FormState, value: unknown) => ValidationResult;
  validateForm: (formData: Partial<FormState>) => ValidationResult;
  isFieldValid: (fieldName: keyof FormState, value: unknown) => boolean;
}

export const useFormValidation = (): UseFormValidationReturn => {
  // 🚀 FASE 2C: Memoizar funciones de validación para evitar recreación
  const validateField = useMemo(() => {
    return (fieldName: keyof FormState, value: unknown): ValidationResult => {
      switch (fieldName) {
        case 'age':
          return ClinicalValidators.validateAge(value as number);
        case 'amh':
          return ClinicalValidators.validateAMH(value as number, 30); // Edad por defecto
        case 'spermConcentration':
        case 'spermProgressiveMotility':
        case 'spermNormalMorphology':
          return ClinicalValidators.validateSemenAnalysis({
            concentration: fieldName === 'spermConcentration' ? value as number : undefined,
            progressiveMotility: fieldName === 'spermProgressiveMotility' ? value as number : undefined,
            normalMorphology: fieldName === 'spermNormalMorphology' ? value as number : undefined,
          });
        default:
          // Validación básica para otros campos
          return {
            isValid: true,
            errors: [],
            warnings: [],
            criticalAlerts: [],
            recommendations: [],
            clinicalScore: 100
          };
      }
    };
  }, []);

  const validateForm = useMemo(() => {
    return (formData: Partial<FormState>): ValidationResult => {
      const errors: any[] = [];
      const warnings: any[] = [];
      const criticalAlerts: any[] = [];
      const recommendations: string[] = [];
      let totalScore = 0;
      let validFields = 0;

      // Validar campos principales
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          const fieldValidation = validateField(key as keyof FormState, value);
          errors.push(...fieldValidation.errors);
          warnings.push(...fieldValidation.warnings);
          criticalAlerts.push(...fieldValidation.criticalAlerts);
          recommendations.push(...fieldValidation.recommendations);
          totalScore += fieldValidation.clinicalScore;
          validFields++;
        }
      });

      const averageScore = validFields > 0 ? Math.round(totalScore / validFields) : 0;

      return {
        isValid: errors.length === 0,
        errors,
        warnings,
        criticalAlerts,
        recommendations: [...new Set(recommendations)],
        clinicalScore: averageScore
      };
    };
  }, [validateField]);

  const isFieldValid = useMemo(() => {
    return (fieldName: keyof FormState, value: unknown): boolean => {
      const validation = validateField(fieldName, value);
      return validation.isValid;
    };
  }, [validateField]);

  return {
    validateField,
    validateForm,
    isFieldValid
  };
};
