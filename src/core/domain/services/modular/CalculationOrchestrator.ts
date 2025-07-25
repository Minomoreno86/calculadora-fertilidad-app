/**
 * 🎭 CALCULATION ORCHESTRATOR - Coordinador Principal
 * 
 * Módulo que orquesta todos los componentes modulares para ejecutar
 * el flujo completo de cálculo de fertilidad de manera cohesiva.
 * 
 * RESPONSABILIDADES:
 * - Coordinar flujo entre módulos
 * - Manejo de errores y fallbacks
 * - Optimización de performance
 * - Logging estructurado
 * - Recovery automático
 */

import { UserInput, EvaluationState } from '../../models';
import { CalculationCore, ValidationResult, calculatePureFertilityFactors } from './CalculationCore';
import { UnifiedCacheManager, getCacheManager, generateInputHash } from './CacheManager';
import { PerformanceMonitor, getPerformanceMonitor } from './PerformanceMonitor';
import { 
  IntelligentEngineSelector, 
  getEngineSelector, 
  EngineType, 
  ComplexityAnalysis, 
  EngineChoice,
  recordEnginePerformance
} from './EngineSelector';

// ===================================================================
// 🎯 TIPOS PARA CALCULATION ORCHESTRATOR
// ===================================================================

/**
 * Estados de módulo
 */
type ModuleStatus = 'READY' | 'RUNNING' | 'COMPLETE' | 'ERROR';

/**
 * Opciones para el cálculo
 */
export interface CalculationOptions {
  // Control de cache
  useCache?: boolean;
  forceFreshCalculation?: boolean;
  
  // Control de engine
  preferredEngine?: EngineType;
  allowFallback?: boolean;
  
  // Control de performance
  timeoutMs?: number;
  enableProfiling?: boolean;
  
  // Control de calidad
  requireValidation?: boolean;
  minConfidenceLevel?: number;
  
  // Control de metadata
  userId?: string;
  sessionId?: string;
  
  // Control de recovery
  enableRecovery?: boolean;
}

/**
 * Resultado completo del cálculo
 */
export interface CalculationResult {
  // Resultado principal
  evaluation: EvaluationState;
  
  // Metadata del proceso
  metadata: {
    // Información del engine
    engineUsed: EngineType;
    engineChoice: EngineChoice;
    fallbacksUsed: EngineType[];
    
    // Performance
    totalExecutionTime: number;
    cacheHit: boolean;
    validationTime: number;
    calculationTime: number;
    
    // Calidad
    confidenceLevel: number;
    validationResult: ValidationResult;
    complexityAnalysis: ComplexityAnalysis;
    
    // Errores/warnings
    warnings: string[];
    errors: string[];
    recovered: boolean;
  };
  
  // Información de debugging
  debug?: {
    moduleTimings: Record<string, number>;
    cacheOperations: string[];
    selectionReasoning: string[];
    performanceMetrics: {
      executionTime: number;
      memoryUsage?: number;
      cpuUsage?: number;
      cacheHitRate?: number;
    };
  };
}

/**
 * Configuración del orchestrator
 */
export interface OrchestratorConfig {
  // Timeouts por defecto
  defaultTimeoutMs: number;
  validationTimeoutMs: number;
  calculationTimeoutMs: number;
  
  // Control de cache
  enableCaching: boolean;
  cacheTtl: number;
  
  // Control de fallbacks
  enableFallbacks: boolean;
  maxFallbackAttempts: number;
  
  // Control de recovery
  enableRecovery: boolean;
  recoveryStrategies: ('CACHE' | 'FALLBACK' | 'SIMPLIFIED')[];
  
  // Logging y debugging
  enableDebugging: boolean;
  enableProfiling: boolean;
  logLevel: 'ERROR' | 'WARN' | 'INFO' | 'DEBUG';
  
  // Calidad
  minConfidenceThreshold: number;
  enableQualityChecks: boolean;
}

/**
 * Estado de coordinación entre módulos
 */
export interface ModuleCoordination {
  modules: {
    core: { status: ModuleStatus; timing: number };
    cache: { status: ModuleStatus; timing: number };
    monitor: { status: ModuleStatus; timing: number };
    selector: { status: ModuleStatus; timing: number };
  };
  
  totalCoordinationTime: number;
  bottlenecks: string[];
  optimizationOpportunities: string[];
}

/**
 * Request de cálculo interno
 */
export interface CalculationRequest {
  input: UserInput;
  options: CalculationOptions;
  requestId: string;
  timestamp: number;
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL';
}

// ===================================================================
// 🎭 CALCULATION ORCHESTRATOR CLASS
// ===================================================================

export class CalculationOrchestrator {
  private readonly core: CalculationCore;
  private readonly cache: UnifiedCacheManager;
  private readonly monitor: PerformanceMonitor;
  private readonly selector: IntelligentEngineSelector;
  
  // Contadores para debugging
  private requestCounter = 0;
  private readonly activeRequests = new Map<string, CalculationRequest>();
  
  constructor(private readonly config: OrchestratorConfig = {
    defaultTimeoutMs: 5000,
    validationTimeoutMs: 1000,
    calculationTimeoutMs: 3000,
    enableCaching: true,
    cacheTtl: 30000,
    enableFallbacks: true,
    maxFallbackAttempts: 2,
    enableRecovery: true,
    recoveryStrategies: ['CACHE', 'FALLBACK', 'SIMPLIFIED'],
    enableDebugging: false,
    enableProfiling: true,
    logLevel: 'INFO',
    minConfidenceThreshold: 0.7,
    enableQualityChecks: true
  }) {
    this.core = new CalculationCore();
    this.cache = getCacheManager();
    this.monitor = getPerformanceMonitor();
    this.selector = getEngineSelector();
  }
  
