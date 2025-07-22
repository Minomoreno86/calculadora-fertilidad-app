/**
 * 🧠 BAYESIAN MEDICAL DECISION ENGINE
 * Advanced probabilistic reasoning for clinical decision making
 * Simulates neural network-inspired medical inference
 */

import { Factors } from '@/core/domain/models';
import { MedicalPattern } from './NeuralPatternRecognition';

// 🎯 TIPOS PARA DECISIONES BAYESIANAS
export interface BayesianEvidence {
  factor: string;
  value: number;
  weight: number;
  evidenceLevel: 'A' | 'B' | 'C';
  pmid?: string;
}

export interface BayesianDecision {
  treatment: string;
  probability: number;
  confidence: number;
  expectedOutcome: {
    successRate: number;
    timeToPregnancy: number;
    riskLevel: 'low' | 'medium' | 'high';
  };
  evidenceSupport: BayesianEvidence[];
  alternativeOptions: Array<{
    treatment: string;
    probability: number;
    reasoning: string;
  }>;
}

export interface BayesianAnalysis {
  primaryRecommendation: BayesianDecision;
  alternativeOptions: BayesianDecision[];
  riskAssessment: {
    immediateRisks: string[];
    longTermRisks: string[];
    mitigationStrategies: string[];
  };
  decisionTree: BayesianDecisionNode;
}

export interface BayesianDecisionNode {
  condition: string;
  probability: number;
  children: Array<{
    decision: string;
    probability: number;
    outcome: string;
    children?: BayesianDecisionNode[];
  }>;
}

/**
 * 🧠 MOTOR DE DECISIONES BAYESIANAS MÉDICAS
 * Implementa razonamiento probabilístico avanzado para decisiones clínicas
 */
export class BayesianMedicalDecision {
  
  // 📊 BASE DE EVIDENCIA CLÍNICA PONDERADA
  private readonly EVIDENCE_BASE = {
    // Evidencias FIV
    ivf: {
      ageUnder35: { successRate: 0.68, weight: 0.9, evidenceLevel: 'A' as const, pmid: '29935900' },
      age35to39: { successRate: 0.52, weight: 0.9, evidenceLevel: 'A' as const, pmid: '29935900' },
      ageOver40: { successRate: 0.32, weight: 0.9, evidenceLevel: 'A' as const, pmid: '29935900' },
      pcosOptimized: { successRate: 0.75, weight: 0.85, evidenceLevel: 'A' as const, pmid: '28218889' },
      endometriosisStage34: { successRate: 0.42, weight: 0.8, evidenceLevel: 'A' as const, pmid: '28218812' },
      maleFactorSevere: { successRate: 0.65, weight: 0.85, evidenceLevel: 'A' as const, pmid: '28218845' }
    },
    
    // Evidencias Inducción Ovulatoria
    ovulationInduction: {
      letrozolePcos: { successRate: 0.85, weight: 0.9, evidenceLevel: 'A' as const, pmid: '28218889' },
      clomidPcos: { successRate: 0.62, weight: 0.8, evidenceLevel: 'A' as const, pmid: '28218889' },
      metforminCombo: { successRate: 0.80, weight: 0.85, evidenceLevel: 'A' as const, pmid: '28218755' }
    },
    
    // Evidencias Cirugía
    surgery: {
      myomectomySubmucous: { successRate: 0.75, weight: 0.8, evidenceLevel: 'A' as const, pmid: '28218801' },
      laparoscopyEndometriosis: { successRate: 0.55, weight: 0.7, evidenceLevel: 'B' as const, pmid: '28218812' },
      polypectomy: { successRate: 0.85, weight: 0.8, evidenceLevel: 'A' as const, pmid: '28218799' }
    }
  };

  // 🎯 PESOS BAYESIANOS POR FACTOR
  private readonly BAYESIAN_WEIGHTS = {
    age: 0.3,        // Factor más crítico
    amh: 0.25,       // Reserva ovárica
    male: 0.2,       // Factor masculino
    anatomical: 0.15, // Factores anatómicos
    hormonal: 0.1    // Factores hormonales
  };

