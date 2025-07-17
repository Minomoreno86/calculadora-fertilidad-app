/**
 * 🚀 ÍNDICE MÓDULOS INTEGRADOS - AEC-D
 * Exporta todos los módulos especializados de fertilidad
 */

// 🧠 MÓDULO PSICOLÓGICO
export { default as EmotionalDashboard } from './psychology/dashboard/EmotionalDashboard';
export { PsychoClinicalAlgorithms } from './psychology/algorithms/PsychoClinicalAlgorithms';
export type { 
  PsychologicalProfile,
  PsychologicalAssessment,
  PsychologicalRisk,
  InterventionRecommendation,
  EmotionalDashboardData,
  PsychologicalAlert
} from './psychology/types/PsychologicalTypes';

// 🦠 MÓDULO AUTOINMUNE  
export { default as AutoimmuneAssessment } from './autoimmune/AutoimmuneAssessment';
export type {
  AutoimmuneProfile,
  AutoimmuneAlert,
  AutoimmuneFertilityImpact,
  TreatmentModification
} from './autoimmune/types/AutoimmuneTypes';

// 🤖 AGENTE IA MÉDICO (Re-export para compatibilidad)
export type { UserInput, DiagnosticAnalysis, TreatmentPlan } from '@/ai-medical-agent';

// 🔗 INTEGRACIÓN HOLÍSTICA
export interface HolisticFertilityProfile {
  clinical: {
    age: number;
    bmi: number;
    infertilityDuration: number;
    cycleRegularity: boolean;
  };
  psychological: PsychologicalProfile;
  autoimmune: AutoimmuneProfile;
  integratedRisk: {
    overall: number;
    clinical: number;
    psychological: number;
    autoimmune: number;
  };
  recommendations: IntegratedRecommendation[];
}

export interface IntegratedRecommendation {
  id: string;
  category: 'medical' | 'psychological' | 'autoimmune' | 'lifestyle';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  title: string;
  description: string;
  timeline: string;
  evidenceLevel: 'A' | 'B' | 'C';
}
