// src/core/domain/logic/reportGeneratorPremium.ts
import { Report, Diagnostics, Factors, UserInput, ClinicalFinding, HsgResult, MyomaType, PolypType } from '../models';
import { clinicalContentLibraryPremium } from './clinicalContentLibraryPremium'; // Importar la biblioteca PREMIUM

// Extender ClinicalInfo para asegurar que tengamos definition y description
declare module '../models' {
  interface ClinicalInfo {
    definition?: string;
    description?: string;
  }
}

// Tipos para las configuraciones de factores
interface DiagnosticFactorConfig {
  factorKey?: string;
  diagnosticKey?: string;
  map?: { [key: string]: string };
}

interface ConditionalFactorConfig {
  factorKey?: string;
  condition?: (factors: Factors) => boolean;
  keyMap?: string;
}

interface InteractionConfig {
  interactionKey?: string;
  conditions?: (userInput: UserInput, factors: Factors) => boolean;
}

interface DecisionConfig {
  decisionKey?: string;
  conditions?: (userInput: UserInput, factors: Factors) => boolean;
}

// Unión de todos los tipos de configuración posibles
type FindingConfig = DiagnosticFactorConfig | ConditionalFactorConfig | InteractionConfig | DecisionConfig;

// Mapa de configuración para generar los hallazgos clínicos basados en Diagnostics y Factors.
// Las claves aquí deben coincidir con las claves en clinicalContentLibraryPremium.ts
type StringMap = { [key: string]: string };

