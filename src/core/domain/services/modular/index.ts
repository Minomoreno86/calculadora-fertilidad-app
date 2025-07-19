/**
 * 🎯 MODULAR SYSTEM INDEX
 * 
 * Punto de entrada centralizado para el sistema modular de cálculo de fertilidad.
 * Facilita la importación y uso de todos los módulos del sistema refactorizado.
 */

// ===================================================================
// 🎯 EXPORTS PRINCIPALES
// ===================================================================

// Engine principal (API unificada)
export { ModularFertilityEngine } from './ModularEngine';

// Módulo de cálculo central
export { CalculationCore } from './CalculationCore';

// Cache unificado
export { UnifiedCacheManager } from './CacheManager';

// Monitor de rendimiento
export { PerformanceMonitor } from './PerformanceMonitor';

// Selector inteligente
export { IntelligentEngineSelector } from './EngineSelector';

// Orquestador
export { CalculationOrchestrator } from './CalculationOrchestrator';

// ===================================================================
// 🎯 CONSTANTES DEL SISTEMA
// ===================================================================

export const MODULAR_SYSTEM_VERSION = '1.0.0';
export const SUPPORTED_FEATURES = [
  'adaptive_caching',
  'performance_monitoring',
  'intelligent_selection',
  'automatic_recovery',
  'batch_processing',
  'predictive_loading'
] as const;

/**
 * ⚙️ Configuración por defecto del sistema
 */
export const DEFAULT_MODULAR_CONFIG = {
  cacheSize: 1000,
  performanceThreshold: 1000,
  enableAdaptiveLearning: true,
  enableCompression: true,
  maxConcurrentCalculations: 5
} as const;
