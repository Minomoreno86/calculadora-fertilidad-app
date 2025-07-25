/**
 * 🚀 PRODUCTION PROFILER - SISTEMA DE MÉTRICAS AVANZADAS
 * 
 * Sistema completo de profiling para monitoreo en producción:
 * - Métricas de performance en tiempo real
 * - Análisis de patrones de uso
 * - Alertas automáticas de degradación
 * - Recomendaciones de optimización
 */

export interface ProductionMetrics {
  // � MÉTRICAS DEL SISTEMA MODULAR - FASE 2B
  sistemaModular: {
    totalCalculations: number;
    componentUsage: {
      calculationCore: number;
      cacheManager: number;
      performanceMonitor: number;
      engineSelector: number;
      orchestrator: number;
    };
    modularPerformance: {
      averageExecutionTime: number;
      cacheEfficiency: number;
      componentLoadTimes: Record<string, number>;
      systemHealthScore: number;
    };
    adaptiveFeatures: {
      intelligentSelectionAccuracy: number;
      predictiveLoadingHits: number;
      automaticRecoveryEvents: number;
    };
  };

  // �📊 MÉTRICAS DE MOTOR UNIFICADO (LEGACY - DEPRECADO)
  motorUnificado: {
    totalCalculations: number;
    engineDistribution: {
      standard: number;
      premium: number;
      auto: number;
    };
    averageExecutionTimes: {
      standard: number;
      premium: number;
      auto: number;
    };
    complexityAnalysis: {
      averageScore: number;
      distribution: Record<string, number>; // ranges: 0.0-0.2, 0.2-0.4, etc.
    };
  };

  // 🧠 MÉTRICAS DE IA PREDICTIVA
  iaPredictiva: {
    totalPredictions: number;
    accuracyRate: number;
    engineUsageInAI: {
      standard: number;
      premium: number;
    };
    avgPredictionTime: number;
    modelConfidence: number;
  };

  // ⚡ MÉTRICAS DE VALIDACIÓN PARALELA
  validacionParalela: {
    totalValidations: number;
    parallelizationGain: number;
    cacheHitRate: number;
    categoriesProcessed: Record<string, number>;
  };

  // 🎯 MÉTRICAS DE SIMULADOR
  simulador: {
    totalSimulations: number;
    engineSelectionAccuracy: number;
    avgSimulationTime: number;
    mostSimulatedFactors: Record<string, number>;
  };

  // 📈 MÉTRICAS DE SISTEMA
  sistema: {
    memoryUsage: number;
    cacheEfficiency: number;
    errorRate: number;
    uptimePercentage: number;
  };
}

export interface PerformanceAlert {
  type: 'performance' | 'error' | 'optimization' | 'critical';
  severity: 'low' | 'medium' | 'high' | 'critical';
  component: string;
  message: string;
  metric: string;
  currentValue: number;
  threshold: number;
  recommendation: string;
  timestamp: number;
}

export interface OptimizationSuggestion {
  area: string;
  priority: 'low' | 'medium' | 'high';
  impact: 'minor' | 'moderate' | 'significant';
  description: string;
  implementation: string;
  expectedImprovement: string;
  effort: 'low' | 'medium' | 'high';
}

/**
 * 🚀 PRODUCTION PROFILER CLASS
 */
export class ProductionProfiler {
  private readonly metrics: ProductionMetrics;
  private readonly alerts: PerformanceAlert[] = [];
  private readonly suggestions: OptimizationSuggestion[] = [];
  private readonly isEnabled: boolean = true;
  private samplingRate: number = 1.0; // 100% sampling by default
  private readonly lastReportTime: number = Date.now();

  // 🎯 CONFIGURACIÓN DE THRESHOLDS
  private readonly THRESHOLDS = {
    executionTimeWarn: 100, // ms
    executionTimeCritical: 500, // ms
    memoryUsageWarn: 100 * 1024 * 1024, // 100MB
    memoryUsageCritical: 200 * 1024 * 1024, // 200MB
    errorRateWarn: 0.05, // 5%
    errorRateCritical: 0.10, // 10%
    cacheHitRateWarn: 0.6, // 60%
    accuracyWarn: 0.8 // 80%
  };

