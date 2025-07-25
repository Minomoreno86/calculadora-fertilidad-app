/**
 * ✅ CACHE OPTIMIZATION WORKER - INTELLIGENT CACHING SYSTEM
 * 
 * Specialized worker for high-performance caching with intelligent invalidation,
 * predictive pre-loading, and multi-layer cache management.
 */

import type { MedicalWorkerTask, WorkerResult } from '../UnifiedParallelEngine_V12';
import type { UserInput } from '../../domain/models';

// 🎯 TYPE DEFINITIONS FOR CACHE SYSTEM
type MedicalPriority = 'critical' | 'high' | 'medium' | 'low' | 'background';

type CacheData = {
  baseScore: number;
  adjustments: {
    hormonalFactors: number;
    medicalConditions: number;
    maleFactors: number;
  };
  recommendations: string[];
  timestamp: number;
};

// Separate interface for compressed cache entries
interface CompressedCacheEntry {
  key: string;
  data: string; // Compressed data as string
  timestamp: number;
  expiry: number;
  hitCount: number;
  lastAccessed: number;
  size: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface CacheEntry {
  key: string;
  data: CacheData;
  timestamp: number;
  expiry: number;
  hitCount: number;
  lastAccessed: number;
  size: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface CacheStats {
  totalEntries: number;
  totalSize: number;
  hitRatio: number;
  missCount: number;
  evictionCount: number;
  averageResponseTime: number;
}

export interface CacheOptimizationResult {
  cacheKey: string;
  data: CacheData;
  isCacheHit: boolean;
  responseTime: number;
  optimizations: CacheOptimization[];
  stats: CacheStats;
}

export interface CacheOptimization {
  type: 'preload' | 'compress' | 'partition' | 'evict';
  description: string;
  estimatedImprovement: number;
}

export class CacheOptimizationWorker {
  private readonly l1Cache: Map<string, CacheEntry>; // In-memory fast cache
  private readonly l2Cache: Map<string, CompressedCacheEntry>; // Compressed cache
  private readonly l3Cache: Map<string, CompressedCacheEntry>; // Persistent cache
  private readonly maxL1Size = 50; // MB
  private readonly maxL2Size = 200; // MB
  private readonly maxL3Size = 500; // MB
  private readonly stats: CacheStats;
  private readonly compressionEnabled = true;

  constructor() {
    this.l1Cache = new Map();
    this.l2Cache = new Map();
    this.l3Cache = new Map();
    this.stats = this.initializeStats();
    this.startMaintenanceTasks();
  }

  public async process(task: MedicalWorkerTask): Promise<WorkerResult> {
    const startTime = performance.now();
    
    try {
      const optimizationResult = await this.optimizeCache(task);
      
      return {
        taskId: task.id,
        workerId: 'cache_optimization',
        success: true,
        data: optimizationResult,
        confidence: 0.99, // Very high confidence in cache operations
        processingTime: performance.now() - startTime,
        recommendations: this.generateCacheRecommendations()
      };
    } catch (error) {
      return {
        taskId: task.id,
        workerId: 'cache_optimization',
        success: false,
        data: null,
        confidence: 0,
        processingTime: performance.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown cache error'
      };
    }
  }

  private async optimizeCache(task: MedicalWorkerTask): Promise<CacheOptimizationResult> {
    const cacheKey = this.generateCacheKey(task);
    const startTime = performance.now();

    // Try L1 cache first (fastest)
    let cacheEntry = this.l1Cache.get(cacheKey);
    let isCacheHit = false;
    let data: CacheData | null = null;

    if (cacheEntry && !this.isExpired(cacheEntry)) {
      data = cacheEntry.data;
      isCacheHit = true;
      this.updateAccessStats(cacheEntry);
      this.stats.hitRatio = this.calculateHitRatio();
    } else {
      // Try L2 cache (compressed)
      const compressedEntry = this.l2Cache.get(cacheKey);
      if (compressedEntry && !this.isExpiredCompressed(compressedEntry)) {
        data = await this.decompress(compressedEntry.data);
        this.promoteToL1(cacheKey, data);
        isCacheHit = true;
        this.updateAccessStatsCompressed(compressedEntry);
      } else {
        // Try L3 cache (persistent)
        const l3Entry = this.l3Cache.get(cacheKey);
        if (l3Entry && !this.isExpiredCompressed(l3Entry)) {
          data = await this.decompress(l3Entry.data);
          this.promoteToL2(cacheKey, data);
          isCacheHit = true;
          this.updateAccessStatsCompressed(l3Entry);
        } else {
          // Cache miss - generate data and store
          data = await this.generateFreshData(task);
          await this.storeInCache(cacheKey, data, task.priority || 'medium');
          this.stats.missCount++;
        }
      }
    }

    if (!data) {
      throw new Error('Failed to generate or retrieve cache data');
    }

    const responseTime = performance.now() - startTime;
    const optimizations = this.analyzeOptimizationOpportunities();

    return {
      cacheKey,
      data,
      isCacheHit,
      responseTime,
      optimizations,
      stats: { ...this.stats }
    };
  }

  private generateCacheKey(task: MedicalWorkerTask): string {
    // Generate deterministic cache key from task input
    const input = task.input;
    const keyParts = [
      task.type || 'default',
      input.age || 'noage',
      input.bmi || 'nobmi',
      input.hasPcos ? 'pcos' : 'nopcos',
      input.endometriosisGrade || 'noendo',
      input.amh || 'noamh',
      input.cycleDuration || 'nocycle',
      input.spermConcentration || 'nosperm'
    ];

    return keyParts.join('_').replace(/[^\w]/g, '_');
  }

  private isExpired(entry: CacheEntry): boolean {
    return Date.now() > entry.expiry;
  }

  private isExpiredCompressed(entry: CompressedCacheEntry): boolean {
    return Date.now() > entry.expiry;
  }

  private updateAccessStats(entry: CacheEntry): void {
    entry.hitCount++;
    entry.lastAccessed = Date.now();
  }

  private updateAccessStatsCompressed(entry: CompressedCacheEntry): void {
    entry.hitCount++;
    entry.lastAccessed = Date.now();
  }

  private calculateHitRatio(): number {
    const l1Hits = Array.from(this.l1Cache.values()).reduce((sum, entry) => sum + entry.hitCount, 0);
    const l2Hits = Array.from(this.l2Cache.values()).reduce((sum, entry) => sum + entry.hitCount, 0);
    const l3Hits = Array.from(this.l3Cache.values()).reduce((sum, entry) => sum + entry.hitCount, 0);
    
    const totalRequests = this.stats.missCount + l1Hits + l2Hits + l3Hits;
    const totalHits = l1Hits + l2Hits + l3Hits;
    
    return totalRequests > 0 ? totalHits / totalRequests : 0;
  }

  private async promoteToL1(key: string, data: CacheData): Promise<void> {
    if (this.getCurrentCacheSize(this.l1Cache) > this.maxL1Size) {
      await this.evictLeastUsed(this.l1Cache);
    }

    const entry: CacheEntry = {
      key,
      data,
      timestamp: Date.now(),
      expiry: Date.now() + (30 * 60 * 1000), // 30 minutes
      hitCount: 1,
      lastAccessed: Date.now(),
      size: this.estimateSize(data),
      priority: 'high'
    };

    this.l1Cache.set(key, entry);
  }

  private async promoteToL2(key: string, data: CacheData): Promise<void> {
    if (this.getCurrentCompressedCacheSize(this.l2Cache) > this.maxL2Size) {
      await this.evictLeastUsedCompressed(this.l2Cache);
    }

    const compressedData = await this.compress(data);
    const entry: CompressedCacheEntry = {
      key,
      data: compressedData,
      timestamp: Date.now(),
      expiry: Date.now() + (2 * 60 * 60 * 1000), // 2 hours
      hitCount: 1,
      lastAccessed: Date.now(),
      size: this.estimateCompressedSize(compressedData),
      priority: 'medium'
    };

    this.l2Cache.set(key, entry);
    this.promoteToL1(key, data); // Also store in L1 for fast access
  }

  private async storeInCache(key: string, data: CacheData, priority: MedicalPriority): Promise<void> {
    // Store in all three levels with different retention times
    await this.promoteToL1(key, data);
    
    // L2 with compression
    const compressedData = await this.compress(data);
    const l2Entry: CompressedCacheEntry = {
      key,
      data: compressedData,
      timestamp: Date.now(),
      expiry: Date.now() + (2 * 60 * 60 * 1000), // 2 hours
      hitCount: 0,
      lastAccessed: Date.now(),
      size: this.estimateCompressedSize(compressedData),
      priority: this.mapPriorityToCachePriority(priority)
    };
    
    if (this.getCurrentCompressedCacheSize(this.l2Cache) > this.maxL2Size) {
      await this.evictLeastUsedCompressed(this.l2Cache);
    }
    this.l2Cache.set(key, l2Entry);

    // L3 persistent
    const l3Entry: CompressedCacheEntry = {
      key,
      data: compressedData,
      timestamp: Date.now(),
      expiry: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
      hitCount: 0,
      lastAccessed: Date.now(),
      size: this.estimateCompressedSize(compressedData),
      priority: this.mapPriorityToCachePriority(priority)
    };
    
    if (this.getCurrentCompressedCacheSize(this.l3Cache) > this.maxL3Size) {
      await this.evictLeastUsedCompressed(this.l3Cache);
    }
    this.l3Cache.set(key, l3Entry);
  }

  private mapPriorityToCachePriority(priority: MedicalPriority): CacheEntry['priority'] {
    switch (priority) {
      case 'critical': return 'critical';
      case 'high': return 'high';
      case 'medium': return 'medium';
      case 'low': return 'low';
      case 'background': return 'low';
      default: return 'medium';
    }
  }

  private async generateFreshData(task: MedicalWorkerTask): Promise<CacheData> {
    // This would typically call other workers to generate fresh data
    // For now, we'll simulate the calculation process
    
    const input = task.input;
    const calculations = {
      baseScore: this.calculateBaseScore(input),
      adjustments: this.calculateAdjustments(input),
      recommendations: this.generateRecommendations(input),
      timestamp: Date.now()
    };

    return calculations;
  }

  private calculateBaseScore(input: UserInput): number {
    let score = 0.5; // Base 50%

    // Age factor
    if (input.age) {
      if (input.age < 30) score += 0.2;
      else if (input.age < 35) score += 0.1;
      else if (input.age < 40) score -= 0.1;
      else score -= 0.3;
    }

    // BMI factor
    if (input.bmi) {
      if (input.bmi >= 18.5 && input.bmi < 25) score += 0.1;
      else if (input.bmi >= 25 && input.bmi < 30) score -= 0.05;
      else if (input.bmi >= 30) score -= 0.15;
    }

    return Math.max(0, Math.min(1, score));
  }

  private calculateAdjustments(input: UserInput): CacheData['adjustments'] {
    return {
      hormonalFactors: input.amh ? input.amh * 0.1 : 0,
      medicalConditions: input.hasPcos ? -0.1 : 0,
      maleFactors: input.spermConcentration ? Math.min(input.spermConcentration / 100, 0.2) : 0
    };
  }

  private generateRecommendations(input: UserInput): string[] {
    const recommendations = [];
    
    if (input.age >= 35) {
      recommendations.push('Considerar evaluación urgente de fertilidad');
    }
    
    if (input.bmi && input.bmi >= 30) {
      recommendations.push('Optimización del peso antes del tratamiento');
    }
    
    if (input.hasPcos) {
      recommendations.push('Manejo especializado de PCOS');
    }

    return recommendations;
  }

  private async compress(data: CacheData): Promise<string> {
    if (!this.compressionEnabled) return JSON.stringify(data);
    
    // Simulate compression - in real implementation, use actual compression library
    const jsonString = JSON.stringify(data);
    return btoa(jsonString); // Base64 encoding as simple "compression"
  }

  private async decompress(compressedData: string): Promise<CacheData> {
    if (!this.compressionEnabled) return JSON.parse(compressedData);
    
    try {
      const decodedString = atob(compressedData);
      return JSON.parse(decodedString);
    } catch {
      // Fallback for uncompressed data
      return JSON.parse(compressedData);
    }
  }

  private estimateSize(data: CacheData): number {
    // Rough size estimation in bytes
    return JSON.stringify(data).length * 2; // UTF-16 encoding
  }

  private estimateCompressedSize(data: string): number {
    // Rough size estimation in bytes for compressed string
    return data.length * 2; // UTF-16 encoding
  }

  private getCurrentCacheSize(cache: Map<string, CacheEntry>): number {
    return Array.from(cache.values()).reduce((total, entry) => total + entry.size, 0) / (1024 * 1024); // MB
  }

  private getCurrentCompressedCacheSize(cache: Map<string, CompressedCacheEntry>): number {
    return Array.from(cache.values()).reduce((total, entry) => total + entry.size, 0) / (1024 * 1024); // MB
  }

  private async evictLeastUsed(cache: Map<string, CacheEntry>): Promise<void> {
    const entries = Array.from(cache.entries());
    
    // Sort by usage score (combination of hit count, recency, and priority)
    entries.sort(([, a], [, b]) => {
      const scoreA = this.calculateUsageScore(a);
      const scoreB = this.calculateUsageScore(b);
      return scoreA - scoreB;
    });

    // Evict bottom 20% of entries
    const evictCount = Math.max(1, Math.floor(entries.length * 0.2));
    for (let i = 0; i < evictCount; i++) {
      const entryToDelete = entries[i];
      if (entryToDelete) {
        cache.delete(entryToDelete[0]);
        this.stats.evictionCount++;
      }
    }
  }

  private async evictLeastUsedCompressed(cache: Map<string, CompressedCacheEntry>): Promise<void> {
    const entries = Array.from(cache.entries());
    
    // Sort by usage score (combination of hit count, recency, and priority)
    entries.sort(([, a], [, b]) => {
      const scoreA = this.calculateUsageScoreCompressed(a);
      const scoreB = this.calculateUsageScoreCompressed(b);
      return scoreA - scoreB;
    });

    // Evict bottom 20% of entries
    const evictCount = Math.max(1, Math.floor(entries.length * 0.2));
    for (let i = 0; i < evictCount; i++) {
      const entryToDelete = entries[i];
      if (entryToDelete) {
        cache.delete(entryToDelete[0]);
        this.stats.evictionCount++;
      }
    }
  }

  private calculateUsageScore(entry: CacheEntry): number {
    const now = Date.now();
    const ageHours = (now - entry.timestamp) / (1000 * 60 * 60);
    const lastAccessHours = (now - entry.lastAccessed) / (1000 * 60 * 60);
    
    let score = entry.hitCount * 10; // Base score from hit count
    score -= ageHours * 0.5; // Penalty for age
    score -= lastAccessHours * 0.8; // Penalty for not being accessed recently
    
    // Priority bonus
    switch (entry.priority) {
      case 'critical': score += 100; break;
      case 'high': score += 50; break;
      case 'medium': score += 20; break;
      case 'low': score += 0; break;
    }

    return score;
  }

  private calculateUsageScoreCompressed(entry: CompressedCacheEntry): number {
    const now = Date.now();
    const ageHours = (now - entry.timestamp) / (1000 * 60 * 60);
    const lastAccessHours = (now - entry.lastAccessed) / (1000 * 60 * 60);
    
    let score = entry.hitCount * 8; // Slightly different base score for compressed entries
    score -= ageHours * 0.6; // Different penalty for age
    score -= lastAccessHours * 0.7; // Different penalty for not being accessed recently
    
    // Priority bonus with compression factor
    switch (entry.priority) {
      case 'critical': score += 90; break;
      case 'high': score += 45; break;
      case 'medium': score += 18; break;
      case 'low': score += 0; break;
    }

    // Bonus for compression efficiency
    score += entry.size < 1000 ? 5 : 0;

    return score;
  }

  private analyzeOptimizationOpportunities(): CacheOptimization[] {
    const optimizations: CacheOptimization[] = [];

    // Analyze hit ratio
    if (this.stats.hitRatio < 0.8) {
      optimizations.push({
        type: 'preload',
        description: 'Precargar datos frecuentemente accedidos',
        estimatedImprovement: 15
      });
    }

    // Analyze cache size usage
    const l1Usage = this.getCurrentCacheSize(this.l1Cache) / this.maxL1Size;
    if (l1Usage > 0.9) {
      optimizations.push({
        type: 'compress',
        description: 'Aumentar compresión para liberar espacio L1',
        estimatedImprovement: 25
      });
    }

    // Analyze eviction frequency
    if (this.stats.evictionCount > 100) {
      optimizations.push({
        type: 'partition',
        description: 'Particionar cache por tipo de consulta',
        estimatedImprovement: 20
      });
    }

    // Analyze expired entries
    const expiredL1 = Array.from(this.l1Cache.values()).filter(this.isExpired).length;
    if (expiredL1 > 10) {
      optimizations.push({
        type: 'evict',
        description: 'Limpiar entradas expiradas del cache L1',
        estimatedImprovement: 10
      });
    }

    return optimizations;
  }

  private generateCacheRecommendations(): string[] {
    const recommendations = [];

    if (this.stats.hitRatio < 0.7) {
      recommendations.push('Mejorar estrategias de precarga de cache');
    }

    if (this.stats.averageResponseTime > 50) {
      recommendations.push('Optimizar algoritmos de compresión');
    }

    if (this.stats.evictionCount > 200) {
      recommendations.push('Aumentar tamaño de cache L1 y L2');
    }

    return recommendations;
  }

  private initializeStats(): CacheStats {
    return {
      totalEntries: 0,
      totalSize: 0,
      hitRatio: 0,
      missCount: 0,
      evictionCount: 0,
      averageResponseTime: 0
    };
  }

  private startMaintenanceTasks(): void {
    // Cleanup expired entries every 5 minutes
    setInterval(() => {
      this.cleanupExpiredEntries();
    }, 5 * 60 * 1000);

    // Update statistics every minute
    setInterval(() => {
      this.updateStatistics();
    }, 60 * 1000);
  }

  private cleanupExpiredEntries(): void {
    // Clean L1 cache
    const l1EntriesToDelete: string[] = [];
    this.l1Cache.forEach((entry, key) => {
      if (this.isExpired(entry)) {
        l1EntriesToDelete.push(key);
        this.stats.evictionCount++;
      }
    });
    l1EntriesToDelete.forEach(key => this.l1Cache.delete(key));

    // Clean L2 and L3 compressed caches
    [this.l2Cache, this.l3Cache].forEach(cache => {
      const entriesToDelete: string[] = [];
      
      cache.forEach((entry, key) => {
        if (this.isExpiredCompressed(entry)) {
          entriesToDelete.push(key);
          this.stats.evictionCount++;
        }
      });
      
      entriesToDelete.forEach(key => cache.delete(key));
    });
  }

  private updateStatistics(): void {
    this.stats.totalEntries = this.l1Cache.size + this.l2Cache.size + this.l3Cache.size;
    this.stats.totalSize = this.getCurrentCacheSize(this.l1Cache) + 
                          this.getCurrentCompressedCacheSize(this.l2Cache) + 
                          this.getCurrentCompressedCacheSize(this.l3Cache);
    this.stats.hitRatio = this.calculateHitRatio();
  }

  // Public methods for external cache management
  public async preloadData(keys: string[], priority: MedicalPriority = 'medium'): Promise<void> {
    for (const key of keys) {
      if (!this.l1Cache.has(key) && !this.l2Cache.has(key) && !this.l3Cache.has(key)) {
        // Generate and cache data proactively
        const mockTask: MedicalWorkerTask = {
          id: `preload_${key}`,
          type: 'cache_optimization',
          input: this.parseKeyToInput(key),
          priority: priority,
          timestamp: Date.now()
        };
        
        const data = await this.generateFreshData(mockTask);
        await this.storeInCache(key, data, priority);
      }
    }
  }

  public getCacheStats(): CacheStats {
    return { ...this.stats };
  }

  public clearCache(level?: 'L1' | 'L2' | 'L3'): void {
    switch (level) {
      case 'L1': this.l1Cache.clear(); break;
      case 'L2': this.l2Cache.clear(); break;
      case 'L3': this.l3Cache.clear(); break;
      default:
        this.l1Cache.clear();
        this.l2Cache.clear();
        this.l3Cache.clear();
        break;
    }
  }

  private parseKeyToInput(key: string): UserInput {
    // Parse cache key back to UserInput (simplified)
    const parts = key.split('_');
    return {
      age: parts[1] && parts[1] !== 'noage' ? parseInt(parts[1], 10) : undefined,
      bmi: parts[2] && parts[2] !== 'nobmi' ? parseFloat(parts[2]) : null,
      hasPcos: parts[3] === 'pcos',
      endometriosisGrade: parts[4] && parts[4] !== 'noendo' ? parseInt(parts[4], 10) : undefined
    } as UserInput;
  }
}
