/**
 * Este archivo define todas las interfaces y tipos de datos clave
 * para la lógica de la calculadora, basados en el modelo de Python.
 */

// 1. UserInput: Define todos los datos crudos que se recogen del formulario.
export interface UserInput {
  // Perfil Básico
  edad: number;
  imc: number | null;
  duracion_ciclo?: number;
  
  // Historial Clínico
  tiene_sop: boolean;
  grado_endometriosis: number; // 0 para no, 1-4 para los grados
  tiene_miomas: boolean;
  mioma_submucoso: boolean;
  mioma_intramural_significativo: boolean;
  mioma_subseroso_grande: boolean;
  tipo_adenomiosis: string; // 'focal', 'diffuse', o ''
  tipo_polipo: string; // 'pequeno_unico', etc. o ''
  resultado_hsg: string; // 'normal', 'unilateral', 'bilateral', 'defecto_uterino'
  tiene_otb: boolean;
  
  // Laboratorio
  amh?: number;
  prolactina?: number;
  tsh?: number;
  tpo_ab_positivo: boolean;
  insulina_ayunas?: number;
  glicemia_ayunas?: number;
  homaIr?: number; 
  
  // Factor Masculino
  volumen_seminal?: number;
  concentracion_esperm?: number;
  motilidad_progresiva?: number;
  morfologia_normal?: number;
  vitalidad_esperm?: number;
}

// 2. EvaluationState: Representa el objeto que se va modificando durante el cálculo.
//    Es el equivalente a la clase EvaluacionFertilidad en Python.
export interface EvaluationState extends UserInput {
  // Atributos de Salida (se inicializan y luego se calculan)
  
  // Probabilidad y Factores
  probabilidad_base_edad_num: number;
  imc_factor: number;
  ciclo_factor: number;
  sop_factor: number;
  endometriosis_factor: number;
  mioma_factor: number;
  adenomiosis_factor: number;
  polipo_factor: number;
  hsg_factor: number;
  otb_factor: number;
  amh_factor: number;
  prolactina_factor: number;
  tsh_factor: number;
  homa_factor: number;
  male_factor: number;
  pronostico_numerico: number; // El resultado final en %
  
  // Textos y Diagnósticos
  diagnostico_potencial_edad: string;
  comentario_imc: string;
  comentario_ciclo: string;
  severidad_sop: string;
  comentario_endometriosis: string;
  comentario_miomas: string;
  comentario_adenomiosis: string;
  comentario_polipo: string;
  comentario_hsg: string;
  diagnostico_reserva: string;
  comentario_prolactina: string;
  comentario_tsh: string;
  homa_calculado: number | null;
  comentario_homa: string;
  diagnostico_masculino_detallado: string;
  datos_faltantes: string[];
  
  // Informe Final para la UI
  pronostico_categoria: string; // 'BUENO', 'MODERADO', 'BAJO'
  pronostico_emoji: string; // 🟢, 🟡, 🔴
  pronostico_frase: string;
  benchmark_frase: string;
  recomendaciones_lista: string[];
  insights_clinicos: string[];
}