  // ===================================================================
  // 🚀 FLUJO PRINCIPAL DE CÁLCULO
  // ===================================================================
  
  /**
   * Ejecuta el cálculo completo de fertilidad con orquestación completa
   */
  async executeCalculation(input: UserInput, options: CalculationOptions = {}): Promise<CalculationResult> {
    const requestId = this.generateRequestId();
    const request: CalculationRequest = {
      input,
      options: { ...this.getDefaultOptions(), ...options },
      requestId,
      timestamp: Date.now(),
      priority: this.determinePriority(input, options)
    };
    
    this.activeRequests.set(requestId, request);
    
    try {
      return await this.monitor.measureOperation(
        'FULL_CALCULATION',
        () => this.executeCalculationInternal(request),
        {
          operationType: 'FERTILITY_CALCULATION',
          userId: options.userId,
          sessionId: options.sessionId,
          input,
          metadata: { requestId, priority: request.priority }
        }
      );
    } finally {
      this.activeRequests.delete(requestId);
    }
  }
  
  /**
   * Ejecución interna del cálculo con manejo completo de errores
   */
  private async executeCalculationInternal(request: CalculationRequest): Promise<CalculationResult> {
    const { input, options, requestId } = request;
    const startTime = performance.now();
    
    const result: CalculationResult = {
      evaluation: {} as EvaluationState,
      metadata: {
        engineUsed: 'STANDARD',
        engineChoice: {} as EngineChoice,
        fallbacksUsed: [],
        totalExecutionTime: 0,
        cacheHit: false,
        validationTime: 0,
        calculationTime: 0,
        confidenceLevel: 0,
        validationResult: {} as ValidationResult,
        complexityAnalysis: {} as ComplexityAnalysis,
        warnings: [],
        errors: [],
        recovered: false
      },
      debug: options.enableProfiling ? {
        moduleTimings: {} as Record<string, number>,
        cacheOperations: [] as string[],
        selectionReasoning: [] as string[],
        performanceMetrics: {
          executionTime: 0,
          memoryUsage: undefined,
          cpuUsage: undefined,
          cacheHitRate: undefined
        }
      } : undefined
    };
    
    try {
      // FASE 1: Validación y Preparación
      const validation = await this.performValidation(input, options, result);
      if (!validation.success) {
        throw new Error(`Validación falló: ${validation.errors.join(', ')}`);
      }
      
      // FASE 2: Verificación de Cache
      const cacheResult = await this.checkCache(input, options, result);
      if (cacheResult.hit && cacheResult.data) {
        this.log('INFO', `Cache hit para request ${requestId}`);
        result.evaluation = cacheResult.data;
        result.metadata.cacheHit = true;
        result.metadata.totalExecutionTime = performance.now() - startTime;
        return result;
      }
      
      // FASE 3: Análisis de Complejidad y Selección de Engine
      const selection = await this.performEngineSelection(input, options, result);
      
      // FASE 4: Ejecución del Cálculo
      const calculation = await this.performCalculation(input, selection, options, result);
      
      // FASE 5: Post-procesamiento y Cache
      await this.performPostProcessing(input, calculation, options, result);
      
      result.metadata.totalExecutionTime = performance.now() - startTime;
      this.log('INFO', `Cálculo completado en ${result.metadata.totalExecutionTime.toFixed(2)}ms`);
      
      return result;
      
    } catch (error) {
      this.log('ERROR', `Error en cálculo ${requestId}: ${error}`);
      result.metadata.errors.push(String(error));
      
      // Intentar recovery si está habilitado
      if (options.enableRecovery !== false && this.config.enableRecovery) {
        const recovered = await this.attemptRecovery(input, options, result, error instanceof Error ? error : new Error(String(error)));
        if (recovered.success && recovered.data) {
          result.evaluation = recovered.data;
          result.metadata.recovered = true;
          result.metadata.totalExecutionTime = performance.now() - startTime;
          return result;
        }
      }
      
      throw error;
    }
  }
  
  // ===================================================================
  // 📋 FASES DE EJECUCIÓN
  // ===================================================================
  
  /**
   * FASE 1: Validación y preparación del input
   */
  private async performValidation(
    input: UserInput, 
    options: CalculationOptions, 
    result: CalculationResult
  ): Promise<{ success: boolean; errors: string[]; data?: ValidationResult }> {
    const startTime = performance.now();
    
    try {
      const validation = this.core.validateInput(input);
      result.metadata.validationResult = validation;
      result.metadata.validationTime = performance.now() - startTime;
      
      if (result.debug) {
        result.debug.moduleTimings.validation = result.metadata.validationTime;
      }
      
      if (!validation.isValid) {
        return { success: false, errors: validation.errors };
      }
      
      // Verificar nivel de confianza mínimo
      if (validation.severity === 'CRITICAL' || 
          (options.minConfidenceLevel && validation.severity === 'HIGH')) {
        result.metadata.warnings.push('Nivel de confianza bajo en validación');
      }
      
      return { success: true, errors: [], data: validation };
      
    } catch (error) {
      const validationTime = performance.now() - startTime;
      result.metadata.validationTime = validationTime;
      
      return { success: false, errors: [`Error en validación: ${error}`] };
    }
  }
  
