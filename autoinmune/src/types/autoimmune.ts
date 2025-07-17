// Tipos principales para el módulo de enfermedades autoinmunes y fertilidad

// Enfermedades autoinmunes con impacto conocido en fertilidad
export interface AutoimmuneDisease {
  id: string;
  name: string;
  category: DiseaseCategory;
  fertilityImpact: FertilityImpactLevel;
  affectedOrgans: OrganSystem[];
  prevalenceInWomen: number; // Porcentaje
  typicalOnsetAge: number;
  description: string;
}

export type DiseaseCategory = 
  | 'systemic'           // Lupus, AR, SSc
  | 'endocrine'          // Hashimoto, DM1, Addison
  | 'gastrointestinal'   // Crohn, UC, Celiac
  | 'neurological'       // MS, MG
  | 'hematological';     // APS, ITP

export type FertilityImpactLevel = 'low' | 'moderate' | 'high' | 'severe';

export type OrganSystem = 
  | 'reproductive'       // Ovarios, útero, trompas
  | 'endocrine'         // Tiroides, suprarrenales
  | 'vascular'          // Sistema circulatorio
  | 'renal'             // Riñones
  | 'hepatic'           // Hígado
  | 'pulmonary'         // Pulmones
  | 'cardiac'           // Corazón
  | 'neurological'      // Sistema nervioso
  | 'hematological'     // Sistema hematológico
  | 'gastrointestinal'; // Sistema digestivo

// Estados de actividad de la enfermedad
export interface DiseaseActivity {
  status: ActivityStatus;
  score?: number;          // Score específico (SLEDAI, DAS28, etc.)
  lastFlare?: Date;
  currentSymptoms: string[];
  biomarkers: LabResult[];
}

export type ActivityStatus = 'remission' | 'low' | 'moderate' | 'high' | 'severe';

export interface LabResult {
  test: string;
  value: number;
  unit: string;
  referenceRange: string;
  isAbnormal: boolean;
  clinicalSignificance: 'low' | 'moderate' | 'high';
}

// Medicamentos y tratamientos
export interface Medication {
  id: string;
  name: string;
  genericName: string;
  category: MedicationCategory;
  pregnancyCategory: PregnancyCategory;
  fertilityRisk: FertilityRisk;
  teratogenicity: TeratogenicityRisk;
  washoutPeriod?: number;  // Días necesarios antes de concepción
  alternatives?: string[]; // Medicamentos alternativos seguros
  monitoringRequired: string[];
}

export type MedicationCategory = 
  | 'dmard-conventional'     // MTX, SSZ, HCQ
  | 'dmard-biologic'        // Anti-TNF, rituximab, etc.
  | 'immunosuppressant'     // Azathioprine, MMF, etc.
  | 'corticosteroid'        // Prednisone, methylprednisolone
  | 'nsaid'                 // Anti-inflamatorios
  | 'hormone'               // Tiroxina, cortisol
  | 'monoclonal-antibody';  // Anticuerpos monoclonales

export type PregnancyCategory = 'A' | 'B' | 'C' | 'D' | 'X';

export interface FertilityRisk {
  ovarianReserve: 'none' | 'mild' | 'moderate' | 'severe';
  menstrualCycle: 'none' | 'mild' | 'moderate' | 'severe';
  implantation: 'none' | 'mild' | 'moderate' | 'severe';
  earlyPregnancy: 'none' | 'mild' | 'moderate' | 'severe';
}

export interface TeratogenicityRisk {
  level: 'none' | 'low' | 'moderate' | 'high' | 'major';
  affectedSystems: string[];
  criticalPeriods: string[];  // Semanas de gestación críticas
  description: string;
}

// Perfil del paciente
export interface AutoimmunePatientProfile {
  id: string;
  age: number;
  diagnoses: PatientDiagnosis[];
  currentMedications: PatientMedication[];
  diseaseHistory: DiseaseHistory;
  fertilityGoals: FertilityGoals;
  riskFactors: RiskFactor[];
  lastAssessment: Date;
}

export interface PatientDiagnosis {
  disease: AutoimmuneDisease;
  diagnosisDate: Date;
  currentActivity: DiseaseActivity;
  complications: string[];
  specialists: string[];
}

export interface PatientMedication {
  medication: Medication;
  dose: string;
  frequency: string;
  startDate: Date;
  indication: string;
  effectiveness: 'poor' | 'fair' | 'good' | 'excellent';
  sideEffects: string[];
}

