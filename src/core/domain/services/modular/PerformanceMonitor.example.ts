/**
 * 🚀 EJEMPLO PRÁCTICO - PERFORMANCE MONITOR EN ACCIÓN
 * 
 * Este archivo demuestra cómo integrar el PerformanceMonitor
 * en el sistema de calculadora de fertilidad para obtener
 * observabilidad completa del sistema.
 */

import { 
  getPerformanceMonitor, 
  measured, 
  measureAsync, 
  getQuickMetrics, 
  createManualAlert,
  PerformanceConfig 
} from './PerformanceMonitor';
import { UserInput, EvaluationState } from '../../models';

// ===================================================================
// 🔧 CONFIGURACIÓN PARA PRODUCCIÓN
// ===================================================================

const productionConfig: PerformanceConfig = {
  maxMetricsHistory: 800,
  alertThresholds: {
    slowOperationMs: 1500,      // 1.5 segundos para operaciones lentas
    highErrorRatePercent: 8,    // 8% de errores es problemático
    memoryLeakMB: 75,           // 75MB de memoria es alto
    cpuUsagePercent: 85         // 85% de CPU es crítico
  },
  enableRealTimeAlerts: true,
  enableTrendAnalysis: true,
  reportInterval: 3 * 60 * 1000,  // Reportes cada 3 minutos
  retentionDays: 10               // Retener métricas por 10 días
};

// Inicializar monitor con configuración de producción
const monitor = getPerformanceMonitor(productionConfig);

// ===================================================================
// 🧮 SERVICIO DE CÁLCULO CON MONITORING
// ===================================================================

class MonitoredCalculationService {
  
  /**
   * Cálculo principal con monitoring completo
   */
  @measured('fertility_calculation')
  async calculateFertility(input: UserInput, userId?: string): Promise<EvaluationState> {
    const context = {
      userId: userId || 'anonymous',
      operationType: 'fertility_calculation',
      metadata: {
        hasAMH: !!input.amh,
        hasPCOS: input.hasPcos,
        age: input.age,
        complexity: this.calculateComplexity(input)
      }
    };

    try {
      // Paso 1: Validación de entrada
      const validationResult = await measureAsync(
        'input_validation',
        () => this.validateInput(input),
        { ...context, operationType: 'validation' }
      );

      if (!validationResult.isValid) {
        throw new Error(`Validación fallida: ${validationResult.errors.join(', ')}`);
      }

      // Paso 2: Cálculo de factores
      const factors = await measureAsync(
        'factor_calculation',
        () => this.calculateFactors(input),
        { ...context, operationType: 'calculation' }
      );

      // Paso 3: Generación de pronóstico
      const prognosis = await measureAsync(
        'prognosis_generation',
        () => this.generatePrognosis(factors),
        { ...context, operationType: 'prognosis' }
      );

      // Paso 4: Generación de reporte
      const report = await measureAsync(
        'report_generation',
        () => this.generateReport(prognosis, input),
        { ...context, operationType: 'report' }
      );

      return {
        input,
        factors,
        diagnostics: validationResult.diagnostics,
        report
      };

    } catch (error) {
      // Crear alerta para errores críticos
      createManualAlert(
        'ANOMALY',
        `Error en cálculo de fertilidad: ${error.message}`,
        'HIGH'
      );
      
      throw error;
    }
  }

  /**
   * Validación de entrada con monitoring
   */
  private async validateInput(input: UserInput) {
    const measurementId = monitor.startMeasurement('input_validation_detailed');
    
    try {
      // Validaciones específicas
      const clinicalValidation = await this.validateClinicalData(input);
      const technicalValidation = await this.validateTechnicalData(input);
      
      const result = {
        isValid: clinicalValidation.isValid && technicalValidation.isValid,
        errors: [...clinicalValidation.errors, ...technicalValidation.errors],
        diagnostics: {
          ...clinicalValidation.diagnostics,
          ...technicalValidation.diagnostics
        }
      };
      
      monitor.endMeasurement(measurementId, result.isValid);
      return result;
      
    } catch (error) {
      monitor.endMeasurement(measurementId, false, error.message);
      throw error;
    }
  }

