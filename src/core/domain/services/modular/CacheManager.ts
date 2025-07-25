/**
 * 💾 CACHE MANAGER - Sistema Unificado de Cache
 * 
 * Módulo que consolida los 3 caches fragmentados del monolito
 * en un sistema inteligente multi-nivel con compresión y predicción.
 * 
 * CARACTERÍSTICAS:
 * - Cache multi-nivel (L1, L2, L3)
 * - Compresión automática para entradas grandes
 * - Predicción basada en patrones de uso
 * - Métricas avanzadas de performance
 * - LRU inteligente con score de predicción
 */

import { UserInput, Report } from '../../models';
import { ValidationResult, FactorEvaluationResult } from './CalculationCore';

// ===================================================================
// 🎯 INTERFACES PARA CACHE MANAGER
// ===================================================================

/**
 * Entrada de cache unificada con metadatos avanzados
 */
export interface UnifiedCacheEntry<T = unknown> {
  data: T;
  timestamp: number;
  accessCount: number;
  inputHash: string;
  predictiveScore: number; // Score para predicción de uso futuro
  compressionRatio: number; // Ratio de compresión aplicado
  lastAccessTime: number; // Para LRU más preciso
  ttl: number; // Time to live específico por entrada
  size: number; // Tamaño en bytes
  compressed: boolean; // Si está comprimido
}

/**
 * Tipos de cache soportados
 */
export type CacheType = 'validation' | 'factors' | 'diagnostics' | 'reports' | 'general';

/**
 * Métricas del sistema de cache
 */
export interface CacheMetrics {
  // Métricas básicas
  hits: number;
  misses: number;
  totalOperations: number;
  hitRate: number;
  
  // Métricas avanzadas
  predictiveHits: number;
  compressionSavings: number; // Bytes ahorrados
  preloadOperations: number;
  evictions: number;
  
  // Métricas por tipo
  typeMetrics: Record<CacheType, {
    hits: number;
    misses: number;
    size: number;
    avgAccessTime: number;
  }>;
  
  // Performance
  averageRetrievalTime: number;
  totalMemoryUsage: number;
  compressionRatio: number;
}

/**
 * Patrón de uso para predicción
 */
export interface UsagePattern {
  inputSignature: string;
  frequency: number;
  lastUsed: number;
  relatedPatterns: string[]; // Patrones que suelen aparecer juntos
  timeOfDay: number[]; // Horas del día más frecuentes
  accessSequence: string[]; // Secuencia de acceso típica
  predictivePower: number; // Qué tan bueno es para predicción
}

/**
 * Configuración del cache
 */
export interface CacheConfig {
  maxSize: number;
  defaultTtl: number;
  compressionThreshold: number; // Comprimir si > N bytes
  predictiveThreshold: number; // Umbral para predicción
  enableCompression: boolean;
  enablePrediction: boolean;
  enablePreloading: boolean;
  cleanupInterval: number; // ms
}

/**
 * Opciones para operaciones de cache
 */
export interface CacheOptions {
  ttl?: number;
  compress?: boolean;
  predictive?: boolean;
  priority?: number; // Para LRU con prioridad
}

// ===================================================================
// 💾 CACHE MANAGER CLASS
// ===================================================================

export class UnifiedCacheManager {
  // Caches por tipo con estructura unificada
  private readonly caches = new Map<CacheType, Map<string, UnifiedCacheEntry<unknown>>>();
  
  // Sistema de compresión
  private readonly compressionCache = new Map<string, ArrayBuffer>();
  
  // Patrones de uso para predicción
  private readonly usagePatterns = new Map<string, UsagePattern>();
  private readonly preloadQueue = new Set<string>();
  
  // Métricas del sistema
  private metrics: CacheMetrics = {
    hits: 0,
    misses: 0,
    totalOperations: 0,
    hitRate: 0,
    predictiveHits: 0,
    compressionSavings: 0,
    preloadOperations: 0,
    evictions: 0,
    typeMetrics: {
      validation: { hits: 0, misses: 0, size: 0, avgAccessTime: 0 },
      factors: { hits: 0, misses: 0, size: 0, avgAccessTime: 0 },
      diagnostics: { hits: 0, misses: 0, size: 0, avgAccessTime: 0 },
      reports: { hits: 0, misses: 0, size: 0, avgAccessTime: 0 },
      general: { hits: 0, misses: 0, size: 0, avgAccessTime: 0 }
    },
    averageRetrievalTime: 0,
    totalMemoryUsage: 0,
    compressionRatio: 1.0
  };
  
