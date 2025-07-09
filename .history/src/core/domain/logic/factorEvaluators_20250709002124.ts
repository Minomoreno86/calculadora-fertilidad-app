import { UserInput, MyomaType, AdenomyosisType, PolypType, HsgResult, Factors, Diagnostics } from '../models';

// Defino un tipo de retorno parcial para los evaluadores para mantener el código limpio.
type PartialEvaluation = {
  factors?: Partial<Factors>;
  diagnostics?: Partial<Diagnostics>;
};

export const evaluateAgeBaseline = (age: number): PartialEvaluation => {
  if (age <= 24) {
    return { factors: { baseAgeProbability: 27.5 }, diagnostics: { agePotential: "Fertilidad excelente" } };
  }
  if (age <= 29) {
    return { factors: { baseAgeProbability: 22.5 }, diagnostics: { agePotential: "Fertilidad muy buena" } };
  }
  if (age <= 34) {
    return { factors: { baseAgeProbability: 17.5 }, diagnostics: { agePotential: "Buena fertilidad" } };
  }
  if (age <= 37) {
    return { factors: { baseAgeProbability: 12.5 }, diagnostics: { agePotential: "Fecundidad en descenso" } };
  }
  if (age <= 40) {
    return { factors: { baseAgeProbability: 7.5 }, diagnostics: { agePotential: "Reducción significativa" } };
  }
  if (age <= 42) {
    return { factors: { baseAgeProbability: 4.0 }, diagnostics: { agePotential: "Baja tasa de embarazo" } };
  }
  if (age >= 43) {
    return { factors: { baseAgeProbability: 1.5 }, diagnostics: { agePotential: "Probabilidad casi nula" } };
  }
  return { factors: { baseAgeProbability: 0 }, diagnostics: { agePotential: "Edad fuera de rango clínico" } };
};

export const evaluateImc = (bmi: number | null): PartialEvaluation => {
  if (bmi === null) return { diagnostics: { missingData: ["Índice de Masa Corporal (IMC)"] } };
  if (bmi < 18.5) return { factors: { bmi: 0.8 }, diagnostics: { bmiComment: "Bajo peso" } }; // Ajustado para mayor impacto
  if (bmi <= 24.9) return { factors: { bmi: 1.0 }, diagnostics: { bmiComment: "Peso normal" } };
  return { factors: { bmi: 0.85 }, diagnostics: { bmiComment: "Sobrepeso/Obesidad" } };
};

export const evaluateMenstrualCycle = (cycleDuration?: number): PartialEvaluation => {
  if (cycleDuration === undefined) return { diagnostics: { missingData: ["Duración del ciclo menstrual"] } };
  if (cycleDuration >= 21 && cycleDuration <= 35) return { factors: { cycle: 1.0 }, diagnostics: { cycleComment: "Ciclo regular" } };
  return { factors: { cycle: 0.7 }, diagnostics: { cycleComment: "Ciclo irregular" } };
};

export const evaluatePcos = (hasPcos: boolean, bmi: number | null, cycleDuration?: number): PartialEvaluation => {
  if (!hasPcos) return { factors: { pcos: 1.0 } };

  let factor = 1.0;
  let severity = "Leve";
  
  if (bmi && bmi >= 25) {
      factor *= 0.9; // Factor metabólico
      severity = "Moderado";
  }
  if (cycleDuration && cycleDuration > 35) {
      factor *= 0.85; // Factor anovulatorio
      severity = "Moderado";
  }
  if ((bmi && bmi >= 30) || (cycleDuration && cycleDuration > 45)) {
    severity = "Severo";
  }
  
  return { factors: { pcos: factor }, diagnostics: { pcosSeverity: severity } };
};

export const evaluateEndometriosis = (grade: number): PartialEvaluation => {
  if (grade === 1 || grade === 2) return { factors: { endometriosis: 0.85 } }; // Estadios I-II
  if (grade === 3 || grade === 4) return { factors: { endometriosis: 0.60 } }; // Estadios III-IV
  return { factors: { endometriosis: 1.0 } };
};

export const evaluateMyomas = (type: MyomaType): PartialEvaluation => {
  if (type === 'submucosal') return { factors: { myoma: 0.30 } };
  if (type === 'intramural_large') return { factors: { myoma: 0.60 } };
  return { factors: { myoma: 1.0 } };
};

export const evaluateAdenomyosis = (type: AdenomyosisType): PartialEvaluation => {
    if (type === 'focal') return { factors: { adenomyosis: 0.8 } };
    if (type === 'diffuse') return { factors: { adenomyosis: 0.5 } };
    return { factors: { adenomyosis: 1.0 } };
};

export const evaluatePolyps = (type: PolypType): PartialEvaluation => {
  if (type === 'small') return { factors: { polyp: 0.85 }, diagnostics: { polypComment: 'Pólipo endometrial pequeño (< 1 cm)' } };
  if (type === 'large') return { factors: { polyp: 0.70 }, diagnostics: { polypComment: 'Pólipo grande (≥ 1 cm) o múltiples' } };
  if (type === 'ostium') return { factors: { polyp: 0.50 }, diagnostics: { polypComment: 'Pólipo sobre ostium tubárico' } };
  return { factors: { polyp: 1.0 } };
};

