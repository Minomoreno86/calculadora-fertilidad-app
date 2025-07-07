import { UserInput, EvaluationState } from '../models';
import * as factorEvaluators from '../logic/factorEvaluators';
import * as reportGenerator from '../logic/reportGenerator';

/**
 * Motor principal que orquesta toda la evaluación de fertilidad.
 * @param userInput Los datos crudos del formulario.
 * @returns Un objeto EvaluationState completo con el pronóstico y el informe.
 */
export const runFullEvaluation = (userInput: UserInput): EvaluationState => {
  // 1. Inicializar el estado de la evaluación con los datos de entrada y valores por defecto
  let evaluation: EvaluationState = {
    ...userInput,
    probabilidad_base_edad_num: 0,
    pronostico_numerico: 0,
    imc_factor: 1.0, ciclo_factor: 1.0, sop_factor: 1.0,
    endometriosis_factor: 1.0, mioma_factor: 1.0, adenomiosis_factor: 1.0,
    polipo_factor: 1.0, hsg_factor: 1.0, otb_factor: 1.0,
    amh_factor: 1.0, prolactina_factor: 1.0, tsh_factor: 1.0,
    homa_factor: 1.0, male_factor: 1.0,
    diagnostico_potencial_edad: "", comentario_imc: "", comentario_ciclo: "",
    severidad_sop: "No aplica", comentario_endometriosis: "", comentario_miomas: "",
    comentario_adenomiosis: "", comentario_polipo: "", comentario_hsg: "",
    diagnostico_reserva: "Evaluación no realizada", diagnostico_masculino_detallado: "Normal o sin datos",
    comentario_prolactina: "", comentario_tsh: "", homa_calculado: userInput.homaIr || null, comentario_homa: "",
    datos_faltantes: [], pronostico_categoria: "", pronostico_emoji: "",
    pronostico_frase: "", benchmark_frase: "", recomendaciones_lista: [],
    insights_clinicos: [],
  };

  // 2. Ejecutar cada función de evaluación de factores y fusionar los resultados
  const ageBaselineResult = factorEvaluators.evaluateAgeBaseline(evaluation.edad);
  const imcResult = factorEvaluators.evaluateImc(evaluation.imc);
  const cycleResult = factorEvaluators.evaluateMenstrualCycle(evaluation.duracion_ciclo);
  const pcosResult = factorEvaluators.evaluatePcos(evaluation.tiene_sop, evaluation.imc, evaluation.duracion_ciclo);
  const endometriosisResult = factorEvaluators.evaluateEndometriosis(evaluation.grado_endometriosis);
  const myomasResult = factorEvaluators.evaluateMyomas(evaluation.tiene_miomas, evaluation.mioma_submucoso, evaluation.mioma_intramural_significativo);
  const adenomyosisResult = factorEvaluators.evaluateAdenomiosis(evaluation.tipo_adenomiosis);
  const polypsResult = factorEvaluators.evaluatePolyps(evaluation.tipo_polipo);
  const hsgResult = factorEvaluators.evaluateHsg(evaluation.resultado_hsg);
  const otbResult = factorEvaluators.evaluateOtb(evaluation.tiene_otb);
  const amhResult = factorEvaluators.evaluateAmh(evaluation.amh);
  const prolactinResult = factorEvaluators.evaluateProlactin(evaluation.prolactina);
  const tshResult = factorEvaluators.evaluateTsh(evaluation.tsh);
  const homaResult = factorEvaluators.evaluateHomaIndex(evaluation.homa_calculado);
  const maleFactorResult = factorEvaluators.evaluateMaleFactor(userInput);

  evaluation = {
    ...evaluation,
    ...ageBaselineResult, ...imcResult, ...cycleResult, ...pcosResult,
    ...endometriosisResult, ...myomasResult, ...adenomyosisResult, ...polypsResult,
    ...hsgResult, ...otbResult, ...amhResult, ...prolactinResult, ...tshResult,
    ...homaResult, ...maleFactorResult,
  };

  // 3. Recopilar todos los factores numéricos para la multiplicación
  const factorsToMultiply = [
    evaluation.imc_factor, evaluation.ciclo_factor, evaluation.sop_factor,
    evaluation.endometriosis_factor, evaluation.mioma_factor, evaluation.adenomiosis_factor,
    evaluation.polipo_factor, evaluation.hsg_factor, evaluation.otb_factor,
    evaluation.amh_factor, evaluation.prolactina_factor, evaluation.tsh_factor,
    evaluation.homa_factor, evaluation.male_factor,
  ].filter(factor => factor !== undefined && factor !== null) as number[];

  // 4. Calcular la probabilidad final (direct multiplication model)
  const productOfFactors = factorsToMultiply.reduce((acc, factor) => acc * factor, 1);
  evaluation.pronostico_numerico = evaluation.probabilidad_base_edad_num * productOfFactors;
  
  // 5. Generar todos los textos del informe final
  const prognosisTexts = reportGenerator.generatePrognosisTexts(evaluation);
  const benchmarkText = reportGenerator.generateBenchmarkComparison(evaluation);
  const insights = reportGenerator.collectClinicalInsights(evaluation);
  
  evaluation = {
    ...evaluation,
    ...prognosisTexts,
    ...benchmarkText,
    ...insights,
  };

  // 6. Retornar el objeto de evaluación completo (nuestro informe)
  return evaluation;
};