  constructor(options: {
    samplingRate?: number;
    alertsEnabled?: boolean;
    autoOptimization?: boolean;
  } = {}) {
    this.samplingRate = options.samplingRate ?? 1.0;
    this.isEnabled = options.alertsEnabled ?? true;

    this.metrics = this.initializeMetrics();
    
    // 🕐 SETUP PERIODIC ANALYSIS
    if (typeof window !== 'undefined') {
      setInterval(() => this.analyzePerformance(), 30000); // Every 30 seconds
    }
  }

  /**
   * 📊 INICIALIZAR MÉTRICAS - ACTUALIZADO PARA SISTEMA MODULAR
   */
  private initializeMetrics(): ProductionMetrics {
    return {
      // 🚀 SISTEMA MODULAR - PRINCIPAL
      sistemaModular: {
        totalCalculations: 0,
        componentUsage: {
          calculationCore: 0,
          cacheManager: 0,
          performanceMonitor: 0,
          engineSelector: 0,
          orchestrator: 0
        },
        modularPerformance: {
          averageExecutionTime: 0,
          cacheEfficiency: 0,
          componentLoadTimes: {},
          systemHealthScore: 100
        },
        adaptiveFeatures: {
          intelligentSelectionAccuracy: 0,
          predictiveLoadingHits: 0,
          automaticRecoveryEvents: 0
        }
      },
      // 📊 MOTOR UNIFICADO - LEGACY (mantenido para compatibilidad)
      motorUnificado: {
        totalCalculations: 0,
        engineDistribution: { standard: 0, premium: 0, auto: 0 },
        averageExecutionTimes: { standard: 0, premium: 0, auto: 0 },
        complexityAnalysis: {
          averageScore: 0,
          distribution: {
            '0.0-0.2': 0,
            '0.2-0.4': 0,
            '0.4-0.6': 0,
            '0.6-0.8': 0,
            '0.8-1.0': 0
          }
        }
      },
      iaPredictiva: {
        totalPredictions: 0,
        accuracyRate: 0,
        engineUsageInAI: { standard: 0, premium: 0 },
        avgPredictionTime: 0,
        modelConfidence: 0
      },
      validacionParalela: {
        totalValidations: 0,
        parallelizationGain: 0,
        cacheHitRate: 0,
        categoriesProcessed: {}
      },
      simulador: {
        totalSimulations: 0,
        engineSelectionAccuracy: 0,
        avgSimulationTime: 0,
        mostSimulatedFactors: {}
      },
      sistema: {
        memoryUsage: 0,
        cacheEfficiency: 0,
        errorRate: 0,
        uptimePercentage: 100
      }
    };
  }

  /**
   * � REGISTRAR MÉTRICA DEL SISTEMA MODULAR - FASE 2B
   */
  recordModularEngineMetric(data: {
    mode: 'standard' | 'premium' | 'auto';
    executionTime: number;
    cacheHitRate: number;
    componentUsage: Record<string, number>;
    engineUsed: 'modular';
  }): void {
    if (!this.shouldSample()) return;

    const { sistemaModular } = this.metrics;
    sistemaModular.totalCalculations++;
    
    // Actualizar uso de componentes
    Object.entries(data.componentUsage).forEach(([component, usage]) => {
      if (component in sistemaModular.componentUsage) {
        const componentKey = component as keyof typeof sistemaModular.componentUsage;
        sistemaModular.componentUsage[componentKey] += usage;
      }
    });
    
    // Actualizar métricas de performance
    sistemaModular.modularPerformance.averageExecutionTime = this.updateRunningAverage(
      sistemaModular.modularPerformance.averageExecutionTime,
      data.executionTime,
      sistemaModular.totalCalculations
    );
    
    sistemaModular.modularPerformance.cacheEfficiency = this.updateRunningAverage(
      sistemaModular.modularPerformance.cacheEfficiency,
      data.cacheHitRate,
      sistemaModular.totalCalculations
    );
    
    // Calcular health score del sistema
    sistemaModular.modularPerformance.systemHealthScore = this.calculateSystemHealthScore();
    
    this.checkPerformanceThresholds('modular_engine', data.executionTime);
  }

