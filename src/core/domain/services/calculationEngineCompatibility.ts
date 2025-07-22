/**
 * 🔄 COMPATIBILITY LAYER - SMART MIGRATION BRIDGE
 * Capa de compatibilidad para migración gradual sin breaking changes
 */

// Import del sistema modular
import { ModularEngine } from './modular/ModularEngine';
import { CalculationOrchestrator } from './modular/CalculationOrchestrator';

// Crear instancias
const modularEngine = new ModularEngine();
const orchestrator = new CalculationOrchestrator();

// Re-exportar funciones con compatibilidad API completa
export { calculateProbability } from './modular/ModularEngine';
export * from './modular/ModularEngine';

// Configurar modo híbrido
export const MIGRATION_MODE = {
  useModular: true,
  enableFallback: true,
  performanceMonitoring: true
};

console.log('🔄 Sistema híbrido activado - Migration Orchestrator V2.0');
