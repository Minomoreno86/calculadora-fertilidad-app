/**
 * 🧠 MOTOR DE RAZONAMIENTO CLÍNICO - AGENTE IA MÉDICO
 * Sistema de análisis diagnóstico y recomendación terapéutica
 */

import { PathologyAnalyzer } from '../knowledge-base/pathologies';
import { TreatmentRecommender, TREATMENTS_DATABASE } from '../knowledge-base/treatments';

export interface UserInput {
  // Datos demográficos
  age: number;
  partnerAge?: number;
  bmi: number;
  
  // Historia médica
  infertilityDuration: number; // meses
  menstrualCycleLength?: number;
  previousPregnancies: number;
  previousLosses: number;
  
  // Síntomas reportados
  symptoms: string[];
  
  // Resultados de laboratorio
  labs?: {
    fsh?: number;
    lh?: number;
    estradiol?: number;
    progesterone?: number;
    prolactin?: number;
    tsh?: number;
    amh?: number;
    testosterone?: number;
  };
  
  // Factor masculino
  maleFactors?: {
    concentration?: number; // millones/ml
    motility?: number; // %
    morphology?: number; // %
    volume?: number; // ml
  };
  
  // Tratamientos previos
  priorTreatments: string[];
  
  // Preferencias
  preferences?: {
    maxComplexity?: 'low' | 'medium' | 'high';
    budgetRange?: 'low' | 'medium' | 'high';
    timeframe?: 'urgent' | 'normal' | 'flexible';
  };
}

export interface DiagnosticAnalysis {
  primaryDiagnoses: Array<{
    pathology: string;
    probability: number;
    reasoning: string;
    evidenceLevel: string;
  }>;
  secondaryDiagnoses: Array<{
    pathology: string;
    probability: number;
    reasoning: string;
  }>;
  riskFactors: string[];
  prognosticFactors: {
    favorable: string[];
    unfavorable: string[];
  };
  urgencyLevel: 'low' | 'medium' | 'high';
  recommendedTests: string[];
}

export interface TreatmentPlan {
  recommendedTreatments: Array<{
    treatment: string;
    priority: number;
    reasoning: string;
    successRate: {
      perCycle: number;
      cumulative: number;
    };
    timeframe: string;
    costs: string;
  }>;
  alternativeTreatments: Array<{
    treatment: string;
    reasoning: string;
    conditions: string;
  }>;
  lifestyle: string[];
  monitoring: string[];
  followUp: string[];
  nextSteps: {
    ifSuccess: string;
    ifFailure: string[];
  };
}

export interface SuccessPrediction {
  probabilityNatural: number;
  probabilityWithTreatment: number;
  timeToConception: {
    natural: string;
    withTreatment: string;
  };
  factors: {
    positive: string[];
    negative: string[];
  };
  recommendations: string[];
}

/**
 * 🔍 ANALIZADOR DIAGNÓSTICO PRINCIPAL
 */
