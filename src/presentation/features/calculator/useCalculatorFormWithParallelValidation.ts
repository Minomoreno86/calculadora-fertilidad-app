/**
 * 🚀 FASE 1.2: Hook de Calculadora con Validación Paralela
 * 
 * Versión mejorada del hook useCalculatorForm que integra
 * validación paralela manteniendo 100% de compatibilidad
 * con la interfaz existente.
 * 
 * CRÍTICO: Este hook extiende useCalculatorForm SIN modificarlo.
 * La aplicación puede seguir usando el hook original sin cambios.
 */

import { useMemo, useCallback } from 'react';
import { useCalculatorForm, UseCalculatorFormReturn } from '../useCalculatorForm';
import { useParallelValidation, ParallelValidationState, ParallelValidationControls } from './useParallelValidation';
import { ValidationGroup } from '@/core/workers/parallelValidationEngine';
import type { ValidationTask } from '@/core/workers/validationWorker';

/**
 * Interfaz extendida que mantiene 100% compatibilidad
 * y añade funcionalidades de validación paralela
 */
export interface UseCalculatorFormParallelReturn extends UseCalculatorFormReturn {
  // 🚀 NUEVAS características de validación paralela (OPCIONALES)
  parallel: {
    state: ParallelValidationState;
    controls: ParallelValidationControls;
    isEnabled: boolean;
    canUseParallel: boolean;
  };
  
  // 🎯 Funciones de conveniencia
  enableParallelValidation: () => Promise<void>;
  runQuickValidation: () => Promise<void>;
  getValidationSummary: () => {
    traditional: any;
    parallel: any;
    recommendation: 'use-traditional' | 'use-parallel' | 'use-hybrid';
  };
}

/**
 * Opciones para el hook paralelo
 */
export interface UseCalculatorFormParallelOptions {
  enableParallelByDefault?: boolean;
  autoRunValidation?: boolean;
  hybridMode?: boolean; // Usar ambos sistemas
  performanceMode?: 'speed' | 'accuracy' | 'balanced';
}

/**
 * Hook de calculadora con validación paralela
 * 
 * MANTIENE 100% de compatibilidad con useCalculatorForm original
 * y añade capacidades de validación paralela como extensión opcional.
 */
