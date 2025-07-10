import { Report, Diagnostics, Factors, UserInput, ClinicalFinding } from '../models';
import { clinicalContentLibrary } from './clinicalContentLibrary';

// Mapa de configuración para generar los hallazgos clínicos.
const findingConfig = [
  { factor: 'bmi', key: (d: Diagnostics) => d.bmiComment === "Bajo peso" ? "IMC_BAJO" : "IMC_ALTO", title: "Índice de Masa Corporal" },
  { factor: 'homa', key: "HOMA_ALTO", title: "Resistencia a la Insulina (HOMA-IR)" },
  { factor: 'amh', key: "AMH_BAJA", title: "Reserva Ovárica (AMH)" },
  { factor: 'cycle', key: "CICLO_IRREGULAR", title: "Ciclo Menstrual" },
  { factor: 'tsh', key: "TSH_ALTA", title: "Función Tiroidea (TSH)" },
  { factor: 'prolactin', key: "PRL_ALTA", title: "Hiperprolactinemia" },
  { factor: 'pcos', key: "SOP", title: "Síndrome de Ovario Poliquístico" },
  { factor: 'endometriosis', key: "ENDOMETRIOSIS", title: "Endometriosis" },
  { factor: 'myoma', key: "MIOMAS", title: "Miomas Uterinos" },
  { factor: 'polyp', key: "POLIPOS", title: "Pólipos Endometriales" },
  { factor: 'adenomyosis', key: "ADENOMIOSIS", title: "Adenomiosis" },
  { factor: 'hsg', key: "OBSTRUCCION_TUBARICA", title: "Permeabilidad Tubárica (HSG)" },
  { factor: 'pelvicSurgery', key: "CIRUGIA_PELVICA", title: "Cirugías Pélvicas Previas" },
  { factor: 'infertilityDuration', key: "DURACION_INFERTILIDAD", title: "Duración de la Infertilidad" },
  { factor: 'male', key: "FACTOR_MASCULINO", title: "Factor Masculino" },
];

/**
 * Helper para generar los textos del pronóstico (categoría, emoji y frase).
 */
function getPrognosisTexts(numericPrognosis: number, factors: Factors): Pick<Report, 'category' | 'emoji' | 'prognosisPhrase'> {
  const prognosisStr = `${numericPrognosis.toFixed(1)}%`;

  if (factors.otb === 0.0) {
    return { category: "BAJO", emoji: "🔴", prognosisPhrase: "El embarazo espontáneo no es posible debido a la ligadura de trompas (OTB)." };
  }
  if (numericPrognosis >= 15) {
    return { category: "BUENO", emoji: "🟢", prognosisPhrase: `¡Tu pronóstico de concepción espontánea por ciclo es BUENO (${prognosisStr})!` };
  }
  if (numericPrognosis >= 5) {
    return { category: "MODERADO", emoji: "🟡", prognosisPhrase: `Tu pronóstico es MODERADO (${prognosisStr}). Hay factores que se pueden optimizar.` };
  }
  return { category: "BAJO", emoji: "🔴", prognosisPhrase: `Tu pronóstico es BAJO (${prognosisStr}). Se recomienda una evaluación por un especialista.` };
}

/**
 * Genera el objeto Report completo, incluyendo todos los textos, hallazgos y pronósticos.
 */
export function generateFinalReport(
  numericPrognosis: number,
  diagnostics: Diagnostics,
  input: UserInput,
  factors: Factors
): Report {
  // 1. Construir la lista de Hallazgos Clínicos usando el mapa de configuración.
  const clinicalInsights = findingConfig.reduce((acc: ClinicalFinding[], config) => {
    const factorValue = factors[config.factor as keyof Factors];
    if (factorValue < 1.0) {
      const key = typeof config.key === 'function' ? config.key(diagnostics) : config.key;
      if (clinicalContentLibrary[key]) {
        acc.push({
          key,
          title: config.title,
          ...clinicalContentLibrary[key],
        });
      }
    }
    return acc;
  }, []);

  // 2. Generar textos de pronóstico y benchmark usando helpers.
  const prognosisTexts = getPrognosisTexts(numericPrognosis, factors);
  
  // Lógica de Benchmark (se mantiene aquí por simplicidad, pero también podría extraerse).
  let ageRange: string;
  if (input.age < 30) ageRange = "Menos de 30"; else if (input.age <= 34) ageRange = "30-34"; else if (input.age <= 37) ageRange = "35-37"; else if (input.age <= 40) ageRange = "38-40"; else ageRange = "Más de 40";
  const benchmarkValue = { "Menos de 30": 22.5, "30-34": 17.5, "35-37": 12.5, "38-40": 7.5, "Más de 40": 3.0 }[ageRange] || 0.0;
  const diferencia = numericPrognosis - benchmarkValue;
  let comparativa: string;
  if (diferencia > 2) comparativa = "notablemente superior al promedio"; else if (diferencia < -2) comparativa = "notablemente inferior al promedio"; else comparativa = "similar al promedio";
  let benchmarkPhrase = `Tu resultado es **${comparativa}** para tu grupo de edad (${ageRange} años), cuyo pronóstico base es del ${benchmarkValue.toFixed(1)}%.`;
  if (factors.otb === 0.0) { benchmarkPhrase = "Comparación no aplicable por ligadura de trompas (OTB)."; }

  // 3. Ensamblar y retornar el objeto Report final.
  return {
    numericPrognosis,
    ...prognosisTexts,
    benchmarkPhrase,
    clinicalInsights,
  };
}