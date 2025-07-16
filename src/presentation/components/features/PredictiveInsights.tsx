/**
 * 🚀 FASE 3B: COMPONENTE DE PREDICCIÓN AVANZADA
 * 
 * Componente React Native que muestra las predicciones de IA
 * Integra con:
 * - predictiveEngine (FASE 3B)
 * - usePrediction hook
 * - treatmentSuggesterPremium
 * - calculationEngine + Premium
 * 
 * CARACTERÍSTICAS:
 * ✅ Predicciones en tiempo real
 * ✅ Timeline de mejoras
 * ✅ Análisis de riesgos
 * ✅ Recomendaciones personalizadas
 * ✅ Métricas del modelo IA
 */

import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { StyleSheet } from 'react-native';
import { usePrediction } from '../../hooks/usePrediction';
import type { UserInput } from '../../../core/domain/models';
import type { PredictionResult } from '../../../core/domain/services/predictiveEngine';
import { theme } from '../../../config/theme';

// ===================================================================
// 🎯 TIPOS PARA EL COMPONENTE
// ===================================================================

interface PredictiveInsightsProps {
  userInput: UserInput | null;
  onTreatmentSelect?: (treatmentId: string) => void;
  onRecommendationAction?: (action: string, data: any) => void;
  style?: any;
}

interface TabConfig {
  id: string;
  title: string;
  icon: string;
  color: string;
}

// ===================================================================
// 🚀 COMPONENTE PRINCIPAL
// ===================================================================

export function PredictiveInsights({ 
  userInput, 
  onTreatmentSelect,
  onRecommendationAction,
  style 
}: PredictiveInsightsProps) {
  
  // ===================================================================
  // 🏗️ HOOKS Y ESTADO
  // ===================================================================

  const [predictionState, predictionActions] = usePrediction({
    engineVersion: 'premium',
    autoPredict: true,
    enableRealTimeUpdates: true,
    enablePerformanceMonitoring: true,
    priority: 'balanced'
  });

  const [activeTab, setActiveTab] = useState<string>('overview');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['prediction']));

  // ===================================================================
  // 🎯 CONFIGURACIÓN DE TABS
  // ===================================================================

  const tabs: TabConfig[] = [
    { id: 'overview', title: 'Resumen IA', icon: '🤖', color: theme.colors.primary },
    { id: 'timeline', title: 'Timeline', icon: '📅', color: theme.colors.secondary },
    { id: 'risks', title: 'Riesgos', icon: '⚠️', color: theme.colors.warning },
    { id: 'improvements', title: 'Mejoras', icon: '💡', color: theme.colors.success },
    { id: 'treatments', title: 'Tratamientos', icon: '🏥', color: theme.colors.info }
  ];

  // ===================================================================
  // 🧠 COMPUTACIONES MEMOIZADAS
  // ===================================================================

  const predictionSummary = useMemo(() => {
    if (!predictionState.result) return null;

    const result = predictionState.result;
    
    return {
      probability: result.predictedOutcome.probability,
      confidence: result.predictedOutcome.confidence,
      riskLevel: result.analytics.riskAssessment.overallRisk,
      improvementsCount: result.analytics.improvementOpportunities.length,
      optimizedTreatments: result.optimizedTreatments.personalized.length,
      modelAccuracy: result.metadata.modelConfidence,
      dataQuality: result.metadata.dataQuality
    };
  }, [predictionState.result]);

  // ===================================================================
  // 🎯 HANDLERS
  // ===================================================================

  const handleRefreshPrediction = () => {
    if (userInput) {
      predictionActions.predict(userInput, true);
    }
  };

  const handleToggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const handleRecommendationAction = (action: string, data: any) => {
    if (onRecommendationAction) {
      onRecommendationAction(action, data);
    } else {
      Alert.alert('Acción', `${action}: ${JSON.stringify(data)}`);
    }
  };

  // ===================================================================
  // 🚀 RENDERIZADO CONDICIONAL
  // ===================================================================

  if (!userInput) {
    return (
      <View style={[styles.container, style]}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🤖</Text>
          <Text style={styles.emptyTitle}>IA de Fertilidad</Text>
          <Text style={styles.emptySubtitle}>
            Completa los datos para obtener predicciones avanzadas con inteligencia artificial
          </Text>
        </View>
      </View>
    );
  }

  if (predictionState.isLoading) {
    return (
      <View style={[styles.container, style]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Analizando con IA...</Text>
          <Text style={styles.loadingSubtext}>
            Procesando {predictionState.totalPredictions + 1} predicciones
          </Text>
        </View>
      </View>
    );
  }

  if (predictionState.error) {
    return (
      <View style={[styles.container, style]}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>❌</Text>
          <Text style={styles.errorTitle}>Error en Predicción</Text>
          <Text style={styles.errorMessage}>{predictionState.error}</Text>
          <TouchableOpacity 
            style={styles.retryButton} 
            onPress={predictionActions.retry}
          >
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (!predictionState.result || !predictionSummary) {
    return null;
  }

  // ===================================================================
  // 🎨 RENDERIZADO PRINCIPAL
  // ===================================================================

  return (
    <View style={[styles.container, style]}>
      {/* Header con métricas */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>🤖 Predicción IA</Text>
          <View style={styles.headerMetrics}>
            <View style={styles.metric}>
              <Text style={styles.metricValue}>{predictionSummary.probability.toFixed(1)}%</Text>
              <Text style={styles.metricLabel}>Predicción</Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricValue}>{predictionSummary.confidence}%</Text>
              <Text style={styles.metricLabel}>Confianza</Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricValue}>{predictionSummary.modelAccuracy}%</Text>
              <Text style={styles.metricLabel}>Modelo IA</Text>
            </View>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.refreshButton}
          onPress={handleRefreshPrediction}
        >
          <Text style={styles.refreshIcon}>🔄</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs de navegación */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.tabsContainer}
      >
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tab,
              activeTab === tab.id && { backgroundColor: tab.color }
            ]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Text style={styles.tabIcon}>{tab.icon}</Text>
            <Text style={[
              styles.tabText,
              activeTab === tab.id && styles.tabTextActive
            ]}>
              {tab.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Contenido de tabs */}
      <ScrollView style={styles.content}>
        {activeTab === 'overview' && (
          <OverviewTab 
            result={predictionState.result} 
            summary={predictionSummary}
          />
        )}
        
        {activeTab === 'timeline' && (
          <TimelineTab 
            timeline={predictionState.result.predictedOutcome.timeline}
            factors={predictionState.result.predictedOutcome.factors}
          />
        )}
        
        {activeTab === 'risks' && (
          <RisksTab 
            riskAssessment={predictionState.result.analytics.riskAssessment}
            onAction={handleRecommendationAction}
          />
        )}
        
        {activeTab === 'improvements' && (
          <ImprovementsTab 
            opportunities={predictionState.result.analytics.improvementOpportunities}
            onAction={handleRecommendationAction}
          />
        )}
        
        {activeTab === 'treatments' && (
          <TreatmentsTab 
            treatments={predictionState.result.optimizedTreatments}
            onSelect={onTreatmentSelect}
            onAction={handleRecommendationAction}
          />
        )}
      </ScrollView>

      {/* Footer con información del modelo */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Procesado en {predictionState.lastPredictionTime.toFixed(1)}ms • 
          Cache: {predictionState.cacheHitRate}% • 
          Calidad: {predictionSummary.dataQuality}%
        </Text>
      </View>
    </View>
  );
}

