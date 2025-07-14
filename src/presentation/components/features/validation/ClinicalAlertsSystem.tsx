// ===================================================================
// 🚨 SISTEMA DE ALERTAS CLÍNICAS INTELIGENTES
// ===================================================================

import React, { useState, useMemo } from 'react';
import { View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import Text from '@/presentation/components/common/Text';
import Box from '@/presentation/components/common/Box';
import { ModernIcon } from '@/presentation/components/common/ModernIcon';
import { ClinicalInsight } from '@/core/domain/validation/useIntelligentClinicalValidation';

interface ClinicalAlertsSystemProps {
  criticalAlerts: ClinicalInsight[];
  warnings: ClinicalInsight[];
  recommendations: ClinicalInsight[];
  canProceedWithTreatment: boolean;
  urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
  completionScore: number;
  clinicalScore: number;
  onActionRequired?: (insight: ClinicalInsight) => void;
}

// 🎨 Configuración de colores y estilos por tipo de alerta
const alertConfig = {
  critical: {
    bgColor: '#FEF2F2',
    borderColor: '#EF4444',
    iconColor: '#DC2626',
    textColor: '#7F1D1D',
    emoji: 'critical',
    priority: 4
  },
  warning: {
    bgColor: '#FFFBEB',
    borderColor: '#F59E0B',
    iconColor: '#D97706',
    textColor: '#92400E',
    emoji: 'warning',
    priority: 3
  },
  info: {
    bgColor: '#EFF6FF',
    borderColor: '#3B82F6',
    iconColor: '#2563EB',
    textColor: '#1E40AF',
    emoji: 'info',
    priority: 2
  },
  success: {
    bgColor: '#F0FDF4',
    borderColor: '#10B981',
    iconColor: '#059669',
    textColor: '#065F46',
    emoji: 'success',
    priority: 1
  }
} as const;

// 🎯 Componente individual de alerta
const ClinicalAlertCard: React.FC<{
  insight: ClinicalInsight;
  isExpanded: boolean;
  onToggle: () => void;
  onAction?: () => void;
}> = ({ insight, isExpanded, onToggle, onAction }) => {
  const config = alertConfig[insight.type as keyof typeof alertConfig];
  
  return (
    <Box
      style={{
        backgroundColor: config.bgColor,
        borderLeftWidth: 4,
        borderLeftColor: config.borderColor,
        marginBottom: 12,
        borderRadius: 12,
        overflow: 'hidden'
      }}
    >
      {/* Encabezado de la alerta */}
      <TouchableOpacity onPress={onToggle} style={{ padding: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
          <ModernIcon
            name={config.emoji}
            size={24}
            color={config.iconColor}
            style={{ marginRight: 12, marginTop: 2 }}
          />
          
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text
                variant="h3"
                style={{ 
                  color: config.textColor, 
                  fontWeight: '700',
                  flex: 1
                }}
              >
                {insight.title}
              </Text>
              
              {/* Indicador de urgencia */}
              {insight.urgency !== 'low' && (
                <View
                  style={{
                    backgroundColor: config.iconColor,
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                    borderRadius: 10,
                    marginLeft: 8
                  }}
                >
                  <Text
                    variant="caption"
                    style={{ color: 'white', fontWeight: '600' }}
                  >
                    {insight.urgency.toUpperCase()}
                  </Text>
                </View>
              )}
            </View>
            
            <Text
              variant="body"
              style={{ 
                color: config.textColor, 
                marginTop: 4,
                lineHeight: 20
              }}
            >
              {insight.message}
            </Text>
            
            {/* Indicador de expansión */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
              <Text
                variant="caption"
                style={{ color: config.iconColor, fontWeight: '600' }}
              >
                {isExpanded ? 'Ver menos' : 'Ver detalles médicos'}
              </Text>
              <ModernIcon
                name={isExpanded ? 'up' : 'down'}
                size={16}
                color={config.iconColor}
                style={{ marginLeft: 4 }}
              />
            </View>
          </View>
        </View>
      </TouchableOpacity>

      {/* Contenido expandido */}
      {isExpanded && (
        <View style={{ padding: 16, paddingTop: 0 }}>
          {/* Separador */}
          <View
            style={{
              height: 1,
              backgroundColor: config.borderColor,
              opacity: 0.3,
              marginBottom: 16
            }}
          />
          
          {/* Interpretación clínica */}
          <View style={{ marginBottom: 16 }}>
            <Text
              variant="bodyBold"
              style={{ color: config.textColor, fontWeight: '600', marginBottom: 8 }}
            >
              🧬 Interpretación Clínica
            </Text>
            <Text
              variant="body"
              style={{ color: config.textColor, lineHeight: 22 }}
            >
              {insight.interpretation}
            </Text>
          </View>

          {/* Contexto médico */}
          {insight.medicalContext && (
            <View style={{ marginBottom: 16 }}>
              <Text
                variant="bodyBold"
                style={{ color: config.textColor, fontWeight: '600', marginBottom: 8 }}
              >
                📋 Contexto Médico
              </Text>
              <Text
                variant="body"
                style={{ 
                  color: config.textColor, 
                  fontStyle: 'italic',
                  lineHeight: 20
                }}
              >
                {insight.medicalContext}
              </Text>
            </View>
          )}

          {/* Recomendaciones */}
          <View style={{ marginBottom: 16 }}>
            <Text
              variant="bodyBold"
              style={{ color: config.textColor, fontWeight: '600', marginBottom: 8 }}
            >
              💡 Recomendaciones Clínicas
            </Text>
            {insight.recommendations.map((rec: string, index: number) => (
              <View key={`rec-${index}-${rec.slice(0, 10)}`} style={{ flexDirection: 'row', marginBottom: 6 }}>
                <Text
                  variant="body"
                  style={{ color: config.iconColor, marginRight: 8 }}
                >
                  •
                </Text>
                <Text
                  variant="body"
                  style={{ color: config.textColor, flex: 1, lineHeight: 20 }}
                >
                  {rec}
                </Text>
              </View>
            ))}
          </View>

          {/* Próximos pasos */}
          {insight.nextSteps && insight.nextSteps.length > 0 && (
            <View style={{ marginBottom: 16 }}>
              <Text
                variant="bodyBold"
                style={{ color: config.textColor, fontWeight: '600', marginBottom: 8 }}
              >
                🎯 Próximos Pasos
              </Text>
              {insight.nextSteps.map((step: string, index: number) => (
                <View key={`step-${index}-${step.slice(0, 10)}`} style={{ flexDirection: 'row', marginBottom: 6 }}>
                  <Text
                    variant="body"
                    style={{ color: config.iconColor, marginRight: 8 }}
                  >
                    {index + 1}.
                  </Text>
                  <Text
                    variant="body"
                    style={{ color: config.textColor, flex: 1, lineHeight: 20 }}
                  >
                    {step}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Botón de acción */}
          {(insight.type === 'critical' || insight.urgency === 'high') && onAction && (
            <TouchableOpacity
              onPress={onAction}
              style={{
                backgroundColor: config.iconColor,
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderRadius: 8,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <ModernIcon
                name="action"
                size={18}
                color="white"
                style={{ marginRight: 8 }}
              />
              <Text
                variant="body"
                style={{ color: 'white', fontWeight: '600' }}
              >
                {insight.type === 'critical' ? 'Acción Inmediata' : 'Seguir Recomendación'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </Box>
  );
};

// 🏥 Panel de resumen clínico
const ClinicalSummaryPanel: React.FC<{
  completionScore: number;
  clinicalScore: number;
  urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
  canProceedWithTreatment: boolean;
}> = ({ completionScore, clinicalScore, urgencyLevel, canProceedWithTreatment }) => {
  const urgencyConfig = {
    low: { color: '#10B981', bg: '#F0FDF4', emoji: 'success', label: 'BAJO' },
    medium: { color: '#F59E0B', bg: '#FFFBEB', emoji: 'warning', label: 'MEDIO' },
    high: { color: '#EF4444', bg: '#FEF2F2', emoji: 'warning', label: 'ALTO' },
    critical: { color: '#DC2626', bg: '#FEF2F2', emoji: 'critical', label: 'CRÍTICO' }
  } as const;

  const config = urgencyConfig[urgencyLevel];

  // Helper functions to reduce complexity
  const getCompletionColor = (score: number) => {
    if (score >= 80) return '#10B981';
    if (score >= 50) return '#F59E0B';
    return '#EF4444';
  };

  const getCompletionIcon = (score: number) => {
    if (score >= 80) return 'success';
    if (score >= 50) return 'warning';
    return 'critical';
  };

  const getUrgencyMessage = (level: string) => {
    const messages = {
      critical: 'Requiere atención médica inmediata',
      high: 'Requiere atención médica prioritaria',
      medium: 'Requiere seguimiento médico',
      low: 'Seguimiento rutinario recomendado'
    };
    return messages[level as keyof typeof messages];
  };

  return (
    <Box
      style={{
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3
      }}
    >
      <Text
        variant="h3"
        style={{ color: '#1F2937', fontWeight: '700', marginBottom: 16 }}
      >
        📊 Resumen Clínico Inteligente
      </Text>

      <View style={{ flexDirection: 'row', marginBottom: 16 }}>
        {/* Puntuación de completitud */}
        <View style={{ flex: 1, marginRight: 10 }}>
          <Text
            variant="bodyBold"
            style={{ color: '#6B7280', fontWeight: '600', marginBottom: 4 }}
          >
            Completitud
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text
              variant="h2"
              style={{ 
                color: getCompletionColor(completionScore),
                fontWeight: '800'
              }}
            >
              {Math.round(completionScore)}%
            </Text>
            <ModernIcon
              name={getCompletionIcon(completionScore)}
              size={20}
              color={getCompletionColor(completionScore)}
              style={{ marginLeft: 8 }}
            />
          </View>
        </View>

        {/* Puntuación clínica */}
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text
            variant="bodyBold"
            style={{ color: '#6B7280', fontWeight: '600', marginBottom: 4 }}
          >
            Score Clínico
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text
              variant="h2"
              style={{ 
                color: getCompletionColor(clinicalScore),
                fontWeight: '800'
              }}
            >
              {Math.round(clinicalScore)}%
            </Text>
            <ModernIcon
              name="dna"
              size={20}
              color={getCompletionColor(clinicalScore)}
              style={{ marginLeft: 8 }}
            />
          </View>
        </View>
      </View>

      {/* Nivel de urgencia */}
      <View
        style={{
          backgroundColor: config.bg,
          borderRadius: 12,
          padding: 16,
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 16
        }}
      >
        <ModernIcon
          name={config.emoji}
          size={24}
          color={config.color}
          style={{ marginRight: 12 }}
        />
        <View style={{ flex: 1 }}>
          <Text
            variant="bodyBold"
            style={{ color: config.color, fontWeight: '700' }}
          >
            Nivel de Urgencia: {config.label}
          </Text>
          <Text
            variant="body"
            style={{ color: config.color, marginTop: 2 }}
          >
            {getUrgencyMessage(urgencyLevel)}
          </Text>
        </View>
      </View>

      {/* Estado de procedimiento */}
      <View
        style={{
          backgroundColor: canProceedWithTreatment ? '#F0FDF4' : '#FEF2F2',
          borderRadius: 12,
          padding: 16,
          flexDirection: 'row',
          alignItems: 'center'
        }}
      >
        <ModernIcon
          name={canProceedWithTreatment ? 'success' : 'critical'}
          size={24}
          color={canProceedWithTreatment ? '#10B981' : '#EF4444'}
          style={{ marginRight: 12 }}
        />
        <View style={{ flex: 1 }}>
          <Text
            variant="bodyBold"
            style={{ 
              color: canProceedWithTreatment ? '#065F46' : '#7F1D1D',
              fontWeight: '700'
            }}
          >
            {canProceedWithTreatment ? '✅ Listo para Tratamiento' : '⚠️ Evaluación Adicional Requerida'}
          </Text>
          <Text
            variant="body"
            style={{ 
              color: canProceedWithTreatment ? '#065F46' : '#7F1D1D',
              marginTop: 2
            }}
          >
            {canProceedWithTreatment 
              ? 'Los parámetros clínicos permiten proceder con el tratamiento'
              : 'Se requiere resolver alertas críticas antes del tratamiento'
            }
          </Text>
        </View>
      </View>
    </Box>
  );
};

// 🎯 Componente principal del sistema de alertas
export const ClinicalAlertsSystem: React.FC<ClinicalAlertsSystemProps> = ({
  criticalAlerts,
  warnings,
  recommendations,
  canProceedWithTreatment,
  urgencyLevel,
  completionScore,
  clinicalScore,
  onActionRequired
}) => {
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  // Combinar todas las alertas con priorización
  const allInsights = useMemo(() => {
    const combined = [
      ...criticalAlerts,
      ...warnings,
      ...recommendations
    ];

    // Ordenar por prioridad y urgencia
    return combined.sort((a, b) => {
      const priorityA = alertConfig[a.type as keyof typeof alertConfig].priority;
      const priorityB = alertConfig[b.type as keyof typeof alertConfig].priority;
      
      if (priorityA !== priorityB) {
        return priorityB - priorityA; // Mayor prioridad primero
      }
      
      // Si tienen la misma prioridad, ordenar por urgencia
      const urgencyOrder = { critical: 4, high: 3, medium: 2, low: 1 } as const;
      return urgencyOrder[b.urgency as keyof typeof urgencyOrder] - urgencyOrder[a.urgency as keyof typeof urgencyOrder];
    });
  }, [criticalAlerts, warnings, recommendations]);

  const toggleExpanded = (insightTitle: string) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(insightTitle)) {
      newExpanded.delete(insightTitle);
    } else {
      newExpanded.add(insightTitle);
    }
    setExpandedCards(newExpanded);
  };

  const handleActionRequired = (insight: ClinicalInsight) => {
    Alert.alert(
      '⚠️ Acción Requerida',
      `${insight.title}\n\n${insight.message}`,
      [
        { text: 'Ver Detalles', style: 'default' },
        { 
          text: 'Contactar Especialista', 
          style: 'default',
          onPress: () => onActionRequired?.(insight)
        }
      ]
    );
  };

  if (allInsights.length === 0) {
    return (
      <Box style={{ padding: 20 }}>
        <Text
          variant="h3"
          style={{ color: '#6B7280', textAlign: 'center' }}
        >
          No hay alertas clínicas disponibles
        </Text>
      </Box>
    );
  }

  return (
    <ScrollView style={{ flex: 1 }}>
      {/* Panel de resumen */}
      <ClinicalSummaryPanel
        completionScore={completionScore}
        clinicalScore={clinicalScore}
        urgencyLevel={urgencyLevel}
        canProceedWithTreatment={canProceedWithTreatment}
      />

      {/* Alertas críticas primero */}
      {criticalAlerts.length > 0 && (
        <View style={{ marginBottom: 20 }}>
          <Text
            variant="h3"
            style={{ 
              color: '#DC2626', 
              fontWeight: '700', 
              marginBottom: 16,
              paddingHorizontal: 4
            }}
          >
            🚨 Alertas Críticas ({criticalAlerts.length})
          </Text>
          {criticalAlerts.map((insight, index) => (
            <ClinicalAlertCard
              key={`critical-${insight.title}-${index}`}
              insight={insight}
              isExpanded={expandedCards.has(insight.title)}
              onToggle={() => toggleExpanded(insight.title)}
              onAction={() => handleActionRequired(insight)}
            />
          ))}
        </View>
      )}

      {/* Advertencias */}
      {warnings.length > 0 && (
        <View style={{ marginBottom: 20 }}>
          <Text
            variant="h3"
            style={{ 
              color: '#D97706', 
              fontWeight: '700', 
              marginBottom: 16,
              paddingHorizontal: 4
            }}
          >
            ⚠️ Advertencias Clínicas ({warnings.length})
          </Text>
          {warnings.map((insight, index) => (
            <ClinicalAlertCard
              key={`warning-${insight.title}-${index}`}
              insight={insight}
              isExpanded={expandedCards.has(insight.title)}
              onToggle={() => toggleExpanded(insight.title)}
              onAction={insight.urgency === 'high' ? () => handleActionRequired(insight) : undefined}
            />
          ))}
        </View>
      )}

      {/* Recomendaciones */}
      {recommendations.length > 0 && (
        <View style={{ marginBottom: 20 }}>
          <Text
            variant="h3"
            style={{ 
              color: '#059669', 
              fontWeight: '700', 
              marginBottom: 16,
              paddingHorizontal: 4
            }}
          >
            💡 Recomendaciones ({recommendations.length})
          </Text>
          {recommendations.map((insight, index) => (
            <ClinicalAlertCard
              key={`recommendation-${insight.title}-${index}`}
              insight={insight}
              isExpanded={expandedCards.has(insight.title)}
              onToggle={() => toggleExpanded(insight.title)}
            />
          ))}
        </View>
      )}

      {/* Espaciado final */}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

export default ClinicalAlertsSystem;
