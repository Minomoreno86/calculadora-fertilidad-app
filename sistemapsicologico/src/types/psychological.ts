// Tipos para Evaluaciones Psicológicas de Fertilidad
// Basado en instrumentos validados científicamente

export interface PSS10Assessment {
  id: string;
  patientId: string;
  timestamp: Date;
  responses: PSS10Response[];
  totalScore: number;
  riskLevel: 'bajo' | 'moderado' | 'alto';
  recommendations: string[];
}

export interface PSS10Response {
  questionId: number;
  question: string;
  response: 0 | 1 | 2 | 3 | 4; // Escala Likert 0-4
}

export interface FertiQoLAssessment {
  id: string;
  patientId: string;
  timestamp: Date;
  domains: {
    emotional: FertiQoLDomain;
    mindBody: FertiQoLDomain;
    relational: FertiQoLDomain;
    social: FertiQoLDomain;
    environmental: FertiQoLDomain;
    tolerability: FertiQoLDomain;
  };
  totalScore: number;
  qualityOfLife: 'excelente' | 'buena' | 'comprometida' | 'severamente_afectada';
}

export interface FertiQoLDomain {
  score: number;
  maxScore: number;
  interpretation: string;
}

export interface PHQ9FAssessment {
  id: string;
  patientId: string;
  timestamp: Date;
  responses: PHQ9FResponse[];
  totalScore: number;
  depressionLevel: 'ninguna' | 'leve' | 'moderada' | 'moderada_severa' | 'severa';
  fertilitySpecificItems: PHQ9FertilityItems;
  riskFactors: string[];
  requiresIntervention: boolean;
}

export interface PHQ9FResponse {
  questionId: number;
  question: string;
  response: 0 | 1 | 2 | 3; // No, varios días, más de la mitad, casi todos los días
}

export interface PHQ9FertilityItems {
  guilt: number;
  socialAvoidance: number;
  bodyFailure: number;
}

export interface DAS7Assessment {
  id: string;
  patientId: string;
  timestamp: Date;
  responses: DAS7Response[];
  totalScore: number;
  relationshipQuality: 'excelente' | 'buena' | 'comprometida' | 'severamente_afectada';
  dimensions: {
    consensus: number;
    satisfaction: number;
    cohesion: number;
    affectiveExpression: number;
  };
}

export interface DAS7Response {
  questionId: number;
  question: string;
  response: number; // Varía según la pregunta
}

export interface MSPSSFAssessment {
  id: string;
  patientId: string;
  timestamp: Date;
  responses: MSPSSFResponse[];
  dimensions: {
    familySupport: number;
    friendsSupport: number;
    partnerSupport: number;
  };
  totalScore: number;
  supportLevel: 'alto' | 'moderado' | 'bajo' | 'muy_bajo';
}

export interface MSPSSFResponse {
  questionId: number;
  question: string;
  response: 1 | 2 | 3 | 4 | 5 | 6 | 7; // Totalmente en desacuerdo a totalmente de acuerdo
}

export interface BriefCOPEFAssessment {
  id: string;
  patientId: string;
  timestamp: Date;
  responses: BriefCOPEFResponse[];
  adaptiveStrategies: CopingStrategy[];
  maladaptiveStrategies: CopingStrategy[];
  copingProfile: 'adaptativo' | 'mixto_positivo' | 'evitativo' | 'desadaptativo';
  recommendations: string[];
}

export interface BriefCOPEFResponse {
  questionId: number;
  question: string;
  strategy: string;
  response: 1 | 2 | 3 | 4; // No lo he hecho en absoluto a lo he hecho mucho
}

export interface CopingStrategy {
  name: string;
  score: number;
  category: 'adaptativa' | 'desadaptativa';
  description: string;
}

// Perfil Psicológico Integrado
export interface PsychologicalProfile {
  patientId: string;
  lastUpdated: Date;
  assessments: {
    stress: PSS10Assessment | null;
    qualityOfLife: FertiQoLAssessment | null;
    depression: PHQ9FAssessment | null;
    relationship: DAS7Assessment | null;
    socialSupport: MSPSSFAssessment | null;
    coping: BriefCOPEFAssessment | null;
  };
  overallRisk: PsychologicalRisk;
  interventions: InterventionRecommendation[];
  readyForTreatment: boolean;
}

export interface PsychologicalRisk {
  level: 'bajo' | 'moderado' | 'alto' | 'critico';
  factors: string[];
  score: number;
  requiresUrgentIntervention: boolean;
  contraindication: boolean;
}

export interface InterventionRecommendation {
  type: 'psicoeducacion' | 'terapia_individual' | 'terapia_pareja' | 'psicofarmacologia' | 'grupos_apoyo' | 'mindfulness' | 'derivacion_urgente';
  priority: 'alta' | 'media' | 'baja';
  description: string;
  resources: InterventionResource[];
  estimatedDuration: string;
}

export interface InterventionResource {
  type: 'articulo' | 'video' | 'ejercicio' | 'app' | 'contacto_profesional';
  title: string;
  url?: string;
  description: string;
}

// Algoritmos de Decisión
export interface PsychoClinicDecision {
  patientId: string;
  psychologicalProfile: PsychologicalProfile;
  clinicalFactors: {
    age: number;
    bmi: number;
    infertilityDuration: number;
    treatmentHistory: string[];
  };
  recommendation: TreatmentRecommendation;
  reasoning: string[];
  contraindications: string[];
}

export interface TreatmentRecommendation {
  proceedWithTreatment: boolean;
  delayRecommended: boolean;
  delayDuration?: string;
  requiredInterventions: InterventionRecommendation[];
  monitoringPlan: MonitoringPlan;
}

export interface MonitoringPlan {
  frequency: 'semanal' | 'quincenal' | 'mensual';
  assessments: string[];
  triggers: string[];
  escalationCriteria: string[];
}

// Estados del Dashboard
export interface EmotionalDashboardData {
  currentMood: 1 | 2 | 3 | 4 | 5;
  currentStress: number;
  stressLevel: number;
  anxietyLevel: number;
  supportLevel: number;
  copingEffectiveness: number;
  weeklyTrend: DailyMoodEntry[];
  trends: TrendData[];
  alerts: PsychologicalAlert[];
}

export interface TrendData {
  direction: 'up' | 'down' | 'stable';
  change: number;
  label: string;
}

export interface DailyMoodEntry {
  date: Date;
  mood: number;
  stress: number;
  notes?: string;
  triggers?: string[];
}

export interface PsychologicalAlert {
  id: string;
  type: 'info' | 'warning' | 'danger';
  message: string;
  timestamp: Date;
  actionRequired: boolean;
  resources?: InterventionResource[];
  actions?: string[];
}

// Crisis Protocol
export interface CrisisAssessment {
  patientId: string;
  timestamp: Date;
  suicidalIdeation: boolean;
  selfHarmRisk: boolean;
  psychosis: boolean;
  severeDepression: boolean;
  riskLevel: 'bajo' | 'moderado' | 'alto' | 'inminente';
  immediateActions: string[];
  emergencyContacts: EmergencyContact[];
}

export interface EmergencyContact {
  type: 'psicologo' | 'psiquiatra' | 'emergencias' | 'linea_crisis';
  name: string;
  phone: string;
  availability: string;
}

// Todos los tipos se exportan individualmente arriba
