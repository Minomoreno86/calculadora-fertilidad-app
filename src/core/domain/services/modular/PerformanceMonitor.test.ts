/**
 * 📊 TESTS PARA PERFORMANCE MONITOR
 * 
 * Suite de tests comprehensiva para el sistema de monitoreo de performance
 * que incluye métricas, alertas y análisis de tendencias.
 */

import { 
  PerformanceMonitor, 
  getPerformanceMonitor, 
  measured, 
  measureAsync, 
  measureSync, 
  getQuickMetrics, 
  createManualAlert,
  PerformanceConfig,
  PerformanceMetric,
  SystemMetrics,
  PerformanceAlert,
  OperationContext
} from './PerformanceMonitor';

// ===================================================================
// 🛠️ SETUP Y MOCKS
// ===================================================================

// Mock de performance.now
const mockPerformanceNow = jest.fn();
Object.defineProperty(global, 'performance', {
  value: {
    now: mockPerformanceNow
  },
  writable: true
});

// Mock de process.memoryUsage
const mockMemoryUsage = jest.fn();
Object.defineProperty(global, 'process', {
  value: {
    memoryUsage: mockMemoryUsage
  },
  writable: true
});

// Mock de setTimeout/setInterval
jest.useFakeTimers();

describe('PerformanceMonitor', () => {
  let monitor: PerformanceMonitor;
  let startTime: number;

  beforeEach(() => {
    // Reset mocks
    mockPerformanceNow.mockReset();
    mockMemoryUsage.mockReset();
    jest.clearAllTimers();
    
    // Setup time sequence
    startTime = 1000;
    mockPerformanceNow.mockImplementation(() => startTime);
    
    // Setup memory usage
    mockMemoryUsage.mockReturnValue({
      rss: 100 * 1024 * 1024, // 100MB
      heapTotal: 80 * 1024 * 1024, // 80MB
      heapUsed: 50 * 1024 * 1024, // 50MB
      external: 10 * 1024 * 1024  // 10MB
    });

    // Create fresh monitor instance
    monitor = new PerformanceMonitor();
  });

  afterEach(() => {
    monitor.destroy();
    jest.clearAllTimers();
  });

  // ===================================================================
  // 📏 TESTS DE MEDICIÓN BÁSICA
  // ===================================================================

  describe('Medición Básica', () => {
    test('should start and end measurement correctly', () => {
      // Iniciar medición
      const measurementId = monitor.startMeasurement('test_operation');
      expect(measurementId).toBeDefined();
      expect(measurementId).toMatch(/^perf_\d+_[a-z0-9]+$/);
      
      // Simular tiempo transcurrido
      startTime = 1500; // 500ms después
      mockPerformanceNow.mockReturnValue(startTime);
      
      // Finalizar medición
      const metric = monitor.endMeasurement(measurementId, true);
      
      expect(metric).toBeDefined();
      expect(metric.operationId).toBe(measurementId);
      expect(metric.operationType).toBe('test_operation');
      expect(metric.duration).toBe(500);
      expect(metric.success).toBe(true);
      expect(metric.memoryUsage).toBe(50); // 50MB
    });

    test('should handle measurement with context', () => {
      const context: OperationContext = {
        userId: 'user123',
        sessionId: 'session456',
        operationType: 'calculation',
        metadata: { testFlag: true }
      };
      
      const measurementId = monitor.startMeasurement('test_with_context', context);
      
      // Simular tiempo
      startTime = 1200;
      mockPerformanceNow.mockReturnValue(startTime);
      
      const metric = monitor.endMeasurement(measurementId, true);
      
      expect(metric.metadata).toEqual(expect.objectContaining({
        userId: 'user123',
        sessionId: 'session456',
        hasInput: false,
        testFlag: true
      }));
    });

    test('should handle measurement errors', () => {
      const measurementId = monitor.startMeasurement('failing_operation');
      
      // Simular tiempo
      startTime = 1300;
      mockPerformanceNow.mockReturnValue(startTime);
      
      const metric = monitor.endMeasurement(measurementId, false, 'Test error');
      
      expect(metric.success).toBe(false);
      expect(metric.error).toBe('Test error');
      expect(metric.duration).toBe(300);
    });

    test('should throw error for invalid measurement ID', () => {
      expect(() => monitor.endMeasurement('invalid_id')).toThrow('Medición invalid_id no encontrada');
    });
  });

  // ===================================================================
  // 🔄 TESTS DE MEDICIÓN AUTOMÁTICA
  // ===================================================================

  describe('Medición Automática', () => {
    test('should measure async operations', async () => {
      const asyncOperation = jest.fn().mockResolvedValue('success');
      
      // Simular tiempo de ejecución
      let callCount = 0;
      mockPerformanceNow.mockImplementation(() => {
        callCount++;
        return callCount === 1 ? 1000 : 1250; // 250ms de ejecución
      });
      
      const result = await monitor.measureOperation(
        'async_test',
        asyncOperation,
        { operationType: 'async' }
      );
      
      expect(result).toBe('success');
      expect(asyncOperation).toHaveBeenCalled();
      
      // Verificar que se guardó la métrica
      const metrics = monitor.getSystemMetrics();
      expect(metrics.totalOperations).toBe(1);
      expect(metrics.successfulOperations).toBe(1);
    });

    test('should measure sync operations', () => {
      const syncOperation = jest.fn().mockReturnValue('sync_result');
      
      // Simular tiempo de ejecución
      let callCount = 0;
      mockPerformanceNow.mockImplementation(() => {
        callCount++;
        return callCount === 1 ? 1000 : 1100; // 100ms de ejecución
      });
      
      const result = monitor.measureSync(
        'sync_test',
        syncOperation,
        { operationType: 'sync' }
      );
      
      expect(result).toBe('sync_result');
      expect(syncOperation).toHaveBeenCalled();
    });

    test('should handle async operation errors', async () => {
      const failingOperation = jest.fn().mockRejectedValue(new Error('Async error'));
      
      await expect(monitor.measureOperation('failing_async', failingOperation))
        .rejects.toThrow('Async error');
      
      // Verificar que se registró el error
      const metrics = monitor.getSystemMetrics();
      expect(metrics.totalOperations).toBe(1);
      expect(metrics.successfulOperations).toBe(0);
      expect(metrics.failedOperations).toBe(1);
    });

    test('should handle sync operation errors', () => {
      const failingOperation = jest.fn().mockImplementation(() => {
        throw new Error('Sync error');
      });
      
      expect(() => monitor.measureSync('failing_sync', failingOperation))
        .toThrow('Sync error');
    });
  });

  // ===================================================================
  // 📊 TESTS DE MÉTRICAS DEL SISTEMA
  // ===================================================================

  describe('Métricas del Sistema', () => {
    beforeEach(() => {
      // Crear métricas usando la API pública
      let operationCounter = 0;
      
      // Simulación de tiempo para las métricas
      mockPerformanceNow.mockImplementation(() => {
        operationCounter++;
        switch (operationCounter) {
          case 1: return 1000; // Start op1
          case 2: return 1100; // End op1 (100ms)
          case 3: return 1200; // Start op2
          case 4: return 1350; // End op2 (150ms)
          case 5: return 1400; // Start op3
          case 6: return 1450; // End op3 (50ms)
          default: return 1500;
        }
      });
      
      // Crear métricas usando la API pública
      const op1Id = monitor.startMeasurement('calculation');
      const op1Metric = monitor.endMeasurement(op1Id, true);
      
      const op2Id = monitor.startMeasurement('calculation');
      const op2Metric = monitor.endMeasurement(op2Id, true);
      
      const op3Id = monitor.startMeasurement('validation');
      const op3Metric = monitor.endMeasurement(op3Id, false, 'Validation failed');
    });

    test('should calculate system metrics correctly', () => {
      const metrics = monitor.getSystemMetrics();
      
      expect(metrics.totalOperations).toBe(3);
      expect(metrics.successfulOperations).toBe(2);
      expect(metrics.failedOperations).toBe(1);
      expect(metrics.successRate).toBeCloseTo(66.67, 1); // 2/3 * 100
      expect(metrics.averageExecutionTime).toBe(125); // (100 + 150) / 2
      expect(metrics.medianExecutionTime).toBe(150); // median of sorted [100, 150]
      // Memory usage será calculado automáticamente por el mock
    });

    test('should handle empty metrics', () => {
      const emptyMonitor = new PerformanceMonitor();
      const metrics = emptyMonitor.getSystemMetrics();
      
      expect(metrics.totalOperations).toBe(0);
      expect(metrics.successfulOperations).toBe(0);
      expect(metrics.failedOperations).toBe(0);
      expect(metrics.successRate).toBe(0);
      expect(metrics.averageExecutionTime).toBe(0);
      
      emptyMonitor.destroy();
    });

    test('should cache metrics properly', () => {
      // Primera llamada
      const metrics1 = monitor.getSystemMetrics();
      
      // Segunda llamada inmediata (debe usar cache)
      const metrics2 = monitor.getSystemMetrics();
      
      expect(metrics1).toBe(metrics2); // Misma referencia = cache hit
    });
  });

  // ===================================================================
  // 🔔 TESTS DE SISTEMA DE ALERTAS
  // ===================================================================

  describe('Sistema de Alertas', () => {
    test('should create slow operation alert', () => {
      const slowOperationId = monitor.startMeasurement('slow_operation');
      
      // Simular operación lenta (2 segundos)
      mockPerformanceNow.mockReturnValue(3000);
      
      monitor.endMeasurement(slowOperationId, true);
      
      const alerts = monitor.getActiveAlerts();
      expect(alerts).toHaveLength(1);
      expect(alerts[0].type).toBe('SLOW_OPERATION');
      expect(alerts[0].message).toContain('slow_operation');
      expect(alerts[0].severity).toBe('HIGH'); // > 2x threshold
    });

    test('should create memory leak alert', () => {
      // Mock alto uso de memoria
      mockMemoryUsage.mockReturnValue({
        rss: 200 * 1024 * 1024,
        heapTotal: 180 * 1024 * 1024,
        heapUsed: 100 * 1024 * 1024, // 100MB > 50MB threshold
        external: 20 * 1024 * 1024
      });
      
      const operationId = monitor.startMeasurement('memory_intensive');
      mockPerformanceNow.mockReturnValue(1100);
      monitor.endMeasurement(operationId, true);
      
      const alerts = monitor.getActiveAlerts();
      expect(alerts.some(alert => alert.type === 'MEMORY_LEAK')).toBe(true);
    });

    test('should acknowledge alerts', () => {
      // Crear alerta
      const operationId = monitor.startMeasurement('slow_operation');
      mockPerformanceNow.mockReturnValue(2000);
      monitor.endMeasurement(operationId, true);
      
      const alerts = monitor.getActiveAlerts();
      expect(alerts).toHaveLength(1);
      
      // Reconocer alerta
      const acknowledged = monitor.acknowledgeAlert(alerts[0].id);
      expect(acknowledged).toBe(true);
      
      // Verificar que ya no está activa
      const activeAlerts = monitor.getActiveAlerts();
      expect(activeAlerts).toHaveLength(0);
    });

    test('should not duplicate recent alerts', () => {
      // Crear múltiples operaciones lentas del mismo tipo
      for (let i = 0; i < 3; i++) {
        const operationId = monitor.startMeasurement('slow_operation');
        mockPerformanceNow.mockReturnValue(2000 + i * 100);
        monitor.endMeasurement(operationId, true);
      }
      
      // Solo debe haber una alerta (no duplicadas)
      const alerts = monitor.getActiveAlerts();
      const slowAlerts = alerts.filter(a => a.type === 'SLOW_OPERATION');
      expect(slowAlerts).toHaveLength(1);
    });
  });

  // ===================================================================
  // 📈 TESTS DE ANÁLISIS DE TENDENCIAS
  // ===================================================================

  describe('Análisis de Tendencias', () => {
    test('should calculate execution time trends', () => {
      // Simular tiempo secuencial para crear tendencias
      let timeCounter = 1000;
      mockPerformanceNow.mockImplementation(() => {
        const currentTime = timeCounter;
        timeCounter += 100; // Incrementar tiempo
        return currentTime;
      });
      
      // Crear primera mitad de métricas con tiempos buenos (100ms)
      for (let i = 0; i < 25; i++) {
        const operationId = monitor.startMeasurement('trend_test');
        timeCounter += 100; // Simular duración de 100ms
        monitor.endMeasurement(operationId, true);
      }
      
      // Crear segunda mitad de métricas con tiempos peores (200ms)
      for (let i = 0; i < 25; i++) {
        const operationId = monitor.startMeasurement('trend_test');
        timeCounter += 200; // Simular duración de 200ms
        monitor.endMeasurement(operationId, true);
      }
      
      const metrics = monitor.getSystemMetrics();
      
      // Debe detectar empeoramiento en tendencias
      expect(metrics.trends.executionTimeSlope).toBeGreaterThan(0);
    });

    test('should calculate error rate trends', () => {
      // Reset mock time
      let timeCounter = 1000;
      mockPerformanceNow.mockImplementation(() => {
        const currentTime = timeCounter;
        timeCounter += 100;
        return currentTime;
      });
      
      // Primera mitad: pocos errores (10% error rate)
      for (let i = 0; i < 25; i++) {
        const operationId = monitor.startMeasurement('error_trend_test');
        timeCounter += 100;
        monitor.endMeasurement(operationId, i % 10 !== 0); // 10% error rate
      }
      
      // Segunda mitad: más errores (33% error rate)
      for (let i = 0; i < 25; i++) {
        const operationId = monitor.startMeasurement('error_trend_test');
        timeCounter += 100;
        monitor.endMeasurement(operationId, i % 3 !== 0); // 33% error rate
      }
      
      const metrics = monitor.getSystemMetrics();
      
      // Debe detectar incremento en errores
      expect(metrics.trends.errorRateSlope).toBeGreaterThan(0);
    });
  });

  // ===================================================================
  // 📋 TESTS DE REPORTES
  // ===================================================================

  describe('Generación de Reportes', () => {
    beforeEach(() => {
      // Crear métricas usando la API pública
      let operationCounter = 0;
      
      mockPerformanceNow.mockImplementation(() => {
        operationCounter++;
        switch (operationCounter) {
          case 1: return 1000; // Start calculation
          case 2: return 1200; // End calculation (200ms)
          case 3: return 1300; // Start validation
          case 4: return 1800; // End validation (500ms)
          default: return 1900;
        }
      });
      
      // Crear métricas: una exitosa y una fallida
      const calcId = monitor.startMeasurement('calculation');
      monitor.endMeasurement(calcId, true);
      
      const validId = monitor.startMeasurement('validation');
      monitor.endMeasurement(validId, false, 'Validation timeout');
    });

    test('should generate performance report', () => {
      const report = monitor.generateReport();
      
      expect(report.generatedAt).toBeInstanceOf(Date);
      expect(report.timeWindow).toBeDefined();
      expect(report.summary).toBeDefined();
      expect(report.alerts).toBeDefined();
      expect(report.slowestOperations).toBeDefined();
      expect(report.errorProneOperations).toBeDefined();
      expect(report.recommendations).toBeDefined();
      
      // Verificar operaciones más lentas
      expect(report.slowestOperations).toHaveLength(1); // Solo la exitosa
      expect(report.slowestOperations[0].operationType).toBe('calculation');
      
      // Verificar operaciones con errores
      expect(report.errorProneOperations).toHaveLength(1);
      expect(report.errorProneOperations[0].operation).toBe('validation');
      expect(report.errorProneOperations[0].errorRate).toBe(100);
    });

    test('should generate report for specific time window', () => {
      const start = new Date(Date.now() - 30 * 60 * 1000); // 30 minutos atrás
      const end = new Date();
      
      const report = monitor.generateReport({ start, end });
      
      expect(report.timeWindow.start).toBe(start);
      expect(report.timeWindow.end).toBe(end);
    });

    test('should generate recommendations', () => {
      const report = monitor.generateReport();
      
      expect(report.recommendations).toBeDefined();
      expect(report.recommendations.length).toBeGreaterThan(0);
      
      // Debe recomendar sobre la tasa de éxito baja
      const successRateRecommendation = report.recommendations.find(r => 
        r.includes('Tasa de éxito baja')
      );
      expect(successRateRecommendation).toBeDefined();
    });
  });

  // ===================================================================
  // ⚙️ TESTS DE CONFIGURACIÓN
  // ===================================================================

  describe('Configuración del Monitor', () => {
    test('should use custom configuration', () => {
      const customConfig: PerformanceConfig = {
        maxMetricsHistory: 500,
        alertThresholds: {
          slowOperationMs: 2000,
          highErrorRatePercent: 20,
          memoryLeakMB: 100,
          cpuUsagePercent: 90
        },
        enableRealTimeAlerts: false,
        enableTrendAnalysis: false,
        reportInterval: 30000,
        retentionDays: 3
      };
      
      const customMonitor = new PerformanceMonitor(customConfig);
      
      // Verificar que no se crean alertas en tiempo real
      const operationId = customMonitor.startMeasurement('test_operation');
      mockPerformanceNow.mockReturnValue(5000); // 4 segundos
      customMonitor.endMeasurement(operationId, true);
      
      const alerts = customMonitor.getActiveAlerts();
      expect(alerts).toHaveLength(0); // No alertas porque está deshabilitado
      
      customMonitor.destroy();
    });

    test('should limit metrics history', () => {
      const limitedConfig: PerformanceConfig = {
        maxMetricsHistory: 5,
        alertThresholds: {
          slowOperationMs: 1000,
          highErrorRatePercent: 10,
          memoryLeakMB: 50,
          cpuUsagePercent: 80
        },
        enableRealTimeAlerts: true,
        enableTrendAnalysis: true,
        reportInterval: 60000,
        retentionDays: 7
      };
      
      const limitedMonitor = new PerformanceMonitor(limitedConfig);
      
      // Agregar más métricas que el límite
      for (let i = 0; i < 10; i++) {
        const operationId = limitedMonitor.startMeasurement(`operation_${i}`);
        mockPerformanceNow.mockReturnValue(1000 + i * 100);
        limitedMonitor.endMeasurement(operationId, true);
      }
      
      const metrics = limitedMonitor.getSystemMetrics();
      // Debe haber menos métricas que las agregadas debido al límite
      expect(metrics.totalOperations).toBeLessThanOrEqual(5);
      
      limitedMonitor.destroy();
    });
  });

  // ===================================================================
  // 🔧 TESTS DE FUNCIONES PÚBLICAS
  // ===================================================================

  describe('Funciones Públicas', () => {
    test('should get singleton instance', () => {
      const instance1 = getPerformanceMonitor();
      const instance2 = getPerformanceMonitor();
      
      expect(instance1).toBe(instance2); // Same instance
    });

    test('should measure async with convenience function', async () => {
      const asyncOp = jest.fn().mockResolvedValue('result');
      
      // Mock time progression
      let callCount = 0;
      mockPerformanceNow.mockImplementation(() => {
        callCount++;
        return callCount === 1 ? 1000 : 1150;
      });
      
      const result = await measureAsync('convenience_async', asyncOp);
      
      expect(result).toBe('result');
      expect(asyncOp).toHaveBeenCalled();
      
      const metrics = getQuickMetrics();
      expect(metrics.totalOperations).toBeGreaterThan(0);
    });

    test('should measure sync with convenience function', () => {
      const syncOp = jest.fn().mockReturnValue('sync_result');
      
      let callCount = 0;
      mockPerformanceNow.mockImplementation(() => {
        callCount++;
        return callCount === 1 ? 1000 : 1080;
      });
      
      const result = measureSync('convenience_sync', syncOp);
      
      expect(result).toBe('sync_result');
      expect(syncOp).toHaveBeenCalled();
    });

    test('should create manual alert', () => {
      // Usar la función pública createManualAlert
      createManualAlert('ANOMALY', 'Manual test alert', 'HIGH');
      
      const alerts = getPerformanceMonitor().getActiveAlerts();
      expect(alerts).toHaveLength(1);
      expect(alerts[0].type).toBe('ANOMALY');
      expect(alerts[0].message).toBe('Manual test alert');
      expect(alerts[0].severity).toBe('HIGH');
    });

    test('should get quick metrics', () => {
      const metrics = getQuickMetrics();
      
      expect(metrics).toBeDefined();
      expect(typeof metrics.totalOperations).toBe('number');
      expect(typeof metrics.successRate).toBe('number');
    });
  });

  // ===================================================================
  // 🎯 TESTS DE DECORATOR
  // ===================================================================

  describe('Decorator de Medición', () => {
    class TestClass {
      @measured('test_method')
      async testMethod(value: string): Promise<string> {
        return `processed_${value}`;
      }
      
      @measured('sync_method')
      syncMethod(value: number): number {
        return value * 2;
      }
    }

    test('should measure decorated async method', async () => {
      const instance = new TestClass();
      
      // Mock time progression
      let callCount = 0;
      mockPerformanceNow.mockImplementation(() => {
        callCount++;
        return callCount === 1 ? 1000 : 1120;
      });
      
      const result = await instance.testMethod('test');
      
      expect(result).toBe('processed_test');
      
      const metrics = getQuickMetrics();
      expect(metrics.totalOperations).toBeGreaterThan(0);
    });

    test('should measure decorated sync method', () => {
      const instance = new TestClass();
      
      let callCount = 0;
      mockPerformanceNow.mockImplementation(() => {
        callCount++;
        return callCount === 1 ? 1000 : 1090;
      });
      
      const result = instance.syncMethod(5);
      
      expect(result).toBe(10);
      
      const metrics = getQuickMetrics();
      expect(metrics.totalOperations).toBeGreaterThan(0);
    });
  });

  // ===================================================================
  // 🧹 TESTS DE LIMPIEZA
  // ===================================================================

  describe('Limpieza de Recursos', () => {
    test('should cleanup old metrics', () => {
      // Mock Date.now para simular tiempo pasado
      const originalDateNow = Date.now;
      const mockDateNow = jest.fn();
      Date.now = mockDateNow;
      
      // Tiempo actual
      mockDateNow.mockReturnValue(1000000);
      
      // Crear métrica "antigua"
      const oldMetric: PerformanceMetric = {
        operationId: 'old_op',
        operationType: 'old_operation',
        startTime: 1000,
        endTime: 2000,
        duration: 1000,
        success: true
      };
      
      const monitorWithPrivates = monitor as typeof monitor & {
        addMetric: (metric: PerformanceMetric) => void;
      };
      
      monitorWithPrivates.addMetric(oldMetric);
      
      // Simular tiempo futuro (más de 7 días)
      mockDateNow.mockReturnValue(1000000 + 8 * 24 * 60 * 60 * 1000);
      
      // Ejecutar limpieza (normalmente se ejecuta cada 24 horas)
      jest.advanceTimersByTime(24 * 60 * 60 * 1000);
      
      // Restaurar Date.now
      Date.now = originalDateNow;
    });

    test('should destroy monitor properly', () => {
      const testMonitor = new PerformanceMonitor();
      
      // Agregar algunas métricas
      const operationId = testMonitor.startMeasurement('test_operation');
      mockPerformanceNow.mockReturnValue(1100);
      testMonitor.endMeasurement(operationId, true);
      
      // Verificar que tiene métricas
      const metricsBefore = testMonitor.getSystemMetrics();
      expect(metricsBefore.totalOperations).toBeGreaterThan(0);
      
      // Destruir
      testMonitor.destroy();
      
      // Verificar limpieza
      const metricsAfter = testMonitor.getSystemMetrics();
      expect(metricsAfter.totalOperations).toBe(0);
    });
  });

  // ===================================================================
  // 🔍 TESTS DE EDGE CASES
  // ===================================================================

  describe('Edge Cases', () => {
    test('should handle missing memory usage gracefully', () => {
      // Mock process.memoryUsage to be undefined
      const originalProcess = (global as { process?: unknown }).process;
      (global as { process?: unknown }).process = undefined;
      
      const operationId = monitor.startMeasurement('no_memory_test');
      mockPerformanceNow.mockReturnValue(1100);
      const metric = monitor.endMeasurement(operationId, true);
      
      expect(metric.memoryUsage).toBeUndefined();
      
      // Restore original process
      (global as { process?: unknown }).process = originalProcess;
    });

    test('should handle very large number of operations', () => {
      // Crear muchas operaciones
      for (let i = 0; i < 1000; i++) {
        const operationId = monitor.startMeasurement(`bulk_op_${i}`);
        mockPerformanceNow.mockReturnValue(1000 + i);
        monitor.endMeasurement(operationId, true);
      }
      
      const metrics = monitor.getSystemMetrics();
      expect(metrics.totalOperations).toBeGreaterThan(0);
      expect(metrics.totalOperations).toBeLessThanOrEqual(1000);
    });

    test('should handle operations with zero duration', () => {
      const operationId = monitor.startMeasurement('zero_duration');
      // No cambiar tiempo = 0 duración
      const metric = monitor.endMeasurement(operationId, true);
      
      expect(metric.duration).toBe(0);
      expect(metric.success).toBe(true);
    });

    test('should handle empty operation type', () => {
      const operationId = monitor.startMeasurement('');
      mockPerformanceNow.mockReturnValue(1050);
      const metric = monitor.endMeasurement(operationId, true);
      
      expect(metric.operationType).toBe('');
      expect(metric.duration).toBe(50);
    });
  });
});

