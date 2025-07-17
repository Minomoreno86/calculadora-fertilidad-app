// Exportaciones principales del módulo autoinmune
export { AutoimmuneAssessment } from './components/assessment/AutoimmuneAssessment';
export { AutoimmuneDashboard } from './components/dashboard/AutoimmuneDashboard';
export { AutoimmuneFertilityRiskCalculator } from './algorithms/riskCalculator';

// Exportaciones de tipos
export type {
  AutoimmuneDisease,
  AutoimmunePatientProfile,
  FertilityRiskAssessment,
  ClinicalRecommendation,
  PatientDiagnosis,
  PatientMedication,
  DiseaseActivity,
  Medication
} from './types/autoimmune';

// Exportaciones de datos
export { AUTOIMMUNE_DISEASES } from './data/diseases';
export { AUTOIMMUNE_MEDICATIONS } from './data/medications';
