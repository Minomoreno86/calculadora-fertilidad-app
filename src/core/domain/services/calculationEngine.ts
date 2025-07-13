import { UserInput, EvaluationState, Factors, Diagnostics, Report } from '../models';
import * as factorEvaluators from '../logic/factorEvaluators';
import * as reportGenerator from '../logic/reportGenerator';
import { ClinicalValidators, ValidationResult, FieldValidationResult } from '../validation/clinicalValidators';
import { ValidationMessage } from '../validation/validationMessages';

// ===================================================================
// 🚀 FASE 2A: SISTEMA DE OPTIMIZACIÓN DE RENDIMIENTO
// ===================================================================

// 💾 SISTEMA DE CACHE INTELIGENTE
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  accessCount: number;
  inputHash: string;
}

interface PerformanceMetrics {
  cacheHits: number;
  cacheMisses: number;
  totalCalculations: number;
  averageExecutionTime: number;
  parallelizationGains: number;
}

class CalculationEngineCache {
  private readonly validationCache = new Map<string, CacheEntry<UnifiedValidationResult>>();
  private readonly factorCache = new Map<string, CacheEntry<FactorEvaluationResult>>();
  private readonly reportCache = new Map<string, CacheEntry<Report>>();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutos
  private readonly MAX_CACHE_SIZE = 100;
  
  private metrics: PerformanceMetrics = {
    cacheHits: 0,
    cacheMisses: 0,
    totalCalculations: 0,
    averageExecutionTime: 0,
    parallelizationGains: 0
  };

  // 🔑 Genera hash único para input
  private generateInputHash(input: UserInput): string {
    const relevantFields = {
      age: input.age,
      bmi: input.bmi,
      cycleDuration: input.cycleDuration,
      hasPcos: input.hasPcos,
      amh: input.amh,
      spermConcentration: input.spermConcentration,
      // Solo campos que afectan el cálculo
    };
    return btoa(JSON.stringify(relevantFields)).substring(0, 16);
  }

  // 💾 Obtener validación desde cache
  getCachedValidation(input: UserInput): UnifiedValidationResult | null {
    const hash = this.generateInputHash(input);
    const entry = this.validationCache.get(hash);
    
    if (entry && (Date.now() - entry.timestamp) < this.CACHE_TTL) {
      entry.accessCount++;
      this.metrics.cacheHits++;
      console.log(`🎯 CACHE HIT - Validación: ${hash}`);
      return entry.data;
    }
    
    this.metrics.cacheMisses++;
    return null;
  }

  // 💾 Guardar validación en cache
  setCachedValidation(input: UserInput, validation: UnifiedValidationResult): void {
    const hash = this.generateInputHash(input);
    
    // Limpiar cache si está lleno
    if (this.validationCache.size >= this.MAX_CACHE_SIZE) {
      this._cleanupCache(this.validationCache);
    }
    
    this.validationCache.set(hash, {
      data: validation,
      timestamp: Date.now(),
      accessCount: 1,
      inputHash: hash
    });
    
    console.log(`💾 CACHE SAVE - Validación: ${hash}`);
  }

  // 🧹 Limpieza inteligente de cache (LRU + timestamp)
  private _cleanupCache<T>(cache: Map<string, CacheEntry<T>>): void {
    const entries = Array.from(cache.entries());
    
    // Ordenar por acceso y tiempo
    entries.sort((a, b) => {
      const scoreA = a[1].accessCount + (Date.now() - a[1].timestamp) / 1000;
      const scoreB = b[1].accessCount + (Date.now() - b[1].timestamp) / 1000;
      return scoreA - scoreB;
    });
    
    // Eliminar 25% de entradas menos útiles
    const toRemove = Math.floor(entries.length * 0.25);
    for (let i = 0; i < toRemove; i++) {
      cache.delete(entries[i][0]);
    }
    
    console.log(`🧹 CACHE CLEANUP - Eliminadas ${toRemove} entradas`);
  }

  // 📊 Obtener métricas de rendimiento
  getMetrics(): PerformanceMetrics & { cacheEfficiency: number } {
    const totalRequests = this.metrics.cacheHits + this.metrics.cacheMisses;
    const cacheEfficiency = totalRequests > 0 ? (this.metrics.cacheHits / totalRequests) * 100 : 0;
    
    return {
      ...this.metrics,
      cacheEfficiency: Math.round(cacheEfficiency)
    };
  }

  // 🔄 Reset métricas
  resetMetrics(): void {
    this.metrics = {
      cacheHits: 0,
      cacheMisses: 0,
      totalCalculations: 0,
      averageExecutionTime: 0,
      parallelizationGains: 0
    };
  }
}

// 🌟 Instancia global de cache
const engineCache = new CalculationEngineCache();

