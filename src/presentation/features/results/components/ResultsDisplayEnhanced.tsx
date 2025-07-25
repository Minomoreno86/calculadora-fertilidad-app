/**
 * 🏆 PREMIUM RESULTS DISPLAY - DISEÑO PROFESIONAL
 * 
 * Diseño de clase mundial para mostrar resultados de fertilidad
 * con animaciones fluidas, visualización de datos avanzada y UX excepcional
 */

import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
  LayoutAnimation,
  UIManager,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { EvaluationState, SimulatableFactor } from '@/core/domain/models';
import Text from '@/presentation/components/common/Text';
import { useDynamicTheme } from '@/hooks/useDynamicTheme';
import { useFertilitySimulator } from '../../simulator/useFertilitySimulator';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width: screenWidth } = Dimensions.get('window');

interface ResultsDisplayProps {
  evaluation: EvaluationState;
  treatmentSuggestions?: Array<{
    type: string;
    description: string;
    priority: number;
  }>;
  isPremiumReport?: boolean;
}

interface FactorAnalysis {
  id: string;
  name: string;
  value: number;
  status: 'optimal' | 'good' | 'attention' | 'critical';
  impact: 'low' | 'medium' | 'high' | 'critical';
  recommendation: string;
  evidence: string;
  icon: string;
  gradient: readonly [string, string];
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  evaluation,
  treatmentSuggestions = [],
  isPremiumReport = false,
}) => {
  const theme = useDynamicTheme();
  const styles = createStyles(theme);
  
  // Estados
  const [activeSection, setActiveSection] = useState('overview');
  const [expandedFactor, setExpandedFactor] = useState<string | null>(null);
  
  // Animaciones
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  
  const { simulationResult, simulateFactor } = useFertilitySimulator(evaluation);
  const { report, factors } = evaluation;

  // Animación de entrada
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim, slideAnim]);

  // 🎨 ANÁLISIS VISUAL AVANZADO
  const factorAnalysis = useMemo((): FactorAnalysis[] => {
    if (!factors) return [];

    const analysisMap: Record<string, Omit<FactorAnalysis, 'id' | 'value'>> = {
      baseAgeProbability: {
        name: 'Probabilidad Base por Edad',
        status: 'optimal',
        impact: 'critical',
        recommendation: 'Tu edad es un factor clave. Optimiza otros aspectos para maximizar tus posibilidades.',
        evidence: 'ASRM Guidelines 2023',
        icon: 'calendar',
        gradient: ['#667eea', '#764ba2'] as const,
      },
      bmi: {
        name: 'Índice de Masa Corporal',
        status: 'good',
        impact: 'medium',
        recommendation: 'Un peso saludable mejora significativamente las probabilidades de concepción.',
        evidence: 'WHO Fertility Guidelines',
        icon: 'scale',
        gradient: ['#f093fb', '#f5576c'] as const,
      },
      amh: {
        name: 'Reserva Ovárica (AMH)',
        status: 'attention',
        impact: 'critical',
        recommendation: 'Considera opciones de preservación y tratamientos de estimulación ovárica.',
        evidence: 'ESHRE Guidelines 2023',
        icon: 'flower',
        gradient: ['#4facfe', '#00f2fe'] as const,
      },
      pcos: {
        name: 'Síndrome Ovarios Poliquísticos',
        status: 'good',
        impact: 'high',
        recommendation: 'El control metabólico y hormonal es esencial para optimizar la fertilidad.',
        evidence: 'International PCOS Network',
        icon: 'medical',
        gradient: ['#fa709a', '#fee140'] as const,
      },
      endometriosis: {
        name: 'Endometriosis',
        status: 'attention',
        impact: 'high',
        recommendation: 'Evaluación especializada para determinar el mejor enfoque terapéutico.',
        evidence: 'World Endometriosis Society',
        icon: 'body',
        gradient: ['#a8edea', '#fed6e3'] as const,
      },
      male: {
        name: 'Factor Masculino',
        status: 'good',
        impact: 'high',
        recommendation: 'Los parámetros seminales pueden mejorarse con estilo de vida y suplementación.',
        evidence: 'AUA/ASRM Guidelines',
        icon: 'male',
        gradient: ['#3f51b5', '#5a55ae'] as const,
      },
      tsh: {
        name: 'Función Tiroidea',
        status: 'optimal',
        impact: 'medium',
        recommendation: 'Mantén tu TSH en rango óptimo (1-2.5 mUI/L) para maximizar fertilidad.',
        evidence: 'ATA Pregnancy Guidelines',
        icon: 'pulse',
        gradient: ['#13547a', '#80d0c7'] as const,
      },
      homa: {
        name: 'Resistencia a la Insulina',
        status: 'good',
        impact: 'medium',
        recommendation: 'La sensibilidad a la insulina mejora con dieta mediterránea y ejercicio regular.',
        evidence: 'Diabetes & Fertility Consensus',
        icon: 'nutrition',
        gradient: ['#f77062', '#fe5196'] as const,
      },
    };

    return Object.entries(factors)
      .filter(([key]) => key !== 'baseAgeProbability')
      .map(([key, value]) => {
        const analysis = analysisMap[key];
        if (!analysis) return null;

        const numericValue = typeof value === 'number' ? value : 0;
        let status: FactorAnalysis['status'];

        if (numericValue >= 0.9) status = 'optimal';
        else if (numericValue >= 0.7) status = 'good';
        else if (numericValue >= 0.5) status = 'attention';
        else status = 'critical';

        return {
          ...analysis,
          id: key,
          value: numericValue,
          status,
        };
      })
      .filter(Boolean) as FactorAnalysis[];
  }, [factors]);

  // 📊 MÉTRICAS PROCESADAS
  const processedMetrics = useMemo(() => {
    const score = report?.numericPrognosis || 0;
    const category = report?.category || 'EVALUANDO';
    
    const criticalCount = factorAnalysis.filter(f => f.status === 'critical').length;
    const attentionCount = factorAnalysis.filter(f => f.status === 'attention').length;
    const optimalCount = factorAnalysis.filter(f => f.status === 'optimal').length;
    
    const improvement = simulationResult?.improvement || 0;
    const confidence = Math.min(95, score + (optimalCount * 5));
    
    // 🎨 Helper para obtener categoría de éxito
    const getSuccessRateCategory = (currentScore: number): string => {
      if (currentScore >= 70) return 'Alta';
      if (currentScore >= 40) return 'Moderada';
      return 'Baja';
    };
    
    return {
      score,
      category,
      criticalCount,
      attentionCount, 
      optimalCount,
      totalFactors: factorAnalysis.length,
      improvement,
      confidence,
      successRate: getSuccessRateCategory(score),
    };
  }, [factorAnalysis, report, simulationResult]);

  // 🎨 Helper para obtener color de progreso
  const getProgressColor = (score: number): string => {
    if (score >= 70) return theme.colors.success;
    if (score >= 40) return theme.colors.warning;
    return theme.colors.error;
  };

  // 🎨 COLORES Y GRADIENTES DINÁMICOS
  const getCategoryGradient = () => {
    switch (processedMetrics.category) {
      case 'BUENO':
        return ['#11998e', '#38ef7d'] as const;
      case 'MODERADO':
        return ['#fc4a1a', '#f7b733'] as const;
      case 'BAJO':
        return ['#eb3349', '#f45c43'] as const;
      default:
        return ['#667eea', '#764ba2'] as const;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'optimal':
        return 'checkmark-circle';
      case 'good':
        return 'checkmark-done-circle';
      case 'attention':
        return 'warning';
      case 'critical':
        return 'alert-circle';
      default:
        return 'information-circle';
    }
  };

  // 🎯 HEADER PREMIUM
  const renderPremiumHeader = () => (
    <Animated.View
      style={[
        styles.headerWrapper,
        {
          opacity: fadeAnim,
          transform: [
            { scale: scaleAnim },
            { translateY: slideAnim },
          ],
        },
      ]}
    >
      <LinearGradient
        colors={getCategoryGradient()}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <BlurView intensity={20} style={styles.headerBlur}>
          <View style={styles.headerContent}>
            {/* Score Circle Animation */}
            <View style={styles.scoreContainer}>
              <View style={styles.scoreCircle}>
                <Text style={styles.scoreValue}>
                  {processedMetrics.score.toFixed(0)}
                </Text>
                <Text style={styles.scoreLabel}>%</Text>
              </View>
              <View style={styles.scoreRing} />
            </View>

            {/* Category Badge */}
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>
                {processedMetrics.category}
              </Text>
            </View>

            {/* Quick Stats */}
            <View style={styles.quickStats}>
              <View style={styles.statItem}>
                <Ionicons name="trending-up" size={20} color="white" />
                <Text style={styles.statValue}>
                  +{(processedMetrics.improvement * 100).toFixed(0)}%
                </Text>
                <Text style={styles.statLabel}>Potencial</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Ionicons name="shield-checkmark" size={20} color="white" />
                <Text style={styles.statValue}>
                  {processedMetrics.confidence}%
                </Text>
                <Text style={styles.statLabel}>Confianza</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Ionicons name="bar-chart" size={20} color="white" />
                <Text style={styles.statValue}>
                  {processedMetrics.successRate}
                </Text>
                <Text style={styles.statLabel}>Éxito</Text>
              </View>
            </View>
          </View>
        </BlurView>
      </LinearGradient>
    </Animated.View>
  );

  // 📊 NAVIGATION TABS MEJORADO
  const renderNavigationTabs = () => {
    const tabs = [
      { id: 'overview', label: 'Resumen', icon: 'home' },
      { id: 'factors', label: 'Factores', icon: 'analytics' },
      { id: 'insights', label: 'Insights', icon: 'bulb' },
      { id: 'actions', label: 'Acciones', icon: 'rocket' },
    ];

    return (
      <View style={styles.tabsWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContent}
        >
          {tabs.map((tab) => {
            const isActive = activeSection === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                style={[styles.tab, isActive && styles.activeTab]}
                onPress={() => {
                  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                  setActiveSection(tab.id);
                }}
              >
                <Ionicons
                  name={tab.icon as keyof typeof Ionicons.glyphMap}
                  size={24}
                  color={isActive ? theme.colors.primary : theme.colors.textSecondary}
                />
                <Text style={[styles.tabLabel, isActive && styles.activeTabLabel]}>
                  {tab.label}
                </Text>
                {isActive && <View style={styles.tabIndicator} />}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  // 🎯 OVERVIEW SECTION
  const renderOverviewSection = () => (
    <Animated.View style={{ opacity: fadeAnim }}>
      {/* Summary Cards */}
      <View style={styles.summaryGrid}>
        <TouchableOpacity style={[styles.summaryCard, styles.primaryCard]}>
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            style={styles.cardGradient}
          >
            <Ionicons name="heart" size={32} color="white" />
            <Text style={styles.cardTitle}>Estado General</Text>
            <Text style={styles.cardValue}>{processedMetrics.successRate}</Text>
            <Text style={styles.cardSubtext}>Probabilidad de éxito</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.summaryCard, styles.secondaryCard]}>
          <LinearGradient
            colors={['#f093fb', '#f5576c']}
            style={styles.cardGradient}
          >
            <Ionicons name="fitness" size={32} color="white" />
            <Text style={styles.cardTitle}>Salud Reproductiva</Text>
            <Text style={styles.cardValue}>
              {processedMetrics.optimalCount}/{processedMetrics.totalFactors}
            </Text>
            <Text style={styles.cardSubtext}>Factores óptimos</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Progress Overview */}
      <View style={styles.progressSection}>
        <Text style={styles.sectionTitle}>Tu Progreso</Text>
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Evaluación Integral</Text>
            <Text style={styles.progressPercentage}>
              {processedMetrics.score.toFixed(0)}%
            </Text>
          </View>
          <View style={styles.progressBarContainer}>
            <Animated.View
              style={[
                styles.progressBar,
                {
                  width: `${processedMetrics.score}%`,
                  backgroundColor: getProgressColor(processedMetrics.score),
                },
              ]}
            />
          </View>
          <View style={styles.progressMilestones}>
            <View style={styles.milestone}>
              <View style={[styles.milestonePoint, { backgroundColor: theme.colors.error }]} />
              <Text style={styles.milestoneLabel}>Bajo</Text>
            </View>
            <View style={styles.milestone}>
              <View style={[styles.milestonePoint, { backgroundColor: theme.colors.warning }]} />
              <Text style={styles.milestoneLabel}>Moderado</Text>
            </View>
            <View style={styles.milestone}>
              <View style={[styles.milestonePoint, { backgroundColor: theme.colors.success }]} />
              <Text style={styles.milestoneLabel}>Bueno</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Key Messages */}
      {Boolean(report?.prognosisPhrase) && (
        <View style={styles.messageCard}>
          <LinearGradient
            colors={['rgba(102, 126, 234, 0.1)', 'rgba(118, 75, 162, 0.1)']}
            style={styles.messageGradient}
          >
            <Ionicons name="information-circle" size={24} color={theme.colors.primary} />
            <Text style={styles.messageText}>{report.prognosisPhrase}</Text>
          </LinearGradient>
        </View>
      )}
    </Animated.View>
  );

  // 📊 FACTORS SECTION
  const renderFactorsSection = () => (
    <View style={styles.factorsContainer}>
      <Text style={styles.sectionTitle}>Análisis Detallado de Factores</Text>
      
      {factorAnalysis.map((factor, _index) => {
        const isExpanded = expandedFactor === factor.id;

        return (
          <Animated.View
            key={factor.id}
            style={[
              styles.factorItem,
              {
                opacity: fadeAnim,
                transform: [
                  {
                    translateX: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [50, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <TouchableOpacity
              onPress={() => {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                setExpandedFactor(isExpanded ? null : factor.id);
              }}
              style={styles.factorTouchable}
            >
              <LinearGradient
                colors={factor.gradient}
                style={styles.factorGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <View style={styles.factorContent}>
                  <View style={styles.factorLeft}>
                    <MaterialCommunityIcons
                      name={factor.icon as keyof typeof MaterialCommunityIcons.glyphMap}
                      size={32}
                      color="white"
                    />
                  </View>
                  
                  <View style={styles.factorCenter}>
                    <Text style={styles.factorName}>{factor.name}</Text>
                    <View style={styles.factorValueContainer}>
                      <Text style={styles.factorValue}>
                        {(factor.value * 100).toFixed(0)}%
                      </Text>
                      <View style={styles.factorStatus}>
                        <Ionicons
                          name={getStatusIcon(factor.status)}
                          size={16}
                          color="white"
                        />
                        <Text style={styles.factorStatusText}>
                          {factor.status.toUpperCase()}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.factorRight}>
                    <Ionicons
                      name={isExpanded ? 'chevron-up' : 'chevron-down'}
                      size={24}
                      color="white"
                    />
                  </View>
                </View>
              </LinearGradient>

              {isExpanded && (
                <View style={styles.factorDetails}>
                  <View style={styles.detailRow}>
                    <Ionicons name="bulb" size={20} color={theme.colors.primary} />
                    <Text style={styles.detailText}>{factor.recommendation}</Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Ionicons name="book" size={20} color={theme.colors.textSecondary} />
                    <Text style={styles.evidenceText}>{factor.evidence}</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.simulateButton}
                    onPress={() => simulateFactor(factor.id as SimulatableFactor, factor.recommendation)}
                  >
                    <LinearGradient
                      colors={['#667eea', '#764ba2']}
                      style={styles.simulateGradient}
                    >
                      <Ionicons name="rocket" size={20} color="white" />
                      <Text style={styles.simulateText}>Simular Mejora</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              )}
            </TouchableOpacity>
          </Animated.View>
        );
      })}
    </View>
  );

  // 💡 INSIGHTS SECTION
  const renderInsightsSection = () => (
    <View style={styles.insightsContainer}>
      <Text style={styles.sectionTitle}>Insights Personalizados</Text>

      {/* AI Insights Card */}
      <View style={styles.insightCard}>
        <LinearGradient
          colors={['#4facfe', '#00f2fe']}
          style={styles.insightGradient}
        >
          <View style={styles.insightHeader}>
            <Ionicons name="bulb" size={24} color="white" />
            <Text style={styles.insightTitle}>Análisis Inteligente</Text>
          </View>
          <Text style={styles.insightContent}>
            Basado en tu perfil, tienes un {processedMetrics.confidence}% de confianza en los resultados. 
            Los factores más críticos para mejorar son: {
              factorAnalysis
                .filter(f => f.status === 'critical' || f.status === 'attention')
                .map(f => f.name)
                .slice(0, 2)
                .join(' y ')
            }.
          </Text>
        </LinearGradient>
      </View>

      {/* Recommendations Grid */}
      <Text style={styles.subsectionTitle}>Recomendaciones Prioritarias</Text>
      <View style={styles.recommendationsGrid}>
        {factorAnalysis
          .filter(f => f.status === 'critical' || f.status === 'attention')
          .slice(0, 4)
          .map((factor, index) => (
            <TouchableOpacity
              key={factor.id}
              style={styles.recommendationCard}
            >
              <LinearGradient
                colors={factor.gradient}
                style={styles.recommendationGradient}
              >
                <MaterialCommunityIcons
                  name={factor.icon as keyof typeof MaterialCommunityIcons.glyphMap}
                  size={24}
                  color="white"
                />
                <Text style={styles.recommendationTitle}>{factor.name}</Text>
                <Text style={styles.recommendationText}>
                  Prioridad {index + 1}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
      </View>

      {/* Treatment Suggestions */}
      {treatmentSuggestions.length > 0 && (
        <>
          <Text style={styles.subsectionTitle}>Opciones de Tratamiento</Text>
          {treatmentSuggestions
            .toSorted((a, b) => b.priority - a.priority)
            .map((suggestion, index) => (
              <View key={`treatment-${suggestion.type}-${index}`} style={styles.treatmentCard}>
                <View style={styles.treatmentHeader}>
                  <Ionicons 
                    name="medical" 
                    size={24} 
                    color={theme.colors.primary} 
                  />
                  <Text style={styles.treatmentType}>{suggestion.type}</Text>
                  <View style={styles.priorityBadge}>
                    <Text style={styles.priorityText}>
                      Prioridad {suggestion.priority}
                    </Text>
                  </View>
                </View>
                <Text style={styles.treatmentDescription}>
                  {suggestion.description}
                </Text>
              </View>
            ))}
        </>
      )}
    </View>
  );

  // 🚀 ACTIONS SECTION
  const renderActionsSection = () => (
    <View style={styles.actionsContainer}>
      <Text style={styles.sectionTitle}>Plan de Acción</Text>

      <View style={styles.actionTimeline}>
        {[
          {
            icon: 'calendar',
            title: 'Inmediato (0-1 mes)',
            actions: ['Consulta médica', 'Análisis completos', 'Ajustes de estilo de vida'],
            color: '#f5576c',
          },
          {
            icon: 'time',
            title: 'Corto plazo (1-3 meses)',
            actions: ['Optimización hormonal', 'Suplementación dirigida', 'Seguimiento'],
            color: '#4facfe',
          },
          {
            icon: 'trending-up',
            title: 'Mediano plazo (3-6 meses)',
            actions: ['Evaluación de resultados', 'Ajuste de tratamiento', 'Considerar TRA'],
            color: '#667eea',
          },
        ].map((phase, index) => (
          <View key={`timeline-${phase.title}-${index}`} style={styles.timelineItem}>
            <View style={[styles.timelineNode, { backgroundColor: phase.color }]}>
              <Ionicons name={phase.icon as keyof typeof Ionicons.glyphMap} size={20} color="white" />
            </View>
            {index < 2 && <View style={styles.timelineLine} />}
            
            <View style={styles.timelineContent}>
              <Text style={styles.timelineTitle}>{phase.title}</Text>
              {phase.actions.map((action, idx) => (
                <View key={`action-${index}-${idx}`} style={styles.actionItem}>
                  <View style={styles.actionBullet} />
                  <Text style={styles.actionText}>{action}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>

      {/* CTA Buttons */}
      <View style={styles.ctaContainer}>
        <TouchableOpacity style={styles.primaryCTA}>
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            style={styles.ctaGradient}
          >
            <Ionicons name="download" size={24} color="white" />
            <Text style={styles.ctaText}>Descargar Informe Completo</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryCTA}>
          <Ionicons name="share-social" size={24} color={theme.colors.primary} />
          <Text style={styles.secondaryCtaText}>Compartir Resultados</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // 🎯 RENDER PRINCIPAL
  return (
    <View style={styles.container}>
      {renderPremiumHeader()}
      {renderNavigationTabs()}
      
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {activeSection === 'overview' && renderOverviewSection()}
        {activeSection === 'factors' && renderFactorsSection()}
        {activeSection === 'insights' && renderInsightsSection()}
        {activeSection === 'actions' && renderActionsSection()}
        
        {/* Premium Badge */}
        {isPremiumReport && (
          <View style={styles.premiumBadge}>
            <LinearGradient
              colors={['#ffd700', '#ffed4e']}
              style={styles.premiumGradient}
            >
              <Ionicons name="star" size={16} color="#333" />
              <Text style={styles.premiumText}>Informe Premium</Text>
            </LinearGradient>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

// 🎨 ESTILOS PREMIUM
const createStyles = (theme: ReturnType<typeof useDynamicTheme>) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  
  // Header Styles
  headerWrapper: {
    marginBottom: 16,
  },
  headerGradient: {
    borderRadius: 24,
    margin: 16,
    overflow: 'hidden',
  },
  headerBlur: {
    padding: 24,
  },
  headerContent: {
    alignItems: 'center',
  },
  scoreContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  scoreRing: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  scoreValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
  },
  scoreLabel: {
    fontSize: 24,
    fontWeight: '600',
    color: 'white',
    marginLeft: 2,
  },
  categoryBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 20,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  quickStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 8,
  },

  // Navigation Styles
  tabsWrapper: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  tabsContent: {
    paddingHorizontal: 4,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    marginRight: 12,
    backgroundColor: theme.colors.surface,
    minWidth: 120,
    justifyContent: 'center',
    position: 'relative',
  },
  activeTab: {
    backgroundColor: theme.colors.primary,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginLeft: 8,
  },
  activeTabLabel: {
    color: 'white',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: -8,
    left: '50%',
    marginLeft: -4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
  },

  // Scroll View
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },

  // Overview Section
  summaryGrid: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  primaryCard: {
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  secondaryCard: {
    shadowColor: '#f093fb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  cardGradient: {
    padding: 20,
    alignItems: 'center',
    minHeight: 140,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    marginTop: 12,
    textAlign: 'center',
  },
  cardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 4,
  },
  cardSubtext: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
    textAlign: 'center',
  },
  progressSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 16,
  },
  progressCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 20,
    shadowColor: theme.colors.border,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
  },
  progressPercentage: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: theme.colors.border,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  progressMilestones: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  milestone: {
    alignItems: 'center',
  },
  milestonePoint: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: 4,
  },
  milestoneLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  messageCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  messageGradient: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  messageText: {
    fontSize: 14,
    color: theme.colors.text,
    lineHeight: 20,
    marginLeft: 12,
    flex: 1,
  },

  // Factors Section
  factorsContainer: {
    marginBottom: 24,
  },
  factorItem: {
    marginBottom: 16,
  },
  factorTouchable: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: theme.colors.border,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  factorGradient: {
    padding: 0,
  },
  factorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  factorLeft: {
    marginRight: 16,
  },
  factorCenter: {
    flex: 1,
  },
  factorName: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
  },
  factorValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  factorValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginRight: 12,
  },
  factorStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  factorStatusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 4,
  },
  factorRight: {
    marginLeft: 16,
  },
  factorDetails: {
    backgroundColor: theme.colors.surface,
    padding: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  detailText: {
    fontSize: 14,
    color: theme.colors.text,
    lineHeight: 20,
    marginLeft: 12,
    flex: 1,
  },
  evidenceText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    lineHeight: 16,
    marginLeft: 12,
    flex: 1,
  },
  simulateButton: {
    borderRadius: 12,
    overflow: 'hidden',
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  simulateGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  simulateText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    marginLeft: 8,
  },

  // Insights Section
  insightsContainer: {
    marginBottom: 24,
  },
  insightCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: theme.colors.border,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  insightGradient: {
    padding: 20,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  insightTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 12,
  },
  insightContent: {
    fontSize: 14,
    color: 'white',
    lineHeight: 20,
  },
  subsectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 12,
    marginTop: 8,
  },
  recommendationsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  recommendationCard: {
    width: (screenWidth - 56) / 2,
    borderRadius: 12,
    overflow: 'hidden',
  },
  recommendationGradient: {
    padding: 16,
    alignItems: 'center',
    minHeight: 120,
    justifyContent: 'center',
  },
  recommendationTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
    marginTop: 8,
  },
  recommendationText: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginTop: 4,
  },
  treatmentCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: theme.colors.border,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  treatmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  treatmentType: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginLeft: 12,
    flex: 1,
  },
  priorityBadge: {
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  treatmentDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },

  // Actions Section
  actionsContainer: {
    marginBottom: 24,
  },
  actionTimeline: {
    marginBottom: 24,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  timelineNode: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    shadowColor: theme.colors.border,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  timelineLine: {
    position: 'absolute',
    left: 19,
    top: 40,
    bottom: -24,
    width: 2,
    backgroundColor: theme.colors.border,
  },
  timelineContent: {
    flex: 1,
    paddingTop: 4,
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 8,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  actionBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.primary,
    marginRight: 12,
  },
  actionText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    flex: 1,
  },
  ctaContainer: {
    gap: 12,
  },
  primaryCTA: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  ctaGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  ctaText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 12,
  },
  secondaryCTA: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  secondaryCtaText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.primary,
    marginLeft: 12,
  },

  // Premium Badge
  premiumBadge: {
    position: 'absolute',
    top: 20,
    right: 20,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#ffd700',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  premiumGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  premiumText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 6,
  },
});

export default ResultsDisplay;
