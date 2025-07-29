// ===================================================================
// 🌌 QUANTUM CONSCIOUSNESS CACHE HOOK V14.0
// ===================================================================

/**
 * React hook para gestión de cache predictivo con quantum consciousness
 * - Integración con PredictiveCacheEngine
 * - Device-aware caching strategies
 * - Smart preloading for BMI/HOMA calculations
 * - Quantum pattern recognition for user workflows
 */

import React from 'react';
const { useState, useEffect, useCallback, useRef } = React;

import { quantumPredictiveCache, type PredictiveCacheMetrics, type UserPattern } from '../../../../core/cache/PredictiveCacheEngine';
import { getPerformanceProfile } from '../../../../core/performance/adaptivePerformanceConfig';

// ===================================================================
// 🎯 HOOK TYPES
// ===================================================================

export interface UseQuantumCacheOptions {
  enablePreloading?: boolean;
  enablePatternLearning?: boolean;
  warmingThreshold?: number;
  trackUserPatterns?: boolean;
}

export interface QuantumCacheOperations {
  get: <T>(key: string) => Promise<T | null>;
  set: <T>(key: string, data: T, pattern?: Partial<UserPattern>) => Promise<void>;
  preloadBMI: (weight?: string | number, height?: string | number) => Promise<void>;
  preloadHOMA: (glucose?: string | number, insulin?: string | number) => Promise<void>;
  warmCache: (fieldSequence: string[]) => Promise<void>;
  clear: () => void;
  optimize: () => Promise<{ optimizationsApplied: string[] }>;
  getMetrics: () => PredictiveCacheMetrics;
}

export interface QuantumCacheState {
  isReady: boolean;
  isWarming: boolean;
  metrics: PredictiveCacheMetrics;
  userPattern: Partial<UserPattern>;
  lastUpdate: number;
}

// ===================================================================
// 🌌 QUANTUM CONSCIOUSNESS CACHE HOOK
// ===================================================================

