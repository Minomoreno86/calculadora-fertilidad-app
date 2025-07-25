/**
 * 🚀 MOTOR DE CÁLCULO UNIFICADO - VERSIÓN 2.0
 * 
 * Consolidación inteligente que combina:
 * - Motor principal (calculationEngine.ts)
 * - Motor premium (calculationEnginePremium.ts) 
 * - Lógica de interacciones no lineales
 * - Sistema de paralelización FASE 2
 */

import { 
  UserInput, 
  EvaluationState,
  MyomaType,
  AdenomyosisType,
  HsgResult
} from '@/core/domain/models';
import { calculateProbability } from './calculationEngine';
import { calculateProbabilityPremium } from './calculationEnginePremium';

// 🎯 CONFIGURACIÓN DEL MOTOR UNIFICADO
export interface UnifiedEngineOptions {
  mode: 'auto' | 'standard' | 'premium' | 'force-premium';
  enableCache?: boolean;
  enableParallelValidation?: boolean;
  debugMode?: boolean;
  performanceTracking?: boolean;
}

// 📊 MÉTRICAS UNIFICADAS
export interface UnifiedEngineMetrics {
  executionTime: number;
  engineUsed: 'standard' | 'premium';
  complexityScore: number;
  cacheHit: boolean;
  parallelValidationUsed: boolean;
  decisionReason: string;
}

// 🧮 ANÁLISIS DE COMPLEJIDAD MEJORADO
interface ComplexityAnalysis {
  score: number; // 0.0 - 1.0
  factors: {
    age: number;
    hormonal: number;
    anatomical: number;
    masculine: number;
    interactions: number;
  };
  requiresPremium: boolean;
  reasoning: string;
}

/**
 * � DETECTAR USO DE VALIDACIÓN PARALELA
 */
function detectParallelValidationUsage(result: EvaluationState, usedStandard: boolean): boolean {
  // Heurística simple: Si el motor standard procesó un caso complejo muy rápido,
  // probablemente usó validación paralela
  if (usedStandard && result.input) {
    const hasComplexFactors = result.input.endometriosisGrade >= 2 || 
                             result.input.hasPcos || 
                             result.input.hasOtb ||
                             (result.input.amh !== undefined && result.input.amh < 1.0);
    return hasComplexFactors;
  }
  return false;
}

/**
 * �🚀 FUNCIÓN PRINCIPAL UNIFICADA
 * 
 * API única que reemplaza calculateProbability + calculateProbabilityPremium
 */
export function calculateProbabilityUnified(
  userInput: UserInput,
  options: UnifiedEngineOptions = { mode: 'auto' }
): { 
  result: EvaluationState; 
  metrics: UnifiedEngineMetrics 
} {
  const startTime = performance.now();
  
  // 🔍 ANÁLISIS DE COMPLEJIDAD
  const complexity = analyzeInputComplexity(userInput);
  
  // 🤔 DECIDIR MOTOR A USAR
  const engineDecision = decideEngine(complexity, options);
  
  // ⚡ EJECUTAR CÁLCULO CON MOTOR SELECCIONADO
  let result: EvaluationState;
  let cacheHit = false;
  
  try {
    if (engineDecision.useStandard) {
      result = calculateProbability(userInput);
    } else {
      result = calculateProbabilityPremium(userInput);
    }
  } catch (error) {
    console.error(`❌ Error en motor ${engineDecision.useStandard ? 'standard' : 'premium'}:`, error);
    
    // 🔄 FALLBACK: Intentar con el otro motor
    try {
      if (engineDecision.useStandard) {
        result = calculateProbabilityPremium(userInput);
        engineDecision.useStandard = false;
        engineDecision.reason += ' | Fallback to Premium due to Standard error';
      } else {
        result = calculateProbability(userInput);
        engineDecision.useStandard = true;
        engineDecision.reason += ' | Fallback to Standard due to Premium error';
      }
    } catch (fallbackError) {
      console.error('❌ Error crítico en ambos motores:', fallbackError);
      throw new Error(`Motor unificado falló: ${error} | Fallback: ${fallbackError}`);
    }
  }
  
  // 📊 GENERAR MÉTRICAS
  const executionTime = performance.now() - startTime;
  
  // Detectar si se usó validación paralela desde el resultado
  const parallelValidationUsed = detectParallelValidationUsage(result, engineDecision.useStandard);
  
  const metrics: UnifiedEngineMetrics = {
    executionTime,
    engineUsed: engineDecision.useStandard ? 'standard' : 'premium',
    complexityScore: complexity.score,
    cacheHit,
    parallelValidationUsed,
    decisionReason: engineDecision.reason
  };
  
  // 🎯 LOGGING CONDICIONAL
  if (options.debugMode) {
    console.log('🚀 MOTOR UNIFICADO - Resultado:');
    console.log(`   🧮 Complejidad: ${complexity.score.toFixed(2)}`);
    console.log(`   ⚙️ Motor usado: ${metrics.engineUsed}`);
    console.log(`   ⏱️ Tiempo: ${metrics.executionTime.toFixed(1)}ms`);
    console.log(`   🎯 Razón: ${metrics.decisionReason}`);
  }
  
  // 📊 ACTUALIZAR MÉTRICAS GLOBALES
  updateGlobalMetrics(metrics);
  
  return { result, metrics };
}