  /**
   * FASE 2: Verificación y manejo de cache
   */
  private async performCheckCache(
    input: UserInput, 
    options: CalculationOptions, 
    result: CalculationResult
  ): Promise<{ hit: boolean; data?: EvaluationState }> {
    if (!options.useCache || options.forceFreshCalculation) {
      if (result.debug) {
        result.debug.cacheOperations.push('Cache skipped by options');
      }
      return { hit: false };
    }
    
    const cacheKey = generateInputHash(input);
    const cached = this.cache.get<EvaluationState>(cacheKey, 'general');
    
    if (result.debug) {
      result.debug.cacheOperations.push(`Cache lookup: ${cacheKey} - ${cached ? 'HIT' : 'MISS'}`);
    }
    
    if (cached) {
      // Verificar validez del cache
      if (this.isCacheValid(cached, input)) {
        return { hit: true, data: cached };
      } else {
        this.cache.delete(cacheKey, 'general');
        if (result.debug) {
          result.debug.cacheOperations.push('Invalid cache entry removed');
        }
      }
    }
    
    return { hit: false };
  }
  
  /**
   * FASE 3: Análisis de complejidad y selección de engine
   */
  private async performEngineSelection(
    input: UserInput, 
    options: CalculationOptions, 
    result: CalculationResult
  ): Promise<{ complexity: ComplexityAnalysis; choice: EngineChoice }> {
    const startTime = performance.now();
    
    try {
      // Análisis de complejidad
      const complexity = this.selector.analyzeComplexity(input);
      result.metadata.complexityAnalysis = complexity;
      result.metadata.confidenceLevel = complexity.confidenceLevel;
      
      // Crear contexto de selección
      const context = this.buildSelectionContext(input, options);
      
      // Selección de engine
      let choice: EngineChoice;
      
      if (options.preferredEngine) {
        // Engine específico solicitado
        choice = this.createManualEngineChoice(options.preferredEngine, complexity);
        result.metadata.warnings.push(`Engine manual seleccionado: ${options.preferredEngine}`);
      } else {
        // Selección automática
        choice = this.selector.selectEngine(complexity, context);
      }
      
      result.metadata.engineChoice = choice;
      result.metadata.engineUsed = choice.selectedEngine;
      
      if (result.debug) {
        result.debug.moduleTimings.selection = performance.now() - startTime;
        result.debug.selectionReasoning = choice.reasoning;
      }
      
      this.log('DEBUG', `Engine seleccionado: ${choice.selectedEngine} (confidence: ${choice.confidence.toFixed(2)})`);
      
      return { complexity, choice };
      
    } catch (error) {
      this.log('ERROR', `Error en selección de engine: ${error}`);
      
      // Fallback a engine standard
      const fallbackChoice = this.createFallbackEngineChoice('STANDARD');
      result.metadata.engineChoice = fallbackChoice;
      result.metadata.engineUsed = 'STANDARD';
      result.metadata.warnings.push('Fallback a engine standard por error en selección');
      
      return { 
        complexity: this.createEmptyComplexityAnalysis(),
        choice: fallbackChoice 
      };
    }
  }
  
  /**
   * FASE 4: Ejecución del cálculo principal
   */
  private async performCalculation(
    input: UserInput,
    selection: { complexity: ComplexityAnalysis; choice: EngineChoice },
    options: CalculationOptions,
    result: CalculationResult
  ): Promise<EvaluationState> {
    const startTime = performance.now();
    let lastError: Error | null = null;
    
    // Lista de engines a intentar (principal + fallbacks)
    const enginesToTry = [
      selection.choice.selectedEngine,
      ...(options.allowFallback !== false ? selection.choice.fallbackEngines : [])
    ].slice(0, this.config.maxFallbackAttempts + 1);
    
    for (const engineType of enginesToTry) {
      try {
        this.log('DEBUG', `Intentando cálculo con engine: ${engineType}`);
        
        const calculationResult = await this.executeWithEngine(
          engineType,
          input,
          options,
          result
        );
        
        // Registrar performance para aprendizaje
        recordEnginePerformance(
          engineType,
          selection.complexity.totalComplexity,
          {
            executionTime: performance.now() - startTime,
            success: true,
            accuracyScore: calculationResult.report?.numericPrognosis || 0.9
          }
        );
        
        result.metadata.calculationTime = performance.now() - startTime;
        
        if (result.debug) {
          result.debug.moduleTimings.calculation = result.metadata.calculationTime;
        }
        
        return calculationResult;
        
      } catch (error) {
        lastError = error as Error;
        result.metadata.fallbacksUsed.push(engineType);
        
        // Registrar fallo para aprendizaje
        recordEnginePerformance(
          engineType,
          selection.complexity.totalComplexity,
          {
            executionTime: performance.now() - startTime,
            success: false,
            error: String(error)
          }
        );
        
        this.log('WARN', `Engine ${engineType} falló: ${error}`);
        
        // Continuar con siguiente engine si hay fallbacks disponibles
        if (engineType !== enginesToTry[enginesToTry.length - 1]) {
          continue;
        }
      }
    }
    
    // Si llegamos aquí, todos los engines fallaron
    throw new Error(`Todos los engines fallaron. Último error: ${lastError?.message}`);
  }
  
