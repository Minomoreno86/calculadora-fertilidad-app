/**
 * 📊 METRICS DASHBOARD - COMPONENTE DE VISUALIZACIÓN AVANZADA
 * 
 * Dashboard en tiempo real para monitorear métricas de producción:
 * - Visualización de performance del motor unificado
 * - Alertas en tiempo real
 * - Sugerencias de optimización
 * - Gráficos interactivos de tendencias
 */

import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, RefreshControl } from 'react-native';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { 
  ProductionMetrics, 
  PerformanceAlert, 
  OptimizationSuggestion,
  productionProfiler 
} from '../monitoring/ProductionProfiler';

interface MetricsDashboardProps {
  onAlertPress?: (alert: PerformanceAlert) => void;
  onSuggestionPress?: (suggestion: OptimizationSuggestion) => void;
  refreshInterval?: number;
}

const screenWidth = Dimensions.get('window').width;

export const MetricsDashboard: React.FC<MetricsDashboardProps> = ({
  onAlertPress,
  onSuggestionPress,
  refreshInterval = 30000 // 30 segundos
}) => {
  const [metrics, setMetrics] = useState<ProductionMetrics | null>(null);
  const [alerts, setAlerts] = useState<PerformanceAlert[]>([]);
  const [suggestions, setSuggestions] = useState<OptimizationSuggestion[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // 🔄 ACTUALIZACIÓN AUTOMÁTICA
  useEffect(() => {
    const updateMetrics = () => {
      setMetrics(productionProfiler.getMetrics());
      setAlerts(productionProfiler.getActiveAlerts());
      setSuggestions(productionProfiler.getOptimizationSuggestions());
      setLastUpdate(new Date());
    };

    // Actualización inicial
    updateMetrics();

    // Configurar intervalo de actualización
    const interval = setInterval(updateMetrics, refreshInterval);

    // Escuchar eventos del profiler
    const handleMetricsUpdate = () => updateMetrics();
    if (typeof window !== 'undefined') {
      window.addEventListener('profiler:metrics-updated', handleMetricsUpdate);
    }

    return () => {
      clearInterval(interval);
      if (typeof window !== 'undefined') {
        window.removeEventListener('profiler:metrics-updated', handleMetricsUpdate);
      }
    };
  }, [refreshInterval]);

  // 🎨 CONFIGURACIÓN DE GRÁFICOS
  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#f8f9fa',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(60, 60, 67, ${opacity})`,
    style: { borderRadius: 16 },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#007AFF'
    }
  };

  // 📊 DATOS PARA GRÁFICO DE DISTRIBUCIÓN DE MOTORES
  const engineDistributionData = useMemo(() => {
    if (!metrics?.motorUnificado) return null;

    const { engineDistribution } = metrics.motorUnificado;
    const total = engineDistribution.standard + engineDistribution.premium + engineDistribution.auto;
    
    if (total === 0) return null;

    return {
      labels: ['Standard', 'Premium', 'Auto'],
      datasets: [{
        data: [
          engineDistribution.standard,
          engineDistribution.premium,
          engineDistribution.auto
        ]
      }]
    };
  }, [metrics]);

  // 📈 DATOS PARA GRÁFICO DE TIEMPOS DE EJECUCIÓN
  const executionTimesData = useMemo(() => {
    if (!metrics?.motorUnificado) return null;

    const { averageExecutionTimes } = metrics.motorUnificado;
    
    return {
      labels: ['Standard', 'Premium', 'Auto'],
      datasets: [{
        data: [
          averageExecutionTimes.standard || 0,
          averageExecutionTimes.premium || 0,
          averageExecutionTimes.auto || 0
        ]
      }]
    };
  }, [metrics]);

  // 🔄 MANEJAR REFRESH MANUAL
  const handleRefresh = async () => {
    setIsRefreshing(true);
    
    // Simular actualización (el profiler se actualiza automáticamente)
    setTimeout(() => {
      setMetrics(productionProfiler.getMetrics());
      setAlerts(productionProfiler.getActiveAlerts());
      setSuggestions(productionProfiler.getOptimizationSuggestions());
      setLastUpdate(new Date());
      setIsRefreshing(false);
    }, 1000);
  };

  // 🎨 RENDERIZAR TARJETA DE MÉTRICA
  const renderMetricCard = (title: string, value: string | number, subtitle?: string, color = '#007AFF') => (
    <View style={[styles.metricCard, { borderLeftColor: color }]}>
      <Text style={styles.metricTitle}>{title}</Text>
      <Text style={[styles.metricValue, { color }]}>{value}</Text>
      {subtitle && <Text style={styles.metricSubtitle}>{subtitle}</Text>}
    </View>
  );

  // 🚨 RENDERIZAR ALERTA
  const renderAlert = (alert: PerformanceAlert, index: number) => {
    const severityColors = {
      low: '#34C759',
      medium: '#FF9500',
      high: '#FF3B30',
      critical: '#D70015'
    };

    return (
      <View 
        key={index}
        style={[styles.alertCard, { borderLeftColor: severityColors[alert.severity] }]}
        onTouchEnd={() => onAlertPress?.(alert)}
      >
        <View style={styles.alertHeader}>
          <Text style={[styles.alertType, { color: severityColors[alert.severity] }]}>
            {alert.type.toUpperCase()}
          </Text>
          <Text style={styles.alertTime}>
            {new Date(alert.timestamp).toLocaleTimeString()}
          </Text>
        </View>
        <Text style={styles.alertMessage}>{alert.message}</Text>
        <Text style={styles.alertRecommendation}>{alert.recommendation}</Text>
      </View>
    );
  };

  // 💡 RENDERIZAR SUGERENCIA
  const renderSuggestion = (suggestion: OptimizationSuggestion, index: number) => {
    const priorityColors = {
      low: '#34C759',
      medium: '#FF9500',
      high: '#FF3B30'
    };

    return (
      <View 
        key={index}
        style={[styles.suggestionCard, { borderLeftColor: priorityColors[suggestion.priority] }]}
        onTouchEnd={() => onSuggestionPress?.(suggestion)}
      >
        <View style={styles.suggestionHeader}>
          <Text style={styles.suggestionArea}>{suggestion.area}</Text>
          <Text style={[styles.suggestionPriority, { color: priorityColors[suggestion.priority] }]}>
            {suggestion.priority.toUpperCase()}
          </Text>
        </View>
        <Text style={styles.suggestionDescription}>{suggestion.description}</Text>
        <Text style={styles.suggestionImprovement}>{suggestion.expectedImprovement}</Text>
      </View>
    );
  };

  if (!metrics) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando métricas...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
      }
    >
      {/* 📊 HEADER CON RESUMEN */}
      <View style={styles.header}>
        <Text style={styles.title}>Production Metrics</Text>
        <Text style={styles.lastUpdate}>
          Última actualización: {lastUpdate.toLocaleTimeString()}
        </Text>
      </View>

      {/* 📈 MÉTRICAS PRINCIPALES */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Motor Unificado</Text>
        <View style={styles.metricsRow}>
          {renderMetricCard(
            'Total Cálculos',
            metrics.motorUnificado.totalCalculations.toLocaleString(),
            'operaciones'
          )}
          {renderMetricCard(
            'Tiempo Promedio',
            `${metrics.motorUnificado.averageExecutionTimes.auto.toFixed(1)}ms`,
            'modo auto',
            '#FF9500'
          )}
        </View>
        <View style={styles.metricsRow}>
          {renderMetricCard(
            'Complejidad Promedio',
            metrics.motorUnificado.complexityAnalysis.averageScore.toFixed(3),
            'score 0-1',
            '#34C759'
          )}
          {renderMetricCard(
            'IA Predicciones',
            metrics.iaPredictiva.totalPredictions.toLocaleString(),
            `${(metrics.iaPredictiva.accuracyRate * 100).toFixed(1)}% precisión`,
            '#5856D6'
          )}
        </View>
      </View>

      {/* 📊 GRÁFICO DE DISTRIBUCIÓN DE MOTORES */}
      {engineDistributionData && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Distribución de Motores</Text>
          <BarChart
            data={engineDistributionData}
            width={screenWidth - 32}
            height={220}
            chartConfig={chartConfig}
            showValuesOnTopOfBars
            style={styles.chart}
          />
        </View>
      )}

      {/* 📈 GRÁFICO DE TIEMPOS DE EJECUCIÓN */}
      {executionTimesData && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tiempos de Ejecución (ms)</Text>
          <LineChart
            data={executionTimesData}
            width={screenWidth - 32}
            height={220}
            chartConfig={chartConfig}
            style={styles.chart}
          />
        </View>
      )}

      {/* 🚨 ALERTAS ACTIVAS */}
      {alerts.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Alertas Activas ({alerts.length})</Text>
          {alerts.map(renderAlert)}
        </View>
      )}

      {/* 💡 SUGERENCIAS DE OPTIMIZACIÓN */}
      {suggestions.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Optimizaciones Sugeridas ({suggestions.length})</Text>
          {suggestions.map(renderSuggestion)}
        </View>
      )}

      {/* 📊 MÉTRICAS DETALLADAS */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Métricas del Sistema</Text>
        <View style={styles.metricsRow}>
          {renderMetricCard(
            'Cache Hit Rate',
            `${(metrics.validacionParalela.cacheHitRate * 100).toFixed(1)}%`,
            'validación paralela',
            metrics.validacionParalela.cacheHitRate > 0.8 ? '#34C759' : '#FF9500'
          )}
          {renderMetricCard(
            'Memoria Usada',
            `${(metrics.sistema.memoryUsage / (1024 * 1024)).toFixed(1)} MB`,
            'heap JS',
            metrics.sistema.memoryUsage > 100 * 1024 * 1024 ? '#FF3B30' : '#34C759'
          )}
        </View>
        <View style={styles.metricsRow}>
          {renderMetricCard(
            'Uptime',
            `${metrics.sistema.uptimePercentage.toFixed(2)}%`,
            'disponibilidad',
            '#34C759'
          )}
          {renderMetricCard(
            'Error Rate',
            `${(metrics.sistema.errorRate * 100).toFixed(2)}%`,
            'tasa de errores',
            metrics.sistema.errorRate > 0.05 ? '#FF3B30' : '#34C759'
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    fontSize: 16,
    color: '#6c757d',
  },
  header: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 4,
  },
  lastUpdate: {
    fontSize: 14,
    color: '#6c757d',
  },
  section: {
    backgroundColor: '#ffffff',
    marginTop: 16,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  metricsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 4,
    borderLeftWidth: 4,
  },
  metricTitle: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  metricSubtitle: {
    fontSize: 11,
    color: '#adb5bd',
  },
  chart: {
    marginHorizontal: 16,
    borderRadius: 16,
  },
  alertCard: {
    backgroundColor: '#fff3cd',
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 8,
    borderLeftWidth: 4,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  alertType: {
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  alertTime: {
    fontSize: 12,
    color: '#6c757d',
  },
  alertMessage: {
    fontSize: 14,
    color: '#212529',
    marginBottom: 4,
  },
  alertRecommendation: {
    fontSize: 12,
    color: '#6c757d',
    fontStyle: 'italic',
  },
  suggestionCard: {
    backgroundColor: '#d1ecf1',
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 8,
    borderLeftWidth: 4,
  },
  suggestionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  suggestionArea: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212529',
  },
  suggestionPriority: {
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  suggestionDescription: {
    fontSize: 14,
    color: '#212529',
    marginBottom: 4,
  },
  suggestionImprovement: {
    fontSize: 12,
    color: '#0c5460',
    fontWeight: '500',
  },
});

export default MetricsDashboard;
