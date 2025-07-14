// ===================================================================
// 🚀 ÍNDICE DE EXPORTACIONES - SISTEMA DE VALIDACIÓN INTELIGENTE
// ===================================================================

// Sistema de validación clínica base
export * from './clinicalValidators';
export * from './validationMessages';

// Sistema inteligente de validación - NUEVO
export * from './useIntelligentClinicalValidation';

// Tipos principales para validación
export type {
  ValidationResult,
  FieldValidationResult,
  ValidationMessage,
  ClinicalValidationConfig
} from './clinicalValidators';

// Tipos del sistema inteligente - NUEVO
export type {
  ClinicalInsight,
  SmartValidationResult,
  IntelligentValidationOptions
} from './useIntelligentClinicalValidation';
