/**
 * 🧠 TREATMENT SUGGESTER V2.0 - ENHANCED CLINICAL ENGINE
 * Sugeridor de tratamientos con lógica clínica avanzada y sistema de confianza
 */
import { EvaluationState, TreatmentSuggestion, UserInput, Factors, HsgResult, PolypType, AdenomyosisType } from '../models';
import { clinicalContentLibrary } from '../logic/clinicalContentLibrary'; // Biblioteca clínica unificada

// 🎯 INTERFACES MEJORADAS PARA V2.0
interface TreatmentContext {
  input: UserInput;
  factors: Factors;
  clinicalScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

interface EnhancedTreatmentSuggestion extends TreatmentSuggestion {
  confidence: number; // 0-100%
  urgency: 'low' | 'moderate' | 'high' | 'critical';
  evidenceLevel: 'A' | 'B' | 'C' | 'D'; // Nivel de evidencia médica
  contraindications?: string[];
  prerequisites?: string[];
}

/**
 * 🎯 Helper para mapear configuración de tratamiento por clave
 */
const getTreatmentConfig = (key: string): { 
  category: TreatmentSuggestion['category'], 
  confidence: number, 
  urgency: EnhancedTreatmentSuggestion['urgency'], 
  evidenceLevel: EnhancedTreatmentSuggestion['evidenceLevel'] 
} => {
  if (key.startsWith('TRAT_BAJA_')) {
    return { category: 'Baja Complejidad', confidence: 90, urgency: 'moderate', evidenceLevel: 'A' };
  }
  if (key.startsWith('TRAT_IAC_')) {
    return { category: 'Baja Complejidad', confidence: 88, urgency: 'moderate', evidenceLevel: 'A' };
  }
  if (key.startsWith('TRAT_FIV_') || key.startsWith('TRAT_ICSI_') || key.startsWith('TRAT_OVODONACION')) {
    return { category: 'Alta Complejidad', confidence: 95, urgency: 'high', evidenceLevel: 'A' };
  }
  if (key.startsWith('DECISION_FIV_') || key.startsWith('INT_')) {
    return { category: 'Alta Complejidad', confidence: 92, urgency: 'high', evidenceLevel: 'A' };
  }
  return { category: 'Optimización Médica', confidence: 75, urgency: 'low', evidenceLevel: 'B' };
};

/**
 * 🔬 Helper mejorado para obtener sugerencia de tratamiento con contexto clínico
 */
const getTreatmentSuggestion = (key: string, context?: TreatmentContext): EnhancedTreatmentSuggestion => {
  const content = clinicalContentLibrary[key];
  if (!content) {
    console.warn(`Content for treatment key "${key}" not found in clinical library.`);
    return {
      category: 'Estudio Adicional',
      title: `Tratamiento no definido (${key})`,
      details: 'Detalles no disponibles.',
      source: 'N/A',
      confidence: 30,
      urgency: 'low',
      evidenceLevel: 'D',
      contraindications: ['Información incompleta'],
      prerequisites: ['Validación de datos clínicos']
    };
  }

  // 🎯 OBTENER CONFIGURACIÓN BASE DEL TRATAMIENTO
  const config = getTreatmentConfig(key);
  let { confidence, urgency } = config;

  // 🔬 AJUSTE DE CONFIANZA BASADO EN CONTEXTO CLÍNICO
  if (context) {
    if (context.riskLevel === 'HIGH' || context.riskLevel === 'CRITICAL') {
      // Escalamiento progresivo de urgencia basado en riesgo
      if (urgency === 'low') urgency = 'moderate';
      else if (urgency === 'moderate') urgency = 'high';
      else urgency = 'critical';
    }
    
    if (context.clinicalScore < 70) {
      confidence = Math.max(50, confidence - 15);
    } else if (context.clinicalScore > 90) {
      confidence = Math.min(100, confidence + 10);
    }
  }

  return {
    category: config.category,
    title: content.explanation.split('.')[0] || 'Sugerencia de Tratamiento',
    details: content.explanation + (content.recommendations.length > 0 ? '\n\nRecomendaciones: ' + content.recommendations.join('; ') : ''),
    source: content.sources && content.sources.length > 0 ? content.sources.join(', ') : 'Recomendación Clínica',
    confidence,
    urgency,
    evidenceLevel: config.evidenceLevel,
    contraindications: [], // Se podría expandir desde clinicalContentLibrary
    prerequisites: [] // Se podría expandir desde clinicalContentLibrary
  };
};

/**
 * Sugiere tratamientos basado en el EvaluationState completo.
 * Implementa las reglas de decisión estratégica y clasificación terapéutica del DFCA.
 */
function getStrategicDecisionSuggestions(input: UserInput, factors: Factors, context?: TreatmentContext): EnhancedTreatmentSuggestion[] {
  if (input.age >= 40 && (input.amh !== undefined && input.amh < 1.0)) {
    return [getTreatmentSuggestion('DECISION_FIV_EDAD_AMH_CRITICO', context)];
  }
  if (input.endometriosisGrade >= 3 && (factors.male !== undefined && factors.male < 1.0)) {
    return [getTreatmentSuggestion('DECISION_FIV_ENDO_AVANZADA_SEMINAL', context)];
  }
  if (
    input.hasPcos &&
    (input.homaIr !== undefined && input.homaIr >= 4.0) &&
    (input.cycleDuration !== undefined && input.cycleDuration > 60) &&
    (input.prolactin !== undefined && input.prolactin > 50)
  ) {
    return [getTreatmentSuggestion('DECISION_FIV_SOP_METABOLICO_CRITICO', context)];
  }
  if (factors.otb === 0.0 || factors.hsg === 0.0) {
    return [getTreatmentSuggestion('DECISION_FIV_OTB_BILATERAL', context)];
  }
  return [];
}

function shouldSuggestFIV(input: UserInput, factors: Factors): boolean {
  return (
    factors.otb === 0.0 ||
    factors.hsg === 0.0 ||
    factors.male === 0.0 ||
    ((input.amh !== undefined && input.amh < 1.0) && input.age > 35) ||
    (input.endometriosisGrade >= 3 && input.age > 35) ||
    (input.adenomyosisType === AdenomyosisType.Diffuse) ||
    (input.age >= 43 && (input.amh !== undefined && input.amh < 0.5))
  );
}

function shouldSuggestICSI(input: UserInput): boolean {
  return (
    (input.spermNormalMorphology !== undefined && input.spermNormalMorphology < 2) ||
    (input.spermProgressiveMotility !== undefined && input.spermProgressiveMotility < 20)
  );
}

function shouldSuggestOvodonacion(input: UserInput): boolean {
  return input.age >= 43 && (input.amh !== undefined && input.amh < 0.5);
}

function getAbsoluteFIVSuggestions(input: UserInput, factors: Factors, context?: TreatmentContext): EnhancedTreatmentSuggestion[] {
  let suggestions: EnhancedTreatmentSuggestion[] = [];

  if (shouldSuggestFIV(input, factors)) {
    suggestions.push(getTreatmentSuggestion('TRAT_FIV_INDICACIONES_ABSOLUTAS', context));
    if (shouldSuggestICSI(input)) {
      suggestions.push(getTreatmentSuggestion('TRAT_ICSI_RECOMENDADO', context));
    }
    if (shouldSuggestOvodonacion(input)) {
      suggestions.push(getTreatmentSuggestion('TRAT_OVODONACION', context));
    }
  }
  return suggestions;
}

function shouldSuggestIACHelper(evaluation: EvaluationState, input: UserInput, factors: Factors, shouldSuggestFIV: boolean): boolean {
  const isSpermLimit =
    (input.spermProgressiveMotility !== undefined && input.spermProgressiveMotility >= 30 && input.spermProgressiveMotility < 40) ||
    (input.spermConcentration !== undefined && input.spermConcentration >= 10 && input.spermConcentration < 16);

  if (isSpermLimit && (factors.cycle !== undefined && factors.cycle >= 0.85)) return true;
  if (input.hsgResult === HsgResult.Unilateral) return true;
  if ((input.endometriosisGrade === 1 || input.endometriosisGrade === 2) && input.age < 35 && (input.amh !== undefined && input.amh >= 1.5)) return true;
  if (
    evaluation.diagnostics.missingData !== undefined &&
    evaluation.diagnostics.missingData.length === 0 &&
    evaluation.report.numericPrognosis >= 10 &&
    evaluation.report.numericPrognosis < 20
  ) return true;
  if ((input.infertilityDuration !== undefined && input.infertilityDuration >= 2 && input.infertilityDuration < 5) && !shouldSuggestFIV) return true;
  return false;
}

function isIACContraindicatedHelper(input: UserInput, factors: Factors): boolean {
  return (
    factors.hsg === 0.0 ||
    (input.spermProgressiveMotility !== undefined && input.spermProgressiveMotility < 30) ||
    (input.spermNormalMorphology !== undefined && input.spermNormalMorphology < 2) ||
    (input.amh !== undefined && input.amh < 1.0) ||
    input.age > 38 ||
    input.adenomyosisType === AdenomyosisType.Diffuse
  );
}

function getIACSuggestions(evaluation: EvaluationState, input: UserInput, factors: Factors, shouldSuggestFIV: boolean, context?: TreatmentContext): EnhancedTreatmentSuggestion[] {
  let suggestions: EnhancedTreatmentSuggestion[] = [];
  const shouldSuggestIAC = shouldSuggestIACHelper(evaluation, input, factors, shouldSuggestFIV);
  const isIACContraindicated = isIACContraindicatedHelper(input, factors);

  if (shouldSuggestIAC && !isIACContraindicated) {
    suggestions.push(getTreatmentSuggestion('TRAT_IAC_INDICACIONES', context));
  }
  return suggestions;
}

function getLowComplexitySuggestions(input: UserInput, factors: Factors, context?: TreatmentContext): EnhancedTreatmentSuggestion[] {
  let suggestions: EnhancedTreatmentSuggestion[] = [];
  let shouldSuggestLowComplexity = false;

  if (
    input.age < 35 &&
    (input.amh !== undefined && input.amh >= 1.0) &&
    (factors.cycle !== undefined && factors.cycle >= 0.85) &&
    (factors.male !== undefined && factors.male === 1.0) &&
    (input.hsgResult === HsgResult.Normal || input.hsgResult === HsgResult.Unilateral) &&
    (input.infertilityDuration !== undefined && input.infertilityDuration < 2) &&
    (factors.tsh !== undefined && factors.tsh >= 0.85) &&
    (factors.prolactin !== undefined && factors.prolactin >= 0.85)
  ) {
    shouldSuggestLowComplexity = true;
  }
  if (
    input.age < 32 &&
    (input.amh !== undefined && input.amh > 4.5) &&
    input.hasPcos &&
    (input.spermNormalMorphology !== undefined && input.spermNormalMorphology >= 4) &&
    (input.spermConcentration !== undefined && input.spermConcentration >= 16) &&
    (input.homaIr !== undefined && input.homaIr < 2.0) &&
    (input.tsh !== undefined && input.tsh >= 0.5 && input.tsh <= 2.5)
  ) {
    suggestions.push(getTreatmentSuggestion('INT_PERFIL_HIERESPONDEDOR_JOVEN_SOP_ESTABLE', context));
    shouldSuggestLowComplexity = true;
  }
  if (
    (input.endometriosisGrade === 1 || input.endometriosisGrade === 2) &&
    (input.amh !== undefined && input.amh >= 1.5) &&
    input.age < 35
  ) {
    suggestions.push(getTreatmentSuggestion('INT_ENDO_LEVE_AMH_NORMAL_JOVEN', context));
    shouldSuggestLowComplexity = true;
  }
  if (
    input.hsgResult === HsgResult.Unilateral &&
    input.age < 35 &&
    (input.spermConcentration !== undefined && input.spermConcentration >= 16) &&
    (input.spermProgressiveMotility !== undefined && input.spermProgressiveMotility >= 30)
  ) {
    suggestions.push(getTreatmentSuggestion('INT_HSG_UNILATERAL_JOVEN_SEMEN_NORMAL', context));
    shouldSuggestLowComplexity = true;
  }
  if (
    input.age < 34 &&
    input.polypType === PolypType.Small &&
    (input.cycleDuration !== undefined && input.cycleDuration >= 24 && input.cycleDuration <= 35) &&
    (input.spermNormalMorphology !== undefined && input.spermNormalMorphology >= 4)
  ) {
    suggestions.push(getTreatmentSuggestion('INT_POLIPO_PEQUENO_JOVEN_FAVORABLE', context));
    shouldSuggestLowComplexity = true;
  }
  if (
    input.age < 30 &&
    (input.amh !== undefined && input.amh > 5) &&
    input.hasPcos &&
    (input.homaIr !== undefined && input.homaIr < 2) &&
    (input.tsh !== undefined && input.tsh >= 0.5 && input.tsh <= 2.5)
  ) {
    suggestions.push(getTreatmentSuggestion('INT_EDAD_AMH_SOP_HOMA_TSH_OPTIMO', context));
    shouldSuggestLowComplexity = true;
  }
  if (shouldSuggestLowComplexity) {
    suggestions.push(getTreatmentSuggestion('TRAT_BAJA_COMPLEJIDAD_CRITERIOS', context));
  }
  return suggestions;
}

/**
 * Helper function to get BMI-related suggestions
 */
function getBmiSuggestions(bmi: number, context?: TreatmentContext): EnhancedTreatmentSuggestion[] {
  if (bmi >= 1.0) return [];
  
  if (bmi === 0.85) return [getTreatmentSuggestion('IMC_SOBREPESO', context)];
  if (bmi === 0.75) return [getTreatmentSuggestion('IMC_OBESIDAD_I', context)];
  if (bmi === 0.6) return [getTreatmentSuggestion('IMC_OBESIDAD_II', context)];
  if (bmi === 0.4) return [getTreatmentSuggestion('IMC_OBESIDAD_III', context)];
  if (bmi === 0.7) return [getTreatmentSuggestion('IMC_BAJO', context)];
  
  return [];
}

function getOptimizationSuggestions(input: UserInput, factors: Factors, currentSuggestions: EnhancedTreatmentSuggestion[], context?: TreatmentContext): EnhancedTreatmentSuggestion[] {
  // Skip optimization for high complexity treatments
  if (currentSuggestions.length > 0 && currentSuggestions[0].category === 'Alta Complejidad') {
    return [];
  }
  
  let suggestions: EnhancedTreatmentSuggestion[] = [];
  
  // Add BMI-related suggestions
  suggestions = suggestions.concat(getBmiSuggestions(factors.bmi, context));
  
  // Add other factor suggestions
  if (factors.homa < 1.0) suggestions.push(getTreatmentSuggestion('HOMA_LEVE', context));
  if (factors.prolactin < 1.0) suggestions.push(getTreatmentSuggestion('PRL_LEVE', context));
  if (factors.tsh < 1.0) suggestions.push(getTreatmentSuggestion('TSH_LIMITE_SUPERIOR', context));
  if (input.tpoAbPositive) suggestions.push(getTreatmentSuggestion('TPOAB_POSITIVO', context));
  
  return suggestions;
}

/**
 * 🎯 FUNCIÓN PRINCIPAL MEJORADA - SISTEMA DE CONFIANZA INTEGRADO
 * Sugiere tratamientos basado en el EvaluationState completo con contexto clínico
 */
export function suggestTreatments(evaluation: EvaluationState): EnhancedTreatmentSuggestion[] {
  const { input, factors } = evaluation;
  
  // 🔬 CONSTRUIR CONTEXTO CLÍNICO
  const context: TreatmentContext = {
    input,
    factors,
    clinicalScore: calculateClinicalScore(input, factors),
    riskLevel: assessRiskLevel(input, factors)
  };
  
  let suggestions: EnhancedTreatmentSuggestion[] = [];

  // 1. Strategic Decision (CRÍTICAS - prioridad máxima)
  const strategicSuggestions = getStrategicDecisionSuggestions(input, factors, context);
  if (strategicSuggestions.length > 0) {
    return prioritizeSuggestions(strategicSuggestions);
  }

  // 2. Absolute FIV (INDICACIONES ABSOLUTAS)
  const absoluteFIVSuggestions = getAbsoluteFIVSuggestions(input, factors, context);
  if (absoluteFIVSuggestions.length > 0) {
    return prioritizeSuggestions(absoluteFIVSuggestions);
  }

  // 3. IAC (COMPLEJIDAD INTERMEDIA)
  const shouldSuggestFIV = absoluteFIVSuggestions.length > 0;
  const iacSuggestions = getIACSuggestions(evaluation, input, factors, shouldSuggestFIV, context);
  if (iacSuggestions.length > 0) {
    return prioritizeSuggestions(iacSuggestions);
  }

  // 4. Low Complexity (PRIMERA LÍNEA)
  const lowComplexitySuggestions = getLowComplexitySuggestions(input, factors, context);
  suggestions = suggestions.concat(lowComplexitySuggestions);

  // 5. Optimization (COMPLEMENTARIAS)
  suggestions = suggestions.concat(getOptimizationSuggestions(input, factors, suggestions, context));

  // 6. Default (FALLBACK SEGURO)
  if (suggestions.length === 0) {
    suggestions.push(getTreatmentSuggestion('TRAT_ESTUDIO_ADICIONAL', context));
  }

  // 🔬 PRIORIZACIÓN Y LIMPIEZA FINAL
  return prioritizeSuggestions(removeDuplicateSuggestions(suggestions));
}

/**
 * 🎯 FUNCIONES AUXILIARES MEJORADAS
 */

function calculateClinicalScore(input: UserInput, factors: Factors): number {
  let score = 70; // Base score
  
  // Factores que mejoran el score
  if (input.age && input.age < 35) score += 10;
  if (input.amh && input.amh > 1.5) score += 10;
  if (factors.male === 1.0) score += 5;
  if (factors.cycle >= 0.8) score += 5;
  
  // Factores que reducen el score
  if (input.age && input.age > 40) score -= 15;
  if (input.amh && input.amh < 1.0) score -= 10;
  if (factors.male < 0.7) score -= 10;
  if (input.endometriosisGrade && input.endometriosisGrade >= 3) score -= 10;
  
  return Math.max(0, Math.min(100, score));
}

function assessRiskLevel(input: UserInput, factors: Factors): TreatmentContext['riskLevel'] {
  // Criterios críticos
  if ((input.age && input.age >= 43) || 
      (input.amh && input.amh < 0.5) || 
      factors.otb === 0.0 ||
      factors.hsg === 0.0) {
    return 'CRITICAL';
  }
  
  // Criterios altos
  if ((input.age && input.age >= 38) ||
      (input.amh && input.amh < 1.0) ||
      (input.endometriosisGrade && input.endometriosisGrade >= 3) ||
      factors.male < 0.5) {
    return 'HIGH';
  }
  
  // Criterios medios
  if ((input.age && input.age >= 35) ||
      (input.amh && input.amh < 1.5) ||
      input.hasPcos ||
      (input.infertilityDuration && input.infertilityDuration >= 2)) {
    return 'MEDIUM';
  }
  
  return 'LOW';
}

function prioritizeSuggestions(suggestions: EnhancedTreatmentSuggestion[]): EnhancedTreatmentSuggestion[] {
  return suggestions.sort((a, b) => {
    // Prioridad por urgencia
    const urgencyWeight = { 'critical': 4, 'high': 3, 'moderate': 2, 'low': 1 };
    const urgencyDiff = urgencyWeight[b.urgency] - urgencyWeight[a.urgency];
    if (urgencyDiff !== 0) return urgencyDiff;
    
    // Luego por confianza
    const confidenceDiff = b.confidence - a.confidence;
    if (confidenceDiff !== 0) return confidenceDiff;
    
    // Finalmente por nivel de evidencia
    const evidenceWeight = { 'A': 4, 'B': 3, 'C': 2, 'D': 1 };
    return evidenceWeight[b.evidenceLevel] - evidenceWeight[a.evidenceLevel];
  });
}

function removeDuplicateSuggestions(suggestions: EnhancedTreatmentSuggestion[]): EnhancedTreatmentSuggestion[] {
  const seen = new Set<string>();
  return suggestions.filter(suggestion => {
    const key = `${suggestion.category}-${suggestion.title}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}