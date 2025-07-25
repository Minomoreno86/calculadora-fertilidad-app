// ===================================================================
// 🎯 FUNCIONES AUXILIARES DEL FORMULARIO
// ===================================================================

import { FormState, FormProgress, ValueCategory } from '../types/calculator.types';
import { 
  FIELD_CONFIGS, 
  FORM_SECTIONS, 
  BMI_CATEGORIES, 
  HOMA_CATEGORIES,
  VALIDATION_CONSTANTS 
} from './formConstants';

// 🔹 CÁLCULO DE PROGRESO DEL FORMULARIO
export function calculateFormProgress(formData: FormState): FormProgress {
  let completedSections = 0;
  const totalSections = Object.keys(FORM_SECTIONS).length;
  const missingSections: string[] = [];

  // Evaluar cada sección
  for (const [sectionKey, section] of Object.entries(FORM_SECTIONS)) {
    const sectionProgress = calculateSectionProgress(formData, sectionKey);
    
    if (sectionProgress >= 70) { // 70% completitud mínima por sección
      completedSections++;
    } else {
      missingSections.push(section.label);
    }
  }

  const progressPercentage = Math.round((completedSections / totalSections) * 100);
  const isReadyToSubmit = progressPercentage >= VALIDATION_CONSTANTS.MIN_PROGRESS_FOR_CALCULATION;

  return {
    completedSections,
    totalSections,
    progressPercentage,
    missingSections,
    isReadyToSubmit
  };
}

// 🔹 PROGRESO DE UNA SECCIÓN ESPECÍFICA
export function calculateSectionProgress(formData: FormState, sectionName: string): number {
  const section = FORM_SECTIONS[sectionName as keyof typeof FORM_SECTIONS];
  if (!section) return 0;

  const sectionFields = FIELD_CONFIGS.filter(config => 
    config.section === section.name
  );

  if (sectionFields.length === 0) return 100;

  let completedWeight = 0;
  let totalWeight = 0;

  for (const field of sectionFields) {
    totalWeight += field.weight;
    
    if (isFieldCompleted(formData, field.name)) {
      completedWeight += field.weight;
    }
  }

  return totalWeight > 0 ? Math.round((completedWeight / totalWeight) * 100) : 0;
}

// 🔹 VERIFICAR SI UN CAMPO ESTÁ COMPLETADO
export function isFieldCompleted(formData: FormState, fieldName: keyof FormState): boolean {
  const value = formData[fieldName];
  
  if (value === undefined || value === null) return false;
  
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed === '') return false;
    
    // Para campos numéricos, verificar que sea un número válido > 0
    const num = parseFloat(trimmed);
    if (!isNaN(num) && num > 0) return true;
    
    // Para campos de texto no numéricos
    return trimmed.length > 0;
  }
  
  if (typeof value === 'number') {
    return value > 0;
  }
  
  if (typeof value === 'boolean') {
    return true; // Los booleanos siempre están "completados"
  }
  
  return false;
}

// 🔹 VALIDAR SI PUEDE PROCEDER CON EL CÁLCULO
export function canProceedWithCalculation(formData: FormState): boolean {
  const requiredFields = VALIDATION_CONSTANTS.REQUIRED_BASIC_FIELDS;
  
  return requiredFields.every(fieldName => 
    isFieldCompleted(formData, fieldName as keyof FormState)
  );
}

// 🔹 OBTENER CAMPOS FALTANTES CRÍTICOS
export function getMissingCriticalFields(formData: FormState): string[] {
  const requiredFields = VALIDATION_CONSTANTS.REQUIRED_BASIC_FIELDS;
  const missing: string[] = [];
  
  for (const fieldName of requiredFields) {
    if (!isFieldCompleted(formData, fieldName as keyof FormState)) {
      const config = FIELD_CONFIGS.find(c => c.name === fieldName);
      missing.push(config?.label || fieldName);
    }
  }
  
  return missing;
}

// 🔹 FORMATEAR VALOR NUMÉRICO
export function formatNumericValue(value: number | null, decimals: number = 1): string {
  if (value === null || value === undefined || isNaN(value)) {
    return 'N/A';
  }
  return value.toFixed(decimals);
}