/**
 * 🧮 ANALIZAR COMPLEJIDAD DEL INPUT
 */
function analyzeInputComplexity(userInput: UserInput): ComplexityAnalysis {
  const factors = {
    age: calculateAgeComplexity(userInput.age),
    hormonal: calculateHormonalComplexity(userInput),
    anatomical: calculateAnatomicalComplexity(userInput),
    masculine: calculateMasculineComplexity(userInput),
    interactions: calculateInteractionComplexity(userInput)
  };
  
  // � SCORE FINAL (promedio ponderado)
  const score = (factors.age * 0.2) + 
               (factors.hormonal * 0.25) + 
               (factors.anatomical * 0.25) + 
               (factors.masculine * 0.15) + 
               (factors.interactions * 0.15);
  
  // 🎯 DETERMINAR SI REQUIERE PREMIUM
  const requiresPremium = shouldUsePremiumEngine(score, factors, userInput);
  
  // 📝 GENERAR REASONING
  const reasoning = generateComplexityReasoning(score, factors, userInput);
  
  return { score, factors, requiresPremium, reasoning };
}

/**
 * 👵 CALCULAR COMPLEJIDAD POR EDAD
 */
function calculateAgeComplexity(age: number): number {
  if (age >= 38) return 0.8;
  if (age >= 35) return 0.4;
  return 0.1;
}

/**
 * 🧬 CALCULAR COMPLEJIDAD HORMONAL
 */
function calculateHormonalComplexity(userInput: UserInput): number {
  let complexity = 0;
  
  if (userInput.amh !== undefined && userInput.amh < 1.0) complexity += 0.3;
  if (userInput.tsh !== undefined && (userInput.tsh > 4.0 || userInput.tsh < 0.5)) complexity += 0.2;
  if (userInput.prolactin !== undefined && userInput.prolactin > 25) complexity += 0.2;
  if (userInput.hasPcos) complexity += 0.4;
  
  return Math.min(complexity, 1.0);
}

/**
 * 🏥 CALCULAR COMPLEJIDAD ANATÓMICA
 */
function calculateAnatomicalComplexity(userInput: UserInput): number {
  let complexity = 0;
  
  if (userInput.endometriosisGrade >= 3) complexity += 0.5;
  if (userInput.myomaType !== MyomaType.None) complexity += 0.3;
  if (userInput.adenomyosisType !== AdenomyosisType.None) complexity += 0.4;
  if (userInput.hsgResult !== HsgResult.Normal) complexity += 0.3;
  if (userInput.hasOtb) complexity += 0.8; // OTB es muy complejo
  
  return Math.min(complexity, 1.0);
}

/**
 * 👨 CALCULAR COMPLEJIDAD MASCULINA
 */
function calculateMasculineComplexity(userInput: UserInput): number {
  let complexity = 0;
  
  if (userInput.spermConcentration !== undefined && userInput.spermConcentration < 16) complexity += 0.3;
  if (userInput.spermProgressiveMotility !== undefined && userInput.spermProgressiveMotility < 30) complexity += 0.3;
  if (userInput.spermNormalMorphology !== undefined && userInput.spermNormalMorphology < 2) complexity += 0.4;
  
  return Math.min(complexity, 1.0);
}

/**
 * 🔗 CALCULAR COMPLEJIDAD DE INTERACCIONES
 */
function calculateInteractionComplexity(userInput: UserInput): number {
  let complexity = 0;
  
  // Interacción edad + reserva ovárica
  if (userInput.age >= 38 && userInput.amh !== undefined && userInput.amh < 0.8) {
    complexity += 0.6;
  }
  
  // Interacción endometriosis + factor masculino
  if (hasEndometriosisMaleFactorInteraction(userInput)) {
    complexity += 0.7;
  }
  
  // Interacción PCOS + factores metabólicos
  if (hasPcosMetabolicInteraction(userInput)) {
    complexity += 0.4;
  }
  
  return Math.min(complexity, 1.0);
}

/**
 * 🔍 DETECTAR INTERACCIÓN ENDOMETRIOSIS + FACTOR MASCULINO
 */
function hasEndometriosisMaleFactorInteraction(userInput: UserInput): boolean {
  return userInput.endometriosisGrade >= 3 && 
         ((userInput.spermConcentration !== undefined && userInput.spermConcentration < 16) ||
          (userInput.spermProgressiveMotility !== undefined && userInput.spermProgressiveMotility < 30));
}

/**
 * 🔍 DETECTAR INTERACCIÓN PCOS + METABÓLICA
 */
function hasPcosMetabolicInteraction(userInput: UserInput): boolean {
  return userInput.hasPcos && 
         userInput.bmi !== undefined && 
         userInput.bmi !== null && 
         typeof userInput.bmi === 'number' && 
         userInput.bmi >= 30;
}

/**
 * 🎯 DETERMINAR SI REQUIERE MOTOR PREMIUM
 */
