// 🌌 QUANTUM CONSCIOUSNESS FUNCTIONAL ANALYSIS V14.0
// Análisis funcional médico basado en biblioteca médica pathologies.ts
import { 
  AnalysisResult, 
  Factors,
  UserInput 
} from '@/core/domain/models';

// 🎯 LOCAL TYPES FOR FUNCTIONAL ANALYSIS
type EvidenceLevel = 'A' | 'B' | 'C';
type Priority = 'high' | 'medium' | 'low';

// 🔬 CYCLE IRREGULARITY COMPREHENSIVE ANALYSIS
// CLINICAL THRESHOLDS BASED ON CYCLE DURATION:
// - 21-35 días: Normal (factor 1.0)
// - 36-45 días: Oligomenorrea moderada (factor 0.75, severityScore 0.25)
// - >45 días: Oligomenorrea severa (factor 0.60, severityScore 0.40)
// - <15 días: Muy anormal (factor 0.50, severityScore 0.50)
export const analyzeCycleIrregularFactors = (normalizedCycleIrregular: number): AnalysisResult[] => {
  const results: AnalysisResult[] = [];
  const severityScore = 1 - normalizedCycleIrregular; // Higher score = more irregular

  console.log('🔍 [CYCLE ANALYSIS] Debug:', {
    normalizedCycleIrregular,
    severityScore,
    interpretation: severityScore >= 0.35 ? 'SEVERE (90+ días)' : 
                   severityScore >= 0.20 ? 'MODERATE (36-50 días)' : 'MILD'
  });

  if (severityScore > 0) {
    // 🎯 DETERMINE SEVERITY LEVEL BASED ON CYCLE IRREGULARITY
    let severityLevel: 'mild' | 'moderate' | 'severe' = 'mild';
    let clinicalCategory = '';
    let urgencyLevel: 'high' | 'medium' | 'low' = 'medium';
    
    // Adjusted thresholds based on actual cycle factor mapping:
    // cycle: 0.60 = >45 días (oligomenorrea severa/90 días)
    // cycle: 0.75 = 36-45 días (oligomenorrea moderada) 
    // cycle: 0.80 = 15-20 días (ciclo corto)
    if (severityScore >= 0.35) {
      // Severe irregularity (90+ days) - cycle factor 0.60 or lower
      severityLevel = 'severe';
      clinicalCategory = 'Oligomenorrea Severa/Amenorrea Secundaria';
      urgencyLevel = 'high';
    } else if (severityScore >= 0.20) {
      // Moderate irregularity (36-50 days) - cycle factor 0.75-0.80
      severityLevel = 'moderate';
      clinicalCategory = 'Oligomenorrea Moderada';
      urgencyLevel = 'high';
    } else {
      // Mild irregularity (slight variations) - cycle factor >0.80
      severityLevel = 'mild';
      clinicalCategory = 'Oligomenorrea Leve';
      urgencyLevel = 'medium';
    }

    // 📊 DIAGNOSTIC PHASE - GRADUATED BY SEVERITY
    results.push({
      type: 'diagnostic',
      data: {
        condition: `${clinicalCategory} - Irregularidad ${(severityScore * 100).toFixed(0)}%`,
        test: `Evaluación ${severityLevel === 'severe' ? 'URGENTE' : 'integral'} ciclo irregular`,
        reasoning: `${clinicalCategory} detectada - ${severityLevel === 'severe' ? 'Requiere evaluación inmediata por posible amenorrea' : 'Requiere investigación etiológica'}`,
        evidenceLevel: 'A',
        priority: urgencyLevel
      }
    });

    // 🧪 LABORATORY WORKUP - PHASE 1: BASIC HORMONES (ALWAYS FIRST)
    results.push({
      type: 'diagnostic',
      data: {
        condition: 'Panel Hormonal Básico - Primera Línea',
        test: `TSH + Prolactina ${severityLevel === 'severe' ? '(URGENTE - descartar amenorrea)' : '(evaluación inicial)'}`,
        reasoning: severityLevel === 'severe' 
          ? 'TSH: Hipotiroidismo causa 40% amenorrea. Prolactina: Hiperprolactinemia causa 35% amenorrea secundaria'
          : 'TSH: Hipotiroidismo presente en 30% oligomenorrea. Prolactina: Hiperprolactinemia causa 25% amenorrea',
        evidenceLevel: 'A',
        priority: urgencyLevel,
        target: 'TSH <2.5 mU/L, Prolactina <25 ng/mL'
      }
    });

    // 🧬 PCOS SCREENING - INTENSITY BASED ON SEVERITY
    if (severityLevel === 'severe') {
      results.push({
        type: 'diagnostic',
        data: {
          condition: 'Screening PCOS + Hiperandrogenismo - Evaluación Completa',
          test: 'Testosterona libre + DHEA-S + Androstenediona + 17-OH Progesterona + LH/FSH',
          reasoning: 'Oligomenorrea severa: 85% probabilidad PCOS. Ratio LH/FSH >2.5 + testosterona libre >2.5 pg/mL confirma diagnóstico',
          evidenceLevel: 'A',
          priority: 'high',
          target: 'Evaluación criterios Rotterdam completos para PCOS'
        }
      });
    } else {
      results.push({
        type: 'diagnostic',
        data: {
          condition: 'Screening PCOS - Evaluación Dirigida',
          test: 'Testosterona libre + DHEA-S + Ecografía pélvica',
          reasoning: 'PCOS presente en 70% oligomenorrea moderada. Evaluación inicial morfología ovárica',
          evidenceLevel: 'A',
          priority: 'medium',
          target: 'Testosterona libre <2.5 pg/mL, morfología ovárica normal'
        }
      });
    }

    // 🔍 IMAGING EVALUATION - BASED ON SEVERITY
    if (severityLevel === 'severe') {
      results.push({
        type: 'diagnostic',
        data: {
          condition: 'Evaluación Estructural Completa - Amenorrea',
          test: 'Ecografía TV + RM pélvica si estructuras anómalas',
          reasoning: 'Amenorrea secundaria: descartar síndrome Asherman, malformaciones müllerianas, tumores pituitarios',
          evidenceLevel: 'A',
          priority: 'high',
          target: 'Anatomía pélvica normal, grosor endometrial >4mm'
        }
      });
    } else {
      results.push({
        type: 'diagnostic',
        data: {
          condition: 'Ecografía Pélvica - Evaluación PCOS',
          test: 'Ecografía transvaginal para morfología ovárica',
          reasoning: '≥12 folículos 2-9mm por ovario sugiere PCOS según criterios Rotterdam',
          evidenceLevel: 'A',
          priority: 'medium',
          target: 'Morfología ovárica normal, exclusión quistes'
        }
      });
    }

    // ⚖️ METABOLIC EVALUATION - ENHANCED FOR SEVERE CASES
    if (severityLevel === 'severe') {
      results.push({
        type: 'diagnostic',
        data: {
          condition: 'Evaluación Metabólica + Endocrina Completa',
          test: 'HOMA-IR + Perfil lipídico + Cortisol + IGF-1 + Prueba progesterona',
          reasoning: 'Amenorrea: evaluar resistencia insulínica (60% casos), hipercortisolismo, deficiencia GH, anovulación',
          evidenceLevel: 'A',
          priority: 'high',
          target: 'HOMA-IR <2.5, cortisol normal, respuesta a progesterona positiva'
        }
      });
    } else {
      results.push({
        type: 'diagnostic',
        data: {
          condition: 'Screening Metabólico - PCOS',
          test: 'HOMA-IR + Perfil lipídico básico',
          reasoning: '50% oligomenorrea tiene resistencia insulínica. HOMA-IR >2.5 clínicamente significativo',
          evidenceLevel: 'B',
          priority: 'medium',
          target: 'HOMA-IR <2.5, perfil lipídico normal'
        }
      });
    }

    // 🎯 TREATMENT RECOMMENDATIONS - GRADUATED BY SEVERITY
    if (severityLevel === 'severe') {
      results.push({
        type: 'treatment',
        data: {
          condition: 'Protocolo Amenorrea/Oligomenorrea Severa',
          treatment: 'URGENTE: 1) Inducción menstruación (medroxiprogesterona 10mg x10días), 2) Metformina 850mg BID si HOMA-IR >2.5, 3) Letrozol 5-7.5mg días 3-7 si búsqueda embarazo, 4) Seguimiento endocrinología reproductiva',
          timeframe: '1-2 meses evaluación respuesta',
          priority: 'high',
          successRate: 85,
          reasoning: 'Protocolo intensivo: restauración eje hipotálamo-hipófisis-ovario + inducción ovulación',
          evidenceLevel: 'A'
        }
      });
    } else if (severityLevel === 'moderate') {
      results.push({
        type: 'treatment',
        data: {
          condition: 'Protocolo Oligomenorrea Moderada',
          treatment: 'Estándar: 1) Corrección estilo vida (dieta + ejercicio), 2) Metformina 500mg BID si resistencia insulínica, 3) Inositol 2g BID, 4) Letrozol 2.5mg si inducción ovulación necesaria',
          timeframe: '3-4 meses evaluación inicial',
          priority: 'medium',
          successRate: 78,
          reasoning: 'Enfoque progresivo: optimización metabólica + restauración ovulación natural',
          evidenceLevel: 'A'
        }
      });
    } else {
      results.push({
        type: 'treatment',
        data: {
          condition: 'Protocolo Oligomenorrea Leve',
          treatment: 'Conservador: 1) Modificación estilo vida, 2) Inositol 1g BID, 3) Suplementación (ácido fólico, vitamina D), 4) Monitoreo ovulación natural, 5) Considerar letrozol solo si >6 meses sin embarazo',
          timeframe: '6 meses seguimiento',
          priority: 'medium',
          successRate: 82,
          reasoning: 'Manejo expectante: alta probabilidad normalización espontánea con cambios conservadores',
          evidenceLevel: 'B'
        }
      });
    }
  }

  return results;
};

