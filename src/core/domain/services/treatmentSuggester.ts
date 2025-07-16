// src/core/domain/services/treatmentSuggester.ts
import { EvaluationState, TreatmentSuggestion, UserInput, Factors, HsgResult, PolypType, AdenomyosisType } from '../models';
import { clinicalContentLibrary } from '../logic/clinicalContentLibrary'; // Biblioteca clínica unificada

/**
 * Helper para obtener una sugerencia de tratamiento de la biblioteca clínica.
 * @param key La clave del tratamiento en la biblioteca.
 * @returns El objeto TreatmentSuggestion completo.
 */
const getTreatmentSuggestion = (key: string): TreatmentSuggestion => {
  const content = clinicalContentLibrary[key];
  if (!content) {
    console.warn(`Content for treatment key "${key}" not found in clinical library.`);
    return {
      category: 'Estudio Adicional',
      title: `Tratamiento no definido (${key})`,
      details: 'Detalles no disponibles.',
      source: 'N/A',
    };
  }

  // Asumimos que la categoría es parte del título de la clave o se infiere de la lógica que llama.
  // Para mayor robustez, podríamos extender ClinicalInfo para incluir una 'category' explícita.
  // Por ahora, inferimos de las claves o usamos un mapeo.
  let category: TreatmentSuggestion['category'];
  if (key.startsWith('TRAT_BAJA_')) {
    category = 'Baja Complejidad';
  } else if (key.startsWith('TRAT_IAC_')) {
    category = 'Baja Complejidad'; // IAC es considerada baja complejidad por el DFCA
  } else if (key.startsWith('TRAT_FIV_') || key.startsWith('TRAT_ICSI_') || key.startsWith('TRAT_OVODONACION')) {
    category = 'Alta Complejidad';
  } else if (key.startsWith('DECISION_FIV_') || key.startsWith('INT_')) {
      category = 'Alta Complejidad'; // Interacciones que suelen llevar a alta complejidad
  } else {
    category = 'Optimización Médica'; // Por defecto para otros hallazgos clínicos individuales
  }


  return {
    category: category,
    title: content.explanation.split('.')[0] || 'Sugerencia de Tratamiento', // Toma la primera frase como título
    details: content.explanation + (content.recommendations.length > 0 ? '\n\nRecomendaciones: ' + content.recommendations.join('; ') : ''),
    source: content.sources && content.sources.length > 0 ? content.sources.join(', ') : 'Recomendación Clínica',
  };
};

/**
 * Sugiere tratamientos basado en el EvaluationState completo.
 * Implementa las reglas de decisión estratégica y clasificación terapéutica del DFCA.
 */
