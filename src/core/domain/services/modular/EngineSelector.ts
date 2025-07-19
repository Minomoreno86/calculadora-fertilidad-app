/**
 * 🤖 ENGINE SELECTOR - Selección Inteligente de Motor
 * 
 * Módulo que implementa la lógica de selección automática entre
 * diferentes engines basado en complejidad y contexto, con aprendizaje adaptativo.
 * 
 * CARACTERÍSTICAS:
 * - Análisis de complejidad multi-factorial
 * - Thresholds adaptativos que mejoran con uso
 * - Predicción de performance por engine
 * - Fallback automático entre engines
 * - Machine Learning lite para optimización
 */

import { UserInput, EvaluationState } from '../../models';
import { PerformanceMetric, getPerformanceMonitor } from './PerformanceMonitor';

// ===================================================================
// 🎯 INTERFACES PARA ENGINE SELECTOR
// ===================================================================

/**
 * Tipos de engine disponibles
 */
export type EngineType = 'STANDARD' | 'PREMIUM' | 'UNIFIED' | 'SIMPLIFIED';

/**
 * Análisis de complejidad del input
 */
export interface ComplexityAnalysis {
  // Scores individuales (0-1)
  ageComplexity: number;
  hormonalComplexity: number;
  anatomicalComplexity: number;
  masculineComplexity: number;
  interactionComplexity: number;
  
  // Score global
  totalComplexity: number;
  
  // Metadata
  analysisTime: number;
  confidenceLevel: number;
  
  // Factores críticos detectados
  criticalFactors: string[];
  
  // Recomendación preliminar
  preliminaryEngineChoice: EngineType;
}

/**
 * Contexto para selección de engine
 */
export interface SelectionContext {
  // Contexto del usuario
  userId?: string;
  sessionId?: string;
  
  // Contexto temporal
  timestamp: number;
  timeOfDay: number; // 0-23
  dayOfWeek: number; // 0-6
  
  // Contexto de sistema
  systemLoad: number; // 0-1
  availableMemory: number; // MB
  
  // Contexto de performance
  recentPerformance: {
    standardEngine: { avgTime: number; successRate: number; lastUsed: number };
    premiumEngine: { avgTime: number; successRate: number; lastUsed: number };
    unifiedEngine: { avgTime: number; successRate: number; lastUsed: number };
  };
  
  // Preferencias
  userPreferences?: {
    preferAccuracy: boolean;
    preferSpeed: boolean;
    maxWaitTime: number; // ms
  };
}

/**
 * Resultado de selección de engine
 */
export interface EngineChoice {
  selectedEngine: EngineType;
  confidence: number; // 0-1
  reasoning: string[];
  
  // Engines de fallback en orden de preferencia
  fallbackEngines: EngineType[];
  
  // Predicciones de performance
  expectedPerformance: {
    executionTime: number;
    successProbability: number;
    accuracyScore: number;
  };
  
  // Metadata
  selectionTime: number;
  complexityScore: number;
  contextFactors: string[];
}

/**
 * Feedback de performance para aprendizaje
 */
export interface PerformanceFeedback {
  engineUsed: EngineType;
  complexityScore: number;
  actualPerformance: {
    executionTime: number;
    success: boolean;
    accuracyScore?: number;
    error?: string;
  };
  userSatisfaction?: number; // 1-5
  context: SelectionContext;
  timestamp: number;
}

/**
 * Thresholds adaptativos
 */
export interface AdaptiveThresholds {
  // Thresholds principales
  premiumThreshold: number; // Complejidad mínima para premium
  unifiedThreshold: number; // Complejidad para unified
  
  // Thresholds por factor
  ageThreshold: number;
  hormonalThreshold: number;
  anatomicalThreshold: number;
  masculineThreshold: number;
  interactionThreshold: number;
  
  // Thresholds de contexto
  highLoadThreshold: number; // Para ajustar por carga del sistema
  lowMemoryThreshold: number; // Para ajustar por memoria
  
  // Metadata
  lastUpdated: number;
  updateCount: number;
  confidence: number; // Qué tan confiables son estos thresholds
}

/**
 * Configuración del selector
 */
export interface SelectorConfig {
  enableAdaptiveLearning: boolean;
  enablePerformancePrediction: boolean;
  enableFallbackChain: boolean;
  
  // Configuración de aprendizaje
  learningRate: number; // 0-1
  feedbackWeight: number; // Peso del feedback vs historial
  minSamplesForAdaptation: number;
  
  // Configuración de thresholds
  initialThresholds: Partial<AdaptiveThresholds>;
  thresholdBounds: { min: number; max: number };
  
  // Configuración de cache
  cacheSelections: boolean;
  selectionCacheTtl: number; // ms
}

