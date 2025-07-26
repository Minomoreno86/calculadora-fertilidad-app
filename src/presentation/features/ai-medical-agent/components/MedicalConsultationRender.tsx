// 🧠 MEDICAL CONSULTATION RENDER COMPONENTS V13.1
// Componentes especializados para renderizado médico con nested domains

import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AnalysisResult, MedicalAnalysis } from '@/core/domain/models';
import Box from '@/presentation/components/common/Box';
import { useDynamicTheme } from '@/hooks/useDynamicTheme';

// 🎯 MEDICAL ANALYSIS CARDS COMPONENT
export const MedicalAnalysisCards: React.FC<{ analysis: MedicalAnalysis }> = ({ analysis }) => {
  const { colors } = useDynamicTheme();
  const diagnosticResults = analysis.results.filter(r => r.type === 'diagnostic');
  const hypothesisResults = analysis.results.filter(r => r.type === 'hypothesis');
  const treatmentResults = analysis.results.filter(r => r.type === 'treatment');
  const riskResults = analysis.results.filter(r => r.type === 'risk');

  return (
    <ScrollView style={styles.container}>
      {/* 🧠 NEURAL ANALYSIS HEADER */}
      <Box style={[styles.analysisCard, { borderLeftColor: colors.primary }]}>
        <View style={styles.cardHeader}>
          <View style={styles.titleRow}>
            <Ionicons name="bulb" size={24} color={colors.primary} />
            <Text style={[styles.cardTitle, { color: colors.primary }]}>
              Análisis IA Médica V13.1 - Nested Domains
            </Text>
          </View>
          <View style={[styles.badge, { backgroundColor: colors.primary + '20' }]}>
            <Text style={[styles.badgeText, { color: colors.primary }]}>
              Neural {analysis.confidence}% confianza
            </Text>
          </View>
        </View>
        <View style={styles.cardContent}>
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { backgroundColor: colors.background }]}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    backgroundColor: colors.primary,
                    width: `${analysis.confidence}%`
                  }
                ]} 
              />
            </View>
            <Text style={[styles.progressText, { color: colors.primary }]}>
              {analysis.recommendations.length} recomendaciones generadas
            </Text>
          </View>
        </View>
      </Box>

      {/* 🔬 DIAGNOSTIC RESULTS */}
      {diagnosticResults.length > 0 && (
        <DiagnosticResultsSection results={diagnosticResults} />
      )}

      {/* 🎯 HYPOTHESIS RESULTS */}
      {hypothesisResults.length > 0 && (
        <HypothesisResultsSection results={hypothesisResults} />
      )}

      {/* 💊 TREATMENT RESULTS */}
      {treatmentResults.length > 0 && (
        <TreatmentResultsSection results={treatmentResults} />
      )}

      {/* ⚠️ RISK ASSESSMENT */}
      {riskResults.length > 0 && (
        <RiskAssessmentSection results={riskResults} />
      )}

      {/* 📋 RECOMMENDATIONS SUMMARY */}
      <RecommendationsSection recommendations={analysis.recommendations} />
    </ScrollView>
  );
};

// 🔬 DIAGNOSTIC RESULTS SECTION
const DiagnosticResultsSection: React.FC<{ results: AnalysisResult[] }> = ({ results }) => {
  return (
    <Box style={[styles.sectionCard, { borderLeftColor: '#10B981' }]}>
      <View style={styles.cardHeader}>
        <View style={styles.titleRow}>
          <Ionicons name="checkmark-circle" size={20} color="#10B981" />
          <Text style={[styles.sectionTitle, { color: '#10B981' }]}>
            Hallazgos Diagnósticos Confirmados
          </Text>
        </View>
      </View>
      <View style={styles.cardContent}>
        {results.map((result, index) => (
          <DiagnosticResultCard key={`diagnostic-${index}-${result.data.condition}`} result={result} />
        ))}
      </View>
    </Box>
  );
};

// 🎯 HYPOTHESIS RESULTS SECTION
const HypothesisResultsSection: React.FC<{ results: AnalysisResult[] }> = ({ results }) => {
  return (
    <Box style={[styles.sectionCard, { borderLeftColor: '#F59E0B' }]}>
      <View style={styles.cardHeader}>
        <View style={styles.titleRow}>
          <Ionicons name="flask" size={20} color="#F59E0B" />
          <Text style={[styles.sectionTitle, { color: '#F59E0B' }]}>
            Hipótesis Diagnósticas Neural
          </Text>
        </View>
      </View>
      <View style={styles.cardContent}>
        {results.map((result, index) => (
          <HypothesisResultCard key={`hypothesis-${index}-${result.data.condition}`} result={result} />
        ))}
      </View>
    </Box>
  );
};

