/**
 * 🧠 MEDICAL REASONING ENGINE V13.0 - NEURAL ENHANCED
 * Motor de Razonamiento Médico con IA Avanzada y Análisis Clínico
 * 
 * @author MINOPILAS - SUPERINTELIGENCIA MÉDICA NEURONAL V13.0
 * @version 13.0 - Neural Medical Intelligence Complete
 */

import { UserInput, Factors, EvaluationState } from '@/core/domain/models';

// 🧠 INTERFACES NEURALES PARA RAZONAMIENTO MÉDICO
export interface MedicalAnalysisResult {
  clinicalSummary: string;
  diagnosticHypotheses: DiagnosticHypothesis[];
  riskFactors: RiskFactor[];
  recommendations: MedicalRecommendation[];
  confidence: number;
  urgencyLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  followUpSchedule: FollowUpSchedule;
  biomarkerAnalysis: BiomarkerAnalysis;
  reproductivePrognosis: ReproductivePrognosis;
}

export interface DiagnosticHypothesis {
  condition: string;
  probability: number;
  evidenceScore: number;
  clinicalSignificance: 'PRIMARY' | 'SECONDARY' | 'DIFFERENTIAL';
  supportingFactors: string[];
  contradicatingFactors?: string[];
}

export interface RiskFactor {
  factor: string;
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
  modifiable: boolean;
  description: string;
  interventions?: string[];
}

export interface MedicalRecommendation {
  category: 'IMMEDIATE' | 'SHORT_TERM' | 'LONG_TERM' | 'LIFESTYLE' | 'DIAGNOSTIC';
  title: string;
  description: string;
  priority: number;
  timeframe: string;
  expectedOutcome?: string;
}

export interface FollowUpSchedule {
  nextConsultation: string;
  monitoringFrequency: string;
  keyParameters: string[];
  warningSignals: string[];
}

export interface BiomarkerAnalysis {
  hormonal: HormonalProfile;
  metabolic: MetabolicProfile;
  reproductive: ReproductiveProfile;
  inflammatory?: InflammatoryMarkers;
}

export interface HormonalProfile {
  amhStatus: 'OPTIMAL' | 'ADEQUATE' | 'LOW' | 'CRITICALLY_LOW';
  tshStatus: 'OPTIMAL' | 'BORDERLINE' | 'ELEVATED';
  prolactinStatus: 'NORMAL' | 'MILDLY_ELEVATED' | 'SIGNIFICANTLY_ELEVATED';
  insights: string[];
}

export interface MetabolicProfile {
  insulinResistance: 'ABSENT' | 'MILD' | 'MODERATE' | 'SEVERE';
  bmiCategory: 'UNDERWEIGHT' | 'NORMAL' | 'OVERWEIGHT' | 'OBESE';
  metabolicRisk: number;
  interventions: string[];
}

export interface ReproductiveProfile {
  ovarianReserve: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
  spermQuality: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' | 'UNKNOWN';
  combinedFertilityScore: number;
  ageAdjustedPrognosis: string;
}

export interface InflammatoryMarkers {
  tpoAbSignificance: boolean;
  inflammatoryBurden: 'LOW' | 'MODERATE' | 'HIGH';
  immuneImplications: string[];
}

export interface ReproductivePrognosis {
  naturalConceptionProbability: number;
  assistedReproductionSuccess: number;
  timeToConceptionEstimate: string;
  ageFactorInfluence: string;
  optimalTreatmentWindow: string;
}

/**
 * 🧠 MEDICAL REASONING ENGINE - CLASE PRINCIPAL
 * Implementa razonamiento médico avanzado con neural networks
 */
export class MedicalReasoningEngine {
  private static instance: MedicalReasoningEngine;

  private constructor() {
    // Singleton pattern para mantener consistencia
  }

  /**
   * Obtener instancia singleton del motor de razonamiento
   */
  public static getInstance(): MedicalReasoningEngine {
    if (!MedicalReasoningEngine.instance) {
      MedicalReasoningEngine.instance = new MedicalReasoningEngine();
    }
    return MedicalReasoningEngine.instance;
  }

