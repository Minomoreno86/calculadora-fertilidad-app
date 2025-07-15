// ===================================================================
// 🚀 SISTEMA DE CACHE AVANZADO PARA FORMULARIOS
// ===================================================================

// 🎯 CONFIGURACIÓN DE CACHE
const CACHE_SIZE = 50; // máximo de resultados en cache
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

// 💾 INTERFACES DE CACHE
interface FormCache {
  validationCache: Map<string, { isValid: boolean; errors: Record<string, unknown>; timestamp: number }>;
  calculationCache: Map<string, { result: unknown; timestamp: number }>;
  bmiCache: Map<string, number>;
  homaCache: Map<string, number>;
}

interface CacheStats {
  validationCacheSize: number;
  calculationCacheSize: number;
  bmiCacheSize: number;
  homaCacheSize: number;
  totalSize: number;
  hitRate: number;
}

class FormCacheManager {
  private readonly cache: FormCache = {
    validationCache: new Map(),
    calculationCache: new Map(),
    bmiCache: new Map(),
    homaCache: new Map()
  };

  private hitCount = 0;
  private missCount = 0;

  // 🔑 Generar hash para campos relevantes
  private generateHash(data: Record<string, unknown>): string {
    const relevantFields = JSON.stringify(data);
    return btoa(relevantFields).substring(0, 16);
  }

  // 💾 Cache de validación
  getCachedValidation(formData: Record<string, unknown>) {
    const hash = this.generateHash(formData);
    const cached = this.cache.validationCache.get(hash);
    
    if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
      this.hitCount++;
      console.log('🎯 CACHE HIT - Validación formulario');
      return cached;
    }
    this.missCount++;
    return null;
  }

  setCachedValidation(formData: Record<string, unknown>, validation: { isValid: boolean; errors: Record<string, unknown> }) {
    const hash = this.generateHash(formData);
    this.cache.validationCache.set(hash, {
      ...validation,
      timestamp: Date.now()
    });
    this._cleanupCache(this.cache.validationCache);
  }

  // 💾 Cache de cálculos BMI
  getCachedBmi(height: number, weight: number): number | null {
    const key = `${height}-${weight}`;
    const cached = this.cache.bmiCache.get(key);
    if (cached !== undefined) {
      this.hitCount++;
      console.log('🎯 CACHE HIT - BMI');
      return cached;
    }
    this.missCount++;
    return null;
  }

  setCachedBmi(height: number, weight: number, bmi: number) {
    const key = `${height}-${weight}`;
    this.cache.bmiCache.set(key, bmi);
    this._cleanupCache(this.cache.bmiCache);
  }

  // 💾 Cache de cálculos HOMA
  getCachedHoma(insulin: number, glucose: number): number | null {
    const key = `${insulin}-${glucose}`;
    const cached = this.cache.homaCache.get(key);
    if (cached !== undefined) {
      this.hitCount++;
      console.log('🎯 CACHE HIT - HOMA');
      return cached;
    }
    this.missCount++;
    return null;
  }

  setCachedHoma(insulin: number, glucose: number, homa: number) {
    const key = `${insulin}-${glucose}`;
    this.cache.homaCache.set(key, homa);
    this._cleanupCache(this.cache.homaCache);
  }

  // 🧹 Limpieza de cache
  private _cleanupCache<T>(cache: Map<string, T>) {
    if (cache.size > CACHE_SIZE) {
      const entries = Array.from(cache.entries());
      const toRemove = Math.floor(cache.size * 0.3); // Remover 30%
      
      for (let i = 0; i < toRemove; i++) {
        cache.delete(entries[i][0]);
      }
      console.log(`🧹 Cache cleanup: removidos ${toRemove} elementos`);
    }
  }

  // 📊 Estadísticas de cache
  getStats(): CacheStats {
    const totalRequests = this.hitCount + this.missCount;
    return {
      validationCacheSize: this.cache.validationCache.size,
      calculationCacheSize: this.cache.calculationCache.size,
      bmiCacheSize: this.cache.bmiCache.size,
      homaCacheSize: this.cache.homaCache.size,
      totalSize: this.cache.validationCache.size + this.cache.calculationCache.size + 
                this.cache.bmiCache.size + this.cache.homaCache.size,
      hitRate: totalRequests > 0 ? (this.hitCount / totalRequests) * 100 : 0
    };
  }

  clearCache() {
    this.cache.validationCache.clear();
    this.cache.calculationCache.clear();
    this.cache.bmiCache.clear();
    this.cache.homaCache.clear();
    this.hitCount = 0;
    this.missCount = 0;
    console.log('🧹 Cache completamente limpiado');
  }

  // 🔄 Limpiar cache expirado
  cleanExpiredCache() {
    const now = Date.now();
    let removedCount = 0;

    // Limpiar cache de validación expirado
    for (const [key, value] of this.cache.validationCache.entries()) {
      if (now - value.timestamp > CACHE_TTL) {
        this.cache.validationCache.delete(key);
        removedCount++;
      }
    }

    if (removedCount > 0) {
      console.log(`🧹 Cache expirado: removidos ${removedCount} elementos`);
    }
  }
}

// 🌟 Instancia global del cache manager
const formCacheManager = new FormCacheManager();

// 📊 Hook para usar el cache
export const useFormCache = () => {
  return {
    getBmi: formCacheManager.getCachedBmi.bind(formCacheManager),
    setBmi: formCacheManager.setCachedBmi.bind(formCacheManager),
    getHoma: formCacheManager.getCachedHoma.bind(formCacheManager),
    setHoma: formCacheManager.setCachedHoma.bind(formCacheManager),
    getValidation: formCacheManager.getCachedValidation.bind(formCacheManager),
    setValidation: formCacheManager.setCachedValidation.bind(formCacheManager),
    getStats: formCacheManager.getStats.bind(formCacheManager),
    clearCache: formCacheManager.clearCache.bind(formCacheManager),
    cleanExpired: formCacheManager.cleanExpiredCache.bind(formCacheManager)
  };
};

export default formCacheManager;
