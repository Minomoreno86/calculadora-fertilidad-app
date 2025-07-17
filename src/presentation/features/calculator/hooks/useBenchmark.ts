import { useMemo } from 'react';
import type { FormState, PerformanceReport } from '../types/calculator.types';

/**
 * Hook para medir y comparar el rendimiento del formulario
 * Proporciona métricas de benchmark y comparación con estándares
 */
export function useBenchmark(formData: FormState) {
  return useMemo(() => {
    const startTime = performance.now();
    
    // 📊 Métricas básicas de completitud
    const totalFields = Object.keys(formData).length;
    const completedFields = Object.values(formData).filter(value => 
      value !== '' && value !== null && value !== undefined
    ).length;
    
    const completionRate = Math.round((completedFields / totalFields) * 100);
    
    // 🎯 Benchmark de calidad de datos
    const criticalFields = ['age', 'weight', 'height', 'cycleLength', 'infertilityDuration'];
    const criticalCompleted = criticalFields.filter(field => 
      formData[field as keyof FormState] && formData[field as keyof FormState] !== ''
    ).length;
    
    const qualityScore = Math.round((criticalCompleted / criticalFields.length) * 100);
    
    // ⚡ Métricas de rendimiento
    const benchmarkTime = performance.now() - startTime;
    
    const performanceReport: PerformanceReport = {
      renderCount: 1,
      totalMeasurements: 1,
      averageTime: benchmarkTime,
      lastMeasurement: benchmarkTime,
      operations: [{
        name: 'benchmark_calculation',
        duration: benchmarkTime,
        timestamp: Date.now()
      }]
    };
    
    return {
      performanceReport,
      isOptimal: completionRate >= 80 && qualityScore >= 90,
      needsImprovement: qualityScore < 70,
      getBenchmarkData: () => performanceReport,
      // Métricas adicionales del formulario
      completionRate,
      qualityScore,
      recommendation: _generateRecommendation(completionRate, qualityScore)
    };
  }, [formData]);
}

function _generateRecommendation(completion: number, quality: number): string {
  if (quality < 50) {
    return 'Completar datos críticos: edad, peso, altura, duración del ciclo';
  }
  if (completion < 70) {
    return 'Agregar más información para mejorar precisión del cálculo';
  }
  if (quality >= 90 && completion >= 80) {
    return 'Datos completos y de alta calidad para cálculo preciso';
  }
  return 'Considerar completar información adicional';
}
