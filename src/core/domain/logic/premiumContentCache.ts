/**
 * 🌟 PREMIUM CONTENT CACHE & OPTIMIZATION
 * Sistema de cache avanzado para contenido premium del Dr. IA
 * Parte del sistema monetizable - funcionalidades premium
 */

// 🚀 CACHE MANAGER PREMIUM PARA DR. IA
export class PremiumContentCache {
  private readonly cache = new Map<string, { data: unknown; timestamp: number; accessCount: number }>();
  private readonly CACHE_TTL = 15 * 60 * 1000; // 15 minutos para premium
  private readonly MAX_CACHE_SIZE = 200; // Más espacio para contenido premium

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (entry && (Date.now() - entry.timestamp) < this.CACHE_TTL) {
      entry.accessCount++;
      return entry.data as T;
    }
    
    return null;
  }

  set<T>(key: string, data: T): void {
    if (this.cache.size >= this.MAX_CACHE_SIZE) {
      this._cleanupCache();
    }
    
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      accessCount: 1
    });
  }

  private _cleanupCache(): void {
    const entries = Array.from(this.cache.entries());
    entries.sort((a, b) => a[1].accessCount - b[1].accessCount);
    
    const toRemove = Math.floor(entries.length * 0.3);
    for (let i = 0; i < toRemove; i++) {
      const entry = entries[i];
      if (entry) {
        this.cache.delete(entry[0]);
      }
    }
  }

  getCacheStats() {
    return {
      size: this.cache.size,
      maxSize: this.MAX_CACHE_SIZE,
      utilization: Math.round((this.cache.size / this.MAX_CACHE_SIZE) * 100)
    };
  }
}

// 🌟 Instancia global de cache premium
const premiumContentCache = new PremiumContentCache();

// 🚀 FUNCIONES DE ACCESO OPTIMIZADAS PARA CONTENIDO PREMIUM
export const getPremiumContentOptimized = <T>(
  source: Record<string, T>, 
  key: string, 
  category: string
): T | null => {
  const cacheKey = `${category}_${key}`;
  
  let content = premiumContentCache.get<T>(cacheKey);
  
  if (!content) {
    content = source[key] ?? null;
    if (content) {
      premiumContentCache.set(cacheKey, content);
    }
  }
  
  return content;
};

// 🚀 PRELOAD DE CONTENIDO PREMIUM MÁS USADO
export const preloadPremiumContent = (): void => {
  const commonKeys = [
    'age_advanced', 'bmi_obesity', 'amh_low', 'pcos_anovulatory', 'male_severe'
  ];
  
  setTimeout(() => {
    commonKeys.forEach(key => {
      // Simular acceso para precargar (se puede expandir según estructura real)
      premiumContentCache.set(`preload_${key}`, { loaded: true });
    });
  }, 200);
};

// 🚀 OBTENER ESTADÍSTICAS DEL CACHE PREMIUM
export const getPremiumCacheStats = () => premiumContentCache.getCacheStats();