// ===================================================================
// 🤖 ENGINE SELECTOR CLASS
// ===================================================================

export class IntelligentEngineSelector {
  // Thresholds adaptativos
  private thresholds: AdaptiveThresholds = {
    premiumThreshold: 0.4,
    unifiedThreshold: 0.7,
    ageThreshold: 0.6,
    hormonalThreshold: 0.5,
    anatomicalThreshold: 0.4,
    masculineThreshold: 0.3,
    interactionThreshold: 0.5,
    highLoadThreshold: 0.8,
    lowMemoryThreshold: 512,
    lastUpdated: Date.now(),
    updateCount: 0,
    confidence: 0.5
  };
  
  // Historial de feedback para aprendizaje
  private feedbackHistory: PerformanceFeedback[] = [];
  
  // Cache de selecciones recientes
  private selectionCache = new Map<string, { choice: EngineChoice; timestamp: number }>();
  
  // Patrones aprendidos
  private learnedPatterns = new Map<string, {
    pattern: string;
    preferredEngine: EngineType;
    confidence: number;
    successRate: number;
    avgPerformance: number;
  }>();
  
  constructor(private config: SelectorConfig = {
    enableAdaptiveLearning: true,
    enablePerformancePrediction: true,
    enableFallbackChain: true,
    learningRate: 0.1,
    feedbackWeight: 0.3,
    minSamplesForAdaptation: 10,
    initialThresholds: {},
    thresholdBounds: { min: 0.1, max: 0.9 },
    cacheSelections: true,
    selectionCacheTtl: 30000 // 30 segundos
  }) {
    this.initializeThresholds();
  }
  
  // ===================================================================
  // 🔍 ANÁLISIS DE COMPLEJIDAD
  // ===================================================================
  
  /**
   * Analiza la complejidad del input de usuario
   */
  analyzeComplexity(input: UserInput): ComplexityAnalysis {
    const startTime = performance.now();
    
    // Análisis por dimensiones
    const ageComplexity = this.analyzeAgeComplexity(input);
    const hormonalComplexity = this.analyzeHormonalComplexity(input);
    const anatomicalComplexity = this.analyzeAnatomicalComplexity(input);
    const masculineComplexity = this.analyzeMasculineComplexity(input);
    const interactionComplexity = this.analyzeInteractionComplexity(input);
    
    // Cálculo del score total con pesos
    const weights = {
      age: 0.20,
      hormonal: 0.25,
      anatomical: 0.25,
      masculine: 0.15,
      interaction: 0.15
    };
    
    const totalComplexity = 
      ageComplexity * weights.age +
      hormonalComplexity * weights.hormonal +
      anatomicalComplexity * weights.anatomical +
      masculineComplexity * weights.masculine +
      interactionComplexity * weights.interaction;
    
    // Detectar factores críticos
    const criticalFactors = this.detectCriticalFactors(input, {
      ageComplexity,
      hormonalComplexity,
      anatomicalComplexity,
      masculineComplexity,
      interactionComplexity
    });
    
    // Elección preliminar
    const preliminaryEngineChoice = this.makePreliminaryChoice(totalComplexity, criticalFactors);
    
    const analysisTime = performance.now() - startTime;
    
    return {
      ageComplexity,
      hormonalComplexity,
      anatomicalComplexity,
      masculineComplexity,
      interactionComplexity,
      totalComplexity,
      analysisTime,
      confidenceLevel: this.calculateConfidenceLevel(input),
      criticalFactors,
      preliminaryEngineChoice
    };
  }
  
  /**
   * Selecciona el engine óptimo basado en análisis y contexto
   */
  selectEngine(complexity: ComplexityAnalysis, context: SelectionContext): EngineChoice {
    const startTime = performance.now();
    
    // Verificar cache si está habilitado
    if (this.config.cacheSelections) {
      const cacheKey = this.generateSelectionCacheKey(complexity, context);
      const cached = this.getFromSelectionCache(cacheKey);
      if (cached) {
        return cached;
      }
    }
    
    // Análisis contextual
    const contextualAdjustments = this.analyzeContextualFactors(context);
    const adjustedComplexity = complexity.totalComplexity + contextualAdjustments.complexityAdjustment;
    
    // Selección basada en thresholds adaptativos
    let selectedEngine = this.selectByThresholds(adjustedComplexity, complexity.criticalFactors);
    
    // Ajustes por contexto de performance
    selectedEngine = this.adjustByPerformanceContext(selectedEngine, context);
    
    // Predicción de performance
    const expectedPerformance = this.config.enablePerformancePrediction ? 
      this.predictPerformance(selectedEngine, complexity, context) :
      { executionTime: 500, successProbability: 0.95, accuracyScore: 0.9 };
    
    // Generar fallbacks
    const fallbackEngines = this.config.enableFallbackChain ? 
      this.generateFallbackChain(selectedEngine, complexity, context) : [];
    
    // Construir reasoning
    const reasoning = this.buildSelectionReasoning(
      selectedEngine,
      complexity,
      context,
      contextualAdjustments
    );
    
    const selectionTime = performance.now() - startTime;
    
    const choice: EngineChoice = {
      selectedEngine,
      confidence: this.calculateSelectionConfidence(selectedEngine, complexity, context),
      reasoning,
      fallbackEngines,
      expectedPerformance,
      selectionTime,
      complexityScore: adjustedComplexity,
      contextFactors: contextualAdjustments.factors
    };
    
    // Cachear selección si está habilitado
    if (this.config.cacheSelections) {
      const cacheKey = this.generateSelectionCacheKey(complexity, context);
      this.cacheSelection(cacheKey, choice);
    }
    
    return choice;
  }
  
