import { UserInput, EvaluationState, Factors, Diagnostics, Report } from '../models';
import * as factorEvaluators from '../logic/factorEvaluators';
import * as reportGenerator from '../logic/reportGenerator';

// Constantes para valores por defecto y cadenas comunes
const DEFAULT_FACTOR_VALUE = 1.0;
const DEFAULT_AGE_PROBABILITY = 0;
const DEFAULT_DIAGNOSTIC_COMMENT = '';
const DEFAULT_PCOS_SEVERITY = 'No Aplica';
const DEFAULT_OVARIAN_RESERVE = 'No evaluada';
const DEFAULT_MALE_FACTOR_DETAILED = 'Normal o sin datos';

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
    homaComment: DEFAULT_DIAGNOSTIC_COMMENT,
    maleFactorDetailed: DEFAULT_MALE_FACTOR_DETAILED,
    missingData: [],
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
  if (factorKey) {
    factors[factorKey] = result.factors?.[factorKey] ?? (defaultFactorValue as Factors[K]);
  }

  if (diagnosticKey) {
    diagnostics[diagnosticKey] = result.diagnostics?.[diagnosticKey] ?? (defaultDiagnosticValue as Diagnostics[D]);
  }

  if (result.diagnostics?.missingData) {
    diagnostics.missingData.push(...result.diagnostics.missingData);
  }
}

function _evaluateAllFactors(userInput: UserInput, factors: Factors, diagnostics: Diagnostics): void {
  const factorEvaluations = [
    { fn: factorEvaluators.evaluateAgeBaseline, args: [userInput.age], factorKey: 'baseAgeProbability', diagnosticKey: 'agePotential', defaultFactor: DEFAULT_AGE_PROBABILITY, defaultDiagnostic: DEFAULT_DIAGNOSTIC_COMMENT },
    { fn: factorEvaluators.evaluateBmi, args: [userInput.bmi], factorKey: 'bmi', diagnosticKey: 'bmiComment' },
    { fn: factorEvaluators.evaluateCycle, args: [userInput.cycleDuration], factorKey: 'cycle', diagnosticKey: 'cycleComment' },
    { fn: factorEvaluators.evaluatePcos, args: [userInput.hasPcos, userInput.bmi, userInput.cycleDuration], factorKey: 'pcos', diagnosticKey: 'pcosSeverity', defaultDiagnostic: DEFAULT_PCOS_SEVERITY },
    { fn: factorEvaluators.evaluateEndometriosis, args: [userInput.endometriosisGrade], factorKey: 'endometriosis' },
    { fn: factorEvaluators.evaluateMyomas, args: [userInput.myomaType], factorKey: 'myoma' },
    { fn: factorEvaluators.evaluateAdenomyosis, args: [userInput.adenomyosisType], factorKey: 'adenomyosis' },
    { fn: factorEvaluators.evaluatePolyps, args: [userInput.polypType], factorKey: 'polyp', diagnosticKey: 'polypComment' },
    { fn: factorEvaluators.evaluateHsg, args: [userInput.hsgResult], factorKey: 'hsg', diagnosticKey: 'hsgComment' },
    { fn: factorEvaluators.evaluateOtb, args: [userInput.hasOtb, userInput.age, userInput.otbMethod, userInput.remainingTubalLength, userInput.hasOtherInfertilityFactors, userInput.desireForMultiplePregnancies], factorKey: 'otb' },
    { fn: factorEvaluators.evaluateAmh, args: [userInput.amh], factorKey: 'amh', diagnosticKey: 'ovarianReserve', defaultDiagnostic: DEFAULT_OVARIAN_RESERVE },
    { fn: factorEvaluators.evaluateProlactin, args: [userInput.prolactin], factorKey: 'prolactin', diagnosticKey: 'prolactinComment' },
    { fn: factorEvaluators.evaluateTsh, args: [userInput.tsh], factorKey: 'tsh', diagnosticKey: 'tshComment' },
    { fn: factorEvaluators.evaluateHoma, args: [userInput.homaIr], factorKey: 'homa' },
    { fn: factorEvaluators.evaluateInfertilityDuration, args: [userInput.infertilityDuration], factorKey: 'infertilityDuration' },
    { fn: factorEvaluators.evaluatePelvicSurgeries, args: [userInput.pelvicSurgeriesNumber], factorKey: 'pelvicSurgery' },
    { fn: factorEvaluators.evaluateMaleFactor, args: [userInput], factorKey: 'male', diagnosticKey: 'maleFactorDetailed', defaultDiagnostic: DEFAULT_MALE_FACTOR_DETAILED },
  ];

  for (const evalConfig of factorEvaluations) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const result = evalConfig.fn(...evalConfig.args);
    _updateEvaluationState(
      result,
      factors,
      diagnostics,
      evalConfig.factorKey as keyof Factors,
      evalConfig.diagnosticKey as keyof Diagnostics,
      evalConfig.defaultFactor,
      evalConfig.defaultDiagnostic,
    );
  }
}

export function calculateProbabilityFromFactors(factors: Factors): number {
  const { baseAgeProbability, ...otherFactors } = factors;
  const productOfFactors = Object.values(otherFactors).reduce((acc, factor) => acc * factor, 1);
  return baseAgeProbability * productOfFactors;
}

function _generateReport(numericPrognosis: number, diagnostics: Diagnostics, userInput: UserInput, factors: Factors): Report {
  return reportGenerator.generateFinalReport(numericPrognosis, diagnostics, userInput, factors);
}

export function calculateProbability(userInput: UserInput): EvaluationState {
  const { factors, diagnostics } = _initializeEvaluationState();
  try {
    _evaluateAllFactors(userInput, factors, diagnostics);
  } catch (error) {
    console.error('calculateProbability: Error during factor evaluation:', error);
    throw error;
  }
  const numericPrognosis = calculateProbabilityFromFactors(factors);
  const report = _generateReport(numericPrognosis, diagnostics, userInput, factors);

  const finalEvaluation: EvaluationState = {
    input: userInput,
    factors: factors,
    diagnostics: diagnostics,
    report: report,
  };

  return finalEvaluation;
}