export class ClinicalDiagnosticAnalyzer {
  static analyzeDiagnosis(userInput: UserInput): DiagnosticAnalysis {
    const primaryDiagnoses: DiagnosticAnalysis['primaryDiagnoses'] = [];
    const secondaryDiagnoses: DiagnosticAnalysis['secondaryDiagnoses'] = [];
    const riskFactors: string[] = [];
    
    // 🔍 ANÁLISIS POR EDAD
    if (userInput.age > 35) {
      riskFactors.push('Edad materna avanzada');
      if (userInput.age > 40) {
        primaryDiagnoses.push({
          pathology: 'Age-related fertility decline',
          probability: 80,
          reasoning: 'Edad >40 años es factor principal de declive fertilidad',
          evidenceLevel: 'A'
        });
      }
    }
    
    // 🔍 ANÁLISIS HORMONAL
    if (userInput.labs) {
      const labs = userInput.labs;
      
      // FSH elevado - insuficiencia ovárica
      if (labs.fsh && labs.fsh > 10) {
        const probability = labs.fsh > 20 ? 90 : labs.fsh > 15 ? 70 : 50;
        primaryDiagnoses.push({
          pathology: 'prematureOvarianFailure',
          probability,
          reasoning: `FSH ${labs.fsh} UI/L indica reserva ovárica disminuida`,
          evidenceLevel: 'A'
        });
      }
      
      // LH/FSH ratio - PCOS
      if (labs.lh && labs.fsh && (labs.lh / labs.fsh) > 2) {
        primaryDiagnoses.push({
          pathology: 'PCOS',
          probability: 70,
          reasoning: 'Ratio LH/FSH >2 sugiere síndrome ovario poliquístico',
          evidenceLevel: 'B'
        });
      }
      
      // Prolactina elevada
      if (labs.prolactin && labs.prolactin > 25) {
        secondaryDiagnoses.push({
          pathology: 'Hyperprolactinemia',
          probability: 80,
          reasoning: `Prolactina ${labs.prolactin} ng/ml por encima rango normal`,
        });
      }
      
      // TSH alterado
      if (labs.tsh && (labs.tsh < 0.4 || labs.tsh > 4.0)) {
        secondaryDiagnoses.push({
          pathology: 'Thyroid dysfunction',
          probability: 85,
          reasoning: `TSH ${labs.tsh} fuera rango óptimo fertilidad (0.4-2.5)`,
        });
      }
    }
    
    // 🔍 ANÁLISIS FACTOR MASCULINO
    if (userInput.maleFactors) {
      const mf = userInput.maleFactors;
      let maleFactorScore = 0;
      
      if (mf.concentration && mf.concentration < 15) maleFactorScore += 30;
      if (mf.motility && mf.motility < 40) maleFactorScore += 25;
      if (mf.morphology && mf.morphology < 4) maleFactorScore += 20;
      if (mf.volume && mf.volume < 1.5) maleFactorScore += 15;
      
      if (maleFactorScore > 40) {
        primaryDiagnoses.push({
          pathology: 'maleInfertility',
          probability: Math.min(90, maleFactorScore + 20),
          reasoning: 'Parámetros seminales alterados según criterios WHO 2021',
          evidenceLevel: 'A'
        });
      }
    }
    
    // 🔍 ANÁLISIS POR SÍNTOMAS
    const symptomAnalysis = PathologyAnalyzer.findBySymptoms(userInput.symptoms);
    symptomAnalysis.forEach(pathology => {
      const probability = PathologyAnalyzer.calculateProbabilityScore(
        pathology.id,
        userInput.symptoms,
        riskFactors
      );
      
      if (probability > 60) {
        primaryDiagnoses.push({
          pathology: pathology.id,
          probability,
          reasoning: `Síntomas concordantes con ${pathology.nameES}`,
          evidenceLevel: pathology.evidenceLevel
        });
      } else if (probability > 30) {
        secondaryDiagnoses.push({
          pathology: pathology.id,
          probability,
          reasoning: `Algunos síntomas sugieren ${pathology.nameES}`
        });
      }
    });
    
    // 🔍 DURACIÓN INFERTILIDAD
    if (userInput.infertilityDuration > 24 && primaryDiagnoses.length === 0) {
      primaryDiagnoses.push({
        pathology: 'unexplainedInfertility',
        probability: 60,
        reasoning: 'Infertilidad >2 años sin causa aparente identificada',
        evidenceLevel: 'B'
      });
    }
    
    // 🚨 NIVEL DE URGENCIA
    let urgencyLevel: DiagnosticAnalysis['urgencyLevel'] = 'low';
    if (userInput.age > 40 || userInput.infertilityDuration > 36) {
      urgencyLevel = 'high';
    } else if (userInput.age > 35 || userInput.infertilityDuration > 18) {
      urgencyLevel = 'medium';
    }
    
    // 📋 TESTS RECOMENDADOS
    const recommendedTests: string[] = [];
    if (!userInput.labs?.fsh) recommendedTests.push('Perfil hormonal basal (FSH, LH, E2)');
    if (!userInput.labs?.amh) recommendedTests.push('Hormona antimülleriana (AMH)');
    if (!userInput.labs?.tsh) recommendedTests.push('Función tiroidea (TSH, T4L)');
    if (!userInput.maleFactors) recommendedTests.push('Espermiograma según WHO 2021');
    if (userInput.symptoms.includes('dolor pélvico')) {
      recommendedTests.push('Ecografía transvaginal');
    }
    
    return {
      primaryDiagnoses: primaryDiagnoses.sort((a, b) => b.probability - a.probability),
      secondaryDiagnoses: secondaryDiagnoses.sort((a, b) => b.probability - a.probability),
      riskFactors,
      prognosticFactors: {
        favorable: this.getFavorableFactors(userInput),
        unfavorable: this.getUnfavorableFactors(userInput)
      },
      urgencyLevel,
      recommendedTests
    };
  }
  
