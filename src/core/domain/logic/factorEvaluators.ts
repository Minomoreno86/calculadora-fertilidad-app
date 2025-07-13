import { UserInput, MyomaType, AdenomyosisType, PolypType, HsgResult, Factors, Diagnostics, OtbMethod } from '../models';

type PartialEvaluation = {
  factors?: Partial<Factors>;
  diagnostics?: Partial<Diagnostics>;
};

export const evaluateAgeBaseline = (age: number): PartialEvaluation => {
  const ageRanges = [
    { max: 24, probability: 25.0, comment: 'Fertilidad máxima' },
    { max: 29, probability: 22.5, comment: 'Fertilidad excelente' },
    { max: 34, probability: 17.5, comment: 'Buena fertilidad' },
    { max: 39, probability: 10.0, comment: 'Fecundidad en descenso' },
    { max: 44, probability: 5.0, comment: 'Baja tasa de embarazo' },
    { max: 49, probability: 1.5, comment: 'Probabilidad muy baja' },
    { max: Infinity, probability: 0.5, comment: 'Edad extrema - considerar ovodonación' },
  ];

  // Manejar casos especiales de edades muy jóvenes
  if (age < 15) {
    return { factors: { baseAgeProbability: 0.1 }, diagnostics: { agePotential: 'Edad muy joven - no recomendado para embarazo' } };
  }
  
  if (age < 18) {
    return { factors: { baseAgeProbability: 15.0 }, diagnostics: { agePotential: 'Edad adolescente - requiere evaluación especializada' } };
  }

  for (const range of ageRanges) {
    if (age <= range.max) {
      return { factors: { baseAgeProbability: range.probability }, diagnostics: { agePotential: range.comment } };
    }
  }
  
  // Fallback para edades muy extremas
  return { factors: { baseAgeProbability: 0.1 }, diagnostics: { agePotential: 'Edad fuera de rango reproductivo' } };
};

export const evaluateBmi = (bmi: number | null): PartialEvaluation => {
  if (bmi === null) return { diagnostics: { missingData: ['Índice de Masa Corporal (IMC)'] } };
  const bmiRanges = [
    { max: 18.5, factor: 0.8, comment: 'Bajo peso' },
    { max: 24.9, factor: 1.0, comment: 'Peso normal' },
    { max: Infinity, factor: 0.85, comment: 'Sobrepeso/Obesidad' },
  ];

  for (const range of bmiRanges) {
    if (bmi <= range.max) {
      return { factors: { bmi: range.factor }, diagnostics: { bmiComment: range.comment } };
    }
  }
  return {};
};

export const evaluateCycle = (cycleDuration?: number): PartialEvaluation => {
  if (cycleDuration === undefined) return { diagnostics: { missingData: ['Duración del ciclo menstrual'] } };
  
  // Permitir cualquier duración pero evaluar clínicamente
  if (cycleDuration >= 21 && cycleDuration <= 35)
    return { factors: { cycle: 1.0 }, diagnostics: { cycleComment: 'Ciclo regular normal (21-35 días)' } };
  else if (cycleDuration >= 36 && cycleDuration <= 45)
    return { factors: { cycle: 0.75 }, diagnostics: { cycleComment: 'Ciclo largo anormal (36-45 días) - Posible anovulación' } };
  else if (cycleDuration >= 15 && cycleDuration <= 20)
    return { factors: { cycle: 0.80 }, diagnostics: { cycleComment: 'Ciclo corto anormal (15-20 días) - Fase lútea insuficiente' } };
  else if (cycleDuration > 45)
    return { factors: { cycle: 0.60 }, diagnostics: { cycleComment: 'Oligomenorrea (>45 días) - Probable anovulación' } };
  else if (cycleDuration < 15)
    return { factors: { cycle: 0.50 }, diagnostics: { cycleComment: 'Ciclo muy corto (<15 días) - Altamente anormal' } };
  else
    return { factors: { cycle: 0.7 }, diagnostics: { cycleComment: 'Ciclo irregular' } };
};

