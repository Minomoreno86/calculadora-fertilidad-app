/**
 * 🤖 AI MEDICAL AGENT - VERSIÓN INTEGRADA Y OPTIMIZADA
 * 
 * Mejoras implementadas:
 * 1. ✅ Integración nativa con calculadora de fertilidad
 * 2. ✅ UI/UX coherente con el diseño principal
 * 3. ✅ Performance optimizado para móvil
 * 4. ✅ Análisis contextual basado en datos de usuario
 * 5. ✅ Recomendaciones médicas personalizadas
 */

import React, { useState, useCallback, useMemo } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Text from '@/presentation/components/common/Text';
import Box from '@/presentation/components/common/Box';
import { EnhancedInfoCard } from '@/presentation/components/common';
import { useDynamicTheme } from '@/hooks/useDynamicTheme';
import { EvaluationState, Factors } from '@/core/domain/models';

// 🧠 TIPOS DEL AGENTE IA MÉDICO INTEGRADO
export interface MedicalAnalysis {
  diagnosticHypotheses: Array<{
    condition: string;
    probability: number;
    reasoning: string;
    evidenceLevel: 'A' | 'B' | 'C';
    pmid?: string;
  }>;
  treatmentRecommendations: Array<{
    treatment: string;
    priority: 'high' | 'medium' | 'low';
    successRate: number;
    timeframe: string;
    reasoning: string;
    contraindications?: string[];
  }>;
  lifestyle: {
    category: string;
    recommendations: string[];
    impact: 'high' | 'medium' | 'low';
  }[];
  monitoring: {
    parameter: string;
    frequency: string;
    target: string;
  }[];
  nextSteps: string[];
  urgencyLevel: 'immediate' | 'urgent' | 'routine';
}

export interface AIConsultationProps {
  evaluation: EvaluationState;
  onRecommendationSelect?: (recommendation: string) => void;
}