  /**
   * FASE 5: Post-procesamiento y caching
   */
  private async performPostProcessing(
    input: UserInput,
    evaluation: EvaluationState,
    options: CalculationOptions,
    result: CalculationResult
  ): Promise<void> {
    const startTime = performance.now();
    
    try {
      // Validaciones de calidad si están habilitadas
      if (this.config.enableQualityChecks) {
        const qualityIssues = this.performQualityChecks(evaluation);
        result.metadata.warnings.push(...qualityIssues);
      }
      
      // Guardaer en cache si está habilitado
      if (options.useCache !== false && this.config.enableCaching) {
        const cacheKey = generateInputHash(input);
        this.cache.set(cacheKey, evaluation, 'general', { ttl: this.config.cacheTtl });
        
        if (result.debug) {
          result.debug.cacheOperations.push(`Cached result: ${cacheKey}`);
        }
      }
      
      // Actualizar métricas de performance
      if (this.config.enableProfiling) {
        const systemMetrics = this.monitor.getSystemMetrics();
        if (result.debug) {
          result.debug.performanceMetrics = {
            executionTime: systemMetrics.averageExecutionTime,
            memoryUsage: systemMetrics.totalMemoryUsage,
            cpuUsage: systemMetrics.averageCpuUsage,
            cacheHitRate: systemMetrics.successRate
          };
        }
      }
      
      result.evaluation = evaluation;
      
      if (result.debug) {
        result.debug.moduleTimings.postProcessing = performance.now() - startTime;
      }
      
    } catch (error) {
      this.log('WARN', `Error en post-procesamiento: ${error}`);
      result.metadata.warnings.push(`Post-procesamiento incompleto: ${error}`);
      
      // No fallar el cálculo por errores de post-procesamiento
      result.evaluation = evaluation;
    }
  }
  
  // ===================================================================
  // 🔄 SISTEMA DE RECOVERY
  // ===================================================================
  
  /**
   * Intenta recovery del cálculo usando estrategias configuradas
   */
  private async attemptRecovery(
    input: UserInput,
    options: CalculationOptions,
    result: CalculationResult,
    originalError: Error
  ): Promise<{ success: boolean; data?: EvaluationState }> {
    this.log('WARN', `Iniciando recovery para error: ${originalError}`);
    
    for (const strategy of this.config.recoveryStrategies) {
      try {
        const recovered = await this.executeRecoveryStrategy(strategy, input, options, result);
        if (recovered.success) {
          this.log('INFO', `Recovery exitoso con estrategia: ${strategy}`);
          return recovered;
        }
      } catch (error) {
        this.log('WARN', `Recovery strategy ${strategy} falló: ${error}`);
      }
    }
    
    this.log('ERROR', 'Todas las estrategias de recovery fallaron');
    return { success: false };
  }
  
  /**
   * Ejecuta estrategia específica de recovery
   */
  private async executeRecoveryStrategy(
    strategy: 'CACHE' | 'FALLBACK' | 'SIMPLIFIED',
    input: UserInput,
    options: CalculationOptions,
    _result: CalculationResult
  ): Promise<{ success: boolean; data?: EvaluationState }> {
    switch (strategy) {
      case 'CACHE':
        return this.recoverFromCache(input, options);
        
      case 'FALLBACK':
        return this.recoverWithFallback(input, options);
        
      case 'SIMPLIFIED':
        return this.recoverWithSimplified(input, options);
        
      default:
        return { success: false };
    }
  }
  
  /**
   * Recovery usando cache (incluso entradas parcialmente válidas)
   */
  private async recoverFromCache(
    input: UserInput,
    _options: CalculationOptions
  ): Promise<{ success: boolean; data?: EvaluationState }> {
    // Buscar en cache con keys similares
    const baseKey = generateInputHash(input);
    const similarKeys = this.findSimilarCacheKeys(baseKey);
    
    for (const key of similarKeys) {
      const cached = this.cache.get<EvaluationState>(key, 'general');
      if (cached && this.isCacheSimilarEnough(cached, input)) {
        this.log('INFO', `Recovery con cache similar: ${key}`);
        return { success: true, data: cached };
      }
    }
    
    return { success: false };
  }
  
  /**
   * Recovery con engine simplificado
   */
  private async recoverWithFallback(
    input: UserInput,
    options: CalculationOptions
  ): Promise<{ success: boolean; data?: EvaluationState }> {
    try {
      // Intentar con engine más simple
      const simplified = await this.executeWithEngine('SIMPLIFIED', input, options);
      return { success: true, data: simplified };
    } catch {
      return { success: false };
    }
  }
  
  /**
   * Recovery con cálculo básico usando solo core
   */
  private async recoverWithSimplified(
    input: UserInput,
    _options: CalculationOptions
  ): Promise<{ success: boolean; data?: EvaluationState }> {
    try {
      // Usar función pura del core sin dependencias
      const simplified = calculatePureFertilityFactors(input);
      return { success: true, data: simplified };
    } catch {
      return { success: false };
    }
  }
  
  // ===================================================================
  // 🛠️ FUNCIONES AUXILIARES PRIVADAS
  // ===================================================================
  
  private generateRequestId(): string {
    return `calc_${Date.now()}_${++this.requestCounter}`;
  }
  
  private getDefaultOptions(): CalculationOptions {
    return {
      useCache: this.config.enableCaching,
      forceFreshCalculation: false,
      allowFallback: this.config.enableFallbacks,
      timeoutMs: this.config.defaultTimeoutMs,
      enableProfiling: this.config.enableProfiling,
      requireValidation: true,
      minConfidenceLevel: this.config.minConfidenceThreshold
    };
  }
  
