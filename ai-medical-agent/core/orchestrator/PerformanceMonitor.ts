/**
 * 📊 MONITOR DE PERFORMANCE - VERSION 3.0
 * Sistema avanzado de monitoreo y métricas para IA médica
 * Observabilidad completa con alertas inteligentes
 */

/**
 * 📈 MÉTRICA DE PERFORMANCE
 */
interface PerformanceMetric {
  operationType: string;
  startTime: number;
  endTime: number;
  duration: number;
  success: boolean;
  error?: string;
  memoryBefore: number;
  memoryAfter: number;
  memoryDelta: number;
  timestamp: Date;
  metadata?: {
    cacheHit?: boolean;
    complexity?: 'low' | 'medium' | 'high';
    userAge?: number;
    confidence?: number;
  };
}

/**
 * 🎯 RESULTADO CON MÉTRICAS
 */
export interface MeasuredResult<T> {
  result: T;
  metrics: {
    duration: number;
    success: boolean;
    memoryUsage?: number;
    cacheHit?: boolean;
  };
}

/**
 * 📊 ESTADÍSTICAS AGREGADAS
 */
interface AggregatedStats {
  operationType: string;
  totalOperations: number;
  successCount: number;
  errorCount: number;
  successRate: number;
  averageDuration: number;
  minDuration: number;
  maxDuration: number;
  totalMemoryUsed: number;
  averageMemoryUsed: number;
  cacheHitRate?: number;
  lastOperation: Date;
}

/**
 * 🚨 ALERTA DE PERFORMANCE
 */
interface PerformanceAlert {
  id: string;
  type: 'performance' | 'memory' | 'error_rate' | 'availability';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  threshold: number;
  currentValue: number;
  timestamp: Date;
  acknowledged: boolean;
  metadata?: any;
}

/**
 * 📈 MONITOR DE PERFORMANCE PRINCIPAL
 */
