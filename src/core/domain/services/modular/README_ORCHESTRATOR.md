# 🎯 CALCULATION ORCHESTRATOR - DOCUMENTACIÓN COMPLETA

## 📋 Índice
1. [Introducción](#introducción)
2. [Arquitectura](#arquitectura)
3. [Uso Básico](#uso-básico)
4. [Funcionalidades Avanzadas](#funcionalidades-avanzadas)
5. [Integración con UI](#integración-con-ui)
6. [Manejo de Errores](#manejo-de-errores)
7. [Optimización y Rendimiento](#optimización-y-rendimiento)
8. [Ejemplos Prácticos](#ejemplos-prácticos)

---

## 🎯 Introducción

El **CalculationOrchestrator** es el componente central que coordina todos los módulos de cálculo de fertilidad en la aplicación. Actúa como un director de orquesta que:

- 🎭 **Coordina múltiples engines** (Standard, Premium, Unified)
- 💾 **Gestiona el cache inteligente** para mejorar rendimiento
- 📊 **Monitorea el performance** en tiempo real
- 🔄 **Maneja errores y recuperación** automática
- 🚀 **Optimiza automáticamente** el sistema

### ✨ Características Principales

- **Cálculo Automático**: Selecciona el mejor engine automáticamente
- **Cache Inteligente**: Evita cálculos redundantes
- **Retry System**: Recuperación automática en caso de error
- **Batch Processing**: Procesar múltiples cálculos eficientemente
- **Health Monitoring**: Monitoreo continuo del sistema
- **Performance Profiling**: Análisis detallado de rendimiento

---

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────┐
│           CalculationOrchestrator           │
├─────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐          │
│  │   Cache     │  │ Performance │          │
│  │  Manager    │  │   Monitor   │          │
│  └─────────────┘  └─────────────┘          │
│  ┌─────────────┐  ┌─────────────┐          │
│  │   Engine    │  │ Calculation │          │
│  │  Selector   │  │    Core     │          │
│  └─────────────┘  └─────────────┘          │
└─────────────────────────────────────────────┘
```

### 🧩 Componentes Integrados

- **CacheManager**: Gestión inteligente de cache
- **PerformanceMonitor**: Monitoreo y métricas
- **EngineSelector**: Selección automática de engines
- **CalculationCore**: Lógica de cálculo principal

---

## 🚀 Uso Básico

### 1. Importar el Orchestrator

```typescript
import { 
  calculateFertility,
  calculateFertilityFast,
  CalculationOptions,
  UserInput 
} from './CalculationOrchestrator';
```

### 2. Cálculo Básico

```typescript
// Datos de entrada
const userInput: UserInput = {
  age: 30,
  cycleDuration: 28,
  infertilityDuration: 2,
  bmi: 23.5,
  hasPcos: false,
  hasOtb: false,
  endometriosisGrade: 0,
  amh: 2.5,
  tsh: 2.0,
  prolactin: 20,
  spermConcentration: 20,
  spermProgressiveMotility: 40,
  spermNormalMorphology: 6
};

// Opciones de cálculo
const options: CalculationOptions = {
  enableProfiling: true,
  useCache: true,
  userId: 'user123'
};

// Ejecutar cálculo
const result = await calculateFertility(userInput, options);

console.log('Pronóstico:', result.evaluation.report.numericPrognosis);
console.log('Categoría:', result.evaluation.report.category);
console.log('Engine usado:', result.metadata.engineUsed);
```

### 3. Cálculo Rápido (Sin Metadatos)

```typescript
const quickResult = await calculateFertilityFast(userInput);
console.log('Pronóstico rápido:', quickResult.report.numericPrognosis);
```

---

## 🔧 Funcionalidades Avanzadas

### 1. Sistema de Retry

```typescript
import { calculateFertilityWithRetry } from './CalculationOrchestrator';

// Cálculo con hasta 3 reintentos
const result = await calculateFertilityWithRetry(
  userInput, 
  options, 
  3  // máximo 3 reintentos
);

if (result.metadata.recovered) {
  console.log('Cálculo recuperado exitosamente');
}
```

### 2. Procesamiento por Lotes

```typescript
import { calculateFertilityBatch } from './CalculationOrchestrator';

const inputs = [userInput1, userInput2, userInput3];
const batchResult = await calculateFertilityBatch(inputs, options);

console.log('Exitosos:', batchResult.summary.successful);
console.log('Fallidos:', batchResult.summary.failed);
console.log('Tiempo promedio:', batchResult.summary.averageTime);
```

### 3. Monitoreo de Salud

```typescript
import { getSystemHealthReport } from './CalculationOrchestrator';

const health = getSystemHealthReport();
console.log('Estado general:', health.overall);
console.log('Recomendaciones:', health.recommendations);
console.log('Métricas:', health.metrics);
```

### 4. Optimización Automática

```typescript
import { optimizeModularSystem } from './CalculationOrchestrator';

const optimization = optimizeModularSystem();
console.log('Optimizaciones aplicadas:', optimization.optimizationsApplied);
console.log('Mejoras esperadas:', optimization.expectedImprovements);
```

---

## 🎨 Integración con UI

### 1. Hook Personalizado

```typescript
import { useCalculationOrchestrator } from './CalculationIntegrationGuide';

function FertilityCalculator() {
  const {
    calculate,
    isCalculating,
    lastResult,
    error,
    systemHealth
  } = useCalculationOrchestrator();

  const handleCalculate = async () => {
    const result = await calculate(userInput);
    if (result) {
      // Mostrar resultado
      console.log('Resultado:', result);
    }
  };

  return (
    <View>
      <Button 
        title={isCalculating ? 'Calculando...' : 'Calcular'} 
        onPress={handleCalculate}
        disabled={isCalculating}
      />
      {error && <Text style={{color: 'red'}}>{error}</Text>}
      {lastResult && (
        <Text>Pronóstico: {lastResult.evaluation.report.numericPrognosis}%</Text>
      )}
    </View>
  );
}
```

### 2. Servicio de Integración

```typescript
import { CalculationService } from './CalculationIntegrationGuide';

const calculationService = CalculationService.getInstance();

// Suscribirse a resultados
const unsubscribe = calculationService.subscribe((result) => {
  console.log('Nuevo resultado:', result);
});

// Ejecutar cálculo
await calculationService.calculateAndNotify(userInput, options);

// Limpiar suscripción
unsubscribe();
```

---

## 🛠️ Manejo de Errores

### 1. Categorización de Errores

```typescript
import { CalculationErrorHandler } from './CalculationIntegrationGuide';

try {
  const result = await calculateFertility(userInput, options);
} catch (error) {
  const handled = CalculationErrorHandler.handleError(error);
  
  console.log('Tipo de error:', handled.type);
  console.log('Mensaje:', handled.message);
  console.log('Recuperación:', handled.recovery);
}
```

### 2. Manejo de Errores en UI

```typescript
// Mostrar error amigable al usuario
CalculationErrorHandler.showUserFriendlyError(error);
```

### 3. Errores Comunes y Soluciones

| Error | Causa | Solución |
|-------|-------|----------|
| `NETWORK` | Conexión | Verificar conectividad |
| `VALIDATION` | Datos inválidos | Revisar entrada |
| `CALCULATION` | Error en cálculo | Usar datos diferentes |
| `SYSTEM` | Error del sistema | Reiniciar app |

---

## ⚡ Optimización y Rendimiento

### 1. Configuración de Cache

```typescript
const options: CalculationOptions = {
  useCache: true,           // Habilitar cache
  cacheExpirationTime: 300, // 5 minutos
  userId: 'user123'         // Cache por usuario
};
```

### 2. Profiling de Performance

```typescript
const options: CalculationOptions = {
  enableProfiling: true,    // Habilitar profiling
  minConfidenceLevel: 0.8   // Nivel mínimo de confianza
};

const result = await calculateFertility(userInput, options);
console.log('Tiempos por módulo:', result.debug?.moduleTimings);
```

### 3. Selección de Engine

```typescript
const options: CalculationOptions = {
  preferredEngine: 'PREMIUM',  // Forzar engine específico
  fallbackEngines: ['STANDARD', 'UNIFIED']  // Fallbacks
};
```

---

## 📊 Ejemplos Prácticos

### 1. Calculadora Completa

```typescript
import React, { useState } from 'react';
import { View, Button, Text, ActivityIndicator } from 'react-native';
import { calculateFertility, CalculationOptions } from './CalculationOrchestrator';

export function CompleteFertilityCalculator({ userInput }) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCalculate = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const options: CalculationOptions = {
        enableProfiling: true,
        useCache: true,
        userId: 'app_user',
        enableRecovery: true
      };

      const calculationResult = await calculateFertility(userInput, options);
      setResult(calculationResult);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Button
        title="Calcular Fertilidad"
        onPress={handleCalculate}
        disabled={loading}
      />
      
      {loading && <ActivityIndicator size="large" />}
      
      {error && (
        <Text style={{ color: 'red', marginTop: 10 }}>
          Error: {error}
        </Text>
      )}
      
      {result && (
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
            Pronóstico: {result.evaluation.report.numericPrognosis.toFixed(1)}%
          </Text>
          <Text>Categoría: {result.evaluation.report.category}</Text>
          <Text>Engine: {result.metadata.engineUsed}</Text>
          <Text>Tiempo: {result.metadata.totalExecutionTime.toFixed(2)}ms</Text>
          {result.metadata.cacheHit && (
            <Text style={{ color: 'green' }}>✓ Cache Hit</Text>
          )}
        </View>
      )}
    </View>
  );
}
```

### 2. Dashboard de Monitoreo

```typescript
import React, { useState, useEffect } from 'react';
import { View, Text, Button, ScrollView } from 'react-native';
import { getSystemHealthReport, getSystemStats } from './CalculationOrchestrator';

export function SystemDashboard() {
  const [health, setHealth] = useState(null);
  const [stats, setStats] = useState(null);

  const refreshStatus = () => {
    const healthData = getSystemHealthReport();
    const statsData = getSystemStats();
    
    setHealth(healthData);
    setStats(statsData);
  };

  useEffect(() => {
    refreshStatus();
    const interval = setInterval(refreshStatus, 30000); // Cada 30 segundos
    return () => clearInterval(interval);
  }, []);

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>
        Sistema de Cálculo - Dashboard
      </Text>
      
      <Button title="Actualizar Estado" onPress={refreshStatus} />
      
      {health && (
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
            Estado General: {health.overall}
          </Text>
          
          <Text style={{ marginTop: 10, fontWeight: 'bold' }}>Módulos:</Text>
          {Object.entries(health.modules).map(([module, status]) => (
            <Text key={module}>
              {module}: {status.status} - {status.message}
            </Text>
          ))}
          
          <Text style={{ marginTop: 10, fontWeight: 'bold' }}>Métricas:</Text>
          <Text>Requests totales: {health.metrics.totalRequests}</Text>
          <Text>Tasa de éxito: {(health.metrics.successRate * 100).toFixed(1)}%</Text>
          <Text>Tiempo promedio: {health.metrics.averageResponseTime.toFixed(0)}ms</Text>
          
          {health.recommendations.length > 0 && (
            <View style={{ marginTop: 10 }}>
              <Text style={{ fontWeight: 'bold' }}>Recomendaciones:</Text>
              {health.recommendations.map((rec, index) => (
                <Text key={index}>• {rec}</Text>
              ))}
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
}
```

---

## 📝 Mejores Prácticas

### 1. Configuración Recomendada

```typescript
// Para uso en producción
const productionOptions: CalculationOptions = {
  enableProfiling: false,     // Desactivar en producción
  useCache: true,            // Siempre usar cache
  enableRecovery: true,      // Habilitar recuperación
  minConfidenceLevel: 0.7,   // Nivel mínimo aceptable
  userId: getCurrentUserId() // ID único por usuario
};

// Para desarrollo y debugging
const developmentOptions: CalculationOptions = {
  enableProfiling: true,     // Activar para debugging
  useCache: false,          // Desactivar para pruebas
  enableRecovery: true,     // Mantener recuperación
  minConfidenceLevel: 0.5   // Nivel más permisivo
};
```

### 2. Manejo de Estados

```typescript
// Estado de la aplicación
interface CalculationState {
  isCalculating: boolean;
  lastResult: CalculationResult | null;
  error: string | null;
  systemHealth: 'OK' | 'WARNING' | 'ERROR';
}

// Reducer para manejo de estado
const calculationReducer = (state: CalculationState, action: any) => {
  switch (action.type) {
    case 'CALCULATION_START':
      return { ...state, isCalculating: true, error: null };
    case 'CALCULATION_SUCCESS':
      return { ...state, isCalculating: false, lastResult: action.payload };
    case 'CALCULATION_ERROR':
      return { ...state, isCalculating: false, error: action.payload };
    case 'HEALTH_UPDATE':
      return { ...state, systemHealth: action.payload };
    default:
      return state;
  }
};
```

### 3. Testing

```typescript
import { calculateFertility } from './CalculationOrchestrator';

describe('CalculationOrchestrator', () => {
  it('should calculate fertility correctly', async () => {
    const mockInput = { /* datos de prueba */ };
    const result = await calculateFertility(mockInput);
    
    expect(result.evaluation.report.numericPrognosis).toBeGreaterThan(0);
    expect(result.evaluation.report.numericPrognosis).toBeLessThanOrEqual(100);
  });
  
  it('should handle errors gracefully', async () => {
    const invalidInput = { /* datos inválidos */ };
    
    await expect(calculateFertility(invalidInput)).rejects.toThrow();
  });
});
```

---

## 🔗 Referencias

- [Documentación API](./API_DOCS.md)
- [Guía de Integración](./CalculationIntegrationGuide.ts)
- [Ejemplos de Uso](./CalculationOrchestratorDemo.ts)
- [Arquitectura del Sistema](./ARCHITECTURE.md)

---

## 📞 Soporte

Para dudas o problemas:
- Revisar la documentación completa
- Verificar los ejemplos de uso
- Consultar el dashboard de monitoreo
- Contactar al equipo de desarrollo

**¡El CalculationOrchestrator está listo para usar! 🚀**
