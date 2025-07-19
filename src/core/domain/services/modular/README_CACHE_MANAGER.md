# 💾 CACHE MANAGER - DOCUMENTACIÓN TÉCNICA

## 🎯 Descripción General

El **UnifiedCacheManager** es un sistema de cache multi-nivel inteligente que consolida los caches fragmentados del sistema en una solución unificada con características avanzadas.

## ✨ Características Principales

### 🏗️ Arquitectura Multi-Nivel
- **L1**: Cache en memoria rápido
- **L2**: Cache comprimido para datos grandes
- **L3**: Cache predictivo basado en patrones

### 🧠 Inteligencia Artificial
- **Predicción de Acceso**: Analiza patrones de uso para predecir próximos accesos
- **Preloading Inteligente**: Precarga datos basado en predicciones
- **Optimización Automática**: Ajusta parámetros según performance

### 🗜️ Compresión Avanzada
- **Compresión Automática**: Aplica compresión a entradas grandes
- **Ratio Inteligente**: Comprime solo cuando hay beneficio significativo
- **Transparencia Total**: Compresión/descompresión automática

### 📊 Métricas Completas
- **Hits/Misses**: Estadísticas básicas de cache
- **Por Tipo**: Métricas específicas por tipo de cache
- **Predictivas**: Éxito de predicciones y preloading
- **Compresión**: Ahorro de espacio y ratios

## 🔧 Uso Básico

### Importación
```typescript
import { UnifiedCacheManager, getCacheManager } from './CacheManager';
```

### Operaciones Básicas
```typescript
// Obtener instancia singleton
const cache = getCacheManager();

// Almacenar datos
cache.set('my-key', { data: 'value' });
cache.set('validation-key', validationResult, 'validation');

// Recuperar datos
const result = cache.get('my-key');
const validation = cache.get('validation-key', 'validation');

// Eliminar datos
cache.delete('my-key');
cache.clear(); // Limpiar todo
cache.clear('validation'); // Limpiar tipo específico
```

## 📋 Tipos de Cache Soportados

| Tipo | Descripción | Uso |
|------|-------------|-----|
| `validation` | Resultados de validación | Validación de entrada |
| `factors` | Evaluación de factores | Cálculos de factores |
| `diagnostics` | Datos de diagnóstico | Análisis clínico |
| `reports` | Reportes generados | Informes finales |
| `general` | Datos generales | Cualquier otro dato |

## ⚙️ Configuración Avanzada

### Configuración Personalizada
```typescript
const customConfig = {
  maxSize: 200,              // Máximo entradas por tipo
  defaultTtl: 60000,         // TTL por defecto (60 segundos)
  compressionThreshold: 2048, // Comprimir si > 2KB
  predictiveThreshold: 0.8,   // Umbral para predicción
  enableCompression: true,    // Habilitar compresión
  enablePrediction: true,     // Habilitar predicción
  enablePreloading: true,     // Habilitar preloading
  cleanupInterval: 120000     // Limpieza cada 2 minutos
};

const cache = new UnifiedCacheManager(customConfig);
```

### Opciones por Operación
```typescript
// Opciones específicas para set()
cache.set('key', data, 'general', {
  ttl: 30000,        // TTL específico
  compress: true,    // Forzar compresión
  predictive: true,  // Marcar como predictivo
  priority: 5        // Prioridad para eviction
});
```

## 🧠 Funcionalidades Inteligentes

### Predicción de Acceso
```typescript
// Predecir próximos accesos
const predictions = cache.predictNextAccess('current-key');
console.log('Próximos accesos predecidos:', predictions);

// Preloading automático
await cache.preloadPredictedData('current-key', async (key) => {
  return await loadDataFromSource(key);
});
```

### Optimización Automática
```typescript
// Optimizar sistema
const optimization = cache.optimize();
console.log('Optimizaciones aplicadas:', optimization.optimizationsApplied);
console.log('Mejoras obtenidas:', optimization.metricsImproved);
```

### Métricas y Monitoreo
```typescript
// Métricas básicas
const metrics = cache.getMetrics();
console.log(`Hit Rate: ${(metrics.hitRate * 100).toFixed(1)}%`);
console.log(`Compresión: ${metrics.compressionSavings} bytes ahorrados`);

// Estadísticas detalladas
const stats = cache.getDetailedStats();
console.log('Patrones activos:', stats.patterns.active);
console.log('Cola de preloading:', stats.preload.queueSize);
```

## 🔄 Integración con CalculationOrchestrator

### Uso Automático
```typescript
// El CalculationOrchestrator usa el cache automáticamente
const result = await calculateFertility(userInput, {
  useCache: true,    // Habilitar cache
  userId: 'user123'  // Cache por usuario
});
```

### Funciones de Conveniencia
```typescript
import { 
  cacheValidation, 
  cacheFactors, 
  cacheReport, 
  getFromCache,
  generateInputHash 
} from './CacheManager';

// Cachear resultados específicos
cacheValidation(inputHash, validationResult);
cacheFactors(inputHash, factorResults);
cacheReport(inputHash, finalReport);

// Recuperar desde cache
const cachedResult = getFromCache<ValidationResult>(inputHash, 'validation');

// Generar hash consistente
const hash = generateInputHash(userInput);
```

## 🎯 Casos de Uso Comunes

### 1. Cache de Validación
```typescript
const inputHash = generateInputHash(userInput);
let validation = cache.get<ValidationResult>(inputHash, 'validation');

if (!validation) {
  validation = await validateUserInput(userInput);
  cache.set(inputHash, validation, 'validation');
}
```

