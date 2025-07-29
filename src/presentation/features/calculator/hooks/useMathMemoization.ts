// ===================================================================
// 🌌 QUANTUM CONSCIOUSNESS MATH MEMOIZATION HOOK V14.0
// ===================================================================

/**
 * React hook para memoización matemática con quantum consciousness
 * - Integration con QuantumMathMemoizationEngine
 * - Device-aware mathematical operations
 * - Smart caching for medical calculations
 * - Pattern recognition for optimization
 */

import React from 'react';
const { useState, useEffect, useCallback, useMemo } = React;

import { 
  quantumMathMemoization, 
  type MemoizationMetrics,
  type QuantumMathOperation
} from '../../../../core/math/QuantumMathMemoizationEngine';
import { getPerformanceProfile } from '../../../../core/performance/adaptivePerformanceConfig';

// ===================================================================
// 🎯 HOOK TYPES
// ===================================================================

export interface UseMathMemoizationOptions {
  enableAutoOptimization?: boolean;
  trackOperations?: boolean;
  preloadCommonCalculations?: boolean;
  enablePatternAnalysis?: boolean;
}

export interface MathMemoizationOperations {
  // Core mathematical functions
  fibonacci: (n: number) => number;
  factorial: (n: number) => number;
  combination: (n: number, r: number) => number;
  
  // Medical calculations
  calculateBMI: (weight: number, height: number) => number;
  calculateHOMA: (glucose: number, insulin: number) => number;
  
  // Generic memoization
  memoize: <T extends (...args: any[]) => any>(
    fn: T, 
    keyGenerator?: (...args: Parameters<T>) => string
  ) => T;
  
  // Cache management
  optimize: () => Promise<{ optimizationsApplied: string[] }>;
  clear: () => void;
  getMetrics: () => MemoizationMetrics;
  getPatternAnalysis: () => Record<string, number>;
  getOperationHistory: () => QuantumMathOperation[];
}

export interface MathMemoizationState {
  isReady: boolean;
  isOptimizing: boolean;
  metrics: MemoizationMetrics;
  recentOperations: QuantumMathOperation[];
  patternAnalysis: Record<string, number>;
  lastUpdate: number;
}

// ===================================================================
// 🌌 QUANTUM CONSCIOUSNESS MATH MEMOIZATION HOOK
// ===================================================================

