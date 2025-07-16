// src/core/domain/services/calculationEnginePremium.ts
import { UserInput, EvaluationState, Factors, Diagnostics, Report, MyomaType, AdenomyosisType, HsgResult } from '../models';
import * as factorEvaluators from '../logic/factorEvaluators'; // Usar sistema básico mejorado
import * as reportGenerator from '../logic/reportGenerator'; // Usar reportGenerator básico

// Constantes para valores por defecto y cadenas comunes
const DEFAULT_FACTOR_VALUE = 1.0;
const DEFAULT_AGE_PROBABILITY = 0; // Se inicializará con la evaluación de edad
const DEFAULT_DIAGNOSTIC_COMMENT = '';
const DEFAULT_PCOS_SEVERITY = 'No aplica';
const DEFAULT_OVARIAN_RESERVE = 'No evaluada';
const DEFAULT_MALE_FACTOR_DETAILED = 'Normal o sin datos';
const DEFAULT_TPO_AB_COMMENT = '';
const DEFAULT_HOMA_COMMENT = '';
const DEFAULT_INFERTILITY_DURATION_COMMENT = '';
const DEFAULT_PELVIC_SURGERY_COMMENT = '';

function _initializeEvaluationState(): { factors: Factors; diagnostics: Diagnostics } {
const factors: Factors = {
    baseAgeProbability: DEFAULT_AGE_PROBABILITY,
    bmi: DEFAULT_FACTOR_VALUE,
    cycle: DEFAULT_FACTOR_VALUE,
    pcos: DEFAULT_FACTOR_VALUE,
    endometriosis: DEFAULT_FACTOR_VALUE,
    myoma: DEFAULT_FACTOR_VALUE,
    adenomyosis: DEFAULT_FACTOR_VALUE,
    polyp: DEFAULT_FACTOR_VALUE,
    hsg: DEFAULT_FACTOR_VALUE,
    otb: DEFAULT_FACTOR_VALUE,
    amh: DEFAULT_FACTOR_VALUE,
    prolactin: DEFAULT_FACTOR_VALUE,
    tsh: DEFAULT_FACTOR_VALUE,
    homa: DEFAULT_FACTOR_VALUE,
    male: DEFAULT_FACTOR_VALUE,
    infertilityDuration: DEFAULT_FACTOR_VALUE,
    pelvicSurgery: DEFAULT_FACTOR_VALUE,
};

  const diagnostics: Diagnostics = {
    agePotential: DEFAULT_DIAGNOSTIC_COMMENT,
    bmiComment: DEFAULT_DIAGNOSTIC_COMMENT,
    cycleComment: DEFAULT_DIAGNOSTIC_COMMENT,
    pcosSeverity: DEFAULT_PCOS_SEVERITY,
    endometriosisComment: DEFAULT_DIAGNOSTIC_COMMENT,
    myomaComment: DEFAULT_DIAGNOSTIC_COMMENT,
    adenomyosisComment: DEFAULT_DIAGNOSTIC_COMMENT,
    polypComment: DEFAULT_DIAGNOSTIC_COMMENT,
    hsgComment: DEFAULT_DIAGNOSTIC_COMMENT,
    ovarianReserve: DEFAULT_OVARIAN_RESERVE,
    prolactinComment: DEFAULT_DIAGNOSTIC_COMMENT,
    tshComment: DEFAULT_DIAGNOSTIC_COMMENT,
    homaComment: DEFAULT_HOMA_COMMENT,
    maleFactorDetailed: DEFAULT_MALE_FACTOR_DETAILED,
    missingData: [],
    tpoAbComment: DEFAULT_TPO_AB_COMMENT, // Asegurar que tpoAbComment está en Diagnostics
    infertilityDurationComment: DEFAULT_INFERTILITY_DURATION_COMMENT,
    pelvicSurgeryComment: DEFAULT_PELVIC_SURGERY_COMMENT,
  };
  return { factors, diagnostics };
}

type FactorEvaluationResult = {
  factors?: Partial<Factors>;
  diagnostics?: Partial<Diagnostics>;
};

/**
 * Helper function to evaluate a factor and update the factors and diagnostics objects.
 * It handles default values and accumulates missing data.
 */
