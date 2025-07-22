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

export interface PathologyAnalysisResult {
  pathologyId: string;
  name: string;
  probability: number; // 0-1
  confidence: number; // 0-1
  severity: 'mild' | 'moderate' | 'severe' | 'unknown';
  supportingCriteria: DiagnosticCriterion[];
  missingSriteria: DiagnosticCriterion[];
  recommendedTests: RecommendedTest[];
  clinicalSignificance: string;
  treatmentUrgency: 'low' | 'medium' | 'high' | 'urgent';
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
  expectedCost: 'low' | 'medium' | 'high';
  timeframe: string;
  category: 'laboratory' | 'imaging' | 'biopsy' | 'functional';
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
  interpretation: 'normal' | 'elevated' | 'decreased' | 'critical';
  clinicalRelevance: string;
  associatedPathologies: string[];
}

// ===================================================================
// 🔬 PATHOLOGY ANALYZER CLASS
// ===================================================================

export class PathologyAnalyzer {
  private pathologyPatterns: Map<string, PathologyPattern> = new Map();
  private diagnosticCriteria: Map<string, DiagnosticCriterion[]> = new Map();
  private biomarkerRanges: Map<string, { min: number; max: number }> = new Map();

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

  private analyzePCOS(userInput: UserInput): PathologyAnalysisResult {
    const supportingCriteria: DiagnosticCriterion[] = [];
    const missingSriteria: DiagnosticCriterion[] = [];
    let probabilityScore = 0;

    // Rotterdam Criteria Assessment
    
    // 1. Oligo/anovulación
    const oligoovulation: DiagnosticCriterion = {
      criterionId: 'PCOS_OLIGOOVULATION',
      name: 'Oligo/anovulación',
      met: false,
      weight: 0.35,
      source: 'Rotterdam Consensus 2003'
    };

    if (userInput.cycleDuration && userInput.cycleDuration > 35) {
      oligoovulation.met = true;
      oligoovulation.value = userInput.cycleDuration;
      oligoovulation.normalRange = '24-32 días';
      supportingCriteria.push(oligoovulation);
      probabilityScore += 0.35;
    } else {
      missingSriteria.push(oligoovulation);
    }

    // 2. Hiperandrogenismo clínico/bioquímico
    const hyperandrogenism: DiagnosticCriterion = {
      criterionId: 'PCOS_HYPERANDROGENISM',
      name: 'Hiperandrogenismo (clínico o bioquímico)',
      met: userInput.hasPcos, // Aproximación basada en diagnóstico previo
      weight: 0.35,
      source: 'Rotterdam Consensus 2003'
    };

    if (hyperandrogenism.met) {
      supportingCriteria.push(hyperandrogenism);
      probabilityScore += 0.35;
    } else {
      missingSriteria.push(hyperandrogenism);
    }

    // 3. Morfología ovárica poliquística
    // Nota: No disponible en UserInput básico
    const morphology: DiagnosticCriterion = {
      criterionId: 'PCOS_MORPHOLOGY',
      name: 'Morfología ovárica poliquística (≥12 folículos 2-9mm)',
      met: false,
      weight: 0.30,
      source: 'Rotterdam Consensus 2003'
    };
    missingSriteria.push(morphology);

    // Factores de soporte adicionales
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
      probabilityScore += 0.10;
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
      probabilityScore += 0.15;
    }

    // Determinar severidad
    let severity: 'mild' | 'moderate' | 'severe' | 'unknown' = 'unknown';
    if (userInput.hasPcos) {
      const complexityFactors = [
        userInput.bmi && userInput.bmi > 30,
        userInput.homaIr && userInput.homaIr > 3.5,
        userInput.cycleDuration && userInput.cycleDuration > 60
      ].filter(Boolean).length;

      if (complexityFactors >= 2) severity = 'severe';
      else if (complexityFactors === 1) severity = 'moderate';
      else severity = 'mild';
    }

