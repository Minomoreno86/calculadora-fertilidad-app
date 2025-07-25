/**
 * 🔬 PATHOLOGY ANALYZER V12.0 - ANALIZADOR AVANZADO DE PATOLOGÍAS
 * 
 * Sistema especializado en análisis automático de patologías reproductivas
 * usando inteligencia artificial y criterios diagnósticos validados.
 * 
 * CARACTERÍSTICAS V12.0:
 * - Detección automática de PCOS, endometriosis, factor masculino
 * - Análisis probabilístico multi-factorial
 * - Integración con criterios diagnósticos internacionales  
 * - Score de confianza basado en evidencia
 * - Recomendaciones de estudios complementarios
 */

import { UserInput } from '../models';

// ===================================================================
// 🎯 INTERFACES PARA ANÁLISIS DE PATOLOGÍAS
// ===================================================================

export type SeverityLevel = 'mild' | 'moderate' | 'severe' | 'unknown';
export type InterpretationLevel = 'normal' | 'elevated' | 'decreased' | 'critical';
export type UrgencyLevel = 'low' | 'medium' | 'high' | 'urgent';
export type CostLevel = 'low' | 'medium' | 'high';
export type EvidenceLevel = 'A' | 'B' | 'C' | 'D';
export type TestCategory = 'laboratory' | 'imaging' | 'biopsy' | 'functional';
export type AnalysisType = 'diagnostic' | 'prognostic' | 'therapeutic';

export interface PathologyAnalysisResult {
  pathologyId: string;
  name: string;
  probability: number; // 0-1
  confidence: number; // 0-1
  severity: SeverityLevel;
  supportingCriteria: DiagnosticCriterion[];
  missingSriteria: DiagnosticCriterion[];
  recommendedTests: RecommendedTest[];
  clinicalSignificance: string;
  treatmentUrgency: UrgencyLevel;
}

export interface DiagnosticCriterion {
  criterionId: string;
  name: string;
  met: boolean;
  value?: number;
  normalRange?: string;
  weight: number; // Importancia del criterio (0-1)
  source: string; // Guía clínica de referencia
}

export interface RecommendedTest {
  testId: string;
  name: string;
  priority: number; // 1-5
  rationale: string;
  expectedCost: CostLevel;
  timeframe: string;
  category: TestCategory;
}

export interface PathologyPattern {
  patternId: string;
  name: string;
  requiredCriteria: string[];
  optionalCriteria: string[];
  exclusionCriteria: string[];
  minimumScore: number;
}

export interface BiomarkerAnalysis {
  biomarkerId: string;
  name: string;
  value: number;
  normalRange: { min: number; max: number };
  interpretation: InterpretationLevel;
  clinicalRelevance: string;
  associatedPathologies: string[];
}

// ===================================================================
// 🔬 PATHOLOGY ANALYZER CLASS
// ===================================================================

export class PathologyAnalyzer {
  private readonly pathologyPatterns: Map<string, PathologyPattern> = new Map();
  private readonly diagnosticCriteria: Map<string, DiagnosticCriterion[]> = new Map();
  private readonly biomarkerRanges: Map<string, { min: number; max: number }> = new Map();

  constructor() {
    this.initializePathologyPatterns();
    this.initializeDiagnosticCriteria();
    this.initializeBiomarkerRanges();
  }

  /**
   * Análisis completo de patologías para un UserInput
   */
  analyzePathologies(userInput: UserInput): PathologyAnalysisResult[] {
    const results: PathologyAnalysisResult[] = [];

    // 1. Análisis de PCOS
    const pcosAnalysis = this.analyzePCOS(userInput);
    if (pcosAnalysis.probability > 0.1) {
      results.push(pcosAnalysis);
    }

    // 2. Análisis de Endometriosis
    const endoAnalysis = this.analyzeEndometriosis(userInput);
    if (endoAnalysis.probability > 0.1) {
      results.push(endoAnalysis);
    }

    // 3. Análisis de Factor Masculino
    const maleAnalysis = this.analyzeMaleFactor(userInput);
    if (maleAnalysis.probability > 0.1) {
      results.push(maleAnalysis);
    }

    // 4. Análisis de Reserva Ovárica Disminuida
    const ovarianAnalysis = this.analyzeOvarianReserve(userInput);
    if (ovarianAnalysis.probability > 0.1) {
      results.push(ovarianAnalysis);
    }

    // 5. Análisis de Factor Metabólico
    const metabolicAnalysis = this.analyzeMetabolicFactors(userInput);
    if (metabolicAnalysis.probability > 0.1) {
      results.push(metabolicAnalysis);
    }

    // 6. Análisis de Factor Tubarico
    const tubalAnalysis = this.analyzeTubalFactor(userInput);
    if (tubalAnalysis.probability > 0.1) {
      results.push(tubalAnalysis);
    }

    return results.sort((a, b) => b.probability - a.probability);
  }

