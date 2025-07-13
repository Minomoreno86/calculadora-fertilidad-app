/**
 * Tipos centralizados para validación
 * Evita inconsistencias entre archivos
 */

export type ValidationResultType = 'success' | 'warning' | 'error';

export interface BasicValidationResult {
  isValid: boolean;
  message: string;
  type: ValidationResultType;
}

export interface FormDataType {
  age?: number;
  height?: number;
  weight?: number;
  amh?: number;
  glucose?: number;
  insulin?: number;
  infertilityDuration?: number;
  spermConcentration?: number;
  spermProgressiveMotility?: number;
  spermNormalMorphology?: number;
  cycleLength?: number;
  cycleRegularity?: 'regular' | 'irregular';
  [key: string]: unknown;
}

export interface CompletenessResult {
  percentage: number;
  canCalculate: boolean;
  message: string;
}

export interface ValidationHookResult {
  ageValidation: BasicValidationResult;
  bmiValidation: BasicValidationResult;
  completeness: CompletenessResult;
  canCalculate: boolean;
  completionPercentage: number;
}