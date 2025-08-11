/**
 * 🚀 MODERN SIMULATOR DASHBOARD V2.0 - EXPERIENCIA PREMIUM
 * 
 * Dashboard completamente modernizado que integra:
 * ✨ A) UI/UX Visual: Interfaz moderna y atractiva 
 * 📊 B) Análisis Avanzado: Insights inteligentes
 * 🔄 C) Interactividad: Controles intuitivos
 * 🧠 D) Inteligencia: Análisis médico profundo
 */

import React from 'react';
import { View, ScrollView, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Text from '../../../components/common/Text';
import Box from '../../../components/common/Box';
import { ModernSimulatorCard } from './ModernSimulatorCard';
import { EvaluationState, SimulatableFactor } from '../../../../core/domain/models';
import { useFertilitySimulator } from '../useFertilitySimulator';

// const { width } = Dimensions.get('window'); // Removed unused import

// 🎨 COLORES Y GRADIENTES MODERNOS
const MODERN_THEME = {
  colors: {
    primary: '#0066CC',
    primaryDark: '#004999',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    background: '#FAFBFC',
    surface: '#FFFFFF',
    text: {
      primary: '#0F172A',
      secondary: '#475569',
      tertiary: '#94A3B8',
    }
  },
  gradients: {
    header: ['#0066CC', '#004999'],
    success: ['#10B981', '#047857'],
    medical: ['#0891B2', '#0E7490'],
  },
  shadows: {
    card: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 4,
    },
    header: {
      shadowColor: '#0066CC',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.15,
      shadowRadius: 20,
      elevation: 8,
    }
  }
};

// 🧠 INTELIGENCIA: Análisis global del simulador
interface GlobalAnalysis {
  totalImprovementPotential: number;
  criticalFactorsCount: number;
  averageSuccessRate: number;
  estimatedTimeframe: string;
  recommendedOrder: string[];
}

interface ModernSimulatorDashboardProps {
  evaluation?: EvaluationState;
  onModeChange?: (mode: string) => void;
}

