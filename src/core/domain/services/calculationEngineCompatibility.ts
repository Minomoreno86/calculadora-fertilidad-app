/**
 * 🔄 COMPATIBILITY LAYER - SMART MIGRATION BRIDGE
 * Capa de compatibilidad para migración gradual sin breaking changes
 */

// Import del sistema modular
import { getModularEngine } from './modular/ModularEngine';

// Re-exportar funciones con compatibilidad API completa
export { calculateProbability } from './modular/ModularEngine';
export * from './modular/ModularEngine';

// Configurar modo híbrido
export const MIGRATION_MODE = {
  useModular: true,
  enableFallback: true,
  performanceMonitoring: true
} as const;

// Función para validar disponibilidad del sistema modular
export function validateModularSystem(): boolean {
  try {
    const engine = getModularEngine();
    const health = engine.checkSystemHealth();
    return health.overall === 'HEALTHY' || health.overall === 'DEGRADED';
  } catch (error) {
    console.error('❌ Error validando sistema modular:', error);
    return false;
  }
}

console.log('🔄 Sistema híbrido activado - Migration Orchestrator V2.0');