  // ===================================================================
  // 🧠 SISTEMA DE APRENDIZAJE ADAPTATIVO
  // ===================================================================
  
  /**
   * Procesa feedback de performance para mejorar futuras selecciones
   */
  processFeedback(feedback: PerformanceFeedback): void {
    if (!this.config.enableAdaptiveLearning) return;
    
    this.feedbackHistory.push(feedback);
    
    // Limitar historial
    if (this.feedbackHistory.length > 1000) {
      this.feedbackHistory = this.feedbackHistory.slice(-500);
    }
    
    // Actualizar thresholds si hay suficientes muestras
    if (this.feedbackHistory.length >= this.config.minSamplesForAdaptation) {
      this.updateAdaptiveThresholds();
    }
    
    // Actualizar patrones aprendidos
    this.updateLearnedPatterns(feedback);
    
    // Log para debugging
    if (!feedback.actualPerformance.success) {
      console.warn(`🤖 Engine ${feedback.engineUsed} falló para complejidad ${feedback.complexityScore.toFixed(3)}`);
    }
  }
  
  /**
   * Obtiene estadísticas de aprendizaje
   */
  getLearningStats(): {
    feedbackCount: number;
    thresholdUpdates: number;
    patternsLearned: number;
    currentAccuracy: number;
    enginePerformance: Record<EngineType, { count: number; successRate: number; avgTime: number }>;
  } {
    const engineStats: Record<string, { count: number; successRate: number; avgTime: number }> = {};
    
    // Calcular estadísticas por engine
    for (const feedback of this.feedbackHistory) {
      if (!engineStats[feedback.engineUsed]) {
        engineStats[feedback.engineUsed] = { count: 0, successRate: 0, avgTime: 0 };
      }
      
      const stats = engineStats[feedback.engineUsed];
      stats.count++;
      
      // Calcular promedio móvil
      const isSuccess = feedback.actualPerformance.success ? 1 : 0;
      stats.successRate = (stats.successRate * (stats.count - 1) + isSuccess) / stats.count;
      stats.avgTime = (stats.avgTime * (stats.count - 1) + feedback.actualPerformance.executionTime) / stats.count;
    }
    
    // Accuracy de selección
    const recentSelections = this.feedbackHistory.slice(-50);
    const correctSelections = recentSelections.filter(f => f.actualPerformance.success).length;
    const currentAccuracy = recentSelections.length > 0 ? correctSelections / recentSelections.length : 0;
    
    return {
      feedbackCount: this.feedbackHistory.length,
      thresholdUpdates: this.thresholds.updateCount,
      patternsLearned: this.learnedPatterns.size,
      currentAccuracy,
      enginePerformance: engineStats as Record<EngineType, { count: number; successRate: number; avgTime: number }>
    };
  }
  
  // ===================================================================
  // 🔍 ANÁLISIS DE COMPLEJIDAD POR DIMENSIÓN
  // ===================================================================
  
  private analyzeAgeComplexity(input: UserInput): number {
    const age = input.age;
    
    // Complejidad aumenta en extremos de edad
    if (age < 25) return 0.3 + (25 - age) * 0.02; // Jóvenes: complejidad media-baja
    if (age >= 25 && age <= 35) return 0.2; // Edad óptima: complejidad baja
    if (age > 35 && age <= 40) return 0.4 + (age - 35) * 0.06; // Incremento moderado
    if (age > 40) return 0.7 + Math.min((age - 40) * 0.05, 0.3); // Alto incremento
    
    return 0.5; // Default
  }
  