  // Timer para cleanup automático
  private cleanupTimer?: ReturnType<typeof setInterval>;
  
  constructor(private readonly config: CacheConfig = {
    maxSize: 150,
    defaultTtl: 30000, // 30 segundos
    compressionThreshold: 1024, // 1KB
    predictiveThreshold: 0.7,
    enableCompression: true,
    enablePrediction: true,
    enablePreloading: true,
    cleanupInterval: 60000 // 1 minuto
  }) {
    // Inicializar caches por tipo
    const cacheTypes: CacheType[] = ['validation', 'factors', 'diagnostics', 'reports', 'general'];
    for (const type of cacheTypes) {
      this.caches.set(type, new Map());
    }
    
    // Iniciar cleanup automático
    this.startAutomaticCleanup();
  }
  
  // ===================================================================
  // 🔍 OPERACIONES PRINCIPALES DE CACHE
  // ===================================================================
  
  /**
   * Obtiene valor del cache con análisis de patrones
   */
  get<T>(key: string, type: CacheType = 'general'): T | null {
    const startTime = performance.now();
    this.metrics.totalOperations++;
    
    const cache = this.caches.get(type)!;
    const entry = cache.get(key);
    
    if (entry && this.isEntryValid(entry)) {
      // Cache hit
      this.recordCacheHit(type, entry, startTime);
      this.updateUsagePattern(key, true);
      
      // Descomprimir si es necesario
      const data = entry.compressed ? 
        this.decompress(entry.data as string) : 
        entry.data;
      return data as T;
    } else {
      // Cache miss
      this.recordCacheMiss(type, startTime);
      this.updateUsagePattern(key, false);
      
      // Limpiar entrada expirada
      if (entry) {
        cache.delete(key);
        this.metrics.evictions++;
      }
      
      return null;
    }
  }
  
  /**
   * Almacena valor en cache con compresión inteligente
   */
  set<T>(key: string, value: T, type: CacheType = 'general', options: CacheOptions = {}): void {
    const cache = this.caches.get(type)!;
    
    // Aplicar limpieza si el cache está lleno
    if (cache.size >= this.config.maxSize) {
      this.evictLeastUseful(type);
    }
    
    const now = Date.now();
    const ttl = options.ttl || this.config.defaultTtl;
    const shouldCompress = this.shouldCompress(value, options.compress);
    
    let finalData: unknown = value;
    let compressionRatio = 1.0;
    let size = this.estimateSize(value);
    
    // Comprimir si es necesario
    if (shouldCompress) {
      try {
        finalData = this.compress(value);
        compressionRatio = size / this.estimateSize(finalData);
        this.metrics.compressionSavings += size - this.estimateSize(finalData);
      } catch (error) {
        console.warn('Error comprimiendo entrada de cache:', error);
        finalData = value;
        compressionRatio = 1.0;
      }
    }
    
    const entry: UnifiedCacheEntry<T> = {
      data: finalData as T,
      timestamp: now,
      accessCount: 1,
      inputHash: key,
      predictiveScore: this.calculatePredictiveScore(key),
      compressionRatio,
      lastAccessTime: now,
      ttl,
      size: this.estimateSize(finalData),
      compressed: shouldCompress
    };
    
    cache.set(key, entry);
    this.updateTypeMetrics(type, 'set', size);
    
    // Trigger predicción si está habilitada
    if (this.config.enablePrediction) {
      this.updatePredictivePatterns(key, value);
    }
  }
  
  /**
   * Elimina entrada específica del cache
   */
  delete(key: string, type: CacheType = 'general'): boolean {
    const cache = this.caches.get(type)!;
    const deleted = cache.delete(key);
    
    if (deleted) {
      this.metrics.evictions++;
      this.updateTypeMetrics(type, 'delete', 0);
    }
    
    return deleted;
  }
  
