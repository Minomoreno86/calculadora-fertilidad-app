// ===================================================================
// 🚀 FASE 2C: COMPONENTE DE MONITOREO DE RENDIMIENTO
// ===================================================================

import React, { memo, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useBenchmark } from '@/core/utils/performanceBenchmark';
import { getEnginePerformanceMetrics, getEngineDetailedStats } from '@/core/domain/services/calculationEngine';
import { getPremiumCacheStats } from '@/core/domain/logic/clinicalContentLibraryPremium';
import { theme } from '@/config/theme';

interface PerformanceMonitorProps {
  visible?: boolean;
  onToggle?: () => void;
}

const PerformanceMonitor = memo<PerformanceMonitorProps>(({ visible = false, onToggle }) => {
  const { getReport, clearMetrics } = useBenchmark();
  const [metrics, setMetrics] = useState<any>(null);
  const [engineMetrics, setEngineMetrics] = useState<any>(null);
  const [detailedStats, setDetailedStats] = useState<any>(null);
  const [cacheStats, setCacheStats] = useState<any>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // 🚀 Actualizar métricas cada 2 segundos cuando está visible
  useEffect(() => {
    if (!visible) return;

    const updateMetrics = () => {
      try {
        setMetrics(getReport());
        setEngineMetrics(getEnginePerformanceMetrics());
        setDetailedStats(getEngineDetailedStats());
        setCacheStats(getPremiumCacheStats());
      } catch (error) {
        console.warn('Error obteniendo métricas:', error);
      }
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 2000);

    return () => clearInterval(interval);
  }, [visible, getReport]);

  if (!visible) {
    return (
      <TouchableOpacity 
        style={styles.toggleButton} 
        onPress={onToggle}
        activeOpacity={0.7}
      >
        <Text style={styles.toggleButtonText}>📊</Text>
      </TouchableOpacity>
    );
  }

  const handleClearMetrics = () => {
    clearMetrics();
    setMetrics(null);
    setEngineMetrics(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🚀 Monitor de Rendimiento - FASE 2C</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            style={styles.expandButton} 
            onPress={() => setIsExpanded(!isExpanded)}
          >
            <Text style={styles.buttonText}>{isExpanded ? '−' : '+'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.clearButton} onPress={handleClearMetrics}>
            <Text style={styles.buttonText}>🗑️</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeButton} onPress={onToggle}>
            <Text style={styles.buttonText}>✕</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Métricas del Engine */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚡ Motor de Cálculo</Text>
          {engineMetrics ? (
            <View style={styles.metricsGrid}>
              <MetricCard 
                label="Cache Hits" 
                value={engineMetrics.cacheHits} 
                color="#4CAF50" 
              />
              <MetricCard 
                label="Cache Misses" 
                value={engineMetrics.cacheMisses} 
                color="#FF9800" 
              />
              <MetricCard 
                label="Eficiencia Cache" 
                value={`${engineMetrics.cacheEfficiency}%`} 
                color={engineMetrics.cacheEfficiency > 70 ? "#4CAF50" : "#FF9800"} 
              />
              <MetricCard 
                label="Tiempo Promedio" 
                value={`${engineMetrics.averageExecutionTime.toFixed(1)}ms`} 
                color="#2196F3" 
              />
            </View>
          ) : (
            <Text style={styles.noData}>Sin datos del motor</Text>
          )}
        </View>

        {/* Métricas del Benchmark */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Benchmark General</Text>
          {metrics ? (
            <>
              <View style={styles.metricsGrid}>
                <MetricCard 
                  label="Total Métricas" 
                  value={metrics.totalMetrics} 
                  color="#9C27B0" 
                />
                <MetricCard 
                  label="Renders" 
                  value={metrics.renderMetrics?.length || 0} 
                  color="#673AB7" 
                />
              </View>

              {/* Tiempos promedio por categoría */}
              {isExpanded && Object.keys(metrics.averageTimes || {}).length > 0 && (
                <View style={styles.detailSection}>
                  <Text style={styles.detailTitle}>⏱️ Tiempos Promedio</Text>
                  {Object.entries(metrics.averageTimes).map(([name, time]) => (
                    <View key={name} style={styles.timeRow}>
                      <Text style={styles.timeName}>{name}</Text>
                      <Text style={styles.timeValue}>{(time as number).toFixed(1)}ms</Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Recomendaciones */}
              {isExpanded && metrics.recommendations?.length > 0 && (
                <View style={styles.detailSection}>
                  <Text style={styles.detailTitle}>💡 Recomendaciones</Text>
                  {metrics.recommendations.map((rec: string, index: number) => (
                    <Text key={index} style={styles.recommendation}>
                      {rec}
                    </Text>
                  ))}
                </View>
              )}
            </>
          ) : (
            <Text style={styles.noData}>Sin datos de benchmark</Text>
          )}
        </View>

        {/* Cache Stats Premium */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💎 Cache Premium</Text>
          {cacheStats ? (
            <View style={styles.metricsGrid}>
              <MetricCard 
                label="Tamaño Cache" 
                value={`${cacheStats.size}/${cacheStats.maxSize}`} 
                color="#FF6B6B" 
              />
              <MetricCard 
                label="Utilización" 
                value={`${cacheStats.utilization}%`} 
                color={cacheStats.utilization > 80 ? "#FF5722" : "#4CAF50"} 
              />
            </View>
          ) : (
            <Text style={styles.noData}>Sin datos de cache premium</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
});

// Componente auxiliar para métricas individuales
const MetricCard = memo<{ label: string; value: string | number; color: string }>(
  ({ label, value, color }) => (
    <View style={[styles.metricCard, { borderLeftColor: color }]}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={[styles.metricValue, { color }]}>{value}</Text>
    </View>
  )
);

PerformanceMonitor.displayName = 'PerformanceMonitor';
MetricCard.displayName = 'MetricCard';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    right: 10,
    width: 320,
    maxHeight: 400,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    zIndex: 1000,
  },
  toggleButton: {
    position: 'absolute',
    top: 50,
    right: 10,
    width: 50,
    height: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  toggleButtonText: {
    fontSize: 20,
    color: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  expandButton: {
    width: 30,
    height: 30,
    backgroundColor: 'rgba(33, 150, 243, 0.3)',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButton: {
    width: 30,
    height: 30,
    backgroundColor: 'rgba(255, 152, 0, 0.3)',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    width: 30,
    height: 30,
    backgroundColor: 'rgba(244, 67, 54, 0.3)',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  content: {
    maxHeight: 320,
    padding: 12,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  metricCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 8,
    minWidth: 70,
    borderLeftWidth: 3,
  },
  metricLabel: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 2,
  },
  metricValue: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  detailSection: {
    marginTop: 12,
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: 8,
  },
  detailTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 6,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  timeName: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.8)',
    flex: 1,
  },
  timeValue: {
    fontSize: 10,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  recommendation: {
    fontSize: 9,
    color: '#FFB74D',
    marginVertical: 2,
    paddingLeft: 8,
  },
  noData: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.5)',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 8,
  },
});

export default PerformanceMonitor;
