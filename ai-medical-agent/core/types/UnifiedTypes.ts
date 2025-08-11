/**
 * 🎯 TIPOS UNIFICADOS DEL SISTEMA AI MÉDICO - VERSION 3.0
 * Consolidación basada en las ESTRUCTURAS REALES de pathologies.ts y treatments.ts
 * Arquitectura alineada con el conocimiento médico existente
 */

// ====================================================================
// 🎯 TYPE ALIASES (Para evitar union types repetidas)
// ====================================================================

export type EvidenceLevel = 'A' | 'B' | 'C' | 'D';
export type PathologyCategory = 'female' | 'male' | 'couple' | 'unexplained';
export type TreatmentCategory = 'level1' | 'level2' | 'level3';
export type ComplexityLevel = 'low' | 'medium' | 'high';
export type ComponentStatus = 'OK' | 'WARNING' | 'ERROR';
export type SystemStatus = 'HEALTHY' | 'DEGRADED' | 'CRITICAL';

// ====================================================================
// 🏥 ENTRADA DE USUARIO UNIFICADA (Alineada con pathologies reales)
// ====================================================================

export interface UnifiedUserInput {
  // 📋 DATOS BÁSICOS (OBLIGATORIOS)
  age: number;
  infertilityDuration: number; // meses

  // 📊 DATOS FÍSICOS (OPCIONALES)
  bmi?: number;
  height?: number;
  weight?: number;

  // 🧬 HISTORIAL MÉDICO (Alineado con pathologies.ts)
  medicalHistory?: string[];
  symptoms?: string[]; // Basado en symptoms de PathologyDefinition
  previousTreatments?: string[]; // IDs de TreatmentProtocol
  surgicalHistory?: string[];
  familyHistory?: string[];

  // 🔬 LABORATORIOS COMPLETOS (Según criterios diagnósticos reales)
  labs?: {
    // Hormonas reproductivas (criterios pathologies.ts)
    amh?: number;        // Para evaluación reserva ovárica
    fsh?: number;        // Criterio diagnóstico en múltiples pathologies
    lh?: number;         // Para PCOS diagnosis
    estradiol?: number;
    progesterone?: number;
    prolactin?: number;
    
    // Función tiroidea (hypothyroidismFertility pathology)
    tsh?: number;
    t3?: number;
    t4?: number;
    
    // Metabolismo (PCOS, BMIandFertility)
    glucose?: number;
    insulin?: number;
    hba1c?: number;
    
    // Andrógenos (PCOS criteria)
    testosterone?: number;
    dheas?: number;
    androstenedione?: number;
    
    // Otros
    vitaminD?: number;
    b12?: number;
    folate?: number;
  };

  // 👫 FACTOR MASCULINO (maleInfertility pathology)
  partner?: {
    age?: number;
    spermAnalysis?: {
      concentration?: number; // WHO 2021 criteria en maleInfertility
      totalCount?: number;
      motility?: number;       // WHO 2021: ≥42%
      progressiveMotility?: number; // WHO 2021: ≥30%
      morphology?: number;     // WHO 2021: ≥4%
      volume?: number;         // WHO 2021: ≥1.4ml
      ph?: number;
      vitality?: number;
    };
    medicalHistory?: string[];
    lifestyle?: {
      smoking?: boolean;
      alcohol?: number; // drinks/week
      exercise?: number; // hours/week
    };
  };

  // 🏥 PROCEDIMIENTOS Y ESTUDIOS (Basado en diagnosticCriteria reales)
  procedures?: {
    hsg?: {
      date?: Date;
      result?: 'normal' | 'unilateral_blocked' | 'bilateral_blocked' | 'abnormal';
      details?: string;
    };
    laparoscopy?: {
      date?: Date;
      findings?: string[]; // De endometriosis, adenomiosis pathologies
    };
    hysteroscopy?: {
      date?: Date;
      findings?: string[]; // De endometrialPolyps, uterineFibroids
    };
    ultrasound?: {
      date?: Date;
      ovarianVolume?: number;
      antrallFollicles?: number; // CFA para reserva ovárica
      uterineAbnormalities?: string[];
    };
  };