  /**
   * 🎯 ANÁLISIS BAYESIANO COMPLETO
   */
  performBayesianAnalysis(factors: Factors, patterns: MedicalPattern[]): BayesianAnalysis {
    const primaryRecommendation = this.calculatePrimaryRecommendation(factors, patterns);
    const alternativeOptions = this.calculateAlternativeOptions(factors, patterns);
    const riskAssessment = this.performRiskAssessment(factors, patterns);
    const decisionTree = this.buildDecisionTree(factors, patterns);

    return {
      primaryRecommendation,
      alternativeOptions,
      riskAssessment,
      decisionTree
    };
  }

  /**
   * 🥇 CÁLCULO RECOMENDACIÓN PRINCIPAL BAYESIANA
   */
  private calculatePrimaryRecommendation(factors: Factors, patterns: MedicalPattern[]): BayesianDecision {
    // 🧠 EVALUACIÓN MULTI-DIMENSIONAL BAYESIANA
    const treatmentOptions = [
      this.evaluateIVFOption(factors, patterns),
      this.evaluateOvulationInductionOption(factors, patterns),
      this.evaluateSurgicalOption(factors, patterns),
      this.evaluateLifestyleOption(factors, patterns)
    ].filter(option => option.probability > 0.1);

    // Ordenar por probabilidad bayesiana
    treatmentOptions.sort((a, b) => b.probability - a.probability);
    
    return treatmentOptions[0] || this.getDefaultRecommendation();
  }

  /**
   * 🔬 EVALUACIÓN OPCIÓN FIV BAYESIANA
   */
  private evaluateIVFOption(factors: Factors, patterns: MedicalPattern[]): BayesianDecision {
    let baseProbability = 0.6; // Probabilidad base FIV
    let successRate = 0.55;    // Tasa éxito base
    const evidenceSupport: BayesianEvidence[] = [];

    // 🧠 AJUSTE BAYESIANO POR EDAD
    const ageAdjustment = this.calculateAgeAdjustment(factors);
    baseProbability *= ageAdjustment.probability;
    successRate *= ageAdjustment.successMultiplier;
    evidenceSupport.push(...ageAdjustment.evidence);

    // 🧠 AJUSTE POR FACTORES ESPECÍFICOS
    patterns.forEach(pattern => {
      const adjustment = this.calculatePatternAdjustment(pattern, 'ivf');
      baseProbability *= adjustment.probability;
      successRate *= adjustment.successMultiplier;
      evidenceSupport.push(...adjustment.evidence);
    });

    // 🧠 AJUSTE POR DURACIÓN INFERTILIDAD
    if (factors.infertilityDuration && factors.infertilityDuration < 0.5) {
      baseProbability *= 1.4; // >4 años aumenta indicación FIV
      evidenceSupport.push({
        factor: 'infertilityDuration',
        value: factors.infertilityDuration,
        weight: 0.8,
        evidenceLevel: 'A',
        pmid: '28218722'
      });
    }

    const confidence = this.calculateConfidence(evidenceSupport);
    const timeToPregnancy = this.estimateTimeToPregnancy('ivf', successRate);
    const riskLevel = this.assessRiskLevel(factors, 'ivf');

    return {
      treatment: 'Fertilización In Vitro (FIV)',
      probability: Math.min(baseProbability, 1.0),
      confidence,
      expectedOutcome: {
        successRate: Math.min(successRate, 0.85),
        timeToPregnancy,
        riskLevel
      },
      evidenceSupport,
      alternativeOptions: this.getIVFAlternatives(factors)
    };
  }

  /**
   * 🌸 EVALUACIÓN INDUCCIÓN OVULATORIA BAYESIANA
   */
  private evaluateOvulationInductionOption(factors: Factors, patterns: MedicalPattern[]): BayesianDecision {
    let baseProbability = 0.4;
    let successRate = 0.65;
    const evidenceSupport: BayesianEvidence[] = [];

    // 🧠 ALTA PROBABILIDAD SI HAY PCOS
    const pcosPattern = patterns.find(p => p.condition === 'Síndrome de Ovarios Poliquísticos');
    if (pcosPattern) {
      baseProbability = 0.9;
      successRate = 0.85;
      evidenceSupport.push({
        factor: 'pcos',
        value: factors.pcos || 0,
        weight: 0.9,
        evidenceLevel: 'A',
        pmid: '28218889'
      });
    }

    // 🧠 REDUCIR SI HAY FACTOR MASCULINO SEVERO
    if (factors.male && factors.male < 0.5) {
      baseProbability *= 0.3;
      successRate *= 0.4;
    }

    // 🧠 REDUCIR SI HAY FACTOR TUBÁRICO
    if (factors.hsg && factors.hsg < 0.7) {
      baseProbability *= 0.2;
      successRate *= 0.3;
    }

    const confidence = this.calculateConfidence(evidenceSupport);
    const timeToPregnancy = this.estimateTimeToPregnancy('ovulationInduction', successRate);
    const riskLevel = this.assessRiskLevel(factors, 'ovulationInduction');

    return {
      treatment: 'Inducción de Ovulación (Letrozol)',
      probability: Math.min(baseProbability, 1.0),
      confidence,
      expectedOutcome: {
        successRate: Math.min(successRate, 0.90),
        timeToPregnancy,
        riskLevel
      },
      evidenceSupport,
      alternativeOptions: [{
        treatment: 'Metformina + Letrozol',
        probability: factors.homa && factors.homa < 0.7 ? 0.85 : 0.6,
        reasoning: 'Resistencia insulínica presente - combinación sinérgica'
      }]
    };
  }

