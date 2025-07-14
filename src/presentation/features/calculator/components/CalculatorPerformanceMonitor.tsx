// ===================================================================
// 🚀 MONITOR DE RENDIMIENTO PARA VALIDACIÓN PARALELA - CALCULADORA
// ===================================================================

// Declaración global para React Native
declare const __DEV__: boolean;

import React, { memo, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import Text from '@/presentation/components/common/Text';
import { theme } from '@/config/theme';

// 🎯 Tipos mejorados para máxima compatibilidad
interface CalculatorPerformanceProps {
  isValidating: boolean;
  progress: number;
  metrics: {
    validation: {
      isValidating: boolean;
      progress: number;
      isFormValid: boolean;
      errorCount: number;
      warningCount: number;
    };
    performance: {
      totalTime: number;
      averageTaskTime: number;
      cacheHitRate: number;
      tasksPerSecond: number;
      efficiency: string;
      status: string;
    };
  };
  devData?: {
    totalTasks: number;
    completedTasks: number;
    cacheStats: {
      size: number;
      hitRate: number;
      hits: number;
      requests: number;
    };
  };
  showDevInfo?: boolean;
}

// 🔧 Tipos para adaptar diferentes formatos de métricas
interface AdaptableMetrics {
  isValidating?: boolean;
  progress?: number;
  isFormValid?: boolean;
  errorCount?: number;
  warningCount?: number;
  validation?: Record<string, unknown>;
  performance?: {
    totalTime?: number;
    averageTaskTime?: number;
    cacheHitRate?: number;
    tasksPerSecond?: number;
    efficiency?: string;
    status?: string;
  };
}

// 🔧 Función utilitaria para adaptar métricas del sistema al formato del componente
export const adaptMetricsForMonitor = (parallelValidationMetrics: AdaptableMetrics): CalculatorPerformanceProps['metrics'] => {
  // Manejo de métricas del useCalculatorParallelValidation
  if (parallelValidationMetrics?.validation && parallelValidationMetrics?.performance) {
    return parallelValidationMetrics as CalculatorPerformanceProps['metrics'];
  }
  
  // Adaptación para useParallelValidation format
  return {
    validation: {
      isValidating: parallelValidationMetrics?.isValidating || false,
      progress: parallelValidationMetrics?.progress || 0,
      isFormValid: parallelValidationMetrics?.isFormValid || false,
      errorCount: parallelValidationMetrics?.errorCount || 0,
      warningCount: parallelValidationMetrics?.warningCount || 0,
    },
    performance: {
      totalTime: parallelValidationMetrics?.performance?.totalTime || 0,
      averageTaskTime: parallelValidationMetrics?.performance?.averageTaskTime || 0,
      cacheHitRate: parallelValidationMetrics?.performance?.cacheHitRate || 0,
      tasksPerSecond: parallelValidationMetrics?.performance?.tasksPerSecond || 0,
      efficiency: parallelValidationMetrics?.performance?.efficiency || 'N/A',
      status: parallelValidationMetrics?.performance?.status || 'Listo',
    }
  };
};

export const CalculatorPerformanceMonitor = memo<CalculatorPerformanceProps>(({
  isValidating,
  progress,
  metrics,
  devData,
  showDevInfo = typeof __DEV__ !== 'undefined' && __DEV__
}) => {
  
  // 🎨 Determinar color del progreso basado en estado
  const progressColor = useMemo(() => {
    if (isValidating) return theme.colors.primary;
    if (metrics.validation.errorCount > 0) return theme.colors.error;
    if (metrics.validation.warningCount > 0) return theme.colors.warning;
    return theme.colors.success;
  }, [isValidating, metrics.validation.errorCount, metrics.validation.warningCount]);

  // 📊 Formatear métricas para mostrar
  const formattedMetrics = useMemo(() => ({
    totalTime: `${metrics.performance.totalTime}ms`,
    averageTime: `${metrics.performance.averageTaskTime}ms`,
    cacheHit: `${metrics.performance.cacheHitRate}%`,
    speed: `${metrics.performance.tasksPerSecond} tareas/s`,
    efficiency: metrics.performance.efficiency,
    status: metrics.performance.status
  }), [metrics.performance]);

  // 🎯 Estado de validación
  const validationStatus = useMemo(() => {
    if (isValidating) return { text: 'Validando...', color: theme.colors.primary };
    if (metrics.validation.errorCount > 0) return { text: 'Errores detectados', color: theme.colors.error };
    if (metrics.validation.warningCount > 0) return { text: 'Advertencias', color: theme.colors.warning };
    return { text: 'Validación exitosa', color: theme.colors.success };
  }, [isValidating, metrics.validation]);

  // 🎨 Determinar color de eficiencia
  const efficiencyColor = useMemo(() => {
    if (formattedMetrics.efficiency === 'Excelente') return theme.colors.success;
    if (formattedMetrics.efficiency === 'Buena') return theme.colors.warning;
    return theme.colors.error;
  }, [formattedMetrics.efficiency]);

  if (!showDevInfo && !isValidating && metrics.validation.isFormValid) {
    return null; // Ocultar en producción si todo está bien
  }

  return (
    <View style={styles.container}>
      {/* 📊 Estado general */}
      <View style={styles.statusRow}>
        <Text style={[styles.statusText, { color: validationStatus.color }]}>
          {validationStatus.text}
        </Text>
        <Text style={styles.progressText}>
          {progress}%
        </Text>
      </View>

      {/* 📈 Barra de progreso */}
      {isValidating && (
        <View style={styles.progressContainer}>
          <View 
            style={[
              styles.progressBar, 
              { 
                width: `${progress}%`,
                backgroundColor: progressColor 
              }
            ]} 
          />
        </View>
      )}

      {/* ⚠️ Errores y advertencias */}
      {(metrics.validation.errorCount > 0 || metrics.validation.warningCount > 0) && (
        <View style={styles.alertsRow}>
          {metrics.validation.errorCount > 0 && (
            <Text style={styles.errorText}>
              {metrics.validation.errorCount} error{metrics.validation.errorCount !== 1 ? 'es' : ''}
            </Text>
          )}
          {metrics.validation.warningCount > 0 && (
            <Text style={styles.warningText}>
              {metrics.validation.warningCount} advertencia{metrics.validation.warningCount !== 1 ? 's' : ''}
            </Text>
          )}
        </View>
      )}

      {/* 🔧 Información de desarrollo */}
      {showDevInfo && devData && (
        <View style={styles.devSection}>
          <Text style={styles.devTitle}>📊 Métricas de Rendimiento</Text>
          
          <View style={styles.metricsGrid}>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Tiempo Total</Text>
              <Text style={styles.metricValue}>{formattedMetrics.totalTime}</Text>
            </View>
            
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Promedio/Tarea</Text>
              <Text style={styles.metricValue}>{formattedMetrics.averageTime}</Text>
            </View>
            
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Cache Hit</Text>
              <Text style={styles.metricValue}>{formattedMetrics.cacheHit}</Text>
            </View>
            
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Velocidad</Text>
              <Text style={styles.metricValue}>{formattedMetrics.speed}</Text>
            </View>
          </View>
          
          <View style={styles.efficiencyRow}>
            <Text style={styles.efficiencyLabel}>Eficiencia: </Text>
            <Text style={[
              styles.efficiencyValue,
              { color: efficiencyColor }
            ]}>
              {formattedMetrics.efficiency}
            </Text>
          </View>

          {/* 📈 Estadísticas detalladas */}
          <View style={styles.detailsSection}>
            <Text style={styles.detailsTitle}>Detalles Técnicos</Text>
            <Text style={styles.detailsText}>
              Tareas: {devData.completedTasks}/{devData.totalTasks}
            </Text>
            <Text style={styles.detailsText}>
              Cache: {devData.cacheStats.hits}/{devData.cacheStats.requests} (tamaño: {devData.cacheStats.size})
            </Text>
          </View>
        </View>
      )}
    </View>
  );
});

CalculatorPerformanceMonitor.displayName = 'CalculatorPerformanceMonitor';

/**
 * 📖 GUÍA DE USO DEL MONITOR DE PERFORMANCE
 * 
 * Este componente se integra con:
 * - useCalculatorWithParallelValidation (uso directo)
 * - useParallelValidation (con adaptMetricsForMonitor)
 * 
 * Funcionalidades:
 * - Monitor de progreso en tiempo real
 * - Alertas de errores y advertencias
 * - Métricas de performance (dev mode)
 * - Cache stats y eficiencia del sistema
 */

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.m,
    padding: theme.spacing.s,
    marginVertical: theme.spacing.xs,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  
  statusText: {
    ...theme.typography.body,
    fontWeight: '600',
  },
  
  progressText: {
    ...theme.typography.caption,
    color: theme.colors.subtleText,
    fontWeight: '500',
  },
  
  progressContainer: {
    height: 4,
    backgroundColor: theme.colors.border,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: theme.spacing.xs,
  },
  
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },
  
  alertsRow: {
    flexDirection: 'row',
    gap: theme.spacing.s,
    marginBottom: theme.spacing.xs,
  },
  
  errorText: {
    ...theme.typography.caption,
    color: theme.colors.error,
    fontWeight: '600',
  },
  
  warningText: {
    ...theme.typography.caption,
    color: theme.colors.warning,
    fontWeight: '600',
  },
  
  devSection: {
    marginTop: theme.spacing.s,
    paddingTop: theme.spacing.s,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  
  devTitle: {
    ...theme.typography.caption,
    fontWeight: '700',
    marginBottom: theme.spacing.xs,
    color: theme.colors.primary,
  },
  
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
  },
  
  metricItem: {
    flex: 1,
    minWidth: '45%',
    padding: theme.spacing.xs,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.s,
    alignItems: 'center',
  },
  
  metricLabel: {
    ...theme.typography.caption,
    color: theme.colors.subtleText,
    fontSize: 10,
  },
  
  metricValue: {
    ...theme.typography.caption,
    fontWeight: '700',
    color: theme.colors.text,
    marginTop: 2,
  },
  
  efficiencyRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.s,
  },
  
  efficiencyLabel: {
    ...theme.typography.caption,
    color: theme.colors.subtleText,
  },
  
  efficiencyValue: {
    ...theme.typography.caption,
    fontWeight: '700',
  },
  
  detailsSection: {
    marginTop: theme.spacing.s,
    paddingTop: theme.spacing.xs,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  
  detailsTitle: {
    ...theme.typography.caption,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
    color: theme.colors.subtleText,
  },
  
  detailsText: {
    ...theme.typography.caption,
    color: theme.colors.subtleText,
    fontSize: 10,
    marginBottom: 2,
  },
});

export default CalculatorPerformanceMonitor;
