// ===================================================================
// 🚀 FERTILITY SIMULATOR AVANZADO - FASE 4A OPTIMIZADO
// ===================================================================

import { useState, useCallback, useRef, useEffect } from 'react';
import { EvaluationState, Factors, SimulatableFactor } from '@/core/domain/models';
import { calculateProbabilityUnified, UnifiedEngineMetrics } from '@/core/domain/services/calculationEngineUnified';

export const ALL_FACTORS_SIMULATION_KEY = 'all';

// 🎯 Nuevos tipos para el simulador mejorado
export type SimulationMode = 'single' | 'batch' | 'treatment' | 'timeline' | 'comparison';

export interface TreatmentSimulation {
  treatment: 'lifestyle' | 'medication' | 'iui' | 'ivf' | 'surgery' | 'combined';
  duration: number;
  cost: number;
  successRate: number;
  requirements: string[];
  contraindications: string[];
  timeline: Array<{
    phase: string;
    duration: number;
    description: string;
  }>;
}

export interface TimelineSimulation {
  scenarios: Array<{
    timeframe: '3months' | '6months' | '12months';
    interventions: SimulationResult[];
    cumulativeImprovement: number;
    costAccumulated: number;
    probabilityProgression: number[];
  }>;
  optimalPath: SimulationResult[];
  quickWins: SimulationResult[];
  longTermInvestments: SimulationResult[];
}

// 📊 Interfaces avanzadas para simulación
export interface SimulationResult {
  factor: SimulatableFactor | 'all';
  explanation: string;
  originalPrognosis: number;
  newPrognosis: number;
  improvement: number;
  impactLevel: 'low' | 'medium' | 'high' | 'critical';
  estimatedTimeframe: string;
  difficulty: 'easy' | 'moderate' | 'difficult' | 'complex';
  cost: 'low' | 'medium' | 'high';
  evidence: string;
  recommendations: string[];
  // 🆕 MÉTRICAS DEL MOTOR UNIFICADO
  engineMetrics?: {
    engineUsed: 'standard' | 'premium';
    executionTime: number;
    complexityScore: number;
    decisionReason: string;
  };
}

export interface BatchSimulationResult {
  totalImprovement: number;
  bestSingleFactor: SimulationResult;
  mostPracticalFactor: SimulationResult;
  quickWins: SimulationResult[];
  longTermGoals: SimulationResult[];
  priorityMatrix: PriorityMatrix;
}

export interface PriorityMatrix {
  highImpactEasy: SimulationResult[];
  highImpactDifficult: SimulationResult[];
  mediumImpactEasy: SimulationResult[];
  mediumImpactDifficult: SimulationResult[];
}

export interface SimulationCache {
  [key: string]: SimulationResult;
}

export interface SimulationMetrics {
  totalSimulations: number;
  averageCalculationTime: number;
  cacheHitRate: number;
  lastSimulationTime: number;
  basicEngineUsage: number;
  premiumEngineUsage: number;
  complexityAnalysisTime: number;
}

// 🔍 Configuración del Dual-Engine Inteligente
export interface EngineSelection {
  engine: 'basic' | 'premium';
  reason: string;
  complexityScore: number;
  estimatedTime: number;
}

export interface ComplexityAnalysis {
  score: number;
  factors: string[];
  requiresPremium: boolean;
  reasoning: string;
}