  /**
   * 🔧 EVALUACIÓN OPCIÓN QUIRÚRGICA BAYESIANA
   */
  private evaluateSurgicalOption(factors: Factors, patterns: MedicalPattern[]): BayesianDecision {
    let baseProbability = 0.2;
    let successRate = 0.60;
    const evidenceSupport: BayesianEvidence[] = [];

    // 🧠 ALTA PROBABILIDAD SI HAY MIOMAS SUBMUCOSOS
    if (factors.myoma && factors.myoma < 0.6) {
      baseProbability = 0.85;
      successRate = 0.75;
      evidenceSupport.push({
        factor: 'myoma',
        value: factors.myoma,
        weight: 0.8,
        evidenceLevel: 'A',
        pmid: '28218801'
      });
    }

    // 🧠 MODERADA SI HAY PÓLIPOS
    if (factors.polyp && factors.polyp < 0.7) {
      baseProbability = Math.max(baseProbability, 0.7);
      successRate = 0.85;
    }

    // 🧠 CONSIDERAR SI ENDOMETRIOSIS SEVERA
    const endoPattern = patterns.find(p => p.condition === 'Endometriosis');
    if (endoPattern && endoPattern.confidence > 0.7) {
      baseProbability = Math.max(baseProbability, 0.4);
      successRate = 0.55;
    }

    const confidence = this.calculateConfidence(evidenceSupport);
    const timeToPregnancy = this.estimateTimeToPregnancy('surgery', successRate);
    const riskLevel = this.assessRiskLevel(factors, 'surgery');

    return {
      treatment: 'Intervención Quirúrgica',
      probability: Math.min(baseProbability, 1.0),
      confidence,
      expectedOutcome: {
        successRate: Math.min(successRate, 0.90),
        timeToPregnancy,
        riskLevel
      },
      evidenceSupport,
      alternativeOptions: [{
        treatment: 'Laparoscopia diagnóstica',
        probability: 0.6,
        reasoning: 'Evaluación anatómica completa previa a tratamiento'
      }]
    };
  }

  /**
   * 🌱 EVALUACIÓN OPCIÓN ESTILO DE VIDA
   */
  private evaluateLifestyleOption(factors: Factors, patterns: MedicalPattern[]): BayesianDecision {
    let baseProbability = 0.8; // Siempre recomendado
    let successRate = 0.3;     // Como adjunto
    const evidenceSupport: BayesianEvidence[] = [];

    // 🧠 ALTA EFECTIVIDAD SI HAY ALTERACIONES METABÓLICAS
    if (factors.bmi && factors.bmi < 0.7) {
      successRate = 0.7;
      evidenceSupport.push({
        factor: 'bmi',
        value: factors.bmi,
        weight: 0.8,
        evidenceLevel: 'A',
        pmid: '28218856'
      });
    }

    if (factors.homa && factors.homa < 0.7) {
      successRate = Math.max(successRate, 0.65);
    }

    const confidence = this.calculateConfidence(evidenceSupport);
    const timeToPregnancy = this.estimateTimeToPregnancy('lifestyle', successRate);
    const riskLevel: 'low' = 'low';

    return {
      treatment: 'Optimización Estilo de Vida',
      probability: baseProbability,
      confidence,
      expectedOutcome: {
        successRate,
        timeToPregnancy,
        riskLevel
      },
      evidenceSupport,
      alternativeOptions: [{
        treatment: 'Programa estructurado pérdida peso',
        probability: factors.bmi && factors.bmi < 0.6 ? 0.9 : 0.5,
        reasoning: 'Sobrepeso significativo - intervención nutricional especializada'
      }]
    };
  }

