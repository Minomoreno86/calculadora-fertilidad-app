/**
 * 🎯 TRATAMIENTOS REPRODUCTIVOS - KNOWLEDGE BASE MÉDICA
 * Protocolos de tratamiento escalonados para el Agente IA Médico
 * Validado con guías clínicas internacionales
 */

export interface TreatmentProtocol {
  id: string;
  name: string;
  nameES: string;
  category: 'level1' | 'level2' | 'level3'; // Complejidad escalonada
  complexity: 'low' | 'medium' | 'high';
  successRate: {
    perCycle: string;
    cumulative: string;
    timeToSuccess: string;
  };
  indications: string[];
  contraindications: string[];
  prerequisites: string[];
  procedure: {
    preparation: string[];
    execution: string[];
    followUp: string[];
  };
  costs: {
    estimate: string;
    factors: string[];
  };
  risks: {
    maternal: string[];
    fetal: string[];
    procedural: string[];
  };
  monitoring: string[];
  evidenceLevel: 'A' | 'B' | 'C' | 'D';
  guidelines: string[];
  nextSteps: {
    ifSuccess: string;
    ifFailure: string[];
  };
}

export const TREATMENTS_DATABASE: Record<string, TreatmentProtocol> = {
  // 🎯 NIVEL 1: BAJA COMPLEJIDAD

  // Estimulación Ovárica Simple
  ovulationInduction: {
    id: 'ovulationInduction',
    name: 'Ovulation Induction',
    nameES: 'Inducción de Ovulación',
    category: 'level1',
    complexity: 'low',
    successRate: {
      perCycle: '15-25% embarazo por ciclo',
      cumulative: '60-70% a los 6 ciclos',
      timeToSuccess: '3-6 meses promedio'
    },
    indications: [
      'Anovulación (WHO Grupo II - PCOS)',
      'Ovulación irregular',
      'Oligomenorrea',
      'Infertilidad inexplicada (como primera línea)',
      'Síndrome ovario poliquístico leve-moderado'
    ],
    contraindications: [
      'Embarazo',
      'Insuficiencia ovárica (FSH >20 UI/L)',
      'Tumores dependientes de estrógenos',
      'Sangrado genital no diagnosticado',
      'Disfunción hepática severa',
      'Quistes ováricos no funcionales >5cm'
    ],
    prerequisites: [
      'Trompas permeables documentadas',
      'Espermiograma normal',
      'Ausencia contraindicaciones médicas',
      'Pareja estable con relaciones regulares',
      'Evaluación endocrina básica normal'
    ],
    procedure: {
      preparation: [
        'Evaluación baseline: Ecografía día 2-5 del ciclo',
        'Perfil hormonal: FSH, LH, Estradiol, Prolactina, TSH',
        'Educación paciente sobre timing relaciones',
        'Suplementación ácido fólico 400-800mcg'
      ],
      execution: [
        'Citrato de Clomifeno: 50-150mg días 3-7 del ciclo',
        'O Letrozol: 2.5-7.5mg días 3-7 del ciclo',
        'Monitoreo folicular: Ecografía días 10-12',
        'Trigger ovulación: hCG 5000-10000 UI si folículo >18mm',
        'Relaciones programadas: 24-36h post-trigger'
      ],
      followUp: [
        'Progesterona sérica día 21 (confirmar ovulación)',
        'Test embarazo 14 días post-ovulación',
        'Si negativo: evaluar respuesta y ajustar dosis siguiente ciclo'
      ]
    },
    costs: {
      estimate: '$200-500 USD por ciclo',
      factors: [
        'Medicamentos (Clomifeno $30-50, Letrozol $50-80)',
        'Monitoreo ecográfico ($100-200)',
        'Laboratorios ($100-150)',
        'Consultas médicas ($100-200)'
      ]
    },
    risks: {
      maternal: [
        'Embarazo múltiple (8-12% con Clomifeno, 3-5% con Letrozol)',
        'Síndrome hiperestimulación ovárica (<1%)',
        'Quistes ováricos funcionales (5-10%)',
        'Efectos secundarios: sofocos, cambios humor'
      ],
      fetal: [
        'Riesgo malformaciones: no aumentado significativamente',
        'Riesgo aborto: similar población general'
      ],
      procedural: [
        'Resistencia a medicamentos (20-25% casos)',
        'Ausencia respuesta ovulatoria',
        'Ovulación sin embarazo (luteinización sin ruptura)'
      ]
    },
    monitoring: [
      'Ecografía transvaginal seriada',
      'Niveles hormonales (E2, LH, Progesterona)',
      'Sintomatología subjetiva',
      'Adherencia al tratamiento'
    ],
    evidenceLevel: 'A',
    guidelines: [
      'NICE Fertility Guidelines 2017',
      'ASRM Practice Committee 2019',
      'ESHRE Ovulation Induction Guidelines 2018'
    ],
    nextSteps: {
      ifSuccess: 'Continuar embarazo con seguimiento obstétrico estándar',
      ifFailure: [
        'Hasta 6 ciclos antes de cambiar estrategia',
        'Considerar Gonadotropinas si resistencia a antiestrogénicos',
        'Evaluar para IUI si factor masculino limítrofe',
        'Considerar FIV si falla repetida'
      ]
    }
  },

  // Relaciones Programadas
  timedIntercourse: {
    id: 'timedIntercourse',
    name: 'Timed Intercourse',
    nameES: 'Relaciones Programadas',
    category: 'level1',
    complexity: 'low',
    successRate: {
      perCycle: '10-15% por ciclo',
      cumulative: '40-50% a los 6 ciclos',
      timeToSuccess: '4-8 meses promedio'
    },
    indications: [
      'Ovulación normal con timing inadecuado',
      'Infertilidad inexplicada leve',
      'Factor cervical leve',
      'Disfunción sexual con timing',
      'Primera intervención en parejas jóvenes'
    ],
    contraindications: [
      'Anovulación',
      'Factor tubárico severo',
      'Factor masculino severo',
      'Endometriosis moderada-severa',
      'Edad femenina >40 años'
    ],
    prerequisites: [
      'Ovulación documentada',
      'Trompas permeables',
      'Espermiograma normal',
      'Capacidad mantener relaciones regulares',
      'Motivación y comprensión del proceso'
    ],
    procedure: {
      preparation: [
        'Educación sobre ventana fértil',
        'Entrenamiento detección signos ovulación',
        'Optimización factores lifestyle',
        'Suplementación ácido fólico'
      ],
      execution: [
        'Monitoreo ovulación: Tests ovulación (LH)',
        'O monitoreo ecográfico folicular',
        'Relaciones cada 1-2 días durante ventana fértil',
        'Timing óptimo: día antes, día de, y día después ovulación'
      ],
      followUp: [
        'Confirmación ovulación (temperatura basal/progesterona)',
        'Test embarazo 14 días post-ovulación',
        'Evaluación adherencia y dificultades'
      ]
    },
    costs: {
      estimate: '$100-300 USD por ciclo',
      factors: [
        'Tests de ovulación ($50-100)',
        'Monitoreo ecográfico opcional ($100-200)',
        'Consultas de seguimiento ($100-150)'
      ]
    },
    risks: {
      maternal: [
        'Stress psicológico por performance',
        'Ansiedad anticipatoria',
        'Impacto relación de pareja'
      ],
      fetal: [
        'Sin riesgos aumentados'
      ],
      procedural: [
        'Falla en timing adecuado',
        'Reducción espontaneidad sexual',
        'Deterioro calidad relación'
      ]
    },
    monitoring: [
      'Adherencia al programa',
      'Detección correcta ovulación',
      'Bienestar psicológico pareja',
      'Calidad relación sexual'
    ],
    evidenceLevel: 'B',
    guidelines: [
      'NICE Fertility Guidelines 2017',
      'ACOG Committee Opinion 2019',
      'Canadian Fertility Guidelines 2020'
    ],
    nextSteps: {
      ifSuccess: 'Seguimiento obstétrico normal',
      ifFailure: [
        'Máximo 6 ciclos antes escalamiento',
        'Considerar inducción ovulación',
        'Evaluar para IUI',
        'Re-evaluación diagnóstica si >6 meses'
      ]
    }
  },

  // 🎯 NIVEL 2: COMPLEJIDAD MEDIA

  // Inseminación Intrauterina (IUI)
  IUI: {
    id: 'IUI',
    name: 'Intrauterine Insemination',
    nameES: 'Inseminación Intrauterina',
    category: 'level2',
    complexity: 'medium',
    successRate: {
      perCycle: '12-18% por ciclo',
      cumulative: '40-60% a los 4-6 ciclos',
      timeToSuccess: '3-6 ciclos promedio'
    },
    indications: [
      'Factor cervical',
      'Factor masculino leve-moderado',
      'Infertilidad inexplicada',
      'Falla inducción ovulación + relaciones',
      'Disfunción eyaculatoria',
      'Uso semen donante'
    ],
    contraindications: [
      'Obstrucción tubárica bilateral',
      'Factor masculino severo (<5 millones post-lavado)',
      'Endometriosis severa',
      'Anomalías uterinas severas',
      'Infección pélvica activa'
    ],
    prerequisites: [
      'Al menos una trompa permeable',
      'Concentración espermática post-lavado >5 millones',
      'Cavidad uterina normal',
      'Ausencia infección genital activa',
      'Ovulación espontánea o inducida'
    ],
    procedure: {
      preparation: [
        'Estimulación ovárica suave (opcional)',
        'Monitoreo folicular ecográfico',
        'Preparación muestra espermática (lavado)',
        'Trigger ovulación con hCG'
      ],
      execution: [
        'Inseminación 24-36h post-trigger',
        'Inserción catéter intrauterino estéril',
        'Depósito 0.3-0.5ml semen procesado en fundus',
        'Reposo 10-15 minutos post-procedimiento'
      ],
      followUp: [
        'Test embarazo 14 días post-inseminación',
        'Ecografía temprana si embarazo positivo',
        'Evaluación ciclo y ajustes para siguiente intento'
      ]
    },
    costs: {
      estimate: '$800-1500 USD por ciclo',
      factors: [
        'Procesamiento semen ($200-400)',
        'Procedimiento IUI ($300-600)',
        'Medicamentos estimulación ($200-500)',
        'Monitoreo ecográfico ($200-400)',
        'Consultas especializadas ($200-300)'
      ]
    },
    risks: {
      maternal: [
        'Embarazo múltiple (15-20% si estimulación)',
        'Síndrome hiperestimulación leve (<5%)',
        'Infección pélvica (<1%)',
        'Spotting vaginal leve'
      ],
      fetal: [
        'Riesgo malformaciones: no aumentado',
        'Riesgo aborto: similar FIV'
      ],
      procedural: [
        'Falla técnica (<2%)',
        'Dolor leve-moderado durante procedimiento',
        'Vasovagal reaction (<1%)'
      ]
    },
    monitoring: [
      'Desarrollo folicular',
      'Timing ovulación',
      'Calidad muestra espermática',
      'Respuesta endometrial'
    ],
    evidenceLevel: 'A',
    guidelines: [
      'ASRM Practice Committee 2021',
      'ESHRE IUI Guidelines 2019',
      'NICE Fertility Guidelines 2017'
    ],
    nextSteps: {
      ifSuccess: 'Seguimiento obstétrico con atención a embarazo múltiple',
      ifFailure: [
        'Hasta 4-6 ciclos IUI antes FIV',
        'Considerar estimulación más agresiva',
        'Re-evaluar factor masculino',
        'Transición a FIV si falla repetida'
      ]
    }
  },

  // 🎯 NIVEL 3: ALTA COMPLEJIDAD

  // Fertilización In Vitro (FIV)
  IVF: {
    id: 'IVF',
    name: 'In Vitro Fertilization',
    nameES: 'Fertilización In Vitro',
    category: 'level3',
    complexity: 'high',
    successRate: {
      perCycle: '35-45% <35 años, 25-35% 35-40 años, 10-15% >40 años',
      cumulative: '60-70% después de 3 ciclos <35 años',
      timeToSuccess: '1-3 ciclos promedio según edad'
    },
    indications: [
      'Obstrucción tubárica bilateral',
      'Factor masculino severo',
      'Endometriosis severa',
      'Falla tratamientos de menor complejidad',
      'Infertilidad inexplicada (segunda línea)',
      'Edad materna avanzada',
      'Preservación fertilidad'
    ],
    contraindications: [
      'Contraindicaciones médicas para embarazo',
      'Anomalías uterinas incompatibles con embarazo',
      'Tumores dependientes de hormonas activos',
      'Insuficiencia ovárica severa',
      'Patología psiquiátrica severa no controlada'
    ],
    prerequisites: [
      'Evaluación médica integral pareja',
      'Asesoramiento genético si indicado',
      'Consentimiento informado completo',
      'Soporte psicológico disponible',
      'Recursos financieros adecuados'
    ],
    procedure: {
      preparation: [
        'Supresión hipofisaria (GnRH agonista/antagonista)',
        'Estimulación ovárica controlada (FSH/LH)',
        'Monitoreo intensivo (ecografía + laboratorio)',
        'Preparación endometrial'
      ],
      execution: [
        'Trigger final maduración ovocitaria (hCG/GnRH agonista)',
        'Aspiración ovocitaria transvaginal (36h post-trigger)',
        'Fertilización in vitro (FIV clásica o ICSI)',
        'Cultivo embrionario 3-5 días',
        'Transferencia embrionaria intrauterina',
        'Criopreservación embriones sobrantes'
      ],
      followUp: [
        'Soporte fase lútea (progesterona)',
        'Beta-hCG 12-14 días post-transferencia',
        'Ecografía embarazo 6-7 semanas si positivo',
        'Seguimiento outcomes y complicaciones'
      ]
    },
    costs: {
      estimate: '$8000-15000 USD por ciclo fresco',
      factors: [
        'Medicamentos estimulación ($2000-4000)',
        'Monitoreo intensivo ($1000-2000)',
        'Procedimientos laboratorio ($3000-5000)',
        'Aspiración y transferencia ($2000-3000)',
        'Criopreservación ($500-1000)',
        'Honorarios médicos ($1000-2000)'
      ]
    },
    risks: {
      maternal: [
        'Síndrome hiperestimulación ovárica (1-3% severo)',
        'Embarazo múltiple (20-25% gemelar)',
        'Complicaciones aspiración (<1% severas)',
        'Embarazo ectópico (2-3%)',
        'Sangrado, infección (<1%)'
      ],
      fetal: [
        'Riesgo malformaciones: levemente aumentado',
        'Bajo peso al nacer (embarazos múltiples)',
        'Prematuridad (embarazos múltiples)'
      ],
      procedural: [
        'Falla fertilización (5-10%)',
        'Ausencia embriones transferibles (10-15%)',
        'Falla implantación (50-60%)',
        'Cancelación ciclo por mala respuesta (5-10%)'
      ]
    },
    monitoring: [
      'Respuesta ovárica (folículos, E2)',
      'Desarrollo embrionario',
      'Receptividad endometrial',
      'Complicaciones médicas',
      'Bienestar psicológico'
    ],
    evidenceLevel: 'A',
    guidelines: [
      'ASRM Practice Guidelines 2021',
      'ESHRE Good Practice Recommendations 2019',
      'ACOG Committee Opinion 2020'
    ],
    nextSteps: {
      ifSuccess: 'Seguimiento obstétrico alto riesgo (embarazo múltiple)',
      ifFailure: [
        'Análisis causas falla (implantación, calidad embrionaria)',
        'Modificaciones protocolos siguientes ciclos',
        'Considerar diagnóstico genético preimplantacional',
        'Evaluar donación gametos si indicado',
        'Soporte psicológico intensivo'
      ]
    }
  },

  // Ovodonación
  eggDonation: {
    id: 'eggDonation',
    name: 'Egg Donation',
    nameES: 'Ovodonación',
    category: 'level3',
    complexity: 'high',
    successRate: {
      perCycle: '50-60% por transferencia',
      cumulative: '70-80% después de 2-3 intentos',
      timeToSuccess: '1-2 ciclos promedio'
    },
    indications: [
      'Falla ovárica prematura',
      'Menopausia',
      'Calidad ovocitaria severamente disminuida',
      'Fallas FIV repetidas por factor ovocitario',
      'Riesgo transmisión enfermedad genética',
      'Quimio/radioterapia previa'
    ],
    contraindications: [
      'Contraindicaciones médicas embarazo',
      'Anomalías uterinas severas',
      'Patología psiquiátrica no controlada',
      'Expectativas irreales del proceso',
      'Falta soporte psicológico adecuado'
    ],
    prerequisites: [
      'Evaluación psicológica integral',
      'Evaluación médica receptora',
      'Asesoramiento legal completo',
      'Selección donante apropiada',
      'Consentimientos informados',
      'Sincronización ciclos'
    ],
    procedure: {
      preparation: [
        'Preparación endometrial receptora (estrógenos)',
        'Estimulación ovárica donante',
        'Sincronización ciclos donante-receptora',
        'Monitoreo desarrollo endometrial'
      ],
      execution: [
        'Aspiración ovocitaria donante',
        'Fertilización ovocitos con semen pareja',
        'Cultivo embrionario 3-5 días',
        'Transferencia embrionaria receptora',
        'Criopreservación embriones excedentes'
      ],
      followUp: [
        'Soporte lúteo progesterona',
        'Beta-hCG 12-14 días post-transferencia',
        'Seguimiento embarazo si positivo',
        'Soporte psicológico continuo'
      ]
    },
    costs: {
      estimate: '$12000-20000 USD por ciclo',
      factors: [
        'Compensación donante ($3000-8000)',
        'Evaluaciones médicas donante ($1000-2000)',
        'Medicamentos receptora ($1000-2000)',
        'Procedimientos laboratorio ($3000-5000)',
        'Honorarios médicos ($2000-3000)',
        'Aspectos legales ($1000-2000)'
      ]
    },
    risks: {
      maternal: [
        'Riesgos embarazo edad avanzada',
        'Hipertensión gestacional aumentada',
        'Diabetes gestacional',
        'Embarazo múltiple si transferencia múltiple'
      ],
      fetal: [
        'Riesgo malformaciones: normal para edad materna',
        'Crecimiento intrauterino restringido',
        'Prematuridad si embarazo múltiple'
      ],
      procedural: [
        'Aspectos psicológicos adopción genética',
        'Falta conexión genética',
        'Decisiones futuras hijos genéticos'
      ]
    },
    monitoring: [
      'Desarrollo endometrial receptora',
      'Respuesta ovárica donante',
      'Calidad embrionaria',
      'Adaptación psicológica proceso',
      'Cumplimiento protocolo preparación'
    ],
    evidenceLevel: 'A',
    guidelines: [
      'ASRM Ethics Committee 2021',
      'ESHRE Task Force Guidelines 2020',
      'ACOG Committee Opinion 2019'
    ],
    nextSteps: {
      ifSuccess: 'Seguimiento obstétrico especializado edad materna',
      ifFailure: [
        'Evaluación calidad embrionaria',
        'Modificación preparación endometrial',
        'Cambio donante si múltiples fallas',
        'Considerar gestación subrogada si factor uterino'
      ]
    }
  },

  // 🎯 PROTOCOLO ESPECÍFICO: MANEJO POR EDAD MATERNA AVANZADA
  ageBasedManagement: {
    id: 'ageBasedManagement',
    name: 'Age-Based Fertility Management',
    nameES: 'Manejo de Fertilidad Basado en Edad Materna',
    category: 'level1', // Variable según edad
    complexity: 'medium', // Variable según protocolo
    successRate: {
      perCycle: 'Variable según edad: <35 años(40-45%), 35-37(30-35%), 38-40(20-25%), ≥41(<15%)',
      cumulative: 'Optimizado según protocolo específico por grupo etario',
      timeToSuccess: 'Escalonado: 3-6 meses nivel 1, 6-12 meses nivel 2-3'
    },
    indications: [
      'Toda mujer con deseo reproductivo según grupo etario',
      'Infertilidad con edad como factor determinante',
      'Planificación reproductiva personalizada',
      'Optimización tiempo-efectividad según edad'
    ],
    contraindications: [
      'Contraindicaciones médicas absolutas para embarazo',
      'Rechazo tratamiento médico',
      'Expectativas no realistas tras consejería'
    ],
    prerequisites: [
      'Evaluación integral: AMH, CFA, FSH',
      'Estudio básico infertilidad completado',
      'Consejería reproductiva según edad',
      'Evaluación riesgos obstétricos por edad'
    ],
    procedure: {
      preparation: [
        'GRUPO <35 AÑOS:',
        '• Evaluación reserva ovárica (AMH, CFA)',
        '• Hasta 3-4 ciclos IUI si condiciones favorables',
        '• FIV/ICSI en indicaciones específicas',
        '',
        'GRUPO 35-37 AÑOS:',
        '• Evaluación reserva ovárica prioritaria', 
        '• Hasta 2-3 ciclos IUI con estimulación moderada',
        '• FIV/ICSI +/- PGT-A según contexto clínico',
        '',
        'GRUPO 38-40 AÑOS:',
        '• Máximo 1-2 intentos IUI en condiciones ideales',
        '• FIV/ICSI + PGT-A como tratamiento preferente',
        '• Consejería sobre donación ovocitaria si AMH <0.8',
        '',
        'GRUPO 41-42 AÑOS:',
        '• No IUI recomendado salvo excepciones',
        '• FIV-ICSI + PGT-A obligatorio',
        '• Donación ovocitaria si AMH <0.5 o fallos previos',
        '',
        'GRUPO ≥43 AÑOS:',
        '• Ovodonación como primera recomendación',
        '• FIV con ovocitos propios solo tras consejería exhaustiva'
      ],
      execution: [
        'NIVEL 1 (Baja complejidad):',
        '• <35 años: IUI + estimulación leve (hasta 4 ciclos)',
        '• 35-37 años: IUI + estimulación moderada (hasta 3 ciclos)', 
        '• 38-40 años: IUI solo condiciones ideales (máximo 2 ciclos)',
        '',
        'NIVEL 2-3 (Alta complejidad):',
        '• <35 años: FIV convencional, ICSI según indicación',
        '• 35-37 años: FIV/ICSI, considerar PGT-A tras fallos',
        '• 38-40 años: FIV-ICSI + PGT-A recomendado',
        '• 41-42 años: FIV-ICSI + PGT-A o donación ovocitaria',
        '• ≥43 años: Ovodonación preferente'
      ],
      followUp: [
        'Monitoreo según protocolo específico aplicado',
        'Reevaluación tras cada fallo de ciclo',
        'Ajuste estrategia según respuesta y edad progresiva',
        'Consejería continua sobre opciones disponibles'
      ]
    },
    costs: {
      estimate: 'Variable: IUI $800-1500, FIV/ICSI $8000-15000, Ovodonación $15000-25000',
      factors: [
        'Complejidad tratamiento según edad',
        'Necesidad PGT-A (adicional $3000-5000)',
        'Medicamentos estimulación ovárica',
        'Monitoreo adicional en edades avanzadas',
        'Costos donación ovocitaria si aplicable'
      ]
    },
    risks: {
      maternal: [
        '<35 años: Riesgos mínimos, embarazo múltiple principal',
        '35-40 años: Diabetes gestacional, preeclampsia aumentadas',
        '>40 años: Complicaciones obstétricas significativas',
        'Síndrome hiperestimulación variable según protocolo',
        'Riesgos quirúrgicos FIV aumentan con edad'
      ],
      fetal: [
        '<35 años: Riesgo aneuploidía basal (<1:1000)',
        '35-37 años: Riesgo aneuploidía moderado (1:400-1:200)',
        '38-40 años: Riesgo aneuploidía alto (1:200-1:100)',
        '>40 años: Riesgo aneuploidía muy alto (>1:100)',
        'Mayor tasa aborto espontáneo con edad avanzada'
      ],
      procedural: [
        'Respuesta ovárica disminuida con edad',
        'Calidad embrionaria reducida',
        'Tasas implantación menores',
        'Mayor complejidad técnica en edades avanzadas'
      ]
    },
    monitoring: [
      'Seguimiento estricto reserva ovárica',
      'Evaluación respuesta según edad',
      'Monitoreo complicaciones obstétricas aumentadas',
      'Vigilancia aneuploidía fetal según grupo etario',
      'Ajustes protocolares según evolución edad'
    ],
    evidenceLevel: 'A',
    guidelines: [
      'ESHRE Guidelines 2023: Female Fertility Assessment',
      'ASRM Committee Opinion Age-related Fertility Decline 2024',
      'NICE Fertility Guidelines Update 2024',
      'CDC ART Success Rates National Summary 2023',
      'ESHRE Recommendations Advanced Female Age 2024'
    ],
    nextSteps: {
      ifSuccess: 'Seguimiento obstétrico de alto riesgo según edad materna',
      ifFailure: [
        '<35 años: Escalamiento a FIV/ICSI tras fallos IUI',
        '35-37 años: FIV-ICSI +/- PGT-A según fallos',
        '38-40 años: Considerar donación ovocitaria tras 2-3 fallos FIV',
        '≥41 años: Ovodonación como siguiente paso preferente',
        'Consejería integral opciones reproductivas restantes',
        'Evaluación adopción u otras alternativas familiares'
      ]
    }
  }
};

