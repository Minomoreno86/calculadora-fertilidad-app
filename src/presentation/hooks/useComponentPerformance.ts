import React from 'react';
// ===================================================================
// 🚀 FASE 4A: HOOK ESPECIALIZADO PARA PERFORMANCE DE COMPONENTES
// ===================================================================

import { useBenchmark } from '../../core/utils/performanceBenchmark';
import { detectDevicePerformance } from '../../core/performance/adaptivePerformanceConfig';

interface UseComponentPerformanceOptions {
  componentName: string;
  trackRenders?: boolean;
  trackProps?: boolean;
  trackEffects?: boolean;
  warnThreshold?: number;
  autoOptimize?: boolean;
  medicalPriority?: 'critical' | 'high' | 'medium' | 'low';
}

// 🎯 Tipos seguros para props
type ComponentProps = Record<string, unknown>;

// 📊 Configuración de umbrales de performance con neural adaptation
const PERFORMANCE_THRESHOLDS = {
  EXCELLENT: 8,    // 120fps
  GOOD: 16.67,     // 60fps
  WARNING: 33,     // 30fps
  CRITICAL: 50     // 20fps
} as const;

// 🧠 Neural medical component classification
const MEDICAL_COMPONENT_PROFILES = {
  'CalculatorForm': { priority: 'critical', targetFPS: 120 },
  'ResultsDisplay': { priority: 'high', targetFPS: 60 },
  'BenchmarkCard': { priority: 'medium', targetFPS: 30 },
  'TreatmentCard': { priority: 'medium', targetFPS: 30 },
  'PrognosisCard': { priority: 'high', targetFPS: 60 },
  'FindingsSection': { priority: 'high', targetFPS: 60 }
} as const;

// 🔮 Neural device-adaptive thresholds
const getAdaptiveThresholds = () => {
  const deviceType = detectDevicePerformance();
  let multiplier: number;
  
  if (deviceType === 'high') {
    multiplier = 0.7;
  } else if (deviceType === 'medium') {
    multiplier = 1.0;
  } else {
    multiplier = 1.5;
  }
  
  return {
    EXCELLENT: PERFORMANCE_THRESHOLDS.EXCELLENT * multiplier,
    GOOD: PERFORMANCE_THRESHOLDS.GOOD * multiplier,
    WARNING: PERFORMANCE_THRESHOLDS.WARNING * multiplier,
    CRITICAL: PERFORMANCE_THRESHOLDS.CRITICAL * multiplier
  };
};

interface ComponentPerformanceData {
  renderCount: number;
  lastRenderTime: number;
  averageRenderTime: number;
  propsChanged: number;
  effectsTriggered: number;
  isOptimized: boolean;
  warnings: string[];
  performanceTrend: 'improving' | 'stable' | 'degrading';
  neuralClassification: 'static' | 'dynamic' | 'critical' | 'optimized';
  // 🧠 NEURAL ENHANCEMENTS V13.0
  predictedNextRender: number;
  memoryFootprint: number;
  frameDrops: number;
  cacheHitRate: number;
  neuralScore: number; // 0-100 performance score
}