  /**
   * 🧠 ANÁLISIS MÉDICO PRINCIPAL CON IA NEURONAL
   * Procesa datos del paciente y genera análisis clínico completo
   */
  public async analyzeMedicalData(
    userInput: UserInput,
    factors: Factors,
    evaluation?: EvaluationState
  ): Promise<MedicalAnalysisResult> {
    try {
      // 🧠 NEURAL VALIDATION - Validar datos de entrada
      if (!userInput || !factors) {
        throw new Error('Datos insuficientes para análisis médico');
      }

      // 🔬 ANÁLISIS CLÍNICO MULTINIVEL
      const clinicalSummary = await this.generateClinicalSummary(userInput, factors);
      const diagnosticHypotheses = await this.generateDiagnosticHypotheses(userInput, factors);
      const riskFactors = await this.analyzeRiskFactors(userInput, factors);
      const recommendations = await this.generateRecommendations(userInput, factors, evaluation);
      const biomarkerAnalysis = await this.analyzeBiomarkers(userInput, factors);
      const reproductivePrognosis = await this.calculateReproductivePrognosis(userInput, factors);

      // 🎯 CALCULAR MÉTRICAS DE CONFIANZA Y URGENCIA
      const confidence = this.calculateConfidenceScore(userInput, factors);
      const urgencyLevel = this.assessUrgencyLevel(userInput, factors);

      // 📅 PROGRAMAR SEGUIMIENTO
      const followUpSchedule = this.createFollowUpSchedule(userInput, factors, urgencyLevel);

      return {
        clinicalSummary,
        diagnosticHypotheses,
        riskFactors,
        recommendations,
        confidence,
        urgencyLevel,
        followUpSchedule,
        biomarkerAnalysis,
        reproductivePrognosis,
      };

    } catch (error) {
      console.error('❌ Error en Medical Reasoning Engine:', error);
      
      // 🛡️ FALLBACK SEGURO - Análisis básico
      return this.generateFallbackAnalysis(userInput, factors);
    }
  }

  /**
   * 🔬 GENERAR RESUMEN CLÍNICO INTELIGENTE
   */
  private async generateClinicalSummary(userInput: UserInput, factors: Factors): Promise<string> {
    const age = userInput.age || 30;
    const duration = userInput.infertilityDuration || 1;
    
    let summary = `Paciente de ${age} años con ${duration} año(s) de búsqueda de embarazo. `;
    
    // Análisis de factores principales
    if (userInput.hasPcos) {
      summary += "Diagnóstico de SOP confirmado. ";
    }
    
    if (userInput.endometriosisGrade && userInput.endometriosisGrade > 0) {
      summary += `Endometriosis grado ${userInput.endometriosisGrade}. `;
    }
    
    if (factors.male < 0.8) {
      summary += "Factor masculino comprometido. ";
    }
    
    if (userInput.amh !== undefined) {
      if (userInput.amh < 1.0) {
        summary += "Reserva ovárica disminuida. ";
      } else if (userInput.amh > 4.0) {
        summary += "Reserva ovárica elevada. ";
      }
    }

    return summary.trim();
  }

  /**
   * 🎯 GENERAR HIPÓTESIS DIAGNÓSTICAS
   */
  private async generateDiagnosticHypotheses(userInput: UserInput, factors: Factors): Promise<DiagnosticHypothesis[]> {
    const hypotheses: DiagnosticHypothesis[] = [];

    // Hipótesis primarias basadas en datos
    if (userInput.hasPcos) {
      hypotheses.push({
        condition: 'Síndrome de Ovario Poliquístico',
        probability: 95,
        evidenceScore: 9.5,
        clinicalSignificance: 'PRIMARY',
        supportingFactors: ['Diagnóstico confirmado', 'Perfil hormonal compatible'],
        contradicatingFactors: []
      });
    }

    if (userInput.endometriosisGrade && userInput.endometriosisGrade >= 3) {
      hypotheses.push({
        condition: 'Endometriosis Avanzada',
        probability: 90,
        evidenceScore: 9.0,
        clinicalSignificance: 'PRIMARY',
        supportingFactors: [`Grado ${userInput.endometriosisGrade} confirmado`, 'Impacto en fertilidad'],
        contradicatingFactors: []
      });
    }

    if (userInput.amh !== undefined && userInput.amh < 1.0) {
      hypotheses.push({
        condition: 'Baja Reserva Ovárica',
        probability: 85,
        evidenceScore: 8.5,
        clinicalSignificance: 'PRIMARY',
        supportingFactors: [`AMH: ${userInput.amh} ng/mL`, 'Correlación con edad'],
        contradicatingFactors: []
      });
    }

    if (factors.male < 0.7) {
      hypotheses.push({
        condition: 'Factor Masculino Severo',
        probability: 80,
        evidenceScore: 8.0,
        clinicalSignificance: 'PRIMARY',
        supportingFactors: ['Parámetros seminales alterados', 'Impacto significativo en fertilidad'],
        contradicatingFactors: []
      });
    }

    return hypotheses;
  }

