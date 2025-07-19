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

// 🚀 INTEGRACIÓN DEL MOTOR PARALELO FASE 2
import { ParallelValidationEngine, PARALLEL_VALIDATION_PRESETS } from '@/core/workers/parallelValidationEngine_FASE2';
import type { UserInput } from '@/core/domain/models';
import { MyomaType, AdenomyosisType, PolypType, HsgResult } from '@/core/domain/models';
import { useParallelValidationContext } from '@/core/context/ParallelValidationContext';

// 🚀 DECLARACIÓN DE __DEV__ PARA REACT NATIVE
declare const __DEV__: boolean;

// 🚀 INTERFAZ PARA MÉTRICAS EXTENDIDAS DEL MOTOR PARALELO
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

// 🚀 INTERFAZ PARA MÉTRICAS DEL MOTOR PARALELO
interface ParallelValidationMetrics {
  totalTasks: number;
  completedTasks: number;
  failedTasks: number;
  averageTime: number;
  cacheHitRate: number;
  concurrencyLevel: number;
  performanceReport?: {
    parallelizationGain: number;
    categoryBreakdown: Map<string, number>;
    cacheEfficiency: number;
    totalProcessingTime: number;
  };
  resultsCount: number;
  categoriesProcessed: string[];
  timestamp: number;
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
  const [parallelValidationMetrics, setParallelValidationMetrics] = useState<ParallelValidationMetrics | null>(null);

  // 🚀 CONTEXTO GLOBAL PARA MÉTRICAS DEL MOTOR PARALELO
  const { updateMetrics, markEngineActive } = useParallelValidationContext();

  // 🚀 INICIALIZAR MOTOR PARALELO FASE 2
  const parallelEngine = useMemo(() => {
    markEngineActive(); // Marcar que el motor está activo
    return new ParallelValidationEngine(PARALLEL_VALIDATION_PRESETS.development);
  }, [markEngineActive]);

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
          hasPcos: false,
          endometriosisGrade: 0,
          myomaType: MyomaType.None,
          adenomyosisType: AdenomyosisType.None,
          polypType: PolypType.None,
          hsgResult: HsgResult.Normal,
          hasOtb: false,
          tpoAbPositive: false,
          amh: sanitizedData.amh ?? undefined,
          tsh: (sanitizedData as Record<string, unknown>).tsh as number | undefined ?? undefined,
          prolactin: (sanitizedData as Record<string, unknown>).prolactin as number | undefined ?? undefined,
          homaIr: undefined,
          spermConcentration: undefined,
          infertilityDuration: sanitizedData.timeToConception ?? undefined,
          pelvicSurgeriesNumber: 0
        };

        // Ejecutar validaciones paralelas en categorías principales
        const results = await parallelEngine.executeParallelValidations(
          userInput, 
          ['hormonal', 'metabolic', 'temporal']
        );

        // Obtener métricas de performance
        const metrics = parallelEngine.getMetrics();
        const performanceReport = parallelEngine.getPerformanceReport();

        const extendedMetrics = {
          ...metrics,
          performanceReport,
          resultsCount: results.size,
          categoriesProcessed: Array.from(results.keys()),
          timestamp: Date.now()
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

  // 🚀 PUBLICAR MÉTRICAS EN CONTEXTO GLOBAL (separado para evitar setState en render)
  useEffect(() => {
    if (parallelValidationMetrics) {
      // Convertir a ExtendedParallelMetrics con las propiedades requeridas
      const extendedMetrics: ExtendedParallelMetrics = {
        ...parallelValidationMetrics,
        isActive: true,
        lastUpdate: Date.now()
      };
      updateMetrics(extendedMetrics);
      markEngineActive();
    }
  }, [parallelValidationMetrics, updateMetrics, markEngineActive]);

  // Datos de alertas
  const criticalAlerts = getCriticalAlerts();
  const warnings = getWarnings();
  const urgencyLevel = getUrgencyLevel();

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
          <Box style={{
            backgroundColor: '#EFF6FF',
            borderRadius: 16,
            padding: 16,
            borderWidth: 2,
            borderColor: '#3B82F6'
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <ModernIcon name="check" size={24} color="#3B82F6" style={{ marginRight: 12 }} />
              <View style={{ flex: 1 }}>
                <Text variant="h3" style={{ color: '#3B82F6', fontWeight: '700' }}>
                  Estado: Análisis Activo
                </Text>
                <Text variant="small" style={{ color: '#1E40AF', marginTop: 2 }}>
                  Completitud: {Math.round(validationResult.completionScore)}%
                </Text>
              </View>
            </View>
          </Box>
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
            canProceedWithTreatment={canProceedWithTreatment()}
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