// 📋 Configuración avanzada de factores para DUAL-ENGINE
const FACTOR_METADATA: Record<SimulatableFactor, {
  name: string;
  timeframe: string;
  difficulty: SimulationResult['difficulty'];
  cost: SimulationResult['cost'];
  evidence: string;
  category: 'lifestyle' | 'medical' | 'surgical' | 'hormonal';
  dependencies?: SimulatableFactor[];
  complexityWeight: number; // Peso para análisis de complejidad (0-1)
  requiresPremium: boolean; // Si requiere obligatoriamente motor Premium
  interactionLevel: 'none' | 'low' | 'medium' | 'high'; // Nivel de interacciones
}> = {
  bmi: {
    name: 'Índice de Masa Corporal',
    timeframe: '3-6 meses',
    difficulty: 'moderate',
    cost: 'low',
    evidence: 'Strong evidence (PMID: 25431122)',
    category: 'lifestyle',
    complexityWeight: 0.3,
    requiresPremium: false,
    interactionLevel: 'medium'
  },
  cycle: {
    name: 'Regularidad del Ciclo',
    timeframe: '2-4 meses',
    difficulty: 'easy',
    cost: 'low',
    evidence: 'Moderate evidence (PMID: 23870423)',
    category: 'lifestyle',
    complexityWeight: 0.2,
    requiresPremium: false,
    interactionLevel: 'low'
  },
  pcos: {
    name: 'Síndrome de Ovario Poliquístico',
    timeframe: '6-12 meses',
    difficulty: 'difficult',
    cost: 'medium',
    evidence: 'Strong evidence (PMID: 28460551)',
    category: 'hormonal',
    dependencies: ['bmi'],
    complexityWeight: 0.8,
    requiresPremium: true,
    interactionLevel: 'high'
  },
  endometriosis: {
    name: 'Endometriosis',
    timeframe: '6-18 meses',
    difficulty: 'complex',
    cost: 'high',
    evidence: 'Strong evidence (PMID: 31277194)',
    category: 'surgical',
    complexityWeight: 0.9,
    requiresPremium: true,
    interactionLevel: 'high'
  },
  myoma: {
    name: 'Miomas Uterinos',
    timeframe: '3-12 meses',
    difficulty: 'difficult',
    cost: 'high',
    evidence: 'Moderate evidence (PMID: 29453926)',
    category: 'surgical',
    complexityWeight: 0.7,
    requiresPremium: true,
    interactionLevel: 'medium'
  },
  adenomyosis: {
    name: 'Adenomiosis',
    timeframe: '6-24 meses',
    difficulty: 'complex',
    cost: 'high',
    evidence: 'Limited evidence (PMID: 30447124)',
    category: 'medical',
    complexityWeight: 0.85,
    requiresPremium: true,
    interactionLevel: 'high'
  },
  polyp: {
    name: 'Pólipos Endometriales',
    timeframe: '1-3 meses',
    difficulty: 'easy',
    cost: 'medium',
    evidence: 'Moderate evidence (PMID: 27568409)',
    category: 'surgical',
    complexityWeight: 0.4,
    requiresPremium: false,
    interactionLevel: 'low'
  },
  hsg: {
    name: 'Permeabilidad Tubárica',
    timeframe: '3-6 meses',
    difficulty: 'difficult',
    cost: 'high',
    evidence: 'Strong evidence (PMID: 28460551)',
    category: 'surgical',
    complexityWeight: 0.75,
    requiresPremium: true,
    interactionLevel: 'medium'
  },
  amh: {
    name: 'Reserva Ovárica (AMH)',
    timeframe: '6-12 meses',
    difficulty: 'complex',
    cost: 'medium',
    evidence: 'Strong evidence (PMID: 29453926)',
    category: 'medical',
    complexityWeight: 0.8,
    requiresPremium: true,
    interactionLevel: 'high'
  },
  prolactin: {
    name: 'Niveles de Prolactina',
    timeframe: '1-3 meses',
    difficulty: 'easy',
    cost: 'low',
    evidence: 'Strong evidence (PMID: 25431122)',
    category: 'hormonal',
    complexityWeight: 0.3,
    requiresPremium: false,
    interactionLevel: 'low'
  },
  tsh: {
    name: 'Función Tiroidea (TSH)',
    timeframe: '2-6 meses',
    difficulty: 'easy',
    cost: 'low',
    evidence: 'Strong evidence (PMID: 28460551)',
    category: 'hormonal',
    complexityWeight: 0.25,
    requiresPremium: false,
    interactionLevel: 'low'
  },
  homa: {
    name: 'Resistencia a la Insulina',
    timeframe: '3-6 meses',
    difficulty: 'moderate',
    cost: 'low',
    evidence: 'Moderate evidence (PMID: 27568409)',
    category: 'hormonal',
    dependencies: ['bmi'],
    complexityWeight: 0.6,
    requiresPremium: true,
    interactionLevel: 'medium'
  },
  male: {
    name: 'Factor Masculino',
    timeframe: '3-6 meses',
    difficulty: 'moderate',
    cost: 'medium',
    evidence: 'Strong evidence (PMID: 30447124)',
    category: 'medical',
    complexityWeight: 0.5,
    requiresPremium: false,
    interactionLevel: 'medium'
  },
  infertilityDuration: {
    name: 'Duración de Infertilidad',
    timeframe: 'N/A',
    difficulty: 'complex',
    cost: 'low',
    evidence: 'Observational data',
    category: 'medical',
    complexityWeight: 0.7,
    requiresPremium: true,
    interactionLevel: 'medium'
  },
  pelvicSurgery: {
    name: 'Cirugías Pélvicas',
    timeframe: 'N/A',
    difficulty: 'complex',
    cost: 'high',
    evidence: 'Limited evidence',
    category: 'surgical',
    complexityWeight: 0.8,
    requiresPremium: true,
    interactionLevel: 'high'
  },
  otb: {
    name: 'Ovario Trasplantado/Banco',
    timeframe: 'N/A',
    difficulty: 'complex',
    cost: 'high',
    evidence: 'Experimental',
    category: 'surgical',
    complexityWeight: 0.95,
    requiresPremium: true,
    interactionLevel: 'high'
  }
};