/**
 * 🎯 UTILIDADES PARA ANÁLISIS Y RECOMENDACIÓN DE TRATAMIENTOS
 */
export class TreatmentRecommender {
  /**
   * Recomienda tratamiento basado en diagnóstico y características del paciente
   */
  static recommendTreatment(
    diagnosis: string[],
    patientAge: number,
    infertilityDuration: number,
    priorTreatments: string[] = []
  ): TreatmentProtocol[] {
    const recommendations: TreatmentProtocol[] = [];
    
    // Algoritmo de escalamiento terapéutico
    if (patientAge < 35 && infertilityDuration < 24 && priorTreatments.length === 0) {
      // Primera línea: tratamientos de baja complejidad
      if (diagnosis.includes('ovulationDisorders') || diagnosis.includes('PCOS')) {
        recommendations.push(TREATMENTS_DATABASE.ovulationInduction);
      }
      if (diagnosis.includes('unexplainedInfertility')) {
        recommendations.push(TREATMENTS_DATABASE.timedIntercourse);
      }
    } else if (patientAge < 40 && (infertilityDuration >= 24 || priorTreatments.length > 0)) {
      // Segunda línea: complejidad media
      if (diagnosis.includes('maleInfertility') || diagnosis.includes('unexplainedInfertility')) {
        recommendations.push(TREATMENTS_DATABASE.IUI);
      }
    } else {
      // Tercera línea: alta complejidad
      recommendations.push(TREATMENTS_DATABASE.IVF);
      
      if (patientAge > 42 || diagnosis.includes('prematureOvarianFailure')) {
        recommendations.push(TREATMENTS_DATABASE.eggDonation);
      }
    }
    
    return recommendations;
  }

