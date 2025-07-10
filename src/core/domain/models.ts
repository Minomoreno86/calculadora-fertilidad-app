// ===================================================================
// TIPOS ESPECÍFICOS Y DE AYUDA
// ===================================================================

export type MyomaType = 'none' | 'submucosal' | 'intramural_large' | 'subserosal';
export type AdenomyosisType = 'none' | 'focal' | 'diffuse';
export type PolypType = 'none' | 'small' | 'large' | 'ostium';
export type HsgResult = 'unknown' | 'normal' | 'unilateral' | 'bilateral' | 'malformacion';
export type SimulatableFactor = keyof Omit<Factors, 'baseAgeProbability'>;
export type TreatmentCategory = 'Optimización Médica' | 'Baja Complejidad' | 'Alta Complejidad' | 'Estudio Adicional';

export interface ClinicalFinding {
  key: string;
  title: string;
  explanation: string;
  recommendations: string[];
}

export interface TreatmentSuggestion {
  category: TreatmentCategory;
  title: string;
  details: string;
  source: string;
}

// ===================================================================
// INTERFACES PRINCIPALES DE DATOS
// ===================================================================

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
  semenVolume?: number;
}

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

export interface Report {
  numericPrognosis: number;
  category: 'BUENO' | 'MODERADO' | 'BAJO' | 'ERROR';
  emoji: string;
  prognosisPhrase: string;
  benchmarkPhrase: string;
  clinicalInsights: ClinicalFinding[];
}

export interface EvaluationState {
  input: UserInput;
  factors: Factors;
  diagnostics: Diagnostics;
  report: Report;
}
export interface SimulationResult {
  factor: SimulatableFactor | 'all';
  explanation: string;
  originalPrognosis: number;
  newPrognosis: number;
  improvement: number;
}