/**
 * 🚀 PRODUCTION PROFILER INTEGRATION - VERSIÓN SIMPLIFICADA
 * 
 * Archivo de integración simplificado para conectar el ProductionProfiler
 * con los componentes principales de la aplicación.
 */

import React from 'react';
import { productionProfiler } from '../monitoring/ProductionProfiler';

// 📊 TIPOS BÁSICOS PARA INTEGRACIÓN
interface BasicUserInput {
  [key: string]: any;
}

interface BasicProbabilityResult {
  probability: number;
  engineMetrics?: {
    engineUsed: 'standard' | 'premium';
    executionTime: number;
    complexity: number;
  };
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  cacheStats?: {
    hitRate: number;
  };
}

/**
 * 🎯 WRAPPER BÁSICO PARA CÁLCULOS CON PROFILING
 */
export const calculateWithProfiling = async (
  input: BasicUserInput,
  calculationFunction: (input: BasicUserInput) => Promise<BasicProbabilityResult>,
  mode: 'standard' | 'premium' | 'auto' = 'auto'
): Promise<BasicProbabilityResult> => {
  const startTime = performance.now();
  
  try {
    const result = await calculationFunction(input);
    const executionTime = performance.now() - startTime;
    
    // Calcular complejidad básica
    const complexityScore = calculateBasicComplexity(input);
    
    // Registrar métricas en el profiler
    productionProfiler.recordUnifiedEngineMetric({
      mode,
      executionTime,
      complexityScore,
      engineUsed: result.engineMetrics?.engineUsed || 'standard'
    });
    
    return result;
    
  } catch (error) {
    console.error('Error en calculateWithProfiling:', error);
    throw error;
  }
};

/**
 * 🧠 WRAPPER PARA IA PREDICTIVA CON PROFILING
 */
export const executePredictiveWithProfiling = async (
  input: BasicUserInput,
  predictionFunction: (input: BasicUserInput) => Promise<{
    prediction: number;
    confidence: number;
    accuracy?: number;
  }>
): Promise<any> => {
  const startTime = performance.now();
  
  try {
    const result = await predictionFunction(input);
    const executionTime = performance.now() - startTime;
    
    productionProfiler.recordPredictiveAIMetric({
      predictionTime: executionTime,
      engineUsed: 'standard', // Se podría determinar dinámicamente
      confidence: result.confidence,
      accuracy: result.accuracy
    });
    
    return result;
    
  } catch (error) {
    console.error('Error en executePredictiveWithProfiling:', error);
    throw error;
  }
};

/**
 * ⚡ WRAPPER PARA VALIDACIÓN CON PROFILING
 */
export const executeValidationWithProfiling = async (
  input: BasicUserInput,
  validationFunction: (input: BasicUserInput) => Promise<ValidationResult>,
  categories: string[] = ['basic']
): Promise<ValidationResult> => {
  const startTime = performance.now();
  
  try {
    const result = await validationFunction(input);
    const executionTime = performance.now() - startTime;
    
    // Simular métricas de paralelización
    const parallelizationGain = Math.min(categories.length * 10, 80); // Ganancia estimada
    const cacheHitRate = result.cacheStats?.hitRate || 0.5;
    
    productionProfiler.recordParallelValidationMetric({
      parallelizationGain,
      cacheHitRate,
      categoriesProcessed: categories
    });
    
    return result;
    
  } catch (error) {
    console.error('Error en executeValidationWithProfiling:', error);
    throw error;
  }
};

/**
 * 🎯 WRAPPER PARA SIMULACIONES CON PROFILING
 */
export const executeSimulationWithProfiling = async (
  factor: string,
  simulationFunction: () => Promise<any>
): Promise<any> => {
  const startTime = performance.now();
  
  try {
    const result = await simulationFunction();
    const executionTime = performance.now() - startTime;
    
    productionProfiler.recordSimulatorMetric({
      simulationTime: executionTime,
      factor,
      engineSelected: 'basic',
      wasOptimal: true // Se podría calcular dinámicamente
    });
    
    return result;
    
  } catch (error) {
    console.error('Error en executeSimulationWithProfiling:', error);
    throw error;
  }
};

/**
 * 📊 HOOK PARA OBTENER MÉTRICAS EN COMPONENTES REACT
 */
export const useProductionMetrics = () => {
  const [metrics, setMetrics] = React.useState(productionProfiler.getMetrics());
  const [alerts, setAlerts] = React.useState(productionProfiler.getActiveAlerts());
  const [suggestions, setSuggestions] = React.useState(productionProfiler.getOptimizationSuggestions());
  
  React.useEffect(() => {
    const updateMetrics = () => {
      setMetrics(productionProfiler.getMetrics());
      setAlerts(productionProfiler.getActiveAlerts());
      setSuggestions(productionProfiler.getOptimizationSuggestions());
    };
    
    // Actualizar cada 30 segundos
    const interval = setInterval(updateMetrics, 30000);
    
    // Escuchar eventos del profiler si están disponibles
    const handleUpdate = () => updateMetrics();
    
    if (typeof window !== 'undefined') {
      window.addEventListener('profiler:metrics-updated', handleUpdate);
    }
    
    return () => {
      clearInterval(interval);
      if (typeof window !== 'undefined') {
        window.removeEventListener('profiler:metrics-updated', handleUpdate);
      }
    };
  }, []);
  
  return {
    metrics,
    alerts,
    suggestions,
    profiler: productionProfiler
  };
};

/**
 * 🔧 CÁLCULO BÁSICO DE COMPLEJIDAD
 */
const calculateBasicComplexity = (input: BasicUserInput): number => {
  let complexity = 0;
  
  // Contar propiedades definidas
  const definedProps = Object.values(input).filter(value => 
    value !== null && value !== undefined && value !== ''
  ).length;
  
  complexity += definedProps * 0.1;
  
  // Agregar complejidad por tipos especiales
  for (const [key, value] of Object.entries(input)) {
    if (Array.isArray(value)) {
      complexity += value.length * 0.05;
    } else if (typeof value === 'object' && value !== null) {
      complexity += Object.keys(value).length * 0.03;
    } else if (typeof value === 'number' && value > 100) {
      complexity += 0.02;
    }
  }
  
  return Math.min(complexity, 1.0); // Máximo 1.0
};

/**
 * 🔧 CONFIGURACIÓN DE SAMPLING PARA DIFERENTES ENTORNOS
 */
export const configureProfilingForEnvironment = () => {
  const env = process.env.NODE_ENV || 'development';
  
  switch (env) {
    case 'production':
      productionProfiler.setSamplingRate(0.1); // 10% en producción
      break;
    case 'development':
      productionProfiler.setSamplingRate(1.0); // 100% en desarrollo
      break;
    case 'test':
      productionProfiler.setSamplingRate(0.0); // 0% en tests
      break;
    default:
      productionProfiler.setSamplingRate(0.5); // 50% por defecto
  }
};

/**
 * 🚀 INICIALIZAR PROFILING AL ARRANQUE DE LA APP
 */
export const initializeProductionProfiling = () => {
  configureProfilingForEnvironment();
  
  // Registrar listeners globales para errores no capturados
  if (typeof window !== 'undefined') {
    window.addEventListener('error', (event) => {
      console.error('Error global capturado por profiler:', event.error);
    });
    
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Promise rechazada capturada por profiler:', event.reason);
    });
  }
  
  console.log('🚀 Production Profiling inicializado correctamente');
};

// Exportar profiler para uso directo
export { productionProfiler };

// Auto-inicializar si estamos en un entorno de navegador
if (typeof window !== 'undefined') {
  initializeProductionProfiling();
}