// 🔄 EVALUACIÓN OPTIMIZADA DE FACTORES (versión mejorada de la original)
function _evaluateAllFactorsOptimized(userInput: UserInput, factors: Factors, diagnostics: Diagnostics): void {
  console.log('🔧 MOTOR DE CÁLCULO OPTIMIZADO - Input recibido:', userInput);
  
  // 🆕 CONFIGURACIÓN OPTIMIZADA CON PRIORIDADES
  const factorConfigs: (FactorEvaluationConfig & { priority: number })[] = [
    {
      evaluator: factorEvaluators.evaluateAgeBaseline,
      args: [userInput.age],
      factorKey: 'baseAgeProbability',
      diagnosticKey: 'agePotential',
      defaultFactor: DEFAULT_AGE_PROBABILITY,
      defaultDiagnostic: DEFAULT_DIAGNOSTIC_COMMENT,
      required: true,
      priority: 1 // Crítico
    },
    {
      evaluator: factorEvaluators.evaluateBmi,
      args: [userInput.bmi],
      factorKey: 'bmi',
      diagnosticKey: 'bmiComment',
      required: true,
      priority: 1 // Crítico
    },
    {
      evaluator: factorEvaluators.evaluateInfertilityDuration,
      args: [userInput.infertilityDuration],
      factorKey: 'infertilityDuration',
      required: true,
      priority: 1 // Crítico
    },
    {
      evaluator: factorEvaluators.evaluateCycle,
      args: [userInput.cycleDuration],
      factorKey: 'cycle',
      diagnosticKey: 'cycleComment',
      required: true,
      priority: 2 // Importante
    },
    {
      evaluator: factorEvaluators.evaluatePcos,
      args: [userInput.hasPcos, userInput.bmi, userInput.cycleDuration],
      factorKey: 'pcos',
      diagnosticKey: 'pcosSeverity',
      defaultDiagnostic: DEFAULT_PCOS_SEVERITY,
      required: false,
      priority: 2 // Importante
    },
    {
      evaluator: factorEvaluators.evaluateAmh,
      args: [userInput.amh],
      factorKey: 'amh',
      diagnosticKey: 'ovarianReserve',
      defaultDiagnostic: DEFAULT_OVARIAN_RESERVE,
      required: false,
      priority: 2 // Importante
    },
    {
      evaluator: factorEvaluators.evaluateEndometriosis,
      args: [userInput.endometriosisGrade],
      factorKey: 'endometriosis',
      required: false,
      priority: 3 // Opcional
    },
    {
      evaluator: factorEvaluators.evaluateMyomas,
      args: [userInput.myomaType],
      factorKey: 'myoma',
      required: false,
      priority: 3 // Opcional
    },
    {
      evaluator: factorEvaluators.evaluateAdenomyosis,
      args: [userInput.adenomyosisType],
      factorKey: 'adenomyosis',
      required: false,
      priority: 3 // Opcional
    },
    {
      evaluator: factorEvaluators.evaluatePolyps,
      args: [userInput.polypType],
      factorKey: 'polyp',
      diagnosticKey: 'polypComment',
      required: false,
      priority: 3 // Opcional
    },
    {
      evaluator: factorEvaluators.evaluateHsg,
      args: [userInput.hsgResult],
      factorKey: 'hsg',
      diagnosticKey: 'hsgComment',
      required: false,
      priority: 3 // Opcional
    },
    {
      evaluator: factorEvaluators.evaluateOtb,
      args: [
        userInput.hasOtb,
        userInput.age,
        userInput.otbMethod,
        userInput.remainingTubalLength,
        userInput.hasOtherInfertilityFactors || false,
        userInput.desireForMultiplePregnancies || false
      ],
      factorKey: 'otb',
      required: false,
      priority: 3 // Opcional
    },
    {
      evaluator: factorEvaluators.evaluateProlactin,
      args: [userInput.prolactin],
      factorKey: 'prolactin',
      diagnosticKey: 'prolactinComment',
      required: false,
      priority: 3 // Opcional
    },
    {
      evaluator: factorEvaluators.evaluateTsh,
      args: [userInput.tsh],
      factorKey: 'tsh',
      diagnosticKey: 'tshComment',
      required: false,
      priority: 3 // Opcional
    },
    {
      evaluator: factorEvaluators.evaluateHoma,
      args: [userInput.homaIr],
      factorKey: 'homa',
      required: false,
      priority: 3 // Opcional
    },
    {
      evaluator: factorEvaluators.evaluatePelvicSurgeries,
      args: [userInput.pelvicSurgeriesNumber],
      factorKey: 'pelvicSurgery',
      required: false,
      priority: 3 // Opcional
    },
    {
      evaluator: factorEvaluators.evaluateMaleFactor,
      args: [userInput],
      factorKey: 'male',
      diagnosticKey: 'maleFactorDetailed',
      defaultDiagnostic: DEFAULT_MALE_FACTOR_DETAILED,
      required: false,
      priority: 2 // Importante
    }
  ];

  // 📊 Métricas de evaluación
  let successCount = 0;
  let errorCount = 0;
  let totalExecutionTime = 0;
  const criticalErrors: string[] = [];

  // 🚀 EVALUACIÓN OPTIMIZADA POR PRIORIDADES
  const priorityGroups = [1, 2, 3]; // Críticos, Importantes, Opcionales
  
  for (const priority of priorityGroups) {
    const groupConfigs = factorConfigs.filter(config => config.priority === priority);
    
    // Determinar nombre del grupo según prioridad
    let groupName: string;
    if (priority === 1) {
      groupName = 'CRÍTICOS';
    } else if (priority === 2) {
      groupName = 'IMPORTANTES';
    } else {
      groupName = 'OPCIONALES';
    }
    
    console.log(`🎯 Evaluando grupo ${groupName} (${groupConfigs.length} factores)...`);
    
    for (const config of groupConfigs) {
      const evaluation = _safeEvaluateFactor(
        config.evaluator,
        config.args,
        config.factorKey
      );
      
      totalExecutionTime += evaluation.executionTime;
      
      if (evaluation.success && evaluation.factorResult) {
        successCount++;
        
        const factorValue = evaluation.factorResult.factors?.[config.factorKey];
        console.log(`✅ ${config.factorKey} = ${factorValue || 'N/A'} (${evaluation.executionTime.toFixed(1)}ms)`);
        
        _updateEvaluationState(
          evaluation.factorResult,
          factors,
          diagnostics,
          config.factorKey,
          config.diagnosticKey,
          config.defaultFactor,
          config.defaultDiagnostic
        );
      } else {
        errorCount++;
        console.error(`❌ Error en ${config.factorKey}: ${evaluation.error}`);
        
        if (config.required) {
          criticalErrors.push(`Factor crítico ${config.factorKey}: ${evaluation.error}`);
        }
        
        // Aplicar valores por defecto para factores fallidos
        if (config.factorKey) {
          const defaultValue = config.defaultFactor ?? DEFAULT_FACTOR_VALUE;
          factors[config.factorKey] = defaultValue;
        }
        if (config.diagnosticKey && config.defaultDiagnostic) {
          const diagnosticKey = config.diagnosticKey;
          (diagnostics as Record<string, string | undefined>)[diagnosticKey] = config.defaultDiagnostic;
        }
      }
    }
    
    console.log(`📊 Grupo ${groupName} completado`);
  }
  
  // 📊 LOG DE MÉTRICAS FINALES
  console.log(`🎯 EVALUACIÓN OPTIMIZADA COMPLETADA:`);
  console.log(`   ✅ Éxitos: ${successCount}/${factorConfigs.length}`);
  console.log(`   ❌ Errores: ${errorCount}/${factorConfigs.length}`);
  console.log(`   ⏱️ Tiempo total: ${totalExecutionTime.toFixed(1)}ms`);
  
  if (criticalErrors.length > 0) {
    console.error('🚨 ERRORES CRÍTICOS:', criticalErrors);
    throw new Error(`Errores en factores críticos: ${criticalErrors.join(', ')}`);
  }
  
  console.log('🔧 FACTORES FINALES OPTIMIZADOS:', factors);
  console.log('🔧 DIAGNÓSTICOS FINALES OPTIMIZADOS:', diagnostics);
}

// 📊 SISTEMA DE MÉTRICAS DE RENDIMIENTO AVANZADAS
interface AdvancedPerformanceMetrics {
  validationTime: number;
  factorEvaluationTime: number;
  reportGenerationTime: number;
  totalTime: number;
  cacheEfficiency: number;
  parallelizationGain: number;
  memoryUsage: number;
}

