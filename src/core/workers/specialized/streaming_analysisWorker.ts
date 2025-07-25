/**
 * ✅ STREAMING ANALYSIS WORKER - REAL-TIME PROCESSING ENGINE
 * 
 * Specialized worker for real-time streaming analysis with progressive results,
 * live updates, and adaptive processing based on computational load.
 */

import type { MedicalWorkerTask, WorkerResult } from '../UnifiedParallelEngine_V12';
import type { UserInput } from '../../domain/models';

export interface StreamingResult {
  streamId: string;
  progressPercentage: number;
  intermediateResults: IntermediateResult[];
  finalResult?: CalculationResult;
  isComplete: boolean;
  estimatedTimeRemaining: number;
  adaptiveSettings: AdaptiveSettings;
}

export interface IntermediateResult {
  stage: AnalysisStage;
  timestamp: number;
  result: StageResult;
  confidence: number;
  processingTime: number;
}

export type StageResult = 
  | InitializationResult 
  | ValidationResult 
  | BaseCalculationResult 
  | MedicalAnalysisResult 
  | RiskAssessmentResult 
  | TreatmentMatchingResult 
  | OptimizationResult 
  | FinalizationResult;

export interface InitializationResult {
  taskId: string;
  inputHash: string;
  startTime: number;
  settings: AdaptiveSettings;
}

export interface ValidationResult {
  age: boolean;
  bmi: boolean;
  completeness: number;
  warnings: string[];
}

export interface BaseCalculationResult {
  baseScore: number;
  ageContribution: number;
  bmiContribution: number;
}

export interface MedicalAnalysisResult {
  individualAdjustments: {
    pcos: number;
    endometriosis: number;
    amh: number;
    hormonal: number;
  };
  totalAdjustment: number;
  medicalComplexity: number;
}

export interface RiskAssessmentResult {
  risks: RiskFactor[];
}

export interface TreatmentMatchingResult {
  treatments: TreatmentRecommendation[];
}

export interface OptimizationResult {
  lifestyle: string[];
  medical: string[];
  timing: string[];
}

export interface FinalizationResult {
  processingComplete: boolean;
  totalProcessingTime: number;
  finalCalculationTime: number;
  qualityScore: number;
}

export interface CalculationResult {
  successProbability: number;
  treatmentRecommendations: TreatmentRecommendation[];
  riskFactors: RiskFactor[];
  optimizationSuggestions: string[];
  confidence: number;
  calculationBreakdown: CalculationBreakdown;
}

export interface TreatmentRecommendation {
  treatment: string;
  successRate: number;
  timeframe: string;
  cost: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export interface RiskFactor {
  factor: string;
  impact: number;
  modifiable: boolean;
  interventions: string[];
}

export interface CalculationBreakdown {
  baseScore: number;
  ageAdjustment: number;
  medicalAdjustments: number;
  lifestyleAdjustments: number;
  treatmentAdjustments: number;
  finalScore: number;
}

export interface AdaptiveSettings {
  processingIntensity: 'low' | 'medium' | 'high' | 'maximum';
  batchSize: number;
  updateFrequency: number;
  parallelThreads: number;
}

export type AnalysisStage = 
  | 'initialization'
  | 'input_validation'
  | 'base_calculation'
  | 'medical_analysis'
  | 'risk_assessment'
  | 'treatment_matching'
  | 'optimization'
  | 'finalization';

export class StreamingAnalysisWorker {
  private readonly activeStreams: Map<string, StreamingAnalysis>;
  private readonly maxConcurrentStreams = 10;
  private readonly adaptiveSettings: AdaptiveSettings;

  constructor() {
    this.activeStreams = new Map();
    // Crear nueva instancia para mutable settings
    this.adaptiveSettings = { ...this.initializeAdaptiveSettings() };
    this.startAdaptiveMonitoring();
  }

