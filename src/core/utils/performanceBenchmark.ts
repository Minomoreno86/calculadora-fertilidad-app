// ===================================================================
// 🚀 FASE 2C: SISTEMA DE BENCHMARKING Y MÉTRICAS DE RENDIMIENTO
// ===================================================================

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

class PerformanceBenchmark {
  private metrics: PerformanceMetric[] = [];
  private renderMetrics = new Map<string, ComponentRenderMetrics>();
  private isEnabled = process.env.NODE_ENV === 'development';

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
      const memInfo = (performance as any).memory;
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
      
      if (!averageTimes[metric.name]) {
        averageTimes[metric.name] = [];
      }
      averageTimes[metric.name].push(metric.value);
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

    // Revisar tiempos de cálculo lentos
    Object.entries(averageTimes).forEach(([name, time]) => {
      if (name.includes('calculation') && time > 100) {
        recommendations.push(`⚠️ Cálculo lento detectado en ${name}: ${time.toFixed(1)}ms`);
      }
      if (name.includes('validation') && time > 50) {
        recommendations.push(`⚠️ Validación lenta detectada en ${name}: ${time.toFixed(1)}ms`);
      }
    });

    // Revisar renders excesivos
    renderMetrics.forEach(metric => {
      if (metric.renderCount > 10 && metric.averageRenderTime > 16.67) {
        recommendations.push(`🔄 Componente ${metric.componentName} re-renderiza frecuentemente (${metric.renderCount} veces)`);
      }
    });

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
}

// 🌟 Instancia global de benchmark
export const performanceBenchmark = new PerformanceBenchmark();

// 🎯 Hook de React para usar el sistema de benchmarking
export const useBenchmark = () => {
  return {
    measureTime: performanceBenchmark.measureTime.bind(performanceBenchmark),
    measureTimeAsync: performanceBenchmark.measureTimeAsync.bind(performanceBenchmark),
    benchmarkIterations: performanceBenchmark.benchmarkIterations.bind(performanceBenchmark),
    trackRender: performanceBenchmark.trackRender.bind(performanceBenchmark),
    getReport: performanceBenchmark.getMetricsReport.bind(performanceBenchmark),
    clearMetrics: performanceBenchmark.clearMetrics.bind(performanceBenchmark)
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