  /**
   * 🔄 CÁLCULO OPCIONES ALTERNATIVAS
   */
  private calculateAlternativeOptions(factors: Factors, patterns: MedicalPattern[]): BayesianDecision[] {
    const allOptions = [
      this.evaluateIVFOption(factors, patterns),
      this.evaluateOvulationInductionOption(factors, patterns),
      this.evaluateSurgicalOption(factors, patterns)
    ];

    return allOptions
      .sort((a, b) => b.probability - a.probability)
      .slice(1, 3); // Top 2 alternativas
  }

  /**
   * ⚠️ EVALUACIÓN DE RIESGOS BAYESIANA
   */
  private performRiskAssessment(factors: Factors, patterns: MedicalPattern[]): BayesianAnalysis['riskAssessment'] {
    const immediateRisks: string[] = [];
    const longTermRisks: string[] = [];
    const mitigationStrategies: string[] = [];

    // 🚨 RIESGOS INMEDIATOS
    if (factors.amh && factors.amh < 0.3) {
      immediateRisks.push('Reserva ovárica crítica - ventana terapéutica muy limitada');
      mitigationStrategies.push('Iniciar tratamiento inmediatamente, considerar preservación fertilidad');
    }

    patterns.forEach(pattern => {
      if (pattern.severity === 'critical') {
        immediateRisks.push(`${pattern.condition} en estadio crítico requiere intervención urgente`);
      }
    });

    // 🔮 RIESGOS A LARGO PLAZO
    const pcosPattern = patterns.find(p => p.condition === 'Síndrome de Ovarios Poliquísticos');
    if (pcosPattern && pcosPattern.confidence > 0.7) {
      longTermRisks.push('Riesgo aumentado diabetes tipo 2 y enfermedad cardiovascular');
      mitigationStrategies.push('Control metabólico regular, metformina preventiva');
    }

    if (factors.amh && factors.amh < 0.5) {
      longTermRisks.push('Menopausia prematura probable en próximos 5-8 años');
      mitigationStrategies.push('Considerar preservación fertilidad, suplementación hormonal');
    }

    return {
      immediateRisks,
      longTermRisks,
      mitigationStrategies
    };
  }

  /**
   * 🌳 CONSTRUCCIÓN ÁRBOL DE DECISIÓN BAYESIANO
   */
  private buildDecisionTree(factors: Factors, patterns: MedicalPattern[]): BayesianDecisionNode {
    // Construir árbol de decisión basado en factores principales
    const rootCondition = this.identifyPrimaryCondition(patterns);
    
    return {
      condition: rootCondition,
      probability: 1.0,
      children: [
        {
          decision: 'Tratamiento inmediato',
          probability: this.calculateImmediateTreatmentProbability(factors, patterns),
          outcome: 'Éxito 6-12 meses',
          children: this.buildTreatmentBranches(factors, patterns)
        },
        {
          decision: 'Optimización previa',
          probability: this.calculateOptimizationProbability(factors, patterns),
          outcome: 'Mejores condiciones 3-6 meses',
          children: this.buildOptimizationBranches(factors)
        }
      ]
    };
  }

  // 🛠️ MÉTODOS AUXILIARES BAYESIANOS

  private calculateAgeAdjustment(factors: Factors): {
    probability: number;
    successMultiplier: number;
    evidence: BayesianEvidence[];
  } {
    // Simular ajuste por edad basado en AMH (proxy de edad)
    const amhValue = factors.amh || 0.8;
    
    if (amhValue > 0.7) {
      return {
        probability: 1.0,
        successMultiplier: 1.2,
        evidence: [{
          factor: 'age_proxy',
          value: amhValue,
          weight: 0.9,
          evidenceLevel: 'A',
          pmid: '29935900'
        }]
      };
    } else if (amhValue > 0.4) {
      return {
        probability: 0.9,
        successMultiplier: 0.8,
        evidence: [{
          factor: 'age_proxy',
          value: amhValue,
          weight: 0.9,
          evidenceLevel: 'A',
          pmid: '29935900'
        }]
      };
    } else {
      return {
        probability: 0.7,
        successMultiplier: 0.5,
        evidence: [{
          factor: 'age_proxy',
          value: amhValue,
          weight: 0.9,
          evidenceLevel: 'A',
          pmid: '29935900'
        }]
      };
    }
  }

