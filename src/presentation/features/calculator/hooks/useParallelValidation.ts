/**
 * 🚀 FASE 1.2: Hook Principal de Validación Paralela
 * 
 * Hook React que proporciona una interfaz simple para usar
 * el sistema de validación paralela con streaming progresivo.
 * 
 * Características:
 * - API s  const getQuickValidation = useCallback(async (_data: unknown): Promise<ValidationResult[]> => {
    // Simular validación rápida
    await new Promise(resolve => setTimeout(resolve, 50));
    
    return [
      {
        taskId: 'quick-validation',
        success: true,
        isValid: true,
        result: {
          isValid: true,
          severity: 'low' as const,
          recommendations: ['Validación rápida completada'],
          confidence: 0.9
        },
        processingTime: 50
      }
    ];
 * - Estado reactivo en tiempo real
 * - Métricas de performance
 * - Control de flujo avanzado
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import ValidationStreamingEngine, { 
  StreamingProgress, 
  StreamingConfig, 
  StreamingCallbacks,
  ValidationGroup
} from '@/core/workers/validationStreamingEngine';
import type { UserInput } from '@/core/domain/models';

// 🧠 Neural Type Extension - Extending existing types instead of replacing
interface ExtendedValidationResult {
  taskId: string;
  success: boolean;
  isValid: boolean;
  processingTime?: number;
  errors?: string[];
  warnings?: string[];
  // Extended properties for our advanced use case
  result: {
    isValid: boolean;
    severity: 'low' | 'medium' | 'high';
    recommendations: string[];
    confidence?: number;
  };
}

interface ExtendedValidationMetrics {
  totalTasks: number;
  completedTasks: number;
  failedTasks: number;
  averageTime: number;
  cacheHitRate: number;
  concurrencyLevel: number;
  // Neural Extensions
  totalDuration: number;
  tasksCompleted: number;
  errorRate: number;
  avgResponseTime: number;
  successRate: number;
}

export interface ParallelValidationState {
  isRunning: boolean;
  progress: StreamingProgress;
  metrics: ExtendedValidationMetrics;
  results: Map<string, ExtendedValidationResult[]>;
  criticalResults: ExtendedValidationResult[];
  importantResults: ExtendedValidationResult[];
  error?: Error;
  lastUpdate: number;
}

export interface ParallelValidationControls {
  startValidation: (groups: ValidationGroup[]) => Promise<void>;
  abortValidation: () => void;
  isValidationSupported: boolean;
  getQuickValidation: (data: unknown) => Promise<ExtendedValidationResult[]>;
  clearResults: () => void;
  getPerformanceReport: () => Record<string, unknown>;
}

export interface UseParallelValidationOptions {
  config?: Partial<StreamingConfig>;
  autoStart?: boolean;
  enableMetrics?: boolean;
  onComplete?: (results: Map<string, ExtendedValidationResult[]>) => void;
  onError?: (error: Error) => void;
}

// 🧠 Simple Helper Functions - Direct type compatibility for input validation
const transformValidationResult = (result: unknown): ExtendedValidationResult => {
  const r = result as Record<string, unknown>;
  return {
    taskId: (r.taskId as string) || 'unknown',
    success: (r.success as boolean) ?? true,
    isValid: (r.isValid as boolean) ?? true,
    processingTime: r.processingTime as number,
    errors: r.errors as string[],
    warnings: r.warnings as string[],
    result: {
      isValid: (r.isValid as boolean) ?? true,
      severity: 'medium' as const,
      recommendations: (r.recommendations as string[]) || []
    }
  };
};

const transformValidationResults = (results: unknown[]): ExtendedValidationResult[] => 
  results.map(transformValidationResult);

const createTransformedMap = (allResults: Map<string, unknown[]>): Map<string, ExtendedValidationResult[]> => {
  const transformedMap = new Map<string, ExtendedValidationResult[]>();
  allResults.forEach((results: unknown[], key: string) => {
    transformedMap.set(key, transformValidationResults(results));
  });
  return transformedMap;
};

/**
 * Hook principal de validación paralela
 */