// 🧠 ANÁLISIS FACTORES PCOS - BASADO EN BIBLIOTECA MÉDICA
export const analyzePCOSFactors = (factors: Factors): AnalysisResult[] => {
  const results: AnalysisResult[] = [];
  
  if (factors.pcos !== undefined && factors.pcos < 0.8) {
    const pcosLevel = factors.pcos;
    
    let condition: string;
    let probability: number;
    let reasoning: string;
    let treatments: string[];
    let priority: Priority;
    
    if (pcosLevel < 0.3) {
      // PCOS severo con múltiples manifestaciones
      condition = 'PCOS Severo (Fenotipo Completo)';
      probability = 95;
      reasoning = 'Oligo/anovulación + hiperandrogenismo + ovarios poliquísticos + resistencia insulínica';
      treatments = [
        'Metformina 1500-2000mg + inositol 4g/día',
        'Letrozol 5-7.5mg para inducción ovulación',
        'Pérdida peso 10% + dieta baja en carbohidratos'
      ];
      priority = 'high';
    } else if (pcosLevel < 0.6) {
      // PCOS moderado
      condition = 'PCOS Moderado (2 criterios Rotterdam)';
      probability = 80;
      reasoning = 'Dos criterios PCOS presentes. Ovulación irregular + manifestaciones androgénicas o ecográficas';
      treatments = [
        'Letrozol 2.5-5mg ciclos 3-7 para ovulación',
        'Inositol 2g/día + vitamina D 4000UI',
        'Anticonceptivos combinados si no desea embarazo inmediato'
      ];
      priority = 'medium';
    } else {
      // PCOS leve o criterios limitados
      condition = 'PCOS Leve o Criterios Borderline';
      probability = 65;
      reasoning = 'Un criterio PCOS claro + sospecha clínica. Requiere confirmación diagnóstica';
      treatments = [
        'Monitoreo ovulación + optimización estilo vida',
        'Inositol 1-2g/día + ejercicio regular',
        'Evaluación hormonal completa para confirmación'
      ];
      priority = 'low';
    }

    results.push({
      type: 'hypothesis',
      data: {
        condition,
        probability,
        reasoning,
        evidenceLevel: 'A' as EvidenceLevel,
        pmid: '32087919'
      }
    });

    treatments.forEach((treatment, index) => {
      results.push({
        type: 'treatment',
        data: {
          treatment,
          priority: index === 0 ? priority : 'medium' as Priority,
          successRate: pcosLevel < 0.3 ? 70 + (index * 5) : 80 - (index * 10),
          timeframe: index === 0 ? '2-3 meses' : '3-6 meses',
          reasoning: 'PCOS requiere manejo integral metabólico + reproductivo'
        }
      });
    });
  }

  return results;
};