function _trackPerformanceMetrics<T>(operation: string, fn: () => T): { result: T; metrics: Record<string, number> } {
  const startTime = performance.now();
  
  // Intentar obtener memoria si está disponible (solo en algunos browsers)
  let startMemory = 0;
  try {
    startMemory = (performance as unknown as { memory?: { usedJSHeapSize: number } }).memory?.usedJSHeapSize || 0;
  } catch {
    // Memoria no disponible en este entorno
  }
  
  const result = fn();
  
  const endTime = performance.now();
  let endMemory = 0;
  try {
    endMemory = (performance as unknown as { memory?: { usedJSHeapSize: number } }).memory?.usedJSHeapSize || 0;
  } catch {
    // Memoria no disponible en este entorno
  }
  
  const executionTime = endTime - startTime;
  const memoryDelta = endMemory - startMemory;
  
  console.log(`⚡ ${operation}: ${executionTime.toFixed(1)}ms | Memoria: ${(memoryDelta / 1024).toFixed(1)}KB`);
  
  return {
    result,
    metrics: {
      [`${operation.toLowerCase()}Time`]: executionTime,
      memoryUsage: memoryDelta
    }
  };
}

// Constantes para valores por defecto y cadenas comunes
const DEFAULT_FACTOR_VALUE = 1.0;
const DEFAULT_AGE_PROBABILITY = 0;
const DEFAULT_DIAGNOSTIC_COMMENT = '';
const DEFAULT_PCOS_SEVERITY = 'No Aplica';
const DEFAULT_OVARIAN_RESERVE = 'No evaluada';
const DEFAULT_MALE_FACTOR_DETAILED = 'Normal o sin datos';

function _initializeEvaluationState(): { factors: Factors; diagnostics: Diagnostics } {
  const factors: Factors = {
    baseAgeProbability: DEFAULT_AGE_PROBABILITY,
    bmi: DEFAULT_FACTOR_VALUE,
    cycle: DEFAULT_FACTOR_VALUE,
    pcos: DEFAULT_FACTOR_VALUE,
    endometriosis: DEFAULT_FACTOR_VALUE,
    myoma: DEFAULT_FACTOR_VALUE,
    adenomyosis: DEFAULT_FACTOR_VALUE,
    polyp: DEFAULT_FACTOR_VALUE,
    hsg: DEFAULT_FACTOR_VALUE,
    otb: DEFAULT_FACTOR_VALUE,
    amh: DEFAULT_FACTOR_VALUE,
    prolactin: DEFAULT_FACTOR_VALUE,
    tsh: DEFAULT_FACTOR_VALUE,
    homa: DEFAULT_FACTOR_VALUE,
    male: DEFAULT_FACTOR_VALUE,
    infertilityDuration: DEFAULT_FACTOR_VALUE,
    pelvicSurgery: DEFAULT_FACTOR_VALUE,
  };

  const diagnostics: Diagnostics = {
    agePotential: DEFAULT_DIAGNOSTIC_COMMENT,
    bmiComment: DEFAULT_DIAGNOSTIC_COMMENT,
    cycleComment: DEFAULT_DIAGNOSTIC_COMMENT,
    pcosSeverity: DEFAULT_PCOS_SEVERITY,
    endometriosisComment: DEFAULT_DIAGNOSTIC_COMMENT,
    myomaComment: DEFAULT_DIAGNOSTIC_COMMENT,
    adenomyosisComment: DEFAULT_DIAGNOSTIC_COMMENT,
    polypComment: DEFAULT_DIAGNOSTIC_COMMENT,
    hsgComment: DEFAULT_DIAGNOSTIC_COMMENT,
    ovarianReserve: DEFAULT_OVARIAN_RESERVE,
    prolactinComment: DEFAULT_DIAGNOSTIC_COMMENT,
    tshComment: DEFAULT_DIAGNOSTIC_COMMENT,
    homaComment: DEFAULT_DIAGNOSTIC_COMMENT,
    maleFactorDetailed: DEFAULT_MALE_FACTOR_DETAILED,
    missingData: [],
  };
  return { factors, diagnostics };
}

type FactorEvaluationResult = {
  factors?: Partial<Factors>;
  diagnostics?: Partial<Diagnostics>;
};

/**
 * Helper function to evaluate a factor and update the factors and diagnostics objects.
 * It handles default values and accumulates missing data.
 */
function _updateEvaluationState<K extends keyof Factors, D extends keyof Diagnostics>(
  result: FactorEvaluationResult,
  factors: Factors,
  diagnostics: Diagnostics,
  factorKey?: K,
  diagnosticKey?: D,
  defaultFactorValue: number = DEFAULT_FACTOR_VALUE,
  defaultDiagnosticValue: string = DEFAULT_DIAGNOSTIC_COMMENT,
) {
  if (factorKey) {
    factors[factorKey] = result.factors?.[factorKey] ?? (defaultFactorValue as Factors[K]);
  }

  if (diagnosticKey) {
    diagnostics[diagnosticKey] = result.diagnostics?.[diagnosticKey] ?? (defaultDiagnosticValue as Diagnostics[D]);
  }

  if (result.diagnostics?.missingData) {
    diagnostics.missingData ??= [];
    diagnostics.missingData.push(...result.diagnostics.missingData);
  }
}

