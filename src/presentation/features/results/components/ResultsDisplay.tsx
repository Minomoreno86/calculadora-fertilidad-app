/**
 * 🚀 RESULTS DISPLAY MEJORADO - VERSIÓN PROFESIONAL
 * 
 * Sistema completo de análisis de fertilidad con IA médica integrada
 * y capacidades avanzadas de simulación y recomendaciones clínicas.
 */

import { clinicalContentLibrary } from '@/core/domain/logic/clinicalContentLibrary';
import { EvaluationState } from '@/core/domain/models';
import { useDynamicTheme } from '@/hooks/useDynamicTheme';
import { EnhancedInfoCard } from '@/presentation/components/common';
import Text from '@/presentation/components/common/Text';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import AIConsultation from '../../ai-medical-agent/AIConsultation';
import { SimulatorDashboard } from '../../simulator/components/SimulatorDashboard';
import { useFertilitySimulator } from '../../simulator/useFertilitySimulator';

// Remover línea no usada del width
// const { width } = Dimensions.get('window');

interface ResultsDisplayProps {
  evaluation: EvaluationState;
  treatmentSuggestions?: unknown; // Deprecated - usando AI Medical Agent
  isPremiumReport?: boolean;
}

type DisplayMode = 'overview' | 'detailed' | 'simulator' | 'ai-consultation';

