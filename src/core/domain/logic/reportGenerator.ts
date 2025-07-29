
import { Report, Diagnostics, Factors, UserInput, ClinicalFinding, MyomaType, PolypType } from '../models';
import { clinicalContentLibrary } from './clinicalContentLibrary';

/**
 * 🔧 FUNCIÓN HELPER PARA MAPEAR TIPOS DE MIOMAS A CLAVES ESPECÍFICAS
 */
function getMyomaKey(input: UserInput): string {
  switch (input.myomaType) {
    case MyomaType.Submucosal:
      return 'MIOMA_SUBMUCOSO';
    case MyomaType.IntramuralLarge:
      return 'MIOMA_INTRAMURAL_GRANDE';
    case MyomaType.Subserosal:
      return 'MIOMA_SUBSEROSO';
    case MyomaType.None:
    default:
      return 'MIOMA_AUSENTE';
  }
}

/**
 * 🔧 FUNCIÓN HELPER PARA MAPEAR TIPOS DE PÓLIPOS A CLAVES ESPECÍFICAS
 */
function getPolypKey(input: UserInput): string {
  switch (input.polypType) {
    case PolypType.Small:
      return 'POLIPO_PEQUENO';
    case PolypType.Large:
      return 'POLIPO_GRANDE';
    case PolypType.Ostium:
      return 'POLIPO_OSTIUM';
    case PolypType.None:
    default:
      return 'POLIPO_AUSENTE';
  }
}

// Mapa de configuración para generar los hallazgos clínicos.
const findingConfig = [
  {
    factor: 'bmi',
    key: (d: Diagnostics, _input: UserInput) => (d.bmiComment === 'Bajo peso' ? 'IMC_BAJO' : 'IMC_ALTO'),
    title: 'Índice de Masa Corporal',
  },
  { factor: 'homa', key: 'HOMA_ALTO', title: 'Resistencia a la Insulina (HOMA-IR)' },
  { factor: 'amh', key: 'AMH_BAJA', title: 'Reserva Ovárica (AMH)' },
  { factor: 'cycle', key: 'CICLO_IRREGULAR', title: 'Ciclo Menstrual' },
  { factor: 'tsh', key: 'TSH_ALTA', title: 'Función Tiroidea (TSH)' },
  { factor: 'prolactin', key: 'PRL_ALTA', title: 'Hiperprolactinemia' },
  { factor: 'pcos', key: 'SOP', title: 'Síndrome de Ovario Poliquístico' },
  { factor: 'endometriosis', key: 'ENDOMETRIOSIS', title: 'Endometriosis' },
  { 
    factor: 'myoma', 
    key: (d: Diagnostics, input: UserInput) => getMyomaKey(input), 
    title: 'Miomas Uterinos' 
  },
  { 
    factor: 'polyp', 
    key: (d: Diagnostics, input: UserInput) => getPolypKey(input), 
    title: 'Pólipos Endometriales' 
  },
  { factor: 'adenomyosis', key: 'ADENOMIOSIS', title: 'Adenomiosis' },
  { factor: 'hsg', key: 'OBSTRUCCION_TUBARICA', title: 'Permeabilidad Tubárica (HSG)' },
  { factor: 'pelvicSurgery', key: 'CIRUGIA_PELVICA', title: 'Cirugías Pélvicas Previas' },
  { factor: 'infertilityDuration', key: 'DURACION_INFERTILIDAD', title: 'Duración de la Infertilidad' },
  { factor: 'male', key: 'FACTOR_MASCULINO', title: 'Factor Masculino' },
];

/**
 * Helper para generar los textos del pronóstico (categoría, emoji y frase).
 */
