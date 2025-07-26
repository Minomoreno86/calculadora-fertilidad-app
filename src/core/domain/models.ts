// ===================================================================
// TIPOS ESPECÍFICOS Y DE AYUDA
// ===================================================================

export enum MyomaType {
  None = 'none',
  Submucosal = 'submucosal',
  IntramuralLarge = 'intramural_large',
  Subserosal = 'subserosal',
}

export enum AdenomyosisType {
  None = 'none',
  Focal = 'focal',
  Diffuse = 'diffuse',
}

export enum PolypType {
  None = 'none',
  Small = 'small',
  Large = 'large',
  Ostium = 'ostium',
}

export enum HsgResult {
  Unknown = 'unknown',
  Normal = 'normal',
  Unilateral = 'unilateral',
  Bilateral = 'bilateral',
  Malformation = 'malformacion',
}

export enum OtbMethod {
  Unknown = 'unknown',
  Clips = 'clips',
  Rings = 'rings',
  Ligation = 'ligation',
  ExtensiveCauterization = 'extensive_cauterization',
  PartialSalpingectomy = 'partial_salpingectomy',
}

export type SimulatableFactor = keyof Omit<Factors, 'baseAgeProbability'>;
export type TreatmentCategory = 'Optimización Médica' | 'Baja Complejidad' | 'Alta Complejidad' | 'Estudio Adicional';

export interface ClinicalFinding {
  key: string;
  title: string;
  definition: string;
  justification: string;
  recommendations: string[];
  explanation?: string;
  sources?: string[];
}

export interface TreatmentSuggestion {
  category: TreatmentCategory;
  title: string;
  details: string;
  source: string;
}

export interface ClinicalInfo {
  key: string;
  title: string;
  definition?: string;
  description?: string;
  justification: string;
  recommendations: string[];
  explanation?: string;
  sources?: string[];
}

// ===================================================================
// INTERFACES PRINCIPALES DE DATOS
// ===================================================================

export interface UserInput {
  age: number;
  bmi: number | null;
  cycleDuration?: number;
  infertilityDuration?: number;
  hasPcos: boolean;
  endometriosisGrade: number;
  myomaType: MyomaType;
  adenomyosisType: AdenomyosisType;
  polypType: PolypType;
  hsgResult: HsgResult;
  hasOtb: boolean;
  otbMethod?: OtbMethod;
  remainingTubalLength?: number;
  hasOtherInfertilityFactors?: boolean;
  desireForMultiplePregnancies?: boolean;
  hasPelvicSurgery?: boolean;
  pelvicSurgeriesNumber?: number;
  amh?: number;
  prolactin?: number;
  tsh?: number;
  tpoAbPositive: boolean;
  homaIr?: number;
  spermConcentration?: number;
  spermProgressiveMotility?: number;
  spermNormalMorphology?: number;
  semenVolume?: number;
}

export interface Factors {
  baseAgeProbability: number;
  bmi: number;
  cycle: number;
  pcos: number;
  endometriosis: number;
  myoma: number;
  adenomyosis: number;
  adenomiosis?: number; // Legacy compatibility
  polyp: number;
  polipos?: number; // Legacy compatibility
  hsg: number;
  otb: number;
  amh: number;
  prolactin: number;
  tsh: number;
  homa: number;
  homaIR?: number; // Legacy compatibility
  male: number;
  maleFactor?: number; // Legacy compatibility
  infertilityDuration: number;
  pelvicSurgery: number;
  cycleIrregular?: number; // Legacy compatibility
  miomas?: number; // Legacy compatibility
  age?: number; // For comprehensive analysis
}

// 🧠 ANALYSIS RESULT INTERFACE V13.1
export interface AnalysisResult {
  type: 'hypothesis' | 'treatment' | 'lifestyle' | 'monitoring' | 'diagnostic' | 'prediction' | 'risk';
  data: {
    condition?: string;
    probability?: number;
    reasoning?: string;
    evidenceLevel?: 'A' | 'B' | 'C';
    pmid?: string;
    treatment?: string;
    priority?: 'high' | 'medium' | 'low';
    successRate?: number;
    timeframe?: string;
    contraindications?: string[];
    category?: string;
    recommendations?: string[];
    impact?: 'high' | 'medium' | 'low';
    parameter?: string;
    frequency?: string;
    target?: string;
    riskLevel?: 'high' | 'medium' | 'low';
    mitigation?: string;
    severity?: string;
    outcome?: string; // For prediction type results
    test?: string; // For diagnostic type results
  };
}