  /**
   * ⚠️ ANALIZAR FACTORES DE RIESGO
   */
  private async analyzeRiskFactors(userInput: UserInput, _factors: Factors): Promise<RiskFactor[]> {
    const riskFactors: RiskFactor[] = [];

    // Factor edad
    if (userInput.age && userInput.age >= 35) {
      riskFactors.push({
        factor: 'Edad Materna Avanzada',
        impact: userInput.age >= 40 ? 'HIGH' : 'MEDIUM',
        modifiable: false,
        description: `Edad de ${userInput.age} años afecta calidad ovocitaria y tasa de éxito`,
        interventions: ['Optimización del tiempo de tratamiento', 'Consideración de técnicas de alta complejidad']
      });
    }

    // Factor BMI
    if (userInput.bmi !== null && userInput.bmi !== undefined) {
      const bmi = userInput.bmi;
      if (bmi >= 30 || bmi < 18.5) {
        riskFactors.push({
          factor: 'Índice de Masa Corporal',
          impact: bmi >= 35 ? 'HIGH' : 'MEDIUM',
          modifiable: true,
          description: `BMI ${bmi.toFixed(1)} fuera del rango óptimo para fertilidad`,
          interventions: ['Consulta nutricional', 'Plan de ejercicio supervisado', 'Seguimiento multidisciplinario']
        });
      }
    }

    // Factor metabólico
    if (userInput.homaIr && userInput.homaIr >= 2.5) {
      riskFactors.push({
        factor: 'Resistencia a la Insulina',
        impact: userInput.homaIr >= 4.0 ? 'HIGH' : 'MEDIUM',
        modifiable: true,
        description: `HOMA-IR ${userInput.homaIr} indica resistencia insulínica`,
        interventions: ['Metformina', 'Dieta específica', 'Control metabólico']
      });
    }

    return riskFactors;
  }

  /**
   * 💊 GENERAR RECOMENDACIONES MÉDICAS
   */
  private async generateRecommendations(
    userInput: UserInput,
    _factors: Factors,
    _evaluation?: EvaluationState
  ): Promise<MedicalRecommendation[]> {
    const recommendations: MedicalRecommendation[] = [];

    // Recomendaciones inmediatas
    if (userInput.tsh !== undefined && userInput.tsh > 2.5) {
      recommendations.push({
        category: 'IMMEDIATE',
        title: 'Optimización Tiroidea',
        description: `TSH ${userInput.tsh} mU/L requiere ajuste antes de tratamientos de fertilidad`,
        priority: 9,
        timeframe: '2-4 semanas',
        expectedOutcome: 'TSH <2.5 mU/L para embarazo'
      });
    }

    // Recomendaciones a corto plazo
    if (userInput.amh !== undefined && userInput.amh < 1.0 && userInput.age && userInput.age >= 38) {
      recommendations.push({
        category: 'SHORT_TERM',
        title: 'Tratamiento de Alta Complejidad Urgente',
        description: 'Reserva ovárica y edad requieren intervención rápida',
        priority: 8,
        timeframe: '1-2 meses',
        expectedOutcome: 'Preservación de opciones reproductivas'
      });
    }

    // Recomendaciones de estilo de vida
    if (userInput.bmi !== null && userInput.bmi !== undefined) {
      const bmi = userInput.bmi;
      if (bmi >= 30) {
        recommendations.push({
          category: 'LIFESTYLE',
          title: 'Optimización del Peso',
          description: 'Reducción de peso mejoraría significativamente las probabilidades de éxito',
          priority: 7,
          timeframe: '3-6 meses',
          expectedOutcome: 'BMI 25-30 kg/m²'
        });
      }
    }

    return recommendations.sort((a, b) => b.priority - a.priority);
  }

