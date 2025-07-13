// ===================================================================
// 🎯 CONSTANTES Y CONFIGURACIONES DEL FORMULARIO
// ===================================================================

import { 
  MyomaType, 
  AdenomyosisType, 
  PolypType, 
  HsgResult, 
  OtbMethod 
} from '../../../../core/domain/models';
import { FormState, FieldConfig } from '../types/calculator.types';

// 🔹 VALORES INICIALES DEL FORMULARIO
export const INITIAL_FORM_VALUES: FormState = {
  // ✅ Demografia básica - STRINGS para inputs numéricos
  age: "30",
  weight: "65", 
  height: "165",
  
  // ✅ Ginecología básica - STRINGS para inputs numéricos
  cycleLength: "28",
  infertilityDuration: "1",
  hasPcos: false,
  endometriosisStage: 0,
  myomaType: MyomaType.None,
  adenomyosisType: AdenomyosisType.None,
  polypType: PolypType.None,
  hsgResult: HsgResult.Unknown,
  hasPelvicSurgery: false,
  numberOfPelvicSurgeries: 0,
  hasOtb: false,
  otbMethod: OtbMethod.Unknown,
  hasOtherInfertilityFactors: false,
  desireForMultiplePregnancies: false,
  
  // ✅ Laboratorio básico - STRINGS para inputs numéricos
  tpoAbPositive: false,
  insulinValue: "0",
  glucoseValue: "0",
  
  // 🆕 CAMPOS OPCIONALES - STRINGS vacíos para inputs opcionales
  amhValue: "", // ← String vacío para campos opcionales
  tshValue: "", // ← String vacío para campos opcionales  
  prolactinValue: "", // ← String vacío para campos opcionales
  
  // Factor masculino completo - STRINGS vacíos para campos opcionales
  spermConcentration: "", // ← String vacío para campos opcionales
  spermProgressiveMotility: "", // ← String vacío para campos opcionales
  spermNormalMorphology: "", // ← String vacío para campos opcionales
  semenVolume: "", // ← String vacío para campos opcionales
  
  // Ginecología avanzada (agregado)
  cycleRegularity: 'regular' as const, // ← Regularidad del ciclo
};

// 🔹 CONFIGURACIÓN DE CAMPOS
export const FIELD_CONFIGS: FieldConfig[] = [
  // Demografía
  {
    name: 'age',
    label: 'Edad',
    type: 'number',
    required: true,
    section: 'demographics',
    weight: 0.25,
    validation: { min: 15, max: 55 }
  },
  {
    name: 'weight',
    label: 'Peso (kg)',
    type: 'number',
    required: true,
    section: 'demographics',
    weight: 0.20,
    validation: { min: 30, max: 200 }
  },
  {
    name: 'height',
    label: 'Altura (cm)',
    type: 'number',
    required: true,
    section: 'demographics',
    weight: 0.20,
    validation: { min: 120, max: 220 }
  },
  
  // Ginecología
  {
    name: 'cycleLength',
    label: 'Duración del ciclo (días)',
    type: 'number',
    required: true,
    section: 'gynecology',
    weight: 0.15,
    validation: { min: 15, max: 90 }
  },
  {
    name: 'infertilityDuration',
    label: 'Tiempo buscando embarazo (meses)',
    type: 'number',
    required: true,
    section: 'gynecology',
    weight: 0.15,
    validation: { min: 1, max: 240 }
  },
  {
    name: 'hasPcos',
    label: 'Diagnóstico de PCOS',
    type: 'boolean',
    required: false,
    section: 'gynecology',
    weight: 0.10
  },
  
  // Laboratorio
  {
    name: 'amhValue',
    label: 'AMH (ng/mL)',
    type: 'number',
    required: false,
    section: 'laboratory',
    weight: 0.15,
    validation: { min: 0, max: 20 }
  },
  {
    name: 'insulinValue',
    label: 'Insulina (μU/mL)',
    type: 'number',
    required: false,
    section: 'laboratory',
    weight: 0.10,
    validation: { min: 0, max: 100 }
  },
  {
    name: 'glucoseValue',
    label: 'Glucosa (mg/dL)',
    type: 'number',
    required: false,
    section: 'laboratory',
    weight: 0.10,
    validation: { min: 50, max: 400 }
  },
  
  // Factor masculino
  {
    name: 'spermConcentration',
    label: 'Concentración espermática (M/mL)',
    type: 'number',
    required: false,
    section: 'maleFactor',
    weight: 0.12,
    validation: { min: 0, max: 300 }
  },
  {
    name: 'spermProgressiveMotility',
    label: 'Motilidad progresiva (%)',
    type: 'number',
    required: false,
    section: 'maleFactor',
    weight: 0.10,
    validation: { min: 0, max: 100 }
  }
];