function _updateEvaluationState<K extends keyof Factors, D extends keyof Diagnostics>(
  result: FactorEvaluationResult,
  factors: Factors,
  diagnostics: Diagnostics,
  factorKey?: K,
  diagnosticKey?: D,
  defaultFactorValue: number = DEFAULT_FACTOR_VALUE,
  defaultDiagnosticValue: string = DEFAULT_DIAGNOSTIC_COMMENT,
) {
  if (factorKey && result.factors?.[factorKey] !== undefined) {
    factors[factorKey] = result.factors?.[factorKey] as Factors[K];
  } else if (factorKey) {
    factors[factorKey] = defaultFactorValue as Factors[K];
  }

  if (diagnosticKey && result.diagnostics?.[diagnosticKey] !== undefined) {
    diagnostics[diagnosticKey] = result.diagnostics[diagnosticKey] as Diagnostics[D];
  } else if (diagnosticKey) {
    diagnostics[diagnosticKey] = defaultDiagnosticValue as Diagnostics[D];
  }

  if (result.diagnostics?.missingData) {
    diagnostics.missingData ??= [];
    diagnostics.missingData.push(...result.diagnostics.missingData);
  }
}

/**
 * Evalúa todos los factores individuales usando los evaluadores Premium.
 */
function _evaluateAllIndividualFactorsPremium(userInput: UserInput, factors: Factors, diagnostics: Diagnostics): void {
  // Evaluadores de factores individuales (usando sistema básico mejorado)
  _updateEvaluationState(
    factorEvaluators.evaluateAgeBaseline(userInput.age), // Mapeo: evaluateAgePremium -> evaluateAgeBaseline
    factors,
    diagnostics,
    'baseAgeProbability',
    'agePotential',
    DEFAULT_AGE_PROBABILITY,
    DEFAULT_DIAGNOSTIC_COMMENT,
  );

  _updateEvaluationState(
    factorEvaluators.evaluateBmi(userInput.bmi), // Mapeo: evaluateBmiPremium -> evaluateBmi
    factors,
    diagnostics,
    'bmi',
    'bmiComment',
  );

  _updateEvaluationState(
    factorEvaluators.evaluateCycle(userInput.cycleDuration),
    factors,
    diagnostics,
    'cycle',
    'cycleComment',
  );

  _updateEvaluationState(
    factorEvaluators.evaluatePcos(userInput.hasPcos, userInput.bmi, undefined, userInput.amh, userInput.homaIr),
    factors,
    diagnostics,
    'pcos',
    'pcosSeverity',
    DEFAULT_FACTOR_VALUE,
    DEFAULT_PCOS_SEVERITY,
  );

  _updateEvaluationState(
    factorEvaluators.evaluateEndometriosis(userInput.endometriosisGrade),
    factors,
    diagnostics,
    'endometriosis',
    'endometriosisComment',
  );

  _updateEvaluationState(
    factorEvaluators.evaluateMyomas(userInput.myomaType),
    factors,
    diagnostics,
    'myoma',
    'myomaComment',
  );

  _updateEvaluationState(
    factorEvaluators.evaluateAdenomyosis(userInput.adenomyosisType),
    factors,
    diagnostics,
    'adenomyosis',
    'adenomyosisComment',
  );

  _updateEvaluationState(
    factorEvaluators.evaluatePolyps(userInput.polypType),
    factors,
    diagnostics,
    'polyp',
    'polypComment',
  );

  _updateEvaluationState(
    factorEvaluators.evaluateHsg(userInput.hsgResult),
    factors,
    diagnostics,
    'hsg',
    'hsgComment',
  );

  _updateEvaluationState(
    factorEvaluators.evaluateOtb(userInput.hasOtb),
    factors,
    diagnostics,
    'otb',
  );

  _updateEvaluationState(
    factorEvaluators.evaluateAmh(userInput.amh),
    factors,
    diagnostics,
    'amh',
    'ovarianReserve',
    DEFAULT_FACTOR_VALUE,
    DEFAULT_OVARIAN_RESERVE,
  );

  _updateEvaluationState(
    factorEvaluators.evaluateProlactin(userInput.prolactin),
    factors,
    diagnostics,
    'prolactin',
    'prolactinComment',
  );

  _updateEvaluationState(
    factorEvaluators.evaluateTsh(userInput.tsh),
    factors,
    diagnostics,
    'tsh',
    'tshComment',
  );

  // TPO Ab evaluation removed as requested by user
  // _updateEvaluationState(
  //   evaluateTpoAb(userInput.tpoAbPositive),
  //   factors,
  //   diagnostics,
  //   undefined, // No es un factor directo
  //   'tpoAbComment',
  // );

  _updateEvaluationState(
    factorEvaluators.evaluateHoma(userInput.homaIr),
    factors,
    diagnostics,
    'homa',
    'homaComment',
  );

  _updateEvaluationState(
    factorEvaluators.evaluateInfertilityDuration(userInput.infertilityDuration),
    factors,
    diagnostics,
    'infertilityDuration',
    'infertilityDurationComment',
  );

  _updateEvaluationState(
    factorEvaluators.evaluatePelvicSurgeries(userInput.pelvicSurgeriesNumber),
    factors,
    diagnostics,
    'pelvicSurgery',
    'pelvicSurgeryComment',
  );

  _updateEvaluationState(
    factorEvaluators.evaluateMaleFactor(userInput),
    factors,
    diagnostics,
    'male',
    'maleFactorDetailed',
    DEFAULT_FACTOR_VALUE,
    DEFAULT_MALE_FACTOR_DETAILED,
  );
}