  public async process(task: MedicalWorkerTask): Promise<WorkerResult> {
    const startTime = performance.now();
    
    try {
      const streamingResult = await this.startStreamingAnalysis(task);
      
      return {
        taskId: task.id,
        workerId: 'streaming_analysis',
        success: true,
        data: streamingResult,
        confidence: 0.92,
        processingTime: performance.now() - startTime,
        recommendations: ['Monitorear resultados en tiempo real', 'Ajustar configuración según rendimiento']
      };
    } catch (error) {
      return {
        taskId: task.id,
        workerId: 'streaming_analysis',
        success: false,
        data: null,
        confidence: 0,
        processingTime: performance.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown streaming error'
      };
    }
  }

  public async startStreamingAnalysis(task: MedicalWorkerTask): Promise<StreamingResult> {
    const streamId = this.generateStreamId(task);
    
    if (this.activeStreams.size >= this.maxConcurrentStreams) {
      await this.cleanupOldestStream();
    }

    const analysis = new StreamingAnalysis(streamId, task, this.adaptiveSettings);
    this.activeStreams.set(streamId, analysis);

    // Start the streaming process
    await analysis.start();

    return {
      streamId,
      progressPercentage: 0,
      intermediateResults: [],
      isComplete: false,
      estimatedTimeRemaining: this.estimateProcessingTime(task),
      adaptiveSettings: { ...this.adaptiveSettings }
    };
  }

  public async getStreamStatus(streamId: string): Promise<StreamingResult | null> {
    const analysis = this.activeStreams.get(streamId);
    if (!analysis) return null;

    return analysis.getStatus();
  }

  public async stopStream(streamId: string): Promise<void> {
    const analysis = this.activeStreams.get(streamId);
    if (analysis) {
      await analysis.stop();
      this.activeStreams.delete(streamId);
    }
  }

  private generateStreamId(task: MedicalWorkerTask): string {
    return `stream_${task.id}_${Date.now()}`;
  }

  private async cleanupOldestStream(): Promise<void> {
    let oldestTimestamp = Date.now();
    let oldestStreamId = '';

    for (const [streamId, analysis] of this.activeStreams.entries()) {
      if (analysis.startTime < oldestTimestamp) {
        oldestTimestamp = analysis.startTime;
        oldestStreamId = streamId;
      }
    }

    if (oldestStreamId) {
      await this.stopStream(oldestStreamId);
    }
  }

  private estimateProcessingTime(task: MedicalWorkerTask): number {
    const baseTime = 2000; // 2 seconds base
    const complexity = this.calculateComplexity(task);
    const loadFactor = this.activeStreams.size / this.maxConcurrentStreams;
    
    return baseTime + (complexity * 1000) + (loadFactor * 1500);
  }

  private calculateComplexity(task: MedicalWorkerTask): number {
    let complexity = 1; // Base complexity

    const input = task.input;
    
    // Add complexity based on available data
    if (input.amh !== undefined) complexity += 0.2;
    if (input.spermConcentration !== undefined) complexity += 0.3;
    if (input.hasPcos) complexity += 0.4;
    if (input.endometriosisGrade > 0) complexity += 0.5;
    if (input.infertilityDuration && input.infertilityDuration > 24) complexity += 0.3;

    return complexity;
  }

  private initializeAdaptiveSettings(): AdaptiveSettings {
    return {
      processingIntensity: 'medium',
      batchSize: 10,
      updateFrequency: 500, // ms
      parallelThreads: 2
    };
  }

  private startAdaptiveMonitoring(): void {
    setInterval(() => {
      this.adaptProcessingSettings();
    }, 5000); // Check every 5 seconds
  }

