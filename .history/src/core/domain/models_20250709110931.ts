// ===================================================================
// TIPOS ESPECÍFICOS PARA CAMPOS DEL FORMULARIO
// ===================================================================

export type MyomaType = 'none' | 'submucosal' | 'intramural_large' | 'subserosal';
export type AdenomyosisType = 'none' | 'focal' | 'diffuse';
export type PolypType = 'none' | 'small' | 'large' | 'ostium';
export type HsgResult = 'unknown' | 'normal' | 'unilateral' | 'bilateral' | 'malformacion';

// ===================================================================
// INTERFACES PRINCIPALES DE DATOS
// ===================================================================

// Contiene los datos crudos que el usuario introduce.
export interface UserInput {
  age: number;
  bmi: number | null;
  cycleDuration?: number;
  infertilityDuration?: number;
  hasPcos: boolean;
  endometriosisGrade: number;
  myomaType: MyomaType;
  adenomyosisType: AdenomyosisType;
  polypType: PolypType;
  hsgResult: HsgResult;
  hasOtb: boolean;
  hasPelvicSurgery?: boolean;
  pelvicSurgeriesNumber?: number;
  amh?: number;
  prolactin?: number;
  tsh?: number;
  tpoAbPositive: boolean;
  homaIr?: number;
  spermConcentration?: number;
  spermProgressiveMotility?: number;
  spermNormalMorphology?: number;
}

// Contiene todos los factores numéricos calculados.
export interface Factors {
  baseAgeProbability: number;
  bmi: number;
  cycle: number;
  pcos: number;
  endometriosis: number;
  myoma: number;
  adenomyosis: number;
  polyp: number;
  hsg: number;
  otb: number;
  amh: number;
  prolactin: number;
  tsh: number;
  homa: number;
  male: number;
  infertilityDuration: number;
  pelvicSurgery: number;
}

// Contiene todos los textos y comentarios de diagnóstico.
export interface Diagnostics {
  agePotential: string;
  bmiComment: string;
  cycleComment: string;
  pcosSeverity: string;
  endometriosisComment: string;
  myomaComment: string;
  adenomyosisComment: string;
  polypComment: string;
  hsgComment: string;
  ovarianReserve: string;
  prolactinComment: string;
  tshComment: string;
  homaComment: string;
  maleFactorDetailed: string;
  missingData: string[];
}

// Contiene los resultados finales formateados para la UI.
export interface Report {
  numericPrognosis: number;
  category: 'BUENO' | 'MODERADO' | 'BAJO' | 'ERROR';
  emoji: string;
  prognosisPhrase: string;
  benchmarkPhrase: string;
  recommendations: string[];
  clinicalInsights: string[];
}

// Interfaz principal que agrupa todos los datos de la evaluación.
export interface EvaluationState {
  input: UserInput;
  factors: Factors;
  diagnostics: Diagnostics;
  report: Report;
}
export type SimulatableFactor = keyof Omit<Factors, 'baseAgeProbability'>;