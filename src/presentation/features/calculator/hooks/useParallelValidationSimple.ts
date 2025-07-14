/**
 * 🚀 FASE 1.2: Hook Simplificado de Validación Paralela
 * 
 * Versión simplificada que funciona en React Native sin Web Workers.
 * Simula validación paralela usando Promises y timeouts.
 */

import { useState, useCallback } from 'react';

export interface ValidationResult {
  taskId: string;
  success: boolean;
  result?: unknown;
  error?: string;
  processingTime: number;
  cacheHit?: boolean;
}

export interface StreamingProgress {
  phase: 'critical' | 'important' | 'optional' | 'complete';
  progress: number;
  currentGroup?: string;
  estimatedTimeRemaining: number;
  criticalComplete: boolean;
  importantComplete: boolean;
}

export interface ValidationMetrics {
  totalTasks: number;
  completedTasks: number;
  failedTasks: number;
  averageTime: number;
  cacheHitRate: number;
  concurrencyLevel: number;
}

export interface ParallelValidationState {
  isRunning: boolean;
  progress: StreamingProgress;
  metrics: ValidationMetrics;
  results: Map<string, ValidationResult[]>;
  criticalResults: ValidationResult[];
  importantResults: ValidationResult[];
  error?: Error;
  lastUpdate: number;
}

export interface ParallelValidationControls {
  startValidation: (groups: unknown[]) => Promise<void>;
  abortValidation: () => void;
  isValidationSupported: boolean;
  getQuickValidation: (data: unknown) => Promise<ValidationResult[]>;
  clearResults: () => void;
  getPerformanceReport: () => Record<string, unknown>;
}

export interface UseParallelValidationOptions {
  enableMetrics?: boolean;
  config?: Record<string, unknown>;
  onComplete?: (results: Map<string, ValidationResult[]>) => void;
  onError?: (error: Error) => void;
}

/**
 * Hook simplificado de validación paralela para React Native
 */
