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
  if (factorKey && result.factors && result.factors[factorKey] !== undefined) {
    factors[factorKey] = result.factors[factorKey] as Factors[K];
  } else if (factorKey) {
    factors[factorKey] = defaultFactorValue as Factors[K];
  }

  if (diagnosticKey && result.diagnostics && result.diagnostics[diagnosticKey] !== undefined) {
    diagnostics[diagnosticKey] = result.diagnostics[diagnosticKey] as Diagnostics[D];
  } else if (diagnosticKey) {
    diagnostics[diagnosticKey] = defaultDiagnosticValue as Diagnostics[D];
  }

  if (result.diagnostics?.missingData) {
    diagnostics.missingData.push(...result.diagnostics.missingData);
  }
}

function _evaluateAllFactors(userInput: UserInput, factors: Factors, diagnostics: Diagnostics): void {
  _updateEvaluationState(
    factorEvaluators.evaluateAgeBaseline(userInput.age),
    factors,
    diagnostics,
    'baseAgeProbability',
    'agePotential',
    DEFAULT_AGE_PROBABILITY,
    DEFAULT_DIAGNOSTIC_COMMENT,
  );

  _updateEvaluationState(
    factorEvaluators.evaluateBmi(userInput.bmi),
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
    factorEvaluators.evaluatePcos(userInput.hasPcos, userInput.bmi, userInput.cycleDuration),
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
  );

  _updateEvaluationState(
    factorEvaluators.evaluateMyomas(userInput.myomaType),
    factors,
    diagnostics,
    'myoma',
  );

  _updateEvaluationState(
    factorEvaluators.evaluateAdenomyosis(userInput.adenomyosisType),
    factors,
    diagnostics,
    'adenomyosis',
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

  _updateEvaluationState(
    factorEvaluators.evaluateHoma(userInput.homaIr),
    factors,
    diagnostics,
    'homa',
  );

  _updateEvaluationState(
    factorEvaluators.evaluateInfertilityDuration(userInput.infertilityDuration),
    factors,
    diagnostics,
    'infertilityDuration',
  );

  _updateEvaluationState(
    factorEvaluators.evaluatePelvicSurgeries(userInput.pelvicSurgeriesNumber),
    factors,
    diagnostics,
    'pelvicSurgery',
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

function _calculateFinalPrognosis(factors: Factors): number {
  const { baseAgeProbability, ...otherFactors } = factors;
  const productOfFactors = Object.values(otherFactors).reduce((acc, factor) => acc * factor, 1);
  return baseAgeProbability * productOfFactors;
}

function _generateReport(numericPrognosis: number, diagnostics: Diagnostics, userInput: UserInput, factors: Factors): Report {
  return reportGenerator.generateFinalReport(numericPrognosis, diagnostics, userInput, factors);
}

export function calculateProbability(userInput: UserInput): EvaluationState {
  const { factors, diagnostics } = _initializeEvaluationState();
  _evaluateAllFactors(userInput, factors, diagnostics);
  const numericPrognosis = _calculateFinalPrognosis(factors);
  const report = _generateReport(numericPrognosis, diagnostics, userInput, factors);

  const finalEvaluation: EvaluationState = {
    input: userInput,
    factors: factors,
    diagnostics: diagnostics,
    report: report,
  };

  return finalEvaluation;
}
