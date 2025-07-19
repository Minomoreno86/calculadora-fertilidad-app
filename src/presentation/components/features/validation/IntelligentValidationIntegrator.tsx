// ===================================================================
// 🎯 INTEGRADOR DEL SISTEMA DE VALIDACIÓN CLÍNICA INTELIGENTE
// ===================================================================

import React, { useState, useEffect, useMemo } from 'react';
import { View, TouchableOpacity, Modal, ViewStyle } from 'react-native';
import Text from '@/presentation/components/common/Text';
import Box from '@/presentation/components/common/Box';
import ModernIcon from '@/presentation/components/common/ModernIcon';
import { useIntelligentClinicalValidation, ClinicalInsight } from '@/core/domain/validation/useIntelligentClinicalValidation';
import { ClinicalAlertsSystem } from '@/presentation/components/features/validation/ClinicalAlertsSystem';

// 🚀 INTEGRACIÓN MOTOR PARALELO FASE 2
import { ParallelValidationEngine, PARALLEL_VALIDATION_PRESETS } from '@/core/workers/parallelValidationEngine_FASE2';
import type { UserInput } from '@/core/domain/models';
import { HsgResult, MyomaType, AdenomyosisType, PolypType } from '@/core/domain/models';
import { useParallelValidationContext } from '@/core/context/ParallelValidationContext';

// 🚀 DECLARACIÓN __DEV__ PARA REACT NATIVE
declare const __DEV__: boolean;

