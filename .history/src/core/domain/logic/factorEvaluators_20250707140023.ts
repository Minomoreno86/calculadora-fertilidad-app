import { EvaluationState, UserInput } from '../models';

// Evaluador de probabilidad base por edad con diagnóstico asociado
export const evaluateAgeBaseline = (edad: number): Partial<EvaluationState> => {
  if (edad >= 20 && edad <= 24) {
    return { diagnostico_potencial_edad: "Fertilidad excelente", probabilidad_base_edad_num: 27.5 };
  }
  if (edad >= 25 && edad <= 29) {
    return { diagnostico_potencial_edad: "Fertilidad muy buena", probabilidad_base_edad_num: 22.5 };
  }
  if (edad >= 30 && edad <= 34) {
    return { diagnostico_potencial_edad: "Buena fertilidad", probabilidad_base_edad_num: 17.5 };
  }
  if (edad >= 35 && edad <= 37) {
    return { diagnostico_potencial_edad: "Fecundidad en descenso", probabilidad_base_edad_num: 12.5 };
  }
  if (edad >= 38 && edad <= 40) {
    return { diagnostico_potencial_edad: "Reducción significativa", probabilidad_base_edad_num: 7.5 };
  }
  if (edad >= 41 && edad <= 42) {
    return { diagnostico_potencial_edad: "Baja tasa de embarazo", probabilidad_base_edad_num: 4.0 };
  }
  if (edad >= 43) {
    return { diagnostico_potencial_edad: "Probabilidad casi nula", probabilidad_base_edad_num: 1.5 };
  }
  return { diagnostico_potencial_edad: "Edad fuera de rango clínico", probabilidad_base_edad_num: 0 };
}

export const evaluateImc = (imc: number | null): Partial<EvaluationState> => {
  if (imc === null) return {};
  if (imc < 18.5) return { comentario_imc: "Bajo peso", imc_factor: 0.6 };
  if (imc <= 24.9) return { comentario_imc: "Peso normal", imc_factor: 1.0 };
  return { comentario_imc: "Sobrepeso/Obesidad", imc_factor: 0.85 };
};

export const evaluateMenstrualCycle = (duracion_ciclo?: number): Partial<EvaluationState> => {
  if (duracion_ciclo === undefined) return { datos_faltantes: ["Duración del ciclo menstrual"] };
  if (duracion_ciclo >= 21 && duracion_ciclo <= 35) return { comentario_ciclo: "Ciclo regular", ciclo_factor: 1.0 };
  return { comentario_ciclo: "Ciclo irregular", ciclo_factor: 0.6 };
};

export const evaluateSOP = (hasSOP: boolean, menstrualCycleLength: number) => {
  let sopFactor = 1.0;

  if (hasSOP && menstrualCycleLength > 35) {
    sopFactor = 0.85; // Penalización: -15% solo si hay SOP y ciclos largos
  }

  return {
    sop_factor: sopFactor,
  };
};

// Evaluador por grado de endometriosis con penalización individual por estadio
export const evaluateEndometriosis = (grade: number) => {
  let endometriosisFactor = 1.0;

  if (grade === 1) {
    endometriosisFactor = 0.90; // -10% penalización
  } else if (grade === 2) {
    endometriosisFactor = 0.80; // -20% penalización
  } else if (grade === 3) {
    endometriosisFactor = 0.65; // -35% penalización
  } else if (grade === 4) {
    endometriosisFactor = 0.50; // -50% penalización
  }

  return { endometriosis_factor: endometriosisFactor };
};

// Evaluador por tipo de mioma con penalización individual
export const evaluateMyomas = (type: string) => {
  let myomaFactor = 1.0;

  if (type === 'submucosal') {
    myomaFactor = 0.30; // Penalización: -70%
  } else if (type === 'intramural_large') {
    myomaFactor = 0.60; // Penalización: -40%
  } else if (type === 'subserosal') {
    myomaFactor = 1.0; // Sin penalización
  } else if (type === 'none') {
    myomaFactor = 1.0; // Sin penalización
  }

  return { mioma_factor: myomaFactor };
};

export function evaluateAdenomyosis(adenomyosisType: 'none' | 'focal' | 'diffuse') {
  switch (adenomyosisType) {
    case 'none':
      return { spontaneousFactor: 1.0, ivfFactor: 1.0 };
    case 'focal':
      return { spontaneousFactor: 0.8, ivfFactor: 0.85 };
    case 'diffuse':
      return { spontaneousFactor: 0.5, ivfFactor: 0.7 };
    default:
      return { spontaneousFactor: 1.0, ivfFactor: 1.0 };
  }
}

export const evaluatePolyps = (tipo: string): Partial<EvaluationState> => {
  if (!tipo || tipo === 'none') return {};
  return { comentario_polipo: "Pólipo(s) endometrial(es)", polipo_factor: 0.7 };
};

export const evaluateHsg = (resultado?: string): Partial<EvaluationState> => {
  if (!resultado) return { datos_faltantes: ["Resultado de HSG"] };
  if (resultado === "normal") return { comentario_hsg: "Ambas trompas permeables", hsg_factor: 1.0 };
  if (resultado === "unilateral") return { comentario_hsg: "Obstrucción unilateral", hsg_factor: 0.7 };
  if (resultado === "bilateral") return { comentario_hsg: "Obstrucción bilateral", hsg_factor: 0.0 };
  if (resultado === "defecto_uterino" || resultado === 'malformacion') return { comentario_hsg: "Alteración cavidad uterina", hsg_factor: 0.3 };
  return {};
};