export function useParallelValidation(
  options: UseParallelValidationOptions = {}
): [ParallelValidationState, ParallelValidationControls] {

  const [state, setState] = useState<ParallelValidationState>({
    isRunning: false,
    progress: {
      phase: 'critical',
      progress: 0,
      estimatedTimeRemaining: 0,
      criticalComplete: false,
      importantComplete: false
    },
    metrics: {
      totalTasks: 0,
      completedTasks: 0,
      failedTasks: 0,
      averageTime: 0,
      cacheHitRate: 0.8,
      concurrencyLevel: 0
    },
    results: new Map(),
    criticalResults: [],
    importantResults: [],
    lastUpdate: Date.now()
  });

  /**
   * Simular validación paralela
   */
  const startValidation = useCallback(async (groups: unknown[]) => {
    setState(prev => ({
      ...prev,
      isRunning: true,
      error: undefined,
      results: new Map(),
      criticalResults: [],
      importantResults: [],
      lastUpdate: Date.now()
    }));

    try {
      // Simular fases de validación
      const phases = ['critical', 'important', 'optional'] as const;
      
      for (let i = 0; i < phases.length; i++) {
        const phase = phases[i];
        
        // Actualizar progreso
        setState(prev => ({
          ...prev,
          progress: {
            ...prev.progress,
            phase,
            progress: (i / phases.length) * 100,
            currentGroup: `Validando ${phase}...`,
            estimatedTimeRemaining: Math.max(0, (phases.length - i - 1) * 500)
          },
          lastUpdate: Date.now()
        }));

        // Simular tiempo de procesamiento
        await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 200));
        
        // Simular resultados
        const phaseResults: ValidationResult[] = [
          {
            taskId: `${phase}-validation`,
            success: Math.random() > 0.1,
            result: { phase, validated: true, timestamp: Date.now() },
            processingTime: 300 + Math.random() * 200,
            cacheHit: Math.random() > 0.7
          }
        ];

        // Actualizar estado con resultados
        setState(prev => ({
          ...prev,
          results: new Map(prev.results).set(phase, phaseResults),
          criticalResults: phase === 'critical' ? phaseResults : prev.criticalResults,
          importantResults: phase === 'important' ? phaseResults : prev.importantResults,
          progress: {
            ...prev.progress,
            criticalComplete: i >= 0,
            importantComplete: i >= 1
          },
          metrics: {
            ...prev.metrics,
            totalTasks: prev.metrics.totalTasks + 1,
            completedTasks: prev.metrics.completedTasks + 1,
            averageTime: 300 + Math.random() * 200,
            concurrencyLevel: Math.min(3, i + 1)
          },
          lastUpdate: Date.now()
        }));
      }

      // Completar validación
      setState(prev => ({
        ...prev,
        isRunning: false,
        progress: {
          ...prev.progress,
          phase: 'complete',
          progress: 100,
          currentGroup: 'Completado'
        },
        lastUpdate: Date.now()
      }));

      options.onComplete?.(state.results);

    } catch (error) {
      setState(prev => ({
        ...prev,
        isRunning: false,
        error: error as Error,
        lastUpdate: Date.now()
      }));
      options.onError?.(error as Error);
      throw error;
    }
  }, [options, state.results]);

  /**
   * Abortar validación
   */
  const abortValidation = useCallback(() => {
    setState(prev => ({
      ...prev,
      isRunning: false,
      lastUpdate: Date.now()
    }));
  }, []);

  /**
   * Validación rápida
   */
  const getQuickValidation = useCallback(async (data: unknown): Promise<ValidationResult[]> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return [
      {
        taskId: 'quick-validation',
        success: true,
        result: {
          isValid: true,
          confidence: 0.9,
          data,
          timestamp: Date.now()
        },
        processingTime: 100
      }
    ];
  }, []);

  /**
   * Limpiar resultados
   */
  const clearResults = useCallback(() => {
    setState(prev => ({
      ...prev,
      results: new Map(),
      criticalResults: [],
      importantResults: [],
      error: undefined,
      lastUpdate: Date.now()
    }));
  }, []);

  /**
   * Reporte de performance
   */
  const getPerformanceReport = useCallback(() => {
    return {
      ...state.metrics,
      efficiency: state.metrics.totalTasks > 0 ? 
        (state.metrics.completedTasks / state.metrics.totalTasks) * 100 : 0,
      errorRate: state.metrics.totalTasks > 0 ? 
        (state.metrics.failedTasks / state.metrics.totalTasks) * 100 : 0,
      avgTaskTime: state.metrics.averageTime,
      cacheEfficiency: state.metrics.cacheHitRate * 100,
      lastUpdate: state.lastUpdate,
      isSupported: true,
      platform: 'React Native (Simulated)'
    };
  }, [state.metrics, state.lastUpdate]);

  const controls: ParallelValidationControls = {
    startValidation,
    abortValidation,
    isValidationSupported: true,
    getQuickValidation,
    clearResults,
    getPerformanceReport
  };

  return [state, controls];
}

/**
 * Hook simplificado para validación rápida
 */
export function useQuickValidation() {
  const [isValidating, setIsValidating] = useState(false);
  const [results, setResults] = useState<ValidationResult[]>([]);
  const [error, setError] = useState<Error | undefined>();

  const validate = useCallback(async (data: unknown) => {
    setIsValidating(true);
    setError(undefined);

    try {
      await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 100));
      
      const quickResults: ValidationResult[] = [
        {
          taskId: 'quick-basic',
          success: true,
          result: { 
            isValid: true, 
            data,
            confidence: 0.85 + Math.random() * 0.15,
            timestamp: Date.now()
          },
          processingTime: 50 + Math.random() * 100
        }
      ];

      setResults(quickResults);
      return quickResults;

    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    } finally {
      setIsValidating(false);
    }
  }, []);

  return {
    validate,
    isValidating,
    results,
    error,
    clearResults: () => setResults([])
  };
}

export default useParallelValidation;