// ===================================================================
// 🔧 TESTS DE INTEGRACIÓN
// ===================================================================

describe('PerformanceMonitor Integration', () => {
  beforeEach(() => {
    jest.clearAllTimers();
  });

  afterEach(() => {
    const monitor = getPerformanceMonitor();
    monitor.destroy();
  });

  test('should integrate with real operations', async () => {
    const monitor = getPerformanceMonitor();
    
    // Simular operaciones reales
    const calculateSomething = async (input: number): Promise<number> => {
      await new Promise(resolve => setTimeout(resolve, 10));
      return input * 2;
    };
    
    const result = await monitor.measureOperation(
      'real_calculation',
      () => calculateSomething(5),
      { operationType: 'calculation' }
    );
    
    expect(result).toBe(10);
    
    const metrics = monitor.getSystemMetrics();
    expect(metrics.totalOperations).toBeGreaterThan(0);
  });

  test('should handle concurrent operations', async () => {
    const monitor = getPerformanceMonitor();
    
    // Crear múltiples operaciones concurrentes
    const operations = Array.from({ length: 5 }, (_, i) => 
      monitor.measureOperation(
        `concurrent_op_${i}`,
        () => Promise.resolve(i * 10),
        { operationType: 'concurrent' }
      )
    );
    
    const results = await Promise.all(operations);
    
    expect(results).toEqual([0, 10, 20, 30, 40]);
    
    const metrics = monitor.getSystemMetrics();
    expect(metrics.totalOperations).toBe(5);
  });

  test('should maintain performance under load', async () => {
    const monitor = getPerformanceMonitor();
    
    // Crear muchas operaciones rápidas
    const startTime = Date.now();
    
    const operations = Array.from({ length: 100 }, (_, i) => 
      monitor.measureOperation(
        `load_test_${i}`,
        () => Promise.resolve(i),
        { operationType: 'load_test' }
      )
    );
    
    await Promise.all(operations);
    
    const endTime = Date.now();
    const totalTime = endTime - startTime;
    
    // El overhead del monitoreo debe ser mínimo
    expect(totalTime).toBeLessThan(1000); // Menos de 1 segundo para 100 operaciones
    
    const metrics = monitor.getSystemMetrics();
    expect(metrics.totalOperations).toBe(100);
  });
});
