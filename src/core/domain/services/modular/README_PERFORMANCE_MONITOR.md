# 📊 PERFORMANCE MONITOR - DOCUMENTACIÓN TÉCNICA

## 🎯 Descripción General

**PerformanceMonitor** es el sistema centralizado de métricas y observabilidad que extrae y centraliza el logging embebido en el monolito para crear observabilidad completa del sistema de fertilidad.

## ✨ Características Principales

### 📏 Medición de Performance
- **Medición Manual**: Control total sobre inicio/fin de operaciones
- **Medición Automática**: Decorators y funciones wrapper para medición transparente
- **Medición Asíncrona/Síncrona**: Soporte completo para ambos tipos de operaciones
- **Contexto Rico**: Metadata detallada para cada operación

### 📊 Métricas Avanzadas
- **Métricas de Tiempo**: Promedio, mediana, percentiles (P95, P99)
- **Métricas de Recursos**: Memoria, CPU (preparado para expansión)
- **Métricas por Operación**: Estadísticas individuales por tipo
- **Análisis de Tendencias**: Detección de degradación de performance

### 🔔 Sistema de Alertas
- **Alertas en Tiempo Real**: Detección inmediata de problemas
- **Múltiples Tipos**: Operaciones lentas, memory leaks, alta tasa de errores
- **Severidades**: LOW, MEDIUM, HIGH, CRITICAL
- **Anti-Spam**: Prevención de alertas duplicadas

### 📈 Reportes y Análisis
- **Reportes Automáticos**: Generación periódica de reportes
- **Análisis de Ventanas**: Métricas para períodos específicos
- **Recomendaciones**: Sugerencias automáticas de optimización
- **Limpieza Automática**: Gestión automática de retención de datos

## 🔧 Uso Básico

### Importación
```typescript
import {
  PerformanceMonitor,
  getPerformanceMonitor,
  measured,
  measureAsync,
  measureSync,
  getQuickMetrics,
  createManualAlert
} from './PerformanceMonitor';
```

### Medición Manual
```typescript
const monitor = getPerformanceMonitor();

// Iniciar medición
const measurementId = monitor.startMeasurement('calculation_operation', {
  userId: 'user123',
  operationType: 'fertility_calculation'
});

// ... ejecutar operación ...

// Finalizar medición
const metric = monitor.endMeasurement(measurementId, true);
console.log(`Operación completada en ${metric.duration}ms`);
```

### Medición Automática
```typescript
// Función asíncrona
const result = await measureAsync('api_call', async () => {
  return await fetch('/api/data');
}, { userId: 'user123' });

// Función síncrona
const result = measureSync('calculation', () => {
  return complexCalculation(data);
});
```

## 🎨 Decorators y Patrones Avanzados

### Decorator para Clases
```typescript
class CalculationService {
  @measured('fertility_calculation')
  async calculateFertility(input: UserInput): Promise<EvaluationState> {
    // Lógica de cálculo
    return evaluationResult;
  }
  
  @measured('validation')
  validateInput(input: UserInput): boolean {
    // Lógica de validación
    return isValid;
  }
}
```

### Medición con Contexto Rico
```typescript
const context = {
  userId: 'user123',
  sessionId: 'session456',
  operationType: 'predictive_analysis',
  metadata: {
    inputComplexity: 'high',
    cacheEnabled: true,
    engineType: 'premium'
  }
};

const result = await monitor.measureOperation(
  'predictive_analysis',
  () => runPredictiveAnalysis(input),
  context
);
```

## 📊 Obtención de Métricas

### Métricas Rápidas
```typescript
const metrics = getQuickMetrics();
console.log(`Total operaciones: ${metrics.totalOperations}`);
console.log(`Tasa de éxito: ${metrics.successRate.toFixed(2)}%`);
console.log(`Tiempo promedio: ${metrics.averageExecutionTime.toFixed(2)}ms`);
```

### Métricas Detalladas
```typescript
const monitor = getPerformanceMonitor();
const systemMetrics = monitor.getSystemMetrics();

// Análisis por operación
Object.entries(systemMetrics.operationMetrics).forEach(([operation, stats]) => {
  console.log(`${operation}: ${stats.count} ops, ${stats.averageTime.toFixed(2)}ms avg`);
});

// Análisis de tendencias
const trends = systemMetrics.trends;
if (trends.executionTimeSlope > 50) {
  console.warn('⚠️ Degradación de performance detectada');
}
```

## 🔔 Gestión de Alertas