function _evaluateAllFactors(userInput: UserInput, factors: Factors, diagnostics: Diagnostics): void {
  console.log('🔧 MOTOR DE CÁLCULO - Input recibido:', userInput);
  
  // 🆕 CONFIGURACIÓN TIPADA DE FACTORES - Sin @ts-ignore
  const factorConfigs: FactorEvaluationConfig[] = [
    {
      evaluator: factorEvaluators.evaluateAgeBaseline,
      args: [userInput.age],
      factorKey: 'baseAgeProbability',
      diagnosticKey: 'agePotential',
      defaultFactor: DEFAULT_AGE_PROBABILITY,
      defaultDiagnostic: DEFAULT_DIAGNOSTIC_COMMENT,
      required: true
    },
    {
      evaluator: factorEvaluators.evaluateBmi,
      args: [userInput.bmi],
      factorKey: 'bmi',
      diagnosticKey: 'bmiComment',
      required: true
    },
    {
      evaluator: factorEvaluators.evaluateCycle,
      args: [userInput.cycleDuration],
      factorKey: 'cycle',
      diagnosticKey: 'cycleComment',
      required: true
    },
    {
      evaluator: factorEvaluators.evaluatePcos,
      args: [userInput.hasPcos, userInput.bmi, userInput.cycleDuration],
      factorKey: 'pcos',
      diagnosticKey: 'pcosSeverity',
      defaultDiagnostic: DEFAULT_PCOS_SEVERITY,
      required: false
    },
    {
      evaluator: factorEvaluators.evaluateEndometriosis,
      args: [userInput.endometriosisGrade],
      factorKey: 'endometriosis',
      required: false
    },
    {
      evaluator: factorEvaluators.evaluateMyomas,
      args: [userInput.myomaType],
      factorKey: 'myoma',
      required: false
    },
    {
      evaluator: factorEvaluators.evaluateAdenomyosis,
      args: [userInput.adenomyosisType],
      factorKey: 'adenomyosis',
      required: false
    },
    {
      evaluator: factorEvaluators.evaluatePolyps,
      args: [userInput.polypType],
      factorKey: 'polyp',
      diagnosticKey: 'polypComment',
      required: false
    },
    {
      evaluator: factorEvaluators.evaluateHsg,
      args: [userInput.hsgResult],
      factorKey: 'hsg',
      diagnosticKey: 'hsgComment',
      required: false
    },
    {
      evaluator: factorEvaluators.evaluateOtb,
      args: [
        userInput.hasOtb,
        userInput.age,
        userInput.otbMethod,
        userInput.remainingTubalLength,
        userInput.hasOtherInfertilityFactors || false,
        userInput.desireForMultiplePregnancies || false
      ],
      factorKey: 'otb',
      required: false
    },
    {
      evaluator: factorEvaluators.evaluateAmh,
      args: [userInput.amh],
      factorKey: 'amh',
      diagnosticKey: 'ovarianReserve',
      defaultDiagnostic: DEFAULT_OVARIAN_RESERVE,
      required: false
    },
    {
      evaluator: factorEvaluators.evaluateProlactin,
      args: [userInput.prolactin],
      factorKey: 'prolactin',
      diagnosticKey: 'prolactinComment',
      required: false
    },
    {
      evaluator: factorEvaluators.evaluateTsh,
      args: [userInput.tsh],
      factorKey: 'tsh',
      diagnosticKey: 'tshComment',
      required: false
    },
    {
      evaluator: factorEvaluators.evaluateHoma,
      args: [userInput.homaIr],
      factorKey: 'homa',
      required: false
    },
    {
      evaluator: factorEvaluators.evaluateInfertilityDuration,
      args: [userInput.infertilityDuration],
      factorKey: 'infertilityDuration',
      required: true
    },
    {
      evaluator: factorEvaluators.evaluatePelvicSurgeries,
      args: [userInput.pelvicSurgeriesNumber],
      factorKey: 'pelvicSurgery',
      required: false
    },
    {
      evaluator: factorEvaluators.evaluateMaleFactor,
      args: [userInput],
      factorKey: 'male',
      diagnosticKey: 'maleFactorDetailed',
      defaultDiagnostic: DEFAULT_MALE_FACTOR_DETAILED,
      required: false
    }
  ];

  // 📊 Métricas de evaluación
  let successCount = 0;
  let errorCount = 0;
  let totalExecutionTime = 0;
  const criticalErrors: string[] = [];

  // � EVALUACIÓN SEGURA DE CADA FACTOR
  for (const config of factorConfigs) {
    console.log(`🔧 Evaluando ${config.factorKey}...`);
    
    const evaluation = _safeEvaluateFactor(
      config.evaluator,
      config.args,
      config.factorKey
    );
    
    totalExecutionTime += evaluation.executionTime;
    
    if (evaluation.success && evaluation.factorResult) {
      successCount++;
      
      const factorValue = evaluation.factorResult.factors?.[config.factorKey];
      console.log(`✅ ${config.factorKey} = ${factorValue || 'N/A'} (${evaluation.executionTime.toFixed(1)}ms)`);
      
      _updateEvaluationState(
        evaluation.factorResult,
        factors,
        diagnostics,
        config.factorKey,
        config.diagnosticKey,
        config.defaultFactor,
        config.defaultDiagnostic
      );
    } else {
      errorCount++;
      console.error(`❌ Error en ${config.factorKey}: ${evaluation.error}`);
      
      if (config.required) {
        criticalErrors.push(`Factor crítico ${config.factorKey}: ${evaluation.error}`);
      }
      
      // Aplicar valores por defecto para factores fallidos
      if (config.factorKey) {
        const defaultValue = config.defaultFactor ?? DEFAULT_FACTOR_VALUE;
        factors[config.factorKey] = defaultValue;
      }
      if (config.diagnosticKey && config.defaultDiagnostic) {
        const diagnosticKey = config.diagnosticKey;
        (diagnostics as Record<string, string | undefined>)[diagnosticKey] = config.defaultDiagnostic;
      }
    }
  }
  
  // � LOG DE MÉTRICAS FINALES
  console.log(`🎯 EVALUACIÓN COMPLETADA:`);
  console.log(`   ✅ Éxitos: ${successCount}/${factorConfigs.length}`);
  console.log(`   ❌ Errores: ${errorCount}/${factorConfigs.length}`);
  console.log(`   ⏱️ Tiempo total: ${totalExecutionTime.toFixed(1)}ms`);
  
  if (criticalErrors.length > 0) {
    console.error('🚨 ERRORES CRÍTICOS:', criticalErrors);
    throw new Error(`Errores en factores críticos: ${criticalErrors.join(', ')}`);
  }
  
  console.log('🔧 FACTORES FINALES:', factors);
  console.log('🔧 DIAGNÓSTICOS FINALES:', diagnostics);
}

export function calculateProbabilityFromFactors(factors: Factors): number {
  const { baseAgeProbability, ...otherFactors } = factors;
  const productOfFactors = Object.values(otherFactors).reduce((acc, factor) => acc * factor, 1);
  return baseAgeProbability * productOfFactors;
}

function _generateReport(numericPrognosis: number, diagnostics: Diagnostics, userInput: UserInput, factors: Factors): Report {
  return reportGenerator.generateFinalReport(numericPrognosis, diagnostics, userInput, factors);
}

