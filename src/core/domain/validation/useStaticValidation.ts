/**
 * Hook de validación estática para evitar errores de watch
 * Versión temporal hasta que se corrija el hook principal
 */

import { BasicValidationResult } from './simpleValidators';

interface StaticValidationResult {
  ageValidation: BasicValidationResult;
  bmiValidation: BasicValidationResult;
  canCalculate: boolean;
  completionPercentage: number;
}

export const useStaticValidation = (): StaticValidationResult => {
  return {
    ageValidation: {
      isValid: true,
      message: 'Validación de edad pendiente - completa el formulario',
      type: 'success'
    },
    bmiValidation: {
      isValid: true,
      message: 'Validación de BMI pendiente - completa altura y peso', 
      type: 'success'
    },
    canCalculate: true, // Por defecto permitir cálculo
    completionPercentage: 50 // Valor por defecto
  };
};