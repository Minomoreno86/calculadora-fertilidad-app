/**
 * 🎯 MODULAR ENGINE - API Pública Unificada
 * 
 * Punto de entrada principal para el sistema modular de cálculo de fertilidad.
 * Reemplaza al monolito original manteniendo 100% compatibilidad hacia atrás.
 * 
 * CARACTERÍSTICAS:
 * - API idéntica al sistema original
 * - Arquitectura modular interna
 * - Cache inteligente unificado
 * - Observabilidad completa
 * - Recovery automático
 */

import { 
  UserInput, 
  EvaluationState, 
  Factors, 
  Diagnostics, 
  MyomaType,
  AdenomyosisType,
  PolypType,
  HsgResult
} from '../../models';

// Importar todos los módulos
import { 
  CalculationCore, 
  ValidationResult, 
  calculatePureFertilityFactors,
  validateUserInputPure,
  sanitizeUserInputPure 
} from './CalculationCore';

import { 
  UnifiedCacheManager, 
  getCacheManager, 
  generateInputHash,
  CacheMetrics 
} from './CacheManager';

import { 
  PerformanceMonitor, 
  getPerformanceMonitor,
  SystemMetrics,
  PerformanceReport,
  measureAsync,
  getQuickMetrics 
} from './PerformanceMonitor';

import { 
  IntelligentEngineSelector,
  getEngineSelector,
  EngineType,
  ComplexityAnalysis,
  selectOptimalEngine,
  analyzeInputComplexity
} from './EngineSelector';

import { 
  CalculationOrchestrator,
  getCalculationOrchestrator,
  calculateFertility,
  calculateFertilityFast,
  getSystemStats,
  CalculationOptions,
  CalculationResult
} from './CalculationOrchestrator';

// ===================================================================
// 🎯 INTERFACES PÚBLICAS
// ===================================================================

/**
 * Estado de un módulo del sistema
 */
type ModuleStatus = 'OK' | 'WARNING' | 'ERROR';

/**
 * Configuración completa del sistema modular
 */
export interface ModularEngineConfig {
  // Configuración de módulos individuales
  cache?: {
    maxSize?: number;
    defaultTtl?: number;
    enableCompression?: boolean;
    enablePrediction?: boolean;
  };
  
  performance?: {
    enableRealTimeAlerts?: boolean;
    enableTrendAnalysis?: boolean;
    maxMetricsHistory?: number;
  };
  
  selector?: {
    enableAdaptiveLearning?: boolean;
    enablePerformancePrediction?: boolean;
    learningRate?: number;
  };
  
  orchestrator?: {
    enableCaching?: boolean;
    enableFallbacks?: boolean;
    enableRecovery?: boolean;
    logLevel?: 'ERROR' | 'WARN' | 'INFO' | 'DEBUG';
  };
  
  // Configuración global
  global?: {
    enableProfiling?: boolean;
    enableDebugging?: boolean;
    enableOptimizations?: boolean;
  };
}

/**
 * Resultado extendido con información modular
 */
export interface ExtendedEvaluationResult {
  // Resultado principal (compatible con API original)
  evaluation: EvaluationState;
  
  // Información adicional del sistema modular
  systemInfo?: {
    engineUsed: EngineType;
    complexityScore: number;
    executionTime: number;
    cacheHit: boolean;
    confidence: number;
    
    // Métricas detalladas (solo si debugging está habilitado)
    detailed?: {
      validation: ValidationResult;
      complexity: ComplexityAnalysis;
      moduleTimings: Record<string, number>;
      cacheOperations: string[];
      warnings: string[];
    };
  };
}

/**
 * Estado de salud del sistema
 */
export interface SystemHealth {
  overall: 'HEALTHY' | 'DEGRADED' | 'CRITICAL' | 'OFFLINE';
  
