/**
 * 🧠 MEDICAL TYPES V11.0 - AI MEDICAL AGENT NEURONAL
 * Tipos Médicos Especializados para Módulos de Integración
 * 
 * @description Tipos TypeScript para sistema médico neuronal
 * @version 11.0.0 - Neuronal Medical Intelligence
 * @architecture TypeScript Medical Type System
 */

// ====================================================================
// 🎯 TIPOS FUNDAMENTALES MÉDICOS
// ====================================================================

export type EvidenceLevel = 'A' | 'B' | 'C' | 'D' | 'E';
export type SeverityLevel = 'mild' | 'moderate' | 'severe' | 'critical';
export type UrgencyLevel = 'low' | 'medium' | 'high' | 'urgent';
export type TreatmentType = 
  | 'pharmacological' 
  | 'hormonal' 
  | 'surgical' 
  | 'reproductive_technology'
  | 'lifestyle' 
  | 'nutritional' 
  | 'psychological' 
  | 'alternative'
  | 'monitoring' 
  | 'preventive' 
  | 'rehabilitation' 
  | 'follow_up'
  | 'emergency' 
  | 'personalized' 
  | 'combined';

export type CostLevel = 'low' | 'low-medium' | 'medium' | 'medium-high' | 'high' | 'very_high';

// ====================================================================
// 🏥 PERFIL DEL PACIENTE
// ====================================================================

export interface PatientProfile {
  // Datos demográficos
  age?: number;
  partnerAge?: number;
  bmi?: number;
  height?: number;
  weight?: number;

  // Historial médico
  medicalHistory?: string[];
  surgicalHistory?: string[];
  familyHistory?: string[];
  allergies?: string[];
  medications?: string[];
  pregnancyHistory?: string[];

  // Estilo de vida
  smoking?: boolean;
  alcohol?: number; // unidades por semana
  exercise?: string;
  stress?: number; // escala 1-10
  diet?: string;

  // Laboratorios
  labs?: {
    amh?: number;
    fsh?: number;
    lh?: number;
    estradiol?: number;
    progesterone?: number;
    prolactin?: number;
    tsh?: number;
    t3?: number;
    t4?: number;
    testosterone?: number;
    glucose?: number;
    insulin?: number;
    hba1c?: number;
  };
}

// ====================================================================
// 🔬 EVIDENCIA CLÍNICA
// ====================================================================

export interface ClinicalEvidence {
  studyId: string;
  finding: string;
  relevanceScore: number; // 0-1
  evidenceLevel: EvidenceLevel;
  sampleSize?: number;
  publicationYear?: number;
  journal?: string;
  confidenceInterval?: string;
  pValue?: number;
}

// ====================================================================
// 📊 RESULTADO DIAGNÓSTICO
// ====================================================================

export interface DiagnosticResult {
  condition: string;
  severity: SeverityLevel;
  confidence: number; // 0-1
  diagnosticCriteria?: string[];
  differentialDiagnoses?: string[];
  recommendedTests?: string[];
}

// ====================================================================
// 🧬 ANÁLISIS PATOLÓGICO
// ====================================================================

export interface PathologyAnalysis {
  condition: string;
  confidence: number; // 0-1
  primaryDiagnosis: DiagnosticResult;
  differentialDiagnoses?: DiagnosticResult[];
  supportingEvidence?: ClinicalEvidence[];
  riskFactors?: string[];
  severity?: SeverityLevel;
  prognosis?: string;
  complications?: string[];
}

// ====================================================================
// 💊 RECOMENDACIÓN DE TRATAMIENTO
// ====================================================================

export interface TreatmentRecommendation {
  name: string;
  type: TreatmentType;
  description: string;
  medications: string[];
  duration: string;
  efficacy: number; // 0-1
  safety: number; // 0-1
  evidenceLevel: number; // 0-1
  cost: CostLevel;
  sideEffects: string[];
  contraindications: string[];
  monitoring: string[];
  expectedOutcome?: string;
  successRate?: number;
  timeToEffect?: string;
  alternativeOptions?: string[];
}

// ====================================================================
// ⚠️ EVALUACIÓN DE RIESGO
// ====================================================================

export interface RiskAssessment {
  overallRisk: number; // 0-1
  riskFactors: string[];
  timeToTreatment: string;
  complications: string[];
  recommendations: string[];
  urgencyLevel?: UrgencyLevel;
  followUpRequired?: boolean;
  specialistReferral?: boolean;
  emergencySignals?: string[];
}