export interface DiseaseHistory {
  timeToControlDisease: number; // Meses
  numberOfFlares: number;
  hospitalizations: number;
  organDamage: OrganDamage[];
  diseaseProgression: 'stable' | 'improving' | 'worsening';
}

export interface OrganDamage {
  organ: OrganSystem;
  severity: 'mild' | 'moderate' | 'severe';
  reversible: boolean;
  impactOnFertility: FertilityImpactLevel;
}

export interface FertilityGoals {
  desiredTimeframe: 'immediate' | '6months' | '1year' | '2years' | 'undecided';
  previousAttempts: number;
  previousPregnancies: PregnancyHistory[];
  partnersAge?: number;
  assistedReproduction: boolean;
}

export interface PregnancyHistory {
  outcome: 'livebirth' | 'miscarriage' | 'stillbirth' | 'termination';
  gestationalAge: number;
  complications: string[];
  diseaseActivityDuring: ActivityStatus;
  medicationsDuring: string[];
}

export interface RiskFactor {
  type: 'genetic' | 'environmental' | 'lifestyle' | 'medical';
  factor: string;
  severity: 'low' | 'moderate' | 'high';
  modifiable: boolean;
}

// Evaluación de riesgo y recomendaciones
export interface FertilityRiskAssessment {
  overallRisk: FertilityImpactLevel;
  riskFactors: AssessedRiskFactor[];
  protectiveFactors: ProtectiveFactor[];
  recommendations: ClinicalRecommendation[];
  optimalTimingWindow: TimingWindow;
  monitoringPlan: MonitoringPlan;
  estimatedConceptionProbability: number; // Porcentaje
}

export interface AssessedRiskFactor {
  category: 'disease' | 'medication' | 'activity' | 'age' | 'history';
  description: string;
  impact: FertilityImpactLevel;
  modifiable: boolean;
  interventions: string[];
}

export interface ProtectiveFactor {
  factor: string;
  benefit: 'mild' | 'moderate' | 'significant';
  evidence: 'limited' | 'moderate' | 'strong';
}

export interface ClinicalRecommendation {
  category: 'preconception' | 'medication' | 'monitoring' | 'lifestyle' | 'specialist';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  recommendation: string;
  evidence: 'expert-opinion' | 'case-series' | 'observational' | 'rct';
  timeframe: string;
  specialist?: string;
}

export interface TimingWindow {
  optimal: boolean;
  currentRisk: FertilityImpactLevel;
  suggestedTiming: 'now' | '3months' | '6months' | '1year' | 'defer';
  reasonForTiming: string;
  conditions: string[];
}

export interface MonitoringPlan {
  frequency: 'monthly' | 'quarterly' | 'biannual' | 'annual';
  tests: RequiredTest[];
  specialists: string[];
  redFlags: string[];
}

export interface RequiredTest {
  test: string;
  frequency: string;
  purpose: string;
  urgentIf: string[];
}

// Dashboard y métricas
export interface AutoimmuneDashboardData {
  patient: AutoimmunePatientProfile;
  currentRiskAssessment: FertilityRiskAssessment;
  diseaseStabilityTrend: StabilityTrend[];
  medicationOptimization: MedicationOptimization;
  fertilityMetrics: FertilityMetrics;
  alerts: MedicalAlert[];
}

export interface StabilityTrend {
  date: Date;
  diseaseActivity: number;  // Score normalizado 0-100
  medication: string;
  biomarker?: number;
}

export interface MedicationOptimization {
  currentRegimen: PatientMedication[];
  safeAlternatives: Medication[];
  optimizationScore: number; // 0-100
  recommendedChanges: string[];
}

export interface FertilityMetrics {
  estimatedOvarianAge: number;
  amh?: number;
  fsh?: number;
  menstrualRegularity: 'regular' | 'irregular' | 'absent';
  ovulationStatus: 'regular' | 'irregular' | 'anovulation' | 'unknown';
}

export interface MedicalAlert {
  id: string;
  type: 'medication' | 'disease-activity' | 'fertility' | 'lab-abnormal' | 'timing';
  severity: 'info' | 'warning' | 'urgent' | 'critical';
  title: string;
  description: string;
  actionRequired: string;
  deadline?: Date;
  specialist?: string;
}