const findingConfigPremium = [
  // --- Factores individuales ---
  
  { factorKey: 'bmi', diagnosticKey: 'bmiComment', map: {
    'Bajo peso': 'IMC_BAJO',
    'Sobrepeso': 'IMC_SOBREPESO',
    'Obesidad Clase I': 'IMC_OBESIDAD_I',
    'Obesidad Clase II': 'IMC_OBESIDAD_II',
    'Obesidad Clase III': 'IMC_OBESIDAD_III',
  } as StringMap },
  { factorKey: 'amh', diagnosticKey: 'ovarianReserve', map: {
    'Reserva ovárica ligeramente reducida': 'AMH_LIG_REDUCIDA',
    'Baja reserva ovárica': 'AMH_BAJA',
    'Muy baja reserva ovárica': 'AMH_MUY_BAJA',
    'Alta reserva ovárica': 'AMH_ALTA_RESERVA', // Incluso si es óptimo, puede haber info relevante
  } as StringMap },
  { factorKey: 'cycle', diagnosticKey: 'cycleComment', map: {
    'Ciclo irregular leve (variación 7-10 días)': 'CICLO_IRREGULAR_LEVE',
    'Ciclo irregular marcado (>10 días de variación / muy corto/largo)': 'CICLO_IRREGULAR_MARCADO',
  } as StringMap },
  { factorKey: 'tsh', diagnosticKey: 'tshComment', map: {
    'TSH límite superior (2.5-4.0 mUI/L)': 'TSH_LIMITE_SUPERIOR',
    'Hipotiroidismo (TSH > 4.0 mUI/L)': 'TSH_HIPOTIROIDISMO',
  } as StringMap },
  { factorKey: 'prolactin', diagnosticKey: 'prolactinComment', map: {
    'Hiperprolactinemia leve (25-50 ng/mL)': 'PRL_LEVE',
    'Hiperprolactinemia significativa (> 50 ng/mL)': 'PRL_SIGNIFICATIVA',
  } as StringMap },
  { factorKey: 'homa', diagnosticKey: 'homaComment', map: {
    'Leve resistencia a la insulina': 'HOMA_LEVE',
    'Resistencia a la insulina significativa': 'HOMA_SIGNIFICATIVA',
  } as StringMap },
  { factorKey: 'pcos', diagnosticKey: 'pcosSeverity', map: {
    'SOP Leve (ovulación preservada, AMH <6 ng/mL)': 'SOP_LEVE',
    'SOP Moderado (con anovulación o AMH >6 ng/mL)': 'SOP_MODERADO',
    'SOP Severo (anovulación, IMC >30 o HOMA >3.5)': 'SOP_SEVERO',
  } as StringMap },
  { factorKey: 'endometriosis', diagnosticKey: 'endometriosisComment', map: {
    'Endometriosis leve (Grados I-II)': 'ENDOMETRIOSIS_LEVE',
    'Endometriosis severa (Grados III-IV)': 'ENDOMETRIOSIS_SEVERA',
  } as StringMap },
  { factorKey: 'myoma', diagnosticKey: 'myomaComment', map: {
    'Mioma submucoso o intramural distorsionando la cavidad': 'MIOMA_SUBMUCOSO',
    'Mioma intramural grande (≥ 4 cm) sin distorsión de cavidad': 'MIOMA_INTRAMURAL_GRANDE',
    'Mioma subseroso aislado': 'MIOMA_SUBSEROSO',
  } as StringMap },
  { factorKey: 'polyp', diagnosticKey: 'polypComment', map: {
    'Pólipo endometrial pequeño único (< 1 cm)': 'POLIPO_PEQUENO',
    'Pólipo endometrial grande (> 1 cm) o múltiples': 'POLIPO_GRANDE',
    'Pólipo sobre ostium tubárico o recurrente': 'POLIPO_OSTIUM',
  } as StringMap },
  { factorKey: 'adenomyosis', diagnosticKey: 'adenomyosisComment', map: {
    'Adenomiosis focal': 'ADENOMIOSIS_FOCAL',
    'Adenomiosis difusa': 'ADENOMIOSIS_DIFUSA',
  } as StringMap },
  { factorKey: 'hsg', diagnosticKey: 'hsgComment', map: {
    'Obstrucción tubárica unilateral': 'HSG_UNILATERAL',
    'Obstrucción tubárica bilateral': 'HSG_BILATERAL',
    'Malformación uterina relevante (ej. útero septado)': 'HSG_MALFORMACION',
    'Resultado de Histerosalpingografía (HSG) desconocido/no realizado': 'HSG_DESCONOCIDO',
  } as StringMap },
  { factorKey: 'otb', diagnosticKey: undefined, condition: (factors: Factors) => factors.otb === 0.0, keyMap: 'OTB_PRESENTE' },
  { factorKey: 'infertilityDuration', diagnosticKey: 'infertilityDurationComment', map: {
    'Infertilidad 2-4 años': 'INFERTILIDAD_MODERADA',
    'Infertilidad prolongada (≥ 5 años)': 'INFERTILIDAD_PROLONGADA',
  } as StringMap },
  { factorKey: 'pelvicSurgery', diagnosticKey: 'pelvicSurgeryComment', map: {
    '1 cirugía pélvica previa': 'CIRUGIA_PELVICA_UNA',
    '2 o más cirugías pélvicas previas': 'CIRUGIA_PELVICA_MULTIPLE',
  } as StringMap },
  { diagnosticKey: 'tpoAbComment', map: {
    'Anticuerpos TPO Positivos': 'TPOAB_POSITIVO',
  } as StringMap },
  { factorKey: 'male', diagnosticKey: 'maleFactorDetailed', map: {
    'Oligozoospermia (<16 M/mL)': 'MALE_OLIGOZOOSPERMIA',
    'Astenozoospermia (<30% Motilidad Progresiva)': 'MALE_ASTENOZOOSPERMIA',
    'Teratozoospermia (<4% Morfología Normal)': 'MALE_TERATOZOOSPERMIA',
    'Azoospermia': 'MALE_AZOOSPERMIA',
    'Espermatograma incompleto o no evaluado': 'MALE_INCOMPLETO', // Cuando no hay datos
  } as StringMap },

  // --- Interacciones No Lineales (orden de prioridad para mostrar) ---
  { interactionKey: 'INT_EDAD40_FALLO_OVARICO', conditions: (u: UserInput, f: Factors) =>
    u.age >= 40 && (u.amh !== undefined && u.amh < 0.3) && (f.cycle < 1.0)
  },
  { interactionKey: 'INT_ENDO_AVANZADA_MASCULINO', conditions: (u: UserInput, f: Factors) =>
    u.endometriosisGrade >= 3 && (f.male !== undefined && f.male < 1.0)
  },
  { interactionKey: 'INT_AMH_FSH_EDAD_CRITICA', conditions: (u: UserInput, _f: Factors) => // Requiere FSH, si no está en UserInput se desactiva
    (u.amh !== undefined && u.amh < 0.5) && u.age >= 40 /* && u.fsh > 12 (si se añade FSH) */
  },
  { interactionKey: 'INT_OTB_EDAD_AVANZADA', conditions: (u: UserInput, f: Factors) =>
    f.otb === 0.0 && u.age > 37
  },
  { interactionKey: 'INT_ENDO_AVANZADA_EDAD_AMH_BAJA', conditions: (u: UserInput, _f: Factors) =>
    u.endometriosisGrade >= 3 && u.age > 39 && (u.amh !== undefined && u.amh < 1.0)
  },
  { interactionKey: 'INT_SOP_IMC_OBESIDAD_SEVERA', conditions: (u: UserInput, _f: Factors) =>
    u.hasPcos && (u.bmi !== null && u.bmi >= 35)
  },
  { interactionKey: 'INT_SOP_IR', conditions: (u: UserInput, _f: Factors) =>
    u.hasPcos && (u.homaIr !== undefined && u.homaIr >= 3.5)
  },
  { interactionKey: 'INT_ADENOMIOSIS_DIFUSA_EDAD_AVANZADA', conditions: (u: UserInput, _f: Factors) =>
    u.adenomyosisType === 'diffuse' && u.age >= 38
  },
  { interactionKey: 'INT_INFERTILIDAD_LARGA_CIRUGIAS_MULTIPLES', conditions: (u: UserInput, _f: Factors) =>
    (u.infertilityDuration !== undefined && u.infertilityDuration >= 5) && (u.pelvicSurgeriesNumber !== undefined && u.pelvicSurgeriesNumber >= 2)
  },
  { interactionKey: 'INT_TSH_ALTA_TPOAB_POSITIVOS', conditions: (u: UserInput, _f: Factors) =>
    (u.tsh !== undefined && u.tsh > 4.0) && u.tpoAbPositive
  },
  { interactionKey: 'INT_SOP_CICLOS_PRL_ALTAS', conditions: (u: UserInput, _f: Factors) =>
    u.hasPcos && (u.cycleDuration !== undefined && u.cycleDuration > 60) && (u.prolactin !== undefined && u.prolactin > 50)
  },
  { interactionKey: 'INT_AMH_BAJA_TERATOZOOSPERMIA', conditions: (u: UserInput, _f: Factors) =>
    (u.amh !== undefined && u.amh < 1.0) && (u.spermNormalMorphology !== undefined && u.spermNormalMorphology < 2)
  },
  { interactionKey: 'INT_MIOMA_SUBMUCOSO_ENDO_LEVE', conditions: (u: UserInput, _f: Factors) =>
    u.myomaType === MyomaType.Submucosal && (u.endometriosisGrade === 1 || u.endometriosisGrade === 2)
  },
  { interactionKey: 'INT_HSG_UNILATERAL_SEMINAL', conditions: (u: UserInput, f: Factors) =>
    u.hsgResult === HsgResult.Unilateral && (f.male !== undefined && f.male < 1.0)
  },
  { interactionKey: 'INT_POLIPO_PEQUENO_JOVEN_FAVORABLE', conditions: (u: UserInput, _f: Factors) =>
    u.age < 34 && u.polypType === PolypType.Small && (u.cycleDuration !== undefined && u.cycleDuration >= 24 && u.cycleDuration <= 35) && (u.spermNormalMorphology !== undefined && u.spermNormalMorphology >= 4)
  },
  { interactionKey: 'INT_EDAD_AMH_SOP_HOMA_TSH_OPTIMO', conditions: (u: UserInput, _f: Factors) =>
    u.age < 30 && (u.amh !== undefined && u.amh > 5) && u.hasPcos && (u.homaIr !== undefined && u.homaIr < 2) && (u.tsh !== undefined && u.tsh >= 0.5 && u.tsh <= 2.5)
  },
  { interactionKey: 'INT_ENDO_LEVE_AMH_NORMAL_JOVEN', conditions: (u: UserInput, _f: Factors) =>
    (u.endometriosisGrade === 1 || u.endometriosisGrade === 2) && (u.amh !== undefined && u.amh >= 1.5) && u.age < 35
  },
  { interactionKey: 'INT_HSG_UNILATERAL_JOVEN_SEMEN_NORMAL', conditions: (u: UserInput, _f: Factors) =>
    u.hsgResult === HsgResult.Unilateral && u.age < 35 && (u.spermConcentration !== undefined && u.spermConcentration >= 16) && (u.spermProgressiveMotility !== undefined && u.spermProgressiveMotility >= 30)
  },
  { interactionKey: 'INT_PERFIL_HIERESPONDEDOR_JOVEN_SOP_ESTABLE', conditions: (u: UserInput, _f: Factors) =>
    u.age < 32 && (u.amh !== undefined && u.amh > 4.5) && u.hasPcos && (u.spermNormalMorphology !== undefined && u.spermNormalMorphology >= 4) && (u.spermConcentration !== undefined && u.spermConcentration >= 16)
  },

  // --- Decisiones Estratégicas (como hallazgos especiales) ---
  { decisionKey: 'DECISION_FIV_EDAD_AMH_CRITICO', conditions: (u: UserInput, _f: Factors) =>
    u.age >= 40 && (u.amh !== undefined && u.amh < 1.0)
  },
  { decisionKey: 'DECISION_FIV_ENDO_AVANZADA_SEMINAL', conditions: (u: UserInput, f: Factors) =>
    u.endometriosisGrade >= 3 && (f.male !== undefined && f.male < 1.0)
  },
  { decisionKey: 'DECISION_FIV_SOP_METABOLICO_CRITICO', conditions: (u: UserInput, _f: Factors) =>
    u.hasPcos && (u.homaIr !== undefined && u.homaIr >= 4.0) && (u.cycleDuration !== undefined && u.cycleDuration > 60) && (u.prolactin !== undefined && u.prolactin > 50)
  },
  { decisionKey: 'DECISION_FIV_OTB_BILATERAL', conditions: (u: UserInput, f: Factors) =>
    f.otb === 0.0 || f.hsg === 0.0 // OTB o HSG bilateral
  },
  // { decisionKey: 'DECISION_FIV_FALLO_INDUCCION', conditions: (u, f) => { /* Requires state about failed cycles */ } }, // Se activará si tenemos lógica de historial de tratamientos. Por ahora omitido.
];