export const useComponentPerformance = (options: UseComponentPerformanceOptions) => {
  const { measureTime } = useBenchmark();
  const renderCount = React.useRef(0);
  const propsChangedCount = React.useRef(0);
  const effectsCount = React.useRef(0);
  const lastRenderTime = React.useRef(0);
  const totalRenderTime = React.useRef(0);
  const previousProps = React.useRef<ComponentProps | null>(null);
  const warnings = React.useRef<string[]>([]);
  
  // 🧠 Neural performance trend tracking
  const renderHistory = React.useRef<number[]>([]);
  
  // 🆕 NEURAL ENHANCEMENTS V13.0
  const frameDrops = React.useRef(0);
  const memorySnapshots = React.useRef<number[]>([]);
  const cacheHits = React.useRef(0);
  const cacheMisses = React.useRef(0);
  const performancePredictions = React.useRef<number[]>([]);
  const neuralOptimizationHistory = React.useRef<{
    timestamp: number;
    optimization: string;
    impact: number;
  }[]>([]);

  // 🎯 Neural device-adaptive thresholds
  const adaptiveThresholds = React.useMemo(() => getAdaptiveThresholds(), []);
  
  // 🧠 Medical component profile detection
  const medicalProfile = React.useMemo(() => {
    const profile = MEDICAL_COMPONENT_PROFILES[options.componentName as keyof typeof MEDICAL_COMPONENT_PROFILES];
    return profile || { priority: options.medicalPriority || 'medium', targetFPS: 60 };
  }, [options.componentName, options.medicalPriority]);

  // 🧠 NEURAL MEMORY TRACKING
  const trackMemoryUsage = React.useCallback(() => {
    try {
      const memInfo = (performance as Performance & {
        memory?: { usedJSHeapSize: number };
      }).memory;
      if (memInfo) {
        const currentMemory = memInfo.usedJSHeapSize / 1024; // KB
        memorySnapshots.current.push(currentMemory);
        if (memorySnapshots.current.length > 10) {
          memorySnapshots.current = memorySnapshots.current.slice(-10);
        }
        return currentMemory;
      }
    } catch {
      // Memory API not available
    }
    return 0;
  }, []);

  // 🧠 NEURAL CACHE PERFORMANCE TRACKING
  const trackCacheHit = React.useCallback(() => {
    cacheHits.current++;
  }, []);

  const trackCacheMiss = React.useCallback(() => {
    cacheMisses.current++;
  }, []);

  // 🔮 NEURAL PERFORMANCE PREDICTION
  const predictNextRenderTime = React.useCallback(() => {
    if (renderHistory.current.length < 3) return lastRenderTime.current;
    
    // Simple linear regression for prediction
    const recent = renderHistory.current.slice(-5);
    const weights = [0.4, 0.3, 0.2, 0.08, 0.02]; // Recent renders have more weight
    
    let predicted = 0;
    for (let i = 0; i < Math.min(recent.length, weights.length); i++) {
      const renderValue = recent[recent.length - 1 - i];
      const weight = weights[i];
      if (renderValue !== undefined && weight !== undefined) {
        predicted += renderValue * weight;
      }
    }
    
    performancePredictions.current.push(predicted);
    if (performancePredictions.current.length > 10) {
      performancePredictions.current = performancePredictions.current.slice(-10);
    }
    
    return predicted;
  }, []);

  // 🧠 NEURAL FRAME DROP DETECTION
  const detectFrameDrops = React.useCallback((renderTime: number) => {
    const targetFrameTime = 1000 / medicalProfile.targetFPS;
    if (renderTime > targetFrameTime * 1.5) {
      frameDrops.current++;
      neuralOptimizationHistory.current.push({
        timestamp: Date.now(),
        optimization: 'frame_drop_detected',
        impact: renderTime - targetFrameTime
      });
    }
  }, [medicalProfile.targetFPS]);

  // 🎯 Función personalizada de trackRender integrada
  const trackRender = React.useCallback((name: string, duration: number) => {
    // Integrar con el sistema de benchmark existente
    measureTime(name, () => {
      // Simulación de trabajo para registrar el tiempo
      const start = performance.now();
      while (performance.now() - start < duration) {
        // Busy wait para simular el tiempo de render
      }
    }, 'render');
  }, [measureTime]);

  // 📊 Medición automática de render
  React.useEffect(() => {
    if (!options.trackRenders) {
      return undefined;
    }
    
    const renderStart = performance.now();
    
    return () => {
      const renderTime = performance.now() - renderStart;
      lastRenderTime.current = renderTime;
      totalRenderTime.current += renderTime;
      renderCount.current++;
      
      // 🧠 NEURAL ENHANCEMENTS
      trackMemoryUsage();
      detectFrameDrops(renderTime);
      if (renderTime < adaptiveThresholds.GOOD) {
        trackCacheHit();
      } else {
        trackCacheMiss();
      }
      
      trackRender(`${options.componentName}_manual`, renderTime);
      
      // 🚨 Warning si render es muy lento
      if (options.warnThreshold && renderTime > options.warnThreshold) {
        const warning = `⚠️ Render lento en ${options.componentName}: ${renderTime.toFixed(1)}ms`;
        warnings.current.push(warning);
        console.warn(warning);
      }
    };
  });

  // 📊 Tracking de efectos
  const trackEffect = React.useCallback((effectName: string) => {
    if (options.trackEffects) {
      effectsCount.current++;
      measureTime(`${options.componentName}_effect_${effectName}`, () => {
        // Placeholder para el efecto
      }, 'render');
    }
  }, [options.componentName, options.trackEffects, measureTime]);

  // 🔍 Análisis de props con tipos seguros
  const analyzeProps = React.useCallback((currentProps: ComponentProps) => {
    if (options.trackProps && previousProps.current) {
      const changed = Object.keys(currentProps).some(
        key => currentProps[key] !== previousProps.current?.[key]
      );
      
      if (changed) {
        propsChangedCount.current++;
        
        if (options.autoOptimize && propsChangedCount.current > 20) {
          const warning = `🔄 ${options.componentName} cambios frecuentes de props (${propsChangedCount.current}). Considera memoización.`;
          warnings.current.push(warning);
          console.warn(warning);
        }
      }
    }
    
    previousProps.current = currentProps;
  }, [options.componentName, options.trackProps, options.autoOptimize]);

  // 📈 Datos de performance con umbrales inteligentes y neural analysis
  const performanceData: ComponentPerformanceData = React.useMemo(() => {
    const averageRenderTime = renderCount.current > 0 
      ? totalRenderTime.current / renderCount.current 
      : 0;

    // 🎯 Utilizar umbrales adaptativos según dispositivo
    const threshold = options.warnThreshold || adaptiveThresholds.GOOD;
    const isOptimized = averageRenderTime < threshold && 
                       renderCount.current < 100; // Límite razonable de renders

    // 🧠 Neural trend analysis
    renderHistory.current.push(averageRenderTime);
    if (renderHistory.current.length > 10) {
      renderHistory.current = renderHistory.current.slice(-10);
    }
    
    const performanceTrend = (() => {
      if (renderHistory.current.length < 3) return 'stable';
      
      const recent = renderHistory.current.slice(-3);
      const older = renderHistory.current.slice(-6, -3);
      if (older.length === 0) return 'stable';
      
      const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
      const olderAvg = older.reduce((a, b) => a + b, 0) / older.length;
      
      if (recentAvg < olderAvg * 0.9) {
        return 'improving';
      } else if (recentAvg > olderAvg * 1.1) {
        return 'degrading';
      } else {
        return 'stable';
      }
    })();

    // 🧠 Neural component classification
    const neuralClassification = (() => {
      if (renderCount.current > 100 && averageRenderTime < adaptiveThresholds.EXCELLENT) return 'optimized';
      if (renderCount.current > 50 && averageRenderTime > adaptiveThresholds.WARNING) return 'critical';
      if (propsChangedCount.current > 20) return 'dynamic';
      return 'static';
    })();

    // 🧠 NEURAL PERFORMANCE METRICS V13.0
    const currentMemory = memorySnapshots.current.length > 0 
      ? memorySnapshots.current[memorySnapshots.current.length - 1] || 0 
      : 0;
    
    const cacheHitRate = (cacheHits.current + cacheMisses.current) > 0
      ? (cacheHits.current / (cacheHits.current + cacheMisses.current)) * 100
      : 0;

    const predictedNextRender = predictNextRenderTime();

    // 🧠 NEURAL SCORE CALCULATION (0-100)
    const neuralScore = (() => {
      let score = 100;
      
      // Performance penalties
      if (averageRenderTime > adaptiveThresholds.WARNING) score -= 30;
      else if (averageRenderTime > adaptiveThresholds.GOOD) score -= 15;
      
      if (frameDrops.current > 5) score -= 20;
      if (performanceTrend === 'degrading') score -= 15;
      if (cacheHitRate < 50) score -= 10;
      
      // Performance bonuses
      if (neuralClassification === 'optimized') score += 10;
      if (cacheHitRate > 80) score += 5;
      if (performanceTrend === 'improving') score += 10;
      
      return Math.max(0, Math.min(100, score));
    })();

    return {
      renderCount: renderCount.current,
      lastRenderTime: lastRenderTime.current,
      averageRenderTime,
      propsChanged: propsChangedCount.current,
      effectsTriggered: effectsCount.current,
      isOptimized,
      warnings: [...warnings.current],
      performanceTrend,
      neuralClassification,
      // 🧠 NEURAL ENHANCEMENTS V13.0
      predictedNextRender,
      memoryFootprint: currentMemory,
      frameDrops: frameDrops.current,
      cacheHitRate,
      neuralScore
    };
  }, [options.warnThreshold, adaptiveThresholds]);

  // 🧹 Limpiar warnings después de un tiempo
  React.useEffect(() => {
    const cleanup = setTimeout(() => {
      warnings.current = [];
    }, 30000);

    return () => clearTimeout(cleanup);
  }, []);

  // 🎯 Funciones de utilidad
  const measureFunction = React.useCallback(<T,>(name: string, fn: () => T): T => {
    return measureTime(`${options.componentName}_${name}`, fn, 'calculation');
  }, [measureTime, options.componentName]);

  const measureAsyncFunction = React.useCallback(async <T,>(name: string, fn: () => Promise<T>): Promise<T> => {
    const startTime = performance.now();
    try {
      const result = await fn();
      const endTime = performance.now();
      trackRender(`${options.componentName}_async_${name}`, endTime - startTime);
      return result;
    } catch (error) {
      console.error(`Error en función async ${name} de ${options.componentName}:`, error);
      throw error;
    }
  }, [trackRender, options.componentName]);

  // 📊 Recomendaciones específicas con umbrales inteligentes y neural insights
  const getRecommendations = React.useCallback((): string[] => {
    const recommendations: string[] = [];
    
    // 🧠 Neural-enhanced recommendations based on component classification
    switch (performanceData.neuralClassification) {
      case 'critical':
        recommendations.push(`🚨 ${options.componentName}: Componente CRÍTICO - Requiere optimización urgente`);
        recommendations.push(`💡 Prioridad médica: ${medicalProfile.priority} - Target FPS: ${medicalProfile.targetFPS}`);
        break;
      case 'dynamic':
        recommendations.push(`🔄 ${options.componentName}: Componente dinámico - Optimiza prop changes`);
        break;
      case 'optimized':
        recommendations.push(`🚀 ${options.componentName}: Componente optimizado - Performance excelente`);
        break;
      default:
        recommendations.push(`📊 ${options.componentName}: Componente estático - Performance estable`);
    }

    // 🧠 NEURAL SCORE RECOMMENDATIONS
    if (performanceData.neuralScore < 50) {
      recommendations.push(`🧠 Neural Score CRÍTICO: ${performanceData.neuralScore}/100 - Optimización urgente requerida`);
    } else if (performanceData.neuralScore < 70) {
      recommendations.push(`🧠 Neural Score BAJO: ${performanceData.neuralScore}/100 - Mejoras recomendadas`);
    } else if (performanceData.neuralScore > 85) {
      recommendations.push(`🧠 Neural Score EXCELENTE: ${performanceData.neuralScore}/100 - Performance óptima`);
    }

    // 🔮 PREDICTIVE RECOMMENDATIONS
    if (performanceData.predictedNextRender > adaptiveThresholds.WARNING) {
      recommendations.push(`🔮 Predicción Neural: Próximo render será lento (${performanceData.predictedNextRender.toFixed(1)}ms)`);
      recommendations.push(`💡 Sugerencia: Implementa pre-caching o lazy loading`);
    }

    // 💾 MEMORY RECOMMENDATIONS
    if (performanceData.memoryFootprint > 5000) { // 5MB
      recommendations.push(`💾 Alto uso de memoria: ${(performanceData.memoryFootprint / 1024).toFixed(1)}MB`);
      recommendations.push(`🔧 Sugerencia: Revisa memory leaks o implementa cleanup`);
    }

    // 📦 CACHE RECOMMENDATIONS
    if (performanceData.cacheHitRate < 60) {
      recommendations.push(`📦 Cache hit rate bajo: ${performanceData.cacheHitRate.toFixed(1)}%`);
      recommendations.push(`⚡ Sugerencia: Mejora estrategia de memoización`);
    }

    // 🎬 FRAME DROP RECOMMENDATIONS
    if (performanceData.frameDrops > 3) {
      recommendations.push(`🎬 Frame drops detectados: ${performanceData.frameDrops} veces`);
      recommendations.push(`🚀 Sugerencia: Optimiza renders para ${medicalProfile.targetFPS}fps`);
    }

    // 🔮 Trend-based recommendations
    if (performanceData.performanceTrend === 'degrading') {
      recommendations.push(`📉 Degradación detectada - Revisa cambios recientes`);
    } else if (performanceData.performanceTrend === 'improving') {
      recommendations.push(`📈 Mejora continua - Optimizaciones efectivas`);
    }
    
    if (performanceData.averageRenderTime > adaptiveThresholds.WARNING) {
      recommendations.push(`⚠️ ${options.componentName}: Render lento (${performanceData.averageRenderTime.toFixed(1)}ms) - Considera React.memo`);
    }
    
    if (performanceData.averageRenderTime > adaptiveThresholds.GOOD) {
      recommendations.push(`⚡ ${options.componentName}: Optimiza renders - Target: <${adaptiveThresholds.GOOD.toFixed(1)}ms`);
    }
    
    if (performanceData.propsChanged > 15) {
      recommendations.push(`🎯 ${options.componentName}: Optimiza props con useMemo/useCallback (${performanceData.propsChanged} cambios)`);
    }
    
    if (performanceData.renderCount > 50) {
      recommendations.push(`🔄 ${options.componentName}: Muchos re-renders (${performanceData.renderCount}), revisa dependencias`);
    }

    if (performanceData.averageRenderTime < adaptiveThresholds.EXCELLENT) {
      recommendations.push(`🚀 ${options.componentName}: Performance excelente (<${adaptiveThresholds.EXCELLENT.toFixed(1)}ms)`);
    }

    return recommendations;
  }, [performanceData, options.componentName, adaptiveThresholds, medicalProfile]);

  return {
    performanceData,
    trackEffect,
    analyzeProps,
    measureFunction,
    measureAsyncFunction,
    getRecommendations,
    isPerformant: performanceData.isOptimized,
    // 🧠 Neural performance insights
    neuralInsights: {
      classification: performanceData.neuralClassification,
      trend: performanceData.performanceTrend,
      medicalPriority: medicalProfile.priority,
      adaptiveThresholds,
      deviceOptimized: adaptiveThresholds.GOOD !== PERFORMANCE_THRESHOLDS.GOOD,
      // 🆕 NEURAL ENHANCEMENTS V13.0
      neuralScore: performanceData.neuralScore,
      predictedNextRender: performanceData.predictedNextRender,
      memoryEfficiency: performanceData.memoryFootprint < 2000, // < 2MB = efficient
      cacheEfficiency: performanceData.cacheHitRate > 70,
      frameStability: performanceData.frameDrops < 3,
      optimizationHistory: neuralOptimizationHistory.current.slice(-5),
      performancePredictions: performancePredictions.current.slice(-3)
    }
  };
};

