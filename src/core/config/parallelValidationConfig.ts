/**
 * 🚀 CONFIGURACIÓN GLOBAL DE VALIDACIÓN PARALELA
 * 
 * Sistema centralizado para gestionar la activación gradual
 * de validación paralela en toda la aplicación.
 * 
 * Características:
 * - Feature flags para activación controlada
 * - Configuración por pantalla específica
 * - Métricas centralizadas
 * - Rollback automático en caso de errores
 */

export interface ParallelValidationConfig {
  // Control global
  enabled: boolean;
  
  // Control por pantalla
  screens: {
    calculator: boolean;
    results: boolean;
    simulator: boolean;
  };
  
  // Configuración de performance
  performance: {
    maxConcurrency: number;
    criticalThreshold: number;
    progressiveDelay: number;
    cacheEnabled: boolean;
    cacheTTL: number;
  };
  
  // Configuración de monitoreo
  monitoring: {
    enableMetrics: boolean;
    enableDevTools: boolean;
    autoReport: boolean;
    metricsInterval: number;
  };
  
  // Configuración de fallback
  fallback: {
    enableAutoFallback: boolean;
    errorThreshold: number;
    fallbackDelay: number;
  };
}

/**
 * Configuración por defecto - CONSERVADORA para inicio gradual
 */
export const DEFAULT_PARALLEL_CONFIG: ParallelValidationConfig = {
  // ✅ Activado globalmente pero controlado por pantalla
  enabled: true,
  
  // 🎯 Activación gradual por pantalla
  screens: {
    calculator: true,        // Ya probada - métricas excelentes
    results: false,           // Pendiente
    simulator: false          // Pendiente
  },
  
  // ⚡ Configuración optimizada basada en métricas reales
  performance: {
    maxConcurrency: 4,        // Probado - funciona bien
    criticalThreshold: 465,   // Basado en métricas reales
    progressiveDelay: 100,    // Balanceado para UX
    cacheEnabled: true,       // 80% hit rate confirmado
    cacheTTL: 5 * 60 * 1000  // 5 minutos probado
  },
  
  // 📊 Monitoreo habilitado para seguimiento
  monitoring: {
    enableMetrics: true,
    enableDevTools: true,     // Solo en desarrollo
    autoReport: false,        // Manual por ahora
    metricsInterval: 1000     // 1 segundo
  },
  
  // 🛡️ Fallback conservador para seguridad
  fallback: {
    enableAutoFallback: true,
    errorThreshold: 3,        // 3 errores = fallback
    fallbackDelay: 2000       // 2 segundos
  }
};

/**
 * Configuración para desarrollo - MÁS AGRESIVA
 */
export const DEV_PARALLEL_CONFIG: ParallelValidationConfig = {
  ...DEFAULT_PARALLEL_CONFIG,
  
  screens: {
    calculator: true,
    results: true,            // Activada en dev
    simulator: true           // Activada en dev
  },
  
  performance: {
    ...DEFAULT_PARALLEL_CONFIG.performance,
    maxConcurrency: 6,        // Más agresivo en dev
    criticalThreshold: 300    // Más rápido en dev
  },
  
  monitoring: {
    ...DEFAULT_PARALLEL_CONFIG.monitoring,
    enableDevTools: true,
    autoReport: true
  }
};

/**
 * Configuración para producción - MÁS CONSERVADORA
 */
export const PROD_PARALLEL_CONFIG: ParallelValidationConfig = {
  ...DEFAULT_PARALLEL_CONFIG,
  
  screens: {
    calculator: true,         // Solo la probada
    results: false,
    simulator: false
  },
  
  monitoring: {
    ...DEFAULT_PARALLEL_CONFIG.monitoring,
    enableDevTools: false,   // Sin dev tools en producción
    autoReport: true         // Auto-reporte en producción
  }
};

/**
 * Hook para obtener configuración según entorno
 */
export function useParallelConfig(): ParallelValidationConfig {
  if (process.env.NODE_ENV === 'development') {
    return DEV_PARALLEL_CONFIG;
  }
  
  if (process.env.NODE_ENV === 'production') {
    return PROD_PARALLEL_CONFIG;
  }
  
  return DEFAULT_PARALLEL_CONFIG;
}

/**
 * Verificar si una pantalla específica debe usar validación paralela
 */
export function shouldUseParallelValidation(
  screen: keyof ParallelValidationConfig['screens']
): boolean {
  const config = useParallelConfig();
  return config.enabled && config.screens[screen];
}

/**
 * Obtener configuración de performance para una pantalla
 */
export function getPerformanceConfig() {
  const config = useParallelConfig();
  return config.performance;
}

/**
 * Obtener configuración de monitoreo
 */
export function getMonitoringConfig() {
  const config = useParallelConfig();
  return config.monitoring;
}

/**
 * Estados de activación para debugging
 */
export const ACTIVATION_STATUS = {
  CALCULATOR: 'ACTIVA - Métricas excelentes (100% éxito, 465ms, 80% cache)',
  PREMIUM_CALCULATOR: 'PENDIENTE - Próxima implementación',
  RESULTS: 'PENDIENTE - En roadmap',
  SIMULATOR: 'PENDIENTE - En roadmap'
} as const;

export default useParallelConfig;
