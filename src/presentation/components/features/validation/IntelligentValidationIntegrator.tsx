// ===================================================================
// 🎯 INTEGRADOR DEL SISTEMA DE VALIDACIÓN CLÍNICA INTELIGENTE
// ===================================================================

import React, { useState } from 'react';
import { View, TouchableOpacity, Modal, ViewStyle } from 'react-native';
import Text from '@/presentation/components/common/Text';
import Box from '@/presentation/components/common/Box';
import ModernIcon from '@/presentation/components/common/ModernIcon';
import { useIntelligentClinicalValidation, ClinicalInsight } from '@/core/domain/validation/useIntelligentClinicalValidation';
import { ClinicalAlertsSystem } from '@/presentation/components/features/validation/ClinicalAlertsSystem';

// Tipos del formulario (simplified)
interface FormData {
  age?: number | string;
  height?: number | string;
  weight?: number | string;
  amhValue?: number | string;
  [key: string]: unknown;
}

interface IntelligentValidationIntegratorProps {
  formData: FormData;
  onValidationChange?: (isValid: boolean, canProceed: boolean) => void;
  onActionRequired?: (insight: ClinicalInsight) => void;
  showInlineAlerts?: boolean;
  style?: ViewStyle;
}

// 🎯 Componente de indicador de estado inteligente
const IntelligentStatusIndicator: React.FC<{
  urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
  criticalCount: number;
  warningCount: number;
  completionScore: number;
  onPress: () => void;
}> = ({ urgencyLevel, criticalCount, warningCount, completionScore, onPress }) => {
  const urgencyConfig = {
    low: { 
      color: '#10B981', 
      bg: '#F0FDF4', 
      emoji: 'success', 
      pulse: false,
      label: 'Óptimo'
    },
    medium: { 
      color: '#F59E0B', 
      bg: '#FFFBEB', 
      emoji: 'warning', 
      pulse: true,
      label: 'Atención'
    },
    high: { 
      color: '#EF4444', 
      bg: '#FEF2F2', 
      emoji: 'warning', 
      pulse: true,
      label: 'Urgente'
    },
    critical: { 
      color: '#DC2626', 
      bg: '#FEF2F2', 
      emoji: 'critical', 
      pulse: true,
      label: 'Crítico'
    }
  };

  const config = urgencyConfig[urgencyLevel];
  const totalAlerts = criticalCount + warningCount;

  return (
    <TouchableOpacity onPress={onPress}>
      <Box
        style={{
          backgroundColor: config.bg,
          borderRadius: 16,
          padding: 16,
          borderWidth: 2,
          borderColor: config.color,
          flexDirection: 'row',
          alignItems: 'center',
          shadowColor: config.color,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 8,
          elevation: 4
        }}
      >
        {/* Icono con posible animación de pulso */}
        <View
          style={{
            backgroundColor: config.color,
            borderRadius: 12,
            padding: 8,
            marginRight: 12
          }}
        >
          <ModernIcon
            name={config.emoji}
            size={24}
            color="white"
          />
        </View>

        <View style={{ flex: 1 }}>
          <Text
            variant="h3"
            style={{ color: config.color, fontWeight: '700' }}
          >
            Estado: {config.label}
          </Text>
        
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
          <Text
            variant="small"
            style={{ color: config.color, marginRight: 12 }}
          >
            Completitud: {Math.round(completionScore)}%
          </Text>
            
            {totalAlerts > 0 && (
              <View
                style={{
                  backgroundColor: config.color,
                  borderRadius: 10,
                  paddingHorizontal: 6,
                  paddingVertical: 2
                }}
              >
                <Text
                  variant="small"
                  style={{ color: 'white', fontWeight: '600' }}
                >
                  {totalAlerts} alerta{totalAlerts !== 1 ? 's' : ''}
                </Text>
              </View>
            )}
          </View>
        </View>

        <ModernIcon
          name="next"
          size={20}
          color={config.color}
        />
      </Box>
    </TouchableOpacity>
  );
};

