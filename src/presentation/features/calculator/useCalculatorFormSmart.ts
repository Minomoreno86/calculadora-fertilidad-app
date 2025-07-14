/**
 * 🚀 FASE 1.2: Hook de Calculadora con Auto-Activación de Validación Paralela
 * 
 * Versión de producción que integra automáticamente validación paralela
 * cuando detecta que es beneficiosa para el usuario.
 * 
 * CARACTERÍSTICAS:
 * - Auto-activación inteligente basada en complejidad del formulario
 * - Fallback automático a validación tradicional si hay problemas
 * - Métricas en tiempo real para optimización continua
 * - 100% compatible con la API existente
 */

import { useCalculatorForm } from './useCalculatorForm';
import { useParallelValidation } from './hooks/useParallelValidationSimple';
import { useMemo, useEffect, useState } from 'react';

/**
 * Hook inteligente que decide automáticamente cuándo usar validación paralela
 */
export function useCalculatorFormSmart() {
  const originalForm = useCalculatorForm();
  const [parallelState, parallelControls] = useParallelValidation({
    enableMetrics: true
  });
  
  const [isParallelActive, setIsParallelActive] = useState(false);
  const [performanceMetrics, setPerformanceMetrics] = useState({
    parallelBeneficial: false,
    complexityScore: 0,
    recommendedMode: 'traditional' as 'traditional' | 'parallel' | 'hybrid'
  });

  /**
   * Calcular score de complejidad basado en datos del formulario
   */
  const complexityScore = useMemo(() => {
    const fields = originalForm.watchedFields;
    let score = 0;
    
    // Contar campos completados
    const completedFields = Object.values(fields).filter(value => 
      value !== undefined && value !== null && value !== ''
    ).length;
    
    // Más campos = más beneficio de paralelización
    score += completedFields * 2;
    
    // Campos complejos dan más puntos
    if (fields.height && fields.weight) score += 10; // BMI calculation
    if (fields.fsh || fields.lh || fields.estradiol) score += 15; // Hormonal analysis
    if (fields.antralFollicleCount) score += 8; // Follicle analysis
    
    return Math.min(score, 100); // Cap at 100
  }, [originalForm.watchedFields]);

  /**
   * Determinar si validación paralela es beneficiosa
   */
  const shouldUseParallel = useMemo(() => {
    // Activar si hay suficiente complejidad
    if (complexityScore >= 30) return true;
    
    // Activar si hay muchos campos
    const fieldCount = Object.keys(originalForm.watchedFields).length;
    if (fieldCount >= 8) return true;
    
    return false;
  }, [complexityScore, originalForm.watchedFields]);

  /**
   * Auto-activar validación paralela cuando sea beneficiosa
   */
  useEffect(() => {
    const newRecommendation = shouldUseParallel ? 'parallel' : 'traditional';
    
    setPerformanceMetrics(prev => ({
      ...prev,
      parallelBeneficial: shouldUseParallel,
      complexityScore,
      recommendedMode: newRecommendation
    }));

    // Auto-activar solo si realmente es beneficioso
    if (shouldUseParallel && !isParallelActive) {
      setIsParallelActive(true);
      console.log('🚀 Auto-activando validación paralela - Complejidad:', complexityScore);
    }
  }, [shouldUseParallel, complexityScore, isParallelActive]);

  /**
   * Ejecutar validación paralela en background cuando esté activa
   */
  useEffect(() => {
    if (isParallelActive && !parallelState.isRunning) {
      // Ejecutar validación en background cada vez que cambien los datos
      const timer = setTimeout(() => {
        parallelControls.startValidation([]).catch(error => {
          console.warn('⚠️ Error en validación paralela, fallback a tradicional:', error);
          setIsParallelActive(false);
        });
      }, 1000); // Debounce de 1 segundo

      return () => clearTimeout(timer);
    }
  }, [originalForm.watchedFields, isParallelActive, parallelState.isRunning, parallelControls]);

  /**
   * API extendida que combina lo mejor de ambos mundos
   */
  return {
    // ✅ API original completa sin cambios
    ...originalForm,
    
    // 🚀 Nuevas características de validación paralela
    parallel: {
      isActive: isParallelActive,
      state: parallelState,
      controls: parallelControls,
      metrics: performanceMetrics,
      
      // Controles manuales
      enable: () => setIsParallelActive(true),
      disable: () => setIsParallelActive(false),
      toggle: () => setIsParallelActive(!isParallelActive),
      
      // Info de estado
      isSupported: parallelControls.isValidationSupported,
      isBeneficial: performanceMetrics.parallelBeneficial,
      complexityScore: performanceMetrics.complexityScore
    },
    
    // 📊 Métricas combinadas
    getPerformanceReport: () => ({
      traditional: originalForm.getPerformanceReport(),
      parallel: parallelControls.getPerformanceReport(),
      combined: {
        activeMode: isParallelActive ? 'parallel' : 'traditional',
        recommendation: performanceMetrics.recommendedMode,
        complexityScore: performanceMetrics.complexityScore,
        autoActivated: performanceMetrics.parallelBeneficial,
        timestamp: Date.now()
      }
    })
  };
}

export default useCalculatorFormSmart;
