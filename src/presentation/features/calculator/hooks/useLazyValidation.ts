// ===================================================================
// 🚀 LAZY VALIDATION HOOK - Validación selectiva bajo demanda
// ===================================================================

import { useCallback, useMemo } from 'react';
import { useAdaptivePerformance } from '@/core/performance/adaptivePerformanceConfig';

interface LazyValidationConfig {
  enableThreshold: number;        // % completitud para activar validación avanzada
  disableThreshold: number;       // % completitud para desactivar validación básica
  forceValidationFields: string[]; // Campos que siempre disparan validación
  skipValidationFields: string[];  // Campos que nunca disparan validación
}

interface LazyValidationState {
  shouldUseAdvancedValidation: boolean;
  shouldUseBasicValidation: boolean;
  shouldUseParallelValidation: boolean;
  shouldUseMedicalValidation: boolean;
  validationPriority: 'none' | 'basic' | 'advanced' | 'complete';
}

const DEFAULT_CONFIG: LazyValidationConfig = {
  enableThreshold: 60,  // Validación avanzada al 60% completitud
  disableThreshold: 30, // Validación básica hasta 30% completitud
  forceValidationFields: ['age', 'weight', 'height'], // Campos críticos
  skipValidationFields: ['comments', 'notes'], // Campos no críticos
};

/**
 * Hook para validación lazy/selectiva basada en contexto y performance
 */
export function useLazyValidation(
  formData: Record<string, unknown>,
  config: Partial<LazyValidationConfig> = {}
) {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const { isHighPerformanceDevice, isLowPerformanceDevice, validationDebounce } = useAdaptivePerformance();
  
  // 📊 Calcular métricas de completitud
  const completionMetrics = useMemo(() => {
    const totalFields = Object.keys(formData).length;
    const completedFields = Object.values(formData).filter(value => 
      value !== '' && value !== null && value !== undefined && value !== false
    ).length;
    
    const completionRate = totalFields > 0 ? (completedFields / totalFields) * 100 : 0;
    
    // Campos críticos completados
    const criticalCompleted = finalConfig.forceValidationFields.filter(field =>
      formData[field] !== '' && formData[field] !== null && formData[field] !== undefined
    ).length;
    
    const criticalCompletionRate = finalConfig.forceValidationFields.length > 0 
      ? (criticalCompleted / finalConfig.forceValidationFields.length) * 100 
      : 100;
    
    return {
      totalFields,
      completedFields,
      completionRate,
      criticalCompleted,
      criticalCompletionRate
    };
  }, [formData, finalConfig.forceValidationFields]);

  // 🎯 Determinar nivel de validación necesario
  const validationState = useMemo((): LazyValidationState => {
    const { completionRate, criticalCompletionRate } = completionMetrics;
    
    // Determinar prioridad de validación
    let validationPriority: LazyValidationState['validationPriority'];
    if (completionRate > 90) {
      validationPriority = 'complete';
    } else if (completionRate > finalConfig.enableThreshold) {
      validationPriority = 'advanced';
    } else if (completionRate > finalConfig.disableThreshold) {
      validationPriority = 'basic';
    } else {
      validationPriority = 'none';
    }
    
    // Dispositivos de baja performance: validación más conservadora
    if (isLowPerformanceDevice()) {
      let lowPerformancePriority: LazyValidationState['validationPriority'];
      if (completionRate > 80) {
        lowPerformancePriority = 'advanced';
      } else if (completionRate > 40) {
        lowPerformancePriority = 'basic';
      } else {
        lowPerformancePriority = 'none';
      }
      
      return {
        shouldUseAdvancedValidation: completionRate > 80,
        shouldUseBasicValidation: completionRate > 40,
        shouldUseParallelValidation: false, // Nunca en dispositivos lentos
        shouldUseMedicalValidation: completionRate > 70 && criticalCompletionRate > 80,
        validationPriority: lowPerformancePriority
      };
    }
    
    // Dispositivos de alta performance: validación más agresiva
    if (isHighPerformanceDevice()) {
      return {
        shouldUseAdvancedValidation: completionRate > finalConfig.enableThreshold,
        shouldUseBasicValidation: completionRate > finalConfig.disableThreshold,
        shouldUseParallelValidation: completionRate > 70, // Más temprano en dispositivos rápidos
        shouldUseMedicalValidation: criticalCompletionRate > 60,
        validationPriority
      };
    }
    
    // Dispositivos de performance media: configuración balanceada
    return {
      shouldUseAdvancedValidation: completionRate > finalConfig.enableThreshold,
      shouldUseBasicValidation: completionRate > finalConfig.disableThreshold,
      shouldUseParallelValidation: completionRate > 75,
      shouldUseMedicalValidation: criticalCompletionRate > 70,
      validationPriority
    };
  }, [completionMetrics, finalConfig, isHighPerformanceDevice, isLowPerformanceDevice]);

  // 🚀 Funciones de utilidad para componentes
  const shouldValidateField = useCallback((fieldName: string): boolean => {
    // Siempre validar campos forzados
    if (finalConfig.forceValidationFields.includes(fieldName)) {
      return true;
    }
    
    // Nunca validar campos excluidos
    if (finalConfig.skipValidationFields.includes(fieldName)) {
      return false;
    }
    
    // Validar según estado general
    return validationState.shouldUseBasicValidation;
  }, [finalConfig, validationState.shouldUseBasicValidation]);

  const getValidationDelay = useCallback((fieldName: string): number => {
    // Campos críticos: validación más rápida
    if (finalConfig.forceValidationFields.includes(fieldName)) {
      return Math.max(validationDebounce * 0.5, 100);
    }
    
    // Validación normal según performance
    return validationDebounce;
  }, [finalConfig.forceValidationFields, validationDebounce]);

  return {
    // Estado de validación
    ...validationState,
    
    // Métricas de completitud
    completionMetrics,
    
    // Funciones de utilidad
    shouldValidateField,
    getValidationDelay,
    
    // Configuración aplicada
    config: finalConfig,
    
    // Debug info
    debugInfo: {
      devicePerformance: getDevicePerformanceString(),
      currentPriority: validationState.validationPriority,
      completionRate: completionMetrics.completionRate,
      criticalRate: completionMetrics.criticalCompletionRate
    }
  };

  // Helper function para evitar ternario anidado
  function getDevicePerformanceString(): string {
    if (isHighPerformanceDevice()) return 'high';
    if (isLowPerformanceDevice()) return 'low';
    return 'medium';
  }
}
