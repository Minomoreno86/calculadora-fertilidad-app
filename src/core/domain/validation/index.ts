// ===================================================================
// 🧠 NEURAL MEDICAL VALIDATION SYSTEM V13.0 - CLEAN ARCHITECTURE
// ===================================================================

// 🏥 Sistema de validación clínica profesional (ASRM, ESHRE, WHO 2021)
export * from './clinicalValidators';
export * from './validationMessages';
export * from './referenceRanges';

// 🎯 Tipos principales para validación médica
export type {
  ValidationResult,
  FieldValidationResult
} from './clinicalValidators';

export type {
  ValidationMessage
} from './validationMessages';