### Alertas Automáticas
```typescript
// Las alertas se generan automáticamente basadas en la configuración
const alerts = monitor.getActiveAlerts();

alerts.forEach(alert => {
  console.log(`🚨 ${alert.severity}: ${alert.message}`);
  
  if (alert.severity === 'CRITICAL') {
    // Notificar al equipo de desarrollo
    notifyDevelopmentTeam(alert);
  }
});
```

### Alertas Manuales
```typescript
// Crear alerta personalizada
createManualAlert('ANOMALY', 'Comportamiento anómalo detectado', 'HIGH');

// Reconocer alerta
const acknowledged = monitor.acknowledgeAlert(alert.id);
```

## 📈 Reportes y Análisis

### Reporte Automático
```typescript
const report = monitor.generateReport();

console.log('=== REPORTE DE PERFORMANCE ===');
console.log(`Período: ${report.timeWindow.start} - ${report.timeWindow.end}`);
console.log(`Operaciones: ${report.summary.totalOperations}`);
console.log(`Éxito: ${report.summary.successRate.toFixed(2)}%`);
console.log(`Tiempo promedio: ${report.summary.averageExecutionTime.toFixed(2)}ms`);

// Operaciones más lentas
console.log('\n🐌 Operaciones más lentas:');
report.slowestOperations.forEach(op => {
  console.log(`  ${op.operationType}: ${op.duration.toFixed(2)}ms`);
});

// Recomendaciones
console.log('\n💡 Recomendaciones:');
report.recommendations.forEach(rec => {
  console.log(`  - ${rec}`);
});
```

### Reporte para Ventana Específica
```typescript
const startTime = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 horas atrás
const endTime = new Date();

const report = monitor.generateReport({ start: startTime, end: endTime });
```

## ⚙️ Configuración

### Configuración Básica
```typescript
const config = {
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
};

const monitor = new PerformanceMonitor(config);
```

### Configuración por Entorno
```typescript
const developmentConfig = {
  maxMetricsHistory: 2000,
  alertThresholds: {
    slowOperationMs: 500,  // Más estricto en desarrollo
    highErrorRatePercent: 5,
    memoryLeakMB: 30,
    cpuUsagePercent: 70
  },
  enableRealTimeAlerts: true,
  enableTrendAnalysis: true,
  reportInterval: 30000, // 30 segundos
  retentionDays: 3
};

const productionConfig = {
  maxMetricsHistory: 500,
  alertThresholds: {
    slowOperationMs: 2000,  // Más permisivo en producción
    highErrorRatePercent: 15,
    memoryLeakMB: 100,
    cpuUsagePercent: 85
  },
  enableRealTimeAlerts: true,
  enableTrendAnalysis: false, // Menos overhead
  reportInterval: 5 * 60 * 1000, // 5 minutos
  retentionDays: 14
};
```

## 🔍 Casos de Uso Avanzados

### 1. Monitoreo de Operaciones Críticas
```typescript
class FertilityCalculationService {
  @measured('fertility_calculation')
  async calculateFertility(input: UserInput): Promise<EvaluationState> {
    const monitor = getPerformanceMonitor();
    
    // Medición específica de validación
    const validationResult = await monitor.measureOperation(
      'input_validation',
      () => this.validateInput(input),
      { operationType: 'validation', userId: input.userId }
    );
    
    // Medición de cálculo principal
    const calculationResult = await monitor.measureOperation(
      'main_calculation',
      () => this.performCalculation(input),
      { operationType: 'calculation', metadata: { complexity: 'high' } }
    );
    
    return calculationResult;
  }
}
```

### 2. Análisis de Performance por Usuario
```typescript
const analyzeUserPerformance = (userId: string) => {
  const report = monitor.generateReport();
  
  // Filtrar métricas por usuario
  const userMetrics = report.slowestOperations.filter(op => 
    op.metadata?.userId === userId
  );
  
  const avgUserTime = userMetrics.reduce((sum, op) => sum + op.duration, 0) / userMetrics.length;
  
  console.log(`Usuario ${userId}: ${avgUserTime.toFixed(2)}ms promedio`);
  
  return {
    userId,
    averageTime: avgUserTime,
    operationCount: userMetrics.length,
    slowestOperation: userMetrics[0]
  };
};
```