  private static getFavorableFactors(userInput: UserInput): string[] {
    const factors: string[] = [];
    
    if (userInput.age < 35) factors.push('Edad materna favorable (<35 años)');
    if (userInput.bmi >= 18.5 && userInput.bmi <= 25) factors.push('IMC normal');
    if (userInput.infertilityDuration < 12) factors.push('Duración infertilidad corta');
    if (userInput.menstrualCycleLength && userInput.menstrualCycleLength >= 26 && userInput.menstrualCycleLength <= 35) {
      factors.push('Ciclos menstruales regulares');
    }
    if (userInput.labs?.amh && userInput.labs.amh > 1.5) {
      factors.push('Reserva ovárica adecuada (AMH >1.5)');
    }
    
    return factors;
  }
  
  private static getUnfavorableFactors(userInput: UserInput): string[] {
    const factors: string[] = [];
    
    if (userInput.age > 37) factors.push('Edad materna avanzada');
    if (userInput.bmi > 30 || userInput.bmi < 18.5) factors.push('IMC fuera rango óptimo');
    if (userInput.infertilityDuration > 24) factors.push('Infertilidad prolongada');
    if (userInput.previousLosses > 2) factors.push('Historia abortos recurrentes');
    if (userInput.priorTreatments.length > 3) factors.push('Múltiples tratamientos previos fallidos');
    if (userInput.labs?.amh && userInput.labs.amh < 1.0) {
      factors.push('Reserva ovárica disminuida (AMH <1.0)');
    }
    
    return factors;
  }
}

/**
 * 🎯 RECOMENDADOR TERAPÉUTICO INTELIGENTE
 */
export class SmartTreatmentRecommender {
  static generateTreatmentPlan(
    userInput: UserInput,
    diagnosis: DiagnosticAnalysis
  ): TreatmentPlan {
    const primaryDiagnoses = diagnosis.primaryDiagnoses.map(d => d.pathology);
    
    // Obtener recomendaciones base
    const baseRecommendations = TreatmentRecommender.recommendTreatment(
      primaryDiagnoses,
      userInput.age,
      userInput.infertilityDuration,
      userInput.priorTreatments
    );
    
    const recommendedTreatments = baseRecommendations.map((treatment, index) => {
      const successRate = TreatmentRecommender.calculateSuccessRate(treatment.id, userInput.age);
      
      return {
        treatment: treatment.id,
        priority: index + 1,
        reasoning: this.getTreatmentReasoning(treatment.id, diagnosis, userInput),
        successRate,
        timeframe: treatment.successRate.timeToSuccess,
        costs: treatment.costs.estimate
      };
    });
    
    // Alternativas basadas en preferencias
    const alternativeTreatments = this.getAlternativeTreatments(userInput, diagnosis);
    
    // Recomendaciones lifestyle
    const lifestyle = this.getLifestyleRecommendations(userInput, diagnosis);
    
    return {
      recommendedTreatments,
      alternativeTreatments,
      lifestyle,
      monitoring: this.getMonitoringPlan(diagnosis),
      followUp: this.getFollowUpPlan(userInput, diagnosis),
      nextSteps: {
        ifSuccess: 'Seguimiento obstétrico especializado',
        ifFailure: this.getFailurePlan(recommendedTreatments[0]?.treatment)
      }
    };
  }
  
