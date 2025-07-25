/**
 * 📊 PERFORMANCE MONITOR - Sistema Centralizado de Métricas
 * 
 * Módulo que extrae y centraliza el sistema de logging y métricas
 * embebido en el monolito para crear observabilidad completa.
 * 
 * CARACTERÍSTICAS:
 * - Métricas en tiempo real
 * - Profiling de operaciones
 * - Alertas automáticas
 * - Integración con sistema de producción
 * - Análisis de tendencias
 */

import { UserInput } from '../../models';

// ===================================================================
// 🎯 INTERFACES PARA PERFORMANCE MONITOR
// ===================================================================

/**
 * Métrica individual de performance
 */
export interface PerformanceMetric {
  operationId: string;
  operationType: string;
  startTime: number;
  endTime: number;
  duration: number;
  success: boolean;
  error?: string;
  metadata?: Record<string, unknown>;
  memoryUsage?: number;
  cpuUsage?: number;
}

/**
 * Métricas del sistema completo
 */
export interface SystemMetrics {
  // Métricas generales
  totalOperations: number;
  successfulOperations: number;
  failedOperations: number;
  successRate: number;
  
  // Métricas de tiempo
  averageExecutionTime: number;
  medianExecutionTime: number;
  p95ExecutionTime: number;
  p99ExecutionTime: number;
  
  // Métricas de recursos
  totalMemoryUsage: number;
  peakMemoryUsage: number;
  averageCpuUsage: number;
  
  // Métricas por tipo de operación
  operationMetrics: Record<string, {
    count: number;
    averageTime: number;
    successRate: number;
    lastExecution: number;
  }>;
  
  // Tendencias
  trends: {
    executionTimeSlope: number; // Pendiente de tiempo (mejorando/empeorando)
    errorRateSlope: number;
    memoryUsageSlope: number;
  };
}

/**
 * Reporte de performance
 */
export interface PerformanceReport {
  generatedAt: Date;
  timeWindow: { start: Date; end: Date };
  summary: SystemMetrics;
  
  // Alertas detectadas
  alerts: PerformanceAlert[];
  
  // Top operaciones lentas
  slowestOperations: PerformanceMetric[];
  
  // Operaciones con más errores
  errorProneOperations: { operation: string; errorRate: number; lastError: string }[];
  
  // Recomendaciones
  recommendations: string[];
  
  // Comparación con período anterior
  comparison?: {
    executionTimeChange: number;
    errorRateChange: number;
    memoryUsageChange: number;
  };
}

/**
 * Alerta de performance
 */
export interface PerformanceAlert {
  id: string;
  type: 'SLOW_OPERATION' | 'HIGH_ERROR_RATE' | 'MEMORY_LEAK' | 'CPU_SPIKE' | 'ANOMALY';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  message: string;
  operation?: string;
  value: number;
  threshold: number;
  timestamp: number;
  acknowledged: boolean;
}

/**
 * Configuración del monitor
 */
export interface PerformanceConfig {
  maxMetricsHistory: number;
  alertThresholds: {
    slowOperationMs: number;
    highErrorRatePercent: number;
    memoryLeakMB: number;
    cpuUsagePercent: number;
  };
  enableRealTimeAlerts: boolean;
  enableTrendAnalysis: boolean;
  reportInterval: number; // ms
  retentionDays: number;
}

/**
 * Contexto de operación
 */
export interface OperationContext {
  userId?: string;
  sessionId?: string;
  operationType: string;
  input?: UserInput;
  metadata?: Record<string, unknown>;
}

// ===================================================================
// 📊 PERFORMANCE MONITOR CLASS
// ===================================================================

export class PerformanceMonitor {
  // Almacenamiento de métricas
  private metrics: PerformanceMetric[] = [];
  private readonly activeOperations = new Map<string, PerformanceMetric>();
  
  // Alertas activas
  private alerts: PerformanceAlert[] = [];
  private alertCounter = 0;
  
  // Timer para reportes automáticos
  private reportTimer?: ReturnType<typeof setInterval>;
  