/**
 * Helper para generar los textos del pronóstico (categoría, emoji y frase).
 * Adaptado para las reglas del módulo Premium.
 */
function getPrognosisTextsPremium(
  numericPrognosis: number,
  factors: Factors,
  userInput: UserInput,
): Pick<Report, 'category' | 'emoji' | 'prognosisPhrase'> {
  const prognosisStr = `${numericPrognosis.toFixed(1)}%`;

  // La OTB anula la posibilidad espontánea y ya fue manejada como 0% en calculationEnginePremium.
  if (factors.otb === 0.0) {
    return {
      category: 'BAJO',
      emoji: '🔴',
      prognosisPhrase: clinicalContentLibraryPremium.OTB_PRESENTE.explanation, // Reutiliza la explicación de OTB
    };
  }
  // Algunas interacciones fijan un pronóstico muy bajo
  if (numericPrognosis <= 3.0) { // Umbral para "riesgo crítico" o fijado bajo
      if (userInput.age >= 40 && (userInput.amh !== undefined && userInput.amh < 0.3) && (userInput.cycleDuration !== undefined && userInput.cycleDuration > 45)) {
          return {
              category: 'BAJO',
              emoji: '🔴',
              prognosisPhrase: clinicalContentLibraryPremium.INT_EDAD40_FALLO_OVARICO.explanation,
          };
      }
      if (userInput.endometriosisGrade >= 3 && (factors.male !== undefined && factors.male < 1.0)) {
          return {
              category: 'BAJO',
              emoji: '🔴',
              prognosisPhrase: clinicalContentLibraryPremium.INT_ENDO_AVANZADA_MASCULINO.explanation,
          };
      }
      // Si la Interacción 15 fijó el pronóstico a 3%
      if (userInput.endometriosisGrade >= 3 && userInput.age > 39 && (userInput.amh !== undefined && userInput.amh < 1.0)) {
        return {
          category: 'BAJO',
          emoji: '🔴',
          prognosisPhrase: clinicalContentLibraryPremium.INT_ENDO_AVANZADA_EDAD_AMH_BAJA.explanation,
        };
      }
  }


  if (numericPrognosis >= 15) {
    return {
      category: 'BUENO',
      emoji: '🟢',
      prognosisPhrase: `¡Tu pronóstico de concepción espontánea por ciclo es BUENO (${prognosisStr})! Tu perfil presenta varios factores favorables.`,
    };
  }
  if (numericPrognosis >= 5) {
    return {
      category: 'MODERADO',
      emoji: '🟡',
      prognosisPhrase: `Tu pronóstico es MODERADO (${prognosisStr}). Hay factores que se pueden optimizar y/o considerar tratamientos de baja complejidad.`,
    };
  }
  return {
    category: 'BAJO',
    emoji: '🔴',
    prognosisPhrase: `Tu pronóstico es BAJO (${prognosisStr}). Se recomienda una evaluación urgente y personalizada por un especialista en reproducción asistida.`,
  };
}

