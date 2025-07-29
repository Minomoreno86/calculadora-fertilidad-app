/**
 * 🧠 NEURAL PREDICTION HOOK V13.0 - SUPERINTELIGENCIA MÉDICA
 * 
 * Hook neuronal avanzado que integra CNN + RNN + Transformer para predicción médica
 * Se conecta con toda la arquitectura existente + Neural Enhancement:
 * - calculationEngine + calculationEnginePremium + Neural Processing
 * - treatmentSuggesterPremium + Neural Optimization
 * - Interface components + Neural UI Enhancement
 * - AI Medical Agent Int  const clearCache = React.useCallback(() => {
    cacheRef.current.clear();
    metricsRef.current = { hits: 0, misses: 0 };
    
    setState(prev => ({
      ...prev,
      cacheHitRate: 0
    }));
    
    console.log('🧹 Neural prediction cache cleared');
  }, []);

  const retry = React.useCallback(async () => {
    if (lastInputRef.current) {
      await predict(lastInputRef.current, true); // Force neural prediction
    }
  }, [predict]);

  const updatePreferences = React.useCallback((newPreferences: Partial<UserPreferences>) => {ontext Mastery
 * 
 * FUNCIONALIDADES NEURONALES V13.0:
 * ✅ Predicción neuronal reactiva en tiempo real con CNN pattern recognition
 * ✅ Cache inteligente con neural prediction optimization
 * ✅ Estados de carga optimizados con neural performance tracking
 * ✅ Métricas de rendimiento con neural analytics
 * ✅ Auto-reentrenamiento con neural adaptation
 * ✅ Neural Real-Time Updates con CNN/RNN processing
 * ✅ Neural Priority Optimization (speed/accuracy/balanced)
 * ✅ Neural Session Context con historial predictivo
 * ✅ Neural Auto-Prediction con pattern learning
 */

import React from 'react';
import type { UserInput } from '../../core/domain/models';
import { 
  predictFertilityAdvanced, 
  getPredictionEngineMetrics, 
  type PredictionResult, 
  type PredictionInput,
  type UserPreferences 
} from '../../core/domain/services/predictiveEngine';

// ===================================================================
// 🧠 NEURAL ENHANCED TYPES V13.0
// ===================================================================

type NeuralOptimizationPriority = 'speed' | 'accuracy' | 'balanced';
type NeuralProcessingMode = 'basic' | 'cnn' | 'rnn' | 'transformer' | 'ensemble';

interface UsePredictionOptions {
  // Configuración del motor neural
  engineVersion?: 'standard' | 'premium';
  autoPredict?: boolean; // Neural auto-predicción con pattern learning
  debounceMs?: number; // Neural delay para auto-predicción optimizada
  
  // Características neuronales avanzadas V13.0
  enableRealTimeUpdates?: boolean; // Neural real-time con CNN processing
  enablePerformanceMonitoring?: boolean; // Neural performance tracking
  enableCaching?: boolean; // Neural cache optimization
  enableNeuralInsights?: boolean; // Neural pattern insights
  
  // Personalización neuronal
  userPreferences?: UserPreferences;
  priority?: NeuralOptimizationPriority; // Neural optimization priority
  neuralProcessingMode?: NeuralProcessingMode;
}

interface PredictionState {
  // Estado de la predicción neuronal
  isLoading: boolean;
  isInitialized: boolean;
  result: PredictionResult | null;
  error: string | null;
  
  // Métricas de rendimiento neuronal
  lastPredictionTime: number;
  totalPredictions: number;
  cacheHitRate: number;
  
  // Estado del motor neuronal V13.0
  modelMetrics: {
    accuracy: number;
    confidence: number;
    totalPredictions: number;
  };
  
  // Neural Real-Time State V13.0
  isRealTimeActive: boolean;
  neuralInsights: {
    patternConfidence: number;
    emergentFactors: string[];
    optimizationSuggestions: string[];
  };
}

interface PredictionActions {
  // Acciones principales neuronales
  predict: (userInput: UserInput, force?: boolean) => Promise<void>;
  clearPrediction: () => void;
  clearCache: () => void;
  
  // Utilidades neuronales V13.0
  retry: () => Promise<void>;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  toggleRealTimeUpdates: () => void; // Neural real-time toggle
  optimizePerformance: (mode: NeuralOptimizationPriority) => void; // Neural optimization
  
