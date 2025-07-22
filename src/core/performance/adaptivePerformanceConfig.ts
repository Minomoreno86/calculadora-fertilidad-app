// ===================================================================
// 🚀 PERFORMANCE ADAPTIVE CONFIG - Configuración adaptativa de performance
// ===================================================================

/**
 * Configuración adaptativa de throttling y debouncing basada en:
 * - Ambiente de ejecución (development/production)
 * - Performance del dispositivo (high/medium/low)
 * - Contexto de uso (typing/idle/validating)
 */

export interface PerformanceProfile {
  stableWatchedFields: number;
  validation: number;
  calculations: number;
  aiProcessing: number;
  networkRequests: number;
}

export const PERFORMANCE_PROFILES: Record<string, PerformanceProfile> = {
  // 🚀 Dispositivos de alta performance
  high_production: {
    stableWatchedFields: 50,   // Muy responsivo
    validation: 200,           // Validación rápida
    calculations: 25,          // Cálculos casi instantáneos
    aiProcessing: 300,         // AI rápido pero estable
    networkRequests: 100,      // Requests ágiles
  },
  
  high_development: {
    stableWatchedFields: 100,  // Responsivo pero observable
    validation: 400,           // Tiempo para debug
    calculations: 50,          // Cálculos observables
    aiProcessing: 600,         // AI con tiempo de debug
    networkRequests: 200,      // Requests debuggeables
  },

  // 📱 Dispositivos de performance media
  medium_production: {
    stableWatchedFields: 100,  // Balanceado
    validation: 400,           // Validación estable
    calculations: 75,          // Cálculos balanceados
    aiProcessing: 600,         // AI estable
    networkRequests: 200,      // Requests estables
  },
  
  medium_development: {
    stableWatchedFields: 200,  // Debug friendly
    validation: 800,           // Más tiempo debug
    calculations: 150,         // Cálculos debuggeables
    aiProcessing: 1000,        // AI con debug amplio
    networkRequests: 400,      // Requests con debug
  },

  // 🐌 Dispositivos de baja performance
  low_production: {
    stableWatchedFields: 300,  // Más espaciado
    validation: 1000,          // Validación espaciada
    calculations: 200,         // Cálculos más lentos
    aiProcessing: 2000,        // AI más espaciado
    networkRequests: 500,      // Requests más espaciados
  },
  
  low_development: {
    stableWatchedFields: 500,  // Muy espaciado para debug
    validation: 1500,          // Debug extenso
    calculations: 400,         // Cálculos muy debuggeables
    aiProcessing: 3000,        // AI con debug completo
    networkRequests: 1000,     // Requests con debug completo
  }
};

/**
 * Detecta la performance del dispositivo mediante benchmark simple
 */
export function detectDevicePerformance(): 'high' | 'medium' | 'low' {
  const startTime = performance.now();
  
  // Benchmark simple: operaciones matemáticas
  let result = 0;
  for (let i = 0; i < 100000; i++) {
    result += Math.random() * Math.sin(i) + Math.cos(i);
  }
  
  const duration = performance.now() - startTime;
  
  // Clasificación basada en tiempo de ejecución
  if (duration < 10) return 'high';
  if (duration < 30) return 'medium';
  return 'low';
}

/**
 * Obtiene el perfil de performance apropiado
 */
export function getPerformanceProfile(): PerformanceProfile {
  const devicePerformance = detectDevicePerformance();
  const environment = __DEV__ ? 'development' : 'production';
  const profileKey = `${devicePerformance}_${environment}`;
  
  return PERFORMANCE_PROFILES[profileKey] || PERFORMANCE_PROFILES['medium_production'];
}

/**
 * Hook para usar configuración adaptativa de performance
 */
export function useAdaptivePerformance() {
  const profile = getPerformanceProfile();
  
  return {
    profile,
    // Configuraciones específicas para hooks
    watchFieldsThrottle: profile.stableWatchedFields,
    validationDebounce: profile.validation,
    calculationThrottle: profile.calculations,
    aiProcessingDebounce: profile.aiProcessing,
    networkDebounce: profile.networkRequests,
    
    // Métodos de utilidad
    getThrottleFor: (operation: keyof PerformanceProfile) => profile[operation],
    isHighPerformanceDevice: () => detectDevicePerformance() === 'high',
    isLowPerformanceDevice: () => detectDevicePerformance() === 'low',
  };
}