  /**
   * 🔬 ANALIZAR BIOMARCADORES
   */
  private async analyzeBiomarkers(userInput: UserInput, factors: Factors): Promise<BiomarkerAnalysis> {
    return {
      hormonal: this.analyzeHormonalProfile(userInput),
      metabolic: this.analyzeMetabolicProfile(userInput),
      reproductive: this.analyzeReproductiveProfile(userInput, factors),
      inflammatory: userInput.tpoAbPositive ? this.analyzeInflammatoryMarkers(userInput) : undefined
    };
  }

  private analyzeHormonalProfile(userInput: UserInput): HormonalProfile {
    let amhStatus: HormonalProfile['amhStatus'] = 'ADEQUATE';
    let tshStatus: HormonalProfile['tshStatus'] = 'OPTIMAL';
    let prolactinStatus: HormonalProfile['prolactinStatus'] = 'NORMAL';
    const insights: string[] = [];

    // Análisis AMH
    if (userInput.amh !== undefined) {
      if (userInput.amh < 0.5) {
        amhStatus = 'CRITICALLY_LOW';
        insights.push('AMH críticamente bajo requiere intervención urgente');
      } else if (userInput.amh < 1.0) {
        amhStatus = 'LOW';
        insights.push('AMH bajo sugiere reserva ovárica disminuida');
      } else if (userInput.amh > 4.0) {
        amhStatus = 'OPTIMAL';
        insights.push('AMH elevado compatible con buena reserva ovárica');
      }
    }

    // Análisis TSH
    if (userInput.tsh !== undefined) {
      if (userInput.tsh > 2.5) {
        tshStatus = 'ELEVATED';
        insights.push('TSH elevado requiere optimización pre-concepcional');
      } else if (userInput.tsh > 2.0) {
        tshStatus = 'BORDERLINE';
        insights.push('TSH límite superior, monitoreo recomendado');
      }
    }

    // Análisis Prolactina
    if (userInput.prolactin !== undefined) {
      if (userInput.prolactin > 25) {
        prolactinStatus = 'SIGNIFICANTLY_ELEVATED';
        insights.push('Prolactina significativamente elevada requiere investigación');
      } else if (userInput.prolactin > 20) {
        prolactinStatus = 'MILDLY_ELEVATED';
        insights.push('Prolactina ligeramente elevada, evaluación adicional sugerida');
      }
    }

    return { amhStatus, tshStatus, prolactinStatus, insights };
  }

  private analyzeMetabolicProfile(userInput: UserInput): MetabolicProfile {
    let insulinResistance: MetabolicProfile['insulinResistance'] = 'ABSENT';
    let bmiCategory: MetabolicProfile['bmiCategory'] = 'NORMAL';
    let metabolicRisk = 0;
    const interventions: string[] = [];

    // Análisis resistencia insulínica
    if (userInput.homaIr !== undefined) {
      if (userInput.homaIr >= 4.0) {
        insulinResistance = 'SEVERE';
        metabolicRisk += 30;
        interventions.push('Metformina', 'Dieta low-carb');
      } else if (userInput.homaIr >= 2.5) {
        insulinResistance = 'MODERATE';
        metabolicRisk += 20;
        interventions.push('Modificación dietética', 'Ejercicio regular');
      } else if (userInput.homaIr >= 1.8) {
        insulinResistance = 'MILD';
        metabolicRisk += 10;
        interventions.push('Prevención dietética');
      }
    }

    // Análisis BMI
    if (userInput.bmi !== null && userInput.bmi !== undefined) {
      const bmi = userInput.bmi;
      if (bmi < 18.5) {
        bmiCategory = 'UNDERWEIGHT';
        metabolicRisk += 15;
        interventions.push('Aumento controlado de peso');
      } else if (bmi >= 30) {
        bmiCategory = 'OBESE';
        metabolicRisk += 25;
        interventions.push('Reducción de peso supervisada');
      } else if (bmi >= 25) {
        bmiCategory = 'OVERWEIGHT';
        metabolicRisk += 10;
        interventions.push('Optimización nutricional');
      }
    }

    return { insulinResistance, bmiCategory, metabolicRisk, interventions };
  }