// 🧠 DUAL-ENGINE INTELIGENTE - ANÁLISIS DE COMPLEJIDAD
const analyzeComplexity = (
  factors: Factors,
  targetFactor?: SimulatableFactor
): ComplexityAnalysis => {
  let complexityScore = 0;
  const complexFactors: string[] = [];
  let requiresPremium = false;

  // Análisis de factor específico
  if (targetFactor && targetFactor !== 'otb') {
    const metadata = FACTOR_METADATA[targetFactor];
    complexityScore += metadata.complexityWeight;
    
    if (metadata.requiresPremium) {
      requiresPremium = true;
      complexFactors.push(`${metadata.name} (requiere motor Premium)`);
    }

    // Verificar dependencias
    if (metadata.dependencies) {
      metadata.dependencies.forEach(dep => {
        if (factors[dep] < 1.0) {
          complexityScore += 0.2;
          complexFactors.push(`Dependencia: ${FACTOR_METADATA[dep].name}`);
        }
      });
    }
  } else {
    // Análisis de múltiples factores
    (Object.keys(factors) as Array<keyof Factors>).forEach(key => {
      if (key !== 'baseAgeProbability' && key !== 'otb' && factors[key] < 1.0) {
        const metadata = FACTOR_METADATA[key as SimulatableFactor];
        if (metadata) {
          complexityScore += metadata.complexityWeight * (1 - factors[key]);
          if (metadata.requiresPremium) {
            requiresPremium = true;
            complexFactors.push(metadata.name);
          }
        }
      }
    });
  }

  // Umbral de complejidad: > 0.5 requiere Premium
  if (complexityScore > 0.5) {
    requiresPremium = true;
  }

  return {
    score: Math.min(complexityScore, 1.0),
    factors: complexFactors,
    requiresPremium,
    reasoning: complexityScore > 0.5 
      ? `Complejidad alta (${(complexityScore * 100).toFixed(1)}%) - Requiere motor Premium`
      : `Complejidad baja (${(complexityScore * 100).toFixed(1)}%) - Motor básico suficiente`
  };
};

// 🎯 SELECTOR INTELIGENTE DE MOTOR
const selectEngine = (
  complexity: ComplexityAnalysis,
  performanceContext?: { preferBasic?: boolean }
): EngineSelection => {
  const useBasic = !complexity.requiresPremium && 
                   complexity.score < 0.5 && 
                   performanceContext?.preferBasic !== false;

  return {
    engine: useBasic ? 'basic' : 'premium',
    reason: useBasic 
      ? `Motor básico: Caso simple (${(complexity.score * 100).toFixed(1)}% complejidad)`
      : `Motor Premium: ${complexity.reasoning}`,
    complexityScore: complexity.score,
    estimatedTime: useBasic ? 5 : 15 // ms estimados
  };
};