  private adaptProcessingSettings(): void {
    const systemLoad = this.activeStreams.size / this.maxConcurrentStreams;
    const avgProcessingTime = this.calculateAverageProcessingTime();

    // Adapt based on load and performance
    if (systemLoad > 0.8 || avgProcessingTime > 5000) {
      // High load - reduce intensity
      this.adaptiveSettings.processingIntensity = 'low';
      this.adaptiveSettings.batchSize = 5;
      this.adaptiveSettings.updateFrequency = 1000;
      this.adaptiveSettings.parallelThreads = 1;
    } else if (systemLoad < 0.3 && avgProcessingTime < 2000) {
      // Low load - increase intensity
      this.adaptiveSettings.processingIntensity = 'high';
      this.adaptiveSettings.batchSize = 20;
      this.adaptiveSettings.updateFrequency = 250;
      this.adaptiveSettings.parallelThreads = 4;
    } else {
      // Medium load - balanced settings
      this.adaptiveSettings.processingIntensity = 'medium';
      this.adaptiveSettings.batchSize = 10;
      this.adaptiveSettings.updateFrequency = 500;
      this.adaptiveSettings.parallelThreads = 2;
    }
  }

  private calculateAverageProcessingTime(): number {
    const analyses = Array.from(this.activeStreams.values());
    if (analyses.length === 0) return 0;

    const totalTime = analyses.reduce((sum, analysis) => sum + analysis.getProcessingTime(), 0);
    return totalTime / analyses.length;
  }
}

class StreamingAnalysis {
  public readonly startTime: number;
  private currentStage: AnalysisStage;
  private progressPercentage: number;
  private readonly intermediateResults: IntermediateResult[];
  private finalResult?: CalculationResult;
  private isComplete: boolean;
  private isRunning: boolean;
  private stageStartTime: number;

  constructor(
    public readonly streamId: string,
    private readonly task: MedicalWorkerTask,
    private readonly settings: AdaptiveSettings
  ) {
    this.startTime = Date.now();
    this.currentStage = 'initialization';
    this.progressPercentage = 0;
    this.intermediateResults = [];
    this.isComplete = false;
    this.isRunning = false;
    this.stageStartTime = Date.now();
  }

  public async start(): Promise<void> {
    this.isRunning = true;
    this.processStages();
  }

  public async stop(): Promise<void> {
    this.isRunning = false;
  }

  public getStatus(): StreamingResult {
    return {
      streamId: this.streamId,
      progressPercentage: this.progressPercentage,
      intermediateResults: [...this.intermediateResults],
      finalResult: this.finalResult,
      isComplete: this.isComplete,
      estimatedTimeRemaining: this.calculateRemainingTime(),
      adaptiveSettings: { ...this.settings }
    };
  }

  public getProcessingTime(): number {
    return Date.now() - this.startTime;
  }

  private async processStages(): Promise<void> {
    const stages: AnalysisStage[] = [
      'initialization',
      'input_validation', 
      'base_calculation',
      'medical_analysis',
      'risk_assessment',
      'treatment_matching',
      'optimization',
      'finalization'
    ];

    for (let i = 0; i < stages.length && this.isRunning; i++) {
      const stage = stages[i];
      if (!stage) continue; // Type guard
      
      this.currentStage = stage;
      this.stageStartTime = Date.now();
      this.progressPercentage = (i / stages.length) * 100;

      const result = await this.processStage(stage);
      
      this.intermediateResults.push({
        stage,
        timestamp: Date.now(),
        result,
        confidence: this.calculateStageConfidence(stage),
        processingTime: Date.now() - this.stageStartTime
      });

      // Adaptive delay based on settings
      await this.sleep(this.settings.updateFrequency);
    }

    if (this.isRunning) {
      this.progressPercentage = 100;
      this.isComplete = true;
      this.finalResult = this.compileFinalResult();
    }
  }

  private async processStage(stage: AnalysisStage): Promise<StageResult> {
    switch (stage) {
      case 'initialization':
        return this.initializeCalculation();
      
      case 'input_validation':
        return this.validateInputs();
      
      case 'base_calculation':
        return this.calculateBaseScore();
      
      case 'medical_analysis':
        return this.analyzeMedicalFactors();
      
      case 'risk_assessment':
        return this.assessRisks();
      
      case 'treatment_matching':
        return this.matchTreatments();
      
      case 'optimization':
        return this.optimizeRecommendations();
      
      case 'finalization':
        return this.finalizeResults();
      
      default:
        return {
          processingComplete: false,
          totalProcessingTime: 0,
          finalCalculationTime: Date.now(),
          qualityScore: 0
        } as FinalizationResult;
    }
  }

