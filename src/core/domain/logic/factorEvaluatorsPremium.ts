// src/core/domain/logic/factorEvaluatorsPremium.ts
import { UserInput, MyomaType, AdenomyosisType, PolypType, HsgResult, Factors, Diagnostics } from '../models';

type PartialEvaluation = {
  factors?: Partial<Factors>;
  diagnostics?: Partial<Diagnostics>;
};

// ===================================================================
// EVALUADORES DE FACTORES INDIVIDUALES (MÓDULO PREMIUM)
// Basado en "PARAMETROS FASE 1.docx" y "REGLAS DE INTERACCION NO LINEAL.docx"
// ===================================================================

/**
 * Evalúa la edad de la paciente y asigna un factor de probabilidad base.
 * Ref: "PARAMETROS FASE 1.docx - 1. Edad"
 */
export const evaluateAgePremium = (age: number): PartialEvaluation => {
  let baseAgeProbability: number;
  let agePotential: string;

  if (age < 30) {
    baseAgeProbability = 22.5; // Aproximación, considera el pico de fertilidad.
    agePotential = 'Fertilidad óptima';
  } else if (age <= 34) {
    baseAgeProbability = 17.5; // Ligeramente reducido. Factor de ajuste 0.9 aplicado sobre un base ideal de 20-25%
    agePotential = 'Buena fertilidad';
  } else if (age <= 37) {
    baseAgeProbability = 12.5; // Moderadamente reducido. Factor de ajuste 0.75
    agePotential = 'Fecundidad moderadamente reducida';
  } else if (age <= 40) {
    baseAgeProbability = 7.5; // Alto riesgo. Factor de ajuste 0.5
    agePotential = 'Fecundidad en descenso significativo';
  } else if (age <= 42) {
    baseAgeProbability = 3.5; // Muy alto riesgo. Factor de ajuste 0.35
    agePotential = 'Baja probabilidad de embarazo';
  } else if (age >= 43) {
    baseAgeProbability = 1.0; // Riesgo crítico. Factor de ajuste 0.2
    agePotential = 'Probabilidad muy baja, considerar ovodonación';
  } else {
    baseAgeProbability = 0; // Edad fuera de rango válido.
    agePotential = 'Edad fuera de rango clínico';
  }
  return { factors: { baseAgeProbability }, diagnostics: { agePotential } };
};

/**
 * Evalúa el IMC y asigna un factor de ajuste.
 * Ref: "PARAMETROS FASE 1.docx - 2. Índice de Masa Corporal (IMC)"
 */
export const evaluateBmiPremium = (bmi: number | null): PartialEvaluation => {
  if (bmi === null || bmi <= 0) return { factors: { bmi: 1.0 }, diagnostics: { bmiComment: 'Datos de IMC no válidos' } }; // Default to neutral if invalid

  if (bmi < 18.5) {
    return { factors: { bmi: 0.85 }, diagnostics: { bmiComment: 'Bajo peso' } };
  } else if (bmi <= 24.9) {
    return { factors: { bmi: 1.0 }, diagnostics: { bmiComment: 'Peso normal' } };
  } else if (bmi <= 29.9) {
    return { factors: { bmi: 0.9 }, diagnostics: { bmiComment: 'Sobrepeso' } };
  } else if (bmi <= 34.9) {
    return { factors: { bmi: 0.75 }, diagnostics: { bmiComment: 'Obesidad Clase I' } };
  } else if (bmi <= 39.9) {
    return { factors: { bmi: 0.6 }, diagnostics: { bmiComment: 'Obesidad Clase II' } };
  } else {
    // bmi >= 40
    return { factors: { bmi: 0.4 }, diagnostics: { bmiComment: 'Obesidad Clase III' } };
  }
};

/**
 * Evalúa la AMH y asigna un factor de ajuste.
 * Ref: "PARAMETROS FASE 1.docx - 3. Hormona Antimülleriana (AMH)"
 */
