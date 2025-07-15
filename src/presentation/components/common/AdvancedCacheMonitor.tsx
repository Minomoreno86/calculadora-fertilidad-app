// ===================================================================
// 🚀 MONITOR AVANZADO DE CACHE - Performance Dashboard
// ===================================================================

import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import Text from './Text';
import { 
  getEnginePerformanceMetrics, 
  getEngineDetailedStats, 
  optimizeEngineCache,
  clearEngineCache 
} from '@/core/domain/services/calculationEngine';

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

const AdvancedCacheMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<CacheMetrics | null>(null);
  const [stats, setStats] = useState<DetailedStats | null>(null);
  const [refreshInterval, setRefreshInterval] = useState<ReturnType<typeof setInterval> | null>(null);
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);

  const refreshData = useCallback(() => {
    try {
      const currentMetrics = getEnginePerformanceMetrics();
      const currentStats = getEngineDetailedStats();
      
      setMetrics(currentMetrics);
      setStats(currentStats);
      
      console.log('📊 Cache metrics updated:', currentMetrics);
    } catch (error) {
      console.error('Error fetching cache metrics:', error);
    }
  }, []);

  useEffect(() => {
    // Carga inicial
    refreshData();
  }, [refreshData]);

  useEffect(() => {
    // Gestionar auto-refresh
    if (isAutoRefresh) {
      const interval = setInterval(refreshData, 2000);
      setRefreshInterval(interval);
      
      return () => {
        clearInterval(interval);
      };
    } else {
      if (refreshInterval) {
        clearInterval(refreshInterval);
        setRefreshInterval(null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAutoRefresh]);

  const handleOptimizeCache = () => {
    Alert.alert(
      'Optimizar Cache',
      '¿Deseas optimizar el cache? Esto puede mejorar el rendimiento eliminando entradas obsoletas.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Optimizar',
          onPress: () => {
            try {
              optimizeEngineCache();
              refreshData();
              Alert.alert('✅ Éxito', 'Cache optimizado correctamente');
            } catch (error) {
              console.error('Error optimizing cache:', error);
              Alert.alert('❌ Error', 'Error al optimizar cache');
            }
          }
        }
      ]
    );
  };

  const handleClearCache = () => {
    Alert.alert(
      'Limpiar Cache',
      '⚠️ Esto eliminará todos los datos del cache. ¿Estás seguro?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpiar',
          style: 'destructive',
          onPress: () => {
            try {
              clearEngineCache();
              refreshData();
              Alert.alert('✅ Éxito', 'Cache limpiado correctamente');
            } catch (error) {
              console.error('Error clearing cache:', error);
              Alert.alert('❌ Error', 'Error al limpiar cache');
            }
          }
        }
      ]
    );
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 90) return '#4CAF50'; // Verde
    if (efficiency >= 70) return '#FF9800'; // Naranja
    return '#F44336'; // Rojo
  };

  const getEfficiencyLabel = (efficiency: number) => {
    if (efficiency >= 95) return 'EXCELENTE';
    if (efficiency >= 85) return 'MUY BUENO';
    if (efficiency >= 70) return 'BUENO';
    if (efficiency >= 50) return 'REGULAR';
    return 'NECESITA MEJORA';
  };

  if (!metrics || !stats) {
    return (
      <View style={styles.container}>
        <Text style={styles.loading}>Cargando métricas del cache...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🚀 Monitor Avanzado de Cache</Text>
        <View style={styles.controls}>
          <TouchableOpacity
            style={[styles.button, styles.optimizeButton]}
            onPress={handleOptimizeCache}
          >
            <Text style={styles.buttonText}>🔧 Optimizar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.clearButton]}
            onPress={handleClearCache}
          >
            <Text style={styles.buttonText}>🧹 Limpiar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Métricas Principales */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📊 Rendimiento Principal</Text>
        
        <View style={styles.metricRow}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Eficiencia Cache</Text>
            <Text style={[styles.metricValue, { color: getEfficiencyColor(metrics.cacheEfficiency) }]}>
              {metrics.cacheEfficiency}%
            </Text>
            <Text style={styles.metricSubtitle}>
              {getEfficiencyLabel(metrics.cacheEfficiency)}
            </Text>
          </View>
          
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Predicción IA</Text>
            <Text style={[styles.metricValue, { color: getEfficiencyColor(metrics.predictiveEfficiency) }]}>
              {metrics.predictiveEfficiency}%
            </Text>
            <Text style={styles.metricSubtitle}>
              {metrics.predictiveHits} hits predictivos
            </Text>
          </View>
        </View>

        <View style={styles.metricRow}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Compresión</Text>
            <Text style={styles.metricValue}>
              {metrics.compressionRatio}%
            </Text>
            <Text style={styles.metricSubtitle}>
              {metrics.memoryOptimization}KB ahorrados
            </Text>
          </View>
          
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Velocidad Promedio</Text>
            <Text style={styles.metricValue}>
              {metrics.averageExecutionTime.toFixed(1)}ms
            </Text>
            <Text style={styles.metricSubtitle}>
              {metrics.totalCalculations} cálculos
            </Text>
          </View>
        </View>
      </View>

      {/* Estadísticas del Cache */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>💾 Estado del Cache</Text>
        
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Validaciones:</Text>
          <Text style={styles.statValue}>{stats.cacheSize.validation}</Text>
        </View>
        
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Factores:</Text>
          <Text style={styles.statValue}>{stats.cacheSize.factor}</Text>
        </View>
        
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Reportes:</Text>
          <Text style={styles.statValue}>{stats.cacheSize.report}</Text>
        </View>
        
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Comprimidos:</Text>
          <Text style={styles.statValue}>{stats.cacheSize.compression}</Text>
        </View>
      </View>

      {/* Patrones de Uso */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔮 Patrones Inteligentes</Text>
        
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Patrones totales:</Text>
          <Text style={styles.statValue}>{stats.patterns.total}</Text>
        </View>
        
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Patrones activos:</Text>
          <Text style={styles.statValue}>{stats.patterns.active}</Text>
        </View>
        
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Cola de preload:</Text>
          <Text style={styles.statValue}>{stats.preload.queueSize}</Text>
        </View>
        
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Éxito preload:</Text>
          <Text style={styles.statValue}>{stats.preload.successRate.toFixed(1)}%</Text>
        </View>
      </View>

      {/* Patrones Top */}
      {stats.patterns.topPatterns.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏆 Top Patrones de Uso</Text>
          {stats.patterns.topPatterns.map((pattern, index) => (
            <View key={pattern.hash} style={styles.patternRow}>
              <Text style={styles.patternRank}>#{index + 1}</Text>
              <Text style={styles.patternHash}>{pattern.hash}</Text>
              <Text style={styles.patternFreq}>{pattern.frequency}x</Text>
            </View>
          ))}
        </View>
      )}

      {/* Métricas Detalladas */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📈 Métricas Detalladas</Text>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Cache Hits:</Text>
          <Text style={styles.detailValue}>{metrics.cacheHits.toLocaleString()}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Cache Misses:</Text>
          <Text style={styles.detailValue}>{metrics.cacheMisses.toLocaleString()}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Hits Predictivos:</Text>
          <Text style={styles.detailValue}>{metrics.predictiveHits.toLocaleString()}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Preload Ops:</Text>
          <Text style={styles.detailValue}>{metrics.preloadOperations.toLocaleString()}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Evictions:</Text>
          <Text style={styles.detailValue}>{metrics.cacheEvictions.toLocaleString()}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.refreshButton, isAutoRefresh && styles.refreshButtonActive]}
          onPress={() => setIsAutoRefresh(!isAutoRefresh)}
        >
          <Text style={styles.refreshButtonText}>
            {isAutoRefresh ? '⏸️ Pausar Auto-refresh' : '▶️ Iniciar Auto-refresh'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loading: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  controls: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    minWidth: 80,
  },
  optimizeButton: {
    backgroundColor: '#2196F3',
  },
  clearButton: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 12,
  },
  section: {
    backgroundColor: '#fff',
    margin: 8,
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
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 6,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  metricSubtitle: {
    fontSize: 10,
    color: '#999',
    textAlign: 'center',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  patternRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  patternRank: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
    width: 30,
  },
  patternHash: {
    flex: 1,
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#333',
  },
  patternFreq: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2196F3',
    width: 40,
    textAlign: 'right',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  detailLabel: {
    fontSize: 13,
    color: '#666',
  },
  detailValue: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333',
  },
  footer: {
    padding: 16,
    alignItems: 'center',
  },
  refreshButton: {
    backgroundColor: '#666',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  refreshButtonActive: {
    backgroundColor: '#4CAF50',
  },
  refreshButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default AdvancedCacheMonitor;