  // 📅 INFORMACIÓN MENSTRUAL (PCOS, anovulation criteria)
  menstrualInfo?: {
    cycleLength?: number; // días
    periodDuration?: number; // días
    lastPeriod?: Date;
    cycleRegularity?: 'regular' | 'irregular' | 'absent'; // Rotterdam criteria
    flowIntensity?: 'light' | 'normal' | 'heavy';
    dysmenorrhea?: boolean; // endometriosis symptom
    ovulationSigns?: boolean;
  };

  // 🤱 HISTORIAL OBSTÉTRICO (priorPelvicSurgery, ageRelatedDecline)
  obstetricHistory?: {
    pregnancies?: number;
    liveBirths?: number;
    miscarriages?: number;
    ectopicPregnancies?: number;
    complications?: string[];
  };

  // 💊 MEDICAMENTOS ACTUALES
  currentMedications?: Array<{
    name: string;
    dose?: string;
    frequency?: string;
    startDate?: Date;
  }>;

  // 🏃‍♀️ ESTILO DE VIDA (BMIandFertility, pathologies risk factors)
  lifestyle?: {
    smoking?: boolean;
    alcohol?: number; // drinks/week
    caffeine?: number; // cups/day
    exercise?: number; // hours/week
    stress?: 'low' | 'moderate' | 'high';
    sleep?: number; // hours/night
    diet?: 'balanced' | 'vegetarian' | 'vegan' | 'keto' | 'mediterranean';
  };
}

// ====================================================================
// 🧠 ANÁLISIS CLÍNICO UNIFICADO (Basado en PathologyDefinition)
// ====================================================================

export interface UnifiedClinicalAnalysis {
  // 🎯 DIAGNÓSTICO PRINCIPAL (Estructura PathologyDefinition)
  primaryDiagnosis: {
    pathologyId: string;        // ID de PATHOLOGIES_DATABASE
    pathology: string;          // PathologyDefinition.name
    pathologyES: string;        // PathologyDefinition.nameES
    category: PathologyCategory; // PathologyDefinition.category
    confidence: number;         // 0-100
    evidenceLevel: EvidenceLevel; // PathologyDefinition.evidenceLevel
    clinicalJustification: string;
    prevalence: string;         // PathologyDefinition.prevalence
    definition: string;         // PathologyDefinition.definition
  };

  // 🤔 DIAGNÓSTICOS DIFERENCIALES (PathologyDefinition structure)
  differentialDiagnoses: Array<{
    pathologyId: string;
    pathology: string;
    probability: number; // 0-100
    supportingEvidence: string[]; // De PathologyDefinition.symptoms
    againstEvidence: string[];
    recommendedTests: string[];   // De PathologyDefinition.diagnosticCriteria
  }>;

  // ⚠️ ESTRATIFICACIÓN DE RIESGO (Basado en PathologyDefinition.riskFactors)
  riskStratification: {
    level: 'low' | 'moderate' | 'high' | 'critical';
    ageRelatedRisk: number;      // De ageRelatedDecline pathology
    ovarianReserveRisk: number;  // De diminishedOvarianReserve pathology
    timeFactorRisk: number;
    cumulativeRisk: number;
    modifiableFactors: string[];    // De PathologyDefinition.riskFactors
    nonModifiableFactors: string[]; // De PathologyDefinition.riskFactors
    urgencyIndicators: string[];
  };

  // 🌳 ÁRBOL DE DECISIÓN TERAPÉUTICA (Basado en TreatmentProtocol)
  treatmentDecisionTree: {
    firstLine: {
      treatmentId: string;        // ID de TREATMENTS_DATABASE
      treatment: string;          // TreatmentProtocol.nameES
      category: TreatmentCategory; // TreatmentProtocol.category
      complexity: ComplexityLevel;    // TreatmentProtocol.complexity
      successRate: string;       // TreatmentProtocol.successRate.perCycle
      duration: string;
      monitoring: string[];      // TreatmentProtocol.monitoring
      costEstimate: string;     // TreatmentProtocol.costs.estimate
      timeToPregnancy: string;  // TreatmentProtocol.successRate.timeToSuccess
    };
    secondLine: {
      treatmentId: string;
      treatment: string;
      successRate: string;
      duration: string;
      triggerCriteria: string[]; // TreatmentProtocol.nextSteps.ifFailure
    };
    thirdLine: {
      treatmentId: string;
      treatment: string;
      successRate: string;
      duration: string;
      triggerCriteria: string[];
    };
    alternatives: Array<{
      treatmentId: string;
      treatment: string;
      successRate: string;
      indications: string[];      // TreatmentProtocol.indications
      contraindications: string[]; // TreatmentProtocol.contraindications
    }>;
  };