  /**
   * Análisis de biomarcadores específicos
   */
  analyzeBiomarkers(userInput: UserInput): BiomarkerAnalysis[] {
    const analyses: BiomarkerAnalysis[] = [];

    // AMH Analysis
    if (userInput.amh !== undefined) {
      analyses.push(this.analyzeAMH(userInput.amh));
    }

    // HOMA-IR Analysis
    if (userInput.homaIr !== undefined) {
      analyses.push(this.analyzeHOMAIR(userInput.homaIr));
    }

    // TSH Analysis
    if (userInput.tsh !== undefined) {
      analyses.push(this.analyzeTSH(userInput.tsh));
    }

    // Prolactin Analysis
    if (userInput.prolactin !== undefined) {
      analyses.push(this.analyzeProlactin(userInput.prolactin));
    }

    return analyses;
  }

  // ===================================================================
  // 🔬 ANÁLISIS ESPECÍFICOS POR PATOLOGÍA
  // ===================================================================

  private assessOligoovulation(userInput: UserInput): { criterion: DiagnosticCriterion | null } {
    const criterion: DiagnosticCriterion = {
      criterionId: 'PCOS_OLIGOOVULATION',
      name: 'Oligo/anovulación',
      met: false,
      weight: 0.35,
      source: 'Rotterdam Consensus 2003'
    };

    if (userInput.cycleDuration && userInput.cycleDuration > 35) {
      criterion.met = true;
      criterion.value = userInput.cycleDuration;
      criterion.normalRange = '24-32 días';
      return { criterion };
    }

    return { criterion: null };
  }

  private assessHyperandrogenism(userInput: UserInput): { criterion: DiagnosticCriterion | null } {
    const criterion: DiagnosticCriterion = {
      criterionId: 'PCOS_HYPERANDROGENISM',
      name: 'Hiperandrogenismo (clínico o bioquímico)',
      met: userInput.hasPcos,
      weight: 0.35,
      source: 'Rotterdam Consensus 2003'
    };

    return criterion.met ? { criterion } : { criterion: null };
  }

  private assessPCOSAdditionalFactors(userInput: UserInput): { supportingCriteria: DiagnosticCriterion[]; additionalScore: number } {
    const supportingCriteria: DiagnosticCriterion[] = [];
    let additionalScore = 0;

    if (userInput.bmi && userInput.bmi > 25) {
      supportingCriteria.push({
        criterionId: 'PCOS_BMI',
        name: 'BMI elevado',
        met: true,
        value: userInput.bmi,
        normalRange: '18.5-25',
        weight: 0.15,
        source: 'Clinical correlation'
      });
      additionalScore += 0.10;
    }

    if (userInput.homaIr && userInput.homaIr > 2.5) {
      supportingCriteria.push({
        criterionId: 'PCOS_IR',
        name: 'Resistencia insulínica',
        met: true,
        value: userInput.homaIr,
        normalRange: '<2.5',
        weight: 0.20,
        source: 'Endocrine Society'
      });
      additionalScore += 0.15;
    }

    return { supportingCriteria, additionalScore };
  }

  private calculatePCOSSeverity(userInput: UserInput): SeverityLevel {
    if (!userInput.hasPcos) return 'unknown';

    const complexityFactors = [
      userInput.bmi && userInput.bmi > 30,
      userInput.homaIr && userInput.homaIr > 3.5,
      userInput.cycleDuration && userInput.cycleDuration > 60
    ].filter(Boolean).length;

    if (complexityFactors >= 2) return 'severe';
    if (complexityFactors === 1) return 'moderate';
    return 'mild';
  }

  private assessEndometriosisFactors(userInput: UserInput): { supportingCriteria: DiagnosticCriterion[]; additionalScore: number } {
    const supportingCriteria: DiagnosticCriterion[] = [];
    let additionalScore = 0;

    if (userInput.endometriosisGrade > 0) {
      supportingCriteria.push({
        criterionId: 'ENDO_GRADE',
        name: 'Endometriosis diagnosticada',
        met: true,
        value: userInput.endometriosisGrade,
        normalRange: '0 (ausente)',
        weight: 1.0,
        source: 'ASRM Classification'
      });
      additionalScore = 0.2 + (userInput.endometriosisGrade * 0.2);
    }

    if (userInput.infertilityDuration && userInput.infertilityDuration > 24) {
      supportingCriteria.push({
        criterionId: 'ENDO_INFERTILITY',
        name: 'Infertilidad prolongada',
        met: true,
        value: userInput.infertilityDuration,
        normalRange: '<12 meses',
        weight: 0.25,
        source: 'Clinical correlation'
      });
      additionalScore += 0.15;
    }

    if (userInput.age >= 25 && userInput.age <= 40) {
      supportingCriteria.push({
        criterionId: 'ENDO_AGE',
        name: 'Edad reproductiva típica',
        met: true,
        value: userInput.age,
        weight: 0.15,
        source: 'Epidemiological data'
      });
      additionalScore += 0.08;
    }

    return { supportingCriteria, additionalScore };
  }

  private calculateEndometriosisSeverity(userInput: UserInput): SeverityLevel {
    if (userInput.endometriosisGrade > 0) {
      if (userInput.endometriosisGrade >= 3) return 'severe';
      if (userInput.endometriosisGrade === 2) return 'moderate';
      return 'mild';
    }
    return 'unknown';
  }