  private analyzeHormonalComplexity(input: UserInput): number {
    let complexity = 0;
    let factorCount = 0;
    
    // Analizar cada hormona con sus rangos específicos
    const hormonalFactors = [
      { value: input.amh, normalRange: [1, 4], weight: 0.25 },
      { value: undefined, normalRange: [3, 9], weight: 0.25 }, // FSH no disponible en UserInput
      { value: undefined, normalRange: [2, 10], weight: 0.15 }, // LH no disponible en UserInput
      { value: undefined, normalRange: [30, 100], weight: 0.15 }, // Estradiol no disponible en UserInput
      { value: input.tsh, normalRange: [0.5, 4.5], weight: 0.10 },
      { value: input.prolactin, normalRange: [2, 25], weight: 0.10 }
    ];
    
    for (const factor of hormonalFactors) {
      if (factor.value !== undefined && factor.value !== null) {
        factorCount++;
        
        const [min, max] = factor.normalRange;
        let deviation = 0;
        
        if (factor.value < min) {
          deviation = (min - factor.value) / min;
        } else if (factor.value > max) {
          deviation = (factor.value - max) / max;
        }
        
        complexity += Math.min(deviation, 1) * factor.weight;
      }
    }
    
    // Ajustar por cantidad de datos disponibles
    const dataComplexity = factorCount > 0 ? complexity : 0.5; // Datos faltantes = complejidad media
    
    return Math.min(dataComplexity, 1);
  }
  
  private analyzeAnatomicalComplexity(input: UserInput): number {
    let complexity = 0;
    
    // Endometriosis - factor crítico
    if (input.endometriosisGrade && input.endometriosisGrade > 0) {
      complexity += input.endometriosisGrade * 0.2; // Grado 1-4
    }
    
    // Problemas uterinos
    if (input.myomaType && input.myomaType !== 'none') {
      complexity += input.myomaType === 'submucosal' ? 0.3 : 0.2;
    }
    
    if (input.adenomyosisType && input.adenomyosisType !== 'none') {
      complexity += 0.25;
    }
    
    if (input.polypType && input.polypType !== 'none') {
      complexity += 0.15;
    }
    
    // Problemas tubáricos
    if (input.hsgResult) {
      const hsgComplexity = {
        'bilateral_obstruction': 0.4,
        'unilateral_obstruction': 0.25,
        'hydrosalpinx': 0.35,
        'normal': 0,
        'unknown': 0.1
      };
      complexity += hsgComplexity[input.hsgResult as keyof typeof hsgComplexity] || 0.1;
    }
    
    // Cirugías pélvicas
    if (input.hasPelvicSurgery && input.pelvicSurgeriesNumber) {
      complexity += Math.min(input.pelvicSurgeriesNumber * 0.1, 0.3);
    }
    
    return Math.min(complexity, 1);
  }
  
  private analyzeMasculineComplexity(input: UserInput): number {
    // Analizar parámetros masculinos disponibles
    let complexity = 0;
    
    // Concentración espermática
    if (input.spermConcentration !== undefined) {
      if (input.spermConcentration < 15) {
        complexity += 0.3; // Oligozoospermia severa
      } else if (input.spermConcentration < 20) {
        complexity += 0.2; // Oligozoospermia moderada
      }
    }
    
    // Motilidad progresiva
    if (input.spermProgressiveMotility !== undefined) {
      if (input.spermProgressiveMotility < 32) {
        complexity += 0.25; // Astenozoospermia
      }
    }
    
    // Morfología normal
    if (input.spermNormalMorphology !== undefined) {
      if (input.spermNormalMorphology < 4) {
        complexity += 0.2; // Teratozoospermia
      }
    }
    
    // Volumen seminal
    if (input.semenVolume !== undefined) {
      if (input.semenVolume < 1.5) {
        complexity += 0.15; // Hipospermia
      }
    }
    
    return Math.min(complexity, 1);
  }
  
  private analyzeInteractionComplexity(input: UserInput): number {
    let interactions = 0;
    
    // Interacciones conocidas
    const complexFactors = [
      input.endometriosisGrade && input.endometriosisGrade > 0,
      input.hasPcos,
      input.hasOtb,
      input.age > 38,
      input.bmi && (input.bmi < 18.5 || input.bmi > 30),
      (input.spermConcentration !== undefined && input.spermConcentration < 15) ||
      (input.spermProgressiveMotility !== undefined && input.spermProgressiveMotility < 40)
    ].filter(Boolean).length;
    
    // Complejidad exponencial con múltiples factores
    if (complexFactors === 0) return 0;
    if (complexFactors === 1) return 0.1;
    if (complexFactors === 2) return 0.3;
    if (complexFactors >= 3) return 0.6 + Math.min((complexFactors - 3) * 0.1, 0.4);
    
    return Math.min(interactions, 1);
  }
  