// 🔹 OBTENER CATEGORÍA DE BMI
export function getBMICategory(bmi: number | null): ValueCategory | null {
  if (!bmi || isNaN(bmi)) return null;
  
  if (bmi < 18.5) return BMI_CATEGORIES.UNDERWEIGHT;
  if (bmi < 25) return BMI_CATEGORIES.NORMAL;
  if (bmi < 30) return BMI_CATEGORIES.OVERWEIGHT;
  return BMI_CATEGORIES.OBESE;
}

// 🔹 OBTENER CATEGORÍA DE HOMA-IR
export function getHOMACategory(homa: number | null): ValueCategory | null {
  if (!homa || isNaN(homa)) return null;
  
  if (homa < 2.5) return HOMA_CATEGORIES.NORMAL;
  if (homa < 3.8) return HOMA_CATEGORIES.INSULIN_RESISTANCE;
  return HOMA_CATEGORIES.DIABETES_RISK;
}

// 🔹 FORMATEAR BMI CON CATEGORÍA
export function formatBMI(bmi: number | null): string {
  if (!bmi || isNaN(bmi)) return 'N/A';
  
  const category = getBMICategory(bmi);
  const formatted = formatNumericValue(bmi, 1);
  
  return category ? `${formatted} (${category.category})` : formatted;
}

// 🔹 FORMATEAR HOMA-IR CON CATEGORÍA
export function formatHOMA(homa: number | null): string {
  if (!homa || isNaN(homa)) return 'N/A';
  
  const category = getHOMACategory(homa);
  const formatted = formatNumericValue(homa, 2);
  
  return category ? `${formatted} (${category.category})` : formatted;
}

// 🔹 EXTRAER DATOS PARA VALIDACIÓN CLÍNICA
export function extractValidationData(formData: FormState) {
  const safeParseNumber = (value: string | number | undefined): number | undefined => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const parsed = parseFloat(value);
      return isNaN(parsed) ? undefined : parsed;
    }
    return undefined;
  };

  return {
    age: safeParseNumber(formData.age),
    height: safeParseNumber(formData.height),
    weight: safeParseNumber(formData.weight),
    amh: safeParseNumber(formData.amhValue),
    timeToConception: safeParseNumber(formData.infertilityDuration),
    glucose: safeParseNumber(formData.glucoseValue),
    insulin: safeParseNumber(formData.insulinValue),
    spermConcentration: safeParseNumber(formData.spermConcentration),
    spermProgressiveMotility: safeParseNumber(formData.spermProgressiveMotility),
    spermNormalMorphology: safeParseNumber(formData.spermNormalMorphology),
    cycleLength: safeParseNumber(formData.cycleLength),
    cycleRegularity: formData.cycleRegularity,
  };
}

// 🔹 CALCULAR STEP ACTUAL BASADO EN PROGRESO
export function getCurrentStep(formData: FormState): number {
  const sections = Object.keys(FORM_SECTIONS);
  
  for (let i = 0; i < sections.length; i++) {
    const sectionKey = sections[i];
    if (sectionKey) {
      const sectionProgress = calculateSectionProgress(formData, sectionKey);
      if (sectionProgress < 80) { // Si una sección no está al 80%, es el step actual
        return i + 1;
      }
    }
  }
  
  return sections.length; // Todas las secciones completadas
}

// 🔹 VALIDAR RANGO DE CAMPO
export function validateFieldRange(fieldName: keyof FormState, value: string): {
  isValid: boolean;
  error?: string;
} {
  const config = FIELD_CONFIGS.find(c => c.name === fieldName);
  if (!config?.validation) {
    return { isValid: true };
  }
  
  const numValue = parseFloat(value);
  if (isNaN(numValue)) {
    return { isValid: false, error: 'Valor numérico inválido' };
  }
  
  const { min, max } = config.validation;
  
  if (min !== undefined && numValue < min) {
    return { isValid: false, error: `Valor mínimo: ${min}` };
  }
  
  if (max !== undefined && numValue > max) {
    return { isValid: false, error: `Valor máximo: ${max}` };
  }
  
  return { isValid: true };
}

// 🔹 OBTENER CONFIGURACIÓN DE CAMPO
export function getFieldConfig(fieldName: keyof FormState) {
  return FIELD_CONFIGS.find(config => config.name === fieldName);
}

// 🔹 OBTENER CAMPOS DE UNA SECCIÓN
export function getSectionFields(sectionName: string) {
  return FIELD_CONFIGS.filter(config => config.section === sectionName);
}