  // 🔮 PRONÓSTICO (PathologyDefinition.prognosis structure)
  prognosis: {
    natural: string;            // PathologyDefinition.prognosis.natural
    withTreatment: string;      // PathologyDefinition.prognosis.withTreatment
    timeToConception: string;   // PathologyDefinition.prognosis.timeToConception
    factorsAffectingOutcome: string[];
    predictiveIndicators: string[];
  };

  // 📚 BASE DE EVIDENCIA (PathologyDefinition.references structure)
  evidenceBase: {
    primaryReferences: Array<{
      finding: string;
      evidenceLevel: EvidenceLevel;
      source: string;
      year?: number;
      pmid?: string;          // PathologyDefinition.references.pmid
      doi?: string;           // PathologyDefinition.references.doi
      guideline?: string;     // PathologyDefinition.references.guideline
    }>;
    clinicalGuidelines: string[];    // De TreatmentProtocol.guidelines
    expertConsensus: string[];
    limitations: string[];
  };

  // 🔗 CONDICIONES RELACIONADAS (PathologyDefinition.relatedConditions)
  relatedConditions: string[];        // PathologyDefinition.relatedConditions
}

// ====================================================================
// 📊 TASAS DE ÉXITO UNIFICADAS (Basado en TreatmentProtocol.successRate)
// ====================================================================

export interface UnifiedSuccessRate {
  // 🎯 INFORMACIÓN DEL TRATAMIENTO (TreatmentProtocol structure)
  treatmentId: string;         // ID de TREATMENTS_DATABASE
  technique: string;           // TreatmentProtocol.nameES
  category: TreatmentCategory; // TreatmentProtocol.category
  complexity: ComplexityLevel;    // TreatmentProtocol.complexity
  
  // 📈 TASAS DE ÉXITO (TreatmentProtocol.successRate structure)
  successRate: {
    perCycle: string;          // TreatmentProtocol.successRate.perCycle
    cumulative: string;        // TreatmentProtocol.successRate.cumulative
    timeToSuccess: string;     // TreatmentProtocol.successRate.timeToSuccess
  };
  
  // 🎯 INDICACIONES (TreatmentProtocol structure)
  indications: string[];       // TreatmentProtocol.indications
  contraindications: string[]; // TreatmentProtocol.contraindications
  prerequisites: string[];     // TreatmentProtocol.prerequisites
  
  // 💰 INFORMACIÓN ECONÓMICA (TreatmentProtocol.costs)
  costs: {
    estimate: string;          // TreatmentProtocol.costs.estimate
    factors: string[];         // TreatmentProtocol.costs.factors
  };
  
  // ⚠️ RIESGOS Y LIMITACIONES (TreatmentProtocol.risks)
  risks: {
    maternal: string[];        // TreatmentProtocol.risks.maternal
    fetal: string[];           // TreatmentProtocol.risks.fetal
    procedural: string[];      // TreatmentProtocol.risks.procedural
  };

  // 📊 MONITOREO (TreatmentProtocol.monitoring)
  monitoring: string[];        // TreatmentProtocol.monitoring
  
  // 🔄 SIGUIENTES PASOS (TreatmentProtocol.nextSteps)
  nextSteps: {
    ifSuccess: string;         // TreatmentProtocol.nextSteps.ifSuccess
    ifFailure: string[];       // TreatmentProtocol.nextSteps.ifFailure
  };

  // 📚 NIVEL DE EVIDENCIA (TreatmentProtocol.evidenceLevel)
  evidenceLevel: EvidenceLevel;
  
  // 🎯 NIVEL DE CONFIANZA (Añadido para ConversationEngine)
  confidence: number;          // 0-100: Nivel de confianza en la recomendación
  
  // 📖 GUÍAS CLÍNICAS (TreatmentProtocol.guidelines)
  guidelines: string[];        // TreatmentProtocol.guidelines

  recommendation: string;
}

// ====================================================================
// 💬 RESPUESTA MÉDICA UNIFICADA
// ====================================================================

export interface UnifiedMedicalResponse {
  // 📝 INFORMACIÓN PRINCIPAL
  primaryInfo: string;
  detailedExplanation: string;
  