  modules: {
    core: { status: ModuleStatus; message?: string };
    cache: { status: ModuleStatus; message?: string; hitRate?: number };
    performance: { status: ModuleStatus; message?: string; avgTime?: number };
    selector: { status: ModuleStatus; message?: string; accuracy?: number };
    orchestrator: { status: ModuleStatus; message?: string; activeRequests?: number };
  };
  
  metrics: {
    totalRequests: number;
    successRate: number;
    averageResponseTime: number;
    cacheEfficiency: number;
    systemLoad: number;
  };
  
  recommendations: string[];
  lastCheck: Date;
}

// ===================================================================
// 🎯 MODULAR ENGINE CLASS
// ===================================================================

export class ModularFertilityEngine {
  private core!: CalculationCore;
  private cache!: UnifiedCacheManager;
  private monitor!: PerformanceMonitor;
  private selector!: IntelligentEngineSelector;
  private orchestrator!: CalculationOrchestrator;
  
  private initialized = false;
  private readonly config: ModularEngineConfig;
  
  constructor(config: ModularEngineConfig = {}) {
    this.config = {
      global: {
        enableProfiling: true,
        enableDebugging: false,
        enableOptimizations: true,
        ...config.global
      },
      ...config
    };
    
    this.initialize();
  }
  
  // ===================================================================
  // 🚀 INICIALIZACIÓN Y CONFIGURACIÓN
  // ===================================================================
  
  private initialize(): void {
    try {
      // Inicializar módulos
      this.core = new CalculationCore();
      this.cache = getCacheManager();
      this.monitor = getPerformanceMonitor();
      this.selector = getEngineSelector();
      this.orchestrator = getCalculationOrchestrator();
      
      this.initialized = true;
      
      if (this.config.global?.enableProfiling) {
        console.log('🎯 ModularFertilityEngine inicializado correctamente');
        this.logSystemInfo();
      }
      
    } catch (error) {
      console.error('❌ Error inicializando ModularFertilityEngine:', error);
      this.initialized = false;
      throw error;
    }
  }
  
  private logSystemInfo(): void {
    const stats = this.getSystemStats();
    console.log('📊 Sistema modular:', {
      modulos: Object.keys(stats).length,
      cache: `${0} entradas`,
      performance: `${stats.performance.totalOperations} operaciones`
    });
  }
  
  // ===================================================================
  // 🧮 API PRINCIPAL DE CÁLCULO (Compatible con versión original)
  // ===================================================================
  
  /**
   * Función principal de cálculo - Compatible con API original
   */
  async calculate(input: UserInput, options: CalculationOptions = {}): Promise<EvaluationState> {
    this.ensureInitialized();
    
    try {
      // Usar orchestrator para cálculo completo
      const result = await this.orchestrator.executeCalculation(input, {
        enableProfiling: this.config.global?.enableProfiling,
        ...options
      });
      
      return result.evaluation;
      
    } catch (error) {
      console.error('❌ Error en cálculo modular:', error);
      
      // Fallback a cálculo básico para mantener compatibilidad
      try {
        console.warn('🔄 Fallback a cálculo básico...');
        return calculatePureFertilityFactors(input);
      } catch (fallbackError) {
        console.error('❌ Fallback también falló:', fallbackError);
        throw new Error(`Cálculo falló: ${error}. Fallback también falló: ${fallbackError}`);
      }
    }
  }
  
  /**
   * Función de cálculo extendida con información del sistema
   */
  async calculateExtended(input: UserInput, options: CalculationOptions = {}): Promise<ExtendedEvaluationResult> {
    this.ensureInitialized();
    
    const result = await this.orchestrator.executeCalculation(input, {
      enableProfiling: true, // Siempre habilitar para resultado extendido
      ...options
    });
    
    return {
      evaluation: result.evaluation,
      systemInfo: {
        engineUsed: result.metadata.engineUsed,
        complexityScore: result.metadata.complexityAnalysis?.totalComplexity || 0,
        executionTime: result.metadata.totalExecutionTime,
        cacheHit: result.metadata.cacheHit,
        confidence: result.metadata.confidenceLevel,
        detailed: this.config.global?.enableDebugging ? {
          validation: result.metadata.validationResult,
          complexity: result.metadata.complexityAnalysis,
          moduleTimings: result.debug?.moduleTimings || {},
          cacheOperations: result.debug?.cacheOperations || [],
          warnings: result.metadata.warnings
        } : undefined
      }
    };
  }
  
