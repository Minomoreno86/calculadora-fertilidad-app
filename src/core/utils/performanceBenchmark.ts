// ===================================================================
// 🚀 FASE 4A: SISTEMA DE BENCHMARKING Y MÉTRICAS DE RENDIMIENTO AVANZADO
// ===================================================================

import React from 'react';

interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: number;
  category: 'render' | 'calculation' | 'validation' | 'memory' | 'network';
}

interface BenchmarkResult {
  testName: string;
  duration: number;
  iterations: number;
  averageTime: number;
  minTime: number;
  maxTime: number;
  memoryUsage: number;
  success: boolean;
  error?: string;
}

interface ComponentRenderMetrics {
  componentName: string;
  renderCount: number;
  totalRenderTime: number;
  averageRenderTime: number;
  lastRenderTime: number;
}

interface DeviceType {
  category: 'mobile' | 'tablet' | 'desktop' | 'unknown';
  performance: 'low' | 'medium' | 'high';
}

interface PerformanceThresholds {
  calculation: { warning: number; critical: number };
  validation: { warning: number; critical: number };
  render: { warning: number; critical: number; maxRenders: number; maxTime: number };
  memory: { warning: number; critical: number };
}

interface TrendAnalysis {
  degradation: number;
  improvement: number;
  stability: 'stable' | 'degrading' | 'improving';
}

class PerformanceBenchmark {
  private metrics: PerformanceMetric[] = [];
  private readonly renderMetrics = new Map<string, ComponentRenderMetrics>();
  private readonly isEnabled = process.env.NODE_ENV === 'development';

  // 🎯 Medición de tiempo de ejecución
  measureTime<T>(name: string, fn: () => T, category: PerformanceMetric['category'] = 'calculation'): T {
    if (!this.isEnabled) return fn();

    const startTime = performance.now();
    const startMemory = this.getMemoryUsage();
    
    try {
      const result = fn();
      const endTime = performance.now();
      const endMemory = this.getMemoryUsage();
      
      this.addMetric({
        name,
        value: endTime - startTime,
        unit: 'ms',
        timestamp: Date.now(),
        category
      });

      if (startMemory && endMemory) {
        this.addMetric({
          name: `${name}_memory`,
          value: endMemory - startMemory,
          unit: 'KB',
          timestamp: Date.now(),
          category: 'memory'
        });
      }

      return result;
    } catch (error) {
      console.error(`Error en benchmark ${name}:`, error);
      throw error;
    }
  }

  // 🎯 Medición de tiempo asíncrono
  async measureTimeAsync<T>(
    name: string, 
    fn: () => Promise<T>, 
    category: PerformanceMetric['category'] = 'calculation'
  ): Promise<T> {
    if (!this.isEnabled) return fn();

    const startTime = performance.now();
    
    try {
      const result = await fn();
      const endTime = performance.now();
      
      this.addMetric({
        name,
        value: endTime - startTime,
        unit: 'ms',
        timestamp: Date.now(),
        category
      });

      return result;
    } catch (error) {
      console.error(`Error en benchmark async ${name}:`, error);
      throw error;
    }
  }