  // 🎯 RECOMENDACIONES PERSONALIZADAS
  recommendations: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
    lifestyle: string[];
    medical: string[];
  };
  
  // 🔗 CONDICIONES RELACIONADAS
  relatedConditions: string[];
  
  // 💊 OPCIONES DE TRATAMIENTO
  treatmentOptions: Array<{
    treatment: string;
    appropriateness: number; // 0-100
    timing: string;
    considerations: string[];
  }>;
  
  // 📊 NIVEL DE EVIDENCIA
  evidenceLevel: 'A' | 'B' | 'C' | 'D';
  confidenceLevel: number; // 0-100
  
  // ❓ PREGUNTAS DE SEGUIMIENTO
  followUpQuestions: string[];
  
  // 🚨 SEÑALES DE ALARMA
  redFlags: string[];
  
  // 📚 RECURSOS EDUCATIVOS
  educationalResources: Array<{
    title: string;
    type: 'article' | 'video' | 'guideline' | 'support_group';
    url?: string;
    description: string;
  }>;
  
  // 🔄 SEGUIMIENTO
  followUp: {
    recommended: boolean;
    timeframe: string;
    purpose: string;
    tests?: string[];
  };
}

// ====================================================================
// 🎭 CONTEXTO DE CONVERSACIÓN
// ====================================================================

export interface UnifiedConversationContext {
  sessionId: string;
  interactionCount: number;
  conversationType: 'diagnostic' | 'therapeutic' | 'prognostic' | 'educational' | 'supportive';
  
  // 📚 CONTEXTO MÉDICO
  medicalContext?: {
    clinicalAnalysis?: UnifiedClinicalAnalysis;
    successRates?: UnifiedSuccessRate[];
    priorQuestions?: string[];
    currentFocus?: string;
  };
  
  // 👤 PERFIL DEL USUARIO
  userProfile?: {
    preferredLanguage?: string;
    medicalLiteracy?: 'basic' | 'intermediate' | 'advanced';
    emotionalState?: 'calm' | 'anxious' | 'overwhelmed' | 'hopeful';
    informationNeeds?: string[];
  };
  
  // 🎯 OBJETIVOS DE LA CONVERSACIÓN
  goals: {
    primary: string;
    secondary: string[];
    completed: string[];
  };
  
  // 📝 HISTORIAL
  conversationHistory: Array<{
    timestamp: Date;
    userMessage: string;
    aiResponse: string;
    topics: string[];
    satisfaction?: number; // 1-5
  }>;
}

// ====================================================================
// 🔧 CONFIGURACIÓN Y OPERACIÓN
// ====================================================================

export interface UnifiedAgentConfig {
  version: string;
  languagePreference: 'es' | 'en';
  medicalSpecialty: 'fertility' | 'general' | 'reproductive_endocrinology';
  evidenceLevel: 'conservative' | 'standard' | 'progressive';
  empathyLevel: 'clinical' | 'balanced' | 'compassionate';
  
  // 🎛️ CONFIGURACIONES TÉCNICAS
  technical: {
    enableCaching: boolean;
    enableProfiling: boolean;
    enableLogging: boolean;
    maxCacheSize: number;
    responseTimeout: number; // ms
  };
  
  // 🎯 PERSONALIZACIÓN
  personalization: {
    adaptToUserLevel: boolean;
    rememberPreferences: boolean;
    provideCulturalContext: boolean;
    includeEmotionalSupport: boolean;
  };
}

export interface UnifiedOperationResult<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: string | object; // Corregido: no usar any
    recoverable?: boolean;
  };
  metadata?: {
    processingTime: number;
    confidence: number;
    evidenceLevel: string;
    cacheHit?: boolean;
    warnings?: string[];
  };
}

// ====================================================================
// 📊 MÉTRICAS Y PERFORMANCE
// ====================================================================

export interface UnifiedPerformanceMetrics {
  responseTimeMs: number;
  confidenceScore: number;
  evidenceQuality: string;
  userSatisfactionPredicted: number;
  
  // 🧠 MÉTRICAS DE IA
  aiMetrics: {
    modelAccuracy?: number;
    predictionUncertainty?: number;
    knowledgeCompleteness?: number;
    reasoningComplexity?: number;
  };
  
  // 🏥 MÉTRICAS MÉDICAS
  medicalMetrics: {
    diagnosisConfidence: number;
    treatmentAppropriateness: number;
    evidenceSupport: number;
    guidelineCompliance: number;
  };
  
