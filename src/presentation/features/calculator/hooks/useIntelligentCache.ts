// ===================================================================
// 🚀 SISTEMA DE CACHE INTELIGENTE PARA VALIDACIONES
// ===================================================================

import { useEffect, useCallback, useRef } from 'react';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  accessCount: number;
  size: number; // Estimado en bytes
}

interface CacheConfig {
  maxSize: number;          // Tamaño máximo en MB
  maxEntries: number;       // Número máximo de entradas
  ttl: number;             // Time to live en ms
  compressionEnabled: boolean; // Comprimir entradas grandes
  evictionStrategy: 'lru' | 'lfu' | 'size'; // Estrategia de desalojo
}

interface CacheStats {
  totalEntries: number;
  totalSize: number;
  hitRate: number;
  missCount: number;
  hitCount: number;
}

const DEFAULT_CONFIG: CacheConfig = {
  maxSize: 10, // 10MB
  maxEntries: 1000,
  ttl: 5 * 60 * 1000, // 5 minutos
  compressionEnabled: true,
  evictionStrategy: 'lru'
};

/**
 * Hook de cache inteligente para resultados de validación
 */
export function useIntelligentCache<T>(config: Partial<CacheConfig> = {}) {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const cacheRef = useRef<Map<string, CacheEntry<T>>>(new Map());
  const statsRef = useRef<CacheStats>({
    totalEntries: 0,
    totalSize: 0,
    hitRate: 0,
    missCount: 0,
    hitCount: 0
  });

  // 📊 Función para estimar el tamaño de un objeto
  const estimateSize = useCallback((data: T): number => {
    try {
      const jsonString = JSON.stringify(data);
      return new Blob([jsonString]).size;
    } catch {
      return 1024; // Valor por defecto 1KB
    }
  }, []);

  // 🧹 Limpiar entradas expiradas
  const cleanupExpired = useCallback(() => {
    const now = Date.now();
    const cache = cacheRef.current;
    
    for (const [key, entry] of cache.entries()) {
      if (now - entry.timestamp > finalConfig.ttl) {
        cache.delete(key);
        statsRef.current.totalEntries--;
        statsRef.current.totalSize -= entry.size;
      }
    }
  }, [finalConfig.ttl]);

  // 🚀 Desalojar entradas según estrategia
  const evictEntries = useCallback(() => {
    const cache = cacheRef.current;
    const entries = Array.from(cache.entries());
    
    // Ordenar según estrategia
    switch (finalConfig.evictionStrategy) {
      case 'lru':
        entries.sort(([, a], [, b]) => a.timestamp - b.timestamp);
        break;
      case 'lfu':
        entries.sort(([, a], [, b]) => a.accessCount - b.accessCount);
        break;
      case 'size':
        entries.sort(([, a], [, b]) => b.size - a.size);
        break;
    }
    
    // Remover las primeras entradas (menos útiles)
    const entriesToRemove = Math.ceil(entries.length * 0.1); // 10% de las entradas
    for (let i = 0; i < entriesToRemove && entries.length > 0; i++) {
      const [key, entry] = entries[i];
      cache.delete(key);
      statsRef.current.totalEntries--;
      statsRef.current.totalSize -= entry.size;
    }
  }, [finalConfig.evictionStrategy]);

  // 💾 Almacenar en cache
  const set = useCallback((key: string, data: T): void => {
    const cache = cacheRef.current;
    const size = estimateSize(data);
    const timestamp = Date.now();
    
    // Verificar límites antes de agregar
    const sizeInMB = statsRef.current.totalSize / (1024 * 1024);
    
    if (sizeInMB + (size / (1024 * 1024)) > finalConfig.maxSize || 
        cache.size >= finalConfig.maxEntries) {
      // Limpiar expirados primero
      cleanupExpired();
      
      // Si aún excede límites, desalojar entradas
      if (cache.size >= finalConfig.maxEntries * 0.9) {
        evictEntries();
      }
    }
    
    // Actualizar entrada existente o crear nueva
    const existingEntry = cache.get(key);
    if (existingEntry) {
      statsRef.current.totalSize -= existingEntry.size;
    } else {
      statsRef.current.totalEntries++;
    }
    
    cache.set(key, {
      data,
      timestamp,
      accessCount: 1,
      size
    });
    
    statsRef.current.totalSize += size;
  }, [estimateSize, finalConfig.maxSize, finalConfig.maxEntries, cleanupExpired, evictEntries]);

  // 🎯 Obtener del cache
  const get = useCallback((key: string): T | null => {
    const cache = cacheRef.current;
    const entry = cache.get(key);
    
    if (!entry) {
      statsRef.current.missCount++;
      return null;
    }
    
    // Verificar si ha expirado
    const now = Date.now();
    if (now - entry.timestamp > finalConfig.ttl) {
      cache.delete(key);
      statsRef.current.totalEntries--;
      statsRef.current.totalSize -= entry.size;
      statsRef.current.missCount++;
      return null;
    }
    
    // Actualizar estadísticas de acceso
    entry.accessCount++;
    entry.timestamp = now; // LRU update
    statsRef.current.hitCount++;
    
    return entry.data;
  }, [finalConfig.ttl]);

  // 🔑 Generar clave de cache para validaciones
  const generateValidationKey = useCallback((
    formData: Record<string, unknown>,
    validationType: string,
    additionalContext?: Record<string, unknown>
  ): string => {
    const keyData = {
      formData,
      validationType,
      context: additionalContext,
      timestamp: Math.floor(Date.now() / (60 * 1000)) // Granularidad de minuto
    };
    
    try {
      return btoa(JSON.stringify(keyData)).substring(0, 50);
    } catch {
      // Fallback para datos no serializables
      return `${validationType}_${Object.keys(formData).join('_')}_${Date.now()}`;
    }
  }, []);

  // 📊 Obtener estadísticas actualizadas
  const getStats = useCallback((): CacheStats => {
    const totalRequests = statsRef.current.hitCount + statsRef.current.missCount;
    const hitRate = totalRequests > 0 ? (statsRef.current.hitCount / totalRequests) * 100 : 0;
    
    return {
      ...statsRef.current,
      hitRate: Math.round(hitRate * 100) / 100,
      totalSize: Math.round(statsRef.current.totalSize / 1024) // KB
    };
  }, []);

  // 🧹 Limpiar cache manualmente
  const clear = useCallback(() => {
    cacheRef.current.clear();
    statsRef.current = {
      totalEntries: 0,
      totalSize: 0,
      hitRate: 0,
      missCount: 0,
      hitCount: 0
    };
  }, []);

  // 🔄 Hook para limpieza periódica
  useEffect(() => {
    const interval = setInterval(cleanupExpired, 60000); // Cada minuto
    return () => clearInterval(interval);
  }, [cleanupExpired]);

  return {
    // Operaciones básicas
    set,
    get,
    clear,
    
    // Utilidades para validaciones
    generateValidationKey,
    
    // Estadísticas y monitoreo
    getStats,
    
    // Configuración aplicada
    config: finalConfig,
    
    // Debug info
    debugInfo: {
      cacheSize: cacheRef.current.size,
      totalSize: statsRef.current.totalSize,
      hitRate: getStats().hitRate
    }
  };
}