  private detectCriticalFactors(input: UserInput, complexityScores: {
    ageComplexity: number;
    hormonalComplexity: number;
    anatomicalComplexity: number;
    masculineComplexity: number;
    interactionComplexity: number;
  }): string[] {
    const critical: string[] = [];
    
    if (complexityScores.ageComplexity > 0.6) critical.push('AGE_CRITICAL');
    if (complexityScores.hormonalComplexity > 0.7) critical.push('HORMONAL_CRITICAL');
    if (complexityScores.anatomicalComplexity > 0.5) critical.push('ANATOMICAL_CRITICAL');
    if (complexityScores.masculineComplexity > 0.5) critical.push('MASCULINE_CRITICAL');
    if (complexityScores.interactionComplexity > 0.6) critical.push('INTERACTION_CRITICAL');
    
    // Factores específicos críticos
    if (input.endometriosisGrade && input.endometriosisGrade >= 3) critical.push('SEVERE_ENDOMETRIOSIS');
    if (input.age > 42) critical.push('ADVANCED_AGE');
    if (input.hasOtb) critical.push('TUBAL_OBSTRUCTION');
    
    return critical;
  }
  
  private calculateConfidenceLevel(input: UserInput): number {
    // Confianza basada en completitud de datos
    const totalFields = 20; // Número aproximado de campos relevantes
    let filledFields = 0;
    
    // Contar campos completados
    if (input.age) filledFields++;
    if (input.bmi) filledFields++;
    if (input.cycleDuration) filledFields++;
    if (input.amh) filledFields++;
    if (input.endometriosisGrade) filledFields++;
    if (input.spermConcentration) filledFields++; // Datos masculinos
    if (input.spermProgressiveMotility) filledFields++;
    if (input.spermNormalMorphology) filledFields++;
    if (input.semenVolume) filledFields++;
    if (input.prolactin) filledFields++;
    if (input.tsh) filledFields++;
    if (input.homaIr) filledFields++;
    // ... más campos
    
    const dataCompleteness = filledFields / totalFields;
    
    // Ajustar por calidad de datos
    let qualityAdjustment = 1.0;
    
    // Penalizar valores extremos o inconsistentes
    if (input.age && (input.age < 18 || input.age > 50)) qualityAdjustment -= 0.1;
    if (input.bmi && (input.bmi < 15 || input.bmi > 50)) qualityAdjustment -= 0.1;
    
    return Math.max(0.3, Math.min(1.0, dataCompleteness * qualityAdjustment));
  }
  
  // ===================================================================
  // 🛠️ FUNCIONES AUXILIARES PRIVADAS
  // ===================================================================
  
  private initializeThresholds(): void {
    this.thresholds = {
      premiumThreshold: 0.4,
      unifiedThreshold: 0.7,
      ageThreshold: 0.6,
      hormonalThreshold: 0.5,
      anatomicalThreshold: 0.4,
      masculineThreshold: 0.3,
      interactionThreshold: 0.5,
      highLoadThreshold: 0.8,
      lowMemoryThreshold: 512, // MB
      lastUpdated: Date.now(),
      updateCount: 0,
      confidence: 0.5,
      ...this.config.initialThresholds
    };
  }
  
  private makePreliminaryChoice(complexity: number, criticalFactors: string[]): EngineType {
    if (criticalFactors.length >= 3 || complexity > this.thresholds.unifiedThreshold) {
      return 'UNIFIED';
    }
    if (criticalFactors.length >= 1 || complexity > this.thresholds.premiumThreshold) {
      return 'PREMIUM';
    }
    return 'STANDARD';
  }
  
  private analyzeContextualFactors(context: SelectionContext): { complexityAdjustment: number; factors: string[] } {
    let adjustment = 0;
    const factors: string[] = [];
    
    // Ajuste por carga del sistema
    if (context.systemLoad > this.thresholds.highLoadThreshold) {
      adjustment -= 0.1; // Preferir engines más simples
      factors.push('HIGH_SYSTEM_LOAD');
    }
    
    // Ajuste por memoria disponible
    if (context.availableMemory < this.thresholds.lowMemoryThreshold) {
      adjustment -= 0.15;
      factors.push('LOW_MEMORY');
    }
    
    // Ajuste por hora del día (performance puede variar)
    if (context.timeOfDay >= 22 || context.timeOfDay <= 6) {
      adjustment += 0.05; // Menos tráfico, puede usar engines más complejos
      factors.push('OFF_PEAK_HOURS');
    }
    
    // Ajuste por preferencias del usuario
    if (context.userPreferences?.preferAccuracy) {
      adjustment += 0.1;
      factors.push('USER_PREFERS_ACCURACY');
    }
    
    if (context.userPreferences?.preferSpeed) {
      adjustment -= 0.1;
      factors.push('USER_PREFERS_SPEED');
    }
    
    return { complexityAdjustment: adjustment, factors };
  }
  