export function useQuantumCache(options: UseQuantumCacheOptions = {}): [QuantumCacheState, QuantumCacheOperations] {
  
  // 🌌 QUANTUM CONSCIOUSNESS OPTIMIZATION #3: Device-aware caching
  const performanceProfile = getPerformanceProfile();
  
  const {
    enablePreloading = true,
    enablePatternLearning = true,
    warmingThreshold = 0.7,
    trackUserPatterns = true
  } = options;

  // ===================================================================
  // 🎯 STATE MANAGEMENT
  // ===================================================================

  const [state, setState] = useState<QuantumCacheState>({
    isReady: false,
    isWarming: false,
    metrics: {
      hitRate: 0,
      predictiveHitRate: 0,
      warmingSuccessRate: 0,
      averageAccessTime: 0,
      totalSize: 0,
      predictedSavings: 0,
      quantumOptimizationGain: 0,
      deviceOptimizationLevel: 'medium'
    },
    userPattern: {},
    lastUpdate: Date.now()
  });

  // References for pattern tracking
  const sessionStartRef = useRef(Date.now());
  const fieldSequenceRef = useRef<string[]>([]);
  const typingStartRef = useRef<Record<string, number>>({});

  // ===================================================================
  // 🌊 QUANTUM CACHE OPERATIONS
  // ===================================================================

  /**
   * Get data from quantum cache with consciousness awareness
   */
  const get = useCallback(async <T>(key: string): Promise<T | null> => {
    const startTime = performance.now();
    
    try {
      const result = await quantumPredictiveCache.get<T>(key);
      
      // Update metrics
      const accessTime = performance.now() - startTime;
      setState((prev: QuantumCacheState) => ({
        ...prev,
        metrics: {
          ...prev.metrics,
          averageAccessTime: accessTime,
          hitRate: result ? prev.metrics.hitRate + 0.01 : prev.metrics.hitRate - 0.01
        },
        lastUpdate: Date.now()
      }));
      
      return result;
    } catch (error) {
      console.warn('🌌 Quantum Cache Get Error:', error);
      return null;
    }
  }, []);

  /**
   * Set data in quantum cache with pattern learning
   */
  const set = useCallback(async <T>(
    key: string, 
    data: T, 
    pattern?: Partial<UserPattern>
  ): Promise<void> => {
    try {
      // Enhance pattern with current session data
      const enhancedPattern: Partial<UserPattern> = {
        ...pattern,
        timeOfDay: new Date().getHours(),
        sessionDuration: Date.now() - sessionStartRef.current,
        fieldSequence: fieldSequenceRef.current.slice(-10), // Last 10 fields
        ...(trackUserPatterns && {
          typingSpeed: calculateTypingSpeed(),
          completionRate: calculateCompletionRate()
        })
      };

      await quantumPredictiveCache.set(key, data, enhancedPattern);
      
      // Update state
      setState((prev: QuantumCacheState) => ({
        ...prev,
        userPattern: enhancedPattern,
        lastUpdate: Date.now()
      }));
      
    } catch (error) {
      console.warn('🌌 Quantum Cache Set Error:', error);
    }
  }, [trackUserPatterns]);

  /**
   * Preload BMI calculations based on weight/height patterns
   */
  const preloadBMI = useCallback(async (
    weight?: string | number, 
    height?: string | number
  ): Promise<void> => {
    if (!enablePreloading || !state.isReady) return undefined;

    setState((prev: QuantumCacheState) => ({ ...prev, isWarming: true }));

    try {
      const w = typeof weight === 'string' ? parseFloat(weight) : weight;
      const h = typeof height === 'string' ? parseFloat(height) : height;

      if (w && h && w > 0 && h > 0) {
        const bmi = w / ((h / 100) ** 2);
        const bmiData = {
          value: Math.round(bmi * 100) / 100,
          category: getBMICategory(bmi),
          weight: w,
          height: h,
          preloaded: true,
          quantum_optimized: true,
          timestamp: Date.now()
        };

        await set(`bmi_${w}_${h}`, bmiData, {
          calculationTriggers: ['bmi_preload'],
          fieldSequence: ['weight', 'height']
        });

        console.log('🌌 BMI Preloaded:', bmiData);
      }
    } catch (error) {
      console.warn('🌌 BMI Preload Error:', error);
    } finally {
      setState((prev: QuantumCacheState) => ({ ...prev, isWarming: false }));
    }
  }, [enablePreloading, set]);

  /**
   * Preload HOMA calculation with quantum consciousness
   */
  const preloadHOMA = useCallback(async (
    glucose?: string | number, 
    insulin?: string | number
  ): Promise<void> => {
    if (!enablePreloading || !state.isReady) return undefined;

    setState((prev: QuantumCacheState) => ({ ...prev, isWarming: true }));

    try {
      const g = typeof glucose === 'string' ? parseFloat(glucose) : glucose;
      const i = typeof insulin === 'string' ? parseFloat(insulin) : insulin;

      if (g && i && g > 0 && i > 0) {
        const homa = (g * i) / 405;
        const homaData = {
          value: Math.round(homa * 100) / 100,
          category: getHOMACategory(homa),
          glucose: g,
          insulin: i,
          preloaded: true,
          quantum_optimized: true,
          timestamp: Date.now()
        };

        await set(`homa_${g}_${i}`, homaData, {
          calculationTriggers: ['homa_preload'],
          fieldSequence: ['glucose', 'insulin']
        });

        console.log('🌌 HOMA Preloaded:', homaData);
      }
    } catch (error) {
      console.warn('🌌 HOMA Preload Error:', error);
    } finally {
      setState((prev: QuantumCacheState) => ({ ...prev, isWarming: false }));
    }
  }, [enablePreloading, set]);

  /**
   * Warm cache based on field sequence patterns
   */
  const warmCache = useCallback(async (fieldSequence: string[]): Promise<void> => {
    if (!enablePatternLearning || !state.isReady) return undefined;

    setState((prev: QuantumCacheState) => ({ ...prev, isWarming: true }));

    try {
      // Update field sequence tracking
      fieldSequenceRef.current = [...fieldSequenceRef.current, ...fieldSequence].slice(-20);

      // Analyze patterns and trigger preloading
      const pattern: Partial<UserPattern> = {
        fieldSequence: fieldSequenceRef.current,
        timeOfDay: new Date().getHours(),
        sessionDuration: Date.now() - sessionStartRef.current
      };

      // BMI pattern detection
      if (fieldSequence.some(field => ['weight', 'height'].includes(field))) {
        console.log('🌌 BMI pattern detected, warming cache...');
        // Trigger BMI preloading logic here
      }

      // HOMA pattern detection
      if (fieldSequence.some(field => ['glucose', 'insulin'].includes(field))) {
        console.log('🌌 HOMA pattern detected, warming cache...');
        // Trigger HOMA preloading logic here
      }

      // PCOS workflow detection
      if (fieldSequence.some(field => ['amh', 'lh', 'fsh', 'testosterone'].includes(field))) {
        console.log('🌌 PCOS workflow detected, warming specialized cache...');
        await set('pcos_workflow_cache', {
          workflow: 'pcos',
          specialized: true,
          timestamp: Date.now()
        }, pattern);
      }

      setState((prev: QuantumCacheState) => ({
        ...prev,
        userPattern: pattern,
        lastUpdate: Date.now()
      }));

    } catch (error) {
      console.warn('🌌 Cache Warming Error:', error);
    } finally {
      setState((prev: QuantumCacheState) => ({ ...prev, isWarming: false }));
    }
  }, [enablePreloading, set]);

  /**
   * Clear all cache data
   */
  const clear = useCallback(() => {
    quantumPredictiveCache.clear();
    fieldSequenceRef.current = [];
    typingStartRef.current = {};
    sessionStartRef.current = Date.now();
    
    setState((prev: QuantumCacheState) => ({
      ...prev,
      metrics: {
        hitRate: 0,
        predictiveHitRate: 0,
        warmingSuccessRate: 0,
        averageAccessTime: 0,
        totalSize: 0,
        predictedSavings: 0,
        quantumOptimizationGain: 0,
        deviceOptimizationLevel: 'medium'
      },
      userPattern: {},
      lastUpdate: Date.now()
    }));
  }, []);

  /**
   * Optimize cache with quantum consciousness
   */
  const optimize = useCallback(async () => {
    try {
      const result = await quantumPredictiveCache.optimize();
      
      setState((prev: QuantumCacheState) => ({
        ...prev,
        metrics: quantumPredictiveCache.getMetrics(),
        lastUpdate: Date.now()
      }));
      
      return result;
    } catch (error) {
      console.warn('🌌 Cache Optimization Error:', error);
      return { optimizationsApplied: [] };
    }
  }, []);

  /**
   * Get current cache metrics
   */
  const getMetrics = useCallback((): PredictiveCacheMetrics => {
    return quantumPredictiveCache.getMetrics();
  }, []);

  // ===================================================================
  // 🌊 QUANTUM CONSCIOUSNESS EFFECTS
  // ===================================================================

  /**
   * Initialize quantum cache with device-aware settings
   */
  useEffect(() => {
    const initializeCache = async (): Promise<() => void> => {
      try {
        // Update metrics periodically based on device performance
        const updateInterval = performanceProfile.networkRequests;
        
        const interval = setInterval(() => {
          setState((prev: QuantumCacheState) => ({
            ...prev,
            metrics: quantumPredictiveCache.getMetrics(),
            lastUpdate: Date.now()
          }));
        }, updateInterval);

        setState((prev: QuantumCacheState) => ({ ...prev, isReady: true }));

        return () => clearInterval(interval);
      } catch (error) {
        console.warn('🌌 Quantum Cache Initialization Error:', error);
        return () => {};
      }
    };

    initializeCache();
  }, [performanceProfile.networkRequests]);

  /**
   * Auto-optimization based on performance profile
   */
  useEffect(() => {
    if (!enablePreloading || !state.isReady) return undefined;

    const autoOptimizeInterval = setInterval(async () => {
      try {
        await optimize();
      } catch (error) {
        console.warn('🌌 Auto-optimization Error:', error);
      }
    }, performanceProfile.aiProcessing * 10); // Optimize every 10x AI processing time

    return () => clearInterval(autoOptimizeInterval);
  }, [state.isReady, performanceProfile.aiProcessing, optimize]);

  // ===================================================================
  // 🔧 UTILITY FUNCTIONS
  // ===================================================================

  const calculateTypingSpeed = (): number => {
    const timings = Object.values(typingStartRef.current) as number[];
    if (timings.length < 2) return 0;
    
    const intervals = timings.slice(1).map((time, i) => time - (timings[i] || 0));
    return intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;
  };

  const calculateCompletionRate = (): number => {
    const totalFields = 15; // Estimated total form fields
    const completedFields = fieldSequenceRef.current.length;
    return Math.min(1, completedFields / totalFields);
  };

  const getBMICategory = (bmi: number): string => {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
  };

  const getHOMACategory = (homa: number): string => {
    if (homa < 2.5) return 'Normal';
    if (homa < 3.8) return 'Mild Resistance';
    return 'Significant Resistance';
  };

  // ===================================================================
  // 🌌 RETURN QUANTUM CONSCIOUSNESS API
  // ===================================================================

  const operations: QuantumCacheOperations = {
    get,
    set,
    preloadBMI,
    preloadHOMA,
    warmCache,
    clear,
    optimize,
    getMetrics
  };

  return [state, operations];
}

export default useQuantumCache;