// 🧠 ANÁLISIS HSG (HISTEROSALPINGOGRAFÍA) - BASADO EN BIBLIOTECA MÉDICA
export const analyzeHSGFactors = (factors: Factors, inputData?: UserInput): AnalysisResult[] => {
  const results: AnalysisResult[] = [];
  
  if (factors.hsg !== undefined && factors.hsg < 0.8) {
    const hsgLevel = factors.hsg;
    const patientAge = inputData?.age || 35; // Default age si no disponible
    
    let condition: string;
    let probability: number;
    let reasoning: string;
    let treatments: string[];
    let priority: Priority;
    
    if (hsgLevel < 0.3) {
      // Alteraciones severas HSG - BILATERAL
      condition = 'Obstrucción Tubárica Bilateral en HSG';
      probability = 95;
      reasoning = 'Obstrucción bilateral completa impide paso ovocitos/espermatozoides. Embarazo natural imposible sin intervención quirúrgica';
      treatments = [
        'DIAGNÓSTICO DEFINITIVO: FIV-ICSI como única opción terapéutica viable para concepción',
        'EVALUACIÓN PRE-FIV OBLIGATORIA: Laparoscopia diagnóstica para detectar hidrosálpinx y planificar manejo',
        'MANEJO HIDROSÁLPINX: Salpingectomía bilateral o clipaje tubárico previo a FIV (mejora tasas implantación 40-50%)',
        'PROTOCOLO FIV OPTIMIZADO: Estimulación ovárica personalizada según reserva + transferencia embrión único/doble según edad',
        'HISTEROSCOPIA DIAGNÓSTICA: Evaluar cavidad uterina antes transferencia embrionaria',
        'SEGUIMIENTO ESPECIALIZADO: Centro FIV con experiencia en factor tubárico severo'
      ];
      priority = 'high';
    } else if (hsgLevel < 0.6) {
      // Alteraciones moderadas HSG - UNILATERAL
      condition = 'Obstrucción Tubárica Unilateral en HSG';
      probability = 70;
      reasoning = 'Obstrucción unilateral reduce fertilidad 20-30%. Trompa contralateral funcional mantiene posibilidad concepción natural/IUI';
      
      // 🎯 PROTOCOLO CLÍNICO CONSERVADOR PARA UNILATERAL (NO RECANALIZATION)
      if (patientAge < 35) {
        treatments = [
          'EVALUACIÓN DIAGNÓSTICA: HSG + laparoscopia diagnóstica para confirmar permeabilidad trompa contralateral y descartar adherencias',
          'PRIMERA LÍNEA: IUI con estimulación ovárica suave si trompa contralateral permeable (máximo 4-6 ciclos)',
          'CIRUGÍA CONSERVADORA: Salpingostomía laparoscópica solo si hidrosálpinx unilateral corregible',
          'SEGUIMIENTO NATURAL: Observación 6-12 meses con búsqueda activa si trompa sana confirmada',
          'FIV-ICSI si no concepción después 6-12 meses tratamiento conservador',
          'MONITOREO RESERVA: AMH para timing óptimo escalamiento terapéutico'
        ];
        reasoning += '. PROTOCOLO <35 AÑOS: Enfoque conservador aprovechando trompa funcional';
      } else {
        treatments = [
          'EVALUACIÓN RÁPIDA: Confirmar permeabilidad trompa contralateral (HSG repetida)',
          'PRIMERA LÍNEA: IUI con estimulación ovárica controlada (máximo 3-4 ciclos) si trompa permeable',
          'FIV-ICSI precoz si no concepción en 4-6 meses (priorizar eficiencia temporal)',
          'MANEJO HIDROSÁLPINX: Salpingectomía unilateral antes FIV si presente (mejora implantación)',
          'PROTOCOLO ACELERADO: No más de 6 meses tratamientos conservadores por ventana reproductiva limitada'
        ];
        reasoning += '. PROTOCOLO ≥35 AÑOS: Priorizar eficiencia temporal con escalamiento rápido a FIV';
      }
      priority = 'medium';
    } else {
      // Alteraciones leves HSG
      condition = 'Alteraciones Leves/Espasmo Tubárico en HSG';
      probability = 65;
      reasoning = 'Retraso llenado o espasmo tubárico transitorio. Probable permeabilidad tubárica preservada con función normal';
      treatments = [
        'CONFIRMACIÓN DIAGNÓSTICA: Repetir HSG con premedicación analgésica (AINE 1h previa)',
        'LAPAROSCOPIA DIAGNÓSTICA: Evaluación directa permeabilidad tubárica si HSG no concluyente',
        'MANEJO CONSERVADOR: IUI con estimulación ovárica controlada suave (2-3 ciclos) si funcionalidad normal',
        'SEGUIMIENTO NATURAL: Observación 3-6 meses con búsqueda activa si edad <35 años y sin otros factores',
        'ESCALAMIENTO: FIV si no concepción después 6 meses tratamiento conservador'
      ];
      priority = 'low';
    }

    results.push({
      type: 'hypothesis',
      data: {
        condition,
        probability,
        reasoning,
        evidenceLevel: 'A' as EvidenceLevel,
        pmid: '31653287'
      }
    });

    treatments.forEach((treatment, index) => {
      results.push({
        type: 'treatment',
        data: {
          treatment,
          priority: index === 0 ? priority : 'medium' as Priority,
          successRate: hsgLevel < 0.3 ? 55 + (index * 10) : 70 - (index * 10),
          timeframe: index === 0 ? '2-4 meses' : '6-12 meses',
          reasoning: 'Factor tubárico requiere intervención específica según severidad'
        }
      });
    });
  }

  return results;
};