function shouldUsePremiumEngine(score: number, factors: ComplexityAnalysis['factors'], userInput: UserInput): boolean {
  return score >= 0.4 || 
         factors.interactions > 0.3 ||
         userInput.hasOtb ||
         userInput.endometriosisGrade >= 3;
}

/**
 * 📝 GENERAR EXPLICACIÓN DE COMPLEJIDAD
 */
function generateComplexityReasoning(score: number, factors: ComplexityAnalysis['factors'], userInput: UserInput): string {
  let reasoning = `Score: ${score.toFixed(2)}`;
  
  if (factors.interactions > 0.3) reasoning += ' | High interactions detected';
  if (userInput.hasOtb) reasoning += ' | OTB requires premium logic';
  if (userInput.endometriosisGrade >= 3) reasoning += ' | Severe endometriosis';
  if (factors.hormonal > 0.5) reasoning += ' | Complex hormonal profile';
  
  return reasoning;
}

/**
 * 🤔 DECIDIR QUÉ MOTOR USAR
 */
function decideEngine(
  complexity: ComplexityAnalysis, 
  options: UnifiedEngineOptions
): { useStandard: boolean; reason: string } {
  
  // 🎯 FORZAR PREMIUM
  if (options.mode === 'force-premium' || options.mode === 'premium') {
    return { 
      useStandard: false, 
      reason: `Forced Premium mode (${options.mode})` 
    };
  }
  
  // 🎯 FORZAR STANDARD
  if (options.mode === 'standard') {
    return { 
      useStandard: true, 
      reason: 'Forced Standard mode' 
    };
  }
  
  // 🤖 MODO AUTO (por defecto)
  if (complexity.requiresPremium) {
    return { 
      useStandard: false, 
      reason: `Auto-selected Premium: ${complexity.reasoning}` 
    };
  }
  
  if (complexity.score < 0.3) {
    return { 
      useStandard: true, 
      reason: `Auto-selected Standard: Low complexity (${complexity.score.toFixed(2)})` 
    };
  }
  
  // 🎯 ZONA GRIS: Preferir Standard por performance
  return { 
    useStandard: true, 
    reason: `Auto-selected Standard: Medium complexity (${complexity.score.toFixed(2)}) - Performance preference` 
  };
}

// 📊 CACHE GLOBAL DE MÉTRICAS
interface GlobalMetricsCache {
  totalCalculations: number;
  standardEngineUsage: number;
  premiumEngineUsage: number;
  complexityScores: number[];
  executionTimes: number[];
}

const globalMetrics: GlobalMetricsCache = {
  totalCalculations: 0,
  standardEngineUsage: 0,
  premiumEngineUsage: 0,
  complexityScores: [],
  executionTimes: []
};

/**
 * � ACTUALIZAR MÉTRICAS GLOBALES
 */
function updateGlobalMetrics(metrics: UnifiedEngineMetrics): void {
  globalMetrics.totalCalculations++;
  globalMetrics.complexityScores.push(metrics.complexityScore);
  globalMetrics.executionTimes.push(metrics.executionTime);
  
  if (metrics.engineUsed === 'standard') {
    globalMetrics.standardEngineUsage++;
  } else {
    globalMetrics.premiumEngineUsage++;
  }
  
  // Limitar arrays para no consumir demasiada memoria (últimas 1000 mediciones)
  if (globalMetrics.complexityScores.length > 1000) {
    globalMetrics.complexityScores = globalMetrics.complexityScores.slice(-500);
    globalMetrics.executionTimes = globalMetrics.executionTimes.slice(-500);
  }
}
export function calculateProbabilityMigrated(userInput: UserInput): EvaluationState {
  const { result } = calculateProbabilityUnified(userInput, { mode: 'auto' });
  return result;
}

/**
 * 🔄 FUNCIÓN DE MIGRACIÓN: Reemplaza calculateProbabilityPremium
 */
export function calculateProbabilityPremiumMigrated(userInput: UserInput): EvaluationState {
  const { result } = calculateProbabilityUnified(userInput, { mode: 'force-premium' });
  return result;
}

/**
 * 📊 OBTENER MÉTRICAS DEL MOTOR UNIFICADO
 */
export function getUnifiedEngineMetrics(): {
  totalCalculations: number;
  standardEngineUsage: number;
  premiumEngineUsage: number;
  averageComplexityScore: number;
  averageExecutionTime: number;
} {
  const avgComplexity = globalMetrics.complexityScores.length > 0 ?
    globalMetrics.complexityScores.reduce((sum, score) => sum + score, 0) / globalMetrics.complexityScores.length : 0;
  
  const avgExecutionTime = globalMetrics.executionTimes.length > 0 ?
    globalMetrics.executionTimes.reduce((sum, time) => sum + time, 0) / globalMetrics.executionTimes.length : 0;
  
  return {
    totalCalculations: globalMetrics.totalCalculations,
    standardEngineUsage: globalMetrics.standardEngineUsage,
    premiumEngineUsage: globalMetrics.premiumEngineUsage,
    averageComplexityScore: Math.round(avgComplexity * 100) / 100,
    averageExecutionTime: Math.round(avgExecutionTime * 100) / 100
  };
}
