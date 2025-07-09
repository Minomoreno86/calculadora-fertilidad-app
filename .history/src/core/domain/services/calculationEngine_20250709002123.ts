import { UserInput, EvaluationState, Factors, Diagnostics, Report } from '../models';
import * as factorEvaluators from '../logic/factorEvaluators';
import * as reportGenerator from '../logic/reportGenerator';

/**
 * Motor principal que orquesta toda la evaluación de fertilidad.
 * @param userInput Los datos crudos del formulario.
 * @returns Un objeto EvaluationState completo con el pronóstico y el informe.
 */
export function calculateProbability(userInput: UserInput): EvaluationState {
  // 1. Inicializar el estado de la evaluación (Esta parte estaba correcta)
  const factors: Factors = {
    baseAgeProbability: 0,
    bmi: 1.0,
    cycle: 1.0,
    pcos: 1.0,
    endometriosis: 1.0,
    myoma: 1.0,
    adenomyosis: 1.0,
    polyp: 1.0,
    hsg: 1.0,
    otb: 1.0,
    amh: 1.0,
    prolactin: 1.0,
    tsh: 1.0,
    homa: 1.0,
    male: 1.0,
    infertilityDuration: 1.0,
    pelvicSurgery: 1.0,
  };

  const diagnostics: Diagnostics = {
    agePotential: '',
    bmiComment: '',
    cycleComment: '',
    pcosSeverity: 'No Aplica',
    endometriosisComment: '',
    myomaComment: '',
    adenomyosisComment: '',
    polypComment: '',
    hsgComment: '',
    ovarianReserve: 'No evaluada',
    prolactinComment: '',
    tshComment: '',
    homaComment: '',
    maleFactorDetailed: 'Normal o sin datos',
    missingData: [],
  };

  // 2. Ejecutar cada evaluador y DESEMPAQUETAR correctamente los resultados
  const ageResult = factorEvaluators.evaluateAgeBaseline(userInput.age);
  factors.baseAgeProbability = ageResult.factors?.baseAgeProbability ?? 0;
  diagnostics.agePotential = ageResult.diagnostics?.agePotential ?? 'No evaluada';

  const imcResult = factorEvaluators.evaluateImc(userInput.bmi);
  factors.bmi = imcResult.factors?.bmi ?? 1.0;
  diagnostics.bmiComment = imcResult.diagnostics?.bmiComment ?? '';
  diagnostics.missingData.push(...(imcResult.diagnostics?.missingData || []));
  
  const cycleResult = factorEvaluators.evaluateMenstrualCycle(userInput.cycleDuration);
  factors.cycle = cycleResult.factors?.cycle ?? 1.0;
  diagnostics.cycleComment = cycleResult.diagnostics?.cycleComment ?? '';
  diagnostics.missingData.push(...(cycleResult.diagnostics?.missingData || []));

  const pcosResult = factorEvaluators.evaluatePcos(userInput.hasPcos, userInput.bmi, userInput.cycleDuration);
  factors.pcos = pcosResult.factors?.pcos ?? 1.0;
  diagnostics.pcosSeverity = pcosResult.diagnostics?.pcosSeverity ?? 'No Aplica';

  const endometriosisResult = factorEvaluators.evaluateEndometriosis(userInput.endometriosisGrade);
  factors.endometriosis = endometriosisResult.factors?.endometriosis ?? 1.0;
  
  const myomaResult = factorEvaluators.evaluateMyomas(userInput.myomaType);
  factors.myoma = myomaResult.factors?.myoma ?? 1.0;
  
  const adenomyosisResult = factorEvaluators.evaluateAdenomyosis(userInput.adenomyosisType);
  factors.adenomyosis = adenomyosisResult.factors?.adenomyosis ?? 1.0;

  const polypResult = factorEvaluators.evaluatePolyps(userInput.polypType);
  factors.polyp = polypResult.factors?.polyp ?? 1.0;
  diagnostics.polypComment = polypResult.diagnostics?.polypComment ?? '';

  const hsgResult = factorEvaluators.evaluateHsg(userInput.hsgResult);
  factors.hsg = hsgResult.factors?.hsg ?? 1.0;
  diagnostics.hsgComment = hsgResult.diagnostics?.hsgComment ?? '';
  diagnostics.missingData.push(...(hsgResult.diagnostics?.missingData || []));

  const otbResult = factorEvaluators.evaluateOtb(userInput.hasOtb);
  factors.otb = otbResult.factors?.otb ?? 1.0;

  const amhResult = factorEvaluators.evaluateAmh(userInput.amh);
  factors.amh = amhResult.factors?.amh ?? 1.0;
  diagnostics.ovarianReserve = amhResult.diagnostics?.ovarianReserve ?? 'No evaluada';
  diagnostics.missingData.push(...(amhResult.diagnostics?.missingData || []));

  const prolactinResult = factorEvaluators.evaluateProlactin(userInput.prolactin);
  factors.prolactin = prolactinResult.factors?.prolactin ?? 1.0;
  diagnostics.prolactinComment = prolactinResult.diagnostics?.prolactinComment ?? '';
  diagnostics.missingData.push(...(prolactinResult.diagnostics?.missingData || []));

  const tshResult = factorEvaluators.evaluateTsh(userInput.tsh);
  factors.tsh = tshResult.factors?.tsh ?? 1.0;
  diagnostics.tshComment = tshResult.diagnostics?.tshComment ?? '';
  diagnostics.missingData.push(...(tshResult.diagnostics?.missingData || []));

  const homaResult = factorEvaluators.evaluateHOMA(userInput.homaIr);
  factors.homa = homaResult.factors?.homa ?? 1.0;

  const infertilityResult = factorEvaluators.evaluateInfertilityYears(userInput.infertilityDuration);
  factors.infertilityDuration = infertilityResult.factors?.infertilityDuration ?? 1.0;

  const pelvicSurgeryResult = factorEvaluators.evaluatePelvicSurgeries(userInput.pelvicSurgeriesNumber);
  factors.pelvicSurgery = pelvicSurgeryResult.factors?.pelvicSurgery ?? 1.0;

  const maleFactorResult = factorEvaluators.evaluateMaleFactor(userInput);
  factors.male = maleFactorResult.factors?.male ?? 1.0;
  diagnostics.maleFactorDetailed = maleFactorResult.diagnostics?.maleFactorDetailed ?? '';
  diagnostics.missingData.push(...(maleFactorResult.diagnostics?.missingData || []));

  // 3. Calcular la probabilidad final (Esta parte estaba correcta)
  const { baseAgeProbability, ...otherFactors } = factors;
  const productOfFactors = Object.values(otherFactors).reduce((acc, factor) => acc * factor, 1);
  const numericPrognosis = baseAgeProbability * productOfFactors;

  // 4. Generar el informe final delegando a reportGenerator (CORREGIDO para pasar los argumentos correctos)
  const report: Report = reportGenerator.generateFinalReport(numericPrognosis, diagnostics, userInput, factors);

  // 5. Ensamblar y retornar el estado final completo
  const finalEvaluation: EvaluationState = {
    input: userInput,
    factors: factors,
    diagnostics: diagnostics,
    report: report,
  };

  return finalEvaluation;
}