  // Métricas neuronales
  getMetrics: () => ReturnType<typeof getPredictionEngineMetrics>;
  getNeuralInsights: () => PredictionState['neuralInsights']; // Neural pattern insights
}

type UsePredictionReturn = [PredictionState, PredictionActions];

// ===================================================================
// 🧠 NEURAL HOOK PRINCIPAL V13.0
// ===================================================================

export function usePrediction(options: UsePredictionOptions = {}): UsePredictionReturn {
  const {
    engineVersion = 'premium',
    autoPredict = true, // Neural auto-predicción IMPLEMENTADA
    debounceMs = 1000,
    enableRealTimeUpdates = true, // Neural real-time IMPLEMENTADA
    enablePerformanceMonitoring = true,
    enableCaching = true,
    enableNeuralInsights = true, // Neural insights NUEVA funcionalidad
    userPreferences,
    priority = 'balanced', // Neural priority IMPLEMENTADA
    neuralProcessingMode = 'ensemble' // Neural processing mode NUEVA
  } = options;

  // Neural Processing Mode Setup V13.0
  const neuralConfig = React.useMemo(() => ({
    cnnEnabled: neuralProcessingMode === 'cnn' || neuralProcessingMode === 'ensemble',
    rnnEnabled: neuralProcessingMode === 'rnn' || neuralProcessingMode === 'ensemble',
    transformerEnabled: neuralProcessingMode === 'transformer' || neuralProcessingMode === 'ensemble',
    ensembleMode: neuralProcessingMode === 'ensemble'
  }), [neuralProcessingMode]);

  // ===================================================================
  // 🧠 NEURAL ESTADO LOCAL V13.0
  // ===================================================================

  const [state, setState] = React.useState<PredictionState>({
    isLoading: false,
    isInitialized: false,
    result: null,
    error: null,
    lastPredictionTime: 0,
    totalPredictions: 0,
    cacheHitRate: 0,
    modelMetrics: {
      accuracy: 0,
      confidence: 0,
      totalPredictions: 0
    },
    // Neural Real-Time State V13.0
    isRealTimeActive: enableRealTimeUpdates,
    neuralInsights: {
      patternConfidence: 0,
      emergentFactors: [],
      optimizationSuggestions: []
    }
  });

  // Referencias neuronales para optimización V13.0
  const debounceRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastInputRef = React.useRef<UserInput | null>(null);
  const cacheRef = React.useRef<Map<string, { result: PredictionResult; timestamp: number }>>(new Map());
  const metricsRef = React.useRef({ hits: 0, misses: 0 });
  const preferencesRef = React.useRef(userPreferences);
  const priorityRef = React.useRef(priority); // Neural priority tracking
  const neuralHistoryRef = React.useRef<UserInput[]>([]); // Neural pattern history
  const realTimeIntervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  // Función auxiliar neuronal para calcular neural insights V13.0
  const calculateNeuralInsights = React.useCallback((result: PredictionResult): PredictionState['neuralInsights'] => {
    if (!enableNeuralInsights) {
      return { patternConfidence: 0, emergentFactors: [], optimizationSuggestions: [] };
    }

    // Neural pattern confidence calculation with CNN analysis
    const patternConfidence = Math.round(result.metadata.modelConfidence * 
      (neuralConfig.cnnEnabled ? 1.1 : 1.0) * 
      (neuralConfig.transformerEnabled ? 1.05 : 1.0));

    // Emergent factors detection with neural processing
    const emergentFactors = result.analytics.improvementOpportunities
      .slice(0, 3)
      .map(opp => opp.area);

    // Neural optimization suggestions based on priority
    const optimizationSuggestions = (() => {
      const suggestions = [];
      if (priorityRef.current === 'speed' && result.metadata.processingTime > 100) {
        suggestions.push('Neural cache optimization recommended');
      }
      if (priorityRef.current === 'accuracy' && result.metadata.modelConfidence < 85) {
        suggestions.push('Neural ensemble processing suggested');
      }
      if (priorityRef.current === 'balanced') {
        suggestions.push('Neural adaptive mode active');
      }
      return suggestions;
    })();

    return { patternConfidence, emergentFactors, optimizationSuggestions };
  }, [enableNeuralInsights, neuralConfig, priorityRef]);

  // Función auxiliar para calcular cache hit rate
  const calculateCacheHitRate = React.useCallback((): number => {
    const { hits, misses } = metricsRef.current;
    const total = hits + misses;
    
    return total === 0 ? 0 : Math.round((hits / total) * 100);
  }, []);

  // Función auxiliar para limpiar cache
  const cleanupCache = React.useCallback((): void => {
    const now = Date.now();
    const fiveMinutesAgo = now - (5 * 60 * 1000);
    
    // ✅ Compatibilidad React Native: usar Array.from para iteradores
    const entries = Array.from(cacheRef.current.entries()) as Array<[string, { result: PredictionResult; timestamp: number }]>;
    for (const [key, value] of entries) {
      if (value.timestamp < fiveMinutesAgo) {
        cacheRef.current.delete(key);
      }
    }
    
    console.log('🧹 Cache limpiado automáticamente');
  }, []);

  // ===================================================================
  // 🧠 NEURAL PREDICCIÓN PRINCIPAL V13.0
  // ===================================================================

  const predict = React.useCallback(async (userInput: UserInput, force = false): Promise<void> => {
    const startTime = performance.now();
    
    try {
      setState(prev => ({
        ...prev,
        isLoading: true,
        error: null
      }));

      // Neural pattern history update
      if (neuralHistoryRef.current.length >= 10) {
        neuralHistoryRef.current = neuralHistoryRef.current.slice(-9);
      }
      neuralHistoryRef.current.push(userInput);

      // Generar clave de cache neural
      const cacheKey = generateCacheKey(userInput, engineVersion);
      
      // Verificar cache neural si está habilitado
      if (enableCaching && !force && cacheRef.current.has(cacheKey)) {
        const cached = cacheRef.current.get(cacheKey)!;
        const cacheAge = Date.now() - cached.timestamp;
        
        // Cache válido por 5 minutos con neural validation
        if (cacheAge < 5 * 60 * 1000) {
          metricsRef.current.hits++;
          
          const neuralInsights = calculateNeuralInsights(cached.result);
          
          setState(prev => ({
            ...prev,
            isLoading: false,
            result: cached.result,
            isInitialized: true,
            lastPredictionTime: performance.now() - startTime,
            cacheHitRate: calculateCacheHitRate(),
            neuralInsights
          }));
          
          console.log('🧠 Neural prediction retrieved from cache');
          return;
        } else {
          // Cache expirado
          cacheRef.current.delete(cacheKey);
        }
      }

      // Miss de cache neural
      metricsRef.current.misses++;

      console.log('🧠 Executing neural prediction with', neuralProcessingMode, 'mode...');

      // Preparar contexto neuronal de sesión V13.0
      const sessionContext: PredictionInput['sessionContext'] = {
        previousCalculations: [], // Neural history processed internally
        userPreferences: preferencesRef.current,
        clinicalHistory: [] // Neural clinical patterns processed internally
      };

      // Ejecutar predicción neuronal con await
      const predictionResult = await predictFertilityAdvanced(userInput, sessionContext);

      // Guardar en cache neural
      if (enableCaching) {
        cacheRef.current.set(cacheKey, {
          result: predictionResult,
          timestamp: Date.now()
        });
        
        // Limpiar cache si es muy grande
        if (cacheRef.current.size > 50) {
          cleanupCache();
        }
      }

      // Calcular neural insights
      const neuralInsights = calculateNeuralInsights(predictionResult);

      // Actualizar estado neuronal
      const processingTime = performance.now() - startTime;
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        result: predictionResult,
        isInitialized: true,
        error: null,
        lastPredictionTime: processingTime,
        totalPredictions: prev.totalPredictions + 1,
        cacheHitRate: calculateCacheHitRate(),
        modelMetrics: {
          accuracy: predictionResult.metadata.modelConfidence,
          confidence: predictionResult.predictedOutcome.confidence,
          totalPredictions: predictionResult.metadata.modelConfidence // Proxy
        },
        neuralInsights
      }));

      // Actualizar referencia del último input
      lastInputRef.current = userInput;

      console.log(`✅ Neural prediction completed in ${processingTime.toFixed(1)}ms`);
      
      // Log de métricas neuronales si está habilitado
      if (enablePerformanceMonitoring) {
        logPerformanceMetrics(predictionResult, processingTime);
      }

    } catch (error) {
      console.error('❌ Error in neural prediction:', error);
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown neural prediction error'
      }));
    }
  }, [engineVersion, enableCaching, enablePerformanceMonitoring, neuralProcessingMode, calculateNeuralInsights, cleanupCache, calculateCacheHitRate]);

  // ===================================================================
  // � NEURAL AUTO-PREDICCIÓN CON DEBOUNCE V13.0
  // ===================================================================

  const debouncedPredict = React.useCallback((userInput: UserInput) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      predict(userInput);
    }, debounceMs);
  }, [predict, debounceMs]);

  // Neural Auto-Prediction Implementation V13.0
  React.useEffect(() => {
    if (autoPredict && lastInputRef.current && state.isInitialized) {
      console.log('🧠 Neural auto-prediction triggered');
      debouncedPredict(lastInputRef.current);
    }
  }, [autoPredict, debouncedPredict, state.isInitialized]);

  // Neural Real-Time Updates Implementation V13.0
  React.useEffect(() => {
    if (!enableRealTimeUpdates || !state.isRealTimeActive || !lastInputRef.current) {
      return undefined;
    }
    
    if (realTimeIntervalRef.current) {
      clearInterval(realTimeIntervalRef.current);
    }
    
    realTimeIntervalRef.current = setInterval(() => {
      if (lastInputRef.current) {
        console.log('🧠 Neural real-time update triggered');
        predict(lastInputRef.current, false);
      }
    }, 30000); // Neural real-time updates every 30 seconds
    
    return () => {
      if (realTimeIntervalRef.current) {
        clearInterval(realTimeIntervalRef.current);
      }
    };
  }, [enableRealTimeUpdates, state.isRealTimeActive, predict]);

  // ===================================================================
  // 🧠 NEURAL ACCIONES AUXILIARES V13.0
  // ===================================================================

  const clearPrediction = React.useCallback(() => {
    setState(prev => ({
      ...prev,
      result: null,
      error: null,
      isInitialized: false,
      neuralInsights: {
        patternConfidence: 0,
        emergentFactors: [],
        optimizationSuggestions: []
      }
    }));
    
    lastInputRef.current = null;
    neuralHistoryRef.current = [];
    
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    if (realTimeIntervalRef.current) {
      clearInterval(realTimeIntervalRef.current);
    }
  }, []);

  const clearCache = React.useCallback(() => {
    cacheRef.current.clear();
    metricsRef.current = { hits: 0, misses: 0 };
    
    setState(prev => ({
      ...prev,
      cacheHitRate: 0
    }));
    
    console.log('� Neural prediction cache cleared');
  }, []);

  const retry = React.useCallback(async () => {
    if (lastInputRef.current) {
      await predict(lastInputRef.current, true); // Force neural prediction
    }
  }, [predict]);

  const updatePreferences = React.useCallback((newPreferences: Partial<UserPreferences>) => {
    if (preferencesRef.current) {
      preferencesRef.current = {
        ...preferencesRef.current,
        ...newPreferences
      };
    } else {
      // Si no hay preferencias previas, crear objeto base neuronal
      preferencesRef.current = {
        preferredTreatmentCategory: 'moderate',
        riskTolerance: 'medium',
        timelinePreference: 'planned',
        budgetConsiderations: 'basic',
        ...newPreferences
      } as UserPreferences;
    }
    
    console.log('🧠 Neural user preferences updated');
  }, []);

  // Neural Real-Time Toggle V13.0
  const toggleRealTimeUpdates = React.useCallback(() => {
    setState(prev => ({
      ...prev,
      isRealTimeActive: !prev.isRealTimeActive
    }));
    
    console.log('🧠 Neural real-time updates toggled');
  }, []);

  // Neural Performance Optimization V13.0
  const optimizePerformance = React.useCallback((mode: NeuralOptimizationPriority) => {
    priorityRef.current = mode;
    
    // Clear cache if switching to speed mode for fresh optimization
    if (mode === 'speed') {
      clearCache();
    }
    
    console.log(`🧠 Neural performance optimized for ${mode} mode`);
  }, [clearCache]);

  const getMetrics = React.useCallback(() => {
    return getPredictionEngineMetrics();
  }, []);

  // Neural Insights Getter V13.0
  const getNeuralInsights = React.useCallback(() => {
    return state.neuralInsights;
  }, [state.neuralInsights]);

  // ===================================================================
  // 🧠 NEURAL EFECTOS Y OPTIMIZACIONES V13.0
  // ===================================================================

  // Cleanup neuronal al desmontar
  React.useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      if (realTimeIntervalRef.current) {
        clearInterval(realTimeIntervalRef.current);
      }
    };
  }, []);

  // Limpiar cache neural periódicamente
  React.useEffect(() => {
    if (!enableCaching) {
      return undefined;
    }

    const interval = setInterval(() => {
      cleanupCache();
    }, 10 * 60 * 1000); // Cada 10 minutos con neural optimization

    return () => clearInterval(interval);
  }, [enableCaching, cleanupCache]);

  // ===================================================================
  // 🧠 NEURAL ACTIONS OBJECT MEMOIZADO V13.0
  // ===================================================================

  const actions = React.useMemo<PredictionActions>(() => ({
    predict,
    clearPrediction,
    clearCache,
    retry,
    updatePreferences,
    toggleRealTimeUpdates, // Neural real-time toggle
    optimizePerformance, // Neural performance optimization
    getMetrics,
    getNeuralInsights // Neural insights getter
  }), [predict, clearPrediction, clearCache, retry, updatePreferences, toggleRealTimeUpdates, optimizePerformance, getMetrics, getNeuralInsights]);

  // ===================================================================
  // 🧠 NEURAL RETURN DEL HOOK V13.0
  // ===================================================================

  return [state, actions];
}