  /**
   * Cálculo de factores con monitoring detallado
   */
  @measured('factor_calculation')
  private async calculateFactors(input: UserInput) {
    const factors = {
      baseAgeProbability: 0,
      bmi: 1.0,
      cycle: 1.0,
      pcos: 1.0,
      endometriosis: 1.0,
      myoma: 1.0,
      adenomyosis: 1.0,
      polyp: 1.0,
      hsg: 1.0,
      otb: 1.0,
      amh: 1.0,
      prolactin: 1.0,
      tsh: 1.0,
      homa: 1.0,
      male: 1.0,
      infertilityDuration: 1.0,
      pelvicSurgery: 1.0
    };

    // Calcular cada factor con monitoring individual
    factors.baseAgeProbability = await measureAsync(
      'age_factor_calculation',
      () => this.calculateAgeFactor(input.age)
    );

    if (input.bmi) {
      factors.bmi = await measureAsync(
        'bmi_factor_calculation',
        () => this.calculateBMIFactor(input.bmi)
      );
    }

    if (input.amh !== undefined) {
      factors.amh = await measureAsync(
        'amh_factor_calculation',
        () => this.calculateAMHFactor(input.amh)
      );
    }

    return factors;
  }

  /**
   * Análisis de complejidad para metadata
   */
  private calculateComplexity(input: UserInput): 'low' | 'medium' | 'high' {
    let complexity = 0;
    
    if (input.amh !== undefined) complexity += 1;
    if (input.hasPcos) complexity += 1;
    if (input.endometriosisGrade > 0) complexity += 1;
    if (input.spermConcentration !== undefined) complexity += 1;
    if (input.hasOtb) complexity += 2;
    
    if (complexity <= 2) return 'low';
    if (complexity <= 4) return 'medium';
    return 'high';
  }

  // Métodos auxiliares (simplificados para el ejemplo)
  private async validateClinicalData(input: UserInput) {
    return { isValid: true, errors: [], diagnostics: {} };
  }

  private async validateTechnicalData(input: UserInput) {
    return { isValid: true, errors: [], diagnostics: {} };
  }

  private async calculateAgeFactor(age: number) {
    // Simular cálculo
    return age <= 35 ? 25 : Math.max(1, 25 - (age - 35) * 2);
  }

  private async calculateBMIFactor(bmi: number) {
    return bmi >= 18.5 && bmi <= 25 ? 1.0 : 0.8;
  }

  private async calculateAMHFactor(amh: number) {
    return amh >= 1.5 ? 1.0 : 0.7;
  }

  private async generatePrognosis(factors: any) {
    return {
      numericPrognosis: Object.values(factors).reduce((sum: number, factor: any) => 
        sum + (typeof factor === 'number' ? factor : 0), 0
      ),
      category: 'MODERADO' as const,
      emoji: '🌟',
      prognosisPhrase: 'Pronóstico moderado',
      benchmarkPhrase: 'Dentro del rango esperado'
    };
  }

  private async generateReport(prognosis: any, input: UserInput) {
    return {
      ...prognosis,
      clinicalInsights: [
        {
          key: 'age_factor',
          title: 'Factor Edad',
          definition: 'Impacto de la edad en la fertilidad',
          justification: `Edad ${input.age} años`,
          recommendations: ['Consulta especializada']
        }
      ]
    };
  }
}

// ===================================================================
// 🎯 SISTEMA DE MONITORING AVANZADO
// ===================================================================

class FertilityMonitoringSystem {
  private calculationService: MonitoredCalculationService;
  private alertsEnabled = true;

  constructor() {
    this.calculationService = new MonitoredCalculationService();
    this.setupPeriodicReports();
    this.setupAlertHandling();
  }