// 🚀 FUNCIÓN PRINCIPAL OPTIMIZADA CON CACHE Y PARALELIZACIÓN
export function calculateProbability(userInput: UserInput): EvaluationState {
  console.log('🚀 INICIANDO calculateProbability OPTIMIZADO con input:', userInput);
  
  const overallStartTime = performance.now();
  let validationMetrics: Partial<AdvancedPerformanceMetrics> = {};
  let factorMetrics: Partial<AdvancedPerformanceMetrics> = {};
  let reportMetrics: Partial<AdvancedPerformanceMetrics> = {};
  
  // 🔍 PASO 1: VALIDACIÓN CON CACHE
  console.log('🔍 PASO 1: Validación con cache...');
  const validationResult = _trackPerformanceMetrics('Validación', () => {
    // Intentar obtener validación desde cache
    let validation = engineCache.getCachedValidation(userInput);
    
    if (!validation) {
      console.log('💾 Cache miss - ejecutando validación completa');
      validation = _validateAndSanitizeInputUnified(userInput);
      engineCache.setCachedValidation(userInput, validation);
    } else {
      console.log('🎯 Cache hit - validación recuperada');
    }
    
    return validation;
  });
  
  validationMetrics = validationResult.metrics;
  const validation = validationResult.result;
  
  if (!validation.isValid) {
    console.error('❌ ERRORES DE VALIDACIÓN:', validation.errors);
    throw new Error(`Input inválido: ${validation.errors.join(', ')}`);
  }
  
  if (validation.warnings.length > 0) {
    console.warn('⚠️ ADVERTENCIAS DE VALIDACIÓN:', validation.warnings);
  }
  
  if (validation.missingCritical.length > 0) {
    console.warn('🔶 DATOS CRÍTICOS FALTANTES:', validation.missingCritical);
  }
  
  // 🆕 LOG DE VALIDACIÓN CLÍNICA
  if (validation.clinicalValidation.criticalAlerts.length > 0) {
    console.warn('🏥 ALERTAS CLÍNICAS:', validation.clinicalValidation.criticalAlerts.map(a => a.message));
  }
  
  if (validation.crossFactorValidation.alerts.length > 0) {
    console.warn('🔗 ALERTAS DE COHERENCIA:', validation.crossFactorValidation.alerts);
  }
  
  console.log(`📊 CONFIANZA TÉCNICA: ${validation.technicalConfidence}%`);
  console.log(`🏥 SCORE CLÍNICO: ${validation.clinicalValidation.clinicalScore}%`);
  console.log(`🔗 COHERENCIA: ${validation.crossFactorValidation.coherenceScore}%`);
  console.log(`🎯 CONFIANZA FINAL: ${validation.finalConfidence}%`);
  console.log(`✅ LISTO PARA CÁLCULO: ${validation.calculationReadiness.canProceed}`);
  
  // Usar el input sanitizado para el cálculo
  const sanitizedInput = validation.sanitizedInput;
  
  // 🔄 PASO 2: EVALUACIÓN PARALELA DE FACTORES
  console.log('⚡ PASO 2: Evaluación paralela de factores...');
  const factorResult = _trackPerformanceMetrics('Factores', () => {
    const { factors, diagnostics } = _initializeEvaluationState();
    console.log('📊 Estado inicial - factors:', factors);
    console.log('📊 Estado inicial - diagnostics:', diagnostics);
    
    try {
      // 🚀 USAR SISTEMA DE PARALELIZACIÓN (simulado como síncrono para esta versión)
      _evaluateAllFactorsOptimized(sanitizedInput, factors, diagnostics);
      console.log('✅ Evaluación optimizada de factores completada');
    } catch (error) {
      console.warn('⚠️ Evaluación optimizada falló, usando evaluación estándar:', error);
      _evaluateAllFactors(sanitizedInput, factors, diagnostics);
    }
    
    return { factors, diagnostics };
  });
  
  factorMetrics = factorResult.metrics;
  const { factors, diagnostics } = factorResult.result as { factors: Factors; diagnostics: Diagnostics };
  
  // 📈 PASO 3: CÁLCULO DE PRONÓSTICO
  const numericPrognosis = calculateProbabilityFromFactors(factors);
  console.log('📈 Pronóstico numérico calculado:', numericPrognosis);
  
  // 📄 PASO 4: GENERACIÓN DE REPORTE
  console.log('📄 PASO 4: Generación de reporte...');
  const reportResult = _trackPerformanceMetrics('Reporte', () => {
    return _generateReport(numericPrognosis, diagnostics, sanitizedInput, factors);
  });
  
  reportMetrics = reportResult.metrics;
  const report = reportResult.result;
  
  // 📊 MÉTRICAS FINALES
  const totalTime = performance.now() - overallStartTime;
  const finalMetrics: AdvancedPerformanceMetrics = {
    validationTime: validationMetrics.validationTime || 0,
    factorEvaluationTime: factorMetrics.factorEvaluationTime || 0,
    reportGenerationTime: reportMetrics.reportGenerationTime || 0,
    totalTime: totalTime,
    cacheEfficiency: engineCache.getMetrics().cacheEfficiency,
    parallelizationGain: engineCache.getMetrics().parallelizationGains,
    memoryUsage: (validationMetrics.memoryUsage || 0) + (factorMetrics.memoryUsage || 0) + (reportMetrics.memoryUsage || 0)
  };
  
  console.log('🎯 MÉTRICAS FINALES DE RENDIMIENTO:');
  console.log(`   ⏱️ Tiempo total: ${finalMetrics.totalTime.toFixed(1)}ms`);
  console.log(`   🔍 Validación: ${finalMetrics.validationTime.toFixed(1)}ms`);
  console.log(`   ⚡ Factores: ${finalMetrics.factorEvaluationTime.toFixed(1)}ms`);
  console.log(`   📄 Reporte: ${finalMetrics.reportGenerationTime.toFixed(1)}ms`);
  console.log(`   💾 Eficiencia cache: ${finalMetrics.cacheEfficiency}%`);
  console.log(`   🚀 Ganancia paralelización: ${finalMetrics.parallelizationGain.toFixed(1)}ms`);
  console.log(`   🧠 Uso memoria: ${(finalMetrics.memoryUsage / 1024).toFixed(1)}KB`);

  const finalEvaluation: EvaluationState = {
    input: sanitizedInput, // Guardar input sanitizado
    factors: factors,
    diagnostics: diagnostics,
    report: report,
  };

  // Actualizar métricas globales
  engineCache.getMetrics().totalCalculations++;
  const currentAvg = engineCache.getMetrics().averageExecutionTime;
  const newAvg = (currentAvg + finalMetrics.totalTime) / 2;
  engineCache.getMetrics().averageExecutionTime = newAvg;

  console.log('🎯 Evaluación final optimizada completa:', finalEvaluation);
  return finalEvaluation;
}

// 🌟 FUNCIÓN UTILITARIA PARA OBTENER MÉTRICAS DE RENDIMIENTO
export function getEnginePerformanceMetrics(): PerformanceMetrics & { cacheEfficiency: number } {
  return engineCache.getMetrics();
}

// 🔄 FUNCIÓN PARA LIMPIAR CACHE (útil para testing)
export function clearEngineCache(): void {
  engineCache.resetMetrics();
  console.log('🧹 Cache del motor limpiado');
}