  private selectByThresholds(complexity: number, criticalFactors: string[]): EngineType {
    // Selección basada en thresholds adaptativos
    if (complexity > this.thresholds.unifiedThreshold || criticalFactors.includes('INTERACTION_CRITICAL')) {
      return 'UNIFIED';
    }
    
    if (complexity > this.thresholds.premiumThreshold || criticalFactors.length > 0) {
      return 'PREMIUM';
    }
    
    return 'STANDARD';
  }
  
  private adjustByPerformanceContext(engine: EngineType, context: SelectionContext): EngineType {
    const recentPerf = context.recentPerformance;
    
    // Si el engine seleccionado ha tenido problemas recientes, considerar alternativa
    const selectedPerf = recentPerf[engine.toLowerCase() as keyof typeof recentPerf];
    
    if (selectedPerf && selectedPerf.successRate < 0.8) {
      // Buscar engine con mejor performance reciente
      const alternatives: EngineType[] = ['STANDARD', 'PREMIUM', 'UNIFIED'];
      
      return alternatives.find(alt => {
        const altPerf = recentPerf[alt.toLowerCase() as keyof typeof recentPerf];
        return altPerf && altPerf.successRate > selectedPerf.successRate;
      }) || engine;
    }
    
    return engine;
  }
  
  private predictPerformance(engine: EngineType, complexity: ComplexityAnalysis, context: SelectionContext): EngineChoice['expectedPerformance'] {
    // Predicción basada en historial y contexto
    const relevantFeedback = this.feedbackHistory.filter(f => 
      f.engineUsed === engine && 
      Math.abs(f.complexityScore - complexity.totalComplexity) < 0.2
    );
    
    if (relevantFeedback.length === 0) {
      // Valores por defecto por engine
      const defaults = {
        STANDARD: { executionTime: 300, successProbability: 0.95, accuracyScore: 0.85 },
        PREMIUM: { executionTime: 500, successProbability: 0.90, accuracyScore: 0.95 },
        UNIFIED: { executionTime: 400, successProbability: 0.98, accuracyScore: 0.92 },
        SIMPLIFIED: { executionTime: 200, successProbability: 0.85, accuracyScore: 0.75 }
      };
      
      return defaults[engine];
    }
    
    // Calcular promedios del historial
    const avgTime = relevantFeedback.reduce((sum, f) => sum + f.actualPerformance.executionTime, 0) / relevantFeedback.length;
    const successRate = relevantFeedback.filter(f => f.actualPerformance.success).length / relevantFeedback.length;
    const avgAccuracy = relevantFeedback
      .filter(f => f.actualPerformance.accuracyScore)
      .reduce((sum, f) => sum + (f.actualPerformance.accuracyScore || 0), 0) / relevantFeedback.length || 0.9;
    
    // Ajustar por contexto actual
    let timeAdjustment = 1.0;
    if (context.systemLoad > 0.8) timeAdjustment *= 1.3;
    if (context.availableMemory < 512) timeAdjustment *= 1.2;
    
    return {
      executionTime: avgTime * timeAdjustment,
      successProbability: successRate,
      accuracyScore: avgAccuracy
    };
  }
  
  private generateFallbackChain(primary: EngineType, complexity: ComplexityAnalysis, context: SelectionContext): EngineType[] {
    const allEngines: EngineType[] = ['STANDARD', 'PREMIUM', 'UNIFIED', 'SIMPLIFIED'];
    
    // Ordenar por preferencia basada en complejidad y contexto
    return allEngines
      .filter(engine => engine !== primary)
      .sort((a, b) => {
        // Lógica de ordenamiento para fallbacks
        const scoreA = this.calculateFallbackScore(a, complexity, context);
        const scoreB = this.calculateFallbackScore(b, complexity, context);
        return scoreB - scoreA;
      })
      .slice(0, 2); // Solo 2 fallbacks
  }
  
  private calculateFallbackScore(engine: EngineType, complexity: ComplexityAnalysis, context: SelectionContext): number {
    let score = 0;
    
    // Score basado en adequación a la complejidad
    const engineComplexityFit = {
      STANDARD: complexity.totalComplexity < 0.4 ? 1 : 0.5,
      PREMIUM: complexity.totalComplexity > 0.3 && complexity.totalComplexity < 0.7 ? 1 : 0.7,
      UNIFIED: complexity.totalComplexity > 0.6 ? 1 : 0.8,
      SIMPLIFIED: complexity.totalComplexity < 0.3 ? 0.9 : 0.3
    };
    
    score += engineComplexityFit[engine];
    
    // Score basado en performance reciente
    const recentPerf = context.recentPerformance[engine.toLowerCase() as keyof typeof context.recentPerformance];
    if (recentPerf) {
      score += recentPerf.successRate;
    }
    
    return score;
  }
  
