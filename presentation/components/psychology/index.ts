/**
 * 🧠 MÓDULO PSICOLÓGICO INTEGRADO - AEC-D
 * Exporta todos los componentes psicológicos para la aplicación principal
 */

// 📊 Componentes de evaluación psicológica
export { default as PSS10Assessment } from './assessments/PSS10Assessment';
export { default as PHQ9FAssessment } from './assessments/PHQ9FAssessment';
export { default as DAS7Assessment } from './assessments/DAS7Assessment';
export { default as MSPSSFAssessment } from './assessments/MSPSSFAssessment';
export { default as FertiQoLAssessment } from './assessments/FertiQoLAssessment';
export { default as BriefCOPEFAssessment } from './assessments/BriefCOPEFAssessment';

// 📱 Dashboard emocional
export { default as EmotionalDashboard } from './dashboard/EmotionalDashboard';
export { default as PsychologicalRiskIndicator } from './dashboard/PsychologicalRiskIndicator';
export { default as InterventionRecommendations } from './dashboard/InterventionRecommendations';

// 🎯 Algoritmos y tipos
export { PsychoClinicalAlgorithms } from './algorithms/PsychoClinicalAlgorithms';
export type {
  PsychologicalProfile,
  PsychologicalAssessment,
  PsychologicalRisk,
  InterventionRecommendation,
  EmotionalDashboardData
} from './types/PsychologicalTypes';

// 🔗 Integración con agente IA
export { PsychologyAIIntegration } from './integration/PsychologyAIIntegration';