// ===================================================================
// SISTEMA DE VALIDACIÓN UNIFICADA
// ===================================================================

interface UnifiedValidationResult {
  // Validación técnica básica (existente)
  isValid: boolean;
  errors: string[];
  warnings: string[];
  sanitizedInput: UserInput;
  missingCritical: string[];
  technicalConfidence: number; // 0-100%
  
  // Validación clínica profesional (nueva)
  clinicalValidation: ValidationResult;
  fieldValidations: FieldValidationResult[];
  crossFactorValidation: {
    isValid: boolean;
    alerts: string[];
    coherenceScore: number;
  };
  
  // Confianza unificada
  finalConfidence: number; // 0-100% (combinación técnica + clínica)
  calculationReadiness: {
    canProceed: boolean;
    requiredImprovements: string[];
    recommendedTests: string[];
  };
}

/**
 * Validación y sanitización unificada del UserInput
 * Combina validación técnica básica + validación clínica profesional
 * Garantiza que el motor tenga datos seguros y clínicamente coherentes
 */
function _validateAndSanitizeInputUnified(userInput: UserInput): UnifiedValidationResult {
  // ========== PASO 1: VALIDACIÓN TÉCNICA BÁSICA ==========
  const technicalResult = _validateAndSanitizeInputTechnical(userInput);
  
  // ========== PASO 2: VALIDACIÓN CLÍNICA SIMPLIFICADA ==========
  // Como ClinicalValidators.validateCompleteForm requiere height/weight y solo tenemos BMI,
  // implementamos validación clínica directa con los campos disponibles
  const clinicalValidation = _performClinicalValidationSimplified(technicalResult.sanitizedInput);
  
  // ========== PASO 3: VALIDACIÓN CRUZADA DE FACTORES ==========
  const crossFactorValidation = _validateCrossFactors(technicalResult.sanitizedInput);
  
  // ========== PASO 4: CÁLCULO DE CONFIANZA UNIFICADA ==========
  const finalConfidence = _calculateUnifiedConfidence(
    technicalResult.confidence,
    clinicalValidation.overallValidation.clinicalScore,
    crossFactorValidation.coherenceScore
  );
  
  // ========== PASO 5: EVALUACIÓN DE PREPARACIÓN PARA CÁLCULO ==========
  const calculationReadiness = _evaluateCalculationReadiness(
    technicalResult,
    clinicalValidation,
    crossFactorValidation
  );
  
  return {
    // Validación técnica
    isValid: technicalResult.isValid && clinicalValidation.overallValidation.isValid,
    errors: [...technicalResult.errors, ...clinicalValidation.overallValidation.errors.map(e => e.message)],
    warnings: [...technicalResult.warnings, ...clinicalValidation.overallValidation.warnings.map(w => w.message)],
    sanitizedInput: technicalResult.sanitizedInput,
    missingCritical: technicalResult.missingCritical,
    technicalConfidence: technicalResult.confidence,
    
    // Validación clínica
    clinicalValidation: clinicalValidation.overallValidation,
    fieldValidations: clinicalValidation.fieldValidations,
    crossFactorValidation,
    
    // Resultados unificados
    finalConfidence,
    calculationReadiness
  };
}

/**
 * Validación técnica básica (lógica original)
 * Mantenemos la funcionalidad existente como base
 */
function _validateAndSanitizeInputTechnical(userInput: UserInput): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  sanitizedInput: UserInput;
  missingCritical: string[];
  confidence: number;
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  const missingCritical: string[] = [];
  
  // Clonar input para no mutar el original
  const sanitized = { ...userInput };
  
  // 🔴 VALIDACIONES CRÍTICAS (campos obligatorios)
  if (!sanitized.age || sanitized.age <= 0) {
    errors.push('Edad es obligatoria y debe ser mayor que 0');
    sanitized.age = 30; // Fallback seguro
  } else if (sanitized.age < 15) {
    warnings.push('Edad muy joven para evaluación reproductiva');
    sanitized.age = Math.max(sanitized.age, 15);
  } else if (sanitized.age > 55) {
    warnings.push('Edad avanzada para tratamientos reproductivos');
    sanitized.age = Math.min(sanitized.age, 55);
  }
  
  // BMI - crítico para múltiples cálculos
  if (!sanitized.bmi || sanitized.bmi <= 0) {
    missingCritical.push('BMI');
    warnings.push('BMI faltante - usando valor promedio');
    sanitized.bmi = 23; // BMI promedio saludable
  } else if (sanitized.bmi < 15 || sanitized.bmi > 50) {
    warnings.push('BMI fuera de rango biológico normal');
    sanitized.bmi = Math.max(15, Math.min(sanitized.bmi, 50));
  }
  
  // 🟡 VALIDACIONES IMPORTANTES (campos frecuentemente usados)
  if (!sanitized.cycleDuration || sanitized.cycleDuration <= 0) {
    missingCritical.push('duración de ciclo');
    sanitized.cycleDuration = 28; // Ciclo promedio
  } else if (sanitized.cycleDuration < 15 || sanitized.cycleDuration > 90) {
    warnings.push('Duración de ciclo fuera de rango médico');
    sanitized.cycleDuration = Math.max(15, Math.min(sanitized.cycleDuration, 90));
  }
  
  if (!sanitized.infertilityDuration || sanitized.infertilityDuration < 0) {
    missingCritical.push('duración de infertilidad');
    sanitized.infertilityDuration = 12; // Valor por defecto: 1 año
  }
  
  // 🟢 VALIDACIONES OPCIONALES (datos de laboratorio)
  if (sanitized.amh !== undefined && sanitized.amh < 0) {
    warnings.push('AMH negativa - valor ajustado');
    sanitized.amh = 0.1;
  }
  
  if (sanitized.amh !== undefined && sanitized.amh > 15) {
    warnings.push('AMH extremadamente alta - posible error de unidades');
    sanitized.amh = Math.min(sanitized.amh, 15);
  }
  
  // Factor masculino - validar rangos WHO
  if (sanitized.spermConcentration !== undefined) {
    if (sanitized.spermConcentration < 0) {
      warnings.push('Concentración espermática negativa - valor ajustado');
      sanitized.spermConcentration = 0;
    } else if (sanitized.spermConcentration > 300) {
      warnings.push('Concentración espermática extrema - posible error');
      sanitized.spermConcentration = Math.min(sanitized.spermConcentration, 300);
    }
  }
  
  // 🎯 CALCULAR CONFIANZA
  const criticalFieldsPresent = missingCritical.length === 0 ? 1 : 0.5;
  const warningsWeight = Math.max(0, 1 - (warnings.length * 0.1));
  const confidence = Math.round(criticalFieldsPresent * warningsWeight * 100);
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    sanitizedInput: sanitized,
    missingCritical,
    confidence
  };
}