  /**
   * Limpia cache específico o todos
   */
  clear(type?: CacheType): void {
    if (type) {
      const cache = this.caches.get(type)!;
      const deletedCount = cache.size;
      cache.clear();
      this.metrics.evictions += deletedCount;
    } else {
      // Limpiar todos los caches
      for (const [, cache] of this.caches) {
        this.metrics.evictions += cache.size;
        cache.clear();
      }
      this.compressionCache.clear();
      this.usagePatterns.clear();
      this.preloadQueue.clear();
    }
  }
  
  // ===================================================================
  // 🧠 FUNCIONES DE PREDICCIÓN E INTELIGENCIA
  // ===================================================================
  
  /**
   * Predicción de siguiente acceso basada en patrones
   */
  predictNextAccess(currentKey: string): string[] {
    const pattern = this.usagePatterns.get(currentKey);
    if (!pattern) return [];
    
    // Buscar patrones relacionados con alta probabilidad
    return pattern.relatedPatterns
      .map(key => ({
        key,
        pattern: this.usagePatterns.get(key),
        score: this.calculatePredictionScore(currentKey, key)
      }))
      .filter(item => item.pattern && item.score > this.config.predictiveThreshold)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(item => item.key);
  }
  
  /**
   * Precargar datos basado en predicciones
   */
  async preloadPredictedData(currentKey: string, dataLoader: (key: string) => Promise<unknown>): Promise<void> {
    if (!this.config.enablePreloading) return;
    
    const predictions = this.predictNextAccess(currentKey);
    
    for (const predictedKey of predictions) {
      if (this.get(predictedKey) === null && !this.preloadQueue.has(predictedKey)) {
        this.preloadQueue.add(predictedKey);
        
        try {
          const data = await dataLoader(predictedKey);
          this.set(predictedKey, data, 'general', { predictive: true });
          this.metrics.preloadOperations++;
        } catch (error) {
          console.warn(`Error precargando ${predictedKey}:`, error);
        } finally {
          this.preloadQueue.delete(predictedKey);
        }
      }
    }
  }
  
  // ===================================================================
  // 🛠️ NEURAL OPTIMIZATION HELPER FUNCTIONS
  // ===================================================================
  
  /**
   * Limpia patrones de uso antiguos
   */
  private cleanupOldPatterns(): number {
    const dayAgo = Date.now() - (24 * 60 * 60 * 1000);
    let patternsRemoved = 0;
    
    for (const [key, pattern] of this.usagePatterns.entries()) {
      if (pattern.lastUsed < dayAgo) {
        this.usagePatterns.delete(key);
        patternsRemoved++;
      }
    }
    
    return patternsRemoved;
  }
  
  /**
   * Aplica compresión a entradas grandes no comprimidas
   */
  private applyCompressionOptimization(): number {
    let compressionApplied = 0;
    
    for (const [, cache] of this.caches) {
      for (const [key, entry] of cache.entries()) {
        if (!entry.compressed && entry.size > this.config.compressionThreshold) {
          const compressionResult = this.tryCompressEntry(entry, key);
          if (compressionResult.success) {
            compressionApplied++;
          }
        }
      }
    }
    
    return compressionApplied;
  }
  
  /**
   * Intenta comprimir una entrada específica
   */
  private tryCompressEntry(entry: UnifiedCacheEntry<unknown>, key: string): { success: boolean } {
    try {
      const compressedData = this.compress(entry.data);
      const newSize = this.estimateSize(compressedData);
      
      if (newSize < entry.size * 0.8) { // Solo si hay mejora significativa
        entry.data = compressedData;
        entry.compressed = true;
        entry.compressionRatio = entry.size / newSize;
        this.metrics.compressionSavings += entry.size - newSize;
        entry.size = newSize;
        return { success: true };
      }
    } catch (error) {
      console.warn(`Error comprimiendo entrada ${key}:`, error);
    }
    
    return { success: false };
  }
  
  /**
   * Limpia entradas de compresión huérfanas
   */
  private cleanupOrphanedCompression(): number {
    let orphanedCompression = 0;
    
    for (const key of this.compressionCache.keys()) {
      if (!this.isCompressionKeyInUse(key)) {
        this.compressionCache.delete(key);
        orphanedCompression++;
      }
    }
    
    return orphanedCompression;
  }
  
