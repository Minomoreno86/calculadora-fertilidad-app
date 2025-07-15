/**
 * 🚀 FASE 1.2: Componente de Monitoreo de Validación Paralela
 * 
 * Componente React que muestra en tiempo real el estado
 * y métricas del sistema de validación paralela.
 * 
 * Características:
 * - Visualización en tiempo real del progreso
 * - Métricas de performance detalladas
 * - Controles para debugging y optimización
 * - Interfaz responsiva y clara
 */

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Text from './Text';
import { Ionicons } from '@expo/vector-icons';
import { useDynamicTheme } from '../../../hooks/useDynamicTheme';
import { useParallelValidation } from '@/presentation/features/calculator/hooks/useParallelValidationSimple';

export interface ParallelValidationMonitorProps {
  onClose?: () => void;
  compact?: boolean;
  showAdvancedMetrics?: boolean;
}

/**
 * Componente principal de monitoreo
 */
const ParallelValidationMonitor: React.FC<ParallelValidationMonitorProps> = ({
  onClose,
  compact = false,
  showAdvancedMetrics = false
}) => {
  // 🎨 TEMA DINÁMICO
  const theme = useDynamicTheme();
  
  const [state, controls] = useParallelValidation({
    enableMetrics: true
  });

  const [expanded, setExpanded] = useState(!compact);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // 🎨 Crear estilos dinámicos
  const styles = createStyles(theme);

  /**
   * Auto-refresh cada segundo cuando está activo
   */
  useEffect(() => {
    if (!autoRefresh || !state.isRunning) return;

    const interval = setInterval(() => {
      // El estado se actualiza automáticamente por el hook
    }, 1000);

    return () => clearInterval(interval);
  }, [autoRefresh, state.isRunning]);

  /**
   * Formatear tiempo en ms a string legible
   */
  const formatTime = (ms: number): string => {
    if (ms < 1000) return `${ms.toFixed(0)}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${(ms / 60000).toFixed(1)}m`;
  };

  /**
   * Obtener color basado en performance
   */
  const getPerformanceColor = (value: number, type: 'time' | 'percentage'): string => {
    if (type === 'time') {
      if (value < 100) return '#22c55e'; // Verde - rápido
      if (value < 500) return '#f59e0b'; // Amarillo - normal
      return '#ef4444'; // Rojo - lento
    } else {
      if (value > 80) return '#22c55e'; // Verde - excelente
      if (value > 60) return '#f59e0b'; // Amarillo - bueno
      return '#ef4444'; // Rojo - necesita mejora
    }
  };

  /**
   * Obtener icono de estado
   */
  const getStatusIcon = (): keyof typeof Ionicons.glyphMap => {
    if (state.isRunning) return 'flash-outline';
    if (state.error) return 'warning-outline';
    if (state.progress.phase === 'complete') return 'checkmark-circle-outline';
    return 'pause-circle-outline';
  };

  /**
   * Calcular estadísticas resumidas
   */
  const stats = {
    totalValidations: state.results.size,
    successRate: state.metrics.totalTasks > 0 ? 
      ((state.metrics.completedTasks / state.metrics.totalTasks) * 100) : 0,
    avgTime: state.metrics.averageTime,
    cacheHit: state.metrics.cacheHitRate * 100,
    efficiency: state.metrics.totalTasks > 0 ?
      ((state.metrics.completedTasks / state.metrics.totalTasks) * 100) : 0
  };

  if (compact && !expanded) {
    return (
      <TouchableOpacity 
        style={styles.compactContainer}
        onPress={() => setExpanded(true)}
      >
        <Ionicons 
          name={getStatusIcon()} 
          size={16} 
          color={state.isRunning ? theme.colors.primary : theme.colors.text} 
        />
        <Text style={styles.compactText}>
          {state.isRunning ? `${state.progress.progress.toFixed(0)}%` : 'Monitor'}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Ionicons 
            name={getStatusIcon()} 
            size={20} 
            color={state.isRunning ? theme.colors.primary : theme.colors.text} 
          />
          <Text style={styles.title}>Validación Paralela</Text>
          <View style={[
            styles.statusBadge,
            { backgroundColor: state.isRunning ? '#22c55e' : '#6b7280' }
          ]}>
            <Text style={styles.statusText}>
              {state.isRunning ? 'ACTIVO' : 'INACTIVO'}
            </Text>
          </View>
        </View>
        
        <View style={styles.controls}>
          <TouchableOpacity
            onPress={() => setAutoRefresh(!autoRefresh)}
            style={[styles.controlButton, autoRefresh && styles.controlButtonActive]}
          >
            <Ionicons 
              name="refresh-outline" 
              size={16} 
              color={autoRefresh ? theme.colors.white : theme.colors.text} 
            />
          </TouchableOpacity>
          
          {onClose && (
            <TouchableOpacity onPress={onClose} style={styles.controlButton}>
              <Ionicons name="close-outline" size={16} color={theme.colors.text} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Progress Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Progreso</Text>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill,
                  { width: `${state.progress.progress}%` }
                ]}
              />
            </View>
            <Text style={styles.progressText}>{state.progress.progress.toFixed(1)}%</Text>
          </View>
          
          <View style={styles.phaseInfo}>
            <Text style={styles.phaseText}>
              Fase: <Text style={styles.phaseValue}>{state.progress.phase}</Text>
            </Text>
            {state.progress.currentGroup && (
              <Text style={styles.phaseText}>
                Grupo: <Text style={styles.phaseValue}>{state.progress.currentGroup}</Text>
              </Text>
            )}
            <Text style={styles.phaseText}>
              Tiempo restante: <Text style={styles.phaseValue}>
                {formatTime(state.progress.estimatedTimeRemaining)}
              </Text>
            </Text>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estadísticas Rápidas</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.totalValidations}</Text>
              <Text style={styles.statLabel}>Validaciones</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={[
                styles.statValue,
                { color: getPerformanceColor(stats.successRate, 'percentage') }
              ]}>
                {stats.successRate.toFixed(0)}%
              </Text>
              <Text style={styles.statLabel}>Éxito</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={[
                styles.statValue,
                { color: getPerformanceColor(stats.avgTime, 'time') }
              ]}>
                {formatTime(stats.avgTime)}
              </Text>
              <Text style={styles.statLabel}>Tiempo Prom.</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={[
                styles.statValue,
                { color: getPerformanceColor(stats.cacheHit, 'percentage') }
              ]}>
                {stats.cacheHit.toFixed(0)}%
              </Text>
              <Text style={styles.statLabel}>Cache Hit</Text>
            </View>
          </View>
        </View>

        {/* Advanced Metrics */}
        {showAdvancedMetrics && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Métricas Avanzadas</Text>
            
            <View style={styles.metricsList}>
              <View style={styles.metricRow}>
                <Text style={styles.metricLabel}>Tareas Totales:</Text>
                <Text style={styles.metricValue}>{state.metrics.totalTasks}</Text>
              </View>
              
              <View style={styles.metricRow}>
                <Text style={styles.metricLabel}>Completadas:</Text>
                <Text style={[styles.metricValue, { color: '#22c55e' }]}>
                  {state.metrics.completedTasks}
                </Text>
              </View>
              
              <View style={styles.metricRow}>
                <Text style={styles.metricLabel}>Fallidas:</Text>
                <Text style={[styles.metricValue, { color: '#ef4444' }]}>
                  {state.metrics.failedTasks}
                </Text>
              </View>
              
              <View style={styles.metricRow}>
                <Text style={styles.metricLabel}>Concurrencia:</Text>
                <Text style={styles.metricValue}>{state.metrics.concurrencyLevel}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Controls */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Controles</Text>
          
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, styles.primaryButton]}
              onPress={() => controls.startValidation([])}
              disabled={state.isRunning}
            >
              <Ionicons name="play-outline" size={16} color={theme.colors.white} />
              <Text style={styles.actionButtonText}>Probar Validación</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.actionButton, styles.primaryButton]}
              onPress={() => controls.getQuickValidation({})}
              disabled={state.isRunning}
            >
              <Ionicons name="flash-outline" size={16} color={theme.colors.white} />
              <Text style={styles.actionButtonText}>Validación Rápida</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.actionButton, styles.secondaryButton]}
              onPress={controls.clearResults}
            >
              <Ionicons name="trash-outline" size={16} color={theme.colors.primary} />
              <Text style={[styles.actionButtonText, { color: theme.colors.primary }]}>
                Limpiar
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Error Display */}
        {state.error && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: '#ef4444' }]}>Error</Text>
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{state.error.message}</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

