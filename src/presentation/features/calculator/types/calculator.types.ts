// ===================================================================
// 🎯 TIPOS ESPECÍFICOS DEL CALCULADOR DE FERTILIDAD
// ===================================================================

import { 
  MyomaType, 
  AdenomyosisType, 
  PolypType, 
  HsgResult, 
  OtbMethod 
} from '../../../../core/domain/models';

// 🔹 Estado del formulario
export interface FormState {
  // Demografía básica
  age: string;
  weight: string;
  height: string;
  
  // Ginecología básica
  cycleLength: string;
  infertilityDuration: string;
  hasPcos: boolean;
  endometriosisStage: number;
  myomaType: MyomaType;
  adenomyosisType: AdenomyosisType;
  polypType: PolypType;
  hsgResult: HsgResult;
  hasPelvicSurgery: boolean;
  numberOfPelvicSurgeries: number;
  hasOtb: boolean;
  otbMethod: OtbMethod;
  hasOtherInfertilityFactors: boolean;
  desireForMultiplePregnancies: boolean;
  
  // Laboratorio básico
  tpoAbPositive: boolean;
  insulinValue: string;
  glucoseValue: string;
  
  // Campos opcionales
  amhValue: string;
  tshValue: string;
  prolactinValue: string;
  
  // Factor masculino completo
  spermConcentration: string;
  spermProgressiveMotility: string;
  spermNormalMorphology: string;
  semenVolume: string;
  
  // Ginecología avanzada
  cycleRegularity: 'regular' | 'irregular';
}

// 🔹 Progreso del formulario
export interface FormProgress {
  completedSections: number;
  totalSections: number;
  progressPercentage: number;
  missingSections: string[];
  isReadyToSubmit: boolean;
}

// 🔹 Categorías de valores calculados
export interface ValueCategory {
  category: string;
  color: string;
}

// 🔹 Métricas de rendimiento
export interface PerformanceReport {
  renderCount: number;
  totalMeasurements: number;
  averageTime: number;
  lastMeasurement: number;
  operations: Array<{
    name: string;
    duration: number;
    timestamp: number;
  }>;
}

// 🔹 Resultado de validación clínica
export interface ClinicalValidationState {
  overallValidation: {
    isValid: boolean;
    errors: Array<{ message: string; recommendation?: string }>;
    warnings: Array<{ message: string; recommendation?: string }>;
    criticalAlerts: Array<{ message: string; recommendation?: string }>;
    recommendations: string[];
    clinicalScore: number;
  };
  fieldValidations: Array<{
    fieldName: string;
    value: unknown;
    isValid: boolean;
    errors: Array<{ message: string; recommendation?: string }>;
    warnings: Array<{ message: string; recommendation?: string }>;
    criticalAlerts: Array<{ message: string; recommendation?: string }>;
    recommendations: string[];
    clinicalScore: number;
    interpretedValue?: {
      category: string;
      normalRange?: string;
    };
  }>;
  completionScore: number;
  canProceedWithCalculation: boolean;
}

// 🔹 Configuración de campo
export interface FieldConfig {
  name: keyof FormState;
  label: string;
  type: 'text' | 'number' | 'boolean' | 'select';
  required: boolean;
  section: 'demographics' | 'gynecology' | 'laboratory' | 'maleFactor';
  weight: number; // Para cálculo de progreso
  validation?: {
    min?: number;
    max?: number;
    pattern?: RegExp;
  };
}

// 🔹 Resultado de cálculo
export interface CalculationResult {
  success: boolean;
  data?: {
    evaluation: unknown; // EvaluationState del motor
    report: unknown; // Report del motor
  };
  error?: string;
  performance?: {
    executionTime: number;
    cacheHit: boolean;
  };
}
