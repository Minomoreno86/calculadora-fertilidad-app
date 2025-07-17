// ===================================================================
// 🚀 FASE 4A: DASHBOARD DE PERFORMANCE PARA DESARROLLO
// ===================================================================

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useBenchmark } from '../../../core/utils/performanceBenchmark';
import { theme } from '../../../config/theme';

interface PerformanceDashboardProps {
  isVisible?: boolean;
  onToggle?: () => void;
}

export const PerformanceDashboard: React.FC<PerformanceDashboardProps> = ({
  isVisible = false,
  onToggle
}) => {
  const { getReport, getDetailedStats, clearMetrics } = useBenchmark();
  const [refreshCounter, setRefreshCounter] = useState(0);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // 🔄 Auto-refresh cada 5 segundos
  useEffect(() => {
    if (!autoRefresh || !isVisible) return;
    
    const interval = setInterval(() => {
      setRefreshCounter(prev => prev + 1);
    }, 5000);

    return () => clearInterval(interval);
  }, [autoRefresh, isVisible]);

  if (!isVisible) {
    return (
      <TouchableOpacity style={styles.toggleButton} onPress={onToggle}>
        <Text style={styles.toggleText}>📊 Performance</Text>
      </TouchableOpacity>
    );
  }

  const report = getReport();
  const detailedStats = getDetailedStats();

  const getPerformanceColor = (value: number, thresholds: { warning: number; critical: number }) => {
    if (value > thresholds.critical) return '#ff4444';
    if (value > thresholds.warning) return '#ffaa00';
    return '#44ff44';
  };

  const getDeviceEmoji = (category: string) => {
    switch (category) {
      case 'mobile': return '📱';
      case 'tablet': return '📟';
      case 'desktop': return '💻';
      default: return '❓';
    }
  };

  const getPerformanceEmoji = (performance: string) => {
    switch (performance) {
      case 'high': return '🚀';
      case 'medium': return '⚡';
      case 'low': return '🐌';
      default: return '❓';
    }
  };

  return (
    <View style={styles.container}>
      {/* 📱 Header con controles */}
      <View style={styles.header}>
        <Text style={styles.title}>📊 Performance Dashboard</Text>
        <View style={styles.controls}>
          <TouchableOpacity 
            style={[styles.button, autoRefresh && styles.buttonActive]} 
            onPress={() => setAutoRefresh(!autoRefresh)}
          >
            <Text style={styles.buttonText}>🔄 Auto</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={clearMetrics}>
            <Text style={styles.buttonText}>🧹 Clear</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={onToggle}>
            <Text style={styles.buttonText}>❌</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* 🔍 Device Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {getDeviceEmoji(detailedStats.deviceInfo.category)} Device Info
          </Text>
          <View style={styles.row}>
            <Text style={styles.label}>Type:</Text>
            <Text style={styles.value}>
              {detailedStats.deviceInfo.category} {getPerformanceEmoji(detailedStats.deviceInfo.performance)}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Memory:</Text>
            <Text style={styles.value}>{detailedStats.memoryUsage}KB</Text>
          </View>
        </View>

        {/* 📊 Metrics Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📈 Metrics ({report.totalMetrics})</Text>
          {Object.entries(report.categories).map(([category, count]) => (
            <View key={category} style={styles.row}>
              <Text style={styles.label}>{category}:</Text>
              <Text style={styles.value}>{count}</Text>
            </View>
          ))}
        </View>

        {/* ⚡ Performance Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚡ Average Times</Text>
          {Object.entries(report.averageTimes).slice(0, 10).map(([name, time]) => {
            const thresholds = detailedStats.thresholds.calculation;
            const color = getPerformanceColor(time, thresholds);
            
            return (
              <View key={name} style={styles.row}>
                <Text style={[styles.label, { flex: 2 }]} numberOfLines={1}>
                  {name.replace(/([A-Z])/g, ' $1').trim()}:
                </Text>
                <Text style={[styles.value, { color }]}>
                  {time.toFixed(1)}ms
                </Text>
              </View>
            );
          })}
        </View>

        {/* 🔄 Render Metrics */}
        {report.renderMetrics.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🔄 Component Renders</Text>
            {report.renderMetrics.slice(0, 8).map((metric) => (
              <View key={metric.componentName} style={styles.renderRow}>
                <Text style={[styles.label, { flex: 2 }]} numberOfLines={1}>
                  {metric.componentName}:
                </Text>
                <Text style={styles.value}>
                  {metric.renderCount}x ({metric.averageRenderTime.toFixed(1)}ms)
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* 📈 Trends */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📈 Trends</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Status:</Text>
            <Text style={[
              styles.value,
              { color: detailedStats.trends.stability === 'stable' ? '#44ff44' : 
                       detailedStats.trends.stability === 'improving' ? '#00aaff' : '#ff4444' }
            ]}>
              {detailedStats.trends.stability}
            </Text>
          </View>
          {detailedStats.trends.degradation > 5 && (
            <View style={styles.row}>
              <Text style={styles.label}>Degradation:</Text>
              <Text style={[styles.value, { color: '#ff4444' }]}>
                {detailedStats.trends.degradation.toFixed(1)}%
              </Text>
            </View>
          )}
        </View>

        {/* ⚠️ Recommendations */}
        {report.recommendations.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>💡 Recommendations</Text>
            {report.recommendations.map((rec, index) => (
              <Text key={index} style={styles.recommendation}>
                {rec}
              </Text>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 100,
    right: 10,
    width: 320,
    maxHeight: 600,
    backgroundColor: theme.colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000
  },
  toggleButton: {
    position: 'absolute',
    top: 100,
    right: 10,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    zIndex: 1000
  },
  toggleText: {
    color: theme.colors.background,
    fontSize: 12,
    fontWeight: 'bold'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: theme.colors.primary,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8
  },
  title: {
    color: theme.colors.background,
    fontSize: 14,
    fontWeight: 'bold'
  },
  controls: {
    flexDirection: 'row',
    gap: 8
  },
  button: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4
  },
  buttonActive: {
    backgroundColor: 'rgba(255,255,255,0.4)'
  },
  buttonText: {
    color: theme.colors.background,
    fontSize: 10,
    fontWeight: 'bold'
  },
  content: {
    maxHeight: 500
  },
  section: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 8
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4
  },
  renderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4
  },
  label: {
    fontSize: 10,
    color: theme.colors.text,
    flex: 1
  },
  value: {
    fontSize: 10,
    fontWeight: 'bold',
    color: theme.colors.subtleText
  },
  recommendation: {
    fontSize: 9,
    color: theme.colors.text,
    marginBottom: 4,
    lineHeight: 12
  }
});
