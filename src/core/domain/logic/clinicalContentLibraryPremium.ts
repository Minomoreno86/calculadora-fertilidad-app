// src/core/domain/logic/clinicalContentLibraryPremium.ts
// Este archivo centraliza todos los textos de recomendaciones e insights clínicos EXCLUSIVOS del MÓDULO PREMIUM.
// Basado en "PARAMETROS FASE 1.docx" y "REGLAS DE INTERACCION NO LINEAL.docx"
// No modifica la clinicalContentLibrary.ts base.

interface ClinicalInfo {
  explanation: string;
  recommendations: string[];
  sources?: string[];
  justification?: string;
}

export const clinicalContentLibraryPremium: Record<string, ClinicalInfo> = {
  // ===================================================================
  // FACTORES INDIVIDUALES (Basado en "PARAMETROS FASE 1.docx")
  // ===================================================================

  // --- Edad ---
  EDAD_OPT: {
    explanation:
      'Tu edad se encuentra en un rango óptimo de fertilidad. La edad es el factor predictivo más robusto en fertilidad. [cite: 79]',
    recommendations: ['Continúa con intento natural hasta 12 meses. [cite: 82]'],
    sources: ['PMID: 37004868 [cite: 84]', 'PMID: 32215375 [cite: 85]'],
  },
  EDAD_LIG_RED: {
    explanation:
      'Tu fertilidad se encuentra ligeramente reducida debido a la edad. La edad es el factor predictivo más robusto en fertilidad. [cite: 79]',
    recommendations: ['Considerar evaluación si no hay embarazo en 6 meses. [cite: 82]'],
    sources: ['PMID: 37004868 [cite: 84]'],
  },
  EDAD_MOD_RED: {
    explanation:
      'Tu fertilidad está moderadamente reducida debido a la edad. A partir de los 35 años se acelera el declive de fertilidad[cite: 81].',
    recommendations: ['Evaluación inmediata, considerar FIV si hay otros factores. [cite: 83]'],
    sources: ['PMID: 37004868 [cite: 84]', 'PMID: 32215375 [cite: 85]'],
  },
  EDAD_ALTO_RIESGO: {
    explanation:
      'Tu edad representa un alto riesgo para la fertilidad. Después de los 40 las tasas de embarazo espontáneo y por FIV se reducen drásticamente[cite: 81].',
    recommendations: ['Evaluación inmediata, considerar FIV como primera línea. [cite: 83]'],
    sources: ['PMID: 37004868 [cite: 84]', 'PMID: 32215375 [cite: 85]'],
  },
  EDAD_MUY_ALTO_RIESGO: {
    explanation:
      'Tu edad representa un muy alto riesgo para la fertilidad. Las tasas de embarazo son muy bajas. [cite: 81]',
    recommendations: ['Consejo genético, FIV con PGT-A o considerar ovodonación. [cite: 83]'],
    sources: ['PMID: 37004868 [cite: 84]'],
  },
  EDAD_CRITICA: {
    explanation:
      'Tu edad (>42 años) presenta un riesgo crítico para la fertilidad con óvulos propios. La probabilidad es extremadamente baja. [cite: 78]',
    recommendations: ['FIV con PGT-A o ovodonación; evaluación urgente. [cite: 83]'],
    sources: ['PMID: 37004868 [cite: 84]'],
  },

  // --- IMC ---
  IMC_BAJO: {
    explanation:
      'Tu Índice de Masa Corporal (IMC) indica bajo peso. Tanto el bajo peso como el sobrepeso/obesidad alteran el eje hipotálamo-hipófisis-ovario, afectando la ovulación, la implantación y aumentando el riesgo de pérdida gestacional. [cite: 87]',
    recommendations: [
      'Inicia intervención nutricional para alcanzar un IMC saludable (18.5-24.9). [cite: 89]',
      'Evita el ejercicio excesivo. [cite: 89]',
    ],
    sources: ['PMID: 34657864 [cite: 91]', 'PMID: 35821959 [cite: 92]'],
  },
  IMC_NORMAL: {
    explanation: 'Tu IMC se encuentra en un rango normal y saludable para la fertilidad. [cite: 86]',
    recommendations: ['Mantén tu estilo de vida saludable. [cite: 90]'],
    sources: ['PMID: 34657864 [cite: 91]'],
  },
  IMC_SOBREPESO: {
    explanation:
      'Tu IMC indica sobrepeso. Puede afectar la ovulación, la implantación y aumentar el riesgo de pérdida gestacional. [cite: 87]',
    recommendations: [
      'Inicia un plan de pérdida de peso con dieta y actividad física estructurada. [cite: 90]',
      'La pérdida del 5-10% del peso corporal puede mejorar significativamente la fertilidad. [cite: 90]',
    ],
    sources: ['PMID: 34657864 [cite: 91]', 'PMID: 35821959 [cite: 92]'],
  },
  IMC_OBESIDAD_I: {
    explanation:
      'Tu IMC indica Obesidad Clase I. Esto puede alterar la ovulación, la implantación y la calidad embrionaria. [cite: 87]',
    recommendations: [
      'Implementa un programa de pérdida de peso significativo. [cite: 90]',
      'Considera metformina si hay SOP asociado. [cite: 90]',
      'Busca apoyo multidisciplinario. [cite: 90]',
    ],
    sources: ['PMID: 34657864 [cite: 91]', 'PMID: 35821959 [cite: 92]'],
  },
  IMC_OBESIDAD_II: {
    explanation:
      'Tu IMC indica Obesidad Clase II. La obesidad reduce la respuesta ovárica a la estimulación y la calidad embrionaria. [cite: 88]',
    recommendations: [
      'Es fundamental una pérdida de peso significativa (≥10% del peso corporal) antes de iniciar tratamientos. [cite: 90]',
      'Busca apoyo multidisciplinario (nutrición, endocrinología). [cite: 90]',
    ],
    sources: ['PMID: 34657864 [cite: 91]', 'PMID: 35821959 [cite: 92]'],
  },
  IMC_OBESIDAD_III: {
    explanation:
      'Tu IMC indica Obesidad Clase III. Este grado de obesidad tiene un impacto muy significativo en la fertilidad, respuesta a tratamientos y riesgo gestacional. [cite: 88]',
    recommendations: [
      'Una pérdida de peso sustancial (idealmente antes de tratamientos) es la prioridad número uno. [cite: 90]',
      'Considera opciones bariátricas si es necesario y discute un plan con tu especialista en fertilidad. [cite: 90]',
    ],
    sources: ['PMID: 34657864 [cite: 91]', 'PMID: 35821959 [cite: 92]'],
  },

  // --- AMH ---
  AMH_ALTA_RESERVA: {
    explanation:
      'Tienes una alta reserva ovárica. Valores muy altos pueden sugerir SOP. La AMH refleja la cantidad de folículos antrales disponibles. [cite: 96]',
    recommendations: [
      'Si hay disfunción ovulatoria, sospechar SOP. [cite: 98]',
      'Ajustar dosis en estimulación ovárica para evitar hiperestimulación. [cite: 98]',
    ],
    sources: ['PMID: 37070264 [cite: 99]', 'PMID: 28292616 [cite: 100]'],
  },
  AMH_NORMAL: {
    explanation: 'Tu reserva ovárica es normal/adecuada. [cite: 93]',
    recommendations: ['Este es un buen indicador de potencial ovárico. [cite: 98]'],
    sources: ['PMID: 37070264 [cite: 99]'],
  },
  AMH_LIG_REDUCIDA: {
    explanation: 'Tu reserva ovárica está ligeramente reducida. [cite: 93]',
    recommendations: ['Considerar consejo reproductivo y posible estimulación ovárica si no hay embarazo. [cite: 98]'],
    sources: ['PMID: 37070264 [cite: 99]', 'PMID: 28292616 [cite: 100]'],
  },
  AMH_BAJA: {
    explanation:
      'Tu reserva ovárica es baja. Esto predice una menor respuesta ovárica a la estimulación. [cite: 95]',
    recommendations: [
      'Consulta urgente con un especialista en fertilidad para evaluación de reserva ovárica. [cite: 97]',
      'Considerar FIV precoz, el tiempo es crítico. [cite: 97]',
    ],
    sources: ['PMID: 37070264 [cite: 99]', 'PMID: 28292616 [cite: 100]'],
  },
  AMH_MUY_BAJA: {
    explanation:
      'Tu reserva ovárica es muy baja. Esto predice una respuesta ovárica pobre o nula a la estimulación. [cite: 95]',
    recommendations: [
      'Evaluación inmediata de opciones avanzadas como FIV. [cite: 97]',
      'Considerar consejo sobre ovodonación. [cite: 97]',
    ],
    sources: ['PMID: 37070264 [cite: 99]', 'PMID: 28292616 [cite: 100]'],
  },

  // --- Miomatosis Uterina ---
  MIOMA_SUBMUCOSO: {
    explanation:
      'Se ha detectado un mioma submucoso o intramural que distorsiona la cavidad uterina. Estos miomas reducen la tasa de implantación y duplican el riesgo de aborto. [cite: 102]',
    recommendations: ['Se recomienda histeroscopia o miomectomía antes de intentar embarazo. [cite: 105]'],
    sources: ['PubMedgpm.amegroups.org [cite: 104]'], // Fuente del documento
  },
  MIOMA_INTRAMURAL_GRANDE: {
    explanation:
      'Se ha detectado un mioma intramural grande (≥ 4 cm) sin distorsión de la cavidad. Estos pueden reducir la tasa de nacidos vivos. [cite: 103]',
    recommendations: ['Valorar miomectomía si hay fallos repetidos de FIV o abortos. [cite: 105]'],
    sources: ['PubMedgpm.amegroups.org [cite: 104]'],
  },
  MIOMA_SUBSEROSO: {
    explanation:
      'Se ha detectado un mioma subseroso aislado. Generalmente, no tiene un impacto significativo en la fertilidad. [cite: 104]',
    recommendations: ['No se recomienda resección solo por fertilidad. [cite: 106]'],
    sources: ['PubMedgpm.amegroups.org [cite: 104]'],
  },
  MIOMA_AUSENTE: {
    explanation: 'No se han detectado miomas relevantes. La cavidad uterina está íntegra. [cite: 101]',
    recommendations: ['Este es un factor favorable para la fertilidad.'],
  },

  // --- Pólipos Endometriales ---
  POLIPO_PEQUENO: {
    explanation:
      'Se ha detectado un pólipo endometrial pequeño único (< 1 cm). Los pólipos pueden interferir mecánicamente con la implantación. [cite: 108]',
    recommendations: [
      'Histeroscopia ambulatoria para resección (polipectomía) para optimizar la cavidad endometrial. [cite: 111]',
      'Evaluar intento natural o IAC tras resección por 6 meses. [cite: 111]',
    ],
    sources: ['DOI: 10.1186/s12958-016-0213-7 [cite: 54]', 'DOI: 10.1016/j.fertnstert.2004.08.046 [cite: 55]'], // Fuentes del documento (ajustadas a PMID/DOI si se encuentran)
  },
  POLIPO_GRANDE: {
    explanation:
      'Se ha detectado un pólipo endometrial grande (> 1 cm) o múltiples. Pueden interferir significativamente con la implantación. [cite: 108]',
    recommendations: ['Se recomienda resección histeroscópica antes de FIV o IAC. [cite: 111]'],
    sources: ['DOI: 10.1186/s12958-016-0213-7 [cite: 54]'],
  },
  POLIPO_OSTIUM: {
    explanation:
      'Se ha detectado un pólipo sobre el ostium tubárico o recurrente. Esto puede causar obstrucción y reducir drásticamente la probabilidad de fecundación. [cite: 108]',
    recommendations: ['Se recomienda resección histeroscópica urgente antes de cualquier tratamiento. [cite: 111]'],
    sources: ['DOI: 10.1186/s12958-016-0213-7 [cite: 54]'],
  },
  POLIPO_AUSENTE: {
    explanation: 'No se han detectado pólipos endometriales. Tu cavidad uterina está limpia. [cite: 107]',
    recommendations: ['Este es un factor favorable para la implantación.'],
  },

  // --- Adenomiosis ---
  ADENOMIOSIS_FOCAL: {
    explanation:
      'Se ha detectado adenomiosis focal. Esta condición reduce la probabilidad de implantación y puede incrementar el aborto. [cite: 114]',
    recommendations: [
      'Valorar adenomectomía o ablación focal en mujeres jóvenes sintomáticas. [cite: 117]',
      'Puede requerir protocolo largo con agonista GnRH antes de FIV. [cite: 117]',
    ],
    sources: ['DOI: 10.1016/j.jogc.2018.05.007 [cite: 22]', 'DOI: 10.1093/humupd/dmx003 [cite: 22]'], // Fuentes del documento (ajustadas)
  },
  ADENOMIOSIS_DIFUSA: {
    explanation:
      'Se ha detectado adenomiosis difusa. El compromiso miometrial generalizado reduce significativamente la implantación y eleva el riesgo de aborto. [cite: 115]',
    recommendations: [
      'Protocolo largo con agonista GnRH por al menos 2 meses previo a FIV y transferencia diferida. [cite: 118]',
      'Considerar vitrificación de ovocitos temprana. [cite: 118]',
      'Seguimiento obstétrico especializado por mayor riesgo de parto pretérmino y hemorragia posparto. [cite: 119]',
    ],
    sources: ['DOI: 10.1016/j.jogc.2018.05.007 [cite: 22]', 'DOI: 10.1093/humupd/dmx003 [cite: 22]'],
  },
  ADENOMIOSIS_AUSENTE: {
    explanation: 'No se ha detectado adenomiosis. Tu miometrio es homogéneo. [cite: 113]',
    recommendations: ['Este es un factor favorable.'],
  },

  // --- Endometriosis ---
  ENDOMETRIOSIS_LEVE: {
    explanation:
      'Endometriosis leve (Grados I-II). Incluso estas formas pueden alterar la implantación debido a la inflamación peritoneal crónica. [cite: 122]',
    recommendations: [
      'Considerar laparoscopia diagnóstica/terapéutica si hay infertilidad persistente. [cite: 123]',
      'No retrasar tratamientos en mujeres >35 años o si hay falla postquirúrgica. [cite: 124]',
    ],
    sources: ['PMID: 35373629 [cite: 124]', 'PMID: 34397855 [cite: 125]'],
  },
  ENDOMETRIOSIS_SEVERA: {
    explanation:
      'Endometriosis severa (Grados III-IV). Afecta la fertilidad por daño anatómico, inflamación y reducción de calidad ovocitaria. [cite: 121]',
    recommendations: [
      'Valoración para FIV como primera línea de tratamiento. [cite: 123]',
      'Considerar criopreservación ovocitaria si hay endometriomas grandes (>4 cm). [cite: 7]',
      'No retrasar tratamientos. [cite: 124]',
    ],
    sources: ['PMID: 35373629 [cite: 124]', 'PMID: 34397855 [cite: 125]'],
  },
  ENDOMETRIOSIS_AUSENTE: {
    explanation: 'No hay evidencia de endometriosis. [cite: 120]',
    recommendations: ['Este es un factor favorable.'],
  },

  // --- Ciclo Menstrual ---
  CICLO_REGULAR: {
    explanation:
      'Tu ciclo menstrual es regular, lo que sugiere una ovulación predecible. La probabilidad de ovulación espontánea mensual supera el 90%. [cite: 129]',
    recommendations: ['Continúa monitoreando tu ciclo para identificar el periodo fértil. [cite: 130]'],
    sources: ['PMID: 15665075 [cite: 132]', 'PMID: 37170164 [cite: 133]'],
  },
  CICLO_IRREGULAR_LEVE: {
    explanation:
      'Tienes un ciclo menstrual irregular leve. Esto puede indicar ovulación esporádica o disfunción ovulatoria. [cite: 128]',
    recommendations: ['Considerar un estudio hormonal completo (TSH, prolactina, andrógenos, AMH) para identificar la causa. [cite: 131]'],
    sources: ['PMID: 15665075 [cite: 132]'],
  },
  CICLO_IRREGULAR_MARCADO: {
    explanation:
      'Tienes un ciclo menstrual marcadamente irregular, lo que indica una alta probabilidad de anovulación crónica. [cite: 128]',
    recommendations: [
      'Requiere un estudio hormonal completo y evaluación por un especialista. [cite: 131]',
      'Considerar inducción ovulatoria o FIV si hay factores asociados. [cite: 131]',
    ],
    sources: ['PMID: 15665075 [cite: 132]', 'PMID: 37170164 [cite: 133]'],
  },

  // --- SOP ---
  SOP_LEVE: {
    explanation:
      'Tienes un fenotipo de SOP leve, con ovulación preservada o AMH <6 ng/mL. Es una de las causas más comunes de infertilidad anovulatoria. [cite: 136]',
    recommendations: [
      'Cambios en estilo de vida (ejercicio, reducción del 5-10% del peso corporal). [cite: 138]',
      'Letrozol como primera línea para inducción ovulatoria. [cite: 139]',
    ],
    sources: ['PMID: 37166285 [cite: 140]', 'PMID: 25006718 [cite: 141]'],
  },
  SOP_MODERADO: {
    explanation:
      'Tienes un fenotipo de SOP moderado, con anovulación o AMH >6 ng/mL. El entorno endocrino desfavorable y la resistencia a la insulina alteran la receptividad endometrial. [cite: 137]',
    recommendations: [
      'Cambios en estilo de vida y dieta. [cite: 138]',
      'Considerar metformina si hay HOMA-IR elevado. [cite: 139]',
      'Inducción ovulatoria con letrozol. Considerar FIV en casos refractarios. [cite: 139]',
    ],
    sources: ['PMID: 37166285 [cite: 140]', 'PMID: 25006718 [cite: 141]'],
  },
  SOP_SEVERO: {
    explanation:
      'Tienes un fenotipo de SOP severo, con anovulación, IMC >30 o HOMA >3.5. Hay una resistencia significativa a los tratamientos orales. [cite: 134]',
    recommendations: [
      'Pérdida de peso estructurada y metformina son esenciales. [cite: 139]',
      'Se recomienda FIV directa o tras pocos ciclos de inducción fallidos. [cite: 139]',
    ],
    sources: ['PMID: 37166285 [cite: 140]', 'PMID: 25006718 [cite: 141]'],
  },
  SOP_NO_APLICA: {
    explanation: 'No tienes diagnóstico de SOP. [cite: 134]',
    recommendations: ['Este es un factor favorable.'],
  },

  // --- HSG ---
  HSG_NORMAL: {
    explanation:
      'Tu Histerosalpingografía (HSG) muestra trompas permeables bilaterales sin alteraciones. Esto es favorable para la concepción natural. [cite: 143]',
    recommendations: [
      'Este es un factor favorable para la fertilidad natural.',
    ],
    sources: ['DOI: 10.1016/j.fertnstert.2020.12.010 [cite: 145]'],
  },
  HSG_UNILATERAL: {
    explanation:
      'Tienes una obstrucción tubárica unilateral (una trompa obstruida o hidrosálpinx unilateral). Esto reduce la probabilidad de embarazo espontáneo en ~20-30%. [cite: 145]',
    recommendations: [
      'Considerar inseminación intrauterina (IAC) o FIV tras 6-12 meses si no hay embarazo. [cite: 146]',
    ],
    sources: ['DOI: 10.1016/j.fertnstert.2020.12.010 [cite: 145]'],
  },
  HSG_BILATERAL: {
    explanation:
      'Tienes una obstrucción tubárica bilateral (ambas trompas obstruidas o hidrosálpinx bilateral). Esto impide el paso de ovocitos y espermatozoides. [cite: 144]',
    recommendations: ['FIV directa es la única opción para el embarazo. [cite: 147]'],
    sources: ['DOI: 10.1016/j.fertnstert.2020.12.010 [cite: 145]'],
  },
  HSG_MALFORMACION: {
    explanation:
      'Se ha detectado una malformación uterina relevante (ej. útero septado o unicorne). Esto puede afectar la implantación y el desarrollo del embarazo. [cite: 142]',
    recommendations: [
      'Considerar corrección histeroscópica si hay abortos recurrentes o fallos de FIV. [cite: 147]',
    ],
    sources: ['DOI: 10.1016/j.fertnstert.2020.12.010 [cite: 145]'],
  },
  HSG_DESCONOCIDO: {
    explanation: 'El resultado de tu Histerosalpingografía (HSG) es desconocido o no se ha realizado. La permeabilidad tubaria es esencial para la fertilización natural. [cite: 143]',
    recommendations: ['Se recomienda realizar una HSG para evaluar el factor tubárico. [cite: 146]'],
  },

  // --- Ligadura de Trompas (OTB) ---
  OTB_PRESENTE: {
    explanation:
      'Tienes una ligadura de trompas (OTB) bilateral, lo que elimina la posibilidad de embarazo espontáneo. [cite: 150]',
    recommendations: [
      'FIV es la opción preferente para el embarazo. [cite: 152]',
      'La recanalización solo se recomienda en casos muy específicos (edad < 35, clips o anillos, remanente tubario > 4 cm y sin otros factores de infertilidad). [cite: 153]',
    ],
    sources: ['DOI: 10.1016/j.fertnstert.2021.08.022 [cite: 151]'],
  },
  OTB_AUSENTE: {
    explanation: 'No tienes ligadura de trompas previa. [cite: 149]',
    recommendations: ['Este es un factor favorable.'],
  },

  // --- Prolactina ---
  PRL_NORMAL: {
    explanation: 'Tus niveles de prolactina son normales. No hay interferencia en la ovulación por este factor. [cite: 154]',
    recommendations: ['Mantén tus controles habituales.'],
  },
  PRL_LEVE: {
    explanation:
      'Tienes hiperprolactinemia leve. La hiperprolactinemia puede inhibir la hormona GnRH y bloquear la ovulación. [cite: 156]',
    recommendations: ['Considerar determinar la causa (fisiológica, farmacológica o adenoma). Tratar con agonistas dopaminérgicos si los niveles persisten elevados con síntomas. [cite: 158]'],
    sources: ['DOI: 10.1210/clinem/dgac389 [cite: 157]'],
  },
  PRL_SIGNIFICATIVA: {
    explanation:
      'Tienes hiperprolactinemia significativa. Niveles > 50 ng/mL suelen asociarse con amenorrea o anovulación. [cite: 157]',
    recommendations: [
      'Determinar la causa subyacente (fisiológica, farmacológica o adenoma hipofisario). [cite: 158]',
      'Tratamiento con agonistas dopaminérgicos (cabergolina o bromocriptina) es necesario para normalizar los niveles y restaurar la ovulación. [cite: 158]',
    ],
    sources: ['DOI: 10.1210/clinem/dgac389 [cite: 157]'],
  },

  // --- TSH ---
  TSH_OPTIMA: {
    explanation: 'Tu nivel de TSH está en el rango óptimo (0.5-2.5 mUI/L) para la concepción y el embarazo. [cite: 159]',
    recommendations: ['Mantén controles periódicos. [cite: 162]'],
    sources: ['DOI: 10.1089/thy.2016.0457 [cite: 161]'],
  },
  TSH_LIMITE_SUPERIOR: {
    explanation:
      'Tu nivel de TSH está en el límite superior del rango aceptable para fertilidad (2.5-4.0 mUI/L). El hipotiroidismo subclínico puede asociarse a ciclos anovulatorios y mayor riesgo de aborto. [cite: 161]',
    recommendations: ['Considerar iniciar o ajustar levotiroxina si hay infertilidad o anticuerpos TPO positivos, con el objetivo de alcanzar TSH < 2.5 mUI/L. [cite: 162]'],
    sources: ['DOI: 10.1089/thy.2016.0457 [cite: 161]'],
  },
  TSH_HIPOTIROIDISMO: {
    explanation:
      'Tu nivel de TSH indica hipotiroidismo (> 4.0 mUI/L). Esto se asocia a ciclos anovulatorios, aumento del aborto y menor tasa de implantación. [cite: 161]',
    recommendations: [
      'Iniciar o ajustar levotiroxina inmediatamente para alcanzar TSH < 2.5 mUI/L. [cite: 162]',
      'Recontrolar TSH cada 6-8 semanas. [cite: 163]',
      'Consulta con un endocrinólogo especializado en fertilidad. [cite: 162]',
    ],
    sources: ['DOI: 10.1089/thy.2016.0457 [cite: 161]'],
  },

  // --- TPOAb ---
  TPOAB_POSITIVO: {
    explanation:
      'Tienes anticuerpos antitiroideos (TPOAb) positivos. Esto se asocia con mayor riesgo de aborto espontáneo y menor tasa de nacidos vivos, incluso con TSH normal. [cite: 165]',
    recommendations: [
      'Vigilancia estrecha durante el embarazo. [cite: 166]',
      'Considerar levotiroxina si TSH > 2.5 o en mujeres con antecedentes de pérdida gestacional. [cite: 166]',
    ],
    sources: ['DOI: 10.1136/bmj.d2616 [cite: 165]'],
  },
  TPOAB_NEGATIVO: {
    explanation: 'Tus anticuerpos antitiroideos (TPOAb) son negativos. [cite: 164]',
    recommendations: ['Este es un factor favorable.'],
  },

  // --- HOMA-IR ---
  HOMA_NORMAL: {
    explanation: 'Tu índice HOMA-IR es normal. No se detecta resistencia a la insulina. [cite: 167]',
    recommendations: ['Mantén tus hábitos saludables.'],
  },
  HOMA_LEVE: {
    explanation:
      'Tienes leve resistencia a la insulina. Esto puede alterar el eje gonadal y la receptividad endometrial. [cite: 169]',
    recommendations: [
      'Implementar cambios de estilo de vida estructurados (alimentación balanceada y ejercicio regular). [cite: 171]',
      'Considerar metformina si HOMA ≥ 2.5 o si coexiste con SOP. [cite: 171]',
    ],
    sources: ['DOI: 10.3390/jcm10112440 [cite: 170]', 'DOI: 10.1016/j.fertnstert.2023.07.025 [cite: 170]'],
  },
  HOMA_SIGNIFICATIVA: {
    explanation:
      'Tienes resistencia a la insulina significativa. Esto reduce la ovulación espontánea, la receptividad endometrial y eleva el riesgo de aborto, especialmente en SOP. [cite: 169]',
    recommendations: [
      'Priorizar cambios intensivos de estilo de vida. [cite: 171]',
      'Metformina está fuertemente indicada. [cite: 171]',
      'Reevaluar cada 3-6 meses si se mantiene sin embarazo. [cite: 172]',
    ],
    sources: ['DOI: 10.3390/jcm10112440 [cite: 170]', 'DOI: 10.1016/j.fertnstert.2023.07.025 [cite: 170]'],
  },

  // --- Duración de la Infertilidad ---
  INFERTILIDAD_CORTA: {
    explanation: 'La duración de tu infertilidad es menor a 2 años, lo que aún se considera un tiempo fisiológico aceptable. [cite: 173]',
    recommendations: ['Continuar con la evaluación inicial si aún no se ha completado. [cite: 175]'],
    sources: ['DOI: 10.1016/S0015-0282(00)01723-9 [cite: 174]'],
  },
  INFERTILIDAD_MODERADA: {
    explanation: 'Tienes entre 2 y 4 años de infertilidad. La duración prolongada se asocia con menor tasa de embarazo espontáneo. [cite: 174]',
    recommendations: ['Se recomienda un estudio completo de la pareja sin más demora. [cite: 175]'],
    sources: ['DOI: 10.1016/S0015-0282(00)01723-9 [cite: 174]'],
  },
  INFERTILIDAD_PROLONGADA: {
    explanation:
      'Tienes 5 o más años de infertilidad. Esto sugiere una alta probabilidad de patología múltiple o subyacente. [cite: 174]',
    recommendations: ['Es muy probable que requieras FIV; evitar más tratamientos empíricos y buscar evaluación especializada para FIV. [cite: 176]'],
    sources: ['DOI: 10.1016/S0015-0282(00)01723-9 [cite: 174]', 'DOI: 10.1093/hropen/hox013 [cite: 175]'],
  },

  // --- Cirugías Pélvicas Previas ---
  CIRUGIA_PELVICA_NINGUNA: {
    explanation: 'No tienes cirugías pélvicas previas. [cite: 177]',
    recommendations: ['Este es un factor favorable.'],
  },
  CIRUGIA_PELVICA_UNA: {
    explanation:
      'Tienes el antecedente de 1 cirugía pélvica previa. Las cirugías pélvicas aumentan la probabilidad de adherencias y daño tubárico. [cite: 179]',
    recommendations: ['Solicitar ecografía detallada y considerar HSG precoz para evaluar la permeabilidad tubárica. [cite: 180]'],
    sources: ['DOI: 10.1016/j.ejogrb.2020.01.012 [cite: 179]', 'DOI: 10.1016/j.fertnstert.2020.12.010 [cite: 180]'],
  },
  CIRUGIA_PELVICA_MULTIPLE: {
    explanation:
      'Tienes el antecedente de 2 o más cirugías pélvicas. Esto eleva significativamente la probabilidad de adherencias, disrupción anatómica y falla tubárica oculta. [cite: 179]',
    recommendations: [
      'Considerar laparoscopia diagnóstica. [cite: 181]',
      'La FIV directa podría ser la mejor opción. [cite: 181]',
    ],
    sources: ['DOI: 10.1016/j.ejogrb.2020.01.012 [cite: 179]', 'DOI: 10.1016/j.fertnstert.2020.12.010 [cite: 180]'],
  },

  // --- Factor Masculino (Espermatograma) ---
  MALE_NORMOSPERMIA: {
    explanation: 'Los parámetros de tu espermatograma son normales (Normozoospermia). [cite: 183]',
    recommendations: ['Este es un factor muy favorable para la concepción natural.'],
    sources: ['WHO Manual 6th ed., 2021 [cite: 186]'],
  },
  MALE_OLIGOZOOSPERMIA: {
    explanation:
      'Se ha detectado Oligozoospermia (concentración <16 M/mL). La concentración seminal es clave para la fecundación. [cite: 183]',
    recommendations: ['Derivar a andrólogo/urólogo para estudio y posible tratamiento. Repetir espermatograma con abstinencia adecuada. [cite: 187]'],
    sources: ['WHO Manual 6th ed., 2021 [cite: 186]', 'DOI: 10.1007/s10815-021-02260-9 [cite: 187]'],
  },
  MALE_ASTENOZOOSPERMIA: {
    explanation:
      'Se ha detectado Astenozoospermia (motilidad progresiva <30%). La motilidad es fundamental para que los espermatozoides lleguen al óvulo. [cite: 183]',
    recommendations: ['Derivar a andrólogo/urólogo para estudio. Considerar ICSI en FIV si la motilidad es <20%. [cite: 189]'],
    sources: ['WHO Manual 6th ed., 2021 [cite: 186]', 'DOI: 10.1007/s10815-021-02260-9 [cite: 187]'],
  },
  MALE_TERATOZOOSPERMIA: {
    explanation:
      'Se ha detectado Teratozoospermia (morfología normal <4%). La morfología normal es importante para la fecundación y la calidad embrionaria. [cite: 183]',
    recommendations: ['Derivar a andrólogo/urólogo para estudio. Considerar ICSI en FIV si la morfología es <2%. [cite: 189]'],
    sources: ['WHO Manual 6th ed., 2021 [cite: 186]', 'DOI: 10.1007/s10815-021-02260-9 [cite: 187]'],
  },
  MALE_AZOOSPERMIA: {
    explanation: 'Se ha detectado Azoospermia (ausencia total de espermatozoides). [cite: 183]',
    recommendations: ['Requiere evaluación por andrólogo para determinar causa. Biopsia testicular para recuperación de espermatozoides (TESE) + FIV con ICSI o donación seminal. [cite: 188]'],
    sources: ['WHO Manual 6th ed., 2021 [cite: 186]'],
  },
  MALE_INCOMPLETO: {
    explanation: 'Los datos del espermatograma están incompletos o no se ha realizado un estudio completo.',
    recommendations: ['Se recomienda realizar un espermatograma completo y su análisis por un andrólogo.'],
  },

  // ===================================================================
  // INTERACCIONES NO LINEALES (Basado en "REGLAS DE INTERACCION NO LINEAL.docx")
  // ===================================================================

  // Interacción 1
  INT_EDAD_AMH_BAJA: {
    explanation:
      'La combinación de edad avanzada (≥38 años) y una reserva ovárica baja (AMH <0.8 ng/mL) predice un menor número de ovocitos recuperados (<4 en 65–80 % de los casos) y una mayor proporción de aneuploidías (≥ 70 %), con una fecundidad espontánea muy baja (<3% por ciclo). ',
    recommendations: [
      'FIV inmediata (no inseminación ni inducción). [cite: 2]',
      'Evaluación para PGT-A. [cite: 2]',
      'Consejería para ovodonación si AMH < 0.5 o respuesta previa pobre. [cite: 2]',
    ],
    sources: ['DOI: 10.1093/humupd/dmt012 [cite: 3]', 'PMID: 37004868 [cite: 3]'],
  },

  // Interacción 2
  INT_SOP_IR: {
    explanation:
      'La combinación de SOP con resistencia a la insulina significativa (HOMA-IR ≥3.5) se asocia a menor tasa de ovulación con tratamientos orales, baja receptividad endometrial y mayor riesgo de aborto precoz. [cite: 4]',
    recommendations: [
      'Metformina + pérdida ponderal (5-10%). [cite: 4]',
      'Letrozol como primera línea. [cite: 4]',
      'Escalar a FIV tras 3 ciclos fallidos. [cite: 4]',
      'Considerar agonista GnRH + metformina si fracaso repetido. [cite: 4]',
    ],
    sources: ['DOI: 10.1016/j.fertnstert.2023.07.025 [cite: 4]', 'PMID: 25006718 [cite: 5]'],
  },

  // Interacción 3
  INT_ENDO_AVANZADA_MASCULINO: {
    explanation:
      'La endometriosis severa (Grados III-IV) combinada con un factor masculino anormal reduce drásticamente la fertilidad espontánea debido a un doble factor anatómico y gamético. La tasa de embarazo espontáneo es <2% anual. [cite: 6]',
    recommendations: [
      'FIV-ICSI directa. [cite: 7]',
      'Evitar cirugía repetida en pacientes ≥35 años. [cite: 7]',
      'Si endometrioma >4 cm: considerar criopreservación ovocitaria previa. [cite: 7]',
    ],
    sources: ['DOI: 10.1093/hropen/hoac009 [cite: 7]', 'DOI: 10.1186/s12958-021-00785-z [cite: 8]'],
  },

  // Interacción 4
  INT_HSG_UNILATERAL_SEMINAL: {
    explanation:
      'Aunque una trompa permeable puede permitir embarazo, la calidad espermática baja disminuye significativamente la fecundidad conjunta. No se recomienda inducción ni inseminación intrauterina en este escenario si se lleva >12 meses de intento. [cite: 9]',
    recommendations: [
      'Evaluar FIV con ICSI según el tipo de alteración espermática. [cite: 10]',
      'Considerar laparoscopia solo si hay duda diagnóstica o hidrosálpinx oculto. [cite: 10]',
    ],
    sources: ['DOI: 10.1016/j.fertnstert.2020.12.010 [cite: 10]', 'DOI: 10.1016/j.fertnstert.2017.01.005 [cite: 11]'],
  },

  // Interacción 5
  INT_EDAD40_FALLO_OVARICO: {
    explanation:
      'Este perfil (Edad ≥40, AMH <0.3, y ciclos muy irregulares) sugiere un fallo ovárico inminente. La tasa de ovocitos euploides es <3% y la respuesta a FIV con óvulos propios es nula o pobre. [cite: 12]',
    recommendations: [
      'FIV con ovodonación directa. [cite: 13]',
      'No se recomienda inseminación ni inducción. [cite: 13]',
      'Apoyo emocional y psicológico intensivo. [cite: 13]',
    ],
    sources: ['DOI: 10.1016/j.fertnstert.2019.02.111 [cite: 14]', 'DOI: 10.1016/j.fertnstert.2021.09.001 [cite: 14]'],
  },

  // Interacción 6
  INT_SOP_IMC_OBESIDAD_SEVERA: {
    explanation:
      'La combinación de SOP y obesidad severa (IMC ≥35) se asocia a hiperinsulinismo crónico, mayor tasa de fallos de inducción ovulatoria y un riesgo de aborto >2.5x. La tasa de implantación en FIV es baja. [cite: 15]',
    recommendations: [
      'Pérdida de peso estructurada ≥10% antes de iniciar tratamientos. [cite: 15]',
      'Metformina + agonistas GLP-1 (si disponibles). [cite: 15]',
      'Considerar FIV directa con protocolos específicos. [cite: 15]',
    ],
    sources: ['DOI: 10.1210/jc.2015-3761 [cite: 16]', 'DOI: 10.1016/j.fertnstert.2023.07.025 [cite: 16]'],
  },

  // Interacción 7
  INT_MIOMA_SUBMUCOSO_ENDO_LEVE: {
    explanation:
      'Aunque ambas patologías por separado son tratables, la coexistencia de un mioma submucoso y endometriosis leve (I-II) interfiere mecánica e inflamatoriamente con la implantación, reduciendo las tasas de nacidos vivos tras FIV si no se corrigen quirúrgicamente. [cite: 17]',
    recommendations: [
      'Polipectomía o miomectomía histeroscópica antes de FIV. [cite: 19]',
      'Evaluar laparoscopia diagnóstica si endometriosis no confirmada. [cite: 19]',
      'Protocolo largo con agonista GnRH antes de transferencia embrionaria. [cite: 19]',
    ],
    sources: ['DOI: 10.1016/j.fertnstert.2008.08.090 [cite: 19]', 'DOI: 10.1093/hropen/hoac009 [cite: 19]'],
  },

  // Interacción 8
  INT_ADENOMIOSIS_DIFUSA_EDAD_AVANZADA: {
    explanation:
      'La combinación de adenomiosis difusa y edad avanzada (≥38 años) reduce significativamente la implantación y eleva el riesgo de aborto. Las tasas de FIV exitosas sin tratamiento hormonal previo son <15% en mujeres ≥ 38 años con adenomiosis difusa. [cite: 20]',
    recommendations: [
      'Protocolo largo con agonista GnRH por al menos 2 meses previo a FIV y transferencia diferida. [cite: 21]',
      'Considerar vitrificación ovocitaria si aún sin pareja. [cite: 21]',
    ],
    sources: ['DOI: 10.1016/j.jogc.2018.05.007 [cite: 22]', 'DOI: 10.1093/humupd/dmx003 [cite: 22]'],
  },

  // Interacción 9
  INT_INFERTILIDAD_LARGA_CIRUGIAS_MULTIPLES: {
    explanation:
      'El tiempo prolongado sin concepción (≥5 años) y la presencia de múltiples cirugías pélvicas (≥2) elevan la probabilidad de adherencias, disrupciones anatómicas y falla tubárica oculta. La probabilidad de embarazo espontáneo en esta población es <5% anual. [cite: 23]',
    recommendations: [
      'FIV directa. [cite: 24]',
      'Omisión de inseminaciones o inducción ovulatoria. [cite: 24]',
      'Laparoscopia diagnóstica solo si imagen dudosa o hidrosálpinx. [cite: 24]',
    ],
    sources: ['DOI: 10.1016/j.ejogrb.2020.01.012 [cite: 25]', 'DOI: 10.1016/S0015-0282(00)01723-9 [cite: 26]'],
  },

  // Interacción 10
  INT_TSH_ALTA_TPOAB_POSITIVOS: {
    explanation:
      'Las pacientes con hipotiroidismo clínico y tiroiditis autoinmune (TSH > 4.0 y TPOAb positivos) tienen reducción de ovulación espontánea, mayor riesgo de aborto (RR ~2.0) y trastornos de implantación. [cite: 27]',
    recommendations: [
      'Iniciar levotiroxina y mantener TSH < 2.5. [cite: 27]',
      'Recontrol cada 6–8 semanas. [cite: 27]',
      'Seguimiento endócrino-gestacional si se logra embarazo. [cite: 27]',
    ],
    sources: ['DOI: 10.1089/thy.2016.0457 [cite: 27]', 'DOI: 10.1136/bmj.d2616 [cite: 27]'],
  },

  // Interacción 11
  INT_AMH_FSH_EDAD_CRITICA: {
    explanation:
      'Esta tríada (AMH <0.5, FSH >12, Edad ≥40) indica reserva ovárica severamente comprometida con disfunción folicular central. Las tasas de recuperación de ovocitos euploides son <2%, y las tasas de nacidos vivos con óvulos propios en FIV son <5%. [cite: 28]',
    recommendations: [
      'Consejería sobre ovodonación como primera línea. [cite: 29]',
      'FIV solo si hay deseo explícito de intento con ovocitos propios (baja expectativa). [cite: 29]',
      'Considerar vitrificación embrionaria en caso de obtención exitosa. [cite: 29]',
    ],
    sources: ['DOI: 10.1093/humupd/dmt012 [cite: 30]', 'DOI: 10.1016/j.fertnstert.2023.02.002 [cite: 30]'],
  },

  // Interacción 12
  INT_OTB_EDAD_AVANZADA: {
    explanation:
      'Tras los 37 años, la reserva ovárica disminuye y el éxito de recanalización es muy bajo (<20% nacidos vivos). FIV ofrece mayor tasa de éxito, menor tiempo y evita riesgos quirúrgicos. [cite: 31]',
    recommendations: [
      'FIV directa con dosis personalizada. [cite: 32]',
      'Evitar recanalización excepto en casos excepcionales (edad <35 y trompas ≥5 cm remanente). [cite: 32]',
    ],
    sources: ['DOI: 10.1016/j.fertnstert.2021.08.022 [cite: 33]', 'DOI: 10.1016/j.fertnstert.2015.01.016 [cite: 34]'],
  },

  // Interacción 13
  INT_SOP_CICLOS_PRL_ALTAS: {
    explanation:
      'La hiperprolactinemia (Prolactina >50 ng/mL) agrava la anovulación del SOP e interfiere con receptividad endometrial. Puede ser signo de adenoma hipofisario funcional en este contexto. [cite: 35]',
    recommendations: [
      'Cabergolina para normalizar prolactina. [cite: 36]',
      'Letrozol post-normalización si ovulación no retorna. [cite: 36]',
      'RM hipófisis si prolactina >100 ng/mL o persistente tras tratamiento. [cite: 36]',
    ],
    sources: ['DOI: 10.1210/clinem/dgac389 [cite: 37]', 'PMID: 25006718 [cite: 38]'],
  },

  // Interacción 14
  INT_AMH_BAJA_TERATOZOOSPERMIA: {
    explanation:
      'La combinación de baja reserva ovárica (AMH <1.0) y teratozoospermia severa (<2% morfología normal) afecta la fertilización (tasas <40% en FIV convencional) y la calidad embrionaria, con alta tasa de ciclo cancelado. [cite: 39]',
    recommendations: [
      'FIV con ICSI desde el primer intento. [cite: 39]',
      'Test de fragmentación espermática si fallos previos. [cite: 39]',
      'Vitrificación embrionaria si se logra desarrollo adecuado. [cite: 39]',
    ],
    sources: ['DOI: 10.1093/humupd/dmp039 [cite: 39]', 'DOI: 10.1007/s10815-021-02260-9 [cite: 40]'],
  },

  // Interacción 15
  INT_ENDO_AVANZADA_EDAD_AMH_BAJA: {
    explanation:
      'Este perfil (Endometriosis III–IV, Edad >39, AMH <1.0) predice baja respuesta ovárica, inflamación pélvica crónica, riesgo de fallo tubario y edad materna límite. Tasa de nacidos vivos por intento espontáneo <2%, por FIV <10% sin vitrificación precoz. [cite: 41]',
    recommendations: [
      'FIV inmediata. [cite: 42]',
      'Transferencia diferida (con o sin agonista pre-TF). [cite: 42]',
      'Criopreservación si se obtiene embrión de buena calidad. [cite: 42]',
    ],
    sources: ['DOI: 10.1093/hropen/hoac009 [cite: 43]', 'DOI: 10.1016/j.fertnstert.2016.01.012 [cite: 44]'],
  },

  // Interacción 16
  INT_PERFIL_HIERESPONDEDOR_JOVEN_SOP_ESTABLE: {
    explanation:
      'Aunque el SOP puede causar anovulación, este fenotipo joven con alta reserva (AMH >4.5) y semen normal, y SOP metabólicamente estable (HOMA-IR <2.0, TSH óptimo), presenta un buen pronóstico con cambios de estilo de vida e inducción ovulatoria. [cite: 45]',
    recommendations: [
      'Letrozol 1ª línea con monitoreo seriado. [cite: 46]',
      'Inducción con éxito > 70 % en 3 ciclos. [cite: 46]',
      'No requiere FIV inicial salvo fracaso ovulatorio documentado. [cite: 46]',
    ],
    sources: ['PMID: 25006718 [cite: 46]', 'DOI: 10.1016/j.fertnstert.2023.07.025 [cite: 47]'],
  },

  // Interacción 17
  INT_ENDO_LEVE_AMH_NORMAL_JOVEN: {
    explanation:
      'Pacientes jóvenes (Edad <35) con endometriosis leve (I–II) y reserva ovárica normal (AMH >1.5) tienen buenas tasas de embarazo espontáneo y por FIV si se trata la enfermedad y se mantiene función ovárica. [cite: 48]',
    recommendations: [
      'Considerar laparoscopia si >12 meses sin embarazo. [cite: 49]',
      'Intento natural tras tratamiento hasta 6 meses antes de escalar. [cite: 49]',
      'FIV si deseo de embarazo rápido o falla postquirúrgica. [cite: 49]',
    ],
    sources: ['DOI: 10.1093/hropen/hoac009 [cite: 49]', 'DOI: 10.1002/14651858.CD009590.pub2 [cite: 50]'],
  },

  // Interacción 18
  INT_HSG_UNILATERAL_JOVEN_SEMEN_NORMAL: {
    explanation:
      'Una trompa permeable funcional, buen esperma y edad joven (<35) permite una tasa de embarazo espontáneo aceptable (~20% por año). FIV no es de primera línea. [cite: 51]',
    recommendations: [
      'Observación expectante o hasta 3 ciclos con letrozol + IAC. [cite: 51]',
      'FIV solo si >12–18 meses sin éxito. [cite: 51]',
      'Laparoscopia no obligatoria salvo sospecha de hidrosálpinx. [cite: 51]',
    ],
    sources: ['DOI: 10.1016/j.fertnstert.2020.12.010 [cite: 51]', 'PMID: 32805143 [cite: 51]'],
  },

  // Interacción 19
  INT_POLIPO_PEQUENO_JOVEN_FAVORABLE: {
    explanation:
      'Pólipos endometriales pequeños (<1 cm) tienen bajo impacto aislado. Su resección mejora la tasa de implantación (~18%) incluso en mujeres sin FIV. [cite: 52]',
    recommendations: [
      'Histeroscopía ambulatoria. [cite: 54]',
      'Intento natural o IAC tras resección por 6 meses. [cite: 54]',
      'No se recomienda FIV como primera línea. [cite: 54]',
    ],
    sources: ['DOI: 10.1186/s12958-016-0213-7 [cite: 54]', 'DOI: 10.1016/j.fertnstert.2004.08.046 [cite: 55]'],
  },

  // Interacción 20
  INT_EDAD_AMH_SOP_HOMA_TSH_OPTIMO: {
    explanation:
      'Pacientes jóvenes (Edad <30) con SOP y sin Resistencia a la Insulina (HOMA-IR <2.0) ni disfunción tiroidea (TSH óptimo) tienen alta tasa de ovulación inducida y elevada respuesta a FIV (≥15 ovocitos promedio), con buena tasa de embarazo por intento. [cite: 56]',
    recommendations: [
      'Letrozol o FIV con protocolo suave si respuesta excesiva. [cite: 56]',
      'Monitoreo cercano para evitar OHSS. [cite: 56]',
      'Buen pronóstico general con tasas de éxito acumuladas >60%. [cite: 56]',
    ],
    sources: ['DOI: 10.1093/humupd/dmt062 [cite: 57]', 'DOI: 10.3389/fendo.2020.00544 [cite: 57]'],
  },

  // ===================================================================
  // DECISIÓN ESTRATÉGICA: ¿Cuándo ir directo a Alta Complejidad?
  // Basado en "REGLAS DE INTERACCION NO LINEAL.docx - Decisión Estratégica" [cite: 59]
  // ===================================================================

  DECISION_FIV_EDAD_AMH_CRITICO: {
    explanation: 'Tu perfil (Edad ≥ 40 años + AMH < 1.0) tiene una probabilidad de embarazo <5 % por ciclo y un alto riesgo de fallo de estimulación. [cite: 60]',
    recommendations: [
      'FIV directa como primera opción.',
      'Considerar ovodonación.',
    ],
    sources: ['DOI: 10.1016/j.fertnstert.2023.07.025 [cite: 60]'],
  },
  DECISION_FIV_ENDO_AVANZADA_SEMINAL: {
    explanation: 'La combinación de Endometriosis avanzada (III-IV) y espermatograma alterado justifica una FIV directa por el daño tubo-ovárico y la fecundación deficiente. [cite: 60]',
    recommendations: [
      'FIV-ICSI directa.',
      'Evaluar criopreservación ovocitaria si hay endometrioma >4cm.',
    ],
    sources: ['DOI: 10.1093/hropen/hoac009 [cite: 7]'],
  },
  DECISION_FIV_SOP_METABOLICO_CRITICO: {
    explanation: 'SOP con HOMA ≥ 4.0 + ciclos > 60 días + prolactina > 50 ng/mL indica un fallo de respuesta a inducción oral. [cite: 60]',
    recommendations: [
      'Priorizar manejo metabólico (pérdida de peso, metformina).',
      'FIV directa con protocolos adaptados.',
    ],
    sources: ['DOI: 10.1016/j.fertnstert.2023.07.025 [cite: 4]'],
  },
  DECISION_FIV_OTB_BILATERAL: {
    explanation: 'La obstrucción tubaria bilateral o la ligadura tubaria (OTB) impiden el paso de ovocitos, haciendo que la FIV sea la única vía reproductiva. [cite: 60]',
    recommendations: [
      'FIV directa.',
      'Considerar salpingectomía previa si hay hidrosálpinx.',
    ],
    sources: ['DOI: 10.1016/j.fertnstert.2020.12.010 [cite: 10]'],
  },
  DECISION_FIV_FALLO_INDUCCION: {
    explanation: 'El fallo de 3 ciclos de inducción ovulatoria bien realizados requiere una escalada terapéutica a FIV. [cite: 60]',
    recommendations: [
      'FIV como siguiente paso.',
      'Reevaluar todos los factores antes de iniciar FIV.',
    ],
    sources: ['DOI: 10.1016/j.fertnstert.2023.07.025 [cite: 4]'],
  },

  // ===================================================================
  // CLASIFICACIÓN TERAPÉUTICA POR NIVEL (Basado en "REGLAS DE INTERACCION NO LINEAL.docx") [cite: 61]
  // ===================================================================

  TRAT_BAJA_COMPLEJIDAD_CRITERIOS: {
    explanation: 'Eres candidata para tratamientos de baja complejidad como observación dirigida, inducción con letrozol, o relaciones programadas. [cite: 61]',
    recommendations: [
      'Edad < 35 años[cite: 61].',
      'AMH ≥ 1.0 ng/mL[cite: 61].',
      'Ciclos regulares o anovulación corregible (ej. SOP sin IR)[cite: 61].',
      'Espermatograma normal (OMS 2021)[cite: 61].',
      'Sin obstrucción tubaria o con unilateral sin hidrosálpinx[cite: 61].',
      'Duración de infertilidad < 2 años[cite: 61].',
      'TSH y prolactina normales[cite: 61].',
    ],
    sources: ['DOI: 10.1016/j.fertnstert.2020.12.010 [cite: 51]', 'PMID: 32805143 [cite: 51]'], // Fuentes de Interacción 18
  },
  TRAT_BAJA_COMPLEJIDAD_EJEMPLO: {
    explanation: 'Ejemplo: Mujer de 29 años, SOP leve, AMH 3.5, espermograma normal, HSG normal. Se recomienda Letrozol + relaciones programadas por 3–6 ciclos. [cite: 61]',
    recommendations: [],
  },
  TRAT_BAJA_COMPLEJIDAD_ESCALAR: {
    explanation: 'Si no hay éxito con tratamientos de baja complejidad, es momento de considerar escalar. [cite: 61]',
    recommendations: [
      'Escalar a IAC o FIV si falla tras 3-6 ciclos con monitoreo[cite: 61].',
      'Escalar si edad ≥ 35[cite: 61].',
      'Escalar si hay alteración leve en espermatograma[cite: 61].',
    ],
  },
  TRAT_IAC_INDICACIONES: {
    explanation: 'La Inseminación Intrauterina (IAC) está indicada en casos donde existe ovulación o anovulación controlable, pero hay necesidad de optimizar la fecundación. [cite: 62]',
    recommendations: [
      'Anovulación corregible + espermograma limítrofe (motilidad 30–40%, concentración 10–15 M/mL)[cite: 63].',
      'Obstrucción unilateral con trompa permeable comprobada[cite: 63].',
      'Endometriosis mínima (I–II) + edad < 35 + AMH > 1.5[cite: 63].',
      'Infertilidad inexplicable (todos los estudios normales)[cite: 63].',
      'Duración de infertilidad ≥ 2 años sin otro factor severo[cite: 63].',
    ],
    sources: ['DOI: 10.1016/j.fertnstert.2020.12.010 [cite: 51]', 'PMID: 32805143 [cite: 51]'], // Fuentes de Interacción 18
  },
  TRAT_IAC_CONTRAINDICACIONES: {
    explanation: 'La IAC NO está recomendada si: [cite: 64]',
    recommendations: [
      'Obstrucción tubaria bilateral[cite: 64].',
      'Motilidad < 30 % o morfología < 2 %[cite: 64].',
      'AMH < 1.0 o edad > 38[cite: 64].',
      'Adenomiosis difusa no tratada[cite: 64].',
      'Falla de ≥ 3 ciclos previos de IAC[cite: 64].',
    ],
  },
  TRAT_FIV_INDICACIONES_ABSOLUTAS: {
    explanation: 'La Fertilización In Vitro (FIV) es el tratamiento de elección o absoluto en tu caso debido a: [cite: 65]',
    recommendations: [
      'Obstrucción tubaria bilateral / OTB (sin paso ovocitario)[cite: 66].',
      'Azoospermia o alteraciones múltiples severas (requiere ICSI)[cite: 66].',
      'AMH < 1.0 ng/mL + edad > 35 (respuesta pobre esperada)[cite: 66].',
      'Endometriosis III–IV + edad > 35 (impacto anatómico e inflamatorio)[cite: 66].',
      'Falla de 3 ciclos de inducción/IAC (tiempo y reservas limitadas)[cite: 66].',
      'Adenomiosis difusa no controlada (reducción de implantación espontánea)[cite: 66].',
    ],
    sources: ['ASRM TFI Guidelines 2021 [cite: 66]', 'DOI: 10.1093/hropen/hoac009 [cite: 7]'], // Fuentes de DFCA
  },
  TRAT_FIV_INDICACIONES_RELATIVAS: {
    explanation: 'La FIV es una indicación relativa o estratégica en tu caso, que ofrece las mejores probabilidades: [cite: 67]',
    recommendations: [
      'AMH 1.0–1.5 + edad > 37 (FIV temprana recomendada)[cite: 68].',
      'SOP con IR ≥ 3.5 + fallo con letrozol (escalar a FIV con antagonista)[cite: 68].',
      'Deseo de preservación de fertilidad (≥35 años) (FIV con vitrificación ovocitaria)[cite: 68].',
      'TPOAb positivo + TSH > 4.0 + abortos (FIV + control endocrino intensivo)[cite: 68].',
    ],
    sources: ['ASRM Practice Committee: Obesity and Reproduction 2021 [cite: 91]'], // Fuente genérica, se especificarán más
  },
  TRAT_ICSI_RECOMENDADO: {
    explanation: 'ICSI (Inyección Intracitoplasmática de Espermatozoides) es recomendado durante la FIV si: [cite: 69]',
    recommendations: [
      'Morfología < 2 %[cite: 69].',
      'Motilidad progresiva < 20 %[cite: 69].',
      'Ciclos FIV previos con fertilización < 30 %[cite: 69].',
      'Test de fragmentación espermática elevado[cite: 69].',
    ],
    sources: ['DOI: 10.1093/humupd/dmp039 [cite: 39]', 'DOI: 10.1007/s10815-021-02260-9 [cite: 40]'],
  },
  TRAT_OVODONACION: {
    explanation: 'La ovodonación puede ser la opción más adecuada si: [cite: 69]',
    recommendations: [
      'Edad ≥ 43 con AMH < 0.5[cite: 69].',
      'FSH > 15 + ciclos fallidos[cite: 69].',
      'Falla ovárica precoz[cite: 69].',
      'Falla repetida de implantación o embriogénesis[cite: 69].',
    ],
    sources: ['DOI: 10.1093/humupd/dmt012 [cite: 30]', 'DOI: 10.1016/j.fertnstert.2023.02.002 [cite: 30]'],
  },
  TRAT_ESTUDIO_ADICIONAL: {
    explanation: 'Tu caso tiene múltiples factores o no presenta una causa clara. Se recomienda una consulta especializada para definir el mejor plan.',
    recommendations: ['Consulta con un especialista en reproducción asistida para una evaluación completa.'],
    sources: ['Recomendación General'],
  },
};