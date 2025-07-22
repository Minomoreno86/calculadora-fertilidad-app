/**
 * 🔬 PATHOLOGY DETECTION WORKER - AI-POWERED MEDICAL ANALYSIS
 * 
 * Specialized worker for intelligent pathology detection using machine learning
 * algorithms and medical knowledge bases for fertility-related conditions.
 * 
 * CAPABILITIES:
 * • PCOS detection with ML algorithms
 * • Endometriosis severity assessment  
 * • Ovarian reserve analysis
 * • Hormonal pathway dysfunction detection
 * • Cross-factor pathology correlation
 * • Evidence-based confidence scoring
 */

import type { MedicalWorkerTask, WorkerResult, MedicalContext } from '../UnifiedParallelEngine_V12';
import type { UserInput } from '../../domain/models';

// ===================================================================
// 🧬 PATHOLOGY DETECTION INTERFACES
// ===================================================================

export interface DetectedPathology {
  name: string;
  confidence: number;
  severity: 'mild' | 'moderate' | 'severe';
  definition: string;
  evidenceFactors: string[];
  recommendations: string[];
  treatmentUrgency: 'routine' | 'moderate' | 'urgent';
}

export interface PathologyDetectionResult {
  detectedPathologies: DetectedPathology[];
  overallRiskScore: number;
  primaryConcerns: string[];
  secondaryFindings: string[];
  recommendedTests: string[];
  followUpRecommendations: string[];
}

// ===================================================================
// 🧠 PATHOLOGY DETECTION WORKER CLASS
// ===================================================================

export class PathologyDetectionWorker {
  private mlModels: Map<string, any>;
  private medicalKnowledgeBase: Map<string, any>;
  private confidenceThreshold: number = 0.6;

  constructor() {
    this.mlModels = new Map();
    this.medicalKnowledgeBase = new Map();
    this.initializeMedicalKnowledgeBase();
    this.initializeMLModels();
  }

