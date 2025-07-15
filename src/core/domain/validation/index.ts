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
  FieldValidationResult
} from './clinicalValidators';

// Re-exportar ValidationMessage desde su fuente correcta
export type { ValidationMessage } from './validationMessages';

// Tipos del sistema inteligente - NUEVO
export type {
  ClinicalInsight,
  SmartValidationResult,
  IntelligentValidationOptions
} from './useIntelligentClinicalValidation';
