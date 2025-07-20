/**
 * 💾 CACHE INTELIGENTE - VERSION 3.0
 * Sistema de cache médico con inteligencia adaptativa
 * Optimizado para consultas médicas frecuentes
 */

import { UserInput } from '../types/UnifiedTypes';
import { createHash } from 'crypto';

/**
 * 📊 ENTRADA DEL CACHE
 */
interface CacheEntry<T> {
  data: T;
  timestamp: Date;
  ttl: number; // Time to live en ms
  accessCount: number;
  lastAccess: Date;
  tags: string[];
  hash: string;
  size: number; // Tamaño estimado en bytes
}

/**
 * 🎛️ OPCIONES DE CACHE
 */
interface CacheOptions {
  ttl?: number; // TTL en ms
  tags?: string[];
  priority?: 'low' | 'normal' | 'high';
}

/**
 * 📈 MÉTRICAS DEL CACHE
 */
interface CacheMetrics {
  totalEntries: number;
  totalSize: number;
  hitCount: number;
  missCount: number;
  hitRate: number;
  averageAccessTime: number;
  memoryUsage: number;
  oldestEntry?: Date;
  newestEntry?: Date;
}

/**
 * 🧠 CACHE INTELIGENTE PRINCIPAL
 */
export class IntelligentCache {
  private cache = new Map<string, CacheEntry<any>>();
  private hitCount = 0;
  private missCount = 0;
  private totalAccessTime = 0;
  private accessCount = 0;
  
  // 🎛️ CONFIGURACIÓN
  private readonly maxSize: number;
  private readonly maxEntries: number;
  private readonly defaultTtl: number;
  private readonly compressionEnabled: boolean;
  
  // 📊 ANALYTICS
  private readonly analytics = {
    popularKeys: new Map<string, number>(),
    tagUsage: new Map<string, number>(),
    performanceHistory: [] as Array<{ timestamp: Date; hitRate: number; }>
  };
  
  constructor(config: {
    maxSize?: number;
    defaultTtl?: number;
    enableCompression?: boolean;
    maxEntries?: number;
  } = {}) {
    this.maxSize = config.maxSize || 50 * 1024 * 1024; // 50MB
    this.maxEntries = config.maxEntries || 1000;
    this.defaultTtl = config.defaultTtl || 1800000; // 30 minutos
    this.compressionEnabled = config.enableCompression || true;
    
    // Iniciar limpieza periódica
    this.startPeriodicCleanup();
  }
  
  /**
   * 🚀 INICIALIZACIÓN DEL CACHE
   */
  async initialize(): Promise<void> {
    console.log('💾 Inicializando IntelligentCache...');
    this.startPerformanceTracking();
    console.log('✅ Cache inicializado correctamente');
  }
  
  /**
   * 🔑 GENERAR CLAVE ÚNICA
   */
  generateKey(input: UserInput, suffix: string = ''): string {
    // Extraer solo campos relevantes para el hash
    const relevantFields = this.extractRelevantFields(input);
    const dataString = JSON.stringify(relevantFields) + suffix;
    return createHash('sha256').update(dataString).digest('hex');
  }
  
  /**
   * 📥 OBTENER DEL CACHE
   */
  async get<T>(key: string): Promise<T | null> {
    const startTime = performance.now();
    
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.recordMiss();
      this.recordAccessTime(performance.now() - startTime);
      return null;
    }
    
    // Verificar si expiró
    if (this.isExpired(entry)) {
      this.cache.delete(key);
      this.recordMiss();
      this.recordAccessTime(performance.now() - startTime);
      return null;
    }
    
    // Actualizar estadísticas de acceso
    entry.accessCount++;
    entry.lastAccess = new Date();
    this.analytics.popularKeys.set(key, (this.analytics.popularKeys.get(key) || 0) + 1);
    
    this.recordHit();
    this.recordAccessTime(performance.now() - startTime);
    