  /**
   * Endpoint principal con monitoring completo
   */
  async processFertilityCalculation(input: UserInput, userId?: string): Promise<EvaluationState> {
    const operationId = monitor.startMeasurement('fertility_calculation_request', {
      userId: userId || 'anonymous',
      operationType: 'api_request',
      metadata: {
        endpoint: 'fertility-calculation',
        timestamp: new Date().toISOString(),
        userAgent: 'fertility-calculator-app'
      }
    });

    try {
      // Pre-validación
      this.validateRequestRate(userId);
      
      // Ejecución principal
      const result = await this.calculationService.calculateFertility(input, userId);
      
      // Post-procesamiento
      await this.logCalculationResult(result, userId);
      
      monitor.endMeasurement(operationId, true);
      return result;
      
    } catch (error) {
      monitor.endMeasurement(operationId, false, error.message);
      
      // Analizar si es un error crítico
      if (this.isCriticalError(error)) {
        createManualAlert(
          'ANOMALY',
          `Error crítico en cálculo: ${error.message}`,
          'CRITICAL'
        );
      }
      
      throw error;
    }
  }

  /**
   * Análisis de performance en tiempo real
   */
  analyzePerformance(): any {
    const metrics = getQuickMetrics();
    
    const analysis = {
      status: 'healthy',
      metrics: {
        totalOperations: metrics.totalOperations,
        successRate: metrics.successRate,
        averageTime: metrics.averageExecutionTime,
        peakMemory: metrics.peakMemoryUsage
      },
      recommendations: [],
      alerts: monitor.getActiveAlerts()
    };

    // Análisis de salud
    if (metrics.successRate < 95) {
      analysis.status = 'degraded';
      analysis.recommendations.push('Investigar alta tasa de errores');
    }

    if (metrics.averageExecutionTime > 2000) {
      analysis.status = 'degraded';
      analysis.recommendations.push('Optimizar performance de cálculos');
    }

    // Análisis de tendencias
    if (metrics.trends.executionTimeSlope > 100) {
      analysis.recommendations.push('Monitorear degradación de performance');
    }

    return analysis;
  }

  /**
   * Reporte de salud del sistema
   */
  generateHealthReport(): any {
    const report = monitor.generateReport();
    const analysis = this.analyzePerformance();
    
    return {
      timestamp: new Date().toISOString(),
      status: analysis.status,
      summary: {
        totalOperations: report.summary.totalOperations,
        successRate: report.summary.successRate,
        averageExecutionTime: report.summary.averageExecutionTime,
        activeAlerts: report.alerts.length
      },
      topOperations: Object.entries(report.summary.operationMetrics)
        .sort(([,a], [,b]) => b.count - a.count)
        .slice(0, 5)
        .map(([name, stats]) => ({
          name,
          count: stats.count,
          averageTime: stats.averageTime,
          successRate: stats.successRate
        })),
      recommendations: analysis.recommendations,
      alerts: report.alerts.filter(alert => !alert.acknowledged)
    };
  }

  /**
   * Configuración de reportes periódicos
   */
  private setupPeriodicReports(): void {
    setInterval(() => {
      const analysis = this.analyzePerformance();
      
      console.log('📊 FERTILITY SYSTEM HEALTH REPORT');
      console.log(`Status: ${analysis.status}`);
      console.log(`Operations: ${analysis.metrics.totalOperations}`);
      console.log(`Success Rate: ${analysis.metrics.successRate.toFixed(2)}%`);
      console.log(`Average Time: ${analysis.metrics.averageTime.toFixed(2)}ms`);
      
      if (analysis.recommendations.length > 0) {
        console.log('💡 Recommendations:');
        analysis.recommendations.forEach(rec => console.log(`  - ${rec}`));
      }
      
      if (analysis.alerts.length > 0) {
        console.log(`🚨 Active Alerts: ${analysis.alerts.length}`);
      }
      
    }, 5 * 60 * 1000); // Cada 5 minutos
  }

  /**
   * Manejo de alertas
   */
  private setupAlertHandling(): void {
    setInterval(() => {
      const alerts = monitor.getActiveAlerts();
      
      alerts.forEach(alert => {
        if (alert.severity === 'CRITICAL') {
          this.handleCriticalAlert(alert);
        } else if (alert.severity === 'HIGH') {
          this.handleHighPriorityAlert(alert);
        }
      });
      
    }, 30 * 1000); // Cada 30 segundos
  }