export const evaluatePcos = (hasPcos: boolean, bmi: number | null, cycleDuration?: number): PartialEvaluation => {
  if (!hasPcos) return { factors: { pcos: 1.0 } };
  let factor = 1.0,
    severity = 'Leve';
  if (bmi && bmi >= 25) {
    factor *= 0.9;
    severity = 'Moderado';
  }
  if (cycleDuration && cycleDuration > 35) {
    factor *= 0.85;
    severity = 'Moderado';
  }
  if ((bmi && bmi >= 30) || (cycleDuration && cycleDuration > 45)) {
    severity = 'Severo';
  }
  return { factors: { pcos: factor }, diagnostics: { pcosSeverity: severity } };
};

export const evaluateEndometriosis = (grade: number): PartialEvaluation => {
  const endometriosisGrades = [
    { min: 1, max: 2, factor: 0.85, comment: 'Endometriosis leve (Grados I-II)' },
    { min: 3, max: 4, factor: 0.6, comment: 'Endometriosis severa (Grados III-IV)' },
  ];

  for (const gradeRange of endometriosisGrades) {
    if (grade >= gradeRange.min && grade <= gradeRange.max) {
      return { factors: { endometriosis: gradeRange.factor }, diagnostics: { endometriosisComment: gradeRange.comment } };
    }
  }
  return { factors: { endometriosis: 1.0 } };
};

export const evaluateMyomas = (type: MyomaType): PartialEvaluation => {
  const myomaTypes = [
    { type: MyomaType.Submucosal, factor: 0.3, comment: 'Mioma submucoso detectado' },
    { type: MyomaType.IntramuralLarge, factor: 0.6, comment: 'Mioma intramural grande detectado' },
  ];

  for (const myomaType of myomaTypes) {
    if (type === myomaType.type) {
      return { factors: { myoma: myomaType.factor }, diagnostics: { myomaComment: myomaType.comment } };
    }
  }
  return { factors: { myoma: 1.0 } };
};

export const evaluateAdenomyosis = (type: AdenomyosisType): PartialEvaluation => {
  const adenomyosisTypes = [
    { type: AdenomyosisType.Focal, factor: 0.8, comment: 'Adenomiosis focal' },
    { type: AdenomyosisType.Diffuse, factor: 0.5, comment: 'Adenomiosis difusa' },
  ];

  for (const adenomyosisType of adenomyosisTypes) {
    if (type === adenomyosisType.type) {
      return { factors: { adenomyosis: adenomyosisType.factor }, diagnostics: { adenomyosisComment: adenomyosisType.comment } };
    }
  }
  return { factors: { adenomyosis: 1.0 } };
};

export const evaluatePolyps = (type: PolypType): PartialEvaluation => {
  const polypTypes = [
    { type: PolypType.Small, factor: 0.85, comment: 'Pólipo endometrial pequeño (< 1 cm)' },
    { type: PolypType.Large, factor: 0.7, comment: 'Pólipo grande (≥ 1 cm) o múltiples' },
    { type: PolypType.Ostium, factor: 0.5, comment: 'Pólipo sobre ostium tubárico' },
  ];

  for (const polypType of polypTypes) {
    if (type === polypType.type) {
      return { factors: { polyp: polypType.factor }, diagnostics: { polypComment: polypType.comment } };
    }
  }
  return { factors: { polyp: 1.0 } };
};

export const evaluateHsg = (result: HsgResult): PartialEvaluation => {
  const hsgResults = [
    { result: HsgResult.Unilateral, factor: 0.7, comment: 'Obstrucción tubárica unilateral' },
    { result: HsgResult.Bilateral, factor: 0.0, comment: 'Obstrucción tubárica bilateral' },
    { result: HsgResult.Malformation, factor: 0.3, comment: 'Alteración de la cavidad uterina' },
  ];

  for (const hsgResult of hsgResults) {
    if (result === hsgResult.result) {
      return { factors: { hsg: hsgResult.factor }, diagnostics: { hsgComment: hsgResult.comment } };
    }
  }
  if (result === HsgResult.Unknown) return { diagnostics: { missingData: ['Resultado de Histerosalpingografía (HSG)'] } };
  return { factors: { hsg: 1.0 }, diagnostics: { hsgComment: 'Ambas trompas permeables' } };
};