// 🔬 BASE DE CONOCIMIENTO MÉDICO OPTIMIZADA
const MEDICAL_KNOWLEDGE_BASE = {
  // 🎯 Análisis por factores específicos
  factorAnalysis: {
    // SOP (PCOS)
    pcos: {
      condition: 'Síndrome de Ovarios Poliquísticos',
      diagnostic: 'Criterios Rotterdam: 2/3 (oligoanovulación, hiperandrogenismo, morfología poliquística)',
      treatments: [
        {
          name: 'Letrozol',
          priority: 'high',
          successRate: 0.85,
          timeframe: '3-6 ciclos',
          reasoning: 'Inhibidor aromatasa primera línea, superior a clomifeno',
          dosage: '2.5-7.5mg días 3-7 ciclo'
        },
        {
          name: 'Metformina',
          priority: 'high',
          successRate: 0.70,
          timeframe: '2-4 meses',
          reasoning: 'Mejora resistencia insulínica y ovulación',
          dosage: '1500-2000mg/día con comidas'
        },
        {
          name: 'Pérdida de peso',
          priority: 'high',
          successRate: 0.80,
          timeframe: '3-6 meses',
          reasoning: '5-10% pérdida peso restaura ovulación en 80% casos',
          target: 'IMC <25 kg/m²'
        }
      ],
      monitoring: ['Glucosa ayunas', 'HOMA-IR', 'Andrógenos', 'Ovulación'],
      pmid: '28218889'
    },

    // Función tiroidea
    tsh: {
      condition: 'Disfunción Tiroidea',
      diagnostic: 'TSH >2.5 mUI/L en mujeres buscando embarazo',
      treatments: [
        {
          name: 'Levotiroxina',
          priority: 'high',
          successRate: 0.95,
          timeframe: '6-8 semanas',
          reasoning: 'Normalización TSH <2.5 mUI/L crítica para fertilidad',
          dosage: '25-50mcg inicial, ajustar según TSH'
        }
      ],
      monitoring: ['TSH cada 6-8 semanas', 'T4L', 'Anticuerpos tiroideos'],
      pmid: '28218867'
    },

    // Reserva ovárica
    amh: {
      condition: 'Reserva Ovárica Disminuida',
      diagnostic: 'AMH <1.0 ng/mL indica baja reserva',
      treatments: [
        {
          name: 'CoQ10',
          priority: 'medium',
          successRate: 0.40,
          timeframe: '3-6 meses',
          reasoning: 'Mejora calidad ovocitaria y función mitocondrial',
          dosage: '200-600mg ubiquinol/día'
        },
        {
          name: 'DHEA',
          priority: 'medium',
          successRate: 0.35,
          timeframe: '6-16 semanas',
          reasoning: 'Mejora respuesta ovárica en mujeres >35 años',
          dosage: '25mg 3 veces/día'
        },
        {
          name: 'FIV con protocolo antagonista',
          priority: 'high',
          successRate: 0.45,
          timeframe: '1 ciclo',
          reasoning: 'Maximiza utilización de óvulos disponibles',
          details: 'Protocolo mild stimulation recomendado'
        }
      ],
      monitoring: ['AMH anual', 'FSH basal', 'Conteo folículos antrales'],
      pmid: '29935900'
    },

    // Factor masculino
    male: {
      condition: 'Factor Masculino',
      diagnostic: 'OMS 2010: <15M/mL concentración o <32% motilidad',
      treatments: [
        {
          name: 'Antioxidantes',
          priority: 'high',
          successRate: 0.60,
          timeframe: '3 meses',
          reasoning: 'Mejora parámetros seminales y DNA fragmentación',
          components: 'Vitamina C, E, Zinc, Selenio, CoQ10'
        },
        {
          name: 'Estilo de vida',
          priority: 'high',
          successRate: 0.70,
          timeframe: '2-3 meses',
          reasoning: 'Optimización factores modificables',
          details: 'Ejercicio, dieta mediterránea, evitar calor/tabaco'
        },
        {
          name: 'ICSI',
          priority: 'high',
          successRate: 0.85,
          timeframe: '1 ciclo',
          reasoning: 'Técnica de elección para factor masculino severo',
          indication: 'Concentración <5M/mL o motilidad <5%'
        }
      ],
      monitoring: ['Seminograma cada 3 meses', 'Fragmentación DNA', 'Hormonas'],
      pmid: '28218845'
    }
  },

  // 🎯 Análisis por edad reproductiva
  ageAnalysis: {
    under30: {
      approach: 'Optimización natural + seguimiento',
      timeframe: '6-12 meses intento natural',
      priorities: ['Optimización estilo vida', 'Suplementación', 'Monitoreo ovulación']
    },
    age30to35: {
      approach: 'Evaluación temprana + optimización',
      timeframe: '6 meses intento + evaluación',
      priorities: ['Estudio hormonal completo', 'HSG', 'Inducción ovulación si necesario']
    },
    age35to40: {
      approach: 'Evaluación inmediata + tratamiento activo',
      timeframe: '3-6 meses evaluación + TRA',
      priorities: ['AMH urgente', 'Considerar FIV precoz', 'Preservación fertilidad']
    },
    over40: {
      approach: 'FIV inmediata + ovodonación',
      timeframe: 'Inmediato',
      priorities: ['Counseling ovodonación', 'Evaluación riesgos maternos', 'FIV con DGP']
    }
  }
};

