/**
 * 📊 STREAMING ANALYSIS WORKER - REAL-TIME DATA PROCESSING
 * 
 * Specialized worker for streaming analysis of fertility data with real-time
 * insights, trend detection, and continuous monitoring capabilities.
 */

import type { MedicalWorkerTask, WorkerResult } from '../UnifiedParallelEngine_V12';
import type { UserInput } from '../../domain/models';

export interface StreamingDataPoint {
  timestamp: number;
  type: 'biomarker' | 'symptom' | 'treatment' | 'outcome';
  value: any;
  confidence: number;
  source: string;
}

export interface StreamingAnalysisResult {
  realTimeInsights: string[];
  trendAnalysis: TrendAnalysis[];
  anomalies: Anomaly[];
  predictions: Prediction[];
  streamingMetrics: {
    dataPointsProcessed: number;
    processingLatency: number;
    throughput: number;
    accuracy: number;
  };
  recommendations: string[];
}

export interface TrendAnalysis {
  parameter: string;
  direction: 'increasing' | 'decreasing' | 'stable' | 'volatile';
  strength: number;
  significance: 'low' | 'medium' | 'high';
  timeframe: string;
}

export interface Anomaly {
  type: 'outlier' | 'pattern_break' | 'unexpected_change';
  parameter: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  timestamp: number;
}

export interface Prediction {
  parameter: string;
  predictedValue: number;
  confidence: number;
  timeframe: string;
  factors: string[];
}

export class StreamingAnalysisWorker {
  private dataStream: StreamingDataPoint[] = [];
  private windowSize: number = 100;
  private processingLatency: number = 0;
  private throughput: number = 0;
  private lastProcessingTime: number = 0;