  /**
   * Verifica si una clave de compresión está en uso
   */
  private isCompressionKeyInUse(key: string): boolean {
    for (const cache of this.caches.values()) {
      if (cache.has(key)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Optimización automática del cache
   */
  optimize(): { optimizationsApplied: string[]; metricsImproved: Record<string, number> } {
    const optimizations: string[] = [];
    const beforeMetrics = { ...this.metrics };
    
    // 1. Limpiar patrones antiguos
    const patternsRemoved = this.cleanupOldPatterns();
    if (patternsRemoved > 0) {
      optimizations.push(`Removed ${patternsRemoved} old patterns`);
    }
    
    // 2. Comprimir entradas grandes no comprimidas
    const compressionApplied = this.applyCompressionOptimization();
    if (compressionApplied > 0) {
      optimizations.push(`Applied compression to ${compressionApplied} entries`);
    }
    
    // 3. Ajustar thresholds basado en performance
    const oldThreshold = this.config.predictiveThreshold;
    this.adjustPredictiveThreshold();
    
    if (Math.abs(this.config.predictiveThreshold - oldThreshold) > 0.05) {
      optimizations.push(`Adjusted predictive threshold: ${oldThreshold.toFixed(2)} → ${this.config.predictiveThreshold.toFixed(2)}`);
    }
    
    // 4. Limpiar compresión huérfana
    const orphanedCompression = this.cleanupOrphanedCompression();
    if (orphanedCompression > 0) {
      optimizations.push(`Cleaned ${orphanedCompression} orphaned compressed entries`);
    }
    
    // Calcular mejoras
    this.updateCacheMetrics();
    const metricsImproved = {
      hitRateImprovement: this.metrics.hitRate - beforeMetrics.hitRate,
      compressionSavings: this.metrics.compressionSavings - beforeMetrics.compressionSavings,
      patternsRemoved,
      compressionApplied
    };
    
    return { optimizationsApplied: optimizations, metricsImproved };
  }
  
  // ===================================================================
  // 📊 MÉTRICAS Y MONITORING
  // ===================================================================
  
  /**
   * Obtiene métricas completas del cache
   */
  getMetrics(): CacheMetrics {
    this.updateCacheMetrics();
    return { ...this.metrics };
  }
  
  /**
   * Obtiene estadísticas detalladas
   */
  getDetailedStats() {
    return {
      cacheSize: Object.fromEntries(
        Array.from(this.caches.entries()).map(([type, cache]) => [type, cache.size])
      ),
      patterns: {
        total: this.usagePatterns.size,
        active: Array.from(this.usagePatterns.values())
          .filter(p => Date.now() - p.lastUsed < 5 * 60 * 1000).length,
        topPatterns: Array.from(this.usagePatterns.entries())
          .sort(([,a], [,b]) => b.frequency - a.frequency)
          .slice(0, 5)
          .map(([hash, pattern]) => ({ hash, frequency: pattern.frequency, predictivePower: pattern.predictivePower }))
      },
      preload: {
        queueSize: this.preloadQueue.size,
        successRate: this.metrics.preloadOperations > 0 ? 
          (this.metrics.predictiveHits / this.metrics.preloadOperations * 100) : 0
      },
      compression: {
        totalSavings: this.metrics.compressionSavings,
        averageRatio: this.metrics.compressionRatio,
        compressedEntries: this.compressionCache.size
      }
    };
  }
  
  /**
   * Reset de métricas
   */
  resetMetrics(): void {
    this.metrics = {
      hits: 0,
      misses: 0,
      totalOperations: 0,
      hitRate: 0,
      predictiveHits: 0,
      compressionSavings: 0,
      preloadOperations: 0,
      evictions: 0,
      typeMetrics: {
        validation: { hits: 0, misses: 0, size: 0, avgAccessTime: 0 },
        factors: { hits: 0, misses: 0, size: 0, avgAccessTime: 0 },
        diagnostics: { hits: 0, misses: 0, size: 0, avgAccessTime: 0 },
        reports: { hits: 0, misses: 0, size: 0, avgAccessTime: 0 },
        general: { hits: 0, misses: 0, size: 0, avgAccessTime: 0 }
      },
      averageRetrievalTime: 0,
      totalMemoryUsage: 0,
      compressionRatio: 1.0
    };
  }
  
  // ===================================================================
  // 🛠️ FUNCIONES AUXILIARES PRIVADAS
  // ===================================================================
  
  private isEntryValid(entry: UnifiedCacheEntry<unknown>): boolean {
    const now = Date.now();
    return (now - entry.timestamp) < entry.ttl;
  }
  
  private shouldCompress(value: unknown, forceCompress?: boolean): boolean {
    if (!this.config.enableCompression) return false;
    if (forceCompress !== undefined) return forceCompress;
    
    const size = this.estimateSize(value);
    return size > this.config.compressionThreshold;
  }
  
  private estimateSize(obj: unknown): number {
    // Estimación aproximada del tamaño en bytes
    return JSON.stringify(obj).length * 2; // UTF-16 = 2 bytes por char
  }
  
  private compress(data: unknown): string {
    // Implementación simple de compresión (en producción usar LZ4/gzip)
    const jsonString = JSON.stringify(data);
    return btoa(jsonString); // Base64 encoding como simulación
  }
  
  private decompress(compressedData: string): unknown {
    // Descompresión correspondiente
    const jsonString = atob(compressedData);
    return JSON.parse(jsonString);
  }
  
  private calculatePredictiveScore(key: string): number {
    const pattern = this.usagePatterns.get(key);
    if (!pattern) return 0.5;
    
    // Score basado en frecuencia, recencia y poder predictivo
    const frequencyScore = Math.min(1, pattern.frequency / 10);
    const recencyScore = Math.max(0, 1 - (Date.now() - pattern.lastUsed) / (24 * 60 * 60 * 1000));
    const predictiveScore = pattern.predictivePower;
    
    return (frequencyScore + recencyScore + predictiveScore) / 3;
  }
  
  private evictLeastUseful(type: CacheType): void {
    const cache = this.caches.get(type)!;
    
    // Encontrar entrada menos útil (menor score combinado)
    let leastUsefulKey = '';
    let lowestScore = Infinity;
    
    for (const [key, entry] of cache.entries()) {
      const score = this.calculateEvictionScore(entry);
      if (score < lowestScore) {
        lowestScore = score;
        leastUsefulKey = key;
      }
    }
    
    if (leastUsefulKey) {
      cache.delete(leastUsefulKey);
      this.metrics.evictions++;
    }
  }
  
  private calculateEvictionScore(entry: UnifiedCacheEntry<unknown>): number {
    const now = Date.now();
    const ageScore = Math.max(0, 1 - (now - entry.timestamp) / entry.ttl);
    const accessScore = Math.min(1, entry.accessCount / 10);
    const predictiveScore = entry.predictiveScore;
    const sizeScore = 1 - Math.min(1, entry.size / (1024 * 1024)); // Penalizar entradas grandes
    
    return (ageScore + accessScore + predictiveScore + sizeScore) / 4;
  }
  
  private recordCacheHit(type: CacheType, entry: UnifiedCacheEntry<unknown>, startTime: number): void {
    const accessTime = performance.now() - startTime;
    
    this.metrics.hits++;
    this.metrics.typeMetrics[type].hits++;
    
    // Actualizar entrada
    entry.accessCount++;
    entry.lastAccessTime = Date.now();
    
    // Actualizar métricas de tiempo
    this.updateAccessTime(type, accessTime);
  }
  
  private recordCacheMiss(type: CacheType, startTime: number): void {
    const accessTime = performance.now() - startTime;
    
    this.metrics.misses++;
    this.metrics.typeMetrics[type].misses++;
    
    this.updateAccessTime(type, accessTime);
  }
  
  private updateAccessTime(type: CacheType, accessTime: number): void {
    const typeMetrics = this.metrics.typeMetrics[type];
    const totalAccess = typeMetrics.hits + typeMetrics.misses;
    
    if (totalAccess === 1) {
      typeMetrics.avgAccessTime = accessTime;
    } else {
      typeMetrics.avgAccessTime = (typeMetrics.avgAccessTime * (totalAccess - 1) + accessTime) / totalAccess;
    }
  }
  
  private updateTypeMetrics(type: CacheType, operation: 'set' | 'delete', size: number): void {
    const cache = this.caches.get(type)!;
    this.metrics.typeMetrics[type].size = cache.size;
    
    if (operation === 'set') {
      this.metrics.totalMemoryUsage += size;
    } else if (operation === 'delete') {
      this.metrics.totalMemoryUsage = Math.max(0, this.metrics.totalMemoryUsage - size);
    }
  }
  
  private updateCacheMetrics(): void {
    this.metrics.hitRate = this.metrics.totalOperations > 0 ? 
      this.metrics.hits / this.metrics.totalOperations : 0;
    
    // Actualizar ratio de compresión promedio
    let totalOriginalSize = 0;
    let totalCompressedSize = 0;
    
    for (const cache of this.caches.values()) {
      for (const entry of cache.values()) {
        if (entry.compressed) {
          const originalSize = entry.size * entry.compressionRatio;
          totalOriginalSize += originalSize;
          totalCompressedSize += entry.size;
        }
      }
    }
    
    this.metrics.compressionRatio = totalOriginalSize > 0 ? 
      totalCompressedSize / totalOriginalSize : 1.0;
  }
  
  private updateUsagePattern(key: string, wasHit: boolean): void {
    if (!this.config.enablePrediction) return;
    
    const pattern = this.usagePatterns.get(key) || {
      inputSignature: key,
      frequency: 0,
      lastUsed: 0,
      relatedPatterns: [],
      timeOfDay: [],
      accessSequence: [],
      predictivePower: 0.5
    };
    
    pattern.frequency++;
    pattern.lastUsed = Date.now();
    
    // Actualizar hora del día
    const hour = new Date().getHours();
    if (!pattern.timeOfDay.includes(hour)) {
      pattern.timeOfDay.push(hour);
    }
    
    // Actualizar poder predictivo basado en aciertos
    if (wasHit) {
      pattern.predictivePower = Math.min(1, pattern.predictivePower + 0.1);
    } else {
      pattern.predictivePower = Math.max(0, pattern.predictivePower - 0.05);
    }
    
    this.usagePatterns.set(key, pattern);
  }
  
  private updatePredictivePatterns(key: string, value: unknown): void {
    // Análisis de patrones para predicción mejorada
    // Esta implementación se puede expandir con ML más sofisticado
    
    const relatedKeys = this.findRelatedKeys(key, value);
    const pattern = this.usagePatterns.get(key);
    
    if (pattern && relatedKeys.length > 0) {
      pattern.relatedPatterns = Array.from(new Set([
        ...pattern.relatedPatterns,
        ...relatedKeys
      ])).slice(0, 10); // Limitar a 10 relaciones
    }
  }
  
  private findRelatedKeys(currentKey: string, _currentValue: unknown): string[] {
    // Lógica simplificada para encontrar keys relacionados
    // Basado en similitud de hash de entrada
    
    const relatedKeys: string[] = [];
    const currentHash = currentKey.substring(0, 8); // Primeros 8 chars del hash
    
    for (const [key] of this.usagePatterns) {
      if (key !== currentKey && key.startsWith(currentHash.substring(0, 4))) {
        relatedKeys.push(key);
      }
    }
    
    return relatedKeys.slice(0, 5); // Máximo 5 relacionados
  }
  
  private calculatePredictionScore(currentKey: string, targetKey: string): number {
    const currentPattern = this.usagePatterns.get(currentKey);
    const targetPattern = this.usagePatterns.get(targetKey);
    
    if (!currentPattern || !targetPattern) return 0;
    
    // Score basado en correlación de uso
    const correlationScore = currentPattern.relatedPatterns.includes(targetKey) ? 0.8 : 0.2;
    const frequencyScore = Math.min(1, targetPattern.frequency / 10);
    const recencyScore = Math.max(0, 1 - (Date.now() - targetPattern.lastUsed) / (60 * 60 * 1000)); // 1 hora
    
    return (correlationScore + frequencyScore + recencyScore) / 3;
  }
  
  private adjustPredictiveThreshold(): void {
    // Ajustar threshold basado en performance de predicciones
    const predictionAccuracy = this.metrics.preloadOperations > 0 ? 
      this.metrics.predictiveHits / this.metrics.preloadOperations : 0.5;
    
    if (predictionAccuracy > 0.8) {
      // Predicciones muy buenas, reducir threshold para más agresividad
      this.config.predictiveThreshold = Math.max(0.3, this.config.predictiveThreshold - 0.05);
    } else if (predictionAccuracy < 0.4) {
      // Predicciones pobres, aumentar threshold para más conservadurismo
      this.config.predictiveThreshold = Math.min(0.9, this.config.predictiveThreshold + 0.05);
    }
  }
  
  private startAutomaticCleanup(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }
    
    this.cleanupTimer = setInterval(() => {
      this.cleanupExpiredEntries();
    }, this.config.cleanupInterval);
  }
  
  private cleanupExpiredEntries(): void {
    let totalExpired = 0;
    
    for (const [type, cache] of this.caches) {
      const expiredKeys: string[] = [];
      
      for (const [key, entry] of cache.entries()) {
        if (!this.isEntryValid(entry)) {
          expiredKeys.push(key);
        }
      }
      
      for (const key of expiredKeys) {
        cache.delete(key);
        totalExpired++;
      }
      
      this.updateTypeMetrics(type, 'delete', 0);
    }
    
    if (totalExpired > 0) {
      this.metrics.evictions += totalExpired;
      console.log(`🧹 Cache cleanup: ${totalExpired} expired entries removed`);
    }
  }
  
  /**
   * Destructor para limpiar recursos
   */
  destroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = undefined;
    }
    
    this.clear();
  }
}