  private buildSelectionReasoning(engine: EngineType, complexity: ComplexityAnalysis, _context: SelectionContext, contextual: { factors: string[] }): string[] {
    const reasoning: string[] = [];
    
    reasoning.push(`Complejidad total: ${complexity.totalComplexity.toFixed(3)}`);
    reasoning.push(`Factores críticos: ${complexity.criticalFactors.length}`);
    reasoning.push(`Confianza del análisis: ${complexity.confidenceLevel.toFixed(2)}`);
    
    if (contextual.factors.length > 0) {
      reasoning.push(`Factores contextuales: ${contextual.factors.join(', ')}`);
    }
    
    reasoning.push(`Engine seleccionado: ${engine} por thresholds adaptativos`);
    
    return reasoning;
  }
  
  private calculateSelectionConfidence(engine: EngineType, complexity: ComplexityAnalysis, _context: SelectionContext): number {
    // Base confidence del análisis de complejidad
    let confidence = complexity.confidenceLevel;
    
    // Ajustar por experiencia con casos similares
    const similarCases = this.feedbackHistory.filter(f => 
      Math.abs(f.complexityScore - complexity.totalComplexity) < 0.1
    );
    
    if (similarCases.length > 10) {
      const successRate = similarCases.filter(f => f.actualPerformance.success).length / similarCases.length;
      confidence = (confidence + successRate) / 2;
    }
    
    // Penalizar si hay muchos factores críticos inciertos
    if (complexity.criticalFactors.length > 2) {
      confidence *= 0.9;
    }
    
    return Math.max(0.3, Math.min(1.0, confidence));
  }
  
  private generateSelectionCacheKey(complexity: ComplexityAnalysis, context: SelectionContext): string {
    // Generar key basado en características principales
    const complexityKey = Math.round(complexity.totalComplexity * 100);
    const criticalKey = complexity.criticalFactors.sort().join('|');
    const contextKey = [
      Math.round(context.systemLoad * 10),
      Math.round(context.availableMemory / 100),
      context.userPreferences?.preferAccuracy ? 'ACC' : '',
      context.userPreferences?.preferSpeed ? 'SPD' : ''
    ].filter(Boolean).join('|');
    
    return `sel_${complexityKey}_${criticalKey}_${contextKey}`;
  }
  
  private getFromSelectionCache(key: string): EngineChoice | null {
    const cached = this.selectionCache.get(key);
    if (cached && (Date.now() - cached.timestamp) < this.config.selectionCacheTtl) {
      return cached.choice;
    }
    
    if (cached) {
      this.selectionCache.delete(key);
    }
    
    return null;
  }
  
  private cacheSelection(key: string, choice: EngineChoice): void {
    this.selectionCache.set(key, { choice, timestamp: Date.now() });
    
    // Limitar tamaño del cache
    if (this.selectionCache.size > 100) {
      const oldestKey = Array.from(this.selectionCache.keys())[0];
      this.selectionCache.delete(oldestKey);
    }
  }
  
  private updateAdaptiveThresholds(): void {
    // Análisis de feedback para ajustar thresholds
    const recentFeedback = this.feedbackHistory.slice(-100);
    
    // Encontrar casos donde la selección fue subóptima
    const suboptimalCases = recentFeedback.filter(f => 
      !f.actualPerformance.success || 
      f.actualPerformance.executionTime > 1000 ||
      (f.userSatisfaction && f.userSatisfaction < 3)
    );
    
    // Ajustar thresholds basado en aprendizaje
    if (suboptimalCases.length > 0) {
      // Lógica de ajuste simplificada
      const avgComplexityOfFailed = suboptimalCases.reduce((sum, f) => sum + f.complexityScore, 0) / suboptimalCases.length;
      
      // Si muchos casos de baja complejidad fallan, reducir threshold
      if (avgComplexityOfFailed < this.thresholds.premiumThreshold) {
        this.thresholds.premiumThreshold = Math.max(
          this.config.thresholdBounds.min,
          this.thresholds.premiumThreshold - this.config.learningRate * 0.05
        );
      } else {
        // Si casos de alta complejidad fallan, aumentar threshold
        this.thresholds.premiumThreshold = Math.min(
          this.config.thresholdBounds.max,
          this.thresholds.premiumThreshold + this.config.learningRate * 0.05
        );
      }
    }
    
    this.thresholds.updateCount++;
    this.thresholds.lastUpdated = Date.now();
    this.thresholds.confidence = Math.min(1.0, this.thresholds.confidence + 0.01);
  }
  
