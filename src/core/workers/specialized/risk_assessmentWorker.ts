/**
 * ⚠️ RISK ASSESSMENT WORKER - PREDICTIVE RISK ANALYSIS
 * 
 * Specialized worker for comprehensive risk assessment using predictive models
 * and clinical risk scoring systems for fertility outcomes.
 */

import type { MedicalWorkerTask, WorkerResult, MedicalContext } from '../UnifiedParallelEngine_V12';
import type { UserInput } from '../../domain/models';

export interface RiskFactor {
  name: string;
  severity: 'low' | 'moderate' | 'high' | 'critical';
  impact: number;
  modifiable: boolean;
  recommendations: string[];
}

export interface RiskAssessmentResult {
  overallRiskScore: number;
  riskCategory: 'low' | 'moderate' | 'high' | 'critical';
  riskFactors: RiskFactor[];
  predictiveInsights: string[];
  mitigationStrategies: string[];
}

export class RiskAssessmentWorker {
  private riskModels: Map<string, any>;

  constructor() {
    this.riskModels = new Map();
    this.initializeRiskModels();
  }

  public async process(task: MedicalWorkerTask): Promise<WorkerResult> {
    const startTime = performance.now();
    
    try {
      const riskResult = await this.performRiskAssessment(task.input, task.context);
      
      return {
        taskId: task.id,
        workerId: 'risk_assessment',
        success: true,
        data: riskResult,
        confidence: this.calculateConfidence(riskResult),
        processingTime: performance.now() - startTime,
        recommendations: riskResult.mitigationStrategies
      };
    } catch (error) {
      return {
        taskId: task.id,
        workerId: 'risk_assessment',
        success: false,
        data: null,
        confidence: 0,
        processingTime: performance.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async performRiskAssessment(
    input: UserInput,
    context?: MedicalContext
  ): Promise<RiskAssessmentResult> {
    const riskFactors: RiskFactor[] = [];

    // Age-related risks
    riskFactors.push(this.assessAgeRisk(input.age));

    // BMI-related risks
    if (input.bmi) {
      riskFactors.push(this.assessBMIRisk(input.bmi));
    }

    // Medical condition risks
    if (input.hasPcos) {
      riskFactors.push(this.assessPCOSRisk(input));
    }

    if (input.endometriosisGrade > 0) {
      riskFactors.push(this.assessEndometriosisRisk(input.endometriosisGrade));
    }

    // Hormonal risks
    if (input.amh) {
      riskFactors.push(this.assessOvarianReserveRisk(input.amh, input.age));
    }

    // Male factor risks
    riskFactors.push(this.assessMaleFactorRisk(input));

    // Calculate overall risk
    const overallRiskScore = this.calculateOverallRisk(riskFactors);
    const riskCategory = this.categorizeRisk(overallRiskScore);

    // Generate insights and strategies
    const predictiveInsights = this.generatePredictiveInsights(riskFactors, overallRiskScore);
    const mitigationStrategies = this.generateMitigationStrategies(riskFactors);

    return {
      overallRiskScore,
      riskCategory,
      riskFactors,
      predictiveInsights,
      mitigationStrategies
    };
  }

  private assessAgeRisk(age: number): RiskFactor {
    if (age < 30) {
      return {
        name: 'Edad reproductiva',
        severity: 'low',
        impact: 0.1,
        modifiable: false,
        recommendations: ['Mantener estilo de vida saludable']
      };
    } else if (age < 35) {
      return {
        name: 'Edad reproductiva moderada',
        severity: 'moderate',
        impact: 0.3,
        modifiable: false,
        recommendations: ['Considerar evaluación de fertilidad', 'No retrasar búsqueda de embarazo']
      };
    } else if (age < 40) {
      return {
        name: 'Edad reproductiva avanzada',
        severity: 'high',
        impact: 0.6,
        modifiable: false,
        recommendations: ['Evaluación inmediata de fertilidad', 'Considerar preservación de fertilidad']
      };
    } else {
      return {
        name: 'Edad reproductiva crítica',
        severity: 'critical',
        impact: 0.8,
        modifiable: false,
        recommendations: ['Consulta urgente especializada', 'Evaluación de opciones reproductivas']
      };
    }
  }

  private assessBMIRisk(bmi: number): RiskFactor {
    if (bmi >= 18.5 && bmi < 25) {
      return {
        name: 'Peso normal',
        severity: 'low',
        impact: 0.05,
        modifiable: true,
        recommendations: ['Mantener peso saludable']
      };
    } else if (bmi >= 25 && bmi < 30) {
      return {
        name: 'Sobrepeso',
        severity: 'moderate',
        impact: 0.25,
        modifiable: true,
        recommendations: ['Programa de control de peso', 'Ejercicio regular', 'Consulta nutricional']
      };
    } else {
      return {
        name: 'Obesidad',
        severity: 'high',
        impact: 0.45,
        modifiable: true,
        recommendations: ['Programa intensivo de pérdida de peso', 'Evaluación endocrinológica', 'Cirugía bariátrica si está indicada']
      };
    }
  }

  private assessPCOSRisk(input: UserInput): RiskFactor {
    return {
      name: 'Síndrome de Ovarios Poliquísticos',
      severity: 'moderate',
      impact: 0.4,
      modifiable: true,
      recommendations: ['Manejo integral de PCOS', 'Control metabólico', 'Inducción de ovulación']
    };
  }

  private assessEndometriosisRisk(grade: number): RiskFactor {
    const severity = grade <= 2 ? 'moderate' : 'high';
    const impact = grade <= 2 ? 0.3 : 0.5;

    return {
      name: `Endometriosis Grado ${grade}`,
      severity,
      impact,
      modifiable: true,
      recommendations: ['Tratamiento quirúrgico', 'Terapia hormonal', 'Reproducción asistida']
    };
  }

  private assessOvarianReserveRisk(amh: number, age: number): RiskFactor {
    if (amh >= 2.5) {
      return {
        name: 'Reserva ovárica normal',
        severity: 'low',
        impact: 0.1,
        modifiable: false,
        recommendations: ['Seguimiento rutinario']
      };
    } else if (amh >= 1.5) {
      return {
        name: 'Reserva ovárica moderada',
        severity: 'moderate',
        impact: 0.3,
        modifiable: false,
        recommendations: ['Evaluación especializada', 'Considerar preservación de fertilidad']
      };
    } else {
      return {
        name: 'Baja reserva ovárica',
        severity: 'high',
        impact: 0.6,
        modifiable: false,
        recommendations: ['Tratamiento urgente', 'Donación de óvulos', 'Reproducción asistida inmediata']
      };
    }
  }

  private assessMaleFactorRisk(input: UserInput): RiskFactor {
    let impact = 0.1;
    let severity: 'low' | 'moderate' | 'high' = 'low';
    const issues = [];

    if (input.spermConcentration && input.spermConcentration < 15) {
      impact += 0.2;
      severity = 'moderate';
      issues.push('oligospermia');
    }

    if (input.spermProgressiveMotility && input.spermProgressiveMotility < 32) {
      impact += 0.15;
      severity = severity === 'low' ? 'moderate' : 'high';
      issues.push('astenospermia');
    }

    if (input.spermNormalMorphology && input.spermNormalMorphology < 4) {
      impact += 0.1;
      issues.push('teratospermia');
    }

    return {
      name: issues.length > 0 ? `Factor masculino (${issues.join(', ')})` : 'Factor masculino normal',
      severity,
      impact,
      modifiable: true,
      recommendations: issues.length > 0 ? 
        ['Evaluación andrológica', 'Tratamiento especializado', 'Suplementación antioxidante'] :
        ['Mantener estilo de vida saludable']
    };
  }

  private calculateOverallRisk(riskFactors: RiskFactor[]): number {
    const totalImpact = riskFactors.reduce((sum, factor) => sum + factor.impact, 0);
    return Math.min(totalImpact / riskFactors.length, 1.0);
  }

  private categorizeRisk(overallRisk: number): 'low' | 'moderate' | 'high' | 'critical' {
    if (overallRisk < 0.25) return 'low';
    if (overallRisk < 0.5) return 'moderate';
    if (overallRisk < 0.75) return 'high';
    return 'critical';
  }

  private generatePredictiveInsights(riskFactors: RiskFactor[], overallRisk: number): string[] {
    const insights = [];

    if (overallRisk > 0.6) {
      insights.push('Alto riesgo de requerir tratamientos de reproducción asistida');
      insights.push('Probabilidad reducida de concepción natural');
    } else if (overallRisk > 0.4) {
      insights.push('Riesgo moderado que puede requerir intervención médica');
      insights.push('Respuesta favorable esperada con tratamiento apropiado');
    } else {
      insights.push('Buen pronóstico con tratamiento conservador');
      insights.push('Alta probabilidad de éxito con intervenciones mínimas');
    }

    const modifiableFactors = riskFactors.filter(f => f.modifiable);
    if (modifiableFactors.length > 0) {
      insights.push(`${modifiableFactors.length} factores de riesgo son modificables con tratamiento`);
    }

    return insights;
  }

  private generateMitigationStrategies(riskFactors: RiskFactor[]): string[] {
    const strategies = new Set<string>();

    riskFactors.forEach(factor => {
      factor.recommendations.forEach(rec => strategies.add(rec));
    });

    return Array.from(strategies);
  }

  private calculateConfidence(result: RiskAssessmentResult): number {
    // Higher confidence for more comprehensive risk factor analysis
    const factorCount = result.riskFactors.length;
    const baseConfidence = 0.7;
    const factorBonus = Math.min(factorCount * 0.05, 0.25);
    
    return Math.min(baseConfidence + factorBonus, 0.95);
  }

  private initializeRiskModels(): void {
    // Mock risk prediction models
    this.riskModels.set('fertility_risk_predictor', {
      predict: (profile: any) => Math.random() * 0.8,
      confidence: 0.85
    });
  }
}
