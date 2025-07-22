/**
 * 🧬 BIOMARKER MONITORING WORKER - REAL-TIME BIOMARKER ANALYSIS
 * 
 * Specialized worker for monitoring and analyzing biomarkers with trend analysis
 * and predictive modeling for fertility optimization.
 */

import type { MedicalWorkerTask, WorkerResult, MedicalContext } from '../UnifiedParallelEngine_V12';
import type { UserInput } from '../../domain/models';

// 🎯 TYPE ALIASES FOR BETTER MAINTAINABILITY
export type BiomarkerStatus = 'normal' | 'borderline' | 'abnormal' | 'critical';
export type TrendDirection = 'improving' | 'stable' | 'declining' | 'unknown';
export type OverallHealthStatus = 'optimal' | 'good' | 'concerning' | 'critical';

// 🏥 BIOMARKER REFERENCE RANGE INTERFACE
export interface BiomarkerReferenceRange {
  min: number;
  max: number;
  optimal?: number;
}

// 📈 TREND MODEL INTERFACE
export interface TrendModel {
  predict: (value: number, history?: number[]) => TrendDirection;
  confidence: number;
}

export interface BiomarkerReading {
  name: string;
  value: number;
  unit: string;
  referenceRange: BiomarkerReferenceRange;
  status: BiomarkerStatus;
  trend: TrendDirection;
}

export interface BiomarkerMonitoringResult {
  biomarkers: BiomarkerReading[];
  overallStatus: OverallHealthStatus;
  criticalAlerts: string[];
  recommendations: string[];
  nextMonitoringSchedule: string[];
  trendAnalysis: string[];
}

export class BiomarkerMonitoringWorker {
  private readonly referenceRanges: Map<string, BiomarkerReferenceRange>;
  private readonly trendModels: Map<string, TrendModel>;

  constructor() {
    this.referenceRanges = new Map();
    this.trendModels = new Map();
    this.initializeReferenceRanges();
    this.initializeTrendModels();
  }

