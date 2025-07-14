// ===================================================================
// 🚀 VALIDACIÓN PARALELA INTEGRADA PARA CALCULADORA PRINCIPAL
// ===================================================================

// Declaración global para React Native
declare const __DEV__: boolean;

import { useState, useCallback, useRef, useMemo } from 'react';
import type { FormState } from '../useCalculatorForm';
import { useFormValidation } from './useFormValidation';

// 📊 Tipos específicos para la calculadora
type ValidationPriority = 'critical' | 'important' | 'optional';
type ValidationSection = 'demographics' | 'gynecology' | 'laboratory' | 'maleFactor';

interface CalculatorValidationTask {
  id: string;
  field: keyof FormState;
  value: unknown;
  priority: ValidationPriority;
  section: ValidationSection;
}

interface CalculatorValidationResult {
  taskId: string;
  field: keyof FormState;
  isValid: boolean;
  messages: string[];
  severity: 'error' | 'warning' | 'info';
  executionTime: number;
  fromCache: boolean;
}

interface CalculatorValidationState {
  isValidating: boolean;
  progress: number;
  totalTasks: number;
  completedTasks: number;
  fieldResults: Map<keyof FormState, CalculatorValidationResult>;
  overallValidation: {
    isFormValid: boolean;
    criticalErrors: string[];
    warnings: string[];
    suggestions: string[];
  };
  performance: {
    totalTime: number;
    averageTaskTime: number;
    cacheHitRate: number;
    tasksPerSecond: number;
  };
}

// 💾 Cache especializado para validación de formularios
class FormValidationCache {
  private cache = new Map<string, { result: CalculatorValidationResult; timestamp: number }>();
  private maxSize = 200;
  private ttl = 10 * 60 * 1000; // 10 minutos para formularios
  private hits = 0;
  private requests = 0;

  private createKey(field: keyof FormState, value: unknown): string {
    return `calc_${field}:${JSON.stringify(value)}`;
  }

  get(field: keyof FormState, value: unknown): CalculatorValidationResult | null {
    this.requests++;
    const key = this.createKey(field, value);
    const cached = this.cache.get(key);
    
    if (!cached) return null;
    
    if (Date.now() - cached.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    this.hits++;
    return { ...cached.result, fromCache: true };
  }

  set(field: keyof FormState, value: unknown, result: CalculatorValidationResult): void {
    const key = this.createKey(field, value);
    
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }
    
    this.cache.set(key, { result: { ...result, fromCache: false }, timestamp: Date.now() });
  }

  getHitRate(): number {
    return this.requests > 0 ? (this.hits / this.requests) * 100 : 0;
  }

  clear(): void {
    this.cache.clear();
    this.hits = 0;
    this.requests = 0;
  }

  getStats() {
    return {
      size: this.cache.size,
      hitRate: this.getHitRate(),
      hits: this.hits,
      requests: this.requests
    };
  }
}

// 🎯 Motor de validación específico para calculadora
class CalculatorValidationEngine {
  private cache = new FormValidationCache();
  private maxConcurrency = 6; // Óptimo para formularios

  async validateFields(
    tasks: CalculatorValidationTask[],
    validator: ReturnType<typeof useFormValidation>
  ): Promise<CalculatorValidationResult[]> {
    
    // Ordenar por prioridad
    const sortedTasks = this.sortTasksByPriority(tasks);
    const results: CalculatorValidationResult[] = [];
    
    // Procesar en lotes
    const batches = this.createBatches(sortedTasks);
    
    for (const batch of batches) {
      const batchResults = await Promise.all(
        batch.map(task => this.processTask(task, validator))
      );
      results.push(...batchResults);
    }
    
    return results;
  }

  private async processTask(
    task: CalculatorValidationTask,
    validator: ReturnType<typeof useFormValidation>
  ): Promise<CalculatorValidationResult> {
    const startTime = performance.now();
    
    // Verificar cache
    const cached = this.cache.get(task.field, task.value);
    if (cached) {
      return cached;
    }
    
    // Simular procesamiento asíncrono
    await this.simulateProcessingDelay(task.priority);
    
    // Realizar validación usando el validador existente
    const validationResult = validator.validateField(task.field, task.value);
    
    // Determinar severidad basada en validación
    let severity: 'error' | 'warning' | 'info' = 'info';
    if (validationResult.errors.length > 0) {
      severity = 'error';
    } else if (validationResult.warnings.length > 0) {
      severity = 'warning';
    }
    
    const result: CalculatorValidationResult = {
      taskId: task.id,
      field: task.field,
      isValid: validationResult.isValid,
      messages: [
        ...validationResult.errors.map(e => e.toString()),
        ...validationResult.warnings.map(w => w.toString()),
        ...validationResult.recommendations
      ],
      severity,
      executionTime: performance.now() - startTime,
      fromCache: false
    };
    
    // Guardar en cache
    this.cache.set(task.field, task.value, result);
    
    return result;
  }

