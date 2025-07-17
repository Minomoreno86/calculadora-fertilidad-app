/**
 * 🔬 PATOLOGÍAS REPRODUCTIVAS - KNOWLEDGE BASE MÉDICA
 * Base de conocimiento científica para el Agente IA Médico
 * Validado con evidencia científica (DOI/PMID)
 */

export interface PathologyDefinition {
  id: string;
  name: string;
  nameES: string;
  category: 'female' | 'male' | 'couple' | 'unexplained';
  prevalence: string;
  definition: string;
  symptoms: string[];
  diagnosticCriteria: string[];
  riskFactors: string[];
  prognosis: {
    natural: string;
    withTreatment: string;
    timeToConception: string;
  };
  relatedConditions: string[];
  evidenceLevel: 'A' | 'B' | 'C' | 'D';
  references: {
    doi?: string;
    pmid?: string;
    guideline?: string;
  }[];
}

export const PATHOLOGIES_DATABASE: Record<string, PathologyDefinition> = {
  // 🔬 SÍNDROME DE OVARIO POLIQUÍSTICO (PCOS)
  PCOS: {
    id: 'PCOS',
    name: 'Polycystic Ovary Syndrome',
    nameES: 'Síndrome de Ovario Poliquístico',
    category: 'female',
    prevalence: '5-10% mujeres edad reproductiva',
    definition: 'Trastorno endocrino caracterizado por hiperandrogenismo, disfunción ovulatoria y morfología ovárica poliquística.',
    symptoms: [
      'Oligomenorrea o amenorrea',
      'Hirsutismo',
      'Acné',
      'Alopecia androgenética',
      'Obesidad central',
      'Acantosis nigricans',
      'Infertilidad anovulatoria'
    ],
    diagnosticCriteria: [
      'Criterios de Rotterdam (2 de 3):',
      '• Oligo/anovulación',
      '• Hiperandrogenismo clínico/bioquímico',
      '• Morfología ovárica poliquística (≥12 folículos 2-9mm)'
    ],
    riskFactors: [
      'Resistencia a la insulina',
      'Obesidad',
      'Historia familiar de PCOS',
      'Diabetes tipo 2 familiar',
      'Síndrome metabólico'
    ],
    prognosis: {
      natural: '15-20% embarazo espontáneo/año',
      withTreatment: '70-80% con inducción ovulación',
      timeToConception: '6-12 meses con tratamiento'
    },
    relatedConditions: [
      'Diabetes tipo 2',
      'Síndrome metabólico',
      'Enfermedad cardiovascular',
      'Apnea del sueño',
      'Cáncer endometrial'
    ],
    evidenceLevel: 'A',
    references: [
      { doi: '10.1093/humrep/deaa314', pmid: '33336197' },
      { guideline: 'ESHRE PCOS Guidelines 2018' },
      { doi: '10.1016/j.fertnstert.2021.02.019', pmid: '33838984' }
    ]
  },

  // 🔬 ENDOMETRIOSIS
  endometriosis: {
    id: 'endometriosis',
    name: 'Endometriosis',
    nameES: 'Endometriosis',
    category: 'female',
    prevalence: '10-15% mujeres edad reproductiva',
    definition: 'Presencia de tejido endometrial funcionante fuera de la cavidad uterina, principalmente en pelvis.',
    symptoms: [
      'Dismenorrea progresiva',
      'Dispareunia profunda',
      'Dolor pélvico crónico',
      'Disquecia',
      'Disuria',
      'Infertilidad',
      'Sangrado menstrual abundante'
    ],
    diagnosticCriteria: [
      'Visualización laparoscópica (gold standard)',
      'Resonancia magnética pélvica',
      'Ecografía transvaginal especializada',
      'CA-125 elevado (no específico)',
      'Clasificación rASRM I-IV'
    ],
    riskFactors: [
      'Menarca temprana',
      'Ciclos menstruales cortos',
      'Nuliparidad',
      'Historia familiar',
      'Factores anatómicos obstructivos'
    ],
    prognosis: {
      natural: '2-10% embarazo espontáneo/mes según estadio',
      withTreatment: '30-60% según tratamiento y estadio',
      timeToConception: '12-18 meses post-tratamiento'
    },
    relatedConditions: [
      'Adenomiosis',
      'Síndrome ovario poliquístico',
      'Miomas uterinos',
      'Dolor pélvico crónico',
      'Intestino irritable'
    ],
    evidenceLevel: 'A',
    references: [
      { doi: '10.1093/humrep/deab001', pmid: '33704458' },
      { guideline: 'ESHRE Endometriosis Guidelines 2022' },
      { doi: '10.1016/j.fertnstert.2020.01.025', pmid: '32192638' }
    ]
  },

  // 🔬 FACTOR MASCULINO
  maleInfertility: {
    id: 'maleInfertility',
    name: 'Male Factor Infertility',
    nameES: 'Factor Masculino de Infertilidad',
    category: 'male',
    prevalence: '40-50% casos infertilidad',
    definition: 'Alteraciones en la producción, función o transporte espermático que comprometen la capacidad fertilizante.',
    symptoms: [
      'Alteraciones espermiograma',
      'Disfunción eréctil',
      'Eyaculación retrógrada',
      'Dolor/inflamación testicular',
      'Ginecomastia',
      'Disminución libido'
    ],
    diagnosticCriteria: [
      'WHO 2021 Límites de referencia:',
      '• Concentración: ≥16 millones/ml',
      '• Motilidad total: ≥42%',
      '• Motilidad progresiva: ≥30%',
      '• Morfología: ≥4% formas normales',
      '• Volumen: ≥1.4 ml'
    ],
    riskFactors: [
      'Varicocele',
      'Criptorquidia',
      'Infecciones genitourinarias',
      'Exposición toxinas/calor',
      'Edad avanzada (>40 años)',
      'Obesidad',
      'Tabaquismo',
      'Medicamentos gonadotóxicos'
    ],
    prognosis: {
      natural: 'Variable según severidad (5-30%/mes)',
      withTreatment: '20-60% según tratamiento',
      timeToConception: '6-24 meses según intervención'
    },
    relatedConditions: [
      'Hipogonadismo',
      'Diabetes mellitus',
      'Síndrome metabólico',
      'Apnea del sueño',
      'Depresión'
    ],
    evidenceLevel: 'A',
    references: [
      { doi: '10.1093/humrep/deab222', pmid: '34543379' },
      { guideline: 'WHO Laboratory Manual 6th Edition 2021' },
      { doi: '10.1016/j.fertnstert.2021.01.049', pmid: '33757753' }
    ]
  },

  // 🔬 TRASTORNOS DE OVULACIÓN
  ovulationDisorders: {
    id: 'ovulationDisorders',
    name: 'Ovulation Disorders',
    nameES: 'Trastornos de Ovulación',
    category: 'female',
    prevalence: '25-30% infertilidad femenina',
    definition: 'Alteraciones en el proceso ovulatorio normal que incluyen anovulación y ovulación disfuncional.',
    symptoms: [
      'Oligomenorrea (ciclos >35 días)',
      'Amenorrea (ausencia menstruación >90 días)',
      'Sangrado irregular',
      'Ausencia síntomas ovulatorios',
      'Galactorrea (hiperprolactinemia)',
      'Sofocos (hipogonadismo)'
    ],
    diagnosticCriteria: [
      'Clasificación WHO:',
      '• Grupo I: Hipogonadismo hipogonadotropo',
      '• Grupo II: Normogonadotropo (PCOS)',
      '• Grupo III: Hipergonadotropo (falla ovárica)',
      'Pruebas: Progesterona lútea, LH, FSH, Prolactina, TSH'
    ],
    riskFactors: [
      'Peso corporal extremo (IMC <18.5 o >30)',
      'Ejercicio excesivo',
      'Stress crónico',
      'Síndrome ovario poliquístico',
      'Hiperprolactinemia',
      'Disfunción tiroidea',
      'Falla ovárica prematura'
    ],
    prognosis: {
      natural: '5-15% embarazo espontáneo sin ovulación',
      withTreatment: '70-90% con inducción ovulación apropiada',
      timeToConception: '3-6 meses con tratamiento exitoso'
    },
    relatedConditions: [
      'PCOS',
      'Hiperprolactinemia',
      'Hipotiroidismo',
      'Anorexia nerviosa',
      'Amenorrea hipotalámica'
    ],
    evidenceLevel: 'A',
    references: [
      { doi: '10.1093/humrep/deaa319', pmid: '33369661' },
      { guideline: 'NICE Fertility Guidelines 2017' },
      { doi: '10.1016/j.fertnstert.2019.11.025', pmid: '32115022' }
    ]
  },

  // 🔬 FACTOR TUBÁRICO
  tubalFactor: {
    id: 'tubalFactor',
    name: 'Tubal Factor Infertility',
    nameES: 'Factor Tubárico de Infertilidad',
    category: 'female',
    prevalence: '25-35% infertilidad femenina',
    definition: 'Obstrucción o disfunción de las trompas de Falopio que impide el transporte ovocitario o embrionario.',
    symptoms: [
      'Historia de enfermedad pélvica inflamatoria',
      'Dolor pélvico crónico',
      'Dispareunia',
      'Sangrado menstrual anormal',
      'Frecuentemente asintomático'
    ],
    diagnosticCriteria: [
      'Histerosalpingografía (HSG)',
      'Laparoscopia con cromopertubación',
      'Sonosalpingografía (HyCoSy)',
      'Clasificación permeabilidad tubárica',
      'Evaluación anatómica pélvica'
    ],
    riskFactors: [
      'Enfermedad pélvica inflamatoria previa',
      'Infecciones de transmisión sexual',
      'Endometriosis',
      'Cirugía pélvica/abdominal previa',
      'Apendicitis perforada',
      'Tuberculosis genital',
      'Embarazo ectópico previo'
    ],
    prognosis: {
      natural: '1-5% embarazo espontáneo si obstrucción completa',
      withTreatment: '20-40% cirugía tubárica, 40-60% FIV',
      timeToConception: '6-12 meses post-cirugía exitosa'
    },
    relatedConditions: [
      'Endometriosis',
      'Adherencias pélvicas',
      'Hidrosálpinx',
      'Embarazo ectópico',
      'Enfermedad inflamatoria pélvica'
    ],
    evidenceLevel: 'A',
    references: [
      { doi: '10.1093/humrep/dez035', pmid: '30915436' },
      { guideline: 'ASRM Practice Committee 2020' },
      { doi: '10.1016/j.fertnstert.2018.12.033', pmid: '30691630' }
    ]
  },

  // 🔬 INFERTILIDAD INEXPLICADA
  unexplainedInfertility: {
    id: 'unexplainedInfertility',
    name: 'Unexplained Infertility',
    nameES: 'Infertilidad Inexplicada',
    category: 'couple',
    prevalence: '10-25% casos infertilidad',
    definition: 'Infertilidad donde el estudio básico no identifica causa aparente en ninguno de los miembros de la pareja.',
    symptoms: [
      'Ausencia embarazo >12 meses (>6 meses si >35 años)',
      'Estudios básicos normales',
      'Ovulación documentada',
      'Trompas permeables',
      'Espermiograma normal'
    ],
    diagnosticCriteria: [
      'Criterios de inclusión:',
      '• Ovulación regular documentada',
      '• Trompas permeables (HSG/Laparoscopia)',
      '• Espermiograma normal (≥2 muestras)',
      '• Edad <40 años',
      '• Ausencia endometriosis severa'
    ],
    riskFactors: [
      'Edad femenina avanzada (>35 años)',
      'Duración prolongada infertilidad',
      'Factores genéticos sutiles',
      'Defectos implantación',
      'Factores inmunológicos',
      'Calidad ovocitaria disminuida',
      'Factores ambientales/lifestyle'
    ],
    prognosis: {
      natural: '2-4% embarazo espontáneo/mes',
      withTreatment: '15-20% IUI, 35-40% FIV',
      timeToConception: '6-18 meses con tratamiento'
    },
    relatedConditions: [
      'Endometriosis mínima/leve',
      'Defectos fase lútea',
      'Factores inmunológicos',
      'Calidad ovocitaria disminuida',
      'Fragmentación DNA espermático'
    ],
    evidenceLevel: 'B',
    references: [
      { doi: '10.1093/humrep/dez063', pmid: '31076738' },
      { guideline: 'NICE Fertility Guidelines 2017' },
      { doi: '10.1016/j.fertnstert.2020.05.007', pmid: '32571571' }
    ]
  }
};