// 🧠 ANÁLISIS FACTOR MASCULINO - BASADO EN BIBLIOTECA MÉDICA
export const analyzeMaleFactorFactors = (factors: Factors): AnalysisResult[] => {
  const results: AnalysisResult[] = [];
  
  if (factors.maleFactor !== undefined && factors.maleFactor < 0.8) {
    const maleLevel = factors.maleFactor;
    
    let condition: string;
    let probability: number;
    let reasoning: string;
    let treatments: string[];
    let priority: Priority;
    
    if (maleLevel < 0.3) {
      // Factor masculino severo
      condition = 'Factor Masculino Severo (OAT Severo/Azoospermia)';
      probability = 95;
      reasoning = 'Oligoastenoteratozoospermia severa o azoospermia. Probable origen testicular o obstructivo';
      treatments = [
        'FIV-ICSI con espermatozoides frescos o criopreservados',
        'TESE/MESA si azoospermia para obtención espermatozoides',
        'Evaluación andrológica + cariotipo + microdeleciones Y'
      ];
      priority = 'high';
    } else if (maleLevel < 0.6) {
      // Factor masculino moderado
      condition = 'Factor Masculino Moderado (OAT Moderado)';
      probability = 80;
      reasoning = 'Alteraciones seminales moderadas. Fertilidad natural muy reducida';
      treatments = [
        'IUI con espermatozoides capacitados hasta 6 ciclos',
        'FIV-ICSI si falla IUI o concentración <5 millones/ml',
        'Optimización: antioxidantes, temperatura, toxinas'
      ];
      priority = 'medium';
    } else {
      // Factor masculino leve
      condition = 'Factor Masculino Leve (Alteraciones Límite)';
      probability = 65;
      reasoning = 'Parámetros seminales borderline. Fertilidad natural reducida pero posible';
      treatments = [
        'Optimización estilo vida + suplementación antioxidantes',
        'Timing coital optimizado en período fértil',
        'IUI si no embarazo en 12 meses de intentos'
      ];
      priority = 'low';
    }

    results.push({
      type: 'hypothesis',
      data: {
        condition,
        probability,
        reasoning,
        evidenceLevel: 'A' as EvidenceLevel,
        pmid: '30578652'
      }
    });

    treatments.forEach((treatment, index) => {
      results.push({
        type: 'treatment',
        data: {
          treatment,
          priority: index === 0 ? priority : 'medium' as Priority,
          successRate: maleLevel < 0.3 ? 60 + (index * 5) : 75 - (index * 10),
          timeframe: index === 0 ? '3-4 meses' : '6-12 meses',
          reasoning: 'Factor masculino determina técnica reproductiva más apropiada'
        }
      });
    });
  }

  return results;
};