    return {
      pathologyId: 'PCOS',
      name: 'Síndrome de Ovario Poliquístico',
      probability: Math.min(probabilityScore, 0.95),
      confidence: supportingCriteria.length / (supportingCriteria.length + missingSriteria.length),
      severity,
      supportingCriteria,
      missingSriteria,
      recommendedTests: this.getPCOSRecommendedTests(userInput),
      clinicalSignificance: 'Causa principal de anovulación crónica e infertilidad',
      treatmentUrgency: severity === 'severe' ? 'high' : 'medium'
    };
  }

  private analyzeEndometriosis(userInput: UserInput): PathologyAnalysisResult {
    const supportingCriteria: DiagnosticCriterion[] = [];
    const missingSriteria: DiagnosticCriterion[] = [];
    let probabilityScore = 0.06; // Prevalencia basal

    // Grado conocido de endometriosis
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
      probabilityScore = 0.2 + (userInput.endometriosisGrade * 0.2);
    }

    // Factores de riesgo indirectos
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
      probabilityScore += 0.15;
    }

    // Edad típica
    if (userInput.age >= 25 && userInput.age <= 40) {
      supportingCriteria.push({
        criterionId: 'ENDO_AGE',
        name: 'Edad reproductiva típica',
        met: true,
        value: userInput.age,
        weight: 0.15,
        source: 'Epidemiological data'
      });
      probabilityScore += 0.08;
    }

    // Determinar severidad
    let severity: 'mild' | 'moderate' | 'severe' | 'unknown' = 'unknown';
    if (userInput.endometriosisGrade > 0) {
      if (userInput.endometriosisGrade >= 3) severity = 'severe';
      else if (userInput.endometriosisGrade === 2) severity = 'moderate';
      else severity = 'mild';
    }

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
      recommendedTests: this.getEndometriosisRecommendedTests(userInput),
      clinicalSignificance: 'Causa importante de infertilidad y dolor pélvico',
      treatmentUrgency: severity === 'severe' ? 'high' : 'medium'
    };
  }

  private analyzeMaleFactor(userInput: UserInput): PathologyAnalysisResult {
    const supportingCriteria: DiagnosticCriterion[] = [];
    const missingSriteria: DiagnosticCriterion[] = [];
    let probabilityScore = 0;

    // WHO 2021 Reference Values Assessment
    
    // Concentración espermática
    if (userInput.spermConcentration !== undefined) {
      const concCriterion: DiagnosticCriterion = {
        criterionId: 'MALE_CONCENTRATION',
        name: 'Concentración espermática',
        met: userInput.spermConcentration < 15,
        value: userInput.spermConcentration,
        normalRange: '≥15 millones/mL',
        weight: 0.35,
        source: 'WHO Manual 2021'
      };

      if (concCriterion.met) {
        supportingCriteria.push(concCriterion);
        if (userInput.spermConcentration < 5) probabilityScore += 0.40;
        else if (userInput.spermConcentration < 10) probabilityScore += 0.30;
        else probabilityScore += 0.20;
      }
    } else {
      missingSriteria.push({
        criterionId: 'MALE_CONCENTRATION',
        name: 'Concentración espermática',
        met: false,
        normalRange: '≥15 millones/mL',
        weight: 0.35,
        source: 'WHO Manual 2021'
      });
    }

    // Motilidad progresiva
    if (userInput.spermProgressiveMotility !== undefined) {
      const motilityCriterion: DiagnosticCriterion = {
        criterionId: 'MALE_MOTILITY',
        name: 'Motilidad progresiva',
        met: userInput.spermProgressiveMotility < 32,
        value: userInput.spermProgressiveMotility,
        normalRange: '≥32%',
        weight: 0.30,
        source: 'WHO Manual 2021'
      };

      if (motilityCriterion.met) {
        supportingCriteria.push(motilityCriterion);
        if (userInput.spermProgressiveMotility < 20) probabilityScore += 0.25;
        else probabilityScore += 0.15;
      }
    } else {
      missingSriteria.push({
        criterionId: 'MALE_MOTILITY',
        name: 'Motilidad progresiva',
        met: false,
        normalRange: '≥32%',
        weight: 0.30,
        source: 'WHO Manual 2021'
      });
    }

    // Morfología normal
    if (userInput.spermNormalMorphology !== undefined) {
      const morphCriterion: DiagnosticCriterion = {
        criterionId: 'MALE_MORPHOLOGY',
        name: 'Morfología normal',
        met: userInput.spermNormalMorphology < 4,
        value: userInput.spermNormalMorphology,
        normalRange: '≥4%',
        weight: 0.25,
        source: 'WHO Manual 2021'
      };

      if (morphCriterion.met) {
        supportingCriteria.push(morphCriterion);
        probabilityScore += 0.10;
      }
    }

    // Determinar severidad
    let severity: 'mild' | 'moderate' | 'severe' | 'unknown' = 'unknown';
    const abnormalParameters = supportingCriteria.length;
    
    if (abnormalParameters >= 3) severity = 'severe';
    else if (abnormalParameters === 2) severity = 'moderate';
    else if (abnormalParameters === 1) severity = 'mild';

    return {
      pathologyId: 'MALE_FACTOR',
      name: 'Factor Masculino de Infertilidad',
      probability: Math.min(probabilityScore, 0.95),
      confidence: supportingCriteria.length > 0 ? 0.90 : 0.20,
      severity,
      supportingCriteria,
      missingSriteria,
      recommendedTests: this.getMaleFactorRecommendedTests(userInput),
      clinicalSignificance: 'Factor contribuyente en 30-40% de casos de infertilidad',
      treatmentUrgency: severity === 'severe' ? 'high' : 'medium'
    };
  }

  private analyzeOvarianReserve(userInput: UserInput): PathologyAnalysisResult {
    const supportingCriteria: DiagnosticCriterion[] = [];
    const missingSriteria: DiagnosticCriterion[] = [];
    let probabilityScore = 0;

    // Edad como factor principal
    if (userInput.age >= 40) {
      supportingCriteria.push({
        criterionId: 'DOR_AGE_40',
        name: 'Edad ≥40 años',
        met: true,
        value: userInput.age,
        weight: 0.40,
        source: 'ASRM Guidelines'
      });
      probabilityScore += 0.60;
    } else if (userInput.age >= 35) {
      supportingCriteria.push({
        criterionId: 'DOR_AGE_35',
        name: 'Edad ≥35 años',
        met: true,
        value: userInput.age,
        weight: 0.25,
        source: 'ASRM Guidelines'
      });
      probabilityScore += 0.25;
    }

    // AMH como marcador principal
    if (userInput.amh !== undefined) {
      if (userInput.amh < 0.5) {
        supportingCriteria.push({
          criterionId: 'DOR_AMH_SEVERE',
          name: 'AMH muy baja (<0.5 ng/mL)',
          met: true,
          value: userInput.amh,
          normalRange: '1-4 ng/mL',
          weight: 0.50,
          source: 'ESHRE Guidelines'
        });
        probabilityScore += 0.70;
      } else if (userInput.amh < 1.0) {
        supportingCriteria.push({
          criterionId: 'DOR_AMH_LOW',
          name: 'AMH baja (<1.0 ng/mL)',
          met: true,
          value: userInput.amh,
          normalRange: '1-4 ng/mL',
          weight: 0.40,
          source: 'ESHRE Guidelines'
        });
        probabilityScore += 0.45;
      }
    } else {
      missingSriteria.push({
        criterionId: 'DOR_AMH',
        name: 'Hormona Antimülleriana (AMH)',
        met: false,
        normalRange: '1-4 ng/mL',
        weight: 0.50,
        source: 'Laboratory test'
      });
    }

    // Determinar severidad
    let severity: 'mild' | 'moderate' | 'severe' | 'unknown' = 'unknown';
    if (userInput.amh !== undefined) {
      if (userInput.amh < 0.5) severity = 'severe';
      else if (userInput.amh < 1.0) severity = 'moderate';
      else if (userInput.amh < 1.5) severity = 'mild';
    } else if (userInput.age >= 42) {
      severity = 'severe';
    } else if (userInput.age >= 40) {
      severity = 'moderate';
    }

    return {
      pathologyId: 'DIMINISHED_OVARIAN_RESERVE',
      name: 'Reserva Ovárica Disminuida',
      probability: Math.min(probabilityScore, 0.95),
      confidence: supportingCriteria.length > 0 ? 0.85 : 0.30,
      severity,
      supportingCriteria,
      missingSriteria,
      recommendedTests: this.getOvarianReserveRecommendedTests(userInput),
      clinicalSignificance: 'Factor limitante principal para éxito reproductivo',
      treatmentUrgency: severity === 'severe' ? 'urgent' : 'high'
    };
  }

  private analyzeMetabolicFactors(userInput: UserInput): PathologyAnalysisResult {
    const supportingCriteria: DiagnosticCriterion[] = [];
    const missingSriteria: DiagnosticCriterion[] = [];
    let probabilityScore = 0;

    // BMI assessment
    if (userInput.bmi && userInput.bmi >= 30) {
      supportingCriteria.push({
        criterionId: 'METABOLIC_OBESITY',
        name: 'Obesidad (BMI ≥30)',
        met: true,
        value: userInput.bmi,
        normalRange: '18.5-25',
        weight: 0.40,
        source: 'WHO Classification'
      });
      probabilityScore += 0.35;
    } else if (userInput.bmi && userInput.bmi >= 25) {
      supportingCriteria.push({
        criterionId: 'METABOLIC_OVERWEIGHT',
        name: 'Sobrepeso (BMI 25-30)',
        met: true,
        value: userInput.bmi,
        normalRange: '18.5-25',
        weight: 0.25,
        source: 'WHO Classification'
      });
      probabilityScore += 0.20;
    }

    // Insulin resistance
    if (userInput.homaIr && userInput.homaIr > 2.5) {
      supportingCriteria.push({
        criterionId: 'METABOLIC_IR',
        name: 'Resistencia insulínica',
        met: true,
        value: userInput.homaIr,
        normalRange: '<2.5',
        weight: 0.35,
        source: 'Endocrine Society'
      });
      if (userInput.homaIr > 3.5) probabilityScore += 0.40;
      else probabilityScore += 0.25;
    }

    let severity: 'mild' | 'moderate' | 'severe' | 'unknown' = 'unknown';
    if (userInput.bmi && userInput.homaIr) {
      const metabolicBurden = (userInput.bmi > 35 ? 2 : userInput.bmi > 30 ? 1 : 0) + 
                             (userInput.homaIr > 3.5 ? 2 : userInput.homaIr > 2.5 ? 1 : 0);
      
      if (metabolicBurden >= 3) severity = 'severe';
      else if (metabolicBurden >= 2) severity = 'moderate';
      else if (metabolicBurden >= 1) severity = 'mild';
    }

    return {
      pathologyId: 'METABOLIC_FACTOR',
      name: 'Factor Metabólico',
      probability: Math.min(probabilityScore, 0.85),
      confidence: supportingCriteria.length > 0 ? 0.80 : 0.25,
      severity,
      supportingCriteria,
      missingSriteria,
      recommendedTests: this.getMetabolicRecommendedTests(userInput),
      clinicalSignificance: 'Factor modificable que impacta significativamente la fertilidad',
      treatmentUrgency: severity === 'severe' ? 'high' : 'medium'
    };
  }

  private analyzeTubalFactor(userInput: UserInput): PathologyAnalysisResult {
    const supportingCriteria: DiagnosticCriterion[] = [];
    const missingSriteria: DiagnosticCriterion[] = [];
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

    let severity: 'mild' | 'moderate' | 'severe' | 'unknown' = 'unknown';
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
      recommendedTests: this.getTubalRecommendedTests(userInput),
      clinicalSignificance: 'Factor tubárico requiere técnicas de reproducción asistida',
      treatmentUrgency: severity === 'severe' ? 'high' : 'medium'
    };
  }

  // ===================================================================
  // 🔬 ANÁLISIS DE BIOMARCADORES
  // ===================================================================

  private analyzeAMH(amhValue: number): BiomarkerAnalysis {
    let interpretation: 'normal' | 'elevated' | 'decreased' | 'critical';
    let clinicalRelevance: string;

    if (amhValue < 0.5) {
      interpretation = 'critical';
      clinicalRelevance = 'Reserva ovárica severamente disminuida';
    } else if (amhValue < 1.0) {
      interpretation = 'decreased';
      clinicalRelevance = 'Reserva ovárica baja';
    } else if (amhValue <= 4.0) {
      interpretation = 'normal';
      clinicalRelevance = 'Reserva ovárica normal';
    } else {
      interpretation = 'elevated';
      clinicalRelevance = 'Posible PCOS o reserva ovárica alta';
    }

    return {
      biomarkerId: 'AMH',
      name: 'Hormona Antimülleriana',
      value: amhValue,
      normalRange: { min: 1.0, max: 4.0 },
      interpretation,
      clinicalRelevance,
      associatedPathologies: interpretation === 'decreased' ? ['Reserva ovárica disminuida', 'Falla ovárica precoz'] :
                             interpretation === 'elevated' ? ['PCOS', 'Tumor células granulosa'] : []
    };
  }

  private analyzeHOMAIR(homaValue: number): BiomarkerAnalysis {
    let interpretation: 'normal' | 'elevated' | 'decreased' | 'critical';
    let clinicalRelevance: string;

    if (homaValue <= 2.5) {
      interpretation = 'normal';
      clinicalRelevance = 'Sensibilidad normal a la insulina';
    } else if (homaValue <= 3.8) {
      interpretation = 'elevated';
      clinicalRelevance = 'Resistencia insulínica leve a moderada';
    } else {
      interpretation = 'critical';
      clinicalRelevance = 'Resistencia insulínica significativa';
    }

    return {
      biomarkerId: 'HOMA_IR',
      name: 'HOMA-IR (Resistencia Insulínica)',
      value: homaValue,
      normalRange: { min: 0, max: 2.5 },
      interpretation,
      clinicalRelevance,
      associatedPathologies: interpretation !== 'normal' ? 
        ['PCOS', 'Diabetes tipo 2', 'Síndrome metabólico', 'Obesidad'] : []
    };
  }

  private analyzeTSH(tshValue: number): BiomarkerAnalysis {
    let interpretation: 'normal' | 'elevated' | 'decreased' | 'critical';
    let clinicalRelevance: string;

    if (tshValue < 0.5) {
      interpretation = 'decreased';
      clinicalRelevance = 'Posible hipertiroidismo';
    } else if (tshValue <= 2.5) {
      interpretation = 'normal';
      clinicalRelevance = 'Función tiroidea normal para fertilidad';
    } else if (tshValue <= 4.0) {
      interpretation = 'elevated';
      clinicalRelevance = 'Hipotiroidismo subclínico';
    } else {
      interpretation = 'critical';
      clinicalRelevance = 'Hipotiroidismo clínico';
    }

    return {
      biomarkerId: 'TSH',
      name: 'Hormona Estimulante de Tiroides',
      value: tshValue,
      normalRange: { min: 0.5, max: 2.5 },
      interpretation,
      clinicalRelevance,
      associatedPathologies: interpretation !== 'normal' ? 
        ['Hipotiroidismo', 'Hipertiroidismo', 'Enfermedad tiroidea'] : []
    };
  }

  private analyzeProlactin(prolactinValue: number): BiomarkerAnalysis {
    let interpretation: 'normal' | 'elevated' | 'decreased' | 'critical';
    let clinicalRelevance: string;

    if (prolactinValue <= 25) {
      interpretation = 'normal';
      clinicalRelevance = 'Niveles normales de prolactina';
    } else if (prolactinValue <= 50) {
      interpretation = 'elevated';
      clinicalRelevance = 'Hiperprolactinemia leve';
    } else {
      interpretation = 'critical';
      clinicalRelevance = 'Hiperprolactinemia significativa';
    }

    return {
      biomarkerId: 'PROLACTIN',
      name: 'Prolactina',
      value: prolactinValue,
      normalRange: { min: 2, max: 25 },
      interpretation,
      clinicalRelevance,
      associatedPathologies: interpretation !== 'normal' ? 
        ['Prolactinoma', 'Hiperprolactinemia', 'Trastorno hipotálamo-hipofisario'] : []
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

  private getEndometriosisRecommendedTests(userInput: UserInput): RecommendedTest[] {
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

  private getTubalRecommendedTests(userInput: UserInput): RecommendedTest[] {
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
  if (!pathologyAnalyzerInstance) {
    pathologyAnalyzerInstance = new PathologyAnalyzer();
  }
  return pathologyAnalyzerInstance;
}