// 🎯 Hook simplificado para componentes que solo necesitan tracking básico
export const useSimplePerformance = (componentName: string) => {
  return useComponentPerformance({
    componentName,
    trackRenders: true,
    warnThreshold: PERFORMANCE_THRESHOLDS.GOOD, // 60fps
    medicalPriority: 'medium'
  });
};

// 🔥 Hook para componentes críticos que necesitan máximo rendimiento
export const useCriticalPerformance = (componentName: string) => {
  return useComponentPerformance({
    componentName,
    trackRenders: true,
    trackProps: true,
    trackEffects: true,
    warnThreshold: PERFORMANCE_THRESHOLDS.EXCELLENT, // 120fps
    autoOptimize: true,
    medicalPriority: 'critical'
  });
};

// 🎛️ Hook para performance media con balance entre features y overhead
export const useBalancedPerformance = (componentName: string) => {
  return useComponentPerformance({
    componentName,
    trackRenders: true,
    trackProps: true,
    warnThreshold: PERFORMANCE_THRESHOLDS.WARNING, // 30fps
    autoOptimize: false,
    medicalPriority: 'medium'
  });
};

// 🧠 Hook neural médico especializado para componentes de fertilidad
export const useMedicalPerformance = (componentName: string, medicalPriority: 'critical' | 'high' | 'medium' | 'low' = 'high') => {
  return useComponentPerformance({
    componentName,
    trackRenders: true,
    trackProps: true,
    trackEffects: medicalPriority === 'critical',
    autoOptimize: medicalPriority === 'critical',
    medicalPriority
  });
};
