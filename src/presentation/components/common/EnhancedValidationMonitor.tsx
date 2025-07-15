// ===================================================================
// 🎨 MONITOR DE VALIDACIÓN PARALELA MEJORADO - PERSONALIZACIÓN VISUAL
// ===================================================================

import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import Text from './Text';
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

export const EnhancedValidationMonitor: React.FC<Props> = ({
  isValidating,
  progress,
  metrics,
  showDevInfo = false
}) => {
  const [animatedProgress] = React.useState(new Animated.Value(0));
  const [pulseAnimation] = React.useState(new Animated.Value(1));

  // 🎯 Animar progreso
  React.useEffect(() => {
    Animated.timing(animatedProgress, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  // 🎯 Animación de pulso cuando está validando
  React.useEffect(() => {
    if (isValidating) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnimation, {
            toValue: 1.05,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnimation, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
    } else {
      pulseAnimation.setValue(1);
    }
  }, [isValidating]);

  if (!showDevInfo && process.env.NODE_ENV !== 'development') {
    return null;
  }

  const getProgressColor = (progress: number) => {
    if (progress < 30) return ['#ff9800', '#ffb74d'];
    if (progress < 70) return ['#2196f3', '#64b5f6'];
    return ['#4caf50', '#81c784'];
  };

  const getEfficiencyColor = (efficiency: string) => {
    switch (efficiency) {
      case 'Excelente': return '#4caf50';
      case 'Buena': return '#2196f3';
      case 'Regular': return '#ff9800';
      default: return '#f44336';
    }
  };

  const getStatusIcon = () => {
    if (isValidating) return '⚡';
    if (progress === 100) return '✅';
    return '🔄';
  };

  const progressColors = getProgressColor(progress);

  return (
    <Animated.View 
      style={[
        styles.container,
        {
          transform: [{ scale: pulseAnimation }],
          backgroundColor: isValidating ? '#e8f5e8' : '#f0fdf4'
        }
      ]}
    >
      {/* 🎯 Header con animación */}
      <View style={styles.header}>
        <Text style={styles.icon}>{getStatusIcon()}</Text>
        <Text style={styles.title}>Validación Paralela Avanzada</Text>
        <View style={[styles.statusDot, { backgroundColor: getEfficiencyColor(metrics.efficiency) }]} />
      </View>

      {/* 📊 Progreso principal con gradiente animado */}
      <View style={styles.progressSection}>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  width: animatedProgress.interpolate({
                    inputRange: [0, 100],
                    outputRange: ['0%', '100%'],
                    extrapolate: 'clamp',
                  }),
                  backgroundColor: progressColors[0],
                }
              ]}
            >
              <View 
                style={[
                  styles.progressGradient,
                  { backgroundColor: progressColors[1] }
                ]} 
              />
            </Animated.View>
          </View>
          <Text style={styles.progressText}>{Math.round(progress)}%</Text>
        </View>
        
        {/* 🎯 Estado descriptivo */}
        <Text style={[styles.status, { color: isValidating ? '#ff6f00' : '#2e7d32' }]}>
          {isValidating ? '🔄 Analizando en tiempo real...' : '✨ Sistema optimizado y listo'}
        </Text>
      </View>

      {/* 📈 Métricas principales con iconos */}
      <View style={styles.metricsGrid}>
        <View style={styles.metricCard}>
          <Text style={styles.metricIcon}>📊</Text>
          <Text style={styles.metricLabel}>Tareas</Text>
          <Text style={styles.metricValue}>
            {metrics.completedTasks}/{metrics.totalTasks}
          </Text>
        </View>

        <View style={styles.metricCard}>
          <Text style={styles.metricIcon}>⚡</Text>
          <Text style={styles.metricLabel}>Velocidad</Text>
          <Text style={styles.metricValue}>
            {metrics.tasksPerSecond.toFixed(1)}/s
          </Text>
        </View>

        <View style={styles.metricCard}>
          <Text style={styles.metricIcon}>🎯</Text>
          <Text style={styles.metricLabel}>Eficiencia</Text>
          <Text style={[styles.metricValue, { color: getEfficiencyColor(metrics.efficiency) }]}>
            {metrics.efficiency}
          </Text>
        </View>
      </View>

      {/* 🔍 Métricas detalladas (solo en desarrollo) */}
      {showDevInfo && (
        <View style={styles.detailSection}>
          <Text style={styles.detailTitle}>🔬 Métricas Avanzadas</Text>
          
          <View style={styles.detailGrid}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>⏱️ Tiempo promedio</Text>
              <Text style={styles.detailValue}>{metrics.averageTaskTime.toFixed(1)}ms</Text>
            </View>
            
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>💾 Cache hit rate</Text>
              <Text style={styles.detailValue}>{metrics.cacheHitRate}%</Text>
            </View>
          </View>
        </View>
      )}

      {/* 🌟 Indicador de estado final */}
      <View style={styles.footer}>
        <View style={[styles.statusIndicator, { backgroundColor: getEfficiencyColor(metrics.efficiency) }]} />
        <Text style={styles.footerText}>
          Sistema de validación inteligente activo
        </Text>
        <Text style={styles.efficiencyBadge}>
          {metrics.efficiency} performance
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 20,
    margin: 16,
    borderWidth: 1,
    borderColor: '#bbf7d0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  icon: {
    fontSize: 24,
    marginRight: 8,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  progressSection: {
    marginBottom: 20,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressBar: {
    flex: 1,
    height: 12,
    backgroundColor: '#e9ecef',
    borderRadius: 6,
    overflow: 'hidden',
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
    position: 'relative',
  },
  progressGradient: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '30%',
    height: '100%',
    opacity: 0.6,
  },
  progressText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
    minWidth: 45,
    textAlign: 'right',
  },
  status: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  metricCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  metricIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 11,
    color: '#6c757d',
    marginBottom: 4,
    textAlign: 'center',
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.primary,
    textAlign: 'center',
  },
  detailSection: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  detailTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 12,
  },
  detailGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    flex: 1,
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 4,
    textAlign: 'center',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  footerText: {
    flex: 1,
    fontSize: 12,
    color: '#059669',
    fontWeight: '500',
  },
  efficiencyBadge: {
    fontSize: 11,
    color: '#6c757d',
    fontStyle: 'italic',
    backgroundColor: '#e9ecef',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
});