  private assessSpermConcentration(userInput: UserInput): { criterion: DiagnosticCriterion | null; score: number } {
    if (userInput.spermConcentration === undefined) {
      return { criterion: null, score: 0 };
    }

    const criterion: DiagnosticCriterion = {
      criterionId: 'MALE_CONCENTRATION',
      name: 'Concentración espermática',
      met: userInput.spermConcentration < 15,
      value: userInput.spermConcentration,
      normalRange: '≥15 millones/mL',
      weight: 0.35,
      source: 'WHO Manual 2021'
    };

    if (!criterion.met) {
      return { criterion: null, score: 0 };
    }

    let score = 0.20; // Default score
    if (userInput.spermConcentration < 5) score = 0.40;
    else if (userInput.spermConcentration < 10) score = 0.30;

    return { criterion, score };
  }

  private assessSpermMotility(userInput: UserInput): { criterion: DiagnosticCriterion | null; score: number } {
    if (userInput.spermProgressiveMotility === undefined) {
      return { criterion: null, score: 0 };
    }

    const criterion: DiagnosticCriterion = {
      criterionId: 'MALE_MOTILITY',
      name: 'Motilidad progresiva',
      met: userInput.spermProgressiveMotility < 32,
      value: userInput.spermProgressiveMotility,
      normalRange: '≥32%',
      weight: 0.30,
      source: 'WHO Manual 2021'
    };

    if (!criterion.met) {
      return { criterion: null, score: 0 };
    }

    const score = userInput.spermProgressiveMotility < 20 ? 0.25 : 0.15;
    return { criterion, score };
  }

  private assessSpermMorphology(userInput: UserInput): { criterion: DiagnosticCriterion | null; score: number } {
    if (userInput.spermNormalMorphology === undefined) {
      return { criterion: null, score: 0 };
    }

    const criterion: DiagnosticCriterion = {
      criterionId: 'MALE_MORPHOLOGY',
      name: 'Morfología normal',
      met: userInput.spermNormalMorphology < 4,
      value: userInput.spermNormalMorphology,
      normalRange: '≥4%',
      weight: 0.25,
      source: 'WHO Manual 2021'
    };

    return criterion.met ? { criterion, score: 0.10 } : { criterion: null, score: 0 };
  }

  private calculateMaleFactorSeverity(abnormalParameters: number): SeverityLevel {
    if (abnormalParameters >= 3) return 'severe';
    if (abnormalParameters === 2) return 'moderate';
    if (abnormalParameters === 1) return 'mild';
    return 'unknown';
  }

  private getMaleFactorMissingCriteria(userInput: UserInput): DiagnosticCriterion[] {
    const missing: DiagnosticCriterion[] = [];

    if (userInput.spermConcentration === undefined) {
      missing.push({
        criterionId: 'MALE_CONCENTRATION',
        name: 'Concentración espermática',
        met: false,
        normalRange: '≥15 millones/mL',
        weight: 0.35,
        source: 'WHO Manual 2021'
      });
    }

    if (userInput.spermProgressiveMotility === undefined) {
      missing.push({
        criterionId: 'MALE_MOTILITY',
        name: 'Motilidad progresiva',
        met: false,
        normalRange: '≥32%',
        weight: 0.30,
        source: 'WHO Manual 2021'
      });
    }

    return missing;
  }

  private assessOvarianReserveAge(userInput: UserInput): { criterion: DiagnosticCriterion | null; score: number } {
    if (userInput.age >= 40) {
      const criterion: DiagnosticCriterion = {
        criterionId: 'DOR_AGE_40',
        name: 'Edad ≥40 años',
        met: true,
        value: userInput.age,
        weight: 0.40,
        source: 'ASRM Guidelines'
      };
      return { criterion, score: 0.60 };
    }

    if (userInput.age >= 35) {
      const criterion: DiagnosticCriterion = {
        criterionId: 'DOR_AGE_35',
        name: 'Edad ≥35 años',
        met: true,
        value: userInput.age,
        weight: 0.25,
        source: 'ASRM Guidelines'
      };
      return { criterion, score: 0.25 };
    }

    return { criterion: null, score: 0 };
  }

  private assessOvarianReserveAMH(userInput: UserInput): { criterion: DiagnosticCriterion | null; score: number } {
    if (userInput.amh === undefined) {
      return { criterion: null, score: 0 };
    }

    if (userInput.amh < 0.5) {
      const criterion: DiagnosticCriterion = {
        criterionId: 'DOR_AMH_SEVERE',
        name: 'AMH muy baja (<0.5 ng/mL)',
        met: true,
        value: userInput.amh,
        normalRange: '1-4 ng/mL',
        weight: 0.50,
        source: 'ESHRE Guidelines'
      };
      return { criterion, score: 0.70 };
    }

    if (userInput.amh < 1.0) {
      const criterion: DiagnosticCriterion = {
        criterionId: 'DOR_AMH_LOW',
        name: 'AMH baja (<1.0 ng/mL)',
        met: true,
        value: userInput.amh,
        normalRange: '1-4 ng/mL',
        weight: 0.40,
        source: 'ESHRE Guidelines'
      };
      return { criterion, score: 0.45 };
    }

    return { criterion: null, score: 0 };
  }