  // 💬 MÉTRICAS DE CONVERSACIÓN
  conversationMetrics: {
    clarityScore: number;
    empathyScore: number;
    engagementLevel: number;
    informationDensity: number;
  };
}

export interface UnifiedSystemHealth {
  overall: SystemStatus;
  
  components: {
    clinicalEngine: ComponentStatus;
    successCalculator: ComponentStatus;
    conversationEngine: ComponentStatus;
    knowledgeBase: ComponentStatus;
    cache: ComponentStatus;
  };
  
  metrics: {
    uptime: number; // ms
    totalRequests: number;
    successRate: number;
    averageResponseTime: number;
    cacheHitRate: number;
    errorRate: number;
  };
  
  recommendations: string[];
  lastHealthCheck: Date;
}

// ====================================================================
// 🎓 ESTADO DE SESIÓN
// ====================================================================

export interface UnifiedSessionState {
  sessionId: string;
  startTime: Date;
  lastActivity: Date;
  totalInteractions: number;
  
  // 🎯 CONTEXTO ACTUAL
  currentContext: 'consultation' | 'conversation' | 'analysis' | 'follow_up';
  activeTopics: string[];
  completedAssessments: string[];
  
  // 👤 INFORMACIÓN DEL USUARIO
  userPreferences: {
    language: string;
    communicationStyle: string;
    informationLevel: string;
  };
  
  // 📊 MÉTRICAS DE SESIÓN
  sessionMetrics: {
    satisfactionScores: number[];
    topicsExplored: string[];
    questionsAsked: number;
    recommendationsProvided: number;
  };
}

// ====================================================================
// � ALERTAS Y MÉTRICAS DE CALIDAD
// ====================================================================

export interface UnifiedAlert {
  critical: string[];
  warnings: string[];
  informational: string[];
}

export interface UnifiedQualityMetrics {
  overallConfidence: number;
  evidenceStrength: 'weak' | 'moderate' | 'strong';
  completenessScore: number;
  reliabilityIndex: number;
}

// ====================================================================
// �🔄 EXPORTS UNIFICADOS
// ====================================================================

export type {
    UnifiedAgentConfig as AgentConfig, UnifiedClinicalAnalysis as ClinicalAnalysis, UnifiedConversationContext as ConversationContext, UnifiedMedicalResponse as MedicalResponse,
    UnifiedOperationResult as OperationResult,
    UnifiedPerformanceMetrics as PerformanceMetrics, UnifiedSessionState as SessionState, UnifiedSuccessRate as SuccessRate, UnifiedSystemHealth as SystemHealth,
    // Core types
    UnifiedUserInput as UserInput
};

// También definir ComprehensiveAnalysisResult
export type ComprehensiveAnalysisResult = {
  clinicalAnalysis: UnifiedClinicalAnalysis;
  successRates: UnifiedSuccessRate[];
  primaryRecommendations: string[];
  conversationContext: UnifiedConversationContext;
  qualityMetrics: UnifiedQualityMetrics;
  alerts: UnifiedAlert;
};

// ====================================================================
// 🎯 CONSTANTES DEL SISTEMA (Basadas en estructuras reales)
// ====================================================================

export const SYSTEM_VERSION = '3.0-UNIFIED';
export const SUPPORTED_LANGUAGES = ['es'] as const;
export const EVIDENCE_LEVELS: readonly EvidenceLevel[] = ['A', 'B', 'C', 'D'] as const;
export const PATHOLOGY_CATEGORIES: readonly PathologyCategory[] = ['female', 'male', 'couple', 'unexplained'] as const;
export const TREATMENT_CATEGORIES: readonly TreatmentCategory[] = ['level1', 'level2', 'level3'] as const;
export const COMPLEXITY_LEVELS: readonly ComplexityLevel[] = ['low', 'medium', 'high'] as const;
export const COMPONENT_STATUSES: readonly ComponentStatus[] = ['OK', 'WARNING', 'ERROR'] as const;
export const SYSTEM_STATUSES: readonly SystemStatus[] = ['HEALTHY', 'DEGRADED', 'CRITICAL'] as const;

// ✅ TIPOS UNIFICADOS COMPLETADOS - ARQUITECTURA LIMPIA Y ESCALABLE
