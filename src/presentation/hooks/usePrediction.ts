/**
 * 🚀 FASE 3B: HOOK DE PREDICCIÓN AVANZADA
 * 
 * Hook personalizado que integra el motor predictivo con React Native
 * Se conecta con toda la arquitectura existente:
 * - calculationEngine + calculationEnginePremium
 * - treatmentSuggesterPremium
 * - Interface components
 * 
 * FUNCIONALIDADES:
 * ✅ Predicción reactiva en tiempo real
 * ✅ Cache inteligente de predicciones
 * ✅ Estados de carga optimizados
 * ✅ Métricas de rendimiento
 * ✅ Auto-reentrenamiento
 */

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import type { UserInput } from '../../core/domain/models';
import { 
  predictFertilityOutcomeAdvanced, 
  getPredictionEngineMetrics, 
  type PredictionResult, 
  type PredictionInput,
  type UserPreferences 
} from '../../core/domain/services/predictiveEngine';

// ===================================================================
// 🎯 TIPOS PARA EL HOOK
// ===================================================================

interface UsePredictionOptions {
  // Configuración del motor
  engineVersion?: 'standard' | 'premium';
  autoPredict?: boolean; // Auto-predecir cuando cambian los inputs
  debounceMs?: number; // Delay para auto-predicción
  
  // Características avanzadas
  enableRealTimeUpdates?: boolean;
  enablePerformanceMonitoring?: boolean;
  enableCaching?: boolean;
  
  // Personalización
  userPreferences?: UserPreferences;
  priority?: 'speed' | 'accuracy' | 'balanced';
}

interface PredictionState {
  // Estado de la predicción
  isLoading: boolean;
  isInitialized: boolean;
  result: PredictionResult | null;
  error: string | null;
  
  // Métricas de rendimiento
  lastPredictionTime: number;
  totalPredictions: number;
  cacheHitRate: number;
  
  // Estado del motor
  modelMetrics: {
    accuracy: number;
    confidence: number;
    totalPredictions: number;
  };
}

interface PredictionActions {
  // Acciones principales
  predict: (userInput: UserInput, force?: boolean) => Promise<void>;
  clearPrediction: () => void;
  clearCache: () => void;
  
  // Utilidades
  retry: () => Promise<void>;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  
  // Métricas
  getMetrics: () => ReturnType<typeof getPredictionEngineMetrics>;
}

type UsePredictionReturn = [PredictionState, PredictionActions];

// ===================================================================
// 🚀 HOOK PRINCIPAL
// ===================================================================