export const evaluateOtb = (
  hasOtb: boolean,
  age?: number,
  otbMethod?: OtbMethod,
  remainingTubalLength?: number,
  hasOtherInfertilityFactors?: boolean,
  desireForMultiplePregnancies?: boolean,
): PartialEvaluation => {
  if (!hasOtb) {
    return { factors: { otb: 1.0 }, diagnostics: { hsgComment: 'No se ha realizado ligadura de trompas.' } };
  }

  const diagnostics: string[] = [];
  let otbFactor = 1.0;

  const evaluations = [
    {
      value: age,
      thresholds: [
        { limit: 40, factor: 0.2, message: 'Edad materna ≥ 40 años: Baja probabilidad de éxito en recanalización.' },
        { limit: 35, factor: 0.5, message: 'Edad materna 35-39 años: Tasas de éxito moderadas en recanalización.' },
      ],
      defaultMessage: 'Edad materna < 35 años: Ideal para recanalización tubárica.',
      missingMessage: 'Edad materna no especificada para evaluación de recanalización.',
    },
    {
      value: otbMethod,
      thresholds: [
        { limit: OtbMethod.ExtensiveCauterization, factor: 0.1, message: 'Método de OTB: Cauterización extensa o salpingectomía parcial. Pronóstico muy pobre para recanalización.' },
        { limit: OtbMethod.PartialSalpingectomy, factor: 0.1, message: 'Método de OTB: Cauterización extensa o salpingectomía parcial. Pronóstico muy pobre para recanalización.' },
        { limit: OtbMethod.Clips, factor: 0.8, message: 'Método de OTB: Clips, anillos o ligaduras. Mejor pronóstico para recanalización.' },
        { limit: OtbMethod.Rings, factor: 0.8, message: 'Método de OTB: Clips, anillos o ligaduras. Mejor pronóstico para recanalización.' },
        { limit: OtbMethod.Ligation, factor: 0.8, message: 'Método de OTB: Clips, anillos o ligaduras. Mejor pronóstico para recanalización.' },
      ],
      defaultMessage: 'Método de OTB no especificado para evaluación de recanalización.',
      missingMessage: 'Método de OTB no especificado para evaluación de recanalización.',
    },
    {
      value: remainingTubalLength,
      thresholds: [
        { limit: 4, factor: 0.3, message: 'Longitud tubárica remanente < 4 cm. Reduce tasas de embarazo.' },
      ],
      defaultMessage: 'Longitud tubárica remanente > 4 cm. Favorable para recanalización.',
      missingMessage: 'Longitud tubárica remanente no especificada para evaluación de recanalización.',
    },
    {
      value: hasOtherInfertilityFactors,
      thresholds: [
        { limit: true, factor: 0.5, message: 'Presencia de otros factores de infertilidad. Considerar antes de recanalización.' },
      ],
      defaultMessage: 'Ausencia de otros factores de infertilidad. Favorable para recanalización.',
      missingMessage: 'Información sobre otros factores de infertilidad no especificada.',
    },
    {
      value: desireForMultiplePregnancies,
      thresholds: [],
      defaultMessage: 'Deseo de múltiples embarazos. Recanalización puede ser más costo-efectiva que FIV.',
      missingMessage: 'Deseo de múltiples embarazos no especificado.',
    },
  ];

  for (const evalConfig of evaluations) {
    if (evalConfig.value !== undefined) {
      let message = evalConfig.defaultMessage;
      for (const threshold of evalConfig.thresholds) {
        if (typeof evalConfig.value === 'number' && evalConfig.value >= threshold.limit) {
          otbFactor *= threshold.factor;
          message = threshold.message;
          break;
        } else if (evalConfig.value === threshold.limit) {
          otbFactor *= threshold.factor;
          message = threshold.message;
          break;
        }
      }
      diagnostics.push(message);
    } else {
      diagnostics.push(evalConfig.missingMessage);
    }
  }

  return { factors: { otb: 0.0 }, diagnostics: { hsgComment: diagnostics.join('. ') } };
};

export const evaluateAmh = (amh?: number): PartialEvaluation => {
  if (amh === undefined) return { diagnostics: { missingData: ['Hormona Antimülleriana (AMH)'] } };
  const amhRanges = [
    { min: 4.0, factor: 0.9, comment: 'Alta reserva ovárica' },
    { min: 2.0, factor: 1.0, comment: 'Reserva ovárica adecuada' },
    { min: 1.0, factor: 0.85, comment: 'Reserva ovárica ligeramente disminuida' },
    { min: 0.5, factor: 0.6, comment: 'Baja reserva ovárica' },
    { min: 0, factor: 0.3, comment: 'Reserva ovárica muy baja' },
  ];

  for (const range of amhRanges) {
    if (amh >= range.min) {
      return { factors: { amh: range.factor }, diagnostics: { ovarianReserve: range.comment } };
    }
  }
  return {};
};