// 💊 TREATMENT RESULTS SECTION
const TreatmentResultsSection: React.FC<{ results: AnalysisResult[] }> = ({ results }) => {
  return (
    <Box style={[styles.sectionCard, { borderLeftColor: '#8B5CF6' }]}>
      <View style={styles.cardHeader}>
        <View style={styles.titleRow}>
          <Ionicons name="heart" size={20} color="#8B5CF6" />
          <Text style={[styles.sectionTitle, { color: '#8B5CF6' }]}>
            Protocolos de Tratamiento Optimizados
          </Text>
        </View>
      </View>
      <View style={styles.cardContent}>
        {results.map((result, index) => (
          <TreatmentResultCard key={`treatment-${index}-${result.data.treatment}`} result={result} />
        ))}
      </View>
    </Box>
  );
};

// ⚠️ RISK ASSESSMENT SECTION
const RiskAssessmentSection: React.FC<{ results: AnalysisResult[] }> = ({ results }) => {
  return (
    <Box style={[styles.sectionCard, { borderLeftColor: '#EF4444' }]}>
      <View style={styles.cardHeader}>
        <View style={styles.titleRow}>
          <Ionicons name="warning" size={20} color="#EF4444" />
          <Text style={[styles.sectionTitle, { color: '#EF4444' }]}>
            Evaluación de Riesgos Médicos
          </Text>
        </View>
      </View>
      <View style={styles.cardContent}>
        {results.map((result, index) => (
          <RiskAssessmentCard key={`risk-${index}-${result.data.condition}`} result={result} />
        ))}
      </View>
    </Box>
  );
};

// 📋 RECOMMENDATIONS SECTION
const RecommendationsSection: React.FC<{ recommendations: string[] }> = ({ recommendations }) => {
  const { colors } = useDynamicTheme();
  
  return (
    <Box style={[styles.recommendationCard, { borderLeftColor: '#6366F1' }]}>
      <View style={styles.cardHeader}>
        <View style={styles.titleRow}>
          <Ionicons name="location" size={20} color="#6366F1" />
          <Text style={[styles.sectionTitle, { color: '#6366F1' }]}>
            Recomendaciones Integradas IA V13.1
          </Text>
        </View>
      </View>
      <View style={styles.cardContent}>
        {recommendations.map((rec, index) => (
          <View key={`recommendation-${index}-${rec.substring(0, 20)}`} style={styles.recommendationItem}>
            <Ionicons name="flash" size={16} color="#6366F1" style={styles.recommendationIcon} />
            <Text style={[styles.recommendationText, { color: colors.text }]}>{rec}</Text>
          </View>
        ))}
      </View>
    </Box>
  );
};

// 🔬 INDIVIDUAL RESULT CARDS
const DiagnosticResultCard: React.FC<{ result: AnalysisResult }> = ({ result }) => {
  return (
    <View style={[styles.resultCard, { backgroundColor: '#ECFDF5', borderColor: '#D1FAE5' }]}>
      <View style={styles.resultHeader}>
        <Text style={[styles.resultTitle, { color: '#065F46' }]}>
          {result.data.condition}
        </Text>
        <View style={[styles.evidenceBadge, { backgroundColor: '#D1FAE5' }]}>
          <Text style={[styles.evidenceText, { color: '#065F46' }]}>
            {result.data.evidenceLevel} - PMID: {result.data.pmid}
          </Text>
        </View>
      </View>
      <Text style={[styles.resultReasoning, { color: '#047857' }]}>
        {result.data.reasoning}
      </Text>
      {result.data.severity && (
        <View style={[styles.severityBadge, { backgroundColor: '#A7F3D0' }]}>
          <Text style={[styles.severityText, { color: '#065F46' }]}>
            Severidad: {result.data.severity}
          </Text>
        </View>
      )}
    </View>
  );
};

