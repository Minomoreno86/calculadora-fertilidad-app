/**
 * ClinicalAlert - Componente de alerta clínica profesional
 * 
 * Características:
 * - Integración nativa con InfoCard existente
 * - Validación defensiva robusta
 * - Accesibilidad completa (a11y)
 * - Consistencia temática absoluta
 * 
 * @author AEC-D (Arquitecto Experto Clínico-Digital)
 * @version 2.0 - Armonía total con ecosistema
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
  showRecommendations?: boolean;
  showPercentile?: boolean;
}

export const ClinicalAlert: React.FC<ClinicalAlertProps> = ({ 
  validation, 
  title = "Evaluación Clínica",
  showRecommendations = true,
  showPercentile = true
}) => {
  // Validación defensiva robusta
  if (!validation || typeof validation !== 'object') {
    return null;
  }

  // Determinar tipo de alerta con lógica mejorada
  const getAlertConfig = () => {
    if (validation.criticalAlerts?.length > 0) {
      return {
        type: 'warning' as const, // InfoCard no tiene 'error', usamos 'warning'
        messages: validation.criticalAlerts.map(alert => alert.message),
        priority: 'critical'
      };
    }
    
    if (validation.warnings?.length > 0) {
      return {
        type: 'warning' as const,
        messages: validation.warnings.map(warning => warning.message),
        priority: 'warning'
      };
    }
    
    if (validation.interpretedValue) {
      const { category = 'Valor', normalRange } = validation.interpretedValue;
      const valueStr = validation.value !== null && validation.value !== undefined 
        ? String(validation.value) 
        : 'N/A';
      const normalRangeStr = normalRange ? ` (Normal: ${normalRange})` : '';
      const message = `${category}: ${valueStr}${normalRangeStr}`;
      
      return {
        type: 'tip' as const,
        messages: [message],
        priority: 'info'
      };
    }
    
    return null;
  };

  const alertConfig = getAlertConfig();
  if (!alertConfig) return null;

  return (
    <View 
      style={styles.container}
      accessibilityRole="alert"
      accessibilityLabel={`${title}: ${alertConfig.messages.join('. ')}`}
    >
      <InfoCard
        type={alertConfig.type}
        title={title}
        message={alertConfig.messages.join('. ')}
      />
      
      {showRecommendations && validation.recommendations?.length > 0 && (
        <View style={styles.recommendationsContainer}>
          <Text variant="caption" style={styles.recommendationsTitle}>
            Recomendaciones:
          </Text>
          {validation.recommendations.map((rec, index) => (
            <Text 
              key={`recommendation-${index}-${rec.slice(0, 10)}`} 
              variant="caption" 
              style={styles.recommendation}
              accessibilityRole="text"
            >
              • {rec}
            </Text>
          ))}
        </View>
      )}
      
      {showPercentile && validation.interpretedValue?.percentile && (
        <View style={styles.percentileContainer}>
          <Text 
            variant="caption" 
            style={styles.percentileText}
            accessibilityHint="Comparación estadística con población general"
          >
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
    paddingVertical: 12,
    backgroundColor: theme.colors.surface,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.primary,
    // Sombra sutil para elevación profesional
    shadowColor: theme.colors.black || '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  recommendationsTitle: {
    fontWeight: '600',
    color: theme.colors.primary,
    marginBottom: 6,
  },
  recommendation: {
    color: theme.colors.text,
    marginVertical: 2,
    lineHeight: 18,
  },
  percentileContainer: {
    marginTop: 6,
    alignItems: 'center',
  },
  percentileText: {
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
    fontSize: 12,
  },
});