  private sortTasksByPriority(tasks: CalculatorValidationTask[]): CalculatorValidationTask[] {
    const priorityOrder = { critical: 0, important: 1, optional: 2 };
    return [...tasks].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  }

  private createBatches(tasks: CalculatorValidationTask[]): CalculatorValidationTask[][] {
    const batches: CalculatorValidationTask[][] = [];
    const batchSize = Math.ceil(tasks.length / this.maxConcurrency);
    
    for (let i = 0; i < tasks.length; i += batchSize) {
      batches.push(tasks.slice(i, i + batchSize));
    }
    
    return batches;
  }

  private async simulateProcessingDelay(priority: 'critical' | 'important' | 'optional'): Promise<void> {
    const delays = { critical: 5, important: 15, optional: 25 };
    await new Promise(resolve => setTimeout(resolve, delays[priority]));
  }

  getCacheStats() {
    return this.cache.getStats();
  }

  clearCache(): void {
    this.cache.clear();
  }
}

// 🚀 Hook principal de validación paralela para calculadora
export const useCalculatorParallelValidation = () => {
  const [state, setState] = useState<CalculatorValidationState>({
    isValidating: false,
    progress: 0,
    totalTasks: 0,
    completedTasks: 0,
    fieldResults: new Map(),
    overallValidation: {
      isFormValid: true,
      criticalErrors: [],
      warnings: [],
      suggestions: []
    },
    performance: {
      totalTime: 0,
      averageTaskTime: 0,
      cacheHitRate: 0,
      tasksPerSecond: 0
    }
  });

  const engineRef = useRef(new CalculatorValidationEngine());
  const validator = useFormValidation();

  // 🎯 Función principal de validación
  const validateFormParallel = useCallback(async (formData: Partial<FormState>) => {
    const startTime = performance.now();
    
    setState(prev => ({
      ...prev,
      isValidating: true,
      progress: 0,
      completedTasks: 0,
      fieldResults: new Map()
    }));

    try {
      // Crear tareas de validación
      const tasks = createCalculatorValidationTasks(formData);
      
      setState(prev => ({ ...prev, totalTasks: tasks.length }));

      // Validar en paralelo con progreso en tiempo real
      const results = await engineRef.current.validateFields(tasks, validator);
      
      // Procesar resultados
      const fieldResults = new Map<keyof FormState, CalculatorValidationResult>();
      const criticalErrors: string[] = [];
      const warnings: string[] = [];
      const suggestions: string[] = [];
      
      results.forEach(result => {
        fieldResults.set(result.field, result);
        
        if (result.severity === 'error') {
          criticalErrors.push(...result.messages);
        } else if (result.severity === 'warning') {
          warnings.push(...result.messages);
        } else {
          suggestions.push(...result.messages);
        }
      });

      const totalTime = performance.now() - startTime;
      const cacheStats = engineRef.current.getCacheStats();
      const averageTaskTime = results.length > 0 
        ? results.reduce((sum, r) => sum + r.executionTime, 0) / results.length 
        : 0;

      setState(prev => ({
        ...prev,
        isValidating: false,
        progress: 100,
        completedTasks: results.length,
        fieldResults,
        overallValidation: {
          isFormValid: criticalErrors.length === 0,
          criticalErrors: [...new Set(criticalErrors)],
          warnings: [...new Set(warnings)],
          suggestions: [...new Set(suggestions)]
        },
        performance: {
          totalTime: Math.round(totalTime),
          averageTaskTime: Math.round(averageTaskTime),
          cacheHitRate: Math.round(cacheStats.hitRate),
          tasksPerSecond: totalTime > 0 ? Math.round((results.length / totalTime) * 1000) : 0
        }
      }));

      return {
        isValid: criticalErrors.length === 0,
        fieldResults,
        overallValidation: {
          isFormValid: criticalErrors.length === 0,
          criticalErrors: [...new Set(criticalErrors)],
          warnings: [...new Set(warnings)],
          suggestions: [...new Set(suggestions)]
        },
        performance: {
          totalTime: Math.round(totalTime),
          averageTaskTime: Math.round(averageTaskTime),
          cacheHitRate: Math.round(cacheStats.hitRate),
          tasksPerSecond: totalTime > 0 ? Math.round((results.length / totalTime) * 1000) : 0
        }
      };

    } catch (error) {
      setState(prev => ({
        ...prev,
        isValidating: false,
        overallValidation: {
          ...prev.overallValidation,
          criticalErrors: [`Error de validación: ${error}`]
        }
      }));
      
      throw error;
    }
  }, [validator]);

  // 🎯 Obtener validación de campo específico
  const getFieldValidation = useCallback((field: keyof FormState) => {
    return state.fieldResults.get(field);
  }, [state.fieldResults]);

  // 🧹 Limpiar cache y resetear estado
  const clearCache = useCallback(() => {
    engineRef.current.clearCache();
    setState(prev => ({
      ...prev,
      fieldResults: new Map(),
      overallValidation: {
        isFormValid: true,
        criticalErrors: [],
        warnings: [],
        suggestions: []
      },
      performance: {
        totalTime: 0,
        averageTaskTime: 0,
        cacheHitRate: 0,
        tasksPerSecond: 0
      }
    }));
  }, []);

  // 📊 Métricas en tiempo real
  const metrics = useMemo(() => {
    // Determinar eficiencia basada en cache hit rate
    let efficiency = 'Regular';
    if (state.performance.cacheHitRate > 70) {
      efficiency = 'Excelente';
    } else if (state.performance.cacheHitRate > 40) {
      efficiency = 'Buena';
    }

    return {
      validation: {
        isValidating: state.isValidating,
        progress: state.progress,
        isFormValid: state.overallValidation.isFormValid,
        errorCount: state.overallValidation.criticalErrors.length,
        warningCount: state.overallValidation.warnings.length
      },
      performance: {
        ...state.performance,
        efficiency,
        status: state.isValidating ? 'Validando...' : 'Completado'
      }
    };
  }, [state]);

  return {
    // Estado principal
    isValidating: state.isValidating,
    progress: state.progress,
    isFormValid: state.overallValidation.isFormValid,
    
    // Validaciones específicas
    fieldResults: state.fieldResults,
    criticalErrors: state.overallValidation.criticalErrors,
    warnings: state.overallValidation.warnings,
    suggestions: state.overallValidation.suggestions,
    
    // Funciones principales
    validateFormParallel,
    getFieldValidation,
    clearCache,
    
    // Métricas y desarrollo
    metrics,
    
    // Datos de desarrollo (solo en modo desarrollo)
    devData: __DEV__ ? {
      totalTasks: state.totalTasks,
      completedTasks: state.completedTasks,
      cacheStats: engineRef.current.getCacheStats()
    } : undefined
  };
};