    return entry.data as T;
  }
  
  /**
   * 📤 GUARDAR EN CACHE
   */
  async set<T>(key: string, data: T, options: CacheOptions = {}): Promise<void> {
    const ttl = options.ttl || this.defaultTtl;
    const tags = options.tags || [];
    
    // Estimar tamaño
    const size = this.estimateSize(data);
    
    // Verificar si necesitamos espacio
    if (this.needsEviction(size)) {
      await this.performEviction(size);
    }
    
    // Crear entrada
    const entry: CacheEntry<T> = {
      data,
      timestamp: new Date(),
      ttl,
      accessCount: 0,
      lastAccess: new Date(),
      tags,
      hash: key,
      size
    };
    
    // Actualizar analytics de tags
    tags.forEach(tag => {
      this.analytics.tagUsage.set(tag, (this.analytics.tagUsage.get(tag) || 0) + 1);
    });
    
    this.cache.set(key, entry);
  }
  
  /**
   * 🗑️ ELIMINAR DEL CACHE
   */
  async delete(key: string): Promise<boolean> {
    return this.cache.delete(key);
  }
  
  /**
   * 🏷️ ELIMINAR POR TAGS
   */
  async deleteByTag(tag: string): Promise<number> {
    let deleted = 0;
    
    for (const [key, entry] of this.cache) {
      if (entry.tags.includes(tag)) {
        this.cache.delete(key);
        deleted++;
      }
    }
    
    return deleted;
  }
  
  /**
   * 🧹 LIMPIAR CACHE COMPLETO
   */
  clear(): void {
    this.cache.clear();
    this.analytics.popularKeys.clear();
    this.analytics.tagUsage.clear();
    console.log('🧹 Cache limpiado completamente');
  }
  
  /**
   * 📊 OBTENER MÉTRICAS
   */
  getMetrics(): CacheMetrics {
    const totalEntries = this.cache.size;
    const totalSize = Array.from(this.cache.values())
      .reduce((sum, entry) => sum + entry.size, 0);
    
    const hitRate = this.hitCount + this.missCount > 0 ? 
      this.hitCount / (this.hitCount + this.missCount) : 0;
    
    const averageAccessTime = this.accessCount > 0 ? 
      this.totalAccessTime / this.accessCount : 0;
    
    const entries = Array.from(this.cache.values());
    const oldestEntry = entries.length > 0 ? 
      entries.reduce((oldest, entry) => 
        entry.timestamp < oldest.timestamp ? entry : oldest
      ).timestamp : undefined;
    
    const newestEntry = entries.length > 0 ? 
      entries.reduce((newest, entry) => 
        entry.timestamp > newest.timestamp ? entry : newest
      ).timestamp : undefined;
    
    return {
      totalEntries,
      totalSize,
      hitCount: this.hitCount,
      missCount: this.missCount,
      hitRate,
      averageAccessTime,
      memoryUsage: totalSize,
      oldestEntry,
      newestEntry
    };
  }
  
  /**
   * 🔍 ESTADO DE SALUD
   */
  getHealthStatus(): 'OK' | 'WARNING' | 'ERROR' {
    const metrics = this.getMetrics();
    
    if (metrics.hitRate < 0.3) return 'ERROR';
    if (metrics.hitRate < 0.6) return 'WARNING';
    if (metrics.totalSize > this.maxSize * 0.9) return 'WARNING';
    if (metrics.totalEntries > this.maxEntries * 0.9) return 'WARNING';
    
    return 'OK';
  }
  
  /**
   * 📈 OBTENER TASA DE ACIERTOS
   */
  getHitRate(): number {
    return this.hitCount + this.missCount > 0 ? 
      this.hitCount / (this.hitCount + this.missCount) : 0;
  }
  
  /**
   * 🎯 OBTENER ESTADÍSTICAS POPULARES
   */
  getPopularKeys(limit: number = 10): Array<{ key: string; count: number }> {
    return Array.from(this.analytics.popularKeys.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([key, count]) => ({ key: key.substring(0, 16) + '...', count }));
  }
  
  /**
   * 🏷️ OBTENER ESTADÍSTICAS DE TAGS
   */
  getTagStatistics(): Array<{ tag: string; count: number }> {
    return Array.from(this.analytics.tagUsage.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([tag, count]) => ({ tag, count }));
  }
  
  /**
   * 🔧 MÉTODOS PRIVADOS
   */
  
  private extractRelevantFields(input: UserInput): any {
    // Extraer solo campos que afectan el resultado médico
    return {
      age: input.age,
      infertilityDuration: input.infertilityDuration,
      bmi: input.bmi,
      // Labs más relevantes
      amh: input.labs?.amh,
      fsh: input.labs?.fsh,
      // Historia relevante
      medicalHistory: input.medicalHistory?.sort(),
      symptoms: input.symptoms?.sort(),
      // Partner si existe
      partnerAge: input.partner?.age,
      spermAnalysis: input.partner?.spermAnalysis
    };
  }
  
  private isExpired(entry: CacheEntry<any>): boolean {
    const now = Date.now();
    const entryTime = entry.timestamp.getTime();
    return (now - entryTime) > entry.ttl;
  }
  
  private estimateSize(data: any): number {
    // Estimación simple del tamaño en bytes
    return JSON.stringify(data).length * 2; // Factor 2 para Unicode
  }
  
  private needsEviction(newEntrySize: number): boolean {
    const currentSize = Array.from(this.cache.values())
      .reduce((sum, entry) => sum + entry.size, 0);
    
    return (currentSize + newEntrySize > this.maxSize) || 
           (this.cache.size >= this.maxEntries);
  }
  
  private async performEviction(newEntrySize: number): Promise<void> {
    // Estrategia de desalojo: LRU con consideración de frecuencia
    const entries = Array.from(this.cache.entries())
      .map(([key, entry]) => ({
        key,
        entry,
        score: this.calculateEvictionScore(entry)
      }))
      .sort((a, b) => a.score - b.score); // Menor score = más probable de eliminar
    
    let freedSpace = 0;
    let deletedCount = 0;
    
    for (const { key, entry } of entries) {
      this.cache.delete(key);
      freedSpace += entry.size;
      deletedCount++;
      
      // Parar cuando tengamos suficiente espacio
      if (freedSpace >= newEntrySize && 
          this.cache.size < this.maxEntries * 0.8) {
        break;
      }
    }
    
    console.log(`🗑️ Cache eviction: ${deletedCount} entradas eliminadas, ${Math.round(freedSpace/1024)}KB liberados`);
  }
  
  private calculateEvictionScore(entry: CacheEntry<any>): number {
    const now = Date.now();
    const age = now - entry.timestamp.getTime();
    const timeSinceLastAccess = now - entry.lastAccess.getTime();
    
    // Score basado en: edad, último acceso, y frecuencia de uso
    // Menor score = más probable de eliminar
    const ageScore = age / (1000 * 60 * 60 * 24); // días
    const accessScore = timeSinceLastAccess / (1000 * 60 * 60); // horas
    const frequencyScore = 1 / Math.max(entry.accessCount, 1);
    
    return ageScore + accessScore + frequencyScore;
  }
  
  private recordHit(): void {
    this.hitCount++;
  }
  
  private recordMiss(): void {
    this.missCount++;
  }
  
  private recordAccessTime(time: number): void {
    this.totalAccessTime += time;
    this.accessCount++;
  }
  
  private startPeriodicCleanup(): void {
    // Limpiar entradas expiradas cada 5 minutos
    setInterval(() => {
      this.cleanupExpiredEntries();
    }, 5 * 60 * 1000);
  }
  
  private cleanupExpiredEntries(): void {
    let cleaned = 0;
    
    for (const [key, entry] of this.cache) {
      if (this.isExpired(entry)) {
        this.cache.delete(key);
        cleaned++;
      }
    }
    
    if (cleaned > 0) {
      console.log(`🧹 Limpieza automática: ${cleaned} entradas expiradas eliminadas`);
    }
  }
  
  private startPerformanceTracking(): void {
    // Registrar métricas cada 10 minutos
    setInterval(() => {
      const metrics = this.getMetrics();
      this.analytics.performanceHistory.push({
        timestamp: new Date(),
        hitRate: metrics.hitRate
      });
      
      // Mantener solo las últimas 144 entradas (24 horas)
      if (this.analytics.performanceHistory.length > 144) {
        this.analytics.performanceHistory = this.analytics.performanceHistory.slice(-144);
      }
    }, 10 * 60 * 1000);
  }
  
  /**
   * 📊 OPTIMIZACIONES DEL CACHE
   */
  optimize(): { optimizationsApplied: string[] } {
    const optimizations: string[] = [];
    
    // 1. Limpiar entradas expiradas
    const expiredCleaned = this.cleanupExpiredEntriesSync();
    if (expiredCleaned > 0) {
      optimizations.push(`${expiredCleaned} entradas expiradas eliminadas`);
    }
    
    // 2. Eliminar entradas poco usadas
    const lowUsageCleaned = this.cleanupLowUsageEntries();
    if (lowUsageCleaned > 0) {
      optimizations.push(`${lowUsageCleaned} entradas poco usadas eliminadas`);
    }
    
    // 3. Optimizar memoria
    if (global.gc && typeof global.gc === 'function') {
      const beforeMemory = process.memoryUsage().heapUsed;
      global.gc();
      const afterMemory = process.memoryUsage().heapUsed;
      const freedMemory = beforeMemory - afterMemory;
      
      if (freedMemory > 0) {
        optimizations.push(`${Math.round(freedMemory / 1024 / 1024)}MB de memoria liberados`);
      }
    }
    
    return { optimizationsApplied: optimizations };
  }
  
  private cleanupExpiredEntriesSync(): number {
    let cleaned = 0;
    
    for (const [key, entry] of this.cache) {
      if (this.isExpired(entry)) {
        this.cache.delete(key);
        cleaned++;
      }
    }
    
    return cleaned;
  }
  
  private cleanupLowUsageEntries(): number {
    const entries = Array.from(this.cache.entries());
    const averageAccess = entries.reduce((sum, [, entry]) => sum + entry.accessCount, 0) / entries.length;
    
    let cleaned = 0;
    
    for (const [key, entry] of entries) {
      // Eliminar entradas con muy poco uso y que son antiguas
      const isLowUsage = entry.accessCount < averageAccess * 0.1;
      const isOld = (Date.now() - entry.timestamp.getTime()) > (24 * 60 * 60 * 1000); // 24 horas
      
      if (isLowUsage && isOld) {
        this.cache.delete(key);
        cleaned++;
      }
    }
    
    return cleaned;
  }
}

export default IntelligentCache;