  public async process(task: MedicalWorkerTask): Promise<WorkerResult> {
    const startTime = performance.now();
    
    try {
      // Convert input to streaming data points
      const dataPoints = this.convertInputToStreamingData(task.input);
      
      // Add to data stream
      this.addToDataStream(dataPoints);
      
      // Perform streaming analysis
      const analysisResult = await this.performStreamingAnalysis();
      
      const processingTime = performance.now() - startTime;
      this.updateMetrics(processingTime, dataPoints.length);
      
      return {
        taskId: task.id,
        workerId: 'streaming_analysis',
        success: true,
        data: analysisResult,
        confidence: this.calculateAnalysisConfidence(analysisResult),
        processingTime,
        recommendations: analysisResult.recommendations
      };
    } catch (error) {
      return {
        taskId: task.id,
        workerId: 'streaming_analysis',
        success: false,
        data: null,
        confidence: 0,
        processingTime: performance.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private convertInputToStreamingData(input: UserInput): StreamingDataPoint[] {
    const dataPoints: StreamingDataPoint[] = [];
    const timestamp = Date.now();

    // Convert biomarker data
    if (input.amh !== undefined) {
      dataPoints.push({
        timestamp,
        type: 'biomarker',
        value: { name: 'AMH', value: input.amh, unit: 'ng/mL' },
        confidence: 0.95,
        source: 'user_input'
      });
    }

    if (input.prolactin !== undefined) {
      dataPoints.push({
        timestamp,
        type: 'biomarker',
        value: { name: 'Prolactin', value: input.prolactin, unit: 'ng/mL' },
        confidence: 0.90,
        source: 'user_input'
      });
    }

    if (input.tsh !== undefined) {
      dataPoints.push({
        timestamp,
        type: 'biomarker',
        value: { name: 'TSH', value: input.tsh, unit: 'mIU/L' },
        confidence: 0.90,
        source: 'user_input'
      });
    }

    if (input.homaIr !== undefined) {
      dataPoints.push({
        timestamp,
        type: 'biomarker',
        value: { name: 'HOMA-IR', value: input.homaIr, unit: 'index' },
        confidence: 0.85,
        source: 'user_input'
      });
    }

    // Convert sperm parameters
    if (input.spermConcentration !== undefined) {
      dataPoints.push({
        timestamp,
        type: 'biomarker',
        value: { name: 'SpermConcentration', value: input.spermConcentration, unit: 'M/mL' },
        confidence: 0.85,
        source: 'user_input'
      });
    }

    // Convert symptoms/conditions
    if (input.hasPcos) {
      dataPoints.push({
        timestamp,
        type: 'symptom',
        value: { name: 'PCOS', present: true },
        confidence: 0.90,
        source: 'user_input'
      });
    }

    if (input.endometriosisGrade > 0) {
      dataPoints.push({
        timestamp,
        type: 'symptom',
        value: { name: 'Endometriosis', grade: input.endometriosisGrade },
        confidence: 0.95,
        source: 'user_input'
      });
    }

    return dataPoints;
  }

  private addToDataStream(dataPoints: StreamingDataPoint[]): void {
    this.dataStream.push(...dataPoints);
    
    // Maintain sliding window
    if (this.dataStream.length > this.windowSize) {
      this.dataStream = this.dataStream.slice(-this.windowSize);
    }
  }

  private async performStreamingAnalysis(): Promise<StreamingAnalysisResult> {
    const realTimeInsights = this.generateRealTimeInsights();
    const trendAnalysis = this.performTrendAnalysis();
    const anomalies = this.detectAnomalies();
    const predictions = this.generatePredictions();
    const streamingMetrics = this.calculateStreamingMetrics();
    const recommendations = this.generateStreamingRecommendations();

    return {
      realTimeInsights,
      trendAnalysis,
      anomalies,
      predictions,
      streamingMetrics,
      recommendations
    };
  }

  private generateRealTimeInsights(): string[] {
    const insights = [];
    const recentData = this.getRecentDataPoints(10);

    // Analyze recent biomarker patterns
    const biomarkerData = recentData.filter(d => d.type === 'biomarker');
    if (biomarkerData.length > 0) {
      insights.push(`Procesados ${biomarkerData.length} biomarcadores en tiempo real`);
      
      const abnormalValues = biomarkerData.filter(d => this.isAbnormalValue(d));
      if (abnormalValues.length > 0) {
        insights.push(`Detectados ${abnormalValues.length} valores anórmales requieren atención`);
      }
    }

    // Analyze symptom patterns
    const symptomData = recentData.filter(d => d.type === 'symptom');
    if (symptomData.length > 0) {
      insights.push(`Identificados ${symptomData.length} síntomas/condiciones activas`);
    }

    // Real-time correlation analysis
    const correlations = this.detectRealTimeCorrelations();
    if (correlations.length > 0) {
      insights.push(`Detectadas ${correlations.length} correlaciones significativas en tiempo real`);
    }

    if (insights.length === 0) {
      insights.push('Análisis en tiempo real: datos dentro de rangos normales');
    }

    return insights;
  }

  private performTrendAnalysis(): TrendAnalysis[] {
    const trends: TrendAnalysis[] = [];
    const biomarkerGroups = this.groupDataByParameter();

    for (const [parameter, dataPoints] of biomarkerGroups.entries()) {
      if (dataPoints.length >= 3) { // Minimum points for trend analysis
        const trend = this.calculateTrend(parameter, dataPoints);
        if (trend) {
          trends.push(trend);
        }
      }
    }

    return trends;
  }

  private detectAnomalies(): Anomaly[] {
    const anomalies: Anomaly[] = [];
    const recentData = this.getRecentDataPoints(20);

    for (const dataPoint of recentData) {
      if (dataPoint.type === 'biomarker') {
        const anomaly = this.checkForAnomaly(dataPoint);
        if (anomaly) {
          anomalies.push(anomaly);
        }
      }
    }

    // Check for pattern breaks
    const patternBreaks = this.detectPatternBreaks();
    anomalies.push(...patternBreaks);

    return anomalies;
  }

  private generatePredictions(): Prediction[] {
    const predictions: Prediction[] = [];
    const biomarkerGroups = this.groupDataByParameter();

    for (const [parameter, dataPoints] of biomarkerGroups.entries()) {
      if (dataPoints.length >= 5) { // Minimum points for prediction
        const prediction = this.predictNextValue(parameter, dataPoints);
        if (prediction) {
          predictions.push(prediction);
        }
      }
    }

    return predictions;
  }

  private calculateStreamingMetrics(): {
    dataPointsProcessed: number;
    processingLatency: number;
    throughput: number;
    accuracy: number;
  } {
    return {
      dataPointsProcessed: this.dataStream.length,
      processingLatency: this.processingLatency,
      throughput: this.throughput,
      accuracy: this.calculateStreamingAccuracy()
    };
  }

  private generateStreamingRecommendations(): string[] {
    const recommendations = [];
    const recentAnomalies = this.detectAnomalies().filter(a => 
      Date.now() - a.timestamp < 300000 // Last 5 minutes
    );

    if (recentAnomalies.some(a => a.severity === 'critical')) {
      recommendations.push('CRÍTICO: Valores anómalos detectados - Consulta médica inmediata');
    } else if (recentAnomalies.some(a => a.severity === 'high')) {
      recommendations.push('ALTA PRIORIDAD: Anomalías significativas detectadas - Evaluación médica recomendada');
    }

    // Data quality recommendations
    const lowConfidenceData = this.dataStream.filter(d => d.confidence < 0.7);
    if (lowConfidenceData.length > this.dataStream.length * 0.2) {
      recommendations.push('Calidad de datos subóptima - Validar fuentes de información');
    }

    // Streaming performance recommendations
    if (this.processingLatency > 100) {
      recommendations.push('Latencia de procesamiento alta - Optimizar pipeline de análisis');
    }

    if (this.throughput < 10) {
      recommendations.push('Throughput bajo - Considerar optimización de rendimiento');
    }

    return recommendations;
  }

  // Helper methods
  private getRecentDataPoints(count: number): StreamingDataPoint[] {
    return this.dataStream.slice(-count);
  }

  private groupDataByParameter(): Map<string, StreamingDataPoint[]> {
    const groups = new Map<string, StreamingDataPoint[]>();
    
    for (const dataPoint of this.dataStream) {
      if (dataPoint.type === 'biomarker' && dataPoint.value?.name) {
        const parameter = dataPoint.value.name;
        if (!groups.has(parameter)) {
          groups.set(parameter, []);
        }
        groups.get(parameter)!.push(dataPoint);
      }
    }
    
    return groups;
  }

  private isAbnormalValue(dataPoint: StreamingDataPoint): boolean {
    if (dataPoint.type !== 'biomarker' || !dataPoint.value?.name) return false;
    
    const referenceRanges = {
      'AMH': { min: 1.5, max: 4.0 },
      'Prolactin': { min: 2, max: 25 },
      'TSH': { min: 0.5, max: 4.5 },
      'HOMA-IR': { min: 0.5, max: 2.5 },
      'SpermConcentration': { min: 15, max: 300 }
    };
    
    const range = referenceRanges[dataPoint.value.name as keyof typeof referenceRanges];
    if (!range) return false;
    
    const value = dataPoint.value.value;
    return value < range.min || value > range.max;
  }

  private calculateTrend(parameter: string, dataPoints: StreamingDataPoint[]): TrendAnalysis | null {
    if (dataPoints.length < 3) return null;
    
    const values = dataPoints.map(d => d.value?.value).filter(v => v !== undefined);
    if (values.length < 3) return null;
    
    // Simple linear regression slope
    const n = values.length;
    const sumX = (n * (n - 1)) / 2;
    const sumY = values.reduce((a, b) => a + b, 0);
    const sumXY = values.reduce((sum, y, i) => sum + i * y, 0);
    const sumX2 = (n * (n - 1) * (2 * n - 1)) / 6;
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    
    let direction: 'increasing' | 'decreasing' | 'stable' | 'volatile';
    let strength = Math.abs(slope);
    
    if (Math.abs(slope) < 0.1) {
      direction = 'stable';
    } else if (slope > 0) {
      direction = 'increasing';
    } else {
      direction = 'decreasing';
    }
    
    // Check for volatility
    const variance = this.calculateVariance(values);
    if (variance > this.calculateMean(values) * 0.3) {
      direction = 'volatile';
    }
    
    const significance: 'low' | 'medium' | 'high' = 
      strength > 0.5 ? 'high' : strength > 0.2 ? 'medium' : 'low';
    
    return {
      parameter,
      direction,
      strength,
      significance,
      timeframe: `${dataPoints.length} puntos de datos`
    };
  }

  private checkForAnomaly(dataPoint: StreamingDataPoint): Anomaly | null {
    if (!this.isAbnormalValue(dataPoint)) return null;
    
    const parameter = dataPoint.value?.name || 'Unknown';
    let severity: 'low' | 'medium' | 'high' | 'critical' = 'medium';
    
    // Determine severity based on how far from normal
    const referenceRanges = {
      'AMH': { min: 1.5, max: 4.0 },
      'Prolactin': { min: 2, max: 25 },
      'TSH': { min: 0.5, max: 4.5 }
    };
    
    const range = referenceRanges[parameter as keyof typeof referenceRanges];
    if (range) {
      const value = dataPoint.value?.value || 0;
      const deviation = Math.max(
        Math.abs(value - range.min) / range.min,
        Math.abs(value - range.max) / range.max
      );
      
      if (deviation > 2) severity = 'critical';
      else if (deviation > 1) severity = 'high';
      else if (deviation > 0.5) severity = 'medium';
      else severity = 'low';
    }
    
    return {
      type: 'outlier',
      parameter,
      severity,
      description: `Valor anómalo detectado: ${dataPoint.value?.value} ${dataPoint.value?.unit || ''}`,
      timestamp: dataPoint.timestamp
    };
  }

  private detectPatternBreaks(): Anomaly[] {
    // Mock pattern break detection
    return [];
  }

  private detectRealTimeCorrelations(): string[] {
    // Mock correlation detection
    return [];
  }

  private predictNextValue(parameter: string, dataPoints: StreamingDataPoint[]): Prediction | null {
    const values = dataPoints.map(d => d.value?.value).filter(v => v !== undefined);
    if (values.length < 5) return null;
    
    // Simple linear prediction
    const trend = this.calculateTrend(parameter, dataPoints);
    if (!trend) return null;
    
    const lastValue = values[values.length - 1];
    const predictedValue = lastValue + (trend.strength * (trend.direction === 'increasing' ? 1 : -1));
    
    return {
      parameter,
      predictedValue,
      confidence: Math.min(0.9, trend.strength * 0.7 + 0.3),
      timeframe: '1 semana',
      factors: ['Tendencia histórica', 'Patrón de datos recientes']
    };
  }

  private calculateVariance(values: number[]): number {
    const mean = this.calculateMean(values);
    return values.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / values.length;
  }

  private calculateMean(values: number[]): number {
    return values.reduce((a, b) => a + b, 0) / values.length;
  }

  private calculateStreamingAccuracy(): number {
    // Mock accuracy calculation based on confidence scores
    const avgConfidence = this.dataStream.reduce((sum, d) => sum + d.confidence, 0) / this.dataStream.length;
    return avgConfidence || 0.8;
  }

  private updateMetrics(processingTime: number, dataPointCount: number): void {
    this.processingLatency = processingTime;
    this.throughput = dataPointCount / (processingTime / 1000); // points per second
    this.lastProcessingTime = processingTime;
  }

  private calculateAnalysisConfidence(result: StreamingAnalysisResult): number {
    let confidence = 0.8; // Base confidence
    
    // Adjust based on data quality
    if (result.streamingMetrics.accuracy > 0.9) confidence += 0.1;
    if (result.streamingMetrics.dataPointsProcessed > 10) confidence += 0.05;
    if (result.anomalies.length === 0) confidence += 0.05;
    
    return Math.min(confidence, 0.95);
  }
}