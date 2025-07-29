// ===================================================================
// 🚀 HOOK INTELIGENTE DE THROTTLING DINÁMICO
// ===================================================================

import React from 'react';
import { useAdaptivePerformance } from '@/core/performance/adaptivePerformanceConfig';

interface ThrottleState {
  lastExecution: number;
  pendingTimeout: ReturnType<typeof setTimeout> | null;
  executionCount: number;
  averageExecutionTime: number;
}

interface DynamicThrottleConfig {
  baseDelay: number;           // Delay base en ms
  maxDelay: number;           // Delay máximo en ms
  minDelay: number;           // Delay mínimo en ms
  adaptiveMultiplier: number; // Multiplicador adaptivo
  performanceWindow: number;  // Ventana de medición de performance (ms)
  backoffStrategy: 'linear' | 'exponential' | 'adaptive';
}

const DEFAULT_CONFIG: DynamicThrottleConfig = {
  baseDelay: 300,
  maxDelay: 2000,
  minDelay: 50,
  adaptiveMultiplier: 1.5,
  performanceWindow: 10000, // 10 segundos
  backoffStrategy: 'adaptive'
};

/**
 * Hook para throttling dinámico basado en performance del dispositivo
 */
export function useDynamicThrottle<T extends (...args: unknown[]) => unknown>(
  callback: T,
  config: Partial<DynamicThrottleConfig> = {}
) {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const { isHighPerformanceDevice, isLowPerformanceDevice, validationDebounce } = useAdaptivePerformance();
  
  const throttleStateRef = React.useRef<ThrottleState>({
    lastExecution: 0,
    pendingTimeout: null,
    executionCount: 0,
    averageExecutionTime: 0
  });

  const executionTimesRef = React.useRef<number[]>([]);
  const [currentDelay, setCurrentDelay] = React.useState(finalConfig.baseDelay);

  // 📊 Calcular delay adaptivo basado en performance
  const calculateAdaptiveDelay = React.useCallback((): number => {
    const state = throttleStateRef.current;
    
    // Base delay según dispositivo
    let baseDelay: number;
    if (isHighPerformanceDevice()) {
      baseDelay = Math.max(finalConfig.minDelay, validationDebounce * 0.5);
    } else if (isLowPerformanceDevice()) {
      baseDelay = Math.min(finalConfig.maxDelay, validationDebounce * 2);
    } else {
      baseDelay = validationDebounce;
    }

    // Ajuste según historial de ejecuciones
    if (state.averageExecutionTime > 0) {
      const performanceMultiplier = Math.min(
        state.averageExecutionTime / 100, // Normalizar a 100ms base
        finalConfig.adaptiveMultiplier
      );
      
      switch (finalConfig.backoffStrategy) {
        case 'linear':
          baseDelay += performanceMultiplier * 50;
          break;
        case 'exponential':
          baseDelay *= Math.pow(1.2, performanceMultiplier);
          break;
        case 'adaptive':
        default:
          baseDelay *= (1 + (performanceMultiplier - 1) * 0.3);
          break;
      }
    }

    // Ajuste por frecuencia de uso
    const recentExecutions = executionTimesRef.current.filter(
      time => Date.now() - time < finalConfig.performanceWindow
    );
    
    if (recentExecutions.length > 10) {
      const frequencyMultiplier = Math.min(recentExecutions.length / 10, 3);
      baseDelay *= frequencyMultiplier;
    }

    return Math.max(
      finalConfig.minDelay,
      Math.min(finalConfig.maxDelay, baseDelay)
    );
  }, [
    finalConfig,
    isHighPerformanceDevice,
    isLowPerformanceDevice,
    validationDebounce
  ]);

  // 🎯 Actualizar estadísticas de ejecución
  const updateExecutionStats = React.useCallback((executionTime: number) => {
    const state = throttleStateRef.current;
    
    // Agregar tiempo de ejecución
    executionTimesRef.current.push(Date.now());
    
    // Mantener solo los últimos 50 tiempos
    if (executionTimesRef.current.length > 50) {
      executionTimesRef.current = executionTimesRef.current.slice(-50);
    }
    
    // Calcular promedio de tiempo de ejecución
    state.executionCount++;
    state.averageExecutionTime = 
      (state.averageExecutionTime * (state.executionCount - 1) + executionTime) / 
      state.executionCount;
    
    // Actualizar delay para próxima ejecución
    setCurrentDelay(calculateAdaptiveDelay());
  }, [calculateAdaptiveDelay]);

  // 🚀 Función throttled principal
  const throttledFunction = React.useCallback((...args: Parameters<T>) => {
    const now = Date.now();
    const state = throttleStateRef.current;
    const timeSinceLastExecution = now - state.lastExecution;

    // Cancelar timeout pendiente
    if (state.pendingTimeout) {
      clearTimeout(state.pendingTimeout);
      state.pendingTimeout = null;
    }

    const executeFunction = () => {
      const startTime = performance.now();
      
      try {
        const result = callback(...args);
        
        // Medir tiempo de ejecución
        const endTime = performance.now();
        const executionTime = endTime - startTime;
        
        // Actualizar estadísticas
        state.lastExecution = Date.now();
        updateExecutionStats(executionTime);
        
        return result;
      } catch (error) {
        console.error('Error in throttled function:', error);
        throw error;
      }
    };

    // Ejecutar inmediatamente si ha pasado suficiente tiempo
    if (timeSinceLastExecution >= currentDelay) {
      return executeFunction();
    }

    // Programar ejecución diferida
    const remainingDelay = currentDelay - timeSinceLastExecution;
    state.pendingTimeout = setTimeout(executeFunction, remainingDelay);
    
    return undefined; // Ejecución diferida
  }, [callback, currentDelay, updateExecutionStats]);

  // 🧹 Limpiar al desmontar
  React.useEffect(() => {
    return () => {
      const state = throttleStateRef.current;
      if (state.pendingTimeout) {
        clearTimeout(state.pendingTimeout);
        state.pendingTimeout = null;
      }
    };
  }, []);

  // 📊 Función para obtener métricas
  const getMetrics = React.useCallback(() => {
    const state = throttleStateRef.current;
    const recentExecutions = executionTimesRef.current.filter(
      time => Date.now() - time < finalConfig.performanceWindow
    );

    let devicePerformance: string;
    if (isHighPerformanceDevice()) {
      devicePerformance = 'high';
    } else if (isLowPerformanceDevice()) {
      devicePerformance = 'low';
    } else {
      devicePerformance = 'medium';
    }

    return {
      currentDelay,
      averageExecutionTime: Math.round(state.averageExecutionTime * 100) / 100,
      totalExecutions: state.executionCount,
      recentExecutions: recentExecutions.length,
      devicePerformance,
      lastExecution: state.lastExecution,
      hasPendingExecution: !!state.pendingTimeout
    };
  }, [
    currentDelay,
    finalConfig.performanceWindow,
    isHighPerformanceDevice,
    isLowPerformanceDevice
  ]);

  // 🔧 Función para ajustar configuración dinámicamente
  const adjustConfig = React.useCallback((newConfig: Partial<DynamicThrottleConfig>) => {
    Object.assign(finalConfig, newConfig);
    setCurrentDelay(calculateAdaptiveDelay());
  }, [finalConfig, calculateAdaptiveDelay]);

  return {
    // Función throttled principal
    throttledFunction: throttledFunction as T,
    
    // Métricas y estadísticas
    getMetrics,
    
    // Control dinámico
    adjustConfig,
    currentDelay,
    
    // Configuración aplicada
    config: finalConfig
  };
}

/**
 * Hook simplificado para casos de uso comunes
 */
export function useSmartThrottle<T extends (...args: unknown[]) => unknown>(
  callback: T,
  baseDelay?: number
): T {
  const config = baseDelay ? { baseDelay } : {};
  const { throttledFunction } = useDynamicThrottle(callback, config);
  return throttledFunction;
}