  private calculateOvarianReserveSeverity(userInput: UserInput): SeverityLevel {
    if (userInput.amh !== undefined) {
      if (userInput.amh < 0.5) return 'severe';
      if (userInput.amh < 1.0) return 'moderate';
      if (userInput.amh < 1.5) return 'mild';
    } else if (userInput.age >= 42) {
      return 'severe';
    } else if (userInput.age >= 40) {
      return 'moderate';
    }
    return 'unknown';
  }

  private getOvarianReserveMissingCriteria(userInput: UserInput): DiagnosticCriterion[] {
    const missing: DiagnosticCriterion[] = [];

    if (userInput.amh === undefined) {
      missing.push({
        criterionId: 'DOR_AMH',
        name: 'Hormona Antimülleriana (AMH)',
        met: false,
        normalRange: '1-4 ng/mL',
        weight: 0.50,
        source: 'Laboratory test'
      });
    }

    return missing;
  }

  private assessMetabolicBMI(userInput: UserInput): { criterion: DiagnosticCriterion | null; score: number } {
    if (!userInput.bmi) {
      return { criterion: null, score: 0 };
    }

    if (userInput.bmi >= 30) {
      const criterion: DiagnosticCriterion = {
        criterionId: 'METABOLIC_OBESITY',
        name: 'Obesidad (BMI ≥30)',
        met: true,
        value: userInput.bmi,
        normalRange: '18.5-25',
        weight: 0.40,
        source: 'WHO Classification'
      };
      return { criterion, score: 0.35 };
    }

    if (userInput.bmi >= 25) {
      const criterion: DiagnosticCriterion = {
        criterionId: 'METABOLIC_OVERWEIGHT',
        name: 'Sobrepeso (BMI 25-30)',
        met: true,
        value: userInput.bmi,
        normalRange: '18.5-25',
        weight: 0.25,
        source: 'WHO Classification'
      };
      return { criterion, score: 0.20 };
    }

    return { criterion: null, score: 0 };
  }

  private assessInsulinResistance(userInput: UserInput): { criterion: DiagnosticCriterion | null; score: number } {
    if (!userInput.homaIr || userInput.homaIr <= 2.5) {
      return { criterion: null, score: 0 };
    }

    const criterion: DiagnosticCriterion = {
      criterionId: 'METABOLIC_IR',
      name: 'Resistencia insulínica',
      met: true,
      value: userInput.homaIr,
      normalRange: '<2.5',
      weight: 0.35,
      source: 'Endocrine Society'
    };

    const score = userInput.homaIr > 3.5 ? 0.40 : 0.25;
    return { criterion, score };
  }

  private calculateMetabolicSeverity(userInput: UserInput): SeverityLevel {
    if (!userInput.bmi || !userInput.homaIr) return 'unknown';

    const bmiBurden = this.calculateBMIBurden(userInput.bmi);
    const insulinBurden = this.calculateInsulinBurden(userInput.homaIr);
    const totalBurden = bmiBurden + insulinBurden;

    if (totalBurden >= 3) return 'severe';
    if (totalBurden >= 2) return 'moderate';
    if (totalBurden >= 1) return 'mild';
    return 'unknown';
  }

  private calculateBMIBurden(bmi: number): number {
    if (bmi > 35) return 2;
    if (bmi > 30) return 1;
    return 0;
  }

  private calculateInsulinBurden(homaIr: number): number {
    if (homaIr > 3.5) return 2;
    if (homaIr > 2.5) return 1;
    return 0;
  }

  private analyzePCOS(userInput: UserInput): PathologyAnalysisResult {
    const supportingCriteria: DiagnosticCriterion[] = [];
    let probabilityScore = 0;

    // Rotterdam Criteria Assessment
    const oligoovulationResult = this.assessOligoovulation(userInput);
    if (oligoovulationResult.criterion) {
      if (oligoovulationResult.criterion.met) {
        supportingCriteria.push(oligoovulationResult.criterion);
        probabilityScore += 0.35;
      }
    }

    const hyperandrogenismResult = this.assessHyperandrogenism(userInput);
    if (hyperandrogenismResult.criterion) {
      if (hyperandrogenismResult.criterion.met) {
        supportingCriteria.push(hyperandrogenismResult.criterion);
        probabilityScore += 0.35;
      }
    }

    // Additional supporting factors
    const additionalFactors = this.assessPCOSAdditionalFactors(userInput);
    supportingCriteria.push(...additionalFactors.supportingCriteria);
    probabilityScore += additionalFactors.additionalScore;

    const severity = this.calculatePCOSSeverity(userInput);

    return {
      pathologyId: 'PCOS',
      name: 'Síndrome de Ovario Poliquístico',
      probability: Math.min(probabilityScore, 0.95),
      confidence: supportingCriteria.length / (supportingCriteria.length + 1), // +1 for morphology
      severity,
      supportingCriteria,
      missingSriteria: [{
        criterionId: 'PCOS_MORPHOLOGY',
        name: 'Morfología ovárica poliquística (≥12 folículos 2-9mm)',
        met: false,
        weight: 0.30,
        source: 'Rotterdam Consensus 2003'
      }],
      recommendedTests: this.getPCOSRecommendedTests(userInput),
      clinicalSignificance: 'Causa principal de anovulación crónica e infertilidad',
      treatmentUrgency: severity === 'severe' ? 'high' : 'medium'
    };
  }