const HypothesisResultCard: React.FC<{ result: AnalysisResult }> = ({ result }) => {
  return (
    <View style={[styles.resultCard, { backgroundColor: '#FFF7ED', borderColor: '#FED7AA' }]}>
      <View style={styles.resultHeader}>
        <Text style={[styles.resultTitle, { color: '#9A3412' }]}>
          {result.data.condition}
        </Text>
        <View style={styles.probabilityContainer}>
          <View style={[styles.progressBarSmall, { backgroundColor: '#FED7AA' }]}>
            <View 
              style={[
                styles.progressFillSmall, 
                { 
                  backgroundColor: '#EA580C',
                  width: `${result.data.probability || 0}%`
                }
              ]} 
            />
          </View>
          <Text style={[styles.probabilityText, { color: '#9A3412' }]}>
            {result.data.probability}%
          </Text>
        </View>
      </View>
      <Text style={[styles.resultReasoning, { color: '#C2410C' }]}>
        {result.data.reasoning}
      </Text>
      <View style={styles.badgeContainer}>
        <View style={[styles.evidenceBadge, { backgroundColor: '#FED7AA' }]}>
          <Text style={[styles.evidenceText, { color: '#9A3412' }]}>
            Evidencia {result.data.evidenceLevel}
          </Text>
        </View>
        <View style={[styles.pmidBadge, { backgroundColor: '#FFEDD5' }]}>
          <Text style={[styles.pmidText, { color: '#9A3412' }]}>
            PMID: {result.data.pmid}
          </Text>
        </View>
      </View>
    </View>
  );
};

const TreatmentResultCard: React.FC<{ result: AnalysisResult }> = ({ result }) => {
  return (
    <View style={[styles.resultCard, { backgroundColor: '#FAF5FF', borderColor: '#DDD6FE' }]}>
      <View style={styles.resultHeader}>
        <Text style={[styles.resultTitle, { color: '#581C87' }]}>
          {result.data.treatment}
        </Text>
        <View style={styles.treatmentBadges}>
          <TreatmentPriorityBadge priority={result.data.priority || 'medium'} />
          <View style={[styles.successBadge, { backgroundColor: '#E9D5FF' }]}>
            <Text style={[styles.successText, { color: '#581C87' }]}>
              {result.data.successRate}% éxito
            </Text>
          </View>
        </View>
      </View>
      <Text style={[styles.resultReasoning, { color: '#7C3AED' }]}>
        {result.data.reasoning}
      </Text>
      <View style={styles.timeframeContainer}>
        <Ionicons name="time" size={16} color="#8B5CF6" />
        <Text style={[styles.timeframeText, { color: '#8B5CF6' }]}>
          Tiempo estimado: {result.data.timeframe}
        </Text>
      </View>
    </View>
  );
};