export class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private alerts: PerformanceAlert[] = [];
  private startTime: number;
  
  // 🎛️ CONFIGURACIÓN
  private readonly maxMetricsHistory: number;
  private readonly alertThresholds: {
    slowOperation: number;      // ms
    highMemoryUsage: number;    // bytes
    errorRateThreshold: number; // %
    responseTimeThreshold: number; // ms
  };
  
  // 📊 ESTADÍSTICAS EN TIEMPO REAL
  private stats = {
    totalOperations: 0,
    totalErrors: 0,
    totalSuccesses: 0,
    totalDuration: 0,
    totalMemoryUsed: 0
  };
  
  constructor(config: {
    maxMetricsHistory?: number;
    alertThresholds?: Partial<{
      slowOperation: number;
      highMemoryUsage: number;
      errorRateThreshold: number;
      responseTimeThreshold: number;
    }>;
  } = {}) {
    this.maxMetricsHistory = config.maxMetricsHistory || 10000;
    this.alertThresholds = {
      slowOperation: 5000, // 5 segundos
      highMemoryUsage: 100 * 1024 * 1024, // 100MB
      errorRateThreshold: 5, // 5%
      responseTimeThreshold: 2000, // 2 segundos
      ...config.alertThresholds
    };
    
    this.startTime = Date.now();
    this.startPeriodicAnalysis();
  }
  
  /**
   * 🚀 INICIAR MONITOREO
   */
  start(): void {
    console.log('📊 PerformanceMonitor iniciado');
    this.logSystemInfo();
  }
  
  /**
   * ⏱️ MEDIR OPERACIÓN ASYNC
   */
  async measureOperation<T>(
    operation: () => Promise<T>,
    operationType: string,
    metadata?: any
  ): Promise<MeasuredResult<T>> {
    
    const startTime = performance.now();
    const memoryBefore = this.getMemoryUsage();
    const timestamp = new Date();
    
    try {
      const result = await operation();
      const endTime = performance.now();
      const memoryAfter = this.getMemoryUsage();
      const duration = endTime - startTime;
      const memoryDelta = memoryAfter - memoryBefore;
      
      // Registrar métrica exitosa
      const metric: PerformanceMetric = {
        operationType,
        startTime,
        endTime,
        duration,
        success: true,
        memoryBefore,
        memoryAfter,
        memoryDelta,
        timestamp,
        metadata
      };
      
      this.recordMetric(metric);
      
      // Verificar alertas
      this.checkAlerts(metric);
      
      return {
        result,
        metrics: {
          duration,
          success: true,
          memoryUsage: memoryDelta,
          cacheHit: metadata?.cacheHit
        }
      };
      
    } catch (error) {
      const endTime = performance.now();
      const memoryAfter = this.getMemoryUsage();
      const duration = endTime - startTime;
      const memoryDelta = memoryAfter - memoryBefore;
      
      // Registrar métrica de error
      const metric: PerformanceMetric = {
        operationType,
        startTime,
        endTime,
        duration,
        success: false,
        error: String(error),
        memoryBefore,
        memoryAfter,
        memoryDelta,
        timestamp,
        metadata
      };
      
      this.recordMetric(metric);
      this.checkAlerts(metric);
      
      // Re-lanzar el error
      throw error;
    }
  }
  
  /**
   * ⏱️ MEDIR OPERACIÓN SINCRÓNICA
   */
  measureSync<T>(
    operation: () => T,
    operationType: string,
    metadata?: any
  ): MeasuredResult<T> {
    
    const startTime = performance.now();
    const memoryBefore = this.getMemoryUsage();
    const timestamp = new Date();
    
    try {
      const result = operation();
      const endTime = performance.now();
      const memoryAfter = this.getMemoryUsage();
      const duration = endTime - startTime;
      const memoryDelta = memoryAfter - memoryBefore;
      
      const metric: PerformanceMetric = {
        operationType,
        startTime,
        endTime,
        duration,
        success: true,
        memoryBefore,
        memoryAfter,
        memoryDelta,
        timestamp,
        metadata
      };
      
      this.recordMetric(metric);
      this.checkAlerts(metric);
      
      return {
        result,
        metrics: {
          duration,
          success: true,
          memoryUsage: memoryDelta
        }
      };
      
    } catch (error) {
      const endTime = performance.now();
      const memoryAfter = this.getMemoryUsage();
      const duration = endTime - startTime;
      const memoryDelta = memoryAfter - memoryBefore;
      
      const metric: PerformanceMetric = {
        operationType,
        startTime,
        endTime,
        duration,
        success: false,
        error: String(error),
        memoryBefore,
        memoryAfter,
        memoryDelta,
        timestamp,
        metadata
      };
      
      this.recordMetric(metric);
      this.checkAlerts(metric);
      
      throw error;
    }
  }
  
  /**
   * 📝 REGISTRAR MÉTRICA
   */
  private recordMetric(metric: PerformanceMetric): void {
    this.metrics.push(metric);
    
    // Actualizar estadísticas globales
    this.stats.totalOperations++;
    this.stats.totalDuration += metric.duration;
    this.stats.totalMemoryUsed += Math.abs(metric.memoryDelta);
    
    if (metric.success) {
      this.stats.totalSuccesses++;
    } else {
      this.stats.totalErrors++;
    }
    
    // Mantener límite de historial
    if (this.metrics.length > this.maxMetricsHistory) {
      this.metrics = this.metrics.slice(-this.maxMetricsHistory);
    }
    
    // Log de operaciones lentas
    if (metric.duration > this.alertThresholds.slowOperation) {
      console.warn(`⚠️ Operación lenta detectada: ${metric.operationType} - ${metric.duration.toFixed(2)}ms`);
    }
  }
  
  /**
   * 🚨 VERIFICAR ALERTAS
   */
  private checkAlerts(metric: PerformanceMetric): void {
    // Alerta por operación lenta
    if (metric.duration > this.alertThresholds.slowOperation) {
      this.createAlert({
        type: 'performance',
        severity: metric.duration > this.alertThresholds.slowOperation * 2 ? 'high' : 'medium',
        message: `Operación lenta: ${metric.operationType} tardó ${metric.duration.toFixed(2)}ms`,
        threshold: this.alertThresholds.slowOperation,
        currentValue: metric.duration,
        metadata: { operationType: metric.operationType }
      });
    }
    
    // Alerta por alto uso de memoria
    if (Math.abs(metric.memoryDelta) > this.alertThresholds.highMemoryUsage) {
      this.createAlert({
        type: 'memory',
        severity: 'medium',
        message: `Alto uso de memoria: ${Math.round(Math.abs(metric.memoryDelta) / 1024 / 1024)}MB`,
        threshold: this.alertThresholds.highMemoryUsage,
        currentValue: Math.abs(metric.memoryDelta),
        metadata: { operationType: metric.operationType }
      });
    }
    
    // Verificar tasa de errores
    this.checkErrorRate();
  }
  
  /**
   * 📊 VERIFICAR TASA DE ERRORES
   */
  private checkErrorRate(): void {
    const recentMetrics = this.getRecentMetrics(300000); // últimos 5 minutos
    if (recentMetrics.length < 10) return; // Necesitamos muestra mínima
    
    const errorRate = (recentMetrics.filter(m => !m.success).length / recentMetrics.length) * 100;
    
    if (errorRate > this.alertThresholds.errorRateThreshold) {
      this.createAlert({
        type: 'error_rate',
        severity: errorRate > this.alertThresholds.errorRateThreshold * 2 ? 'critical' : 'high',
        message: `Alta tasa de errores: ${errorRate.toFixed(1)}%`,
        threshold: this.alertThresholds.errorRateThreshold,
        currentValue: errorRate
      });
    }
  }
  
  /**
   * 🚨 CREAR ALERTA
   */
  private createAlert(alertData: {
    type: PerformanceAlert['type'];
    severity: PerformanceAlert['severity'];
    message: string;
    threshold: number;
    currentValue: number;
    metadata?: any;
  }): void {
    
    const alert: PerformanceAlert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      type: alertData.type,
      severity: alertData.severity,
      message: alertData.message,
      threshold: alertData.threshold,
      currentValue: alertData.currentValue,
      timestamp: new Date(),
      acknowledged: false,
      metadata: alertData.metadata
    };
    
    this.alerts.push(alert);
    
    // Log según severidad
    const logMessage = `🚨 ALERTA [${alert.severity.toUpperCase()}]: ${alert.message}`;
    
    switch (alert.severity) {
      case 'critical':
        console.error(logMessage);
        break;
      case 'high':
        console.warn(logMessage);
        break;
      case 'medium':
        console.log(logMessage);
        break;
      default:
        console.debug(logMessage);
    }
    
    // Mantener solo las últimas 1000 alertas
    if (this.alerts.length > 1000) {
      this.alerts = this.alerts.slice(-1000);
    }
  }
  
  /**
   * 📈 OBTENER ESTADÍSTICAS
   */
  getStats(): {
    global: typeof this.stats & {
      averageResponseTime: number;
      successRate: number;
      errorRate: number;
      uptime: number;
    };
    byOperation: AggregatedStats[];
    recent: {
      last5Minutes: AggregatedStats[];
      lastHour: AggregatedStats[];
    };
  } {
    
    const averageResponseTime = this.stats.totalOperations > 0 ? 
      this.stats.totalDuration / this.stats.totalOperations : 0;
    
    const successRate = this.stats.totalOperations > 0 ? 
      (this.stats.totalSuccesses / this.stats.totalOperations) * 100 : 0;
    
    const errorRate = this.stats.totalOperations > 0 ? 
      (this.stats.totalErrors / this.stats.totalOperations) * 100 : 0;
    
    const uptime = Date.now() - this.startTime;
    
    return {
      global: {
        ...this.stats,
        averageResponseTime,
        successRate,
        errorRate,
        uptime
      },
      byOperation: this.getStatsByOperation(),
      recent: {
        last5Minutes: this.getStatsByOperation(300000), // 5 minutos
        lastHour: this.getStatsByOperation(3600000) // 1 hora
      }
    };
  }
  
  /**
   * 📊 ESTADÍSTICAS POR TIPO DE OPERACIÓN
   */
  private getStatsByOperation(timeWindow?: number): AggregatedStats[] {
    let metricsToAnalyze = this.metrics;
    
    if (timeWindow) {
      const cutoff = Date.now() - timeWindow;
      metricsToAnalyze = this.metrics.filter(m => m.timestamp.getTime() > cutoff);
    }
    
    const operationMap = new Map<string, PerformanceMetric[]>();
    
    // Agrupar por tipo de operación
    metricsToAnalyze.forEach(metric => {
      if (!operationMap.has(metric.operationType)) {
        operationMap.set(metric.operationType, []);
      }
      operationMap.get(metric.operationType)!.push(metric);
    });
    
    // Calcular estadísticas agregadas
    const results: AggregatedStats[] = [];
    
    operationMap.forEach((metrics, operationType) => {
      const totalOperations = metrics.length;
      const successCount = metrics.filter(m => m.success).length;
      const errorCount = totalOperations - successCount;
      const successRate = (successCount / totalOperations) * 100;
      
      const durations = metrics.map(m => m.duration);
      const averageDuration = durations.reduce((sum, d) => sum + d, 0) / durations.length;
      const minDuration = Math.min(...durations);
      const maxDuration = Math.max(...durations);
      
      const memoryUsages = metrics.map(m => Math.abs(m.memoryDelta));
      const totalMemoryUsed = memoryUsages.reduce((sum, m) => sum + m, 0);
      const averageMemoryUsed = totalMemoryUsed / memoryUsages.length;
      
      const cacheHits = metrics.filter(m => m.metadata?.cacheHit).length;
      const cacheHitRate = totalOperations > 0 ? (cacheHits / totalOperations) * 100 : 0;
      
      const lastOperation = new Date(Math.max(...metrics.map(m => m.timestamp.getTime())));
      
      results.push({
        operationType,
        totalOperations,
        successCount,
        errorCount,
        successRate,
        averageDuration,
        minDuration,
        maxDuration,
        totalMemoryUsed,
        averageMemoryUsed,
        cacheHitRate,
        lastOperation
      });
    });
    
    return results.sort((a, b) => b.totalOperations - a.totalOperations);
  }
  
  /**
   * 🚨 OBTENER ALERTAS
   */
  getAlerts(filters?: {
    type?: PerformanceAlert['type'];
    severity?: PerformanceAlert['severity'];
    acknowledged?: boolean;
    since?: Date;
  }): PerformanceAlert[] {
    
    let filteredAlerts = [...this.alerts];
    
    if (filters) {
      if (filters.type) {
        filteredAlerts = filteredAlerts.filter(a => a.type === filters.type);
      }
      
      if (filters.severity) {
        filteredAlerts = filteredAlerts.filter(a => a.severity === filters.severity);
      }
      
      if (filters.acknowledged !== undefined) {
        filteredAlerts = filteredAlerts.filter(a => a.acknowledged === filters.acknowledged);
      }
      
      if (filters.since) {
        filteredAlerts = filteredAlerts.filter(a => a.timestamp >= filters.since!);
      }
    }
    
    return filteredAlerts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }
  
  /**
   * ✅ RECONOCER ALERTA
   */
  acknowledgeAlert(alertId: string): boolean {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.acknowledged = true;
      return true;
    }
    return false;
  }
  
  /**
   * 📊 MÉTRICAS ESPECÍFICAS
   */
  getTotalRequests(): number {
    return this.stats.totalOperations;
  }
  
  getSuccessRate(): number {
    return this.stats.totalOperations > 0 ? 
      (this.stats.totalSuccesses / this.stats.totalOperations) * 100 : 0;
  }
  
  getErrorRate(): number {
    return this.stats.totalOperations > 0 ? 
      (this.stats.totalErrors / this.stats.totalOperations) * 100 : 0;
  }
  
  getAverageResponseTime(): number {
    return this.stats.totalOperations > 0 ? 
      this.stats.totalDuration / this.stats.totalOperations : 0;
  }
  
  getStartTime(): number {
    return this.startTime;
  }
  
  /**
   * 🔧 MÉTODOS PRIVADOS
   */
  
  private getMemoryUsage(): number {
    return process.memoryUsage().heapUsed;
  }
  
  private getRecentMetrics(timeWindowMs: number): PerformanceMetric[] {
    const cutoff = Date.now() - timeWindowMs;
    return this.metrics.filter(m => m.timestamp.getTime() > cutoff);
  }
  
  private startPeriodicAnalysis(): void {
    // Análisis cada 5 minutos
    setInterval(() => {
      this.performPeriodicAnalysis();
    }, 5 * 60 * 1000);
    
    // Limpieza cada hora
    setInterval(() => {
      this.performHousekeeping();
    }, 60 * 60 * 1000);
  }
  
  private performPeriodicAnalysis(): void {
    const recentStats = this.getStatsByOperation(300000); // últimos 5 minutos
    
    // Verificar degradación de performance
    recentStats.forEach(stat => {
      if (stat.averageDuration > this.alertThresholds.responseTimeThreshold) {
        this.createAlert({
          type: 'performance',
          severity: 'medium',
          message: `Degradación de performance en ${stat.operationType}: ${stat.averageDuration.toFixed(2)}ms promedio`,
          threshold: this.alertThresholds.responseTimeThreshold,
          currentValue: stat.averageDuration,
          metadata: { operationType: stat.operationType }
        });
      }
    });
  }
  
  private performHousekeeping(): void {
    // Limpiar alertas reconocidas antiguas (más de 24 horas)
    const cutoff = Date.now() - (24 * 60 * 60 * 1000);
    this.alerts = this.alerts.filter(alert => 
      !alert.acknowledged || alert.timestamp.getTime() > cutoff
    );
    
    console.log('🧹 Limpieza de métricas completada');
  }
  
  private logSystemInfo(): void {
    const memoryMB = Math.round(this.getMemoryUsage() / 1024 / 1024);
    console.log(`📊 Sistema iniciado - Memoria: ${memoryMB}MB`);
  }
  
  /**
   * 📈 REPORTE DETALLADO
   */
  generateReport(timeWindow?: { start: Date; end: Date }): {
    summary: {
      totalOperations: number;
      successRate: number;
      averageResponseTime: number;
      alertsGenerated: number;
      uptime: string;
    };
    performance: {
      slowestOperations: Array<{ operation: string; duration: number; }>;
      fastestOperations: Array<{ operation: string; duration: number; }>;
      memoryIntensiveOperations: Array<{ operation: string; memory: number; }>;
    };
    reliability: {
      errorsByType: Array<{ error: string; count: number; }>;
      successRateByOperation: Array<{ operation: string; rate: number; }>;
    };
    recommendations: string[];
  } {
    
    let metricsToAnalyze = this.metrics;
    let alertsToAnalyze = this.alerts;
    
    if (timeWindow) {
      metricsToAnalyze = this.metrics.filter(m => 
        m.timestamp >= timeWindow.start && m.timestamp <= timeWindow.end
      );
      alertsToAnalyze = this.alerts.filter(a => 
        a.timestamp >= timeWindow.start && a.timestamp <= timeWindow.end
      );
    }
    
    const globalStats = this.getStats().global;
    const operationStats = this.getStatsByOperation();
    
    // Operaciones más lentas
    const slowestOperations = operationStats
      .sort((a, b) => b.averageDuration - a.averageDuration)
      .slice(0, 5)
      .map(stat => ({ operation: stat.operationType, duration: stat.averageDuration }));
    
    // Operaciones más rápidas
    const fastestOperations = operationStats
      .sort((a, b) => a.averageDuration - b.averageDuration)
      .slice(0, 5)
      .map(stat => ({ operation: stat.operationType, duration: stat.averageDuration }));
    
    // Operaciones que consumen más memoria
    const memoryIntensiveOperations = operationStats
      .sort((a, b) => b.averageMemoryUsed - a.averageMemoryUsed)
      .slice(0, 5)
      .map(stat => ({ operation: stat.operationType, memory: stat.averageMemoryUsed }));
    
    // Errores por tipo
    const errorsByType = new Map<string, number>();
    metricsToAnalyze.filter(m => !m.success).forEach(m => {
      const error = m.error || 'Unknown Error';
      errorsByType.set(error, (errorsByType.get(error) || 0) + 1);
    });
    
    const errorsByTypeArray = Array.from(errorsByType.entries())
      .map(([error, count]) => ({ error, count }))
      .sort((a, b) => b.count - a.count);
    
    // Tasa de éxito por operación
    const successRateByOperation = operationStats.map(stat => ({
      operation: stat.operationType,
      rate: stat.successRate
    }));
    
    // Generar recomendaciones
    const recommendations = this.generateRecommendations(globalStats, operationStats, alertsToAnalyze);
    
    // Formatear uptime
    const uptimeHours = Math.round(globalStats.uptime / (1000 * 60 * 60));
    const uptimeStr = `${Math.floor(uptimeHours / 24)}d ${uptimeHours % 24}h`;
    
    return {
      summary: {
        totalOperations: globalStats.totalOperations,
        successRate: globalStats.successRate,
        averageResponseTime: globalStats.averageResponseTime,
        alertsGenerated: alertsToAnalyze.length,
        uptime: uptimeStr
      },
      performance: {
        slowestOperations,
        fastestOperations,
        memoryIntensiveOperations
      },
      reliability: {
        errorsByType: errorsByTypeArray,
        successRateByOperation
      },
      recommendations
    };
  }
  
  private generateRecommendations(
    globalStats: any,
    operationStats: AggregatedStats[],
    alerts: PerformanceAlert[]
  ): string[] {
    
    const recommendations: string[] = [];
    
    // Recomendaciones basadas en performance
    if (globalStats.averageResponseTime > 3000) {
      recommendations.push('Considerar optimización general del sistema - tiempo de respuesta alto');
    }
    
    if (globalStats.errorRate > 5) {
      recommendations.push('Investigar y corregir causas de errores frecuentes');
    }
    
    // Recomendaciones por operación
    operationStats.forEach(stat => {
      if (stat.averageDuration > 5000) {
        recommendations.push(`Optimizar ${stat.operationType} - tiempo promedio: ${stat.averageDuration.toFixed(2)}ms`);
      }
      
      if (stat.successRate < 95) {
        recommendations.push(`Mejorar confiabilidad de ${stat.operationType} - tasa de éxito: ${stat.successRate.toFixed(1)}%`);
      }
    });
    
    // Recomendaciones basadas en alertas
    const criticalAlerts = alerts.filter(a => a.severity === 'critical');
    if (criticalAlerts.length > 0) {
      recommendations.push('Atender inmediatamente alertas críticas pendientes');
    }
    
    const memoryAlerts = alerts.filter(a => a.type === 'memory');
    if (memoryAlerts.length > 10) {
      recommendations.push('Investigar posibles memory leaks o optimizar uso de memoria');
    }
    
    return recommendations;
  }
}

export default PerformanceMonitor;