  private analyzeReproductiveProfile(userInput: UserInput, factors: Factors): ReproductiveProfile {
    let combinedFertilityScore = 70; // Base score

    // Análisis reserva ovárica
    combinedFertilityScore = this.calculateOvarianReserveScore(userInput, combinedFertilityScore);
    const ovarianReserve = this.determineOvarianReserve(userInput.amh);

    // Análisis calidad espermática
    const spermAnalysis = this.analyzeSpermQuality(factors.male);
    const spermQuality = spermAnalysis.quality;
    combinedFertilityScore += spermAnalysis.scoreAdjustment;

    // Ajuste por edad
    combinedFertilityScore = this.adjustScoreByAge(combinedFertilityScore, userInput.age);

    const ageAdjustedPrognosis = this.generateAgeAdjustedPrognosis(userInput.age, ovarianReserve);

    return {
      ovarianReserve,
      spermQuality,
      combinedFertilityScore: Math.max(0, Math.min(100, combinedFertilityScore)),
      ageAdjustedPrognosis
    };
  }

  private calculateOvarianReserveScore(userInput: UserInput, baseScore: number): number {
    if (userInput.amh === undefined) return baseScore;
    
    if (userInput.amh < 0.5) return baseScore - 30;
    if (userInput.amh < 1.0) return baseScore - 20;
    if (userInput.amh > 4.0) return baseScore + 15;
    return baseScore;
  }

  private determineOvarianReserve(amh?: number): ReproductiveProfile['ovarianReserve'] {
    if (amh === undefined) return 'GOOD';
    if (amh < 0.5) return 'POOR';
    if (amh < 1.0) return 'FAIR';
    if (amh > 4.0) return 'EXCELLENT';
    return 'GOOD';
  }

  private analyzeSpermQuality(maleScore?: number): { quality: ReproductiveProfile['spermQuality']; scoreAdjustment: number } {
    if (maleScore === undefined) return { quality: 'UNKNOWN', scoreAdjustment: 0 };
    
    if (maleScore >= 0.9) return { quality: 'EXCELLENT', scoreAdjustment: 10 };
    if (maleScore >= 0.7) return { quality: 'GOOD', scoreAdjustment: 0 };
    if (maleScore >= 0.5) return { quality: 'FAIR', scoreAdjustment: -15 };
    return { quality: 'POOR', scoreAdjustment: -25 };
  }

  private adjustScoreByAge(baseScore: number, age?: number): number {
    if (age === undefined) return baseScore;
    
    if (age >= 40) return baseScore - 20;
    if (age >= 35) return baseScore - 10;
    if (age <= 30) return baseScore + 10;
    return baseScore;
  }

  private analyzeInflammatoryMarkers(userInput: UserInput): InflammatoryMarkers {
    return {
      tpoAbSignificance: userInput.tpoAbPositive || false,
      inflammatoryBurden: 'MODERATE',
      immuneImplications: [
        'Anticuerpos antitiroideos presentes',
        'Monitoreo tiroideo recomendado durante embarazo',
        'Posible impacto en implantación'
      ]
    };
  }

  /**
   * 🎯 CALCULAR PRONÓSTICO REPRODUCTIVO
   */
  private async calculateReproductivePrognosis(userInput: UserInput, factors: Factors): Promise<ReproductivePrognosis> {
    // Cálculos base de probabilidades
    let naturalConceptionProbability = 15; // Base mensual
    let assistedReproductionSuccess = 40; // Base por ciclo

    // Ajustes por edad
    if (userInput.age !== undefined) {
      if (userInput.age >= 42) {
        naturalConceptionProbability *= 0.3;
        assistedReproductionSuccess *= 0.4;
      } else if (userInput.age >= 38) {
        naturalConceptionProbability *= 0.5;
        assistedReproductionSuccess *= 0.6;
      } else if (userInput.age >= 35) {
        naturalConceptionProbability *= 0.7;
        assistedReproductionSuccess *= 0.8;
      } else if (userInput.age <= 30) {
        naturalConceptionProbability *= 1.2;
        assistedReproductionSuccess *= 1.1;
      }
    }

    // Ajustes por AMH
    if (userInput.amh !== undefined) {
      if (userInput.amh < 0.5) {
        assistedReproductionSuccess *= 0.5;
        naturalConceptionProbability *= 0.3;
      } else if (userInput.amh < 1.0) {
        assistedReproductionSuccess *= 0.7;
        naturalConceptionProbability *= 0.6;
      } else if (userInput.amh > 4.0) {
        assistedReproductionSuccess *= 1.1;
      }
    }

    // Ajustes por factor masculino
    if (factors.male < 0.7) {
      naturalConceptionProbability *= 0.4;
    } else if (factors.male < 0.8) {
      naturalConceptionProbability *= 0.7;
    }

    const timeToConceptionEstimate = this.estimateTimeToConception(naturalConceptionProbability, userInput, factors);
    const ageFactorInfluence = this.analyzeAgeFactorInfluence(userInput.age);
    const optimalTreatmentWindow = this.calculateOptimalTreatmentWindow(userInput.age, userInput.amh);

    return {
      naturalConceptionProbability: Math.round(naturalConceptionProbability),
      assistedReproductionSuccess: Math.round(assistedReproductionSuccess),
      timeToConceptionEstimate,
      ageFactorInfluence,
      optimalTreatmentWindow
    };
  }