// ====================================================================
// 🧠 RESPUESTA MÉDICA INTELIGENTE
// ====================================================================

export interface MedicalResponse {
  analysis: PathologyAnalysis;
  recommendations: TreatmentRecommendation[];
  riskAssessment: RiskAssessment;
  evidenceLevel: number; // 0-1
  confidence: number; // 0-1
  nextSteps: string[];
  urgencyLevel: UrgencyLevel;
  followUpSchedule?: string;
  educationalResources?: string[];
  supportGroups?: string[];
  emergencyContacts?: string[];
}

// ====================================================================
// 📈 PROTOCOLO TERAPÉUTICO
// ====================================================================

export interface TherapeuticPlan {
  primaryTreatment: TreatmentRecommendation;
  alternativeTreatments: TreatmentRecommendation[];
  supportiveCare: TreatmentRecommendation[];
  timeline: {
    phase: string;
    duration: string;
    goals: string[];
    milestones: string[];
  }[];
  monitoringPlan: {
    parameter: string;
    frequency: string;
    normalRange: string;
    actionThreshold: string;
  }[];
  contingencyPlans: {
    scenario: string;
    action: string;
    timeline: string;
  }[];
}

// ====================================================================
// 🎯 CONDICIÓN MÉDICA
// ====================================================================

export interface MedicalCondition {
  id: string;
  name: string;
  category: string;
  icd10Code?: string;
  prevalence?: number;
  diagnosticCriteria: string[];
  commonSymptoms: string[];
  riskFactors: string[];
  complications: string[];
  prognosis: string;
  treatmentOptions: string[];
  evidenceLevel: EvidenceLevel;
  lastUpdated: Date;
}

// ====================================================================
// 💊 PROTOCOLO DE TRATAMIENTO
// ====================================================================

export interface TreatmentProtocol {
  id: string;
  name: string;
  indication: string;
  contraindications: string[];
  protocol: {
    step: number;
    action: string;
    duration: string;
    dosage?: string;
    monitoring: string[];
  }[];
  successCriteria: string[];
  failureCriteria: string[];
  nextSteps: {
    onSuccess: string;
    onFailure: string;
    onPartialResponse: string;
  };
  evidenceLevel: EvidenceLevel;
  guidelines: string[];
}

// ====================================================================
// 🔍 PARÁMETROS DE ANÁLISIS
// ====================================================================

export interface AnalysisParameters {
  includeRareConditions: boolean;
  confidenceThreshold: number; // 0-1
  evidenceLevelFilter: EvidenceLevel[];
  ageGroupRestrictions?: {
    min: number;
    max: number;
  };
  genderSpecific?: 'male' | 'female' | 'both';
  urgencyFilter?: UrgencyLevel[];
  costLimitFilter?: CostLevel[];
}

// ====================================================================
// 📊 MÉTRICAS DEL SISTEMA
// ====================================================================

export interface SystemMetrics {
  diagnosticAccuracy: number; // 0-1
  treatmentSuccessRate: number; // 0-1
  patientSatisfaction: number; // 0-1
  timeToResponse: number; // milliseconds
  evidenceQuality: number; // 0-1
  systemReliability: number; // 0-1
  knowledgeBaseSize: number; // entries
  lastUpdate: Date;
  version: string;
}

// ====================================================================
//  TIPOS DE UTILIDAD MÉDICA
// ====================================================================

export type DiagnosticConfidence = 'very_low' | 'low' | 'moderate' | 'high' | 'very_high';
export type TreatmentResponse = 'complete' | 'partial' | 'no_response' | 'adverse';
export type PatientCompliance = 'excellent' | 'good' | 'fair' | 'poor';
export type FollowUpStatus = 'scheduled' | 'completed' | 'missed' | 'cancelled';

// ====================================================================
// 🎯 CONSTANTES MÉDICAS
// ====================================================================

export const MEDICAL_CONSTANTS = {
  CONFIDENCE_THRESHOLDS: {
    HIGH: 0.8,
    MEDIUM: 0.6,
    LOW: 0.4
  },
  EVIDENCE_WEIGHTS: {
    A: 1.0,
    B: 0.8,
    C: 0.6,
    D: 0.4,
    E: 0.2
  },
  RISK_LEVELS: {
    LOW: 0.3,
    MEDIUM: 0.6,
    HIGH: 0.8
  }
} as const;