  private analyzeEndometriosis(userInput: UserInput): PathologyAnalysisResult {
    const supportingCriteria: DiagnosticCriterion[] = [];
    let probabilityScore = 0.06; // Prevalencia basal

    const endometriosisFactors = this.assessEndometriosisFactors(userInput);
    supportingCriteria.push(...endometriosisFactors.supportingCriteria);
    probabilityScore += endometriosisFactors.additionalScore;

    const severity = this.calculateEndometriosisSeverity(userInput);

    return {
      pathologyId: 'ENDOMETRIOSIS',
      name: 'Endometriosis',
      probability: Math.min(probabilityScore, 0.85),
      confidence: supportingCriteria.length > 0 ? 0.75 : 0.30,
      severity,
      supportingCriteria,
      missingSriteria: [
        {
          criterionId: 'ENDO_DYSMENORRHEA',
          name: 'Dismenorrea severa',
          met: false,
          weight: 0.30,
          source: 'Clinical symptoms'
        },
        {
          criterionId: 'ENDO_IMAGING',
          name: 'Quistes endometriósicos en ecografía',
          met: false,
          weight: 0.40,
          source: 'Imaging studies'
        }
      ],
      recommendedTests: this.getEndometriosisRecommendedTests(),
      clinicalSignificance: 'Causa importante de infertilidad y dolor pélvico',
      treatmentUrgency: severity === 'severe' ? 'high' : 'medium'
    };
  }

  private analyzeMaleFactor(userInput: UserInput): PathologyAnalysisResult {
    const supportingCriteria: DiagnosticCriterion[] = [];
    let probabilityScore = 0;

    // WHO 2021 Reference Values Assessment
    const concentrationResult = this.assessSpermConcentration(userInput);
    if (concentrationResult.criterion) {
      supportingCriteria.push(concentrationResult.criterion);
      probabilityScore += concentrationResult.score;
    }

    const motilityResult = this.assessSpermMotility(userInput);
    if (motilityResult.criterion) {
      supportingCriteria.push(motilityResult.criterion);
      probabilityScore += motilityResult.score;
    }

    const morphologyResult = this.assessSpermMorphology(userInput);
    if (morphologyResult.criterion) {
      supportingCriteria.push(morphologyResult.criterion);
      probabilityScore += morphologyResult.score;
    }

    const severity = this.calculateMaleFactorSeverity(supportingCriteria.length);
    const missingCriteria = this.getMaleFactorMissingCriteria(userInput);

    return {
      pathologyId: 'MALE_FACTOR',
      name: 'Factor Masculino de Infertilidad',
      probability: Math.min(probabilityScore, 0.95),
      confidence: supportingCriteria.length > 0 ? 0.90 : 0.20,
      severity,
      supportingCriteria,
      missingSriteria: missingCriteria,
      recommendedTests: this.getMaleFactorRecommendedTests(userInput),
      clinicalSignificance: 'Factor contribuyente en 30-40% de casos de infertilidad',
      treatmentUrgency: severity === 'severe' ? 'high' : 'medium'
    };
  }

  private analyzeOvarianReserve(userInput: UserInput): PathologyAnalysisResult {
    const supportingCriteria: DiagnosticCriterion[] = [];
    let probabilityScore = 0;

    // Age assessment
    const ageResult = this.assessOvarianReserveAge(userInput);
    if (ageResult.criterion) {
      supportingCriteria.push(ageResult.criterion);
      probabilityScore += ageResult.score;
    }

    // AMH assessment
    const amhResult = this.assessOvarianReserveAMH(userInput);
    if (amhResult.criterion) {
      supportingCriteria.push(amhResult.criterion);
      probabilityScore += amhResult.score;
    }

    const severity = this.calculateOvarianReserveSeverity(userInput);
    const missingCriteria = this.getOvarianReserveMissingCriteria(userInput);

    return {
      pathologyId: 'DIMINISHED_OVARIAN_RESERVE',
      name: 'Reserva Ovárica Disminuida',
      probability: Math.min(probabilityScore, 0.95),
      confidence: supportingCriteria.length > 0 ? 0.85 : 0.30,
      severity,
      supportingCriteria,
      missingSriteria: missingCriteria,
      recommendedTests: this.getOvarianReserveRecommendedTests(userInput),
      clinicalSignificance: 'Factor limitante principal para éxito reproductivo',
      treatmentUrgency: severity === 'severe' ? 'urgent' : 'high'
    };
  }