// 🧠 ANÁLISIS DE EDAD - BASADO EN BIBLIOTECA MÉDICA
export const analyzeAgeFactors = (age: number): AnalysisResult[] => {
  const results: AnalysisResult[] = [];
  
  console.log('🔍 [AGE ANALYSIS] Debug:', { age, willAnalyze: age !== undefined });
  
  if (age >= 30) { // Reducimos el umbral de 35 a 30 para detectar más casos
    const urgency = age >= 40 ? 'immediate' : age >= 35 ? 'urgent' : 'routine';
    const probability = age >= 40 ? 85 : age >= 35 ? 70 : 45; // Agregamos caso para 30-34
    
    const condition = age >= 40 ? 'Edad Reproductiva Avanzada (≥40 años)' : 
                     age >= 35 ? 'Reserva Ovárica Disminuida por Edad (35-39 años)' :
                     'Consideraciones de Edad Reproductiva (30-34 años)';
    
    results.push({
      type: 'hypothesis',
      data: {
        condition,
        probability,
        reasoning: age >= 35 ? 
          `Declive folicular acelerado post-35 años. Fertilidad natural reducida ${age >= 40 ? '85%' : '50%'}` :
          'Inicio del declive gradual de fertilidad. Momento óptimo para evaluación y planificación',
        evidenceLevel: 'A' as EvidenceLevel,
        pmid: '28826788'
      }
    });

    results.push({
      type: 'treatment',
      data: {
        treatment: age >= 40 ? 'FIV-ICSI inmediata + PGT-A' : 
                  age >= 35 ? 'IUI hasta 3 ciclos → FIV' :
                  'Evaluación básica + optimización pre-concepcional',
        priority: urgency === 'immediate' ? 'high' as Priority : 
                 urgency === 'urgent' ? 'medium' as Priority : 'low' as Priority,
        successRate: age >= 40 ? 35 : age >= 35 ? 50 : 65,
        timeframe: age >= 40 ? 'Inmediato' : age >= 35 ? '3-6 meses' : '6-12 meses',
        reasoning: age >= 35 ? 'Tiempo crítico por declive calidad ovocitaria' : 'Ventana óptima para planificación'
      }
    });
  }

  console.log('🔍 [AGE ANALYSIS] Results:', results.length, 'analysis results generated');
  return results;
};