export function useCalculatorFormParallel(
  options: UseCalculatorFormParallelOptions = {}
): UseCalculatorFormParallelReturn {

  // 1. 🔄 Usar el hook original (sin modificaciones)
  const originalForm = useCalculatorForm();

  // 2. 🚀 Añadir validación paralela como extensión
  const [parallelState, parallelControls] = useParallelValidation({
    enableMetrics: true,
    config: {
      maxConcurrency: options.performanceMode === 'speed' ? 6 : 4,
      enableCache: true,
      criticalThreshold: options.performanceMode === 'speed' ? 300 : 500
    }
  });

  /**
   * Verificar si la validación paralela está disponible y es beneficiosa
   */
  const canUseParallel = useMemo(() => {
    // Verificar soporte del navegador/entorno
    if (!parallelControls.isValidationSupported) return false;
    
    // Verificar si hay suficientes campos para beneficiarse de paralelización
    const watchedFields = originalForm.watchedFields;
    const fieldCount = Object.keys(watchedFields).length;
    
    return fieldCount >= 5; // Solo beneficioso con varios campos
  }, [parallelControls.isValidationSupported, originalForm.watchedFields]);

  /**
   * Generar grupos de validación basados en los datos del formulario
   */
  const generateValidationGroups = useCallback((): ValidationGroup[] => {
    const watchedFields = originalForm.watchedFields;
    
    // Grupo crítico: Validaciones básicas requeridas
    const criticalTasks: ValidationTask[] = [
      {
        id: 'basic-age',
        type: 'range',
        data: { field: 'age', value: watchedFields.age },
        priority: 'high',
        timestamp: Date.now()
      },
      {
        id: 'basic-weight-height',
        type: 'clinical',
        data: { 
          weight: watchedFields.weight, 
          height: watchedFields.height,
          bmi: originalForm.calculatedBmi
        },
        priority: 'high',
        timestamp: Date.now()
      }
    ];

    // Grupo importante: Validaciones clínicas
    const importantTasks: ValidationTask[] = [
      {
        id: 'hormonal-profile',
        type: 'clinical',
        data: {
          fsh: watchedFields.fsh,
          lh: watchedFields.lh,
          estradiol: watchedFields.estradiol
        },
        priority: 'medium',
        timestamp: Date.now()
      },
      {
        id: 'cycle-analysis',
        type: 'cross-field',
        data: {
          cycleLength: watchedFields.cycleLength,
          menarcheAge: watchedFields.menarcheAge,
          currentAge: watchedFields.age
        },
        priority: 'medium',
        timestamp: Date.now()
      }
    ];

    // Grupo opcional: Validaciones avanzadas
    const optionalTasks: ValidationTask[] = [
      {
        id: 'lifestyle-factors',
        type: 'bulk',
        data: {
          smoking: watchedFields.smokingStatus,
          exercise: watchedFields.exerciseFrequency,
          stress: watchedFields.stressLevel
        },
        priority: 'low',
        timestamp: Date.now()
      }
    ];

    return [
      {
        id: 'critical-basic',
        name: 'Validaciones Básicas',
        tasks: criticalTasks,
        priority: 'critical',
        estimatedTime: 200
      },
      {
        id: 'important-clinical',
        name: 'Análisis Clínico',
        tasks: importantTasks,
        dependencies: ['critical-basic'],
        priority: 'important',
        estimatedTime: 400
      },
      {
        id: 'optional-advanced',
        name: 'Análisis Avanzado',
        tasks: optionalTasks,
        dependencies: ['critical-basic', 'important-clinical'],
        priority: 'optional',
        estimatedTime: 600
      }
    ];
  }, [originalForm.watchedFields, originalForm.calculatedBmi]);

  /**
   * Habilitar validación paralela manualmente
   */
  const enableParallelValidation = useCallback(async () => {
    if (!canUseParallel) {
      console.warn('⚠️ Validación paralela no disponible en este entorno');
      return;
    }

    const groups = generateValidationGroups();
    await parallelControls.startValidation(groups);
  }, [canUseParallel, generateValidationGroups, parallelControls]);

  /**
   * Ejecutar validación rápida
   */
  const runQuickValidation = useCallback(async () => {
    const quickData = {
      formData: originalForm.watchedFields,
      calculations: {
        bmi: originalForm.calculatedBmi,
        homa: originalForm.calculatedHoma
      },
      progress: originalForm.progress
    };

    await parallelControls.getQuickValidation(quickData);
  }, [originalForm, parallelControls]);

  /**
   * Obtener resumen comparativo de validaciones
   */
  const getValidationSummary = useCallback(() => {
    const traditionalValidation = {
      completionScore: originalForm.getCompletionScore(),
      canCalculate: originalForm.canCalculate,
      clinicalAlerts: originalForm.getClinicalAlerts(),
      performance: originalForm.getPerformanceReport()
    };

    const parallelValidation = {
      state: parallelState,
      metrics: parallelControls.getPerformanceReport(),
      isRunning: parallelState.isRunning,
      results: parallelState.results.size
    };

    // Determinar recomendación basada en contexto
    let recommendation: 'use-traditional' | 'use-parallel' | 'use-hybrid' = 'use-traditional';
    
    if (canUseParallel && Object.keys(originalForm.watchedFields).length > 10) {
      recommendation = 'use-parallel';
    } else if (canUseParallel && Object.keys(originalForm.watchedFields).length > 5) {
      recommendation = 'use-hybrid';
    }

    return {
      traditional: traditionalValidation,
      parallel: parallelValidation,
      recommendation
    };
  }, [originalForm, parallelState, parallelControls, canUseParallel]);

  /**
   * Auto-ejecutar validación paralela si está habilitada
   */
  // useEffect(() => {
  //   if (options.enableParallelByDefault && canUseParallel && options.autoRunValidation) {
  //     const fieldCount = Object.keys(originalForm.watchedFields).length;
  //     
  //     // Solo auto-ejecutar si hay suficientes campos
  //     if (fieldCount >= 5) {
  //       enableParallelValidation();
  //     }
  //   }
  // }, [options.enableParallelByDefault, options.autoRunValidation, canUseParallel, originalForm.watchedFields, enableParallelValidation]);

  // 3. 🎯 Combinar interfaz original + extensiones paralelas
  const enhancedReturn: UseCalculatorFormParallelReturn = {
    // ✅ Mantener TODA la API original sin cambios
    ...originalForm,
    
    // 🚀 Añadir nuevas capacidades paralelas
    parallel: {
      state: parallelState,
      controls: parallelControls,
      isEnabled: options.enableParallelByDefault || false,
      canUseParallel
    },
    
    // 🎯 Funciones de conveniencia
    enableParallelValidation,
    runQuickValidation,
    getValidationSummary
  };

  return enhancedReturn;
}

/**
 * Hook con configuración optimizada para velocidad
 */
export function useCalculatorFormFast(): UseCalculatorFormParallelReturn {
  return useCalculatorFormParallel({
    enableParallelByDefault: true,
    autoRunValidation: true,
    performanceMode: 'speed',
    hybridMode: false
  });
}

/**
 * Hook con configuración optimizada para precisión
 */
export function useCalculatorFormAccurate(): UseCalculatorFormParallelReturn {
  return useCalculatorFormParallel({
    enableParallelByDefault: false,
    autoRunValidation: false,
    performanceMode: 'accuracy',
    hybridMode: true
  });
}

export default useCalculatorFormParallel;
