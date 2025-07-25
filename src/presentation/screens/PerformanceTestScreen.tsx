// ===================================================================
// 🚀 FASE 4A: COMPONENTE DE EJEMPLO PARA TESTING DEL PERFORMANCE DASHBOARD
// ===================================================================

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { PerformanceDashboard } from '../components/development/PerformanceDashboard';
import { BenchmarkCard } from '../features/results/components/BenchmarkCard';
import { useBenchmark } from '../../core/utils/performanceBenchmark';
import { theme } from '../../config/theme';

// 🎯 Componente de demostración para la FASE 4A
export const PerformanceTestScreen: React.FC = () => {
  const [dashboardVisible, setDashboardVisible] = useState(false);
  const [testCounter, setTestCounter] = useState(0);
  const { measureTime, benchmarkIterations } = useBenchmark();

  // 📊 Funciones de test para generar métricas
  const runCalculationTest = () => {
    measureTime('heavy_calculation', () => {
      // Simular cálculo pesado
      let result = 0;
      for (let i = 0; i < 100000; i++) {
        result += Math.sqrt(i);
      }
      return result;
    }, 'calculation');
  };

  const runValidationTest = () => {
    measureTime('form_validation', () => {
      // Simular validación de formulario
      const data = { age: 25, weight: 70, height: 165 };
      return Object.keys(data).every(key => data[key as keyof typeof data] > 0);
    }, 'validation');
  };

  const runBenchmarkTest = () => {
    benchmarkIterations('light_operation', () => {
      return Math.random() * 100;
    }, 1000);
  };

  const triggerReRender = () => {
    setTestCounter(prev => prev + 1);
  };

  // 🎯 Report de ejemplo para el BenchmarkCard
  const mockReport = {
    numericPrognosis: 75,
    category: 'BUENO' as const,
    emoji: '😊',
    prognosisPhrase: 'Pronóstico favorable para embarazo natural',
    benchmarkPhrase: `Tu resultado es ${testCounter % 2 === 0 ? 'superior' : 'similar'} al promedio para tu grupo de edad (25-30 años), cuyo pronóstico base es del 70.5%. Test counter: ${testCounter}`,
    clinicalInsights: []
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🚀 FASE 4A: Performance Testing</Text>
      
      {/* 🧪 Controles de Testing */}
      <View style={styles.controlsSection}>
        <Text style={styles.sectionTitle}>🧪 Performance Tests</Text>
        
        <TouchableOpacity style={styles.button} onPress={runCalculationTest}>
          <Text style={styles.buttonText}>🧮 Heavy Calculation</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={runValidationTest}>
          <Text style={styles.buttonText}>✅ Form Validation</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={runBenchmarkTest}>
          <Text style={styles.buttonText}>⚡ Benchmark Test</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={triggerReRender}>
          <Text style={styles.buttonText}>🔄 Trigger Re-render ({testCounter})</Text>
        </TouchableOpacity>
      </View>

      {/* 📊 Dashboard Controls */}
      <View style={styles.controlsSection}>
        <Text style={styles.sectionTitle}>📊 Dashboard Controls</Text>
        
        <TouchableOpacity 
          style={[styles.button, dashboardVisible && styles.buttonActive]} 
          onPress={() => setDashboardVisible(!dashboardVisible)}
        >
          <Text style={styles.buttonText}>
            {dashboardVisible ? '📊 Hide Dashboard' : '📊 Show Dashboard'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 🎯 Componente de ejemplo optimizado */}
      <View style={styles.demoSection}>
        <Text style={styles.sectionTitle}>🎯 Optimized Component Demo</Text>
        <BenchmarkCard report={mockReport} />
      </View>

      {/* 📈 Performance Dashboard */}
      <PerformanceDashboard 
        isVisible={dashboardVisible}
        onToggle={() => setDashboardVisible(!dashboardVisible)}
      />

      {/* 📋 Información */}
      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>📋 FASE 4A Features</Text>
        <Text style={styles.infoText}>✅ Sistema de recomendaciones inteligentes</Text>
        <Text style={styles.infoText}>✅ Umbrales dinámicos por dispositivo</Text>
        <Text style={styles.infoText}>✅ Performance Dashboard en tiempo real</Text>
        <Text style={styles.infoText}>✅ BenchmarkCard optimizado con tracking</Text>
        <Text style={styles.infoText}>✅ Hooks especializados de performance</Text>
        <Text style={styles.infoText}>✅ Análisis de tendencias automático</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: theme.colors.background
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
    textAlign: 'center',
    marginBottom: 20
  },
  controlsSection: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: theme.colors.card,
    borderRadius: 8
  },
  demoSection: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: theme.colors.card,
    borderRadius: 8
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 10
  },
  button: {
    backgroundColor: theme.colors.primary,
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
    alignItems: 'center'
  },
  buttonActive: {
    backgroundColor: theme.colors.secondary
  },
  buttonText: {
    color: theme.colors.background,
    fontWeight: 'bold'
  },
  infoSection: {
    padding: 15,
    backgroundColor: theme.colors.card,
    borderRadius: 8,
    marginBottom: 20
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 10
  },
  infoText: {
    fontSize: 14,
    color: theme.colors.text,
    marginBottom: 4
  }
});