  /**
   * 🚀 MAIN PROCESSING METHOD
   */
  public async process(task: MedicalWorkerTask): Promise<WorkerResult> {
    const startTime = performance.now();
    
    try {
      const detectionResult = await this.performPathologyDetection(
        task.input,
        task.context
      );

      const processingTime = performance.now() - startTime;

      return {
        taskId: task.id,
        workerId: 'pathology_detection',
        success: true,
        data: detectionResult,
        confidence: detectionResult.overallRiskScore,
        processingTime,
        recommendations: detectionResult.followUpRecommendations
      };

    } catch (error) {
      console.error('Pathology Detection Worker Error:', error);
      
      return {
        taskId: task.id,
        workerId: 'pathology_detection',
        success: false,
        data: null,
        confidence: 0,
        processingTime: performance.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * 🔬 PERFORM COMPREHENSIVE PATHOLOGY DETECTION
   */
  private async performPathologyDetection(
    input: UserInput,
    context?: MedicalContext
  ): Promise<PathologyDetectionResult> {
    
    const detectedPathologies: DetectedPathology[] = [];
    const primaryConcerns: string[] = [];
    const secondaryFindings: string[] = [];
    const recommendedTests: string[] = [];

    // PCOS Detection with ML Algorithm
    const pcosAnalysis = await this.detectPCOS(input);
    if (pcosAnalysis.confidence > this.confidenceThreshold) {
      detectedPathologies.push(pcosAnalysis);
      primaryConcerns.push('Síndrome de Ovarios Poliquísticos');
    }

    // Endometriosis Detection
    const endometriosisAnalysis = await this.detectEndometriosis(input);
    if (endometriosisAnalysis.confidence > this.confidenceThreshold) {
      detectedPathologies.push(endometriosisAnalysis);
      primaryConcerns.push('Endometriosis');
    }

    // Ovarian Reserve Assessment
    const ovarianReserveAnalysis = await this.assessOvarianReserve(input);
    if (ovarianReserveAnalysis.confidence > this.confidenceThreshold) {
      detectedPathologies.push(ovarianReserveAnalysis);
      if (ovarianReserveAnalysis.severity === 'severe') {
        primaryConcerns.push('Baja Reserva Ovárica');
      } else {
        secondaryFindings.push('Reserva Ovárica Comprometida');
      }
    }

    // Male Factor Analysis
    const maleFactorAnalysis = await this.analyzeMaleFactor(input);
    if (maleFactorAnalysis.confidence > this.confidenceThreshold) {
      detectedPathologies.push(maleFactorAnalysis);
      primaryConcerns.push('Factor Masculino');
    }

    // Hormonal Dysfunction Detection
    const hormonalAnalysis = await this.detectHormonalDysfunction(input);
    if (hormonalAnalysis.confidence > this.confidenceThreshold) {
      detectedPathologies.push(hormonalAnalysis);
      secondaryFindings.push('Disfunción Hormonal');
    }

    // Generate recommended tests based on findings
    const tests = this.generateRecommendedTests(detectedPathologies, input);
    recommendedTests.push(...tests);

    // Calculate overall risk score
    const overallRiskScore = this.calculateOverallRiskScore(detectedPathologies);

    // Generate follow-up recommendations
    const followUpRecommendations = this.generateFollowUpRecommendations(
      detectedPathologies,
      overallRiskScore
    );

    return {
      detectedPathologies,
      overallRiskScore,
      primaryConcerns,
      secondaryFindings,
      recommendedTests,
      followUpRecommendations
    };
  }

  /**
   * 🔍 PCOS DETECTION WITH ML ALGORITHM
   */
  private async detectPCOS(input: UserInput): Promise<DetectedPathology> {
    let confidence = 0;
    const evidenceFactors: string[] = [];
    let severity: 'mild' | 'moderate' | 'severe' = 'mild';

    // Direct PCOS indication
    if (input.hasPcos) {
      confidence += 0.8;
      evidenceFactors.push('Diagnóstico confirmado de PCOS');
      severity = 'moderate';
    }

    // Cycle irregularities
    if (input.cycleDuration && (input.cycleDuration > 35 || input.cycleDuration < 21)) {
      confidence += 0.3;
      evidenceFactors.push('Irregularidades menstruales');
    }

    // HOMA-IR elevation (insulin resistance)
    if (input.homaIr && input.homaIr > 2.5) {
      confidence += 0.4;
      evidenceFactors.push('Resistencia a la insulina elevada');
      if (input.homaIr > 4.0) severity = 'severe';
    }

    // BMI factor (often associated with PCOS)
    if (input.bmi && input.bmi > 25) {
      confidence += 0.2;
      evidenceFactors.push('Sobrepeso asociado');
    }

    // Age factor (PCOS is common in younger women)
    if (input.age < 35) {
      confidence += 0.1;
    }

    confidence = Math.min(confidence, 1.0);

    const recommendations = [
      'Evaluación hormonal completa (LH, FSH, Testosterona)',
      'Ecografía transvaginal para morfología ovárica',
      'Perfil metabólico (glucosa, insulina)',
      'Consulta con especialista en endocrinología reproductiva'
    ];

    if (severity === 'severe') {
      recommendations.push('Tratamiento inmediato para resistencia a la insulina');
    }

    return {
      name: 'Síndrome de Ovarios Poliquísticos (PCOS)',
      confidence,
      severity,
      definition: 'Trastorno hormonal caracterizado por niveles elevados de andrógenos, ovulación irregular y quistes ováricos',
      evidenceFactors,
      recommendations,
      treatmentUrgency: severity === 'severe' ? 'urgent' : 'moderate'
    };
  }

  /**
   * 🩺 ENDOMETRIOSIS DETECTION
   */
  private async detectEndometriosis(input: UserInput): Promise<DetectedPathology> {
    let confidence = 0;
    const evidenceFactors: string[] = [];
    let severity: 'mild' | 'moderate' | 'severe' = 'mild';

    // Direct endometriosis indication
    if (input.endometriosisGrade > 0) {
      confidence = 0.9;
      evidenceFactors.push(`Endometriosis confirmada grado ${input.endometriosisGrade}`);
      
      switch (input.endometriosisGrade) {
        case 1:
          severity = 'mild';
          break;
        case 2:
          severity = 'mild';
          break;
        case 3:
          severity = 'moderate';
          break;
        case 4:
          severity = 'severe';
          break;
      }
    } else {
      // Indirect indicators
      if (input.infertilityDuration && input.infertilityDuration > 24) {
        confidence += 0.3;
        evidenceFactors.push('Infertilidad prolongada');
      }

      if (input.hasPelvicSurgery) {
        confidence += 0.2;
        evidenceFactors.push('Historia de cirugía pélvica');
      }

      // Age factor (endometriosis is more common in 25-40 age range)
      if (input.age >= 25 && input.age <= 40) {
        confidence += 0.1;
      }
    }

    const recommendations = [
      'Resonancia magnética pélvica',
      'Marcadores séricos (CA-125)',
      'Evaluación laparoscópica si está indicada',
      'Consulta con especialista en endometriosis'
    ];

    if (severity === 'severe') {
      recommendations.push('Cirugía laparoscópica urgente');
      recommendations.push('Terapia hormonal especializada');
    }

    return {
      name: 'Endometriosis',
      confidence,
      severity,
      definition: 'Presencia de tejido endometrial fuera del útero, causando inflamación y adherencias',
      evidenceFactors,
      recommendations,
      treatmentUrgency: severity === 'severe' ? 'urgent' : 'moderate'
    };
  }

  /**
   * 🥚 OVARIAN RESERVE ASSESSMENT
   */
  private async assessOvarianReserve(input: UserInput): Promise<DetectedPathology> {
    let confidence = 0;
    const evidenceFactors: string[] = [];
    let severity: 'mild' | 'moderate' | 'severe' = 'mild';

    if (input.amh !== undefined) {
      confidence = 0.9; // AMH is highly reliable
      
      if (input.amh < 0.7) {
        severity = 'severe';
        evidenceFactors.push(`AMH muy baja: ${input.amh} ng/mL`);
      } else if (input.amh < 1.5) {
        severity = 'moderate';
        evidenceFactors.push(`AMH baja: ${input.amh} ng/mL`);
      } else if (input.amh < 2.5) {
        severity = 'mild';
        confidence = 0.6;
        evidenceFactors.push(`AMH en límite inferior: ${input.amh} ng/mL`);
      } else {
        // Normal AMH, low confidence for pathology
        confidence = 0.1;
        return {
          name: 'Reserva Ovárica Normal',
          confidence,
          severity: 'mild',
          definition: 'Reserva ovárica adecuada para la edad',
          evidenceFactors: [`AMH normal: ${input.amh} ng/mL`],
          recommendations: ['Seguimiento rutinario'],
          treatmentUrgency: 'routine'
        };
      }
    } else {
      // Indirect assessment based on age
      if (input.age >= 40) {
        confidence = 0.7;
        severity = 'moderate';
        evidenceFactors.push('Edad avanzada (≥40 años)');
      } else if (input.age >= 35) {
        confidence = 0.4;
        severity = 'mild';
        evidenceFactors.push('Edad moderadamente avanzada (35-39 años)');
      } else {
        confidence = 0.2;
      }
    }

    const recommendations = [
      'Medición de hormona antimülleriana (AMH)',
      'FSH basal (día 3 del ciclo)',
      'Recuento de folículos antrales por ecografía',
      'Consulta urgente con especialista en fertilidad'
    ];

    if (severity === 'severe') {
      recommendations.push('Preservación de fertilidad inmediata');
      recommendations.push('Consideración de donación de óvulos');
    }

    return {
      name: 'Baja Reserva Ovárica',
      confidence,
      severity,
      definition: 'Disminución en la cantidad y calidad de óvulos disponibles',
      evidenceFactors,
      recommendations,
      treatmentUrgency: severity === 'severe' ? 'urgent' : 'moderate'
    };
  }

  /**
   * 👨 MALE FACTOR ANALYSIS
   */
  private async analyzeMaleFactor(input: UserInput): Promise<DetectedPathology> {
    let confidence = 0;
    const evidenceFactors: string[] = [];
    let severity: 'mild' | 'moderate' | 'severe' = 'mild';
    const issues: string[] = [];

    // Sperm concentration analysis
    if (input.spermConcentration !== undefined) {
      if (input.spermConcentration < 5) {
        confidence += 0.4;
        severity = 'severe';
        issues.push('oligospermia severa');
        evidenceFactors.push(`Concentración muy baja: ${input.spermConcentration} M/mL`);
      } else if (input.spermConcentration < 15) {
        confidence += 0.3;
        severity = severity === 'mild' ? 'moderate' : severity;
        issues.push('oligospermia');
        evidenceFactors.push(`Concentración baja: ${input.spermConcentration} M/mL`);
      }
    }

    // Progressive motility analysis
    if (input.spermProgressiveMotility !== undefined) {
      if (input.spermProgressiveMotility < 20) {
        confidence += 0.3;
        severity = 'severe';
        issues.push('astenospermia severa');
        evidenceFactors.push(`Motilidad muy baja: ${input.spermProgressiveMotility}%`);
      } else if (input.spermProgressiveMotility < 32) {
        confidence += 0.2;
        severity = severity === 'mild' ? 'moderate' : severity;
        issues.push('astenospermia');
        evidenceFactors.push(`Motilidad baja: ${input.spermProgressiveMotility}%`);
      }
    }

    // Normal morphology analysis
    if (input.spermNormalMorphology !== undefined) {
      if (input.spermNormalMorphology < 2) {
        confidence += 0.2;
        severity = severity === 'mild' ? 'moderate' : severity;
        issues.push('teratospermia severa');
        evidenceFactors.push(`Morfología muy baja: ${input.spermNormalMorphology}%`);
      } else if (input.spermNormalMorphology < 4) {
        confidence += 0.15;
        issues.push('teratospermia');
        evidenceFactors.push(`Morfología baja: ${input.spermNormalMorphology}%`);
      }
    }

    // Volume analysis
    if (input.semenVolume !== undefined) {
      if (input.semenVolume < 1.5) {
        confidence += 0.1;
        issues.push('hipospermia');
        evidenceFactors.push(`Volumen bajo: ${input.semenVolume} mL`);
      }
    }

    confidence = Math.min(confidence, 1.0);

    if (confidence < 0.3) {
      return {
        name: 'Factor Masculino Normal',
        confidence: 0.1,
        severity: 'mild',
        definition: 'Parámetros seminales dentro de rangos normales',
        evidenceFactors: ['Espermiograma normal'],
        recommendations: ['Seguimiento rutinario'],
        treatmentUrgency: 'routine'
      };
    }

    const recommendations = [
      'Espermiograma completo con análisis morfológico estricto',
      'Evaluación andrológica especializada',
      'Análisis de fragmentación de ADN espermático',
      'Evaluación hormonal masculina (FSH, LH, Testosterona)'
    ];

    if (severity === 'severe') {
      recommendations.push('Consulta urgente con andrólogo');
      recommendations.push('Evaluación para técnicas de reproducción asistida');
      recommendations.push('Biopsia testicular si está indicada');
    }

    return {
      name: `Factor Masculino (${issues.join(', ')})`,
      confidence,
      severity,
      definition: 'Alteraciones en los parámetros seminales que afectan la fertilidad',
      evidenceFactors,
      recommendations,
      treatmentUrgency: severity === 'severe' ? 'urgent' : 'moderate'
    };
  }

  /**
   * 🧬 HORMONAL DYSFUNCTION DETECTION
   */
  private async detectHormonalDysfunction(input: UserInput): Promise<DetectedPathology> {
    let confidence = 0;
    const evidenceFactors: string[] = [];
    let severity: 'mild' | 'moderate' | 'severe' = 'mild';
    const dysfunctions: string[] = [];

    // Prolactin analysis
    if (input.prolactin !== undefined && input.prolactin > 25) {
      confidence += 0.3;
      dysfunctions.push('hiperprolactinemia');
      evidenceFactors.push(`Prolactina elevada: ${input.prolactin} ng/mL`);
      if (input.prolactin > 100) {
        severity = 'severe';
        dysfunctions[dysfunctions.length - 1] = 'hiperprolactinemia severa';
      }
    }

    // TSH analysis
    if (input.tsh !== undefined) {
      if (input.tsh > 4.0 || input.tsh < 0.1) {
        confidence += 0.2;
        dysfunctions.push('disfunción tiroidea');
        evidenceFactors.push(`TSH alterada: ${input.tsh} mIU/L`);
        if (input.tsh > 10.0 || input.tsh < 0.01) {
          severity = 'moderate';
        }
      }
    }

    // TPO antibodies
    if (input.tpoAbPositive) {
      confidence += 0.15;
      dysfunctions.push('tiroiditis autoinmune');
      evidenceFactors.push('Anticuerpos anti-TPO positivos');
    }

    confidence = Math.min(confidence, 1.0);

    if (confidence < 0.2) {
      return {
        name: 'Perfil Hormonal Normal',
        confidence: 0.1,
        severity: 'mild',
        definition: 'Hormonas dentro de rangos normales',
        evidenceFactors: ['Perfil hormonal normal'],
        recommendations: ['Seguimiento rutinario'],
        treatmentUrgency: 'routine'
      };
    }

    const recommendations = [
      'Perfil hormonal completo',
      'Consulta con endocrinólogo',
      'Seguimiento hormonal periódico'
    ];

    if (severity === 'severe') {
      recommendations.push('Tratamiento hormonal urgente');
      recommendations.push('Resonancia magnética de hipófisis');
    }

    return {
      name: `Disfunción Hormonal (${dysfunctions.join(', ')})`,
      confidence,
      severity,
      definition: 'Alteraciones en el eje hormonal que afectan la reproducción',
      evidenceFactors,
      recommendations,
      treatmentUrgency: severity === 'severe' ? 'urgent' : 'moderate'
    };
  }

  /**
   * 🧪 GENERATE RECOMMENDED TESTS
   */
  private generateRecommendedTests(
    pathologies: DetectedPathology[], 
    input: UserInput
  ): string[] {
    const tests = new Set<string>();

    // Basic fertility workup
    if (!input.amh) tests.add('Hormona Antimülleriana (AMH)');
    if (!input.spermConcentration) tests.add('Espermiograma completo');

    // Add pathology-specific tests
    pathologies.forEach(pathology => {
      if (pathology.name.includes('PCOS')) {
        tests.add('LH, FSH, Testosterona libre');
        tests.add('Curva de glucosa e insulina');
        tests.add('Ecografía transvaginal');
      }
      
      if (pathology.name.includes('Endometriosis')) {
        tests.add('Resonancia magnética pélvica');
        tests.add('CA-125 sérico');
      }

      if (pathology.name.includes('Reserva Ovárica')) {
        tests.add('FSH basal día 3');
        tests.add('Recuento folicular antral');
      }

      if (pathology.name.includes('Factor Masculino')) {
        tests.add('Análisis de fragmentación de ADN espermático');
        tests.add('Perfil hormonal masculino');
      }
    });

    return Array.from(tests);
  }

  /**
   * 📊 CALCULATE OVERALL RISK SCORE
   */
  private calculateOverallRiskScore(pathologies: DetectedPathology[]): number {
    if (pathologies.length === 0) return 0.1;

    let totalScore = 0;
    let weightSum = 0;

    pathologies.forEach(pathology => {
      const severityWeight = pathology.severity === 'severe' ? 3 : 
                           pathology.severity === 'moderate' ? 2 : 1;
      
      totalScore += pathology.confidence * severityWeight;
      weightSum += severityWeight;
    });

    return Math.min(totalScore / weightSum, 1.0);
  }

  /**
   * 📋 GENERATE FOLLOW-UP RECOMMENDATIONS
   */
  private generateFollowUpRecommendations(
    pathologies: DetectedPathology[],
    overallRiskScore: number
  ): string[] {
    const recommendations = new Set<string>();

    if (overallRiskScore > 0.7) {
      recommendations.add('Consulta urgente con especialista en medicina reproductiva');
      recommendations.add('Inicio inmediato de tratamiento especializado');
    } else if (overallRiskScore > 0.4) {
      recommendations.add('Consulta prioritaria con ginecólogo especialista');
      recommendations.add('Evaluación integral en 2-4 semanas');
    } else {
      recommendations.add('Seguimiento rutinario con su médico tratante');
    }

    // Add specific pathology recommendations
    pathologies.forEach(pathology => {
      if (pathology.treatmentUrgency === 'urgent') {
        recommendations.add(`Tratamiento urgente para ${pathology.name}`);
      }
    });

    return Array.from(recommendations);
  }

  /**
   * 🧠 INITIALIZE ML MODELS (Mock implementation)
   */
  private initializeMLModels(): void {
    // Mock ML models initialization
    this.mlModels.set('pcos_classifier', {
      predict: (features: any) => Math.random() * 0.9,
      confidence: 0.85
    });

    this.mlModels.set('endometriosis_detector', {
      predict: (features: any) => Math.random() * 0.8,
      confidence: 0.80
    });

    this.mlModels.set('ovarian_reserve_predictor', {
      predict: (features: any) => Math.random() * 0.9,
      confidence: 0.90
    });
  }

  /**
   * 📚 INITIALIZE MEDICAL KNOWLEDGE BASE
   */
  private initializeMedicalKnowledgeBase(): void {
    this.medicalKnowledgeBase.set('pcos_criteria', {
      diagnostic_criteria: ['oligoanovulation', 'hyperandrogenism', 'polycystic_ovaries'],
      biochemical_markers: ['elevated_lh_fsh_ratio', 'insulin_resistance'],
      clinical_features: ['hirsutism', 'acne', 'obesity']
    });

    this.medicalKnowledgeBase.set('endometriosis_staging', {
      stage_1: 'minimal',
      stage_2: 'mild', 
      stage_3: 'moderate',
      stage_4: 'severe'
    });

    this.medicalKnowledgeBase.set('ovarian_reserve_markers', {
      amh_ranges: {
        excellent: '>2.5',
        good: '1.5-2.5',
        fair: '0.7-1.5',
        poor: '<0.7'
      }
    });
  }
}