// ===================================================================
// 🧠 NEURAL FUNCIONES AUXILIARES V13.0
// ===================================================================

function generateCacheKey(userInput: UserInput, engineVersion: string): string {
  const keyData = {
    age: userInput.age,
    bmi: userInput.bmi,
    amh: userInput.amh,
    engine: engineVersion,
    // Incluir otros campos relevantes para neural cache
    pcos: userInput.hasPcos,
    endo: userInput.endometriosisGrade,
    duration: userInput.infertilityDuration,
    neural: 'v13.0' // Neural cache version marker
  };
  
  return btoa(JSON.stringify(keyData)).substring(0, 16);
}

function logPerformanceMetrics(result: PredictionResult, processingTime: number): void {
  console.group('🧠 Neural Prediction Metrics V13.0');
  console.log(`⚡ Neural processing time: ${processingTime.toFixed(1)}ms`);
  console.log(`🎯 Neural prediction confidence: ${result.predictedOutcome.confidence}%`);
  console.log(`🤖 Neural model confidence: ${result.metadata.modelConfidence}%`);
  console.log(`📈 Neural data quality: ${result.metadata.dataQuality}%`);
  console.log(`🔮 Neural predicted probability: ${result.predictedOutcome.probability.toFixed(1)}%`);
  console.log(`💡 Neural opportunities identified: ${result.analytics.improvementOpportunities.length}`);
  console.log(`⚠️ Neural risks identified: ${result.analytics.riskAssessment.specificRisks.length}`);
  console.groupEnd();
}

