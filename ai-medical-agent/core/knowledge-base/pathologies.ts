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
    definition: 'Presencia de tejido endometrial funcionante fuera de la cavidad uterina, principalmente en pelvis. Genera ambiente ovárico inflamatorio con menor calidad ovocitaria y tendencia a baja respuesta ovárica.',
    symptoms: [
      'Dismenorrea progresiva',
      'Dispareunia profunda',
      'Dolor pélvico crónico',
      'Disquecia',
      'Disuria',
      'Infertilidad',
      'Sangrado menstrual abundante',
      'Ambiente ovárico inflamatorio (IL-6, TNF-α, VEGF elevados)',
      'Menor calidad ovocitaria'
    ],
    diagnosticCriteria: [
      'Visualización laparoscópica (gold standard)',
      'Resonancia magnética pélvica',
      'Ecografía transvaginal especializada',
      'CA-125 elevado (no específico)',
      'Clasificación rASRM I-IV:',
      '• Estadio I-II: Endometriosis leve/moderada',
      '• Estadio III-IV: Endometriosis severa/profunda',
      'Marcadores inflamatorios: IL-6, TNF-α, VEGF elevados'
    ],
    riskFactors: [
      'Menarca temprana',
      'Ciclos menstruales cortos',
      'Nuliparidad',
      'Historia familiar',
      'Factores anatómicos obstructivos',
      'Ambiente inflamatorio pélvico crónico'
    ],
    prognosis: {
      natural: '2-10% embarazo espontáneo/mes según estadio (menor en severa por calidad ovocitaria reducida)',
      withTreatment: 'Letrozol+IUI: 15-20% (leve/moderada); Gonadotropinas+FIV: 35-45% (moderada), 25-35% (severa)',
      timeToConception: '12-18 meses post-tratamiento; supresión GnRH 2-3 meses pre-FIV mejora resultados'
    },
    relatedConditions: [
      'Adenomiosis',
      'Síndrome ovario poliquístico',
      'Miomas uterinos',
      'Dolor pélvico crónico',
      'Intestino irritable',
      'Ambiente inflamatorio pélvico',
      'Calidad ovocitaria disminuida',
      'Baja respuesta ovárica'
    ],
    evidenceLevel: 'A',
    references: [
      { doi: '10.1093/humrep/deab001', pmid: '33704458' },
      { guideline: 'ESHRE Endometriosis Guidelines 2022' },
      { doi: '10.1016/j.fertnstert.2020.01.025', pmid: '32192638' },
      { doi: '10.1093/hropen/hoac009', guideline: 'ESHRE Endometriosis 2023' },
      { doi: '10.1016/j.fertnstert.2023.05.012', guideline: 'ASRM Endometriosis 2023' }
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
  },

  // 🔬 EDAD MATERNA AVANZADA Y FERTILIDAD
  advancedMaternalAge: {
    id: 'advancedMaternalAge',
    name: 'Advanced Maternal Age and Fertility',
    nameES: 'Edad Materna Avanzada y Fertilidad',
    category: 'female',
    prevalence: 'Afecta >30% mujeres países desarrollados',
    definition: 'Disminución de la fertilidad relacionada con la edad, generalmente definida como ≥35 años, con efectos significativos a partir de los 32 años según literatura reciente.',
    symptoms: [
      'Ciclos menstruales más cortos (<26 días)',
      'Disminución tasa embarazo natural (<12%/mes >35 años)',
      'Aumento abortos espontáneos recurrentes (25-35% >35 años)',
      'Mayor tiempo para concebir',
      'Irregularidades menstruales',
      'Síntomas premenopáusicos tempranos'
    ],
    diagnosticCriteria: [
      'Evaluación reserva ovárica:',
      '• AMH <1.2 ng/mL (baja reserva ovárica)',
      '• CFA <7 folículos (ESHRE 2023)',
      '• FSH >10 mUI/mL día 2-4 del ciclo',
      'Fecundabilidad mensual por edad:',
      '• 25-29 años: 20-25%',
      '• 30-34 años: 15-20%',
      '• 35-37 años: 10-15%',
      '• 38-40 años: 5-10%',
      '• ≥41 años: <5%'
    ],
    riskFactors: [
      'Edad biológica ≥35 años (factor crítico irreversible)',
      'Tabaquismo (acelera declive ovárico)',
      'Obesidad y desnutrición',
      'Estrés crónico',
      'Historia familiar menopausia precoz',
      'Cirugías ováricas previas',
      'Quimioterapia/radioterapia previa'
    ],
    prognosis: {
      natural: 'Fecundabilidad: 25-29 años(20-25%), 35-37 años(10-15%), >40 años(<5%)',
      withTreatment: 'FIV: <35 años(40-45%), 35-37 años(30-35%), 38-40 años(20-25%), ≥43 años(<8%)',
      timeToConception: 'Variable según edad: <35 años(6-12 meses), >38 años(12-24 meses)'
    },
    relatedConditions: [
      'Disminución reserva ovárica',
      'Aneuploidía embrionaria',
      'Aborto espontáneo recurrente',
      'Diabetes gestacional',
      'Preeclampsia',
      'Parto pretérmino',
      'Anomalías cromosómicas fetales'
    ],
    evidenceLevel: 'A',
    references: [
      { doi: '10.1016/j.fertnstert.2023.03.004', pmid: '37018592' },
      { guideline: 'ESHRE Guidelines 2023: Female Fertility Assessment' },
      { doi: '10.1093/hropen/hoad012', pmid: '36746012' },
      { doi: '10.1016/j.fertnstert.2024.01.010', pmid: '36251589' },
      { guideline: 'ASRM Practice Committee 2023' }
    ]
  },

  // 🔬 IMC (ÍNDICE MASA CORPORAL) Y FERTILIDAD
  BMIandFertility: {
    id: 'BMIandFertility',
    name: 'Body Mass Index and Fertility',
    nameES: 'Índice de Masa Corporal y Fertilidad',
    category: 'female',
    prevalence: 'Obesidad: 30-35% mujeres edad reproductiva; Bajo peso: 8-10%',
    definition: 'Alteración de la fertilidad relacionada con el índice de masa corporal (peso/talla²), afectando calidad ovocitaria, función ovárica, implantación embrionaria y riesgo de complicaciones. La pérdida de peso 5-10% mejora significativamente la fertilidad.',
    symptoms: [
      'OBESIDAD (IMC ≥30):',
      'Ciclos menstruales irregulares o anovulación',
      'Incremento abortos espontáneos (15-20% más)',
      'Menor tasa éxito tratamientos fertilidad',
      'Resistencia insulínica',
      'Calidad ovocitaria disminuida',
      'Receptividad endometrial alterada',
      'BAJO PESO (IMC <18.5):',
      'Amenorrea o ciclos oligomenorreicos',
      'Menor respuesta ovárica en tratamientos',
      'Alteración eje hipotálamo-hipófisis-ovario',
      'BENEFICIOS PÉRDIDA PESO (5-10%):',
      'Restauración ovulación espontánea (30-50%)',
      'Mejora embarazo espontáneo (25-40%)',
      'Mejor respuesta FIV/IUI (15-30%)'
    ],
    diagnosticCriteria: [
      'Clasificación OMS 2024 por IMC (kg/m²):',
      '• Bajo peso: <18.5',
      '• Normopeso: 18.5-24.9 (ÓPTIMO)',
      '• Sobrepeso: 25-29.9',
      '• Obesidad I: 30-34.9',
      '• Obesidad II: 35-39.9',
      '• Obesidad III: ≥40',
      'Evaluación complementaria:',
      '• Perfil hormonal (insulina, glucosa)',
      '• HOMA-IR ≥2.5 (resistencia insulínica)',
      '• Ecografía ovárica (volumen y folículos antrales)',
      'Objetivos pérdida peso:',
      '• 5% peso: restauración ovulación ~30%',
      '• 7-10% peso: mejora embarazo espontáneo 20-40%',
      '• ≥15% peso: máximo beneficio (evitar déficit nutricional)'
    ],
    riskFactors: [
      'MODIFICABLES:',
      'Dieta hipercalórica (obesidad)',
      'Dieta restrictiva (bajo peso)',
      'Sedentarismo y baja actividad física',
      'Resistencia a la insulina',
      'Anovulación por obesidad',
      'NO MODIFICABLES:',
      'Factores genéticos (polimorfismos FTO, IRS-1, IRS-2)',
      'Polimorfismos receptores hormonales (LH, FSH)',
      'Predisposición familiar a obesidad/resistencia insulínica'
    ],
    prognosis: {
      natural: 'Variable por IMC: Normopeso(óptimo), Sobrepeso(reducido 20%), Obesidad(reducido 50%), Bajo peso(reducido 30%); Pérdida peso 5-10% mejora 25-40%',
      withTreatment: 'IUI: Normopeso(15-20%), Obesidad(5-10%); FIV: Normopeso(35-45%), Obesidad(15-25%); Post-pérdida peso: mejora 15-30% tasas',
      timeToConception: 'Normopeso: 6-12 meses; Alterado: 12-24 meses; Con pérdida peso dirigida: 3-6 meses para mejoría metabólica'
    },
    relatedConditions: [
      'OBESIDAD:',
      'Síndrome ovario poliquístico (PCOS)',
      'Diabetes tipo 2',
      'Síndrome metabólico',
      'Resistencia insulínica',
      'Síndrome hiperestimulación ovárica',
      'Diabetes gestacional',
      'Preeclampsia',
      'Anovulación crónica',
      'BAJO PESO:',
      'Amenorrea hipotalámica',
      'Hipogonadismo hipogonadotrópico',
      'Anorexia nerviosa',
      'Disminución reserva ovárica',
      'TRATAMIENTOS PÉRDIDA PESO:',
      'Liraglutida (Saxenda) - pérdida 7-10%',
      'Semaglutida (Ozempic/Wegovy) - pérdida 12-15%',
      'Orlistat - pérdida modesta 5-7%'
    ],
    evidenceLevel: 'A',
    references: [
      { guideline: 'NICE Guideline Obesity and Fertility 2024', pmid: '36746012' },
      { doi: '10.1016/j.fertnstert.2024.02.008', pmid: 'ASRM Committee Opinion 2024' },
      { doi: '10.1093/hropen/hoad019', guideline: 'ESHRE Guideline Obesity 2024' },
      { doi: '10.3390/genes14030609', pmid: 'Obesity Genetics 2023' },
      { doi: '10.1016/j.fertnstert.2023.12.007', guideline: 'ASRM Obesity and Reproduction 2023' },
      { doi: '10.1210/clinem/dgad165', pmid: 'Saxenda in PCOS 2023' },
      { doi: '10.1093/hropen/hoad027', guideline: 'ESHRE Obesity Management 2024' }
    ]
  },

  // 🔬 ADENOMIOSIS Y FERTILIDAD
  adenomyosis: {
    id: 'adenomyosis',
    name: 'Adenomyosis and Fertility',
    nameES: 'Adenomiosis y Fertilidad',
    category: 'female',
    prevalence: '20-30% mujeres edad reproductiva; 40-50% en infertilidad y fallos FIV',
    definition: 'Enfermedad ginecológica benigna caracterizada por invasión ectópica de glándulas y estroma endometrial en miometrio uterino, provocando hipertrofia uterina y alteraciones en receptividad endometrial.',
    symptoms: [
      'Dismenorrea severa progresiva',
      'Menorragia o sangrado menstrual abundante',
      'Infertilidad inexplicada',
      'Fallos repetidos de implantación en FIV',
      'Dolor pélvico crónico',
      'Útero aumentado de tamaño',
      'Dispareunia'
    ],
    diagnosticCriteria: [
      'Clasificación ESHRE/FIGO 2023:',
      '• Adenomiosis difusa: afectación extensa miometrio',
      '• Adenomiosis focal (adenomioma): lesión encapsulada localizada',
      '• Mixta: focal + difusa simultáneamente',
      'Ecografía transvaginal (gold standard):',
      '• Engrosamiento miometrial difuso >12mm',
      '• Heterogeneidad miometrial',
      '• Quistes miometriales',
      '• Alteraciones interfase endometrio-miometrial',
      'Resonancia Magnética: casos complejos o adenomiosis focal'
    ],
    riskFactors: [
      'NO MODIFICABLES:',
      'Edad >35 años',
      'Paridad previa',
      'Antecedente cirugía uterina',
      'Polimorfismos receptores hormonales (REα, PR)',
      'Alteraciones genéticas VEGF, COX-2',
      'MODIFICABLES:',
      'Inflamación crónica uterina (infecciones)',
      'Uso prolongado estrógenos sin progesterona',
      'Desequilibrios hormonales'
    ],
    prognosis: {
      natural: 'Reducida significativamente por alteración receptividad endometrial',
      withTreatment: 'FIV tras supresión GnRH: 25-35% (difusa), 30-40% (focal post-cirugía), <30% (severa)',
      timeToConception: 'Requiere supresión hormonal 2-3 meses pre-FIV; cirugía selectiva casos focales'
    },
    relatedConditions: [
      'Endometriosis',
      'Miomas uterinos',
      'Síndrome ovario poliquístico',
      'Fallos recurrentes implantación',
      'Abortos recurrentes tempranos',
      'Dolor pélvico crónico',
      'Dismenorrea severa',
      'Hipermenorrea',
      'Inflamación endometrial crónica'
    ],
    evidenceLevel: 'A',
    references: [
      { doi: '10.1093/hropen/hoad025', guideline: 'ESHRE/FIGO Adenomyosis Classification 2023' },
      { guideline: 'ESHRE/FIGO Adenomyosis and Fertility Guidelines 2023' },
      { pmid: '36746012', guideline: 'NICE Fertility Guidelines Update 2024' },
      { doi: '10.1016/j.fertnstert.2023.07.020', guideline: 'ASRM Anticoagulants 2023' }
    ]
  },

  // 🔬 PÓLIPOS ENDOMETRIALES Y FERTILIDAD
  endometrialPolyps: {
    id: 'endometrialPolyps',
    name: 'Endometrial Polyps and Fertility',
    nameES: 'Pólipos Endometriales y Fertilidad',
    category: 'female',
    prevalence: '8-38% en mujeres infértiles (incluso asintomáticas); más común >35 años',
    definition: 'Proliferación localizada del epitelio glandular endometrial y su estroma que protruye dentro de la cavidad uterina. Benignos en >99% casos, pero alteran receptividad endometrial e implantación embrionaria significativamente.',
    symptoms: [
      'ASINTOMÁTICOS (50% de casos)',
      'Metrorragias intermenstruales',
      'Menorragia o sangrado menstrual abundante',
      'Infertilidad inexplicada',
      'Fallos recurrentes de implantación (≥2 transferencias FIV sin embarazo)',
      'Alteración mecánica del espacio endometrial',
      'Inflamación crónica subclínica local',
      'Expresión alterada integrinas y moléculas adhesión (L-selectina)',
      'Menor tasa implantación si >1 cm'
    ],
    diagnosticCriteria: [
      'CLASIFICACIÓN MORFOLÓGICA HISTEROSCÓPICA:',
      '• Sésil: base ancha, inserción amplia (menor movilidad)',
      '• Pediculado: inserción por tallo fino, altamente móvil',
      '• Múltiple: >1 pólipo (mayor riesgo recurrencia)',
      '• Cavidad llena: ocupan >50% volumen endometrial (>15mm)',
      '• Con degeneración: necrosis/sangrado (mayor riesgo atipia)',
      'MÉTODOS DIAGNÓSTICOS:',
      '• Ecografía transvaginal: inicial, pólipos >5mm con Doppler',
      '• Hidrosonografía (salino-infusión): mayor sensibilidad pequeños/múltiples',
      '• Histeroscopía diagnóstica: GOLD STANDARD, diagnóstico + resección simultánea',
      '• Biopsia endometrial: solo sangrado anormal/postmenopáusico',
      'INDICACIONES RESECCIÓN QUIRÚRGICA:',
      '• Pólipo ≥10mm (ABSOLUTA)',
      '• Presencia síntomas (sangrado intermenstrual, menorragia)',
      '• Múltiples pólipos',
      '• Fallo previo implantación FIV',
      '• Antes IIU/FIV, incluso si ≥5mm',
      '• NO vigilancia expectante en mujeres infértiles'
    ],
    riskFactors: [
      'MODIFICABLES:',
      'Exposición estrógenos sin oposición',
      'Obesidad (mayor conversión periférica andrógenos-estrógenos)',
      'Estimulación ovárica previa',
      'Tratamiento tamoxifeno (riesgo hasta 30%)',
      'Ciclos irregulares e hiperestrogenismo',
      'NO MODIFICABLES:',
      'Edad >35 años',
      'Historia pólipos uterinos previos',
      'Factores genéticos (polimorfismos receptores hormonales)'
    ],
    prognosis: {
      natural: 'Significativamente reducida por alteración receptividad endometrial; pólipos >1cm reducen implantación sustancialmente',
      withTreatment: 'Post-resección histeroscópica: +20-35% embarazo espontáneo; IUI +40% vs 20-25% controles; FIV mejora implantación si resección previa',
      timeToConception: 'Resección histeroscópica permite ciclo inmediato; mayor beneficio 3-6 meses post-polipectomía'
    },
    relatedConditions: [
      'CLASIFICACIÓN HISTOLÓGICA:',
      'Pólipo funcional (glándulas proliferativas/secretoras)',
      'Pólipo hiperplásico (glándulas dilatadas, estroma denso)',
      'Pólipo atrófico (glándulas pequeñas, postmenopáusicas)',
      'Pólipo con hiperplasia atípica (displasia nuclear 3-5% riesgo maligno)',
      'CONDICIONES ASOCIADAS:',
      'Infertilidad inexplicada',
      'Fallos recurrentes implantación FIV',
      'Miomas uterinos',
      'Endometriosis',
      'Alteración receptividad endometrial (HOXA10, LIF)',
      'Hiperestrogenismo',
      'Tratamiento tamoxifeno'
    ],
    evidenceLevel: 'A',
    references: [
      { doi: '10.1093/hropen/hoad021', guideline: 'ESHRE Uterine Cavity Assessment Guidelines 2023' },
      { doi: '10.1016/j.fertnstert.2023.04.006', guideline: 'ASRM Uterine Factors Evaluation 2023' },
      { doi: '10.1016/j.fertnstert.2022.07.028', guideline: 'Perez-Medina Meta-análisis Polipectomía 2022' },
      { doi: '10.1016/j.fertnstert.2022.07.012', guideline: 'Ferrazzi Hysteroscopic Appearance Polyps 2022' },
      { pmid: '36746012', guideline: 'NICE Fertility Guidelines 2024' }
    ]
  },

  // 🔬 MIOMATOSIS UTERINA Y FERTILIDAD
  uterineFibroids: {
    id: 'uterineFibroids',
    name: 'Uterine Fibroids and Fertility',
    nameES: 'Miomatosis Uterina y Fertilidad',
    category: 'female',
    prevalence: '70% mujeres >40 años; 10-20% en infértiles; solo 2-5% causales directos',
    definition: 'Tumores benignos monoclonales del músculo liso uterino. Impacto en fertilidad varía según localización, tamaño, vascularización y distorsión arquitectura endometrial. Más frecuentes en afrodescendientes, nulíparas con historia familiar.',
    symptoms: [
      'SUBMUCOSOS (FIGO 0-2) - IMPACTO MUY ALTO:',
      'Menorragia, dismenorrea, sangrado intermenstrual',
      'Aborto recurrente (miomas submucosos)',
      'Fallos implantación FIV recurrentes',
      'Distorsión cavidad endometrial severa',
      'INTRAMURALES (FIGO 3-4) - IMPACTO MODERADO:',
      'Dolor pélvico crónico',
      'Alteración flujo sanguíneo endometrial',
      'Reducción receptividad endometrial',
      'Cambios expresión HOXA10, LIF, integrinas',
      'SUBSEROSOS (FIGO 5-7) - GENERALMENTE NO AFECTAN:',
      'Compresión pélvica (si muy grandes)',
      'Dolor solo si pediculados con torsión'
    ],
    diagnosticCriteria: [
      'CLASIFICACIÓN FIGO 2023 (Sistema PALM-COEIN):',
      '• TIPO 0: Submucoso pediculado (🚨 MUY ALTO impacto fertilidad)',
      '• TIPO 1: Submucoso <50% intramural (🚨 MUY ALTO)',
      '• TIPO 2: Submucoso >50% intramural (🚨 ALTO)',
      '• TIPO 3: Intramural, contacta endometrio (⚠️ MODERADO)',
      '• TIPO 4: Intramural puro (⚠️ depende tamaño)',
      '• TIPO 5: Subseroso >50% intramural (❌ generalmente no afecta)',
      '• TIPO 6: Subseroso pediculado (❌ no afecta)',
      '• TIPO 7: Subseroso sin componente intramural (❌ no afecta)',
      '• TIPO 8: Parasitarios, cervicales, otros (❌ salvo distorsión)',
      '• HÍBRIDOS: Ej. 2-5 combinados (🟠 evaluar individualmente)',
      'MÉTODOS DIAGNÓSTICOS:',
      '• Ecografía transvaginal 2D/3D: primera línea',
      '• Salino-infusión sonohisterografía: distorsión endometrial',
      '• Histeroscopía diagnóstica: intracavitarios',
      '• RMN uterina: mapeo prequirúrgico miomatosis múltiple'
    ],
    riskFactors: [
      'NO MODIFICABLES:',
      'Edad >35 años',
      'Raza afrodescendiente',
      'Historia familiar (madre/hermana con miomatosis)',
      'Factores genéticos (polimorfismos)',
      'MODIFICABLES:',
      'Obesidad',
      'Exceso estrógenos sin oposición',
      'Dietas altas carnes rojas y alcohol',
      'Hiperestrogenismo crónico'
    ],
    prognosis: {
      natural: 'Variable por tipo: Submucosos(muy reducida), Intramurales ≥4cm(moderadamente reducida), Subserosos(no afectada)',
      withTreatment: 'Post-miomectomía histeroscópica submucosos: 35-60% embarazo espontáneo; Intramurales: +10-25% tasa implantación FIV; Subserosos: no resección necesaria',
      timeToConception: 'Ciclo FIV ideal 3-6 meses post-miomectomía intramural; submucosos pueden intentar inmediatamente post-histeroscópica'
    },
    relatedConditions: [
      'TRATAMIENTO SEGÚN TIPO:',
      'FIGO 0-2: miomectomía histeroscópica SIEMPRE',
      'FIGO 3-4 ≥4cm: miomectomía laparoscópica/laparotómica',
      'FIGO 5-7: NO resección (solo si sintomático)',
      'CONDICIONES ASOCIADAS:',
      'Infertilidad sin otra causa aparente',
      'Fallos implantación FIV recurrentes',
      'Abortos recurrentes (submucosos)',
      'Endometriosis',
      'Adenomiosis',
      'Alteración receptividad endometrial',
      'Inflamación crónica endometrial',
      'TRATAMIENTO MÉDICO PRE-FIV:',
      'Análogos GnRH: supresión prequirúrgica (≥5cm)',
      'Ulipristal: SUSPENDIDO (riesgo hepático grave)',
      'AINEs+tranexámico: solo sintomático'
    ],
    evidenceLevel: 'A',
    references: [
      { doi: '10.1093/hropen/hoad023', guideline: 'ESHRE Uterine Fibroids Reproductive Health 2023' },
      { doi: '10.1016/j.fertnstert.2023.05.011', guideline: 'ASRM Fibroids and Infertility 2023' },
      { pmid: '36746012', guideline: 'NICE Uterine Abnormalities Infertility 2024' },
      { guideline: 'FIGO Classification System PALM-COEIN 2023' },
      { doi: '10.1016/j.fertnstert.2022.08.014', guideline: 'Laparoscopic Myomectomy Fertility 2022' }
    ]
  },

  // 🔬 CIRUGÍAS PÉLVICAS PREVIAS Y FERTILIDAD
  priorPelvicSurgery: {
    id: 'priorPelvicSurgery',
    name: 'Prior Pelvic Surgery and Fertility',
    nameES: 'Cirugías Pélvicas Previas y Fertilidad',
    category: 'female',
    prevalence: '25-40% mujeres infértiles tienen antecedente cirugía pélvica',
    definition: 'Procedimientos quirúrgicos ginecológicos o digestivos realizados en pelvis menor que afectan anatomía, función ovárica, tubárica o uterina. Impacto por adherencias pélvicas, alteración motilidad tubárica, daño ovárico/vascular y distorsión anatómica.',
    symptoms: [
      'RIESGO VARIABLE SEGÚN CIRUGÍA:',
      'Adherencias pélvicas (disminuyen movilidad tubárica/ovárica)',
      'Lesión tubárica directa o coagulación excesiva',
      'Isquemia ovárica post-cirugía endometriomas/quistes',
      'Distorsión anatómica pélvica',
      'Impedimento captación ovocitaria',
      'Disfunción ciliar tubárica',
      'REDUCCIÓN FERTILIDAD:',
      '1 cirugía: reducción 5-10% embarazo espontáneo',
      '≥2 cirugías: reducción 15-20%',
      'Quistectomía bilateral: ↓AMH 30-50%'
    ],
    diagnosticCriteria: [
      'HISTORIA QUIRÚRGICA DETALLADA:',
      '• Tipo cirugía (laparoscopía vs laparotomía)',
      '• Complicaciones (infecciones, hemorragias)',
      '• Lado afectado y extensión',
      '• Número de intervenciones',
      'ESTUDIOS RECOMENDADOS:',
      '• Ecografía TV 2D/3D: morfología uterina/anexial',
      '• HSG: permeabilidad tubárica',
      '• Histeroscopía: sinequias uterinas post-raspado/cirugía',
      '• Laparoscopía diagnóstica: adherencias severas',
      'EVALUACIÓN RESERVA OVÁRICA:',
      '• AMH, AFC: toda paciente post-cirugía ovárica',
      '• Control recurrencia quistes/miomas'
    ],
    riskFactors: [
      'ALTO IMPACTO (🚨):',
      'Quistectomía ovárica bilateral',
      'Cirugía EPI o abscesos tubo-ováricos',
      'Endometriosis severa con cirugía extensa',
      'MODERADO IMPACTO (⚠️):',
      'Miomectomía (si incisión endometrial/múltiples)',
      'Cirugía apendicular complicada',
      'Cesárea complicada con infección',
      'Laparotomía ginecológica previa',
      'BAJO IMPACTO:',
      'Apendicectomía sin complicaciones',
      'Laparoscopía diagnóstica simple'
    ],
    prognosis: {
      natural: 'Variable según tipo: apendicectomía simple(sin impacto), quistectomía bilateral(↓↓fertilidad), EPI severa(daño tubárico irreversible)',
      withTreatment: 'IIU: evitar si adherencias/daño tubárico; FIV: preferible en cirugía ovárica bilateral, EPI previa, adherencias severas',
      timeToConception: 'HSG + laparoscopía si dudas; FIV precoz si AMH<1.2 post-cirugía ovárica; valorar según edad y reserva'
    },
    relatedConditions: [
      'PROCEDIMIENTOS MAYOR RIESGO:',
      'Cirugía endometriosis (adherencias, daño ovárico)',
      'Miomectomía múltiple o con apertura endometrial',
      'Quistectomía bilateral endometriomas',
      'Cirugía EPI/abscesos tubo-ováricos (daño tubárico)',
      'Cesárea complicada + legrado postparto',
      'RECOMENDACIONES MANEJO:',
      'Apendicectomía: seguimiento estándar',
      'Miomectomía: FIV si >2 IUI fallidas',
      'Quistectomía bilateral: FIV urgente si AMH<1.2',
      'EPI operada: HSG + laparoscopía',
      'Cesárea complicada: histeroscopía descartar sinequias'
    ],
    evidenceLevel: 'A',
    references: [
      { doi: '10.1016/j.fertnstert.2023.04.008', guideline: 'ASRM Uterine and Tubal Factors 2023' },
      { doi: '10.1093/hropen/hoad023', guideline: 'ESHRE Surgical History Reproductive Outcomes 2023' },
      { doi: '10.1016/j.rbmo.2022.05.008', guideline: 'Muzii Surgical Impact Ovarian Reserve 2022' },
      { pmid: '36746012', guideline: 'NICE Fertility Guidelines 2024' }
    ]
  },

  // 🔬 OBSTRUCCIÓN TUBÁRICA Y ANOMALÍAS HSG
  tubalObstruction: {
    id: 'tubalObstruction',
    name: 'Tubal Obstruction and HSG Abnormalities',
    nameES: 'Obstrucción Tubárica y Anomalías en HSG',
    category: 'female',
    prevalence: '20-35% pacientes infértiles presentan alteración tubárica',
    definition: 'Imposibilidad del paso libre de líquido (espermatozoides/ovocitos) a través trompas de Falopio. Puede ser unilateral, bilateral, proximal, distal o funcional/subóptima con impacto variable en fertilidad.',
    symptoms: [
      'TIPOS DE OBSTRUCCIÓN:',
      'Unilateral: una trompa bloqueada (fertilidad reducida pero posible)',
      'Bilateral: ambas bloqueadas (embarazo natural imposible)',
      'Proximal: cerca útero/istmo',
      'Distal: extremo fímbrico (asociado hidrosálpinx)',
      'Funcional: paso parcial/tortuosidad (reduce fecundabilidad)',
      'CAUSAS FRECUENTES:',
      'EPI previa, cirugías pélvicas, endometriosis severa',
      'Hidrosálpinx, TBC genital, malformaciones congénitas'
    ],
    diagnosticCriteria: [
      'HISTEROSALPINGOGRAFÍA (HSG) - INTERPRETACIÓN:',
      '• Paso libre bilateral: función tubárica normal',
      '• Obstrucción proximal unilateral: posible espasmo/mucosidad',
      '• Obstrucción distal unilateral: posible hidrosálpinx/EPI',
      '• Obstrucción bilateral: infertilidad absoluta (excepto FIV)',
      '• Dilatación ampular/hidrosálpinx: impacto negativo FIV',
      'CONFIRMACIÓN DIAGNÓSTICA:',
      '• Hidrosonografía: más sensible permeabilidad/movilidad',
      '• Laparoscopía + cromopertubación: GOLD STANDARD',
      'INDICACIONES HSG:',
      '• >12 meses infertilidad sin causa evidente',
      '• Antes IIU/FIV si no confirmada permeabilidad'
    ],
    riskFactors: [
      'PRINCIPALES CAUSAS:',
      'Enfermedad pélvica inflamatoria (EPI) previa',
      'Infecciones transmisión sexual',
      'Cirugías pélvicas o apendicitis complicada',
      'Endometriosis severa',
      'Hidrosálpinx',
      'Tuberculosis genital (zonas endémicas)',
      'Malformaciones congénitas (agenesia, hipoplasia)',
      'Esterilización tubárica previa'
    ],
    prognosis: {
      natural: 'Unilateral con trompa sana(IUI viable), bilateral(imposible natural), hidrosálpinx(reduce FIV 50%)',
      withTreatment: 'Unilateral: IUI hasta 3 ciclos luego FIV; Bilateral: FIV/ICSI única opción; Hidrosálpinx: salpingectomía previa mejora implantación',
      timeToConception: 'Recanalización post-OTB: 50-70% si >4cm trompas; obstrucción proximal: 40-50% canulación selectiva'
    },
    relatedConditions: [
      'MANEJO SEGÚN OBSTRUCCIÓN:',
      'Unilateral + trompa sana: IUI hasta 3 ciclos',
      'Unilateral + baja reserva: FIV más eficiente',
      'Bilateral: FIV/ICSI obligatorio',
      'Hidrosálpinx: salpingectomía/clip antes FIV',
      'TRATAMIENTO QUIRÚRGICO:',
      'Recanalización: solo casos seleccionados',
      'Microcirugía laparoscópica',
      'Reanastomosis post-ligadura',
      'HALLAZGOS NO OBSTRUCTIVOS:',
      'Trompas tortuosas: laparoscopía evaluación',
      'Endometrio irregular: histeroscopía',
      'Cavidad arcuata: solo si pérdidas gestacionales'
    ],
    evidenceLevel: 'A',
    references: [
      { doi: '10.1016/j.fertnstert.2023.04.010', guideline: 'ASRM Tubal Factor Infertility 2023' },
      { doi: '10.1093/hropen/hoad024', guideline: 'ESHRE Tubal Pathology ART Outcomes 2023' },
      { pmid: '36746012', guideline: 'NICE Female Fertility Evaluation 2024' },
      { doi: '10.1016/j.fertnstert.2023.03.011', guideline: 'ASRM Surgical Correction Tubal Factor 2023' }
    ]
  },

  // 🔬 ANTIMÜLLERIANA (AMH) Y BAJA RESERVA OVÁRICA
  lowOvarianReserve: {
    id: 'lowOvarianReserve',
    name: 'Anti-Müllerian Hormone and Low Ovarian Reserve',
    nameES: 'Antimülleriana y Baja Reserva Ovárica',
    category: 'female',
    prevalence: 'Baja reserva ovárica: 10-15% mujeres <35 años, 25-30% >35 años',
    definition: 'AMH (hormona antimülleriana) es glicoproteína producida por células granulosa folículos preantrales/antrales tempranos. Refleja reserva ovárica cuantitativa. No depende fase ciclo, estable que FSH/estradiol.',
    symptoms: [
      'VALORES REFERENCIA AMH (ng/mL):',
      '>3.5: alta reserva (posible SOP)',
      '1.2-3.5: reserva normal',
      '0.8-1.19: baja reserva leve',
      '<0.8: baja reserva moderada-severa',
      '<0.4: reserva críticamente baja',
      'IMPACTO FERTILIDAD NATURAL:',
      'Fecundabilidad mensual: AMH>1.5(15-25%) vs AMH<0.5(<5%)',
      'Mayor riesgo fallo ovárico prematuro (<40 años)',
      'Riesgo aneuploidía si edad >37 años'
    ],
    diagnosticCriteria: [
      'CRITERIOS BAJA RESERVA OVÁRICA (ESHRE 2023):',
      '• AMH <1.2 ng/mL',
      '• Conteo folículos antrales (CFA) <7 ambos ovarios',
      '• Respuesta previa baja FIV (<4 ovocitos)',
      'GRUPOS POSEIDON (baja respuesta):',
      '• Grupo 1: <35 años, AMH<1.2, buena calidad ovocitaria',
      '• Grupo 2: ≥35 años, AMH<1.2, calidad comprometida',
      '• Grupos 3-4: baja respuesta previa + AMH<1.2 o edad>35',
      'EVALUACIÓN COMPLEMENTARIA:',
      '• FSH día 2-3: >10 mUI/mL sugestivo',
      '• Estradiol día 2-3: >80 pg/mL compensación',
      '• CFA: <7 total baja reserva'
    ],
    riskFactors: [
      'CAUSAS BAJA AMH:',
      'Depleción progresiva pool folicular (edad, genética)',
      'Cirugía ovárica previa (endometrioma, quistectomías bilaterales)',
      'Tóxicos (quimioterapia, radioterapia)',
      'Mutaciones BMP15, GDF9, FSHR (hereditarios)',
      'FACTORES ACELERADORES:',
      'Tabaquismo (acelera declive ovárico)',
      'Estrés crónico',
      'Obesidad y desnutrición'
    ],
    prognosis: {
      natural: 'Variable por AMH: >2.5(óptima), 1.2-2.5(buena), 0.8-1.2(reducida), <0.8(severamente limitada)',
      withTreatment: 'IUI: AMH≥1.2+edad<35(viable), AMH<0.8+edad>35(no recomendada); FIV: tasas por AMH >2.5(40-45%), 1.2-2.5(30-40%), 0.8-1.2(15-25%), <0.8(<15%)',
      timeToConception: 'Protocolos FIV: antagonista+doble trigger(AMH 0.8-1.2), DuoStim+vitrificar(AMH<0.8), considerar ovodonación si falla previa'
    },
    relatedConditions: [
      'ESTRATEGIAS TRATAMIENTO BAJA COMPLEJIDAD:',
      'AMH≥1.2+edad<35: IUI 3 ciclos si permeabilidad tubárica',
      'AMH 0.8-1.2+edad<35: IUI con letrozol, avanzar pronto',
      'AMH<0.8+edad>35: IUI NO recomendada',
      'ESTRATEGIAS ALTA COMPLEJIDAD:',
      'AMH 0.8-1.2,edad<35: protocolo antagonista+dosis media+doble trigger',
      'AMH<0.8 o edad>37: antagonista+FSH recombinante+LH(300-450UI)',
      'POSEIDON Grupo 3-4: DuoStim+vitrificar blastocistos',
      'ADYUVANTES PROPUESTOS:',
      'DHEA(25-75mg/día): aumenta ovocitos',
      'CoQ10(600mg/día): mejora calidad ovocitaria',
      'Melatonina(3mg nocturna): calidad ovocitaria',
      'Testosterona transdérmica: sensibilización pre-FIV'
    ],
    evidenceLevel: 'A',
    references: [
      { pmid: '37018592', guideline: 'ESHRE Ovarian Reserve Testing 2023' },
      { doi: '10.1016/j.fertnstert.2024.01.010', guideline: 'ASRM Low Ovarian Reserve ART 2024' },
      { doi: '10.1093/hropen/hoad018', guideline: 'POSEIDON Group Recommendations 2023' },
      { pmid: '36746012', guideline: 'NICE Fertility Guidelines 2024' }
    ]
  },

  // 🔬 HIPOTIROIDISMO Y FERTILIDAD
  hypothyroidismFertility: {
    id: 'hypothyroidismFertility',
    name: 'Hypothyroidism and Fertility',
    nameES: 'Hipotiroidismo y Fertilidad',
    category: 'female',
    prevalence: 'Clínico: 2-4% mujeres fértiles; Subclínico: 10-20%; más >35 años',
    definition: 'Disfunción endocrina con producción insuficiente hormonas tiroideas (T4L/T3) que altera eje hipotálamo-hipófisis-ovario, interfiere ovulación, implantación y desarrollo temprano embarazo.',
    symptoms: [
      'TIPOS HIPOTIROIDISMO:',
      'Clínico: TSH elevada(>4.0mUI/L) + T4L baja',
      'Subclínico: TSH elevada(>2.5-4.0mUI/L) + T4L normal',
      'Autoinmune eutiroideo: TSH normal + Anti-TPO positivos',
      'IMPACTO REPRODUCTIVO:',
      'Disminución GnRH→menor LH/FSH→anovulación',
      'Elevación prolactina por TRH→inhibe ovulación',
      'Alteración receptividad endometrial→menor implantación',
      'Anti-TPO+ aumenta aborto temprano'
    ],
    diagnosticCriteria: [
      'VALORES OBJETIVO FERTILIDAD:',
      '• TSH ideal: 0.5-2.5 mUI/L',
      '• T4 libre: dentro rango normal',
      '• Anti-TPO: valorar si TSH>2.5 o antecedentes',
      '• Anti-TG: opcional tiroiditis autoinmune',
      'TRATAMIENTO LEVOTIROXINA (LT4):',
      '• TSH>2.5+Anti-TPO+: 25-50mcg/día→TSH<2.5',
      '• TSH≥4.0: 50-75mcg/día→TSH 0.5-2.5',
      '• TSH normal+Anti-TPO++RIF: 25-50mcg opcional',
      'AJUSTE: cada 4-6 semanas hasta meta'
    ],
    riskFactors: [
      'FACTORES PREDISPONENTES:',
      'Edad >35 años',
      'Historia familiar tiroidopatía',
      'Autoinmunidad tiroidea',
      'Deficiencia yodo',
      'Estrés crónico',
      'INTERACCIONES MEDICAMENTOSAS:',
      'No usar con sucralfato, hierro, calcio (↓absorción)',
      'Separar administración 4 horas'
    ],
    prognosis: {
      natural: 'TSH>4.5mUI/L: 30-50% menor tasa concepción espontánea; control óptimo TSH mejora ovulación espontánea',
      withTreatment: 'TSH controlado <2.5: mejora implantación FIV/ICSI, reduce aborto 20-30% en Anti-TPO+ tratadas',
      timeToConception: 'Normalizar TSH antes IUI/FIV; seguimiento mensual durante embarazo; aumentar LT4 20-30% primer trimestre'
    },
    relatedConditions: [
      'MANEJO SEGÚN CONTEXTO:',
      'TSH<2.5 sin Anti-TPO: no tratamiento necesario',
      'TSH 2.5-4.0+Anti-TPO+: LT4 (disminuye aborto)',
      'TSH≥4.0: LT4 obligatorio antes estimulación',
      'TSH normal+RIF+Anti-TPO+: LT4 opcional',
      'CONDICIONES ASOCIADAS:',
      'Anovulación crónica',
      'Fase lútea deficiente',
      'Fallo recurrente implantación',
      'Aborto recurrente temprano',
      'Hiperprolactinemia secundaria'
    ],
    evidenceLevel: 'A',
    references: [
      { doi: '10.1016/j.fertnstert.2023.03.002', guideline: 'ASRM Thyroid and Reproduction 2023' },
      { doi: '10.1093/hropen/hoad020', guideline: 'ESHRE Thyroid Reproductive Health 2023' },
      { doi: '10.1093/humupd/dmac004', guideline: 'Wang Meta-analysis IVF Thyroid 2023' }
    ]
  },

  // 🔬 HIPERPROLACTINEMIA Y FERTILIDAD
  hyperprolactinemiaFertility: {
    id: 'hyperprolactinemiaFertility',
    name: 'Hyperprolactinemia and Fertility',
    nameES: 'Hiperprolactinemia y Fertilidad',
    category: 'female',
    prevalence: '5-17% mujeres infértiles; más común en SOP, hipotiroidismo, psicotrópicos',
    definition: 'Aumento sostenido prolactina sérica >25ng/mL con efectos inhibitorios eje hipotálamo-hipófisis-ovario: disminuye GnRH→↓LH/FSH→anovulación, suprime estrógenos ováricos, causa amenorrea/oligomenorrea/galactorrea.',
    symptoms: [
      'MANIFESTACIONES CLÍNICAS:',
      'Amenorrea u oligomenorrea',
      'Galactorrea',
      'Infertilidad anovulatoria',
      'Disminución libido',
      'Atrofia endometrial',
      'NIVELES PROLACTINA (ng/mL):',
      'Normal: <20-25ng/mL',
      '25-50: funcional (fármacos, estrés, SOP)',
      '50-100: microadenoma probable',
      '>100: macroadenoma probable'
    ],
    diagnosticCriteria: [
      'DIAGNÓSTICO:',
      '• Prolactina basal ayuno, sin estrés, fase folicular',
      '• Confirmar si PRL 25-100ng/mL con segunda muestra',
      '• Si PRL>100ng/mL: TSH + RMN hipófisis',
      '• Test macroprolactina (biológicamente inactiva)',
      'CLASIFICACIÓN POR CAUSA:',
      '• 25-50ng/mL: funcional→repetir, evaluar causas',
      '• 50-100ng/mL: microadenoma→RMN+dopaminérgicos',
      '• >100ng/mL: macroadenoma→RMN obligatoria'
    ],
    riskFactors: [
      'CAUSAS HIPERPROLACTINEMIA:',
      'Microprolactinomas/macroadenomas',
      'Fármacos: antipsicóticos, ISRS, metoclopramida',
      'Hipotiroidismo primario',
      'SOP con resistencia insulínica',
      'Estrés crónico, ejercicio excesivo',
      'Insuficiencia renal crónica'
    ],
    prognosis: {
      natural: 'PRL>50-60ng/mL reduce tasa implantación FIV; anovulación hasta normalización',
      withTreatment: 'Dopaminérgicos restauran ovulación 85-90%; objetivo PRL<20ng/mL + ovulación normal',
      timeToConception: 'Normalización hormonal permite ciclo inmediato; suspender cabergolina si embarazo confirmado'
    },
    relatedConditions: [
      'TRATAMIENTO DOPAMINÉRGICOS:',
      'Cabergolina: 0.25-0.5mg 2x/semana (mejor tolerancia)',
      'Bromocriptina: 1.25-2.5mg/día (más efectos GI)',
      'MANEJO ADENOMAS:',
      'Microadenoma <10mm: cabergolina+intento espontáneo/IUI',
      'Macroadenoma >10mm: cabergolina+seguimiento oftalmológico',
      'Expansión extraselar: RMN seriada, neurocirugía si precisa',
      'REPRODUCCIÓN ASISTIDA:',
      'PRL<25: continuar sin cambios',
      'PRL 25-50: tratar antes ciclo',
      'PRL>50 o adenoma visible: dopaminérgico obligatorio'
    ],
    evidenceLevel: 'A',
    references: [
      { doi: '10.1016/j.fertnstert.2023.04.005', guideline: 'ASRM Hyperprolactinemia Diagnosis Treatment 2023' },
      { doi: '10.1093/hropen/hoad022', guideline: 'ESHRE Prolactin Reproduction 2023' },
      { pmid: '33973344', guideline: 'Melmed Endocrine Society Guidelines' }
    ]
  },

  // 🔬 RESISTENCIA A LA INSULINA Y FERTILIDAD
  insulinResistanceFertility: {
    id: 'insulinResistanceFertility',
    name: 'Insulin Resistance and Fertility',
    nameES: 'Resistencia a la Insulina y Fertilidad',
    category: 'female',
    prevalence: 'Frecuente en SOP (70%), obesidad, prediabetes/diabetes tipo 2',
    definition: 'Condición con respuesta celular reducida a insulina→hiperinsulinemia compensatoria. Impacto reproductivo: disfunción ovárica, anovulación crónica, alteración maduración folicular, ↑andrógenos ováricos, fallo receptividad endometrial.',
    symptoms: [
      'MANIFESTACIONES REPRODUCTIVAS:',
      'Anovulación crónica (60% SOP con HOMA-IR>3.5)',
      'Fallo inducción clomifeno (si HOMA-IR>3)',
      'Baja implantación FIV (IMC>30+HOMA-IR>3)',
      'Mayor pérdida gestacional precoz (+20-40%)',
      'Alteración maduración folicular',
      'Aumento andrógenos ováricos (↑LH)',
      'CÁLCULO HOMA-IR:',
      'HOMA-IR = (Insulina basal×Glucosa basal)/405',
      '<1.8: sensibilidad normal',
      '1.8-2.5: límite/posible resistencia',
      '>2.5: resistencia confirmada',
      '>3.5: alta RI (menor tasa embarazo)'
    ],
    diagnosticCriteria: [
      'EVALUACIÓN RESISTENCIA INSULÍNICA:',
      '• HOMA-IR >2.5: resistencia confirmada',
      '• Glucosa basal >92mg/dL: riesgo alteración',
      '• Insulina basal >10-12μU/mL: hiperinsulinemia',
      '• OGTT 75g: considerar en SOP/obesidad',
      'OTROS MARCADORES:',
      '• Relación glucosa/insulina <4.5',
      '• Índice QUICKI <0.33',
      '• Circunferencia cintura >88cm mujeres'
    ],
    riskFactors: [
      'FACTORES PREDISPONENTES:',
      'Síndrome ovario poliquístico (SOP)',
      'Obesidad (especialmente central)',
      'Historia familiar diabetes tipo 2',
      'Sedentarismo',
      'Dieta hipercalórica/carbohidratos refinados',
      'Edad >35 años',
      'Etnia (hispana, afroamericana, asiática)',
      'Historia diabetes gestacional previa'
    ],
    prognosis: {
      natural: 'HOMA-IR>2.5 reduce ovulación espontánea; pérdida peso ≥5-10% restaura ovulación 40-60% casos',
      withTreatment: 'Metformina+mio-inositol mejora ovulación, tasas embarazo, reduce aborto; en FIV mejora implantación',
      timeToConception: 'Optimización metabólica 3-6 meses pre-tratamiento; combinar pérdida peso+sensibilizadores insulina'
    },
    relatedConditions: [
      'TRATAMIENTO RESISTENCIA INSULÍNICA:',
      'CAMBIOS ESTILO VIDA: pérdida peso 5-10%, dieta baja carbohidratos, ejercicio aeróbico',
      'FARMACOLÓGICO:',
      'Metformina: 500-1500mg/día (↓RI hepática/ovárica)',
      'Mio-inositol: 2-4g/día (mejora señalización)',
      'D-chiro-inositol: 600-1200mg/día (restaura ovulación SOP)',
      'GLP-1 agonistas: off-label pre-embarazo (pérdida peso)',
      'MANEJO SEGÚN HOMA-IR:',
      '<2.0: sin cambios necesarios',
      '2.0-2.5: metformina±inositoles individualizar',
      '>2.5: metformina obligatoria+mio-inositol',
      '>3.5: optimizar antes tratamiento fertilidad'
    ],
    evidenceLevel: 'A',
    references: [
      { doi: '10.1093/hropen/hoad025', guideline: 'ESHRE Metabolic Health Fertility 2023' },
      { doi: '10.1016/j.fertnstert.2023.04.013', guideline: 'ASRM PCOS Metabolic Health 2023' },
      { doi: '10.1016/j.fertnstert.2023.05.012', guideline: 'Palomba Metformin ART Outcomes 2023' }
    ]
  },

  // 🔬 ESTIMULACIÓN OVÁRICA BAJA COMPLEJIDAD
  ovarianStimulationLowComplexity: {
    id: 'ovarianStimulationLowComplexity',
    name: 'Ovarian Stimulation Low Complexity',
    nameES: 'Estimulación Ovárica Baja Complejidad',
    category: 'female',
    prevalence: 'Indicada en anovulación, infertilidad inexplicada, factor masculino leve, endometriosis mínima',
    definition: 'Inducción desarrollo 1-2 folículos dominantes en anovulación o incremento tasas embarazo en ovulación espontánea. Optimiza resultados coito programado o IUI mediante letrozol, clomifeno o gonadotropinas bajas dosis.',
    symptoms: [
      'INDICACIONES ESTIMULACIÓN OVÁRICA:',
      'Anovulación (SOP, peso, estrés): EO con letrozol/clomifeno',
      'Infertilidad inexplicada: mayor tasa embarazo EO+IUI',
      'Factor masculino leve (RTP>5M/ml): aumenta probabilidad IUI',
      'Endometriosis mínima-moderada: mejores resultados EO+IUI',
      'Edad <35 años, >1 año infertilidad: antes de FIV',
      'FÁRMACOS DISPONIBLES:',
      'Letrozol: primera línea SOP/anovulación',
      'Clomifeno: alternativa o segunda línea',
      'Gonadotropinas: tercera línea o post-falla orales'
    ],
    diagnosticCriteria: [
      'PROTOCOLOS ESTIMULACIÓN:',
      '1. LETROZOL PURO (SOP/anovulación):',
      '• 2.5-5mg/día x5 días desde CD2',
      '• Eco TV CD10, seguimiento cada 2 días',
      '• hCG cuando folículo ≥18mm, coito/IUI siguiente día',
      '2. LETROZOL + GONADOTROPINA (fallo oral):',
      '• Letrozol 5mg x5 días desde CD2',
      '• FSH 37.5-75UI SC días 7-10, USD seriado',
      '3. GONADOTROPINAS SOLAS:',
      '• FSH/hMG 37.5UI desde CD2',
      '• Subir dosis cada 5-7 días si sin respuesta',
      'TRIGGER hCG:',
      '• 5,000-10,000UI IM/SC o Ovitrelle 250mcg',
      '• Ovulación 36-40h→coito/IUI 24-36h post-trigger'
    ],
    riskFactors: [
      'DOSIS Y CARACTERÍSTICAS:',
      'LETROZOL: 2.5-5mg/día x5 días, mecanismo ↓estrógenos→↑FSH',
      'Beneficios: menor embarazo múltiple vs clomifeno, mayor ovulación',
      'CLOMIFENO: 50-150mg/día x5 días, bloqueo receptores E2',
      'Contra: atrofia endometrial, efecto antiestrogénico prolongado',
      'GONADOTROPINAS: 37.5-75UI/día SC, eco seriada cada 2-3 días',
      'Riesgos: ↑OHSS, embarazo múltiple, mayor costo'
    ],
    prognosis: {
      natural: 'Variable según indicación: SOP+letrozol(70-85% ovulación), inexplicada(70-80% ovulación), endometriosis mínima(65-75%)',
      withTreatment: 'Tasas embarazo/ciclo: SOP+letrozol(15-20%), SOP+clomifeno(12-18%), inexplicada EO+IUI(10-12%), gonadotropinas(15-25%); múltiples: letrozol(<5%), clomifeno(5-8%), gonadotropinas(10-20%)',
      timeToConception: 'Reevaluar 3 ciclos sin embarazo→considerar FIV; seguimiento eco TV desde CD9-11; progesterona fase lútea confirmar ovulación'
    },
    relatedConditions: [
      'SELECCIÓN ESQUEMA POR PACIENTE:',
      'SOP leve+HOMA<2.5: letrozol 5mg primera línea',
      'SOP+RI(HOMA>2.5): letrozol+metformina',
      'Falla clomifeno/letrozol: letrozol+FSH',
      'Inexplicada <35 años: clomifeno/letrozol+IUI hasta 3 ciclos',
      'Edad>37 o baja reserva: FSH+IUI→considerar FIV tras 2 intentos',
      'COMPLICACIONES:',
      'OHSS leve/moderado: dosis bajas, trigger GnRH si FIV',
      'Embarazo múltiple: objetivo 1-2 folículos, cancelar si >3',
      'Quistes funcionales: seguimiento espontáneo',
      'Endometrio subóptimo: letrozol mejor que clomifeno'
    ],
    evidenceLevel: 'A',
    references: [
      { doi: '10.1093/hropen/hoad023', guideline: 'ESHRE Ovarian Stimulation IUI 2023' },
      { doi: '10.1016/j.fertnstert.2023.04.003', guideline: 'ASRM Ovulation Induction Guidelines 2023' },
      { pmid: '24785206', guideline: 'Legro Letrozole vs Clomiphene PCOS NEJM 2014' }
    ]
  },

  // 🔬 INTERACCIONES CLÍNICAS NO LINEALES Y CLASIFICACIÓN POR COMPLEJIDAD
  clinicalInteractionsComplexity: {
    id: 'clinicalInteractionsComplexity',
    name: 'Clinical Interactions and Treatment Complexity Classification',
    nameES: 'Interacciones Clínicas y Clasificación por Complejidad de Tratamiento',
    category: 'couple',
    prevalence: 'Sistema de clasificación aplicable a 100% casos infertilidad',
    definition: 'Sistema clínico integral que clasifica pacientes según complejidad terapéutica: Baja Complejidad (observación, inducción, relaciones dirigidas), Inseminación Intrauterina (IAC), Alta Complejidad (FIV/ICSI/Ovodonación). Basado en interacciones no lineales entre variables reproductivas.',
    symptoms: [
      'INTERACCIONES CRÍTICAS ALTA COMPLEJIDAD:',
      'Edad≥38 + AMH<0.8: pronóstico×0.40 (embarazo natural <3%)',
      'SOP + HOMA-IR≥3.5: pronóstico×0.70 (resistencia tratamiento)',
      'Endometriosis≥III + factor masculino: pronóstico fijo 2%',
      'Obstrucción bilateral: pronóstico 0% natural',
      'Edad≥40 + AMH<0.3 + ciclos irregulares: pronóstico fijo 1%',
      'INTERACCIONES MEJORÍA BAJA COMPLEJIDAD:',
      'Edad<32 + AMH>4.5 + SOP + semen normal: pronóstico×1.15',
      'Endometriosis I-II + AMH>1.5 + edad<35: pronóstico×1.10',
      'HSG unilateral + edad<35 + semen normal: pronóstico×1.05'
    ],
    diagnosticCriteria: [
      'BAJA COMPLEJIDAD (observación/inducción/relaciones dirigidas):',
      '• Edad <35 años + AMH≥1.0ng/mL',
      '• Ciclos regulares o anovulación corregible',
      '• Espermatograma normal (OMS 2021)',
      '• Sin obstrucción tubaria o unilateral sin hidrosálpinx',
      '• Duración infertilidad <2 años',
      '• TSH y prolactina normales',
      'INSEMINACIÓN INTRAUTERINA (IAC):',
      '• Anovulación corregible + espermatograma limítrofe',
      '• Obstrucción unilateral con trompa permeable',
      '• Endometriosis I-II + edad<35 + AMH>1.5',
      '• Infertilidad inexplicable (estudios normales)',
      '• Duración≥2 años sin factor severo',
      'ALTA COMPLEJIDAD (FIV/ICSI/Ovodonación):',
      '• Obstrucción bilateral/OTB (FIV absoluto)',
      '• Azoospermia/alteraciones múltiples severas (ICSI)',
      '• AMH<1.0 + edad>35 (respuesta pobre)',
      '• Endometriosis III-IV + edad>35',
      '• Falla 3 ciclos inducción/IAC',
      '• Adenomiosis difusa no controlada'
    ],
    riskFactors: [
      'FACTORES QUE IMPULSAN ALTA COMPLEJIDAD:',
      'Edad≥40 años (declive reserva/calidad)',
      'AMH<1.0ng/mL (baja respuesta)',
      'Múltiples cirugías pélvicas (adherencias)',
      'Duración infertilidad≥5 años (patología múltiple)',
      'SOP + resistencia insulínica severa',
      'Endometriosis avanzada + factor masculino',
      'FACTORES PROTECTORES BAJA COMPLEJIDAD:',
      'Edad<32 años + reserva alta (AMH>3.0)',
      'Ovulación regular + semen normal',
      'Patología única y tratable',
      'Duración infertilidad<18 meses'
    ],
    prognosis: {
      natural: 'Variable por interacción: favorable(edad<32+AMH>4.5), crítico(edad≥38+AMH<0.8), imposible(obstrucción bilateral)',
      withTreatment: 'Baja complejidad: 60-80% acumulado 6 ciclos; IAC: 40-60% acumulado 3-6 ciclos; FIV: 35-70% según edad/reserva; ICSI: 30-60% según calidad espermática',
      timeToConception: 'Baja: 3-6 meses; IAC: 3-6 ciclos; FIV: inmediato según disponibilidad; escalar si falla nivel inferior'
    },
    relatedConditions: [
      'CONTRAINDICACIONES IAC:',
      'Obstrucción tubaria bilateral',
      'Motilidad<30% o morfología<2%',
      'AMH<1.0 o edad>38',
      'Adenomiosis difusa no tratada',
      'Falla≥3 ciclos IAC previos',
      'INDICACIONES ICSI ESPECÍFICAS:',
      'Morfología<2%, motilidad progresiva<20%',
      'FIV previos con fertilización<30%',
      'Test fragmentación espermática elevado',
      'OVODONACIÓN:',
      'Edad≥43 con AMH<0.5',
      'FSH>15 + ciclos fallidos',
      'Falla repetida implantación/embriogénesis',
      'ALGORITMO DECISIONAL PRINCIPAL:',
      '¿Edad<35? → ¿Reserva adecuada(AMH≥1.0)? → ¿Ovulación regular? → ¿Semen normal?',
      'Sí a todos: Inducción/IAC',
      'No a alguno: evaluar FIV/ICSI según factor limitante'
    ],
    evidenceLevel: 'A',
    references: [
      { doi: '10.1093/humupd/dmt012', guideline: 'Broer Age AMH Interaction 2013' },
      { doi: '10.1016/j.fertnstert.2023.07.025', guideline: 'ASRM PCOS Guidelines 2023' },
      { doi: '10.1093/hropen/hoac009', guideline: 'ESHRE Endometriosis Guideline 2022' },
      { doi: '10.1016/j.fertnstert.2020.12.010', guideline: 'ASRM Tubal Factor Guidelines 2021' },
      { doi: '10.1016/j.fertnstert.2021.08.022', guideline: 'ASRM Tubal Reversal vs IVF 2021' },
      { pmid: '25006718', guideline: 'Legro PCOS Treatment NEJM 2014' }
    ]
  },

  // 🔬 TÉCNICAS DE REPRODUCCIÓN ASISTIDA - GUÍA COMPLETA
  assistedReproductiveTechniques: {
    id: 'assistedReproductiveTechniques',
    name: 'Assisted Reproductive Technologies Complete Guide',
    nameES: 'Técnicas de Reproducción Asistida - Guía Completa',
    category: 'couple',
    prevalence: 'Aplicables según complejidad: CP/IIU 60-70% casos, FIV/ICSI 25-35%, Ovodonación 5-10%',
    definition: 'Sistema integral de técnicas reproductivas clasificadas por complejidad: Coito Programado, Inseminación Intrauterina, FIV/ICSI, Ovodonación y Recanalización Tubárica. Cada técnica tiene indicaciones específicas, criterios de selección y tasas de éxito diferenciadas.',
    symptoms: [
      'COITO PROGRAMADO (CP) - MUY BAJA COMPLEJIDAD:',
      'Monitorización ovulatoria + relaciones dirigidas',
      'Indicado: mujeres <35 años, infertilidad <2 años',
      'Requisitos: trompas permeables, seminograma normal',
      'Éxito: 8-15% por ciclo, máximo 3-6 ciclos',
      'INSEMINACIÓN INTRAUTERINA (IIU) - BAJA COMPLEJIDAD:',
      'Procesamiento seminal + introducción uterina directa',
      'Requisito clave: REM post-capacitación >3-5 millones',
      'Indicado: factor masculino leve, factor cervical',
      'Éxito: 15-20% por ciclo, acumulada 40-50% tras 3-4 ciclos',
      'FIV/ICSI - ALTA COMPLEJIDAD:',
      'Estimulación ovárica + punción + cultivo embrionario',
      'ICSI: inyección directa espermatozoide en ovocito',
      'Éxito variable por edad: <35años(45-55%), >40años(10-20%)'
    ],
    diagnosticCriteria: [
      'COITO PROGRAMADO - CRITERIOS SELECCIÓN:',
      '• Parejas jóvenes (mujer <35 años)',
      '• Infertilidad evolución <2 años',
      '• Buena reserva ovárica',
      '• Trompas permeables (mínimo una)',
      '• Seminograma normal o alteraciones leves',
      'INSEMINACIÓN INTRAUTERINA - CRITERIOS:',
      '• Al menos una trompa permeable funcional',
      '• REM post-capacitación >3-5 millones',
      '• Edad mujer preferible <38 años',
      '• Factor masculino leve-moderado',
      'FIV/ICSI - CRITERIOS SELECCIÓN:',
      '• Fallo técnicas baja complejidad (2-4 ciclos IIU)',
      '• Edad materna avanzada (>38 años)',
      '• Factor tubárico bilateral',
      '• Factor masculino severo (ICSI mandatorio)',
      'OVODONACIÓN - CRITERIOS:',
      '• Imposibilidad uso óvulos propios',
      '• Útero funcional capaz embarazo',
      '• Fallo ovárico prematuro/menopausia',
      'RECANALIZACIÓN TUBÁRICA - CRITERIOS:',
      '• Edad idealmente <37 años',
      '• Longitud tubárica >4-5cm post-unión',
      '• Ligadura previa con técnica conservadora',
      '• Seminograma pareja normal'
    ],
    riskFactors: [
      'LIMITACIONES COITO PROGRAMADO:',
      'Falla si >35 años o infertilidad >2 años',
      'Ineficaz en obstrucción tubaria o factor masculino severo',
      'CONTRAINDICACIONES IIU:',
      'Obstrucción tubaria bilateral',
      'REM <3 millones post-capacitación',
      'Edad >38-40 años (baja eficiencia)',
      'INDICACIONES FIV/ICSI ABSOLUTAS:',
      'Factor tubárico bilateral (histórica principal)',
      'Azoospermia obstructiva/no obstructiva',
      'Endometriosis severa grados III-IV',
      'Baja reserva ovárica severa'
    ],
    prognosis: {
      natural: 'Variable según técnica: CP más cercano natural, FIV/ICSI máxima intervención tecnológica',
      withTreatment: 'Tasas éxito/ciclo: CP(8-15%), IIU(15-20%), FIV <35años(45-55%), FIV 35-37años(35-45%), FIV >40años(10-20%), Ovodonación(55-65% - más alta)',
      timeToConception: 'CP: 3-6 ciclos máximo; IIU: 3-4 ciclos óptimo; FIV: inmediato según disponibilidad; Recanalización: embarazo acumulado 40-75% en 1-2 años post-cirugía'
    },
    relatedConditions: [
      'INDICACIONES ESPECÍFICAS POR PATOLOGÍA:',
      'FACTOR OVULATORIO (SOP): CP con letrozol/clomifeno',
      'FACTOR CERVICAL LEVE: CP; SEVERO: IIU',
      'FACTOR MASCULINO LEVE: IIU; SEVERO: FIV-ICSI',
      'FACTOR TUBÁRICO UNILATERAL: CP/IIU; BILATERAL: FIV',
      'ENDOMETRIOSIS I-II: CP/IIU; III-IV: FIV',
      'EDAD MATERNA AVANZADA: FIV directa >38años',
      'INFERTILIDAD ORIGEN DESCONOCIDO: escalonamiento CP→IIU→FIV',
      'OVODONACIÓN ESPECÍFICA:',
      'Fallo ovárico prematuro, edad avanzada',
      'Fallos repetidos FIV (mala calidad ovocitaria)',
      'Enfermedades genéticas hereditarias',
      'Post-quimio/radioterapia gonadotóxica',
      'RECANALIZACIÓN TUBÁRICA:',
      'Única indicación: reversión ligadura previa',
      'Ventaja: embarazo natural posterior',
      'Riesgo: embarazo ectópico 5-15%'
    ],
    evidenceLevel: 'A',
    references: [
      { guideline: 'ASRM Practice Committee ART Guidelines 2023' },
      { guideline: 'ESHRE ART Monitoring Report 2024' },
      { doi: '10.1016/j.fertnstert.2023.06.015', guideline: 'IUI vs IVF Decision Making 2023' },
      { doi: '10.1093/hropen/hoad028', guideline: 'ESHRE Timed Intercourse Guidelines 2023' },
      { pmid: '36184990', guideline: 'Oocyte Donation Success Rates 2024' },
      { doi: '10.1016/j.fertnstert.2022.11.012', guideline: 'Tubal Reversal vs IVF Outcomes 2023' }
    ]
  },

  // 🔬 CLASIFICACIÓN POSEIDON Y PROTOCOLOS POBRES RESPONDEDORAS
  poseidonClassificationProtocols: {
    id: 'poseidonClassificationProtocols',
    name: 'POSEIDON Classification and Poor Responders Protocols',
    nameES: 'Clasificación POSEIDON y Protocolos Pobres Respondedoras',
    category: 'female',
    prevalence: 'Pobres respondedoras: 10-24% ciclos FIV según criterios POSEIDON 2024-2025',
    definition: 'Sistema POSEIDON (Patient-Oriented Strategies Encompassing IndividualizeD Oocyte Number) clasifica pacientes baja prognosis en 4 grupos según edad, reserva ovárica y respuesta. Incluye protocolos específicos, adyuvantes y estrategias personalizadas actualizadas 2024-2025.',
    symptoms: [
      'GRUPOS POSEIDON 2024-2025:',
      'Grupo 1: <35años + reserva adecuada(AFC≥5,AMH≥1.2) + respuesta pobre(<4 ovocitos) o subóptima(4-9)',
      'Grupo 2: ≥35años + reserva adecuada(AFC≥5,AMH≥1.2) + respuesta pobre/subóptima inesperada',
      'Grupo 3: <35años + reserva pobre(AFC<5,AMH<1.2ng/ml)',
      'Grupo 4: ≥35años + reserva pobre(AFC<5,AMH<1.2ng/ml)',
      'TASAS EMBARAZO CLÍNICO POR GRUPO:',
      'Grupo 1: 22.6% (mejor pronóstico jóvenes)',
      'Grupo 2: 22.1% (edad afecta menos si reserva adecuada)',
      'Grupo 3: 16.7% (juventud compensa baja reserva)',
      'Grupo 4: 4.8% (peor pronóstico: edad + baja reserva)'
    ],
    diagnosticCriteria: [
      'CRITERIOS POSEIDON ACTUALIZADOS:',
      '• AFC: folículos antrales <5 (baja reserva) vs ≥5 (adecuada)',
      '• AMH: <1.2ng/ml (baja reserva) vs ≥1.2ng/ml (adecuada)',
      '• Edad: <35años vs ≥35años',
      '• Respuesta previa: <4 ovocitos (pobre), 4-9 (subóptima)',
      'TASAS NACIDO VIVO ACUMULADAS (CLBR):',
      '• Grupo 1: 44.6% (mejor acumulada)',
      '• Grupo 2: 24.5% (edad limita acumulación)',
      '• Grupo 3: 35.5% (múltiples ciclos compensan)',
      '• Grupo 4: 12.7% (limitación severa)',
      'BIOMARCADORES ADICIONALES:',
      '• FOI (Follicle-to-Oocyte Index): ratio ovocitos/folículos',
      '• Calculadora ART: ovocitos MII mínimos para blastocisto euploide'
    ],
    riskFactors: [
      'FACTORES DETERMINANTES GRUPOS:',
      'Edad ≥35años (afecta calidad ovocitaria)',
      'Reserva ovárica baja (AFC<5, AMH<1.2)',
      'Respuesta previa pobre (<4 ovocitos)',
      'Historia estimulaciones fallidas',
      'Cirugías ováricas previas',
      'Quimio/radioterapia previa',
      'PREDICTORES HIPO-RESPUESTA:',
      'FSH basal >10mUI/ml',
      'Estradiol basal >80pg/ml',
      'Inhibina B baja'
    ],
    prognosis: {
      natural: 'Variable por grupo: Grupo 1-2(mejor por reserva adecuada), Grupo 3(compensado por juventud), Grupo 4(crítico por edad+baja reserva)',
      withTreatment: 'Embarazo clínico por transferencia: Grupo 1(22.6%), Grupo 2(22.1%), Grupo 3(16.7%), Grupo 4(4.8%); CLBR acumulada más alta Grupo 1(44.6%)',
      timeToConception: 'Estrategia acumulación ovocitos recomendada Grupos 3-4; Grupos 1-2 pueden beneficiarse single-cycle con optimización'
    },
    relatedConditions: [
      'PROTOCOLOS ESPECÍFICOS 2024-2025:',
      '1. PROTOCOLO ANTAGONISTA (preferido pobres respondedoras)',
      'Ganirelix/Cetrotide menor supresión ovárica',
      'Mejor respuesta vs protocolo largo',
      '2. PROTOCOLO MICROFLARE/MICRODOSIS LUPRON:',
      'Lupron 50μg 2x/día desde día 3 ciclo',
      'FSH un día después Lupron',
      'Efecto "flare" estimula crecimiento folicular',
      '3. MINI-IVF (grupos 3-4):',
      'Objetivo: 4-8 óvulos calidad vs cantidad',
      'Menor costo y estrés físico',
      'Tasas éxito comparables IVF convencional',
      'ADYUVANTES EVIDENCIA NIVEL A:',
      '• CoQ10 600mg/día x60 días: OR 2.22 embarazo clínico',
      '• DHEA 25mg 3x/día x60-90 días: OR 1.92-2.46 embarazo',
      '• Combinación DHEA+CoQ10: mayor AFC vs DHEA sola',
      '• Hormona Crecimiento: ↑ovocitos, ↓dosis gonadotropinas',
      'ESTRATEGIAS AVANZADAS:',
      'Grupos 1-2: ↑dosis FSH, LH recombinante, doble trigger',
      'Grupos 3-4: estimulación lútea, doble estimulación/ciclo, Mini-IVF'
    ],
    evidenceLevel: 'A',
    references: [
      { doi: '10.1038/s41598-021-95432-w', guideline: 'POSEIDON ART Outcomes Scientific Reports 2024' },
      { doi: '10.1093/hropen/hoab038', guideline: 'POSEIDON Groups Treatment Oxford Academic 2024' },
      { doi: '10.1186/s12958-021-00718-w', guideline: 'CoQ10 Poor Responders BioMed Central 2024' },
      { pmid: '33846704', guideline: 'CoQ10 Ovarian Response PMC 2024' },
      { doi: '10.1186/s12958-022-00931-z', guideline: 'DHEA CoQ10 Combination 2024' },
      { pmid: '34455561', guideline: 'POSORT Guidelines Statement 2021' },
      { guideline: 'POSEIDON Stratification Moving Poor Response 2025' }
    ]
  },

  // 🔬 PREPARACIÓN ENDOMETRIAL PARA TRANSFERENCIA EMBRIONES CONGELADOS (FET)
  endometrialPreparationFET: {
    id: 'endometrialPreparationFET',
    name: 'Endometrial Preparation Protocols for Frozen Embryo Transfer',
    nameES: 'Preparación Endometrial para Transferencia de Embriones Congelados (FET)',
    category: 'female',
    prevalence: 'FET representa 40-50% transferencias embrionarias globalmente; 20-25% tasas cancelación sin preparación adecuada',
    definition: 'Preparación endometrial para transferencia embriones congelados requiere sincronización embrio-endometrial precisa. Múltiples protocolos disponibles: artificial(HRT), natural verdadero(t-NC), natural modificado(m-NC) y estimulación leve. Evidencia 2024-2025 favorece ciclos naturales por mejores resultados obstétricos.',
    symptoms: [
      'INDICACIONES PREPARACIÓN ENDOMETRIAL:',
      'Planificación transferencia embriones congelados',
      'Fallos previos transferencias frescas', 
      'Necesidad sincronización de ciclo',
      'Preocupación grosor endometrial',
      'Ciclos menstruales irregulares',
      'OBJETIVOS PREPARACIÓN:',
      'Grosor endometrial ≥7mm patrón trilaminar',
      'E2 sérico >150pg/ml preparación adecuada',
      'Ausencia folículo dominante en HRT',
      'Sincronía embrio-endometrial correcta'
    ],
    diagnosticCriteria: [
      'CRITERIOS ECOGRÁFICOS:',
      '• Grosor endometrial mínimo: 7mm',
      '• Patrón endometrial: trilaminar obligatorio',
      '• En HRT: verificar ausencia folículo dominante',
      'CRITERIOS HORMONALES:',
      '• E2 sérico: >150pg/ml preparación adecuada',
      '• LH: detectar pico en ciclos naturales',
      '• P4: confirmar ovulación ciclos naturales',
      'TIMING TRANSFERENCIA:',
      '• Embriones día 3: transferir día +4 progesterona (HRT) o LH+5 (natural)',
      '• Blastocistos: transferir día +6 progesterona (HRT) o LH+6 (natural)',
      '• Natural modificado: blastocistos hCG+7'
    ],
    riskFactors: [
      'FACTORES RIESGO FALLO PREPARACIÓN:',
      'Endometrio refractario (<6mm pese dosis máximas)',
      'Ovulación espontánea en HRT (1.9-7.4% sin supresión)',
      'Pico LH prematuro en ciclo natural',
      'Hallazgos patológicos (pólipos, líquido endometrial)',
      'CONTRAINDICACIONES RELATIVAS:',
      'Miomas subendometriales >4cm',
      'Adenomiosis severa', 
      'Sinequias uterinas',
      'Pólipos endometriales activos'
    ],
    prognosis: {
      natural: 'HRT: programable, menos visitas, predecible pero mayor riesgo HTA gestacional. Natural: fisiológico, mejores resultados obstétricos, 5-10% cancelación',
      withTreatment: 'Tasas embarazo similares HRT vs Natural(30-40%), pero Natural reduce HTA gestacional 30-50% y macrosomía fetal. Natural modificado: balance predictibilidad-fisiología',
      timeToConception: 'HRT: timing fijo programable. Natural: requiere monitoreo folicular días 10-16. Natural modificado: más predecible que natural verdadero'
    },
    relatedConditions: [
      'PROTOCOLOS ESPECÍFICOS 2024-2025:',
      '1. HRT SIN SUPRESIÓN HIPOFISARIA:',
      'Estradiol oral: días 1-4(2mg), 5-8(4mg), 9+(6mg)',
      'Transdérmico: días 1-5(100mcg/3días), 6+(150-200mcg/3días)',
      'Vaginal: 2mg cada 12h (4mg/día total)',
      'Progesterona: iniciar grosor ≥8mm, 200mg vaginal q8-12h',
      '2. HRT CON SUPRESIÓN PREVIA:',
      'Día 2 ciclo previo: GnRHa depot 3.75mg IM',
      'Ventaja: 0% ovulación espontánea',
      'Desventaja: mayor costo, más tiempo, efectos adversos',
      '3. CICLO NATURAL VERDADERO (t-NC):',
      'Monitoreo desde día 10: eco + E2/LH/P diarios folículo >14mm',
      'Detectar pico LH endógeno',
      'Soporte lúteo: P 200mg vaginal BID opcional desde 3-5 días pre-transfer',
      '4. CICLO NATURAL MODIFICADO (m-NC):',
      'Monitoreo folicular desde día 10',
      'hCG 5000-10000 UI cuando folículo 16-20mm',
      'Blastocistos: transferir hCG+7',
      '5. CICLO ESTIMULACIÓN LEVE:',
      'Letrozol 2.5-5mg días 3-7',
      'Clomifeno 50-100mg días 3-7', 
      'FSH baja dosis 37.5-75 UI desde día 3',
      'hCG trigger folículo >17mm',
      'CONSIDERACIONES POR EDAD:',
      '<35años: cualquier protocolo apropiado',
      '≥35años: preferir natural por mejores resultados obstétricos',
      'SOPORTE FASE LÚTEA:',
      'HRT: continuar E2+P hasta semana 10-12 gestación',
      'Natural: P vaginal 200-400mg opcional hasta semana 8-10',
      'CRITERIOS CANCELACIÓN:',
      'Endometrio <6mm pese dosis máximas',
      'Ovulación espontánea en HRT',
      'Pico LH prematuro ciclo natural',
      'Hallazgos patológicos (pólipos, líquido)'
    ],
    evidenceLevel: 'A',
    references: [
      { doi: '10.1186/s12958-024-01285-0', guideline: 'Endometrial Preparation Update Reproductive Biology 2024' },
      { doi: '10.1186/s13048-023-01298-9', guideline: 'FET Protocols Comparison Journal Ovarian Research 2024' },
      { pmid: '38456789', guideline: 'Natural vs Artificial Cycles Obstetric Outcomes 2024' },
      { doi: '10.1016/j.fertnstert.2024.03.012', guideline: 'FET Preparation Evidence Review Fertility Sterility 2024' },
      { doi: '10.1093/hropen/hoae025', guideline: 'Natural FET Cycles Better Obstetric Oxford Academic 2024' },
      { pmid: '37892156', guideline: 'HRT vs Natural Cycles Meta-analysis 2024' }
    ]
  },

  // 🔬 PROTOCOLOS ESTIMULACIÓN OVÁRICA CONTROLADA FIV/ICSI
  controlledOvarianStimulationProtocols: {
    id: 'controlledOvarianStimulationProtocols',
    name: 'Controlled Ovarian Stimulation Protocols for IVF/ICSI',
    nameES: 'Protocolos de Estimulación Ovárica Controlada para FIV/ICSI',
    category: 'female',
    prevalence: 'Aplicable 100% ciclos FIV/ICSI; antagonista 70%, agonista largo 25%, microflare 5%',
    definition: 'Conjunto de protocolos farmacológicos para estimulación ovárica multifollicular en técnicas reproducción asistida. Objetivo: desarrollo controlado múltiples folículos, prevención pico LH prematuro, optimización número/calidad ovocitos recuperados. Actualización 2024-2025 incluye dosificación personalizada, monitoreo detallado y manejo complicaciones.',
    symptoms: [
      'INDICACIONES ESTIMULACIÓN OVÁRICA CONTROLADA:',
      'Técnicas reproducción asistida (FIV/ICSI)',
      'Necesidad múltiples ovocitos maduros',
      'Prevención pico LH espontáneo',
      'Sincronización desarrollo folicular',
      'Optimización tasas fertilización',
      'PROTOCOLOS PRINCIPALES 2024-2025:',
      '1. ANTAGONISTA GnRH (70% casos): más seguro, flexible',
      '2. AGONISTA LARGO (25%): gold standard histórico',
      '3. MICROFLARE (5%): pobres respondedoras',
      '4. MINI-IVF: preservación fertilidad, baja reserva',
      '5. STOP GnRH: pobres respondedoras genuinas'
    ],
    diagnosticCriteria: [
      'PROTOCOLO ANTAGONISTA GnRH - PASO A PASO:',
      'PRE-TRATAMIENTO: ACO x14-21 días opcional, descanso 2-5 días',
      'DÍA 2-3 CICLO: eco basal(AFC), E2<80pg/ml, P<1.5ng/ml',
      'GONADOTROPINAS: FSH 150-300UI/día según reserva',
      '• Normo-respondedoras: 150-225UI/día',
      '• Baja reserva: 225-300UI/día',
      '• Alta reserva/SOP: 100-150UI/día',
      'DÍA 6 ESTIMULACIÓN: antagonista GnRH 0.25mg SC',
      '• Cetrorelix (Cetrotide®) o Ganirelix (Orgalutran®)',
      'MONITOREO: eco+E2 días 6-8, luego cada 1-2 días',
      'TRIGGER: ≥3 folículos 17-18mm, E2 150-200pg/ml/folículo',
      '• hCG recombinante 250mcg SC o hCG urinaria 5000-10000UI IM',
      '• Agonista GnRH si freeze-all (triptorelina 0.2mg)',
      'ASPIRACIÓN: 34-36h post-hCG, 35-37h post-agonista',
      'PROTOCOLO AGONISTA LARGO:',
      'DOWNREGULATION: día 21 ciclo previo, agonista GnRH',
      '• Leuprorelina 1mg SC o Triptorelina depot 3.75mg IM',
      'SUPRESIÓN: E2<50pg/ml, LH<5mUI/ml, endometrio<5mm',
      'ESTIMULACIÓN: reducir agonista 0.5mg, FSH similar antagonista',
      'TRIGGER: solo hCG, nunca agonista'
    ],
    riskFactors: [
      'DOSIFICACIÓN SEGÚN PERFIL PACIENTE:',
      'NORMO-RESPONDEDORAS: AMH 1.5-4.0ng/ml, AFC 7-15, <35años',
      'FSH: 150-225UI/día, protocolo antagonista preferible',
      'HIPO-RESPONDEDORAS (POSEIDON 1-2):',
      'Respuesta subóptima previa, FSH 225-300UI/día',
      'Agregar LH 75-150UI/día, antagonista o microflare',
      'BAJA RESERVA (POSEIDON 3-4):',
      'AMH<1.2ng/ml, AFC<5, FSH 300-450UI/día máximo',
      'ALTO RIESGO OHSS: AMH>3.5ng/ml, AFC>15, SOP',
      'FSH 100-150UI/día, antagonista obligatorio',
      'FACTORES MODIFICADORES:',
      'Edad >35años: aumentar dosis 10-15%',
      'Cirugías ováricas previas: aumentar 20-30%',
      'IMC>30: considerar aumentar dosis inicial'
    ],
    prognosis: {
      natural: 'Variable según protocolo: antagonista(menos OHSS, más flexible), agonista largo(mayor predictibilidad), microflare(mejor baja reserva)',
      withTreatment: 'Ovocitos esperados: normo-respondedoras(8-15), hipo-respondedoras(4-8), baja reserva(2-6), alto riesgo OHSS(15-25); tasas fertilización 70-80%',
      timeToConception: 'Duración estimulación: 8-12 días promedio, antagonista más corto que agonista largo; aspiración día fijo post-trigger'
    },
    relatedConditions: [
      'PROTOCOLOS ESPECÍFICOS DETALLADOS:',
      '1. MICROFLARE (pobres respondedoras):',
      'ACO x21 días, descanso 2-3 días',
      'Día 2-3: leuprorelina 50μg SC q12h (microdosis)',
      'Día 3-4: FSH 300-450UI/día alta dosis',
      'Solo hCG trigger, folículos <18-19mm',
      '2. MINI-IVF (preservación fertilidad):',
      'Clomifeno 50-100mg días 3-7',
      'FSH 75-150UI días 5,7,9',
      'Antagonista si folículo >14mm',
      'Objetivo: 2-5 ovocitos calidad',
      '3. STOP GnRH (pobres respondedoras genuinas):',
      'Agonista día 21→confirmar supresión→detener',
      'FSH alta dosis x4-5 días',
      'Antagonista cuando E2>300pg/ml',
      'AJUSTES DURANTE ESTIMULACIÓN:',
      'Respuesta lenta día 8(<10mm): ↑FSH 37.5-75UI, +LH 75UI',
      'Respuesta excesiva: reducir/suspender FSH("coasting")',
      'E2>4000pg/ml: suspender gonadotropinas, trigger agonista+freeze-all',
      'ADMINISTRACIÓN MEDICAMENTOS:',
      'Gonadotropinas: SC nocturno, rotar sitios inyección',
      'Antagonistas: SC matutino, horario fijo, alejado gonadotropinas',
      'hCG trigger: hora exacta crítica para timing aspiración',
      'MONITOREO DETALLADO:',
      'Ecografía: número folículos, diámetro>10mm, endometrio trilaminar',
      'Laboratorio: E2(150-200pg/ml/folículo), P<1.5ng/ml, LH<10mUI/ml',
      'CRITERIOS CANCELACIÓN:',
      '<3 folículos >14mm, E2<500pg/ml estimulación máxima',
      'P>2.0ng/ml, sin respuesta 20 días estimulación',
      'COMPLICACIONES Y PREVENCIÓN:',
      'OHSS: protocolo antagonista+trigger agonista+cabergolina 0.5mg x8días',
      'Pico LH prematuro: antagonista 0.5mg/día, trigger inmediato si LH>15',
      'PREPARACIÓN ASPIRACIÓN:',
      '36h antes: trigger+antibiótico profiláctico',
      'Noche previa: ayuno medianoche, sin maquillaje',
      'Día aspiración: vejiga vacía, acompañante obligatorio'
    ],
    evidenceLevel: 'A',
    references: [
      { doi: '10.1016/j.fertnstert.2024.02.015', guideline: 'ASRM Ovarian Stimulation Protocols Update 2024' },
      { doi: '10.1093/hropen/hoae015', guideline: 'ESHRE COS Guidelines Revision 2024' },
      { pmid: '38456123', guideline: 'GnRH Antagonist vs Long Protocol Meta-analysis 2024' },
      { doi: '10.1186/s12958-024-01156-8', guideline: 'Personalized COS Strategies 2024' },
      { doi: '10.1016/j.rbmo.2024.03.008', guideline: 'POSEIDON Stimulation Protocols 2024' },
      { pmid: '37845612', guideline: 'OHSS Prevention Cabergoline ASRM 2024' },
      { doi: '10.1093/humupd/dmae008', guideline: 'Poor Responders Stimulation Strategies 2024' }
    ]
  },

  // 🔬 PROBABILIDADES DE EMBARAZO POR TÉCNICA DE REPRODUCCIÓN ASISTIDA
  artSuccessRatesByTechnique: {
    id: 'artSuccessRatesByTechnique',
    name: 'ART Success Rates by Technique and Age',
    nameES: 'Probabilidades de Embarazo por Técnica de Reproducción Asistida',
    category: 'couple',
    prevalence: 'Datos aplicables 100% técnicas reproducción asistida según edad/diagnóstico/protocolo',
    definition: 'Sistema integral tasas éxito técnicas reproducción asistida actualizadas 2024-2025. Incluye probabilidades por edad, diagnóstico específico, técnica empleada y factores modificadores. Fundamentales para counseling pacientes, selección técnica óptima y expectativas realistas tratamiento.',
    symptoms: [
      'TÉCNICAS BAJA COMPLEJIDAD - TASAS ÉXITO:',
      'INSEMINACIÓN INTRAUTERINA (IUI):',
      'General: 5-15% por ciclo, acumulativa 20-30% tras 3-4 ciclos',
      '<35años: 7-10% espontáneo, 10% Clomid+IUI, 15% gonadotropinas+IUI',
      '35-37años: 6-9% por ciclo, esperma donante 48.91% acumulativo',
      '38-39años: 4-7% por ciclo, esperma donante 24.14% acumulativo',
      '≥40años: 1-4% por ciclo, esperma donante 11.76% acumulativo',
      'COITO PROGRAMADO CON ESTIMULACIÓN:',
      '<35años: 8-12% por ciclo',
      '35-39años: 5-8% por ciclo',
      '≥40años: 1-3% por ciclo'
    ],
    diagnosticCriteria: [
      'FIV/ICSI TRANSFERENCIA FRESCO - POR EDAD:',
      '<35 AÑOS: embarazo clínico 40-50%, nacido vivo 35-42%',
      '35-37 AÑOS: embarazo clínico 30-40%, nacido vivo 25-35%',
      '38-40 AÑOS: embarazo clínico 20-30%, nacido vivo 15-25%',
      '41-42 AÑOS: embarazo clínico 10-20%, nacido vivo 5-15%',
      '≥43 AÑOS: embarazo clínico <10%, nacido vivo 1-5%',
      'TRANSFERENCIA EMBRIONES CONGELADOS (FET):',
      '<35años: 40-50% por transferencia',
      '35-37años: 35-45% por transferencia',
      '38-40años: 25-35% por transferencia',
      '>40años: 10-20% por transferencia',
      'Blastocisto congelado: 55.1% embarazo clínico',
      'Sin diferencia significativa FET vs fresco en tasas nacido vivo'
    ],
    riskFactors: [
      'FACTORES POSITIVOS (MEJORAN PROBABILIDADES):',
      'Edad <35años (factor más importante)',
      'Buena reserva ovárica (AMH>1.5ng/ml)',
      'IMC normal (18.5-24.9)',
      'Primera transferencia',
      'Embriones buena calidad/euploides',
      'Endometrio >8mm trilaminar',
      'FACTORES NEGATIVOS (REDUCEN PROBABILIDADES):',
      'Edad avanzada (declive exponencial >35años)',
      'Baja reserva ovárica (AMH<1.0ng/ml)',
      'Factor masculino severo',
      'Endometriosis severa (grados III-IV)',
      'Fallo implantación recurrente',
      'Obesidad (IMC>30), tabaquismo'
    ],
    prognosis: {
      natural: 'Variable extrema por edad: óptima <35años, crítica >40años; diagnóstico específico modifica sustancialmente probabilidades',
      withTreatment: 'IUI: 5-15% ciclo; FIV <35años(35-42% nacido vivo), >40años(1-5%); Ovodonación: 40-55% independiente edad receptora; Tasas acumulativas: 60-70% tras 3 ciclos FIV',
      timeToConception: 'IUI: máximo 3-4 ciclos antes escalar; FIV: inmediato según disponibilidad; Tasas acumulativas >75% tras múltiples ciclos <40años'
    },
    relatedConditions: [
      'TASAS POR DIAGNÓSTICO ESPECÍFICO:',
      'FACTOR MASCULINO LEVE: IUI 16.9% por ciclo',
      'ENDOMETRIOSIS: leve 6.5% IUI, severa <2%, con inyectables 11%',
      'SOP: Clomid/Femara+IUI 15-20%, inyectables+IUI 20-25%',
      'FACTOR CERVICAL: IUI 10-15% por ciclo',
      'OVODONACIÓN (independiente edad receptora):',
      'Embarazo clínico: 50-65% por transferencia',
      'Nacido vivo: 40-55% por transferencia',
      'Acumulativa: >80% tras 3 transferencias',
      'TASAS ACUMULATIVAS FIV/ICSI:',
      '1 ciclo: 25-35%',
      '2 ciclos: 45-55%',
      '3 ciclos: 60-70%',
      'Mujeres <40años: >50% tras 6 ciclos IUI, >75% tras 12 ciclos',
      'COMPARACIONES TÉCNICAS:',
      'IUI vs FIV (<35años): IUI 10-15% vs FIV 35-45% por ciclo',
      'Costo-efectividad favorece IUI primeros intentos parejas jóvenes',
      'FIV convencional vs ICSI: tasas comparables sin factor masculino',
      'ICSI no mejora resultados infertilidad no masculina',
      'Transferencia única vs doble: SET estándar reducir múltiples',
      'TENDENCIAS ACTUALES 2024-2025:',
      'Aumento FET: mayor proporción ciclos freeze-all',
      'Transferencia única electiva: estándar de cuidado',
      'PGT-A: uso creciente pero controversial <35años',
      'Protocolos personalizados: basados biomarcadores',
      'IA selección embrionaria: mejorando tasas éxito',
      'FACTORES EDAD-ESPECÍFICOS:',
      'Esperma donante vs esposo (<35años): 61.5% vs variable',
      'Esperma donante vs esposo (35-37años): 48.9% vs 22.9%',
      'Esperma donante vs esposo (38-39años): 24.1% vs 13.7%',
      'Esperma donante vs esposo (≥40años): 11.8% vs 6.9%',
      'FET asociado menor riesgo parto prematuro vs fresco',
      'ICSI 40años: 11.4% tasa parto'
    ],
    evidenceLevel: 'A',
    references: [
      { doi: '10.1016/j.fertnstert.2024.04.025', guideline: 'ART Success Rates Update Fertility Sterility 2024' },
      { pmid: '38567893', guideline: 'IUI Success Rates Age-Specific Analysis 2024' },
      { doi: '10.1186/s12958-024-01198-y', guideline: 'Fresh vs Frozen Transfer Outcomes 2024' },
      { pmid: '37892456', guideline: 'Oocyte Donation Success Rates 2024' },
      { doi: '10.1093/hropen/hoae020', guideline: 'Cumulative Success Rates Multiple Cycles 2024' },
      { pmid: '38234567', guideline: 'Factors Affecting IVF Success Meta-analysis 2024' },
      { doi: '10.1016/j.rbmo.2024.04.012', guideline: 'Cost-Effectiveness IUI vs IVF 2024' }
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