  private analyzeMetabolicFactors(userInput: UserInput): PathologyAnalysisResult {
    const supportingCriteria: DiagnosticCriterion[] = [];
    let probabilityScore = 0;

    // BMI assessment
    const bmiResult = this.assessMetabolicBMI(userInput);
    if (bmiResult.criterion) {
      supportingCriteria.push(bmiResult.criterion);
      probabilityScore += bmiResult.score;
    }

    // Insulin resistance assessment
    const insulinResult = this.assessInsulinResistance(userInput);
    if (insulinResult.criterion) {
      supportingCriteria.push(insulinResult.criterion);
      probabilityScore += insulinResult.score;
    }

    const severity = this.calculateMetabolicSeverity(userInput);

    return {
      pathologyId: 'METABOLIC_FACTOR',
      name: 'Factor Metabólico',
      probability: Math.min(probabilityScore, 0.85),
      confidence: supportingCriteria.length > 0 ? 0.80 : 0.25,
      severity,
      supportingCriteria,
      missingSriteria: [],
      recommendedTests: this.getMetabolicRecommendedTests(userInput),
      clinicalSignificance: 'Factor modificable que impacta significativamente la fertilidad',
      treatmentUrgency: severity === 'severe' ? 'high' : 'medium'
    };
  }

  private analyzeTubalFactor(userInput: UserInput): PathologyAnalysisResult {
    const supportingCriteria: DiagnosticCriterion[] = [];
    let probabilityScore = 0.08; // Prevalencia basal

    // Factor tubárico conocido
    if (userInput.hasOtb) {
      supportingCriteria.push({
        criterionId: 'TUBAL_OTB',
        name: 'Oclusión tubárica bilateral',
        met: true,
        weight: 1.0,
        source: 'Medical history'
      });
      probabilityScore = 0.95;
    }

    // Cirugía pélvica previa
    if (userInput.hasPelvicSurgery) {
      supportingCriteria.push({
        criterionId: 'TUBAL_SURGERY',
        name: 'Cirugía pélvica previa',
        met: true,
        value: userInput.pelvicSurgeriesNumber,
        weight: 0.30,
        source: 'Medical history'
      });
      probabilityScore += 0.20;
    }

    // Endometriosis severa (riesgo de adherencias)
    if (userInput.endometriosisGrade >= 3) {
      supportingCriteria.push({
        criterionId: 'TUBAL_ENDO',
        name: 'Endometriosis severa',
        met: true,
        value: userInput.endometriosisGrade,
        weight: 0.25,
        source: 'Clinical correlation'
      });
      probabilityScore += 0.15;
    }

    let severity: SeverityLevel = 'unknown';
    if (userInput.hasOtb) {
      severity = 'severe';
    } else if (userInput.endometriosisGrade >= 3 && userInput.hasPelvicSurgery) {
      severity = 'moderate';
    } else if (userInput.hasPelvicSurgery || userInput.endometriosisGrade >= 2) {
      severity = 'mild';
    }

    return {
      pathologyId: 'TUBAL_FACTOR',
      name: 'Factor Tubárico',
      probability: Math.min(probabilityScore, 0.95),
      confidence: supportingCriteria.length > 0 ? 0.85 : 0.30,
      severity,
      supportingCriteria,
      missingSriteria: [
        {
          criterionId: 'TUBAL_HSG',
          name: 'Histerosalpingografía',
          met: false,
          weight: 0.60,
          source: 'Imaging study'
        }
      ],
      recommendedTests: this.getTubalRecommendedTests(),
      clinicalSignificance: 'Factor tubárico requiere técnicas de reproducción asistida',
      treatmentUrgency: severity === 'severe' ? 'high' : 'medium'
    };
  }

  // ===================================================================
  // 🔬 ANÁLISIS DE BIOMARCADORES
  // ===================================================================

  private analyzeAMH(amhValue: number): BiomarkerAnalysis {
    let interpretation: InterpretationLevel;
    let clinicalRelevance: string;
    let associatedPathologies: string[];

    if (amhValue < 0.5) {
      interpretation = 'critical';
      clinicalRelevance = 'Reserva ovárica severamente disminuida';
      associatedPathologies = ['Reserva ovárica disminuida', 'Falla ovárica precoz'];
    } else if (amhValue < 1.0) {
      interpretation = 'decreased';
      clinicalRelevance = 'Reserva ovárica baja';
      associatedPathologies = ['Reserva ovárica disminuida', 'Falla ovárica precoz'];
    } else if (amhValue <= 4.0) {
      interpretation = 'normal';
      clinicalRelevance = 'Reserva ovárica normal';
      associatedPathologies = [];
    } else {
      interpretation = 'elevated';
      clinicalRelevance = 'Posible PCOS o reserva ovárica alta';
      associatedPathologies = ['PCOS', 'Tumor células granulosa'];
    }

    return {
      biomarkerId: 'AMH',
      name: 'Hormona Antimülleriana',
      value: amhValue,
      normalRange: { min: 1.0, max: 4.0 },
      interpretation,
      clinicalRelevance,
      associatedPathologies
    };
  }