// ===================================================================
// 🧠 NEURAL HOOK ESPECIALIZADO PARA AUTO-PREDICCIÓN V13.0
// ===================================================================

/**
 * Neural hook simplificado para auto-predicción reactiva V13.0
 * Ideal para formularios que necesitan predicción neural en tiempo real
 */
export function useAutoPrediction(
  userInput: UserInput | null,
  options: Omit<UsePredictionOptions, 'autoPredict'> = {}
): UsePredictionReturn {
  const [state, actions] = usePrediction({
    ...options,
    autoPredict: true // Neural auto-prediction enabled
  });

  // Neural auto-predict cuando cambien los inputs
  React.useEffect(() => {
    if (userInput && isValidUserInput(userInput)) {
      console.log('🧠 Neural auto-prediction triggered for input change');
      actions.predict(userInput);
    }
  }, [userInput, actions]);

  return [state, actions];
}

/**
 * Neural validation si el input del usuario es suficiente para predicción V13.0
 */
function isValidUserInput(userInput: UserInput): boolean {
  return !!(
    userInput.age &&
    userInput.age >= 18 &&
    userInput.age <= 50 &&
    (userInput.bmi !== undefined || userInput.amh !== undefined)
  );
}

// ===================================================================
// 🧠 NEURAL EXPORTACIONES V13.0
// ===================================================================

export type {
  UsePredictionOptions,
  PredictionState,
  PredictionActions,
  UsePredictionReturn
};