/**
 * Calcula el factor de ajuste inicial basado en factores individuales
 */
function _calculateInitialAdjustmentFactor(factors: Factors): number {
  return Object.keys(factors).reduce((acc, key) => {
    if (key !== 'baseAgeProbability' && key !== 'otb') { // OTB se maneja como bloqueante directo
      return acc * (factors[key as keyof Factors] || DEFAULT_FACTOR_VALUE);
    }
    return acc;
  }, 1.0);
}

/**
 * Maneja la lógica para casos de OTB (Ligadura de Trompas)
 */
function _handleOtbCase(factors: Factors, diagnostics: Diagnostics): boolean {
  if (factors.otb === 0.0) {
    factors.baseAgeProbability = 0; // Actualizar la base para que el reporte lo refleje
    factors.bmi = factors.cycle = factors.pcos = factors.endometriosis = factors.myoma = factors.adenomyosis =
      factors.polyp = factors.hsg = factors.amh = factors.prolactin = factors.tsh = factors.homa = factors.male =
      factors.infertilityDuration = factors.pelvicSurgery = 0.0; // Anular todos los factores
    diagnostics.tpoAbComment = DEFAULT_TPO_AB_COMMENT; // Anular comentario TPO
    return true;
  }
  return false;
}

/**
 * Aplica las reglas que fijan una probabilidad específica
 */
function _applyFixedProbabilityRules(userInput: UserInput, factors: Factors): { fixed: boolean, probability: number } {
  // Interacción 5: Edad ≥ 40 Años + Fallo Ovárico Inminente
  const isImminentOvarianFailure = (
    userInput.age >= 40 &&
    (userInput.amh !== undefined && userInput.amh < 0.3) &&
    (
      (userInput.cycleDuration !== undefined && userInput.cycleDuration > 45) ||
      (factors.cycle !== undefined && factors.cycle < 1.0)
    )
  );
  if (isImminentOvarianFailure) {
    factors.baseAgeProbability = 1.0;
    return { fixed: true, probability: 1.0 };
  }

  // Interacción 3: Endometriosis Avanzada + Factor Masculino Anormal
  const isSevereEndoAndMaleFactor = (
    userInput.endometriosisGrade >= 3 &&
    (factors.male !== undefined && factors.male < 1.0)
  );
  if (isSevereEndoAndMaleFactor) {
    factors.baseAgeProbability = 2.0;
    return { fixed: true, probability: 2.0 };
  }

  // Interacción 12: Ligadura Tubaria + Edad > 37 años
  if (factors.otb === 0.0 && userInput.age > 37) {
    return { fixed: true, probability: 0.0 };
  }

  // Interacción 15: Endometriosis III–IV + Edad > 39 años + AMH < 1.0
  if (
    userInput.endometriosisGrade >= 3 &&
    userInput.age > 39 &&
    (userInput.amh !== undefined && userInput.amh < 1.0)
  ) {
    factors.baseAgeProbability = 3.0;
    return { fixed: true, probability: 3.0 };
  }

  return { fixed: false, probability: 0 };
}

/**
 * Aplica ajustes relacionados con edad y reserva ovárica
 */
function _applyAgeAndReserveAdjustments(userInput: UserInput, probability: number): number {
  // Interacción 1: Edad Avanzada + Baja Reserva Ovárica
  if (userInput.age >= 38 && (userInput.amh !== undefined && userInput.amh < 0.8)) {
    probability *= 0.40;
  }
  
  // Interacción 14: AMH < 1.0 + Morfología Espermática < 2%
  if ((userInput.amh !== undefined && userInput.amh < 1.0) &&
      (userInput.spermNormalMorphology !== undefined && userInput.spermNormalMorphology < 2)) {
    probability *= 0.50;
  }
  
  return probability;
}

