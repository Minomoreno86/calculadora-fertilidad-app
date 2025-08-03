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
  
  if (factors.pcos !== undefined && factors.pcos < 1.0) { // ✅ Incluir PCOS leve (0.9)
    const pcosLevel = factors.pcos;
    
    let condition: string;
    let probability: number;
    let reasoning: string;
    let treatments: string[];
    let priority: Priority;
    
    if (pcosLevel <= 0.6) {
      // PCOS severo con múltiples manifestaciones (factor 0.6)
      condition = 'PCOS Severo (Anovulación Confirmada)';
      probability = 95;
      reasoning = 'Anovulación crónica: ciclo >35 días, IMC >30, HOMA >3.5 + AMH >6 ng/mL';
      treatments = [
        'Metformina 1500-2000mg + inositol 4g/día',
        'Letrozol 5-7.5mg para inducción ovulación',
        'Pérdida peso 10% + dieta baja en carbohidratos'
      ];
      priority = 'high';
    } else if (pcosLevel <= 0.75) {
      // PCOS moderado (factor 0.75)
      condition = 'PCOS Moderado (Anovulación o AMH Elevada)';
      probability = 80;
      reasoning = 'Anovulación parcial: ciclo >35 días O IMC >30 O AMH >6 ng/mL';
      treatments = [
        'Letrozol 2.5-5mg ciclos 3-7 para ovulación',
        'Inositol 2g/día + vitamina D 4000UI',
        'Control peso y resistencia insulínica'
      ];
      priority = 'medium';
    } else {
      // PCOS leve (factor 0.9)
      condition = 'PCOS Leve (Ovulación Preservada)';
      probability = 65;
      reasoning = 'Criterios PCOS presentes pero ovulación regular. AMH <6 ng/mL y ciclo <35 días';
      treatments = [
        'Monitoreo ovulación + optimización estilo vida',
        'Inositol 1-2g/día + ejercicio regular',
        'Control ginecológico cada 6 meses'
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
    } else if (hsgLevel === 0.3) {
      // ✅ MALFORMACIÓN UTERINA HSG - FACTOR 0.3
      condition = 'Malformación Uterina Detectada en HSG';
      probability = 65;
      reasoning = 'Malformación congénita uterina (septa, bicorne, unicorne) detectada por HSG. Afecta implantación y riesgo de aborto';
      treatments = [
        'HISTEROSCOPIA DIAGNÓSTICA: Evaluación detallada de tipo y severidad de malformación',
        'RESONANCIA MAGNÉTICA PÉLVICA: Confirmar diagnóstico y planificar tratamiento quirúrgico',
        'CORRECCIÓN QUIRÚRGICA: Histeroscopia operatoria para septoplastia si septa presente',
        'EVALUACIÓN GENÉTICA: Cariotipo si malformación compleja o asociada a otras anomalías',
        'SEGUIMIENTO ESPECIALIZADO: Centro con experiencia en cirugía reproductiva',
        'PROTOCOLO GESTACIONAL: Vigilancia obstétrica estrecha si se logra embarazo'
      ];
      priority = 'medium';
    } else if (hsgLevel < 0.8) {
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
  
  // ✅ CORREGIDO: El factor se llama 'male' en el sistema, no 'maleFactor'
  if (factors.male !== undefined && factors.male < 1.0) {
    const maleLevel = factors.male;
    
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
      
      if (bmiLevel <= 0.4) {
        // Factor 0.4 = Obesidad Clase III (BMI ≥40)
        condition = 'Obesidad Clase III (IMC ≥40)';
        probability = 95;
        reasoning = 'Disfunción ovulatoria severa + anovulación crónica + resistencia insulínica severa + alto riesgo obstétrico';
        treatments = [
          'Cirugía bariátrica pre-concepcional si IMC >40',
          'Pérdida peso supervisada 15-20% obligatorio',
          'Metformina 2000mg + evaluación endocrinológica completa'
        ];
        priority = 'high';
      } else if (bmiLevel <= 0.6) {
        // Factor 0.6 = Obesidad Clase II (BMI 35-39.9)
        condition = 'Obesidad Clase II (IMC 35-39.9)';
        probability = 85;
        reasoning = 'Anovulación frecuente + resistencia insulínica + riesgo complicaciones obstétricas elevado';
        treatments = [
          'Pérdida peso supervisada 10-15% pre-concepcional',
          'Metformina 1500-2000mg + inositol 4g/día',
          'Evaluación endocrinológica + cardiológica'
        ];
        priority = 'high';
      } else if (bmiLevel <= 0.75) {
        // Factor 0.75 = Obesidad Clase I (BMI 30-34.9)
        condition = 'Obesidad Clase I (IMC 30-34.9)';
        probability = 75;
        reasoning = 'Ovulación irregular + resistencia insulínica incipiente + riesgo gestacional moderado';
        treatments = [
          'Pérdida peso 5-10% con dieta mediterránea',
          'Metformina 1000-1500mg si HOMA-IR >2.5',
          'Ejercicio estructurado 150min/semana'
        ];
        priority = 'medium';
      } else if (bmiLevel <= 0.9) {
        // Factor 0.9 = Sobrepeso (BMI 25-29.9)
        condition = 'Sobrepeso (IMC 25-29.9)';
        probability = 60;
        reasoning = 'Riesgo leve disfunción ovulatoria + tendencia resistencia insulínica';
        treatments = [
          'Pérdida peso 3-5% con dieta equilibrada',
          'Actividad física regular + monitoreo peso',
          'Suplementación vitamina D + folatos'
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

// 🧠 ANÁLISIS CIRUGÍAS PÉLVICAS - BASADO EN FACTOR NUMÉRICO
export const analyzePelvicSurgeryFactors = (factors: Factors): AnalysisResult[] => {
  const results: AnalysisResult[] = [];
  
  console.log('🔍 [PELVIC SURGERY ANALYSIS] Debug:', { 
    pelvicSurgery: factors.pelvicSurgery, 
    isDefined: factors.pelvicSurgery !== undefined,
    willAnalyze: factors.pelvicSurgery !== undefined && factors.pelvicSurgery < 1.0
  });
  
  if (factors.pelvicSurgery !== undefined && factors.pelvicSurgery < 1.0) {
    const surgeryFactor = factors.pelvicSurgery;
    let condition: string;
    let probability: number;
    let reasoning: string;
    let treatments: string[];
    let priority: Priority;
    
    if (surgeryFactor <= 0.88) {
      // Cirugías múltiples (2+ cirugías) - Factor 0.88
      condition = 'Cirugías Pélvicas Múltiples (2+ Procedimientos)';
      probability = 90;
      reasoning = 'Alto riesgo adherencias pélvicas + alteración anatomía tubárica + posible factor endometrial';
      treatments = [
        'HSG + Histeroscopia diagnóstica para evaluar cavidad/trompas',
        'Laparoscopia diagnóstica si sospecha adherencias severas',
        'FIV-ICSI precoz si factor tubárico confirmado',
        'Cirugía adhesiolisis solo si sintomática'
      ];
      priority = 'high';
    } else if (surgeryFactor <= 0.95) {
      // Una cirugía pélvica - Factor 0.95
      condition = 'Cirugía Pélvica Previa (1 Procedimiento)';
      probability = 75;
      reasoning = 'Riesgo moderado adherencias + posible alteración permeabilidad tubárica según tipo cirugía';
      treatments = [
        'HSG para evaluación permeabilidad tubárica',
        'Histeroscopia si cirugía uterina previa',
        'IUI si trompas permeables + semen normal',
        'FIV si obstrucción tubárica o múltiples factores'
      ];
      priority = 'medium';
    } else {
      // Casos edge o cirugía muy menor - Factor >0.95 pero <1.0
      condition = 'Cirugía Pélvica Menor/Impacto Mínimo';
      probability = 60;
      reasoning = 'Impacto mínimo en fertilidad + riesgo bajo adherencias';
      treatments = [
        'Seguimiento ovulación natural 6-12 meses',
        'HSG solo si otros factores presentes',
        'IUI si no concepción tras seguimiento'
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
          successRate: surgeryFactor <= 0.88 ? 40 + (index * 10) : 65 - (index * 10),
          timeframe: index === 0 ? '1-3 meses' : '3-6 meses',
          reasoning: 'Anatomía alterada requiere evaluación específica'
        }
      });
    });
  }

  return results;
};

// 🧠 ANÁLISIS OTB (OCLUSIÓN TUBÁRICA BILATERAL) - BASADO EN FACTOR NUMÉRICO
export const analyzeOTBFactors = (factors: Factors): AnalysisResult[] => {
  const results: AnalysisResult[] = [];
  
  console.log('🔍 [OTB ANALYSIS] Debug:', { 
    otb: factors.otb, 
    isDefined: factors.otb !== undefined,
    willAnalyze: factors.otb !== undefined && factors.otb < 1.0
  });
  
  if (factors.otb !== undefined && factors.otb < 1.0) {
    const otbFactor = factors.otb;
    let condition: string;
    let probability: number;
    let reasoning: string;
    let treatments: string[];
    let priority: Priority;
    
    if (otbFactor <= 0.05) {
      // Cauterización extensa (Factor ~0.05) - Imposible reversión
      condition = 'OTB por Cauterización Extensa (Irreversible)';
      probability = 99;
      reasoning = 'Cauterización extensa bilateral. Destrucción tubárica completa. Imposible recanalización natural o quirúrgica';
      treatments = [
        'FIV-ICSI como ÚNICA opción reproductiva viable',
        'NO candidata a reversión tubárica (tejido tubárico destruido)',
        'Counseling reproductivo: FIV vs adopción vs ovodonación',
        'Evaluación psicológica para aceptación nueva realidad reproductiva'
      ];
      priority = 'high';
    } else if (otbFactor <= 0.08) {
      // Salpingectomía parcial (Factor ~0.08) - Muy severo
      condition = 'OTB por Salpingectomía Parcial (Muy Severa)';
      probability = 95;
      reasoning = 'Resección parcial bilateral trompas. Longitud tubárica severamente comprometida. Pronóstico reversión muy pobre';
      treatments = [
        'FIV-ICSI como primera línea (tasas éxito >90%)',
        'Reversión tubárica solo si: longitud residual >3cm + edad <32 años',
        'Evaluación quirúrgica especializada con laparoscopia diagnóstica',
        'Counseling fertilidad: expectativas realistas FIV vs reversión'
      ];
      priority = 'high';
    } else if (otbFactor <= 0.12) {
      // Clips/Anillos (Factor ~0.1-0.12) - Severo pero posible reversión
      condition = otbFactor <= 0.1 ? 'OTB por Clips Metálicos (Severa)' : 'OTB por Anillos Silicona (Severa)';
      probability = 90;
      reasoning = otbFactor <= 0.1 ? 
        'Clips metálicos bilaterales. Obstrucción completa con daño tubárico moderado. Reversión técnicamente posible' :
        'Anillos de silicona bilaterales. Compresión tubárica severa. Reversión posible con técnica especializada';
      treatments = [
        'FIV-ICSI como tratamiento de primera elección (85-90% éxito)',
        'Reversión tubárica posible si: edad <35, deseo múltiples embarazos, longitud >4cm',
        'Laparoscopia diagnóstica para evaluar estado tubárico y adherencias',
        'HSG pre-reversión para confirmar permeabilidad uterina',
        'Consejería: FIV (rápido, predecible) vs Reversión (natural, múltiples embarazos)'
      ];
      priority = 'high';
    } else if (otbFactor <= 0.8) {
      // Ligadura simple (Factor ~0.75) - MEJOR pronóstico (ligadura parcial)
      condition = 'OTB por Ligadura Simple (Mejor Pronóstico)';
      probability = 70;
      reasoning = 'Ligadura simple bilateral. Técnica menos destructiva. MEJOR candidata para reversión exitosa. Preservación anatómica tubárica';
      treatments = [
        'REVERSIÓN TUBÁRICA VIABLE: Evaluación para recanalización quirúrgica',
        'Criterios reversión: edad <38 años, longitud tubárica >4cm, sin adherencias severas',
        'HSG + laparoscopia diagnóstica para planificar reversión',
        'FIV-ICSI como alternativa si no candidata a reversión',
        'Seguimiento post-reversión: 60-80% embarazos naturales en 2 años',
        'Vigilancia embarazo ectópico (riesgo 2-3% post-reversión)'
      ];
      priority = 'medium';
    } else {
      // Casos especiales >0.8 - Recanalización parcial/desconocida
      condition = 'OTB con Recanalización Parcial (Evaluación Especializada)';
      probability = 60;
      reasoning = 'Posible recanalización espontánea parcial. Estado tubárico incierto. Requiere evaluación especializada urgente';
      treatments = [
        'HSG URGENTE para evaluar grado recanalización actual',
        'Laparoscopia diagnóstica si HSG muestra permeabilidad parcial',
        'Seguimiento ovulación + timing si permeabilidad confirmada',
        'VIGILANCIA ESTRICTA embarazo ectópico (riesgo muy alto 15-20%)',
        'FIV-ICSI si permeabilidad dudosa o embarazo ectópico previo'
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
        pmid: '31055104'
      }
    });

    treatments.forEach((treatment, index) => {
      results.push({
        type: 'treatment',
        data: {
          treatment,
          priority: index === 0 ? priority : 'medium' as Priority,
          successRate: otbFactor <= 0.3 ? 60 + (index * 5) : 50 + (index * 10),
          timeframe: index === 0 ? '2-4 meses' : '6-12 meses',
          reasoning: 'OTB requiere técnicas reproducción asistida especializadas'
        }
      });
    });
  }

  return results;
};