  private async initializeCalculation(): Promise<InitializationResult> {
    return {
      taskId: this.task.id,
      inputHash: this.generateInputHash(),
      startTime: this.startTime,
      settings: this.settings
    };
  }

  private async validateInputs(): Promise<ValidationResult> {
    const input = this.task.input;
    const validationResults = {
      age: input.age >= 18 && input.age <= 50,
      bmi: input.bmi === null || (input.bmi >= 15 && input.bmi <= 60),
      completeness: this.calculateInputCompleteness(),
      warnings: [] as string[]
    };

    if (input.age && input.age >= 35) {
      validationResults.warnings.push('Edad materna avanzada');
    }

    if (input.bmi && input.bmi >= 30) {
      validationResults.warnings.push('Obesidad detectada');
    }

    return validationResults;
  }

  private async calculateBaseScore(): Promise<BaseCalculationResult> {
    const input = this.task.input;
    let baseScore = 0.5; // 50% base

    // Age factor calculation
    let ageContribution = 0;
    if (input.age) {
      if (input.age < 30) {
        ageContribution = 0.25;
        baseScore += ageContribution;
      } else if (input.age < 35) {
        ageContribution = 0.15;
        baseScore += ageContribution;
      } else if (input.age < 40) {
        ageContribution = -0.05;
        baseScore += ageContribution;
      } else if (input.age < 43) {
        ageContribution = -0.20;
        baseScore += ageContribution;
      } else {
        ageContribution = -0.35;
        baseScore += ageContribution;
      }
    }

    // BMI factor calculation
    let bmiContribution = 0;
    if (input.bmi) {
      if (input.bmi >= 18.5 && input.bmi < 25) {
        bmiContribution = 0.10;
        baseScore += bmiContribution;
      } else if (input.bmi >= 25 && input.bmi < 30) {
        bmiContribution = -0.05;
        baseScore += bmiContribution;
      } else if (input.bmi >= 30) {
        bmiContribution = -0.15;
        baseScore += bmiContribution;
      } else if (input.bmi < 18.5) {
        bmiContribution = -0.10;
        baseScore += bmiContribution;
      }
    }

    return {
      baseScore: Math.max(0, Math.min(1, baseScore)),
      ageContribution,
      bmiContribution
    };
  }

  private async analyzeMedicalFactors(): Promise<MedicalAnalysisResult> {
    const input = this.task.input;
    const medicalAdjustments = {
      pcos: input.hasPcos ? -0.15 : 0,
      endometriosis: input.endometriosisGrade ? -0.05 * input.endometriosisGrade : 0,
      amh: input.amh ? this.getAmhAdjustment(input.amh, input.age) : 0,
      hormonal: this.calculateHormonalAdjustments(input)
    };

    const totalAdjustment = Object.values(medicalAdjustments).reduce((sum, adj) => sum + adj, 0);

    return {
      individualAdjustments: medicalAdjustments,
      totalAdjustment,
      medicalComplexity: this.assessMedicalComplexity(input)
    };
  }

  private async assessRisks(): Promise<RiskAssessmentResult> {
    const input = this.task.input;
    const risks: RiskFactor[] = [];

    if (input.age && input.age >= 35) {
      risks.push({
        factor: 'Edad materna avanzada',
        impact: this.calculateAgeRisk(input.age),
        modifiable: false,
        interventions: ['Evaluación urgente', 'Consideración de TRA']
      });
    }

    if (input.bmi && input.bmi >= 30) {
      risks.push({
        factor: 'Obesidad',
        impact: 0.25,
        modifiable: true,
        interventions: ['Pérdida de peso', 'Ejercicio regular', 'Dieta mediterránea']
      });
    }

    if (input.hasPcos) {
      risks.push({
        factor: 'Síndrome de ovarios poliquísticos',
        impact: 0.20,
        modifiable: true,
        interventions: ['Metformina', 'Inositol', 'Pérdida de peso', 'Inducción de ovulación']
      });
    }

    return { risks };
  }

