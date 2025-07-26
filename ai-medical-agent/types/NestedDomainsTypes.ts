/**
 * 🧠 NESTED DOMAINS TYPES V13.1 - EXTENDED MEDICAL TYPES
 * Tipos Extendidos para Dominios Anidados y Arquitectura Neuronal
 * 
 * @description Extensiones de tipos médicos para Nested Domains V13.1
 * @version 13.1.0 - Neural Evolution + Hierarchical Intelligence
 */

import { 
  PathologyAnalysis,
  TreatmentRecommendation,
  DiagnosticResult,
  ClinicalEvidence,
  EvidenceLevel
} from './MedicalTypes';

// ====================================================================
// 🧬 EXTENDED PATHOLOGY ANALYSIS FOR NESTED DOMAINS
// ====================================================================

export interface ExtendedPathologyAnalysis extends PathologyAnalysis {
  // Additional fields for nested domains
  secondaryDiagnoses?: DiagnosticResult[];
  prognosticFactors?: string[];
  clinicalEvidence?: ClinicalEvidence[];
  
  // Nested domain specific fields
  domainContext?: {
    domain: string;
    specialization: string;
    neuralArchitecture: string;
    accuracy: number;
  };
  
  domainSpecialization?: {
    primaryDomain: string;
    specializationLevel: 'basic' | 'intermediate' | 'advanced' | 'ultra-specialized';
    confidence: number;
    neuralArchitecture: string;
  };
}

// ====================================================================
// 💊 EXTENDED TREATMENT RECOMMENDATION FOR NESTED DOMAINS
// ====================================================================

export interface ExtendedTreatmentRecommendation extends TreatmentRecommendation {
  // Treatment details for nested domain compatibility
  treatment: {
    nameES: string;
    type: string;
    description?: string;
  };
  
  // Domain-specific fields
  domainSpecific?: {
    primaryDomain: string;
    specialization: string;
    neuralOptimization: boolean;
  };
  
  // Enhanced evidence and outcomes
  successRateByDomain?: {
    [domain: string]: number;
  };
  
  crossDomainFactors?: string[];
}

// ====================================================================
// 🎯 NESTED DOMAIN INSIGHT INTERFACE
// ====================================================================

export interface NestedDomainInsight {
  domain: string;
  insight: string;
  evidenceLevel: EvidenceLevel;
  clinicalRelevance: number; // 0-1
  emergentPattern?: boolean;
  crossDomainFactor?: boolean;
  neuralConfidence?: number;
}

// ====================================================================
// 🔄 TYPE ALIASES FOR COMPATIBILITY
// ====================================================================

// For backward compatibility with existing code
export type PathologyAnalysisWithInsights = ExtendedPathologyAnalysis & { 
  nestedInsights: NestedDomainInsight[] 
};

export type TreatmentRecommendationExtended = ExtendedTreatmentRecommendation;

// ====================================================================
// 🧠 NESTED DOMAIN SPECIFIC TYPES
// ====================================================================

export interface DomainClassificationResult {
  primaryDomain: {
    id: string;
    name: string;
    parentDomain?: string;
    specialization: string;
    pathologies: string[];
    treatments: string[];
    neuralArchitecture: string;
    accuracy: number;
    confidenceThreshold: number;
  };
  secondaryDomains: Array<{
    id: string;
    name: string;
    specialization: string;
    confidence: number;
  }>;
  confidence: number;
  specializationLevel: 'basic' | 'intermediate' | 'advanced' | 'ultra-specialized';
  crossDomainFactors: string[];
}

export interface CrossDomainInteraction {
  primaryDomain: string;
  secondaryDomain: string;
  interactionType: 'synergistic' | 'antagonistic' | 'neutral' | 'complex';
  strength: number; // 0-1
  clinicalImplications: string[];
  evidenceLevel: EvidenceLevel;
}

export interface EmergentPattern {
  pattern: string;
  domains: string[];
  confidence: number;
  clinicalSignificance: number;
  evidenceSupport: ClinicalEvidence[];
  novelty: boolean;
}

// ====================================================================
// 🌊 NEURAL ARCHITECTURE TYPES
// ====================================================================

export interface NeuralArchitectureConfig {
  cnnLayers: number;
  rnnUnits: number;
  transformerHeads: number;
  domainSpecificWeights: boolean;
  crossDomainLearning: boolean;
  emergentPatternDetection: boolean;
}

export interface NeuralAnalysisResult {
  confidence: number;
  domainScores: { [domainId: string]: number };
  patternRecognition: {
    primary: string[];
    secondary: string[];
    emergent: string[];
  };
  neuralArchitecture: string;
  processingTime: number;
}

// ====================================================================
// 🏥 CLINICAL WORKFLOW TYPES
// ====================================================================

export interface ClinicalWorkflowStep {
  step: number;
  description: string;
  domain: string;
  requiredInputs: string[];
  expectedOutputs: string[];
  neuralProcessing: boolean;
  crossDomainValidation: boolean;
}

export interface ClinicalDecisionTree {
  rootDomain: string;
  branches: Array<{
    condition: string;
    targetDomain: string;
    confidence: number;
    clinicalRationale: string;
  }>;
  emergentPathways: Array<{
    trigger: string;
    newDomain: string;
    novelty: boolean;
  }>;
}

// ====================================================================
// 📊 PERFORMANCE METRICS TYPES
// ====================================================================

export interface NestedDomainMetrics {
  domainId: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  processingTime: number;
  crossDomainConsistency: number;
  emergentInsightGeneration: number;
  clinicalRelevance: number;
}

export interface PerformanceBenchmark {
  baseline: NestedDomainMetrics;
  current: NestedDomainMetrics;
  improvement: number;
  trendDirection: 'improving' | 'stable' | 'declining';
  confidenceInterval: [number, number];
}

// ====================================================================
// 🔮 PREDICTIVE TYPES
// ====================================================================

export interface TreatmentOutcomePrediction {
  treatmentId: string;
  domain: string;
  predictedSuccessRate: number;
  confidenceInterval: [number, number];
  riskFactors: string[];
  optimizationSuggestions: string[];
  neuralPredictionBasis: string[];
}

export interface PrognosticForecast {
  timeHorizon: string; // '3months', '6months', '1year', '2years'
  outcomes: Array<{
    outcome: string;
    probability: number;
    domain: string;
    factors: string[];
  }>;
  uncertaintyMeasures: {
    totalUncertainty: number;
    domainSpecificUncertainty: { [domain: string]: number };
    crossDomainUncertainty: number;
  };
}

// ====================================================================
// 🔧 UTILITY TYPES
// ====================================================================

export type DomainHierarchy = {
  [parentDomain: string]: {
    subDomains: string[];
    specializations: string[];
    crossReferences: string[];
  };
};

export type NeuralActivationPattern = {
  [layerName: string]: {
    activationLevel: number;
    domainRelevance: number;
    pattern: 'cnn' | 'rnn' | 'transformer' | 'hybrid';
  };
};

export type ClinicalEvidenceMatrix = {
  [domain: string]: {
    [pathology: string]: {
      evidenceLevel: EvidenceLevel;
      studyCount: number;
      consistency: number;
      recentUpdates: string[];
    };
  };
};

// ====================================================================
// 🚀 EXPORT ALL TYPES
// ====================================================================

export type {
  PathologyAnalysis,
  TreatmentRecommendation
} from './MedicalTypes';

// Re-export everything for easy access
export * from './MedicalTypes';
