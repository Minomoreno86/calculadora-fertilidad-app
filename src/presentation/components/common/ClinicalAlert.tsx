/**
 * Componente de alerta clínica para mostrar validaciones médicas
 * Se integra con tu InfoCard existente
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { InfoCard } from '@/presentation/components/common/InfoCard';
import Text from '@/presentation/components/common/Text';
import { theme } from '@/config/theme';
import type { FieldValidationResult } from '@/core/domain/validation/clinicalValidators';

interface ClinicalAlertProps {
  validation: FieldValidationResult | null;
  title?: string;
}

export const ClinicalAlert: React.FC<ClinicalAlertProps> = ({ 
  validation, 
  title = "Evaluación Clínica" 
}) => {
  if (!validation) return null;

  // Determinar tipo de alerta basado en validación
  let infoCardType: 'tip' | 'warning' = 'tip'; // InfoCard solo acepta estos tipos
  let messages: string[] = [];

  if (validation.criticalAlerts && validation.criticalAlerts.length > 0) {
    infoCardType = 'warning'; // Usar warning en lugar de error
    messages = validation.criticalAlerts.map(alert => alert.message);
  } else if (validation.warnings && validation.warnings.length > 0) {
    infoCardType = 'warning';
    messages = validation.warnings.map(warning => warning.message);
  } else if (validation.interpretedValue) {
    infoCardType = 'tip';
    const category = validation.interpretedValue.category || 'Valor';
    const value = validation.value || 'N/A';
    const normalRange = validation.interpretedValue.normalRange;
    
    messages = [`${category}: ${value}${normalRange ? ` (Normal: ${normalRange})` : ''}`];
  }

  if (messages.length === 0) return null;

  return (
    <View style={styles.container}>
      <InfoCard
        type={infoCardType}
        title={title}
        message={messages.join('. ')}
      />
      
      {validation.recommendations && validation.recommendations.length > 0 && (
        <View style={styles.recommendationsContainer}>
          <Text variant="caption" style={styles.recommendationsTitle}>
            Recomendaciones:
          </Text>
          {validation.recommendations.map((rec, index) => (
            <Text key={index} variant="caption" style={styles.recommendation}>
              • {rec}
            </Text>
          ))}
        </View>
      )}
      
      {validation.interpretedValue?.percentile && (
        <View style={styles.percentileContainer}>
          <Text variant="caption" style={styles.percentileText}>
            Percentil {validation.interpretedValue.percentile} para la edad
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  recommendationsContainer: {
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: theme.colors.background,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.primary,
  },
  recommendationsTitle: {
    fontWeight: '600',
    color: theme.colors.primary,
    marginBottom: 4,
  },
  recommendation: {
    color: theme.colors.text,
    marginVertical: 2,
  },
  percentileContainer: {
    marginTop: 4,
    alignItems: 'center',
  },
  percentileText: {
    color: theme.colors.subtleText,
    fontStyle: 'italic',
  },
  // Estilos para ClinicalProgress
  progressContainer: {
    marginVertical: 12,
    padding: 16,
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressTitle: {
    fontWeight: '600',
    color: theme.colors.text,
  },
  progressScore: {
    fontWeight: '600',
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: theme.colors.border,
    borderRadius: 3,
    overflow: 'hidden',
    marginVertical: 8,
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  progressFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  completionText: {
    color: theme.colors.subtleText,
  },
  calculationStatus: {
    fontWeight: '500',
  },
});

/**
 * Componente para mostrar progreso de validación clínica
 */
interface ClinicalProgressProps {
  completionScore: number;
  canCalculate: boolean;
  overallScore: number;
}

export const ClinicalProgress: React.FC<ClinicalProgressProps> = ({
  completionScore,
  canCalculate,
  overallScore
}) => {
  // Validar props para evitar errores
  const safeCompletionScore = Math.max(0, Math.min(100, completionScore || 0));
  const safeOverallScore = Math.max(0, Math.min(100, overallScore || 0));
  const safeCanCalculate = Boolean(canCalculate);

  const getProgressColor = (score: number): string => {
    if (score >= 80) return theme.colors.success || '#10B981';
    if (score >= 60) return theme.colors.warning || '#F59E0B';
    return theme.colors.error || '#EF4444';
  };

  const getScoreInterpretation = (score: number): string => {
    if (score >= 80) return 'Excelente';
    if (score >= 70) return 'Bueno';
    if (score >= 60) return 'Aceptable';
    if (score >= 40) return 'Limitado';
    return 'Insuficiente';
  };

  return (
    <View style={styles.progressContainer}>
      <View style={styles.progressHeader}>
        <Text variant="caption" style={styles.progressTitle}>
          Validación Clínica
        </Text>
        <Text 
          variant="caption" 
          style={[styles.progressScore, { color: getProgressColor(safeOverallScore) }]}
        >
          {safeOverallScore}/100 - {getScoreInterpretation(safeOverallScore)}
        </Text>
      </View>
      
      <View style={styles.progressBarContainer}>
        <View 
          style={[
            styles.progressBar, 
            { 
              width: `${safeCompletionScore}%`,
              backgroundColor: getProgressColor(safeCompletionScore)
            }
          ]} 
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
            { color: safeCanCalculate ? (theme.colors.success || '#10B981') : (theme.colors.error || '#EF4444') }
          ]}
        >
          {safeCanCalculate ? '✓ Listo para calcular' : '⚠ Datos insuficientes'}
        </Text>
      </View>
    </View>
  );
};