// 🎯 Componente de alertas inline compactas
const InlineAlertsCompact: React.FC<{
  criticalAlerts: ClinicalInsight[];
  warnings: ClinicalInsight[];
  onViewAll: () => void;
}> = ({ criticalAlerts, warnings, onViewAll }) => {
  if (criticalAlerts.length === 0 && warnings.length === 0) return null;

  const topAlerts = [...criticalAlerts, ...warnings].slice(0, 2);

  return (
    <Box style={{ marginTop: 16 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <Text
          variant="h3"
          style={{ color: '#1F2937', fontWeight: '700' }}
        >
          🔍 Alertas Clínicas Principales
        </Text>
        
        <TouchableOpacity onPress={onViewAll}>
          <Text
            variant="small"
            style={{ color: '#3B82F6', fontWeight: '600' }}
          >
            Ver todas
          </Text>
        </TouchableOpacity>
      </View>

      {topAlerts.map((alert, index) => {
        const alertConfig = {
          critical: { color: '#DC2626', bg: '#FEF2F2', emoji: 'critical' },
          warning: { color: '#F59E0B', bg: '#FFFBEB', emoji: 'warning' },
          info: { color: '#3B82F6', bg: '#EFF6FF', emoji: 'info' },
          success: { color: '#10B981', bg: '#F0FDF4', emoji: 'success' }
        } as const;

        const config = alertConfig[alert.type];

        return (
          <Box
            key={`alert-${alert.type}-${alert.title}-${index}`}
            style={{
              backgroundColor: config.bg,
              borderLeftWidth: 4,
              borderLeftColor: config.color,
              padding: 12,
              marginBottom: 8,
              borderRadius: 8
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
              <ModernIcon
                name={config.emoji}
                size={18}
                color={config.color}
                style={{ marginRight: 8, marginTop: 2 }}
              />
              
              <View style={{ flex: 1 }}>
                <Text
                  variant="small"
                  style={{ color: config.color, fontWeight: '600' }}
                >
                  {alert.title}
                </Text>
                <Text
                  variant="caption"
                  style={{ color: config.color, marginTop: 2 }}
                  numberOfLines={2}
                >
                  {alert.message}
                </Text>
              </View>
            </View>
          </Box>
        );
      })}

      {(criticalAlerts.length + warnings.length) > 2 && (
        <TouchableOpacity
          onPress={onViewAll}
          style={{
            backgroundColor: '#F3F4F6',
            borderRadius: 8,
            padding: 12,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Text
            variant="small"
            style={{ color: '#6B7280', fontWeight: '600', marginRight: 4 }}
          >
            +{(criticalAlerts.length + warnings.length) - 2} alertas más
          </Text>
          <ModernIcon
            name="next"
            size={16}
            color="#6B7280"
          />
        </TouchableOpacity>
      )}
    </Box>
  );
};

// 🎯 Componente integrador principal
export const IntelligentValidationIntegrator: React.FC<IntelligentValidationIntegratorProps> = ({
  formData,
  onValidationChange,
  onActionRequired,
  showInlineAlerts = true,
  style
}) => {
  const [showFullAlertsModal, setShowFullAlertsModal] = useState(false);

  // Hook del sistema inteligente
  const {
    validationResult,
    isValidating,
    getCriticalAlerts,
    getWarnings,
    canProceedWithTreatment,
    getUrgencyLevel
  } = useIntelligentClinicalValidation(formData, {
    enableRealTimeValidation: true,
    includeAdvancedInterpretation: true,
    considerPatientContext: true,
    prioritizeUrgentFindings: true
  });

  // Notificar cambios de validación
  React.useEffect(() => {
    if (validationResult) {
      onValidationChange?.(
        validationResult.isValid,
        validationResult.canProceed
      );
    }
  }, [validationResult, onValidationChange]);

  // Datos de alertas
  const criticalAlerts = getCriticalAlerts();
  const warnings = getWarnings();
  const urgencyLevel = getUrgencyLevel();
  const canProceed = canProceedWithTreatment();

  // Si no hay resultado de validación, mostrar cargando
  if (!validationResult) {
    return (
      <Box style={[{ padding: 16 }, style]}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <ModernIcon
            name="info"
            size={20}
            color="#6B7280"
            style={{ marginRight: 8 }}
          />
          <Text
            variant="small"
            style={{ color: '#6B7280' }}
          >
            {isValidating ? 'Analizando datos clínicos...' : 'Esperando datos para validación'}
          </Text>
        </View>
      </Box>
    );
  }

  return (
    <>
      <View style={style}>
        {/* Indicador de estado principal */}
        <IntelligentStatusIndicator
          urgencyLevel={urgencyLevel}
          criticalCount={criticalAlerts.length}
          warningCount={warnings.length}
          completionScore={validationResult.completionScore}
          onPress={() => setShowFullAlertsModal(true)}
        />

        {/* Alertas inline compactas */}
        {showInlineAlerts && (
          <InlineAlertsCompact
            criticalAlerts={criticalAlerts}
            warnings={warnings}
            onViewAll={() => setShowFullAlertsModal(true)}
          />
        )}

        {/* Información de progreso */}
        {validationResult.missingCriticalData.length > 0 && (
          <Box style={{ marginTop: 16 }}>
            <Text
              variant="bodyBold"
              style={{ color: '#6B7280', fontWeight: '600', marginBottom: 8 }}
            >
              📋 Datos clínicos recomendados:
            </Text>
            {validationResult.missingCriticalData.map((field, index) => (
              <Text
                key={`missing-${field}-${index}`}
                variant="small"
                style={{ color: '#6B7280', marginBottom: 4 }}
              >
                • {field}
              </Text>
            ))}
          </Box>
        )}

        {/* Sugerencias de tests */}
        {validationResult.suggestedNextTests.length > 0 && (
          <Box style={{ marginTop: 16 }}>
            <Text
              variant="bodyBold"
              style={{ color: '#3B82F6', fontWeight: '600', marginBottom: 8 }}
            >
              🧪 Tests Recomendados
            </Text>
            {validationResult.suggestedNextTests.map((test, index) => (
              <Text
                key={`test-${test}-${index}`}
                variant="small"
                style={{ color: '#3B82F6', marginBottom: 4 }}
              >
                • {test}
              </Text>
            ))}
          </Box>
        )}
      </View>

      {/* Modal con sistema completo de alertas */}
      <Modal
        visible={showFullAlertsModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowFullAlertsModal(false)}
      >
        <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
          {/* Header del modal */}
          <View
            style={{
              backgroundColor: 'white',
              paddingTop: 50,
              paddingHorizontal: 20,
              paddingBottom: 16,
              borderBottomWidth: 1,
              borderBottomColor: '#E5E7EB',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Text
              variant="h2"
              style={{ color: '#1F2937', fontWeight: '700' }}
            >
              🧠 Análisis Clínico Inteligente
            </Text>
            
            <TouchableOpacity
              onPress={() => setShowFullAlertsModal(false)}
              style={{
                backgroundColor: '#F3F4F6',
                borderRadius: 20,
                padding: 8
              }}
            >
              <ModernIcon
                name="close"
                size={24}
                color="#6B7280"
              />
            </TouchableOpacity>
          </View>

          {/* Sistema completo de alertas */}
          <ClinicalAlertsSystem
            criticalAlerts={criticalAlerts}
            warnings={warnings}
            recommendations={validationResult.recommendations}
            canProceedWithTreatment={canProceed}
            urgencyLevel={urgencyLevel}
            completionScore={validationResult.completionScore}
            clinicalScore={validationResult.clinicalScore}
            onActionRequired={onActionRequired}
          />
        </View>
      </Modal>
    </>
  );
};

export default IntelligentValidationIntegrator;