// ===================================================================
// 🎯 FUNCIONES PÚBLICAS DE CACHE
// ===================================================================

/**
 * Instancia singleton del cache manager
 */
let cacheManagerInstance: UnifiedCacheManager | null = null;

/**
 * Obtiene la instancia del cache manager
 */
export function getCacheManager(config?: CacheConfig): UnifiedCacheManager {
  cacheManagerInstance ??= new UnifiedCacheManager(config);
  return cacheManagerInstance;
}

/**
 * Función de conveniencia para validación cache
 */
export function cacheValidation(key: string, result: ValidationResult): void {
  getCacheManager().set(key, result, 'validation');
}

/**
 * Función de conveniencia para factors cache
 */
export function cacheFactors(key: string, result: FactorEvaluationResult): void {
  getCacheManager().set(key, result, 'factors');
}

/**
 * Función de conveniencia para reports cache
 */
export function cacheReport(key: string, result: Report): void {
  getCacheManager().set(key, result, 'reports');
}

/**
 * Función de conveniencia para obtener desde cache
 */
export function getFromCache<T>(key: string, type: CacheType = 'general'): T | null {
  return getCacheManager().get<T>(key, type);
}

/**
 * Genera hash único para input de usuario
 */
export function generateInputHash(input: UserInput): string {
  // Algoritmo mejorado de hash que incluye todos los campos relevantes
  const signature = {
    age: Math.round(input.age * 10) / 10,
    bmi: Math.round((input.bmi || 0) * 100) / 100,
    cycleDuration: input.cycleDuration || 0,
    infertilityDuration: input.infertilityDuration || 0,
    endometriosisGrade: input.endometriosisGrade || 0,
    myomaType: input.myomaType || 'none',
    adenomyosisType: input.adenomyosisType || 'none',
    polypType: input.polypType || 'none',
    hsgResult: input.hsgResult || 'unknown',
    pelvicSurgeriesNumber: input.pelvicSurgeriesNumber || 0,
    flags: [
      input.hasPcos ? 'P' : '',
      input.hasOtb ? 'O' : '',
      input.hasPelvicSurgery ? 'S' : '',
      input.tpoAbPositive ? 'T' : ''
    ].join(''),
    hormones: [
      input.amh || 0,
      input.tsh || 0,
      input.prolactin || 0,
      input.homaIr || 0
    ].map(v => Math.round(v * 100) / 100).join('|'),
    male: [
      input.spermConcentration || 0,
      input.spermProgressiveMotility || 0,
      input.spermNormalMorphology || 0,
      input.semenVolume || 0
    ].join('|')
  };
  
  // Crear hash simple pero efectivo
  const signatureString = JSON.stringify(signature);
  let hash = 0;
  for (let i = 0; i < signatureString.length; i++) {
    const char = signatureString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return Math.abs(hash).toString(36);
}