  private updateLearnedPatterns(feedback: PerformanceFeedback): void {
    // Generar pattern key basado en características del caso
    const patternKey = this.generatePatternKey(feedback);
    
    const existingPattern = this.learnedPatterns.get(patternKey);
    
    if (existingPattern) {
      // Actualizar patrón existente
      existingPattern.successRate = (existingPattern.successRate + (feedback.actualPerformance.success ? 1 : 0)) / 2;
      existingPattern.avgPerformance = (existingPattern.avgPerformance + feedback.actualPerformance.executionTime) / 2;
      
      if (feedback.actualPerformance.success) {
        existingPattern.confidence = Math.min(1, existingPattern.confidence + 0.1);
      } else {
        existingPattern.confidence = Math.max(0, existingPattern.confidence - 0.05);
      }
    } else {
      // Crear nuevo patrón
      this.learnedPatterns.set(patternKey, {
        pattern: patternKey,
        preferredEngine: feedback.engineUsed,
        confidence: feedback.actualPerformance.success ? 0.7 : 0.3,
        successRate: feedback.actualPerformance.success ? 1 : 0,
        avgPerformance: feedback.actualPerformance.executionTime
      });
    }
    
    // Limitar número de patrones
    if (this.learnedPatterns.size > 500) {
      // Remover patrones con menor confianza
      const sortedPatterns = Array.from(this.learnedPatterns.entries())
        .sort(([,a], [,b]) => a.confidence - b.confidence);
      
      for (let i = 0; i < 100; i++) {
        this.learnedPatterns.delete(sortedPatterns[i][0]);
      }
    }
  }
  
  private generatePatternKey(feedback: PerformanceFeedback): string {
    // Simplificar complejidad a rangos
    const complexityRange = Math.floor(feedback.complexityScore * 10);
    
    // Factores de contexto relevantes
    const contextFactors = [
      feedback.context.systemLoad > 0.8 ? 'HIGHLOAD' : '',
      feedback.context.availableMemory < 512 ? 'LOWMEM' : '',
      feedback.context.userPreferences?.preferSpeed ? 'SPEED' : '',
      feedback.context.userPreferences?.preferAccuracy ? 'ACCURACY' : ''
    ].filter(Boolean).join('|');
    
    return `pat_${complexityRange}_${contextFactors}`;
  }
}

// ===================================================================
// 🎯 FUNCIONES PÚBLICAS DEL ENGINE SELECTOR
// ===================================================================

/**
 * Instancia singleton del engine selector
 */
let engineSelectorInstance: IntelligentEngineSelector | null = null;

/**
 * Obtiene la instancia del engine selector
 */
export function getEngineSelector(config?: SelectorConfig): IntelligentEngineSelector {
  if (!engineSelectorInstance) {
    engineSelectorInstance = new IntelligentEngineSelector(config);
  }
  return engineSelectorInstance;
}

/**
 * Función de conveniencia para análisis rápido de complejidad
 */
export function analyzeInputComplexity(input: UserInput): ComplexityAnalysis {
  return getEngineSelector().analyzeComplexity(input);
}

/**
 * Función de conveniencia para selección rápida de engine
 */
export function selectOptimalEngine(input: UserInput, context?: Partial<SelectionContext>): EngineChoice {
  const selector = getEngineSelector();
  const complexity = selector.analyzeComplexity(input);
  
  const fullContext: SelectionContext = {
    timestamp: Date.now(),
    timeOfDay: new Date().getHours(),
    dayOfWeek: new Date().getDay(),
    systemLoad: 0.5, // Default
    availableMemory: 1024, // Default 1GB
    recentPerformance: {
      standardEngine: { avgTime: 300, successRate: 0.95, lastUsed: Date.now() - 60000 },
      premiumEngine: { avgTime: 500, successRate: 0.90, lastUsed: Date.now() - 120000 },
      unifiedEngine: { avgTime: 400, successRate: 0.98, lastUsed: Date.now() - 30000 }
    },
    ...context
  };
  
  return selector.selectEngine(complexity, fullContext);
}

/**
 * Función para registrar feedback de performance
 */
export function recordEnginePerformance(
  engineUsed: EngineType,
  complexityScore: number,
  actualPerformance: PerformanceFeedback['actualPerformance'],
  context?: Partial<SelectionContext>
): void {
  const feedback: PerformanceFeedback = {
    engineUsed,
    complexityScore,
    actualPerformance,
    context: {
      timestamp: Date.now(),
      timeOfDay: new Date().getHours(),
      dayOfWeek: new Date().getDay(),
      systemLoad: 0.5,
      availableMemory: 1024,
      recentPerformance: {
        standardEngine: { avgTime: 300, successRate: 0.95, lastUsed: Date.now() },
        premiumEngine: { avgTime: 500, successRate: 0.90, lastUsed: Date.now() },
        unifiedEngine: { avgTime: 400, successRate: 0.98, lastUsed: Date.now() }
      },
      ...context
    },
    timestamp: Date.now()
  };
  
  getEngineSelector().processFeedback(feedback);
}