  /**
   * �📈 REGISTRAR MÉTRICA DEL MOTOR UNIFICADO (LEGACY)
   */
  recordUnifiedEngineMetric(data: {
    mode: 'standard' | 'premium' | 'auto';
    executionTime: number;
    complexityScore: number;
    engineUsed: 'standard' | 'premium';
  }): void {
    if (!this.shouldSample()) return;

    const { motorUnificado } = this.metrics;
    motorUnificado.totalCalculations++;
    
    // Actualizar distribución de motores
    motorUnificado.engineDistribution[data.mode]++;
    
    // Actualizar tiempos promedio
    this.updateAverage(
      motorUnificado.averageExecutionTimes,
      data.mode,
      data.executionTime,
      motorUnificado.engineDistribution[data.mode]
    );
    
    // Actualizar análisis de complejidad
    this.updateComplexityDistribution(data.complexityScore);
    motorUnificado.complexityAnalysis.averageScore = this.updateAverageScore(
      motorUnificado.complexityAnalysis.averageScore,
      data.complexityScore,
      motorUnificado.totalCalculations
    );

    // Verificar alertas
    this.checkPerformanceAlerts('unified-engine', data.executionTime);
  }

  /**
   * 🧠 REGISTRAR MÉTRICA DE IA PREDICTIVA
   */
  recordPredictiveAIMetric(data: {
    predictionTime: number;
    engineUsed: 'standard' | 'premium';
    confidence: number;
    accuracy?: number;
  }): void {
    if (!this.shouldSample()) return;

    const { iaPredictiva } = this.metrics;
    iaPredictiva.totalPredictions++;
    iaPredictiva.engineUsageInAI[data.engineUsed]++;
    
    iaPredictiva.avgPredictionTime = this.updateAverageScore(
      iaPredictiva.avgPredictionTime,
      data.predictionTime,
      iaPredictiva.totalPredictions
    );
    
    iaPredictiva.modelConfidence = this.updateAverageScore(
      iaPredictiva.modelConfidence,
      data.confidence,
      iaPredictiva.totalPredictions
    );

    if (data.accuracy) {
      iaPredictiva.accuracyRate = this.updateAverageScore(
        iaPredictiva.accuracyRate,
        data.accuracy,
        iaPredictiva.totalPredictions
      );
    }
  }

  /**
   * ⚡ REGISTRAR MÉTRICA DE VALIDACIÓN PARALELA
   */
  recordParallelValidationMetric(data: {
    parallelizationGain: number;
    cacheHitRate: number;
    categoriesProcessed: string[];
  }): void {
    if (!this.shouldSample()) return;

    const { validacionParalela } = this.metrics;
    validacionParalela.totalValidations++;
    
    validacionParalela.parallelizationGain = this.updateAverageScore(
      validacionParalela.parallelizationGain,
      data.parallelizationGain,
      validacionParalela.totalValidations
    );
    
    validacionParalela.cacheHitRate = this.updateAverageScore(
      validacionParalela.cacheHitRate,
      data.cacheHitRate,
      validacionParalela.totalValidations
    );

    // Actualizar categorías procesadas
    data.categoriesProcessed.forEach(category => {
      validacionParalela.categoriesProcessed[category] = 
        (validacionParalela.categoriesProcessed[category] || 0) + 1;
    });
  }

  /**
   * 🎯 REGISTRAR MÉTRICA DEL SIMULADOR
   */
  recordSimulatorMetric(data: {
    simulationTime: number;
    factor: string;
    engineSelected: 'basic' | 'premium';
    wasOptimal: boolean;
  }): void {
    if (!this.shouldSample()) return;

    const { simulador } = this.metrics;
    simulador.totalSimulations++;
    
    simulador.avgSimulationTime = this.updateAverageScore(
      simulador.avgSimulationTime,
      data.simulationTime,
      simulador.totalSimulations
    );
    
    // Actualizar factores más simulados
    simulador.mostSimulatedFactors[data.factor] = 
      (simulador.mostSimulatedFactors[data.factor] || 0) + 1;
    
    // Actualizar precisión de selección de motor
    if (data.wasOptimal) {
      const currentAccuracy = simulador.engineSelectionAccuracy;
      simulador.engineSelectionAccuracy = 
        (currentAccuracy * (simulador.totalSimulations - 1) + 1) / simulador.totalSimulations;
    }
  }