// ===================================================================
// 🎨 COMPONENTES DE TABS
// ===================================================================

function OverviewTab({ result, summary }: { result: PredictionResult; summary: any }) {
  return (
    <View style={styles.tabContent}>
      {/* Predicción principal */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🎯 Predicción Principal</Text>
        <View style={styles.predictionContainer}>
          <Text style={styles.predictionValue}>{summary.probability.toFixed(1)}%</Text>
          <Text style={styles.predictionLabel}>Probabilidad de Éxito</Text>
          <View style={styles.confidenceBar}>
            <View 
              style={[
                styles.confidenceFill, 
                { width: `${summary.confidence}%` }
              ]} 
            />
          </View>
          <Text style={styles.confidenceText}>Confianza: {summary.confidence}%</Text>
        </View>
      </View>

      {/* Resumen de riesgos */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>⚠️ Evaluación de Riesgos</Text>
        <View style={styles.riskSummary}>
          <View style={[
            styles.riskBadge,
            { backgroundColor: getRiskColor(summary.riskLevel) }
          ]}>
            <Text style={styles.riskBadgeText}>{summary.riskLevel.toUpperCase()}</Text>
          </View>
          <Text style={styles.riskCount}>
            {result.analytics.riskAssessment.specificRisks.length} factores identificados
          </Text>
        </View>
      </View>

      {/* Oportunidades */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>💡 Oportunidades de Mejora</Text>
        <Text style={styles.opportunityCount}>
          {summary.improvementsCount} oportunidades identificadas
        </Text>
        {result.analytics.improvementOpportunities.slice(0, 3).map((opp, index) => (
          <View key={index} style={styles.opportunityItem}>
            <Text style={styles.opportunityTitle}>{opp.area}</Text>
            <Text style={styles.opportunityImpact}>
              +{(opp.potentialScore - opp.currentScore).toFixed(0)} puntos
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function TimelineTab({ timeline, factors }: { timeline: any; factors: any[] }) {
  return (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>📅 Timeline de Mejoras</Text>
      
      {/* Corto plazo */}
      <View style={styles.timelineCard}>
        <Text style={styles.timelineTitle}>🚀 Corto Plazo (1-3 meses)</Text>
        <Text style={styles.timelineProb}>
          Mejora esperada: {timeline.shortTerm.probabilityImprovement}%
        </Text>
        {timeline.shortTerm.recommendedActions.map((action: string, index: number) => (
          <Text key={index} style={styles.timelineAction}>• {action}</Text>
        ))}
      </View>

      {/* Mediano plazo */}
      <View style={styles.timelineCard}>
        <Text style={styles.timelineTitle}>⏳ Mediano Plazo (3-6 meses)</Text>
        <Text style={styles.timelineProb}>
          Mejora esperada: {timeline.mediumTerm.probabilityImprovement}%
        </Text>
        {timeline.mediumTerm.recommendedActions.map((action: string, index: number) => (
          <Text key={index} style={styles.timelineAction}>• {action}</Text>
        ))}
      </View>

      {/* Largo plazo */}
      <View style={styles.timelineCard}>
        <Text style={styles.timelineTitle}>🎯 Largo Plazo (6-12 meses)</Text>
        <Text style={styles.timelineProb}>
          Mejora esperada: {timeline.longTerm.probabilityImprovement}%
        </Text>
        {timeline.longTerm.recommendedActions.map((action: string, index: number) => (
          <Text key={index} style={styles.timelineAction}>• {action}</Text>
        ))}
      </View>
    </View>
  );
}

function RisksTab({ riskAssessment, onAction }: { riskAssessment: any; onAction: (action: string, data: any) => void }) {
  return (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>⚠️ Análisis de Riesgos</Text>
      
      {riskAssessment.specificRisks.map((risk: any, index: number) => (
        <View key={index} style={styles.riskCard}>
          <View style={styles.riskHeader}>
            <Text style={styles.riskTitle}>{risk.risk}</Text>
            <View style={[
              styles.riskLevel,
              { backgroundColor: getRiskLevelColor(risk.likelihood) }
            ]}>
              <Text style={styles.riskLevelText}>
                {Math.round(risk.likelihood * 100)}%
              </Text>
            </View>
          </View>
          
          <Text style={styles.riskFactor}>Factor: {risk.factor}</Text>
          <Text style={styles.riskImpact}>
            Impacto: {Math.round(risk.impact * 100)}%
          </Text>
          
          <Text style={styles.mitigationTitle}>Mitigación:</Text>
          {risk.mitigation.map((action: string, actionIndex: number) => (
            <TouchableOpacity
              key={actionIndex}
              style={styles.mitigationAction}
              onPress={() => onAction('mitigation', { risk: risk.risk, action })}
            >
              <Text style={styles.mitigationText}>• {action}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  );
}

function ImprovementsTab({ opportunities, onAction }: { opportunities: any[]; onAction: (action: string, data: any) => void }) {
  return (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>💡 Oportunidades de Mejora</Text>
      
      {opportunities.map((opp, index) => (
        <View key={index} style={styles.improvementCard}>
          <View style={styles.improvementHeader}>
            <Text style={styles.improvementTitle}>{opp.area}</Text>
            <View style={styles.improvementScore}>
              <Text style={styles.currentScore}>{opp.currentScore}</Text>
              <Text style={styles.arrow}>→</Text>
              <Text style={styles.potentialScore}>{opp.potentialScore}</Text>
            </View>
          </View>
          
          <View style={styles.improvementDetails}>
            <Text style={styles.effortText}>Esfuerzo: {opp.effort}</Text>
            <Text style={styles.timeframeText}>Plazo: {opp.timeframe}</Text>
          </View>
          
          <Text style={styles.actionPlanTitle}>Plan de Acción:</Text>
          {opp.actionPlan.map((action: string, actionIndex: number) => (
            <TouchableOpacity
              key={actionIndex}
              style={styles.actionPlanItem}
              onPress={() => onAction('improvement', { area: opp.area, action })}
            >
              <Text style={styles.actionPlanText}>• {action}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  );
}

function TreatmentsTab({ treatments, onSelect, onAction }: { 
  treatments: any; 
  onSelect?: (treatmentId: string) => void;
  onAction: (action: string, data: any) => void;
}) {
  return (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>🏥 Tratamientos Optimizados</Text>
      
      {/* Tratamientos personalizados */}
      <Text style={styles.sectionTitle}>🎯 Recomendaciones Personalizadas</Text>
      {treatments.personalized.map((rec: any, index: number) => (
        <TouchableOpacity
          key={index}
          style={styles.treatmentCard}
          onPress={() => onAction('recommendation', rec)}
        >
          <View style={styles.treatmentHeader}>
            <Text style={styles.treatmentTitle}>{rec.title}</Text>
            <View style={[
              styles.priorityBadge,
              { backgroundColor: getPriorityColor(rec.priority) }
            ]}>
              <Text style={styles.priorityText}>{rec.priority}</Text>
            </View>
          </View>
          
          <Text style={styles.treatmentDescription}>{rec.description}</Text>
          <Text style={styles.treatmentImpact}>
            Impacto esperado: +{rec.expectedImpact}%
          </Text>
          <Text style={styles.treatmentTimeframe}>Plazo: {rec.timeframe}</Text>
          <Text style={styles.treatmentEvidence}>
            Evidencia: {rec.evidence}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// ===================================================================
// 🎨 FUNCIONES AUXILIARES DE ESTILO
// ===================================================================

function getRiskColor(riskLevel: string): string {
  switch (riskLevel) {
    case 'low': return theme.colors.success;
    case 'medium': return theme.colors.warning;
    case 'high': return theme.colors.error;
    case 'critical': return '#8B0000';
    default: return theme.colors.gray;
  }
}

function getRiskLevelColor(likelihood: number): string {
  if (likelihood >= 0.8) return theme.colors.error;
  if (likelihood >= 0.6) return theme.colors.warning;
  if (likelihood >= 0.4) return '#FFA500';
  return theme.colors.success;
}

function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'high': return theme.colors.error;
    case 'medium': return theme.colors.warning;
    case 'low': return theme.colors.success;
    default: return theme.colors.gray;
  }
}

// ===================================================================
// 🎨 ESTILOS
// ===================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  
  // Estados vacío/carga/error
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginTop: 16,
  },
  loadingSubtext: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.error,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 8,
  },
  headerMetrics: {
    flexDirection: 'row',
    gap: 16,
  },
  metric: {
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  metricLabel: {
    fontSize: 11,
    color: theme.colors.textSecondary,
  },
  refreshButton: {
    padding: 8,
  },
  refreshIcon: {
    fontSize: 20,
  },
  
  // Tabs
  tabsContainer: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 4,
    borderRadius: 20,
    gap: 6,
  },
  tabIcon: {
    fontSize: 16,
  },
  tabText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  tabTextActive: {
    color: 'white',
    fontWeight: 'bold',
  },
  
  // Contenido
  content: {
    flex: 1,
  },
  tabContent: {
    padding: 16,
  },
  tabTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 16,
  },
  
  // Cards generales
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 12,
  },
  
  // Predicción principal
  predictionContainer: {
    alignItems: 'center',
  },
  predictionValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  predictionLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 12,
  },
  confidenceBar: {
    width: '100%',
    height: 8,
    backgroundColor: theme.colors.border,
    borderRadius: 4,
    marginBottom: 8,
  },
  confidenceFill: {
    height: '100%',
    backgroundColor: theme.colors.success,
    borderRadius: 4,
  },
  confidenceText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  
  // Resumen de riesgos
  riskSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  riskBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  riskBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  riskCount: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  
  // Oportunidades
  opportunityCount: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 12,
  },
  opportunityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  opportunityTitle: {
    fontSize: 14,
    color: theme.colors.text,
    flex: 1,
  },
  opportunityImpact: {
    fontSize: 14,
    color: theme.colors.success,
    fontWeight: 'bold',
  },
  
  // Timeline
  timelineCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 8,
  },
  timelineProb: {
    fontSize: 14,
    color: theme.colors.success,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  timelineAction: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  
  // Riesgos
  riskCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.warning,
  },
  riskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  riskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
    flex: 1,
  },
  riskLevel: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  riskLevelText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  riskFactor: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  riskImpact: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 12,
  },
  mitigationTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 8,
  },
  mitigationAction: {
    paddingVertical: 4,
  },
  mitigationText: {
    fontSize: 14,
    color: theme.colors.info,
  },
  
  // Mejoras
  improvementCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.success,
  },
  improvementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  improvementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
    flex: 1,
  },
  improvementScore: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  currentScore: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  arrow: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  potentialScore: {
    fontSize: 14,
    color: theme.colors.success,
    fontWeight: 'bold',
  },
  improvementDetails: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  effortText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  timeframeText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  actionPlanTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 8,
  },
  actionPlanItem: {
    paddingVertical: 4,
  },
  actionPlanText: {
    fontSize: 14,
    color: theme.colors.info,
  },
  
  // Tratamientos
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 12,
  },
  treatmentCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  treatmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  treatmentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
    flex: 1,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  treatmentDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 8,
  },
  treatmentImpact: {
    fontSize: 14,
    color: theme.colors.success,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  treatmentTimeframe: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  treatmentEvidence: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
  },
  
  // Footer
  footer: {
    padding: 12,
    backgroundColor: theme.colors.backgroundSecondary,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  footerText: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});

export default PredictiveInsights;
