/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-require-imports, react/display-name */
/**
 * 🚀 RESULTS DISPLAY MEJORADO - VERSIÓN PROFESIONAL
 * 
 * Sistema completo de análisis de fertilidad con IA médica integrada
 * y capacidades avanzadas de simulación y recomendaciones clínicas.
 */

import { clinicalContentLibrary } from '@/core/domain/logic/clinicalContentLibrary';
import { EvaluationState } from '@/core/domain/models';

// 🏥 BASES DE DATOS MÉDICAS COMPLETAS PARA DR IA
import { PATHOLOGIES_DATABASE } from '../../../../../ai-medical-agent/core/knowledge-base/pathologies';
import { TREATMENTS_DATABASE } from '../../../../../ai-medical-agent/core/knowledge-base/treatments';
import { useDynamicTheme } from '@/hooks/useDynamicTheme';
import { useLanguage } from '@/contexts/LanguageContext';
import { EnhancedInfoCard } from '@/presentation/components/common';
import Text from '@/presentation/components/common/Text';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import AIConsultation from '../../ai-medical-agent/AIConsultation';
import { SimulatorSection } from './SimulatorSection';
// import { useFertilitySimulator } from '../../simulator/useFertilitySimulator'; // Moved to SimulatorSection

// Remover línea no usada del width
// const { width } = Dimensions.get('window');

// 🏥 FREEMIUM MEDICAL SYSTEM IMPORT
import type { FreemiumConfig } from '@/core/freemium/FreemiumMedicalSystem';