  /**
   * 📊 ANÁLISIS AUTOMÁTICO DE PERFORMANCE
   */
  private analyzePerformance(): void {
    if (!this.isEnabled) return;

    this.checkSystemMetrics();
    this.generateOptimizationSuggestions();
    this.updateDashboard();
  }

  /**
   * 🚨 VERIFICAR ALERTAS DE PERFORMANCE
   */
  private checkPerformanceAlerts(component: string, value: number): void {
    const now = Date.now();

    if (value > this.THRESHOLDS.executionTimeCritical) {
      this.alerts.push({
        type: 'critical',
        severity: 'critical',
        component,
        message: `Tiempo de ejecución crítico: ${value.toFixed(1)}ms`,
        metric: 'execution_time',
        currentValue: value,
        threshold: this.THRESHOLDS.executionTimeCritical,
        recommendation: 'Revisar lógica de cálculo y considerar optimizaciones de cache',
        timestamp: now
      });
    } else if (value > this.THRESHOLDS.executionTimeWarn) {
      this.alerts.push({
        type: 'performance',
        severity: 'medium',
        component,
        message: `Tiempo de ejecución elevado: ${value.toFixed(1)}ms`,
        metric: 'execution_time',
        currentValue: value,
        threshold: this.THRESHOLDS.executionTimeWarn,
        recommendation: 'Monitorear tendencia y considerar optimizaciones',
        timestamp: now
      });
    }
  }

  /**
   * 💡 GENERAR SUGERENCIAS DE OPTIMIZACIÓN
   */
  private generateOptimizationSuggestions(): void {
    this.suggestions.length = 0; // Clear previous suggestions

    const { motorUnificado, validacionParalela } = this.metrics;

    // Sugerencia de balance de motores
    const standardUsage = motorUnificado.engineDistribution.standard;
    const premiumUsage = motorUnificado.engineDistribution.premium;
    const total = standardUsage + premiumUsage;

    if (total > 100 && premiumUsage / total > 0.8) {
      this.suggestions.push({
        area: 'Motor Selection',
        priority: 'medium',
        impact: 'moderate',
        description: 'Alto uso del motor premium detectado',
        implementation: 'Revisar algoritmo de análisis de complejidad para optimizar selección',
        expectedImprovement: '15-25% mejora en tiempo promedio',
        effort: 'medium'
      });
    }

    // Sugerencia de cache
    if (validacionParalela.cacheHitRate < this.THRESHOLDS.cacheHitRateWarn) {
      this.suggestions.push({
        area: 'Cache Optimization',
        priority: 'high',
        impact: 'significant',
        description: `Cache hit rate bajo: ${(validacionParalela.cacheHitRate * 100).toFixed(1)}%`,
        implementation: 'Aumentar tamaño de cache o revisar estrategia de invalidación',
        expectedImprovement: '40-60% mejora en performance',
        effort: 'low'
      });
    }

    // Sugerencia de paralelización
    if (validacionParalela.parallelizationGain < 30) {
      this.suggestions.push({
        area: 'Parallel Processing',
        priority: 'medium',
        impact: 'moderate',
        description: 'Ganancia de paralelización subóptima',
        implementation: 'Optimizar worker pools o ajustar algoritmo de categorización',
        expectedImprovement: '20-35% mejora en casos complejos',
        effort: 'medium'
      });
    }
  }

  /**
   * 📊 OBTENER MÉTRICAS ACTUALES
   */
  getMetrics(): ProductionMetrics {
    return { ...this.metrics };
  }

  /**
   * 🚨 OBTENER ALERTAS ACTIVAS
   */
  getActiveAlerts(): PerformanceAlert[] {
    const now = Date.now();
    const ALERT_TTL = 5 * 60 * 1000; // 5 minutos
    
    return this.alerts.filter(alert => now - alert.timestamp < ALERT_TTL);
  }

  /**
   * 💡 OBTENER SUGERENCIAS DE OPTIMIZACIÓN
   */
  getOptimizationSuggestions(): OptimizationSuggestion[] {
    return [...this.suggestions];
  }

  /**
   * 🎛️ CONFIGURAR SAMPLING RATE
   */
  setSamplingRate(rate: number): void {
    this.samplingRate = Math.max(0, Math.min(1, rate));
  }

  // 🔧 UTILITY METHODS
  private shouldSample(): boolean {
    return Math.random() < this.samplingRate;
  }