export const evaluateAmhPremium = (amh?: number): PartialEvaluation => {
  if (amh === undefined || amh < 0) return { factors: { amh: 1.0 }, diagnostics: { ovarianReserve: 'Hormona Antimülleriana (AMH) no evaluada' } }; // Default to neutral

  if (amh > 4.0) {
    return { factors: { amh: 1.0 }, diagnostics: { ovarianReserve: 'Alta reserva ovárica' } }; // Note: DFCA sugiere 0.95 if SOP. This interaction will be handled in calculationEnginePremium.
  } else if (amh >= 2.0) {
    return { factors: { amh: 1.0 }, diagnostics: { ovarianReserve: 'Reserva ovárica normal/adecuada' } };
  } else if (amh >= 1.0) {
    return { factors: { amh: 0.85 }, diagnostics: { ovarianReserve: 'Reserva ovárica ligeramente reducida' } };
  } else if (amh >= 0.5) {
    return { factors: { amh: 0.6 }, diagnostics: { ovarianReserve: 'Baja reserva ovárica' } };
  } else {
    // amh < 0.5
    return { factors: { amh: 0.3 }, diagnostics: { ovarianReserve: 'Muy baja reserva ovárica' } };
  }
};

/**
 * Evalúa el tipo de mioma y asigna un factor de ajuste.
 * Ref: "PARAMETROS FASE 1.docx - 7. Miomatosis Uterina"
 */
export const evaluateMyomasPremium = (type: MyomaType): PartialEvaluation => {
  let myomaComment: string;
  let factor: number;

  switch (type) {
    case MyomaType.Submucosal:
      myomaComment = 'Mioma submucoso o intramural distorsionando la cavidad';
      factor = 0.65;
      break;
    case MyomaType.IntramuralLarge: // Asumimos que IntramuralLarge en enum mapea a >=4cm sin distorsión
      myomaComment = 'Mioma intramural grande (≥ 4 cm) sin distorsión de cavidad';
      factor = 0.75;
      break;
    case MyomaType.Subserosal:
      myomaComment = 'Mioma subseroso aislado';
      factor = 0.95;
      break;
    case MyomaType.None:
    default:
      myomaComment = 'Sin miomas relevantes';
      factor = 1.0;
      break;
  }
  return { factors: { myoma: factor }, diagnostics: { myomaComment } };
};

/**
 * Evalúa el tipo de pólipo y asigna un factor de ajuste.
 * Ref: "PARAMETROS FASE 1.docx - 8. Pólipos Endometriales"
 */
export const evaluatePolypsPremium = (type: PolypType): PartialEvaluation => {
  let polypComment: string;
  let factor: number;

  switch (type) {
    case PolypType.Small:
      polypComment = 'Pólipo endometrial pequeño único (< 1 cm)';
      factor = 0.95;
      break;
    case PolypType.Large:
      polypComment = 'Pólipo endometrial grande (> 1 cm) o múltiples';
      factor = 0.85;
      break;
    case PolypType.Ostium:
      polypComment = 'Pólipo sobre ostium tubárico o recurrente';
      factor = 0.80;
      break;
    case PolypType.None:
    default:
      polypComment = 'Sin pólipos relevantes';
      factor = 1.0;
      break;
  }
  return { factors: { polyp: factor }, diagnostics: { polypComment } };
};

/**
 * Evalúa el tipo de adenomiosis y asigna un factor de ajuste.
 * Ref: "PARAMETROS FASE 1.docx - 9. Adenomiosis"
 */
export const evaluateAdenomyosisPremium = (type: AdenomyosisType): PartialEvaluation => {
  let adenomyosisComment: string;
  let factor: number;

  switch (type) {
    case AdenomyosisType.Focal:
      adenomyosisComment = 'Adenomiosis focal';
      factor = 0.80;
      break;
    case AdenomyosisType.Diffuse:
      adenomyosisComment = 'Adenomiosis difusa';
      factor = 0.60;
      break;
    case AdenomyosisType.None:
    default:
      adenomyosisComment = 'Sin adenomiosis';
      factor = 1.0;
      break;
  }
  return { factors: { adenomyosis: factor }, diagnostics: { adenomyosisComment } };
};

/**
 * Evalúa el grado de endometriosis y asigna un factor de ajuste.
 * Ref: "PARAMETROS FASE 1.docx - 6. Endometriosis"
 */
export function evaluateEndometriosisPremium(endometriosisGrade: number): PartialEvaluation {
  let endometriosisComment: string;
  let factor: number;

  if (endometriosisGrade === 0) {
    endometriosisComment = 'Sin endometriosis';
    factor = 1.0;
  } else if (endometriosisGrade >= 1 && endometriosisGrade <= 2) {
    endometriosisComment = 'Endometriosis leve (Grados I-II)';
    factor = 0.85;
  } else if (endometriosisGrade >= 3 && endometriosisGrade <= 4) {
    endometriosisComment = 'Endometriosis severa (Grados III-IV)';
    factor = 0.6;
  } else {
    // Default o grado inválido
    endometriosisComment = 'Grado de endometriosis no especificado/válido';
    factor = 1.0; // Valor neutral por defecto
  }
  return { factors: { endometriosis: factor }, diagnostics: { endometriosisComment } };
};