// 🎨 Función para crear estilos dinámicos
const createStyles = (theme: ReturnType<typeof useDynamicTheme>) => StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  compactText: {
    marginLeft: 6,
    fontSize: 12,
    color: theme.colors.text,
    fontWeight: '500',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.isDark ? '#404040' : '#e0e0e0',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginLeft: 8,
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: theme.colors.white,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlButton: {
    padding: 8,
    borderRadius: 6,
    marginLeft: 4,
  },
  controlButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  content: {
    maxHeight: 400,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.isDark ? '#404040' : '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 12,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: theme.isDark ? '#404040' : '#e5e7eb',
    borderRadius: 3,
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.text,
    minWidth: 40,
  },
  phaseInfo: {
    gap: 4,
  },
  phaseText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  phaseValue: {
    fontWeight: '500',
    color: theme.colors.text,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
  },
  statLabel: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    marginTop: 2,
    textAlign: 'center',
  },
  metricsList: {
    gap: 8,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  metricValue: {
    fontSize: 12,
    fontWeight: '500',
    color: theme.colors.text,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: theme.colors.white,
  },
  errorContainer: {
    backgroundColor: theme.isDark ? '#3C1E1E' : '#fef2f2',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
  },
  errorText: {
    fontSize: 12,
    color: '#dc2626',
  },
});

export default ParallelValidationMonitor;