  private analyzeHOMAIR(homaValue: number): BiomarkerAnalysis {
    let interpretation: InterpretationLevel;
    let clinicalRelevance: string;
    let associatedPathologies: string[];

    if (homaValue <= 2.5) {
      interpretation = 'normal';
      clinicalRelevance = 'Sensibilidad normal a la insulina';
      associatedPathologies = [];
    } else if (homaValue <= 3.8) {
      interpretation = 'elevated';
      clinicalRelevance = 'Resistencia insulínica leve a moderada';
      associatedPathologies = ['PCOS', 'Diabetes tipo 2', 'Síndrome metabólico', 'Obesidad'];
    } else {
      interpretation = 'critical';
      clinicalRelevance = 'Resistencia insulínica significativa';
      associatedPathologies = ['PCOS', 'Diabetes tipo 2', 'Síndrome metabólico', 'Obesidad'];
    }

    return {
      biomarkerId: 'HOMA_IR',
      name: 'HOMA-IR (Resistencia Insulínica)',
      value: homaValue,
      normalRange: { min: 0, max: 2.5 },
      interpretation,
      clinicalRelevance,
      associatedPathologies
    };
  }

  private analyzeTSH(tshValue: number): BiomarkerAnalysis {
    let interpretation: InterpretationLevel;
    let clinicalRelevance: string;
    let associatedPathologies: string[];

    if (tshValue < 0.5) {
      interpretation = 'decreased';
      clinicalRelevance = 'Posible hipertiroidismo';
      associatedPathologies = ['Hipotiroidismo', 'Hipertiroidismo', 'Enfermedad tiroidea'];
    } else if (tshValue <= 2.5) {
      interpretation = 'normal';
      clinicalRelevance = 'Función tiroidea normal para fertilidad';
      associatedPathologies = [];
    } else if (tshValue <= 4.0) {
      interpretation = 'elevated';
      clinicalRelevance = 'Hipotiroidismo subclínico';
      associatedPathologies = ['Hipotiroidismo', 'Hipertiroidismo', 'Enfermedad tiroidea'];
    } else {
      interpretation = 'critical';
      clinicalRelevance = 'Hipotiroidismo clínico';
      associatedPathologies = ['Hipotiroidismo', 'Hipertiroidismo', 'Enfermedad tiroidea'];
    }

    return {
      biomarkerId: 'TSH',
      name: 'Hormona Estimulante de Tiroides',
      value: tshValue,
      normalRange: { min: 0.5, max: 2.5 },
      interpretation,
      clinicalRelevance,
      associatedPathologies
    };
  }

  private analyzeProlactin(prolactinValue: number): BiomarkerAnalysis {
    let interpretation: InterpretationLevel;
    let clinicalRelevance: string;
    let associatedPathologies: string[];

    if (prolactinValue <= 25) {
      interpretation = 'normal';
      clinicalRelevance = 'Niveles normales de prolactina';
      associatedPathologies = [];
    } else if (prolactinValue <= 50) {
      interpretation = 'elevated';
      clinicalRelevance = 'Hiperprolactinemia leve';
      associatedPathologies = ['Prolactinoma', 'Hiperprolactinemia', 'Trastorno hipotálamo-hipofisario'];
    } else {
      interpretation = 'critical';
      clinicalRelevance = 'Hiperprolactinemia significativa';
      associatedPathologies = ['Prolactinoma', 'Hiperprolactinemia', 'Trastorno hipotálamo-hipofisario'];
    }

    return {
      biomarkerId: 'PROLACTIN',
      name: 'Prolactina',
      value: prolactinValue,
      normalRange: { min: 2, max: 25 },
      interpretation,
      clinicalRelevance,
      associatedPathologies
    };
  }

  // ===================================================================
  // 🧪 RECOMENDACIONES DE TESTS
  // ===================================================================

  private getPCOSRecommendedTests(userInput: UserInput): RecommendedTest[] {
    const tests: RecommendedTest[] = [];

    if (!userInput.homaIr) {
      tests.push({
        testId: 'HOMA_IR',
        name: 'HOMA-IR (resistencia insulínica)',
        priority: 1,
        rationale: 'Evaluación de resistencia insulínica en PCOS',
        expectedCost: 'low',
        timeframe: '1-2 días',
        category: 'laboratory'
      });
    }

    tests.push({
      testId: 'OVARIAN_USS',
      name: 'Ecografía ovárica transvaginal',
      priority: 1,
      rationale: 'Evaluación de morfología ovárica poliquística',
      expectedCost: 'medium',
      timeframe: '1 semana',
      category: 'imaging'
    });

    tests.push({
      testId: 'HORMONE_PROFILE',
      name: 'Perfil hormonal completo (LH, FSH, Testosterona)',
      priority: 2,
      rationale: 'Confirmación bioquímica de hiperandrogenismo',
      expectedCost: 'medium',
      timeframe: '2-3 días',
      category: 'laboratory'
    });

    return tests;
  }

  private getEndometriosisRecommendedTests(): RecommendedTest[] {
    return [
      {
        testId: 'PELVIC_USS',
        name: 'Ecografía ginecológica',
        priority: 1,
        rationale: 'Detección de quistes endometriósicos',
        expectedCost: 'medium',
        timeframe: '1 semana',
        category: 'imaging'
      },
      {
        testId: 'CA125',
        name: 'CA-125',
        priority: 2,
        rationale: 'Marcador elevado en endometriosis severa',
        expectedCost: 'low',
        timeframe: '1-2 días',
        category: 'laboratory'
      }
    ];
  }