  /**
   * Cálculo rápido sin profiling (optimizado para performance)
   */
  async calculateFast(input: UserInput): Promise<EvaluationState> {
    this.ensureInitialized();
    
    return calculateFertilityFast(input, {
      enableProfiling: false,
      useCache: true,
      allowFallback: true
    });
  }
  
  /**
   * Cálculo por lotes (batch processing)
   */
  async calculateBatch(inputs: UserInput[], options: CalculationOptions = {}): Promise<EvaluationState[]> {
    this.ensureInitialized();
    
    const results = await Promise.allSettled(
      inputs.map(input => this.calculate(input, options))
    );
    
    return results.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        console.error(`❌ Error en cálculo batch ${index}:`, result.reason);
        // Retornar resultado por defecto en caso de error con tipos completos
        const defaultFactors: Factors = {
          baseAgeProbability: 0.5,
          bmi: 0.5,
          cycle: 0.5,
          pcos: 0.5,
          endometriosis: 0.5,
          myoma: 0.5,
          adenomyosis: 0.5,
          polyp: 0.5,
          hsg: 0.5,
          otb: 0.5,
          amh: 0.5,
          prolactin: 0.5,
          tsh: 0.5,
          homa: 0.5,
          male: 0.5,
          infertilityDuration: 0.5,
          pelvicSurgery: 0.5
        };

        const defaultDiagnostics: Diagnostics = {
          agePotential: 'NORMAL',
          bmiComment: 'Peso normal',
          cycleComment: 'Ciclo regular',
          pcosSeverity: 'NINGUNO',
          endometriosisComment: 'Sin signos aparentes',
          ovarianReserve: 'NORMAL',
          maleFactorDetailed: 'No evaluado',
          infertilityDurationComment: 'No especificado'
        };

        return {
          input: inputs[index],
          factors: defaultFactors,
          diagnostics: defaultDiagnostics,
          report: {
            numericPrognosis: 0,
            category: 'ERROR',
            emoji: '⚠️',
            prognosisPhrase: 'Error en cálculo - consulte especialista',
            benchmarkPhrase: 'No disponible',
            clinicalInsights: []
          }
        } as EvaluationState;
      }
    });
  }
  
  // ===================================================================
  // 🔍 FUNCIONES DE VALIDACIÓN Y ANÁLISIS
  // ===================================================================
  
  /**
   * Validación independiente de input
   */
  validateInput(input: UserInput): ValidationResult {
    this.ensureInitialized();
    return validateUserInputPure(input);
  }
  
  /**
   * Sanitización de input
   */
  sanitizeInput(input: UserInput): UserInput {
    this.ensureInitialized();
    return sanitizeUserInputPure(input);
  }
  
  /**
   * Análisis de complejidad independiente
   */
  analyzeComplexity(input: UserInput): ComplexityAnalysis {
    this.ensureInitialized();
    return analyzeInputComplexity(input);
  }
  
  /**
   * Análisis completo del input (validación + complejidad)
   */
  analyzeInput(input: UserInput): {
    validation: ValidationResult;
    complexity: ComplexityAnalysis;
    recommendation: {
      engineSuggestion: EngineType;
      confidence: number;
      reasoning: string[];
    };
  } {
    this.ensureInitialized();
    
    const validation = this.validateInput(input);
    const complexity = this.analyzeComplexity(input);
    const engineChoice = selectOptimalEngine(input);
    
    return {
      validation,
      complexity,
      recommendation: {
        engineSuggestion: engineChoice.selectedEngine,
        confidence: engineChoice.confidence,
        reasoning: engineChoice.reasoning
      }
    };
  }
  
  // ===================================================================
  // 📊 MONITOREO Y ESTADÍSTICAS
  // ===================================================================
  
  /**
   * Obtiene estadísticas completas del sistema
   */
  getSystemStats(): {
    orchestrator: Record<string, unknown>;
    cache: Record<string, unknown>;
    performance: Record<string, unknown>;
    selector: Record<string, unknown>;
  } {
    this.ensureInitialized();
    return getSystemStats();
  }
  
  /**
   * Obtiene métricas de performance rápidas
   */
  getPerformanceMetrics(): SystemMetrics {
    this.ensureInitialized();
    return getQuickMetrics();
  }
  
  /**
   * Obtiene métricas de cache
   */
  getCacheMetrics(): CacheMetrics {
    this.ensureInitialized();
    return this.cache.getMetrics();
  }
  
  /**
   * Genera reporte de performance detallado
   */
  generatePerformanceReport(timeWindow?: { start: Date; end: Date }): PerformanceReport {
    this.ensureInitialized();
    return this.monitor.generateReport(timeWindow);
  }
  
  /**
   * Verifica salud del sistema
   */
  checkSystemHealth(): SystemHealth {
    this.ensureInitialized();
    
    try {
      const stats = this.getSystemStats();
      const perfMetrics = this.getPerformanceMetrics();
      const cacheMetrics = this.getCacheMetrics();
      
      // Evaluar salud de cada módulo
      const modules = {
        core: this.evaluateCoreHealth(),
        cache: this.evaluateCacheHealth(cacheMetrics),
        performance: this.evaluatePerformanceHealth(perfMetrics),
        selector: this.evaluateSelectorHealth(stats.selector),
        orchestrator: this.evaluateOrchestratorHealth(stats.orchestrator)
      };
      
      // Determinar salud general
      const overall = this.determineOverallHealth(modules);
      
      // Generar recomendaciones
      const recommendations = this.generateHealthRecommendations(modules, perfMetrics, cacheMetrics);
      
      return {
        overall,
        modules,
        metrics: {
          totalRequests: perfMetrics.totalOperations,
          successRate: perfMetrics.successRate,
          averageResponseTime: perfMetrics.averageExecutionTime,
          cacheEfficiency: cacheMetrics.hitRate * 100,
          systemLoad: this.estimateSystemLoad()
        },
        recommendations,
        lastCheck: new Date()
      };
      
    } catch (error) {
      console.error('❌ Error verificando salud del sistema:', error);
      return {
        overall: 'CRITICAL',
        modules: {
          core: { status: 'ERROR', message: String(error) },
          cache: { status: 'ERROR', message: String(error) },
          performance: { status: 'ERROR', message: String(error) },
          selector: { status: 'ERROR', message: String(error) },
          orchestrator: { status: 'ERROR', message: String(error) }
        },
        metrics: {
          totalRequests: 0,
          successRate: 0,
          averageResponseTime: 0,
          cacheEfficiency: 0,
          systemLoad: 1
        },
        recommendations: ['Sistema requiere reinicialización'],
        lastCheck: new Date()
      };
    }
  }
  
  // ===================================================================
  // 🛠️ FUNCIONES DE MANTENIMIENTO
  // ===================================================================
  
  /**
   * Optimiza el sistema completo
   */
  async optimizeSystem(): Promise<{
    optimizationsApplied: string[];
    performanceImprovement: number;
    memoryFreed: number;
  }> {
    this.ensureInitialized();
    
    const beforeMetrics = this.getPerformanceMetrics();
    const beforeMemory = process.memoryUsage().heapUsed;
    const optimizationsApplied: string[] = [];
    
    try {
      // Optimizar cache
      const cacheOptimization = this.cache.optimize();
      optimizationsApplied.push(...cacheOptimization.optimizationsApplied);
      
      // Forzar garbage collection si está disponible
      if (global.gc) {
        global.gc();
        optimizationsApplied.push('Garbage collection ejecutado');
      }
      
      // Esperar un momento para que se reflejen las optimizaciones
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const afterMetrics = this.getPerformanceMetrics();
      const afterMemory = process.memoryUsage().heapUsed;
      const memoryFreed = Math.max(0, beforeMemory - afterMemory);
      
      const performanceImprovement = afterMetrics.averageExecutionTime > 0 && beforeMetrics.averageExecutionTime > 0 ?
        ((beforeMetrics.averageExecutionTime - afterMetrics.averageExecutionTime) / beforeMetrics.averageExecutionTime) * 100 : 0;
      
      console.log('🔧 Optimización del sistema completada:', {
        optimizaciones: optimizationsApplied.length,
        mejora: `${performanceImprovement.toFixed(1)}%`,
        memoriaLiberada: `${Math.round(memoryFreed / 1024 / 1024)}MB`
      });
      
      return {
        optimizationsApplied,
        performanceImprovement,
        memoryFreed
      };
      
    } catch (error) {
      console.error('❌ Error optimizando sistema:', error);
      return {
        optimizationsApplied: [`Error en optimización: ${error}`],
        performanceImprovement: 0,
        memoryFreed: 0
      };
    }
  }
  
  /**
   * Limpia el sistema (cache, métricas, etc.)
   */
  cleanupSystem(): {
    cacheCleared: boolean;
    metricsReset: boolean;
    memoryFreed: number;
  } {
    this.ensureInitialized();
    
    try {
      const beforeMemory = process.memoryUsage().heapUsed;
      
      // Limpiar cache
      this.cache.clear();
      
      // Forzar garbage collection si está disponible
      if (global.gc) {
        global.gc();
      }
      
      const afterMemory = process.memoryUsage().heapUsed;
      const memoryFreed = Math.max(0, beforeMemory - afterMemory);
      
      console.log('🧹 Sistema limpiado correctamente');
      
      return {
        cacheCleared: true,
        metricsReset: true,
        memoryFreed
      };
      
    } catch (error) {
      console.error('❌ Error limpiando sistema:', error);
      return {
        cacheCleared: false,
        metricsReset: false,
        memoryFreed: 0
      };
    }
  }
  
  /**
   * Reinicia el sistema completo
   */
  async restartSystem(): Promise<boolean> {
    try {
      console.log('🔄 Reiniciando sistema modular...');
      
      // Limpiar recursos actuales
      this.cleanupSystem();
      
      // Reinicializar
      this.initialized = false;
      this.initialize();
      
      // Verificar funcionamiento completo: health check + test calculation
      const health = this.checkSystemHealth();
      
      // Test adicional: realizar un cálculo de prueba
      const testInput: UserInput = {
        age: 30,
        bmi: null,
        hasPcos: false,
        endometriosisGrade: 0,
        myomaType: MyomaType.None,
        adenomyosisType: AdenomyosisType.None,
        polypType: PolypType.None,
        hsgResult: HsgResult.Unknown,
        hasOtb: false,
        tpoAbPositive: false
      };
      
      await this.calculateFast(testInput);
      
      if (health.overall === 'HEALTHY' || health.overall === 'DEGRADED') {
        console.log('✅ Sistema reiniciado correctamente');
        return true;
      } else {
        console.error('❌ Sistema no pudo reiniciarse correctamente');
        return false;
      }
      
    } catch (error) {
      console.error('❌ Error reiniciando sistema:', error);
      return false;
    }
  }
  
  // ===================================================================
  // 🛠️ FUNCIONES AUXILIARES PRIVADAS
  // ===================================================================
  
  private ensureInitialized(): void {
    if (!this.initialized) {
      throw new Error('ModularFertilityEngine no está inicializado correctamente');
    }
  }
  
  private evaluateCoreHealth(): SystemHealth['modules']['core'] {
    try {
      // Test básico del core con UserInput mínimo válido
      const testInput: UserInput = {
        age: 30,
        bmi: null,
        hasPcos: false,
        endometriosisGrade: 0,
        myomaType: MyomaType.None,
        adenomyosisType: AdenomyosisType.None,
        polypType: PolypType.None,
        hsgResult: HsgResult.Unknown,
        hasOtb: false,
        tpoAbPositive: false
      };
      this.core.validateInput(testInput);
      return { status: 'OK' };
    } catch (error) {
      return { status: 'ERROR', message: String(error) };
    }
  }
  
  private evaluateCacheHealth(metrics: CacheMetrics): SystemHealth['modules']['cache'] {
    const hitRate = metrics.hitRate * 100;
    
    if (hitRate > 80) {
      return { status: 'OK', hitRate };
    } else if (hitRate > 50) {
      return { status: 'WARNING', message: 'Hit rate bajo', hitRate };
    } else {
      return { status: 'ERROR', message: 'Hit rate crítico', hitRate };
    }
  }
  
  private evaluatePerformanceHealth(metrics: SystemMetrics): SystemHealth['modules']['performance'] {
    const avgTime = metrics.averageExecutionTime;
    
    if (avgTime < 500) {
      return { status: 'OK', avgTime };
    } else if (avgTime < 1000) {
      return { status: 'WARNING', message: 'Tiempo de respuesta elevado', avgTime };
    } else {
      return { status: 'ERROR', message: 'Tiempo de respuesta crítico', avgTime };
    }
  }
  
  private evaluateSelectorHealth(stats: { 
    errors?: number; 
    responseTime?: number; 
    successRate?: number;
    currentAccuracy?: number;
    selections?: number;
  }): SystemHealth['modules']['selector'] {
    const accuracy = (stats.currentAccuracy ?? 0) * 100;
    
    if (accuracy > 85) {
      return { status: 'OK', accuracy };
    } else if (accuracy > 70) {
      return { status: 'WARNING', message: 'Precisión de selección baja', accuracy };
    } else {
      return { status: 'ERROR', message: 'Precisión de selección crítica', accuracy };
    }
  }
  
  private evaluateOrchestratorHealth(stats: {
    errors?: number;
    responseTime?: number;
    successRate?: number;
    batches?: number;
    lastBatchTime?: number;
    activeRequests?: number;
  }): SystemHealth['modules']['orchestrator'] {
    const activeRequests = stats.activeRequests || 0;
    
    if (activeRequests < 10) {
      return { status: 'OK', activeRequests };
    } else if (activeRequests < 20) {
      return { status: 'WARNING', message: 'Muchas requests activas', activeRequests };
    } else {
      return { status: 'ERROR', message: 'Sistema sobrecargado', activeRequests };
    }
  }
  
  private determineOverallHealth(modules: SystemHealth['modules']): SystemHealth['overall'] {
    const statuses = Object.values(modules).map(m => m.status);
    
    if (statuses.includes('ERROR')) {
      return 'CRITICAL';
    } else if (statuses.includes('WARNING')) {
      return 'DEGRADED';
    } else {
      return 'HEALTHY';
    }
  }
  
  private generateHealthRecommendations(
    modules: SystemHealth['modules'],
    perfMetrics: SystemMetrics,
    cacheMetrics: CacheMetrics
  ): string[] {
    const recommendations: string[] = [];
    
    // Recomendaciones por módulo
    if (modules.cache.status !== 'OK') {
      recommendations.push('Optimizar configuración de cache');
    }
    
    if (modules.performance.status !== 'OK') {
      recommendations.push('Revisar performance de cálculos');
    }
    
    if (modules.selector.status !== 'OK') {
      recommendations.push('Entrenar selector con más datos');
    }
    
    // Recomendaciones por métricas
    if (perfMetrics.successRate < 95) {
      recommendations.push('Investigar causas de errores');
    }
    
    if (cacheMetrics.hitRate < 0.7) {
      recommendations.push('Ajustar estrategia de cache');
    }
    
    return recommendations;
  }
  
  private estimateSystemLoad(): number {
    const stats = this.getSystemStats();
    const activeRequests = stats.orchestrator.activeRequests || 0;
    return Math.min(1, Number(activeRequests || 0) / 10); // Normalizar a 0-1
  }
}