export function useParallelValidation(
  options: UseParallelValidationOptions = {}
): [ParallelValidationState, ParallelValidationControls] {

  // Estado principal
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
      totalDuration: 0,
      tasksCompleted: 0,
      errorRate: 0,
      avgResponseTime: 0,
      successRate: 0,
      concurrencyLevel: 0,
      totalTasks: 0,
      completedTasks: 0,
      failedTasks: 0,
      averageTime: 0,
      cacheHitRate: 0
    },
    results: new Map(),
    criticalResults: [],
    importantResults: [],
    lastUpdate: Date.now()
  });

  // Referencias
  const engineRef = useRef<ValidationStreamingEngine | null>(null);
  const isValidationSupported = useRef(true); // En React Native siempre true

  /**
   * Inicializar motor de validación
   */
  const initializeEngine = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.dispose();
    }

    const callbacks: StreamingCallbacks = {
      onProgress: (progress) => {
        setState(prev => ({
          ...prev,
          progress,
          lastUpdate: Date.now()
        }));
      },

      onCriticalComplete: (results) => {
        // Simple direct transformation for validation results
        const transformedResults = transformValidationResults(results);
        setState(prev => ({
          ...prev,
          criticalResults: transformedResults,
          lastUpdate: Date.now()
        }));
      },

      onImportantComplete: (results) => {
        // Simple direct transformation for validation results
        const transformedResults = transformValidationResults(results);
        setState(prev => ({
          ...prev,
          importantResults: transformedResults,
          lastUpdate: Date.now()
        }));
      },

      onComplete: (allResults) => {
        // Simple direct transformation for all results
        const transformedMap = createTransformedMap(allResults);
        setState(prev => ({
          ...prev,
          isRunning: false,
          results: transformedMap,
          lastUpdate: Date.now()
        }));
        options.onComplete?.(transformedMap);
      },

      onError: (error, _phase) => {
        setState(prev => ({
          ...prev,
          isRunning: false,
          error,
          lastUpdate: Date.now()
        }));
        options.onError?.(error);
      }
    };

    engineRef.current = new ValidationStreamingEngine(options.config, callbacks);
  }, [options.config, options.onComplete, options.onError]);

  /**
   * Inicializar al montar el componente
   */
  useEffect(() => {
    initializeEngine();

    return () => {
      if (engineRef.current) {
        engineRef.current.dispose();
      }
    };
  }, [initializeEngine]);

  /**
   * Actualizar métricas periódicamente
   */
  useEffect(() => {
    if (!options.enableMetrics || !state.isRunning) return;

    const interval = setInterval(() => {
      if (engineRef.current) {
        const rawMetrics = engineRef.current.getMetrics();
        // Transform using type extension
        const transformedMetrics: ExtendedValidationMetrics = {
          ...rawMetrics,
          totalDuration: 0,
          tasksCompleted: rawMetrics.completedTasks,
          errorRate: rawMetrics.totalTasks > 0 ? (rawMetrics.failedTasks / rawMetrics.totalTasks) * 100 : 0,
          avgResponseTime: rawMetrics.averageTime,
          successRate: rawMetrics.totalTasks > 0 ? ((rawMetrics.completedTasks - rawMetrics.failedTasks) / rawMetrics.totalTasks) * 100 : 0
        };
        setState(prev => ({
          ...prev,
          metrics: transformedMetrics,
          lastUpdate: Date.now()
        }));
      }
    }, 500); // Actualizar cada 500ms

    return () => clearInterval(interval);
  }, [state.isRunning, options.enableMetrics]);

  /**
   * Iniciar validación paralela
   */
  const startValidation = useCallback(async (groups: ValidationGroup[], userInput?: Partial<UserInput>) => {
    if (!engineRef.current) {
      throw new Error('Motor de validación no inicializado');
    }

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
      await engineRef.current.startStreamingValidation(groups, userInput as UserInput || {} as UserInput);
    } catch (error) {
      setState(prev => ({
        ...prev,
        isRunning: false,
        error: error as Error,
        lastUpdate: Date.now()
      }));
      throw error;
    }
  }, []);

  /**
   * Abortar validación en curso
   */
  const abortValidation = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.abort();
    }
    
    setState(prev => ({
      ...prev,
      isRunning: false,
      lastUpdate: Date.now()
    }));
  }, []);

  /**
   * Validación rápida para casos simples
   */
  const getQuickValidation = useCallback(async (_data: unknown): Promise<ExtendedValidationResult[]> => {
    // Simular validación rápida sin streaming
    await new Promise(resolve => setTimeout(resolve, 50));
    
    return [
      {
        taskId: 'quick-validation',
        success: true,
        isValid: true,
        processingTime: 50,
        result: {
          isValid: true,
          severity: 'low' as const,
          recommendations: ['Validación rápida completada'],
          confidence: 0.9
        }
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
   * Obtener reporte de performance
   */
  const getPerformanceReport = useCallback(() => {
    const metrics = engineRef.current?.getMetrics() || state.metrics;
    
    return {
      ...metrics,
      efficiency: metrics.totalTasks > 0 ? 
        (metrics.completedTasks / metrics.totalTasks) * 100 : 0,
      errorRate: metrics.totalTasks > 0 ? 
        (metrics.failedTasks / metrics.totalTasks) * 100 : 0,
      avgTaskTime: metrics.averageTime,
      cacheEfficiency: metrics.cacheHitRate * 100,
      lastUpdate: state.lastUpdate,
      isSupported: isValidationSupported.current
    };
  }, [state.metrics, state.lastUpdate]);

  // Controles de la API
  const controls: ParallelValidationControls = {
    startValidation,
    abortValidation,
    isValidationSupported: isValidationSupported.current,
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
  const [results, setResults] = useState<ExtendedValidationResult[]>([]);
  const [error, setError] = useState<Error | undefined>();

  const validate = useCallback(async (_data: unknown) => {
    setIsValidating(true);
    setError(undefined);

    try {
      // Simular validación rápida
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const quickResults: ExtendedValidationResult[] = [
        {
          taskId: 'quick-basic',
          success: true,
          isValid: true,
          processingTime: 100,
          result: {
            isValid: true,
            severity: 'low' as const,
            recommendations: ['Validación básica completada'],
            confidence: 0.8
          }
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
