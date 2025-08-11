/**
 * 🚀 MODERN SIMULATOR CARD V2.0 - COMPONENTE VISUAL MODERNO
 * 
 * Mejoras implementadas:
 * ✨ A) UI/UX Visual: Diseño moderno y atractivo
 * 📊 B) Análisis Avanzado: Métricas inteligentes
 * 🔄 C) Interactividad: Feedback visual mejorado
 * 🧠 D) Inteligencia: Insights médicos profundos
 */

import React from 'react';
import { View, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Text from '../../../components/common/Text';
import { SimulatableFactor } from '../../../../core/domain/models';

// 🎨 SISTEMA DE COLORES MÉDICOS MODERNOS
const MODERN_COLORS = {
  gradients: {
    primary: ['#0066CC', '#004999'] as [string, string],
    success: ['#10B981', '#047857'] as [string, string],
    warning: ['#F59E0B', '#D97706'] as [string, string],
    error: ['#EF4444', '#DC2626'] as [string, string],
    medical: ['#0891B2', '#0E7490'] as [string, string],
  },
  surfaces: {
    white: '#FFFFFF',
    light: '#F8FAFC',
    hover: '#F1F5F9',
    border: '#E2E8F0',
  },
  text: {
    primary: '#0F172A',
    secondary: '#475569',
    tertiary: '#94A3B8',
  },
};

// 🧠 ANÁLISIS INTELIGENTE DE FACTORES
interface FactorIntelligence {
  priority: 'critical' | 'high' | 'medium' | 'low';
  impact: number;
  feasibility: number;
  urgency: 'immediate' | 'short-term' | 'medium-term' | 'long-term';
  medicalContext: string;
  successRate: number;
}

interface ModernSimulatorCardProps {
  factor: {
    name: string;
    currentValue: number;
    improvement: number;
    difficulty: number;
    timeframe: string;
    evidence: string;
    factor: SimulatableFactor;
  };
  onSimulate: (factor: SimulatableFactor) => void;
  isSimulating: boolean;
}

export const ModernSimulatorCard: React.FC<ModernSimulatorCardProps> = ({
  factor,
  onSimulate,
  isSimulating
}) => {
  // 🧠 D) INTELIGENCIA: Análisis médico profundo
  const getFactorIntelligence = React.useCallback((): FactorIntelligence => {
    const currentPercent = factor.currentValue * 100;
    const improvementPercent = factor.improvement * 100;
    
    let priority: FactorIntelligence['priority'] = 'low';
    let urgency: FactorIntelligence['urgency'] = 'long-term';
    
    if (currentPercent < 30) {
      priority = 'critical';
      urgency = 'immediate';
    } else if (currentPercent < 50) {
      priority = 'high';
      urgency = 'short-term';
    } else if (currentPercent < 70) {
      priority = 'medium';
      urgency = 'medium-term';
    }
    
    const feasibility = 1 - factor.difficulty;
    const impact = improvementPercent / 100;
    const successRate = feasibility * 0.8 + (impact * 0.2);
    
    return {
      priority,
      impact,
      feasibility,
      urgency,
      medicalContext: factor.evidence,
      successRate: Math.min(successRate * 100, 95)
    };
  }, [factor]);

  const intelligence = getFactorIntelligence();

  // 🎨 A) UI/UX: Colores dinámicos basados en prioridad
  const getGradientColors = (): [string, string] => {
    switch (intelligence.priority) {
      case 'critical': return [MODERN_COLORS.gradients.error[0], MODERN_COLORS.gradients.error[1]];
      case 'high': return [MODERN_COLORS.gradients.warning[0], MODERN_COLORS.gradients.warning[1]];
      case 'medium': return [MODERN_COLORS.gradients.medical[0], MODERN_COLORS.gradients.medical[1]];
      default: return [MODERN_COLORS.gradients.success[0], MODERN_COLORS.gradients.success[1]];
    }
  };

  const getPriorityIcon = (): string => {
    switch (intelligence.priority) {
      case 'critical': return 'alert-circle';
      case 'high': return 'warning';
      case 'medium': return 'information-circle';
      default: return 'checkmark-circle';
    }
  };

  // 📊 B) ANÁLISIS AVANZADO: Métricas enriquecidas
  const renderAdvancedMetrics = () => (
    <View style={styles.metricsGrid}>
      <View style={styles.metricItem}>
        <View style={styles.metricIcon}>
          <Ionicons name="trending-up" size={16} color={MODERN_COLORS.gradients.success[0]} />
        </View>
        <View style={styles.metricContent}>
          <Text style={styles.metricValue}>+{(factor.improvement * 100).toFixed(1)}%</Text>
          <Text style={styles.metricLabel}>Mejora Potencial</Text>
        </View>
      </View>

      <View style={styles.metricItem}>
        <View style={styles.metricIcon}>
          <Ionicons name="time" size={16} color={MODERN_COLORS.gradients.medical[0]} />
        </View>
        <View style={styles.metricContent}>
          <Text style={styles.metricValue}>{factor.timeframe}</Text>
          <Text style={styles.metricLabel}>Tiempo Estimado</Text>
        </View>
      </View>

      <View style={styles.metricItem}>
        <View style={styles.metricIcon}>
          <Ionicons name="analytics" size={16} color={MODERN_COLORS.gradients.primary[0]} />
        </View>
        <View style={styles.metricContent}>
          <Text style={styles.metricValue}>{intelligence.successRate.toFixed(0)}%</Text>
          <Text style={styles.metricLabel}>Probabilidad Éxito</Text>
        </View>
      </View>
    </View>
  );

  // 🧠 D) INTELIGENCIA: Insights médicos específicos
  const renderMedicalInsights = () => (
    <View style={styles.insightsSection}>
      <View style={styles.insightHeader}>
        <Ionicons name="medical" size={18} color={MODERN_COLORS.gradients.medical[0]} />
        <Text style={styles.insightTitle}>Análisis Clínico</Text>
      </View>
      
      <Text style={styles.evidenceText}>
        📋 {factor.evidence}
      </Text>
      
      <View style={styles.priorityIndicator}>
        <Ionicons 
          name={getPriorityIcon()} 
          size={16} 
          color={getGradientColors()[0]} 
        />
        <Text style={[styles.priorityText, { color: getGradientColors()[0] }]}>
          Prioridad {intelligence.priority.toUpperCase()} • {intelligence.urgency}
        </Text>
      </View>
    </View>
  );

  return (
    <View
      style={[styles.cardContainer, isSimulating && styles.simulatingCard]}
    >
      {/* 🎨 A) GRADIENTE DE FONDO MODERNO */}
      <LinearGradient
        colors={[MODERN_COLORS.surfaces.white, MODERN_COLORS.surfaces.light]}
        style={styles.cardGradient}
      >
        {/* 📊 HEADER CON PRIORIDAD */}
        <View style={styles.cardHeader}>
          <View style={styles.factorTitle}>
            <Text style={styles.factorName}>{factor.name}</Text>
            <View style={styles.currentValue}>
              <Text style={styles.currentValueText}>
                {(factor.currentValue * 100).toFixed(0)}%
              </Text>
            </View>
          </View>
          
          <View style={[styles.priorityBadge, { backgroundColor: getGradientColors()[0] }]}>
            <Ionicons name={getPriorityIcon()} size={14} color="white" />
            <Text style={styles.priorityBadgeText}>
              {intelligence.priority.charAt(0).toUpperCase() + intelligence.priority.slice(1)}
            </Text>
          </View>
        </View>

        {/* 📊 B) MÉTRICAS AVANZADAS */}
        {renderAdvancedMetrics()}

        {/* 🧠 D) INSIGHTS MÉDICOS */}
        {renderMedicalInsights()}

        {/* 🔄 C) BOTÓN INTERACTIVO MODERNO - CORREGIDO */}
        <TouchableOpacity
          onPress={() => {
            console.log('🏆 [ModernCard] Botón presionado:', factor.factor);
            onSimulate(factor.factor);
          }}
          activeOpacity={0.8}
          disabled={isSimulating}
          style={styles.simulateButtonWrapper}
        >
          <LinearGradient
            colors={getGradientColors()}
            style={styles.simulateButton}
          >
            {isSimulating ? (
              <View style={styles.simulatingState}>
                <Ionicons name="hourglass" size={18} color="white" />
                <Text style={styles.simulateButtonText}>Simulando...</Text>
              </View>
            ) : (
              <View style={styles.readyState}>
                <Ionicons name="play" size={18} color="white" />
                <Text style={styles.simulateButtonText}>Simular Mejora</Text>
              </View>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  } as ViewStyle,
  
  simulatingCard: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  } as ViewStyle,
  
  cardGradient: {
    borderRadius: 20,
    padding: 24, // ✅ Más padding para mejor legibilidad
    borderWidth: 1,
    borderColor: MODERN_COLORS.surfaces.border,
    minHeight: 200, // ✅ Altura mínima
  } as ViewStyle,
  
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20, // ✅ Más espacio
  } as ViewStyle,
  
  factorTitle: {
    flex: 1,
  } as ViewStyle,
  
  factorName: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: MODERN_COLORS.text.primary,
    marginBottom: 4,
  },
  
  currentValue: {
    alignSelf: 'flex-start',
  } as ViewStyle,
  
  currentValueText: {
    fontSize: 14,
    color: MODERN_COLORS.text.secondary,
    fontWeight: '500' as const,
  },
  
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  } as ViewStyle,
  
  priorityBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600' as const,
    marginLeft: 4,
  },
  
  metricsGrid: {
    flexDirection: 'row',
    marginBottom: 16,
  } as ViewStyle,
  
  metricItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  } as ViewStyle,
  
  metricIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: MODERN_COLORS.surfaces.light,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  } as ViewStyle,
  
  metricContent: {
    flex: 1,
  } as ViewStyle,
  
  metricValue: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: MODERN_COLORS.text.primary,
  },
  
  metricLabel: {
    fontSize: 11,
    fontWeight: 'normal' as const,
    color: MODERN_COLORS.text.tertiary,
    marginTop: 2,
  },
  
  insightsSection: {
    backgroundColor: MODERN_COLORS.surfaces.light,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  } as ViewStyle,
  
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  } as ViewStyle,
  
  insightTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: MODERN_COLORS.text.primary,
    marginLeft: 8,
  },
  
  evidenceText: {
    fontSize: 13,
    lineHeight: 18,
    color: MODERN_COLORS.text.secondary,
    marginBottom: 8,
    fontWeight: 'normal' as const,
  },
  
  priorityIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,
  
  priorityText: {
    fontSize: 12,
    fontWeight: '600' as const,
    marginLeft: 6,
  },
  
  simulateButtonWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
  } as ViewStyle,
  
  simulateButton: {
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 20,
  } as ViewStyle,
  
  simulatingState: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  
  readyState: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  
  simulateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600' as const,
    marginLeft: 8,
  },
});