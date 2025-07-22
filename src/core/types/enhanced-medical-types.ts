// 🔬 ENHANCED MEDICAL TYPE DEFINITIONS V12.1
// Superinteligencia de Tipos Médicos Avanzados

export interface MedicalEvidenceBase {
  overallSafety: 'excellent' | 'good' | 'moderate' | 'poor' | 'dangerous';
  mortalityRisk: number;
  hospitalizations: number;
  successRate: number;
  pregnancyRate: number;
  livebirthRate: number;
  timeToEffect: number;
  durationOfEffect: number;
}

export interface EnhancedProposedTreatment {
  id: string;
  name: string;
  type: 'medication' | 'procedure' | 'lifestyle' | 'surgery' | 'therapy';
  dosage?: string;
  frequency?: string;
  duration?: string;
  cost: number;
  evidenceLevel: EvidenceLevel;
  contraindications: string[];
  sideEffects: SideEffect[];
  effectiveness: TreatmentEffectiveness;
  safety: SafetyProfile;
  personalization: PersonalizationFactors;
  monitoring: MonitoringRequirements;
}

export interface TypedEvidenceDatabase extends Map<string, MedicalEvidenceBase> {
  getSafetyProfile(treatmentName: string): MedicalEvidenceBase | null;
  getEffectiveness(treatmentName: string): MedicalEvidenceBase | null;
  hasEvidence(treatmentName: string): boolean;
}

export interface EnhancedPatientProfile {
  id: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  medicalHistory: MedicalCondition[];
  medications: Medication[];
  allergies: Allergy[];
  comorbidities: string[];
  vitalSigns: VitalSigns;
  laboratorResults: LabResults;
  fertilityMetrics: FertilityMetrics;
  psychosocialFactors: PsychosocialProfile;
  preferences: PatientPreferences;
}

export interface TreatmentEffectiveness {
  successRate: number;
  timeToEffect: number;
  durationOfEffect: number;
  qualityOfLife: number;
  patientSatisfaction: number;
  pregnancyRate: number;
  livebirthRate: number;
  sideEffectRate: number;
  dropoutRate: number;
}

export interface SafetyProfile {
  overallSafety: 'excellent' | 'good' | 'moderate' | 'poor' | 'dangerous';
  commonSideEffects: SideEffect[];
  seriousAdverseEvents: SideEffect[];
  mortalityRisk: number;
  hospitalizations: number;
  longTermRisks: string[];
  contraindications: Contraindication[];
  drugInteractions: DrugInteraction[];
}

export interface PersonalizationFactors {
  ageFactors: AgeBasedFactors;
  geneticFactors: GeneticMarkers;
  lifestyleFactors: LifestyleProfile;
  comorbidityAdjustments: ComorbidityAdjustments;
  personalizedScore: number;
  adaptationRecommendations: string[];
}

export interface MonitoringRequirements {
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually';
  parameters: MonitoringParameter[];
  alertThresholds: AlertThreshold[];
  followUpSchedule: FollowUpVisit[];
  emergencyIndicators: string[];
}

export interface ValidatedTreatment extends EnhancedProposedTreatment {
  validationId: string;
  validatedAt: Date;
  validatedBy: string;
  validationScore: number;
  confidenceInterval: [number, number];
  evidenceQuality: EvidenceQuality;
  clinicalRecommendation: ClinicalRecommendation;
  riskBenefitRatio: number;
  costEffectiveness: CostEffectivenessAnalysis;
}

export interface PersonalizedRecommendation {
  treatmentId: string;
  personalizationScore: number;
  adaptedDosage?: string;
  adaptedFrequency?: string;
  adaptedDuration?: string;
  personalizedRisks: RiskFactor[];
  personalizedBenefits: string[];
  monitoringPlan: PersonalizedMonitoringPlan;
  patientEducation: EducationMaterial[];
}