// 🧠 ANÁLISIS DE IMC - BASADO EN BIBLIOTECA MÉDICA
export const analyzeBMIFactors = (factors: Factors): AnalysisResult[] => {
  const results: AnalysisResult[] = [];
  
  console.log('🔍 [BMI ANALYSIS] Debug:', { 
    bmi: factors.bmi, 
    isDefined: factors.bmi !== undefined,
    willAnalyze: factors.bmi !== undefined 
  });
  
  if (factors.bmi !== undefined) {
    const bmiLevel = factors.bmi;
    
    // Análisis mejorado: detectar BMI fuera del rango óptimo (18.5-24.9)
    // Si BMI = 1, significa que está en rango normal, pero vamos a simular análisis
    if (bmiLevel !== 1.0) { // Solo analizar si BMI no está en el valor "normal" perfecto
      let condition: string;
      let probability: number;
      let reasoning: string;
      let treatments: string[];
      let priority: Priority;
      
      if (bmiLevel < 0.3) {
        condition = 'IMC Severamente Alterado (Obesidad III°/Bajo Peso Severo)';
        probability = 90;
        reasoning = 'Disfunción ovulatoria severa + complicaciones obstétricas + resistencia insulínica';
        treatments = [
          'Pérdida peso supervisada 10-15% pre-concepcional',
          'Metformina 1500mg + inositol si obesidad',
          'Evaluación endocrinológica + nutricional'
        ];
        priority = 'high';
      } else if (bmiLevel < 0.6) {
        condition = 'IMC Moderadamente Alterado (Obesidad I°-II°/Bajo Peso)';
        probability = 75;
        reasoning = 'Ovulación irregular + mayor riesgo complicaciones gestacionales';
        treatments = [
          'Pérdida peso 5-10% con dieta mediterránea',
          'Ejercicio moderado 150min/semana',
          'Suplementación vitamina D + folatos'
        ];
        priority = 'medium';
      } else if (bmiLevel < 0.9) {
        condition = 'IMC Levemente Alterado (Sobrepeso/Bajo Peso Leve)';
        probability = 60;
        reasoning = 'Riesgo leve de disfunción ovulatoria + complicaciones menores';
        treatments = [
          'Optimización nutricional pre-concepcional',
          'Actividad física regular + monitoreo peso',
          'Evaluación metabólica si sobrepeso'
        ];
        priority = 'low';
      } else {
        // BMI = 1.0 (normal) - aún podemos dar recomendaciones preventivas
        condition = 'IMC Normal - Optimización Pre-concepcional';
        probability = 15;
        reasoning = 'IMC óptimo para fertilidad. Mantener peso estable durante tratamiento';
        treatments = [
          'Mantener peso actual con dieta equilibrada',
          'Ejercicio moderado 3-4 veces/semana',
          'Ácido fólico 400mcg + vitamina D'
        ];
        priority = 'low';
      }

      results.push({
        type: 'hypothesis',
        data: {
          condition,
          probability,
          reasoning,
          evidenceLevel: 'A' as EvidenceLevel,
          pmid: '29681925'
        }
      });

      results.push({
        type: 'treatment',
        data: {
          treatment: treatments[0],
          priority,
          successRate: priority === 'high' ? 60 : priority === 'medium' ? 75 : 85,
          timeframe: priority === 'high' ? '3-6 meses' : priority === 'medium' ? '2-4 meses' : '1-2 meses',
          reasoning: 'Optimización peso mejora tasas de embarazo 15-25%'
        }
      });

      // Agregar recomendaciones de lifestyle
      results.push({
        type: 'lifestyle',
        data: {
          recommendations: treatments,
          category: 'Nutrición y Peso',
          impact: 'high'
        }
      });
    }
  }

  console.log('🔍 [BMI ANALYSIS] Results:', results.length, 'analysis results generated');
  return results;
};

