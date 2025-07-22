// ===================================================================
// ABORTION RISK CALCULATOR - MEDICAL MODELS & TYPES
// Based on ACOG Practice Bulletin 200 (2024) and Evidence-Based Medicine
// ===================================================================

export enum ThrombophiliaType {
  FACTOR_V_LEIDEN = 'factor_v_leiden',
  PROTHROMBIN_G20210A = 'prothrombin_g20210a',
  PROTEIN_C_DEFICIENCY = 'protein_c_deficiency',
  PROTEIN_S_DEFICIENCY = 'protein_s_deficiency',
  ANTITHROMBIN_DEFICIENCY = 'antithrombin_deficiency'
}

export enum UterineAnomalyType {
  SEPTATE_UTERUS = 'septate_uterus',
  BICORNATE_UTERUS = 'bicornate_uterus',
  UNICORNATE_UTERUS = 'unicornate_uterus',
  DIDELPHYS = 'didelphys'
}

export enum AutoimmuneCondition {
  ANTIPHOSPHOLIPID_SYNDROME = 'antiphospholipid_syndrome',
  SYSTEMIC_LUPUS = 'systemic_lupus',
  RHEUMATOID_ARTHRITIS = 'rheumatoid_arthritis',
  THYROID_AUTOIMMUNE = 'thyroid_autoimmune'
}

export enum SmokingStatus {
  NEVER = 'never',
  FORMER = 'former',
  CURRENT_LIGHT = 'current_light',
  CURRENT_MODERATE = 'current_moderate',
  CURRENT_HEAVY = 'current_heavy'
}

export enum AlcoholConsumption {
  NONE = 'none',
  OCCASIONAL = 'occasional',
  MODERATE = 'moderate',
  HEAVY = 'heavy'
}

export enum ExerciseLevel {
  SEDENTARY = 'sedentary',
  LIGHT = 'light',
  MODERATE = 'moderate',
  HEAVY = 'heavy'
}

export interface MedicalConditions {
  thrombophilias?: ThrombophiliaType[];
  uterineAnomalies?: UterineAnomalyType[];
  antiphospholipid?: boolean;
  diabetes?: boolean;
  thyroidDisorder?: boolean;
  autoimmune?: AutoimmuneCondition[];
  chronicKidneyDisease?: boolean;
  hypertension?: boolean;
}

export interface LifestyleFactors {
  smoking: SmokingStatus;
  BMI?: number;
  alcohol?: AlcoholConsumption;
  exercise?: ExerciseLevel;
  stress_level?: number; // 1-10 scale
  sleep_hours?: number;
}

export interface ObstetricHistory {
  totalPregnancies: number;
  previousAbortions: number;
  previousLivebirths: number;
  gestationalAgeAtLosses?: number[]; // weeks
  consecutiveLosses?: number;
  lossesAfterLivebirth?: number;
}

export interface PatientInput {
  // Demographics
  age: number;
  weight?: number; // kg
  height?: number; // cm
  
  // Obstetric History
  obstetricHistory: ObstetricHistory;
  
  // Medical History
  medicalConditions: MedicalConditions;
  
  // Lifestyle
  lifestyle: LifestyleFactors;
  
  // Current Pregnancy Context (optional)
  currentGestationalAge?: number;
  isCurrentlyPregnant?: boolean;
}

export interface TrimesterRisks {
  first: number;    // 0-12 weeks
  second: number;   // 13-27 weeks
  third: number;    // 28+ weeks
}

export interface RiskFactorContribution {
  factor: string;
  weight: number;
  impact: 'protective' | 'risk' | 'neutral';
  evidence_level: 'high' | 'moderate' | 'low';
}

export interface NeuralWeighting {
  ageWeight: number;        // 35% standard
  historyWeight: number;    // 40% standard
  medicalWeight: number;    // 25% standard
  confidenceScore: number;  // 0-1
}

export interface RiskResult {
  // Primary Results
  overallRisk: number;        // 0.0 - 1.0
  percentage: string;         // "15.3%"
  category: 'Low' | 'Moderate' | 'High' | 'Very High';
  confidence: number;         // 0.0 - 1.0
  
  // Detailed Analysis
  trimesterRisks: TrimesterRisks;
  neuralWeighting: NeuralWeighting;
  riskFactorContributions: RiskFactorContribution[];
  
  // Clinical Guidance
  modifiableFactors: string[];
  recommendations: string[];
  urgentAlerts: string[];
  
  // Evidence Base
  evidenceReferences: string[];
  calculationDate: Date;
  
  // Additional Metrics
  populationPercentile?: number; // Where this patient ranks vs population
  improvementPotential?: number; // How much risk could be reduced
}

export interface ValidationResult {
  isValid: boolean;
  warnings: string[];
  errors: string[];
  missingOptimalData: string[];
}

// Evidence-based constants for medical calculations
export const ABORTION_RISK_CONSTANTS = {
  // Base prevalence by age groups (meta-analysis data)
  AGE_RISK: {
    UNDER_25: 0.10,    // 10% base risk
    AGE_25_29: 0.11,   // 11% base risk
    AGE_30_34: 0.12,   // 12% base risk
    AGE_35_39: 0.18,   // 18% base risk
    AGE_40_44: 0.34,   // 34% base risk
    OVER_45: 0.53      // 53% base risk
  },
  
  // Risk multipliers for previous abortions (ACOG 2024)
  PREVIOUS_ABORTION_MULTIPLIERS: {
    ZERO: 1.0,
    ONE: 1.3,         // 30% increase
    TWO: 2.9,         // 190% increase
    THREE: 4.2,       // 320% increase
    FOUR_PLUS: 6.8    // 580% increase
  },
  
  // Medical conditions odds ratios
  MEDICAL_CONDITIONS_OR: {
    FACTOR_V_LEIDEN: 2.0,
    PROTHROMBIN: 2.8,
    PROTEIN_C: 3.2,
    ANTIPHOSPHOLIPID: 9.7,
    UTERINE_SEPTUM: 2.9,     // 67% abortion rate
    BICORNATE_UTERUS: 1.6,   // 36% abortion rate
    DIABETES: 3.7,
    THYROID: 2.1,
    SMOKING: 1.8,
    OBESITY_BMI35: 1.7
  },
  
  // Neural network weights
  NEURAL_WEIGHTS: {
    AGE: 0.35,        // 35% weight
    HISTORY: 0.40,    // 40% weight
    MEDICAL: 0.25     // 25% weight
  },
  
  // Risk categorization thresholds
  RISK_THRESHOLDS: {
    LOW: 0.15,        // < 15%
    MODERATE: 0.30,   // 15-30%
    HIGH: 0.50,       // 30-50%
    VERY_HIGH: 1.0    // > 50%
  }
} as const;

export type AbortionRiskConstants = typeof ABORTION_RISK_CONSTANTS;