### 3. Detección de Anomalías
```typescript
const detectAnomalies = () => {
  const metrics = getQuickMetrics();
  const alerts = [];
  
  // Detectar operaciones anómalamente lentas
  Object.entries(metrics.operationMetrics).forEach(([operation, stats]) => {
    if (stats.averageTime > stats.averageTime * 1.5) { // 50% más lento que usual
      alerts.push({
        type: 'ANOMALY',
        message: `Operación ${operation} anómalamente lenta`,
        severity: 'MEDIUM'
      });
    }
  });
  
  // Detectar degradación de tendencias
  if (metrics.trends.executionTimeSlope > 100) {
    alerts.push({
      type: 'ANOMALY',
      message: 'Degradación significativa de performance',
      severity: 'HIGH'
    });
  }
  
  return alerts;
};
```

### 4. Optimización Automática
```typescript
const autoOptimize = () => {
  const report = monitor.generateReport();
  
  // Identificar operaciones que necesitan optimización
  const slowOperations = report.slowestOperations.filter(op => 
    op.duration > 1000 && op.success
  );
  
  // Aplicar optimizaciones automáticas
  slowOperations.forEach(op => {
    if (op.operationType === 'calculation') {
      // Activar cache para cálculos lentos
      enableCacheForOperation(op.operationType);
    }
    
    if (op.operationType === 'validation') {
      // Optimizar validación
      optimizeValidation(op.operationType);
    }
  });
  
  console.log(`Optimizaciones aplicadas a ${slowOperations.length} operaciones`);
};
```

## 📊 Integración con Dashboards

### Datos para Dashboard
```typescript
const getDashboardData = () => {
  const metrics = getQuickMetrics();
  const alerts = monitor.getActiveAlerts();
  
  return {
    overview: {
      totalOperations: metrics.totalOperations,
      successRate: metrics.successRate,
      averageTime: metrics.averageExecutionTime,
      peakMemory: metrics.peakMemoryUsage
    },
    alerts: alerts.map(alert => ({
      id: alert.id,
      type: alert.type,
      severity: alert.severity,
      message: alert.message,
      timestamp: new Date(alert.timestamp)
    })),
    trends: {
      performance: metrics.trends.executionTimeSlope,
      errors: metrics.trends.errorRateSlope,
      memory: metrics.trends.memoryUsageSlope
    },
    topOperations: Object.entries(metrics.operationMetrics)
      .sort(([,a], [,b]) => b.count - a.count)
      .slice(0, 10)
      .map(([name, stats]) => ({
        name,
        count: stats.count,
        averageTime: stats.averageTime,
        successRate: stats.successRate
      }))
  };
};
```

### Métricas en Tiempo Real
```typescript
const subscribeToMetrics = (callback: (data: any) => void) => {
  const interval = setInterval(() => {
    const data = getDashboardData();
    callback(data);
  }, 5000); // Actualizar cada 5 segundos
  
  return () => clearInterval(interval);
};
```

## 🛠️ Troubleshooting

### Problemas Comunes

#### 1. Performance Degradado
```typescript
// Verificar métricas
const metrics = getQuickMetrics();
if (metrics.averageExecutionTime > 1000) {
  console.warn('⚠️ Performance degradado');
  
  // Analizar operaciones más lentas
  const report = monitor.generateReport();
  console.log('Top 5 operaciones más lentas:');
  report.slowestOperations.slice(0, 5).forEach(op => {
    console.log(`  ${op.operationType}: ${op.duration.toFixed(2)}ms`);
  });
}
```

#### 2. Alertas Excesivas
```typescript
// Ajustar thresholds
const config = {
  alertThresholds: {
    slowOperationMs: 2000,    // Incrementar threshold
    highErrorRatePercent: 15, // Ser más permisivo
    memoryLeakMB: 100,
    cpuUsagePercent: 90
  }
};

const monitor = new PerformanceMonitor(config);
```

#### 3. Memoria Insuficiente
```typescript
// Reducir historial de métricas
const config = {
  maxMetricsHistory: 500,  // Reducir de 1000 a 500
  retentionDays: 3        // Reducir retención
};
```

### Debugging
```typescript
// Habilitar logging detallado
const monitor = new PerformanceMonitor({
  ...config,
  enableRealTimeAlerts: true
});

// Monitorear alertas
monitor.getActiveAlerts().forEach(alert => {
  console.log(`🔍 Alert: ${alert.type} - ${alert.message}`);
});
```

## 🧪 Testing

### Test de Integración
```typescript
describe('PerformanceMonitor Integration', () => {
  test('should measure real operations', async () => {
    const monitor = getPerformanceMonitor();
    
    const result = await monitor.measureOperation(
      'test_operation',
      () => Promise.resolve('test_result')
    );
    
    expect(result).toBe('test_result');
    
    const metrics = monitor.getSystemMetrics();
    expect(metrics.totalOperations).toBeGreaterThan(0);
  });
});
```