/**
 * Aplica ajustes relacionados con SOP
 */
function _applyPcosAdjustments(userInput: UserInput, probability: number): number {
  // Interacción 2: SOP + Resistencia a la Insulina Significativa
  if (userInput.hasPcos && (userInput.homaIr !== undefined && userInput.homaIr >= 3.5)) {
    probability *= 0.70;
  }
  
  // Interacción 6: SOP + IMC ≥ 35
  if (userInput.hasPcos && (userInput.bmi !== null && userInput.bmi >= 35)) {
    probability *= 0.60;
  }
  
  // Interacción 13: SOP + Ciclos > 60 días + Prolactina > 50 ng/mL
  if (userInput.hasPcos && 
      (userInput.cycleDuration !== undefined && userInput.cycleDuration > 60) &&
      (userInput.prolactin !== undefined && userInput.prolactin > 50)) {
    probability *= 0.55;
  }
  
  return probability;
}

/**
 * Aplica ajustes relacionados con factores anatómicos
 */
function _applyAnatomicalAdjustments(userInput: UserInput, factors: Factors, probability: number): number {
  // Interacción 4: Obstrucción Tubaria Unilateral + Alteración Seminal
  if (factors.hsg === 0.80 && (factors.male !== undefined && factors.male < 1.0)) {
    probability *= 0.50;
  }
  
  // Interacción 7: Mioma Submucoso + Endometriosis I–II
  if (userInput.myomaType === MyomaType.Submucosal && 
      (userInput.endometriosisGrade === 1 || userInput.endometriosisGrade === 2)) {
    probability *= 0.65;
  }
  
  // Interacción 8: Adenomiosis Difusa + Edad ≥ 38 años
  if (userInput.adenomyosisType === AdenomyosisType.Diffuse && userInput.age >= 38) {
    probability *= 0.50;
  }
  
  return probability;
}

/**
 * Aplica otros ajustes de salud e historial
 */
function _applyOtherHealthAdjustments(userInput: UserInput, probability: number): number {
  // Interacción 9: Infertilidad ≥ 5 años + ≥ 2 Cirugías Pélvicas
  if ((userInput.infertilityDuration !== undefined && userInput.infertilityDuration >= 5) &&
      (userInput.pelvicSurgeriesNumber !== undefined && userInput.pelvicSurgeriesNumber >= 2)) {
    probability *= 0.60;
  }
  
  // Interacción 10: TSH > 4.0 + TPO Ab Positivo
  if ((userInput.tsh !== undefined && userInput.tsh > 4.0) && userInput.tpoAbPositive) {
    probability *= 0.70;
  }
  
  return probability;
}

/**
 * Aplica los ajustes negativos a la probabilidad
 */
function _applyNegativeAdjustments(userInput: UserInput, factors: Factors, currentProbability: number): number {
  let probability = currentProbability;
  
  // Aplicar ajustes negativos por categoría
  probability = _applyAgeAndReserveAdjustments(userInput, probability);
  probability = _applyPcosAdjustments(userInput, probability);
  probability = _applyAnatomicalAdjustments(userInput, factors, probability);
  probability = _applyOtherHealthAdjustments(userInput, probability);
  
  return probability;
}

/**
 * Aplica los ajustes positivos a la probabilidad
 */
function _applyPositiveAdjustments(userInput: UserInput, currentProbability: number): number {
  let probability = currentProbability;

  // Interacción 16: Edad < 32 años + AMH > 4.5 + SOP + Normozoospermia
  if (userInput.age < 32 &&
      (userInput.amh !== undefined && userInput.amh > 4.5) &&
      userInput.hasPcos &&
      (userInput.spermNormalMorphology !== undefined && userInput.spermNormalMorphology >= 4) &&
      (userInput.spermConcentration !== undefined && userInput.spermConcentration >= 16)) {
    probability *= 1.15;
  }

  // Interacción 17: Endometriosis leve (I–II) + AMH > 1.5 + Edad < 35
  if ((userInput.endometriosisGrade === 1 || userInput.endometriosisGrade === 2) &&
      (userInput.amh !== undefined && userInput.amh >= 1.5) &&
      userInput.age < 35) {
    probability *= 1.10;
  }

  // Interacción 18: HSG con obstrucción unilateral + edad < 35 + espermatograma normal
  if (userInput.hsgResult === HsgResult.Unilateral &&
      userInput.age < 35 &&
      (userInput.spermConcentration !== undefined && userInput.spermConcentration >= 16) &&
      (userInput.spermProgressiveMotility !== undefined && userInput.spermProgressiveMotility >= 30)) {
    probability *= 1.05;
  }

  // Interacción 20: Edad < 30 + AMH > 5.0 + SOP + HOMA-IR < 2.0 + TSH óptimo
  if (userInput.age < 30 &&
      (userInput.amh !== undefined && userInput.amh > 5.0) &&
      userInput.hasPcos &&
      (userInput.homaIr !== undefined && userInput.homaIr < 2.0) &&
      (userInput.tsh !== undefined && userInput.tsh >= 0.5 && userInput.tsh <= 2.5)) {
    probability *= 1.20;
  }

  return probability;
}