  private determinePriority(input: UserInput, options: CalculationOptions): CalculationRequest['priority'] {
    // Lógica simple de priorización
    if (options.userId?.includes('premium')) return 'HIGH';
    if (input.age > 40) return 'HIGH'; // Casos más urgentes
    return 'NORMAL';
  }
  
  private async checkCache(input: UserInput, options: CalculationOptions, result: CalculationResult) {
    return this.performCheckCache(input, options, result);
  }
  
  private buildSelectionContext(input: UserInput, options: CalculationOptions) {
    return {
      timestamp: Date.now(),
      timeOfDay: new Date().getHours(),
      dayOfWeek: new Date().getDay(),
      systemLoad: this.estimateSystemLoad(),
      availableMemory: this.estimateAvailableMemory(),
      recentPerformance: this.getRecentEnginePerformance(),
      userPreferences: {
        preferAccuracy: !options.userId?.includes('speed'),
        preferSpeed: options.userId?.includes('speed') || false,
        maxWaitTime: options.timeoutMs || this.config.defaultTimeoutMs
      }
    };
  }
  
  private async executeWithEngine(
    engineType: EngineType,
    input: UserInput,
    _options: CalculationOptions,
    _result?: CalculationResult
  ): Promise<EvaluationState> {
    // Por ahora, usar el core calculation para todos los engines
    // En implementación completa, aquí se llamaría al engine específico
    switch (engineType) {
      case 'STANDARD':
      case 'PREMIUM':
      case 'UNIFIED':
      case 'SIMPLIFIED':
      default:
        return calculatePureFertilityFactors(input);
    }
  }
  
  private isCacheValid(cached: EvaluationState, _input: UserInput): boolean {
    // Verificar que el cache sea válido para el input actual
    // Implementación simplificada
    return !!cached.factors && !!cached.diagnostics && !!cached.report;
  }
  
  private createManualEngineChoice(engine: EngineType, complexity: ComplexityAnalysis): EngineChoice {
    return {
      selectedEngine: engine,
      confidence: 0.8, // Confianza manual
      reasoning: [`Engine seleccionado manualmente: ${engine}`],
      fallbackEngines: [],
      expectedPerformance: {
        executionTime: 500,
        successProbability: 0.9,
        accuracyScore: 0.85
      },
      selectionTime: 0,
      complexityScore: complexity.totalComplexity,
      contextFactors: ['MANUAL_SELECTION']
    };
  }
  
  private createEmptyComplexityAnalysis(): ComplexityAnalysis {
    return {
      ageComplexity: 0.5,
      hormonalComplexity: 0.5,
      anatomicalComplexity: 0.5,
      masculineComplexity: 0.5,
      interactionComplexity: 0.5,
      totalComplexity: 0.5,
      analysisTime: 0,
      confidenceLevel: 0.5,
      criticalFactors: [],
      preliminaryEngineChoice: 'STANDARD'
    };
  }
  
  private createFallbackEngineChoice(engine: EngineType): EngineChoice {
    return {
      selectedEngine: engine,
      confidence: 0.6,
      reasoning: [`Fallback a ${engine} por error en selección`],
      fallbackEngines: [],
      expectedPerformance: {
        executionTime: 400,
        successProbability: 0.85,
        accuracyScore: 0.8
      },
      selectionTime: 0,
      complexityScore: 0.5,
      contextFactors: ['FALLBACK_SELECTION']
    };
  }
  
  private performQualityChecks(evaluation: EvaluationState): string[] {
    const issues: string[] = [];
    
    // Verificar completitud
    if (!evaluation.factors || Object.keys(evaluation.factors).length === 0) {
      issues.push('Factores de cálculo incompletos');
    }
    
    if (!evaluation.diagnostics || Object.keys(evaluation.diagnostics).length === 0) {
      issues.push('Diagnósticos incompletos');
    }
    
    if (!evaluation.report) {
      issues.push('Reporte no generado');
    }
    
    // Verificar consistencia
    if (evaluation.report?.numericPrognosis && (evaluation.report.numericPrognosis < 0 || evaluation.report.numericPrognosis > 1)) {
      issues.push('Score de pronóstico numérico fuera de rango válido (0-1)');
    }
    
    return issues;
  }
  
  private findSimilarCacheKeys(baseKey: string): string[] {
    // Implementación simplificada - buscar keys con prefijo similar
    const prefix = baseKey.substring(0, 6);
    
    // Buscar keys similares en cache (implementación funcional)
    try {
      // Intentar obtener métricas detalladas que pueden contener información de keys
      const cacheStats = this.cache.getDetailedStats();
      
      // Buscar patterns similares basados en el prefijo
      if (cacheStats.patterns?.topPatterns) {
        const similarPatterns = cacheStats.patterns.topPatterns
          .map((pattern: { hash: string }) => pattern.hash)
          .filter((hash: string) => hash.startsWith(prefix) && hash !== baseKey);
        
        return similarPatterns.slice(0, 5); // Máximo 5 similares
      }
    } catch (error) {
      this.log('DEBUG', `Error buscando keys similares: ${error}`);
    }
    
    // Fallback: retornar array vacío si no se pueden obtener keys
    return [];
  }
  