// ===================================================================
// 🎯 API PÚBLICA SIMPLIFICADA (Compatible con sistema original)
// ===================================================================

/**
 * Instancia singleton del engine modular
 */
let modularEngineInstance: ModularFertilityEngine | null = null;

/**
 * Obtiene la instancia del engine modular
 */
export function getModularEngine(config?: ModularEngineConfig): ModularFertilityEngine {
  modularEngineInstance ??= new ModularFertilityEngine(config);
  return modularEngineInstance;
}

/**
 * Función principal de cálculo (compatible con API original)
 */
export async function calculateFertilityModular(
  input: UserInput,
  options?: CalculationOptions
): Promise<EvaluationState> {
  return getModularEngine().calculate(input, options);
}

/**
 * Función de cálculo rápido
 */
export async function calculateFertilityFastModular(input: UserInput): Promise<EvaluationState> {
  return getModularEngine().calculateFast(input);
}

/**
 * Función de cálculo por lotes
 */
export async function calculateFertilityBatch(
  inputs: UserInput[],
  options?: CalculationOptions
): Promise<EvaluationState[]> {
  return getModularEngine().calculateBatch(inputs, options);
}

/**
 * Validación de input
 */
export function validateInputModular(input: UserInput): ValidationResult {
  return getModularEngine().validateInput(input);
}

