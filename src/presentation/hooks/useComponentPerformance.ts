// ===================================================================
// 🚀 FASE 4A: HOOK ESPECIALIZADO PARA PERFORMANCE DE COMPONENTES
// ===================================================================

import { useEffect, useRef, useMemo, useCallback } from 'react';
import { useBenchmark } from '../../core/utils/performanceBenchmark';

interface UseComponentPerformanceOptions {
  componentName: string;
  trackRenders?: boolean;
  trackProps?: boolean;
  trackEffects?: boolean;
  warnThreshold?: number;
  autoOptimize?: boolean;
}

// 🎯 Tipos seguros para props
type ComponentProps = Record<string, unknown>;

// 📊 Configuración de umbrales de performance
const PERFORMANCE_THRESHOLDS = {
  EXCELLENT: 8,    // 120fps
  GOOD: 16.67,     // 60fps
  WARNING: 33,     // 30fps
  CRITICAL: 50     // 20fps
} as const;

interface ComponentPerformanceData {
  renderCount: number;
  lastRenderTime: number;
  averageRenderTime: number;
  propsChanged: number;
  effectsTriggered: number;
  isOptimized: boolean;
  warnings: string[];
}

export const useComponentPerformance = (options: UseComponentPerformanceOptions) => {
  const { measureTime } = useBenchmark();
  const renderCount = useRef(0);
  const propsChangedCount = useRef(0);
  const effectsCount = useRef(0);
  const lastRenderTime = useRef(0);
  const totalRenderTime = useRef(0);
  const previousProps = useRef<ComponentProps | null>(null);
  const warnings = useRef<string[]>([]);

  // 🎯 Función personalizada de trackRender integrada
  const trackRender = useCallback((name: string, duration: number) => {
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
  useEffect(() => {
    if (options.trackRenders) {
      const renderStart = performance.now();
      
      return () => {
        const renderTime = performance.now() - renderStart;
        lastRenderTime.current = renderTime;
        totalRenderTime.current += renderTime;
        renderCount.current++;
        
        trackRender(`${options.componentName}_manual`, renderTime);
        
        // 🚨 Warning si render es muy lento
        if (options.warnThreshold && renderTime > options.warnThreshold) {
          const warning = `⚠️ Render lento en ${options.componentName}: ${renderTime.toFixed(1)}ms`;
          warnings.current.push(warning);
          console.warn(warning);
        }
      };
    }
  });

  // 📊 Tracking de efectos
  const trackEffect = useCallback((effectName: string) => {
    if (options.trackEffects) {
      effectsCount.current++;
      measureTime(`${options.componentName}_effect_${effectName}`, () => {
        // Placeholder para el efecto
      }, 'render');
    }
  }, [options.componentName, options.trackEffects, measureTime]);

  // 🔍 Análisis de props con tipos seguros
  const analyzeProps = useCallback((currentProps: ComponentProps) => {
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

  // 📈 Datos de performance con umbrales inteligentes
  const performanceData: ComponentPerformanceData = useMemo(() => {
    const averageRenderTime = renderCount.current > 0 
      ? totalRenderTime.current / renderCount.current 
      : 0;

    // 🎯 Utilizar umbrales definidos
    const threshold = options.warnThreshold || PERFORMANCE_THRESHOLDS.GOOD;
    const isOptimized = averageRenderTime < threshold && 
                       renderCount.current < 100; // Límite razonable de renders

    return {
      renderCount: renderCount.current,
      lastRenderTime: lastRenderTime.current,
      averageRenderTime,
      propsChanged: propsChangedCount.current,
      effectsTriggered: effectsCount.current,
      isOptimized,
      warnings: [...warnings.current]
    };
  }, [options.warnThreshold]);

  // 🧹 Limpiar warnings después de un tiempo
  useEffect(() => {
    const cleanup = setTimeout(() => {
      warnings.current = [];
    }, 30000);

    return () => clearTimeout(cleanup);
  }, []);

  // 🎯 Funciones de utilidad
  const measureFunction = useCallback(<T,>(name: string, fn: () => T): T => {
    return measureTime(`${options.componentName}_${name}`, fn, 'calculation');
  }, [measureTime, options.componentName]);

  const measureAsyncFunction = useCallback(async <T,>(name: string, fn: () => Promise<T>): Promise<T> => {
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

  // 📊 Recomendaciones específicas con umbrales inteligentes
  const getRecommendations = useCallback((): string[] => {
    const recommendations: string[] = [];
    
    if (performanceData.averageRenderTime > PERFORMANCE_THRESHOLDS.WARNING) {
      recommendations.push(`⚠️ ${options.componentName}: Render lento (${performanceData.averageRenderTime.toFixed(1)}ms) - Considera React.memo`);
    }
    
    if (performanceData.averageRenderTime > PERFORMANCE_THRESHOLDS.GOOD) {
      recommendations.push(`⚡ ${options.componentName}: Optimiza renders - Target: <${PERFORMANCE_THRESHOLDS.GOOD}ms`);
    }
    
    if (performanceData.propsChanged > 15) {
      recommendations.push(`🎯 ${options.componentName}: Optimiza props con useMemo/useCallback (${performanceData.propsChanged} cambios)`);
    }
    
    if (performanceData.renderCount > 50) {
      recommendations.push(`🔄 ${options.componentName}: Muchos re-renders (${performanceData.renderCount}), revisa dependencias`);
    }

    if (performanceData.averageRenderTime < PERFORMANCE_THRESHOLDS.EXCELLENT) {
      recommendations.push(`🚀 ${options.componentName}: Performance excelente (<${PERFORMANCE_THRESHOLDS.EXCELLENT}ms)`);
    }

    return recommendations;
  }, [performanceData, options.componentName]);

  return {
    performanceData,
    trackEffect,
    analyzeProps,
    measureFunction,
    measureAsyncFunction,
    getRecommendations,
    isPerformant: performanceData.isOptimized
  };
};

// 🎯 Hook simplificado para componentes que solo necesitan tracking básico
export const useSimplePerformance = (componentName: string) => {
  return useComponentPerformance({
    componentName,
    trackRenders: true,
    warnThreshold: PERFORMANCE_THRESHOLDS.GOOD // 60fps
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
    autoOptimize: true
  });
};

// 🎛️ Hook para performance media con balance entre features y overhead
export const useBalancedPerformance = (componentName: string) => {
  return useComponentPerformance({
    componentName,
    trackRenders: true,
    trackProps: true,
    warnThreshold: PERFORMANCE_THRESHOLDS.WARNING, // 30fps
    autoOptimize: false
  });
};