  private async matchTreatments(): Promise<TreatmentMatchingResult> {
    const input = this.task.input;
    const treatments: TreatmentRecommendation[] = [];

    // Age-based recommendations
    if (input.age) {
      if (input.age < 35) {
        treatments.push({
          treatment: 'Coito dirigido + optimización estilo vida',
          successRate: 0.65,
          timeframe: '6-12 meses',
          cost: 500,
          priority: 'medium'
        });
        
        treatments.push({
          treatment: 'Inseminación intrauterina (IUI)',
          successRate: 0.45,
          timeframe: '3-6 ciclos',
          cost: 2500,
          priority: 'medium'
        });
      } else if (input.age < 40) {
        treatments.push({
          treatment: 'Fecundación in vitro (FIV)',
          successRate: 0.40,
          timeframe: '2-3 ciclos',
          cost: 8000,
          priority: 'high'
        });
      } else {
        treatments.push({
          treatment: 'FIV con óvulos propios',
          successRate: 0.20,
          timeframe: '1-2 ciclos',
          cost: 10000,
          priority: 'urgent'
        });
        
        treatments.push({
          treatment: 'FIV con donación de óvulos',
          successRate: 0.65,
          timeframe: '1-2 ciclos',
          cost: 12000,
          priority: 'high'
        });
      }
    }

    return { treatments };
  }

  private async optimizeRecommendations(): Promise<OptimizationResult> {
    const optimizations = {
      lifestyle: [
        'Dieta mediterránea rica en antioxidantes',
        'Ejercicio moderado 150 min/semana',
        'Suplementación con ácido fólico',
        'Evitar tabaco y alcohol'
      ],
      medical: [
        'Control de peso previo al tratamiento',
        'Optimización de niveles de vitamina D',
        'Manejo del estrés y ansiedad',
        'Evaluación de pareja masculina'
      ],
      timing: [
        'Iniciar tratamiento sin demora',
        'Monitoreo de ovulación',
        'Optimización de timing coital'
      ]
    };

    return optimizations;
  }

  private async finalizeResults(): Promise<FinalizationResult> {
    return {
      processingComplete: true,
      totalProcessingTime: this.getProcessingTime(),
      finalCalculationTime: Date.now(),
      qualityScore: this.calculateResultQuality()
    };
  }

  private compileFinalResult(): CalculationResult {
    const baseCalculation = this.intermediateResults.find(r => r.stage === 'base_calculation')?.result as BaseCalculationResult;
    const medicalAnalysis = this.intermediateResults.find(r => r.stage === 'medical_analysis')?.result as MedicalAnalysisResult;
    const riskAssessment = this.intermediateResults.find(r => r.stage === 'risk_assessment')?.result as RiskAssessmentResult;
    const treatmentMatching = this.intermediateResults.find(r => r.stage === 'treatment_matching')?.result as TreatmentMatchingResult;
    const optimization = this.intermediateResults.find(r => r.stage === 'optimization')?.result as OptimizationResult;

    const baseScore = baseCalculation?.baseScore || 0.5;
    const medicalAdjustment = medicalAnalysis?.totalAdjustment || 0;
    const finalScore = Math.max(0, Math.min(1, baseScore + medicalAdjustment));

    return {
      successProbability: finalScore,
      treatmentRecommendations: treatmentMatching?.treatments || [],
      riskFactors: riskAssessment?.risks || [],
      optimizationSuggestions: optimization?.lifestyle || [],
      confidence: this.calculateOverallConfidence(),
      calculationBreakdown: {
        baseScore,
        ageAdjustment: baseCalculation?.ageContribution || 0,
        medicalAdjustments: medicalAdjustment,
        lifestyleAdjustments: 0,
        treatmentAdjustments: 0,
        finalScore
      }
    };
  }

