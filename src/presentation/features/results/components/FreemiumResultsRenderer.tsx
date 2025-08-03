/**
 * 🏥 FREEMIUM RESULTS RENDERER - APROVECHA TODA TU INFORMACIÓN MÉDICA
 * 
 * Componente que renderiza resultados básicos vs premium usando:
 * - 63 patologías médicas con evidencia científica
 * - 35 tratamientos escalonados
 * - Biblioteca clínica 97KB con protocolos
 * - AI Medical Agent para chat médico
 * 
 * DIFERENCIACIÓN INTELIGENTE:
 * - BÁSICO: Probabilidad por edad + factores principales + CTA premium
 * - PREMIUM: Análisis médico completo + detección patologías + tratamientos + chat IA
 * 
 * @author Integración con tu arquitectura médica completa
 */

import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

// 🏥 SISTEMA FREEMIUM MÉDICO
import { FreemiumMedicalSystem, FreemiumConfig, MedicalAnalysisLevel } from '@/core/freemium/FreemiumMedicalSystem';

// 🧬 COMPONENTES MÉDICOS EXISTENTES
import Text from '@/presentation/components/common/Text';
import { useDynamicTheme } from '@/hooks/useDynamicTheme';

// 🔬 TIPOS MÉDICOS
import { UserInput, AnalysisResult } from '@/core/domain/models';

// ===================================================================
// 🏥 INTERFACES
// ===================================================================

interface FreemiumResultsRendererProps {
  userInput: UserInput;
  freemiumConfig: FreemiumConfig;
  onUpgradeToPremium?: () => void;
  onStartAIChat?: () => void;
}

// ===================================================================
// 🏥 COMPONENTE PRINCIPAL
// ===================================================================