export const ModernSimulatorDashboard: React.FC<ModernSimulatorDashboardProps> = ({
  evaluation,
  onModeChange
}) => {
  // 🏷️ MAPEO DE NOMBRES AMIGABLES
  const getFactorDisplayName = React.useCallback((key: string): string => {
    const nameMap: Record<string, string> = {
      bmi: 'Índice de Masa Corporal',
      tsh: 'Función Tiroidea (TSH)',
      prolactin: 'Prolactina Sérica',
      homa: 'Resistencia a la Insulina',
      pcos: 'Síndrome Ovarios Poliquísticos',
      male: 'Factor Masculino',
      cycle: 'Regularidad Menstrual',
      endometriosis: 'Endometriosis',
      myoma: 'Miomas Uterinos',
      amh: 'Reserva Ovárica (AMH)'
    };
    return nameMap[key] || key.charAt(0).toUpperCase() + key.slice(1);
  }, []);

  // 📊 MATRIZ DE EVIDENCIA MÉDICA COMPLETA - CORREGIDA
  const EVIDENCE_MATRIX = React.useMemo(() => ({
    // 📋 FACTORES HORMONALES
    prolactin: {
      maxImprovement: 0.35,
      timeframe: '4-8 semanas',
      difficulty: 0.25,
      evidence: 'Cabergolina normaliza prolactina en 90% de casos',
      cost: 'medio',
      successRate: 90
    },
    tsh: {
      maxImprovement: 0.30,
      timeframe: '6-8 semanas',
      difficulty: 0.2,
      evidence: 'Levotiroxina normaliza TSH <2.5 mUI/L en 6-8 semanas',
      cost: 'bajo',
      successRate: 95
    },
    homa: {
      maxImprovement: 0.20,
      timeframe: '8-12 semanas',
      difficulty: 0.4,
      evidence: 'Metformina + dieta mejora HOMA-IR en 60% pacientes',
      cost: 'bajo',
      successRate: 75
    },
    amh: {
      maxImprovement: 0.15,
      timeframe: '6-12 meses',
      difficulty: 0.85,
      evidence: 'CoQ10 + DHEA + inositol mejoran reserva ovárica marginalmente',
      cost: 'alto',
      successRate: 40
    },
    // 🏋️ FACTORES FÍSICOS
    bmi: {
      maxImprovement: 0.25,
      timeframe: '3-6 meses',
      difficulty: 0.3,
      evidence: 'Pérdida de peso 5-10% mejora ovulación en 80% casos',
      cost: 'bajo',
      successRate: 85
    },
    // 🥰 SÍNDROMES
    pcos: {
      maxImprovement: 0.40,
      timeframe: '3-6 meses',
      difficulty: 0.6,
      evidence: 'Letrozol + metformina logra ovulación en 85% casos',
      cost: 'medio',
      successRate: 80
    },
    endometriosis: {
      maxImprovement: 0.20,
      timeframe: '3-6 meses',
      difficulty: 0.8,
      evidence: 'Cirugía laparoscópica mejora fertilidad en casos moderados-severos',
      cost: 'alto',
      successRate: 65
    },
    // 👨 FACTOR MASCULINO
    male: {
      maxImprovement: 0.18,
      timeframe: '2-3 meses',
      difficulty: 0.5,
      evidence: 'Antioxidantes mejoran parámetros seminales 15-20%',
      cost: 'bajo',
      successRate: 70
    },
    // 🌸 OTROS FACTORES
    cycle: {
      maxImprovement: 0.30,
      timeframe: '2-4 meses',
      difficulty: 0.4,
      evidence: 'Inducción ovulación normaliza ciclos en 85% casos',
      cost: 'medio',
      successRate: 85
    },
    myoma: {
      maxImprovement: 0.25,
      timeframe: '4-8 semanas',
      difficulty: 0.7,
      evidence: 'Myomectomía mejora implantación en casos submucosos',
      cost: 'alto',
      successRate: 75
    }
    // 📝 NOTA: baseAgeProbability excluido - la edad no es optimizable
  }), []);

  // ✅ HOOKS SIEMPRE LLAMADOS
  const {
    simulationResult,
    simulateFactor,
    simulateAllImprovements  // 🆕 AGREGAR simulación global
  } = useFertilitySimulator(evaluation);

  const [simulatingFactor, setSimulatingFactor] = React.useState<string | null>(null);

  // 🧠 D) INTELIGENCIA: Análisis global inteligente
  const globalAnalysis = React.useMemo((): GlobalAnalysis | null => {
    if (!evaluation?.factors) return null;
    
    const factors = Object.entries(evaluation.factors).filter(
      ([key, value]) => key !== 'baseAgeProbability' && (value as number) < 0.95
    );

    if (factors.length === 0) return null;

    const criticalFactors = factors.filter(([, value]) => (value as number) < 0.5);
    const totalPotential = factors.reduce((sum, [key, value]) => {
      const evidence = EVIDENCE_MATRIX[key as keyof typeof EVIDENCE_MATRIX];
      if (evidence) {
        const deficit = 1.0 - (value as number);
        return sum + (deficit * evidence.maxImprovement);
      }
      return sum;
    }, 0);

    const avgSuccess = factors.reduce((sum, [key]) => {
      const evidence = EVIDENCE_MATRIX[key as keyof typeof EVIDENCE_MATRIX];
      return sum + (evidence?.successRate || 70);
    }, 0) / factors.length;

    // Orden recomendado por facilidad y impacto
    const sortedFactors = factors.sort(([keyA, valA], [keyB, valB]) => {
      const evidenceA = EVIDENCE_MATRIX[keyA as keyof typeof EVIDENCE_MATRIX];
      const evidenceB = EVIDENCE_MATRIX[keyB as keyof typeof EVIDENCE_MATRIX];
      
      if (!evidenceA || !evidenceB) return 0;
      
      const scoreA = (evidenceA.maxImprovement * (1 - (valA as number))) / evidenceA.difficulty;
      const scoreB = (evidenceB.maxImprovement * (1 - (valB as number))) / evidenceB.difficulty;
      
      return scoreB - scoreA;
    });

    return {
      totalImprovementPotential: Math.min(totalPotential * 100, 40), // Cap realista
      criticalFactorsCount: criticalFactors.length,
      averageSuccessRate: avgSuccess,
      estimatedTimeframe: factors.length > 3 ? '6-12 meses' : '3-6 meses',
      recommendedOrder: sortedFactors.map(([key]) => key).slice(0, 3)
    };
  }, [evaluation?.factors, EVIDENCE_MATRIX]);

  // 🔄 C) INTERACTIVIDAD: Manejo de simulación con feedback - DEBUG
  const handleSimulate = React.useCallback(async (factor: SimulatableFactor) => {
    console.log('🚀 [ModernSimulator] Botón presionado:', factor);
    setSimulatingFactor(factor);
    
    try {
      console.log('🔄 [ModernSimulator] Iniciando simulación para:', getFactorDisplayName(factor));
      await simulateFactor(factor, `Simulando mejora en ${getFactorDisplayName(factor)}`);
      console.log('✅ [ModernSimulator] Simulación completada para:', factor);
    } catch (error) {
      console.error('❌ [ModernSimulator] Error en simulación:', error);
    } finally {
      // Delay para mostrar el efecto visual
      setTimeout(() => {
        console.log('🔄 [ModernSimulator] Finalizando simulación visual para:', factor);
        setSimulatingFactor(null);
      }, 1500);
    }
  }, [simulateFactor, getFactorDisplayName]);

  // 📊 B) ANÁLISIS: Header con insights globales
  const renderModernHeader = () => (
    <LinearGradient
      colors={MODERN_THEME.gradients.header}
      style={[styles.headerContainer, MODERN_THEME.shadows.header]}
    >
      <View style={styles.headerContent}>
        <View style={styles.headerTitle}>
          <Ionicons name="analytics" size={28} color="white" />
          <Text style={styles.headerText}>Simulador Inteligente</Text>
        </View>
        
        {globalAnalysis && (
          <View style={styles.insightsGrid}>
            <View style={styles.insightItem}>
              <Text style={styles.insightValue}>+{globalAnalysis.totalImprovementPotential.toFixed(1)}%</Text>
              <Text style={styles.insightLabel}>Potencial de Mejora</Text>
            </View>
            
            <View style={styles.insightItem}>
              <Text style={styles.insightValue}>{globalAnalysis.averageSuccessRate.toFixed(0)}%</Text>
              <Text style={styles.insightLabel}>Tasa de Éxito</Text>
            </View>
            
            <View style={styles.insightItem}>
              <Text style={styles.insightValue}>{globalAnalysis.estimatedTimeframe}</Text>
              <Text style={styles.insightLabel}>Tiempo Estimado</Text>
            </View>
          </View>
        )}
      </View>
    </LinearGradient>
  );

  // 📊 ESTADO VACÍO MODERNO
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <LinearGradient
        colors={MODERN_THEME.gradients.success}
        style={styles.emptyIcon}
      >
        <Ionicons name="checkmark-circle" size={48} color="white" />
      </LinearGradient>
      
      <Text style={styles.emptyTitle}>¡Excelente Estado de Salud!</Text>
      <Text style={styles.emptyMessage}>
        Todos tus factores están en rangos óptimos. 
        El simulador te ayudará cuando necesites optimizar algún parámetro.
      </Text>
    </View>
  );

  // 🚀 FACTORES OPTIMIZABLES MODERNOS - LÓGICA CORREGIDA
  const renderModernFactors = () => {
    if (!evaluation?.factors) return renderEmptyState();

    // 🚨 DEBUG ULTRA-ESPECÍFICO - Ver todos los datos de entrada
    console.log('🔍 [DEBUG] evaluation.input completo:', evaluation.input);
    console.log('🔍 [DEBUG] evaluation.factors completo:', evaluation.factors);
    console.log('🔍 [DEBUG] EVIDENCE_MATRIX keys:', Object.keys(EVIDENCE_MATRIX));

    const optimizableFactors = Object.entries(evaluation.factors)
      .filter(([key, value]) => {
        // ❌ EXCLUIR factores que NO se pueden optimizar
        const nonOptimizableFactors = ['baseAgeProbability', 'otb', 'hsg'];
        if (nonOptimizableFactors.includes(key)) {
          return false;
        }
        
        // 🔍 DEBUG ESPECÍFICO DE CADA FACTOR
        const originalInputValue = evaluation.input?.[key];
        console.log(`🔍 [${key}] ANÁLISIS COMPLETO:`, {
          originalInputValue,
          originalInputType: typeof originalInputValue,
          factorValue: value,
          factorType: typeof value,
          isProblematic: (value as number) < 0.95
        });
        
        // 📋 LISTA ULTRA-COMPLETA DE VALORES "NO INGRESADOS"
        const emptyValues = [undefined, null, 0, '', 'none', false, 'normal', 'no', 'negative'];
        const wasActuallyEntered = !emptyValues.includes(originalInputValue as any) &&
                                   !(typeof originalInputValue === 'string' && originalInputValue.trim() === '');
        
        if (!wasActuallyEntered) {
          console.log(`❌ [${key}]: EXCLUIDO - Valor vacío/por defecto: '${originalInputValue}' (${typeof originalInputValue})`);
          return false;
        }
        
        // ✅ VERIFICAR SI ES PROBLEMÁTICO
        const isProblematic = (value as number) < 0.95;
        
        if (!isProblematic) {
          console.log(`✅ [${key}]: EXCLUIDO - Factor óptimo (${value} >= 0.95)`);
          return false;
        }
        
        // 🎯 VERIFICAR EVIDENCIA MÉDICA
        const hasEvidence = EVIDENCE_MATRIX[key as keyof typeof EVIDENCE_MATRIX] !== undefined;
        
        if (hasEvidence) {
          console.log(`🎯 [${key}]: INCLUIDO FINAL - input='${originalInputValue}', factor=${value}, evidencia=SÍ`);
          return true;
        } else {
          console.log(`❌ [${key}]: EXCLUIDO - Sin evidencia médica`);
          return false;
        }
      })
      .map(([key, value]) => {
        let evidence = EVIDENCE_MATRIX[key as keyof typeof EVIDENCE_MATRIX];
        
        // 🎆 FALLBACK MEJORADO para factores sin evidencia específica
        if (!evidence) {
          // No debería llegar aquí si el filtro funciona correctamente
          console.warn(`⚠️ [${key}]: Factor sin evidencia llegó al mapeado`);
          evidence = EVIDENCE_MATRIX.generic;
        }

        // 🚨 CORRECCIÓN DEFINITIVA: NO CALCULAR MEJORAS ESTIMADAS
        // Solo mostrar info del factor, el hook calculará cuando presiones el botón
        
        return {
          name: getFactorDisplayName(key),
          currentValue: (value as number),
          improvement: 0, // 🚨 NO CALCULAR - El hook lo hará al presionar botón
          difficulty: evidence.difficulty,
          timeframe: evidence.timeframe,
          evidence: evidence.evidence,
          factor: key as SimulatableFactor
        };
      })
      .filter(Boolean);

    // 🎯 RESULTADO FINAL DEL FILTRADO
    console.log('🎯 [RESULTADO FINAL] Factores que se mostrarán:', {
      total: optimizableFactors.length,
      nombres: optimizableFactors.map(f => f.name),
      detalles: optimizableFactors.map(f => `${f.name}: ${f.currentValue} (⚡ Presiona para simular)`)
    });

    if (optimizableFactors.length === 0) {
      console.log('🚨 [ModernSimulator] NO SE ENCONTRARON FACTORES OPTIMIZABLES - Mostrando estado vacío');
      return renderEmptyState();
    }
    
    console.log('✅ [ModernSimulator] Mostrando', optimizableFactors.length, 'factores optimizables');

    return (
      <View style={styles.factorsContainer}>
        <View style={styles.sectionHeader}>
          <Ionicons name="fitness" size={24} color={MODERN_THEME.colors.primary} />
          <Text style={styles.sectionTitle}>Factores Optimizables</Text>
          <View style={styles.factorsBadge}>
            <Text style={styles.factorsBadgeText}>{optimizableFactors.length}</Text>
          </View>
        </View>

        {optimizableFactors.map((factor, index) => factor && (
          <ModernSimulatorCard
            key={`factor-${factor.factor}-${index}`}
            factor={factor}
            onSimulate={handleSimulate}
            isSimulating={simulatingFactor === factor.factor}
          />
        ))}
      </View>
    );
  };

  // 🎯 RESULTADOS DE SIMULACIÓN MODERNOS
  const renderModernResults = () => {
    if (!simulationResult) return null;

    return (
      <Box style={[styles.resultsCard, MODERN_THEME.shadows.card]}>
        <LinearGradient
          colors={MODERN_THEME.gradients.medical}
          style={styles.resultsHeader}
        >
          <Ionicons name="trending-up" size={24} color="white" />
          <Text style={styles.resultsTitle}>Resultado de Simulación</Text>
        </LinearGradient>

        <View style={styles.resultsContent}>
          <View style={styles.resultMetric}>
            <Text style={styles.resultLabel}>Factor Optimizado:</Text>
            <Text style={styles.resultValue}>
              {getFactorDisplayName(simulationResult.factor as string)}
            </Text>
          </View>

          <View style={styles.resultMetric}>
            <Text style={styles.resultLabel}>Mejora Proyectada:</Text>
            <Text style={[styles.resultValue, { color: MODERN_THEME.colors.success }]}>
              +{Math.abs(simulationResult.improvement).toFixed(1)}%
            </Text>
          </View>

          <View style={styles.prognosisDisplay}>
            <Text style={styles.prognosisLabel}>Pronóstico:</Text>
            <View style={styles.prognosisChange}>
              <Text style={styles.prognosisFrom}>
                {simulationResult.originalPrognosis.toFixed(1)}%
              </Text>
              <Ionicons name="arrow-forward" size={20} color={MODERN_THEME.colors.primary} />
              <Text style={styles.prognosisTo}>
                {simulationResult.newPrognosis.toFixed(1)}%
              </Text>
            </View>
          </View>

          <Text style={styles.resultExplanation}>
            {simulationResult.explanation}
          </Text>
        </View>
      </Box>
    );
  };

  // 🚀 RENDERIZAR BOTÓN SIMULAR TODO MODERNO
  const renderGlobalAction = () => (
    <View style={styles.globalActionContainer}>
      <TouchableOpacity 
        style={[
          styles.modernSimulateAllButton,
          simulatingFactor === 'all' && styles.modernSimulateAllButtonDisabled
        ]}
        onPress={() => {
          setSimulatingFactor('all');
          simulateAllImprovements();
        }}
        disabled={simulatingFactor === 'all'}
      >
        <LinearGradient
          colors={[
            MODERN_THEME.colors.primary, 
            MODERN_THEME.colors.primaryDark
          ] as const}
          style={styles.modernSimulateAllGradient}
        >
          <Ionicons 
            name="flash" 
            size={24} 
            color="white" 
          />
          <Text style={styles.modernSimulateAllText}>
            {simulatingFactor === 'all' ? 'Simulando...' : '🚀 Simular Todo'}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  // 🚀 RENDERIZADO PRINCIPAL
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {renderModernHeader()}
      {renderGlobalAction()}
      {renderModernFactors()}
      {renderModernResults()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MODERN_THEME.colors.background,
  } as ViewStyle,

  // 📊 HEADER MODERNO
  headerContainer: {
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 24,
    minHeight: 140, // ✅ ARREGLO: Altura mínima para evitar cortes
  } as ViewStyle,

  headerContent: {
    padding: 24,
    paddingTop: 40,
  } as ViewStyle,

  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  } as ViewStyle,

  headerText: {
    fontSize: 20, // ✅ ARREGLO: Reducir para que quepa mejor
    fontWeight: '700' as const,
    color: 'white',
    marginLeft: 12,
    flexShrink: 1, // ✅ ARREGLO: Permitir ajuste automático
  } as any,

  insightsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  } as ViewStyle,

  insightItem: {
    alignItems: 'center',
  } as ViewStyle,

  insightValue: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: 'white',
  },

  insightLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
    textAlign: 'center' as const,
  },

  // 🏗️ SECCIÓN DE FACTORES
  factorsContainer: {
    paddingHorizontal: 20,
  } as ViewStyle,

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  } as ViewStyle,

  sectionTitle: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: MODERN_THEME.colors.text.primary,
    marginLeft: 12,
    flex: 1,
  },

  factorsBadge: {
    backgroundColor: MODERN_THEME.colors.primary,
    borderRadius: 16,
    minWidth: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,

  factorsBadgeText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600' as const,
  },

  // 🎯 ESTADO VACÍO
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  } as ViewStyle,

  emptyIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  } as ViewStyle,

  emptyTitle: {
    fontSize: 22,
    fontWeight: '600' as const,
    color: MODERN_THEME.colors.text.primary,
    marginBottom: 12,
    textAlign: 'center' as const,
  },

  emptyMessage: {
    fontSize: 16,
    color: MODERN_THEME.colors.text.secondary,
    textAlign: 'center' as const,
    lineHeight: 24,
    fontWeight: 'normal' as const,
  },

  // 📊 RESULTADOS
  resultsCard: {
    margin: 20,
    borderRadius: 20,
    backgroundColor: MODERN_THEME.colors.surface,
    overflow: 'hidden',
  } as ViewStyle,

  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  } as ViewStyle,

  resultsTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: 'white',
    marginLeft: 12,
  },

  resultsContent: {
    padding: 20,
  } as ViewStyle,

  resultMetric: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  } as ViewStyle,

  resultLabel: {
    fontSize: 14,
    color: MODERN_THEME.colors.text.secondary,
    fontWeight: '500' as const,
  },

  resultValue: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: MODERN_THEME.colors.text.primary,
  },

  prognosisDisplay: {
    marginVertical: 16,
    padding: 16,
    backgroundColor: MODERN_THEME.colors.background,
    borderRadius: 16,
  } as ViewStyle,

  prognosisLabel: {
    fontSize: 14,
    color: MODERN_THEME.colors.text.secondary,
    marginBottom: 8,
  },

  prognosisChange: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,

  prognosisFrom: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: MODERN_THEME.colors.text.secondary,
    marginRight: 12,
  },

  prognosisTo: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: MODERN_THEME.colors.success,
    marginLeft: 12,
  },

  resultExplanation: {
    fontSize: 14,
    color: MODERN_THEME.colors.text.secondary,
    lineHeight: 20,
    marginTop: 8,
  },

  // 🚀 ESTILOS BOTÓN SIMULAR TODO MODERNO
  globalActionContainer: {
    padding: 20,
    marginBottom: 16,
  },
  modernSimulateAllButton: {
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  modernSimulateAllButtonDisabled: {
    opacity: 0.6,
  },
  modernSimulateAllGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    gap: 12,
  },
  modernSimulateAllText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: 'white',
    textAlign: 'center' as const,
  } as any,
});

export default ModernSimulatorDashboard;