// 📈 GENERADOR DE RESULTADOS ENRIQUECIDOS
const generateEnrichedResult = (
  factor: SimulatableFactor | 'all',
  explanation: string,
  originalPrognosis: number,
  newPrognosis: number,
  engineUsed: 'basic' | 'premium',
  engineMetrics?: UnifiedEngineMetrics
): SimulationResult => {
  const improvement = newPrognosis - originalPrognosis;
  const metadata = factor !== 'all' ? FACTOR_METADATA[factor] : null;

  // Calcular nivel de impacto
  const getImpactLevel = (improvement: number): SimulationResult['impactLevel'] => {
    if (improvement >= 0.3) return 'critical';
    if (improvement >= 0.15) return 'high';
    if (improvement >= 0.05) return 'medium';
    return 'low';
  };

  // Generar recomendaciones inteligentes
  const generateRecommendations = (): string[] => {
    const recommendations: string[] = [];
    
    if (factor !== 'all' && metadata) {
      recommendations.push(`Consultar especialista en ${metadata.category}`);
      
      if (metadata.dependencies) {
        recommendations.push('Optimizar factores dependientes primero');
      }
      
      if (improvement > 0.2) {
        recommendations.push('Prioridad alta - Impacto significativo esperado');
      }
      
      if (metadata.cost === 'low') {
        recommendations.push('Costo-efectivo - Considerar implementación inmediata');
      }
    } else {
      recommendations.push('Plan integral multifactorial');
      recommendations.push('Implementación por fases según prioridad');
      recommendations.push('Monitoreo continuo de progreso');
    }

    return recommendations;
  };

  return {
    factor,
    explanation: `${explanation} (Motor: ${engineUsed})`,
    originalPrognosis,
    newPrognosis,
    improvement,
    impactLevel: getImpactLevel(improvement),
    estimatedTimeframe: metadata?.timeframe || 'Variable',
    difficulty: metadata?.difficulty || 'moderate',
    cost: metadata?.cost || 'medium',
    evidence: metadata?.evidence || 'Clinical assessment',
    recommendations: generateRecommendations(),
    // 🆕 INCLUIR MÉTRICAS DEL MOTOR UNIFICADO
    engineMetrics: engineMetrics ? {
      engineUsed: engineMetrics.engineUsed,
      executionTime: engineMetrics.executionTime,
      complexityScore: engineMetrics.complexityScore,
      decisionReason: engineMetrics.decisionReason
    } : undefined
  };
};

/**
 * 🚀 HOOK DUAL-ENGINE INTELIGENTE PARA SIMULACIÓN DE FERTILIDAD
 * Selecciona automáticamente entre motor básico y Premium según complejidad.
 * @param originalEvaluation - El estado de evaluación original sobre el que se ejecutarán las simulaciones.
 */