/**
 * Análisis de complejidad
 */
export function analyzeComplexityModular(input: UserInput): ComplexityAnalysis {
  return getModularEngine().analyzeComplexity(input);
}

/**
 * Obtiene estadísticas del sistema
 */
export function getModularSystemStats() {
  return getModularEngine().getSystemStats();
}

/**
 * Verifica salud del sistema
 */
export function checkModularSystemHealth(): SystemHealth {
  return getModularEngine().checkSystemHealth();
}

/**
 * Optimiza el sistema
 */
export async function optimizeModularSystem() {
  return getModularEngine().optimizeSystem();
}

// ===================================================================
// 🎯 EXPORTS PRINCIPALES - SOLO UNA VEZ
// ===================================================================

// Exportar todas las interfaces (sin duplicar)
export type {
  CalculationOptions,
  CalculationResult,
  ValidationResult,
  ComplexityAnalysis,
  CacheMetrics,
  SystemMetrics,
  PerformanceReport
};

// Exportar funciones de utilidad de módulos individuales
export {
  // Core
  calculatePureFertilityFactors,
  validateUserInputPure,
  sanitizeUserInputPure,
  
  // Cache
  generateInputHash,
  
  // Performance
  measureAsync,
  getQuickMetrics,
  
  // Selector
  selectOptimalEngine,
  analyzeInputComplexity,
  
  // Orchestrator
  calculateFertility,
  calculateFertilityFast,
  getSystemStats
};

// API BRIDGE PARA COMPATIBILIDAD CON CALCULATIONENGINE
export async function calculateProbability(input: UserInput, _options?: ModularEngineConfig): Promise<EvaluationState> {
  return await calculateFertilityModular(input);
}

// Re-exportar tipo principal para compatibilidad
export type FertilityCalculationEngine = ModularFertilityEngine;

// Default export
export default ModularFertilityEngine;