/**
 * Procesa factores individuales que tienen un diagnóstico clave asociado
 */
function processDiagnosticFactors(config: DiagnosticFactorConfig, diagnostics: Diagnostics): ClinicalFinding | null {
  if (!config.diagnosticKey || !config.map) {
    return null;
  }
  const diagComment = diagnostics[config.diagnosticKey as keyof Diagnostics];
  if (typeof diagComment !== 'string' || !config.map[diagComment]) {
    return null;
  }
  const key = config.map[diagComment];
  if (!clinicalContentLibraryPremium[key]) {
    return null;
  }
  return {
    key: key,
    title: config.diagnosticKey.replace(/Comment|Severity|Reserve|Detailed/g, '').replace(/([A-Z])/g, ' $1').trim(),
    definition: clinicalContentLibraryPremium[key].definition ?? clinicalContentLibraryPremium[key].description ?? "",
    justification: clinicalContentLibraryPremium[key].justification ?? "",
    explanation: clinicalContentLibraryPremium[key].explanation,
    recommendations: clinicalContentLibraryPremium[key].recommendations,
    sources: clinicalContentLibraryPremium[key].sources,
  };
}

/**
 * Procesa factores individuales con condición específica
 */
function processConditionalFactors(config: ConditionalFactorConfig, factors: Factors): ClinicalFinding | null {
  if (!config.factorKey || !config.condition || !config.keyMap) {
    return null;
  }
  if (!config.condition(factors)) {
    return null;
  }
  const key = config.keyMap;
  if (!clinicalContentLibraryPremium[key]) {
    return null;
  }
  return {
    key: key,
    title: 'Ligadura de Trompas (OTB)',
    definition: clinicalContentLibraryPremium[key].definition ?? clinicalContentLibraryPremium[key].description ?? "",
    justification: clinicalContentLibraryPremium[key].justification ?? "",
    explanation: clinicalContentLibraryPremium[key].explanation,
    recommendations: clinicalContentLibraryPremium[key].recommendations,
    sources: clinicalContentLibraryPremium[key].sources,
  };
}

