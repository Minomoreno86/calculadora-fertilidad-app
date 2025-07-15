// ===================================================================
// 🎨 STEPPER DE PROGRESO VISUAL MEJORADO
// ===================================================================

import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import Text from './Text';
import { useDynamicTheme } from '../../../hooks/useDynamicTheme';

interface Props {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
  completionPercentage?: number;
}

export const EnhancedProgressStepper: React.FC<Props> = ({
  currentStep,
  totalSteps,
  stepLabels,
  completionPercentage = 0
}) => {
  // 🎨 TEMA DINÁMICO
  const theme = useDynamicTheme();
  
  const [animatedWidth] = React.useState(new Animated.Value(0));

  React.useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: (completionPercentage / 100) * 100,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [completionPercentage]);

  const getStepStatus = (stepIndex: number) => {
    if (stepIndex < currentStep) return 'completed';
    if (stepIndex === currentStep) return 'active';
    return 'pending';
  };

  const getStepColor = (status: string) => {
    switch (status) {
      case 'completed': return '#4caf50';
      case 'active': return theme.colors.primary;
      case 'pending': return theme.isDark ? '#505050' : '#e0e0e0';
      default: return theme.isDark ? '#505050' : '#e0e0e0';
    }
  };

  const getStepIcon = (status: string, stepIndex: number) => {
    switch (status) {
      case 'completed': return '✓';
      case 'active': return '◉';
      case 'pending': return '○';
      default: return stepIndex + 1;
    }
  };

  // 🎨 Crear estilos dinámicos
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      {/* 🎯 Barra de progreso global */}
      <View style={styles.progressHeader}>
        <Text style={styles.progressTitle}>Progreso del Formulario</Text>
        <Text style={styles.progressPercentage}>{Math.round(completionPercentage)}%</Text>
      </View>
      
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBackground}>
          <Animated.View
            style={[
              styles.progressBarFill,
              {
                width: animatedWidth.interpolate({
                  inputRange: [0, 100],
                  outputRange: ['0%', '100%'],
                  extrapolate: 'clamp',
                }),
              }
            ]}
          />
        </View>
      </View>

      {/* 🎯 Steps individuales */}
      <View style={styles.stepsContainer}>
        {stepLabels.map((label, index) => {
          const status = getStepStatus(index);
          const color = getStepColor(status);
          
          return (
            <View key={index} style={styles.stepContainer}>
              {/* Línea conectora */}
              {index > 0 && (
                <View 
                  style={[
                    styles.connector,
                    { 
                      backgroundColor: index <= currentStep ? '#4caf50' : '#e0e0e0' 
                    }
                  ]} 
                />
              )}
              
              {/* Círculo del step */}
              <View style={[styles.stepCircle, { backgroundColor: color }]}>
                <Text style={[styles.stepIcon, { color: status === 'pending' ? '#666' : '#fff' }]}>
                  {getStepIcon(status, index)}
                </Text>
              </View>
              
              {/* Label del step */}
              <Text style={[styles.stepLabel, { color: color }]}>
                {label}
              </Text>
              
              {/* Indicador de completitud */}
              {status === 'completed' && (
                <View style={styles.completedBadge}>
                  <Text style={styles.completedText}>Completo</Text>
                </View>
              )}
              
              {status === 'active' && (
                <View style={styles.activeBadge}>
                  <Text style={styles.activeText}>En progreso</Text>
                </View>
              )}
            </View>
          );
        })}
      </View>

      {/* 🎯 Información adicional */}
      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <Text style={styles.infoIcon}>📝</Text>
          <Text style={styles.infoText}>
            Paso {currentStep + 1} de {totalSteps}
          </Text>
        </View>
        
        <View style={styles.infoItem}>
          <Text style={styles.infoIcon}>⏱️</Text>
          <Text style={styles.infoText}>
            {completionPercentage >= 70 ? 'Casi terminado' : 'Sigue completando'}
          </Text>
        </View>
      </View>
    </View>
  );
};

// 🎨 Función para crear estilos dinámicos
const createStyles = (theme: ReturnType<typeof useDynamicTheme>) => StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  progressPercentage: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  progressBarContainer: {
    marginBottom: 20,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: theme.isDark ? '#404040' : '#e9ecef',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 4,
  },
  stepsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  stepContainer: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
  },
  connector: {
    position: 'absolute',
    top: 15,
    left: -50,
    right: 50,
    height: 2,
    zIndex: 0,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    marginBottom: 8,
  },
  stepIcon: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  stepLabel: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 4,
    lineHeight: 16,
    color: theme.colors.text,
  },
  completedBadge: {
    backgroundColor: theme.isDark ? '#1b4332' : '#e8f5e8',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  completedText: {
    fontSize: 10,
    color: '#4caf50',
    fontWeight: '500',
  },
  activeBadge: {
    backgroundColor: theme.isDark ? '#0d47a1' : '#e3f2fd',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  activeText: {
    fontSize: 10,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: theme.isDark ? '#404040' : '#f0f0f0',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  infoText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
});