export const AIConsultation: React.FC<AIConsultationProps> = ({ 
  evaluation, 
  onRecommendationSelect 
}) => {
  const theme = useDynamicTheme();
  const styles = createStyles(theme);
  
  const [selectedAnalysis, setSelectedAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // 🧠 ANÁLISIS IA INTELIGENTE BASADO EN DATOS
  const medicalAnalysis = useMemo((): MedicalAnalysis => {
    const age = evaluation.userInput?.age || 30;
    const factors = evaluation.factors;
    
    const diagnosticHypotheses: MedicalAnalysis['diagnosticHypotheses'] = [];
    const treatmentRecommendations: MedicalAnalysis['treatmentRecommendations'] = [];
    const lifestyle: MedicalAnalysis['lifestyle'] = [];
    const monitoring: MedicalAnalysis['monitoring'] = [];
    
    // 🔍 Análisis PCOS
    if (factors.pcos && factors.pcos < 0.8) {
      diagnosticHypotheses.push({
        condition: 'Síndrome de Ovarios Poliquísticos (SOP)',
        probability: (1 - factors.pcos) * 100,
        reasoning: 'Patrón compatible con SOP basado en irregularidad menstrual y parámetros hormonales',
        evidenceLevel: 'A',
        pmid: '28218889'
      });
      
      treatmentRecommendations.push({
        treatment: 'Letrozol 2.5-7.5mg (días 3-7 del ciclo)',
        priority: 'high',
        successRate: 85,
        timeframe: '3-6 ciclos',
        reasoning: 'Inhibidor aromatasa primera línea, superior a clomifeno (85% vs 62% ovulación)'
      });

      if (factors.bmi && factors.bmi < 0.7) {
        treatmentRecommendations.push({
          treatment: 'Pérdida de peso estructurada (5-10%)',
          priority: 'high',
          successRate: 80,
          timeframe: '3-6 meses',
          reasoning: 'Pérdida 5-10% peso corporal restaura ovulación en 80% mujeres con SOP'
        });
      }
    }

    // 🔍 Análisis función tiroidea
    if (factors.tsh && factors.tsh < 0.9) {
      diagnosticHypotheses.push({
        condition: 'Disfunción Tiroidea Subclínica',
        probability: (1 - factors.tsh) * 100,
        reasoning: 'TSH elevado >2.5 mUI/L afecta fertilidad y aumenta riesgo aborto',
        evidenceLevel: 'A',
        pmid: '28218867'
      });

      treatmentRecommendations.push({
        treatment: 'Levotiroxina 25-50mcg/día',
        priority: 'high',
        successRate: 95,
        timeframe: '6-8 semanas',
        reasoning: 'Normalización TSH <2.5 mUI/L crítica. Meta: TSH 1.0-2.5 mUI/L'
      });

      monitoring.push({
        parameter: 'TSH sérico',
        frequency: 'Cada 6-8 semanas',
        target: '<2.5 mUI/L'
      });
    }

    // 🔍 Análisis reserva ovárica
    if (factors.amh && factors.amh < 0.6) {
      diagnosticHypotheses.push({
        condition: 'Reserva Ovárica Disminuida',
        probability: (1 - factors.amh) * 100,
        reasoning: 'AMH bajo indica reserva folicular reducida, requiere manejo especializado',
        evidenceLevel: 'A',
        pmid: '29935900'
      });

      if (age < 35) {
        treatmentRecommendations.push({
          treatment: 'CoQ10 200-600mg + DHEA 75mg/día',
          priority: 'medium',
          successRate: 40,
          timeframe: '3-6 meses',
          reasoning: 'Mejora calidad ovocitaria en mujeres jóvenes con baja reserva'
        });
      } else {
        treatmentRecommendations.push({
          treatment: 'FIV con protocolo antagonista',
          priority: 'high',
          successRate: 45,
          timeframe: '1-2 ciclos',
          reasoning: 'Maximiza aprovechamiento óvulos disponibles. Considerar mild stimulation'
        });
      }
    }

    // 🔍 Análisis factor masculino
    if (factors.male && factors.male < 0.7) {
      diagnosticHypotheses.push({
        condition: 'Factor Masculino',
        probability: (1 - factors.male) * 100,
        reasoning: 'Parámetros seminales alterados según criterios OMS 2010',
        evidenceLevel: 'A',
        pmid: '28218845'
      });

      treatmentRecommendations.push({
        treatment: 'Antioxidantes (CoQ10, Vit C, E, Zinc)',
        priority: 'high',
        successRate: 60,
        timeframe: '3 meses',
        reasoning: 'Mejora parámetros seminales y reduce fragmentación DNA espermático'
      });

      if (factors.male < 0.3) {
        treatmentRecommendations.push({
          treatment: 'ICSI (Inyección Intracitoplasmática)',
          priority: 'high',
          successRate: 85,
          timeframe: '1 ciclo FIV',
          reasoning: 'Técnica de elección para factor masculino severo'
        });
      }
    }

    // 🎯 Recomendaciones de estilo de vida
    lifestyle.push({
      category: 'Nutrición',
      recommendations: [
        'Dieta mediterránea rica en antioxidantes',
        'Ácido fólico 400-800mcg/día',
        'Vitamina D 1000-2000 UI/día',
        'Omega-3 1000mg/día'
      ],
      impact: 'high'
    });

    lifestyle.push({
      category: 'Actividad Física',
      recommendations: [
        'Ejercicio moderado 150 min/semana',
        'Yoga o técnicas de relajación',
        'Evitar ejercicio extremo (>7h/semana)'
      ],
      impact: 'medium'
    });

    lifestyle.push({
      category: 'Factores Ambientales',
      recommendations: [
        'Cesación tabáquica completa',
        'Alcohol máximo 1-2 copas/semana',
        'Evitar exposición a tóxicos (BPA, ftalatos)',
        'Manejo del estrés'
      ],
      impact: 'high'
    });

    // 🚨 Nivel de urgencia
    let urgencyLevel: MedicalAnalysis['urgencyLevel'] = 'routine';
    if (age >= 38 || (factors.amh && factors.amh < 0.3)) {
      urgencyLevel = 'urgent';
    } else if (age >= 35 || (factors.amh && factors.amh < 0.5)) {
      urgencyLevel = 'immediate';
    }

    // ⏭️ Próximos pasos
    const nextSteps = [];
    if (diagnosticHypotheses.length > 0) {
      nextSteps.push('Consulta especialista en medicina reproductiva');
    }
    if (treatmentRecommendations.some(t => t.priority === 'high')) {
      nextSteps.push('Inicio tratamiento médico específico');
    }
    nextSteps.push('Seguimiento evolutivo mensual');
    nextSteps.push('Reevaluación en 3-6 meses');

    return {
      diagnosticHypotheses,
      treatmentRecommendations,
      lifestyle,
      monitoring,
      nextSteps,
      urgencyLevel
    };
  }, [evaluation]);

  // 🎨 RENDER COMPONENTES

  const renderDiagnosticHypotheses = () => (
    <Box style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>🔍 Análisis Diagnóstico IA</Text>
      {medicalAnalysis.diagnosticHypotheses.map((hypothesis, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.hypothesisCard,
            selectedAnalysis === hypothesis.condition && styles.selectedCard
          ]}
          onPress={() => setSelectedAnalysis(
            selectedAnalysis === hypothesis.condition ? null : hypothesis.condition
          )}
        >
          <View style={styles.hypothesisHeader}>
            <Text style={styles.conditionName}>{hypothesis.condition}</Text>
            <View style={styles.probabilityBadge}>
              <Text style={styles.probabilityText}>
                {hypothesis.probability.toFixed(0)}%
              </Text>
            </View>
          </View>
          
          <View style={styles.evidenceRow}>
            <View style={[
              styles.evidenceBadge,
              { backgroundColor: getEvidenceColor(hypothesis.evidenceLevel) }
            ]}>
              <Text style={styles.evidenceText}>
                Evidencia {hypothesis.evidenceLevel}
              </Text>
            </View>
            {hypothesis.pmid && (
              <Text style={styles.pmidText}>PMID: {hypothesis.pmid}</Text>
            )}
          </View>
          
          {selectedAnalysis === hypothesis.condition && (
            <View style={styles.reasoningSection}>
              <Text style={styles.reasoningText}>{hypothesis.reasoning}</Text>
            </View>
          )}
        </TouchableOpacity>
      ))}
    </Box>
  );

  const renderTreatmentRecommendations = () => (
    <Box style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>💊 Recomendaciones Terapéuticas</Text>
      {medicalAnalysis.treatmentRecommendations.map((treatment, index) => (
        <TouchableOpacity
          key={index}
          style={styles.treatmentCard}
          onPress={() => onRecommendationSelect?.(treatment.treatment)}
        >
          <View style={styles.treatmentHeader}>
            <Text style={styles.treatmentName}>{treatment.treatment}</Text>
            <View style={[
              styles.priorityBadge,
              { backgroundColor: getPriorityColor(treatment.priority) }
            ]}>
              <Text style={styles.priorityText}>
                {treatment.priority.toUpperCase()}
              </Text>
            </View>
          </View>
          
          <View style={styles.treatmentMetrics}>
            <View style={styles.metric}>
              <Ionicons name="trending-up" size={16} color={theme.colors.success} />
              <Text style={styles.metricText}>{treatment.successRate}% éxito</Text>
            </View>
            <View style={styles.metric}>
              <Ionicons name="time" size={16} color={theme.colors.textSecondary} />
              <Text style={styles.metricText}>{treatment.timeframe}</Text>
            </View>
          </View>
          
          <Text style={styles.reasoningText}>{treatment.reasoning}</Text>
          
          {treatment.contraindications && (
            <View style={styles.contraindicationsSection}>
              <Text style={styles.contraindicationsTitle}>⚠️ Contraindicaciones:</Text>
              {treatment.contraindications.map((contra, idx) => (
                <Text key={idx} style={styles.contraindicationItem}>• {contra}</Text>
              ))}
            </View>
          )}
        </TouchableOpacity>
      ))}
    </Box>
  );

  const renderLifestyleRecommendations = () => (
    <Box style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>🌱 Recomendaciones de Estilo de Vida</Text>
      {medicalAnalysis.lifestyle.map((category, index) => (
        <View key={index} style={styles.lifestyleCategory}>
          <View style={styles.categoryHeader}>
            <Text style={styles.categoryTitle}>{category.category}</Text>
            <View style={[
              styles.impactBadge,
              { backgroundColor: getImpactColor(category.impact) }
            ]}>
              <Text style={styles.impactText}>
                Impacto {category.impact}
              </Text>
            </View>
          </View>
          {category.recommendations.map((rec, idx) => (
            <Text key={idx} style={styles.recommendationItem}>• {rec}</Text>
          ))}
        </View>
      ))}
    </Box>
  );

  const renderUrgencyAlert = () => {
    if (medicalAnalysis.urgencyLevel === 'routine') return null;

    return (
      <Box style={[styles.urgencyAlert, { backgroundColor: getUrgencyColor(medicalAnalysis.urgencyLevel) }]}>
        <View style={styles.urgencyHeader}>
          <Ionicons 
            name={medicalAnalysis.urgencyLevel === 'immediate' ? 'warning' : 'time'} 
            size={24} 
            color={theme.colors.white} 
          />
          <Text style={styles.urgencyTitle}>
            {medicalAnalysis.urgencyLevel === 'immediate' ? 'ACCIÓN INMEDIATA REQUERIDA' : 'ATENCIÓN URGENTE'}
          </Text>
        </View>
        <Text style={styles.urgencyText}>
          {medicalAnalysis.urgencyLevel === 'immediate' 
            ? 'Su edad o reserva ovárica requieren evaluación especializada inmediata'
            : 'Recomendamos consulta especializada en las próximas 2-4 semanas'}
        </Text>
      </Box>
    );
  };

  // 🎨 Funciones auxiliares de color
  const getEvidenceColor = (level: string): string => {
    switch (level) {
      case 'A': return theme.colors.success;
      case 'B': return '#4CAF50';
      case 'C': return theme.colors.warning;
      default: return theme.colors.textSecondary;
    }
  };

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'high': return theme.colors.error;
      case 'medium': return theme.colors.warning;
      default: return theme.colors.textSecondary;
    }
  };

  const getImpactColor = (impact: string): string => {
    switch (impact) {
      case 'high': return theme.colors.success;
      case 'medium': return theme.colors.warning;
      default: return theme.colors.textSecondary;
    }
  };

  const getUrgencyColor = (level: string): string => {
    switch (level) {
      case 'immediate': return '#D32F2F';
      case 'urgent': return '#F57C00';
      default: return theme.colors.primary;
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Box style={styles.headerCard}>
        <View style={styles.aiHeader}>
          <Ionicons name="medical" size={32} color={theme.colors.primary} />
          <View style={styles.aiInfo}>
            <Text style={styles.aiTitle}>Dr. IA Fertilitas</Text>
            <Text style={styles.aiSubtitle}>Análisis médico basado en evidencia científica</Text>
          </View>
        </View>
      </Box>

      {renderUrgencyAlert()}
      {renderDiagnosticHypotheses()}
      {renderTreatmentRecommendations()}
      {renderLifestyleRecommendations()}

      <Box style={styles.nextStepsCard}>
        <Text style={styles.sectionTitle}>⏭️ Próximos Pasos Recomendados</Text>
        {medicalAnalysis.nextSteps.map((step, index) => (
          <View key={index} style={styles.stepItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>{index + 1}</Text>
            </View>
            <Text style={styles.stepText}>{step}</Text>
          </View>
        ))}
      </Box>

      <Box style={styles.disclaimerCard}>
        <Text style={styles.disclaimerTitle}>⚖️ Aviso Médico Legal</Text>
        <Text style={styles.disclaimerText}>
          Esta información es educativa y no reemplaza la consulta médica profesional. 
          Siempre consulte con un especialista en medicina reproductiva antes de tomar decisiones terapéuticas.
        </Text>
      </Box>
    </ScrollView>
  );
};

// 🎨 ESTILOS PROFESIONALES PARA EL AGENTE IA
const createStyles = (theme: ReturnType<typeof useDynamicTheme>) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  // 🤖 HEADER DEL AGENTE IA
  headerCard: {
    margin: 16,
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 16,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiInfo: {
    marginLeft: 16,
    flex: 1,
  },
  aiTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  aiSubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },

  // 🚨 ALERTA DE URGENCIA
  urgencyAlert: {
    margin: 16,
    borderRadius: 12,
    padding: 16,
  },
  urgencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  urgencyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.white,
    marginLeft: 8,
  },
  urgencyText: {
    fontSize: 14,
    color: theme.colors.white,
    lineHeight: 20,
  },

  // 📋 SECCIONES PRINCIPALES
  sectionCard: {
    margin: 16,
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 16,
  },

  // 🔍 HIPÓTESIS DIAGNÓSTICAS
  hypothesisCard: {
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  selectedCard: {
    borderColor: theme.colors.primary,
    borderWidth: 2,
  },
  hypothesisHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  conditionName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    flex: 1,
  },
  probabilityBadge: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  probabilityText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: theme.colors.white,
  },
  evidenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  evidenceBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 8,
  },
  evidenceText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: theme.colors.white,
    textTransform: 'uppercase',
  },
  pmidText: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
  },
  reasoningSection: {
    backgroundColor: theme.colors.surfaceVariant || '#F5F5F5',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  reasoningText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },

  // 💊 RECOMENDACIONES DE TRATAMIENTO
  treatmentCard: {
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  treatmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  treatmentName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    flex: 1,
    marginRight: 8,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: theme.colors.white,
  },
  treatmentMetrics: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  metric: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metricText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginLeft: 4,
  },
  contraindicationsSection: {
    backgroundColor: '#FFF3E0',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  contraindicationsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E65100',
    marginBottom: 8,
  },
  contraindicationItem: {
    fontSize: 13,
    color: '#E65100',
    marginBottom: 4,
    lineHeight: 18,
  },

  // 🌱 ESTILO DE VIDA
  lifestyleCategory: {
    marginBottom: 16,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
  },
  impactBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  impactText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: theme.colors.white,
    textTransform: 'uppercase',
  },
  recommendationItem: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 4,
    lineHeight: 20,
  },

  // ⏭️ PRÓXIMOS PASOS
  nextStepsCard: {
    margin: 16,
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 16,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: theme.colors.white,
  },
  stepText: {
    fontSize: 14,
    color: theme.colors.text,
    flex: 1,
    lineHeight: 20,
  },

  // ⚖️ DISCLAIMER
  disclaimerCard: {
    margin: 16,
    backgroundColor: '#F3E5F5',
    borderRadius: 16,
    padding: 16,
  },
  disclaimerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#7B1FA2',
    marginBottom: 8,
  },
  disclaimerText: {
    fontSize: 13,
    color: '#7B1FA2',
    lineHeight: 18,
    fontStyle: 'italic',
  },
});
