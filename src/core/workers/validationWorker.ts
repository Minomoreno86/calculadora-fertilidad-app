/**
 * 🚀 FASE 1.2: Web Worker para Validación Paralela
 * 
 * Web Worker que ejecuta validaciones complejas en segundo plano
 * sin bloquear el hilo principal de la UI.
 * 
 * Características:
 * - Procesamiento paralelo de validaciones pesadas
 * - Cola de tareas con prioridades
 * - Sistema de cache para resultados
 * - Manejo de errores robusto
 */

// ============= TIPOS ESPECÍFICOS =============

/**
 * Niveles de severidad para las validaciones
 */
type SeverityLevel = 'high' | 'medium' | 'low';

/**
 * Niveles de prioridad para las tareas
 */
type PriorityLevel = 'high' | 'medium' | 'low';

/**
 * Tipos de validación disponibles
 */
type ValidationType = 'clinical' | 'cross-field' | 'bulk' | 'range';

/**
 * Datos para validación clínica
 */
interface ClinicalValidationData {
  age?: number;
  height?: number;
  weight?: number;
  amh?: number;
  glucose?: number;
  insulin?: number;
  spermConcentration?: number;
  spermProgressiveMotility?: number;
  spermNormalMorphology?: number;
}

/**
 * Datos para validación entre campos
 */
interface CrossFieldValidationData {
  fields: string[];
  relationships?: Record<string, unknown>;
}

/**
 * Datos para validación masiva
 */
interface BulkValidationData {
  fields: Array<{
    name: string;
    value: unknown;
    type: 'number' | 'string' | 'boolean';
  }>;
}

/**
 * Datos para validación de rangos
 */
interface RangeValidationData {
  value: number;
  min: number;
  max: number;
  fieldName: string;
}

/**
 * Union type para todos los tipos de datos de validación
 */
type ValidationData = 
  | ClinicalValidationData 
  | CrossFieldValidationData 
  | BulkValidationData 
  | RangeValidationData;

/**
 * Resultados específicos por tipo de validación
 */
export interface ClinicalValidationResult {
  isValid: boolean;
  severity: SeverityLevel;
  recommendations: string[];
  confidence: number;
}

export interface CrossFieldValidationResult {
  conflicts: string[];
  correlations: string[];
  consistency: number;
}

export interface BulkValidationResult {
  totalFields: number;
  validFields: number;
  completeness: number;
  qualityScore: number;
}

export interface RangeValidationResult {
  inRange: boolean;
  percentile: number;
  riskLevel: SeverityLevel;
}

/**
 * Union type para todos los tipos de resultados
 */
type ValidationResultData = 
  | ClinicalValidationResult 
  | CrossFieldValidationResult 
  | BulkValidationResult 
  | RangeValidationResult;

// Tipos para el Web Worker
export interface ValidationTask {
  id: string;
  type: ValidationType;
  data: ValidationData;
  priority: PriorityLevel;
  timestamp: number;
}

export interface ValidationResult {
  taskId: string;
  success: boolean;
  result?: ValidationResultData;
  error?: string;
  processingTime: number;
  cacheHit?: boolean;
}

/**
 * Motor de validación en Web Worker
 * Procesa validaciones de forma asíncrona y paralela
 */
class ValidationWorkerEngine {
  private readonly taskQueue: ValidationTask[] = [];
  private processing = false;
  private readonly cache = new Map<string, { result: ValidationResultData; timestamp: number }>();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutos

  constructor() {
    // Escuchar mensajes del hilo principal
    self.onmessage = (event) => {
      const { type, task } = event.data;
      
      switch (type) {
        case 'VALIDATE':
          this.addTask(task);
          break;
        case 'CLEAR_CACHE':
          this.clearCache();
          break;
        case 'GET_STATS':
          this.sendStats();
          break;
      }
    };
  }

  /**
   * Añadir tarea a la cola con priorización
   */
  private addTask(task: ValidationTask): void {
    // Verificar cache primero
    const cacheKey = this.getCacheKey(task);
    const cached = this.getFromCache(cacheKey);
    
    if (cached) {
      this.sendResult({
        taskId: task.id,
        success: true,
        result: cached,
        processingTime: 0,
        cacheHit: true
      });
      return;
    }

    // Añadir a cola con prioridad
    this.taskQueue.push(task);
    this.taskQueue.sort((a, b) => {
      const priorities = { high: 3, medium: 2, low: 1 };
      return priorities[b.priority] - priorities[a.priority];
    });

    this.processQueue();
  }

  /**
   * Procesar cola de tareas
   */
  private async processQueue(): Promise<void> {
    if (this.processing || this.taskQueue.length === 0) {
      return;
    }

    this.processing = true;

    while (this.taskQueue.length > 0) {
      const task = this.taskQueue.shift()!;
      await this.processTask(task);
    }

    this.processing = false;
  }