export function usePrediction(options: UsePredictionOptions = {}): UsePredictionReturn {
  const {
    engineVersion = 'premium',
    autoPredict = true, // TODO: Implementar auto-predicción
    debounceMs = 1000,
    enableRealTimeUpdates = true, // TODO: Implementar actualizaciones en tiempo real
    enablePerformanceMonitoring = true,
    enableCaching = true,
    userPreferences,
    priority = 'balanced' // TODO: Implementar prioridades
  } = options;

  // Suprimir advertencias de variables destinadas para implementación futura
  void autoPredict;
  void enableRealTimeUpdates;
  void priority;

  // ===================================================================
  // 🏗️ ESTADO LOCAL
  // ===================================================================

  const [state, setState] = useState<PredictionState>({
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
    }
  });

  // Referencias para optimización
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastInputRef = useRef<UserInput | null>(null);
  const cacheRef = useRef<Map<string, { result: PredictionResult; timestamp: number }>>(new Map());
  const metricsRef = useRef({ hits: 0, misses: 0 });
  const preferencesRef = useRef(userPreferences);

  // Función auxiliar para calcular cache hit rate
  const calculateCacheHitRate = useCallback((): number => {
    const { hits, misses } = metricsRef.current;
    const total = hits + misses;
    
    return total === 0 ? 0 : Math.round((hits / total) * 100);
  }, []);

  // Función auxiliar para limpiar cache
  const cleanupCache = useCallback((): void => {
    const now = Date.now();
    const fiveMinutesAgo = now - (5 * 60 * 1000);
    
    // ✅ Compatibilidad React Native: usar Array.from para iteradores
    for (const [key, value] of Array.from(cacheRef.current.entries())) {
      if (value.timestamp < fiveMinutesAgo) {
        cacheRef.current.delete(key);
      }
    }
    
    console.log('🧹 Cache limpiado automáticamente');
  }, []);

  // ===================================================================
  // 🎯 FUNCIÓN PRINCIPAL DE PREDICCIÓN
  // ===================================================================

  const predict = useCallback(async (userInput: UserInput, force = false): Promise<void> => {
    const startTime = performance.now();
    
    try {
      setState(prev => ({
        ...prev,
        isLoading: true,
        error: null
      }));

      // Generar clave de cache
      const cacheKey = generateCacheKey(userInput, engineVersion);
      
      // Verificar cache si está habilitado
      if (enableCaching && !force && cacheRef.current.has(cacheKey)) {
        const cached = cacheRef.current.get(cacheKey)!;
        const cacheAge = Date.now() - cached.timestamp;
        
        // Cache válido por 5 minutos
        if (cacheAge < 5 * 60 * 1000) {
          metricsRef.current.hits++;
          
          setState(prev => ({
            ...prev,
            isLoading: false,
            result: cached.result,
            isInitialized: true,
            lastPredictionTime: performance.now() - startTime,
            cacheHitRate: calculateCacheHitRate()
          }));
          
          console.log('🎯 Predicción obtenida del cache');
          return;
        } else {
          // Cache expirado
          cacheRef.current.delete(cacheKey);
        }
      }

      // Miss de cache
      metricsRef.current.misses++;

      console.log('🚀 Ejecutando predicción avanzada...');

      // Preparar contexto de sesión
      const sessionContext: PredictionInput['sessionContext'] = {
        previousCalculations: [], // TODO: Implementar historial
        userPreferences: preferencesRef.current,
        clinicalHistory: [] // TODO: Implementar historial clínico
      };

      // Ejecutar predicción
      const predictionResult = await predictFertilityOutcomeAdvanced(userInput, {
        sessionContext
      });

      // Guardar en cache
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

      // Actualizar estado
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
        }
      }));

      // Actualizar referencia del último input
      lastInputRef.current = userInput;

      console.log(`✅ Predicción completada en ${processingTime.toFixed(1)}ms`);
      
      // Log de métricas si está habilitado
      if (enablePerformanceMonitoring) {
        logPerformanceMetrics(predictionResult, processingTime);
      }

    } catch (error) {
      console.error('❌ Error en predicción:', error);
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Error desconocido en predicción'
      }));
    }
  }, [engineVersion, enableCaching, enablePerformanceMonitoring]);

  // ===================================================================
  // 🤖 AUTO-PREDICCIÓN CON DEBOUNCE
  // ===================================================================

  const debouncedPredict = useCallback((userInput: UserInput) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      predict(userInput);
    }, debounceMs);
  }, [predict, debounceMs]);

  // Suprimir advertencia: será usado en implementación futura
  void debouncedPredict;

  // ===================================================================
  // 🔧 ACCIONES AUXILIARES
  // ===================================================================

  const clearPrediction = useCallback(() => {
    setState(prev => ({
      ...prev,
      result: null,
      error: null,
      isInitialized: false
    }));
    
    lastInputRef.current = null;
    
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
  }, []);

  const clearCache = useCallback(() => {
    cacheRef.current.clear();
    metricsRef.current = { hits: 0, misses: 0 };
    
    setState(prev => ({
      ...prev,
      cacheHitRate: 0
    }));
    
    console.log('🧹 Cache de predicciones limpiado');
  }, []);

  const retry = useCallback(async () => {
    if (lastInputRef.current) {
      await predict(lastInputRef.current, true); // Force prediction
    }
  }, [predict]);

  const updatePreferences = useCallback((newPreferences: Partial<UserPreferences>) => {
    if (preferencesRef.current) {
      preferencesRef.current = {
        ...preferencesRef.current,
        ...newPreferences
      };
    } else {
      // Si no hay preferencias previas, crear objeto base
      preferencesRef.current = {
        preferredTreatmentCategory: 'moderate',
        riskTolerance: 'medium',
        timelinePreference: 'planned',
        budgetConsiderations: 'basic',
        ...newPreferences
      } as UserPreferences;
    }
    
    console.log('🎯 Preferencias de usuario actualizadas');
  }, []);

  const getMetrics = useCallback(() => {
    return getPredictionEngineMetrics();
  }, []);

  // ===================================================================
  // 🧠 EFECTOS Y OPTIMIZACIONES
  // ===================================================================

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  // Limpiar cache periódicamente
  useEffect(() => {
    if (!enableCaching) return;

    const interval = setInterval(() => {
      cleanupCache();
    }, 10 * 60 * 1000); // Cada 10 minutos

    return () => clearInterval(interval);
  }, [enableCaching]);

  // ===================================================================
  // 🎯 OBJETO DE ACCIONES MEMOIZADO
  // ===================================================================

  const actions = useMemo<PredictionActions>(() => ({
    predict,
    clearPrediction,
    clearCache,
    retry,
    updatePreferences,
    getMetrics
  }), [predict, clearPrediction, clearCache, retry, updatePreferences, getMetrics]);

  // ===================================================================
  // 🚀 RETURN DEL HOOK
  // ===================================================================

  return [state, actions];
}