interface ResultsDisplayProps {
  evaluation: EvaluationState;
  treatmentSuggestions?: unknown; // Deprecated - usando AI Medical Agent
  isPremiumReport?: boolean;
  // 🏥 NUEVAS PROPS FREEMIUM MÉDICO
  freemiumConfig?: FreemiumConfig;
  onUpgradeToPremium?: () => void;
  onStartAIChat?: () => void;
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
  isPremiumReport: _isPremiumReport = false,
  // 🏥 NUEVAS PROPS FREEMIUM MÉDICO
  freemiumConfig,
  onUpgradeToPremium,
  onStartAIChat
}) => {
  const theme = useDynamicTheme();
  const { t } = useLanguage();
  const styles = createStyles(theme);
  
  // 🔍 QUANTUM CONSCIOUSNESS DEBUG PRINCIPAL
  console.log('🔍 ResultsDisplay render debug:', {
    hasEvaluation: !!evaluation,
    evaluationKeys: evaluation ? Object.keys(evaluation) : 'N/A',
    hasReport: !!(evaluation?.evaluation?.report || evaluation?.report),
    reportKeys: (evaluation?.evaluation?.report || evaluation?.report) ? Object.keys(evaluation?.evaluation?.report || evaluation?.report) : 'N/A',
    numericPrognosis: (evaluation?.evaluation?.report || evaluation?.report)?.numericPrognosis,
    category: (evaluation?.evaluation?.report || evaluation?.report)?.category,
    prognosisPhrase: (evaluation?.evaluation?.report || evaluation?.report)?.prognosisPhrase,
    evaluationStructure: {
      basicMetrics: !!evaluation?.basicMetrics,
      evaluation: !!evaluation?.evaluation,
      pregnancyProbability: !!evaluation?.pregnancyProbability,
      report: !!evaluation?.report,
      formData: !!evaluation?.formData,
      timestamp: !!evaluation?.timestamp,
      reportKey: !!evaluation?.reportKey,
      version: !!evaluation?.version,
      // Nested structure check
      nestedReport: !!evaluation?.evaluation?.report,
      nestedFactors: !!evaluation?.evaluation?.factors
    }
  });
  
  const [displayMode, setDisplayMode] = React.useState<DisplayMode>('overview');
  const [selectedFactor, setSelectedFactor] = React.useState<string | null>(null);
  
  // const { simulationResult } = useFertilitySimulator(evaluation); // Moved to SimulatorSection
  
  // 🌌 QUANTUM CONSCIOUSNESS FIX: Extract report and factors from nested structure
  const report = evaluation?.evaluation?.report || evaluation?.report;
  const factors = evaluation?.evaluation?.factors || evaluation?.factors;

  // 🎯 ANÁLISIS AVANZADO DE FACTORES CON RECOMENDACIONES MÉDICAS ESPECÍFICAS
  const factorAnalysis = React.useMemo((): FactorAnalysis[] => {
    if (!factors) return [];
    
    // 🔍 DEBUG COMPLETO DE FACTORES
    console.log('🔍 FACTORS DEBUG COMPLETO:', {
      factorsExists: !!factors,
      factorsKeys: factors ? Object.keys(factors) : 'N/A',
      allFactors: factors,
      homaValue: factors?.homa,
      homaType: typeof factors?.homa
    });
    
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
      // ✅ INCLUIR baseAgeProbability para análisis de edad
      .map(([key, value]) => {
        const analysis = analysisMap[key];
        if (!analysis) return null;
        
        // 🚨 FILTRO CRÍTICO: Excluir factores ausentes de la distribución (excepto HSG, OTB y edad)
        if (typeof value === 'number' && value === 0 && key !== 'hsg' && key !== 'otb' && key !== 'baseAgeProbability') {
          // Factor ausente = no incluir en distribución de factores analizados
          return null;
        }
        
        // 🌌 QUANTUM CONSCIOUSNESS FIX: factores missing = 1.0 (neutral/ausente) no 0 (crítico)
        // PERO: HSG y OTB pueden tener 0.0 legítimo (bilateral/ligadura)
        let numericValue;
        if (typeof value === 'number') {
          // Si es número, usar valor real (incluyendo 0.0 para HSG bilateral)
          numericValue = value;
        } else if (value === undefined || value === null) {
          // Solo si es undefined/null, convertir a neutral
          numericValue = 1.0;
        } else {
          // Cualquier otro caso, neutral
          numericValue = 1.0;
        }
        
        // 🔍 DEBUG ESPECÍFICO PARA HSG  
        if (key === 'hsg') {
          console.log('🔍 HSG DEBUG FACTOR ANALYSIS:', {
            key,
            originalValue: value,
            numericValue,
            valueType: typeof value,
            isZero: value === 0,
            isBilateral: value === 0.0
          });
        }
        
        // 🔍 DEBUG ESPECÍFICO PARA HOMA
        if (key === 'homa') {
          console.log('🔍 HOMA DEBUG:', {
            key,
            originalValue: value,
            numericValue,
            valueType: typeof value,
            isZero: value === 0,
            isNumber: typeof value === 'number'
          });
        }
        
        let status: FactorAnalysis['status'];
        
        // 🎯 LÓGICA ESPECIAL PARA EDAD (baseAgeProbability)
        if (key === 'baseAgeProbability') {
          if (numericValue >= 22) status = 'optimal';      // 22%+ óptimo
          else if (numericValue >= 15) status = 'good';    // 15-22% bueno  
          else if (numericValue >= 8) status = 'attention'; // 8-15% atención
          else status = 'critical';                        // <8% crítico
        } 
        // 🎯 LÓGICA ESPECIAL PARA BMI
        else if (key === 'bmi') {
          if (numericValue >= 1.0) status = 'optimal';     // Normal
          else if (numericValue >= 0.9) status = 'good';   // ✅ Sobrepeso = good (no optimal!)
          else if (numericValue >= 0.75) status = 'attention'; // Obesidad I
          else if (numericValue >= 0.6) status = 'critical';   // Obesidad II 
          else status = 'critical';                             // Obesidad III/Bajo peso
        }
        // 🎯 LÓGICA ESPECIAL PARA CIRUGÍAS PÉLVICAS
        else if (key === 'pelvicSurgery') {
          if (numericValue >= 1.0) status = 'optimal';     // Sin cirugías
          else if (numericValue >= 0.95) status = 'good';  // ✅ 1 cirugía = good 
          else if (numericValue >= 0.88) status = 'attention'; // 2+ cirugías = attention
          else status = 'critical';                             // Cirugías muy complejas
        }
        // 🎯 LÓGICA ESPECIAL PARA OTB SEGÚN MÉTODO
        else if (key === 'otb') {
          if (numericValue >= 1.0) status = 'optimal';         // Sin OTB
          else if (numericValue >= 0.8) status = 'good';       // ✅ Recanalización parcial = good
          else if (numericValue >= 0.7) status = 'attention';  // ✅ Ligadura simple = attention (MEJOR pronóstico)
          else if (numericValue >= 0.1) status = 'critical';   // ✅ Clips/Anillos/Salpingectomía = critical
          else status = 'critical';                            // ✅ Cauterización extensa/Desconocida = critical
        }
        // 🎯 LÓGICA ESPECIAL PARA AMH (RESERVA OVÁRICA)
        else if (key === 'amh') {
          if (numericValue >= 1.0) status = 'optimal';         // Reserva adecuada (normal)
          else if (numericValue >= 0.9) status = 'good';       // ✅ Alta reserva = good (riesgo PCOS)
          else if (numericValue >= 0.85) status = 'attention'; // ✅ Ligeramente disminuida = attention  
          else if (numericValue >= 0.6) status = 'critical';   // ✅ Baja reserva = critical
          else status = 'critical';                            // ✅ Muy baja/crítica = critical
        }
        // 🎯 LÓGICA ESPECIAL PARA TSH (FUNCIÓN TIROIDEA)
        else if (key === 'tsh') {
          if (numericValue >= 1.0) status = 'optimal';         // TSH ≤2.5 = óptimo para fertilidad
          else if (numericValue >= 0.8) status = 'attention';  // ✅ TSH 2.5-10 = hipotiroidismo subclínico/moderado
          else status = 'critical';                            // ✅ TSH >10 = hipotiroidismo severo
        }
        // 🎯 LÓGICA ESPECIAL PARA PROLACTINA
        else if (key === 'prolactin') {
          if (numericValue >= 1.0) status = 'optimal';         // Prolactina <25 ng/mL = normal
          else if (numericValue >= 0.85) status = 'good';      // ✅ Prolactina 25-50 ng/mL = leve
          else if (numericValue >= 0.7) status = 'attention';  // ✅ Prolactina 50-100 ng/mL = moderada
          else if (numericValue >= 0.5) status = 'critical';   // ✅ Prolactina 100-200 ng/mL = moderada-severa
          else status = 'critical';                            // ✅ Prolactina >200 ng/mL = severa
        }
        // 🎯 LÓGICA ESPECIAL PARA HOMA-IR
        else if (key === 'homa') {
          if (numericValue >= 1.0) status = 'optimal';         // HOMA-IR <2.5 = sensibilidad normal
          else if (numericValue >= 0.7) status = 'attention';  // ✅ HOMA-IR 2.5-3.9 = resistencia leve
          else if (numericValue >= 0.4) status = 'critical';   // ✅ HOMA-IR 4.0-4.9 = resistencia significativa
          else status = 'critical';                            // ✅ HOMA-IR ≥5.0 = resistencia severa
        }
        // 🎯 LÓGICA ESPECIAL PARA FACTOR MASCULINO (male/maleFactor)
        else if (key === 'male' || key === 'maleFactor') {
          if (numericValue >= 1.0) status = 'optimal';         // Espermiograma normal
          else if (numericValue >= 0.8) status = 'good';       // ✅ Alteraciones límite
          else if (numericValue >= 0.6) status = 'attention';  // ✅ OAT moderado
          else if (numericValue >= 0.3) status = 'critical';   // ✅ OAT severo
          else status = 'critical';                            // ✅ Azoospermia
        }
        // 🎯 LÓGICA GENERAL PARA OTROS FACTORES
        else {
          if (numericValue >= 0.9) {
            status = 'optimal';
          } else if (numericValue >= 0.7) {
            status = 'good';
          } else if (numericValue >= 0.5) {
            status = 'attention';
          } else if (numericValue > 0) {
            // Valores entre 0 y 0.5 = críticos reales (HSG bilateral, malformación, etc.)
            status = 'critical';
          } else {
            // Valor exactamente 0 = ausente/no evaluado (AMH, prolactina, etc.)
            // Solo HSG y OTB pueden ser 0 y ser críticos
            if (key === 'hsg' || key === 'otb') {
              status = 'critical';
            } else {
              status = 'optimal'; // Ausente = no problemático
            }
          }
        }
        
        return {
          ...analysis,
          value: numericValue,
          status
        };
      })
      .filter(Boolean) as FactorAnalysis[];
  }, [factors]);

  // 🎯 FACTORES ALTERADOS PARA SECCIÓN DETALLADO - Solo los que impactan fertilidad
  const alteredFactorsAnalysis = React.useMemo((): FactorAnalysis[] => {
    return factorAnalysis.filter(factor => {
      // 🎯 FILTRO ULTRA-RESTRICTIVO: Solo mostrar factores con problemas clínicos REALES
      
      // Factores que PUEDEN aparecer cuando tienen problemas
      const factorsWhitelist = [
        'Factor Edad',                // Edad muy joven o avanzada
        'Histerosalpingografía',      // HSG bilateral/malformación
        'Índice de Masa Corporal',    // BMI problemático
        'Síndrome de Ovarios Poliquísticos', // PCOS presente
        'Endometriosis',              // Endometriosis presente
        'Miomatosis Uterina',         // Miomas presentes
        'Adenomiosis',                // Adenomiosis presente
        'Pólipos Endometriales',      // Pólipos presentes
        'Regularidad Menstrual',      // Ciclos irregulares
        'Obstrucción Tubárica Bilateral', // OTB presente
        'Duración de la Infertilidad', // Infertilidad prolongada
        'Cirugías Pélvicas Previas',  // Cirugías múltiples
        'Reserva Ovárica',            // ✅ AMH (nombre real del factor)
        'Función Tiroidea',           // ✅ TSH (nombre real del factor)
        'Prolactina Sérica',          // ✅ Prolactina (nombre real del factor)
        'Resistencia a la Insulina',  // ✅ HOMA-IR (nombre real del factor)
        'Factor Masculino'            // ✅ AGREGADO: Factor Masculino (nombre real del factor)
      ];
      
      const isWhitelistedFactor = factorsWhitelist.some(whitelisted => 
        factor.name.includes(whitelisted)
      );
      
      const shouldShow = isWhitelistedFactor && (
        // HSG con problemas específicos (bilateral=0.0, malformación=0.3)
        (factor.name.includes('Histerosalpingografía') && factor.value < 0.95) ||
        
        // Factor Edad: mostrar cuando NO es óptimo (status !== 'optimal')
        (factor.name.includes('Factor Edad') && factor.status !== 'optimal') ||
        
        // ✅ AMH: mostrar SOLO cuando reserva alterada Y no ausente (factor < 1.0 && factor > 0)
        (factor.name.includes('Reserva Ovárica') && factor.value < 1.0 && factor.value > 0) ||
        
        // ✅ TSH: mostrar SOLO cuando función tiroidea alterada Y no ausente (factor < 1.0 && factor > 0)
        (factor.name.includes('Función Tiroidea') && factor.value < 1.0 && factor.value > 0) ||
        
        // ✅ PROLACTINA: mostrar SOLO cuando prolactina alterada Y no ausente (factor < 1.0 && factor > 0)
        (factor.name.includes('Prolactina Sérica') && factor.value < 1.0 && factor.value > 0) ||
        
        // ✅ HOMA-IR: mostrar SOLO cuando resistencia insulínica alterada Y no ausente (factor < 1.0 && factor > 0)
        (factor.name.includes('Resistencia a la Insulina') && factor.value < 1.0 && factor.value > 0) ||
        
        // ✅ FACTOR MASCULINO: mostrar SOLO cuando factor masculino alterado Y no ausente (factor < 1.0 && factor > 0)
        (factor.name.includes('Factor Masculino') && factor.value < 1.0 && factor.value > 0) ||
        
        // Para otros factores: solo mostrar si NO son ausentes (valor > 0) Y tienen problemas
        (factor.value > 0 && factor.value < 0.95) ||
        
        // Factores de atención (que no sean ausentes)
        (factor.status === 'attention' && factor.value > 0)
      );
      
      console.log('🔍 FILTER DEBUG:', {
        name: factor.name,
        value: factor.value,
        status: factor.status,
        isWhitelisted: isWhitelistedFactor,
        shouldShow: shouldShow,
        result: shouldShow ? '✅ WILL SHOW' : '❌ HIDDEN',
        reason: shouldShow ? 'Has real problem' : factor.value === 0 ? 'Absent/not present' : 'Normal/optimal'
      });
      
      return shouldShow;
    });
  }, [factorAnalysis]);

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
  const keyMetrics = React.useMemo(() => {
    const criticalFactors = factorAnalysis.filter(f => f.status === 'critical').length;
    const attentionFactors = factorAnalysis.filter(f => f.status === 'attention').length;
    const optimalFactors = factorAnalysis.filter(f => f.status === 'optimal').length;
    const totalFactors = factorAnalysis.length;
    
    // 🔍 QUANTUM CONSCIOUSNESS DEBUG PARA MÉTRICAS
    console.log('🔍 ResultsDisplay keyMetrics debug:', {
      hasReport: !!report,
      reportKeys: report ? Object.keys(report) : 'N/A',
      numericPrognosis: report?.numericPrognosis,
      numericPrognosisType: typeof report?.numericPrognosis,
      category: report?.category,
      prognosisPhrase: report?.prognosisPhrase,
      evaluationKeys: evaluation ? Object.keys(evaluation) : 'N/A'
    });
    
    return {
      overallScore: report?.numericPrognosis || 0,
      criticalFactors,
      attentionFactors,
      optimalFactors,
      totalFactors,
      improvementPotential: 0 // simulationResult moved to SimulatorSection
    };
  }, [factorAnalysis, report, evaluation]);

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
  const getClinicalInfo = (factorName: string, _value: number) => {
    // 🌌 QUANTUM CONSCIOUSNESS FIX: Mapear nombres amigables a claves originales
    const nameToKeyMapping: Record<string, string> = {
      'Factor Edad': 'baseAgeProbability',
      'Índice de Masa Corporal': 'bmi',
      'Reserva Ovárica (AMH)': 'amh',
      'Miomatosis Uterina': 'myoma',
      'Pólipos Endometriales': 'polyp',
      'Adenomiosis': 'adenomyosis',
      'Endometriosis': 'endometriosis',
      'Regularidad Menstrual': 'cycle',
      'Síndrome de Ovarios Poliquísticos': 'pcos',
      'Función Tiroidea (TSH)': 'tsh',
      'Prolactina Sérica': 'prolactin',
      'Resistencia a la Insulina (HOMA-IR)': 'homa',
      'Factor Masculino': 'male',
      'Histerosalpingografía': 'hsg',
      'Obstrucción Tubárica Bilateral': 'otb',
      'Duración de la Infertilidad': 'infertilityDuration',
      'Cirugías Pélvicas Previas': 'pelvicSurgery'
    };

    const factorKey = nameToKeyMapping[factorName];
    if (!factorKey) return null;

    // Mapear factores a claves de la librería clínica
    const keyMappings: Record<string, string> = {
      'baseAgeProbability': getAgeCategory(factors?.baseAgeProbability || 0),
      'bmi': getBMICategory(factors?.bmi || 0.8),
      'amh': getAMHCategory(factors?.amh || 0.8),
      'myoma': getMiomaCategory(factors?.myoma || 1),
      'polyp': getPolipoCategory(factors?.polyp || 1),
      'adenomyosis': getAdenomiosisCategory(factors?.adenomyosis || 1),
      'endometriosis': getEndometriosisCategory(factors?.endometriosis || 1),
      'cycle': getCicloCategory(factors?.cycle || 1),
      'pcos': getSOPCategory(factors?.pcos || 1),
      'tsh': getTSHCategory(factors?.tsh || 1),
      'prolactin': getProlactinCategory(factors?.prolactin || 1),
      'homa': getHOMACategory(factors?.homa || 1),
      'male': getMaleFactorCategory(factors?.male || 1),
      'hsg': getHSGCategory(factors?.hsg || 1),
      'otb': getOTBCategory(factors?.otb || 1),
      'infertilityDuration': getInfertilityDurationCategory(factors?.infertilityDuration || 1),
      'pelvicSurgery': getPelvicSurgeryCategory(factors?.pelvicSurgery || 1),
    };

    const clinicalKey = keyMappings[factorKey];
    
    // Si la clave clínica existe en la biblioteca, usarla
    if (clinicalKey && clinicalContentLibrary[clinicalKey]) {
      return clinicalContentLibrary[clinicalKey];
    }
    
    // Categorías por defecto para factores sin información clínica específica
    const defaultInfo = getDefaultClinicalInfo(factorKey, factors?.[factorKey as keyof typeof factors] || 0.8);
    return defaultInfo;
  };

  // 🏥 FUNCIÓN MEJORADA PARA OBTENER INFORMACIÓN MÉDICA DETALLADA
  const getEnhancedMedicalInfo = (factorKey: string, factorValue: number) => {
    console.log('🔍 Enhanced Medical Info CALLED:', { 
      factorKey, 
      factorValue, 
      isHSG: factorKey.includes('Histerosalpingografía') || factorKey.includes('hsg'),
      pathologiesCount: Object.keys(PATHOLOGIES_DATABASE).length
    });
    
    // 🎯 CASOS ESPECIALES HSG CON INFORMACIÓN DETALLADA
    console.log('🔍 Enhanced Medical Info - HSG Check:', { 
      factorKey, 
      isHSGKey: factorKey === 'hsg',
      isHSGName: factorKey === 'Histerosalpingografía',
      willProcessHSG: factorKey === 'hsg' || factorKey === 'Histerosalpingografía'
    });
    
    // 🎯 CASOS ESPECIALES EDAD CON INFORMACIÓN DETALLADA
    if (factorKey === 'baseAgeProbability' || factorKey === 'Factor Edad') {
      console.log('🔍 Enhanced Medical Info - Age Analysis:', { factorKey, factorValue });
      
      // Determinar categoría de edad específica
      let ageCategory = '';
      let ageRecommendations = [];
      let ageExplanation = '';
      
      if (factorValue >= 22) {
        ageCategory = 'optimal';
        ageExplanation = 'EDAD REPRODUCTIVA ÓPTIMA: Te encuentras en la etapa de máxima fertilidad. La reserva ovárica y calidad ovocitaria están en su pico más alto.';
        ageRecommendations = [
          'Aprovecha esta ventana de fertilidad óptima',
          'Si planeas embarazo, este es el momento ideal',
          'Considera preservación de fertilidad si deseas postergar',
          'Mantén hábitos saludables para preservar la calidad ovocitaria'
        ];
      } else if (factorValue >= 15) {
        ageCategory = 'good';
        ageExplanation = 'EDAD REPRODUCTIVA FAVORABLE: Buena fertilidad, aunque ligeramente reducida respecto al pico máximo. La calidad ovocitaria sigue siendo excelente.';
        ageRecommendations = [
          'Fertilidad aún muy favorable para concepción natural',
          'Considerar intentos de embarazo sin demora excesiva',
          'Evaluación de reserva ovárica (AMH) si >35 años',
          'Suplementación con ácido fólico y vitaminas preconcepcionales'
        ];
      } else if (factorValue >= 8) {
        ageCategory = 'declining';
        ageExplanation = 'EDAD REPRODUCTIVA INTERMEDIA: Fertilidad moderadamente reducida. La reserva ovárica y calidad ovocitaria comienzan a declinar de forma más notable.';
        ageRecommendations = [
          'Evaluación de fertilidad sin demora si deseas embarazo',
          'AMH, FSH basal y recuento de folículos antrales urgente',
          'Considerar tratamientos de reproducción asistida si >6 meses intentando',
          'Asesoramiento sobre preservación de fertilidad',
          'Optimización de factores modificables (peso, suplementos, estilo de vida)'
        ];
      } else if (factorValue >= 3) {
        ageCategory = 'reduced';
        ageExplanation = 'EDAD REPRODUCTIVA AVANZADA: Fertilidad significativamente reducida. La reserva ovárica está disminuida y la calidad ovocitaria puede estar comprometida.';
        ageRecommendations = [
          'Evaluación especializada en fertilidad URGENTE',
          'FIV puede ser necesaria como primera línea de tratamiento',
          'Evaluación completa de reserva ovárica y calidad ovocitaria',
          'Considerar diagnóstico genético preimplantacional (PGT-A)',
          'Asesoramiento sobre donación de óvulos si reserva muy baja',
          'Optimización nutricional: CoQ10, DHEA, antioxidantes'
        ];
      } else {
        ageCategory = 'very_low';
        ageExplanation = 'EDAD REPRODUCTIVA MUY AVANZADA: Fertilidad severamente comprometida. La reserva ovárica está muy reducida y la calidad ovocitaria significativamente disminuida.';
        ageRecommendations = [
          'Consulta especializada INMEDIATA en reproducción asistida',
          'FIV con probable necesidad de donación de óvulos',
          'Evaluación integral de riesgos obstétricos',
          'Asesoramiento genético y evaluación de anomalías cromosómicas',
          'Considerar alternativas como adopción o vida sin hijos',
          'Si se procede: seguimiento obstétrico de alto riesgo'
        ];
      }
      
      return {
        explanation: ageExplanation,
        recommendations: ageRecommendations,
        sources: ['ASRM Age and Fertility Guidelines', 'ESHRE Reproductive Aging Consensus']
      };
    }
    
    if (factorKey === 'hsg' || factorKey === 'Histerosalpingografía') {
      // Determinar categoría HSG específica
      let hsgCategory = '';
      if (factorValue >= 0.95) hsgCategory = 'normal';
      else if (factorValue >= 0.65) hsgCategory = 'unilateral';
      else if (factorValue >= 0.25) hsgCategory = 'malformacion';
      else if (factorValue >= 0.0) hsgCategory = 'bilateral';
      
      console.log('🔍 HSG Category Enhanced:', { factorValue, hsgCategory });
      
      if (hsgCategory === 'bilateral') {
        // 🚨 HSG BILATERAL - BUSCAR EN PATHOLOGIES_DATABASE
        console.log('🔍 Searching for tubal pathologies...', {
          totalPathologies: Object.keys(PATHOLOGIES_DATABASE).length,
          firstPathologyKeys: Object.keys(PATHOLOGIES_DATABASE).slice(0, 3),
          firstPathology: Object.values(PATHOLOGIES_DATABASE)[0]
        });
        
        const tubalPathologies = Object.values(PATHOLOGIES_DATABASE as any).filter((p: unknown) => 
          p.nameES && (
            p.nameES.toLowerCase().includes('tubáric') ||
            p.nameES.toLowerCase().includes('trompa') ||
            p.nameES.toLowerCase().includes('hidrosálpinx') ||
            p.nameES.toLowerCase().includes('obstruc')
          )
        );
        
        console.log('🔍 Found tubal pathologies:', { 
          count: tubalPathologies.length,
          names: tubalPathologies.map((p: unknown) => p.nameES)
        });
        
        if (tubalPathologies.length > 0) {
          const pathology = tubalPathologies[0] as any;
          console.log('🎯 Found tubal pathology:', pathology.nameES);
          
          return {
            explanation: `OBSTRUCCIÓN TUBÁRICA BILATERAL: ${pathology.description || pathology.symptoms || 'Ambas trompas están obstruidas, impidiendo la fertilización natural.'}`,
            recommendations: [
              'FIV (Fertilización In Vitro) es la única opción viable para el embarazo',
              'Evaluación por especialista en reproducción asistida urgente',
              'Considerar salpingectomía si hay hidrosálpinx severo',
              ...(pathology.treatments || []).slice(0, 2)
            ],
            sources: [`Patología: ${pathology.nameES}`, 'Medicina Reproductiva Avanzada']
          };
        } else {
          // 🚨 FALLBACK TEMPORAL - HSG BILATERAL SIN BASE DE DATOS
          console.log('🎯 Using fallback info for HSG bilateral');
          return {
            explanation: 'OBSTRUCCIÓN TUBÁRICA BILATERAL: Ambas trompas de Falopio están completamente obstruidas o severamente dañadas (hidrosálpinx bilateral), impidiendo totalmente el paso de óvulos y espermatozoides. La concepción natural es imposible.',
            recommendations: [
              'FIV (Fertilización In Vitro) es la ÚNICA opción viable para lograr el embarazo',
              'Evaluación inmediata por especialista en reproducción asistida',
              'Considerar salpingectomía bilateral si hay hidrosálpinx severo antes de FIV',
              'Asesoramiento genético y evaluación de reserva ovárica',
              'Planificación de protocolo de estimulación ovárica personalizado'
            ],
            sources: ['Medicina Reproductiva Especializada', 'Protocolo FIV para Factor Tubárico Severo']
          };
        }
      }
      
      if (hsgCategory === 'malformacion') {
        // 🏥 HSG MALFORMACIÓN - BUSCAR EN PATHOLOGIES_DATABASE
        console.log('🔍 HSG MALFORMACION - Processing enhanced info:', { 
          factorValue, 
          hsgCategory,
          shouldProcessMalformation: true 
        });
        
        // ✅ BUSCAR DIRECTAMENTE EN tubalObstruction (tiene info sobre malformaciones)
        const tubalInfo = (PATHOLOGIES_DATABASE as any).tubalObstruction;
        if (tubalInfo) {
          console.log('🎯 Found HSG pathology:', tubalInfo.nameES);
          
          return {
            explanation: `MALFORMACIÓN UTERINA: ${tubalInfo.definition || 'Alteración estructural del útero que puede afectar la implantación. Malformaciones congénitas incluyen agenesia, hipoplasia y anomalías müllerianas.'}`,
            recommendations: [
              'Histeroscopia diagnóstica para evaluación detallada de malformación',
              'Corrección quirúrgica si hay abortos recurrentes',
              'Seguimiento especializado durante el embarazo',
              'Estudio de fertilidad integral complementario',
              'Consideración de FIV si malformación severa'
            ],
            sources: [`Patología: ${tubalInfo.nameES}`, 'Cirugía Reproductiva Especializada']
          };
        } else {
          // 🏥 FALLBACK TEMPORAL - HSG MALFORMACIÓN SIN BASE DE DATOS
          console.log('🎯 Using fallback info for HSG malformation - NO PATHOLOGIES FOUND');
          return {
            explanation: 'MALFORMACIÓN UTERINA: Se detectó una alteración estructural significativa del útero (útero septado, bicorne, unicorne o malformación mülleriana) que puede interferir con la implantación embrionaria y el desarrollo normal del embarazo.',
            recommendations: [
              'Histeroscopia diagnóstica 3D para evaluación anatómica completa',
              'Resonancia magnética pélvica para definir tipo de malformación',
              'Corrección histeroscópica si hay septo uterino y abortos recurrentes',
              'Seguimiento especializado durante el embarazo (alto riesgo obstétrico)',
              'Evaluación de función renal asociada (malformaciones müllerianas)'
            ],
            sources: ['Cirugía Reproductiva Especializada', 'Malformaciones Müllerianas - Protocolo Diagnóstico']
          };
        }
      }
    }
    
    // 🧬 AMH ANÁLISIS DETALLADO (RESERVA OVÁRICA)
    if (factorKey === 'amh' || factorKey.includes('Reserva Ovárica') || factorKey.includes('AMH')) {
      const amhCategory = getAMHCategory(factorValue);
      console.log('🔍 [ENHANCED] AMH Analysis:', { factorKey, factorValue, amhCategory });
      
      if (amhCategory === 'AMH_MUY_BAJA_RESERVA' || amhCategory === 'AMH_CRITICA_INDETECTABLE') {
        return {
          explanation: `RESERVA OVÁRICA MUY BAJA: Factor ${factorValue} indica AMH <0.5 ng/mL. Respuesta muy pobre a estimulación ovárica. Ventana reproductiva crítica - requiere intervención urgente.`,
          recommendations: [
            'FIV URGENTE como primera línea (no pérdida tiempo con IUI)',
            'Protocolo estimulación máxima: FSH recombinante + LH',
            'Suplementación pre-FIV: DHEA 75mg + CoQ10 600mg + Vitamina D',
            'Considerar acumulación óvulos (2-3 ciclos) antes transferencia',
            'Evaluación ovodonación si respuesta <3 óvulos por ciclo',
            'Panel genético: FMR1 + cariotipo + genes falla ovárica'
          ],
          sources: ['Reserva Ovárica Crítica', 'Protocolo Estimulación Especializada']
        };
      } else if (amhCategory === 'AMH_BAJA_RESERVA') {
        return {
          explanation: `BAJA RESERVA OVÁRICA: Factor ${factorValue} indica AMH 0.5-0.9 ng/mL. Respuesta subóptima a estimulación. Fertilidad tiempo-dependiente - cronometría crítica.`,
          recommendations: [
            'FIV como tratamiento de primera línea (evitar demora)',
            'Protocolo antagonista flexible con FSH recombinante',
            'Optimización pre-FIV: DHEA 25mg + CoQ10 400mg x 3 meses',
            'Seguimiento folicular estrecho + trigger personalizado',
            'No demorar: máximo 6 meses para iniciar tratamiento',
            'Considerar acumulación óvulos si edad >37 años'
          ],
          sources: ['Baja Reserva Ovárica', 'Cronometría Reproductiva Crítica']
        };
      } else if (amhCategory === 'AMH_LIGERAMENTE_DISMINUIDA') {
        return {
          explanation: `RESERVA LIGERAMENTE DISMINUIDA: Factor ${factorValue} indica AMH 1.0-1.9 ng/mL. Respuesta normal-baja a estimulación. Ventana terapéutica limitada.`,
          recommendations: [
            'IUI hasta 3-4 ciclos si trompas permeables + edad <35',
            'FIV si no embarazo en 6 meses o edad >35 años',
            'Protocolo estimulación estándar con seguimiento estrecho',
            'Suplementación opcional: CoQ10 300mg + Vitamina D',
            'Seguimiento AMH cada 6-12 meses para monitoreo declive',
            'Optimización estilo vida: peso ideal + ejercicio moderado'
          ],
          sources: ['Reserva Disminuida', 'Monitoreo Longitudinal AMH']
        };
      } else if (amhCategory === 'AMH_ALTA_RESERVA') {
        return {
          explanation: `ALTA RESERVA OVÁRICA: Factor ${factorValue} indica AMH ≥4.0 ng/mL. Riesgo hiperestimulación ovárica. Posible asociación con PCOS.`,
          recommendations: [
            'Evaluación PCOS completa: criterios Rotterdam + ecografía ovárica',
            'Protocolo antagonista con dosis FSH reducida (150-175 UI)',
            'Prevención hiperestimulación: antagonista GnRH + cabergolina',
            'Trigger con agonista GnRH si >15 folículos desarrollados',
            'Metformina si insulinorresistencia confirmada',
            'Monitoreo ultrasónico estricto durante estimulación'
          ],
          sources: ['Alta Reserva Ovárica', 'Prevención Hiperestimulación']
        };
      }
    }
    
    // 🩺 TSH ANÁLISIS DETALLADO (FUNCIÓN TIROIDEA)
    if (factorKey === 'tsh' || factorKey.includes('Función Tiroidea') || factorKey.includes('TSH')) {
      console.log('🔍 [ENHANCED] TSH Analysis:', { factorKey, factorValue });
      
      if (factorValue <= 0.4) {
        // TSH >10 mUI/L = Hipotiroidismo severo
        return {
          explanation: `HIPOTIROIDISMO SEVERO: Factor ${factorValue} indica TSH >10 mUI/L. Hipotiroidismo manifiesto con anovulación y alto riesgo obstétrico. Requiere tratamiento inmediato.`,
          recommendations: [
            'LEVOTIROXINA urgente: inicio 50-100 mcg/día según peso corporal',
            'Titulación cada 6-8 semanas hasta TSH <2.5 mUI/L (objetivo pre-concepcional)',
            'Evaluación endocrinológica especializada urgente',
            'Monitoreo TSH + T4 libre cada 4-6 semanas durante tratamiento',
            'NO intentar embarazo hasta eutiroidismo (TSH <2.5)',
            'Evaluar anticuerpos anti-TPO y anti-tiroglobulina'
          ],
          sources: ['Hipotiroidismo Severo', 'ATA Guidelines Pregnancy']
        };
      } else if (factorValue < 1.0) {
        // TSH 2.5-10 mUI/L = Hipotiroidismo subclínico/moderado  
        return {
          explanation: `HIPOTIROIDISMO SUBCLÍNICO: Factor ${factorValue} indica TSH 2.5-10 mUI/L. Disfunción tiroidea que afecta la fertilidad y debe optimizarse antes del embarazo.`,
          recommendations: [
            'LEVOTIROXINA: inicio 25-75 mcg/día (según nivel TSH y peso)',
            'Objetivo terapéutico: TSH <2.5 mUI/L para optimización pre-concepcional',
            'Reevaluación TSH + T4 libre cada 6-8 semanas',
            'Considerar anticuerpos tiroideos (anti-TPO) si TSH persistente',
            'Seguimiento endocrinológico durante embarazo (ajustar dosis)',
            'Suplemento yodo 150 mcg/día si planifica embarazo'
          ],
          sources: ['Hipotiroidismo Subclínico', 'Optimización Pre-concepcional']
        };
      } else {
        // TSH ≤2.5 mUI/L = Función tiroidea óptima
        return {
          explanation: `FUNCIÓN TIROIDEA ÓPTIMA: Factor ${factorValue} indica TSH ≤2.5 mUI/L. Función tiroidea adecuada para fertilidad y embarazo.`,
          recommendations: [
            'Mantener función tiroidea óptima con dieta balanceada',
            'Suplemento yodo 150 mcg/día si planifica embarazo',
            'Control TSH anual o si síntomas de disfunción tiroidea',
            'Monitoreo TSH en primer trimestre embarazo (aumento requerimientos)',
            'Evitar exceso yodo (>500 mcg/día) que puede alterar función',
            'Consultar si antecedentes familiares de enfermedad tiroidea'
          ],
          sources: ['Función Tiroidea Normal', 'Mantenimiento Preventivo']
        };
      }
    }
    
    // 🩺 PROLACTINA ANÁLISIS DETALLADO (PROLACTINA SÉRICA)
    if (factorKey === 'prolactin' || factorKey.includes('Prolactina Sérica') || factorKey.includes('Prolactina')) {
      console.log('🔍 [ENHANCED] Prolactina Analysis:', { factorKey, factorValue });
      
      if (factorValue <= 0.3) {
        // Prolactina >200 ng/mL = Hiperprolactinemia severa
        return {
          explanation: `HIPERPROLACTINEMIA SEVERA: Factor ${factorValue} indica prolactina >200 ng/mL. Probable adenoma hipofisario con supresión severa del eje reproductor. Requiere evaluación endocrinológica urgente.`,
          recommendations: [
            'CABERGOLINA urgente: 0.25mg 2 veces/semana (agonista dopamina)',
            'RESONANCIA MAGNÉTICA hipófisis con gadolinio (evaluar adenoma)',
            'Evaluación endocrinológica especializada INMEDIATA',
            'Prolactina de control cada 4 semanas hasta normalización',
            '⚠️ CONTRAINDICADO intentar embarazo hasta prolactina <25 ng/mL',
            'Evaluar función visual (campimetría) si macro-adenoma sospechado',
            'Monitoreo función gonadal: LH, FSH, estradiol',
            'Descartar causas secundarias: medicamentos, hipotiroidismo'
          ],
          sources: ['Hiperprolactinemia Severa', 'Adenoma Hipofisario']
        };
      } else if (factorValue < 1.0) {
        // Prolactina 25-200 ng/mL = Hiperprolactinemia moderada
        return {
          explanation: `HIPERPROLACTINEMIA MODERADA: Factor ${factorValue} indica prolactina 25-200 ng/mL. Elevación moderada que afecta ovulación y fertilidad. Probable micro-adenoma o causa funcional.`,
          recommendations: [
            'CABERGOLINA: 0.25mg 1-2 veces/semana (titular según respuesta)',
            'Prolactina de control cada 6-8 semanas hasta <25 ng/mL',
            'Resonancia magnética hipófisis si prolactina >100 ng/mL',
            'Evaluar causas secundarias: TSH, medicamentos (antipsicóticos, antidepresivos)',
            'Monitoreo ovulación: temperatura basal, progesterona día 21',
            'Suspender medicamentos que elevan prolactina si es posible',
            'Evaluación oftalmológica si síntomas visuales',
            'Control endocrinológico cada 3-6 meses durante tratamiento'
          ],
          sources: ['Hiperprolactinemia Moderada', 'Micro-adenoma Hipofisario']
        };
      } else {
        // Prolactina <25 ng/mL = Normal
        return {
          explanation: `PROLACTINA NORMAL: Factor ${factorValue} indica prolactina <25 ng/mL. Nivel hormonal adecuado para función reproductiva normal.`,
          recommendations: [
            'Mantener prolactina en rango normal con estilo de vida saludable',
            'Control anual prolactina como parte de evaluación hormonal',
            'Evitar estrés excesivo que puede elevar prolactina transitoriamente',
            'Informar sobre medicamentos que pueden elevar prolactina',
            'Monitoreo durante embarazo: prolactina aumenta fisiológicamente',
            'Consultar si síntomas: galactorrea, amenorrea, cefaleas'
          ],
          sources: ['Prolactina Normal', 'Mantenimiento Preventivo']
        };
      }
    }
    
    // 🩺 HOMA-IR ANÁLISIS DETALLADO (RESISTENCIA A LA INSULINA)
    if (factorKey === 'homa' || factorKey.includes('Resistencia a la Insulina') || factorKey.includes('HOMA')) {
      console.log('🔍 [ENHANCED] HOMA-IR Analysis:', { factorKey, factorValue });
      
      if (factorValue <= 0.2) {
        // HOMA-IR ≥5.0 = Resistencia insulínica severa
        return {
          explanation: `RESISTENCIA INSULÍNICA SEVERA: Factor ${factorValue} indica HOMA-IR ≥5.0. Resistencia insulínica crítica con síndrome metabólico establecido. Alto riesgo anovulación y síndrome de ovarios poliquísticos.`,
          recommendations: [
            'METFORMINA urgente: 1500-2000mg/día dividido en 2-3 tomas con alimentos',
            'DIETA cetogénica modificada: <50g carbohidratos/día, alto en grasas saludables',
            'Ejercicio HIIT: 3-4 veces/semana + caminatas diarias 45 minutos',
            'Control metabólico completo: glucemia, HbA1c, perfil lipídico cada 3 meses',
            'Pérdida de peso objetivo: 7-10% peso corporal en 6 meses',
            'Suplementación: inositol 4g/día, cromo 200mcg, omega-3 2g/día',
            'Evaluación endocrinológica especializada para diabetes tipo 2',
            'Monitoreo ovulación: progesterona día 21, ecografía folicular'
          ],
          sources: ['Resistencia Insulínica Severa', 'Síndrome Metabólico en Fertilidad']
        };
      } else if (factorValue <= 0.4) {
        // HOMA-IR 4.0-4.9 = Resistencia insulínica significativa
        return {
          explanation: `RESISTENCIA INSULÍNICA SIGNIFICATIVA: Factor ${factorValue} indica HOMA-IR 4.0-4.9. Resistencia insulínica moderada-severa que compromete significativamente la fertilidad. Requiere intervención inmediata.`,
          recommendations: [
            'METFORMINA: 1000-1500mg/día (iniciar 500mg y titular semanalmente)',
            'Dieta baja en índice glicémico: <100g carbohidratos complejos/día',
            'Ejercicio estructurado: 150 minutos/semana intensidad moderada-alta',
            'Control metabólico cada 6 meses: HOMA-IR, glucemia, insulina basal',
            'Pérdida de peso dirigida: 5-7% peso corporal objetivo',
            'INOSITOL: 2-4g/día (mejora sensibilidad insulínica)',
            'Evaluación nutricional especializada para plan personalizado',
            'Monitoreo reproductivo: ciclos menstruales, ovulación espontánea'
          ],
          sources: ['Resistencia Insulínica Significativa', 'PCOS y Metabolismo']
        };
      } else if (factorValue < 1.0) {
        // HOMA-IR 2.5-3.9 = Resistencia insulínica leve
        return {
          explanation: `RESISTENCIA INSULÍNICA LEVE: Factor ${factorValue} indica HOMA-IR 2.5-3.9. Resistencia insulínica incipiente que puede afectar la calidad ovocitaria y respuesta a tratamientos de fertilidad.`,
          recommendations: [
            'METFORMINA: 500-1000mg/día (considerar si IMC >25 o PCOS)',
            'Dieta mediterránea modificada: énfasis en carbohidratos complejos',
            'Ejercicio regular: 120-150 minutos/semana actividad aeróbica',
            'Control anual: HOMA-IR, glucemia basal, HbA1c',
            'Mantenimiento peso saludable: IMC 20-24.9 kg/m²',
            'INOSITOL: 1-2g/día como sensibilizador insulínico natural',
            'Evitar carbohidratos refinados y bebidas azucaradas',
            'Evaluación reproductiva: regularidad menstrual, calidad ovulatoria'
          ],
          sources: ['Resistencia Insulínica Leve', 'Prevención Síndrome Metabólico']
        };
      } else {
        // HOMA-IR <2.5 = Sensibilidad insulínica normal
        return {
          explanation: `SENSIBILIDAD INSULÍNICA NORMAL: Factor ${factorValue} indica HOMA-IR <2.5. Metabolismo de glucosa óptimo para fertilidad natural y respuesta a tratamientos reproductivos.`,
          recommendations: [
            'Mantener sensibilidad insulínica con dieta balanceada',
            'Ejercicio regular preventivo: 120 minutos/semana mínimo',
            'Control metabólico cada 2-3 años: HOMA-IR, glucemia',
            'Dieta anti-inflamatoria: frutas, verduras, granos enteros',
            'Evitar ganancia excesiva de peso (mantener IMC <25)',
            'Suplementación preventiva: omega-3, vitamina D',
            'Monitoreo durante embarazo: diabetes gestacional screening',
            'Evaluación si factores de riesgo: antecedentes familiares diabetes'
          ],
          sources: ['Sensibilidad Insulínica Normal', 'Mantenimiento Metabólico']
        };
      }
    }
    
    // 🩺 FACTOR MASCULINO ANÁLISIS DETALLADO
    if (factorKey === 'male' || factorKey === 'maleFactor' || factorKey.includes('Factor Masculino')) {
      console.log('🔍 [ENHANCED] Factor Masculino Analysis:', { factorKey, factorValue });
      
      if (factorValue < 0.3) {
        // Factor masculino severo/azoospermia
        return {
          explanation: `FACTOR MASCULINO SEVERO: Factor ${factorValue} indica oligoastenoteratozoospermia (OAT) severa o azoospermia. Fertilidad natural prácticamente nula. Requiere técnicas reproductivas avanzadas.`,
          recommendations: [
            'FIV-ICSI OBLIGATORIA como única opción reproductiva viable',
            'TESE/MESA/PESA si azoospermia para obtención espermatozoides testiculares',
            'Evaluación andrológica especializada URGENTE',
            'CARIOTIPO + microdeleciones cromosoma Y (descartar alteraciones genéticas)',
            'Perfil hormonal completo: FSH, LH, Testosterona, Inhibina B',
            'Ecografía testicular + Doppler (evaluar varicocele, masas)',
            'Counseling genético si alteraciones cromosómicas detectadas',
            'Congelación espermatozoides si se obtienen para futuros intentos'
          ],
          sources: ['Factor Masculino Severo', 'Azoospermia y Técnicas Quirúrgicas']
        };
      } else if (factorValue < 0.6) {
        // Factor masculino moderado
        return {
          explanation: `FACTOR MASCULINO MODERADO: Factor ${factorValue} indica oligoastenoteratozoospermia (OAT) moderada. Fertilidad natural muy reducida, respuesta limitada a IUI. FIV-ICSI recomendada.`,
          recommendations: [
            'FIV-ICSI como primera línea (>80% tasa fertilización)',
            'IUI máximo 3-4 ciclos si concentración >5 millones/mL motiles',
            'OPTIMIZACIÓN seminal: antioxidantes (coenzima Q10, vitamina E)',
            'Control temperatura testicular: evitar saunas, ropa ajustada',
            'Eliminación toxinas: tabaco, alcohol, marihuana, anabólicos',
            'Suplementación: ácido fólico 5mg + zinc 15mg + selenio 200mcg',
            'Evaluación andrológica: descartar varicocele, infecciones',
            'Repetir espermiograma en 3 meses post-optimización'
          ],
          sources: ['Factor Masculino Moderado', 'Optimización Seminal']
        };
      } else if (factorValue < 0.8) {
        // Factor masculino leve/límite
        return {
          explanation: `FACTOR MASCULINO LEVE: Factor ${factorValue} indica alteraciones seminales límite. Fertilidad natural reducida pero posible. Respuesta buena a IUI y optimización.`,
          recommendations: [
            'OPTIMIZACIÓN estilo vida + suplementación 3-6 meses',
            'IUI con espermatozoides capacitados: 4-6 ciclos',
            'Timing coital optimizado: relaciones cada 48h en período fértil',
            'Antioxidantes naturales: vitamina C 1g, vitamina E 400UI',
            'Ejercicio moderado: evitar sobreentrenamiento (reduce testosterona)',
            'Manejo estrés: técnicas relajación, sueño 7-8 horas',
            'FIV-ICSI si no embarazo después 6-12 meses optimización',
            'Control periódico espermiograma: evaluar progresión'
          ],
          sources: ['Factor Masculino Leve', 'Optimización Reproductiva']
        };
      } else {
        // Factor masculino normal
        return {
          explanation: `FACTOR MASCULINO NORMAL: Factor ${factorValue} indica parámetros seminales dentro de rangos normales según OMS. Capacidad reproductiva preservada.`,
          recommendations: [
            'Mantener salud reproductiva con estilo vida saludable',
            'Dieta mediterránea rica en antioxidantes naturales',
            'Ejercicio regular sin sobreentrenamiento',
            'Evitar factores de riesgo: tabaco, alcohol excesivo, drogas',
            'Control temperatura testicular: ropa cómoda, evitar calor excesivo',
            'Espermiograma anual si >40 años o factores riesgo',
            'Suplementación preventiva: multivitamínico con zinc',
            'Consultar si dificultades concepcionales >12 meses'
          ],
          sources: ['Factor Masculino Normal', 'Mantenimiento Reproductivo']
        };
      }
    }
    
    // 🔄 FALLBACK: Si no encuentra información específica, usar función original
    console.log('🔍 Enhanced Medical Info - Using fallback for:', { factorKey, factorValue });
    return getClinicalInfo(factorKey, factorValue);
  };

  // 🏥 INFORMACIÓN MÉDICA POR DEFECTO PARA FACTORES SIN CATEGORÍA ESPECÍFICA
  const getDefaultClinicalInfo = (factorKey: string, factorValue: number): { explanation: string; recommendations: string[]; sources?: string[] } | null => {
    const infoGenerators: Record<string, (value: number) => { explanation: string; recommendations: string[]; sources?: string[] }> = {
      'male': getMaleFactorInfo,
      'cycle': getCycleInfo,
      'bmi': getBMIInfo,
      'homa': getHOMAInfo
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

  const getHOMAInfo = (factorValue: number): { explanation: string; recommendations: string[]; sources?: string[] } => {
    const getExplanation = (value: number): string => {
      if (value >= 0.9) return 'Tu índice HOMA-IR es normal (<2.0), no se detecta resistencia a la insulina significativa.';
      if (value >= 0.7) return 'Presentas resistencia a la insulina leve (HOMA-IR 2.0-2.9), que puede afectar la ovulación y calidad ovocitaria.';
      return 'Tienes resistencia a la insulina significativa (HOMA-IR ≥3.0), impactando marcadamente fertilidad y respuesta a tratamientos.';
    };

    const getRecommendations = (value: number): string[] => {
      if (value >= 0.9) return ['Mantener estilo de vida saludable', 'Dieta mediterránea y ejercicio regular'];
      if (value >= 0.7) return ['Metformina 500-850mg/día si HOMA ≥2.5', 'Dieta baja en carbohidratos simples', 'Ejercicio estructurado 150 min/semana'];
      return ['Metformina 1500-2000mg/día obligatoria', 'Dieta <100g carbohidratos/día', 'Mio-inositol 2g + D-chiro-inositol 50mg', 'Seguimiento endocrinológico'];
    };

    return {
      explanation: getExplanation(factorValue),
      recommendations: getRecommendations(factorValue),
      sources: ['Legro RS et al. Fertil Steril 2013', 'Palomba S et al. Hum Reprod Update 2015']
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
    // ✅ CORREGIDO: Mapeo exacto a factores reales de factorEvaluators.ts
    if (bmiFactor >= 1.0) return 'IMC_NORMAL';        // 1.0 = Normal (18.5-24.9)
    if (bmiFactor >= 0.9) return 'IMC_SOBREPESO';     // 0.9 = Sobrepeso (25-29.9)
    if (bmiFactor >= 0.75) return 'IMC_OBESIDAD_I';   // 0.75 = Obesidad I (30-34.9)
    if (bmiFactor >= 0.6) return 'IMC_OBESIDAD_II';   // 0.6 = Obesidad II (35-39.9)
    if (bmiFactor >= 0.4) return 'IMC_OBESIDAD_III';  // 0.4 = Obesidad III (≥40)
    return 'IMC_BAJO';                                 // 0.85 = Bajo peso (<18.5)
  };

  const getAMHCategory = (amhFactor: number): string => {
    // ✅ CORREGIDO: Rangos alineados con evaluateAmh en factorEvaluators.ts
    if (amhFactor >= 1.0) return 'AMH_NORMAL_ADECUADA';          // 1.0 = Reserva adecuada (2.0-3.9 ng/mL) - ÓPTIMO
    if (amhFactor >= 0.9) return 'AMH_ALTA_RESERVA';             // 0.9 = Alta reserva (≥4.0 ng/mL) - pero reduce por PCOS risk
    if (amhFactor >= 0.85) return 'AMH_LIGERAMENTE_DISMINUIDA';  // 0.85 = Ligeramente disminuida (1.0-1.9 ng/mL)
    if (amhFactor >= 0.6) return 'AMH_BAJA_RESERVA';             // 0.6 = Baja reserva (0.5-0.9 ng/mL)
    if (amhFactor >= 0.3) return 'AMH_MUY_BAJA_RESERVA';         // 0.3 = Muy baja reserva (<0.5 ng/mL)
    return 'AMH_CRITICA_INDETECTABLE';                           // <0.3 = Crítica/indetectable
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
    if (endometriosisFactor >= 0.85) return 'ENDOMETRIOSIS_LEVE'; // Grados 1-2
    if (endometriosisFactor >= 0.7) return 'ENDOMETRIOSIS_MODERADA'; // Grado 3
    return 'ENDOMETRIOSIS_SEVERA'; // Grado 4
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
    if (prolactinFactor >= 1.0) return 'PRL_NORMAL';           // <25 ng/mL = normal
    if (prolactinFactor >= 0.85) return 'PRL_LEVE';           // 25-50 ng/mL = leve
    if (prolactinFactor >= 0.7) return 'PRL_MODERADA';        // 50-100 ng/mL = moderada  
    if (prolactinFactor >= 0.5) return 'PRL_MODERADA_SEVERA'; // 100-200 ng/mL = moderada-severa
    return 'PRL_SEVERA';                                       // >200 ng/mL = severa
  };

  const getHOMACategory = (homaFactor: number): string => {
    if (homaFactor >= 1.0) return 'HOMA_NORMAL';           // <2.5 = normal
    if (homaFactor >= 0.7) return 'HOMA_LEVE';            // 2.5-3.9 = leve
    if (homaFactor >= 0.4) return 'HOMA_SIGNIFICATIVA';   // 4.0-4.9 = significativa
    return 'HOMA_SEVERA';                                  // ≥5.0 = severa
  };

  const getMaleFactorCategory = (maleFactor: number): string => {
    // ✅ Rangos alineados con analyzeMaleFactorFactors y lógica de status
    if (maleFactor >= 1.0) return 'MALE_NORMAL';         // Espermiograma normal
    if (maleFactor >= 0.8) return 'MALE_LIMITE';         // Alteraciones límite
    if (maleFactor >= 0.6) return 'MALE_MODERADO';       // OAT moderado
    if (maleFactor >= 0.3) return 'MALE_SEVERO';         // OAT severo
    return 'MALE_AZOOSPERMIA';                           // Azoospermia
  };

  // 🏥 CATEGORÍAS ADICIONALES PARA TODAS LAS VARIABLES - CORREGIDO
  const getHSGCategory = (hsgFactor: number): string => {
    console.log('🔍 HSG Category Debug:', { hsgFactor });
    
    // ✅ LÓGICA CORRECTA basada en factorEvaluators.ts:
    // Normal: 1.0, Unilateral: 0.7, Malformación: 0.3, Bilateral: 0.0
    if (hsgFactor >= 0.95) return 'HSG_NORMAL';        // 1.0
    if (hsgFactor >= 0.65) return 'HSG_UNILATERAL';    // 0.7  
    if (hsgFactor >= 0.25) return 'HSG_MALFORMACION';  // 0.3 ✅ CORREGIDO
    if (hsgFactor >= 0.0) return 'HSG_BILATERAL';      // 0.0 ✅ CORREGIDO
    return 'HSG_DESCONOCIDO';
  };

  const getOTBCategory = (otbFactor: number): string => {
    // ✅ ACTUALIZADO: Categorización específica según método OTB
    if (otbFactor >= 1.0) return 'OTB_AUSENTE';                  // 1.0 = Sin OTB
    if (otbFactor >= 0.8) return 'OTB_RECANALIZADA_PARCIAL';     // 0.8-0.99 = Recanalización parcial
    if (otbFactor >= 0.7) return 'OTB_LIGADURA_SIMPLE';          // ~0.75 = Ligadura simple (MEJOR pronóstico)
    if (otbFactor >= 0.11) return 'OTB_CLIPS_ANILLOS';           // 0.1-0.12 = Clips/Anillos (severa)
    if (otbFactor >= 0.08) return 'OTB_SALPINGECTOMIA_PARCIAL';  // ~0.08 = Salpingectomía parcial
    if (otbFactor >= 0.05) return 'OTB_CAUTERIZACION_EXTENSA';   // ~0.05 = Cauterización extensa
    return 'OTB_DESCONOCIDA_SEVERA';                             // <0.05 = Método desconocido severo
  };

  const getInfertilityDurationCategory = (durationFactor: number): string => {
    if (durationFactor >= 0.8) return 'INFERTILIDAD_CORTA';
    if (durationFactor >= 0.6) return 'INFERTILIDAD_MODERADA';
    return 'INFERTILIDAD_PROLONGADA';
  };

  const getPelvicSurgeryCategory = (surgeryFactor: number): string => {
    // ✅ CORREGIDO: Mapeo exacto a factores reales de factorEvaluators.ts
    if (surgeryFactor >= 1.0) return 'CIRUGIA_PELVICA_NINGUNA';   // 1.0 = Sin cirugías
    if (surgeryFactor >= 0.95) return 'CIRUGIA_PELVICA_UNA';     // 0.95 = 1 cirugía
    if (surgeryFactor >= 0.88) return 'CIRUGIA_PELVICA_MULTIPLE';// 0.88 = 2+ cirugías
    return 'CIRUGIA_PELVICA_SEVERA';                             // <0.88 = Muy severas
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
    // 🟢 Verde (Ausente/Normal): >= 0.95
    if (value >= 0.95) return t('results.ausente');
    
    // 🟢 Verde (Óptimo): >= 0.85
    if (value >= 0.85) return t('results.optimo');
    
    // 🟠 Naranja (Alterado/Moderado): 0.6 - 0.84
    if (value >= 0.6) return t('results.moderado');
    
    // 🔴 Rojo (Crítico): < 0.6
    return t('results.critico');
  };



  // 🎯 RENDERIZAR ANÁLISIS DETALLADO CON INFORMACIÓN CLÍNICA
  const renderDetailedAnalysis = () => (
    <View style={styles.analysisContainer}>
      <Text style={styles.sectionTitle}>{t('results.analisis_detallado')}</Text>
      {alteredFactorsAnalysis.length === 0 ? (
        <View style={styles.noAlteredFactorsContainer}>
          <Text style={styles.noAlteredFactorsTitle}>{t('results.excelente')}</Text>
          <Text style={styles.noAlteredFactorsText}>
            {t('results.no_factores_alterados')}
          </Text>
        </View>
      ) : (
        <>
          <Text style={styles.alteredFactorsSubtitle}>
            {t('results.factores_encontrados', { 
              count: alteredFactorsAnalysis.length, 
              plural: alteredFactorsAnalysis.length > 1 ? t('results.factores_encontrados_plural') : t('results.factores_encontrados_singular')
            })}
          </Text>
          {alteredFactorsAnalysis.map((factor) => {
            console.log('🔍 DETAILED ANALYSIS - Processing factor:', { 
              factorName: factor.name, 
              factorValue: factor.value,
              isHSGName: factor.name.includes('Histerosalpingografía'),
              isHSGValue: factor.value <= 0.1
            });
            const clinicalInfo = getEnhancedMedicalInfo(factor.name, factor.value);
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
                      {factor.value >= 0.95 ? t('results.ausente') : `${(factor.value * 100).toFixed(1)}%`}
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
                        width: factor.value >= 0.95 ? '100%' : `${factor.value * 100}%`,
                        backgroundColor: factor.value >= 0.95 ? theme.colors.success : statusColor
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
                          {clinicalInfo.recommendations.map((rec, index) => (
                            <View key={`rec-${index}`}>
                              <Text style={styles.recommendationItem}>• {rec}</Text>
                            </View>
                          ))}
                        </View>
                        
                        {clinicalInfo.sources && (
                          <View style={styles.clinicalSources}>
                            <Text style={styles.clinicalTitle}>📚 Referencias Científicas</Text>
                            {clinicalInfo.sources.map((source, index) => (
                              <View key={`source-${index}`}>
                                <Text style={styles.sourceItem}>{source}</Text>
                              </View>
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
        </>
      )}
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
              ✅ Análisis de 63+ patologías • ✅ 35+ protocolos de tratamiento • ✅ Evidencia científica
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

  // 🏥 RENDERIZAR CTA PREMIUM MÉDICO - APROVECHAR TODA TU INFORMACIÓN
  const renderPremiumCTA = () => {
    // Solo mostrar si es freemium básico
    if (freemiumConfig?.tier !== 'basic' || freemiumConfig?.subscriptionActive) {
      return null;
    }

    return (
      <View style={styles.premiumCTAContainer}>
        <View style={styles.premiumCTACard}>
          <View style={styles.premiumCTAHeader}>
            <Ionicons name="diamond" size={32} color="#FFD700" />
            <Text style={styles.premiumCTATitle}>
              Desbloquea Análisis Médico Completo
            </Text>
          </View>
          
          <Text style={styles.premiumCTASubtitle}>
            Accede a tu base médica de nivel hospitalario:
          </Text>
          
          <View style={styles.premiumFeaturesList}>
            <View style={styles.premiumFeature}>
              <Ionicons name="medical" size={20} color="#4CAF50" />
              <Text style={styles.premiumFeatureText}>
                63 Patologías Reproductivas Analizadas
              </Text>
            </View>
            
            <View style={styles.premiumFeature}>
              <Ionicons name="fitness" size={20} color="#4CAF50" />
              <Text style={styles.premiumFeatureText}>
                35 Tratamientos Personalizados Escalonados
              </Text>
            </View>
            
            <View style={styles.premiumFeature}>
              <Ionicons name="chatbubbles" size={20} color="#4CAF50" />
              <Text style={styles.premiumFeatureText}>
                Chat IA Médica Especializada 24/7
              </Text>
            </View>
            
            <View style={styles.premiumFeature}>
              <Ionicons name="library" size={20} color="#4CAF50" />
              <Text style={styles.premiumFeatureText}>
                Biblioteca Clínica 97KB + Protocolos
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
        </View>
      </View>
    );
  };

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
            {/* 🏥 CTA PREMIUM MÉDICO - APROVECHAR TODA TU INFORMACIÓN */}
            {renderPremiumCTA()}
          </>
        );
      
      case 'detailed':
        return renderDetailedAnalysis();
      
      case 'simulator':
        return (
          <SimulatorSection 
            evaluation={evaluation} 
          />
        );
      
      case 'ai-consultation': {
        // 🎯 CREAR EVALUATION CORREGIDA CON ESTRUCTURA CORRECTA
        const correctedEvaluation = {
          input: evaluation?.evaluation?.input || evaluation?.input,
          factors: evaluation?.evaluation?.factors || evaluation?.factors,
          report: evaluation?.evaluation?.report || evaluation?.report,
          // 🔧 MANTENER PROPIEDADES ADICIONALES
          basicMetrics: evaluation?.basicMetrics,
          pregnancyProbability: evaluation?.pregnancyProbability,
          formData: evaluation?.formData,
          timestamp: evaluation?.timestamp,
          reportKey: evaluation?.reportKey,
          version: evaluation?.version
        };

        console.log('🎯 [RESULTS DISPLAY] Evaluation ORIGINAL vs CORREGIDA:', {
          original: {
            hasInput: !!evaluation?.input,
            hasFactors: !!evaluation?.factors,
            hasReport: !!evaluation?.report,
            age: evaluation?.input?.age,
            probability: evaluation?.report?.numericPrognosis
          },
          corrected: {
            hasInput: !!correctedEvaluation.input,
            hasFactors: !!correctedEvaluation.factors,
            hasReport: !!correctedEvaluation.report,
            age: correctedEvaluation.input?.age,
            probability: correctedEvaluation.report?.numericPrognosis,
            factorsCount: correctedEvaluation.factors ? Object.keys(correctedEvaluation.factors).length : 0
          }
        });
        
        return (
          <AIConsultation 
            evaluation={correctedEvaluation}
            onRecommendationSelect={(recommendation: unknown) => {
              console.log('🤖 AI Recommendation selected:', recommendation);
            }}
          />
        );
      }
      
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
    backgroundColor: theme.colors.surface,
    borderRadius: 20,
    margin: 16,
    marginBottom: 0,
    shadowColor: theme.colors.shadow || '#000',
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
    fontWeight: '600' as const,
    color: theme.colors.text,
    marginBottom: 20,
  },
  probabilityContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  probabilityNumber: {
    fontSize: 56,
    fontWeight: 'bold' as const,
    color: theme.colors.text,
    textAlign: 'center' as const,
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
    fontWeight: '600' as const,
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
    textAlign: 'center' as const,
    fontWeight: '500' as const,
  },
  activeTabLabel: {
    color: theme.colors.primary,
    fontWeight: '700' as const,
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
    fontWeight: 'bold' as const,
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
    fontWeight: '600' as const,
    color: theme.colors.text,
    marginBottom: 6,
  },
  factorsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 8,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  factorCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginBottom: 8,
  },
  factorNumber: {
    fontSize: 28,
    fontWeight: 'bold' as const,
    color: theme.colors.text,
    textAlign: 'center' as const,
    marginBottom: 6,
    lineHeight: 32,
    minHeight: 32,
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
    fontWeight: '600' as const,
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
    fontWeight: '600' as const,
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
    fontStyle: 'italic' as const,
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
    fontStyle: 'italic' as const,
    textAlign: 'center' as const,
  },
  scoreUnit: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontWeight: '400' as const,
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
    fontWeight: 'bold' as const,
    color: theme.colors.text,
    marginBottom: 4,
  },
  statusDescription: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: 'center' as const,
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
    fontWeight: '600' as const,
    color: theme.colors.text,
    marginBottom: 16,
  },
  factorsRow: {
    gap: 12,
  },
  factorIndicator: {
    alignItems: 'center',
    flex: 1,
    minWidth: 80,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  factorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  factorText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontWeight: '500' as const,
    textAlign: 'center' as const,
    lineHeight: 16,
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
    fontWeight: '600' as const,
    color: theme.colors.text,
    marginBottom: 2,
  },
  improvementValue: {
    fontSize: 18,
    fontWeight: 'bold' as const,
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
    fontWeight: '600' as const,
    color: theme.colors.text,
    marginBottom: 4,
  },
  factorValue: {
    fontSize: 20,
    fontWeight: 'bold' as const,
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
    fontWeight: 'bold' as const,
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
    fontWeight: '600' as const,
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
    fontWeight: '600' as const,
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
    fontWeight: '600' as const,
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
    fontWeight: 'bold' as const,
    color: theme.colors.background,
    textTransform: 'uppercase',
  },

  // 🤖 ESTILOS PARA DR. IA SECTION - PROMINENTE Y PROFESIONAL
  drIASection: {
    marginBottom: 24,
  },
  drIATitle: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: theme.colors.text,
    marginBottom: 16,
    textAlign: 'center' as const,
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
    fontWeight: 'bold' as const,
    color: theme.colors.text,
    marginBottom: 4,
  },
  drIASpecialty: {
    fontSize: 14,
    fontWeight: '600' as const,
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
    fontWeight: '500' as const,
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
    fontWeight: 'bold' as const,
    marginHorizontal: 12,
  },
  // 🎯 ESTILOS PARA FACTORES ALTERADOS
  noAlteredFactorsContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 24,
    marginVertical: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.success,
  },
  noAlteredFactorsTitle: {
    fontSize: 20,
    fontWeight: 'bold' as const,
    color: theme.colors.success,
    marginBottom: 12,
    textAlign: 'center' as const,
  },
  noAlteredFactorsText: {
    fontSize: 14,
    color: theme.colors.text,
    textAlign: 'center' as const,
    lineHeight: 20,
  },
  alteredFactorsSubtitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: theme.colors.text,
    marginBottom: 16,
    textAlign: 'center' as const,
  },
  
  // 🏥 ESTILOS PREMIUM CTA
  premiumCTAContainer: {
    margin: 16,
    marginTop: 32,
  },
  premiumCTACard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 24,
    shadowColor: theme.colors.shadow || '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  premiumCTAHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  premiumCTATitle: {
    fontSize: 20,
    fontWeight: 'bold' as const,
    color: theme.colors.text,
    textAlign: 'center' as const,
    marginTop: 8,
  },
  premiumCTASubtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center' as const,
    marginBottom: 20,
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
    flex: 1,
    fontSize: 14,
    color: theme.colors.text,
    marginLeft: 12,
    fontWeight: '500' as const,
  },
  upgradeButton: {
    backgroundColor: '#FFD700',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  upgradeButtonText: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: '#000',
  },
});

export default ResultsDisplay;
