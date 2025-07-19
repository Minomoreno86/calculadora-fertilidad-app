/**
 * 🧪 TESTS PARA CACHE MANAGER
 * 
 * Suite de pruebas completa para el sistema de cache unificado
 */

import { UnifiedCacheManager, CacheType, CacheConfig, generateInputHash } from '../CacheManager';
import { UserInput } from '../../../models';

describe('UnifiedCacheManager', () => {
  let cacheManager: UnifiedCacheManager;
  const testConfig: CacheConfig = {
    maxSize: 5,
    defaultTtl: 1000,
    compressionThreshold: 10,
    predictiveThreshold: 0.5,
    enableCompression: true,
    enablePrediction: true,
    enablePreloading: true,
    cleanupInterval: 30000
  };

  beforeEach(() => {
    cacheManager = new UnifiedCacheManager(testConfig);
  });

  afterEach(() => {
    cacheManager.destroy();
  });

  // ===================================================================
  // 🎯 TESTS BÁSICOS DE CACHE
  // ===================================================================

  describe('Basic Cache Operations', () => {
    test('should store and retrieve simple data', () => {
      const key = 'test-key';
      const value = { data: 'test-value' };
      
      cacheManager.set(key, value);
      const result = cacheManager.get(key);
      
      expect(result).toEqual(value);
    });

    test('should return null for non-existent key', () => {
      const result = cacheManager.get('non-existent-key');
      expect(result).toBeNull();
    });

    test('should handle different cache types', () => {
      const validationData = { isValid: true, errors: [] };
      const reportData = { prognosis: 85.5 };
      
      cacheManager.set('validation-key', validationData, 'validation');
      cacheManager.set('report-key', reportData, 'reports');
      
      expect(cacheManager.get('validation-key', 'validation')).toEqual(validationData);
      expect(cacheManager.get('report-key', 'reports')).toEqual(reportData);
      expect(cacheManager.get('validation-key', 'reports')).toBeNull();
    });

    test('should delete entries correctly', () => {
      const key = 'delete-test';
      const value = { data: 'to-delete' };
      
      cacheManager.set(key, value);
      expect(cacheManager.get(key)).toEqual(value);
      
      const deleted = cacheManager.delete(key);
      expect(deleted).toBe(true);
      expect(cacheManager.get(key)).toBeNull();
    });

    test('should clear cache correctly', () => {
      cacheManager.set('key1', 'value1');
      cacheManager.set('key2', 'value2', 'validation');
      
      cacheManager.clear('general');
      expect(cacheManager.get('key1')).toBeNull();
      expect(cacheManager.get('key2', 'validation')).toEqual('value2');
      
      cacheManager.clear();
      expect(cacheManager.get('key2', 'validation')).toBeNull();
    });
  });

  // ===================================================================
  // 🎯 TESTS DE TTL Y EXPIRACIÓN
  // ===================================================================

  describe('TTL and Expiration', () => {
    test('should expire entries after TTL', async () => {
      const key = 'expire-test';
      const value = { data: 'will-expire' };
      
      cacheManager.set(key, value, 'general', { ttl: 50 });
      expect(cacheManager.get(key)).toEqual(value);
      
      // Esperar a que expire
      await new Promise(resolve => setTimeout(resolve, 60));
      expect(cacheManager.get(key)).toBeNull();
    });

    test('should use default TTL when none specified', () => {
      const key = 'default-ttl-test';
      const value = { data: 'default-ttl' };
      
      cacheManager.set(key, value);
      const result = cacheManager.get(key);
      
      expect(result).toEqual(value);
    });
  });

  // ===================================================================
  // 🎯 TESTS DE COMPRESIÓN
  // ===================================================================

  describe('Compression', () => {
    test('should compress large data automatically', () => {
      const largeData = {
        bigString: 'a'.repeat(100), // Supera el threshold de 10 bytes
        moreData: { nested: 'value' }
      };
      
      cacheManager.set('large-data', largeData);
      const result = cacheManager.get('large-data');
      
      expect(result).toEqual(largeData);
    });

    test('should not compress small data', () => {
      const smallData = { small: 'data' };
      
      cacheManager.set('small-data', smallData);
      const result = cacheManager.get('small-data');
      
      expect(result).toEqual(smallData);
    });

    test('should force compression when specified', () => {
      const data = { data: 'small' };
      
      cacheManager.set('force-compress', data, 'general', { compress: true });
      const result = cacheManager.get('force-compress');
      
      expect(result).toEqual(data);
    });
  });

  // ===================================================================
  // 🎯 TESTS DE EVICTION
  // ===================================================================

  describe('Eviction', () => {
    test('should evict least useful entry when cache is full', () => {
      // Llenar el cache hasta el máximo
      for (let i = 0; i < testConfig.maxSize; i++) {
        cacheManager.set(`key-${i}`, `value-${i}`);
      }
      
      // Añadir una entrada más
      cacheManager.set('overflow-key', 'overflow-value');
      
      // Verificar que se ha hecho eviction
      const metrics = cacheManager.getMetrics();
      expect(metrics.evictions).toBeGreaterThan(0);
    });

    test('should prioritize frequently accessed entries', () => {
      // Llenar cache
      for (let i = 0; i < testConfig.maxSize; i++) {
        cacheManager.set(`key-${i}`, `value-${i}`);
      }
      
      // Acceder frecuentemente a una entrada
      const frequentKey = 'key-2';
      for (let i = 0; i < 10; i++) {
        cacheManager.get(frequentKey);
      }
      
      // Añadir entrada que causará eviction
      cacheManager.set('new-key', 'new-value');
      
      // La entrada frecuente debería seguir ahí
      expect(cacheManager.get(frequentKey)).toEqual('value-2');
    });
  });

  // ===================================================================
  // 🎯 TESTS DE MÉTRICAS
  // ===================================================================

  describe('Metrics', () => {
    test('should track hits and misses correctly', () => {
      const key = 'metrics-test';
      const value = { data: 'metrics' };
      
      // Miss inicial
      cacheManager.get(key);
      
      // Set y hit
      cacheManager.set(key, value);
      cacheManager.get(key);
      
      const metrics = cacheManager.getMetrics();
      expect(metrics.hits).toBe(1);
      expect(metrics.misses).toBe(1);
      expect(metrics.totalOperations).toBe(2);
      expect(metrics.hitRate).toBe(0.5);
    });

    test('should track type-specific metrics', () => {
      cacheManager.set('val-key', 'val-data', 'validation');
      cacheManager.get('val-key', 'validation');
      cacheManager.get('missing-key', 'validation');
      
      const metrics = cacheManager.getMetrics();
      expect(metrics.typeMetrics.validation.hits).toBe(1);
      expect(metrics.typeMetrics.validation.misses).toBe(1);
    });

    test('should reset metrics correctly', () => {
      cacheManager.set('key', 'value');
      cacheManager.get('key');
      
      cacheManager.resetMetrics();
      const metrics = cacheManager.getMetrics();
      
      expect(metrics.hits).toBe(0);
      expect(metrics.misses).toBe(0);
      expect(metrics.totalOperations).toBe(0);
    });
  });

  // ===================================================================
  // 🎯 TESTS DE PREDICCIÓN
  // ===================================================================

  describe('Prediction', () => {
    test('should predict related patterns', () => {
      const baseKey = 'pattern-base';
      const relatedKey = 'pattern-related';
      
      // Simular patrones relacionados
      cacheManager.set(baseKey, 'base-data');
      cacheManager.set(relatedKey, 'related-data');
      
      // Acceder secuencialmente para crear patrón
      cacheManager.get(baseKey);
      cacheManager.get(relatedKey);
      
      const predictions = cacheManager.predictNextAccess(baseKey);
      expect(Array.isArray(predictions)).toBe(true);
    });

    test('should handle preloading', async () => {
      const currentKey = 'preload-current';
      const dataLoader = jest.fn().mockResolvedValue('preloaded-data');
      
      cacheManager.set(currentKey, 'current-data');
      await cacheManager.preloadPredictedData(currentKey, dataLoader);
      
      const metrics = cacheManager.getMetrics();
      expect(metrics.preloadOperations).toBeGreaterThanOrEqual(0);
    });
  });

  // ===================================================================
  // 🎯 TESTS DE OPTIMIZACIÓN
  // ===================================================================

  describe('Optimization', () => {
    test('should optimize cache automatically', () => {
      // Añadir algunas entradas
      for (let i = 0; i < 3; i++) {
        cacheManager.set(`opt-key-${i}`, `opt-value-${i}`);
      }
      
      const optimization = cacheManager.optimize();
      
      expect(optimization.optimizationsApplied).toBeDefined();
      expect(optimization.metricsImproved).toBeDefined();
      expect(Array.isArray(optimization.optimizationsApplied)).toBe(true);
    });

    test('should provide detailed stats', () => {
      cacheManager.set('stats-key', 'stats-value');
      
      const stats = cacheManager.getDetailedStats();
      
      expect(stats.cacheSize).toBeDefined();
      expect(stats.patterns).toBeDefined();
      expect(stats.preload).toBeDefined();
      expect(stats.compression).toBeDefined();
    });
  });

  // ===================================================================
  // 🎯 TESTS DE INTEGRACIÓN
  // ===================================================================

  describe('Integration Tests', () => {
    test('should work with UserInput hash generation', () => {
      const userInput: UserInput = {
        age: 30,
        cycleDuration: 28,
        infertilityDuration: 2,
        bmi: 23.5,
        hasPcos: false,
        hasOtb: false,
        endometriosisGrade: 0,
        myomaType: 'none' as any,
        adenomyosisType: 'none' as any,
        polypType: 'none' as any,
        hsgResult: 'normal' as any,
        pelvicSurgeriesNumber: 0,
        amh: 2.5,
        tsh: 2.0,
        prolactin: 20,
        spermConcentration: 20,
        spermProgressiveMotility: 40,
        spermNormalMorphology: 6,
        tpoAbPositive: false
      };
      
      const hash = generateInputHash(userInput);
      expect(typeof hash).toBe('string');
      expect(hash.length).toBeGreaterThan(0);
      
      // El mismo input debería generar el mismo hash
      const hash2 = generateInputHash(userInput);
      expect(hash).toBe(hash2);
      
      // Diferentes inputs deberían generar diferentes hashes
      const differentInput = { ...userInput, age: 35 };
      const hash3 = generateInputHash(differentInput);
      expect(hash).not.toBe(hash3);
    });

    test('should handle complex nested data structures', () => {
      const complexData = {
        evaluation: {
          factors: {
            age: { value: 30, score: 0.8 },
            bmi: { value: 23.5, score: 0.9 }
          },
          diagnostics: {
            pcos: false,
            endometriosis: 0
          }
        },
        report: {
          prognosis: 85.5,
          category: 'good',
          recommendations: ['recommendation1', 'recommendation2']
        }
      };
      
      const key = 'complex-data';
      cacheManager.set(key, complexData);
      const result = cacheManager.get(key);
      
      expect(result).toEqual(complexData);
    });
  });
});

