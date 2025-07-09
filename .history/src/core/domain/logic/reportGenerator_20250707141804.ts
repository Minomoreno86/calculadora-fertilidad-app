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
function getImcRecommendation(evaluation: EvaluationState): string | null {
  if (evaluation.imc_factor < 1.0) {
    return evaluation.comentario_imc === "Bajo peso"
      ? RECOMENDACIONES.IMC_BAJO
      : RECOMENDACIONES.IMC_ALTO;
  }
  return null;
}

function getCicloRecommendation(evaluation: EvaluationState): string | null {
  return evaluation.ciclo_factor < 1.0 ? RECOMENDACIONES.CICLO_IRREGULAR : null;
}

function getSopRecommendation(evaluation: EvaluationState): string | null {
  return evaluation.tiene_sop ? RECOMENDACIONES.SOP : null;
}

function getEndometriosisRecommendation(evaluation: EvaluationState): string | null {
  if (evaluation.grado_endometriosis > 0) {
    return evaluation.grado_endometriosis <= 2
      ? RECOMENDACIONES.ENDO_LEVE
      : RECOMENDACIONES.ENDO_SEVERA;
  }
  return null;
}

function getMiomaRecommendation(evaluation: EvaluationState): string[] {
  const recomendaciones: string[] = [];

  if (evaluation.mioma_factor < 1.0) {
    if (evaluation.myomaType === "submucosal") {
      recomendaciones.push(RECOMENDACIONES.MIOMA_SUBMUCOSO);
    }

    if (evaluation.myomaType === "intramural_large") {
      recomendaciones.push(RECOMENDACIONES.MIOMA_INTRAMURAL);
    }
  }

  return recomendaciones;
}

function getAdenomiosisRecommendation(evaluation: EvaluationState): string | null {
  if (evaluation.adenomiosisType === 'focal') {
  return 'Se detectó adenomiosis focal, lo que puede reducir moderadamente la probabilidad de embarazo espontáneo. Puede considerarse seguimiento y optimización de otros factores antes de tratamientos invasivos.';
  } else if (evaluation.adenomiosisType === 'diffuse') {
    return 'Se detectó adenomiosis difusa, lo que impacta significativamente la probabilidad de embarazo espontáneo. Se recomienda valoración por especialista y considerar estrategias avanzadas si no se logra concepción espontánea en un tiempo razonable.';
  }
  return null; // Si no hay adenomiosis, no se recomienda nada.
}

function getPolipoRecommendation(evaluation: EvaluationState): string | null {
  if (evaluation.tipo_polipo === 'small') {
    return 'Se detectó un pólipo pequeño (< 1 cm). Puede considerarse seguimiento o resección según síntomas.';
  }
  if (evaluation.tipo_polipo === 'large') {
    return 'Se detectó un pólipo grande (≥ 1 cm) o múltiples. Se recomienda resección histeroscópica previa a intentar embarazo.';
  }
  if (evaluation.tipo_polipo === 'ostium') {
    return 'Se detectó un pólipo sobre ostium tubárico. Se recomienda resección histeroscópica, ya que puede obstruir el paso espermático.';
  }
  return null;
}

function getHsgRecommendation(evaluation: EvaluationState): string[] {
  const recomendaciones: string[] = [];
  if (evaluation.hsg_factor < 1.0 && evaluation.hsg_factor > 0.0) {
    if (evaluation.comentario_hsg === "Obstrucción unilateral") recomendaciones.push(RECOMENDACIONES.HSG_UNILATERAL);
    if (evaluation.comentario_hsg === "Alteración cavidad uterina") recomendaciones.push(RECOMENDACIONES.HSG_DEFECTO);
  }
  return recomendaciones;
}

function getAmhRecommendation(evaluation: EvaluationState): string | null {
  return evaluation.amh_factor < 1.0 ? RECOMENDACIONES.AMH_BAJA : null;
}

function getProlactinaRecommendation(evaluation: EvaluationState): string | null {
  return evaluation.prolactina_factor < 1.0 ? RECOMENDACIONES.PRL_ALTA : null;
}

function getTshRecommendation(evaluation: EvaluationState): string | null {
  return evaluation.tsh_factor < 1.0 ? RECOMENDACIONES.TSH_ALTA : null;
}

function getHomaRecommendation(evaluation: EvaluationState): string | null {
  return evaluation.homa_factor < 1.0 ? RECOMENDACIONES.HOMA_ALTO : null;
}

function getMaleFactorRecommendation(evaluation: EvaluationState): string | null {
  return evaluation.male_factor < 1.0 ? RECOMENDACIONES.FACTOR_MASCULINO : null;
}

export const collectClinicalInsights = (
  evaluation: EvaluationState
): Partial<EvaluationState> => {
  const recomendaciones: string[] = [];

  const imcRec = getImcRecommendation(evaluation);
  if (imcRec) recomendaciones.push(imcRec);

  const cicloRec = getCicloRecommendation(evaluation);
  if (cicloRec) recomendaciones.push(cicloRec);

  const sopRec = getSopRecommendation(evaluation);
  if (sopRec) recomendaciones.push(sopRec);

  const endoRec = getEndometriosisRecommendation(evaluation);
  if (endoRec) recomendaciones.push(endoRec);

  recomendaciones.push(...getMiomaRecommendation(evaluation));

  const adenoRec = getAdenomiosisRecommendation(evaluation);
  if (adenoRec) recomendaciones.push(adenoRec);

  const polipoRec = getPolipoRecommendation(evaluation);
  if (polipoRec) recomendaciones.push(polipoRec);

  recomendaciones.push(...getHsgRecommendation(evaluation));

  const amhRec = getAmhRecommendation(evaluation);
  if (amhRec) recomendaciones.push(amhRec);

  const prlRec = getProlactinaRecommendation(evaluation);
  if (prlRec) recomendaciones.push(prlRec);

  const tshRec = getTshRecommendation(evaluation);
  if (tshRec) recomendaciones.push(tshRec);

  const homaRec = getHomaRecommendation(evaluation);
  if (homaRec) recomendaciones.push(homaRec);

  const maleRec = getMaleFactorRecommendation(evaluation);
  if (maleRec) recomendaciones.push(maleRec);

  return { recomendaciones_lista: recomendaciones };
};