  private updateAverage(
    target: Record<string, number>,
    key: string,
    newValue: number,
    count: number
  ): void {
    if (target[key] !== undefined) {
      target[key] = (target[key] * (count - 1) + newValue) / count;
    }
  }

  private updateAverageScore(current: number, newValue: number, count: number): number {
    return (current * (count - 1) + newValue) / count;
  }

  private updateComplexityDistribution(score: number): void {
    const distribution = this.metrics.motorUnificado.complexityAnalysis.distribution;
    
    if (!distribution) return; // Neural safe guard
    
    if (score < 0.2) distribution['0.0-0.2'] = (distribution['0.0-0.2'] ?? 0) + 1;
    else if (score < 0.4) distribution['0.2-0.4'] = (distribution['0.2-0.4'] ?? 0) + 1;
    else if (score < 0.6) distribution['0.4-0.6'] = (distribution['0.4-0.6'] ?? 0) + 1;
    else if (score < 0.8) distribution['0.6-0.8'] = (distribution['0.6-0.8'] ?? 0) + 1;
    else distribution['0.8-1.0'] = (distribution['0.8-1.0'] ?? 0) + 1;
  }

  private checkSystemMetrics(): void {
    // Implementar verificación de métricas del sistema
    if (typeof window !== 'undefined' && 'performance' in window) {
      // Type-safe memory access with proper interface
      const performance = window.performance as Performance & {
        memory?: {
          usedJSHeapSize: number;
          totalJSHeapSize: number;
          jsHeapSizeLimit: number;
        };
      };
      
      if (performance.memory) {
        this.metrics.sistema.memoryUsage = performance.memory.usedJSHeapSize;
      }
    }
  }

  private updateDashboard(): void {
    // Emitir evento para actualizar dashboard en tiempo real
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('profiler:metrics-updated', {
        detail: this.metrics
      }));
    }
  }

  // 🚀 MÉTODOS HELPER PARA SISTEMA MODULAR - FASE 2B
  
  /**
   * 📊 Actualizar promedio móvil
   */
  private updateRunningAverage(currentAvg: number, newValue: number, count: number): number {
    return (currentAvg * (count - 1) + newValue) / count;
  }

  /**
   * 🎯 Calcular health score del sistema modular
   */
  private calculateSystemHealthScore(): number {
    const { sistemaModular } = this.metrics;
    const perf = sistemaModular.modularPerformance;
    
    // Factores que influyen en el health score
    const executionScore = Math.max(0, 100 - (perf.averageExecutionTime / 10)); // Penalizar >1000ms
    const cacheScore = perf.cacheEfficiency * 100;
    const adaptiveScore = sistemaModular.adaptiveFeatures.intelligentSelectionAccuracy * 100;
    
    // Promedio ponderado
    return Math.round((executionScore * 0.4 + cacheScore * 0.4 + adaptiveScore * 0.2));
  }

  /**
   * ⚠️ Verificar thresholds de performance
   */
  private checkPerformanceThresholds(component: string, executionTime: number): void {
    if (executionTime > this.THRESHOLDS.executionTimeCritical) {
      this.alerts.push({
        type: 'performance',
        severity: 'critical',
        component,
        message: `Tiempo de ejecución crítico: ${executionTime.toFixed(2)}ms`,
        metric: 'execution_time',
        currentValue: executionTime,
        threshold: this.THRESHOLDS.executionTimeCritical,
        recommendation: 'Revisar algoritmos de cálculo y optimizar componentes críticos',
        timestamp: Date.now()
      });
    } else if (executionTime > this.THRESHOLDS.executionTimeWarn) {
      this.alerts.push({
        type: 'performance',
        severity: 'medium',
        component,
        message: `Tiempo de ejecución elevado: ${executionTime.toFixed(2)}ms`,
        metric: 'execution_time',
        currentValue: executionTime,
        threshold: this.THRESHOLDS.executionTimeWarn,
        recommendation: 'Considerar optimizaciones en el flujo de cálculo',
        timestamp: Date.now()
      });
    }
  }
}

// 🚀 INSTANCIA GLOBAL DEL PROFILER
export const productionProfiler = new ProductionProfiler({
  samplingRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0, // 10% en producción
  alertsEnabled: true,
  autoOptimization: true
});