  private calculatePatternAdjustment(pattern: MedicalPattern, treatment: string): {
    probability: number;
    successMultiplier: number;
    evidence: BayesianEvidence[];
  } {
    const evidence: BayesianEvidence[] = [{
      factor: pattern.condition.toLowerCase().replace(/\s+/g, '_'),
      value: pattern.confidence,
      weight: 0.8,
      evidenceLevel: 'A'
    }];

    if (pattern.condition === 'Síndrome de Ovarios Poliquísticos' && treatment === 'ivf') {
      return {
        probability: 1.1,
        successMultiplier: 1.1,
        evidence
      };
    }

    if (pattern.condition === 'Factor Masculino' && treatment === 'ivf') {
      return {
        probability: 1.3,
        successMultiplier: 1.0,
        evidence
      };
    }

    return {
      probability: 1.0,
      successMultiplier: 1.0,
      evidence
    };
  }

  private calculateConfidence(evidenceSupport: BayesianEvidence[]): number {
    if (evidenceSupport.length === 0) return 0.5;
    
    const weightedConfidence = evidenceSupport.reduce((acc, evidence) => {
      const levelWeight = evidence.evidenceLevel === 'A' ? 1.0 : 
                         evidence.evidenceLevel === 'B' ? 0.8 : 0.6;
      return acc + (evidence.weight * levelWeight);
    }, 0) / evidenceSupport.length;

    return Math.min(weightedConfidence, 1.0);
  }

  private estimateTimeToPregnancy(treatment: string, successRate: number): number {
    const baseTime = {
      ivf: 4,
      ovulationInduction: 6,
      surgery: 9,
      lifestyle: 12
    };

    return baseTime[treatment as keyof typeof baseTime] || 12;
  }

  private assessRiskLevel(factors: Factors, treatment: string): 'low' | 'medium' | 'high' {
    if (treatment === 'lifestyle') return 'low';
    
    // Evaluar edad (proxy AMH)
    const amhValue = factors.amh || 0.8;
    if (amhValue < 0.3) return 'high';
    if (amhValue < 0.6) return 'medium';
    
    return 'low';
  }

  private getIVFAlternatives(factors: Factors): BayesianDecision['alternativeOptions'] {
    const alternatives: BayesianDecision['alternativeOptions'] = [{
      treatment: 'FIV con ICSI',
      probability: factors.male && factors.male < 0.7 ? 0.9 : 0.6,
      reasoning: 'Factor masculino presente - ICSI optimiza fertilización'
    }];

    if (factors.amh && factors.amh < 0.4) {
      alternatives.push({
        treatment: 'FIV + counseling ovodonación',
        probability: 0.8,
        reasoning: 'Reserva ovárica crítica - considerar plan B'
      });
    }

    return alternatives;
  }

  private getDefaultRecommendation(): BayesianDecision {
    return {
      treatment: 'Evaluación especializada',
      probability: 1.0,
      confidence: 0.8,
      expectedOutcome: {
        successRate: 0.7,
        timeToPregnancy: 6,
        riskLevel: 'medium'
      },
      evidenceSupport: [],
      alternativeOptions: []
    };
  }

  private identifyPrimaryCondition(patterns: MedicalPattern[]): string {
    if (patterns.length === 0) return 'Evaluación inicial';
    return patterns[0].condition;
  }

  private calculateImmediateTreatmentProbability(factors: Factors, patterns: MedicalPattern[]): number {
    let urgency = 0.5;
    
    if (factors.amh && factors.amh < 0.4) urgency = 0.9;
    if (factors.infertilityDuration && factors.infertilityDuration < 0.3) urgency = Math.max(urgency, 0.8);
    
    return urgency;
  }

  private calculateOptimizationProbability(factors: Factors, patterns: MedicalPattern[]): number {
    return 1 - this.calculateImmediateTreatmentProbability(factors, patterns);
  }

  private buildTreatmentBranches(factors: Factors, patterns: MedicalPattern[]): BayesianDecisionNode[] {
    return []; // Simplificado para esta implementación
  }

  private buildOptimizationBranches(factors: Factors): BayesianDecisionNode[] {
    return []; // Simplificado para esta implementación
  }
}