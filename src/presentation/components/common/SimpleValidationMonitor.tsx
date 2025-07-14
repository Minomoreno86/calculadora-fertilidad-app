// ===================================================================
// 🚀 MONITOR SIMPLE DE VALIDACIÓN PARALELA - FASE 2
// ===================================================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '@/config/theme';

interface ValidationMetrics {
  isValidating: boolean;
  progress: number;
  totalTasks: number;
  completedTasks: number;
  averageTaskTime: number;
  cacheHitRate: number;
  tasksPerSecond: number;
  efficiency: string;
}

interface Props {
  isValidating: boolean;
  progress: number;
  metrics: ValidationMetrics;
  showDevInfo?: boolean;
}

export const SimpleValidationMonitor: React.FC<Props> = ({
  isValidating,
  progress,
  metrics,
  showDevInfo = false
}) => {
  if (!showDevInfo && process.env.NODE_ENV !== 'development') {
    return null;
  }

  const getProgressColor = (progress: number) => {
    if (progress < 30) return '#ff9800';
    if (progress < 70) return '#2196f3';
    return '#4caf50';
  };

  const getEfficiencyColor = (efficiency: string) => {
    switch (efficiency) {
      case 'Excelente': return '#4caf50';
      case 'Buena': return '#2196f3';
      case 'Regular': return '#ff9800';
      default: return '#f44336';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⚡ Validación Paralela Avanzada</Text>
      
      {/* Indicador de progreso */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${progress}%`,
                backgroundColor: getProgressColor(progress)
              }
            ]}
          />
        </View>
        <Text style={styles.progressText}>{Math.round(progress)}%</Text>
      </View>

      {/* Estado actual */}
      <Text style={[styles.status, { color: isValidating ? '#ff9800' : '#4caf50' }]}>
        {isValidating ? '🔄 Validando en tiempo real...' : '✅ Sistema listo y optimizado'}
      </Text>

      {/* Métricas principales */}
      <View style={styles.metricsRow}>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>Tareas</Text>
          <Text style={styles.metricValue}>
            {metrics.completedTasks}/{metrics.totalTasks}
          </Text>
        </View>

        <View style={styles.metric}>
          <Text style={styles.metricLabel}>Velocidad</Text>
          <Text style={styles.metricValue}>
            {metrics.tasksPerSecond.toFixed(1)}/s
          </Text>
        </View>

        <View style={styles.metric}>
          <Text style={styles.metricLabel}>Eficiencia</Text>
          <Text style={[styles.metricValue, { color: getEfficiencyColor(metrics.efficiency) }]}>
            {metrics.efficiency}
          </Text>
        </View>
      </View>

      {/* Métricas detalladas (solo en desarrollo) */}
      {showDevInfo && (
        <View style={styles.detailMetrics}>
          <Text style={styles.detailTitle}>📊 Performance Avanzada</Text>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Tiempo promedio por tarea:</Text>
            <Text style={styles.detailValue}>{metrics.averageTaskTime.toFixed(1)}ms</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Cache hit rate:</Text>
            <Text style={styles.detailValue}>{metrics.cacheHitRate}%</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Estado del sistema:</Text>
            <Text style={styles.detailValue}>
              {isValidating ? 'Procesando' : 'Optimizado'}
            </Text>
          </View>
        </View>
      )}

      {/* Indicador visual de eficiencia */}
      <View style={styles.efficiencyIndicator}>
        <View style={[styles.efficiencyDot, { backgroundColor: getEfficiencyColor(metrics.efficiency) }]} />
        <Text style={styles.efficiencyText}>
          Validación paralela activa - {metrics.efficiency} rendimiento
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0fdf4', // Verde muy suave para indicar sistema optimizado
    borderRadius: 12,
    padding: 16,
    margin: 16,
    borderWidth: 1,
    borderColor: '#bbf7d0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 12,
    textAlign: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressBar: {
    flex: 1,
    height: 10,
    backgroundColor: '#e9ecef',
    borderRadius: 5,
    overflow: 'hidden',
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
  },
  progressText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.colors.text,
    minWidth: 35,
  },
  status: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 16,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  metric: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 8,
    minWidth: 70,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  metricLabel: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  detailMetrics: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  detailTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  detailLabel: {
    fontSize: 12,
    color: '#6c757d',
    flex: 1,
  },
  detailValue: {
    fontSize: 12,
    fontWeight: '500',
    color: theme.colors.text,
  },
  efficiencyIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  efficiencyDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  efficiencyText: {
    fontSize: 12,
    color: '#059669',
    fontStyle: 'italic',
    fontWeight: '500',
  },
});