  /**
   * 🎯 MÉTODOS AUXILIARES DE ANÁLISIS
   */
  private calculateConfidenceScore(userInput: UserInput, factors: Factors): number {
    let confidence = 85; // Base confidence

    // Ajustar por completitud de datos
    const totalFields = Object.keys(userInput).length + Object.keys(factors).length;
    const filledFields = Object.values(userInput).filter(v => v !== undefined && v !== null && v !== '').length +
                        Object.values(factors).filter(v => v !== undefined && v !== null).length;
    
    const completeness = filledFields / totalFields;
    confidence = Math.round(confidence * completeness);

    return Math.max(50, Math.min(95, confidence));
  }

  private assessUrgencyLevel(userInput: UserInput, factors: Factors): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
    // Criterios críticos
    if (userInput.age && userInput.age >= 42 && userInput.amh && userInput.amh < 0.5) {
      return 'CRITICAL';
    }

    // Criterios altos
    if (userInput.age && userInput.age >= 40) {
      return 'HIGH';
    }

    if (userInput.amh && userInput.amh < 1.0 && userInput.age && userInput.age >= 35) {
      return 'HIGH';
    }

    if (factors.otb === 0.0 || factors.hsg === 0.0) {
      return 'HIGH';
    }

    // Criterios medios
    if (userInput.age && userInput.age >= 35) {
      return 'MEDIUM';
    }

    if (userInput.infertilityDuration && userInput.infertilityDuration >= 2) {
      return 'MEDIUM';
    }