export const useFertilitySimulator = (originalEvaluation: EvaluationState | null) => {
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [engineSelection, setEngineSelection] = useState<EngineSelection | null>(null);
  const [metrics, setMetrics] = useState<SimulationMetrics>({
    totalSimulations: 0,
    averageCalculationTime: 0,
    cacheHitRate: 0,
    lastSimulationTime: 0,
    basicEngineUsage: 0,
    premiumEngineUsage: 0,
    complexityAnalysisTime: 0
  });

  // 🧮 Cache inteligente para simulaciones
  const cacheRef = useRef<SimulationCache>({});

  // 🔄 SIMULACIÓN INDIVIDUAL CON DUAL-ENGINE
  const simulateFactor = useCallback(
    (factorToImprove: SimulatableFactor, explanation: string) => {
      if (!originalEvaluation) return;

      const startTime = performance.now();

      // 🔍 Análisis de complejidad
      const complexity = analyzeComplexity(originalEvaluation.factors, factorToImprove);
      const engine = selectEngine(complexity);
      
      setEngineSelection(engine);

      const originalPrognosis = originalEvaluation.report.numericPrognosis;
      const simulatedFactors = { ...originalEvaluation.factors };

      // Optimiza el factor seleccionado a su valor ideal (1.0)
      simulatedFactors[factorToImprove] = 1.0;

      // 🎯 SELECCIÓN INTELIGENTE DE MOTOR CON UNIFIED ENGINE
      let newPrognosis: number;
      let engineMetrics: UnifiedEngineMetrics;
      
      if (engine.engine === 'basic') {
        // Motor básico para casos simples - usar unified en modo standard
        const { result, metrics } = calculateProbabilityUnified(
          { ...originalEvaluation.input, ...simulatedFactors },
          { mode: 'standard', debugMode: false }
        );
        newPrognosis = result.report.numericPrognosis;
        engineMetrics = metrics;
      } else {
        // Motor Premium para casos complejos - usar unified en modo premium
        const { result, metrics } = calculateProbabilityUnified(
          { ...originalEvaluation.input, ...simulatedFactors },
          { mode: 'premium', debugMode: false }
        );
        newPrognosis = result.report.numericPrognosis;
        engineMetrics = metrics;
      }

      // 📊 Resultado enriquecido
      const enrichedResult = generateEnrichedResult(
        factorToImprove,
        explanation,
        originalPrognosis,
        newPrognosis,
        engine.engine,
        engineMetrics
      );

      setSimulationResult(enrichedResult);

      // 📈 Actualizar métricas
      const executionTime = performance.now() - startTime;
      setMetrics(prev => ({
        ...prev,
        totalSimulations: prev.totalSimulations + 1,
        averageCalculationTime: (prev.averageCalculationTime + executionTime) / 2,
        lastSimulationTime: executionTime,
        basicEngineUsage: engine.engine === 'basic' ? prev.basicEngineUsage + 1 : prev.basicEngineUsage,
        premiumEngineUsage: engine.engine === 'premium' ? prev.premiumEngineUsage + 1 : prev.premiumEngineUsage,
        complexityAnalysisTime: (prev.complexityAnalysisTime + (performance.now() - startTime)) / 2
      }));
    },
    [originalEvaluation],
  );

  // 🌍 SIMULACIÓN GLOBAL CON DUAL-ENGINE
  const simulateAllImprovements = useCallback(() => {
    if (!originalEvaluation) return;

    const startTime = performance.now();

    // 🔍 Análisis de complejidad global
    const complexity = analyzeComplexity(originalEvaluation.factors);
    const engine = selectEngine(complexity);
    
    setEngineSelection(engine);

    const originalPrognosis = originalEvaluation.report.numericPrognosis;
    const simulatedFactors = { ...originalEvaluation.factors };

    // Itera y optimiza todos los factores que no son perfectos (valor < 1.0)
    (Object.keys(simulatedFactors) as Array<keyof Factors>).forEach(key => {
      if (key !== 'baseAgeProbability' && key !== 'otb' && simulatedFactors[key] < 1.0) {
        simulatedFactors[key] = 1.0;
      }
    });

    // 🎯 SELECCIÓN INTELIGENTE DE MOTOR CON UNIFIED ENGINE
    let newPrognosis: number;
    let globalEngineMetrics: UnifiedEngineMetrics;
    
    if (engine.engine === 'basic') {
      // Motor básico para escenarios simples - usar unified en modo standard
      const { result, metrics } = calculateProbabilityUnified(
        { ...originalEvaluation.input, ...simulatedFactors },
        { mode: 'standard', debugMode: false }
      );
      newPrognosis = result.report.numericPrognosis;
      globalEngineMetrics = metrics;
    } else {
      // Motor Premium para escenarios complejos - usar unified en modo premium
      const { result, metrics } = calculateProbabilityUnified(
        { ...originalEvaluation.input, ...simulatedFactors },
        { mode: 'premium', debugMode: false }
      );
      newPrognosis = result.report.numericPrognosis;
      globalEngineMetrics = metrics;
    }

    // 📊 Resultado enriquecido global
    const enrichedResult = generateEnrichedResult(
      ALL_FACTORS_SIMULATION_KEY,
      'todos los factores optimizables',
      originalPrognosis,
      newPrognosis,
      engine.engine,
      globalEngineMetrics
    );

    setSimulationResult(enrichedResult);

    // 📈 Actualizar métricas
    const executionTime = performance.now() - startTime;
    setMetrics(prev => ({
      ...prev,
      totalSimulations: prev.totalSimulations + 1,
      averageCalculationTime: (prev.averageCalculationTime + executionTime) / 2,
      lastSimulationTime: executionTime,
      basicEngineUsage: engine.engine === 'basic' ? prev.basicEngineUsage + 1 : prev.basicEngineUsage,
      premiumEngineUsage: engine.engine === 'premium' ? prev.premiumEngineUsage + 1 : prev.premiumEngineUsage,
      complexityAnalysisTime: (prev.complexityAnalysisTime + (performance.now() - startTime)) / 2
    }));
  }, [originalEvaluation]);

  // 🧹 Limpiar cache cuando cambie la evaluación
  useEffect(() => {
    cacheRef.current = {};
  }, [originalEvaluation]);

  return {
    simulationResult,
    engineSelection,
    metrics,
    simulateFactor,
    simulateAllImprovements,
    // 🔧 Métodos avanzados
    clearCache: useCallback(() => {
      cacheRef.current = {};
    }, []),
    getComplexityAnalysis: useCallback((factor?: SimulatableFactor) => {
      if (!originalEvaluation) return null;
      return analyzeComplexity(originalEvaluation.factors, factor);
    }, [originalEvaluation])
  };
};
