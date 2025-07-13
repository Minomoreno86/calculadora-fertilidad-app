// ===================================================================
// 🚀 DEMO Y TESTING DEL CACHE ENGINE UPGRADE
// ===================================================================

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { 
  calculateProbability,
  getEnginePerformanceMetrics, 
  getEngineDetailedStats, 
  optimizeEngineCache, 
  clearEngineCache 
} from '@/core/domain/services/calculationEngine';
import { UserInput, MyomaType, AdenomyosisType, PolypType, HsgResult, OtbMethod } from '@/core/domain/models';

interface CacheMetrics {
  cacheHits: number;
  cacheMisses: number;
  cacheEfficiency: number;
  predictiveEfficiency: number;
  compressionRatio: number;
  memoryOptimization: number;
  totalCalculations: number;
  averageExecutionTime: number;
  predictiveHits: number;
  compressionSavings: number;
  preloadOperations: number;
  cacheEvictions: number;
}

interface DetailedStats {
  cacheSize: {
    validation: number;
    factor: number;
    report: number;
    compression: number;
  };
  patterns: {
    total: number;
    active: number;
    topPatterns: Array<{ hash: string; frequency: number }>;
  };
  preload: {
    queueSize: number;
    successRate: number;
  };
}

const CacheUpgradeDemo: React.FC = () => {
  const [metrics, setMetrics] = useState<CacheMetrics | null>(null);
  const [stats, setStats] = useState<DetailedStats | null>(null);
  const [testResults, setTestResults] = useState<string[]>([]);

  useEffect(() => {
    updateMetrics();
  }, []);

  const updateMetrics = () => {
    try {
      setMetrics(getEnginePerformanceMetrics());
      setStats(getEngineDetailedStats());
    } catch (error) {
      console.error('Error updating metrics:', error);
    }
  };

  const addTestResult = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setTestResults(prev => [`[${timestamp}] ${message}`, ...prev.slice(0, 9)]);
  };

  // 🧪 Test del Sistema de Cache Predictivo
  const testPredictiveCache = async () => {
    addTestResult('🔮 Iniciando test de cache predictivo...');
    
    // Generar inputs similares para crear patrones
    const baseInput: UserInput = {
      age: 30,
      bmi: 23.5,
      cycleDuration: 28,
      infertilityDuration: 12,
      hasPcos: false,
      endometriosisGrade: 0,
      myomaType: MyomaType.None,
      adenomyosisType: AdenomyosisType.None,
      polypType: PolypType.None,
      hsgResult: HsgResult.Unknown,
      hasOtb: false,
      hasPelvicSurgery: false,
      tpoAbPositive: false,
      spermConcentration: 50
    };

    const variations = [
      { ...baseInput, age: 30.1 }, // Variación mínima
      { ...baseInput, age: 30.2 },
      { ...baseInput, bmi: 23.6 }, // Variación BMI
      { ...baseInput, cycleDuration: 29 }, // Variación ciclo
      { ...baseInput, age: 30, bmi: 23.5 }, // Idéntico (debería ser cache hit)
    ];

    let cacheHitsBefore = metrics?.cacheHits || 0;
    let predictiveHitsBefore = metrics?.predictiveHits || 0;

    for (let i = 0; i < variations.length; i++) {
      const startTime = performance.now();
      await calculateProbability(variations[i]);
      const endTime = performance.now();
      
      addTestResult(`Test ${i + 1}: ${(endTime - startTime).toFixed(1)}ms`);
      
      // Pequeña pausa para permitir análisis de patrones
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Actualizar métricas después del test
    updateMetrics();
    
    const cacheHitsAfter = metrics?.cacheHits || 0;
    const predictiveHitsAfter = metrics?.predictiveHits || 0;
    
    addTestResult(`✅ Cache hits: +${cacheHitsAfter - cacheHitsBefore}`);
    addTestResult(`🔮 Predictive hits: +${predictiveHitsAfter - predictiveHitsBefore}`);
  };

  // 🗜️ Test del Sistema de Compresión
  const testCompressionSystem = async () => {
    addTestResult('🗜️ Iniciando test de compresión...');
    
    // Crear input con muchos datos para triggear compresión
    const largeInput: UserInput = {
      age: 35,
      bmi: 26.8,
      cycleDuration: 30,
      hasPcos: true,
      infertilityDuration: 18,
      spermConcentration: 45,
      spermProgressiveMotility: 35,
      spermNormalMorphology: 8,
      amh: 2.5,
      prolactin: 15,
      tsh: 2.1,
      homaIr: 2.8,
      endometriosisGrade: 2,
      myomaType: MyomaType.Submucosal,
      adenomyosisType: AdenomyosisType.Focal,
      polypType: PolypType.Large,
      hsgResult: HsgResult.Bilateral,
      hasOtb: true,
      otbMethod: OtbMethod.ExtensiveCauterization,
      remainingTubalLength: 3.5,
      hasOtherInfertilityFactors: true,
      desireForMultiplePregnancies: false,
      hasPelvicSurgery: true,
      pelvicSurgeriesNumber: 2,
      tpoAbPositive: false
    };

    const compressionBefore = metrics?.compressionRatio || 0;
    const memoryBefore = metrics?.memoryOptimization || 0;

    await calculateProbability(largeInput);
    
    updateMetrics();
    
    const compressionAfter = metrics?.compressionRatio || 0;
    const memoryAfter = metrics?.memoryOptimization || 0;

    addTestResult(`✅ Compresión: ${compressionAfter}% (+${(compressionAfter - compressionBefore).toFixed(1)}%)`);
    addTestResult(`💾 Memoria ahorrada: ${memoryAfter}KB (+${(memoryAfter - memoryBefore).toFixed(1)}KB)`);
  };

  // ⚡ Test de Velocidad y Eficiencia
  const testSpeed = async () => {
    addTestResult('⚡ Iniciando test de velocidad...');
    
    const testInput: UserInput = {
      age: 28,
      bmi: 22.1,
      cycleDuration: 27,
      hasPcos: false,
      infertilityDuration: 6,
      spermConcentration: 60,
      endometriosisGrade: 0,
      myomaType: MyomaType.None,
      adenomyosisType: AdenomyosisType.None,
      polypType: PolypType.None,
      hsgResult: HsgResult.Unknown,
      hasOtb: false,
      hasPelvicSurgery: false,
      tpoAbPositive: false
    };

    const iterations = 10;
    const times: number[] = [];

    for (let i = 0; i < iterations; i++) {
      const startTime = performance.now();
      await calculateProbability(testInput);
      const endTime = performance.now();
      times.push(endTime - startTime);
    }

    const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
    const minTime = Math.min(...times);
    const maxTime = Math.max(...times);

    addTestResult(`⚡ Promedio: ${avgTime.toFixed(1)}ms`);
    addTestResult(`🚀 Mínimo: ${minTime.toFixed(1)}ms (cache hit)`);
    addTestResult(`🐌 Máximo: ${maxTime.toFixed(1)}ms (cache miss)`);
    
    updateMetrics();
  };

  // 🧹 Test de Limpieza Inteligente
  const testIntelligentCleanup = () => {
    addTestResult('🧹 Iniciando test de limpieza inteligente...');
    
    try {
      optimizeEngineCache();
      updateMetrics();
      addTestResult('✅ Limpieza inteligente completada');
    } catch (error) {
      console.error('Error en limpieza inteligente:', error);
      addTestResult('❌ Error en limpieza inteligente');
    }
  };

  const runAllTests = async () => {
    addTestResult('🎯 INICIANDO BATERÍA COMPLETA DE TESTS...');
    
    await testSpeed();
    await new Promise(resolve => setTimeout(resolve, 500));
    
    await testPredictiveCache();
    await new Promise(resolve => setTimeout(resolve, 500));
    
    await testCompressionSystem();
    await new Promise(resolve => setTimeout(resolve, 500));
    
    testIntelligentCleanup();
    
    addTestResult('🏁 TODOS LOS TESTS COMPLETADOS');
  };

  const resetCache = () => {
    Alert.alert(
      'Reset Cache',
      '¿Deseas resetear completamente el cache para empezar los tests desde cero?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Reset',
          onPress: () => {
            clearEngineCache();
            updateMetrics();
            setTestResults([]);
            addTestResult('🔄 Cache reseteado completamente');
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🚀 Cache Engine Upgrade Demo</Text>
        <Text style={styles.subtitle}>Prueba las nuevas capacidades del cache inteligente</Text>
      </View>

      {/* Métricas Actuales */}
      {metrics && (
        <View style={styles.metricsSection}>
          <Text style={styles.sectionTitle}>📊 Métricas Actuales</Text>
          <View style={styles.metricsGrid}>
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>{metrics.cacheEfficiency}%</Text>
              <Text style={styles.metricLabel}>Cache Efficiency</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>{metrics.predictiveEfficiency}%</Text>
              <Text style={styles.metricLabel}>Predictive AI</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>{metrics.compressionRatio}%</Text>
              <Text style={styles.metricLabel}>Compression</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>{metrics.averageExecutionTime.toFixed(1)}ms</Text>
              <Text style={styles.metricLabel}>Avg Speed</Text>
            </View>
          </View>
        </View>
      )}

      {/* Controles de Test */}
      <View style={styles.controlsSection}>
        <Text style={styles.sectionTitle}>🧪 Tests Disponibles</Text>
        
        <TouchableOpacity style={styles.testButton} onPress={testSpeed}>
          <Text style={styles.testButtonText}>⚡ Test de Velocidad</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.testButton} onPress={testPredictiveCache}>
          <Text style={styles.testButtonText}>🔮 Test Cache Predictivo</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.testButton} onPress={testCompressionSystem}>
          <Text style={styles.testButtonText}>🗜️ Test Compresión</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.testButton} onPress={testIntelligentCleanup}>
          <Text style={styles.testButtonText}>🧹 Test Limpieza Inteligente</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.testButton, styles.primaryButton]} onPress={runAllTests}>
          <Text style={[styles.testButtonText, styles.primaryButtonText]}>🎯 Ejecutar Todos los Tests</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.testButton, styles.dangerButton]} onPress={resetCache}>
          <Text style={[styles.testButtonText, styles.dangerButtonText]}>🔄 Reset Cache</Text>
        </TouchableOpacity>
      </View>

      {/* Resultados de Tests */}
      <View style={styles.resultsSection}>
        <Text style={styles.sectionTitle}>📝 Resultados de Tests</Text>
        {testResults.length === 0 ? (
          <Text style={styles.noResults}>No hay resultados aún. Ejecuta un test para comenzar.</Text>
        ) : (
          testResults.map((result, index) => (
            <Text key={`result-${index}-${result.slice(0, 10)}`} style={styles.resultText}>{result}</Text>
          ))
        )}
      </View>

      {/* Estadísticas Detalladas */}
      {stats && (
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>📈 Estadísticas Detalladas</Text>
          <Text style={styles.statText}>Patrones de uso: {stats.patterns?.total || 0}</Text>
          <Text style={styles.statText}>Patrones activos: {stats.patterns?.active || 0}</Text>
          <Text style={styles.statText}>Cola de preload: {stats.preload?.queueSize || 0}</Text>
          <Text style={styles.statText}>Éxito preload: {(stats.preload?.successRate || 0).toFixed(1)}%</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  metricsSection: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricCard: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  controlsSection: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  testButton: {
    backgroundColor: '#e3f2fd',
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
    alignItems: 'center',
  },
  testButtonText: {
    color: '#1976d2',
    fontWeight: 'bold',
    fontSize: 14,
  },
  primaryButton: {
    backgroundColor: '#2196F3',
    marginTop: 8,
  },
  primaryButtonText: {
    color: '#fff',
  },
  dangerButton: {
    backgroundColor: '#ffebee',
  },
  dangerButtonText: {
    color: '#d32f2f',
  },
  resultsSection: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  noResults: {
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 20,
  },
  resultText: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#333',
    marginBottom: 4,
    backgroundColor: '#f8f9fa',
    padding: 8,
    borderRadius: 4,
  },
  statsSection: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
});

export default CacheUpgradeDemo;