/**
 * 🔍 UTILIDADES PARA BÚSQUEDA Y ANÁLISIS DE PATOLOGÍAS
 */
export class PathologyAnalyzer {
  /**
   * Busca patologías basadas en síntomas reportados
   */
  static findBySymptoms(symptoms: string[]): PathologyDefinition[] {
    const results: PathologyDefinition[] = [];
    
    Object.values(PATHOLOGIES_DATABASE).forEach(pathology => {
      const matchCount = symptoms.filter(symptom => 
        pathology.symptoms.some(ps => 
          ps.toLowerCase().includes(symptom.toLowerCase()) ||
          symptom.toLowerCase().includes(ps.toLowerCase())
        )
      ).length;
      
      if (matchCount > 0) {
        results.push(pathology);
      }
    });
    
    return results.sort((a, b) => b.symptoms.length - a.symptoms.length);
  }

  /**
   * Obtiene patologías por categoría
   */
  static getByCategory(category: PathologyDefinition['category']): PathologyDefinition[] {
    return Object.values(PATHOLOGIES_DATABASE).filter(p => p.category === category);
  }

  /**
   * Calcula scoring de probabilidad para una patología específica
   */
  static calculateProbabilityScore(
    pathologyId: string, 
    userSymptoms: string[], 
    riskFactors: string[]
  ): number {
    const pathology = PATHOLOGIES_DATABASE[pathologyId];
    if (!pathology) return 0;

    let score = 0;
    const maxScore = pathology.symptoms.length + pathology.riskFactors.length;

    // Score por síntomas coincidentes
    userSymptoms.forEach(symptom => {
      if (pathology.symptoms.some(ps => 
        ps.toLowerCase().includes(symptom.toLowerCase())
      )) {
        score += 2; // Síntomas valen más que factores de riesgo
      }
    });

    // Score por factores de riesgo
    riskFactors.forEach(risk => {
      if (pathology.riskFactors.some(pr => 
        pr.toLowerCase().includes(risk.toLowerCase())
      )) {
        score += 1;
      }
    });

    return Math.min(100, (score / maxScore) * 100);
  }
}

export default PATHOLOGIES_DATABASE;
