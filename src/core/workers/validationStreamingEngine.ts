/**
 * 🚀 FASE 1.2: Sistema de Validación con Streaming
 * 
 * Sistema que prioriza validaciones críticas y mejora progresivamente
 * la experiencia del usuario con validaciones opcionales en segundo plano.
 * 
 * Características:
 * - Validaciones críticas inmediatas
 * - Streaming progresivo de validaciones opcionales
 * - Feedback en tiempo real
 * - Control de flujo adaptativo
 */

import { ParallelValidationEngine, ValidationGroup, ValidationMetrics } from './parallelValidationEngine';
import type { ValidationResult } from './validationWorker';

export interface StreamingConfig {
  criticalThreshold: number; // ms - tiempo máximo para validaciones críticas
  progressiveDelay: number;   // ms - delay entre validaciones progresivas
  enableAdaptiveFlow: boolean; // ajustar velocidad según performance
  maxConcurrentStreams: number;
}

export interface StreamingProgress {
  phase: 'critical' | 'important' | 'optional' | 'complete';
  progress: number; // 0-100
  currentGroup?: string;
  estimatedTimeRemaining: number; // ms
  criticalComplete: boolean;
  importantComplete: boolean;
}

export interface StreamingCallbacks {
  onProgress?: (progress: StreamingProgress) => void;
  onCriticalComplete?: (results: ValidationResult[]) => void;
  onImportantComplete?: (results: ValidationResult[]) => void;
  onComplete?: (allResults: Map<string, ValidationResult[]>) => void;
  onError?: (error: Error, phase: string) => void;
}

/**
 * Motor de validación con streaming progresivo
 */
export class ValidationStreamingEngine {
  private engine: ParallelValidationEngine;
  private config: StreamingConfig;
  private currentProgress: StreamingProgress;
  private callbacks: StreamingCallbacks;
  private abortController?: AbortController;

  constructor(
    config: Partial<StreamingConfig> = {},
    callbacks: StreamingCallbacks = {}
  ) {
    this.config = {
      criticalThreshold: 500,    // 500ms para críticas
      progressiveDelay: 100,     // 100ms entre progresivas
      enableAdaptiveFlow: true,
      maxConcurrentStreams: 3,
      ...config
    };

    this.callbacks = callbacks;
    this.engine = new ParallelValidationEngine({
      maxConcurrency: this.config.maxConcurrentStreams,
      enableCache: true,
      timeoutMs: this.config.criticalThreshold * 4
    });

    this.currentProgress = {
      phase: 'critical',
      progress: 0,
      estimatedTimeRemaining: 0,
      criticalComplete: false,
      importantComplete: false
    };
  }

  /**
   * Iniciar validación con streaming progresivo
   */
  async startStreamingValidation(groups: ValidationGroup[]): Promise<Map<string, ValidationResult[]>> {
    this.abortController = new AbortController();
    this.resetProgress();

    try {
      // Separar grupos por prioridad
      const { critical, important, optional } = this.categorizeGroups(groups);

      const allResults = new Map<string, ValidationResult[]>();

      // FASE 1: Validaciones críticas (bloquean UI mínimamente)
      await this.executeCriticalPhase(critical, allResults);

      // FASE 2: Validaciones importantes (streaming progresivo)
      await this.executeImportantPhase(important, allResults);

      // FASE 3: Validaciones opcionales (background completo)
      await this.executeOptionalPhase(optional, allResults);

      this.completeValidation(allResults);
      return allResults;

    } catch (error) {
      this.handleError(error as Error, this.currentProgress.phase);
      throw error;
    }
  }

  /**
   * Ejecutar fase crítica (máxima prioridad)
   */
  private async executeCriticalPhase(
    groups: ValidationGroup[], 
    results: Map<string, ValidationResult[]>
  ): Promise<void> {
    this.updateProgress('critical', 0, groups.length > 0 ? 'Validaciones críticas...' : undefined);

    if (groups.length === 0) {
      this.updateProgress('critical', 100);
      this.currentProgress.criticalComplete = true;
      return;
    }

    const startTime = performance.now();
    
    try {
      const criticalResults = await Promise.race([
        this.engine.executeValidationGroups(groups),
        this.createTimeoutPromise(this.config.criticalThreshold)
      ]);

      // Fusionar resultados
      for (const [groupId, groupResults] of criticalResults) {
        results.set(groupId, groupResults);
      }

      this.updateProgress('critical', 100);
      this.currentProgress.criticalComplete = true;

      // Notificar completación de críticas
      const allCriticalResults = Array.from(criticalResults.values()).flat();
      this.callbacks.onCriticalComplete?.(allCriticalResults);

      console.log(`✅ Validaciones críticas completadas en ${performance.now() - startTime}ms`);

    } catch (error) {
      if (error instanceof Error && error.message === 'TIMEOUT') {
        console.warn('⚠️ Timeout en validaciones críticas - continuando con fallback');
        this.currentProgress.criticalComplete = true;
      } else {
        throw error;
      }
    }
  }