  // 🎯 Benchmark de múltiples iteraciones
  benchmarkIterations(name: string, fn: () => void, iterations: number = 1000): BenchmarkResult {
    if (!this.isEnabled) {
      return {
        testName: name,
        duration: 0,
        iterations: 0,
        averageTime: 0,
        minTime: 0,
        maxTime: 0,
        memoryUsage: 0,
        success: false
      };
    }

    const times: number[] = [];
    const startMemory = this.getMemoryUsage();
    const overallStart = performance.now();

    try {
      for (let i = 0; i < iterations; i++) {
        const start = performance.now();
        fn();
        const end = performance.now();
        times.push(end - start);
      }

      const overallEnd = performance.now();
      const endMemory = this.getMemoryUsage();
      
      const duration = overallEnd - overallStart;
      const averageTime = times.reduce((a, b) => a + b, 0) / times.length;
      const minTime = Math.min(...times);
      const maxTime = Math.max(...times);
      const memoryUsage = endMemory && startMemory ? endMemory - startMemory : 0;

      const result: BenchmarkResult = {
        testName: name,
        duration,
        iterations,
        averageTime,
        minTime,
        maxTime,
        memoryUsage,
        success: true
      };

      console.log(`📊 BENCHMARK: ${name}`, result);
      return result;

    } catch (error) {
      return {
        testName: name,
        duration: 0,
        iterations: 0,
        averageTime: 0,
        minTime: 0,
        maxTime: 0,
        memoryUsage: 0,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // 🎯 Tracking de renders de componentes React
  trackRender(componentName: string, renderTime?: number): void {
    if (!this.isEnabled) return;

    const currentTime = renderTime || performance.now();
    const existing = this.renderMetrics.get(componentName);

    if (existing) {
      existing.renderCount++;
      existing.totalRenderTime += currentTime;
      existing.averageRenderTime = existing.totalRenderTime / existing.renderCount;
      existing.lastRenderTime = currentTime;
    } else {
      this.renderMetrics.set(componentName, {
        componentName,
        renderCount: 1,
        totalRenderTime: currentTime,
        averageRenderTime: currentTime,
        lastRenderTime: currentTime
      });
    }
  }

  // 🎯 Obtener métricas de memoria
  private getMemoryUsage(): number {
    try {
      const memInfo = (performance as Performance & {
        memory?: { usedJSHeapSize: number };
      }).memory;
      return memInfo ? Math.round(memInfo.usedJSHeapSize / 1024) : 0;
    } catch {
      return 0;
    }
  }

  // 🎯 Agregar métrica
  private addMetric(metric: PerformanceMetric): void {
    this.metrics.push(metric);
    
    // Mantener solo las últimas 1000 métricas
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-1000);
    }
  }

  // 🎯 Obtener reporte de métricas
  getMetricsReport(): {
    totalMetrics: number;
    categories: Record<string, number>;
    averageTimes: Record<string, number>;
    renderMetrics: ComponentRenderMetrics[];
    recommendations: string[];
  } {
    const categories: Record<string, number> = {};
    const averageTimes: Record<string, number[]> = {};

    this.metrics.forEach(metric => {
      categories[metric.category] = (categories[metric.category] || 0) + 1;
      
      averageTimes[metric.name] ??= [];
      averageTimes[metric.name]!.push(metric.value);
    });

    const avgTimes: Record<string, number> = {};
    Object.entries(averageTimes).forEach(([name, times]) => {
      avgTimes[name] = times.reduce((a, b) => a + b, 0) / times.length;
    });

    const renderMetrics = Array.from(this.renderMetrics.values());
    const recommendations = this.generateRecommendations(avgTimes, renderMetrics);

    return {
      totalMetrics: this.metrics.length,
      categories,
      averageTimes: avgTimes,
      renderMetrics,
      recommendations
    };
  }

  // 🎯 Generar recomendaciones de optimización
  private generateRecommendations(
    averageTimes: Record<string, number>,
    renderMetrics: ComponentRenderMetrics[]
  ): string[] {
    const recommendations: string[] = [];

    // 🔍 Detección de dispositivos para umbrales dinámicos
    const deviceType = this.detectDeviceType();
    const thresholds = this.getPerformanceThresholds(deviceType);

    // 🧮 Revisar tiempos de cálculo con umbrales dinámicos
    Object.entries(averageTimes).forEach(([name, time]) => {
      if (name.includes('calculation')) {
        if (time > thresholds.calculation.critical) {
          recommendations.push(`🚨 Cálculo crítico lento en ${name}: ${time.toFixed(1)}ms (>${thresholds.calculation.critical}ms)`);
          recommendations.push(`💡 Sugerencia: Considera usar Web Workers o memoización`);
        } else if (time > thresholds.calculation.warning) {
          recommendations.push(`⚠️ Cálculo lento detectado en ${name}: ${time.toFixed(1)}ms`);
          recommendations.push(`🔧 Sugerencia: Optimiza algoritmo o implementa cache`);
        }
      }
      
      if (name.includes('validation')) {
        if (time > thresholds.validation.critical) {
          recommendations.push(`🚨 Validación crítica lenta en ${name}: ${time.toFixed(1)}ms`);
          recommendations.push(`💡 Sugerencia: Implementa validación paralela`);
        } else if (time > thresholds.validation.warning) {
          recommendations.push(`⚠️ Validación lenta detectada en ${name}: ${time.toFixed(1)}ms`);
        }
      }

      if (name.includes('render')) {
        if (time > thresholds.render.critical) {
          recommendations.push(`🚨 Render crítico lento en ${name}: ${time.toFixed(1)}ms`);
          recommendations.push(`💡 Sugerencia: Implementa React.memo o useMemo`);
        }
      }

      if (name.includes('memory') && time > thresholds.memory.warning) {
        recommendations.push(`💾 Uso alto de memoria en ${name}: ${time.toFixed(1)}KB`);
        recommendations.push(`🔧 Sugerencia: Revisa memory leaks o implementa cleanup`);
      }
    });

    // 🔄 Revisar renders excesivos con análisis avanzado
    renderMetrics.forEach(metric => {
      const isFrequentRenderer = metric.renderCount > thresholds.render.maxRenders;
      const isSlowRenderer = metric.averageRenderTime > thresholds.render.maxTime;
      
      if (isFrequentRenderer && isSlowRenderer) {
        recommendations.push(`🚨 Componente ${metric.componentName} crítico: ${metric.renderCount} renders, ${metric.averageRenderTime.toFixed(1)}ms promedio`);
        recommendations.push(`💡 Prioridad ALTA: Implementa memoización urgente`);
      } else if (isFrequentRenderer) {
        recommendations.push(`🔄 Componente ${metric.componentName} re-renderiza frecuentemente (${metric.renderCount} veces)`);
        recommendations.push(`🔧 Sugerencia: Verifica dependencias en useEffect`);
      } else if (isSlowRenderer) {
        recommendations.push(`🐌 Componente ${metric.componentName} render lento: ${metric.averageRenderTime.toFixed(1)}ms`);
        recommendations.push(`⚡ Sugerencia: Optimiza JSX o usa lazy loading`);
      }
    });

    // 📊 Análisis de tendencias
    const trendAnalysis = this.analyzeTrends();
    if (trendAnalysis.degradation > 20) {
      recommendations.push(`📉 Degradación de performance detectada: ${trendAnalysis.degradation.toFixed(1)}%`);
      recommendations.push(`🔍 Sugerencia: Revisa cambios recientes en código`);
    }

    // 🎯 Recomendaciones proactivas
    if (this.metrics.length > 800) {
      recommendations.push(`🧹 Cache de métricas casi lleno (${this.metrics.length}/1000)`);
      recommendations.push(`💡 Sugerencia: Considera limpiar métricas antiguas`);
    }

    return recommendations;
  }

  // 🎯 Limpiar métricas
  clearMetrics(): void {
    this.metrics = [];
    this.renderMetrics.clear();
  }

  // 🎯 Obtener métricas recientes
  getRecentMetrics(minutes: number = 5): PerformanceMetric[] {
    const cutoff = Date.now() - (minutes * 60 * 1000);
    return this.metrics.filter(metric => metric.timestamp >= cutoff);
  }

  // 🔍 Detectar tipo de dispositivo para umbrales dinámicos
  private detectDeviceType(): DeviceType {
    try {
      const deviceInfo = this.getDeviceInfo();
      const category = this.categorizeDevice(deviceInfo);
      const performanceLevel = this.assessPerformanceLevel(category, deviceInfo);
      
      return { category, performance: performanceLevel };
    } catch {
      return { category: 'unknown', performance: 'medium' };
    }
  }

  private getDeviceInfo() {
    const nav = navigator as Navigator & {
      connection?: { effectiveType?: string };
      mozConnection?: { effectiveType?: string };
      webkitConnection?: { effectiveType?: string };
    };
    const connection = nav.connection || nav.mozConnection || nav.webkitConnection;
    
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobile = /mobile|android|iphone|ipad/.test(userAgent);
    const isTablet = /tablet|ipad/.test(userAgent);
    
    const memInfo = (performance as Performance & {
      memory?: { jsHeapSizeLimit: number };
    }).memory;
    const memoryGB = memInfo ? memInfo.jsHeapSizeLimit / (1024 * 1024 * 1024) : 4;
    
    const slowConnection = Boolean(connection?.effectiveType && 
      ['slow-2g', '2g', '3g'].includes(connection.effectiveType));

    return { isMobile, isTablet, memoryGB, slowConnection };
  }

  private categorizeDevice(deviceInfo: { isMobile: boolean; isTablet: boolean }): DeviceType['category'] {
    const { isMobile, isTablet } = deviceInfo;
    
    if (isMobile && !isTablet) return 'mobile';
    if (isTablet) return 'tablet';
    return 'desktop';
  }

  private assessPerformanceLevel(
    category: DeviceType['category'], 
    deviceInfo: { memoryGB: number; slowConnection: boolean }
  ): DeviceType['performance'] {
    const { memoryGB, slowConnection } = deviceInfo;
    
    switch (category) {
      case 'mobile':
        return memoryGB > 2 && !slowConnection ? 'medium' : 'low';
      case 'tablet':
        return memoryGB > 4 ? 'high' : 'medium';
      case 'desktop':
        return memoryGB > 8 ? 'high' : 'medium';
      default:
        return 'medium';
    }
  }

  // ⚙️ Obtener umbrales de performance según dispositivo
  private getPerformanceThresholds(device: DeviceType): PerformanceThresholds {
    const baseThresholds = {
      high: {
        calculation: { warning: 50, critical: 100 },
        validation: { warning: 25, critical: 50 },
        render: { warning: 8, critical: 16, maxRenders: 15, maxTime: 12 },
        memory: { warning: 10000, critical: 50000 }
      },
      medium: {
        calculation: { warning: 75, critical: 150 },
        validation: { warning: 40, critical: 80 },
        render: { warning: 12, critical: 20, maxRenders: 12, maxTime: 16.67 },
        memory: { warning: 15000, critical: 75000 }
      },
      low: {
        calculation: { warning: 100, critical: 200 },
        validation: { warning: 60, critical: 120 },
        render: { warning: 20, critical: 30, maxRenders: 8, maxTime: 25 },
        memory: { warning: 20000, critical: 100000 }
      }
    };

    return baseThresholds[device.performance] || baseThresholds.medium;
  }

  // 📈 Analizar tendencias de performance
  private analyzeTrends(): TrendAnalysis {
    if (this.metrics.length < 50) {
      return { degradation: 0, improvement: 0, stability: 'stable' };
    }

    // Comparar últimas 25 métricas vs 25 anteriores
    const recent = this.metrics.slice(-25);
    const previous = this.metrics.slice(-50, -25);

    const recentAvg = recent.reduce((sum, m) => sum + m.value, 0) / recent.length;
    const previousAvg = previous.reduce((sum, m) => sum + m.value, 0) / previous.length;

    const change = ((recentAvg - previousAvg) / previousAvg) * 100;
    
    let stability: TrendAnalysis['stability'] = 'stable';
    if (change > 10) stability = 'degrading';
    else if (change < -10) stability = 'improving';

    return {
      degradation: Math.max(0, change),
      improvement: Math.max(0, -change),
      stability
    };
  }

  // 🧹 Limpiar métricas automáticamente por antigüedad
  private autoCleanupMetrics(): void {
    const now = Date.now();
    const maxAge = 30 * 60 * 1000; // 30 minutos
    
    this.metrics = this.metrics.filter(metric => 
      now - metric.timestamp < maxAge
    );
  }

  // 📊 Obtener estadísticas detalladas
  getDetailedStats(): {
    deviceInfo: DeviceType;
    thresholds: PerformanceThresholds;
    trends: TrendAnalysis;
    memoryUsage: number;
    cacheEfficiency: number;
  } {
    const deviceInfo = this.detectDeviceType();
    const thresholds = this.getPerformanceThresholds(deviceInfo);
    const trends = this.analyzeTrends();
    const memoryUsage = this.getMemoryUsage();
    
    // Calcular eficiencia de cache (simulado)
    const cacheHits = this.metrics.filter(m => m.name.includes('cache_hit')).length;
    const cacheMisses = this.metrics.filter(m => m.name.includes('cache_miss')).length;
    const cacheEfficiency = cacheHits + cacheMisses > 0 ? 
      (cacheHits / (cacheHits + cacheMisses)) * 100 : 0;

    return {
      deviceInfo,
      thresholds,
      trends,
      memoryUsage,
      cacheEfficiency
    };
  }
}

// 🌟 Instancia global de benchmark
export const performanceBenchmark = new PerformanceBenchmark();

// 🎯 Hook de React mejorado para usar el sistema de benchmarking
export const useBenchmark = () => {
  return {
    measureTime: performanceBenchmark.measureTime.bind(performanceBenchmark),
    measureTimeAsync: performanceBenchmark.measureTimeAsync.bind(performanceBenchmark),
    benchmarkIterations: performanceBenchmark.benchmarkIterations.bind(performanceBenchmark),
    trackRender: performanceBenchmark.trackRender.bind(performanceBenchmark),
    getReport: performanceBenchmark.getMetricsReport.bind(performanceBenchmark),
    getDetailedStats: performanceBenchmark.getDetailedStats.bind(performanceBenchmark),
    clearMetrics: performanceBenchmark.clearMetrics.bind(performanceBenchmark),
    getRecentMetrics: performanceBenchmark.getRecentMetrics.bind(performanceBenchmark)
  };
};

// 🎯 HOC para medir automáticamente renders de componentes
export const withPerformanceTracking = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName?: string
) => {
  const TrackedComponent = (props: P) => {
    const startTime = performance.now();
    
    React.useEffect(() => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      performanceBenchmark.trackRender(
        componentName || WrappedComponent.displayName || WrappedComponent.name || 'Component',
        renderTime
      );
    });

    return React.createElement(WrappedComponent, props);
  };

  TrackedComponent.displayName = `WithPerformanceTracking(${componentName || WrappedComponent.displayName || WrappedComponent.name})`;
  
  return TrackedComponent;
};
