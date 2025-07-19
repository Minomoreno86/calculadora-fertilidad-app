/**
 * 📚 DOCUMENTACIÓN API COMPLETA - MOTOR UNIFICADO Y PROFILING
 * 
 * Documentación técnica completa del motor unificado, sistema de profiling
 * y guías de migración para desarrolladores.
 */

# 🚀 Calculadora de Fertilidad - Documentación API V2.0

## 📋 Tabla de Contenidos

1. [Motor Unificado](#motor-unificado)
2. [Sistema de Profiling](#sistema-de-profiling)
3. [Dashboard de Métricas](#dashboard-de-métricas)
4. [Guía de Migración](#guía-de-migración)
5. [API Reference](#api-reference)
6. [Ejemplos de Uso](#ejemplos-de-uso)

---

## 🎯 Motor Unificado

### Descripción
El Motor Unificado V2.0 combina las capacidades de los motores básico y premium en una sola interfaz inteligente que selecciona automáticamente el motor óptimo basado en la complejidad del input.

### Arquitectura

```typescript
// Core Engine Interface
interface UnifiedEngineInterface {
  calculateProbabilityUnified(
    input: UserInputData, 
    mode: 'standard' | 'premium' | 'auto'
  ): Promise<ProbabilityResult>;
  
  analyzeInputComplexity(input: UserInputData): number;
  decideEngine(complexityScore: number): 'standard' | 'premium';
}
```

### Algoritmo de Selección

El motor utiliza un algoritmo de análisis de complejidad que evalúa:

- **Factores de Edad (20%)**: Edad materna, paternal
- **Factores Hormonales (25%)**: FSH, LH, AMH, E2, etc.
- **Factores Anatómicos (25%)**: Condiciones uterinas, tubáricas
- **Factores Masculinos (15%)**: Análisis seminal
- **Interacciones (15%)**: Combinaciones complejas

```typescript
// Ejemplo de cálculo de complejidad
const complexityScore = 
  (ageFactors * 0.20) +
  (hormonalFactors * 0.25) +
  (anatomicalFactors * 0.25) +
  (masculineFactors * 0.15) +
  (interactions * 0.15);

// Threshold: 0.4 - Si score >= 0.4, usar motor premium
```

### Beneficios

- ✅ **Rendimiento Optimizado**: Selección inteligente reduce overhead innecesario
- ✅ **Precisión Mantenida**: Motor premium para casos complejos
- ✅ **Compatibilidad**: Backward compatible con APIs existentes
- ✅ **Métricas Integradas**: Tracking automático de performance

---

## 📊 Sistema de Profiling

### ProductionProfiler

Clase principal para monitoreo de métricas en tiempo real.

```typescript
import { productionProfiler } from '@/core/monitoring/ProductionProfiler';

// Configurar sampling rate
productionProfiler.setSamplingRate(0.1); // 10% en producción

// Obtener métricas
const metrics = productionProfiler.getMetrics();
const alerts = productionProfiler.getActiveAlerts();
const suggestions = productionProfiler.getOptimizationSuggestions();
```

### Métricas Capturadas

#### Motor Unificado
- Total de cálculos realizados
- Distribución de uso de motores (standard/premium/auto)
- Tiempos promedio de ejecución
- Análisis de complejidad (distribución de scores)

#### IA Predictiva
- Total de predicciones
- Tasa de precisión
- Uso de motores en predicciones IA
- Tiempo promedio de predicción
- Confianza del modelo

#### Validación Paralela
- Total de validaciones
- Ganancia de paralelización
- Cache hit rate
- Categorías procesadas

#### Sistema
- Uso de memoria
- Eficiencia de cache
- Tasa de errores
- Porcentaje de uptime

### Alertas Automáticas

El sistema genera alertas basadas en thresholds configurables:

```typescript
// Thresholds predefinidos
const THRESHOLDS = {
  executionTimeWarn: 100,     // ms
  executionTimeCritical: 500, // ms
  memoryUsageWarn: 100 * 1024 * 1024,  // 100MB
  errorRateWarn: 0.05,        // 5%
  cacheHitRateWarn: 0.6       // 60%
};
```

---

## 📈 Dashboard de Métricas

### MetricsDashboard Component

Componente React que proporciona visualización en tiempo real de métricas.

```typescript
import { MetricsDashboard } from '@/components/dashboard/MetricsDashboard';

<MetricsDashboard
  onAlertPress={(alert) => handleAlert(alert)}
  onSuggestionPress={(suggestion) => handleSuggestion(suggestion)}
  refreshInterval={30000} // 30 segundos
/>
```

### Características

- 📊 **Gráficos Interactivos**: Distribución de motores, tiempos de ejecución
- 🚨 **Alertas en Tiempo Real**: Notificaciones de performance crítico
- 💡 **Sugerencias de Optimización**: Recomendaciones automáticas
- 🔄 **Auto-refresh**: Actualización automática de métricas
- 📱 **Responsive Design**: Optimizado para móviles

---

## 🔄 Guía de Migración

### Desde Motor Dual al Motor Unificado

#### Paso 1: Actualizar Imports

```typescript
// ANTES
import { calculateProbability } from '@/core/use-cases/calculationEngine';
import { calculateProbabilityPremium } from '@/core/use-cases/calculationEnginePremium';

// DESPUÉS
import { calculateProbabilityUnified } from '@/core/use-cases/calculationEngineUnified';
```

#### Paso 2: Simplificar Llamadas

```typescript
// ANTES
const useComplexCalculation = input.complexity > threshold;
const result = useComplexCalculation 
  ? await calculateProbabilityPremium(input)
  : await calculateProbability(input);

// DESPUÉS
const result = await calculateProbabilityUnified(input, 'auto');
```

#### Paso 3: Integrar Profiling

```typescript
// Con profiling integrado
import { calculateWithProfiling } from '@/core/integration/ProfilerIntegrationSimple';

const result = await calculateWithProfiling(
  input,
  calculateProbabilityUnified,
  'auto'
);
```

### Migración de Componentes

#### useFertilitySimulator

```typescript
// ANTES
const { basic, premium } = useEngineSelector(input);
const result = complex ? premium(input) : basic(input);

// DESPUÉS
const result = await calculateProbabilityUnified(input, 'auto');
```

#### predictiveEngine

```typescript
// ANTES
private async executeBaseCalculation(input: UserInputData): Promise<ProbabilityResult> {
  return this.shouldUsePremium(input)
    ? calculateProbabilityPremium(input)
    : calculateProbability(input);
}

// DESPUÉS
private async executeBaseCalculation(input: UserInputData): Promise<ProbabilityResult> {
  return calculateProbabilityUnified(input, 'auto');
}
```

---

## 📚 API Reference

### calculateProbabilityUnified

```typescript
function calculateProbabilityUnified(
  input: UserInputData,
  mode: 'standard' | 'premium' | 'auto' = 'auto'
): Promise<ProbabilityResult>
```

**Parámetros:**
- `input`: Datos de entrada del usuario
- `mode`: Modo de operación
  - `'standard'`: Fuerza uso del motor básico
  - `'premium'`: Fuerza uso del motor premium
  - `'auto'`: Selección automática basada en complejidad

**Retorna:**
```typescript
interface ProbabilityResult {
  probability: number;
  details: CalculationDetails;
  engineMetrics: {
    engineUsed: 'standard' | 'premium';
    executionTime: number;
    complexity: number;
    timestamp: number;
  };
}
```

### analyzeInputComplexity

```typescript
function analyzeInputComplexity(input: UserInputData): number
```

Analiza la complejidad del input y retorna un score de 0-1.

### ProductionProfiler Methods

```typescript
class ProductionProfiler {
  // Registrar métricas
  recordUnifiedEngineMetric(data: UnifiedEngineMetric): void;
  recordPredictiveAIMetric(data: PredictiveAIMetric): void;
  recordParallelValidationMetric(data: ParallelValidationMetric): void;
  recordSimulatorMetric(data: SimulatorMetric): void;
  
  // Obtener datos
  getMetrics(): ProductionMetrics;
  getActiveAlerts(): PerformanceAlert[];
  getOptimizationSuggestions(): OptimizationSuggestion[];
  
  // Configuración
  setSamplingRate(rate: number): void;
}
```

---

## 💡 Ejemplos de Uso

### Ejemplo 1: Cálculo Básico

```typescript
import { calculateProbabilityUnified } from '@/core/use-cases/calculationEngineUnified';

const input = {
  age: 32,
  fsh: 8.5,
  amh: 2.1,
  // ... otros parámetros
};

const result = await calculateProbabilityUnified(input, 'auto');
console.log(`Probabilidad: ${result.probability}%`);
console.log(`Motor usado: ${result.engineMetrics.engineUsed}`);
```

### Ejemplo 2: Con Profiling

```typescript
import { calculateWithProfiling } from '@/core/integration/ProfilerIntegrationSimple';
import { calculateProbabilityUnified } from '@/core/use-cases/calculationEngineUnified';

const result = await calculateWithProfiling(
  input,
  (input) => calculateProbabilityUnified(input, 'auto'),
  'auto'
);

// Las métricas se registran automáticamente
```

### Ejemplo 3: Monitoreo en Componente

```typescript
import { useProductionMetrics } from '@/core/integration/ProfilerIntegrationSimple';

const MonitoringComponent = () => {
  const { metrics, alerts, suggestions } = useProductionMetrics();
  
  return (
    <View>
      <Text>Total cálculos: {metrics.motorUnificado.totalCalculations}</Text>
      <Text>Alertas activas: {alerts.length}</Text>
      <Text>Sugerencias: {suggestions.length}</Text>
    </View>
  );
};
```

### Ejemplo 4: Dashboard Completo

```typescript
import { MetricsDashboard } from '@/components/dashboard/MetricsDashboard';

const AdminScreen = () => {
  const handleAlert = (alert) => {
    Alert.alert('Alerta de Performance', alert.message);
  };
  
  const handleSuggestion = (suggestion) => {
    console.log('Optimización sugerida:', suggestion.description);
  };
  
  return (
    <MetricsDashboard
      onAlertPress={handleAlert}
      onSuggestionPress={handleSuggestion}
      refreshInterval={30000}
    />
  );
};
```

---

## 🔧 Configuración de Entorno

### Desarrollo

```typescript
// En desarrollo: 100% sampling
productionProfiler.setSamplingRate(1.0);
```

### Producción

```typescript
// En producción: 10% sampling para minimizar overhead
productionProfiler.setSamplingRate(0.1);
```

### Testing

```typescript
// En tests: 0% sampling
productionProfiler.setSamplingRate(0.0);
```

---

## 📊 Métricas de Performance

### Benchmarks del Motor Unificado

| Métrica | Motor Standard | Motor Premium | Motor Unificado |
|---------|----------------|---------------|-----------------|
| Tiempo promedio | 50ms | 180ms | 75ms (auto) |
| Overhead | - | - | <10% |
| Precisión | 85% | 95% | 93% (auto) |
| Uso de memoria | 5MB | 15MB | 8MB (auto) |

### Ganancia de Paralelización

- **Validación secuencial**: 500ms promedio
- **Validación paralela**: 150ms promedio
- **Ganancia**: 70% reducción en tiempo

---

## 🚀 Roadmap de Optimización

### Fase Actual (Completada)
- ✅ Motor unificado implementado
- ✅ Sistema de profiling en producción
- ✅ Dashboard de métricas
- ✅ Migración de componentes principales

### Próximas Fases
- 🔄 Machine Learning para optimización automática de thresholds
- 🔄 Alertas push para administradores
- 🔄 Exportación de reportes de performance
- 🔄 Integración con servicios de monitoreo externos

---

## 📞 Soporte

Para dudas técnicas o problemas de implementación:

1. Revisar esta documentación
2. Verificar logs del ProductionProfiler
3. Consultar métricas en el dashboard
4. Contactar al equipo de arquitectura

---

*Última actualización: Diciembre 2024*
*Versión: 2.0.0*