  private getMaleFactorRecommendedTests(userInput: UserInput): RecommendedTest[] {
    const tests: RecommendedTest[] = [];

    if (!userInput.spermConcentration) {
      tests.push({
        testId: 'SEMEN_ANALYSIS',
        name: 'Espermiograma completo',
        priority: 1,
        rationale: 'Evaluación completa de parámetros seminales',
        expectedCost: 'low',
        timeframe: '3-5 días',
        category: 'laboratory'
      });
    }

    tests.push({
      testId: 'HORMONE_MALE',
      name: 'Perfil hormonal masculino',
      priority: 2,
      rationale: 'Evaluación de eje hipotálamo-hipófisis-testicular',
      expectedCost: 'medium',
      timeframe: '2-3 días',
      category: 'laboratory'
    });

    return tests;
  }

  private getOvarianReserveRecommendedTests(userInput: UserInput): RecommendedTest[] {
    const tests: RecommendedTest[] = [];

    if (!userInput.amh) {
      tests.push({
        testId: 'AMH',
        name: 'Hormona Antimülleriana',
        priority: 1,
        rationale: 'Marcador principal de reserva ovárica',
        expectedCost: 'low',
        timeframe: '1-2 días',
        category: 'laboratory'
      });
    }

    tests.push({
      testId: 'ANTRAL_COUNT',
      name: 'Conteo de folículos antrales',
      priority: 1,
      rationale: 'Evaluación ecográfica de reserva ovárica',
      expectedCost: 'medium',
      timeframe: '1 semana',
      category: 'imaging'
    });

    return tests;
  }

  private getMetabolicRecommendedTests(userInput: UserInput): RecommendedTest[] {
    const tests: RecommendedTest[] = [];

    if (!userInput.homaIr) {
      tests.push({
        testId: 'GLUCOSE_INSULIN',
        name: 'Glucosa e insulina basales',
        priority: 1,
        rationale: 'Evaluación de resistencia insulínica',
        expectedCost: 'low',
        timeframe: '1-2 días',
        category: 'laboratory'
      });
    }

    tests.push({
      testId: 'LIPID_PROFILE',
      name: 'Perfil lipídico',
      priority: 2,
      rationale: 'Evaluación de síndrome metabólico',
      expectedCost: 'low',
      timeframe: '1-2 días',
      category: 'laboratory'
    });

    return tests;
  }

  private getTubalRecommendedTests(): RecommendedTest[] {
    return [
      {
        testId: 'HSG',
        name: 'Histerosalpingografía',
        priority: 1,
        rationale: 'Evaluación de permeabilidad tubárica',
        expectedCost: 'medium',
        timeframe: '1-2 semanas',
        category: 'imaging'
      },
      {
        testId: 'SONO_HSG',
        name: 'Histerosalpingografía con contraste ecográfico',
        priority: 2,
        rationale: 'Alternativa menos invasiva a HSG',
        expectedCost: 'medium',
        timeframe: '1 semana',
        category: 'imaging'
      }
    ];
  }

  // ===================================================================
  // 🏗️ INICIALIZACIÓN
  // ===================================================================

  private initializePathologyPatterns(): void {
    // Patrón PCOS Rotterdam
    this.pathologyPatterns.set('PCOS', {
      patternId: 'PCOS',
      name: 'PCOS Rotterdam',
      requiredCriteria: [], // 2 de 3 criterios
      optionalCriteria: ['oligoovulation', 'hyperandrogenism', 'polycystic_morphology'],
      exclusionCriteria: ['thyroid_dysfunction', 'hyperprolactinemia'],
      minimumScore: 2
    });
  }

  private initializeDiagnosticCriteria(): void {
    // Criterios diagnósticos por patología
    this.diagnosticCriteria.set('PCOS', [
      {
        criterionId: 'oligoovulation',
        name: 'Oligo/anovulación',
        met: false,
        weight: 0.35,
        source: 'Rotterdam Consensus'
      },
      {
        criterionId: 'hyperandrogenism',
        name: 'Hiperandrogenismo',
        met: false,
        weight: 0.35,
        source: 'Rotterdam Consensus'
      }
    ]);
  }

  private initializeBiomarkerRanges(): void {
    this.biomarkerRanges.set('AMH', { min: 1.0, max: 4.0 });
    this.biomarkerRanges.set('HOMA_IR', { min: 0, max: 2.5 });
    this.biomarkerRanges.set('TSH', { min: 0.5, max: 2.5 });
    this.biomarkerRanges.set('PROLACTIN', { min: 2, max: 25 });
  }
}

/**
 * Singleton instance
 */
let pathologyAnalyzerInstance: PathologyAnalyzer | null = null;

export function getPathologyAnalyzer(): PathologyAnalyzer {
  pathologyAnalyzerInstance ??= new PathologyAnalyzer();
  return pathologyAnalyzerInstance;
}