  private static getTreatmentReasoning(
    treatmentId: string,
    diagnosis: DiagnosticAnalysis,
    userInput: UserInput
  ): string {
    const treatment = TREATMENTS_DATABASE[treatmentId];
    if (!treatment) return 'Tratamiento estándar recomendado';
    
    const reasons: string[] = [];
    
    // Razones por diagnóstico
    diagnosis.primaryDiagnoses.forEach(d => {
      if (treatment.indications.some(indication => 
        indication.toLowerCase().includes(d.pathology.toLowerCase())
      )) {
        reasons.push(`Indicado para ${d.pathology}`);
      }
    });
    
    // Razones por edad
    if (userInput.age > 35 && treatment.complexity === 'high') {
      reasons.push('Edad materna requiere tratamiento más agresivo');
    }
    
    // Razones por duración
    if (userInput.infertilityDuration > 24 && treatment.complexity !== 'low') {
      reasons.push('Duración infertilidad justifica escalamiento terapéutico');
    }
    
    return reasons.join('. ') || 'Tratamiento apropiado según guías clínicas';
  }
  
  private static getAlternativeTreatments(
    userInput: UserInput,
    diagnosis: DiagnosticAnalysis
  ): TreatmentPlan['alternativeTreatments'] {
    const alternatives: TreatmentPlan['alternativeTreatments'] = [];
    
    // Si prefiere baja complejidad pero necesita alta
    if (userInput.preferences?.maxComplexity === 'low' && userInput.age > 40) {
      alternatives.push({
        treatment: 'ovulationInduction',
        reasoning: 'Opción menos invasiva según preferencia paciente',
        conditions: 'Menor probabilidad éxito por edad avanzada'
      });
    }
    
    // Si hay factor masculino severo
    if (diagnosis.primaryDiagnoses.some(d => d.pathology === 'maleInfertility')) {
      alternatives.push({
        treatment: 'ICSI',
        reasoning: 'Técnica especializada para factor masculino severo',
        conditions: 'Requiere FIV como base'
      });
    }
    
    return alternatives;
  }
  
  private static getLifestyleRecommendations(
    userInput: UserInput,
    diagnosis: DiagnosticAnalysis
  ): string[] {
    const recommendations: string[] = [];
    
    // Recomendaciones por IMC
    if (userInput.bmi > 25) {
      recommendations.push('Reducción peso: objetivo IMC 20-25 kg/m²');
    }
    if (userInput.bmi < 18.5) {
      recommendations.push('Aumento peso: objetivo IMC >18.5 kg/m²');
    }
    
    // Recomendaciones generales
    recommendations.push(
      'Suplementación ácido fólico 400-800mcg diarios',
      'Ejercicio moderado regular (150 min/semana)',
      'Dieta mediterránea rica en antioxidantes',
      'Evitar tabaco y alcohol',
      'Manejo stress: técnicas relajación'
    );
    
    // Específicas por diagnóstico
    if (diagnosis.primaryDiagnoses.some(d => d.pathology === 'PCOS')) {
      recommendations.push(
        'Dieta baja índice glicémico',
        'Considerar metformina si resistencia insulina'
      );
    }
    
    return recommendations;
  }
  
  private static getMonitoringPlan(diagnosis: DiagnosticAnalysis): string[] {
    const monitoring: string[] = [
      'Seguimiento mensual progreso tratamiento',
      'Monitoreo efectos secundarios medicamentos'
    ];
    
    if (diagnosis.primaryDiagnoses.some(d => d.pathology === 'PCOS')) {
      monitoring.push('Control metabólico: glucosa, lípidos');
    }
    
    if (diagnosis.urgencyLevel === 'high') {
      monitoring.push('Evaluación bimensual ajuste estrategia');
    }
    
    return monitoring;
  }
  
  private static getFollowUpPlan(
    userInput: UserInput,
    _diagnosis: DiagnosticAnalysis
  ): string[] {
    const followUp: string[] = [];
    
    if (userInput.age > 35) {
      followUp.push('Re-evaluación cada 3-6 meses máximo');
    } else {
      followUp.push('Re-evaluación cada 6-12 meses');
    }
    
    followUp.push(
      'Actualización estudios según evolución',
      'Soporte psicológico continuo',
      'Educación continua sobre proceso'
    );
    
    return followUp;
  }
  
  private static getFailurePlan(treatmentId?: string): string[] {
    if (!treatmentId) return ['Consultar especialista para re-evaluación'];
    
    const treatment = TREATMENTS_DATABASE[treatmentId];
    return treatment?.nextSteps.ifFailure || ['Consultar especialista'];
  }
}