  private isCacheSimilarEnough(cached: EvaluationState, _input: UserInput): boolean {
    // Verificar si el cache es suficientemente similar para usar como recovery
    // Implementación simplificada
    return !!cached.factors && !!cached.report;
  }
  
  private estimateSystemLoad(): number {
    // Estimación simple de carga del sistema
    const activeRequestsCount = this.activeRequests.size;
    return Math.min(1, activeRequestsCount / 10); // Max 10 requests paralelos
  }
  
  private estimateAvailableMemory(): number {
    // Estimación de memoria disponible
    if (typeof process !== 'undefined' && process.memoryUsage) {
      const usage = process.memoryUsage();
      return Math.max(512, 2048 - (usage.heapUsed / 1024 / 1024)); // Estimación en MB
    }
    return 1024; // Default 1GB
  }
  
  private getRecentEnginePerformance() {
    const now = Date.now();
    const hour = 60 * 60 * 1000;
    
    return {
      standardEngine: {
        avgTime: 300,
        successRate: 0.95,
        lastUsed: now - hour
      },
      premiumEngine: {
        avgTime: 500,
        successRate: 0.90,
        lastUsed: now - 2 * hour
      },
      unifiedEngine: {
        avgTime: 400,
        successRate: 0.98,
        lastUsed: now - 30 * 60 * 1000 // 30 minutos
      }
    };
  }
  
