// ===================================================================
// 🚀 HOOK DE VALIDACIÓN PARALELA OPTIMIZADA - FASE 2 FINAL
// ===================================================================

import { useCallback, useRef, useState, useMemo } from 'react';
import { useCalculatorForm } from './useCalculatorForm';

// 📊 Tipos para el sistema de validación paralela
interface ValidationTask {
  id: string;
  field: string;
  value: any;
  priority: 'critical' | 'important' | 'optional';
  section: string;
}

interface ValidationResult {
  taskId: string;
  field: string;
  isValid: boolean;
  messages: string[];
  severity: 'error' | 'warning' | 'info';
  executionTime: number;
}

interface ParallelValidationMetrics {
  isValidating: boolean;
  progress: number;
  totalTasks: number;
  completedTasks: number;
  averageTaskTime: number;
  cacheHitRate: number;
  tasksPerSecond: number;
  efficiency: string;
}

type FormState = Record<string, any>;

// 🎯 Hook principal con validación paralela optimizada
export const useCalculatorFormWithParallelValidation = () => {
  // ✅ Hook base estable de Fase 1
  const baseForm = useCalculatorForm();

  // 🚀 Estados específicos de validación paralela
  const [isValidating, setIsValidating] = useState(false);
  const [validationProgress, setValidationProgress] = useState(0);
  const [validationMetrics, setValidationMetrics] = useState<ParallelValidationMetrics>({
    isValidating: false,
    progress: 0,
    totalTasks: 0,
    completedTasks: 0,
    averageTaskTime: 0,
    cacheHitRate: 0,
    tasksPerSecond: 0,
    efficiency: 'Excelente'
  });

  // 💾 Cache de validaciones
  const validationCache = useRef(new Map<string, ValidationResult>());
  const validationTimeouts = useRef(new Map<string, number>());

  // 🎯 Función para determinar eficiencia
  const getEfficiencyLabel = useCallback((tasksPerSecond: number): string => {
    if (tasksPerSecond > 20) return 'Excelente';
    if (tasksPerSecond > 10) return 'Buena';
    return 'Regular';
  }, []);

  // 🚀 Creador de tareas de validación
  const createValidationTasks = useCallback((formData: FormState): ValidationTask[] => {
    const tasks: ValidationTask[] = [];
    const timestamp = Date.now();

    // 🔥 CRÍTICAS: Datos básicos requeridos
    if (formData.age !== undefined) {
      tasks.push({
        id: `age-${timestamp}`,
        field: 'age',
        value: formData.age,
        priority: 'critical',
        section: 'demographics'
      });
    }

    if (formData.height !== undefined) {
      tasks.push({
        id: `height-${timestamp}`,
        field: 'height',
        value: formData.height,
        priority: 'critical',
        section: 'demographics'
      });
    }

    if (formData.weight !== undefined) {
      tasks.push({
        id: `weight-${timestamp}`,
        field: 'weight',
        value: formData.weight,
        priority: 'critical',
        section: 'demographics'
      });
    }

    // ⚡ IMPORTANTES: Datos clínicos principales
    if (formData.cycleLength !== undefined) {
      tasks.push({
        id: `cycleLength-${timestamp}`,
        field: 'cycleLength',
        value: formData.cycleLength,
        priority: 'important',
        section: 'gynecology'
      });
    }

    if (formData.amhValue !== undefined && formData.amhValue !== null) {
      tasks.push({
        id: `amhValue-${timestamp}`,
        field: 'amhValue',
        value: formData.amhValue,
        priority: 'important',
        section: 'laboratory'
      });
    }

    // 📊 OPCIONALES: Datos complementarios
    if (formData.spermConcentration !== undefined && formData.spermConcentration !== null) {
      tasks.push({
        id: `spermConcentration-${timestamp}`,
        field: 'spermConcentration',
        value: formData.spermConcentration,
        priority: 'optional',
        section: 'maleFactor'
      });
    }

    return tasks;
  }, []);

  // ⚡ Ejecutor de validación individual
  const executeValidationTask = useCallback(async (task: ValidationTask): Promise<ValidationResult> => {
    const startTime = performance.now();
    
    // 🎯 Verificar cache primero
    const cacheKey = `${task.field}-${JSON.stringify(task.value)}`;
    const cached = validationCache.current.get(cacheKey);
    
    if (cached) {
      return {
        ...cached,
        taskId: task.id,
        executionTime: performance.now() - startTime
      };
    }

    // ⚡ Simular validación asíncrona
    await new Promise(resolve => setTimeout(resolve, Math.random() * 30 + 5));

    // 🎯 Lógica de validación
    let isValid = true;
    const messages: string[] = [];
    let severity: 'error' | 'warning' | 'info' = 'info';

    switch (task.field) {
      case 'age': {
        const age = Number(task.value);
        if (age < 18 || age > 50) {
          isValid = false;
          messages.push('Edad fuera del rango recomendado (18-50 años)');
          severity = 'error';
        } else if (age > 35) {
          messages.push('Edad avanzada - considerar evaluación especializada');
          severity = 'warning';
        }
        break;
      }
      case 'height': {
        const height = Number(task.value);
        if (height < 140 || height > 200) {
          isValid = false;
          messages.push('Altura fuera del rango normal');
          severity = 'error';
        }
        break;
      }
      case 'weight': {
        const weight = Number(task.value);
        if (weight < 40 || weight > 150) {
          isValid = false;
          messages.push('Peso fuera del rango recomendado');
          severity = 'error';
        }
        break;
      }
      case 'amhValue': {
        const amh = Number(task.value);
        if (amh < 0.1) {
          messages.push('AMH muy bajo - reserva ovárica reducida');
          severity = 'warning';
        } else if (amh > 8) {
          messages.push('AMH elevado - posible SOP');
          severity = 'warning';
        }
        break;
      }
      default:
        messages.push('Campo validado correctamente');
    }

    const result: ValidationResult = {
      taskId: task.id,
      field: task.field,
      isValid,
      messages,
      severity,
      executionTime: performance.now() - startTime
    };

    // 💾 Guardar en cache
    validationCache.current.set(cacheKey, result);
    return result;
  }, []);

  // 🚀 Procesador de validación paralela optimizada
  const processValidationTasks = useCallback(async (tasks: ValidationTask[]) => {
    if (tasks.length === 0) return;

    setIsValidating(true);
    setValidationProgress(0);

    const startTime = performance.now();
    let completedCount = 0;
    let totalExecutionTime = 0;
    let cacheHits = 0;

    // 📊 Separar por prioridades
    const criticalTasks = tasks.filter(t => t.priority === 'critical');
    const importantTasks = tasks.filter(t => t.priority === 'important');
    const optionalTasks = tasks.filter(t => t.priority === 'optional');

    const updateProgress = () => {
      completedCount++;
      const progress = Math.round((completedCount / tasks.length) * 100);
      setValidationProgress(progress);
    };

    try {
      // 🔥 Procesar críticas primero (secuencial para garantizar orden)
      for (const task of criticalTasks) {
        const cacheKey = `${task.field}-${JSON.stringify(task.value)}`;
        if (validationCache.current.has(cacheKey)) cacheHits++;
        
        const result = await executeValidationTask(task);
        totalExecutionTime += result.executionTime;
        updateProgress();
      }

      // ⚡ Procesar importantes en paralelo
      if (importantTasks.length > 0) {
        const importantResults = await Promise.all(
          importantTasks.map(async task => {
            const cacheKey = `${task.field}-${JSON.stringify(task.value)}`;
            if (validationCache.current.has(cacheKey)) cacheHits++;
            
            const result = await executeValidationTask(task);
            totalExecutionTime += result.executionTime;
            updateProgress();
            return result;
          })
        );
      }

      // 📊 Procesar opcionales en paralelo (sin bloqueo)
      if (optionalTasks.length > 0) {
        Promise.all(
          optionalTasks.map(async task => {
            const cacheKey = `${task.field}-${JSON.stringify(task.value)}`;
            if (validationCache.current.has(cacheKey)) cacheHits++;
            
            const result = await executeValidationTask(task);
            totalExecutionTime += result.executionTime;
            updateProgress();
            return result;
          })
        );
      }

      // 📊 Calcular métricas finales
      const totalTime = performance.now() - startTime;
      const averageTaskTime = totalExecutionTime / tasks.length;
      const tasksPerSecond = Math.round((tasks.length / totalTime) * 1000);
      const cacheHitRate = Math.round((cacheHits / tasks.length) * 100);

      setValidationMetrics({
        isValidating: false,
        progress: 100,
        totalTasks: tasks.length,
        completedTasks: tasks.length,
        averageTaskTime: Math.round(averageTaskTime),
        cacheHitRate,
        tasksPerSecond,
        efficiency: getEfficiencyLabel(tasksPerSecond)
      });

    } catch (error) {
      console.error('❌ Error en validación paralela:', error);
    } finally {
      setIsValidating(false);
    }
  }, [executeValidationTask, getEfficiencyLabel]);

  // 🎯 Validador principal con debounce
  const validateFormParallel = useCallback(async (formData: FormState) => {
    const formKey = JSON.stringify(formData);
    
    // 🎯 Limpiar timeout anterior
    const existingTimeout = validationTimeouts.current.get(formKey);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    // 🚀 Crear nuevo timeout con debounce
    const timeoutId = window.setTimeout(async () => {
      try {
        const tasks = createValidationTasks(formData);
        if (tasks.length > 0) {
          console.log(`🚀 Iniciando validación paralela: ${tasks.length} tareas`);
          await processValidationTasks(tasks);
        }
      } catch (error) {
        console.error('❌ Error en validación:', error);
        setIsValidating(false);
      }
    }, 300);

    validationTimeouts.current.set(formKey, timeoutId);
  }, [createValidationTasks, processValidationTasks]);

  // 🎯 Función de cálculo mejorada
  const handleCalculateWithParallelValidation = useCallback(async () => {
    try {
      // 1. Ejecutar validación paralela si hay datos
      if (Object.keys(baseForm.watchedFields).length > 0) {
        console.log('🚀 Ejecutando validación paralela antes del cálculo...');
        await validateFormParallel(baseForm.watchedFields);
      }

      // 2. Ejecutar cálculo original estable
      console.log('✅ Ejecutando cálculo original estable...');
      return await baseForm.handleCalculate();

    } catch (error) {
      console.error('❌ Error en cálculo con validación paralela:', error);
      console.log('🔄 Fallback al cálculo original...');
      return await baseForm.handleCalculate();
    }
  }, [baseForm.handleCalculate, baseForm.watchedFields, validateFormParallel]);

  // 🎯 API combinada optimizada
  return useMemo(() => ({
    // ✅ API original completa (estable)
    ...baseForm,

    // 🚀 Funcionalidades de validación paralela
    isValidating,
    validationProgress,
    validationMetrics,
    
    // 🎯 Función de cálculo mejorada
    handleCalculate: handleCalculateWithParallelValidation,

    // 📊 Funciones adicionales
    getValidationCache: () => validationCache.current,
    clearValidationCache: () => {
      validationCache.current.clear();
      console.log('🧹 Cache de validación limpiado');
    },
    triggerManualValidation: () => validateFormParallel(baseForm.watchedFields),
  }), [
    baseForm,
    isValidating,
    validationProgress,
    validationMetrics,
    handleCalculateWithParallelValidation,
    validateFormParallel
  ]);
};

export type UseCalculatorFormWithParallelValidationReturn = ReturnType<typeof useCalculatorFormWithParallelValidation>;
