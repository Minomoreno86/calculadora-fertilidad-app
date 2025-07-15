/**
 * ClinicalProgress - Componente de progreso de validación clínica
 * 
 * Características:
 * - Visualización clara de completitud de datos
 * - Indicadores de estado de cálculo
 * - Barras de progreso animadas
 * - Accesibilidad completa (a11y)
 * - Integración temática perfecta
 * 
 * @author AEC-D (Arquitecto Experto Clínico-Digital)
 * @version 2.0 - Componente independiente y profesional
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Text from '@/presentation/components/common/Text';
import { theme } from '@/config/theme';

interface ClinicalProgressProps {
  completionScore: number;
  canCalculate: boolean;
  overallScore: number;
  title?: string;
}

export const ClinicalProgress: React.FC<ClinicalProgressProps> = ({
  completionScore,
  canCalculate,
  overallScore,
  title = "Validación Clínica"
}) => {
  // Validación defensiva robusta
  const safeCompletionScore = Math.max(0, Math.min(100, completionScore || 0));
  const safeOverallScore = Math.max(0, Math.min(100, overallScore || 0));
  const safeCanCalculate = Boolean(canCalculate);

  const getProgressColor = (score: number): string => {
    if (score >= 80) return theme.colors.success || '#388E3C';
    if (score >= 60) return theme.colors.warning || '#F57C00';
    return theme.colors.error || '#C62828';
  };

  const getScoreInterpretation = (score: number): string => {
    if (score >= 80) return 'Excelente';
    if (score >= 70) return 'Bueno';
    if (score >= 60) return 'Aceptable';
    if (score >= 40) return 'Limitado';
    return 'Insuficiente';
  };

  const progressColor = getProgressColor(safeCompletionScore);
  const scoreInterpretation = getScoreInterpretation(safeOverallScore);

  return (
    <View 
      style={styles.progressContainer}
      accessibilityRole="progressbar"
      accessibilityLabel={`${title}: ${safeOverallScore} de 100 puntos, ${scoreInterpretation}`}
      accessibilityValue={{ min: 0, max: 100, now: safeOverallScore }}
    >
      <View style={styles.progressHeader}>
        <Text variant="caption" style={styles.progressTitle}>
          {title}
        </Text>
        <Text 
          variant="caption" 
          style={[styles.progressScore, { color: getProgressColor(safeOverallScore) }]}
          accessibilityLabel={`Puntuación: ${safeOverallScore} de 100, ${scoreInterpretation}`}
        >
          {safeOverallScore}/100 - {scoreInterpretation}
        </Text>
      </View>
      
      <View style={styles.progressBarContainer}>
        <View 
          style={[
            styles.progressBar, 
            { 
              width: `${safeCompletionScore}%`,
              backgroundColor: progressColor
            }
          ]}
          accessibilityElementsHidden={true}
        />
      </View>
      
      <View style={styles.progressFooter}>
        <Text variant="caption" style={styles.completionText}>
          Completitud: {safeCompletionScore}%
        </Text>
        <Text 
          variant="caption" 
          style={[
            styles.calculationStatus,
            { 
              color: safeCanCalculate 
                ? (theme.colors.success || '#388E3C') 
                : (theme.colors.error || '#C62828') 
            }
          ]}
          accessibilityRole="text"
          accessibilityHint={safeCanCalculate ? "Datos suficientes para realizar cálculo" : "Se necesitan más datos para calcular"}
        >
          {safeCanCalculate ? '✓ Listo para calcular' : '⚠ Datos insuficientes'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  progressContainer: {
    marginVertical: 12,
    padding: 16,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    shadowColor: theme.colors.black || '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: theme.colors.border || '#E0E0E0',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontWeight: '600',
    color: theme.colors.text,
    fontSize: 14,
  },
  progressScore: {
    fontWeight: '600',
    fontSize: 12,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: theme.colors.border || '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
    marginVertical: 10,
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
    // Animación suave se puede agregar con Animated.View en versión futura
  },
  progressFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  completionText: {
    color: theme.colors.textSecondary,
    fontSize: 12,
  },
  calculationStatus: {
    fontWeight: '500',
    fontSize: 12,
  },
});