// 🧠 ANÁLISIS DURACIÓN INFERTILIDAD - BASADO EN BIBLIOTECA MÉDICA
export const analyzeDurationFactors = (infertilityDuration?: number): AnalysisResult[] => {
  const results: AnalysisResult[] = [];
  
  // 🚨 CORRECCIÓN: Solo analizar si duración ≥24 meses (evidencia médica establece infertilidad)
  if (infertilityDuration !== undefined && infertilityDuration >= 24) {
    let condition: string;
    let probability: number;
    let reasoning: string;
    let treatments: string[];
    let priority: Priority;
    
    if (infertilityDuration >= 84) {
      // Infertilidad crítica >7 años
      condition = 'Infertilidad Crítica (>7 años buscando embarazo)';
      probability = 95;
      reasoning = 'Infertilidad severa establecida. Pronóstico reservado - requiere intervención inmediata';
      treatments = [
        'FIV-ICSI inmediata con PGT-A obligatorio',
        'Evaluación donación gametos si falla FIV',
        'Consejería reproductiva + apoyo psicológico especializado'
      ];
      priority = 'high';
    } else if (infertilityDuration >= 60) {
      // Infertilidad severa 5-7 años
      condition = 'Infertilidad Severa (5-7 años buscando embarazo)';
      probability = 85;
      reasoning = 'Infertilidad prolongada severa. Factores múltiples probables + deterioro tiempo-dependiente';
      treatments = [
        'Evaluación integral inmediata (AMH, HSG, espermograma completo)',
        'FIV-ICSI de alta complejidad sin demora',
        'Considerar PGT-A + técnicas avanzadas'
      ];
      priority = 'high';
    } else if (infertilityDuration >= 36) {
      // Infertilidad establecida 3-5 años
      condition = 'Infertilidad Establecida (3-5 años)';
      probability = 75;
      reasoning = 'Infertilidad confirmada. Requiere estudio completo e intervención especializada';
      treatments = [
        'Estudio fertilidad completo (AMH, HSG, cariotipo)',
        'Técnicas reproducción asistida de mediana-alta complejidad',
        'IUI hasta 3 ciclos, luego FIV-ICSI'
      ];
      priority = 'medium';
    } else {
      // Infertilidad moderada 2-3 años
      condition = 'Infertilidad Moderada (2-3 años)';
      probability = 65;
      reasoning = 'Subfertilidad establecida según definición médica. Requiere evaluación e intervención';
      treatments = [
        'Estudio básico fertilidad completo',
        'IUI con inducción ovulación hasta 6 ciclos',
        'Optimización factores modificables + seguimiento'
      ];
      priority = 'medium';
    }

    results.push({
      type: 'hypothesis',
      data: {
        condition,
        probability,
        reasoning,
        evidenceLevel: 'A' as EvidenceLevel,
        pmid: '28333262'
      }
    });

    treatments.forEach((treatment, index) => {
      results.push({
        type: 'treatment',
        data: {
          treatment,
          priority: index === 0 ? priority : 'medium' as Priority,
          successRate: infertilityDuration >= 36 ? 45 + (index * 10) : 70 - (index * 10),
          timeframe: index === 0 ? 'Inmediato' : '3-6 meses',
          reasoning: 'Tiempo crítico en infertilidad prolongada'
        }
      });
    });
  }

  return results;
};