export const evaluateHsg = (result: HsgResult): PartialEvaluation => {
  if (result === 'unilateral') return { factors: { hsg: 0.7 }, diagnostics: { hsgComment: "Obstrucción tubárica unilateral" } };
  if (result === 'bilateral') return { factors: { hsg: 0.0 }, diagnostics: { hsgComment: "Obstrucción tubárica bilateral" } };
  if (result === 'malformacion') return { factors: { hsg: 0.3 }, diagnostics: { hsgComment: "Alteración de la cavidad uterina" } };
  if (result === 'unknown') return { diagnostics: { missingData: ["Resultado de Histerosalpingografía (HSG)"] } };
  return { factors: { hsg: 1.0 }, diagnostics: { hsgComment: "Ambas trompas permeables" } };
};

export const evaluateOtb = (hasOtb: boolean): PartialEvaluation => {
  if (hasOtb) return { factors: { otb: 0.0 } };
  return { factors: { otb: 1.0 } };
};

export const evaluateAmh = (amh?: number): PartialEvaluation => {
  if (amh === undefined) return { diagnostics: { missingData: ["Hormona Antimülleriana (AMH)"] } };
  if (amh > 4.0) return { factors: { amh: 0.9 }, diagnostics: { ovarianReserve: "Alta reserva ovárica" } };
  if (amh >= 2.0) return { factors: { amh: 1.0 }, diagnostics: { ovarianReserve: "Reserva ovárica adecuada" } };
  if (amh >= 1.0) return { factors: { amh: 0.85 }, diagnostics: { ovarianReserve: "Reserva ovárica ligeramente disminuida" } };
  if (amh >= 0.5) return { factors: { amh: 0.6 }, diagnostics: { ovarianReserve: "Baja reserva ovárica" } };
  return { factors: { amh: 0.3 }, diagnostics: { ovarianReserve: "Reserva ovárica muy baja" } };
};

export const evaluateProlactin = (prolactin?: number): PartialEvaluation => {
  if (prolactin === undefined) return { diagnostics: { missingData: ["Nivel de Prolactina"] } };
  if (prolactin >= 25) return { factors: { prolactin: 0.7 }, diagnostics: { prolactinComment: "Hiperprolactinemia" } };
  return { factors: { prolactin: 1.0 } };
};

export const evaluateTsh = (tsh?: number): PartialEvaluation => {
  if (tsh === undefined) return { diagnostics: { missingData: ["Nivel de TSH"] } };
  if (tsh > 2.5) return { factors: { tsh: 0.8 }, diagnostics: { tshComment: "TSH no óptima para fertilidad" } };
  return { factors: { tsh: 1.0 } };
};

export const evaluateHOMA = (homaValue?: number): PartialEvaluation => {
  if (homaValue === undefined) return {};
  if (homaValue >= 2.5 && homaValue < 4.0) return { factors: { homa: 0.95 } };
  if (homaValue >= 4.0) return { factors: { homa: 0.90 } };
  return { factors: { homa: 1.0 } };
};

export const evaluateInfertilityYears = (years?: number): PartialEvaluation => {
    if (years === undefined) return {};
    if (years >= 3 && years <= 4) return { factors: { infertilityDuration: 0.93 } };
    if (years >= 5) return { factors: { infertilityDuration: 0.85 } };
    return { factors: { infertilityDuration: 1.0 } };
};

export const evaluatePelvicSurgeries = (surgeries?: number): PartialEvaluation => {
    if (surgeries === undefined) return {};
    if (surgeries === 1) return { factors: { pelvicSurgery: 0.95 } };
    if (surgeries >= 2) return { factors: { pelvicSurgery: 0.88 } };
    return { factors: { pelvicSurgery: 1.0 } };
};

export const evaluateMaleFactor = (input: UserInput): PartialEvaluation => {
  const { spermConcentration, spermProgressiveMotility, spermNormalMorphology } = input;
  
  if (spermConcentration === undefined && spermProgressiveMotility === undefined && spermNormalMorphology === undefined) {
    return { diagnostics: { missingData: ["Espermatograma completo"] } };
  }

  const alterations: { factor: number; diagnosis: string }[] = [];

  if (spermConcentration !== undefined) {
    if (spermConcentration < 5) alterations.push({ factor: 0.25, diagnosis: "Oligozoospermia severa" });
    else if (spermConcentration < 16) alterations.push({ factor: 0.7, diagnosis: "Oligozoospermia leve-moderada" });
  }

  if (spermProgressiveMotility !== undefined) {
    if (spermProgressiveMotility < 20) alterations.push({ factor: 0.4, diagnosis: "Astenozoospermia severa" });
    else if (spermProgressiveMotility < 30) alterations.push({ factor: 0.85, diagnosis: "Astenozoospermia leve" });
  }

  if (spermNormalMorphology !== undefined) {
    if (spermNormalMorphology < 4) alterations.push({ factor: 0.5, diagnosis: "Teratozoospermia" });
  }

  if (alterations.length === 0) {
    return { factors: { male: 1.0 }, diagnostics: { maleFactorDetailed: "Parámetros seminales normales" } };
  }
  
  const worstAlteration = alterations.reduce((min, current) => current.factor < min.factor ? current : min, alterations[0]);
  const allDiagnoses = alterations.map(a => a.diagnosis).join(', ');

  return { factors: { male: worstAlteration.factor }, diagnostics: { maleFactorDetailed: allDiagnoses } };
};