export interface EvidenceQuality {
  overallQuality: 'very-high' | 'high' | 'moderate' | 'low' | 'very-low';
  studyTypes: StudyType[];
  sampleSize: number;
  studyDuration: number;
  biasAssessment: BiasAssessment;
  consistencyRating: 'consistent' | 'mostly-consistent' | 'inconsistent';
  directnessRating: 'direct' | 'mostly-direct' | 'indirect';
  precisionRating: 'precise' | 'moderately-precise' | 'imprecise';
}

export interface ClinicalRecommendation {
  strength: 'strong-for' | 'conditional-for' | 'conditional-against' | 'strong-against';
  reasoning: string;
  applicability: ApplicabilityFactors;
  implementationConsiderations: string[];
  resourceRequirements: ResourceRequirement[];
  qualityOfEvidence: EvidenceQuality;
}

export interface CostEffectivenessAnalysis {
  costPerQALY: number;
  incrementalCostEffectivenessRatio: number;
  budgetImpact: number;
  costBenefitRatio: number;
  affordabilityScore: number;
  economicEvaluation: EconomicMetrics;
}

// Type Guards for Medical Type Safety
export function isMedicalEvidenceBase(obj: unknown): obj is MedicalEvidenceBase {
  return typeof obj === 'object' && obj !== null &&
    'overallSafety' in obj &&
    'mortalityRisk' in obj &&
    'hospitalizations' in obj &&
    'successRate' in obj &&
    'pregnancyRate' in obj &&
    'livebirthRate' in obj;
}

export function isEnhancedProposedTreatment(obj: unknown): obj is EnhancedProposedTreatment {
  return typeof obj === 'object' && obj !== null &&
    'id' in obj &&
    'name' in obj &&
    'type' in obj &&
    'cost' in obj &&
    'evidenceLevel' in obj;
}

export function isValidatedTreatment(obj: unknown): obj is ValidatedTreatment {
  return isEnhancedProposedTreatment(obj) &&
    'validationId' in obj &&
    'validatedAt' in obj &&
    'validationScore' in obj;
}

// Enhanced Medical Configuration Interface
export interface MedicalSystemConfiguration {
  evidenceDatabase: TypedEvidenceDatabase;
  guidelinesDatabase: Map<string, ClinicalGuideline>;
  patientRegistry: Map<string, EnhancedPatientProfile>;
  treatmentProtocols: Map<string, TreatmentProtocol>;
  qualityMetrics: QualityAssuranceMetrics;
  complianceRequirements: ComplianceFramework;
}

// Utility Types for Medical System
export type TreatmentResult<T extends EnhancedProposedTreatment = EnhancedProposedTreatment> = {
  treatment: T;
  validation: ValidationResult;
  personalization: PersonalizationResult;
  monitoring: MonitoringPlan;
  outcomes: PredictedOutcomes;
};

export type MedicalAnalysisResult<T = unknown> = {
  data: T;
  confidence: number;
  evidenceLevel: EvidenceLevel;
  recommendation: ClinicalRecommendation;
  warnings: MedicalWarning[];
  nextSteps: string[];
};

// Additional supporting interfaces
export interface MedicalCondition {
  icd10Code: string;
  name: string;
  severity: 'mild' | 'moderate' | 'severe';
  onsetDate: Date;
  status: 'active' | 'resolved' | 'chronic';
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  startDate: Date;
  endDate?: Date;
  indication: string;
}

export interface Allergy {
  allergen: string;
  reaction: string;
  severity: 'mild' | 'moderate' | 'severe' | 'life-threatening';
}

export interface SideEffect {
  name: string;
  frequency: 'very-common' | 'common' | 'uncommon' | 'rare' | 'very-rare';
  severity: 'mild' | 'moderate' | 'severe' | 'life-threatening';
  description: string;
}

export type EvidenceLevel = 'rct' | 'cohort' | 'case-control' | 'case-series' | 'expert-opinion';

export interface DrugInteraction {
  drugA: string;
  drugB: string;
  severity: 'minor' | 'moderate' | 'major';
  mechanism: string;
  clinicalEffect: string;
  management: string;
}