// 🔹 SECCIONES DEL FORMULARIO
export const FORM_SECTIONS = {
  demographics: {
    name: 'demographics',
    label: 'Datos Demográficos',
    fields: ['age', 'weight', 'height'],
    required: true
  },
  gynecology: {
    name: 'gynecology',
    label: 'Historia Ginecológica',
    fields: ['cycleLength', 'infertilityDuration', 'hasPcos', 'cycleRegularity'],
    required: true
  },
  laboratory: {
    name: 'laboratory',
    label: 'Exámenes de Laboratorio',
    fields: ['amhValue', 'insulinValue', 'glucoseValue', 'tshValue', 'prolactinValue'],
    required: false
  },
  maleFactor: {
    name: 'maleFactor',
    label: 'Factor Masculino',
    fields: ['spermConcentration', 'spermProgressiveMotility', 'spermNormalMorphology'],
    required: false
  }
} as const;

// 🔹 CONSTANTES DE VALIDACIÓN
export const VALIDATION_CONSTANTS = {
  MIN_AGE: 15,
  MAX_AGE: 55,
  MIN_BMI: 15,
  MAX_BMI: 50,
  MIN_CYCLE_LENGTH: 15,
  MAX_CYCLE_LENGTH: 90,
  MIN_PROGRESS_FOR_CALCULATION: 60, // % mínimo para permitir cálculo
  REQUIRED_BASIC_FIELDS: ['age', 'weight', 'height', 'cycleLength', 'infertilityDuration']
} as const;

// 🔹 MENSAJES DE ERROR
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'Este campo es obligatorio',
  INVALID_AGE: 'Edad debe estar entre 15 y 55 años',
  INVALID_WEIGHT: 'Peso debe estar entre 30 y 200 kg',
  INVALID_HEIGHT: 'Altura debe estar entre 120 y 220 cm',
  INVALID_BMI: 'BMI fuera de rango normal (15-50)',
  INVALID_CYCLE: 'Duración del ciclo debe estar entre 15 y 90 días',
  CALCULATION_NOT_READY: 'Complete los campos básicos para realizar el cálculo',
  ENGINE_ERROR: 'Error en el motor de cálculo'
} as const;

// 🔹 ETIQUETAS DE CATEGORÍAS BMI
export const BMI_CATEGORIES = {
  UNDERWEIGHT: { category: 'Bajo peso', color: '#3b82f6' },
  NORMAL: { category: 'Normal', color: '#10b981' },
  OVERWEIGHT: { category: 'Sobrepeso', color: '#f59e0b' },
  OBESE: { category: 'Obesidad', color: '#ef4444' }
} as const;

// 🔹 ETIQUETAS DE CATEGORÍAS HOMA
export const HOMA_CATEGORIES = {
  NORMAL: { category: 'Normal', color: '#10b981' },
  INSULIN_RESISTANCE: { category: 'Resistencia insulínica', color: '#f59e0b' },
  DIABETES_RISK: { category: 'Riesgo de diabetes', color: '#ef4444' }
} as const;