/**
 * Evalúa la duración del ciclo menstrual y asigna un factor de ajuste.
 * Ref: "PARAMETROS FASE 1.docx - Duración del Ciclo Menstrual"
 */
export const evaluateCyclePremium = (cycleDuration?: number): PartialEvaluation => {
  let cycleComment: string;
  let factor: number;

  if (cycleDuration === undefined || cycleDuration <= 0) {
    cycleComment = 'Duración del ciclo no evaluada';
    factor = 1.0; // Neutral default
  } else if (cycleDuration >= 24 && cycleDuration <= 35) {
    cycleComment = 'Ciclo regular (24-35 días)';
    factor = 1.0;
  } else if (
    (cycleDuration >= 21 && cycleDuration < 24) ||
    (cycleDuration > 35 && cycleDuration <= 45)
  ) {
    cycleComment = 'Ciclo irregular leve (variación 7-10 días)';
    factor = 0.85;
  } else {
    // cycleDuration < 21 || cycleDuration > 45
    cycleComment = 'Ciclo irregular marcado (>10 días de variación / muy corto/largo)';
    factor = 0.6;
  }
  return { factors: { cycle: factor }, diagnostics: { cycleComment } };
};

/**
 * Evalúa la presencia de SOP y asigna un factor de ajuste.
 * Nota: La clasificación por severidad se basa en fenotipo estimado, que en el DFCA combina IMC y HOMA.
 * La interacción específica SOP + IR se manejará en el motor de cálculo.
 * Ref: "PARAMETROS FASE 1.docx - 5. Síndrome de Ovario Poliquístico (SOP)"
 */
export const evaluatePcosPremium = (
  hasPcos: boolean,
  amh?: number,
  bmi?: number | null,
  homaIr?: number | null,
): PartialEvaluation => {
  if (!hasPcos) {
    return { factors: { pcos: 1.0 }, diagnostics: { pcosSeverity: 'No aplica' } };
  }

  let factor = 0.9; // Leve (ovulación preservada, AMH <6)
  let severity = 'SOP Leve (ovulación preservada, AMH <6 ng/mL)';

  // Re-evaluar severidad basada en los criterios del DFCA para SOP
  const isAnovulatory = (bmi !== undefined && bmi !== null && bmi >= 30) || (homaIr !== null && homaIr !== undefined && homaIr >= 3.5); // Simplified check for anovulation/severity indicators
  const isHighAmh = amh && amh > 6; // Assuming AMH > 6 as a proxy for "AMH >6" in DFCA.

  if (isAnovulatory && isHighAmh) {
    factor = 0.6; // Severo (anovulación, IMC >30, HOMA >3.5)
    severity = 'SOP Severo (anovulación, IMC >30 o HOMA >3.5)';
  } else if (isAnovulatory || isHighAmh) {
    factor = 0.75; // Moderado (anovulación, IMC <30, AMH >6)
    severity = 'SOP Moderado (con anovulación o AMH >6 ng/mL)';
  }

  return { factors: { pcos: factor }, diagnostics: { pcosSeverity: severity } };
};

/**
 * Evalúa el resultado de la Histerosalpingografía (HSG) y asigna un factor de ajuste.
 * Ref: "PARAMETROS FASE 1.docx - 7. Resultado de HSG"
 */
export const evaluateHsgPremium = (result: HsgResult): PartialEvaluation => {
  let hsgComment: string;
  let factor: number;

  switch (result) {
    case HsgResult.Normal:
      hsgComment = 'Trompas permeables bilateralmente';
      factor = 1.0;
      break;
    case HsgResult.Unilateral:
      hsgComment = 'Obstrucción tubárica unilateral';
      factor = 0.80;
      break;
    case HsgResult.Bilateral:
      hsgComment = 'Obstrucción tubárica bilateral';
      factor = 0.0;
      break;
    case HsgResult.Malformation:
      hsgComment = 'Malformación uterina relevante (ej. útero septado)';
      factor = 0.70;
      break;
    case HsgResult.Unknown:
    default:
      hsgComment = 'Resultado de Histerosalpingografía (HSG) desconocido/no realizado';
      factor = 0.90; // Default to a slight penalty if unknown
      break;
  }
  return { factors: { hsg: factor }, diagnostics: { hsgComment } };
};

/**
 * Evalúa la ligadura de trompas (OTB) y asigna un factor de ajuste.
 * Ref: "PARAMETROS FASE 1.docx - 8. Ligadura de Trompas (OTB)"
 */