    return 'LOW';
  }

  private createFollowUpSchedule(userInput: UserInput, factors: Factors, urgency: string): FollowUpSchedule {
    let nextConsultation = '3 meses';
    let monitoringFrequency = 'Cada 3 meses';
    
    if (urgency === 'CRITICAL') {
      nextConsultation = '2-4 semanas';
      monitoringFrequency = 'Mensual';
    } else if (urgency === 'HIGH') {
      nextConsultation = '4-6 semanas';
      monitoringFrequency = 'Cada 6-8 semanas';
    } else if (urgency === 'MEDIUM') {
      nextConsultation = '6-8 semanas';
      monitoringFrequency = 'Cada 2 meses';
    }

    const keyParameters = ['AMH', 'TSH', 'Análisis seminal'];
    const warningSignals = [
      'Cambios en el patrón menstrual',
      'Síntomas tiroideos',
      'Dolor pélvico intenso'
    ];

    if (userInput.hasPcos) {
      keyParameters.push('HOMA-IR', 'Perfil lipídico');
      warningSignals.push('Aumento de peso significativo');
    }

    return {
      nextConsultation,
      monitoringFrequency,
      keyParameters,
      warningSignals
    };
  }

  private generateAgeAdjustedPrognosis(age?: number, _ovarianReserve?: string): string {
    if (!age) return 'Pronóstico favorable con datos completos';

    if (age < 30) {
      return 'Pronóstico excelente con tiempo adecuado para optimización';
    } else if (age < 35) {
      return 'Pronóstico favorable con ventana de tiempo apropiada';
    } else if (age < 38) {
      return 'Pronóstico moderado, recomendada evaluación oportuna';
    } else if (age < 42) {
      return 'Pronóstico limitado por factor edad, intervención recomendada';
    } else {
      return 'Pronóstico reservado, requiere intervención inmediata';
    }
  }

  private estimateTimeToConception(probability: number, _userInput: UserInput, _factors: Factors): string {
    if (probability > 10) {
      return '6-12 meses con optimización';
    } else if (probability > 5) {
      return '12-18 meses con tratamiento';
    } else {
      return 'Requiere técnicas de reproducción asistida';
    }
  }

  private analyzeAgeFactorInfluence(age?: number): string {
    if (!age) return 'Factor edad a determinar';

    if (age < 30) {
      return 'Factor edad favorable, reserva ovárica típicamente óptima';
    } else if (age < 35) {
      return 'Factor edad aceptable con ligera disminución de reserva';
    } else if (age < 38) {
      return 'Factor edad comienza a ser significativo';
    } else if (age < 42) {
      return 'Factor edad impacta significativamente el pronóstico';
    } else {
      return 'Factor edad es determinante, requiere intervención urgente';
    }
  }

  private calculateOptimalTreatmentWindow(age?: number, amh?: number): string {
    if (!age) return 'Ventana a determinar con datos completos';

    if (age >= 42 || (amh && amh < 0.5)) {
      return 'Ventana crítica: 1-3 meses';
    } else if (age >= 38 || (amh && amh < 1.0)) {
      return 'Ventana importante: 3-6 meses';
    } else if (age >= 35) {
      return 'Ventana favorable: 6-12 meses';
    } else {
      return 'Ventana amplia: 12-24 meses para optimización';
    }
  }

  /**
   * 🛡️ ANÁLISIS DE FALLBACK SEGURO
   */
  private generateFallbackAnalysis(_userInput: UserInput, _factors: Factors): MedicalAnalysisResult {
    return {
      clinicalSummary: 'Análisis básico generado con datos disponibles. Se recomienda completar evaluación.',
      diagnosticHypotheses: [{
        condition: 'Evaluación Incompleta',
        probability: 50,
        evidenceScore: 5.0,
        clinicalSignificance: 'DIFFERENTIAL',
        supportingFactors: ['Datos limitados'],
        contradicatingFactors: ['Información insuficiente']
      }],
      riskFactors: [],
      recommendations: [{
        category: 'DIAGNOSTIC',
        title: 'Completar Evaluación',
        description: 'Se requiere información adicional para análisis completo',
        priority: 10,
        timeframe: '1-2 semanas',
        expectedOutcome: 'Datos suficientes para análisis detallado'
      }],
      confidence: 30,
      urgencyLevel: 'MEDIUM',
      followUpSchedule: {
        nextConsultation: '2-4 semanas',
        monitoringFrequency: 'Al completar datos',
        keyParameters: ['Completar formulario'],
        warningSignals: ['Delay en evaluación']
      },
      biomarkerAnalysis: {
        hormonal: {
          amhStatus: 'ADEQUATE',
          tshStatus: 'OPTIMAL',
          prolactinStatus: 'NORMAL',
          insights: ['Análisis limitado por datos incompletos']
        },
        metabolic: {
          insulinResistance: 'ABSENT',
          bmiCategory: 'NORMAL',
          metabolicRisk: 0,
          interventions: []
        },
        reproductive: {
          ovarianReserve: 'GOOD',
          spermQuality: 'UNKNOWN',
          combinedFertilityScore: 50,
          ageAdjustedPrognosis: 'Requiere datos completos'
        }
      },
      reproductivePrognosis: {
        naturalConceptionProbability: 10,
        assistedReproductionSuccess: 30,
        timeToConceptionEstimate: 'A determinar con datos completos',
        ageFactorInfluence: 'A evaluar',
        optimalTreatmentWindow: 'A determinar'
      }
    };
  }
}

/**
 * 🧠 EXPORT SINGLETON INSTANCE
 * Instancia única del motor de razonamiento médico
 */
export const medicalReasoningEngine = MedicalReasoningEngine.getInstance();

/**
 * 🎯 FUNCIÓN DE CONVENIENCIA PARA ANÁLISIS RÁPIDO
 */
export async function analyzeMedicalCase(
  userInput: UserInput,
  factors: Factors,
  evaluation?: EvaluationState
): Promise<MedicalAnalysisResult> {
  return medicalReasoningEngine.analyzeMedicalData(userInput, factors, evaluation);
}
