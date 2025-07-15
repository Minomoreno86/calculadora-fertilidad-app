/**
 * Índice de componentes clínicos profesionales
 * 
 * Exportación central para componentes de validación y progreso clínico
 * 
 * @author AEC-D (Arquitecto Experto Clínico-Digital)
 */

export { ClinicalAlert } from './ClinicalAlert';
export { ClinicalProgress } from './ClinicalProgress';
export { EnhancedButton, Button } from './EnhancedButton';
export { default as EnhancedInfoCard } from './EnhancedInfoCard';

// Tipos compartidos para usar en otros componentes
export type { FieldValidationResult } from '@/core/domain/validation/clinicalValidators';
