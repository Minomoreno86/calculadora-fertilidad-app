/**
 * 🦠 TIPOS AUTOINMUNES - AEC-D
 * Definiciones TypeScript para el módulo de enfermedades autoinmunes
 */

// 🧬 Perfiles específicos por enfermedad
export interface ThyroidProfile {
  suspected: boolean;
  tsh?: number;
  antiTPO: boolean;
  antiTG?: boolean;
  treatment: 'none' | 'levothyroxine' | 'methimazole';
  controlled: boolean;
  lastEvaluation?: Date;
}

export interface AntiphospholipidProfile {
  suspected: boolean;
  lupusAnticoagulant: boolean;
  antiCardiolipin: boolean;
  antiBeta2GP1: boolean;
  diagnosed: boolean;
  treatment?: 'none' | 'aspirin' | 'heparin' | 'warfarin';
  lastEpisode?: Date;
}

export interface LupusProfile {
  suspected: boolean;
  ana: boolean;
  antiDsDNA: number;
  antiRo?: boolean;
  antiLa?: boolean;
  activity: 'remission' | 'mild' | 'moderate' | 'severe';
  renalInvolvement: boolean;
  treatment?: string[];
  lastFlare?: Date;
}

export interface RheumatoidArthritisProfile {
  suspected: boolean;
  antiCCP: boolean;
  rheumatoidFactor: boolean;
  activity: 'remission' | 'low' | 'moderate' | 'high';
  treatment?: string[];
  jointCount?: number;
}

export interface CeliacProfile {
  suspected: boolean;
  antiTransglutaminase: boolean;
  biopsy?: 'positive' | 'negative' | 'pending';
  glutenFreeDiet: boolean;
  adherence?: 'strict' | 'partial' | 'poor';
  symptoms?: string[];
}

export interface DiabetesT1Profile {
  suspected: boolean;
  diagnosed: boolean;
  hba1c?: number;
  antiGAD?: boolean;
  antiIA2?: boolean;
  cPeptide?: number;
  complications?: string[];
}

export interface MultipleSclerosisProfile {
  suspected: boolean;
  diagnosed: boolean;
  type?: 'relapsing-remitting' | 'secondary-progressive' | 'primary-progressive';
  activity: 'stable' | 'active' | 'highly-active';
  treatment?: string[];
  lastRelapse?: Date;
}

export interface SjogrenProfile {
  suspected: boolean;
  antiRo: boolean;
  antiLa: boolean;
  schirmerTest?: number;
  salivaryFlow?: number;
  symptoms?: string[];
}

// 🧬 Perfil autoinmune completo
export interface AutoimmuneProfile {
  patientId: string;
  date: Date;
  conditions: {
    thyroid: ThyroidProfile;
    antiphospholipid: AntiphospholipidProfile;
    lupus: LupusProfile;
    rheumatoidArthritis?: RheumatoidArthritisProfile;
    celiac?: CeliacProfile;
    diabetesT1?: DiabetesT1Profile;
    multipleSclerosis?: MultipleSclerosisProfile;
    sjogren?: SjogrenProfile;
  };
  overallRisk: 'low' | 'moderate' | 'high' | 'critical';
  fertilityImpact: AutoimmuneFertilityImpact;
  recommendations: string[];
  nextEvaluation: Date;
}

export interface AutoimmuneFertilityImpact {
  pregnancyProbability: number; // % cambio respecto a baseline
  miscarriageRisk: number; // % riesgo
  treatmentModifications: TreatmentModification[];
  monitoring: MonitoringRecommendation[];
}

export interface TreatmentModification {
  type: 'delay-treatment' | 'medication-adjustment' | 'protocol-modification' | 'additional-monitoring';
  description: string;
  duration?: string;
  rationale: string;
}

export interface MonitoringRecommendation {
  parameter: string;
  frequency: string;
  targetValue?: string;
  alertThreshold?: string;
}

// 🚨 Sistema de alertas autoinmunes
export interface AutoimmuneAlert {
  id: string;
  type: 'medication-adjustment' | 'monitoring-required' | 'contraindication' | 'screening-required';
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  title: string;
  message: string;
  actionRequired: string;
  timeline: string;
  condition?: string;
}

// 📊 Calculadora de riesgo autoinmune
export interface AutoimmuneRiskCalculation {
  overallScore: number; // 0-100
  categoryRisks: {
    thyroid: number;
    coagulation: number;
    inflammatory: number;
    autoantibody: number;
  };
  majorConcerns: string[];
  recommendations: AutoimmuneRecommendation[];
}

export interface AutoimmuneRecommendation {
  id: string;
  category: 'screening' | 'treatment' | 'monitoring' | 'lifestyle';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  title: string;
  description: string;
  evidenceLevel: 'A' | 'B' | 'C';
  timeline: string;
  provider: string;
}

// 🔬 Pruebas de laboratorio recomendadas
export interface AutoimmuneLaboratoryPanel {
  basic: {
    tsh: boolean;
    antiTPO: boolean;
    ana: boolean;
    rheumatoidFactor: boolean;
  };
  extended: {
    antiDsDNA: boolean;
    antiCCP: boolean;
    lupusAnticoagulant: boolean;
    antiCardiolipin: boolean;
    antiBeta2GP1: boolean;
    antiTransglutaminase: boolean;
  };
  specialized: {
    antiRo: boolean;
    antiLa: boolean;
    antiGAD: boolean;
    cPeptide: boolean;
    complementC3C4: boolean;
  };
}

// 🎯 Integración con fertilidad
export interface AutoimmuneFertilityIntegration {
  clinicalData: {
    age: number;
    infertilityDuration: number;
    miscarriageHistory: number;
    familyHistory: string[];
    symptoms: string[];
  };
  autoimmuneProfile: AutoimmuneProfile;
  integratedRisk: {
    fertilityReduction: number; // %
    treatmentSuccess: number; // %
    complicationRisk: number; // %
  };
  managementPlan: AutoimmuneManagementPlan;
}

export interface AutoimmuneManagementPlan {
  preConception: {
    optimization: string[];
    timeline: string;
    monitoring: string[];
  };
  duringTreatment: {
    modifications: string[];
    additionalMonitoring: string[];
    medications: MedicationAdjustment[];
  };
  pregnancy: {
    riskFactors: string[];
    monitoring: string[];
    medications: string[];
  };
}

export interface MedicationAdjustment {
  medication: string;
  action: 'continue' | 'adjust-dose' | 'switch' | 'discontinue';
  rationale: string;
  alternative?: string;
  timing: string;
}
