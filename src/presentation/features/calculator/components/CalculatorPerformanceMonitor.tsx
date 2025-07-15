/**
 * CalculatorPerformanceMonitor - Monitor de rendimiento de validación paralela
 * 
 * Características:
 * - Monitoreo en tiempo real de validación paralela
 * - Métricas de performance y cache
 * - Indicadores visuales de estado
 * - Información detallada para desarrollo
 * - Integración temática perfecta
 * 
 * @author AEC-D (Arquitecto Experto Clínico-Digital)
 * @version 2.0 - Armonía total con ecosistema
 */

import React, { memo, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import Text from '@/presentation/components/common/Text';
import { theme } from '@/config/theme';

// 🎯 Interfaces principales optimizadas
interface PerformanceMetrics {
  totalTime: number;
  averageTaskTime: number;
  cacheHitRate: number;
  tasksPerSecond: number;
  efficiency: string;
  status: string;
}

interface ValidationMetrics {
  isValidating: boolean;
  progress: number;
  isFormValid: boolean;
  errorCount: number;
  warningCount: number;
}

interface DevMetrics {
  totalTasks: number;
  completedTasks: number;
  cacheStats: {
    size: number;
    hitRate: number;
    hits: number;
    requests: number;
  };
}

interface CalculatorPerformanceProps {
  isValidating: boolean;
  progress: number;
  metrics: {
    validation: ValidationMetrics;
    performance: PerformanceMetrics;
  };
  devData?: DevMetrics;
  showDevInfo?: boolean;
}

// 🔧 Función utilitaria simplificada para adaptar métricas
export const adaptMetricsForMonitor = (
  rawMetrics: Partial<ValidationMetrics & { performance?: Partial<PerformanceMetrics> }>
): CalculatorPerformanceProps['metrics'] => {
  return {
    validation: {
      isValidating: rawMetrics.isValidating ?? false,
      progress: rawMetrics.progress ?? 0,
      isFormValid: rawMetrics.isFormValid ?? false,
      errorCount: rawMetrics.errorCount ?? 0,
      warningCount: rawMetrics.warningCount ?? 0,
    },
    performance: {
      totalTime: rawMetrics.performance?.totalTime ?? 0,
      averageTaskTime: rawMetrics.performance?.averageTaskTime ?? 0,
      cacheHitRate: rawMetrics.performance?.cacheHitRate ?? 0,
      tasksPerSecond: rawMetrics.performance?.tasksPerSecond ?? 0,
      efficiency: rawMetrics.performance?.efficiency ?? 'N/A',
      status: rawMetrics.performance?.status ?? 'Listo',
    }
  };
};

export const CalculatorPerformanceMonitor = memo<CalculatorPerformanceProps>(({
  isValidating,
  progress,
  metrics,
  devData,
  showDevInfo = false // Simplificado: por defecto false, control externo
}) => {
  
  // Validación defensiva robusta
  const safeMetrics = useMemo(() => ({
    validation: {
      isValidating: metrics?.validation?.isValidating ?? false,
      progress: Math.max(0, Math.min(100, metrics?.validation?.progress ?? 0)),
      isFormValid: metrics?.validation?.isFormValid ?? false,
      errorCount: Math.max(0, metrics?.validation?.errorCount ?? 0),
      warningCount: Math.max(0, metrics?.validation?.warningCount ?? 0),
    },
    performance: {
      totalTime: Math.max(0, metrics?.performance?.totalTime ?? 0),
      averageTaskTime: Math.max(0, metrics?.performance?.averageTaskTime ?? 0),
      cacheHitRate: Math.max(0, Math.min(100, metrics?.performance?.cacheHitRate ?? 0)),
      tasksPerSecond: Math.max(0, metrics?.performance?.tasksPerSecond ?? 0),
      efficiency: metrics?.performance?.efficiency ?? 'N/A',
      status: metrics?.performance?.status ?? 'Listo',
    }
  }), [metrics]);
  // 🎨 Determinar color del progreso basado en estado
  const progressColor = useMemo(() => {
    if (isValidating) return theme.colors.primary;
    if (safeMetrics.validation.errorCount > 0) return theme.colors.error;
    if (safeMetrics.validation.warningCount > 0) return theme.colors.warning;
    return theme.colors.success;
  }, [isValidating, safeMetrics.validation.errorCount, safeMetrics.validation.warningCount]);

  // 📊 Formatear métricas para mostrar
  const formattedMetrics = useMemo(() => ({
    totalTime: `${safeMetrics.performance.totalTime}ms`,
    averageTime: `${safeMetrics.performance.averageTaskTime}ms`,
    cacheHit: `${safeMetrics.performance.cacheHitRate}%`,
    speed: `${safeMetrics.performance.tasksPerSecond} tareas/s`,
    efficiency: safeMetrics.performance.efficiency,
    status: safeMetrics.performance.status
  }), [safeMetrics.performance]);

  // 🎯 Estado de validación
  const validationStatus = useMemo(() => {
    if (isValidating) return { text: 'Validando...', color: theme.colors.primary };
    if (safeMetrics.validation.errorCount > 0) return { text: 'Errores detectados', color: theme.colors.error };
    if (safeMetrics.validation.warningCount > 0) return { text: 'Advertencias', color: theme.colors.warning };
    return { text: 'Validación exitosa', color: theme.colors.success };
  }, [isValidating, safeMetrics.validation]);

  // 🎨 Determinar color de eficiencia
  const efficiencyColor = useMemo(() => {
    if (formattedMetrics.efficiency === 'Excelente') return theme.colors.success;
    if (formattedMetrics.efficiency === 'Buena') return theme.colors.warning;
    return theme.colors.error;
  }, [formattedMetrics.efficiency]);

  // Control de visibilidad: oculta automáticamente en producción cuando todo está correcto
  if (!showDevInfo && !isValidating && safeMetrics.validation.isFormValid && 
      safeMetrics.validation.errorCount === 0 && safeMetrics.validation.warningCount === 0) {
    return null;
  }

  return (
    <View 
      style={styles.container}
      accessibilityRole="progressbar"
      accessibilityLabel={`Monitor de rendimiento: ${validationStatus.text}`}
      accessibilityValue={{ min: 0, max: 100, now: progress }}
    >
      {/* 📊 Estado general */}
      <View style={styles.statusRow}>
        <Text 
          style={[styles.statusText, { color: validationStatus.color }]}
          accessibilityRole="text"
        >
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
            accessibilityElementsHidden={true}
          />
        </View>
      )}

      {/* ⚠️ Errores y advertencias */}
      {(safeMetrics.validation.errorCount > 0 || safeMetrics.validation.warningCount > 0) && (
        <View style={styles.alertsRow}>
          {safeMetrics.validation.errorCount > 0 && (
            <Text style={styles.errorText}>
              {safeMetrics.validation.errorCount} error{safeMetrics.validation.errorCount !== 1 ? 'es' : ''}
            </Text>
          )}
          {safeMetrics.validation.warningCount > 0 && (
            <Text style={styles.warningText}>
              {safeMetrics.validation.warningCount} advertencia{safeMetrics.validation.warningCount !== 1 ? 's' : ''}
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
 * 📖 GUÍA DE USO DEL MONITOR DE PERFORMANCE v2.0
 * 
 * ✅ INTEGRACIÓN DIRECTA:
 * ```tsx
 * <CalculatorPerformanceMonitor
 *   isValidating={isValidating}
 *   progress={progress}
 *   metrics={{
 *     validation: { isValidating, progress, isFormValid, errorCount, warningCount },
 *     performance: { totalTime, averageTaskTime, cacheHitRate, tasksPerSecond, efficiency, status }
 *   }}
 *   devData={devMetrics}
 *   showDevInfo={isDevelopment}
 * />
 * ```
 * 
 * ✅ CON ADAPTADOR (legacy):
 * ```tsx
 * const adaptedMetrics = adaptMetricsForMonitor(rawValidationMetrics);
 * <CalculatorPerformanceMonitor {...props} metrics={adaptedMetrics} />
 * ```
 * 
 * 🔧 CARACTERÍSTICAS:
 * - ✅ Monitor de progreso en tiempo real
 * - ✅ Alertas visuales de errores y advertencias  
 * - ✅ Métricas de performance para desarrollo
 * - ✅ Auto-ocultamiento inteligente en producción
 * - ✅ Accesibilidad completa (a11y)
 * - ✅ Integración temática perfecta
 * 
 * 📊 MÉTRICAS SOPORTADAS:
 * - Tiempo total de validación
 * - Promedio por tarea
 * - Ratio de cache hits
 * - Tareas por segundo
 * - Evaluación de eficiencia
 * - Estado del sistema
 */

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.m,
    padding: theme.spacing.m,
    marginVertical: theme.spacing.xs,
    borderWidth: 1,
    borderColor: theme.colors.border,
    // Sombra profesional
    ...theme.shadows.small,
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
    color: theme.colors.textSecondary,
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
    color: theme.colors.textSecondary,
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
    color: theme.colors.textSecondary,
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
    color: theme.colors.textSecondary,
  },
  
  detailsText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    fontSize: 10,
    marginBottom: 2,
  },
});

export default CalculatorPerformanceMonitor;