/**
 * Obtiene el título para las interacciones no lineales
 */
function getInteractionTitle(key: string): string {
  const interactionTitles: { [key: string]: string } = {
    'INT_EDAD_AMH_BAJA': 'Interacción: Edad Avanzada y Baja Reserva Ovárica',
    'INT_SOP_IR': 'Interacción: SOP y Resistencia a la Insulina Significativa',
    'INT_ENDO_AVANZADA_MASCULINO': 'Interacción: Endometriosis Avanzada y Factor Masculino Anormal',
    'INT_HSG_UNILATERAL_SEMINAL': 'Interacción: Obstrucción Tubárica Unilateral y Alteración Seminal',
    'INT_EDAD40_FALLO_OVARICO': 'Interacción Crítica: Edad ≥40 y Fallo Ovárico Inminente',
    'INT_SOP_IMC_OBESIDAD_SEVERA': 'Interacción: SOP y Obesidad Severa (Fenotipo Metabólico)',
    'INT_MIOMA_SUBMUCOSO_ENDO_LEVE': 'Interacción: Mioma Submucoso y Endometriosis Leve',
    'INT_ADENOMIOSIS_DIFUSA_EDAD_AVANZADA': 'Interacción: Adenomiosis Difusa y Edad Avanzada',
    'INT_INFERTILIDAD_LARGA_CIRUGIAS_MULTIPLES': 'Interacción: Infertilidad Prolongada y Múltiples Cirugías Pélvicas',
    'INT_TSH_ALTA_TPOAB_POSITIVOS': 'Interacción: Hipotiroidismo y Autoinmunidad Tiroidea',
    'INT_AMH_FSH_EDAD_CRITICA': 'Interacción Crítica: Reserva Ovárica y Edad Crítica (con FSH)',
    'INT_OTB_EDAD_AVANZADA': 'Interacción: Ligadura Tubárica y Edad Avanzada',
    'INT_SOP_CICLOS_PRL_ALTAS': 'Interacción: SOP, Ciclos Muy Largos e Hiperprolactinemia',
    'INT_AMH_BAJA_TERATOZOOSPERMIA': 'Interacción: Baja Reserva Ovárica y Teratozoospermia Severa',
    'INT_ENDO_AVANZADA_EDAD_AMH_BAJA': 'Interacción Crítica: Endometriosis Avanzada, Edad y Baja AMH',
    'INT_PERFIL_HIERESPONDEDOR_JOVEN_SOP_ESTABLE': 'Interacción: Perfil Hiperespondedor con SOP Estable',
    'INT_ENDO_LEVE_AMH_NORMAL_JOVEN': 'Interacción: Endometriosis Leve, AMH Normal y Edad Joven',
    'INT_HSG_UNILATERAL_JOVEN_SEMEN_NORMAL': 'Interacción: Obstrucción Unilateral, Edad Joven y Semen Normal',
    'INT_POLIPO_PEQUENO_JOVEN_FAVORABLE': 'Interacción: Pólipo Pequeño en Perfil Joven Favorable',
    'INT_EDAD_AMH_SOP_HOMA_TSH_OPTIMO': 'Interacción: Perfil SOP Joven con Indicadores Óptimos',
  };
  
  return interactionTitles[key] || `Interacción: ${key}`;
}