export const FreemiumResultsRenderer: React.FC<FreemiumResultsRendererProps> = ({
  userInput,
  freemiumConfig,
  onUpgradeToPremium,
  onStartAIChat
}) => {
  const theme = useDynamicTheme();
  const [showPremiumPreview, setShowPremiumPreview] = React.useState(false);
  
  // 🧠 ANÁLISIS MÉDICO USANDO TODA TU INFORMACIÓN
  const medicalAnalysis = React.useMemo(() => {
    return FreemiumMedicalSystem.analyzeMedicalData(userInput, freemiumConfig);
  }, [userInput, freemiumConfig]);
  
  // 🎨 ESTILOS DINÁMICOS
  const styles = React.useMemo(() => createStyles(theme), [theme]);
  
  // ===================================================================
  // 🧮 RENDERIZADO RESULTADOS BÁSICOS
  // ===================================================================
  
  const renderBasicResults = () => (
    <View style={styles.basicResultsContainer}>
      {/* 🎯 PROBABILIDAD PRINCIPAL - TU ALGORITMO ÚNICO */}
      <LinearGradient
        colors={['#4A90E2', '#357ABD']}
        style={styles.probabilityCard}
      >
        <View style={styles.probabilityHeader}>
          <Ionicons name="analytics" size={24} color="white" />
          <Text style={styles.probabilityTitle}>
            Probabilidad de Embarazo
          </Text>
        </View>
        
        <Text style={styles.probabilityValue}>
          {Math.round(medicalAnalysis.basicAnalysis.totalProbability)}%
        </Text>
        
        <Text style={styles.probabilitySubtext}>
          Basado en edad y factores principales
        </Text>
      </LinearGradient>
      
      {/* 📊 FACTORES BÁSICOS ANALIZADOS */}
      <View style={styles.basicFactorsContainer}>
        <Text style={styles.sectionTitle}>Factores Analizados</Text>
        
        <View style={styles.factorRow}>
          <Ionicons name="person" size={20} color={theme.colors.primary} />
          <Text style={styles.factorLabel}>Edad</Text>
          <Text style={styles.factorValue}>
            {Math.round(medicalAnalysis.basicAnalysis.ageBaseline)}% base
          </Text>
        </View>
        
        {userInput.bmi && (
          <View style={styles.factorRow}>
            <Ionicons name="fitness" size={20} color={theme.colors.primary} />
            <Text style={styles.factorLabel}>IMC</Text>
            <Text style={styles.factorValue}>
              {Math.round(medicalAnalysis.basicAnalysis.bmiImpact * 100)}% impacto
            </Text>
          </View>
        )}
        
        <View style={styles.factorRow}>
          <Ionicons name="calendar" size={20} color={theme.colors.primary} />
          <Text style={styles.factorLabel}>Duración ciclo</Text>
          <Text style={styles.factorValue}>
            {medicalAnalysis.basicAnalysis.cycleDuration} días
          </Text>
        </View>
      </View>
      
      {/* 🚀 CALL TO ACTION PREMIUM */}
      {freemiumConfig.tier === 'basic' && renderPremiumCTA()}
    </View>
  );
  
  // ===================================================================
  // 🏥 RENDERIZADO RESULTADOS PREMIUM
  // ===================================================================
  
  const renderPremiumResults = () => {
    if (!medicalAnalysis.premiumAnalysis) return null;
    
    return (
      <View style={styles.premiumResultsContainer}>
        {/* 🔬 DETECCIÓN DE PATOLOGÍAS */}
        {medicalAnalysis.premiumAnalysis.pathologyDetection.length > 0 && (
          <View style={styles.pathologySection}>
            <Text style={styles.premiumSectionTitle}>
              🔬 Patologías Detectadas
            </Text>
            {medicalAnalysis.premiumAnalysis.pathologyDetection.map((pathology, index) => (
              <View key={index} style={styles.pathologyCard}>
                <Text style={styles.pathologyName}>{pathology}</Text>
              </View>
            ))}
          </View>
        )}
        
        {/* 🎯 RECOMENDACIONES DE TRATAMIENTO */}
        {medicalAnalysis.premiumAnalysis.treatmentRecommendations.length > 0 && (
          <View style={styles.treatmentSection}>
            <Text style={styles.premiumSectionTitle}>
              🎯 Tratamientos Recomendados
            </Text>
            {medicalAnalysis.premiumAnalysis.treatmentRecommendations.map((treatment, index) => (
              <View key={index} style={styles.treatmentCard}>
                <Text style={styles.treatmentName}>{treatment}</Text>
              </View>
            ))}
          </View>
        )}
        
        {/* 📚 INSIGHTS CLÍNICOS */}
        {medicalAnalysis.premiumAnalysis.medicalInsights.length > 0 && (
          <View style={styles.insightsSection}>
            <Text style={styles.premiumSectionTitle}>
              📚 Insights Clínicos
            </Text>
            {medicalAnalysis.premiumAnalysis.medicalInsights.map((insight, index) => (
              <View key={index} style={styles.insightCard}>
                <Text style={styles.insightExplanation}>
                  {insight.data.explanation}
                </Text>
              </View>
            ))}
          </View>
        )}
        
        {/* 🤖 CHAT MÉDICO IA */}
        {medicalAnalysis.premiumAnalysis.aiChatEnabled && (
          <TouchableOpacity 
            style={styles.aiChatButton}
            onPress={onStartAIChat}
          >
            <LinearGradient
              colors={['#FF6B6B', '#FF5252']}
              style={styles.aiChatGradient}
            >
              <Ionicons name="chatbubbles" size={24} color="white" />
              <Text style={styles.aiChatText}>
                Consultar con IA Médica
              </Text>
              <Ionicons name="arrow-forward" size={20} color="white" />
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>
    );
  };
  
  // ===================================================================
  // 🚀 PREMIUM CALL TO ACTION
  // ===================================================================
  
  const renderPremiumCTA = () => (
    <View style={styles.premiumCTAContainer}>
      <LinearGradient
        colors={['#FFD700', '#FFA500']}
        style={styles.premiumCTAGradient}
      >
        <View style={styles.premiumCTAHeader}>
          <Ionicons name="diamond" size={32} color="white" />
          <Text style={styles.premiumCTATitle}>
            Desbloquea Análisis Médico Completo
          </Text>
        </View>
        
        <View style={styles.premiumFeaturesList}>
          <View style={styles.premiumFeature}>
            <Ionicons name="medical" size={20} color="white" />
            <Text style={styles.premiumFeatureText}>
              63 Patologías Analizadas
            </Text>
          </View>
          
          <View style={styles.premiumFeature}>
            <Ionicons name="fitness" size={20} color="white" />
            <Text style={styles.premiumFeatureText}>
              35 Tratamientos Personalizados
            </Text>
          </View>
          
          <View style={styles.premiumFeature}>
            <Ionicons name="chatbubbles" size={20} color="white" />
            <Text style={styles.premiumFeatureText}>
              Chat con IA Médica Especializada
            </Text>
          </View>
          
          <View style={styles.premiumFeature}>
            <Ionicons name="library" size={20} color="white" />
            <Text style={styles.premiumFeatureText}>
              Protocolos Clínicos Detallados
            </Text>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.upgradeButton}
          onPress={onUpgradeToPremium}
        >
          <Text style={styles.upgradeButtonText}>
            Activar Premium Medical
          </Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
  
  // ===================================================================
  // 🎨 RENDER PRINCIPAL
  // ===================================================================
  
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* 🎯 HEADER PRINCIPAL */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          Análisis de Fertilidad
        </Text>
        <Text style={styles.headerSubtitle}>
          {freemiumConfig.tier === 'premium' ? 'Análisis Médico Completo' : 'Análisis Básico'}
        </Text>
      </View>
      
      {/* 📊 RESULTADOS BÁSICOS (SIEMPRE) */}
      {renderBasicResults()}
      
      {/* 🏥 RESULTADOS PREMIUM (SI CORRESPONDE) */}
      {freemiumConfig.tier === 'premium' && renderPremiumResults()}
    </ScrollView>
  );
};

// ===================================================================
// 🎨 ESTILOS
// ===================================================================

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: theme.colors.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  
  // BÁSICO
  basicResultsContainer: {
    padding: 20,
  },
  probabilityCard: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    alignItems: 'center',
  },
  probabilityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  probabilityTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: 'white',
    marginLeft: 8,
  },
  probabilityValue: {
    fontSize: 48,
    fontWeight: 'bold' as const,
    color: 'white',
    marginBottom: 8,
  },
  probabilitySubtext: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  basicFactorsContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: theme.colors.text,
    marginBottom: 16,
  },
  factorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  factorLabel: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text,
    marginLeft: 12,
  },
  factorValue: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: theme.colors.primary,
  },
  
  // PREMIUM CTA
  premiumCTAContainer: {
    marginTop: 20,
  },
  premiumCTAGradient: {
    borderRadius: 16,
    padding: 24,
  },
  premiumCTAHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  premiumCTATitle: {
    fontSize: 20,
    fontWeight: 'bold' as const,
    color: 'white',
    textAlign: 'center' as const,
    marginTop: 8,
  },
  premiumFeaturesList: {
    marginBottom: 24,
  },
  premiumFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  premiumFeatureText: {
    fontSize: 16,
    color: 'white',
    marginLeft: 12,
  },
  upgradeButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  upgradeButtonText: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: 'white',
  },
  
  // PREMIUM RESULTS
  premiumResultsContainer: {
    padding: 20,
  },
  premiumSectionTitle: {
    fontSize: 20,
    fontWeight: 'bold' as const,
    color: theme.colors.text,
    marginBottom: 16,
  },
  pathologySection: {
    marginBottom: 24,
  },
  pathologyCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B6B',
  },
  pathologyName: {
    fontSize: 16,
    color: theme.colors.text,
  },
  treatmentSection: {
    marginBottom: 24,
  },
  treatmentCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  treatmentName: {
    fontSize: 16,
    color: theme.colors.text,
  },
  insightsSection: {
    marginBottom: 24,
  },
  insightCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  insightExplanation: {
    fontSize: 14,
    color: theme.colors.text,
    lineHeight: 20,
  },
  aiChatButton: {
    marginTop: 16,
  },
  aiChatGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    padding: 16,
  },
  aiChatText: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: 'white',
    marginHorizontal: 12,
  },
});

export default FreemiumResultsRenderer;