// 🧠 ANÁLISIS CIRUGÍAS PÉLVICAS - BASADO EN BIBLIOTECA MÉDICA
export const analyzePelvicSurgeryFactors = (pelvicSurgery?: string): AnalysisResult[] => {
  const results: AnalysisResult[] = [];
  
  if (pelvicSurgery && pelvicSurgery !== 'none') {
    let condition: string;
    let probability: number;
    let reasoning: string;
    let treatments: string[];
    let priority: Priority;
    
    const complexSurgeries = ['multiple', 'endometriosis', 'myomectomy', 'ovarian'];
    const isComplex = complexSurgeries.some(surgery => pelvicSurgery.toLowerCase().includes(surgery));
    
    if (isComplex) {
      // Cirugías múltiples/complejas
      condition = 'Cirugías Pélvicas Múltiples/Complejas';
      probability = 95;
      reasoning = 'Alto riesgo adherencias + factor tubárico + endometriosis severa';
      treatments = [
        'HSG + Laparoscopia diagnóstica urgente',
        'FIV-ICSI directa si adherencias severas',
        'Evaluación quirúrgica reconstructiva especializada'
      ];
      priority = 'high';
    } else if (pelvicSurgery.toLowerCase().includes('appendectomy') || pelvicSurgery.toLowerCase().includes('cesarean')) {
      // Cirugía significativa previa
      condition = 'Cirugía Pélvica Significativa Previa';
      probability = 80;
      reasoning = 'Riesgo moderado adherencias + alteración anatomía pélvica';
      treatments = [
        'HSG para evaluar permeabilidad tubárica',
        'IUI si trompas permeables, FIV si obstruidas',
        'Laparoscopia si dolor o sospecha endometriosis'
      ];
      priority = 'medium';
    } else {
      // Cirugía menor previa
      condition = 'Cirugía Pélvica Menor Previa';
      probability = 65;
      reasoning = 'Riesgo bajo adherencias + posible impacto fertilidad';
      treatments = [
        'Evaluación clínica + HSG si indicado',
        'Seguimiento ovulación + timing optimizado',
        'IUI si no embarazo en 6-12 meses'
      ];
      priority = 'low';
    }

    results.push({
      type: 'hypothesis',
      data: {
        condition,
        probability,
        reasoning,
        evidenceLevel: 'A' as EvidenceLevel,
        pmid: '29880327'
      }
    });

    treatments.forEach((treatment, index) => {
      results.push({
        type: 'treatment',
        data: {
          treatment,
          priority: index === 0 ? priority : 'medium' as Priority,
          successRate: isComplex ? 40 + (index * 10) : 65 - (index * 10),
          timeframe: index === 0 ? '1-3 meses' : '3-6 meses',
          reasoning: 'Anatomía alterada requiere evaluación específica'
        }
      });
    });
  }

  return results;
};

// 🧠 ANÁLISIS OTB (OCLUSIÓN TUBÁRICA BILATERAL) - BASADO EN BIBLIOTECA MÉDICA
export const analyzeOTBFactors = (otb?: boolean, otbYears?: number): AnalysisResult[] => {
  const results: AnalysisResult[] = [];
  
  if (otb === true) {
    let condition: string;
    let probability: number;
    let reasoning: string;
    let treatments: string[];
    let priority: Priority;
    
    if (otbYears !== undefined && otbYears <= 2) {
      // OTB reciente/compleja
      condition = 'OTB Reciente o Técnica Compleja';
      probability = 98;
      reasoning = 'Oclusión tubárica bilateral efectiva. Esterilización quirúrgica confirmada';
      treatments = [
        'FIV-ICSI como primera opción (gold standard)',
        'Reversión tubárica solo si condiciones óptimas',
        'Counseling opciones reproductivas + donación'
      ];
      priority = 'high';
    } else if (otbYears !== undefined && otbYears >= 5) {
      // OTB antigua, posible recanalización
      condition = 'OTB Antigua (>5 años) - Riesgo Recanalización';
      probability = 85;
      reasoning = 'Posible recanalización tubárica parcial + embarazo ectópico alto riesgo';
      treatments = [
        'HSG para evaluar recanalización',
        'FIV-ICSI preferida vs reversión tubárica',
        'Vigilancia embarazo ectópico si concepción natural'
      ];
      priority = 'medium';
    } else {
      // OTB dudosa/incompleta
      condition = 'OTB Dudosa o Técnica Simple';
      probability = 70;
      reasoning = 'Posible oclusión incompleta + riesgo recanalización aumentado';
      treatments = [
        'HSG + evaluación ginecológica especializada',
        'Confirmar efectividad OTB antes de TRA',
        'FIV-ICSI vs reversión según evaluación'
      ];
      priority = 'low';
    }

    results.push({
      type: 'hypothesis',
      data: {
        condition,
        probability,
        reasoning,
        evidenceLevel: 'A' as EvidenceLevel,
        pmid: '31055104'
      }
    });

    treatments.forEach((treatment, index) => {
      results.push({
        type: 'treatment',
        data: {
          treatment,
          priority: index === 0 ? priority : 'medium' as Priority,
          successRate: (otbYears && otbYears <= 2) ? 60 + (index * 5) : 50 + (index * 10),
          timeframe: index === 0 ? '2-4 meses' : '6-12 meses',
          reasoning: 'OTB requiere técnicas reproducción asistida especializadas'
        }
      });
    });
  }

  return results;
};
