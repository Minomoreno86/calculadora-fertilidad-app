/**
 * 🧠 TIPOS PSICOLÓGICOS INTEGRADOS - AEC-D
 * Tipos TypeScript para el sistema psicológico de fertilidad
 */

// 📊 Escalas de evaluación psicológica
export interface PSS10Assessment {
  id: string;
  patientId: string;
  date: Date;
  responses: PSS10Response[];
  totalScore: number;
  stressLevel: 'low' | 'moderate' | 'high';
  recommendations: string[];
}

export interface PSS10Response {
  questionId: number;
  question: string;
  response: number; // 0-4 escala Likert
}

export interface PHQ9FAssessment {
  id: string;
  patientId: string;
  date: Date;
  responses: PHQ9FResponse[];
  totalScore: number;
  depressionLevel: 'minimal' | 'mild' | 'moderate' | 'moderately-severe' | 'severe';
  fertilitySpecificScore: number;
  recommendations: string[];
}

export interface PHQ9FResponse {
  questionId: number;
  question: string;
  response: number; // 0-3 escala Likert
  isFertilitySpecific?: boolean;
}

export interface DAS7Assessment {
  id: string;
  patientId: string;
  date: Date;
  responses: DAS7Response[];
  totalScore: number;
  relationshipQuality: 'excellent' | 'good' | 'compromised' | 'at-risk';
  recommendations: string[];
}

export interface DAS7Response {
  questionId: number;
  question: string;
  response: number; // 0-5 escala Likert
}

export interface MSPSSFAssessment {
  id: string;
  patientId: string;
  date: Date;
  familySupport: number;
  friendsSupport: number;
  partnerSupport: number;
  totalScore: number;
  supportLevel: 'high' | 'moderate' | 'low' | 'very-low';
  recommendations: string[];
}

export interface FertiQoLAssessment {
  id: string;
  patientId: string;
  date: Date;
  emotional: number;
  mindBody: number;
  relational: number;
  social: number;
  environmental: number;
  tolerability: number;
  totalScore: number;
  qualityOfLife: 'excellent' | 'good' | 'compromised' | 'severely-affected';
  recommendations: string[];
}

export interface BriefCOPEFAssessment {
  id: string;
  patientId: string;
  date: Date;
  adaptiveStrategies: number;
  maladaptiveStrategies: number;
  copingProfile: 'adaptive' | 'mixed-positive' | 'avoidant' | 'maladaptive';
  recommendations: string[];
}

// 🧠 Perfil psicológico integrado
export interface PsychologicalProfile {
  patientId: string;
  date: Date;
  assessments: {
    pss10?: PSS10Assessment;
    phq9f?: PHQ9FAssessment;
    das7?: DAS7Assessment;
    mspssf?: MSPSSFAssessment;
    fertiqol?: FertiQoLAssessment;
    briefCopef?: BriefCOPEFAssessment;
  };
  overallRisk: PsychologicalRisk;
  interventions: InterventionRecommendation[];
  nextEvaluation: Date;
}

export interface PsychologicalRisk {
  level: 'low' | 'moderate' | 'high' | 'critical';
  score: number; // 0-100
  factors: RiskFactor[];
  impactOnFertility: {
    pregnancyProbability: number; // % reducción/aumento
    treatmentAdherence: number; // % probabilidad adherencia
    abortionRisk: number; // % riesgo aborto
  };
}

export interface RiskFactor {
  type: 'stress' | 'depression' | 'anxiety' | 'relationship' | 'support' | 'coping';
  severity: 'low' | 'moderate' | 'high' | 'critical';
  description: string;
  intervention: string;
}

// 🎯 Recomendaciones de intervención
export interface InterventionRecommendation {
  id: string;
  type: 'psychotherapy' | 'medication' | 'lifestyle' | 'support-group' | 'couples-therapy' | 'urgent-referral';
  priority: 'low' | 'moderate' | 'high' | 'urgent';
  title: string;
  description: string;
  duration: string;
  provider: string;
  evidenceLevel: 'A' | 'B' | 'C';
  contraindications?: string[];
}

// 📱 Dashboard emocional
export interface EmotionalDashboardData {
  currentMood: {
    stress: number; // 0-40 PSS-10
    anxiety: number; // 0-100 FertiQoL
    depression: number; // 0-27 PHQ-9F
  };
  trends: {
    weekly: TrendData[];
    monthly: TrendData[];
  };
  alerts: PsychologicalAlert[];
  recommendations: QuickRecommendation[];
}

export interface TrendData {
  date: Date;
  stress: number;
  anxiety: number;
  depression: number;
  treatmentPhase?: 'pre-treatment' | 'stimulation' | 'retrieval' | 'transfer' | 'wait' | 'result';
}

export interface PsychologicalAlert {
  id: string;
  type: 'warning' | 'critical' | 'info';
  title: string;
  message: string;
  action?: string;
  urgent: boolean;
}

export interface QuickRecommendation {
  id: string;
  type: 'mindfulness' | 'exercise' | 'breathing' | 'communication' | 'professional-help';
  title: string;
  description: string;
  duration: string;
  icon: string;
}

// 🔗 Integración con datos clínicos
export interface PsychoMedicalIntegration {
  clinicalData: {
    age: number;
    bmi: number;
    infertilityDuration: number;
    cycleRegularity: boolean;
    previousFailures: number;
    currentTreatment?: string;
  };
  psychologicalProfile: PsychologicalProfile;
  integratedRisk: {
    overall: number; // 0-100
    psychological: number;
    medical: number;
    combined: number;
  };
  recommendations: IntegratedRecommendation[];
}

export interface IntegratedRecommendation {
  id: string;
  type: 'delay-treatment' | 'psychological-support' | 'modify-protocol' | 'continue-standard' | 'urgent-intervention';
  title: string;
  description: string;
  medicalRationale: string;
  psychologicalRationale: string;
  evidence: string;
  timeline: string;
}
