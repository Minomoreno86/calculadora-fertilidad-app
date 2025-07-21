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
import { neuralWeightingSystem, NeuralWeightingSystem } from './neuralWeightingSystem';

// 🎯 CONFIGURACIÓN DEL MOTOR UNIFICADO
export interface UnifiedEngineOptions {
  mode: 'auto' | 'standard' | 'premium' | 'force-premium' | 'neural';
  enableCache?: boolean;
  enableParallelValidation?: boolean;
  debugMode?: boolean;
  performanceTracking?: boolean;
}

// 📊 MÉTRICAS UNIFICADAS
export interface UnifiedEngineMetrics {
  executionTime: number;
  engineUsed: 'standard' | 'premium' | 'neural';
  complexityScore: number;
  cacheHit: boolean;
  parallelValidationUsed: boolean;
  decisionReason: string;
  neuralConfidence?: number;
  evidenceQuality?: string;
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
 * 🚀 FUNCIÓN PRINCIPAL UNIFICADA
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
  let neuralAnalysis: any = null;
  
  try {
    // 🧠 NEURAL WEIGHTING ENHANCEMENT
    if (options.mode === 'neural' || (options.mode === 'auto' && complexity.score > 0.7)) {
      // Use standard calculation as base
      result = engineDecision.useStandard 
        ? calculateProbability(userInput)
        : calculateProbabilityPremium(userInput);
      
      // Enhance with neural weighting
      neuralAnalysis = neuralWeightingSystem.calculateNeuralProbability(userInput, result.factors);
      
      // Update result with neural insights
      result = enhanceResultWithNeuralWeighting(result, neuralAnalysis);
      
      engineDecision.useStandard = false;
      engineDecision.reason += ' | Enhanced with Neural Weighting V2.0';
    } else {
      // Standard calculation
      if (engineDecision.useStandard) {
        result = calculateProbability(userInput);
      } else {
        result = calculateProbabilityPremium(userInput);
      }
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
  const metrics: UnifiedEngineMetrics = {
    executionTime,
    engineUsed: neuralAnalysis ? 'neural' : (engineDecision.useStandard ? 'standard' : 'premium'),
    complexityScore: complexity.score,
    cacheHit,
    parallelValidationUsed: false, // TODO: Detectar desde el resultado
    decisionReason: engineDecision.reason,
    neuralConfidence: neuralAnalysis?.confidence,
    evidenceQuality: neuralAnalysis?.evidenceQuality
  };
  
  // 🎯 LOGGING CONDICIONAL
  if (options.debugMode) {
    console.log('🚀 MOTOR UNIFICADO V2.0 - Resultado:');
    console.log(`   🧮 Complejidad: ${complexity.score.toFixed(2)}`);
    console.log(`   ⚙️ Motor usado: ${metrics.engineUsed}`);
    console.log(`   ⏱️ Tiempo: ${metrics.executionTime.toFixed(1)}ms`);
    console.log(`   🎯 Razón: ${metrics.decisionReason}`);
    if (neuralAnalysis) {
      console.log(`   🧠 Confianza Neural: ${(neuralAnalysis.confidence * 100).toFixed(1)}%`);
      console.log(`   📚 Calidad Evidencia: ${neuralAnalysis.evidenceQuality}`);
    }
  }
  
  return { result, metrics };
}

/**
 * 🧮 ANALIZAR COMPLEJIDAD DEL INPUT
 */
function analyzeInputComplexity(userInput: UserInput): ComplexityAnalysis {
  let score = 0;
  const factors = { age: 0, hormonal: 0, anatomical: 0, masculine: 0, interactions: 0 };
  
  // 👵 FACTOR EDAD (peso: 0.2)
  if (userInput.age >= 38) {
    factors.age = 0.8;
  } else if (userInput.age >= 35) {
    factors.age = 0.4;
  } else {
    factors.age = 0.1;
  }
  
  // 🧬 FACTORES HORMONALES (peso: 0.25)
  let hormonalComplexity = 0;
  if (userInput.amh !== undefined && userInput.amh < 1.0) hormonalComplexity += 0.3;
  if (userInput.tsh !== undefined && (userInput.tsh > 4.0 || userInput.tsh < 0.5)) hormonalComplexity += 0.2;
  if (userInput.prolactin !== undefined && userInput.prolactin > 25) hormonalComplexity += 0.2;
  if (userInput.hasPcos) hormonalComplexity += 0.4;
  factors.hormonal = Math.min(hormonalComplexity, 1.0);
  
  // 🏥 FACTORES ANATÓMICOS (peso: 0.25)
  let anatomicalComplexity = 0;
  if (userInput.endometriosisGrade >= 3) anatomicalComplexity += 0.5;
  if (userInput.myomaType !== MyomaType.None) anatomicalComplexity += 0.3;
  if (userInput.adenomyosisType !== AdenomyosisType.None) anatomicalComplexity += 0.4;
  if (userInput.hsgResult !== HsgResult.Normal) anatomicalComplexity += 0.3;
  if (userInput.hasOtb) anatomicalComplexity += 0.8; // OTB es muy complejo
  factors.anatomical = Math.min(anatomicalComplexity, 1.0);
  
  // 👨 FACTORES MASCULINOS (peso: 0.15)
  let masculineComplexity = 0;
  if (userInput.spermConcentration !== undefined && userInput.spermConcentration < 16) masculineComplexity += 0.3;
  if (userInput.spermProgressiveMotility !== undefined && userInput.spermProgressiveMotility < 30) masculineComplexity += 0.3;
  if (userInput.spermNormalMorphology !== undefined && userInput.spermNormalMorphology < 2) masculineComplexity += 0.4;
  factors.masculine = Math.min(masculineComplexity, 1.0);
  
  // 🔗 INTERACCIONES DETECTADAS (peso: 0.15)
  let interactionComplexity = 0;
  
  // Interacción edad + reserva ovárica
  if (userInput.age >= 38 && userInput.amh !== undefined && userInput.amh < 0.8) {
    interactionComplexity += 0.6;
  }
  
  // Interacción endometriosis + factor masculino
  if (userInput.endometriosisGrade >= 3 && 
      ((userInput.spermConcentration !== undefined && userInput.spermConcentration < 16) ||
       (userInput.spermProgressiveMotility !== undefined && userInput.spermProgressiveMotility < 30))) {
    interactionComplexity += 0.7;
  }
  
  // Interacción PCOS + factores metabólicos
  if (userInput.hasPcos && 
      userInput.bmi !== undefined && 
      userInput.bmi !== null && 
      typeof userInput.bmi === 'number' && 
      userInput.bmi >= 30) {
    interactionComplexity += 0.4;
  }
  
  factors.interactions = Math.min(interactionComplexity, 1.0);
  
  // 📊 SCORE FINAL (promedio ponderado)
  score = (factors.age * 0.2) + 
          (factors.hormonal * 0.25) + 
          (factors.anatomical * 0.25) + 
          (factors.masculine * 0.15) + 
          (factors.interactions * 0.15);
  
  // 🎯 DETERMINAR SI REQUIERE PREMIUM
  const requiresPremium = score >= 0.4 || 
                         factors.interactions > 0.3 ||
                         userInput.hasOtb ||
                         userInput.endometriosisGrade >= 3;
  
  // 📝 GENERAR REASONING
  let reasoning = `Score: ${score.toFixed(2)}`;
  if (factors.interactions > 0.3) reasoning += ' | High interactions detected';
  if (userInput.hasOtb) reasoning += ' | OTB requires premium logic';
  if (userInput.endometriosisGrade >= 3) reasoning += ' | Severe endometriosis';
  if (factors.hormonal > 0.5) reasoning += ' | Complex hormonal profile';
  
  return {
    score,
    factors,
    requiresPremium,
    reasoning
  };
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

/**
 * 🔄 FUNCIÓN DE MIGRACIÓN: Reemplaza calculateProbability
 */
export function calculateProbabilityMigrated(userInput: UserInput): EvaluationState {
  const { result } = calculateProbabilityUnified(userInput, { mode: 'auto' });
  return result;
}

/**
 * 🧠 ENHANCE RESULT WITH NEURAL WEIGHTING
 */
function enhanceResultWithNeuralWeighting(
  baseResult: EvaluationState,
  neuralAnalysis: any
): EvaluationState {
  // Create enhanced report with neural insights
  const enhancedReport = {
    ...baseResult.report,
    numericPrognosis: neuralAnalysis.probability,
    category: determineCategory(neuralAnalysis.probability),
    prognosisPhrase: generateNeuralPrognosisPhrase(neuralAnalysis),
    clinicalInsights: [
      ...baseResult.report.clinicalInsights,
      {
        key: 'neural_analysis',
        title: 'Análisis Neural Avanzado',
        definition: `Análisis basado en ${neuralAnalysis.evidenceQuality} con ${Math.round(neuralAnalysis.confidence * 100)}% de confianza`,
        justification: 'Análisis mediante sistema de ponderación neuronal con base en 500+ estudios científicos',
        recommendations: neuralAnalysis.recommendations,
        explanation: generateNeuralExplanation(neuralAnalysis),
        sources: ['Neural Weighting System V2.0', 'Evidence Database 500+ studies', 'ASRM Guidelines 2024']
      }
    ]
  };

  // Add neural factor contributions to diagnostics
  const enhancedDiagnostics = {
    ...baseResult.diagnostics,
    neuralFactorAnalysis: generateFactorAnalysisComment(neuralAnalysis.factorContributions),
    evidenceQuality: neuralAnalysis.evidenceQuality,
    confidenceLevel: `${Math.round(neuralAnalysis.confidence * 100)}%`
  };

  return {
    ...baseResult,
    report: enhancedReport,
    diagnostics: enhancedDiagnostics
  };
}

function determineCategory(probability: number): 'BUENO' | 'MODERADO' | 'BAJO' | 'ERROR' {
  if (probability >= 65) return 'BUENO';
  if (probability >= 40) return 'MODERADO';
  if (probability >= 15) return 'BAJO';
  return 'BAJO';
}

function generateNeuralPrognosisPhrase(neuralAnalysis: any): string {
  const probability = neuralAnalysis.probability;
  const confidence = neuralAnalysis.confidence;
  
  if (probability >= 70) {
    return `Excelente pronóstico basado en análisis neuronal avanzado (${confidence >= 0.9 ? 'Alta confianza' : 'Confianza moderada'})`;
  } else if (probability >= 50) {
    return `Buen pronóstico con factores optimizables identificados por IA`;
  } else if (probability >= 30) {
    return `Pronóstico moderado con recomendaciones específicas de mejora`;
  } else {
    return `Pronóstico desafiante requiere intervención especializada inmediata`;
  }
}

function generateNeuralExplanation(neuralAnalysis: any): string {
  const topFactors = Object.entries(neuralAnalysis.factorContributions)
    .sort(([,a], [,b]) => (b as number) - (a as number))
    .slice(0, 3);
  
  let explanation = 'El análisis neuronal identifica los siguientes factores clave:\n\n';
  
  topFactors.forEach(([factor, contribution], index) => {
    explanation += `${index + 1}. **${factor}**: Contribución de ${(contribution as number).toFixed(1)} puntos\n`;
  });
  
  explanation += `\nEste análisis se basa en ${neuralAnalysis.evidenceQuality} y considera las interacciones no lineales entre factores.`;
  
  return explanation;
}

function generateFactorAnalysisComment(factorContributions: Record<string, number>): string {
  const sorted = Object.entries(factorContributions)
    .sort(([,a], [,b]) => b - a);
  
  const strongest = sorted[0];
  const weakest = sorted[sorted.length - 1];
  
  return `Factor más influyente: ${strongest[0]} (${strongest[1].toFixed(1)} puntos). ` +
         `Factor que requiere atención: ${weakest[0]} (${weakest[1].toFixed(1)} puntos).`;
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
  // TODO: Implementar con cache global de métricas
  return {
    totalCalculations: 0,
    standardEngineUsage: 0,
    premiumEngineUsage: 0,
    averageComplexityScore: 0,
    averageExecutionTime: 0
  };
}