// 🏭 Función para crear tareas de validación específicas de la calculadora
function createCalculatorValidationTasks(formData: Partial<FormState>): CalculatorValidationTask[] {
  const tasks: CalculatorValidationTask[] = [];
  
  Object.entries(formData).forEach(([field, value]) => {
    // Validar que el valor no sea undefined, null, o string vacío para campos de texto
    const hasValidValue = value !== undefined && 
                         value !== null && 
                         (typeof value !== 'string' || value !== '');
    
    if (hasValidValue) {
      const fieldName = field as keyof FormState;
      
      tasks.push({
        id: `calc_${field}_${Date.now()}`,
        field: fieldName,
        value,
        priority: getCalculatorFieldPriority(fieldName),
        section: getCalculatorFieldSection(fieldName)
      });
    }
  });
  
  return tasks;
}

function getCalculatorFieldPriority(field: keyof FormState): 'critical' | 'important' | 'optional' {
  // Campos críticos para el cálculo
  const criticalFields: (keyof FormState)[] = ['age', 'weight', 'height'];
  
  // Campos importantes para precisión
  const importantFields: (keyof FormState)[] = [
    'cycleLength', 'infertilityDuration', 'amhValue', 'spermConcentration', 'hasPcos'
  ];
  
  if (criticalFields.includes(field)) return 'critical';
  if (importantFields.includes(field)) return 'important';
  return 'optional';
}

function getCalculatorFieldSection(field: keyof FormState): 'demographics' | 'gynecology' | 'laboratory' | 'maleFactor' {
  // Mapeo específico para la calculadora de fertilidad
  const sectionMap: Record<string, 'demographics' | 'gynecology' | 'laboratory' | 'maleFactor'> = {
    // Demografia
    age: 'demographics',
    weight: 'demographics', 
    height: 'demographics',
    
    // Ginecología
    cycleLength: 'gynecology',
    infertilityDuration: 'gynecology',
    hasPcos: 'gynecology',
    endometriosisStage: 'gynecology',
    myomaType: 'gynecology',
    adenomyosisType: 'gynecology',
    polypType: 'gynecology',
    hsgResult: 'gynecology',
    hasPelvicSurgery: 'gynecology',
    numberOfPelvicSurgeries: 'gynecology',
    hasOtb: 'gynecology',
    otbMethod: 'gynecology',
    hasOtherInfertilityFactors: 'gynecology',
    desireForMultiplePregnancies: 'gynecology',
    cycleRegularity: 'gynecology',
    
    // Laboratorio
    amhValue: 'laboratory',
    tshValue: 'laboratory',
    prolactinValue: 'laboratory',
    insulinValue: 'laboratory',
    glucoseValue: 'laboratory',
    tpoAbPositive: 'laboratory',
    
    // Factor masculino
    spermConcentration: 'maleFactor',
    spermProgressiveMotility: 'maleFactor',
    spermNormalMorphology: 'maleFactor',
    semenVolume: 'maleFactor'
  };
  
  return sectionMap[field] || 'demographics';
}