### Test de Performance
```typescript
test('should handle high load', async () => {
  const monitor = getPerformanceMonitor();
  
  // Crear 1000 operaciones concurrentes
  const operations = Array.from({ length: 1000 }, (_, i) => 
    monitor.measureOperation(`load_test_${i}`, () => Promise.resolve(i))
  );
  
  const startTime = Date.now();
  await Promise.all(operations);
  const endTime = Date.now();
  
  const totalTime = endTime - startTime;
  expect(totalTime).toBeLessThan(5000); // Menos de 5 segundos
});
```

## 🎯 Mejores Prácticas

### 1. Naming Conventions
```typescript
// ✅ Bueno: Descriptivo y consistente
monitor.measureOperation('fertility_calculation_premium');
monitor.measureOperation('input_validation_clinical');
monitor.measureOperation('report_generation_pdf');

// ❌ Evitar: Genérico o inconsistente
monitor.measureOperation('operation');
monitor.measureOperation('calc');
monitor.measureOperation('DoSomething');
```

### 2. Contexto Rico
```typescript
// ✅ Bueno: Contexto detallado
const context = {
  userId: 'user123',
  operationType: 'calculation',
  metadata: {
    inputComplexity: 'high',
    cacheEnabled: true,
    engineType: 'premium'
  }
};
```

### 3. Gestión de Errores
```typescript
// ✅ Bueno: Manejo explícito de errores
const measurementId = monitor.startMeasurement('risky_operation');
try {
  const result = await riskyOperation();
  monitor.endMeasurement(measurementId, true);
  return result;
} catch (error) {
  monitor.endMeasurement(measurementId, false, error.message);
  throw error;
}
```

### 4. Cleanup
```typescript
// ✅ Bueno: Limpieza explícita
const monitor = new PerformanceMonitor();

// Al terminar la aplicación
process.on('SIGINT', () => {
  monitor.destroy();
  process.exit(0);
});
```

## 🔗 Integración con Otros Sistemas

### Con Logger
```typescript
const logger = require('./logger');

const monitor = new PerformanceMonitor({
  ...config,
  onAlert: (alert) => {
    logger.warn(`Performance Alert: ${alert.message}`);
  }
});
```

### Con Métricas Externas
```typescript
const sendToExternalMonitoring = (metrics: SystemMetrics) => {
  // Enviar a sistemas como Prometheus, New Relic, etc.
  externalMonitoring.send({
    timestamp: Date.now(),
    metrics: {
      operations_total: metrics.totalOperations,
      success_rate: metrics.successRate,
      avg_duration: metrics.averageExecutionTime
    }
  });
};

// Configurar envío periódico
setInterval(() => {
  const metrics = getQuickMetrics();
  sendToExternalMonitoring(metrics);
}, 60000); // Cada minuto
```

## 📊 Métricas Disponibles

### Métricas Básicas
- `totalOperations`: Número total de operaciones
- `successfulOperations`: Operaciones exitosas
- `failedOperations`: Operaciones fallidas
- `successRate`: Tasa de éxito (%)

### Métricas de Tiempo
- `averageExecutionTime`: Tiempo promedio de ejecución
- `medianExecutionTime`: Tiempo mediano
- `p95ExecutionTime`: Percentil 95
- `p99ExecutionTime`: Percentil 99

### Métricas de Recursos
- `totalMemoryUsage`: Uso total de memoria
- `peakMemoryUsage`: Pico de memoria
- `averageCpuUsage`: Uso promedio de CPU

### Métricas de Tendencias
- `executionTimeSlope`: Tendencia de tiempo de ejecución
- `errorRateSlope`: Tendencia de tasa de errores
- `memoryUsageSlope`: Tendencia de uso de memoria

## 🔄 Lifecycle

### Inicialización
```typescript
const monitor = new PerformanceMonitor(config);
// Automáticamente inicia reportes y limpieza
```

### Operación
```typescript
// Medición continua de operaciones
// Generación automática de alertas
// Reportes periódicos
```

### Limpieza
```typescript
monitor.destroy();
// Limpia timers, métricas y recursos
```

---

## 📞 Soporte Técnico

Para problemas o dudas:
1. Verificar configuración de thresholds
2. Revisar logs de console para alertas
3. Consultar métricas con `getQuickMetrics()`
4. Verificar integración con otros módulos

**¡El PerformanceMonitor está optimizado para máxima observabilidad con mínimo overhead! 📊**