  /**
   * Calcula probabilidad de éxito por edad y tratamiento
   */
  static calculateSuccessRate(treatmentId: string, age: number): {
    perCycle: number;
    cumulative: number;
  } {
    const treatment = TREATMENTS_DATABASE[treatmentId];
    if (!treatment) return { perCycle: 0, cumulative: 0 };

    // Ajustes por edad (factores simplificados)
    const ageMultiplier = this.calculateAgeMultiplier(age);

    // Extractar tasas base según tratamiento
    const baseRate = this.getBaseRateByTreatment(treatmentId, age);

    return {
      perCycle: Math.round(baseRate * ageMultiplier),
      cumulative: Math.round(baseRate * ageMultiplier * 3) // Aproximación 3 ciclos
    };
  }

  /**
   * Calcula multiplicador de éxito basado en edad
   */
  private static calculateAgeMultiplier(age: number): number {
    if (age > 42) return 0.3;
    if (age > 40) return 0.5;
    if (age > 35) return 0.8;
    return 1.0;
  }

  /**
   * Obtiene tasa base según tipo de tratamiento y edad
   */
  private static getBaseRateByTreatment(treatmentId: string, age: number): number {
    switch (treatmentId) {
      case 'IVF':
        return this.getIVFBaseRate(age);
      case 'IUI':
        return 15;
      case 'ovulationInduction':
        return 20;
      default:
        return 10;
    }
  }

  /**
   * Calcula tasa base específica para FIV según edad
   */
  private static getIVFBaseRate(age: number): number {
    if (age < 35) return 40;
    if (age < 40) return 30;
    return 12;
  }

  /**
   * Obtiene siguiente paso si falla tratamiento actual
   */
  static getNextStepAfterFailure(currentTreatment: string, _cycles: number): string[] {
    const treatment = TREATMENTS_DATABASE[currentTreatment];
    return treatment?.nextSteps.ifFailure || ['Consultar especialista'];
  }
}

export default TREATMENTS_DATABASE;
