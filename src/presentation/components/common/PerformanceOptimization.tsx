/**
 * 🚀 FASE 2A: SISTEMA DE MEMOIZATION INTELIGENTE
 * 
 * Optimización de re-renders con React.memo estratégico
 * y hooks de performance optimizados (VERSIÓN ESTABILIZADA)
 */

import React, { memo, useMemo, useCallback, useRef, useEffect, useState } from 'react';

// 🚀 FASE 2A: Declaración de __DEV__ para React Native
declare const __DEV__: boolean;

// 🎯 Tipos para optimización estabilizada
interface MemoConfig {
  enabled: boolean;
  deepCompare?: boolean;
  skipFields?: string[];
  debugMode?: boolean;
}

// 🧠 Comparador inteligente para React.memo (ESTABILIZADO)
const createIntelligentComparator = (config: MemoConfig = { enabled: true }) => {
  return (prevProps: Record<string, unknown>, nextProps: Record<string, unknown>): boolean => {
    if (!config.enabled) return false;

    // Comparación rápida por referencia
    if (prevProps === nextProps) {
      return true;
    }

    // Comparación de llaves
    const prevKeys = Object.keys(prevProps);
    const nextKeys = Object.keys(nextProps);

    if (prevKeys.length !== nextKeys.length) {
      return false;
    }

    // Comparación de valores
    for (const key of prevKeys) {
      if (config.skipFields?.includes(key)) {
        continue;
      }
      
      if (prevProps[key] !== nextProps[key]) {
        return false;
      }
    }

    return true;
  };
};

// 🎭 HOC para optimización automática
export const withPerformanceOptimization = <P extends Record<string, unknown>>(
  Component: React.ComponentType<P>,
  config: MemoConfig = { enabled: true }
) => {
  const OptimizedComponent = memo(Component, createIntelligentComparator(config));
  OptimizedComponent.displayName = `Optimized(${Component.displayName || Component.name})`;
  return OptimizedComponent;
};

// 🎯 Hook para callbacks optimizados (SIMPLIFICADO Y ESTABLE)
export const useOptimizedCallback = <T extends (...args: unknown[]) => unknown>(
  callback: T,
  deps: React.DependencyList
): T => {
  const callbackRef = useRef<T>(callback);
  const depsRef = useRef<React.DependencyList>(deps);
  
  // Solo actualizar si deps realmente cambiaron
  const depsChanged = useMemo(() => {
    if (depsRef.current.length !== deps.length) return true;
    return deps.some((dep, index) => dep !== depsRef.current[index]);
  }, [deps]);
  
  if (depsChanged) {
    callbackRef.current = callback;
    depsRef.current = deps;
  }
  
  return useCallback((...args: unknown[]) => {
    return callbackRef.current(...args);
  }, []) as T;
};

// 🎯 Hook para valores optimizados con cache
export const useOptimizedValue = <T,>(
  factory: () => T,
  deps: React.DependencyList,
  enabled = true
): T => {
  const cacheRef = useRef(new Map<string, T>());
  const depsKey = JSON.stringify(deps);
  
  return useMemo(() => {
    if (!enabled) {
      return factory();
    }

    const cached = cacheRef.current.get(depsKey);
    
    if (cached !== undefined) {
      return cached;
    }

    const value = factory();
    cacheRef.current.set(depsKey, value);
    return value;
  }, [enabled, depsKey, factory]);
};

// 🎯 Hook para detectar re-renders excesivos
export const useRenderOptimization = (componentName: string, threshold = 15) => {
  const renderCount = useRef(0);
  const lastAlert = useRef(0);
  
  renderCount.current += 1;
  
  useEffect(() => {
    if (__DEV__ && renderCount.current > threshold) {
      const now = Date.now();
      if (now - lastAlert.current > 10000) {
        console.warn(`🚨 ${componentName}: ${renderCount.current} renders`);
        lastAlert.current = now;
      }
    }
  });

  const resetCounter = useCallback(() => {
    renderCount.current = 0;
  }, []);

  return { renderCount: renderCount.current, resetCounter };
};

// 🎯 Hook especializado para campos de formulario
export const useOptimizedFormField = <T,>(
  value: T,
  onChange: (value: T) => void,
  validation?: (value: T) => boolean
) => {
  const optimizedOnChange = useCallback((newValue: T) => onChange(newValue), [onChange]);
  
  const isValid = useOptimizedValue(
    () => validation ? validation(value) : true,
    [value, validation]
  );

  return {
    value,
    onChange: optimizedOnChange,
    isValid
  };
};

// 🎯 Provider para configuración global
interface OptimizationContextType {
  config: MemoConfig;
  updateConfig: (config: Partial<MemoConfig>) => void;
}

const OptimizationContext = React.createContext<OptimizationContextType | null>(null);

export const OptimizationProvider: React.FC<{ 
  children: React.ReactNode;
  initialConfig?: MemoConfig;
}> = ({ children, initialConfig = { enabled: true } }) => {
  const [config, setConfig] = useState<MemoConfig>(initialConfig);

  const updateConfig = useCallback((newConfig: Partial<MemoConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  }, []);

  const contextValue = useMemo(() => ({
    config,
    updateConfig
  }), [config, updateConfig]);

  return (
    <OptimizationContext.Provider value={contextValue}>
      {children}
    </OptimizationContext.Provider>
  );
};

export const useOptimizationContext = () => {
  const context = React.useContext(OptimizationContext);
  if (!context) {
    throw new Error('useOptimizationContext must be used within OptimizationProvider');
  }
  return context;
};

// Exportaciones principales
export default {
  withPerformanceOptimization,
  useOptimizedCallback,
  useOptimizedValue,
  useRenderOptimization,
  useOptimizedFormField,
  OptimizationProvider,
  useOptimizationContext
};