import { UserInput, EvaluationState } from '../models';
import * as factorEvaluators from '../logic/factorEvaluators';
import * as reportGenerator from '../logic/reportGenerator';

/**
 * Motor principal que orquesta toda la evaluación de fertilidad.
 * @param userInput Los datos crudos del formulario.
 * @returns Un objeto EvaluationState completo con el pronóstico y el informe.
 */
export function calculateProbability(userInput: UserInput): EvaluationState {
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
    infertility_duration_factor: 1.0,
    pelvic_surgery_factor: 1.0,
    numero_cirugias_pelvicas: userInput.numero_cirugias_pelvicas ?? 0, // <-- Added initialization
    diagnostico_potencial_edad: "", comentario_imc: "", comentario_ciclo: "",
    severidad_sop: "No aplica", comentario_endometriosis: "", comentario_miomas: "",
    comentario_adenomiosis: "", comentario_polipo: "", comentario_hsg: "",
    diagnostico_reserva: "Evaluación no realizada", diagnostico_masculino_detallado: "Normal o sin datos",
    comentario_prolactina: "", comentario_tsh: "", homa_calculado: userInput.homaIr || null, comentario_homa: "",
    datos_faltantes: [], pronostico_categoria: "", pronostico_emoji: "",
    pronostico_frase: "", benchmark_frase: "", recomendaciones_lista: [],
    insights_clinicos: [],
  };

  // 2. Ejecutar las evaluaciones de todos los factores
  const ageBaselineResult = factorEvaluators.evaluateAgeBaseline(evaluation.edad) || {};
  const imcResult = factorEvaluators.evaluateImc(evaluation.imc) || {};
  const cycleResult = factorEvaluators.evaluateMenstrualCycle(evaluation.duracion_ciclo) || {};
  const pcosResult = evaluatePcos(
    evaluation.tiene_sop,
    evaluation.imc ?? 0,
    evaluation.duracion_ciclo ?? 0
  ) || {};
  const endometriosisResult = factorEvaluators.evaluateEndometriosis(evaluation.grado_endometriosis) || {};
  const myomasResult = factorEvaluators.evaluateMyomas(evaluation.tiene_miomas, evaluation.mioma_submucoso, evaluation.mioma_intramural_significativo) || {};
  const adenomyosisResult = factorEvaluators.evaluateAdenomiosis(evaluation.tipo_adenomiosis) || {};
  const polypsResult = factorEvaluators.evaluatePolyps(evaluation.tipo_polipo) || {};
  const hsgResult = factorEvaluators.evaluateHsg(evaluation.resultado_hsg) || {};
  const otbResult = factorEvaluators.evaluateOtb(evaluation.tiene_otb) || {};
  const amhResult = factorEvaluators.evaluateAmh(evaluation.amh) || {};
  const prolactinResult = factorEvaluators.evaluateProlactin(evaluation.prolactina) || {};
  const tshResult = factorEvaluators.evaluateTsh(evaluation.tsh) || {};
  const maleFactorResult = factorEvaluators.evaluateMaleFactor(userInput) || {};

  // 🔧 Nuevos evaluadores corregidos
 const infertilityResult = factorEvaluators.evaluateInfertilityYears(evaluation.duracion_infertilidad ?? 0) || {};
 const pelvicSurgeryResult = factorEvaluators.evaluatePelvicSurgeries(evaluation.numero_cirugias_pelvicas ?? 0) || {};
 const homaResult = factorEvaluators.evaluateHOMA(evaluation.homaIr ?? 0) || {};

  // 3. Actualizar el estado con todos los resultados
  evaluation = {
    ...evaluation,
    ...ageBaselineResult, ...imcResult, ...cycleResult, ...pcosResult,
    ...endometriosisResult, ...myomasResult, ...adenomyosisResult, ...polypsResult,
    ...hsgResult, ...otbResult, ...amhResult, ...prolactinResult, ...tshResult,
    ...homaResult, ...maleFactorResult,
    ...infertilityResult, ...pelvicSurgeryResult,
  };

  // 4. Recopilar todos los factores numéricos para la multiplicación
  const factorsToMultiply = [
    evaluation.imc_factor, evaluation.ciclo_factor, evaluation.sop_factor,
    evaluation.endometriosis_factor, evaluation.mioma_factor, evaluation.adenomiosis_factor,
    evaluation.polipo_factor, evaluation.hsg_factor, evaluation.otb_factor,
    evaluation.amh_factor, evaluation.prolactina_factor, evaluation.tsh_factor,
    evaluation.homa_factor, evaluation.male_factor,
    evaluation.infertility_duration_factor,
    evaluation.pelvic_surgery_factor,
  ].filter(factor => typeof factor === 'number');

  // 5. Calcular la probabilidad final
  const productOfFactors = factorsToMultiply.reduce((acc, factor) => acc * factor, 1);
  evaluation.pronostico_numerico = evaluation.probabilidad_base_edad_num * productOfFactors;

  // 6. Generar textos del informe final
  const prognosisTexts = reportGenerator.generatePrognosisTexts(evaluation);
  const benchmarkText = reportGenerator.generateBenchmarkComparison(evaluation);
  const insights = reportGenerator.collectClinicalInsights(evaluation);

  evaluation = {
    ...evaluation,
    ...prognosisTexts,
    ...benchmarkText,
    ...insights,
  };

  // 7. Retornar el informe completo
  return evaluation;
}
/**
 * Evalúa el factor SOP (Síndrome de Ovario Poliquístico) y su severidad.
 * @param tiene_sop Indica si la paciente tiene diagnóstico de SOP.
 * @param imc Índice de masa corporal de la paciente.
 * @param duracion_ciclo Duración del ciclo menstrual.
 * @returns Un objeto con el factor de SOP, severidad y comentario.
 */
export function evaluatePcos(
  tiene_sop: boolean,
  imc: number,
  duracion_ciclo: number
): {
  sop_factor: number;
  severidad_sop: string;
  comentario_ciclo: string;
} {
  if (!tiene_sop) {
    return {
      sop_factor: 1.0,
      severidad_sop: "No aplica",
      comentario_ciclo: "",
    };
  }

  let severidad = "Leve";
  let factor = 0.9;
  let comentario = "SOP leve, impacto moderado en fertilidad.";

  if (imc >= 30 || duracion_ciclo > 45) {
    severidad = "Severo";
    factor = 0.7;
    comentario = "SOP severo, ciclos muy irregulares o IMC elevado.";
  } else if (imc >= 25 || duracion_ciclo > 35) {
    severidad = "Moderado";
    factor = 0.8;
    comentario = "SOP moderado, ciclos algo irregulares o sobrepeso.";
  }

  return {
    sop_factor: factor,
    severidad_sop: severidad,
    comentario_ciclo: comentario,
  };
}