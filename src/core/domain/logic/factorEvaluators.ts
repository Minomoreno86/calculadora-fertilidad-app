import { EvaluationState, UserInput } from '../models';

// Cada función toma los datos necesarios y devuelve un fragmento del estado de evaluación.

export const evaluateAgeBaseline = (
  edad: number
): Partial<EvaluationState> => {
  if (edad < 30) return { diagnostico_potencial_edad: "Fertilidad muy buena", probabilidad_base_edad_num: 22.5 };
  if (edad <= 34) return { diagnostico_potencial_edad: "Buena fertilidad", probabilidad_base_edad_num: 17.5 };
  if (edad <= 37) return { diagnostico_potencial_edad: "Fecundidad en descenso", probabilidad_base_edad_num: 12.5 };
  if (edad <= 40) return { diagnostico_potencial_edad: "Reducción significativa", probabilidad_base_edad_num: 7.5 };
  if (edad <= 42) return { diagnostico_potencial_edad: "Baja tasa de embarazo", probabilidad_base_edad_num: 3.0 };
  return { diagnostico_potencial_edad: "Probabilidad casi nula", probabilidad_base_edad_num: 0.1 };
};

export const evaluateImc = (
  imc: number | null
): Partial<EvaluationState> => {
  if (imc === null) return {};
  if (imc < 18.5) return { comentario_imc: "Bajo peso", imc_factor: 0.6 };
  if (imc <= 24.9) return { comentario_imc: "Peso normal", imc_factor: 1.0 };
  return { comentario_imc: "Sobrepeso/Obesidad", imc_factor: 0.85 };
};

export const evaluateMenstrualCycle = (
  duracion_ciclo?: number
): Partial<EvaluationState> => {
  if (duracion_ciclo === undefined) return { datos_faltantes: ["Duración del ciclo menstrual"] };
  if (duracion_ciclo >= 21 && duracion_ciclo <= 35) return { comentario_ciclo: "Ciclo regular", ciclo_factor: 1.0 };
  return { comentario_ciclo: "Ciclo irregular", ciclo_factor: 0.6 };
};

export const evaluatePcos = (
  tiene_sop: boolean,
  imc: number | null,
  duracion_ciclo?: number
): Partial<EvaluationState> => {
  if (!tiene_sop) return {};
  if (imc === null || duracion_ciclo === undefined) return { severidad_sop: "Indeterminada", sop_factor: 0.6 };
  if (imc < 25 && duracion_ciclo <= 45) return { severidad_sop: "Leve", sop_factor: 0.85 };
  if (imc <= 30 && duracion_ciclo > 45) return { severidad_sop: "Moderado", sop_factor: 0.6 };
  return { severidad_sop: "Severo", sop_factor: 0.4 };
};

export const evaluateEndometriosis = (
  grado: number
): Partial<EvaluationState> => {
  if (grado === 0) return {};
  const comentario = `Grado ${grado}`;
  if (grado <= 2) return { comentario_endometriosis: comentario, endometriosis_factor: 0.8 };
  return { comentario_endometriosis: comentario, endometriosis_factor: 0.4 };
};

export const evaluateMyomas = (
  tiene_miomas: boolean,
  submucoso: boolean,
  intramural: boolean
): Partial<EvaluationState> => {
  if (!tiene_miomas) return {};
  if (submucoso) return { comentario_miomas: "Submucoso", mioma_factor: 0.35 };
  if (intramural) return { comentario_miomas: "Intramural significativo", mioma_factor: 0.6 };
  return { comentario_miomas: "Sin impacto cavitario", mioma_factor: 1.0 };
};

export const evaluateAdenomiosis = (
  tipo: string // <-- CORRECCIÓN AQUÍ
): Partial<EvaluationState> => {
  if (!tipo || tipo === 'none') return {}; // Check for 'none' as well
  if (tipo === "focal") return { comentario_adenomiosis: "Focal", adenomiosis_factor: 0.85 };
  return { comentario_adenomiosis: "Difusa", adenomiosis_factor: 0.5 };
};
export const evaluatePolyps = (
  tipo?: string
): Partial<EvaluationState> => {
  if (!tipo) return {};
  return { comentario_polipo: "Pólipo(s) endometrial(es)", polipo_factor: 0.7 };
};