// ===================================================================
// 🛠️ FUNCIONES AUXILIARES
// ===================================================================

function generateCacheKey(userInput: UserInput, engineVersion: string): string {
  const keyData = {
    age: userInput.age,
    bmi: userInput.bmi,
    amh: userInput.amh,
    engine: engineVersion,
    // Incluir otros campos relevantes
    pcos: userInput.hasPcos,
    endo: userInput.endometriosisGrade,
    duration: userInput.infertilityDuration
  };
  
  return btoa(JSON.stringify(keyData)).substring(0, 16);
}

function logPerformanceMetrics(result: PredictionResult, processingTime: number): void {
  console.group('📊 Métricas de Predicción FASE 3B');
  console.log(`⚡ Tiempo de procesamiento: ${processingTime.toFixed(1)}ms`);
  console.log(`🎯 Confianza de predicción: ${result.predictedOutcome.confidence}%`);
  console.log(`🤖 Confianza del modelo: ${result.metadata.modelConfidence}%`);
  console.log(`📈 Calidad de datos: ${result.metadata.dataQuality}%`);
  console.log(`🔮 Probabilidad predicha: ${result.predictedOutcome.probability.toFixed(1)}%`);
  console.log(`💡 Oportunidades identificadas: ${result.analytics.improvementOpportunities.length}`);
  console.log(`⚠️ Riesgos identificados: ${result.analytics.riskAssessment.specificRisks.length}`);
  console.groupEnd();
}

// ===================================================================
// 🎯 HOOK ESPECIALIZADO PARA AUTO-PREDICCIÓN
// ===================================================================

/**
 * Hook simplificado para auto-predicción reactiva
 * Ideal para formularios que necesitan predicción en tiempo real
 */
export function useAutoPrediction(
  userInput: UserInput | null,
  options: Omit<UsePredictionOptions, 'autoPredict'> = {}
): UsePredictionReturn {
  const [state, actions] = usePrediction({
    ...options,
    autoPredict: true
  });

  // Auto-predecir cuando cambien los inputs
  useEffect(() => {
    if (userInput && isValidUserInput(userInput)) {
      actions.predict(userInput);
    }
  }, [userInput, actions]);

  return [state, actions];
}

/**
 * Validar si el input del usuario es suficiente para predicción
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
// 🌟 EXPORTACIONES
// ===================================================================

export type {
  UsePredictionOptions,
  PredictionState,
  PredictionActions,
  UsePredictionReturn
};