  // Helper methods
  private calculateStageConfidence(stage: AnalysisStage): number {
    const confidenceMap: Record<AnalysisStage, number> = {
      initialization: 0.99,
      input_validation: 0.95,
      base_calculation: 0.92,
      medical_analysis: 0.88,
      risk_assessment: 0.85,
      treatment_matching: 0.82,
      optimization: 0.80,
      finalization: 0.95
    };
    
    return confidenceMap[stage];
  }

  private calculateRemainingTime(): number {
    if (this.isComplete) return 0;
    
    const avgTimePerStage = this.getProcessingTime() / (this.intermediateResults.length || 1);
    const remainingStages = 8 - this.intermediateResults.length;
    
    return avgTimePerStage * remainingStages;
  }

  private calculateInputCompleteness(): number {
    const input = this.task.input;
    let filledFields = 0;
    const totalFields = 15;

    if (input.age) filledFields++;
    if (input.bmi !== null) filledFields++;
    if (typeof input.hasPcos === 'boolean') filledFields++;
    if (input.endometriosisGrade !== undefined) filledFields++;
    if (input.amh !== undefined) filledFields++;
    if (input.spermConcentration !== undefined) filledFields++;
    // ... count other fields

    return filledFields / totalFields;
  }

  private generateInputHash(): string {
    const input = JSON.stringify(this.task.input);
    return btoa(input).substring(0, 8);
  }

  private getAgeContribution(age: number): number {
    if (age < 30) return 0.25;
    if (age < 35) return 0.15;
    if (age < 40) return -0.05;
    if (age < 43) return -0.20;
    return -0.35;
  }

  private getBmiContribution(bmi: number): number {
    if (bmi >= 18.5 && bmi < 25) return 0.10;
    if (bmi >= 25 && bmi < 30) return -0.05;
    if (bmi >= 30) return -0.15;
    return -0.10;
  }

  private getAmhAdjustment(amh: number, age?: number): number {
    if (!age) return 0;
    
    const expectedAmh = this.getExpectedAmh(age);
    const ratio = amh / expectedAmh;
    
    if (ratio > 1.5) return 0.15; // High AMH
    if (ratio > 1.0) return 0.05; // Normal-high AMH
    if (ratio > 0.5) return 0; // Normal AMH
    if (ratio > 0.3) return -0.10; // Low AMH
    return -0.25; // Very low AMH
  }

  private getExpectedAmh(age: number): number {
    if (age < 30) return 4.0;
    if (age < 35) return 2.5;
    if (age < 40) return 1.5;
    return 0.8;
  }

  private calculateHormonalAdjustments(input: UserInput): number {
    let adjustment = 0;
    
    if (input.tsh && input.tsh > 4.5) adjustment -= 0.05;
    if (input.prolactin && input.prolactin > 25) adjustment -= 0.08;
    if (input.homaIr && input.homaIr > 2.5) adjustment -= 0.10;
    
    return adjustment;
  }

  private assessMedicalComplexity(input: UserInput): number {
    let complexity = 0;
    
    if (input.hasPcos) complexity += 1;
    if (input.endometriosisGrade > 0) complexity += input.endometriosisGrade;
    if (input.infertilityDuration && input.infertilityDuration > 24) complexity += 1;
    
    return complexity;
  }

  private calculateAgeRisk(age: number): number {
    if (age < 35) return 0;
    if (age < 40) return 0.15;
    if (age < 43) return 0.30;
    return 0.50;
  }

  private calculateOverallConfidence(): number {
    if (this.intermediateResults.length === 0) return 0.5;
    
    const avgConfidence = this.intermediateResults.reduce((sum, result) => sum + result.confidence, 0) / this.intermediateResults.length;
    return avgConfidence;
  }

  private calculateResultQuality(): number {
    const completeness = this.calculateInputCompleteness();
    const confidence = this.calculateOverallConfidence();
    const processingEfficiency = this.getProcessingTime() < 5000 ? 1 : 0.8;
    
    return (completeness + confidence + processingEfficiency) / 3;
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