  /**
   * Ejecutar fase importante (streaming controlado)
   */
  private async executeImportantPhase(
    groups: ValidationGroup[], 
    results: Map<string, ValidationResult[]>
  ): Promise<void> {
    this.updateProgress('important', 0, groups.length > 0 ? 'Validaciones importantes...' : undefined);

    if (groups.length === 0) {
      this.updateProgress('important', 100);
      this.currentProgress.importantComplete = true;
      return;
    }

    // Procesar grupos de forma streaming
    for (let i = 0; i < groups.length; i++) {
      if (this.abortController?.signal.aborted) break;

      const group = groups[i];
      this.updateProgress('important', (i / groups.length) * 100, group.name);

      try {
        const groupResults = await this.engine.executeValidationGroups([group]);
        
        // Fusionar resultados inmediatamente
        for (const [groupId, groupResults] of groupResults) {
          results.set(groupId, groupResults);
        }

        // Delay adaptativo entre grupos
        if (i < groups.length - 1) {
          await this.adaptiveDelay();
        }

      } catch (error) {
        console.warn(`⚠️ Error en grupo importante ${group.id}:`, error);
        // Continuar con otros grupos
      }
    }

    this.updateProgress('important', 100);
    this.currentProgress.importantComplete = true;

    // Notificar completación de importantes
    const importantResults = Array.from(results.values()).flat();
    this.callbacks.onImportantComplete?.(importantResults);
  }

  /**
   * Ejecutar fase opcional (background completo)
   */
  private async executeOptionalPhase(
    groups: ValidationGroup[], 
    results: Map<string, ValidationResult[]>
  ): Promise<void> {
    this.updateProgress('optional', 0, groups.length > 0 ? 'Validaciones opcionales...' : undefined);

    if (groups.length === 0) {
      this.updateProgress('optional', 100);
      return;
    }

    // Procesar en background con prioridad mínima
    try {
      const optionalResults = await this.engine.executeValidationGroups(groups);
      
      // Fusionar resultados
      for (const [groupId, groupResults] of optionalResults) {
        results.set(groupId, groupResults);
      }

      this.updateProgress('optional', 100);

    } catch (error) {
      console.warn('⚠️ Error en validaciones opcionales:', error);
      // No crítico - completar de todas formas
      this.updateProgress('optional', 100);
    }
  }

  /**
   * Categorizar grupos por prioridad
   */
  private categorizeGroups(groups: ValidationGroup[]): {
    critical: ValidationGroup[];
    important: ValidationGroup[];
    optional: ValidationGroup[];
  } {
    return {
      critical: groups.filter(g => g.priority === 'critical'),
      important: groups.filter(g => g.priority === 'important'),
      optional: groups.filter(g => g.priority === 'optional')
    };
  }

  /**
   * Actualizar progreso y notificar
   */
  private updateProgress(
    phase: StreamingProgress['phase'], 
    progress: number, 
    currentGroup?: string
  ): void {
    this.currentProgress = {
      ...this.currentProgress,
      phase,
      progress,
      currentGroup,
      estimatedTimeRemaining: this.calculateTimeRemaining()
    };

    this.callbacks.onProgress?.(this.currentProgress);
  }

  /**
   * Calcular tiempo estimado restante
   */
  private calculateTimeRemaining(): number {
    const metrics = this.engine.getMetrics();
    const avgTime = metrics.averageTime || 100;
    
    // Estimación simple basada en fase actual
    switch (this.currentProgress.phase) {
      case 'critical':
        return avgTime * 2;
      case 'important':
        return avgTime * 3;
      case 'optional':
        return avgTime;
      default:
        return 0;
    }
  }

  /**
   * Delay adaptativo entre operaciones
   */
  private async adaptiveDelay(): Promise<void> {
    let delay = this.config.progressiveDelay;

    if (this.config.enableAdaptiveFlow) {
      const metrics = this.engine.getMetrics();
      
      // Ajustar delay basado en performance
      if (metrics.averageTime > 200) {
        delay *= 1.5; // Más lento si hay problemas
      } else if (metrics.averageTime < 50) {
        delay *= 0.7; // Más rápido si va bien
      }
    }

    return new Promise(resolve => setTimeout(resolve, delay));
  }

  /**
   * Crear promesa de timeout
   */
  private createTimeoutPromise(ms: number): Promise<never> {
    return new Promise((_, reject) => {
      setTimeout(() => reject(new Error('TIMEOUT')), ms);
    });
  }

  /**
   * Reiniciar progreso
   */
  private resetProgress(): void {
    this.currentProgress = {
      phase: 'critical',
      progress: 0,
      estimatedTimeRemaining: 0,
      criticalComplete: false,
      importantComplete: false
    };
  }

  /**
   * Completar validación
   */
  private completeValidation(results: Map<string, ValidationResult[]>): void {
    this.updateProgress('complete', 100);
    this.callbacks.onComplete?.(results);
  }

  /**
   * Manejar errores
   */
  private handleError(error: Error, phase: string): void {
    console.error(`❌ Error en fase ${phase}:`, error);
    this.callbacks.onError?.(error, phase);
  }

  /**
   * Abortar validación en curso
   */
  abort(): void {
    this.abortController?.abort();
    console.log('🛑 Validación streaming abortada');
  }

  /**
   * Obtener progreso actual
   */
  getCurrentProgress(): StreamingProgress {
    return { ...this.currentProgress };
  }

  /**
   * Obtener métricas del motor
   */
  getMetrics(): ValidationMetrics {
    return this.engine.getMetrics();
  }

  /**
   * Limpiar recursos
   */
  dispose(): void {
    this.abort();
    this.engine.dispose();
  }
}

export default ValidationStreamingEngine;