  /**
   * Manejo de alertas críticas
   */
  private handleCriticalAlert(alert: any): void {
    console.error(`🚨 CRITICAL ALERT: ${alert.message}`);
    
    // En un sistema real, aquí se enviarían notificaciones
    // this.notifyDevelopmentTeam(alert);
    // this.sendSlackNotification(alert);
    // this.createJiraTicket(alert);
  }

  /**
   * Manejo de alertas de alta prioridad
   */
  private handleHighPriorityAlert(alert: any): void {
    console.warn(`⚠️ HIGH PRIORITY: ${alert.message}`);
    
    // Logging adicional o acciones automáticas
    if (alert.type === 'SLOW_OPERATION') {
      this.investigateSlowOperation(alert.operation);
    }
  }

  // Métodos auxiliares
  private validateRequestRate(userId?: string): void {
    // Implementar rate limiting
  }

  private async logCalculationResult(result: EvaluationState, userId?: string): Promise<void> {
    // Logging para análisis posterior
  }

  private isCriticalError(error: any): boolean {
    return error.message.includes('timeout') || 
           error.message.includes('memory') || 
           error.message.includes('database');
  }

  private investigateSlowOperation(operation?: string): void {
    console.log(`🔍 Investigating slow operation: ${operation}`);
    // Implementar lógica de investigación automática
  }
}

// ===================================================================
// 🚀 EJEMPLO DE USO
// ===================================================================

// Inicializar sistema de monitoring
const fertilityMonitoring = new FertilityMonitoringSystem();

// Ejemplo de uso
export const exampleUsage = async () => {
  const sampleInput: UserInput = {
    age: 32,
    bmi: 23.5,
    cycleDuration: 28,
    infertilityDuration: 18,
    hasPcos: false,
    endometriosisGrade: 0,
    myomaType: 'none' as any,
    adenomyosisType: 'none' as any,
    polypType: 'none' as any,
    hsgResult: 'normal' as any,
    hasOtb: false,
    hasPelvicSurgery: false,
    tpoAbPositive: false,
    amh: 2.8,
    prolactin: 15,
    tsh: 2.1
  };

  try {
    console.log('🧮 Iniciando cálculo de fertilidad con monitoring...');
    
    const result = await fertilityMonitoring.processFertilityCalculation(
      sampleInput, 
      'user123'
    );
    
    console.log('✅ Cálculo completado exitosamente');
    console.log(`Pronóstico: ${result.report.numericPrognosis}`);
    
    // Analizar performance
    const analysis = fertilityMonitoring.analyzePerformance();
    console.log('📊 Análisis de performance:', analysis);
    
    // Generar reporte de salud
    const healthReport = fertilityMonitoring.generateHealthReport();
    console.log('🏥 Reporte de salud:', healthReport);
    
  } catch (error) {
    console.error('❌ Error en cálculo:', error.message);
  }
};

// Exportar para uso en la aplicación
export { FertilityMonitoringSystem, MonitoredCalculationService };
export default fertilityMonitoring;

// ===================================================================
// 🧪 FUNCIÓN PARA TESTING
// ===================================================================

export const runPerformanceTest = async () => {
  console.log('🧪 Iniciando test de performance...');
  
  const startTime = Date.now();
  
  // Ejecutar múltiples cálculos
  const promises = Array.from({ length: 10 }, (_, i) => 
    fertilityMonitoring.processFertilityCalculation({
      age: 30 + i,
      bmi: 22 + i,
      hasPcos: i % 2 === 0,
      endometriosisGrade: 0,
      myomaType: 'none' as any,
      adenomyosisType: 'none' as any,
      polypType: 'none' as any,
      hsgResult: 'normal' as any,
      hasOtb: false,
      hasPelvicSurgery: false,
      tpoAbPositive: false
    }, `testUser${i}`)
  );
  
  try {
    await Promise.all(promises);
    const endTime = Date.now();
    
    console.log(`✅ Test completado en ${endTime - startTime}ms`);
    
    // Mostrar métricas finales
    const finalMetrics = getQuickMetrics();
    console.log('📊 Métricas finales:', {
      totalOperations: finalMetrics.totalOperations,
      successRate: finalMetrics.successRate,
      averageTime: finalMetrics.averageExecutionTime
    });
    
  } catch (error) {
    console.error('❌ Error en test:', error.message);
  }
};
