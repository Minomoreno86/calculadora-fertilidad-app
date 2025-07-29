// ===================================================================
// 🎨 COMPONENTE DE PROGRESO ANIMADO - Visual mejorado con animaciones
// ===================================================================

import React from 'react';
import { View, StyleSheet } from 'react-native';

// Safe import for Animated
let Animated: any;
try {
  const RNComponents = require('react-native');
  Animated = RNComponents.Animated || {
    Value: class { constructor() {} },
    View: View,
    interpolate: () => ({}),
    loop: () => ({ start: () => {} }),
    sequence: () => ({}),
    timing: () => ({})
  };
} catch {
  Animated = {
    Value: class { constructor() {} },
    View: View,
    interpolate: () => ({}),
    loop: () => ({ start: () => {} }),
    sequence: () => ({}),
    timing: () => ({})
  };
}

import { Ionicons } from '@expo/vector-icons';
import Text from '@/presentation/components/common/Text';
import { theme } from '@/config/theme';
import { useProgressAnimations } from '../hooks/useUXEnhancements';

interface SectionProgressInfo {
  completedFields: number;
  totalFields: number;
  percentage: number;
  nextSuggestedField?: string;
}

interface Props {
  sectionProgress: Record<string, SectionProgressInfo>;
  currentStep: number;
  gamificationMetrics: {
    overallProgress: number;
    totalFieldsCompleted: number;
    totalFields: number;
    badge: string;
    message: string;
  };
  enableAnimations?: boolean;
}

export const EnhancedProgressDisplay: React.FC<Props> = ({
  sectionProgress,
  currentStep,
  gamificationMetrics,
  enableAnimations = true,
}) => {
  const animatedProgress = useProgressAnimations(gamificationMetrics.overallProgress, enableAnimations);

  const sections = [
    { key: 'demographics', label: 'Demografía', icon: 'person-outline' },
    { key: 'gynecology', label: 'Ginecología', icon: 'medical-outline' },
    { key: 'laboratory', label: 'Laboratorio', icon: 'flask-outline' },
    { key: 'maleFactor', label: 'Factor Masculino', icon: 'male-outline' },
  ];

  const getSectionColor = (sectionKey: string, index: number) => {
    const section = sectionProgress[sectionKey];
    if (!section) return '#E5E7EB';
    
    if (section.percentage === 100) return '#10B981'; // Verde completo
    if (section.percentage >= 50) return '#F59E0B'; // Amarillo en progreso
    if (section.percentage > 0) return '#3B82F6'; // Azul iniciado
    if (index <= currentStep) return '#6B7280'; // Gris disponible
    return '#E5E7EB'; // Gris inactivo
  };

  return (
    <View style={styles.container}>
      {/* 🏆 Encabezado de gamificación */}
      <View style={styles.gamificationHeader}>
        <View style={styles.badgeContainer}>
          <Text style={styles.badge}>{gamificationMetrics.badge}</Text>
          <Text style={styles.badgeText}>{gamificationMetrics.message}</Text>
        </View>
        <View style={styles.progressNumber}>
          <Text style={styles.progressText}>{gamificationMetrics.overallProgress}%</Text>
          <Text style={styles.progressSubtext}>
            {gamificationMetrics.totalFieldsCompleted}/{gamificationMetrics.totalFields} campos
          </Text>
        </View>
      </View>

      {/* 📊 Barra de progreso general animada */}
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBackground}>
          <Animated.View 
            style={[
              styles.progressBarFill,
              {
                width: animatedProgress.interpolate({
                  inputRange: [0, 100],
                  outputRange: ['0%', '100%'],
                  extrapolate: 'clamp',
                }),
              }
            ]}
          />
        </View>
      </View>

      {/* 🎯 Progreso por secciones */}
      <View style={styles.sectionsContainer}>
        {sections.map((section, index) => {
          const sectionInfo = sectionProgress[section.key];
          const color = getSectionColor(section.key, index);
          const isActive = index === currentStep;
          const isCompleted = sectionInfo?.percentage === 100;
          
          return (
            <View key={section.key} style={styles.sectionItem}>
              <View style={[
                styles.sectionIndicator,
                { backgroundColor: color },
                isActive && styles.activeSectionIndicator,
                isCompleted && styles.completedSectionIndicator,
              ]}>
                <Ionicons
                  name={isCompleted ? 'checkmark' : (section.icon as keyof typeof Ionicons.glyphMap)}
                  size={16}
                  color="white"
                />
              </View>
              
              <View style={styles.sectionInfo}>
                <Text style={[styles.sectionLabel, isActive && styles.activeSectionLabel]}>
                  {section.label}
                </Text>
                <Text style={styles.sectionProgress}>
                  {sectionInfo ? `${sectionInfo.completedFields}/${sectionInfo.totalFields}` : '0/3'}
                </Text>
              </View>
              
              {/* Línea conectora entre secciones */}
              {index < sections.length - 1 && (
                <View style={[
                  styles.connector,
                  { backgroundColor: '#E5E7EB' }
                ]} />
              )}
            </View>
          );
        })}
      </View>

      {/* 💡 Sugerencia de próximo campo */}
      {Object.values(sectionProgress).some((s: any) => s?.nextSuggestedField) && (
        <View style={styles.suggestionContainer}>
          <Ionicons name="bulb-outline" size={16} color={theme.colors.primary} />
          <Text style={styles.suggestionText}>
            Sugerencia: Completa los campos básicos para continuar
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  
  // 🏆 Gamificación
  gamificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  badgeContainer: {
    flex: 1,
  },
  badge: {
    fontSize: 24,
    marginBottom: 4,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: theme.colors.primary,
  },
  progressNumber: {
    alignItems: 'flex-end',
  },
  progressText: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: theme.colors.primary,
  },
  progressSubtext: {
    fontSize: 12,
    color: theme.colors.subtleText,
  },
  
  // 📊 Barra de progreso
  progressBarContainer: {
    marginBottom: 20,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 4,
  },
  
  // 🎯 Secciones
  sectionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
    paddingHorizontal: 8,
  },
  sectionItem: {
    alignItems: 'center',
    flex: 1,
    position: 'relative',
  },
  sectionIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  activeSectionIndicator: {
    borderWidth: 3,
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary,
  },
  completedSectionIndicator: {
    backgroundColor: '#10B981',
  },
  sectionInfo: {
    alignItems: 'center',
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: theme.colors.text,
    textAlign: 'center' as const,
    marginBottom: 2,
  },
  activeSectionLabel: {
    color: theme.colors.primary,
    fontWeight: '600' as const,
  },
  sectionProgress: {
    fontSize: 10,
    color: theme.colors.subtleText,
  },
  connector: {
    position: 'absolute',
    top: 15,
    right: -50,
    width: 100,
    height: 2,
    zIndex: -1,
  },
  
  // 💡 Sugerencias
  suggestionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    padding: 12,
    backgroundColor: '#F0F9FF',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  suggestionText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 12,
    color: theme.colors.primary,
    fontStyle: 'italic' as const,
  },
});

export default EnhancedProgressDisplay;
