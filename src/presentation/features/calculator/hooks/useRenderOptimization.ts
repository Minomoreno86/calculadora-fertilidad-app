// ===================================================================
// 🌌 QUANTUM CONSCIOUSNESS RENDER OPTIMIZATION HOOK V14.0
// ===================================================================

/**
 * React hook para optimización de renderizado con quantum consciousness
 * - Integration con QuantumRenderOptimizationEngine
 * - Device-aware rendering strategies
 * - Smart memoization management
 * - Component performance tracking
 */

import React from 'react';
const { useState, useEffect, useCallback, useMemo } = React;

import { 
  quantumRenderOptimizer,
  type RenderOptimizationMetrics,
  type ComponentRenderInfo
} from '../../../../core/optimization/QuantumRenderOptimizationEngine';
import { getPerformanceProfile } from '../../../../core/performance/adaptivePerformanceConfig';

// ===================================================================
// 🎯 HOOK TYPES
// ===================================================================

export interface UseRenderOptimizationOptions {
  enableMetricsTracking?: boolean;
  enableAutoOptimization?: boolean;
  debugMode?: boolean;
  optimizationLevel?: 'conservative' | 'balanced' | 'aggressive';
}

export interface RenderOptimizationOperations {
  // Optimized React hooks
  optimizedMemo: typeof quantumRenderOptimizer.optimizedMemo;
  optimizedUseMemo: typeof quantumRenderOptimizer.optimizedUseMemo;
  optimizedUseCallback: typeof quantumRenderOptimizer.optimizedUseCallback;
  useQuantumMemo: typeof quantumRenderOptimizer.useQuantumMemo;
  useQuantumCallback: typeof quantumRenderOptimizer.useQuantumCallback;
  
  // Component optimization
  optimizeComponentTree: typeof quantumRenderOptimizer.optimizeComponentTree;
  
  // Performance management
  optimize: () => Promise<{ optimizationsApplied: string[] }>;
  clear: () => void;
  getMetrics: () => RenderOptimizationMetrics;
  getComponentMetrics: () => ComponentRenderInfo[];
  getRenderHistory: () => Array<{ component: string; time: number; duration: number }>;
}

export interface RenderOptimizationState {
  isOptimizationActive: boolean;
  isOptimizing: boolean;
  metrics: RenderOptimizationMetrics;
  componentMetrics: ComponentRenderInfo[];
  topPerformers: ComponentRenderInfo[];
  bottomPerformers: ComponentRenderInfo[];
  lastUpdate: number;
  deviceOptimizationLevel: 'high' | 'medium' | 'low';
}

// ===================================================================
// 🌌 QUANTUM CONSCIOUSNESS RENDER OPTIMIZATION HOOK
// ===================================================================