export const evaluateHsg = (
  resultado?: string
): Partial<EvaluationState> => {
  if (!resultado) return { datos_faltantes: ["Resultado de HSG"] };
  if (resultado === "normal") return { comentario_hsg: "Ambas trompas permeables", hsg_factor: 1.0 };
  if (resultado === "unilateral") return { comentario_hsg: "Obstrucción unilateral", hsg_factor: 0.7 };
  if (resultado === "bilateral") return { comentario_hsg: "Obstrucción bilateral", hsg_factor: 0.0 };
  if (resultado === "defecto_uterino") return { comentario_hsg: "Alteración cavidad uterina", hsg_factor: 0.3 };
  return {};
};

export const evaluateOtb = (
  tiene_otb: boolean
): Partial<EvaluationState> => {
  if (tiene_otb) return { otb_factor: 0.0 };
  return {};
};


export const evaluateAmh = (
  amh?: number
): Partial<EvaluationState> => {
  if (amh === undefined) return { datos_faltantes: ["Hormona Antimülleriana (AMH)"] };
  if (amh > 4.0) return { diagnostico_reserva: "Alta (sugestivo de SOP)", amh_factor: 0.9 };
  if (amh >= 1.5) return { diagnostico_reserva: "Adecuada", amh_factor: 1.0 };
  if (amh >= 1.0) return { diagnostico_reserva: "Levemente disminuida", amh_factor: 0.85 };
  if (amh >= 0.5) return { diagnostico_reserva: "Baja", amh_factor: 0.6 };
  return { diagnostico_reserva: "Muy baja", amh_factor: 0.3 };
};

export const evaluateProlactin = (
  prolactina?: number
): Partial<EvaluationState> => {
  if (prolactina === undefined) return { datos_faltantes: ["Nivel de Prolactina"] };
  if (prolactina >= 25) return { comentario_prolactina: "Hiperprolactinemia", prolactina_factor: 0.6 };
  return {};
};

export const evaluateTsh = (
  tsh?: number
): Partial<EvaluationState> => {
  if (tsh === undefined) return { datos_faltantes: ["Nivel de TSH"] };
  if (tsh > 2.5) return { comentario_tsh: "No óptima para fertilidad", tsh_factor: 0.7 };
  return {};
};

export const evaluateHomaIndex = (
  homa_calculado: number | null
): Partial<EvaluationState> => {
  if (homa_calculado === null) return { datos_faltantes: ["Índice HOMA"] };
  if (homa_calculado >= 2.5) return { comentario_homa: "Resistencia a la insulina", homa_factor: 0.8 };
  return {};
};

export const evaluateMaleFactor = (
  input: UserInput
): Partial<EvaluationState> => {
  const { concentracion_esperm, motilidad_progresiva, morfologia_normal } = input;
  if (concentracion_esperm === undefined || motilidad_progresiva === undefined || morfologia_normal === undefined) {
    return { datos_faltantes: ["Espermatograma completo"] };
  }

  const alteraciones: { factor: number; diagnostico: string }[] = [];
  if (concentracion_esperm < 15) alteraciones.push({ factor: 0.7, diagnostico: "Oligozoospermia" });
  if (motilidad_progresiva < 32) alteraciones.push({ factor: 0.85, diagnostico: "Astenozoospermia" });
  if (morfologia_normal < 4) alteraciones.push({ factor: 0.5, diagnostico: "Teratozoospermia" });

  if (alteraciones.length > 0) {
    const peorAlteracion = alteraciones.reduce((min, current) => current.factor < min.factor ? current : min, alteraciones[0]);
    const diagnosticos = alteraciones.map(a => a.diagnostico).join(', ');
    return { male_factor: peorAlteracion.factor, diagnostico_masculino_detallado: diagnosticos };
  }

  return { diagnostico_masculino_detallado: "Parámetros normales", male_factor: 1.0 };
};