/**
 * Aplica las reglas de interacción no lineal del DFCA al pronóstico base.
 * Ref: "REGLAS DE INTERACCION NO LINEAL.docx"
 */
function _applyNonLinearInteractionsPremium(userInput: UserInput, factors: Factors, diagnostics: Diagnostics): void {
  let currentProbability = factors.baseAgeProbability;
  
  // Aplicar factores de ajuste individuales
  currentProbability *= _calculateInitialAdjustmentFactor(factors);

  // Manejar caso OTB - bloquea completamente el pronóstico
  if (_handleOtbCase(factors, diagnostics)) {
    return;
  }

  // Aplicar reglas de probabilidad fija
  const fixedResult = _applyFixedProbabilityRules(userInput, factors);
  if (fixedResult.fixed) {
    factors.baseAgeProbability = fixedResult.probability;
    return;
  }

  // Aplicar ajustes negativos
  currentProbability = _applyNegativeAdjustments(userInput, factors, currentProbability);
  
  // Aplicar ajustes positivos
  currentProbability = _applyPositiveAdjustments(userInput, currentProbability);

  // Asegurar que la probabilidad esté en rango válido
  factors.baseAgeProbability = Math.max(0, Math.min(100, currentProbability));
}

/**
 * Genera el objeto Report completo utilizando el generador de reportes.
 * En futuras fases, reportGenerator necesitará una versión Premium.
 */
function _generateReportPremium(numericPrognosis: number, diagnostics: Diagnostics, userInput: UserInput, factors: Factors): Report {
  return reportGenerator.generateFinalReport(numericPrognosis, diagnostics, userInput, factors); // Usar función básica
}

/**
 * Calcula la probabilidad de fertilidad para el módulo Premium.
 * Incluye la evaluación de factores individuales y la aplicación de interacciones no lineales.
 */
export function calculateProbabilityPremium(userInput: UserInput): EvaluationState {
  const { factors, diagnostics } = _initializeEvaluationState();

  // 1. Evaluar todos los factores individuales
  _evaluateAllIndividualFactorsPremium(userInput, factors, diagnostics);

  // 2. Calcular la probabilidad base inicial (producto de baseAgeProbability y todos los factores individuales)
  // NOTA: La aplicación de los factores individuales se hace *dentro* de _applyNonLinearInteractionsPremium
  // para permitir que las interacciones fijen valores o anulen lógicas.
  // El cálculo real se ajusta en la función de interacciones.

  // 3. Aplicar las reglas de interacción no lineal (modifican `factors`)
  _applyNonLinearInteractionsPremium(userInput, factors, diagnostics);

  // Después de aplicar las interacciones, `factors.baseAgeProbability` ahora contiene la probabilidad final
  // (ya sea el resultado del cálculo multiplicativo ajustado o un valor fijo por interacción).
  let numericPrognosis = factors.baseAgeProbability;

  // Asegurar que el pronóstico final sea coherente con 0 si es una anulación
  if (factors.otb === 0.0 || numericPrognosis < 0) { // OTB es un bloqueante absoluto
    numericPrognosis = 0;
  }
  // Limitar el pronóstico a 100% como máximo
  numericPrognosis = Math.min(numericPrognosis, 100);

  // 4. Generar el reporte final
  const report = _generateReportPremium(numericPrognosis, diagnostics, userInput, factors);

  const finalEvaluation: EvaluationState = {
    input: userInput,
    factors: factors,
    diagnostics: diagnostics,
    report: report,
  };

  return finalEvaluation;
}