### 2. Cache de Cálculos Complejos
```typescript
const calculationKey = `calc_${inputHash}_${configHash}`;
let result = cache.get<CalculationResult>(calculationKey);

if (!result) {
  result = await performComplexCalculation(input, config);
  cache.set(calculationKey, result, 'general', {
    ttl: 300000, // 5 minutos
    compress: true
  });
}
```

### 3. Cache Predictivo
```typescript
// Después de cada cálculo, predecir próximos
const nextKeys = cache.predictNextAccess(currentKey);
await cache.preloadPredictedData(currentKey, loadCalculationData);
```

## 📊 Métricas y Análisis

### Métricas Básicas
```typescript
interface CacheMetrics {
  hits: number;                    // Aciertos de cache
  misses: number;                  // Fallos de cache
  totalOperations: number;         // Operaciones totales
  hitRate: number;                 // Tasa de aciertos (0-1)
  predictiveHits: number;          // Aciertos predictivos
  compressionSavings: number;      // Bytes ahorrados
  preloadOperations: number;       // Operaciones de preloading
  evictions: number;               // Evictions realizadas
  averageRetrievalTime: number;    // Tiempo promedio de recuperación
  totalMemoryUsage: number;        // Uso total de memoria
  compressionRatio: number;        // Ratio de compresión promedio
}
```

### Análisis de Rendimiento
```typescript
const metrics = cache.getMetrics();

// Evaluar eficiencia
const efficiency = metrics.hitRate * 100;
const compressionEfficiency = (1 - metrics.compressionRatio) * 100;
const memoryUsage = metrics.totalMemoryUsage / 1024 / 1024; // MB

console.log(`Cache efficiency: ${efficiency.toFixed(1)}%`);
console.log(`Compression efficiency: ${compressionEfficiency.toFixed(1)}%`);
console.log(`Memory usage: ${memoryUsage.toFixed(2)} MB`);
```

## 🔧 Troubleshooting

### Problemas Comunes

#### 1. Hit Rate Bajo
```typescript
// Verificar configuración
const metrics = cache.getMetrics();
if (metrics.hitRate < 0.5) {
  // Aumentar TTL
  cache.config.defaultTtl = 60000;
  
  // Verificar patrones de acceso
  const stats = cache.getDetailedStats();
  console.log('Patrones:', stats.patterns.topPatterns);
}
```

#### 2. Uso Excesivo de Memoria
```typescript
// Activar compresión más agresiva
cache.config.compressionThreshold = 512; // 512 bytes
cache.config.enableCompression = true;

// Reducir tamaño de cache
cache.config.maxSize = 100;

// Optimizar automáticamente
cache.optimize();
```

#### 3. Predicciones Pobres
```typescript
// Ajustar threshold predictivo
cache.config.predictiveThreshold = 0.6;

// Verificar calidad de predicciones
const stats = cache.getDetailedStats();
const predictionAccuracy = stats.preload.successRate;
console.log(`Precisión predicciones: ${predictionAccuracy}%`);
```

## 🚀 Mejores Prácticas

### 1. Configuración Óptima
```typescript
// Para aplicaciones de alta frecuencia
const highFrequencyConfig = {
  maxSize: 500,
  defaultTtl: 300000,        // 5 minutos
  compressionThreshold: 4096, // 4KB
  predictiveThreshold: 0.7,
  enableCompression: true,
  enablePrediction: true,
  enablePreloading: true
};
```

### 2. Gestión de Memoria
```typescript
// Monitorear uso de memoria
setInterval(() => {
  const metrics = cache.getMetrics();
  const memoryMB = metrics.totalMemoryUsage / 1024 / 1024;
  
  if (memoryMB > 100) { // Más de 100MB
    cache.optimize();
  }
}, 60000); // Cada minuto
```

### 3. Claves Consistentes
```typescript
// Usar función de hash consistente
const generateConsistentKey = (input: UserInput, context: string) => {
  const hash = generateInputHash(input);
  return `${context}_${hash}`;
};
```

## 🔗 Integración con Otros Módulos

### Con CalculationOrchestrator
```typescript
// Automáticamente integrado
const orchestrator = getCalculationOrchestrator();
// Usa cache internamente
```

### Con PerformanceMonitor
```typescript
// Métricas de cache incluidas en monitoring
const healthReport = getSystemHealthReport();
console.log('Cache health:', healthReport.modules.cache);
```

### Con EngineSelector
```typescript
// Cache de selecciones de engine
const engineKey = `engine_${inputHash}`;
let selectedEngine = cache.get(engineKey);

if (!selectedEngine) {
  selectedEngine = engineSelector.selectBestEngine(input);
  cache.set(engineKey, selectedEngine, 'general', { ttl: 600000 });
}
```

## 📈 Performance Benchmarks

| Operación | Tiempo Típico | Objetivo |
|-----------|---------------|----------|
| `get()` hit | < 1ms | < 0.5ms |
| `get()` miss | < 1ms | < 0.5ms |
| `set()` simple | < 2ms | < 1ms |
| `set()` comprimido | < 10ms | < 5ms |
| `optimize()` | < 50ms | < 20ms |
| `predictNextAccess()` | < 5ms | < 2ms |

## 🧪 Testing

### Test de Funcionalidad
```bash
npm test -- CacheManager.test.ts
```

### Test de Performance
```bash
npm run test:performance -- --cache
```

### Test de Integración
```bash
npm run test:integration -- --cache
```

---

## 📞 Soporte Técnico

Para problemas o dudas:
1. Verificar logs de cache
2. Revisar métricas con `getMetrics()`
3. Ejecutar `optimize()` para auto-corrección
4. Consultar documentación de integración

**El CacheManager está optimizado para máximo rendimiento y mínimo overhead! 🚀**