/**
 * Procesa interacciones no lineales
 */
function processInteractions(config: InteractionConfig, userInput: UserInput, factors: Factors): ClinicalFinding | null {
  if (!config.interactionKey || !config.conditions) {
    return null;
  }
  if (!config.conditions(userInput, factors)) {
    return null;
  }
  const key = config.interactionKey;
  if (!clinicalContentLibraryPremium[key]) {
    return null;
  }
  const interactionTitle = getInteractionTitle(key);
  return {
    key: key,
    title: interactionTitle,
    definition: clinicalContentLibraryPremium[key].definition ?? clinicalContentLibraryPremium[key].description ?? "",
    justification: clinicalContentLibraryPremium[key].justification ?? "",
    explanation: clinicalContentLibraryPremium[key].explanation || "",
    recommendations: clinicalContentLibraryPremium[key].recommendations ?? [],
    sources: clinicalContentLibraryPremium[key].sources ?? [],
  };
}

/**
 * Obtiene el título para las decisiones estratégicas
 */
function getDecisionTitle(key: string): string {
  const decisionTitles: { [key: string]: string } = {
    'DECISION_FIV_EDAD_AMH_CRITICO': 'Decisión Estratégica: FIV por Edad y AMH Críticas',
    'DECISION_FIV_ENDO_AVANZADA_SEMINAL': 'Decisión Estratégica: FIV por Endometriosis Avanzada y Factor Masculino',
    'DECISION_FIV_SOP_METABOLICO_CRITICO': 'Decisión Estratégica: FIV por SOP Metabólico Crítico',
    'DECISION_FIV_OTB_BILATERAL': 'Decisión Estratégica: FIV por Obstrucción Tubaria Bilateral/OTB',
    'DECISION_FIV_FALLO_INDUCCION': 'Decisión Estratégica: FIV por Fallo de Inducción Previa',
  };
  
  return decisionTitles[key] || `Decisión Estratégica: ${key}`;
}