export const evaluateOtbPremium = (hasOtb: boolean): PartialEvaluation => {
  return { factors: { otb: hasOtb ? 0.0 : 1.0 } };
};

/**
 * Evalúa el nivel de Prolactina y asigna un factor de ajuste.
 * Ref: "PARAMETROS FASE 1.docx - 9. Prolactina"
 */
export const evaluateProlactinPremium = (prolactin?: number): PartialEvaluation => {
  if (prolactin === undefined || prolactin < 0) return { factors: { prolactin: 1.0 }, diagnostics: { prolactinComment: 'Nivel de Prolactina no evaluado' } };

  if (prolactin < 25) {
    return { factors: { prolactin: 1.0 }, diagnostics: { prolactinComment: 'Prolactina normal (< 25 ng/mL)' } };
  } else if (prolactin <= 50) {
    return { factors: { prolactin: 0.85 }, diagnostics: { prolactinComment: 'Hiperprolactinemia leve (25-50 ng/mL)' } };
  } else {
    // prolactin > 50
    return { factors: { prolactin: 0.60 }, diagnostics: { prolactinComment: 'Hiperprolactinemia significativa (> 50 ng/mL)' } };
  }
};

/**
 * Evalúa el nivel de TSH y asigna un factor de ajuste.
 * Ref: "PARAMETROS FASE 1.docx - 10. TSH"
 */
export const evaluateTshPremium = (tsh?: number): PartialEvaluation => {
  if (tsh === undefined || tsh < 0) return { factors: { tsh: 1.0 }, diagnostics: { tshComment: 'Nivel de TSH no evaluado' } };

  if (tsh >= 0.5 && tsh <= 2.5) {
    return { factors: { tsh: 1.0 }, diagnostics: { tshComment: 'TSH óptima (0.5-2.5 mUI/L)' } };
  } else if (tsh > 2.5 && tsh <= 4.0) {
    return { factors: { tsh: 0.85 }, diagnostics: { tshComment: 'TSH límite superior (2.5-4.0 mUI/L)' } };
  } else {
    // tsh > 4.0
    return { factors: { tsh: 0.70 }, diagnostics: { tshComment: 'Hipotiroidismo (TSH > 4.0 mUI/L)' } };
  }
};

/**
 * Evalúa el Índice HOMA-IR y asigna un factor de ajuste.
 * Ref: "PARAMETROS FASE 1.docx - 12. Índice HOMA-IR"
 */
export const evaluateHomaPremium = (homaValue?: number | null): PartialEvaluation => {
  if (homaValue === undefined || homaValue === null || homaValue < 0) return { factors: { homa: 1.0 }, diagnostics: { homaComment: 'HOMA-IR no evaluado' } };

  if (homaValue < 2.0) {
    return { factors: { homa: 1.0 }, diagnostics: { homaComment: 'HOMA-IR normal' } };
  } else if (homaValue >= 2.0 && homaValue < 3.5) {
    return { factors: { homa: 0.85 }, diagnostics: { homaComment: 'Leve resistencia a la insulina' } };
  } else {
    // homaValue >= 3.5
    return { factors: { homa: 0.70 }, diagnostics: { homaComment: 'Resistencia a la insulina significativa' } };
  }
};

/**
 * Evalúa la duración de la infertilidad y asigna un factor de ajuste.
 * Ref: "PARAMETROS FASE 1.docx - 13. Duración de la infertilidad"
 */
export const evaluateInfertilityDurationPremium = (years?: number): PartialEvaluation => {
  if (years === undefined || years < 0) return { factors: { infertilityDuration: 1.0 }, diagnostics: { infertilityDurationComment: 'Duración de infertilidad no especificada' } };

  if (years < 2) {
    return { factors: { infertilityDuration: 1.0 }, diagnostics: { infertilityDurationComment: 'Infertilidad < 2 años' } };
  } else if (years >= 2 && years <= 4) {
    return { factors: { infertilityDuration: 0.90 }, diagnostics: { infertilityDurationComment: 'Infertilidad 2-4 años' } };
  } else {
    // years >= 5
    return { factors: { infertilityDuration: 0.75 }, diagnostics: { infertilityDurationComment: 'Infertilidad prolongada (≥ 5 años)' } };
  }
};

/**
 * Evalúa el número de cirugías pélvicas previas y asigna un factor de ajuste.
 * Ref: "PARAMETROS FASE 1.docx - 14. Cirugías pélvicas previas"
 */