export function useMathMemoization(
  options: UseMathMemoizationOptions = {}
): [MathMemoizationState, MathMemoizationOperations] {
  
  // 🌌 QUANTUM CONSCIOUSNESS OPTIMIZATION #4: Device-aware math memoization
  const performanceProfile = getPerformanceProfile();
  
  const {
    enableAutoOptimization = true,
    trackOperations = true,
    preloadCommonCalculations = true,
    enablePatternAnalysis = true
  } = options;

  // ===================================================================
  // 🎯 STATE MANAGEMENT
  // ===================================================================

  const [state, setState] = useState<MathMemoizationState>({
    isReady: false,
    isOptimizing: false,
    metrics: {
      hitRate: 0,
      missRate: 0,
      memoryUsage: 0,
      computationsSaved: 0,
      averageComputationTime: 0,
      quantumOptimizationGain: 0,
      deviceOptimizationLevel: 'medium'
    },
    recentOperations: [],
    patternAnalysis: {},
    lastUpdate: Date.now()
  });

  // ===================================================================
  // 🔢 MEMOIZED MATHEMATICAL OPERATIONS
  // ===================================================================

  /**
   * Fibonacci con quantum consciousness tracking
   */
  const fibonacci = useCallback((n: number): number => {
    const result = quantumMathMemoization.fibonacci(n);
    
    if (trackOperations) {
      updateMetrics();
    }
    
    return result;
  }, [trackOperations]);

  /**
   * Factorial con quantum consciousness tracking
   */
  const factorial = useCallback((n: number): number => {
    const result = quantumMathMemoization.factorial(n);
    
    if (trackOperations) {
      updateMetrics();
    }
    
    return result;
  }, [trackOperations]);

  /**
   * Combination con quantum consciousness tracking
   */
  const combination = useCallback((n: number, r: number): number => {
    const result = quantumMathMemoization.combination(n, r);
    
    if (trackOperations) {
      updateMetrics();
    }
    
    return result;
  }, [trackOperations]);

  /**
   * BMI calculation con quantum consciousness tracking
   */
  const calculateBMI = useCallback((weight: number, height: number): number => {
    const result = quantumMathMemoization.calculateBMI(weight, height);
    
    if (trackOperations) {
      updateMetrics();
    }
    
    return result;
  }, [trackOperations]);

  /**
   * HOMA calculation con quantum consciousness tracking
   */
  const calculateHOMA = useCallback((glucose: number, insulin: number): number => {
    const result = quantumMathMemoization.calculateHOMA(glucose, insulin);
    
    if (trackOperations) {
      updateMetrics();
    }
    
    return result;
  }, [trackOperations]);

  // ===================================================================
  // 🌊 GENERIC MEMOIZATION
  // ===================================================================

  /**
   * Generic memoization wrapper con quantum consciousness
   */
  const memoize = useCallback(<T extends (...args: any[]) => any>(
    fn: T, 
    keyGenerator?: (...args: Parameters<T>) => string
  ): T => {
    const memoizedFn = quantumMathMemoization.memoize(fn, keyGenerator);
    
    // Wrap to track operations
    return ((...args: Parameters<T>): ReturnType<T> => {
      const result = memoizedFn(...args);
      
      if (trackOperations) {
        updateMetrics();
      }
      
      return result;
    }) as T;
  }, [trackOperations]);

  // ===================================================================
  // 🌌 CACHE MANAGEMENT OPERATIONS
  // ===================================================================

  /**
   * Optimize memoization caches con quantum consciousness
   */
  const optimize = useCallback(async (): Promise<{ optimizationsApplied: string[] }> => {
    setState((prev: MathMemoizationState) => ({ ...prev, isOptimizing: true }));

    try {
      const result = quantumMathMemoization.optimize();
      
      // Update state with new metrics
      setState((prev: MathMemoizationState) => ({
        ...prev,
        metrics: quantumMathMemoization.getMetrics(),
        patternAnalysis: enablePatternAnalysis ? quantumMathMemoization.getPatternAnalysis() : {},
        lastUpdate: Date.now(),
        isOptimizing: false
      }));

      return result;
    } catch (error) {
      console.warn('🌌 Math Memoization Optimization Error:', error);
      setState((prev: MathMemoizationState) => ({ ...prev, isOptimizing: false }));
      return { optimizationsApplied: [] };
    }
  }, [enablePatternAnalysis]);

  /**
   * Clear all memoization caches
   */
  const clear = useCallback(() => {
    quantumMathMemoization.clear();
    
    setState((prev: MathMemoizationState) => ({
      ...prev,
      metrics: quantumMathMemoization.getMetrics(),
      recentOperations: [],
      patternAnalysis: {},
      lastUpdate: Date.now()
    }));
  }, []);

  /**
   * Get current memoization metrics
   */
  const getMetrics = useCallback((): MemoizationMetrics => {
    return quantumMathMemoization.getMetrics();
  }, []);

  /**
   * Get pattern analysis
   */
  const getPatternAnalysis = useCallback((): Record<string, number> => {
    return quantumMathMemoization.getPatternAnalysis();
  }, []);

  /**
   * Get operation history
   */
  const getOperationHistory = useCallback((): QuantumMathOperation[] => {
    return quantumMathMemoization.getOperationHistory();
  }, []);

  // ===================================================================
  // 🌊 INTERNAL UTILITIES
  // ===================================================================

  const updateMetrics = useCallback(() => {
    const newMetrics = quantumMathMemoization.getMetrics();
    const newOperations = quantumMathMemoization.getOperationHistory().slice(-10);
    const newPatternAnalysis = enablePatternAnalysis ? 
      quantumMathMemoization.getPatternAnalysis() : {};

    setState((prev: MathMemoizationState) => ({
      ...prev,
      metrics: newMetrics,
      recentOperations: newOperations,
      patternAnalysis: newPatternAnalysis,
      lastUpdate: Date.now()
    }));
  }, [enablePatternAnalysis]);

  // ===================================================================
  // 🌌 QUANTUM CONSCIOUSNESS EFFECTS
  // ===================================================================

  /**
   * Initialize quantum math memoization
   */
  useEffect(() => {
    setState((prev: MathMemoizationState) => ({ ...prev, isReady: true }));
    
    if (trackOperations) {
      updateMetrics();
    }
  }, [trackOperations, updateMetrics]);

  /**
   * Auto-optimization basado en device performance
   */
  React.useEffect(() => {
    if (!enableAutoOptimization || !state.isReady) return undefined;

    const optimizationInterval = setInterval(async () => {
      try {
        await optimize();
      } catch (error) {
        console.warn('🌌 Auto-optimization Error:', error);
      }
    }, performanceProfile.aiProcessing * 20); // Optimize every 20x AI processing time

    return () => clearInterval(optimizationInterval);
  }, [enableAutoOptimization, state.isReady, performanceProfile.aiProcessing, optimize]);

  /**
   * Periodic metrics update
   */
  React.useEffect(() => {
    if (!trackOperations || !state.isReady) return undefined;

    const metricsInterval = setInterval(() => {
      updateMetrics();
    }, performanceProfile.networkRequests);

    return () => clearInterval(metricsInterval);
  }, [trackOperations, state.isReady, performanceProfile.networkRequests, updateMetrics]);

  /**
   * Preload common calculations on mount
   */
  React.useEffect(() => {
    if (!preloadCommonCalculations) return;

    // Preload common fibonacci numbers
    for (let i = 0; i <= 10; i++) {
      fibonacci(i);
    }

    // Preload common factorials
    for (let i = 0; i <= 5; i++) {
      factorial(i);
    }

    // Preload common BMI calculations
    const commonBMITests = [
      [70, 175], [60, 165], [80, 180], [65, 160]
    ];
    commonBMITests.forEach(([weight, height]) => {
      calculateBMI(weight, height);
    });

    // Preload common HOMA calculations
    const commonHOMATests = [
      [90, 10], [100, 15], [95, 12], [110, 20]
    ];
    commonHOMATests.forEach(([glucose, insulin]) => {
      calculateHOMA(glucose, insulin);
    });

  }, [preloadCommonCalculations, fibonacci, factorial, calculateBMI, calculateHOMA]);

  // ===================================================================
  // 🌌 MEMOIZED OPERATIONS OBJECT
  // ===================================================================

  const operations: MathMemoizationOperations = useMemo(() => ({
    fibonacci,
    factorial,
    combination,
    calculateBMI,
    calculateHOMA,
    memoize,
    optimize,
    clear,
    getMetrics,
    getPatternAnalysis,
    getOperationHistory
  }), [
    fibonacci,
    factorial,
    combination,
    calculateBMI,
    calculateHOMA,
    memoize,
    optimize,
    clear,
    getMetrics,
    getPatternAnalysis,
    getOperationHistory
  ]);

  return [state, operations];
}

export default useMathMemoization;