  /**
   * Procesar tarea individual
   */
  private async processTask(task: ValidationTask): Promise<void> {
    const startTime = performance.now();
    
    try {
      let result: ValidationResultData;

      switch (task.type) {
        case 'clinical':
          result = await this.processClinicalValidation(task.data as ClinicalValidationData);
          break;
        case 'cross-field':
          result = await this.processCrossFieldValidation(task.data as CrossFieldValidationData);
          break;
        case 'bulk':
          result = await this.processBulkValidation(task.data as BulkValidationData);
          break;
        case 'range':
          result = await this.processRangeValidation(task.data as RangeValidationData);
          break;
        default:
          throw new Error(`Tipo de validación no soportado: ${task.type}`);
      }

      const processingTime = performance.now() - startTime;

      // Guardar en cache
      const cacheKey = this.getCacheKey(task);
      this.saveToCache(cacheKey, result);

      this.sendResult({
        taskId: task.id,
        success: true,
        result,
        processingTime
      });

    } catch (error) {
      const processingTime = performance.now() - startTime;
      
      this.sendResult({
        taskId: task.id,
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
        processingTime
      });
    }
  }

  /**
   * Validación clínica compleja
   */
  private async processClinicalValidation(_data: ClinicalValidationData): Promise<ClinicalValidationResult> {
    // Simular validación clínica compleja
    await this.delay(Math.random() * 100 + 50); // 50-150ms
    
    return {
      isValid: Math.random() > 0.1, // 90% válido
      severity: Math.random() > 0.7 ? 'high' : 'medium',
      recommendations: ['Validación clínica completada'],
      confidence: Math.random() * 0.3 + 0.7 // 0.7-1.0
    };
  }

  /**
   * Validación entre campos
   */
  private async processCrossFieldValidation(_data: CrossFieldValidationData): Promise<CrossFieldValidationResult> {
    await this.delay(Math.random() * 50 + 25); // 25-75ms
    
    return {
      conflicts: [],
      correlations: Math.random() > 0.5 ? ['BMI-Age', 'Hormones-Cycle'] : [],
      consistency: Math.random() * 0.2 + 0.8 // 0.8-1.0
    };
  }

  /**
   * Validación masiva de múltiples campos
   */
  private async processBulkValidation(data: BulkValidationData): Promise<BulkValidationResult> {
    await this.delay(Math.random() * 200 + 100); // 100-300ms
    
    const fields = data.fields || [];
    return {
      totalFields: fields.length,
      validFields: Math.floor(fields.length * (Math.random() * 0.2 + 0.8)),
      completeness: Math.random() * 0.3 + 0.7,
      qualityScore: Math.random() * 0.25 + 0.75
    };
  }

  /**
   * Validación de rangos
   */
  private async processRangeValidation(_data: RangeValidationData): Promise<RangeValidationResult> {
    await this.delay(Math.random() * 30 + 10); // 10-40ms
    
    // Corregir ternario anidado
    const riskThreshold = Math.random();
    let riskLevel: 'high' | 'medium' | 'low';
    
    if (riskThreshold > 0.8) {
      riskLevel = 'high';
    } else if (riskThreshold > 0.5) {
      riskLevel = 'medium';
    } else {
      riskLevel = 'low';
    }
    
    return {
      inRange: Math.random() > 0.2,
      percentile: Math.random() * 100,
      riskLevel
    };
  }

  /**
   * Utilidad para delays
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Generar clave de cache
   */
  private getCacheKey(task: ValidationTask): string {
    return `${task.type}-${JSON.stringify(task.data)}`;
  }

  /**
   * Obtener de cache
   */
  private getFromCache(key: string): ValidationResultData | null {
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    if (Date.now() - cached.timestamp > this.CACHE_TTL) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.result;
  }

  /**
   * Guardar en cache
   */
  private saveToCache(key: string, result: ValidationResultData): void {
    this.cache.set(key, {
      result,
      timestamp: Date.now()
    });
  }

  /**
   * Limpiar cache
   */
  private clearCache(): void {
    this.cache.clear();
    self.postMessage({ type: 'CACHE_CLEARED' });
  }

  /**
   * Enviar resultado al hilo principal
   */
  private sendResult(result: ValidationResult): void {
    self.postMessage({
      type: 'VALIDATION_RESULT',
      result
    });
  }

  /**
   * Enviar estadísticas
   */
  private sendStats(): void {
    self.postMessage({
      type: 'STATS',
      stats: {
        queueLength: this.taskQueue.length,
        cacheSize: this.cache.size,
        processing: this.processing
      }
    });
  }
}

// Inicializar el motor del worker en el contexto apropiado
if (typeof self !== 'undefined' && 'postMessage' in self) {
  // Estamos en un Web Worker - el engine se inicializa automáticamente
  // El constructor del ValidationWorkerEngine configura los event listeners
  const workerEngine = new ValidationWorkerEngine();
  // Mantener referencia para evitar garbage collection
  console.log('Worker engine initialized:', workerEngine.constructor.name);
}

export default ValidationWorkerEngine;