/**
 * Procesa decisiones estratégicas
 */
function processDecisions(config: DecisionConfig, userInput: UserInput, factors: Factors): ClinicalFinding | null {
  if (!config.decisionKey || !config.conditions) {
    return null;
  }
  if (!config.conditions(userInput, factors)) {
    return null;
  }
  const key = config.decisionKey;
  if (!clinicalContentLibraryPremium[key]) {
    return null;
  }
  const decisionTitle = getDecisionTitle(key);
  return {
    key: key,
    title: decisionTitle,
    definition: clinicalContentLibraryPremium[key].definition ?? clinicalContentLibraryPremium[key].description ?? "",
    justification: clinicalContentLibraryPremium[key].justification ?? "",
    explanation: clinicalContentLibraryPremium[key].explanation,
    recommendations: clinicalContentLibraryPremium[key].recommendations,
    sources: clinicalContentLibraryPremium[key].sources,
  };
}

/**
 * Procesa el factor edad
 */
function processAgeFactor(diagnostics: Diagnostics, userInput: UserInput, clinicalInsights: ClinicalFinding[]): void {
  if (!diagnostics.agePotential || diagnostics.agePotential === 'Edad fuera de rango clínico') {
    return;
  }
  let ageKey: string;
  if (userInput.age < 30) ageKey = 'EDAD_OPT';
  else if (userInput.age <= 34) ageKey = 'EDAD_LIG_RED';
  else if (userInput.age <= 37) ageKey = 'EDAD_MOD_RED';
  else if (userInput.age <= 40) ageKey = 'EDAD_ALTO_RIESGO';
  else if (userInput.age <= 42) ageKey = 'EDAD_MUY_ALTO_RIESGO';
  else ageKey = 'EDAD_CRITICA';
  const ageInsightAlreadyPresent = clinicalInsights.some(insight => insight.key.startsWith('INT_') && insight.key.includes('EDAD'));
  if (!ageInsightAlreadyPresent && clinicalContentLibraryPremium[ageKey]) {
    clinicalInsights.unshift({
      key: ageKey,
      title: 'Factor Edad',
      justification: clinicalContentLibraryPremium[ageKey].justification ?? "",
      explanation: clinicalContentLibraryPremium[ageKey].explanation,
      recommendations: clinicalContentLibraryPremium[ageKey].recommendations ?? [],
      sources: clinicalContentLibraryPremium[ageKey].sources,
      definition: clinicalContentLibraryPremium[ageKey].definition ?? clinicalContentLibraryPremium[ageKey].description ?? 'El impacto de la edad en la fertilidad femenina.'
    });
  }
}

