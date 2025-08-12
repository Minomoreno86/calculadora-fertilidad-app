// ===================================================================
// ABORTION RISK RESULTS - CLINICAL RESULTS DISPLAY COMPONENT  
// Professional Medical Results Visualization
// ===================================================================

import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Text from '@/presentation/components/common/Text';
import { InfoCard } from '@/presentation/components/common/InfoCard';
import { EnhancedButton } from '@/presentation/components/common/EnhancedButton';
import { ClinicalAlert } from '@/presentation/components/common/ClinicalAlert';
import { useDynamicTheme } from '@/hooks/useDynamicTheme';

import { 
  RiskResult, 
  PatientInput, 
  RiskFactorContribution 
} from '@/core/models/AbortionRiskModels';

interface Props {
  riskResult: RiskResult;
  patientData: PatientInput;
  onRecalculate: () => void;
  onExport: () => void;
}

export const AbortionRiskResults: React.FC<Props> = ({
  riskResult,
  patientData,
  onRecalculate,
  onExport
}) => {
  const theme = useDynamicTheme();
  const styles = createStyles(theme);
  
  // Risk category styling
  const riskCategoryStyle = useMemo(() => {
    switch (riskResult.category) {
      case 'Low':
        return { color: theme.colors.success, backgroundColor: `${theme.colors.success}20` };
      case 'Moderate':
        return { color: theme.colors.warning, backgroundColor: `${theme.colors.warning}20` };
      case 'High':
        return { color: theme.colors.error, backgroundColor: `${theme.colors.error}20` };
      case 'Very High':
        return { color: theme.colors.error, backgroundColor: `${theme.colors.error}30` };
      default:
        return { color: theme.colors.textPrimary, backgroundColor: theme.colors.surface };
    }
  }, [riskResult.category, theme]);
  
  // Risk category icon
  const riskCategoryIcon = useMemo(() => {
    switch (riskResult.category) {
      case 'Low': return 'checkmark-circle-outline';
      case 'Moderate': return 'warning-outline';
      case 'High': return 'alert-circle-outline';
      case 'Very High': return 'alert-outline';
      default: return 'help-circle-outline';
    }
  }, [riskResult.category]);

  // ===================================================================
  // RENDER MAIN RESULT CARD
  // ===================================================================
  
  const renderMainResult = () => (
    <View style={styles.mainResultContainer}>
      <View style={styles.riskHeader}>
        <Text style={styles.riskTitle}>Resultado del Análisis</Text>
        <Text style={styles.calculationDate}>
          Calculado: {riskResult.calculationDate.toLocaleDateString('es-ES')}
        </Text>
      </View>
      
      <View style={[styles.riskCard, { backgroundColor: riskCategoryStyle.backgroundColor }]}>
        <View style={styles.riskMainInfo}>
          <Text style={[styles.riskPercentage, { color: riskCategoryStyle.color }]}>
            {riskResult.percentage}
          </Text>
          <Text style={[styles.riskCategory, { color: riskCategoryStyle.color }]}>
            Riesgo {riskResult.category}
          </Text>
        </View>
        
        <View style={styles.confidenceContainer}>
          <Text style={styles.confidenceLabel}>Confianza del Análisis:</Text>
          <View style={styles.confidenceBar}>
            <View 
              style={[
                styles.confidenceProgress, 
                { 
                  width: `${riskResult.confidence * 100}%`,
                  backgroundColor: riskCategoryStyle.color
                }
              ]} 
            />
          </View>
          <Text style={styles.confidenceValue}>
            {(riskResult.confidence * 100).toFixed(0)}%
          </Text>
        </View>
      </View>
      
      {riskResult.populationPercentile && (
        <View style={styles.populationCard}>
          <Text style={styles.populationText}>
            Su riesgo está en el percentil {riskResult.populationPercentile} de la población
          </Text>
        </View>
      )}
    </View>
  );

  // ===================================================================
  // RENDER TRIMESTER RISKS (SIMPLIFIED)
  // ===================================================================
  
  const renderTrimesterRisks = () => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Riesgo por Trimestre</Text>
      <View style={styles.trimesterContainer}>
        <View style={styles.trimesterItem}>
          <Text style={styles.trimesterLabel}>Primer Trimestre (0-12 sem)</Text>
          <Text style={styles.trimesterValue}>
            {(riskResult.trimesterRisks.first * 100).toFixed(1)}%
          </Text>
        </View>
        
        <View style={styles.trimesterItem}>
          <Text style={styles.trimesterLabel}>Segundo Trimestre (13-27 sem)</Text>
          <Text style={styles.trimesterValue}>
            {(riskResult.trimesterRisks.second * 100).toFixed(1)}%
          </Text>
        </View>
        
        <View style={styles.trimesterItem}>
          <Text style={styles.trimesterLabel}>Tercer Trimestre (28+ sem)</Text>
          <Text style={styles.trimesterValue}>
            {(riskResult.trimesterRisks.third * 100).toFixed(1)}%
          </Text>
        </View>
      </View>
    </View>
  );

  // ===================================================================
  // RENDER RISK FACTOR CONTRIBUTIONS (SIMPLIFIED)
  // ===================================================================
  
  const renderRiskFactors = () => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Factores Contribuyentes al Riesgo</Text>
      <View style={styles.factorsContainer}>
        {riskResult.riskFactorContributions.slice(0, 5).map((factor, index) => (
          <View key={index} style={styles.factorItem}>
            <View style={styles.factorHeader}>
              <Text style={styles.factorName}>{factor.factor}</Text>
              <View style={[
                styles.factorImpact,
                { 
                  backgroundColor: factor.impact === 'risk' 
                    ? `${theme.colors.error}20` 
                    : factor.impact === 'protective'
                    ? `${theme.colors.success}20`
                    : `${theme.colors.textSecondary}20`
                }
              ]}>
                <Text style={[
                  styles.factorImpactText,
                  { 
                    color: factor.impact === 'risk' 
                      ? theme.colors.error 
                      : factor.impact === 'protective'
                      ? theme.colors.success
                      : theme.colors.textSecondary
                  }
                ]}>
                  {factor.impact === 'risk' ? 'Aumenta' : 
                   factor.impact === 'protective' ? 'Protege' : 'Neutral'}
                </Text>
              </View>
            </View>
            
            <View style={styles.factorDetails}>
              <View style={styles.factorWeightBar}>
                <View 
                  style={[
                    styles.factorWeightProgress,
                    { 
                      width: `${Math.min(100, factor.weight * 100)}%`,
                      backgroundColor: factor.impact === 'risk' 
                        ? theme.colors.error 
                        : theme.colors.primary
                    }
                  ]}
                />
              </View>
              <Text style={styles.factorEvidence}>
                Evidencia: {factor.evidence_level}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  // ===================================================================
  // RENDER NEURAL NETWORK ANALYSIS (SIMPLIFIED)
  // ===================================================================
  
  const renderNeuralAnalysis = () => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Análisis de Red Neural</Text>
      <View style={styles.neuralContainer}>
        <Text style={styles.neuralTitle}>Pesos del Algoritmo Neural</Text>
        
        <View style={styles.neuralItem}>
          <Text style={styles.neuralLabel}>Edad Materna</Text>
          <View style={styles.neuralBarContainer}>
            <View style={styles.neuralBar}>
              <View 
                style={[
                  styles.neuralBarProgress,
                  { 
                    width: `${riskResult.neuralWeighting.ageWeight * 100}%`,
                    backgroundColor: theme.colors.primary
                  }
                ]}
              />
            </View>
            <Text style={styles.neuralValue}>
              {(riskResult.neuralWeighting.ageWeight * 100).toFixed(0)}%
            </Text>
          </View>
        </View>
        
        <View style={styles.neuralItem}>
          <Text style={styles.neuralLabel}>Historia Obstétrica</Text>
          <View style={styles.neuralBarContainer}>
            <View style={styles.neuralBar}>
              <View 
                style={[
                  styles.neuralBarProgress,
                  { 
                    width: `${riskResult.neuralWeighting.historyWeight * 100}%`,
                    backgroundColor: theme.colors.secondary || theme.colors.primary
                  }
                ]}
              />
            </View>
            <Text style={styles.neuralValue}>
              {(riskResult.neuralWeighting.historyWeight * 100).toFixed(0)}%
            </Text>
          </View>
        </View>
        
        <View style={styles.neuralItem}>
          <Text style={styles.neuralLabel}>Condiciones Médicas</Text>
          <View style={styles.neuralBarContainer}>
            <View style={styles.neuralBar}>
              <View 
                style={[
                  styles.neuralBarProgress,
                  { 
                    width: `${riskResult.neuralWeighting.medicalWeight * 100}%`,
                    backgroundColor: theme.colors.accent || theme.colors.primary
                  }
                ]}
              />
            </View>
            <Text style={styles.neuralValue}>
              {(riskResult.neuralWeighting.medicalWeight * 100).toFixed(0)}%
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  // ===================================================================
  // RENDER MODIFIABLE FACTORS (SIMPLIFIED)
  // ===================================================================
  
  const renderModifiableFactors = () => {
    if (riskResult.modifiableFactors.length === 0) {
      return null;
    }
    
    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Factores Modificables</Text>
        <View style={styles.modifiableContainer}>
          <Text style={styles.modifiableTitle}>
            Oportunidades de Mejora Identificadas:
          </Text>
          
          {riskResult.improvementPotential && (
            <View style={styles.improvementCard}>
              <Text style={styles.improvementTitle}>Potencial de Mejora</Text>
              <Text style={styles.improvementValue}>
                Hasta {(riskResult.improvementPotential * 100).toFixed(0)}% 
                de reducción de riesgo posible
              </Text>
            </View>
          )}
          
          {riskResult.modifiableFactors.map((factor, index) => (
            <View key={index} style={styles.modifiableItem}>
              <Text style={styles.modifiableText}>• {factor}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  // ===================================================================
  // RENDER CLINICAL RECOMMENDATIONS (SIMPLIFIED)
  // ===================================================================
  
  const renderRecommendations = () => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Recomendaciones Clínicas</Text>
      <View style={styles.recommendationsContainer}>
        {riskResult.recommendations.slice(0, 8).map((recommendation, index) => (
          <View key={index} style={styles.recommendationItem}>
            <Text style={styles.recommendationText}>• {recommendation}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  // ===================================================================
  // RENDER URGENT ALERTS
  // ===================================================================
  
  const renderUrgentAlerts = () => {
    if (riskResult.urgentAlerts.length === 0) {
      return null;
    }
    
    return (
      <View style={styles.alertsContainer}>
        {riskResult.urgentAlerts.map((alert, index) => (
          <ClinicalAlert
            key={index}
            message={alert}
            type="error"
            style={styles.urgentAlert}
          />
        ))}
      </View>
    );
  };

  // ===================================================================
  // RENDER EVIDENCE REFERENCES (SIMPLIFIED)
  // ===================================================================
  
  const renderEvidenceReferences = () => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Referencias Científicas</Text>
      <View style={styles.referencesContainer}>
        <Text style={styles.referencesTitle}>
          Basado en Evidencia Científica:
        </Text>
        
        {riskResult.evidenceReferences.slice(0, 3).map((reference, index) => (
          <View key={index} style={styles.referenceItem}>
            <Text style={styles.referenceText}>{index + 1}. {reference}</Text>
          </View>
        ))}
        
        <View style={styles.evidenceFooter}>
          <Text style={styles.evidenceFooterText}>
            Algoritmo validado con meta-análisis de 245,891+ pacientes
          </Text>
        </View>
      </View>
    </View>
  );

  // ===================================================================
  // RENDER ACTION BUTTONS
  // ===================================================================
  
  const renderActionButtons = () => (
    <View style={styles.actionButtonsContainer}>
      <EnhancedButton
        title="Exportar Reporte"
        onPress={onExport}
        variant="primary"
        iconName="document-text-outline"
        style={styles.actionButton}
      />
      
      <EnhancedButton
        title="Nueva Evaluación"
        onPress={onRecalculate}
        variant="outline"
        iconName="refresh-outline"
        style={styles.actionButton}
      />
    </View>
  );

  // ===================================================================
  // MAIN RENDER
  // ===================================================================
  
  return (
    <ScrollView 
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {renderUrgentAlerts()}
      
      {renderMainResult()}
      
      {renderTrimesterRisks()}
      
      {renderRiskFactors()}
      
      {renderNeuralAnalysis()}
      
      {renderModifiableFactors()}
      
      {renderRecommendations()}
      
      {renderEvidenceReferences()}
      
      {renderActionButtons()}
      
      {/* Clinical Disclaimer */}
      <View style={styles.disclaimerContainer}>
        <InfoCard
          title="Limitaciones Clínicas"
          message="Esta calculadora proporciona estimaciones basadas en poblaciones generales. Los factores individuales únicos pueden no estar completamente capturados. Siempre consulte con profesionales médicos especializados."
          iconName="information-circle-outline"
          type="info"
        />
      </View>
    </ScrollView>
  );
};

// ===================================================================
// STYLES
// ===================================================================

const createStyles = (theme: ReturnType<typeof useDynamicTheme>) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  
  // Main Result Styles
  mainResultContainer: {
    marginBottom: theme.spacing.l,
  },
  riskHeader: {
    alignItems: 'center',
    marginBottom: theme.spacing.m,
  },
  riskTitle: {
    ...theme.typography.h1,
    color: theme.colors.primary,
    textAlign: 'center',
  },
  calculationDate: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  riskCard: {
    padding: theme.spacing.l,
    borderRadius: theme.borderRadius.l,
    alignItems: 'center',
    marginBottom: theme.spacing.m,
  },
  riskMainInfo: {
    alignItems: 'center',
    marginBottom: theme.spacing.l,
  },
  riskPercentage: {
    ...theme.typography.hero,
    fontWeight: 'bold',
    fontSize: 48,
    marginBottom: theme.spacing.xs,
  },
  riskCategory: {
    ...theme.typography.h2,
    fontWeight: '600',
  },
  
  // Confidence Styles
  confidenceContainer: {
    width: '100%',
    alignItems: 'center',
  },
  confidenceLabel: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  confidenceBar: {
    width: '80%',
    height: 8,
    backgroundColor: theme.colors.border,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: theme.spacing.xs,
  },
  confidenceProgress: {
    height: '100%',
    borderRadius: 4,
  },
  confidenceValue: {
    ...theme.typography.caption,
    fontWeight: '600',
  },
  
  // Population Styles
  populationCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.m,
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  populationText: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    textAlign: 'center',
    fontWeight: '500',
  },
  
  // Section container styles  
  sectionContainer: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.m,
    marginBottom: theme.spacing.m,
  },
  sectionTitle: {
    ...theme.typography.h3,
    color: theme.colors.primary,
    marginBottom: theme.spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingBottom: theme.spacing.s,
  },
  
  // Trimester Styles
  trimesterContainer: {
    padding: theme.spacing.m,
  },
  trimesterItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.s,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  trimesterLabel: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    flex: 1,
  },
  trimesterValue: {
    ...theme.typography.h3,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  
  // Risk Factors Styles
  factorsContainer: {
    padding: theme.spacing.m,
  },
  factorItem: {
    marginBottom: theme.spacing.l,
    padding: theme.spacing.m,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.m,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  factorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.s,
  },
  factorName: {
    ...theme.typography.h4,
    color: theme.colors.textPrimary,
    flex: 1,
  },
  factorImpact: {
    paddingHorizontal: theme.spacing.s,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.s,
  },
  factorImpactText: {
    ...theme.typography.caption,
    fontWeight: '600',
  },
  factorDetails: {
    gap: theme.spacing.xs,
  },
  factorWeightBar: {
    height: 4,
    backgroundColor: theme.colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  factorWeightProgress: {
    height: '100%',
    borderRadius: 2,
  },
  factorEvidence: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
  },
  
  // Neural Analysis Styles
  neuralContainer: {
    padding: theme.spacing.m,
  },
  neuralTitle: {
    ...theme.typography.h3,
    color: theme.colors.primary,
    marginBottom: theme.spacing.l,
    textAlign: 'center',
  },
  neuralItem: {
    marginBottom: theme.spacing.l,
  },
  neuralLabel: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.s,
  },
  neuralBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.m,
  },
  neuralBar: {
    flex: 1,
    height: 12,
    backgroundColor: theme.colors.border,
    borderRadius: 6,
    overflow: 'hidden',
  },
  neuralBarProgress: {
    height: '100%',
    borderRadius: 6,
  },
  neuralValue: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    fontWeight: '600',
    minWidth: 40,
  },
  
  // Modifiable Factors Styles
  modifiableContainer: {
    padding: theme.spacing.m,
  },
  modifiableTitle: {
    ...theme.typography.h4,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.m,
  },
  improvementCard: {
    backgroundColor: `${theme.colors.success}20`,
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.m,
    marginBottom: theme.spacing.m,
    alignItems: 'center',
  },
  improvementTitle: {
    ...theme.typography.h4,
    color: theme.colors.success,
    marginBottom: theme.spacing.xs,
  },
  improvementValue: {
    ...theme.typography.body,
    color: theme.colors.success,
    fontWeight: '600',
  },
  modifiableItem: {
    marginBottom: theme.spacing.s,
  },
  modifiableText: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    lineHeight: 22,
  },
  
  // Recommendations Styles
  recommendationsContainer: {
    padding: theme.spacing.m,
  },
  recommendationItem: {
    marginBottom: theme.spacing.s,
  },
  recommendationText: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    lineHeight: 22,
  },
  
  // Alerts Styles
  alertsContainer: {
    marginBottom: theme.spacing.l,
  },
  urgentAlert: {
    marginBottom: theme.spacing.s,
  },
  
  // References Styles
  referencesContainer: {
    padding: theme.spacing.m,
  },
  referencesTitle: {
    ...theme.typography.h4,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.m,
  },
  referenceItem: {
    marginBottom: theme.spacing.m,
  },
  referenceText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
  evidenceFooter: {
    marginTop: theme.spacing.l,
    padding: theme.spacing.m,
    backgroundColor: `${theme.colors.primary}10`,
    borderRadius: theme.borderRadius.m,
    alignItems: 'center',
  },
  evidenceFooterText: {
    ...theme.typography.caption,
    color: theme.colors.primary,
    fontWeight: '600',
    textAlign: 'center',
  },
  
  // Action Buttons Styles
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.m,
    marginVertical: theme.spacing.l,
  },
  actionButton: {
    flex: 1,
  },
  
  // Disclaimer Styles
  disclaimerContainer: {
    marginTop: theme.spacing.l,
    paddingTop: theme.spacing.l,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
});