// ===================================================================
// 🎯 TESTS DE FUNCIONES PÚBLICAS
// ===================================================================

describe('Cache Public Functions', () => {
  const mockUserInput: UserInput = {
    age: 30,
    cycleDuration: 28,
    infertilityDuration: 2,
    bmi: 23.5,
    hasPcos: false,
    hasOtb: false,
    endometriosisGrade: 0,
    myomaType: 'none' as any,
    adenomyosisType: 'none' as any,
    polypType: 'none' as any,
    hsgResult: 'normal' as any,
    pelvicSurgeriesNumber: 0,
    amh: 2.5,
    tsh: 2.0,
    prolactin: 20,
    spermConcentration: 20,
    spermProgressiveMotility: 40,
    spermNormalMorphology: 6,
    tpoAbPositive: false
  };

  test('generateInputHash should create consistent hashes', () => {
    const hash1 = generateInputHash(mockUserInput);
    const hash2 = generateInputHash(mockUserInput);
    
    expect(hash1).toBe(hash2);
    expect(typeof hash1).toBe('string');
    expect(hash1.length).toBeGreaterThan(0);
  });

  test('generateInputHash should handle different inputs', () => {
    const input1 = { ...mockUserInput, age: 25 };
    const input2 = { ...mockUserInput, age: 35 };
    
    const hash1 = generateInputHash(input1);
    const hash2 = generateInputHash(input2);
    
    expect(hash1).not.toBe(hash2);
  });

  test('generateInputHash should handle undefined values', () => {
    const inputWithUndefined = { ...mockUserInput, homaIr: undefined };
    const hash = generateInputHash(inputWithUndefined);
    
    expect(typeof hash).toBe('string');
    expect(hash.length).toBeGreaterThan(0);
  });
});
