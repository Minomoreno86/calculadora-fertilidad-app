import { UserInput, Factors, Diagnostics, Report } from '../models';
import { RECOMENDACIONES } from './textLibrary'; // Se asume que este archivo existe con las constantes de texto.

// --- FUNCIONES AUXILIARES CORREGIDAS ---

function getImcRecommendation(factors: Factors, diagnostics: Diagnostics): string | null {
  if (factors.bmi < 1.0) {
    return diagnostics.bmiComment === "Bajo peso" ? RECOMENDACIONES.IMC_BAJO : RECOMENDACIONES.IMC_ALTO;
  }
  return null;
}

function getCycleRecommendation(factors: Factors): string | null {
  return factors.cycle < 1.0 ? RECOMENDACIONES.CICLO_IRREGULAR : null;
}

function getPcosRecommendation(input: UserInput): string | null {
  return input.hasPcos ? RECOMENDACIONES.SOP : null;
}

function getEndometriosisRecommendation(input: UserInput): string | null {
  if (input.endometriosisGrade > 0) {
    return input.endometriosisGrade <= 2 ? RECOMENDACIONES.ENDO_LEVE : RECOMENDACIONES.ENDO_SEVERA;
  }
  return null;
}

function getMyomaRecommendation(input: UserInput, factors: Factors): string[] {
  const recommendations: string[] = [];
  if (factors.myoma < 1.0) {
    if (input.myomaType === "submucosal") recommendations.push(RECOMENDACIONES.MIOMA_SUBMUCOSO);
    if (input.myomaType === "intramural_large") recommendations.push(RECOMENDACIONES.MIOMA_INTRAMURAL);
  }
  return recommendations;
}

function getAdenomyosisRecommendation(input: UserInput): string | null {
    if (input.adenomyosisType === 'focal') {
        return 'Se detectó adenomiosis focal, lo que puede reducir moderadamente la probabilidad de embarazo espontáneo.';
    } else if (input.adenomyosisType === 'diffuse') {
        return 'Se detectó adenomiosis difusa, lo que impacta significativamente la probabilidad de embarazo espontáneo. Se recomienda valoración por especialista.';
    }
    return null;
}

function getPolypRecommendation(input: UserInput): string | null {
  return input.polypType !== 'none' ? RECOMENDACIONES.POLIPO : null;
}

function getHsgRecommendation(factors: Factors, diagnostics: Diagnostics): string[] {
  const recommendations: string[] = [];
  if (factors.hsg < 1.0 && factors.hsg > 0.0) {
    if (diagnostics.hsgComment === "Obstrucción tubárica unilateral") recommendations.push(RECOMENDACIONES.HSG_UNILATERAL);
    if (diagnostics.hsgComment === "Alteración de la cavidad uterina") recommendations.push(RECOMENDACIONES.HSG_DEFECTO);
  }
  return recommendations;
}

function getAmhRecommendation(factors: Factors): string | null {
  return factors.amh < 1.0 ? RECOMENDACIONES.AMH_BAJA : null;
}

function getProlactinRecommendation(factors: Factors): string | null {
  return factors.prolactin < 1.0 ? RECOMENDACIONES.PRL_ALTA : null;
}

function getTshRecommendation(factors: Factors): string | null {
  return factors.tsh < 1.0 ? RECOMENDACIONES.TSH_ALTA : null;
}

function getHomaRecommendation(factors: Factors): string | null {
  return factors.homa < 1.0 ? RECOMENDACIONES.HOMA_ALTO : null;
}

function getMaleFactorRecommendation(factors: Factors): string | null {
  return factors.male < 1.0 ? RECOMENDACIONES.FACTOR_MASCULINO : null;
}

// --- FUNCIÓN PRINCIPAL UNIFICADA Y COMPLETA ---

const BENCHMARK_PRONOSTICO_POR_EDAD: Record<string, number> = {
  "Menos de 30": 22.5,
  "30-34": 17.5,
  "35-37": 12.5,
  "38-40": 7.5,
  "Más de 40": 3.0,
};

export function generateFinalReport(
  numericPrognosis: number,
  diagnostics: Diagnostics,
  input: UserInput,
  factors: Factors
): Report {
  const report: Partial<Report> = {};

  // 1. Generar textos de pronóstico
  const prognosisStr = `${numericPrognosis.toFixed(1)}%`;
  if (factors.otb === 0.0) {
    report.category = "BAJO";
    report.emoji = "🔴";
    report.prognosisPhrase = "El embarazo espontáneo no es posible debido a la ligadura de trompas (OTB).";
  } else if (numericPrognosis >= 15) {
    report.category = "BUENO";
    report.emoji = "🟢";
    report.prognosisPhrase = `Tu pronóstico de concepción espontánea por ciclo es BUENO (${prognosisStr}).`;
  } else if (numericPrognosis >= 5) {
    report.category = "MODERADO";
    report.emoji = "🟡";
    report.prognosisPhrase = `Tu pronóstico es MODERADO (${prognosisStr}). Hay factores que se pueden optimizar.`;
  } else {
    report.category = "BAJO";
    report.emoji = "🔴";
    report.prognosisPhrase = `Tu pronóstico es BAJO (${prognosisStr}). Se recomienda una evaluación por un especialista.`;
  }

  // 2. Generar comparación con Benchmark
  let ageRange: string;
  if (input.age < 30) ageRange = "Menos de 30";
  else if (input.age <= 34) ageRange = "30-34";
  else if (input.age <= 37) ageRange = "35-37";
  else if (input.age <= 40) ageRange = "38-40";
  else ageRange = "Más de 40";
  const benchmarkValue = BENCHMARK_PRONOSTICO_POR_EDAD[ageRange] || 0.0;
  const diferencia = numericPrognosis - benchmarkValue;
  let comparativa: string;
  if (diferencia > 2) comparativa = "notablemente superior al promedio";
  else if (diferencia < -2) comparativa = "notablemente inferior al promedio";
  else comparativa = "similar al promedio";
  report.benchmarkPhrase = `Tu resultado es **${comparativa}** para tu grupo de edad (${ageRange} años), cuyo pronóstico base es del ${benchmarkValue.toFixed(1)}%.`;
  if (factors.otb === 0.0) {
    report.benchmarkPhrase = "Comparación no aplicable por ligadura de trompas (OTB).";
  }

  // 3. Recopilar TODAS las recomendaciones
  const recommendations: string[] = [];
  const addRecommendation = (rec: string | null) => rec && recommendations.push(rec);
  const addRecommendations = (recs: string[]) => recs.length > 0 && recommendations.push(...recs);
  
  addRecommendation(getImcRecommendation(factors, diagnostics));
  addRecommendation(getCycleRecommendation(factors));
  addRecommendation(getPcosRecommendation(input));
  addRecommendation(getEndometriosisRecommendation(input));
  addRecommendations(getMyomaRecommendation(input, factors));
  addRecommendation(getAdenomyosisRecommendation(input));
  addRecommendation(getPolypRecommendation(input));
  addRecommendations(getHsgRecommendation(factors, diagnostics));
  addRecommendation(getAmhRecommendation(factors));
  addRecommendation(getProlactinRecommendation(factors));
  addRecommendation(getTshRecommendation(factors));
  addRecommendation(getHomaRecommendation(factors));
  addRecommendation(getMaleFactorRecommendation(factors));
  report.recommendations = recommendations;

  // 4. Ensamblar y retornar el objeto Report completo
  report.numericPrognosis = numericPrognosis;
  report.clinicalInsights = []; // Este campo se puede usar en el futuro para insights más complejos.

  return report as Report;
}