function getStrategicDecisionSuggestions(input: UserInput, factors: Factors): TreatmentSuggestion[] {
  if (input.age >= 40 && (input.amh !== undefined && input.amh < 1.0)) {
    return [getTreatmentSuggestion('DECISION_FIV_EDAD_AMH_CRITICO')];
  }
  if (input.endometriosisGrade >= 3 && (factors.male !== undefined && factors.male < 1.0)) {
    return [getTreatmentSuggestion('DECISION_FIV_ENDO_AVANZADA_SEMINAL')];
  }
  if (
    input.hasPcos &&
    (input.homaIr !== undefined && input.homaIr >= 4.0) &&
    (input.cycleDuration !== undefined && input.cycleDuration > 60) &&
    (input.prolactin !== undefined && input.prolactin > 50)
  ) {
    return [getTreatmentSuggestion('DECISION_FIV_SOP_METABOLICO_CRITICO')];
  }
  if (factors.otb === 0.0 || factors.hsg === 0.0) {
    return [getTreatmentSuggestion('DECISION_FIV_OTB_BILATERAL')];
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

function getAbsoluteFIVSuggestions(input: UserInput, factors: Factors): TreatmentSuggestion[] {
  let suggestions: TreatmentSuggestion[] = [];

  if (shouldSuggestFIV(input, factors)) {
    suggestions.push(getTreatmentSuggestion('TRAT_FIV_INDICACIONES_ABSOLUTAS'));
    if (shouldSuggestICSI(input)) {
      suggestions.push(getTreatmentSuggestion('TRAT_ICSI_RECOMENDADO'));
    }
    if (shouldSuggestOvodonacion(input)) {
      suggestions.push(getTreatmentSuggestion('TRAT_OVODONACION'));
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

function getIACSuggestions(evaluation: EvaluationState, input: UserInput, factors: Factors, shouldSuggestFIV: boolean): TreatmentSuggestion[] {
  let suggestions: TreatmentSuggestion[] = [];
  const shouldSuggestIAC = shouldSuggestIACHelper(evaluation, input, factors, shouldSuggestFIV);
  const isIACContraindicated = isIACContraindicatedHelper(input, factors);

  if (shouldSuggestIAC && !isIACContraindicated) {
    suggestions.push(getTreatmentSuggestion('TRAT_IAC_INDICACIONES'));
  }
  return suggestions;
}

function getLowComplexitySuggestions(input: UserInput, factors: Factors): TreatmentSuggestion[] {
  let suggestions: TreatmentSuggestion[] = [];
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
    suggestions.push(getTreatmentSuggestion('INT_PERFIL_HIERESPONDEDOR_JOVEN_SOP_ESTABLE'));
    shouldSuggestLowComplexity = true;
  }
  if (
    (input.endometriosisGrade === 1 || input.endometriosisGrade === 2) &&
    (input.amh !== undefined && input.amh >= 1.5) &&
    input.age < 35
  ) {
    suggestions.push(getTreatmentSuggestion('INT_ENDO_LEVE_AMH_NORMAL_JOVEN'));
    shouldSuggestLowComplexity = true;
  }
  if (
    input.hsgResult === HsgResult.Unilateral &&
    input.age < 35 &&
    (input.spermConcentration !== undefined && input.spermConcentration >= 16) &&
    (input.spermProgressiveMotility !== undefined && input.spermProgressiveMotility >= 30)
  ) {
    suggestions.push(getTreatmentSuggestion('INT_HSG_UNILATERAL_JOVEN_SEMEN_NORMAL'));
    shouldSuggestLowComplexity = true;
  }
  if (
    input.age < 34 &&
    input.polypType === PolypType.Small &&
    (input.cycleDuration !== undefined && input.cycleDuration >= 24 && input.cycleDuration <= 35) &&
    (input.spermNormalMorphology !== undefined && input.spermNormalMorphology >= 4)
  ) {
    suggestions.push(getTreatmentSuggestion('INT_POLIPO_PEQUENO_JOVEN_FAVORABLE'));
    shouldSuggestLowComplexity = true;
  }
  if (
    input.age < 30 &&
    (input.amh !== undefined && input.amh > 5) &&
    input.hasPcos &&
    (input.homaIr !== undefined && input.homaIr < 2) &&
    (input.tsh !== undefined && input.tsh >= 0.5 && input.tsh <= 2.5)
  ) {
    suggestions.push(getTreatmentSuggestion('INT_EDAD_AMH_SOP_HOMA_TSH_OPTIMO'));
    shouldSuggestLowComplexity = true;
  }
  if (shouldSuggestLowComplexity) {
    suggestions.push(getTreatmentSuggestion('TRAT_BAJA_COMPLEJIDAD_CRITERIOS'));
  }
  return suggestions;
}

/**
 * Helper function to get BMI-related suggestions
 */
function getBmiSuggestions(bmi: number): TreatmentSuggestion[] {
  if (bmi >= 1.0) return [];
  
  if (bmi === 0.85) return [getTreatmentSuggestion('IMC_SOBREPESO')];
  if (bmi === 0.75) return [getTreatmentSuggestion('IMC_OBESIDAD_I')];
  if (bmi === 0.6) return [getTreatmentSuggestion('IMC_OBESIDAD_II')];
  if (bmi === 0.4) return [getTreatmentSuggestion('IMC_OBESIDAD_III')];
  if (bmi === 0.7) return [getTreatmentSuggestion('IMC_BAJO')];
  
  return [];
}

function getOptimizationSuggestions(input: UserInput, factors: Factors, currentSuggestions: TreatmentSuggestion[]): TreatmentSuggestion[] {
  // Skip optimization for high complexity treatments
  if (currentSuggestions.length > 0 && currentSuggestions[0].category === 'Alta Complejidad') {
    return [];
  }
  
  let suggestions: TreatmentSuggestion[] = [];
  
  // Add BMI-related suggestions
  suggestions = suggestions.concat(getBmiSuggestions(factors.bmi));
  
  // Add other factor suggestions
  if (factors.homa < 1.0) suggestions.push(getTreatmentSuggestion('HOMA_LEVE'));
  if (factors.prolactin < 1.0) suggestions.push(getTreatmentSuggestion('PRL_LEVE'));
  if (factors.tsh < 1.0) suggestions.push(getTreatmentSuggestion('TSH_LIMITE_SUPERIOR'));
  if (input.tpoAbPositive) suggestions.push(getTreatmentSuggestion('TPOAB_POSITIVO'));
  
  return suggestions;
}

export function suggestTreatments(evaluation: EvaluationState): TreatmentSuggestion[] {
  const { input, factors } = evaluation;
  let suggestions: TreatmentSuggestion[] = [];

  // 1. Strategic Decision
  const strategicSuggestions = getStrategicDecisionSuggestions(input, factors);
  if (strategicSuggestions.length > 0) {
    return strategicSuggestions;
  }

  // 2. Absolute FIV
  const absoluteFIVSuggestions = getAbsoluteFIVSuggestions(input, factors);
  if (absoluteFIVSuggestions.length > 0) {
    return absoluteFIVSuggestions;
  }

  // 3. IAC
  const shouldSuggestFIV = absoluteFIVSuggestions.length > 0;
  const iacSuggestions = getIACSuggestions(evaluation, input, factors, shouldSuggestFIV);
  if (iacSuggestions.length > 0) {
    return iacSuggestions;
  }

  // 4. Low Complexity
  const lowComplexitySuggestions = getLowComplexitySuggestions(input, factors);
  suggestions = suggestions.concat(lowComplexitySuggestions);

  // 5. Optimization
  suggestions = suggestions.concat(getOptimizationSuggestions(input, factors, suggestions));

  // 6. Default
  if (suggestions.length === 0) {
    suggestions.push(getTreatmentSuggestion('TRAT_ESTUDIO_ADICIONAL'));
  }

  // Remove duplicates
  const uniqueSuggestions = Array.from(new Set(suggestions.map(s => JSON.stringify(s))))
    .map(s => JSON.parse(s));

  return uniqueSuggestions;
}