  // Métricas agregadas en cache
  private cachedSystemMetrics?: SystemMetrics;
  private lastMetricsUpdate = 0;
  private readonly METRICS_CACHE_TTL = 5000; // 5 segundos
  
  constructor(private readonly config: PerformanceConfig = {
    maxMetricsHistory: 1000,
    alertThresholds: {
      slowOperationMs: 1000,
      highErrorRatePercent: 10,
      memoryLeakMB: 50,
      cpuUsagePercent: 80
    },
    enableRealTimeAlerts: true,
    enableTrendAnalysis: true,
    reportInterval: 60000, // 1 minuto
    retentionDays: 7
  }) {
    this.startReportGeneration();
    this.cleanupOldMetrics();
  }
  
  // ===================================================================
  // 📏 OPERACIONES DE MEDICIÓN
  // ===================================================================
  
  /**
   * Inicia medición de una operación
   */
  startMeasurement(operationType: string, context?: OperationContext): string {
    const id = this.generateMeasurementId();
    const now = performance.now();
    
    const metric: PerformanceMetric = {
      operationId: id,
      operationType,
      startTime: now,
      endTime: 0,
      duration: 0,
      success: false,
      metadata: {
        ...context?.metadata,
        userId: context?.userId,
        sessionId: context?.sessionId,
        hasInput: !!context?.input
      }
    };
    
    this.activeOperations.set(id, metric);
    
    return id;
  }
  
  /**
   * Finaliza medición de una operación
   */
  endMeasurement(id: string, success: boolean = true, error?: string): PerformanceMetric {
    const metric = this.activeOperations.get(id);
    if (!metric) {
      throw new Error(`Medición ${id} no encontrada`);
    }
    
    const now = performance.now();
    metric.endTime = now;
    metric.duration = now - metric.startTime;
    metric.success = success;
    metric.error = error;
    
    // Agregar métricas de recursos si están disponibles
    if (typeof process !== 'undefined' && process.memoryUsage) {
      const memUsage = process.memoryUsage();
      metric.memoryUsage = memUsage.heapUsed / 1024 / 1024; // MB
    }
    
    // Remover de operaciones activas y agregar al historial
    this.activeOperations.delete(id);
    this.addMetric(metric);
    
    // Verificar alertas en tiempo real
    if (this.config.enableRealTimeAlerts) {
      this.checkRealTimeAlerts(metric);
    }
    
    return metric;
  }
  
  /**
   * Medición con auto-finalización (decorator pattern)
   */
  async measureOperation<T>(
    operationType: string,
    operation: () => Promise<T>,
    context?: OperationContext
  ): Promise<T> {
    const id = this.startMeasurement(operationType, context);
    
    try {
      const result = await operation();
      this.endMeasurement(id, true);
      return result;
    } catch (error) {
      this.endMeasurement(id, false, String(error));
      throw error;
    }
  }
  
  /**
   * Medición síncrona
   */
  measureSync<T>(
    operationType: string,
    operation: () => T,
    context?: OperationContext
  ): T {
    const id = this.startMeasurement(operationType, context);
    
    try {
      const result = operation();
      this.endMeasurement(id, true);
      return result;
    } catch (error) {
      this.endMeasurement(id, false, String(error));
      throw error;
    }
  }
  
  // ===================================================================
  // 📊 OBTENCIÓN DE MÉTRICAS
  // ===================================================================
  
  /**
   * Obtiene métricas del sistema con cache
   */
  getSystemMetrics(): SystemMetrics {
    const now = Date.now();
    
    // Usar cache si está vigente
    if (this.cachedSystemMetrics && (now - this.lastMetricsUpdate) < this.METRICS_CACHE_TTL) {
      return this.cachedSystemMetrics;
    }
    
    // Recalcular métricas
    this.cachedSystemMetrics = this.calculateSystemMetrics();
    this.lastMetricsUpdate = now;
    
    return this.cachedSystemMetrics;
  }
  