// 🧠 MEDICAL ANALYSIS INTERFACE V13.1
export interface MedicalAnalysis {
  diagnosticHypotheses: Array<{
    condition: string;
    probability: number;
    reasoning: string;
    evidenceLevel: 'A' | 'B' | 'C';
    pmid?: string;
  }>;
  treatmentRecommendations: Array<{
    treatment: string;
    priority: 'high' | 'medium' | 'low';
    successRate: number;
    timeframe: string;
    reasoning: string;
    contraindications?: string[];
  }>;
  lifestyle: Array<{
    category: string;
    recommendations: string[];
    impact: 'high' | 'medium' | 'low';
  }>;
  monitoring: Array<{
    parameter: string;
    frequency: string;
    target: string;
  }>;
  nextSteps: string[];
  urgencyLevel: 'immediate' | 'urgent' | 'routine';
  results: AnalysisResult[];
  confidence: number;
  recommendations: string[];
}

export interface Diagnostics {
  agePotential?: string;
  bmiComment?: string;
  cycleComment?: string;
  pcosSeverity?: string;
  endometriosisComment?: string;
  myomaComment?: string;
  adenomyosisComment?: string;
  polypComment?: string;
  hsgComment?: string;
  otbComment?: string;
  ovarianReserve?: string;
  prolactinComment?: string;
  tshComment?: string;
  homaComment?: string;
  maleFactorDetailed?: string;
  missingData?: string[];
  tpoAbComment?: string; // Propiedad añadida previamente para TPOAb
  infertilityDurationComment?: string; // Propiedad añadida previamente para duración de infertilidad
  pelvicSurgeryComment?: string;
 

};


export interface Report {
  numericPrognosis: number;
  category: 'BUENO' | 'MODERADO' | 'BAJO' | 'ERROR';
  emoji: string;
  prognosisPhrase: string;
  benchmarkPhrase: string;
  clinicalInsights: ClinicalFinding[];
  recommendations?: string[]; // 🚀 Campo agregado para compatibilidad
}

export interface EvaluationState {
  input: UserInput;
  factors: Factors;
  diagnostics: Diagnostics;
  report: Report;
}
export interface SimulationResult {
  factor: SimulatableFactor | 'all';
  explanation: string;
  originalPrognosis: number;
  newPrognosis: number;
  improvement: number;
}

// 🧠 NEURAL MEDICAL AI INTERFACES V13.1
export interface MedicalPattern {
  patternId: string;
  patternName: string;
  confidence: number;
  clinicalRelevance: number;
  evidence: {
    symptoms: string[];
    biomarkers: string[];
    imaging: string[];
  };
}

export interface NeuralAnalysis {
  primaryPatterns: MedicalPattern[];
  emergentInsights: string[];
  hiddenCorrelations: Array<{
    factors: string[];
    insight: string;
    clinicalRelevance: number;
  }>;
  predictiveIndicators: Array<{
    outcome: string;
    probability: number;
    timeframe: string;
    evidence: string;
  }>;
}

export interface BayesianDecision {
  treatment: string;
  probability: number;
  reasoning: string;
}

export interface BayesianDecisionNode {
  condition: string;
  probability: number;
  children: Array<{
    decision: string;
    probability: number;
    outcome: string;
    children?: BayesianDecisionNode[];
  }>;
}

export interface BayesianAnalysis {
  primaryRecommendation: BayesianDecision;
  alternativeOptions: BayesianDecision[];
  riskAssessment: {
    immediateRisks: string[];
    longTermRisks: string[];
    mitigationStrategies: string[];
  };
  decisionTree: BayesianDecisionNode;
}

export interface SuperintellignentAnalysisResult {
  // 🧠 Análisis Neural de Patrones
  neuralPatternAnalysis: NeuralAnalysis;
  
  // 📊 Decisiones Bayesianas
  bayesianDecisionAnalysis: BayesianAnalysis;
  
  // 🎯 Recomendación Principal Integrada
  integralRecommendation: {
    primaryTreatment: string;
    confidence: number;
    successProbability: number;
    timeframe: string;
    evidenceLevel: 'A' | 'B' | 'C';
    neuralInsights: string[];
    bayesianReasoning: string;
    urgencyLevel: 'immediate' | 'urgent' | 'routine';
  };
  
  // 🌊 Insights Emergentes Únicos
  emergentInsights: {
    hiddenConnections: string[];
    predictiveWarnings: string[];
    optimizationOpportunities: string[];
    personalizedStrategies: string[];
  };
  
  // 🔮 Modelado Predictivo
  predictiveModeling: {
    shortTermPredictions: Array<{
      outcome: string;
      probability: number;
      timeframe: string;
    }>;
    longTermPredictions: Array<{
      outcome: string;
      probability: number;
      timeframe: string;
    }>;
  };
  
  // 📊 Métricas de Confianza
  systemMetrics: {
    overallConfidence: number;
    neuralAccuracy: number;
    bayesianCertainty: number;
    predictionReliability: number;
    insightDepth: number;
  };
}