export const evaluateOtb = (tiene_otb: boolean): Partial<EvaluationState> => {
  if (tiene_otb) return { otb_factor: 0.0 };
  return {};
};

export const evaluateAmh = (amh?: number): Partial<EvaluationState> => {
  if (amh === undefined) return { datos_faltantes: ["Hormona Antimülleriana (AMH)"] };
  if (amh > 4.0) return { diagnostico_reserva: "Alta reserva ovárica", amh_factor: 0.9 };
  if (amh >= 2.0) return { diagnostico_reserva: "Reserva ovárica adecuada", amh_factor: 1.0 };
  if (amh >= 1.0) return { diagnostico_reserva: "Reserva ovárica ligeramente disminuida", amh_factor: 0.85 };
  if (amh >= 0.5) return { diagnostico_reserva: "Baja reserva ovárica", amh_factor: 0.6 };
  return { diagnostico_reserva: "Reserva ovárica muy baja", amh_factor: 0.3 };
};

export const evaluateProlactin = (prolactina?: number): Partial<EvaluationState> => {
  if (prolactina === undefined) return { datos_faltantes: ["Nivel de Prolactina"] };
  if (prolactina >= 25) return { comentario_prolactina: "Hiperprolactinemia", prolactina_factor: 0.6 };
  return {};
};

export const evaluateTsh = (tsh?: number): Partial<EvaluationState> => {
  if (tsh === undefined) return { datos_faltantes: ["Nivel de TSH"] };
  if (tsh > 2.5) return { comentario_tsh: "No óptima para fertilidad", tsh_factor: 0.7 };
  return {};
};

// Evaluador por índice HOMA (formato factor multiplicador)
export const evaluateHOMA = (homaValue: number) => {
  let homaFactor = 1.0;

  if (homaValue >= 2.5 && homaValue < 4.0) {
    homaFactor = 0.95; // Penalización: -5%
  } else if (homaValue >= 4.0) {
    homaFactor = 0.90; // Penalización: -10%
  }

  return {
    homa_factor: homaFactor,
  };
};
// Evaluador de penalización por número de cirugías pélvicas previas (devuelve penalización en porcentaje)
export function evaluatePelvicSurgeriesPenalty(surgeries: number): number {
  if (surgeries === 0) {
    return 0; // Sin penalización
  } else if (surgeries === 1) {
    return -5; // Penalización moderada
  } else if (surgeries >= 2) {
    return -12; // Penalización alta
  }
  return 0; // Fallback de seguridad
}

// --- NUEVAS FUNCIONES AÑADIDAS ---
export const evaluateInfertilityYears = (years: number) => {
  let infertilityDurationFactor = 1.0;

  if (years >= 3 && years <= 4) {
    infertilityDurationFactor = 0.93; // Penalización: -7%
  } else if (years >= 5) {
    infertilityDurationFactor = 0.85; // Penalización: -15%
  }

  return {
    infertility_duration_factor: infertilityDurationFactor,
  };
};
export const evaluatePelvicSurgeries = (surgeries: number) => {
  let pelvicSurgeryFactor = 1.0;

  if (surgeries === 1) {
    pelvicSurgeryFactor = 0.95; // Penalización: -5%
  } else if (surgeries >= 2) {
    pelvicSurgeryFactor = 0.88; // Penalización: -12%
  }

  return {
    pelvic_surgery_factor: pelvicSurgeryFactor,
  };
};
// --- FUNCIÓN RECONSTRUIDA ---
export const evaluateMaleFactor = (input: UserInput): Partial<EvaluationState> => {
  const { concentracion_esperm, motilidad_progresiva, morfologia_normal } = input;
  
  if (concentracion_esperm === undefined && motilidad_progresiva === undefined && morfologia_normal === undefined) {
    return { datos_faltantes: ["Espermatograma completo"], male_factor: 1.0 };
  }

  const alteraciones: { factor: number; diagnostico: string }[] = [];

  // Evaluar Concentración
  if (concentracion_esperm !== undefined) {
    if (concentracion_esperm < 5) {
      alteraciones.push({ factor: 0.25, diagnostico: "Oligozoospermia severa" });
    } else if (concentracion_esperm < 16) {
      alteraciones.push({ factor: 0.7, diagnostico: "Oligozoospermia leve-moderada" });
    }
  }

  // Evaluar Motilidad
  if (motilidad_progresiva !== undefined) {
    if (motilidad_progresiva < 20) {
      alteraciones.push({ factor: 0.4, diagnostico: "Astenozoospermia severa" });
    } else if (motilidad_progresiva < 30) {
      alteraciones.push({ factor: 0.85, diagnostico: "Astenozoospermia leve" });
    }
  }

  // Evaluar Morfología
  if (morfologia_normal !== undefined) {
    if (morfologia_normal < 4) {
      alteraciones.push({ factor: 0.5, diagnostico: "Teratozoospermia" });
    }
  }

  if (alteraciones.length > 0) {
    const peorAlteracion = alteraciones.reduce((min, current) => current.factor < min.factor ? current : min, alteraciones[0]);
    const diagnosticos = alteraciones.map(a => a.diagnostico).join(', ');
    return { male_factor: peorAlteracion.factor, diagnostico_masculino_detallado: diagnosticos };
  }

  return { diagnostico_masculino_detallado: "Parámetros normales", male_factor: 1.0 };
};

export function evaluatePcos(tiene_sop: boolean, imc: number | null, duracion_ciclo: number | undefined) {
  throw new Error('Function not implemented.');
}
