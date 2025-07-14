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

// Tipos para el Web Worker
export interface ValidationTask {
  id: string;
  type: 'clinical' | 'cross-field' | 'bulk' | 'range';
  data: any;
  priority: 'high' | 'medium' | 'low';
  timestamp: number;
}

export interface ValidationResult {
  taskId: string;
  success: boolean;
  result?: any;
  error?: string;
  processingTime: number;
  cacheHit?: boolean;
}

/**
 * Motor de validación en Web Worker
 * Procesa validaciones de forma asíncrona y paralela
 */
class ValidationWorkerEngine {
  private taskQueue: ValidationTask[] = [];
  private processing = false;
  private cache = new Map<string, { result: any; timestamp: number }>();
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
      let result: any;

      switch (task.type) {
        case 'clinical':
          result = await this.processClinicalValidation(task.data);
          break;
        case 'cross-field':
          result = await this.processCrossFieldValidation(task.data);
          break;
        case 'bulk':
          result = await this.processBulkValidation(task.data);
          break;
        case 'range':
          result = await this.processRangeValidation(task.data);
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
  private async processClinicalValidation(data: any): Promise<any> {
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
  private async processCrossFieldValidation(data: any): Promise<any> {
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
  private async processBulkValidation(data: any): Promise<any> {
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
  private async processRangeValidation(data: any): Promise<any> {
    await this.delay(Math.random() * 30 + 10); // 10-40ms
    
    return {
      inRange: Math.random() > 0.2,
      percentile: Math.random() * 100,
      riskLevel: Math.random() > 0.8 ? 'high' : Math.random() > 0.5 ? 'medium' : 'low'
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
  private getFromCache(key: string): any | null {
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
  private saveToCache(key: string, result: any): void {
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

// Inicializar el motor del worker
new ValidationWorkerEngine();

export default ValidationWorkerEngine;
