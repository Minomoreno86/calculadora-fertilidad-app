// ===================================================================
// 🎯 INTEGRADOR DEL SISTEMA DE VALIDACIÓN CLÍNICA INTELIGENTE
// ===================================================================

import React from 'react';
import { View, TouchableOpacity, ViewStyle } from 'react-native';

// Safe imports for optional React Native components
let Modal: any;

try {
  const RNComponents = require('react-native');
  Modal = RNComponents.Modal || (() => null);
} catch {
  Modal = () => null;
}

import Text from '@/presentation/components/common/Text';
import Box from '@/presentation/components/common/Box';
import { ModernIcon } from '@/presentation/components/common/ModernIcon';

// Fallback interfaces for missing types
interface ClinicalInsight {
  type: 'critical' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  urgency?: 'low' | 'medium' | 'high' | 'critical';
}

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
  showMedicalAnalysis?: boolean;
  basicValidationOnly?: boolean;
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
          <Text variant="h3" style={{ color: config.color, fontWeight: '700' }}>
            {config.label}
          </Text>
          <Text variant="small" style={{ color: config.color, opacity: 0.8 }}>
            {totalAlerts} alertas • {completionScore}% completo
          </Text>
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
          <Text variant="small" style={{ color: '#6B7280' }}>
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
          <View
            key={`alert-${index}`}
            style={{
              backgroundColor: config.bg,
              borderLeftWidth: 4,
              borderLeftColor: config.color,
              padding: 12,
              marginBottom: 8,
              borderRadius: 8
            }}
          >
            <Text variant="small" style={{ color: config.color, fontWeight: '600' }}>
              {alert.title}
            </Text>
            <Text variant="small" style={{ color: config.color, opacity: 0.8 }}>
              {alert.message}
            </Text>
          </View>
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
            + {(criticalAlerts.length + warnings.length) - 2} alertas más
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
  showMedicalAnalysis: _showMedicalAnalysis = true,
  basicValidationOnly = false,
  style
}) => {
  const [showFullAlertsModal, setShowFullAlertsModal] = React.useState(false);

  // Mock validation result for now (replace with actual validation logic)
  const mockValidationResult = {
    isValid: true,
    canProceed: true,
    criticalAlerts: [] as ClinicalInsight[],
    warnings: [] as ClinicalInsight[],
    urgencyLevel: 'low' as const,
    completionScore: 85
  };

  // Notificar cambios de validación
  React.useEffect(() => {
    onValidationChange?.(
      mockValidationResult.isValid,
      mockValidationResult.canProceed
    );
  }, [onValidationChange]);

  const { criticalAlerts, warnings, urgencyLevel, completionScore } = mockValidationResult;

  return (
    <>
      <View style={style}>
        <IntelligentStatusIndicator
          urgencyLevel={urgencyLevel}
          criticalCount={criticalAlerts.length}
          warningCount={warnings.length}
          completionScore={completionScore}
          onPress={() => setShowFullAlertsModal(true)}
        />

        {showInlineAlerts && (
          <InlineAlertsCompact
            criticalAlerts={criticalAlerts}
            warnings={warnings}
            onViewAll={() => setShowFullAlertsModal(true)}
          />
        )}
      </View>

      {/* Modal con sistema completo de alertas */}
      <Modal
        visible={showFullAlertsModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowFullAlertsModal(false)}
      >
        <View style={{ flex: 1, padding: 16 }}>
          <Text variant="h2">Sistema de Alertas Clínicas</Text>
          <Text variant="body">Aquí irían todas las alertas detalladas</Text>
          
          <TouchableOpacity
            onPress={() => setShowFullAlertsModal(false)}
            style={{
              backgroundColor: '#3B82F6',
              padding: 16,
              borderRadius: 8,
              marginTop: 16
            }}
          >
            <Text variant="body" style={{ color: 'white', textAlign: 'center' }}>
              Cerrar
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
};

export default IntelligentValidationIntegrator;