interface FactorAnalysis {
  name: string;
  value: number;
  status: 'optimal' | 'good' | 'attention' | 'critical';
  impact: 'low' | 'medium' | 'high' | 'critical';
  recommendation: string;
  evidence: string;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ 
  evaluation, 
  treatmentSuggestions: _treatmentSuggestions = [], 
  isPremiumReport: _isPremiumReport = false 
}) => {
  const theme = useDynamicTheme();
  const styles = createStyles(theme);
  
  const [displayMode, setDisplayMode] = useState<DisplayMode>('overview');
  const [selectedFactor, setSelectedFactor] = useState<string | null>(null);
  
  const { simulationResult } = useFertilitySimulator(evaluation);
  const { report, factors } = evaluation;

  // 🎯 ANÁLISIS AVANZADO DE FACTORES CON RECOMENDACIONES MÉDICAS ESPECÍFICAS
  const factorAnalysis = useMemo((): FactorAnalysis[] => {
    if (!factors) return [];
    
    const analysisMap: Record<string, Omit<FactorAnalysis, 'value'>> = {
      baseAgeProbability: {
        name: 'Factor Edad',
        status: 'optimal',
        impact: 'critical',
        recommendation: 'Evaluar otros factores compensatorios según edad reproductiva',
        evidence: 'La edad es el factor predictivo más importante en fertilidad'
      },
      bmi: {
        name: 'Índice de Masa Corporal',
        status: 'good',
        impact: 'medium',
        recommendation: 'Mantener IMC 18.5-24.9 kg/m². Pérdida del 5-10% mejora fertilidad significativamente',
        evidence: 'IMC alterado afecta ovulación, implantación y aumenta riesgo de aborto'
      },
      amh: {
        name: 'Reserva Ovárica (AMH)',
        status: 'attention',
        impact: 'critical',
        recommendation: 'Si AMH < 1.0 ng/mL: consulta especialista urgente. Considerar FIV precoz',
        evidence: 'AMH predice respuesta ovárica y tiempo hasta menopausia'
      },
      myoma: {
        name: 'Miomatosis Uterina',
        status: 'good',
        impact: 'medium',
        recommendation: 'Miomas submucosos: miomectomía histeroscópica. Intramuralares >4cm: valorar resección',
        evidence: 'Miomas submucosos reducen implantación 50% y duplican abortos'
      },
      polyp: {
        name: 'Pólipos Endometriales',
        status: 'good',
        impact: 'medium',
        recommendation: 'Polipectomía histeroscópica para pólipos >1cm o múltiples',
        evidence: 'Pólipos interfieren mecánicamente con implantación'
      },
      adenomyosis: {
        name: 'Adenomiosis',
        status: 'good',
        impact: 'high',
        recommendation: 'Adenomiosis difusa: protocolo largo GnRH 2 meses antes de FIV',
        evidence: 'Reduce implantación 28% y aumenta aborto 89%'
      },
      endometriosis: {
        name: 'Endometriosis',
        status: 'good',
        impact: 'high',
        recommendation: 'Grados I-II: 6 meses intento. Grados III-IV: FIV directa. No retrasar >35 años',
        evidence: 'Reduce calidad ovocitaria y receptividad endometrial'
      },
      cycle: {
        name: 'Regularidad Menstrual',
        status: 'good',
        impact: 'high',
        recommendation: 'Ciclos irregulares: estudio hormonal (TSH, prolactina, andrógenos, AMH)',
        evidence: 'Ciclos irregulares indican anovulación en 85% de casos'
      },
      pcos: {
        name: 'Síndrome de Ovarios Poliquísticos',
        status: 'attention',
        impact: 'high',
        recommendation: 'Letrozol 2.5-7.5mg primera línea. Metformina si HOMA-IR >2.5. Pérdida de peso crítica',
        evidence: 'Causa 70% anovulación. Letrozol 22% más efectivo que clomifeno'
      },
      tsh: {
        name: 'Función Tiroidea (TSH)',
        status: 'optimal',
        impact: 'medium',
        recommendation: 'Meta: TSH <2.5 mUI/L. Levotiroxina 25-50mcg si >2.5. Control cada 6-8 semanas',
        evidence: 'TSH >2.5 aumenta aborto 69% y anovulación'
      },
      prolactin: {
        name: 'Prolactina Sérica',
        status: 'good',
        impact: 'medium',
        recommendation: 'Prolactina >25 ng/mL: cabergolina 0.25mg 2x/semana. Descartar adenoma',
        evidence: 'Hiperprolactinemia inhibe GnRH y causa anovulación'
      },
      homa: {
        name: 'Resistencia a la Insulina (HOMA-IR)',
        status: 'good',
        impact: 'medium',
        recommendation: 'HOMA-IR >2.5: metformina 1500-2000mg + dieta <100g carbohidratos/día',
        evidence: 'Resistencia insulínica altera calidad ovocitaria 40%'
      },
      male: {
        name: 'Factor Masculino',
        status: 'good',
        impact: 'high',
        recommendation: 'REM <5M/mL: andrología. Antioxidantes: CoQ10 200mg, Vit E 400UI, Zinc 15mg',
        evidence: 'Factor masculino presente en 40-50% casos infertilidad'
      },
      hsg: {
        name: 'Histerosalpingografía',
        status: 'good',
        impact: 'high',
        recommendation: 'Obstrucción unilateral: considerar salpingostomía. Bilateral: FIV directa',
        evidence: 'Factor tubárico presente en 25-35% casos infertilidad'
      },
      otb: {
        name: 'Obstrucción Tubárica Bilateral',
        status: 'good',
        impact: 'critical',
        recommendation: 'OTB confirmada: FIV como única opción terapéutica. Valorar reparación si <35 años',
        evidence: 'OTB bilateral contraindica concepción natural'
      },
      infertilityDuration: {
        name: 'Duración de la Infertilidad',
        status: 'good',
        impact: 'medium',
        recommendation: '<2 años: continuar intento. >2 años: tratamientos. >4 años: considerar FIV directa',
        evidence: 'Duración >2 años reduce probabilidad espontánea <5% anual'
      },
      pelvicSurgery: {
        name: 'Cirugías Pélvicas Previas',
        status: 'good',
        impact: 'medium',
        recommendation: 'Múltiples cirugías: evaluar adherencias. HSG + eco-Doppler. Considerar laparoscopia',
        evidence: 'Cirugías múltiples aumentan adherencias y disfunción tubárica'
      }
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
          value: numericValue,
          status
        };
      })
      .filter(Boolean) as FactorAnalysis[];
  }, [factors]);

  // 🎨 COLOR DINÁMICO PARA CATEGORÍA GENERAL
  const getCategoryColor = () => {
    switch (report?.category) {
      case 'BUENO': return theme.colors.success;
      case 'MODERADO': return theme.colors.warning;
      case 'BAJO': return theme.colors.error;
      default: return theme.colors.textSecondary;
    }
  };

  // 🎯 MÉTRICAS CLAVE
  const keyMetrics = useMemo(() => {
    const criticalFactors = factorAnalysis.filter(f => f.status === 'critical').length;
    const attentionFactors = factorAnalysis.filter(f => f.status === 'attention').length;
    const optimalFactors = factorAnalysis.filter(f => f.status === 'optimal').length;
    const totalFactors = factorAnalysis.length;
    
    return {
      overallScore: report?.numericPrognosis || 0,
      criticalFactors,
      attentionFactors,
      optimalFactors,
      totalFactors,
      improvementPotential: simulationResult?.improvement || 0
    };
  }, [factorAnalysis, report, simulationResult]);

  // 📊 RENDERIZAR HEADER LIMPIO
  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.cleanHeader}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>
            Análisis de Fertilidad
          </Text>
          <View style={styles.probabilityContainer}>
            <Text style={styles.probabilityNumber}>
              {keyMetrics.overallScore.toFixed(1)}%
            </Text>
          </View>
          <View style={styles.statusIndicator}>
            <View style={[styles.statusCircle, { backgroundColor: getCategoryColor() }]} />
            <Text style={styles.statusText}>
              {report?.category || 'ANÁLISIS'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  // 📈 RENDERIZAR RESUMEN ELEGANTE - DISEÑO MÉDICO PROFESIONAL
  const renderKeyMetrics = () => (
    <View style={styles.metricsContainer}>
      <Text style={styles.sectionTitle}>🩺 Tu Perfil de Fertilidad</Text>
      
      {/* 🎯 ESTADO PRINCIPAL */}
      <View style={styles.mainStatusCard}>
        <View style={styles.statusIconSection}>
          <View style={[styles.statusIndicatorLarge, { backgroundColor: getCategoryColor() }]} />
          <Text style={styles.statusLabel}>{report?.category || 'ANÁLISIS'}</Text>
        </View>
        <View style={styles.statusDescriptionSection}>
          <Text style={styles.statusTitle}>Estado General</Text>
          <Text style={styles.statusDescription}>
            {report?.category === 'BUENO' && 'Perfil reproductivo favorable con buenas posibilidades naturales'}
            {report?.category === 'MODERADO' && 'Perfil con oportunidades de optimización específicas'}
            {report?.category === 'BAJO' && 'Requiere evaluación y seguimiento especializado urgente'}
          </Text>
        </View>
      </View>

      {/* 🎨 INDICADORES VISUALES DE FACTORES */}
      <View style={styles.factorsOverview}>
        <Text style={styles.factorsTitle}>Distribución de Factores Analizados</Text>
        <View style={styles.factorsGrid}>
          <View style={styles.factorIndicator}>
            <View style={[styles.factorCircle, { backgroundColor: theme.colors.success }]} />
            <Text style={styles.factorNumber}>{keyMetrics.optimalFactors}</Text>
            <Text style={styles.factorText}>Óptimos</Text>
          </View>
          
          {keyMetrics.attentionFactors > 0 && (
            <View style={styles.factorIndicator}>
              <View style={[styles.factorCircle, { backgroundColor: theme.colors.warning }]} />
              <Text style={styles.factorNumber}>{keyMetrics.attentionFactors}</Text>
              <Text style={styles.factorText}>Atención</Text>
            </View>
          )}
          
          {keyMetrics.criticalFactors > 0 && (
            <View style={styles.factorIndicator}>
              <View style={[styles.factorCircle, { backgroundColor: theme.colors.error }]} />
              <Text style={styles.factorNumber}>{keyMetrics.criticalFactors}</Text>
              <Text style={styles.factorText}>Críticos</Text>
            </View>
          )}
        </View>
      </View>

      {/* 🚀 MENSAJE DE ACCIÓN */}
      <View style={styles.actionCard}>
        <Ionicons name="medical" size={24} color={theme.colors.primary} />
        <View style={styles.actionContent}>
          <Text style={styles.actionTitle}>Próximos Pasos Recomendados</Text>
          <Text style={styles.actionDescription}>
            {getActionMessage()}
          </Text>
        </View>
      </View>
    </View>
  );

  // 🎯 FUNCIÓN HELPER PARA MENSAJE DE ACCIÓN
  const getActionMessage = (): string => {
    if (keyMetrics.criticalFactors > 0) {
      return "Consulta con especialista en fertilidad recomendada urgentemente";
    }
    if (keyMetrics.attentionFactors > 0) {
      return "Optimización de factores específicos puede mejorar significativamente tus posibilidades";
    }
    return "Mantén tu buen estado reproductivo con seguimiento regular";
  };

  // 🎯 FUNCIÓN PARA OBTENER INFORMACIÓN CLÍNICA ESPECÍFICA
  const getClinicalInfo = (factorKey: string, _value: number) => {
    // Mapear factores a claves de la librería clínica
    const keyMappings: Record<string, string> = {
      'baseAgeProbability': getAgeCategory(evaluation.factors?.baseAgeProbability || 0),
      'bmi': getBMICategory(evaluation.factors?.bmi || 0.8),
      'amh': getAMHCategory(evaluation.factors?.amh || 0.8),
      'myoma': getMiomaCategory(evaluation.factors?.myoma || 1),
      'polyp': getPolipoCategory(evaluation.factors?.polyp || 1),
      'adenomyosis': getAdenomiosisCategory(evaluation.factors?.adenomyosis || 1),
      'endometriosis': getEndometriosisCategory(evaluation.factors?.endometriosis || 1),
      'cycle': getCicloCategory(evaluation.factors?.cycle || 1),
      'pcos': getSOPCategory(evaluation.factors?.pcos || 1),
      'tsh': getTSHCategory(evaluation.factors?.tsh || 1),
      'prolactin': getProlactinCategory(evaluation.factors?.prolactin || 1),
      'homa': getHOMACategory(evaluation.factors?.homa || 1),
      'male': getMaleFactorCategory(evaluation.factors?.male || 1),
      'hsg': getHSGCategory(evaluation.factors?.hsg || 1),
      'otb': getOTBCategory(evaluation.factors?.otb || 1),
      'infertilityDuration': getInfertilityDurationCategory(evaluation.factors?.infertilityDuration || 1),
      'pelvicSurgery': getPelvicSurgeryCategory(evaluation.factors?.pelvicSurgery || 1),
    };

    const clinicalKey = keyMappings[factorKey];
    
    // Si la clave clínica existe en la biblioteca, usarla
    if (clinicalKey && clinicalContentLibrary[clinicalKey]) {
      return clinicalContentLibrary[clinicalKey];
    }
    
    // Categorías por defecto para factores sin información clínica específica
    const defaultInfo = getDefaultClinicalInfo(factorKey, evaluation.factors?.[factorKey as keyof typeof evaluation.factors] || 0.8);
    return defaultInfo;
  };

  // 🏥 INFORMACIÓN MÉDICA POR DEFECTO PARA FACTORES SIN CATEGORÍA ESPECÍFICA
  const getDefaultClinicalInfo = (factorKey: string, factorValue: number): { explanation: string; recommendations: string[]; sources?: string[] } | null => {
    const infoGenerators: Record<string, (value: number) => { explanation: string; recommendations: string[]; sources?: string[] }> = {
      'male': getMaleFactorInfo,
      'cycle': getCycleInfo,
      'bmi': getBMIInfo
    };

    const generator = infoGenerators[factorKey];
    return generator ? generator(factorValue) : null;
  };

  // 🏥 FUNCIONES ESPECÍFICAS PARA CADA FACTOR
  const getMaleFactorInfo = (factorValue: number): { explanation: string; recommendations: string[]; sources?: string[] } => {
    const getExplanation = (value: number): string => {
      if (value >= 0.9) return 'Los parámetros seminales están dentro de rangos normales según WHO 2010.';
      if (value >= 0.7) return 'Se detectan alteraciones leves en parámetros seminales que pueden afectar la fertilidad.';
      if (value >= 0.5) return 'Se detectan alteraciones moderadas en parámetros seminales que impactan significativamente la fertilidad.';
      return 'Se detectan alteraciones severas en parámetros seminales que requieren evaluación andrológica urgente.';
    };

    const getRecommendations = (value: number): string[] => {
      if (value >= 0.9) return ['Mantener estilo de vida saludable', 'Evitar factores de riesgo (tabaco, calor excesivo)'];
      if (value >= 0.7) return ['Antioxidantes: CoQ10 200mg/día, Vitamina E 400UI', 'Evaluación andrológica si persiste'];
      if (value >= 0.5) return ['Evaluación andrológica especializada urgente', 'Considerar técnicas de reproducción asistida'];
      return ['Evaluación andrológica urgente', 'ICSI como técnica de elección en FIV'];
    };

    return {
      explanation: getExplanation(factorValue),
      recommendations: getRecommendations(factorValue),
      sources: ['WHO Laboratory Manual (5th edition)', 'Cooper TG et al. Hum Reprod Update 2010']
    };
  };

  const getCycleInfo = (factorValue: number): { explanation: string; recommendations: string[]; sources?: string[] } => {
    const getExplanation = (value: number): string => {
      if (value >= 0.9) return 'Tienes ciclos menstruales regulares, lo que indica ovulación predecible mensual.';
      if (value >= 0.7) return 'Presentas irregularidades menstruales leves que pueden indicar disfunción ovulatoria esporádica.';
      return 'Tienes ciclos menstruales muy irregulares que sugieren anovulación crónica.';
    };

    const getRecommendations = (value: number): string[] => {
      if (value >= 0.9) return ['Continuar monitoreando ciclo natural', 'Identificar ventana fértil con test ovulación'];
      if (value >= 0.7) return ['Estudio hormonal: TSH, prolactina, AMH, andrógenos', 'Considerar inducción ovulatoria'];
      return ['Estudio hormonal completo urgente', 'Inducción ovulatoria con letrozol o gonadotropinas'];
    };

    return {
      explanation: getExplanation(factorValue),
      recommendations: getRecommendations(factorValue),
      sources: ['ASRM Practice Guidelines 2019', 'ESHRE/ASRM Consensus 2018']
    };
  };

  const getBMIInfo = (factorValue: number): { explanation: string; recommendations: string[]; sources?: string[] } => {
    const getExplanation = (value: number): string => {
      if (value >= 0.9) return 'Tu IMC se encuentra en rango normal (18.5-24.9 kg/m²), lo cual es óptimo para fertilidad.';
      if (value >= 0.7) return 'Tu IMC indica sobrepeso (25-29.9 kg/m²), lo cual puede afectar la ovulación y respuesta a tratamientos.';
      if (value >= 0.5) return 'Tu IMC indica obesidad clase I-II (30-39.9 kg/m²), impactando significativamente la fertilidad.';
      return 'Tu IMC indica obesidad severa (≥40 kg/m²) o bajo peso (<18.5), requiriendo intervención urgente.';
    };

    const getRecommendations = (value: number): string[] => {
      if (value >= 0.9) return ['Mantener peso actual con dieta equilibrada', 'Ejercicio regular 150 min/semana'];
      if (value >= 0.7) return ['Pérdida de peso objetivo: 5-10% del peso actual', 'Dieta hipocalórica + ejercicio estructurado'];
      if (value >= 0.5) return ['Pérdida de peso ≥10% antes de tratamientos', 'Seguimiento nutricional especializado'];
      return ['Intervención médica urgente: endocrinología/nutrición', 'Considerar cirugía bariátrica si IMC >40'];
    };

    return {
      explanation: getExplanation(factorValue),
      recommendations: getRecommendations(factorValue),
      sources: ['ASRM Practice Guidelines 2015', 'Cochrane Review 2017']
    };
  };

  // 🏥 FUNCIONES PARA DETERMINAR CATEGORÍAS CLÍNICAS
  const getAgeCategory = (ageFactor: number): string => {
    if (ageFactor >= 0.9) return 'EDAD_OPT';
    if (ageFactor >= 0.7) return 'EDAD_LIG_RED';
    if (ageFactor >= 0.5) return 'EDAD_MOD_RED';
    if (ageFactor >= 0.3) return 'EDAD_ALTO_RIESGO';
    if (ageFactor >= 0.1) return 'EDAD_MUY_ALTO_RIESGO';
    return 'EDAD_CRITICA';
  };

  const getBMICategory = (bmiFactor: number): string => {
    if (bmiFactor >= 0.9) return 'IMC_NORMAL';
    if (bmiFactor >= 0.7) return 'IMC_SOBREPESO';
    if (bmiFactor >= 0.5) return 'IMC_OBESIDAD_I';
    if (bmiFactor >= 0.3) return 'IMC_OBESIDAD_II';
    if (bmiFactor >= 0.1) return 'IMC_OBESIDAD_III';
    return 'IMC_BAJO';
  };

  const getAMHCategory = (amhFactor: number): string => {
    if (amhFactor >= 1.2) return 'AMH_ALTA_RESERVA';
    if (amhFactor >= 0.8) return 'AMH_NORMAL';
    if (amhFactor >= 0.6) return 'AMH_LIG_REDUCIDA';
    if (amhFactor >= 0.4) return 'AMH_BAJA';
    return 'AMH_MUY_BAJA';
  };

  const getMiomaCategory = (miomaFactor: number): string => {
    if (miomaFactor >= 0.95) return 'MIOMA_AUSENTE';
    if (miomaFactor >= 0.8) return 'MIOMA_SUBSEROSO';
    if (miomaFactor >= 0.6) return 'MIOMA_INTRAMURAL_GRANDE';
    return 'MIOMA_SUBMUCOSO';
  };

  const getPolipoCategory = (polipoFactor: number): string => {
    if (polipoFactor >= 0.95) return 'POLIPO_AUSENTE';
    if (polipoFactor >= 0.8) return 'POLIPO_PEQUENO';
    if (polipoFactor >= 0.6) return 'POLIPO_GRANDE';
    return 'POLIPO_OSTIUM';
  };

  const getAdenomiosisCategory = (adenomiosisFactor: number): string => {
    if (adenomiosisFactor >= 0.95) return 'ADENOMIOSIS_AUSENTE';
    if (adenomiosisFactor >= 0.7) return 'ADENOMIOSIS_FOCAL';
    return 'ADENOMIOSIS_DIFUSA';
  };

  const getEndometriosisCategory = (endometriosisFactor: number): string => {
    if (endometriosisFactor >= 0.95) return 'ENDOMETRIOSIS_AUSENTE';
    if (endometriosisFactor >= 0.7) return 'ENDOMETRIOSIS_LEVE';
    return 'ENDOMETRIOSIS_SEVERA';
  };

  const getCicloCategory = (cicloFactor: number): string => {
    if (cicloFactor >= 0.9) return 'CICLO_REGULAR';
    if (cicloFactor >= 0.7) return 'CICLO_IRREGULAR_LEVE';
    return 'CICLO_IRREGULAR_MARCADO';
  };

  const getSOPCategory = (sopFactor: number): string => {
    if (sopFactor >= 0.95) return 'SOP_AUSENTE';
    if (sopFactor >= 0.8) return 'SOP_LEVE';
    if (sopFactor >= 0.6) return 'SOP_MODERADO';
    return 'SOP_SEVERO';
  };

  const getTSHCategory = (tshFactor: number): string => {
    if (tshFactor >= 0.9) return 'TSH_OPTIMA';
    if (tshFactor >= 0.7) return 'TSH_LIMITE_SUPERIOR';
    return 'TSH_HIPOTIROIDISMO';
  };

  const getProlactinCategory = (prolactinFactor: number): string => {
    if (prolactinFactor >= 0.9) return 'PRL_NORMAL';
    if (prolactinFactor >= 0.7) return 'PRL_LEVE';
    return 'PRL_SIGNIFICATIVA';
  };

  const getHOMACategory = (homaFactor: number): string => {
    if (homaFactor >= 0.9) return 'HOMA_NORMAL';
    if (homaFactor >= 0.7) return 'HOMA_LEVE';
    return 'HOMA_SIGNIFICATIVA';
  };

  const getMaleFactorCategory = (maleFactor: number): string => {
    // Usar categorías por defecto ya que no están en la biblioteca clínica
    if (maleFactor >= 0.9) return 'DEFAULT_MALE_NORMAL';
    if (maleFactor >= 0.7) return 'DEFAULT_MALE_MILD';
    if (maleFactor >= 0.5) return 'DEFAULT_MALE_MODERATE';
    return 'DEFAULT_MALE_SEVERE';
  };

  // 🏥 CATEGORÍAS ADICIONALES PARA TODAS LAS VARIABLES
  const getHSGCategory = (hsgFactor: number): string => {
    if (hsgFactor >= 0.95) return 'HSG_NORMAL';
    if (hsgFactor >= 0.8) return 'HSG_UNILATERAL';
    if (hsgFactor >= 0.5) return 'HSG_BILATERAL';
    if (hsgFactor >= 0.3) return 'HSG_MALFORMACION';
    return 'HSG_DESCONOCIDO';
  };

  const getOTBCategory = (otbFactor: number): string => {
    if (otbFactor >= 0.95) return 'OTB_AUSENTE';
    return 'OTB_PRESENTE';
  };

  const getInfertilityDurationCategory = (durationFactor: number): string => {
    if (durationFactor >= 0.8) return 'INFERTILIDAD_CORTA';
    if (durationFactor >= 0.6) return 'INFERTILIDAD_MODERADA';
    return 'INFERTILIDAD_PROLONGADA';
  };

  const getPelvicSurgeryCategory = (surgeryFactor: number): string => {
    if (surgeryFactor >= 0.9) return 'CIRUGIA_PELVICA_NINGUNA';
    if (surgeryFactor >= 0.7) return 'CIRUGIA_PELVICA_UNA';
    return 'CIRUGIA_PELVICA_MULTIPLE';
  };

  // 🎯 SISTEMA DE COLORES Y ETIQUETAS POR ESTADO CLÍNICO
  const getFactorStatusColor = (value: number): string => {
    // 🟢 Verde (Óptimo): >= 0.85
    if (value >= 0.85) return theme.colors.success;
    
    // 🟠 Naranja (Alterado/Moderado): 0.6 - 0.84
    if (value >= 0.6) return '#FF9500'; // Naranja profesional
    
    // 🔴 Rojo (Crítico): < 0.6
    return theme.colors.error;
  };

  const getFactorStatusLabel = (value: number): string => {
    // 🟢 Verde (Óptimo): >= 0.85
    if (value >= 0.85) return 'ÓPTIMO';
    
    // 🟠 Naranja (Alterado/Moderado): 0.6 - 0.84
    if (value >= 0.6) return 'MODERADO';
    
    // 🔴 Rojo (Crítico): < 0.6
    return 'CRÍTICO';
  };



  // 🎯 RENDERIZAR ANÁLISIS DETALLADO CON INFORMACIÓN CLÍNICA
  const renderDetailedAnalysis = () => (
    <View style={styles.analysisContainer}>
      <Text style={styles.sectionTitle}>🔍 Análisis Detallado con Evidencia Médica</Text>
      {factorAnalysis.map((factor) => {
        const clinicalInfo = getClinicalInfo(factor.name, factor.value);
        const statusColor = getFactorStatusColor(factor.value);
        const statusLabel = getFactorStatusLabel(factor.value);
        
        return (
          <TouchableOpacity
            key={factor.name}
            style={styles.factorCard}
            onPress={() => setSelectedFactor(selectedFactor === factor.name ? null : factor.name)}
          >
            <View style={styles.factorHeader}>
              <View style={styles.factorInfo}>
                <Text style={styles.factorName}>{factor.name}</Text>
                <Text style={styles.factorValue}>
                  {(factor.value * 100).toFixed(1)}%
                </Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
                <Text style={styles.statusBadgeText}>{statusLabel}</Text>
              </View>
            </View>
            
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${factor.value * 100}%`,
                    backgroundColor: statusColor
                  }
                ]} 
              />
            </View>
            
            {selectedFactor === factor.name && (
              <View style={styles.factorDetails}>
                {clinicalInfo ? (
                  <>
                    <View style={styles.clinicalExplanation}>
                      <Text style={styles.clinicalTitle}>📋 Explicación Médica</Text>
                      <Text style={styles.clinicalText}>{clinicalInfo.explanation}</Text>
                    </View>
                    
                    <View style={styles.clinicalRecommendations}>
                      <Text style={styles.clinicalTitle}>💡 Recomendaciones Clínicas</Text>
                      {clinicalInfo.recommendations.map((rec) => (
                        <Text key={rec} style={styles.recommendationItem}>• {rec}</Text>
                      ))}
                    </View>
                    
                    {clinicalInfo.sources && (
                      <View style={styles.clinicalSources}>
                        <Text style={styles.clinicalTitle}>📚 Referencias Científicas</Text>
                        {clinicalInfo.sources.map((source) => (
                          <Text key={source} style={styles.sourceItem}>{source}</Text>
                        ))}
                      </View>
                    )}
                  </>
                ) : (
                  <View style={styles.defaultFactorInfo}>
                    <Text style={styles.factorRecommendation}>
                      💡 {factor.recommendation}
                    </Text>
                    <Text style={styles.factorEvidence}>
                      📚 {factor.evidence}
                    </Text>
                  </View>
                )}
                
                  <View style={styles.medicalNote}>
                    <Text style={styles.medicalNoteText}>
                      ℹ️ Para herramientas de simulación y mejora, utiliza la pestaña Simulador
                    </Text>
                  </View>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );

  // 📋 RENDERIZAR TABS LIMPIOS
  const renderTabs = () => (
    <View style={styles.tabsContainer}>
      {[
        { key: 'overview', label: 'Resumen', icon: 'analytics' },
        { key: 'detailed', label: 'Detallado', icon: 'list' },
        { key: 'simulator', label: 'Simulador', icon: 'rocket' },
        { key: 'ai-consultation', label: 'Dr. IA', icon: 'medical' }
      ].map((tab) => (
        <TouchableOpacity
          key={tab.key}
          style={[
            styles.tab,
            displayMode === tab.key && styles.activeTab
          ]}
          onPress={() => setDisplayMode(tab.key as DisplayMode)}
        >
          <Text style={[
            styles.tabLabel,
            displayMode === tab.key && styles.activeTabLabel
          ]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  // 🤖 RENDERIZAR APARTADO DEL DR. IA - DEDICADO Y PROMINENTE
  const renderDrIASection = () => (
    <View style={styles.drIASection}>
      <Text style={styles.drIATitle}>🤖 Dr. IA Fertilitas - Tu Especialista Virtual</Text>
      
      <View style={styles.drIACard}>
        <View style={styles.drIAHeader}>
          <View style={styles.drIAAvatar}>
            <Ionicons name="medical" size={32} color={theme.colors.surface} />
          </View>
          <View style={styles.drIAInfo}>
            <Text style={styles.drIAName}>Dr. IA Especialista</Text>
            <Text style={styles.drIASpecialty}>Medicina Reproductiva y Fertilidad</Text>
            <Text style={styles.drIACapabilities}>
              ✅ Análisis de 15+ patologías • ✅ 20+ protocolos de tratamiento • ✅ Evidencia científica
            </Text>
          </View>
        </View>
        
        <View style={styles.drIAFeatures}>
          <View style={styles.drIAFeature}>
            <Ionicons name="analytics" size={20} color={theme.colors.primary} />
            <Text style={styles.drIAFeatureText}>Análisis médico inteligente personalizado</Text>
          </View>
          <View style={styles.drIAFeature}>
            <Ionicons name="chatbox" size={20} color={theme.colors.primary} />
            <Text style={styles.drIAFeatureText}>Consulta interactiva 24/7 especializada</Text>
          </View>
          <View style={styles.drIAFeature}>
            <Ionicons name="library" size={20} color={theme.colors.primary} />
            <Text style={styles.drIAFeatureText}>Recomendaciones basadas en evidencia</Text>
          </View>
        </View>
        
        <TouchableOpacity
          style={styles.drIAConsultButton}
          onPress={() => setDisplayMode('ai-consultation')}
        >
          <Ionicons name="medical" size={24} color={theme.colors.surface} />
          <Text style={styles.drIAConsultButtonText}>Consultar con Dr. IA</Text>
          <Ionicons name="arrow-forward" size={20} color={theme.colors.surface} />
        </TouchableOpacity>
      </View>
    </View>
  );

  // 🎯 RENDERIZAR CONTENIDO SEGÚN MODO
  const renderContent = () => {
    switch (displayMode) {
      case 'overview':
        return (
          <>
            {renderKeyMetrics()}
            {renderDrIASection()}
            {!!report?.prognosisPhrase && (
              <EnhancedInfoCard
                type="info"
                title="Pronóstico Personalizado"
                message={report.prognosisPhrase}
              />
            )}
            {!!report?.benchmarkPhrase && (
              <EnhancedInfoCard
                type="success"
                title="Comparación Clínica"
                message={report.benchmarkPhrase}
              />
            )}
          </>
        );
      
      case 'detailed':
        return renderDetailedAnalysis();
      
      case 'simulator':
        return (
          <SimulatorDashboard 
            evaluation={evaluation} 
            onModeChange={(mode) => console.log('Mode changed:', mode)} 
          />
        );
      
      case 'ai-consultation':
        return (
          <AIConsultation 
            evaluation={evaluation}
            onRecommendationSelect={(recommendation: unknown) => {
              console.log('🤖 AI Recommendation selected:', recommendation);
            }}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {renderHeader()}
      {renderTabs()}
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {renderContent()}
      </ScrollView>
    </View>
  );
};

// 🎨 ESTILOS DINÁMICOS
const createStyles = (theme: ReturnType<typeof useDynamicTheme>) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  headerContainer: {
    marginBottom: 20,
  },
  cleanHeader: {
    backgroundColor: 'white',
    borderRadius: 20,
    margin: 16,
    marginBottom: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  headerContent: {
    padding: 32,
    alignItems: 'center',
    minHeight: 180,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 20,
  },
  probabilityContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  probabilityNumber: {
    fontSize: 56,
    fontWeight: 'bold',
    color: theme.colors.text,
    textAlign: 'center',
    lineHeight: 64,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 10,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 16,
    padding: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 12,
    minHeight: 50,
  },
  activeTab: {
    backgroundColor: theme.colors.background,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    fontWeight: '500',
  },
  activeTabLabel: {
    color: theme.colors.primary,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  metricsContainer: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 20,
  },
  // 🎯 ESTILOS PARA EL NUEVO DISEÑO MÉDICO PROFESIONAL
  mainStatusCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 20,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  statusIconSection: {
    alignItems: 'center',
    marginRight: 20,
  },
  statusDescriptionSection: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 6,
  },
  factorsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 16,
  },
  factorCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginBottom: 8,
  },
  factorNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  actionCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionContent: {
    flex: 1,
    marginLeft: 12,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  // 🏥 ESTILOS PARA INFORMACIÓN CLÍNICA
  clinicalExplanation: {
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  clinicalRecommendations: {
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  clinicalSources: {
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  clinicalTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.primary,
    marginBottom: 8,
  },
  clinicalText: {
    fontSize: 14,
    color: theme.colors.text,
    lineHeight: 20,
  },
  recommendationItem: {
    fontSize: 14,
    color: theme.colors.text,
    lineHeight: 20,
    marginBottom: 4,
  },
  sourceItem: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    lineHeight: 18,
    marginBottom: 2,
    fontStyle: 'italic',
  },
  // 🏥 ESTILOS ADICIONALES PARA INFORMACIÓN MÉDICA
  defaultFactorInfo: {
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  medicalNote: {
    backgroundColor: theme.colors.background,
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.primary,
    marginTop: 8,
  },
  medicalNoteText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  scoreUnit: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontWeight: '400',
  },
  scoreDivider: {
    width: 1,
    height: 60,
    backgroundColor: theme.colors.border,
    marginHorizontal: 20,
  },
  statusSection: {
    flex: 1,
    alignItems: 'center',
  },
  statusIndicatorLarge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginBottom: 8,
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 4,
  },
  statusDescription: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
  },
  factorsOverview: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  factorsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 16,
  },
  factorsRow: {
    gap: 12,
  },
  factorIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  factorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  factorText: {
    fontSize: 14,
    color: theme.colors.text,
    fontWeight: '500',
  },
  improvementCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  improvementContent: {
    flex: 1,
    marginLeft: 12,
  },
  improvementTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 2,
  },
  improvementValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 2,
  },
  improvementDescription: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    lineHeight: 16,
  },
  analysisContainer: {
    marginBottom: 32,
  },
  factorCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  factorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  factorInfo: {
    flex: 1,
    marginRight: 12,
  },
  factorName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4,
  },
  factorValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    minWidth: 70,
    alignItems: 'center',
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  progressBar: {
    height: 8,
    backgroundColor: theme.colors.border,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  factorDetails: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  factorRecommendation: {
    fontSize: 14,
    color: theme.colors.text,
    marginBottom: 12,
    lineHeight: 20,
  },
  factorEvidence: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 16,
  },
  simulateButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignSelf: 'flex-start',
  },
  simulateButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  treatmentsContainer: {
    marginBottom: 32,
  },
  treatmentCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: theme.colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  treatmentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 12,
  },
  treatmentContent: {
    fontSize: 14,
    color: theme.colors.text,
    lineHeight: 22,
    marginBottom: 16,
  },
  treatmentList: {
    gap: 12,
  },
  treatmentItem: {
    backgroundColor: theme.colors.background,
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  treatmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  treatmentItemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    flex: 1,
    marginRight: 8,
  },
  treatmentDescription: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    minWidth: 50,
    alignItems: 'center',
  },
  priorityText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: theme.colors.background,
    textTransform: 'uppercase',
  },

  // 🤖 ESTILOS PARA DR. IA SECTION - PROMINENTE Y PROFESIONAL
  drIASection: {
    marginBottom: 24,
  },
  drIATitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  drIACard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 2,
    borderColor: theme.colors.primary + '20',
  },
  drIAHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  drIAAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  drIAInfo: {
    flex: 1,
  },
  drIAName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 4,
  },
  drIASpecialty: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.primary,
    marginBottom: 8,
  },
  drIACapabilities: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    lineHeight: 16,
  },
  drIAFeatures: {
    marginBottom: 20,
  },
  drIAFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 12,
  },
  drIAFeatureText: {
    fontSize: 14,
    color: theme.colors.text,
    marginLeft: 12,
    flex: 1,
    fontWeight: '500',
  },
  drIAConsultButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  drIAConsultButtonText: {
    color: theme.colors.surface,
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 12,
  },
});

export default ResultsDisplay;