export const evaluatePelvicSurgeriesPremium = (surgeries?: number): PartialEvaluation => {
  if (surgeries === undefined || surgeries < 0) return { factors: { pelvicSurgery: 1.0 }, diagnostics: { pelvicSurgeryComment: 'Número de cirugías pélvicas no especificado' } };

  if (surgeries === 0) {
    return { factors: { pelvicSurgery: 1.0 }, diagnostics: { pelvicSurgeryComment: 'Sin cirugías pélvicas previas' } };
  } else if (surgeries === 1) {
    return { factors: { pelvicSurgery: 0.90 }, diagnostics: { pelvicSurgeryComment: '1 cirugía pélvica previa' } };
  } else {
    // surgeries >= 2
    return { factors: { pelvicSurgery: 0.75 }, diagnostics: { pelvicSurgeryComment: '2 o más cirugías pélvicas previas' } };
  }
};

/**
 * Evalúa los parámetros del espermatograma y asigna un factor de ajuste para el factor masculino.
 * Ref: "PARAMETROS FASE 1.docx - 15. Factor masculino"
 */
export const evaluateMaleFactorPremium = (input: UserInput): PartialEvaluation => {
  const { spermConcentration, spermProgressiveMotility, spermNormalMorphology } = input;

  const anomalies: { factor: number; diagnosis: string }[] = [];

  // Check for undefined values and add to missingData
  const missingData: string[] = [];
  if (spermConcentration === undefined) missingData.push('Concentración espermática');
  if (spermProgressiveMotility === undefined) missingData.push('Motilidad progresiva');
  if (spermNormalMorphology === undefined) missingData.push('Morfología normal');

  if (missingData.length > 0) {
    // If any key male factor data is missing, we cannot fully evaluate.
    // Default male factor to 1.0 but report missing data.
    return {
      factors: { male: 1.0 }, // Neutral default as per base engine logic for missing.
      diagnostics: {
        maleFactorDetailed: 'Espermatograma incompleto o no evaluado',
        missingData: [...missingData.map(d => `Espermatograma: ${d}`)],
      },
    };
  }

  // Evaluate based on OMS 2021 thresholds from DFCA
  if (spermConcentration !== undefined && spermConcentration < 16) {
    anomalies.push({ factor: 0.75, diagnosis: 'Oligozoospermia (<16 M/mL)' });
  }
  if (spermProgressiveMotility !== undefined && spermProgressiveMotility < 30) {
    anomalies.push({ factor: 0.80, diagnosis: 'Astenozoospermia (<30% Motilidad Progresiva)' });
  }
  if (spermNormalMorphology !== undefined && spermNormalMorphology < 4) {
    anomalies.push({ factor: 0.85, diagnosis: 'Teratozoospermia (<4% Morfología Normal)' });
  }

  // Handle Azoospermia explicitly (overrides all others)
  if (spermConcentration !== undefined && spermConcentration === 0) {
    return { factors: { male: 0.0 }, diagnostics: { maleFactorDetailed: 'Azoospermia' } };
  }

  if (anomalies.length === 0) {
    return { factors: { male: 1.0 }, diagnostics: { maleFactorDetailed: 'Parámetros seminales normales (Normozoospermia)' } };
  }

  // If multiple anomalies, use the lowest factor as per DFCA.
  const worstAnomaly = anomalies.reduce(
    (min, current) => (current.factor < min.factor ? current : min),
    anomalies[0],
  );

  const allDiagnoses = anomalies.map((a) => a.diagnosis).join(', ');
  return { factors: { male: worstAnomaly.factor }, diagnostics: { maleFactorDetailed: allDiagnoses } };
};

/**
 * Evalúa los anticuerpos TPO en general.
 * @param tpoAbPositive Indica si los anticuerpos TPO son positivos
 */
export function evaluateTpoAbPremium(tpoAbPositive: boolean): PartialEvaluation {
  return tpoAbPositive 
    ? evaluatePositiveTpoAb() 
    : evaluateNegativeTpoAb();
}

/**
 * Evalúa cuando los anticuerpos TPO son positivos.
 */
export function evaluatePositiveTpoAb(): PartialEvaluation {
  return { diagnostics: { tpoAbComment: 'Anticuerpos TPO Positivos' } };
}

/**
 * Evalúa cuando los anticuerpos TPO son negativos.
 */
export function evaluateNegativeTpoAb(): PartialEvaluation {
  return { diagnostics: { tpoAbComment: 'Anticuerpos TPO Negativos' } };
}

