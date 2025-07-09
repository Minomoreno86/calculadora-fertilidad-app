// Tipos de String Literal para máxima seguridad
export type MyomaType = 'none' | 'submucosal' | 'intramural_large' | 'subserosal';
export type AdenomyosisType = 'none' | 'focal' | 'diffuse';
export type PolypType = 'none' | 'small' | 'large' | 'ostium';
export type HsgResult = 'normal' | 'unilateral' | 'bilateral' | 'malformacion' | 'unknown';

// Interfaz con los datos crudos del usuario
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

// **TIPO EXPORTADO AÑADIDO**
// Contiene todos los factores numéricos que modifican la probabilidad.
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

// **TIPO EXPORTADO AÑADIDO**
// Contiene todos los textos y comentarios generados durante la evaluación.
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

// **TIPO EXPORTADO AÑADIDO**
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

// La interfaz principal ahora usa los tipos anidados.
export interface EvaluationState {
  input: UserInput;
  factors: Factors;
  diagnostics: Diagnostics;
  report: Report;
}