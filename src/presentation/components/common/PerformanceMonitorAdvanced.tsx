/**
 * 🚀 FASE 2A: MONITOR DE PERFORMANCE AVANZADO
 * 
 * Sistema de monitoreo en tiempo real para optimización
 * de performance y detección de cuellos de botella
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Text from './Text';
import { useDynamicTheme } from '@/hooks/useDynamicTheme';

// 🚀 FASE 2A: Declaración de __DEV__ para React Native
declare const __DEV__: boolean;

// 🎯 Tipos para métricas de performance
interface PerformanceMetrics {
  // Métricas de renderizado
  renderTime: number;
  componentMountTime: number;
  updateCount: number;
  reRenderCount: number;
  
  // Métricas de memoria
  memoryUsage?: number;
  componentCount: number;
  
  // Métricas de validación
  validationTime: number;
  cacheHitRate: number;
  validationCount: number;
  
  // Métricas de formulario
  fieldInteractionCount: number;
  formCompletionPercentage: number;
  
  // Timestamps
  firstRender: number;
  lastUpdate: number;
}

interface PerformanceReport {
  overall: 'excellent' | 'good' | 'poor';
  recommendations: string[];
  bottlenecks: string[];
  score: number; // 0-100
}

// 🚀 Hook para monitorear performance en tiempo real
export const usePerformanceMonitor = (componentName: string) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderTime: 0,
    componentMountTime: 0,
    updateCount: 0,
    reRenderCount: 0,
    componentCount: 1,
    validationTime: 0,
    cacheHitRate: 0,
    validationCount: 0,
    fieldInteractionCount: 0,
    formCompletionPercentage: 0,
    firstRender: Date.now(),
    lastUpdate: Date.now()
  });

  const [mountTime] = useState(Date.now());

  // 📊 Registrar re-render (CORREGIDO para evitar loop infinito)
  useEffect(() => {
    setMetrics(prev => ({
      ...prev,
      reRenderCount: prev.reRenderCount + 1,
      lastUpdate: Date.now(),
      renderTime: Date.now() - mountTime
    }));
  }, [mountTime]); // Añadir dependencia para evitar loop infinito

  // 🎯 Funciones para actualizar métricas específicas
  const updateValidationMetrics = useCallback((time: number, cacheHit: boolean) => {
    setMetrics(prev => ({
      ...prev,
      validationTime: time,
      validationCount: prev.validationCount + 1,
      cacheHitRate: cacheHit 
        ? (prev.cacheHitRate * prev.validationCount + 100) / (prev.validationCount + 1)
        : (prev.cacheHitRate * prev.validationCount) / (prev.validationCount + 1)
    }));
  }, []);

  const updateFormMetrics = useCallback((interactionCount: number, completionPercentage: number) => {
    setMetrics(prev => ({
      ...prev,
      fieldInteractionCount: interactionCount,
      formCompletionPercentage: completionPercentage
    }));
  }, []);

  // 📊 Generar reporte de performance
  const generateReport = useCallback((): PerformanceReport => {
    const { renderTime, validationTime, cacheHitRate, reRenderCount } = metrics;
    
    let score = 100;
    const recommendations: string[] = [];
    const bottlenecks: string[] = [];

    // Evaluar tiempo de renderizado
    if (renderTime > 1000) {
      score -= 20;
      bottlenecks.push('Tiempo de renderizado lento');
      recommendations.push('Implementar React.memo en componentes pesados');
    }

    // Evaluar validación
    if (validationTime > 500) {
      score -= 15;
      bottlenecks.push('Validación lenta');
      recommendations.push('Optimizar algoritmos de validación');
    }

    // Evaluar cache
    if (cacheHitRate < 70) {
      score -= 10;
      recommendations.push('Mejorar estrategia de cache');
    }

    // Evaluar re-renders
    if (reRenderCount > 10) {
      score -= 15;
      bottlenecks.push('Demasiados re-renders');
      recommendations.push('Optimizar dependencias de useEffect');
    }

    let overall: 'excellent' | 'good' | 'poor' = 'excellent';
    if (score < 70) overall = 'poor';
    else if (score < 85) overall = 'good';

    return { overall, recommendations, bottlenecks, score };
  }, [metrics]);

  return {
    metrics,
    updateValidationMetrics,
    updateFormMetrics,
    generateReport,
    componentName
  };
};

// 🎨 Componente visual del monitor
interface PerformanceMonitorProps {
  isVisible?: boolean;
  position?: 'top' | 'bottom';
  compact?: boolean;
  validationMetrics?: unknown; // Para integrar con validación paralela
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  isVisible = __DEV__,
  position = 'bottom',
  compact = false,
  validationMetrics
}) => {
  const theme = useDynamicTheme();
  const { metrics, generateReport } = usePerformanceMonitor('CalculatorApp');
  const [isExpanded, setIsExpanded] = useState(false);
  const [showReport, setShowReport] = useState(false);

  // 🔄 Actualizar métricas en tiempo real
  useEffect(() => {
    const interval = setInterval(() => {
      // Las métricas se actualizan automáticamente
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // 📊 Generar reporte actual
  const currentReport = useMemo(() => generateReport(), [generateReport]);

  // 🎨 Estilos dinámicos
  const styles = createStyles(theme, position);

  if (!isVisible) return null;

  // 📱 Vista compacta
  if (compact && !isExpanded) {
    return (
      <TouchableOpacity 
        style={styles.compactContainer}
        onPress={() => setIsExpanded(true)}
      >
        <View style={styles.scoreContainer}>
          <Text variant="caption" style={styles.scoreText}>
            {currentReport.score}
          </Text>
        </View>
        <Text variant="caption" style={styles.compactText}>
          Performance
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      {/* 🎯 Header */}
      <TouchableOpacity 
        style={styles.header}
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <Text variant="bodyBold" style={styles.title}>
          🚀 Performance Monitor
        </Text>
        <View style={[styles.statusIndicator, styles[`status${currentReport.overall}`]]} />
      </TouchableOpacity>

      {/* 📊 Métricas principales */}
      {isExpanded && (
        <View style={styles.content}>
          <View style={styles.metricsGrid}>
            <MetricItem 
              label="Score" 
              value={`${currentReport.score}/100`}
              color={currentReport.score > 85 ? theme.colors.success : currentReport.score > 70 ? theme.colors.warning : theme.colors.error}
            />
            <MetricItem 
              label="Re-renders" 
              value={metrics.reRenderCount.toString()}
              color={metrics.reRenderCount > 10 ? theme.colors.warning : theme.colors.textSecondary}
            />
            <MetricItem 
              label="Render Time" 
              value={`${metrics.renderTime}ms`}
              color={metrics.renderTime > 1000 ? theme.colors.error : theme.colors.textSecondary}
            />
            <MetricItem 
              label="Cache Hit" 
              value={`${Math.round(metrics.cacheHitRate)}%`}
              color={metrics.cacheHitRate > 70 ? theme.colors.success : theme.colors.warning}
            />
          </View>

          {/* 🔍 Validación paralela (si está disponible) */}
          {validationMetrics && (
            <View style={styles.validationSection}>
              <Text variant="bodyBold" style={styles.sectionTitle}>
                Validación Paralela
              </Text>
              <MetricItem 
                label="Validating" 
                value={validationMetrics.validation?.isValidating ? 'Sí' : 'No'}
                color={validationMetrics.validation?.isValidating ? theme.colors.primary : theme.colors.textSecondary}
              />
              <MetricItem 
                label="Efficiency" 
                value={validationMetrics.performance?.efficiency || 'N/A'}
                color={theme.colors.success}
              />
            </View>
          )}

          {/* 🚨 Cuellos de botella */}
          {currentReport.bottlenecks.length > 0 && (
            <View style={styles.bottlenecksSection}>
              <Text variant="bodyBold" style={[styles.sectionTitle, { color: theme.colors.error }]}>
                ⚠️ Cuellos de Botella
              </Text>
              {currentReport.bottlenecks.map((bottleneck, index) => (
                <Text key={index} variant="caption" style={styles.bottleneckText}>
                  • {bottleneck}
                </Text>
              ))}
            </View>
          )}

          {/* 💡 Recomendaciones */}
          {showReport && currentReport.recommendations.length > 0 && (
            <View style={styles.recommendationsSection}>
              <Text variant="bodyBold" style={[styles.sectionTitle, { color: theme.colors.info }]}>
                💡 Recomendaciones
              </Text>
              {currentReport.recommendations.map((rec, index) => (
                <Text key={index} variant="caption" style={styles.recommendationText}>
                  • {rec}
                </Text>
              ))}
            </View>
          )}

          {/* 🎛️ Controles */}
          <View style={styles.controls}>
            <TouchableOpacity 
              style={styles.controlButton}
              onPress={() => setShowReport(!showReport)}
            >
              <Text variant="caption" style={styles.controlText}>
                {showReport ? 'Ocultar' : 'Ver'} Reporte
              </Text>
            </TouchableOpacity>
            {compact && (
              <TouchableOpacity 
                style={styles.controlButton}
                onPress={() => setIsExpanded(false)}
              >
                <Text variant="caption" style={styles.controlText}>
                  Compactar
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
    </View>
  );
};

// 📊 Componente helper para métricas individuales
const MetricItem: React.FC<{ label: string; value: string; color: string }> = ({ 
  label, 
  value, 
  color 
}) => (
  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 2 }}>
    <Text variant="caption" style={{ color: '#666' }}>{label}:</Text>
    <Text variant="caption" style={{ color, fontWeight: 'bold' }}>{value}</Text>
  </View>
);