/**
 * 🔮 PREDICTOR DE ÉXITO PERSONALIZADO
 */
export class SuccessPredictor {
  static predictSuccess(
    userInput: UserInput,
    diagnosis: DiagnosticAnalysis,
    treatmentPlan: TreatmentPlan
  ): SuccessPrediction {
    // Probabilidad natural (sin tratamiento)
    const probabilityNatural = this.calculateNaturalProbability(userInput, diagnosis);
    
    // Probabilidad con tratamiento recomendado
    const probabilityWithTreatment = treatmentPlan.recommendedTreatments[0]?.successRate.perCycle || 0;
    
    return {
      probabilityNatural,
      probabilityWithTreatment,
      timeToConception: {
        natural: this.estimateTimeToConception(probabilityNatural),
        withTreatment: treatmentPlan.recommendedTreatments[0]?.timeframe || 'Variable'
      },
      factors: {
        positive: diagnosis.prognosticFactors.favorable,
        negative: diagnosis.prognosticFactors.unfavorable
      },
      recommendations: this.getPersonalizedRecommendations(userInput, diagnosis)
    };
  }
  
  private static calculateNaturalProbability(
    userInput: UserInput,
    diagnosis: DiagnosticAnalysis
  ): number {
    let baseProbability = 20; // Base 20% anual
    
    // Ajuste por edad
    if (userInput.age > 35) baseProbability *= 0.6;
    if (userInput.age > 40) baseProbability *= 0.3;
    if (userInput.age > 42) baseProbability *= 0.1;
    
    // Ajuste por duración infertilidad
    if (userInput.infertilityDuration > 24) baseProbability *= 0.5;
    if (userInput.infertilityDuration > 36) baseProbability *= 0.3;
    
    // Ajuste por diagnósticos
    diagnosis.primaryDiagnoses.forEach(d => {
      if (d.pathology === 'tubalFactor') baseProbability *= 0.1;
      if (d.pathology === 'prematureOvarianFailure') baseProbability *= 0.05;
      if (d.pathology === 'maleInfertility') baseProbability *= 0.3;
    });
    
    return Math.max(1, Math.round(baseProbability));
  }
  
  private static estimateTimeToConception(probability: number): string {
    if (probability < 5) return '>3 años o poco probable naturalmente';
    if (probability < 15) return '2-3 años';
    if (probability < 25) return '1-2 años';
    return '6-12 meses';
  }
  
  private static getPersonalizedRecommendations(
    userInput: UserInput,
    diagnosis: DiagnosticAnalysis
  ): string[] {
    const recommendations: string[] = [];
    
    if (userInput.age > 35) {
      recommendations.push('Considerar tratamiento sin demora por edad materna');
    }
    
    if (diagnosis.urgencyLevel === 'high') {
      recommendations.push('Evaluación inmediata con especialista en fertilidad');
    }
    
    if (userInput.bmi > 30) {
      recommendations.push('Reducción peso mejorará significativamente probabilidades');
    }
    
    return recommendations;
  }
}

/**
 * 🧠 MOTOR PRINCIPAL DE RAZONAMIENTO CLÍNICO
 */
export class ClinicalReasoningEngine {
  static analyzeCase(userInput: UserInput) {
    console.log('🧠 Iniciando análisis clínico completo...');
    
    // 1. Análisis diagnóstico
    const diagnosis = ClinicalDiagnosticAnalyzer.analyzeDiagnosis(userInput);
    
    // 2. Generación plan terapéutico
    const treatmentPlan = SmartTreatmentRecommender.generateTreatmentPlan(userInput, diagnosis);
    
    // 3. Predicción de éxito
    const successPrediction = SuccessPredictor.predictSuccess(userInput, diagnosis, treatmentPlan);
    
    return {
      diagnosis,
      treatmentPlan,
      successPrediction,
      metadata: {
        analysisDate: new Date().toISOString(),
        version: '1.0.0',
        evidenceLevel: 'AI-assisted clinical reasoning'
      }
    };
  }
}

export default ClinicalReasoningEngine;