export const evaluateProlactin = (prolactin?: number): PartialEvaluation => {
  if (prolactin === undefined) return { diagnostics: { missingData: ['Nivel de Prolactina'] } };
  if (prolactin >= 25) return { factors: { prolactin: 0.7 }, diagnostics: { prolactinComment: 'Hiperprolactinemia' } };
  return { factors: { prolactin: 1.0 } };
};

export const evaluateTsh = (tsh?: number): PartialEvaluation => {
  if (tsh === undefined) return { diagnostics: { missingData: ['Nivel de TSH'] } };
  if (tsh > 2.5) return { factors: { tsh: 0.8 }, diagnostics: { tshComment: 'TSH no óptima para fertilidad' } };
  return { factors: { tsh: 1.0 } };
};

export const evaluateHoma = (homaValue?: number): PartialEvaluation => {
  if (homaValue === undefined) return { factors: { homa: 1.0 } };
  const homaRanges = [
    { min: 4.0, factor: 0.9, comment: 'Resistencia a la insulina significativa' },
    { min: 2.5, factor: 0.95, comment: 'Resistencia a la insulina leve' },
  ];

  for (const range of homaRanges) {
    if (homaValue >= range.min) {
      return { factors: { homa: range.factor }, diagnostics: { homaComment: range.comment } };
    }
  }
  return { factors: { homa: 1.0 } };
};

export const evaluateInfertilityDuration = (years?: number): PartialEvaluation => {
  if (years === undefined) return { factors: { infertilityDuration: 1.0 } };
  const infertilityDurationRanges = [
    { min: 5, factor: 0.85 },
    { min: 3, factor: 0.93 },
  ];

  for (const range of infertilityDurationRanges) {
    if (years >= range.min) {
      return { factors: { infertilityDuration: range.factor } };
    }
  }
  return { factors: { infertilityDuration: 1.0 } };
};

export const evaluatePelvicSurgeries = (surgeries?: number): PartialEvaluation => {
  if (surgeries === undefined) return { factors: { pelvicSurgery: 1.0 } };
  const pelvicSurgeryRanges = [
    { count: 2, factor: 0.88 },
    { count: 1, factor: 0.95 },
  ];

  for (const range of pelvicSurgeryRanges) {
    if (surgeries >= range.count) {
      return { factors: { pelvicSurgery: range.factor } };
    }
  }
  return { factors: { pelvicSurgery: 1.0 } };
};

export const evaluateMaleFactor = (input: UserInput): PartialEvaluation => {
  const { spermConcentration, spermProgressiveMotility, spermNormalMorphology } = input;
  if (
    spermConcentration === undefined &&
    spermProgressiveMotility === undefined &&
    spermNormalMorphology === undefined
  ) {
    return { diagnostics: { missingData: ['Espermatograma completo'] } };
  }
  const alterations: { factor: number; diagnosis: string }[] = [];
  if (spermConcentration !== undefined) {
    if (spermConcentration < 5) alterations.push({ factor: 0.25, diagnosis: 'Oligozoospermia severa' });
    else if (spermConcentration < 16) alterations.push({ factor: 0.7, diagnosis: 'Oligozoospermia leve-moderada' });
  }
  if (spermProgressiveMotility !== undefined) {
    if (spermProgressiveMotility < 20) alterations.push({ factor: 0.4, diagnosis: 'Astenozoospermia severa' });
    else if (spermProgressiveMotility < 30) alterations.push({ factor: 0.85, diagnosis: 'Astenozoospermia leve' });
  }
  if (spermNormalMorphology !== undefined) {
    if (spermNormalMorphology < 4) alterations.push({ factor: 0.5, diagnosis: 'Teratozoospermia' });
  }
  if (alterations.length === 0)
    return { factors: { male: 1.0 }, diagnostics: { maleFactorDetailed: 'Parámetros seminales normales' } };
  const worstAlteration = alterations.reduce(
    (min, current) => (current.factor < min.factor ? current : min),
    alterations[0],
  );
  const allDiagnoses = alterations.map((a) => a.diagnosis).join(', ');
  return { factors: { male: worstAlteration.factor }, diagnostics: { maleFactorDetailed: allDiagnoses } };
};