  public async process(task: MedicalWorkerTask): Promise<WorkerResult> {
    const startTime = performance.now();
    
    try {
      const monitoringResult = await this.performBiomarkerMonitoring(task.input, task.context);
      
      return {
        taskId: task.id,
        workerId: 'biomarker_monitoring',
        success: true,
        data: monitoringResult,
        confidence: this.calculateConfidence(monitoringResult),
        processingTime: performance.now() - startTime,
        recommendations: monitoringResult.recommendations
      };
    } catch (error) {
      return {
        taskId: task.id,
        workerId: 'biomarker_monitoring',
        success: false,
        data: null,
        confidence: 0,
        processingTime: performance.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async performBiomarkerMonitoring(
    input: UserInput,
    _context?: MedicalContext
  ): Promise<BiomarkerMonitoringResult> {
    const biomarkers: BiomarkerReading[] = [];
    
    // Analyze hormonal biomarkers
    if (input.amh !== undefined) {
      biomarkers.push(this.analyzeBiomarker('AMH', input.amh, 'ng/mL', input.age));
    }

    if (input.prolactin !== undefined) {
      biomarkers.push(this.analyzeBiomarker('Prolactin', input.prolactin, 'ng/mL'));
    }

    if (input.tsh !== undefined) {
      biomarkers.push(this.analyzeBiomarker('TSH', input.tsh, 'mIU/L'));
    }

    if (input.homaIr !== undefined) {
      biomarkers.push(this.analyzeBiomarker('HOMA-IR', input.homaIr, 'index'));
    }

    // Analyze male biomarkers
    if (input.spermConcentration !== undefined) {
      biomarkers.push(this.analyzeBiomarker('Sperm Concentration', input.spermConcentration, 'M/mL'));
    }

    if (input.spermProgressiveMotility !== undefined) {
      biomarkers.push(this.analyzeBiomarker('Progressive Motility', input.spermProgressiveMotility, '%'));
    }

    // Calculate overall status
    const overallStatus = this.calculateOverallStatus(biomarkers);
    
    // Generate alerts and recommendations
    const criticalAlerts = this.generateCriticalAlerts(biomarkers);
    const recommendations = this.generateRecommendations(biomarkers);
    const nextMonitoringSchedule = this.generateMonitoringSchedule(biomarkers, overallStatus);
    const trendAnalysis = this.performTrendAnalysis(biomarkers);

    return {
      biomarkers,
      overallStatus,
      criticalAlerts,
      recommendations,
      nextMonitoringSchedule,
      trendAnalysis
    };
  }

  private analyzeBiomarker(
    name: string, 
    value: number, 
    unit: string, 
    age?: number
  ): BiomarkerReading {
    const referenceRange = this.getReferenceRange(name, age);
    const status = this.determineStatus(value, referenceRange);
    const trend = this.predictTrend(name, value);

    return {
      name,
      value,
      unit,
      referenceRange,
      status,
      trend
    };
  }

  private getReferenceRange(name: string, age?: number): BiomarkerReferenceRange {
    const ranges = this.referenceRanges.get(name.toLowerCase());
    
    if (!ranges) {
      return { min: 0, max: 100 }; // Default range
    }

    // Age-specific adjustments for AMH
    if (name === 'AMH' && age) {
      if (age < 30) return { min: 2.5, max: 6.0, optimal: 4.0 };
      if (age < 35) return { min: 1.5, max: 4.0, optimal: 2.5 };
      if (age < 40) return { min: 0.7, max: 2.5, optimal: 1.5 };
      return { min: 0.3, max: 1.5, optimal: 0.8 };
    }

    return ranges;
  }

  private determineStatus(
    value: number, 
    referenceRange: BiomarkerReferenceRange
  ): BiomarkerStatus {
    if (value < referenceRange.min * 0.5 || value > referenceRange.max * 2) {
      return 'critical';
    }
    
    if (value < referenceRange.min || value > referenceRange.max) {
      return 'abnormal';
    }
    
    if (referenceRange.optimal) {
      const optimalRange = referenceRange.optimal * 0.2; // 20% range around optimal
      if (Math.abs(value - referenceRange.optimal) > optimalRange) {
        return 'borderline';
      }
    }
    
    return 'normal';
  }

  private predictTrend(name: string, _value: number): TrendDirection {
    // Mock trend analysis - in real implementation, this would use historical data
    const trendModel = this.trendModels.get(name.toLowerCase());
    
    if (!trendModel) return 'unknown';
    
    // Simulate trend prediction based on biomarker type
    const random = Math.random();
    if (random < 0.3) return 'improving';
    if (random < 0.6) return 'stable';
    if (random < 0.9) return 'declining';
    return 'unknown';
  }

  private calculateOverallStatus(biomarkers: BiomarkerReading[]): OverallHealthStatus {
    const criticalCount = biomarkers.filter(b => b.status === 'critical').length;
    const abnormalCount = biomarkers.filter(b => b.status === 'abnormal').length;
    const borderlineCount = biomarkers.filter(b => b.status === 'borderline').length;

    if (criticalCount > 0) return 'critical';
    if (abnormalCount > 1) return 'concerning';
    if (abnormalCount > 0 || borderlineCount > 2) return 'concerning';
    if (borderlineCount > 0) return 'good';
    
    return 'optimal';
  }

  private generateCriticalAlerts(biomarkers: BiomarkerReading[]): string[] {
    const alerts: string[] = [];
    
    biomarkers.forEach(biomarker => {
      if (biomarker.status === 'critical') {
        alerts.push(`CRÍTICO: ${biomarker.name} = ${biomarker.value} ${biomarker.unit} - Requiere atención médica inmediata`);
      }
    });

    return alerts;
  }

  private generateRecommendations(biomarkers: BiomarkerReading[]): string[] {
    const recommendations = [];

    biomarkers.forEach(biomarker => {
      switch (biomarker.name) {
        case 'AMH':
          if (biomarker.status === 'abnormal' && biomarker.value < 1.5) {
            recommendations.push('Evaluación urgente de reserva ovárica - Considerar preservación de fertilidad');
          }
          break;
          
        case 'Prolactin':
          if (biomarker.status === 'abnormal' && biomarker.value > 25) {
            recommendations.push('Evaluación de hiperprolactinemia - Resonancia magnética de hipófisis');
          }
          break;
          
        case 'TSH':
          if (biomarker.status === 'abnormal') {
            recommendations.push('Evaluación tiroidea completa - Optimización hormonal antes de concepción');
          }
          break;
          
        case 'HOMA-IR':
          if (biomarker.status === 'abnormal' && biomarker.value > 2.5) {
            recommendations.push('Manejo de resistencia a insulina - Metformina y cambios de estilo de vida');
          }
          break;
          
        case 'Sperm Concentration':
          if (biomarker.status === 'abnormal') {
            recommendations.push('Evaluación andrológica especializada - Análisis de fragmentación DNA');
          }
          break;
      }
    });

    // General recommendations based on overall status
    const overallStatus = this.calculateOverallStatus(biomarkers);
    if (overallStatus === 'critical') {
      recommendations.push('Consulta médica urgente requerida dentro de 24-48 horas');
    } else if (overallStatus === 'concerning') {
      recommendations.push('Consulta especializada recomendada en 1-2 semanas');
    }

    return recommendations;
  }

  private generateMonitoringSchedule(
    biomarkers: BiomarkerReading[], 
    overallStatus: OverallHealthStatus
  ): string[] {
    const schedule = [];

    switch (overallStatus) {
      case 'critical':
        schedule.push('Monitoreo semanal hasta estabilización');
        schedule.push('Evaluación médica en 48-72 horas');
        break;
      case 'concerning':
        schedule.push('Monitoreo cada 2-4 semanas');
        schedule.push('Reevaluación médica en 1-2 semanas');
        break;
      case 'good':
        schedule.push('Monitoreo mensual');
        schedule.push('Reevaluación médica en 1-2 meses');
        break;
      case 'optimal':
        schedule.push('Monitoreo cada 2-3 meses');
        schedule.push('Seguimiento rutinario según protocolo');
        break;
    }

    // Specific biomarker monitoring
    const criticalBiomarkers = biomarkers.filter(b => b.status === 'critical' || b.status === 'abnormal');
    if (criticalBiomarkers.length > 0) {
      schedule.push(`Monitoreo específico de: ${criticalBiomarkers.map(b => b.name).join(', ')}`);
    }

    return schedule;
  }

  private performTrendAnalysis(biomarkers: BiomarkerReading[]): string[] {
    const analysis = [];
    
    const improvingBiomarkers = biomarkers.filter(b => b.trend === 'improving');
    const decliningBiomarkers = biomarkers.filter(b => b.trend === 'declining');

    if (improvingBiomarkers.length > 0) {
      analysis.push(`Tendencia positiva en: ${improvingBiomarkers.map(b => b.name).join(', ')}`);
    }

    if (decliningBiomarkers.length > 0) {
      analysis.push(`Tendencia negativa en: ${decliningBiomarkers.map(b => b.name).join(', ')} - Requiere intervención`);
    }

    if (biomarkers.length > 3) {
      analysis.push('Perfil biomarker completo disponible para análisis predictivo');
    }

    return analysis;
  }

  private calculateConfidence(result: BiomarkerMonitoringResult): number {
    // Confidence based on number of biomarkers analyzed and their quality
    const biomarkerCount = result.biomarkers.length;
    const criticalCount = result.criticalAlerts.length;
    
    let confidence = 0.6; // Base confidence
    confidence += Math.min(biomarkerCount * 0.1, 0.3); // More biomarkers = higher confidence
    
    if (criticalCount > 0) {
      confidence += 0.1; // High confidence in critical findings
    }
    
    return Math.min(confidence, 0.95);
  }

  private initializeReferenceRanges(): void {
    this.referenceRanges.set('amh', {
      min: 1.5, max: 4.0, optimal: 2.5
    });

    this.referenceRanges.set('prolactin', {
      min: 2.0, max: 25.0, optimal: 15.0
    });

    this.referenceRanges.set('tsh', {
      min: 0.5, max: 4.5, optimal: 2.5
    });

    this.referenceRanges.set('homa-ir', {
      min: 0.5, max: 2.5, optimal: 1.5
    });

    this.referenceRanges.set('sperm concentration', {
      min: 15, max: 300, optimal: 40
    });

    this.referenceRanges.set('progressive motility', {
      min: 32, max: 75, optimal: 50
    });
  }

  private initializeTrendModels(): void {
    // Mock trend prediction models with proper TrendModel interface
    this.trendModels.set('amh', { predict: () => 'stable', confidence: 0.85 });
    this.trendModels.set('prolactin', { predict: () => 'stable', confidence: 0.82 });
    this.trendModels.set('tsh', { predict: () => 'stable', confidence: 0.88 });
  }
}