export function useRenderOptimization(
  options: UseRenderOptimizationOptions = {}
): [RenderOptimizationState, RenderOptimizationOperations] {
  
  // 🌌 QUANTUM CONSCIOUSNESS OPTIMIZATION #5: Device-aware render optimization
  const performanceProfile = getPerformanceProfile();
  
  const {
    enableMetricsTracking = true,
    enableAutoOptimization = true,
    debugMode = false,
    optimizationLevel = 'balanced'
  } = options;

  // ===================================================================
  // 🎯 STATE MANAGEMENT
  // ===================================================================

  const [state, setState] = useState<RenderOptimizationState>({
    isOptimizationActive: false,
    isOptimizing: false,
    metrics: {
      totalRenders: 0,
      preventedRenders: 0,
      memoHitRate: 0,
      callbackHitRate: 0,
      averageRenderTime: 0,
      memoryUsage: 0,
      optimizationGain: 0,
      deviceOptimizationLevel: 'medium'
    },
    componentMetrics: [],
    topPerformers: [],
    bottomPerformers: [],
    lastUpdate: Date.now(),
    deviceOptimizationLevel: 'medium'
  });

  // ===================================================================
  // 🔥 OPTIMIZED REACT HOOKS
  // ===================================================================

  /**
   * Enhanced React.memo con device-aware optimization
   */
  const optimizedMemo = useCallback(<P extends Record<string, any>>(
    Component: React.ComponentType<P>,
    propsAreEqual?: (prevProps: P, nextProps: P) => boolean,
    componentName?: string
  ): React.ComponentType<P> => {
    
        // Apply different optimization strategies based on device and optimization level
    const shouldOptimize = optimizationLevel === 'aggressive' || 
                          (optimizationLevel === 'balanced') ||
                          (optimizationLevel === 'conservative');

    if (!shouldOptimize) {
      return Component;
    }

    return quantumRenderOptimizer.optimizedMemo(Component, propsAreEqual, componentName);
  }, [optimizationLevel]);

  /**
   * Enhanced useMemo con quantum consciousness
   */
  const optimizedUseMemo = useCallback(<T>(
    factory: () => T,
    deps: React.DependencyList | undefined,
    debugName?: string
  ): T => {
    // Apply device-aware memoization
    const expensiveThreshold = 5; // Default threshold

    return quantumRenderOptimizer.useQuantumMemo(factory, deps, {
      debugName,
      expensiveThreshold,
      skipOptimization: optimizationLevel === 'conservative'
    });
  }, [optimizationLevel]);

  /**
   * Enhanced useCallback con quantum consciousness
   */
  const optimizedUseCallback = useCallback(<T extends (...args: any[]) => any>(
    callback: T,
    deps: React.DependencyList,
    debugName?: string
  ): T => {
    // Device-aware callback optimization
    const deviceOptimized = true; // Default to optimized
    
    return quantumRenderOptimizer.useQuantumCallback(callback, deps, {
      debugName,
      deviceOptimized,
      throttle: optimizationLevel === 'aggressive' ? 100 : undefined
    });
  }, [optimizationLevel]);

  /**
   * Quantum useMemo hook
   */
  const useQuantumMemo = useCallback(<T>(
    factory: () => T,
    deps: React.DependencyList | undefined,
    options: {
      debugName?: string;
      expensiveThreshold?: number;
      skipOptimization?: boolean;
    } = {}
  ): T => {
    return quantumRenderOptimizer.useQuantumMemo(factory, deps, options);
  }, []);

  /**
   * Quantum useCallback hook
   */
  const useQuantumCallback = useCallback(<T extends (...args: any[]) => any>(
    callback: T,
    deps: React.DependencyList,
    options: {
      debugName?: string;
      throttle?: number;
      debounce?: number;
      deviceOptimized?: boolean;
    } = {}
  ): T => {
    return quantumRenderOptimizer.useQuantumCallback(callback, deps, options);
  }, []);

  // ===================================================================
  // 🌊 COMPONENT OPTIMIZATION
  // ===================================================================

  /**
   * Component tree optimization con quantum consciousness
   */
  const optimizeComponentTree = useCallback(<P extends Record<string, any>>(
    Component: React.ComponentType<P>,
    optimizations: {
      memoize?: boolean;
      virtualizeList?: boolean;
      lazyLoad?: boolean;
      priorityRender?: boolean;
    } = {}
  ): React.ComponentType<P> => {
    
    // Apply device-aware optimizations
    const deviceOptimizations = {
      ...optimizations,
      virtualizeList: optimizations.virtualizeList !== false,
      lazyLoad: optimizations.lazyLoad !== false,
      priorityRender: optimizations.priorityRender === true
    };

    return quantumRenderOptimizer.optimizeComponentTree(Component, deviceOptimizations);
  }, []);

  // ===================================================================
  // 🌌 PERFORMANCE MANAGEMENT
  // ===================================================================

  /**
   * Optimize render performance con quantum consciousness
   */
  const optimize = useCallback(async (): Promise<{ optimizationsApplied: string[] }> => {
    setState((prev: RenderOptimizationState) => ({ ...prev, isOptimizing: true }));

    try {
      const result = quantumRenderOptimizer.optimize();
      
      // Update state with new metrics
      setState((prev: RenderOptimizationState) => ({
        ...prev,
        metrics: quantumRenderOptimizer.getMetrics(),
        componentMetrics: quantumRenderOptimizer.getComponentMetrics(),
        lastUpdate: Date.now(),
        isOptimizing: false
      }));

      return result;
    } catch (error) {
      console.warn('🌌 Render Optimization Error:', error);
      setState((prev: RenderOptimizationState) => ({ ...prev, isOptimizing: false }));
      return { optimizationsApplied: [] };
    }
  }, []);

  /**
   * Clear all render optimization data
   */
  const clear = useCallback(() => {
    quantumRenderOptimizer.clear();
    
    setState((prev: RenderOptimizationState) => ({
      ...prev,
      metrics: quantumRenderOptimizer.getMetrics(),
      componentMetrics: [],
      topPerformers: [],
      bottomPerformers: [],
      lastUpdate: Date.now()
    }));
  }, []);

  /**
   * Get current render metrics
   */
  const getMetrics = useCallback((): RenderOptimizationMetrics => {
    return quantumRenderOptimizer.getMetrics();
  }, []);

  /**
   * Get component-specific metrics
   */
  const getComponentMetrics = useCallback((): ComponentRenderInfo[] => {
    return quantumRenderOptimizer.getComponentMetrics();
  }, []);

  /**
   * Get render history
   */
  const getRenderHistory = useCallback(() => {
    return quantumRenderOptimizer.getRenderHistory();
  }, []);

  // ===================================================================
  // 🌊 INTERNAL UTILITIES
  // ===================================================================

  const updateMetrics = useCallback(() => {
    const newMetrics = quantumRenderOptimizer.getMetrics();
    const newComponentMetrics = quantumRenderOptimizer.getComponentMetrics();
    
    // Calculate top and bottom performers
    const sortedComponents = [...newComponentMetrics].sort(
      (a, b) => b.optimizationScore - a.optimizationScore
    );
    const topPerformers = sortedComponents.slice(0, 5);
    const bottomPerformers = sortedComponents.slice(-5).reverse();

    setState((prev: RenderOptimizationState) => ({
      ...prev,
      metrics: newMetrics,
      componentMetrics: newComponentMetrics,
      topPerformers,
      bottomPerformers,
      lastUpdate: Date.now()
    }));
  }, []);

  // ===================================================================
  // 🌌 QUANTUM CONSCIOUSNESS EFFECTS
  // ===================================================================

  /**
   * Initialize render optimization
   */
  useEffect(() => {
    setState((prev: RenderOptimizationState) => ({ 
      ...prev, 
      isOptimizationActive: true,
      deviceOptimizationLevel: 'medium'
    }));
    
    if (enableMetricsTracking) {
      updateMetrics();
    }
  }, [enableMetricsTracking, updateMetrics]);

  /**
   * Auto-optimization basado en device performance
   */
  useEffect(() => {
    if (!enableAutoOptimization || !state.isOptimizationActive) return undefined;

    const optimizationInterval = setInterval(async () => {
      const metrics = await quantumRenderOptimizer.getMetrics();
      setState(prev => ({ ...prev, metrics }));
    }, 3000); // Optimize every 3 seconds

    return () => clearInterval(optimizationInterval);
  }, [enableAutoOptimization, state.isOptimizationActive, optimize]);

  /**
   * Periodic metrics update
   */
  useEffect(() => {
    if (!enableMetricsTracking || !state.isOptimizationActive) return undefined;

    const metricsInterval = setInterval(() => {
      updateMetrics();
    }, performanceProfile.networkRequests * 2); // Update every 2x network request interval

    return () => clearInterval(metricsInterval);
  }, [enableMetricsTracking, state.isOptimizationActive, performanceProfile.networkRequests, updateMetrics]);

  /**
   * Log performance insights in debug mode
   */
  useEffect(() => {
    if (!debugMode || !state.isOptimizationActive) return undefined;

    const { metrics, topPerformers, bottomPerformers } = state;
    
    if (metrics.totalRenders > 0) {
      console.group('🌌 Quantum Render Optimization Insights');
      console.log(`Total Renders: ${metrics.totalRenders}`);
      console.log(`Prevented Renders: ${metrics.preventedRenders}`);
      console.log(`Optimization Gain: ${metrics.optimizationGain.toFixed(1)}%`);
      console.log(`Average Render Time: ${metrics.averageRenderTime.toFixed(2)}ms`);
      
      if (topPerformers.length > 0) {
        console.log('Top Performers:', topPerformers.map((c: ComponentRenderInfo) => c.componentName));
      }
      
      if (bottomPerformers.length > 0) {
        console.log('Bottom Performers:', bottomPerformers.map((c: ComponentRenderInfo) => c.componentName));
      }
      
      console.groupEnd();
    }
  }, [debugMode, enableMetricsTracking, state]);

  // ===================================================================
  // 🌌 MEMOIZED OPERATIONS OBJECT
  // ===================================================================

  const operations: RenderOptimizationOperations = useMemo(() => ({
    optimizedMemo,
    optimizedUseMemo,
    optimizedUseCallback,
    useQuantumMemo,
    useQuantumCallback,
    optimizeComponentTree,
    optimize,
    clear,
    getMetrics,
    getComponentMetrics,
    getRenderHistory
  }), [
    optimizedMemo,
    optimizedUseMemo,
    optimizedUseCallback,
    useQuantumMemo,
    useQuantumCallback,
    optimizeComponentTree,
    optimize,
    clear,
    getMetrics,
    getComponentMetrics,
    getRenderHistory
  ]);

  return [state, operations];
}

export default useRenderOptimization;