// 🚀 INTERFAZ PARA MÉTRICAS DEL MOTOR PARALELO
interface ExtendedParallelMetrics {
  totalTasks: number;
  completedTasks: number;
  failedTasks: number;
  averageTime: number;
  cacheHitRate: number;
  concurrencyLevel: number;
  isActive: boolean;
  lastUpdate: number;
  performanceReport?: {
    parallelizationGain: number;
    categoryBreakdown: Map<string, number>;
    cacheEfficiency: number;
    totalProcessingTime: number;
  };
  categoriesProcessed: string[];
  resultsCount: number;
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
  showMedicalAnalysis: _showMedicalAnalysis = true,
  basicValidationOnly = false,
  style
}) => {
  const [showFullAlertsModal, setShowFullAlertsModal] = useState(false);
  const [parallelValidationMetrics, setParallelValidationMetrics] = useState<ExtendedParallelMetrics | null>(null);

  // 🚀 CONTEXTO DEL MOTOR PARALELO
  const { updateMetrics: updateContextMetrics } = useParallelValidationContext();

  // 🚀 INICIALIZAR MOTOR PARALELO FASE 2
  const parallelEngine = useMemo(() => {
    return new ParallelValidationEngine(PARALLEL_VALIDATION_PRESETS.development);
  }, []);

  // Hook del sistema inteligente
  const {
    validationResult,
    isValidating,
    getCriticalAlerts,
    getWarnings,
    canProceedWithTreatment,
    getUrgencyLevel,
    sanitizedData
  } = useIntelligentClinicalValidation(formData, {
    enableRealTimeValidation: true,
    includeAdvancedInterpretation: !basicValidationOnly,
    considerPatientContext: !basicValidationOnly,
    prioritizeUrgentFindings: !basicValidationOnly
  });

  // 🚀 EJECUTAR VALIDACIÓN PARALELA EN BACKGROUND
  useEffect(() => {
    if (!parallelEngine || basicValidationOnly || !sanitizedData) return;

    const executeParallelValidation = async () => {
      try {
        // Convertir FormData a UserInput para el motor paralelo
        const userInput: UserInput = {
          age: typeof sanitizedData.age === 'string' ? parseInt(sanitizedData.age) : (sanitizedData.age ?? 30),
          bmi: null,
          cycleDuration: undefined,
          infertilityDuration: sanitizedData.timeToConception ?? undefined,
          hasPcos: false,
          endometriosisGrade: 0,
          myomaType: MyomaType.None,
          adenomyosisType: AdenomyosisType.None,
          polypType: PolypType.None,
          hsgResult: HsgResult.Normal,
          hasOtb: false,
          otbMethod: undefined,
          remainingTubalLength: undefined,
          hasOtherInfertilityFactors: false,
          desireForMultiplePregnancies: false,
          hasPelvicSurgery: false,
          pelvicSurgeriesNumber: 0,
          amh: sanitizedData.amh ?? undefined,
          prolactin: (sanitizedData as Record<string, unknown>).prolactin as number ?? undefined,
          tsh: (sanitizedData as Record<string, unknown>).tsh as number ?? undefined,
          tpoAbPositive: false,
          homaIr: undefined,
          spermConcentration: undefined,
          spermProgressiveMotility: undefined,
          spermNormalMorphology: undefined,
          semenVolume: undefined
        };

        // Ejecutar validaciones paralelas en categorías principales
        const results = await parallelEngine.executeParallelValidations(
          userInput, 
          ['hormonal', 'metabolic', 'temporal']
        );

        // Obtener métricas de performance
        const metrics = parallelEngine.getMetrics();
        const performanceReport = parallelEngine.getPerformanceReport();

        const extendedMetrics: ExtendedParallelMetrics = {
          ...metrics,
          isActive: true,
          lastUpdate: Date.now(),
          performanceReport,
          resultsCount: results.size,
          categoriesProcessed: Array.from(results.keys())
        };

        setParallelValidationMetrics(extendedMetrics);

        console.log('🚀 [ParallelValidation] Validación paralela completada:', {
          categories: Array.from(results.keys()),
          performance: performanceReport,
          metrics
        });

      } catch (error) {
        console.error('🚨 [ParallelValidation] Error en validación paralela:', error);
      }
    };

    // Ejecutar validación paralela con debounce
    const timeoutId = setTimeout(executeParallelValidation, 300);
    return () => clearTimeout(timeoutId);
  }, [parallelEngine, basicValidationOnly, sanitizedData]);

  // 🚀 ACTUALIZAR CONTEXTO GLOBAL CON MÉTRICAS
  useEffect(() => {
    if (parallelValidationMetrics && updateContextMetrics) {
      updateContextMetrics(parallelValidationMetrics);
    }
  }, [parallelValidationMetrics, updateContextMetrics]);

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
        {/* Indicador de estado principal - Solo modo básico si basicValidationOnly es true */}
        {basicValidationOnly ? (
          // Versión simplificada para captura de datos
          <Box style={{ 
            backgroundColor: '#F9FAFB', 
            borderRadius: 12, 
            padding: 12,
            borderWidth: 1,
            borderColor: '#E5E7EB'
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <ModernIcon name="check" size={16} color="#10B981" style={{ marginRight: 8 }} />
              <Text variant="small" style={{ color: '#6B7280' }}>
                Formulario {validationResult.completionScore > 50 ? 'listo' : 'en progreso'} - {Math.round(validationResult.completionScore)}% completado
              </Text>
            </View>
          </Box>
        ) : (
          // Versión completa para análisis médico
          <IntelligentStatusIndicator
            urgencyLevel={urgencyLevel}
            criticalCount={criticalAlerts.length}
            warningCount={warnings.length}
            completionScore={validationResult.completionScore}
            onPress={() => setShowFullAlertsModal(true)}
          />
        )}

        {/* 🚀 MÉTRICAS DEL MOTOR PARALELO - Solo en desarrollo y modo completo */}
        {__DEV__ && !basicValidationOnly && parallelValidationMetrics && (
          <Box style={{ 
            marginTop: 16,
            backgroundColor: '#EFF6FF', 
            borderRadius: 12, 
            padding: 12,
            borderWidth: 1,
            borderColor: '#3B82F6'
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <ModernIcon name="settings" size={16} color="#3B82F6" style={{ marginRight: 8 }} />
              <Text variant="small" style={{ color: '#3B82F6', fontWeight: '600' }}>
                Motor Paralelo FASE 2 - Activo
              </Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text variant="small" style={{ color: '#1E40AF' }}>
                Ganancia: {parallelValidationMetrics.performanceReport?.parallelizationGain || 0}%
              </Text>
              <Text variant="small" style={{ color: '#1E40AF' }}>
                Cache: {Math.round((parallelValidationMetrics.cacheHitRate || 0) * 100)}%
              </Text>
              <Text variant="small" style={{ color: '#1E40AF' }}>
                Categorías: {parallelValidationMetrics.categoriesProcessed?.length || 0}
              </Text>
            </View>
          </Box>
        )}

        {/* Alertas inline compactas - Solo en modo completo */}
        {!basicValidationOnly && showInlineAlerts && (
          <InlineAlertsCompact
            criticalAlerts={criticalAlerts}
            warnings={warnings}
            onViewAll={() => setShowFullAlertsModal(true)}
          />
        )}

        {/* Información de progreso - Solo datos faltantes críticos en modo básico */}
        {validationResult.missingCriticalData.length > 0 && !basicValidationOnly && (
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

        {/* Sugerencias de tests - Solo en modo completo (MOVER A RESULTS) */}
        {!basicValidationOnly && validationResult.suggestedNextTests.length > 0 && (
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