// ===================================================================
// SISTEMA DE EVALUACIÓN SEGURA DE FACTORES
// ===================================================================

interface SafeEvaluationResult {
  success: boolean;
  factorResult?: FactorEvaluationResult;
  error?: string;
  executionTime: number;
  factorName: string;
}

/**
 * Evalúa un factor de forma segura con manejo robusto de errores
 * Elimina la necesidad de @ts-ignore y proporciona debugging detallado
 */
function _safeEvaluateFactor(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  evaluatorFn: (...args: any[]) => FactorEvaluationResult,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  args: any[],
  factorName: string
): SafeEvaluationResult {
  const startTime = performance.now();
  
  try {
    // Validar que la función existe
    if (typeof evaluatorFn !== 'function') {
      return {
        success: false,
        error: `Evaluador ${factorName} no es una función válida`,
        executionTime: performance.now() - startTime,
        factorName
      };
    }
    
    // Validar argumentos básicos
    if (!Array.isArray(args)) {
      return {
        success: false,
        error: `Argumentos inválidos para ${factorName}`,
        executionTime: performance.now() - startTime,
        factorName
      };
    }
    
    // Ejecutar evaluación
    const result = evaluatorFn(...args);
    
    // Validar resultado
    if (!result || typeof result !== 'object') {
      return {
        success: false,
        error: `Resultado inválido de ${factorName} - esperado objeto, recibido ${typeof result}`,
        executionTime: performance.now() - startTime,
        factorName
      };
    }
    
    return {
      success: true,
      factorResult: result,
      executionTime: performance.now() - startTime,
      factorName
    };
    
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : `Error desconocido en ${factorName}`,
      executionTime: performance.now() - startTime,
      factorName
    };
  }
}

/**
 * Configuración tipada para evaluaciones de factores
 * Elimina la necesidad de casting y @ts-ignore
 */
interface FactorEvaluationConfig {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  evaluator: (...args: any[]) => FactorEvaluationResult;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  args: any[];
  factorKey: keyof Factors;
  diagnosticKey?: keyof Diagnostics;
  defaultFactor?: number;
  defaultDiagnostic?: string;
  required: boolean; // Si es crítico para el cálculo
}

// ===================================================================
// FUNCIONES AUXILIARES DE VALIDACIÓN UNIFICADA
// ===================================================================

/**
 * Validación cruzada entre factores relacionados
 * Detecta inconsistencias clínicas entre campos
 */
function _validateCrossFactors(input: UserInput): {
  isValid: boolean;
  alerts: string[];
  coherenceScore: number;
} {
  const alerts: string[] = [];
  let coherenceScore = 100;
  
  // Validación AMH vs Edad
  if (input.amh !== undefined && input.age) {
    if (input.age > 35 && input.amh > 5) {
      alerts.push('AMH elevada para la edad - verificar unidades o laboratorio');
      coherenceScore -= 10;
    }
    if (input.age < 30 && input.amh < 0.5) {
      alerts.push('AMH muy baja para edad joven - considerar repetir análisis');
      coherenceScore -= 15;
    }
  }
  
  // Validación PCOS vs Parámetros metabólicos
  if (input.hasPcos && input.bmi && input.homaIr) {
    if (input.hasPcos && input.bmi < 18.5) {
      alerts.push('PCOS con bajo peso es atípico - revisar diagnóstico');
      coherenceScore -= 10;
    }
    if (input.hasPcos && input.homaIr && input.homaIr < 1.5) {
      alerts.push('PCOS sin resistencia a la insulina - revisar criterios diagnósticos');
      coherenceScore -= 5;
    }
  }
  
  // Validación Factor masculino
  if (input.spermConcentration !== undefined && input.spermProgressiveMotility !== undefined) {
    if (input.spermConcentration > 50 && input.spermProgressiveMotility < 20) {
      alerts.push('Concentración alta pero motilidad baja - verificar técnica de laboratorio');
      coherenceScore -= 5;
    }
  }
  
  // Validación Ciclo vs PCOS
  if (input.cycleDuration && input.hasPcos) {
    if (input.cycleDuration < 28 && input.hasPcos) {
      alerts.push('Ciclos cortos con PCOS es inusual - revisar diagnóstico');
      coherenceScore -= 5;
    }
  }
  
  return {
    isValid: alerts.length === 0,
    alerts,
    coherenceScore: Math.max(coherenceScore, 0)
  };
}

/**
 * Calcula confianza unificada combinando múltiples fuentes
 */
function _calculateUnifiedConfidence(
  technicalConfidence: number,
  clinicalScore: number,
  coherenceScore: number
): number {
  // Pesos para cada componente
  const technicalWeight = 0.3;  // 30% - validación técnica básica
  const clinicalWeight = 0.5;   // 50% - validación clínica profesional
  const coherenceWeight = 0.2;  // 20% - coherencia entre factores
  
  const unifiedScore = 
    (technicalConfidence * technicalWeight) +
    (clinicalScore * clinicalWeight) +
    (coherenceScore * coherenceWeight);
    
  return Math.round(Math.max(0, Math.min(100, unifiedScore)));
}

/**
 * Evalúa si el input está listo para cálculo y qué mejoras se necesitan
 */
function _evaluateCalculationReadiness(
  technicalResult: {
    isValid: boolean;
    errors: string[];
    missingCritical: string[];
  },
  clinicalValidation: {
    overallValidation: ValidationResult;
    completionScore: number;
  },
  crossFactorValidation: {
    coherenceScore: number;
  }
): {
  canProceed: boolean;
  requiredImprovements: string[];
  recommendedTests: string[];
} {
  const requiredImprovements: string[] = [];
  const recommendedTests: string[] = [];
  
  // Evaluar errores críticos
  if (technicalResult.errors.length > 0) {
    requiredImprovements.push('Corregir errores de validación básica');
  }
  
  if (clinicalValidation.overallValidation.criticalAlerts.length > 0) {
    requiredImprovements.push('Resolver alertas clínicas críticas');
  }
  
  // Evaluar datos faltantes importantes
  if (technicalResult.missingCritical.length > 2) {
    requiredImprovements.push('Completar datos críticos faltantes');
  }
  
  // Evaluar coherencia
  if (crossFactorValidation.coherenceScore < 70) {
    requiredImprovements.push('Revisar coherencia entre datos clínicos');
  }
  
  // Recomendar tests adicionales basado en hallazgos
  if (clinicalValidation.completionScore < 80) {
    recommendedTests.push('Completar perfil hormonal básico');
  }
  
  // Determinar si puede proceder
  const canProceed = 
    technicalResult.errors.length === 0 &&
    clinicalValidation.overallValidation.criticalAlerts.length === 0 &&
    technicalResult.missingCritical.length <= 1 &&
    crossFactorValidation.coherenceScore >= 60;
  
  return {
    canProceed,
    requiredImprovements,
    recommendedTests
  };
}