  /**
   * Genera reporte completo de performance
   */
  generateReport(timeWindow?: { start: Date; end: Date }): PerformanceReport {
    const now = new Date();
    const window = timeWindow || {
      start: new Date(now.getTime() - 60 * 60 * 1000), // 1 hora atrás
      end: now
    };
    
    const filteredMetrics = this.getMetricsInWindow(window.start, window.end);
    const systemMetrics = this.calculateSystemMetricsForWindow(filteredMetrics);
    
    // Obtener operaciones más lentas
    const slowestOperations = filteredMetrics
      .filter(m => m.success)
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 10);
    
    // Operaciones con más errores
    const errorProneOperations = this.getErrorProneOperations(filteredMetrics);
    
    // Generar recomendaciones
    const recommendations = this.generateRecommendations(systemMetrics, filteredMetrics);
    
    // Alertas en el período
    const windowAlerts = this.alerts.filter(
      alert => alert.timestamp >= window.start.getTime() && alert.timestamp <= window.end.getTime()
    );
    
    return {
      generatedAt: now,
      timeWindow: window,
      summary: systemMetrics,
      alerts: windowAlerts,
      slowestOperations,
      errorProneOperations,
      recommendations
    };
  }
  
  /**
   * Obtiene alertas activas
   */
  getActiveAlerts(): PerformanceAlert[] {
    return this.alerts.filter(alert => !alert.acknowledged);
  }
  
  /**
   * Reconoce una alerta
   */
  acknowledgeAlert(alertId: string): boolean {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.acknowledged = true;
      return true;
    }
    return false;
  }
  
  // ===================================================================
  // 🔔 SISTEMA DE ALERTAS
  // ===================================================================
  
  /**
   * Verifica alertas en tiempo real
   */
  private checkRealTimeAlerts(metric: PerformanceMetric): void {
    // Alerta por operación lenta
    if (metric.duration > this.config.alertThresholds.slowOperationMs) {
      this.createAlertInternal({
        type: 'SLOW_OPERATION',
        severity: metric.duration > this.config.alertThresholds.slowOperationMs * 2 ? 'HIGH' : 'MEDIUM',
        message: `Operación lenta detectada: ${metric.operationType} tomó ${metric.duration.toFixed(2)}ms`,
        operation: metric.operationType,
        value: metric.duration,
        threshold: this.config.alertThresholds.slowOperationMs
      });
    }
    
    // Alerta por memoria alta
    if (metric.memoryUsage && metric.memoryUsage > this.config.alertThresholds.memoryLeakMB) {
      this.createAlertInternal({
        type: 'MEMORY_LEAK',
        severity: 'HIGH',
        message: `Uso alto de memoria detectado: ${metric.memoryUsage.toFixed(2)}MB`,
        operation: metric.operationType,
        value: metric.memoryUsage,
        threshold: this.config.alertThresholds.memoryLeakMB
      });
    }
    
    // Verificar tasa de errores alta
    this.checkErrorRateAlert(metric.operationType);
  }
  
  /**
   * Verifica alerta de tasa de errores
   */
  private checkErrorRateAlert(operationType: string): void {
    const recentMetrics = this.metrics
      .filter(m => m.operationType === operationType)
      .slice(-20); // Últimas 20 operaciones
    
    if (recentMetrics.length >= 10) {
      const errorRate = (recentMetrics.filter(m => !m.success).length / recentMetrics.length) * 100;
      
      if (errorRate > this.config.alertThresholds.highErrorRatePercent) {
        this.createAlertInternal({
          type: 'HIGH_ERROR_RATE',
          severity: errorRate > this.config.alertThresholds.highErrorRatePercent * 2 ? 'CRITICAL' : 'HIGH',
          message: `Tasa de errores alta en ${operationType}: ${errorRate.toFixed(1)}%`,
          operation: operationType,
          value: errorRate,
          threshold: this.config.alertThresholds.highErrorRatePercent
        });
      }
    }
  }
  
  /**
   * Crea nueva alerta (método público para testing)
   */
  public createAlert(alertData: Omit<PerformanceAlert, 'id' | 'timestamp' | 'acknowledged'>): void {
    this.createAlertInternal(alertData);
  }

  /**
   * Crea nueva alerta (método privado interno)
   */
  private createAlertInternal(alertData: Omit<PerformanceAlert, 'id' | 'timestamp' | 'acknowledged'>): void {
    // Evitar alertas duplicadas recientes (último minuto)
    const recentSimilarAlert = this.alerts.find(alert => 
      alert.type === alertData.type &&
      alert.operation === alertData.operation &&
      (Date.now() - alert.timestamp) < 60000 // 1 minuto
    );
    
    if (recentSimilarAlert) return;
    
    const alert: PerformanceAlert = {
      ...alertData,
      id: `alert_${++this.alertCounter}`,
      timestamp: Date.now(),
      acknowledged: false
    };
    
    this.alerts.push(alert);
    
    // Log crítico para alertas importantes
    if (alert.severity === 'HIGH' || alert.severity === 'CRITICAL') {
      console.warn(`🚨 PERFORMANCE ALERT [${alert.severity}]: ${alert.message}`);
    }
    
    // Limitar número de alertas almacenadas
    if (this.alerts.length > 100) {
      this.alerts = this.alerts.slice(-50); // Mantener últimas 50
    }
  }
  
  // ===================================================================
  // 📈 ANÁLISIS Y CÁLCULOS
  // ===================================================================
  
  /**
   * Calcula métricas del sistema
   */
  private calculateSystemMetrics(): SystemMetrics {
    const metrics = this.metrics;
    const totalOps = metrics.length;
    const successfulOps = metrics.filter(m => m.success).length;
    
    if (totalOps === 0) {
      return this.getEmptySystemMetrics();
    }
    
    // Métricas de tiempo
    const durations = metrics.filter(m => m.success).map(m => m.duration).sort((a, b) => a - b);
    const avgTime = durations.reduce((sum, d) => sum + d, 0) / durations.length;
    const medianTime = durations[Math.floor(durations.length / 2)] || 0;
    const p95Time = durations[Math.floor(durations.length * 0.95)] || 0;
    const p99Time = durations[Math.floor(durations.length * 0.99)] || 0;
    
    // Métricas de memoria
    const memoryMetrics = metrics.filter(m => m.memoryUsage).map(m => m.memoryUsage!);
    const totalMemory = memoryMetrics.reduce((sum, m) => sum + m, 0);
    const peakMemory = Math.max(...memoryMetrics, 0);
    
    // Métricas de CPU (estimación basada en duración vs disponibilidad)
    const cpuMetrics = metrics.filter(m => m.cpuUsage).map(m => m.cpuUsage!);
    const avgCpuUsage = cpuMetrics.length > 0 ? 
      cpuMetrics.reduce((sum, cpu) => sum + cpu, 0) / cpuMetrics.length : 
      this.estimateCpuUsageFromDuration(avgTime);
    
    // Métricas por operación
    const operationMetrics: Record<string, {
      count: number;
      averageTime: number;
      successRate: number;
      lastExecution: number;
    }> = {};
    const operationGroups = this.groupMetricsByOperation();
    
    for (const [opType, opMetrics] of Object.entries(operationGroups)) {
      const opSuccessful = opMetrics.filter(m => m.success);
      operationMetrics[opType] = {
        count: opMetrics.length,
        averageTime: opSuccessful.length > 0 ? 
          opSuccessful.reduce((sum, m) => sum + m.duration, 0) / opSuccessful.length : 0,
        successRate: (opSuccessful.length / opMetrics.length) * 100,
        lastExecution: Math.max(...opMetrics.map(m => m.endTime))
      };
    }
    
    // Análisis de tendencias
    const trends = this.config.enableTrendAnalysis ? this.calculateTrends() : {
      executionTimeSlope: 0,
      errorRateSlope: 0,
      memoryUsageSlope: 0
    };
    
    return {
      totalOperations: totalOps,
      successfulOperations: successfulOps,
      failedOperations: totalOps - successfulOps,
      successRate: (successfulOps / totalOps) * 100,
      averageExecutionTime: avgTime,
      medianExecutionTime: medianTime,
      p95ExecutionTime: p95Time,
      p99ExecutionTime: p99Time,
      totalMemoryUsage: totalMemory,
      peakMemoryUsage: peakMemory,
      averageCpuUsage: avgCpuUsage,
      operationMetrics,
      trends
    };
  }
  
  /**
   * Calcula tendencias de performance
   */
  private calculateTrends(): SystemMetrics['trends'] {
    const recentMetrics = this.metrics.slice(-50); // Últimas 50 operaciones
    if (recentMetrics.length < 10) {
      return { executionTimeSlope: 0, errorRateSlope: 0, memoryUsageSlope: 0 };
    }
    
    const midPoint = Math.floor(recentMetrics.length / 2);
    const firstHalf = recentMetrics.slice(0, midPoint);
    const secondHalf = recentMetrics.slice(midPoint);
    
    // Tendencia de tiempo de ejecución
    const firstHalfAvgTime = firstHalf.reduce((sum, m) => sum + m.duration, 0) / firstHalf.length;
    const secondHalfAvgTime = secondHalf.reduce((sum, m) => sum + m.duration, 0) / secondHalf.length;
    const executionTimeSlope = secondHalfAvgTime - firstHalfAvgTime;
    
    // Tendencia de tasa de errores
    const firstHalfErrorRate = (firstHalf.filter(m => !m.success).length / firstHalf.length) * 100;
    const secondHalfErrorRate = (secondHalf.filter(m => !m.success).length / secondHalf.length) * 100;
    const errorRateSlope = secondHalfErrorRate - firstHalfErrorRate;
    
    // Tendencia de memoria (si disponible)
    const firstHalfMemory = firstHalf.filter(m => m.memoryUsage);
    const secondHalfMemory = secondHalf.filter(m => m.memoryUsage);
    
    let memoryUsageSlope = 0;
    if (firstHalfMemory.length > 0 && secondHalfMemory.length > 0) {
      const firstHalfAvgMemory = firstHalfMemory.reduce((sum, m) => sum + m.memoryUsage!, 0) / firstHalfMemory.length;
      const secondHalfAvgMemory = secondHalfMemory.reduce((sum, m) => sum + m.memoryUsage!, 0) / secondHalfMemory.length;
      memoryUsageSlope = secondHalfAvgMemory - firstHalfAvgMemory;
    }
    
    return { executionTimeSlope, errorRateSlope, memoryUsageSlope };
  }
  
  // ===================================================================
  // 🛠️ FUNCIONES AUXILIARES
  // ===================================================================
  
  private generateMeasurementId(): string {
    return `perf_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }
  
  /**
   * Estima uso de CPU basado en duración de operaciones
   */
  private estimateCpuUsageFromDuration(avgDuration: number): number {
    // Estimación simple: operaciones más lentas indican mayor uso de CPU
    // Normalizar a porcentaje (0-100)
    if (avgDuration < 50) return Math.min(20, avgDuration * 0.4);
    if (avgDuration < 200) return Math.min(40, 20 + (avgDuration - 50) * 0.13);
    if (avgDuration < 500) return Math.min(70, 40 + (avgDuration - 200) * 0.1);
    return Math.min(100, 70 + (avgDuration - 500) * 0.06);
  }
  
  private addMetric(metric: PerformanceMetric): void {
    this.metrics.push(metric);
    
    // Limitar historial de métricas
    if (this.metrics.length > this.config.maxMetricsHistory) {
      this.metrics = this.metrics.slice(-Math.floor(this.config.maxMetricsHistory * 0.8));
    }
    
    // Invalidar cache de métricas
    this.cachedSystemMetrics = undefined;
  }
  
  private getEmptySystemMetrics(): SystemMetrics {
    return {
      totalOperations: 0,
      successfulOperations: 0,
      failedOperations: 0,
      successRate: 0,
      averageExecutionTime: 0,
      medianExecutionTime: 0,
      p95ExecutionTime: 0,
      p99ExecutionTime: 0,
      totalMemoryUsage: 0,
      peakMemoryUsage: 0,
      averageCpuUsage: 0,
      operationMetrics: {},
      trends: { executionTimeSlope: 0, errorRateSlope: 0, memoryUsageSlope: 0 }
    };
  }
  
  private groupMetricsByOperation(): Record<string, PerformanceMetric[]> {
    const groups: Record<string, PerformanceMetric[]> = {};
    
    for (const metric of this.metrics) {
      const operationType = metric.operationType;
      const group = groups[operationType] ?? (groups[operationType] = []);
      group.push(metric);
    }
    
    return groups;
  }
  
  private getMetricsInWindow(start: Date, end: Date): PerformanceMetric[] {
    const startTime = start.getTime();
    const endTime = end.getTime();
    
    return this.metrics.filter(
      metric => metric.endTime >= startTime && metric.endTime <= endTime
    );
  }
  
  private calculateSystemMetricsForWindow(metrics: PerformanceMetric[]): SystemMetrics {
    // Similar a calculateSystemMetrics pero para un conjunto específico
    const totalOps = metrics.length;
    if (totalOps === 0) return this.getEmptySystemMetrics();
    
    const successfulOps = metrics.filter(m => m.success).length;
    const durations = metrics.filter(m => m.success).map(m => m.duration).sort((a, b) => a - b);
    
    return {
      totalOperations: totalOps,
      successfulOperations: successfulOps,
      failedOperations: totalOps - successfulOps,
      successRate: (successfulOps / totalOps) * 100,
      averageExecutionTime: durations.reduce((sum, d) => sum + d, 0) / durations.length || 0,
      medianExecutionTime: durations[Math.floor(durations.length / 2)] || 0,
      p95ExecutionTime: durations[Math.floor(durations.length * 0.95)] || 0,
      p99ExecutionTime: durations[Math.floor(durations.length * 0.99)] || 0,
      totalMemoryUsage: 0, // Simplificado para window
      peakMemoryUsage: 0,
      averageCpuUsage: 0,
      operationMetrics: {},
      trends: { executionTimeSlope: 0, errorRateSlope: 0, memoryUsageSlope: 0 }
    };
  }
  
  private getErrorProneOperations(metrics: PerformanceMetric[]): { operation: string; errorRate: number; lastError: string }[] {
    const groups = metrics.reduce((acc, metric) => {
      const operationType = metric.operationType;
      const group = acc[operationType] ?? (acc[operationType] = { total: 0, errors: 0, lastError: '' });
      group.total++;
      if (!metric.success) {
        group.errors++;
        group.lastError = metric.error || 'Unknown error';
      }
      return acc;
    }, {} as Record<string, { total: number; errors: number; lastError: string }>);
    
    return Object.entries(groups)
      .map(([operation, data]) => ({
        operation,
        errorRate: (data.errors / data.total) * 100,
        lastError: data.lastError
      }))
      .filter(item => item.errorRate > 0)
      .sort((a, b) => b.errorRate - a.errorRate)
      .slice(0, 5);
  }
  
  private generateRecommendations(systemMetrics: SystemMetrics, _metrics: PerformanceMetric[]): string[] {
    const recommendations: string[] = [];
    
    // Recomendaciones basadas en métricas
    if (systemMetrics.successRate < 95) {
      recommendations.push(`Tasa de éxito baja (${systemMetrics.successRate.toFixed(1)}%). Revisar manejo de errores.`);
    }
    
    if (systemMetrics.averageExecutionTime > 500) {
      recommendations.push(`Tiempo promedio alto (${systemMetrics.averageExecutionTime.toFixed(1)}ms). Considerar optimización.`);
    }
    
    if (systemMetrics.trends.executionTimeSlope > 50) {
      recommendations.push('Tendencia al alza en tiempo de ejecución. Monitorear degradación de performance.');
    }
    
    if (systemMetrics.trends.errorRateSlope > 5) {
      recommendations.push('Incremento en tasa de errores. Investigar causa raíz.');
    }
    
    // Recomendaciones por operación
    for (const [operation, opMetrics] of Object.entries(systemMetrics.operationMetrics)) {
      if (opMetrics.successRate < 90) {
        recommendations.push(`Operación ${operation} tiene baja confiabilidad (${opMetrics.successRate.toFixed(1)}%).`);
      }
      if (opMetrics.averageTime > 1000) {
        recommendations.push(`Operación ${operation} es lenta (${opMetrics.averageTime.toFixed(1)}ms). Optimizar.`);
      }
    }
    
    return recommendations.slice(0, 10); // Máximo 10 recomendaciones
  }
  
  private startReportGeneration(): void {
    if (this.reportTimer) {
      clearInterval(this.reportTimer);
    }
    
    this.reportTimer = setInterval(() => {
      if (this.metrics.length > 0) {
        const report = this.generateReport();
        console.log(`📊 Performance Report: ${report.summary.totalOperations} ops, ${report.summary.successRate.toFixed(1)}% success, ${report.summary.averageExecutionTime.toFixed(1)}ms avg`);
        
        if (report.alerts.length > 0) {
          console.warn(`🚨 ${report.alerts.length} alertas activas`);
        }
      }
    }, this.config.reportInterval);
  }
  
  private cleanupOldMetrics(): void {
    setInterval(() => {
      const cutoffTime = Date.now() - (this.config.retentionDays * 24 * 60 * 60 * 1000);
      const initialLength = this.metrics.length;
      
      this.metrics = this.metrics.filter(metric => metric.endTime > cutoffTime);
      this.alerts = this.alerts.filter(alert => alert.timestamp > cutoffTime);
      
      if (this.metrics.length < initialLength) {
        console.log(`🧹 Performance cleanup: Removed ${initialLength - this.metrics.length} old metrics`);
      }
    }, 24 * 60 * 60 * 1000); // Diario
  }
  
  /**
   * Destructor para limpiar recursos
   */
  destroy(): void {
    if (this.reportTimer) {
      clearInterval(this.reportTimer);
      this.reportTimer = undefined;
    }
    
    this.metrics = [];
    this.activeOperations.clear();
    this.alerts = [];
  }
}

// ===================================================================
// 🎯 FUNCIONES PÚBLICAS DE PERFORMANCE
// ===================================================================

/**
 * Instancia singleton del performance monitor
 */
let performanceMonitorInstance: PerformanceMonitor | null = null;

/**
 * Obtiene la instancia del performance monitor
 */
export function getPerformanceMonitor(config?: PerformanceConfig): PerformanceMonitor {
  performanceMonitorInstance ??= new PerformanceMonitor(config);
  return performanceMonitorInstance;
}

/**
 * Decorator para medir performance automáticamente
 */
export function measured(operationType: string) {
  return function (target: object, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    
    descriptor.value = async function (...args: unknown[]) {
      const monitor = getPerformanceMonitor();
      return monitor.measureOperation(
        `${target.constructor.name}.${propertyKey}`,
        () => originalMethod.apply(this, args),
        { operationType, metadata: { methodName: propertyKey } }
      );
    };
    
    return descriptor;
  };
}

/**
 * Función de conveniencia para medición rápida
 */
export async function measureAsync<T>(
  operationType: string,
  operation: () => Promise<T>,
  context?: OperationContext
): Promise<T> {
  return getPerformanceMonitor().measureOperation(operationType, operation, context);
}

/**
 * Función de conveniencia para medición síncrona
 */
export function measureSync<T>(
  operationType: string,
  operation: () => T,
  context?: OperationContext
): T {
  return getPerformanceMonitor().measureSync(operationType, operation, context);
}

/**
 * Obtiene métricas del sistema rápidamente
 */
export function getQuickMetrics(): SystemMetrics {
  return getPerformanceMonitor().getSystemMetrics();
}

/**
 * Crea alerta manual
 */
export function createManualAlert(
  type: PerformanceAlert['type'],
  message: string,
  severity: PerformanceAlert['severity'] = 'MEDIUM'
): void {
  const monitor = getPerformanceMonitor();
  monitor.createAlert({ type, message, severity, value: 0, threshold: 0 });
}