function generateCategoryAndPhrase(
  numericPrognosis: number,
  factors: Factors,
): Pick<Report, 'category' | 'emoji' | 'prognosisPhrase'> {
  const prognosisStr = `${numericPrognosis.toFixed(1)}%`;
  
  // 📊 CÁLCULO PROBABILIDAD A 12 MESES como en tests
  // Fórmula: 1 - (1 - probabilidad_mensual)^12
  const monthlyProbabilityDecimal = numericPrognosis / 100;
  const probability12Months = (1 - Math.pow(1 - monthlyProbabilityDecimal, 12)) * 100;
  const probability12MonthsStr = `${probability12Months.toFixed(1)}%`;

  if (factors.otb < 0.001) {
    return {
      category: 'BAJO',
      emoji: '🔴',
      prognosisPhrase: 'El embarazo espontáneo no es posible debido a la ligadura de trompas (OTB).',
    };
  }
  if (numericPrognosis >= 15) {
    return {
      category: 'BUENO',
      emoji: '🟢',
      prognosisPhrase: `¡Tu pronóstico es BUENO! ${prognosisStr} por ciclo mensual (${probability12MonthsStr} en 12 meses).`,
    };
  }
  if (numericPrognosis >= 5) {
    return {
      category: 'MODERADO',
      emoji: '🟡',
      prognosisPhrase: `Tu pronóstico es MODERADO: ${prognosisStr} por ciclo mensual (${probability12MonthsStr} en 12 meses). Hay factores que se pueden optimizar.`,
    };
  }
  return {
    category: 'BAJO',
    emoji: '🔴',
    prognosisPhrase: `Tu pronóstico es BAJO: ${prognosisStr} por ciclo mensual (${probability12MonthsStr} en 12 meses). Se recomienda evaluación especializada.`,
  };
}

/**
 * Genera el objeto Report completo, incluyendo todos los textos, hallazgos y pronósticos.
 */
export function generateFinalReport(
  numericPrognosis: number,
  diagnostics: Diagnostics,
  input: UserInput,
  factors: Factors,
): Report {
  // 1. Construir la lista de Hallazgos Clínicos usando el mapa de configuración.
  const clinicalInsights = findingConfig.reduce((acc: ClinicalFinding[], config) => {
    const factorValue = factors[config.factor as keyof Factors];
    // Verificar que factorValue existe y es menor a 1.0 (factor presente y anormal)
    if (factorValue !== undefined && typeof factorValue === 'number' && factorValue < 1.0) {
      const key = typeof config.key === 'function' ? config.key(diagnostics, input) : config.key;
      if (clinicalContentLibrary[key]) {
        acc.push({
          key,
          title: config.title,
          // Retrocompatibilidad: usar explanation como definition si no existe definition
          definition: clinicalContentLibrary[key].definition || clinicalContentLibrary[key].explanation,
          justification: clinicalContentLibrary[key].justification || 'Basado en evidencia clínica',
          recommendations: clinicalContentLibrary[key].recommendations,
        });
      }
    }
    return acc;
  }, []);

  // 2. Generar textos de pronóstico y benchmark usando helpers.
  const prognosisTexts = generateCategoryAndPhrase(numericPrognosis, factors);

  // Lógica de Benchmark (se mantiene aquí por simplicidad, pero también podría extraerse).
  let ageRange: string;
  if (input.age < 30) ageRange = 'Menos de 30';
  else if (input.age <= 34) ageRange = '30-34';
  else if (input.age <= 37) ageRange = '35-37';
  else if (input.age <= 40) ageRange = '38-40';
  else ageRange = 'Más de 40';
  const benchmarkValue =
    { 'Menos de 30': 22.5, '30-34': 17.5, '35-37': 12.5, '38-40': 7.5, 'Más de 40': 3.0 }[ageRange] || 0.0;
  const diferencia = numericPrognosis - benchmarkValue;
  let comparativa: string;
  if (diferencia > 2) comparativa = 'notablemente superior al promedio';
  else if (diferencia < -2) comparativa = 'notablemente inferior al promedio';
  else comparativa = 'similar al promedio';
  let benchmarkPhrase = `Tu resultado es **${comparativa}** para tu grupo de edad (${ageRange} años), cuyo pronóstico base es del ${benchmarkValue.toFixed(1)}%.`;
  if (factors.otb < 0.001) {
    benchmarkPhrase = 'Comparación no aplicable por ligadura de trompas (OTB).';
  }

  // 3. Ensamblar y retornar el objeto Report final.
  return {
    numericPrognosis,
    ...prognosisTexts,
    benchmarkPhrase,
    clinicalInsights,
  };
}
