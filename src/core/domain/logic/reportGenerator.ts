import { EvaluationState } from '../models';
import { RECOMENDACIONES } from './textLibrary';

// Benchmark de pronóstico mensual por edad (extraído de la lógica de Python)
const BENCHMARK_PRONOSTICO_POR_EDAD: Record<string, number> = {
  "Menos de 30": 22.5,
  "30-34": 17.5,
  "35-37": 12.5,
  "38-40": 7.5,
  "Más de 40": 3.0,
};

/**
 * Genera los textos principales del pronóstico (categoría, emoji y frase).
 */
export const generatePrognosisTexts = (
  evaluation: EvaluationState
): Partial<EvaluationState> => {
  if (evaluation.otb_factor === 0.0) {
    return {
      pronostico_categoria: "REQUIERE TRATAMIENTO",
      pronostico_emoji: "🔴",
      pronostico_frase: "El embarazo espontáneo no es posible debido a la ligadura de trompas (OTB). Consulta la sección de recomendaciones.",
    };
  }
  
  const pronosticoNum = evaluation.pronostico_numerico;
  const pronosticoStr = `${pronosticoNum.toFixed(1)}%`;

  if (pronosticoNum >= 15) {
    return {
      pronostico_categoria: "BUENO",
      pronostico_emoji: "🟢",
      pronostico_frase: `¡Tu pronóstico de concepción espontánea por ciclo es BUENO (${pronosticoStr})!`,
    };
  }
  if (pronosticoNum >= 5) {
    return {
      pronostico_categoria: "MODERADO",
      pronostico_emoji: "🟡",
      pronostico_frase: `Tu pronóstico es MODERADO (${pronosticoStr}). Hay factores que se pueden optimizar.`,
    };
  }
  return {
    pronostico_categoria: "BAJO",
    pronostico_emoji: "🔴",
    pronostico_frase: `Tu pronóstico es BAJO (${pronosticoStr}). Se recomienda una evaluación por un especialista.`,
  };
};

/**
 * Compara el resultado del usuario con el promedio de su grupo de edad.
 */
export const generateBenchmarkComparison = (
  evaluation: EvaluationState
): Partial<EvaluationState> => {
  if (evaluation.otb_factor === 0.0) {
    return { benchmark_frase: "No aplica por OTB." };
  }

  let ageRange: string;
  if (evaluation.edad < 30) ageRange = "Menos de 30";
  else if (evaluation.edad <= 34) ageRange = "30-34";
  else if (evaluation.edad <= 37) ageRange = "35-37";
  else if (evaluation.edad <= 40) ageRange = "38-40";
  else ageRange = "Más de 40";

  const benchmarkValue = BENCHMARK_PRONOSTICO_POR_EDAD[ageRange] || 0.0;
  const diferencia = evaluation.pronostico_numerico - benchmarkValue;

  let comparativa: string;
  if (diferencia > 2) comparativa = "notablemente superior al promedio";
  else if (diferencia < -2) comparativa = "notablemente inferior al promedio";
  else comparativa = "similar al promedio";

  const benchmark_frase = `Tu resultado es **${comparativa}** para tu grupo de edad (${ageRange} años), cuyo pronóstico base es del ${benchmarkValue.toFixed(1)}%.`;
  
  return { benchmark_frase };
};

/**
 * Recopila recomendaciones clínicas basadas en los hallazgos.
 */
export const collectClinicalInsights = (
  evaluation: EvaluationState
): Partial<EvaluationState> => {
  const recomendaciones: string[] = [];

  if (evaluation.imc_factor < 1.0) {
    recomendaciones.push(evaluation.comentario_imc === "Bajo peso" ? RECOMENDACIONES.IMC_BAJO : RECOMENDACIONES.IMC_ALTO);
  }
  if (evaluation.ciclo_factor < 1.0) {
    recomendaciones.push(RECOMENDACIONES.CICLO_IRREGULAR);
  }
  if (evaluation.tiene_sop) {
    recomendaciones.push(RECOMENDACIONES.SOP);
  }
  if (evaluation.grado_endometriosis > 0) {
    recomendaciones.push(evaluation.grado_endometriosis <= 2 ? RECOMENDACIONES.ENDO_LEVE : RECOMENDACIONES.ENDO_SEVERA);
  }
  if (evaluation.mioma_factor < 1.0) {
    if (evaluation.comentario_miomas === "Submucoso") recomendaciones.push(RECOMENDACIONES.MIOMA_SUBMUCOSO);
    if (evaluation.comentario_miomas === "Intramural significativo") recomendaciones.push(RECOMENDACIONES.MIOMA_INTRAMURAL);
  }
  if (evaluation.adenomiosis_factor < 1.0) {
    recomendaciones.push(evaluation.comentario_adenomiosis === "Difusa" ? RECOMENDACIONES.ADENO_DIFUSA : RECOMENDACIONES.ADENO_FOCAL);
  }
  // La recomendación ahora depende de si el usuario seleccionó un tipo de pólipo diferente a 'none'.
  if (evaluation.tipo_polipo && evaluation.tipo_polipo !== 'none') {
    recomendaciones.push(RECOMENDACIONES.POLIPO);
  }
  if (evaluation.hsg_factor < 1.0 && evaluation.hsg_factor > 0.0) {
    if (evaluation.comentario_hsg === "Obstrucción unilateral") recomendaciones.push(RECOMENDACIONES.HSG_UNILATERAL);
    if (evaluation.comentario_hsg === "Alteración cavidad uterina") recomendaciones.push(RECOMENDACIONES.HSG_DEFECTO);
  }
  if (evaluation.amh_factor < 1.0) {
    recomendaciones.push(RECOMENDACIONES.AMH_BAJA);
  }
  if (evaluation.prolactina_factor < 1.0) {
    recomendaciones.push(RECOMENDACIONES.PRL_ALTA);
  }
  if (evaluation.tsh_factor < 1.0) {
    recomendaciones.push(RECOMENDACIONES.TSH_ALTA);
  }
  if (evaluation.homa_factor < 1.0) {
    recomendaciones.push(RECOMENDACIONES.HOMA_ALTO);
  }
  if (evaluation.male_factor < 1.0) {
    recomendaciones.push(RECOMENDACIONES.FACTOR_MASCULINO);
  }

  return { recomendaciones_lista: recomendaciones };
};