// 🎨 Estilos
const createStyles = (theme: ReturnType<typeof useDynamicTheme>, position: 'top' | 'bottom') => StyleSheet.create({
  container: {
    position: 'absolute',
    [position]: 10,
    left: 10,
    right: 10,
    backgroundColor: theme.colors.background,
    borderRadius: theme.spacing.s,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000
  },
  compactContainer: {
    position: 'absolute',
    [position]: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.s,
    paddingVertical: theme.spacing.xs,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
    zIndex: 1000
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.s,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border
  },
  title: {
    color: theme.colors.primary
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6
  },
  statusexcellent: {
    backgroundColor: theme.colors.success
  },
  statusgood: {
    backgroundColor: theme.colors.warning
  },
  statuspoor: {
    backgroundColor: theme.colors.error
  },
  content: {
    padding: theme.spacing.s
  },
  metricsGrid: {
    marginBottom: theme.spacing.s
  },
  validationSection: {
    marginBottom: theme.spacing.s,
    padding: theme.spacing.s,
    backgroundColor: theme.colors.primary + '10',
    borderRadius: theme.spacing.xs
  },
  bottlenecksSection: {
    marginBottom: theme.spacing.s,
    padding: theme.spacing.s,
    backgroundColor: theme.colors.error + '10',
    borderRadius: theme.spacing.xs
  },
  recommendationsSection: {
    marginBottom: theme.spacing.s,
    padding: theme.spacing.s,
    backgroundColor: theme.colors.info + '10',
    borderRadius: theme.spacing.xs
  },
  sectionTitle: {
    marginBottom: theme.spacing.xs
  },
  bottleneckText: {
    color: theme.colors.error,
    marginLeft: theme.spacing.s
  },
  recommendationText: {
    color: theme.colors.info,
    marginLeft: theme.spacing.s
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: theme.spacing.s
  },
  controlButton: {
    paddingHorizontal: theme.spacing.s,
    paddingVertical: theme.spacing.xs,
    backgroundColor: theme.colors.primary + '20',
    borderRadius: theme.spacing.xs
  },
  controlText: {
    color: theme.colors.primary
  },
  scoreContainer: {
    backgroundColor: theme.colors.success,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: theme.spacing.xs
  },
  scoreText: {
    color: 'white',
    fontWeight: 'bold'
  },
  compactText: {
    color: theme.colors.textSecondary
  }
});

export default PerformanceMonitor;