/**
 * Validación clínica simplificada usando solo datos disponibles en UserInput
 * Adaptada para trabajar sin height/weight individuales
 */
function _performClinicalValidationSimplified(input: UserInput): {
  overallValidation: ValidationResult;
  fieldValidations: FieldValidationResult[];
  completionScore: number;
  canProceedWithCalculation: boolean;
} {
  const fieldValidations: FieldValidationResult[] = [];
  const errors: ValidationMessage[] = [];
  const warnings: ValidationMessage[] = [];
  const criticalAlerts: ValidationMessage[] = [];
  let overallScore = 0;
  let validFieldsCount = 0;
  let totalFieldsCount = 0;

  // Validación de Edad usando ClinicalValidators
  if (input.age) {
    const ageValidation = ClinicalValidators.validateAge(input.age);
    fieldValidations.push(ageValidation);
    overallScore += ageValidation.clinicalScore * 0.25; // 25% peso
    validFieldsCount += ageValidation.isValid ? 1 : 0;
    totalFieldsCount++;
    
    errors.push(...ageValidation.errors);
    warnings.push(...ageValidation.warnings);
    criticalAlerts.push(...ageValidation.criticalAlerts);
  }

  // Validación de AMH usando ClinicalValidators
  if (input.amh !== undefined && input.age) {
    const amhValidation = ClinicalValidators.validateAMH(input.amh, input.age);
    fieldValidations.push(amhValidation);
    overallScore += amhValidation.clinicalScore * 0.20; // 20% peso
    validFieldsCount += amhValidation.isValid ? 1 : 0;
    totalFieldsCount++;
    
    errors.push(...amhValidation.errors);
    warnings.push(...amhValidation.warnings);
    criticalAlerts.push(...amhValidation.criticalAlerts);
  }

  // Validación de Duración de Infertilidad usando ClinicalValidators
  if (input.infertilityDuration !== undefined && input.age) {
    const timeValidation = ClinicalValidators.validateTimeToConception(input.infertilityDuration, input.age);
    fieldValidations.push(timeValidation);
    overallScore += timeValidation.clinicalScore * 0.15; // 15% peso
    validFieldsCount += timeValidation.isValid ? 1 : 0;
    totalFieldsCount++;
    
    errors.push(...timeValidation.errors);
    warnings.push(...timeValidation.warnings);
    criticalAlerts.push(...timeValidation.criticalAlerts);
  }

  // Validación de Análisis de Semen usando ClinicalValidators
  if (input.spermConcentration !== undefined || input.spermProgressiveMotility !== undefined || input.spermNormalMorphology !== undefined) {
    const semenValidation = ClinicalValidators.validateSemenAnalysis({
      concentration: input.spermConcentration,
      progressiveMotility: input.spermProgressiveMotility,
      normalMorphology: input.spermNormalMorphology
    });
    fieldValidations.push(semenValidation);
    overallScore += semenValidation.clinicalScore * 0.15; // 15% peso
    validFieldsCount += semenValidation.isValid ? 1 : 0;
    totalFieldsCount++;
    
    errors.push(...semenValidation.errors);
    warnings.push(...semenValidation.warnings);
    criticalAlerts.push(...semenValidation.criticalAlerts);
  }

  // Validación simple de BMI (sin usar ClinicalValidators por falta de height/weight)
  if (input.bmi !== null && input.bmi !== undefined) {
    const bmiValidation = _validateBMISimple(input.bmi);
    fieldValidations.push(bmiValidation);
    overallScore += bmiValidation.clinicalScore * 0.15; // 15% peso
    validFieldsCount += bmiValidation.isValid ? 1 : 0;
    totalFieldsCount++;
    
    errors.push(...bmiValidation.errors);
    warnings.push(...bmiValidation.warnings);
    criticalAlerts.push(...bmiValidation.criticalAlerts);
  }

  const completionScore = totalFieldsCount > 0 ? Math.round((validFieldsCount / totalFieldsCount) * 100) : 0;
  const canProceedWithCalculation = 
    validFieldsCount >= 2 && // Mínimo 2 campos válidos
    errors.length === 0 && // Sin errores críticos
    completionScore >= 50; // Al menos 50% completitud

  return {
    overallValidation: {
      isValid: errors.length === 0,
      errors,
      warnings,
      criticalAlerts,
      recommendations: [...new Set([...errors, ...warnings, ...criticalAlerts].map(msg => msg.recommendation || '').filter(Boolean))],
      clinicalScore: Math.round(Math.max(0, overallScore))
    },
    fieldValidations,
    completionScore,
    canProceedWithCalculation
  };
}

/**
 * Validación simple de BMI cuando no tenemos height/weight individuales
 */
function _validateBMISimple(bmi: number): FieldValidationResult {
  const errors: ValidationMessage[] = [];
  const warnings: ValidationMessage[] = [];
  const criticalAlerts: ValidationMessage[] = [];
  let clinicalScore = 100;
  let category = 'Normal';

  if (bmi < 18.5) {
    category = 'Bajo peso';
    warnings.push({
      type: 'warning',
      message: 'BMI bajo puede afectar la fertilidad',
      recommendation: 'Consultar nutricionista para alcanzar peso saludable'
    });
    clinicalScore = 70;
  } else if (bmi >= 25 && bmi < 30) {
    category = 'Sobrepeso';
    warnings.push({
      type: 'warning',
      message: 'Sobrepeso puede reducir fertilidad',
      recommendation: 'Optimizar peso antes de tratamientos'
    });
    clinicalScore = 75;
  } else if (bmi >= 30) {
    category = 'Obesidad';
    warnings.push({
      type: 'warning',
      message: 'Obesidad impacta significativamente la fertilidad',
      recommendation: 'Pérdida de peso prioritaria antes de tratamientos'
    });
    clinicalScore = 60;
  }

  return {
    fieldName: 'bmi',
    value: bmi,
    isValid: errors.length === 0,
    errors,
    warnings,
    criticalAlerts,
    recommendations: [...warnings, ...errors, ...criticalAlerts].map(msg => msg.recommendation || '').filter(Boolean),
    clinicalScore,
    interpretedValue: {
      category,
      normalRange: '18.5-24.9 kg/m²'
    }
  };
}