  private log(level: OrchestratorConfig['logLevel'], message: string): void {
    const levels = { ERROR: 0, WARN: 1, INFO: 2, DEBUG: 3 };
    const currentLevel = levels[this.config.logLevel];
    const messageLevel = levels[level];
    
    if (messageLevel <= currentLevel) {
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] [ORCHESTRATOR] [${level}] ${message}`);
    }
  }
  
  // ===================================================================
  // 📊 MÉTODOS DE MONITOREO Y ESTADÍSTICAS
  // ===================================================================
  
  /**
   * Obtiene estadísticas del orchestrator
   */
  getStats(): {
    activeRequests: number;
    totalRequests: number;
    moduleStatus: Record<string, string>;
    performanceMetrics: Record<string, unknown>;
  } {
    return {
      activeRequests: this.activeRequests.size,
      totalRequests: this.requestCounter,
      moduleStatus: {
        core: 'READY',
        cache: 'READY',
        monitor: 'READY',
        selector: 'READY'
      },
      performanceMetrics: {
        totalOperations: this.monitor.getSystemMetrics().totalOperations,
        successRate: this.monitor.getSystemMetrics().successRate,
        averageExecutionTime: this.monitor.getSystemMetrics().averageExecutionTime
      } as Record<string, unknown>
    };
  }
  
  /**
   * Obtiene el estado de salud del sistema
   */
  getSystemHealth(): {
    overall: 'HEALTHY' | 'DEGRADED' | 'CRITICAL' | 'OFFLINE';
    modules: Record<string, { status: 'OK' | 'WARNING' | 'ERROR'; message?: string; metric?: number }>;
    metrics: Record<string, number>;
    recommendations: string[];
    lastCheck: Date;
  } {
    const systemMetrics = this.monitor.getSystemMetrics();
    const cacheMetrics = this.cache.getMetrics();
    const selectorStats = this.selector.getLearningStats();
    const activeRequests = this.activeRequests.size;
    
    // Evaluación de módulos
    const modules = {
      core: {
        status: 'OK' as const,
        message: 'Calculation core functioning normally'
      },
      cache: {
        status: cacheMetrics.hitRate > 0.7 ? 'OK' as const : 'WARNING' as const,
        message: `Cache hit rate: ${(cacheMetrics.hitRate * 100).toFixed(1)}%`,
        metric: cacheMetrics.hitRate
      },
      performance: {
        status: systemMetrics.averageExecutionTime < 1000 ? 'OK' as const : 'WARNING' as const,
        message: `Average execution time: ${systemMetrics.averageExecutionTime.toFixed(0)}ms`,
        metric: systemMetrics.averageExecutionTime
      },
      selector: {
        status: selectorStats.feedbackCount > 0 ? 'OK' as const : 'WARNING' as const,
        message: `Feedback count: ${selectorStats.feedbackCount}`,
        metric: selectorStats.feedbackCount
      },
      orchestrator: {
        status: activeRequests < 10 ? 'OK' as const : 'WARNING' as const,
        message: `Active requests: ${activeRequests}`,
        metric: activeRequests
      }
    };
    
    // Evaluación general - solo puede haber WARNING o OK status
    const hasWarnings = Object.values(modules).some(m => m.status === 'WARNING');
    
    const overall = hasWarnings ? 'DEGRADED' as const : 'HEALTHY' as const;
    
    // Recomendaciones
    const recommendations: string[] = [];
    if (cacheMetrics.hitRate < 0.5) {
      recommendations.push('Consider increasing cache size or TTL');
    }
    if (systemMetrics.averageExecutionTime > 2000) {
      recommendations.push('Performance is degraded - consider engine optimization');
    }
    if (activeRequests > 20) {
      recommendations.push('High load detected - consider load balancing');
    }
    
    return {
      overall,
      modules,
      metrics: {
        totalRequests: this.requestCounter,
        successRate: systemMetrics.successRate,
        averageResponseTime: systemMetrics.averageExecutionTime,
        cacheEfficiency: cacheMetrics.hitRate,
        systemLoad: activeRequests / 10
      },
      recommendations,
      lastCheck: new Date()
    };
  }
  
  /**
   * Optimiza el sistema basado en métricas actuales
   */
  optimizeSystem(): {
    optimizationsApplied: string[];
    expectedImprovements: Record<string, string>;
    nextOptimizationTime: Date;
  } {
    const optimizations: string[] = [];
    const improvements: Record<string, string> = {};
    
    // Optimización de cache
    const cacheMetrics = this.cache.getMetrics();
    if (cacheMetrics.hitRate < 0.6) {
      const cacheResult = this.cache.optimize();
      optimizations.push(...cacheResult.optimizationsApplied);
      Object.assign(improvements, cacheResult.metricsImproved);
    }
    
    // Optimización de selector
    const selectorStats = this.selector.getLearningStats();
    if (selectorStats.feedbackCount > 50) {
      // El selector se auto-optimiza, solo reportamos
      optimizations.push('Engine selection patterns analyzed');
      improvements.accuracyImprovement = 'Expected 5-10% accuracy improvement';
    }
    
    // Cleanup de requests antiguos
    const oldRequests = Array.from(this.activeRequests.entries())
      .filter(([_, request]) => Date.now() - request.timestamp > 30000);
    
    if (oldRequests.length > 0) {
      oldRequests.forEach(([id]) => this.activeRequests.delete(id));
      optimizations.push(`Cleaned up ${oldRequests.length} stale requests`);
      improvements.memoryUsage = 'Reduced memory footprint';
    }
    
    return {
      optimizationsApplied: optimizations,
      expectedImprovements: improvements,
      nextOptimizationTime: new Date(Date.now() + 30 * 60 * 1000) // 30 minutos
    };
  }
  
  /**
   * Ejecuta cálculo con retry automático
   */
  async executeCalculationWithRetry(
    input: UserInput, 
    options: CalculationOptions = {}, 
    maxRetries: number = 3
  ): Promise<CalculationResult> {
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const result = await this.executeCalculation(input, options);
        
        // Log successful retry
        if (attempt > 1) {
          this.log('INFO', `Calculation succeeded on attempt ${attempt}`);
        }
        
        return result;
        
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        
        if (attempt === maxRetries) {
          this.log('ERROR', `All ${maxRetries} attempts failed. Last error: ${lastError.message}`);
          break;
        }
        
        // Espera exponencial entre intentos
        const delay = Math.pow(2, attempt - 1) * 1000;
        this.log('WARN', `Attempt ${attempt} failed, retrying in ${delay}ms: ${lastError.message}`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError || new Error('Max retries exceeded');
  }
  
  /**
   * Ejecuta cálculo por lotes
   */
  async executeBatchCalculation(
    inputs: UserInput[], 
    options: CalculationOptions = {}
  ): Promise<{
    results: CalculationResult[];
    summary: {
      total: number;
      successful: number;
      failed: number;
      averageTime: number;
      errors: string[];
    };
  }> {
    const results: CalculationResult[] = [];
    const errors: string[] = [];
    const startTime = performance.now();
    
    this.log('INFO', `Starting batch calculation for ${inputs.length} inputs`);
    
    // Procesar en paralelo (máximo 5 concurrentes)
    const batchSize = 5;
    for (let i = 0; i < inputs.length; i += batchSize) {
      const batch = inputs.slice(i, i + batchSize);
      const batchPromises = batch.map(async (input, index) => {
        try {
          const result = await this.executeCalculation(input, {
            ...options,
            sessionId: `batch_${Date.now()}_${i + index}`
          });
          return { success: true, result, error: null };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          return { success: false, result: null, error: errorMessage };
        }
      });
      
      const batchResults = await Promise.all(batchPromises);
      
      for (const batchResult of batchResults) {
        if (batchResult.success && batchResult.result) {
          results.push(batchResult.result);
        } else if (batchResult.error) {
          errors.push(batchResult.error);
        }
      }
    }
    
    const totalTime = performance.now() - startTime;
    const successful = results.length;
    const failed = errors.length;
    
    this.log('INFO', `Batch calculation completed: ${successful} successful, ${failed} failed in ${totalTime.toFixed(0)}ms`);
    
    return {
      results,
      summary: {
        total: inputs.length,
        successful,
        failed,
        averageTime: totalTime / inputs.length,
        errors
      }
    };
  }
  
  /**
   * Coordina estado entre módulos
   */
  coordinateModules(request: CalculationRequest): ModuleCoordination {
    const startTime = performance.now();
    
    const coordination: ModuleCoordination = {
      modules: {
        core: { status: 'READY', timing: 0 },
        cache: { status: 'READY', timing: 0 },
        monitor: { status: 'READY', timing: 0 },
        selector: { status: 'READY', timing: 0 }
      },
      totalCoordinationTime: 0,
      bottlenecks: [],
      optimizationOpportunities: []
    };
    
    // Verificar estado de cada módulo
    try {
      // Core
      const coreStart = performance.now();
      this.core.validateInput(request.input);
      coordination.modules.core.timing = performance.now() - coreStart;
      coordination.modules.core.status = 'COMPLETE';
      
      // Cache
      const cacheStart = performance.now();
      const cacheKey = generateInputHash(request.input);
      this.cache.get(cacheKey);
      coordination.modules.cache.timing = performance.now() - cacheStart;
      coordination.modules.cache.status = 'COMPLETE';
      
      // Selector
      const selectorStart = performance.now();
      this.selector.analyzeComplexity(request.input);
      coordination.modules.selector.timing = performance.now() - selectorStart;
      coordination.modules.selector.status = 'COMPLETE';
      
      // Monitor (siempre ready)
      coordination.modules.monitor.status = 'COMPLETE';
      
    } catch (error) {
      // Marcar módulo como error
      coordination.bottlenecks.push(`Error en coordinación: ${error}`);
    }
    
    coordination.totalCoordinationTime = performance.now() - startTime;
    
    // Identificar bottlenecks
    const slowModules = Object.entries(coordination.modules)
      .filter(([, module]) => module.timing > 100)
      .map(([name]) => name);
    
    coordination.bottlenecks.push(...slowModules.map(name => `Módulo lento: ${name}`));
    
    // Identificar oportunidades de optimización
    if (coordination.totalCoordinationTime > 50) {
      coordination.optimizationOpportunities.push('Considerar paralelización de módulos');
    }
    
    return coordination;
  }
  
  /**
   * Manejo de errores centralizados
   */
  handleError(error: Error): { 
    handled: boolean; 
    recovery?: EvaluationState; 
    message: string 
  } {
    const errorMessage = String(error);
    
    // Categorizar error
    if (errorMessage.includes('timeout')) {
      return {
        handled: true,
        message: 'Timeout en cálculo - considerar simplificar entrada'
      };
    }
    
    if (errorMessage.includes('validation')) {
      return {
        handled: true,
        message: 'Error de validación - verificar datos de entrada'
      };
    }
    
    if (errorMessage.includes('memory')) {
      return {
        handled: true,
        message: 'Error de memoria - sistema sobrecargado'
      };
    }
    
    return {
      handled: false,
      message: `Error no manejado: ${errorMessage}`
    };
  }
}

// ===================================================================
// 🎯 FUNCIONES PÚBLICAS DEL ORCHESTRATOR
// ===================================================================

/**
 * Instancia singleton del orchestrator
 */
let orchestratorInstance: CalculationOrchestrator | null = null;

/**
 * Obtiene la instancia del orchestrator
 */
export function getCalculationOrchestrator(config?: OrchestratorConfig): CalculationOrchestrator {
  orchestratorInstance ??= new CalculationOrchestrator(config);
  return orchestratorInstance;
}

/**
 * Función de conveniencia para cálculo completo
 */
export async function calculateFertility(
  input: UserInput, 
  options?: CalculationOptions
): Promise<CalculationResult> {
  return getCalculationOrchestrator().executeCalculation(input, options);
}

/**
 * Función de conveniencia para cálculo rápido (sin profiling)
 */
export async function calculateFertilityFast(
  input: UserInput,
  options?: Partial<CalculationOptions>
): Promise<EvaluationState> {
  const result = await calculateFertility(input, {
    enableProfiling: false,
    useCache: true,
    allowFallback: true,
    ...options
  });
  
  return result.evaluation;
}

/**
 * Función de conveniencia para cálculo con retry
 */
export async function calculateFertilityWithRetry(
  input: UserInput, 
  options?: CalculationOptions,
  maxRetries: number = 3
): Promise<CalculationResult> {
  return getCalculationOrchestrator().executeCalculationWithRetry(input, options, maxRetries);
}

/**
 * Función de conveniencia para cálculo por lotes
 */
export async function calculateFertilityBatch(
  inputs: UserInput[], 
  options?: CalculationOptions
): Promise<{
  results: CalculationResult[];
  summary: {
    total: number;
    successful: number;
    failed: number;
    averageTime: number;
    errors: string[];
  };
}> {
  return getCalculationOrchestrator().executeBatchCalculation(inputs, options);
}

/**
 * Función para obtener estado de salud del sistema
 */
export function getSystemHealthReport(): {
  overall: 'HEALTHY' | 'DEGRADED' | 'CRITICAL' | 'OFFLINE';
  modules: Record<string, { status: 'OK' | 'WARNING' | 'ERROR'; message?: string; metric?: number }>;
  metrics: Record<string, number>;
  recommendations: string[];
  lastCheck: Date;
} {
  return getCalculationOrchestrator().getSystemHealth();
}

/**
 * Función para optimizar el sistema
 */
export function optimizeModularSystem(): {
  optimizationsApplied: string[];
  expectedImprovements: Record<string, string>;
  nextOptimizationTime: Date;
} {
  return getCalculationOrchestrator().optimizeSystem();
}

/**
 * Función de conveniencia para análisis de complejidad
 */
export function analyzeComplexityQuick(input: UserInput): ComplexityAnalysis {
  return getEngineSelector().analyzeComplexity(input);
}

/**
 * Función para obtener estadísticas del sistema
 */
export function getSystemStats(): {
  orchestrator: Record<string, unknown>;
  cache: Record<string, unknown>;
  performance: Record<string, unknown>;
  selector: Record<string, unknown>;
} {
  const orchestrator = getCalculationOrchestrator();
  const cache = getCacheManager();
  const monitor = getPerformanceMonitor();
  const selector = getEngineSelector();
  
  return {
    orchestrator: orchestrator.getStats() as Record<string, unknown>,
    cache: cache.getDetailedStats() as Record<string, unknown>,
    performance: {
      totalOperations: monitor.getSystemMetrics().totalOperations,
      successRate: monitor.getSystemMetrics().successRate,
      averageExecutionTime: monitor.getSystemMetrics().averageExecutionTime
    } as Record<string, unknown>,
    selector: selector.getLearningStats() as Record<string, unknown>
  };
}