/**
 * Genera el texto comparativo de benchmark
 */
function generateBenchmarkData(userInput: UserInput, numericPrognosis: number): {
  ageRange: string;
  benchmarkValue: number;
  comparativa: string;
  benchmarkPhrase: string;
} {
  const ageRange = userInput.age < 30 ? 'Menos de 30' :
               userInput.age <= 34 ? '30-34' :
               userInput.age <= 37 ? '35-37' :
               userInput.age <= 40 ? '38-40' :
               userInput.age <= 42 ? '41-42' : 'Más de 42';

  const benchmarkValues = {
    'Menos de 30': 22.5,
    '30-34': 17.5,
    '35-37': 12.5,
    '38-40': 7.5,
    '41-42': 3.5,
    'Más de 42': 1.0,
  };
  
  const benchmarkValue = benchmarkValues[ageRange as keyof typeof benchmarkValues] || 0.0;
  const diferencia = numericPrognosis - benchmarkValue;
  
  let comparativa: string;
  if (diferencia > 2) comparativa = 'notablemente superior al promedio';
  else if (diferencia < -2) comparativa = 'notablemente inferior al promedio';
  else comparativa = 'similar al promedio';
  
  const benchmarkPhrase = `Tu pronóstico es ${comparativa} para mujeres en el rango de edad ${ageRange} (${benchmarkValue.toFixed(1)}%).`;
  
  return { ageRange, benchmarkValue, comparativa, benchmarkPhrase };
}

/**
 * Genera el objeto Report completo para el MÓDULO PREMIUM,
 * incluyendo todos los textos, hallazgos y pronósticos detallados.
 */
export function generateFinalReportPremium(
  numericPrognosis: number,
  diagnostics: Diagnostics,
  userInput: UserInput,
  factors: Factors,
): Report {
  // Asegúrate de que numericPrognosis sea un número válido para evitar problemas de serialización
  if (isNaN(numericPrognosis) || !isFinite(numericPrognosis)) {
    numericPrognosis = 0; // Valor predeterminado si no es válido
  }
  
  const clinicalInsights: ClinicalFinding[] = [];

  // Procesar todas las configuraciones en findingConfigPremium
  findingConfigPremium.forEach((config: FindingConfig) => {
    let finding = null;
    
    // Procesar cada tipo de configuración en orden
    finding = processDiagnosticFactors(config as DiagnosticFactorConfig, diagnostics) ||
              processConditionalFactors(config as ConditionalFactorConfig, factors) ||
              processInteractions(config as InteractionConfig, userInput, factors) ||
              processDecisions(config as DecisionConfig, userInput, factors);
    
    if (finding) {
      clinicalInsights.push(finding);
    }
  });

  // Procesar el factor edad
  processAgeFactor(diagnostics, userInput, clinicalInsights);

  // Generar textos de benchmark
  const { benchmarkPhrase } = generateBenchmarkData(userInput, numericPrognosis);
  
  // Obtener textos de pronóstico
  const prognosisTexts = getPrognosisTextsPremium(numericPrognosis, factors, userInput);
  
  // Ensamblar y retornar el objeto Report final
  return {
    numericPrognosis,
    ...prognosisTexts,
    benchmarkPhrase,
    clinicalInsights,
  };
}