const RiskAssessmentCard: React.FC<{ result: AnalysisResult }> = ({ result }) => {
  return (
    <View style={[styles.alertCard, { backgroundColor: '#FEF2F2', borderColor: '#FECACA' }]}>
      <View style={styles.alertHeader}>
        <Ionicons name="warning" size={16} color="#DC2626" />
        <View style={styles.alertContent}>
          <View style={styles.alertTitleRow}>
            <Text style={[styles.alertTitle, { color: '#991B1B' }]}>
              {result.data.condition}
            </Text>
            <RiskLevelBadge level={result.data.riskLevel || 'medium'} />
          </View>
          <Text style={[styles.alertDescription, { color: '#B91C1C' }]}>
            {result.data.reasoning}
          </Text>
          {result.data.mitigation && (
            <Text style={[styles.mitigationText, { color: '#991B1B' }]}>
              <Text style={styles.mitigationLabel}>Mitigación: </Text>
              {result.data.mitigation}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};

// 🎯 UTILITY COMPONENTS
const TreatmentPriorityBadge: React.FC<{ priority: string }> = ({ priority }) => {
  const config = {
    high: { backgroundColor: '#FEE2E2', textColor: '#991B1B', label: 'Alta Prioridad' },
    medium: { backgroundColor: '#FEF3C7', textColor: '#92400E', label: 'Prioridad Media' },
    low: { backgroundColor: '#D1FAE5', textColor: '#065F46', label: 'Prioridad Baja' }
  };
  
  const style = config[priority as keyof typeof config] || config.medium;
  
  return (
    <View style={[styles.priorityBadge, { backgroundColor: style.backgroundColor }]}>
      <Text style={[styles.priorityText, { color: style.textColor }]}>
        {style.label}
      </Text>
    </View>
  );
};

const RiskLevelBadge: React.FC<{ level: string }> = ({ level }) => {
  const config = {
    high: { backgroundColor: '#FEE2E2', textColor: '#991B1B', label: 'Alto Riesgo' },
    medium: { backgroundColor: '#FEF3C7', textColor: '#92400E', label: 'Riesgo Moderado' },
    low: { backgroundColor: '#D1FAE5', textColor: '#065F46', label: 'Bajo Riesgo' }
  };
  
  const style = config[level as keyof typeof config] || config.medium;
  
  return (
    <View style={[styles.riskBadge, { backgroundColor: style.backgroundColor }]}>
      <Text style={[styles.riskText, { color: style.textColor }]}>
        {style.label}
      </Text>
    </View>
  );
};

// 📊 METRICS DISPLAY COMPONENT
export const AnalysisMetricsDisplay: React.FC<{ 
  totalAnalyses: number;
  confidence: number;
  processingTime: number;
  domainsActivated: string[];
}> = ({ totalAnalyses, confidence, processingTime, domainsActivated }) => {
  const { colors } = useDynamicTheme();
  
  return (
    <Box style={styles.metricsCard}>
      <View style={styles.metricsHeader}>
        <View style={styles.titleRow}>
          <Ionicons name="analytics" size={20} color={colors.text} />
          <Text style={[styles.metricsTitle, { color: colors.text }]}>
            Métricas de Análisis Neural
          </Text>
        </View>
      </View>
      <View style={styles.metricsGrid}>
        <MetricCard
          icon="flask"
          label="Análisis Realizados"
          value={totalAnalyses.toString()}
          color="#3B82F6"
        />
        <MetricCard
          icon="trending-up"
          label="Confianza Neural"
          value={`${confidence}%`}
          color="#10B981"
        />
        <MetricCard
          icon="time"
          label="Tiempo Proceso"
          value={`${processingTime}ms`}
          color="#8B5CF6"
        />
        <MetricCard
          icon="bulb"
          label="Dominios Activos"
          value={domainsActivated.length.toString()}
          color="#F59E0B"
        />
      </View>
      
      {domainsActivated.length > 0 && (
        <View style={styles.domainsSection}>
          <View style={styles.separator} />
          <Text style={[styles.domainsTitle, { color: colors.text }]}>
            Dominios Especializados Activados:
          </Text>
          <View style={styles.domainsList}>
            {domainsActivated.map((domain, index) => (
              <View key={`domain-${index}-${domain}`} style={[styles.domainBadge, { backgroundColor: colors.background }]}>
                <Text style={[styles.domainText, { color: colors.text }]}>
                  {domain}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </Box>
  );
};

const MetricCard: React.FC<{
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  color: string;
}> = ({ icon, label, value, color }) => {
  const { colors } = useDynamicTheme();
  
  return (
    <View style={[styles.metricCard, { backgroundColor: colors.surface }]}>
      <View style={[styles.metricIconContainer, { backgroundColor: colors.background }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>{label}</Text>
      <Text style={[styles.metricValue, { color }]}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  analysisCard: {
    borderLeftWidth: 4,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
  },
  sectionCard: {
    borderLeftWidth: 4,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
  },
  recommendationCard: {
    borderLeftWidth: 4,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
  },
  cardHeader: {
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  cardContent: {
    gap: 12,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressBar: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '500',
  },
  resultCard: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 12,
  },
  resultReasoning: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  evidenceBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  evidenceText: {
    fontSize: 12,
    fontWeight: '500',
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  severityText: {
    fontSize: 12,
    fontWeight: '500',
  },
  probabilityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressBarSmall: {
    width: 60,
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFillSmall: {
    height: '100%',
    borderRadius: 2,
  },
  probabilityText: {
    fontSize: 12,
    fontWeight: '600',
  },
  badgeContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  pmidBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pmidText: {
    fontSize: 12,
    fontWeight: '500',
  },
  treatmentBadges: {
    gap: 8,
  },
  successBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  successText: {
    fontSize: 12,
    fontWeight: '500',
  },
  timeframeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeframeText: {
    fontSize: 12,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '500',
  },
  alertCard: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
  },
  alertHeader: {
    flexDirection: 'row',
    gap: 8,
  },
  alertContent: {
    flex: 1,
  },
  alertTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  alertDescription: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  mitigationText: {
    fontSize: 14,
    lineHeight: 20,
  },
  mitigationLabel: {
    fontWeight: '600',
  },
  riskBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  riskText: {
    fontSize: 12,
    fontWeight: '500',
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 8,
  },
  recommendationIcon: {
    marginTop: 2,
  },
  recommendationText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  metricsCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  metricsHeader: {
    marginBottom: 16,
  },
  metricsTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metricCard: {
    flex: 1,
    minWidth: 140,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  metricIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricLabel: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  domainsSection: {
    marginTop: 16,
  },
  separator: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginBottom: 12,
  },
  domainsTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  domainsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  domainBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  domainText: {
    fontSize: 12,
    fontWeight: '500',
  },
});
