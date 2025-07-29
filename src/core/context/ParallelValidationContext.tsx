/**
 * 🚀 CONTEXTO GLOBAL PARA MOTOR PARALELO FASE 2
 * 
 * Contexto React que conecta el motor paralelo con todos los componentes
 * que necesitan acceso a sus métricas y estado en tiempo real.
 */

import React from 'react';
import type { ValidationMetrics } from '@/core/workers/parallelValidationEngine_FASE2';

// 🚀 MÉTRICAS EXTENDIDAS DEL MOTOR PARALELO
interface ExtendedParallelMetrics extends ValidationMetrics {
  isActive: boolean;
  lastUpdate: number;
  performanceReport?: {
    parallelizationGain: number;
    categoryBreakdown: Map<string, number>;
    cacheEfficiency: number;
    totalProcessingTime: number;
  };
  categoriesProcessed: string[];
  resultsCount: number;
}

// 🚀 INTERFAZ DEL CONTEXTO
interface ParallelValidationContextType {
  metrics: ExtendedParallelMetrics | null;
  updateMetrics: (newMetrics: ExtendedParallelMetrics) => void;
  isEngineActive: boolean;
  markEngineActive: () => void;
  markEngineInactive: () => void;
}

// 🚀 VALORES POR DEFECTO
const defaultContext: ParallelValidationContextType = {
  metrics: null,
  updateMetrics: () => {},
  isEngineActive: false,
  markEngineActive: () => {},
  markEngineInactive: () => {}
};

// 🚀 CREAR CONTEXTO
const ParallelValidationContext = React.createContext<ParallelValidationContextType>(defaultContext);

// 🚀 PROVIDER DEL CONTEXTO
export const ParallelValidationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [metrics, setMetrics] = React.useState<ExtendedParallelMetrics | null>(null);
  const [isEngineActive, setIsEngineActive] = React.useState(false);

  const updateMetrics = React.useCallback((newMetrics: ExtendedParallelMetrics) => {
    setMetrics({
      ...newMetrics,
      lastUpdate: Date.now(),
      isActive: true
    });
    setIsEngineActive(true);
  }, []);

  const markEngineActive = React.useCallback(() => {
    setIsEngineActive(true);
  }, []);

  const markEngineInactive = React.useCallback(() => {
    setIsEngineActive(false);
  }, []);

  // 🧠 NEURAL OPTIMIZATION: Memoizar value object para prevenir re-renders
  const contextValue = React.useMemo(() => ({
    metrics,
    updateMetrics,
    isEngineActive,
    markEngineActive,
    markEngineInactive
  }), [metrics, updateMetrics, isEngineActive, markEngineActive, markEngineInactive]);

  return (
    <ParallelValidationContext.Provider value={contextValue}>
      {children}
    </ParallelValidationContext.Provider>
  );
};

// 🚀 HOOK PARA USAR EL CONTEXTO
export const useParallelValidationContext = (): ParallelValidationContextType => {
  const context = React.useContext(ParallelValidationContext);
  
  if (!context) {
    throw new Error('useParallelValidationContext debe usarse dentro de ParallelValidationProvider');
  }
  
  return context;
};

export default ParallelValidationContext;
