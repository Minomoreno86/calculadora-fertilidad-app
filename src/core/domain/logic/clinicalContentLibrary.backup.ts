interface ClinicalInfo {
  definition: string;
  justification: string;
  recommendations: string[];
}

export const clinicalContentLibrary: Record<string, ClinicalInfo> = {
  IMC_ALTO: {
    definition:
      'El índice de masa corporal (IMC) en rango de sobrepeso/obesidad (IMC > 25) está asociado a una menor tasa de embarazo al afectar la ovulación y la calidad endometrial.',
    justification: '',
    recommendations: [
      'Optimiza tu peso hacia un IMC entre 20 y 24.9 antes de intentar embarazo.',
      'Consulta con un nutricionista especializado en fertilidad para ajustar tu alimentación.',
      'La pérdida del 5-10% del peso corporal puede restaurar la ovulación.',
    ],
  },
  IMC_BAJO: {
    definition:
      'El bajo peso (IMC < 18.5) puede afectar la regularidad de la ovulación y el soporte hormonal necesario para el embarazo.',
    justification: '',
    recommendations: [
      'Busca alcanzar un IMC saludable (entre 20 y 24.9) con supervisión profesional.',
      'Consulta con un nutricionista para asegurar un aporte calórico y de nutrientes adecuado.',
    ],
  },
  AMH_BAJA: {
    definition:
      'La hormona antimülleriana (AMH) es un marcador clave de la reserva ovárica. Valores bajos (<1.0 ng/mL) indican una menor cantidad de óvulos disponibles, lo que reduce la probabilidad de embarazo, especialmente con la edad avanzada.',
    justification:
      'Los multiplicadores reflejan el potencial ovulatorio en tratamientos, y la correlación con tasa de embarazo acumulada. AMH <1.0 se asocia con peor respuesta ovárica y menos nacidos vivos.',
    recommendations: [
      'Consulta cuanto antes con un especialista en fertilidad; el tiempo es un factor crítico.',
      'Considera tratamientos como estimulación ovárica temprana o FIV si hay otros factores asociados.',
      'No postergues decisiones reproductivas; opciones como la vitrificación pueden ser consideradas.',
    ],
  },
  ENDOMETRIOSIS: {
    definition:
      'La endometriosis es una condición inflamatoria donde el tejido endometrial crece fuera del útero. Puede afectar la fertilidad por distorsión anatómica, inflamación pélvica crónica o alteración de la calidad ovocitaria. Su severidad se clasifica por la escala de la ASRM (I a IV).',
    justification:
      'La progresión en la clasificación ASRM se asocia con menor fertilidad espontánea. El modelo penaliza según el grado, ya que los estadios III–IV afectan la anatomía pélvica y calidad ovocitaria.',
    recommendations: [
      'Si tienes dolor menstrual severo, considera una evaluación laparoscópica.',
      'El tratamiento depende del grado (I a IV); en grados severos puede ser necesario FIV.',
      'Consulta con un equipo multidisciplinario que incluya cirugía y reproducción asistida.',
    ],
  },
  MIOMAS: {
    definition:
      'Los miomas uterinos afectan hasta el 25% de las mujeres en edad fértil. Solo ciertos tipos impactan la fertilidad, especialmente los submucosos y los intramurales que deforman la cavidad endometrial.',
    justification:
      'La distorsión de la cavidad endometrial reduce implantación. Se emplean multiplicadores más severos en submucosos, respaldados por estudios de histeroscopía y FIV.',
    recommendations: [
      'Solicita una histeroscopía o una RMN para evaluar la ubicación y tamaño.',
      'Considera miomectomía si el mioma afecta la cavidad o es sintomático.',
      'Retrasa la búsqueda de embarazo hasta después del tratamiento si el mioma es submucoso.',
    ],
  },
  POLIPOS: {
    definition:
      'Los pólipos endometriales son proliferaciones benignas del endometrio. Interfieren con la implantación, especialmente en tratamientos de reproducción asistida o en mujeres con sangrado intermenstrual.',
    justification:
      'Estudios de FIV muestran tasas significativamente mayores de embarazo tras polipectomía. También se ha reportado asociación con ambiente inflamatorio intrauterino.',
    recommendations: [
      'Realiza una histerosonografía o histeroscopía diagnóstica para confirmar.',
      'La polipectomía histeroscópica mejora significativamente las tasas de implantación.',
      'Evita iniciar tratamientos de fertilidad hasta resolver este hallazgo.',
    ],
  },
  SOP: {
    definition:
      'El SOP es la causa más común de anovulación crónica. Su impacto sobre la fertilidad depende de la presencia de ciclos regulares, obesidad, resistencia a la insulina y otros fenotipos asociados.',
    justification:
      'La presencia de anovulación y resistencia a insulina reduce la fecundabilidad mensual. Estudios longitudinales y ciclos de ovulación inducida respaldan la penalización. Fenotipos ovulatorios no se penalizan.',
    recommendations: [
      'Indicar cambios de estilo de vida si IMC >25 y HOMA-IR >2.5.',
      'Iniciar ovulación inducida si hay deseo de embarazo y anovulación.',
      'Fenotipos ovulatorios: observar 6 meses antes de tratamiento.',
    ],
  },
  ADENOMIOSIS: {
    definition:
      'La adenomiosis es la presencia de tejido endometrial dentro del miometrio. Puede generar inflamación uterina crónica y dificultar la implantación y desarrollo embrionario.',
    justification:
      'La penalización se basa en la disfunción metabólica, que afecta tanto la ovulación como la calidad endometrial. Estudios de metformina y cambios dietéticos han mostrado mejoría en tasas de embarazo, justificando esta penalización escalonada.',
    recommendations: [
      'Solicita una resonancia magnética si se sospecha por ecografía.',
      'Considera tratamientos médicos (dienogest, agonistas GnRH) antes de intentar FIV.',
      'La planificación del embarazo debe hacerse con vigilancia estrecha y estrategias personalizadas.',
    ],
  },
  FACTOR_MASCULINO: {
    definition:
      'Alteraciones en la concentración, movilidad o morfología espermática pueden reducir significativamente la probabilidad de fecundación natural. Es un factor presente en hasta el 40% de los casos de infertilidad.',
    justification:
      'No hay un "punto de corte fértil", pero valores bajo percentil 5 reducen significativamente la tasa de embarazo espontáneo. La interacción entre variables puede multiplicar el efecto negativo (e.g., concentración <10 M + morfología <2%).',
    recommendations: [
      'Solicita un espermatograma con criterios OMS 2021 y estudios hormonales si es anormal.',
      'Consulta con un andrólogo especializado para descartar varicocele u otras causas tratables.',
      'En casos severos, puede ser necesaria una FIV con ICSI.',
    ],
  },
  PRL_ALTA: {
    definition:
      'La prolactina elevada inhibe la secreción pulsátil de GnRH, bloqueando la ovulación y causando amenorrea o luteinización incompleta. Su causa más frecuente es funcional, aunque debe descartarse prolactinoma.',
    justification:
      'La penalización se basa en la relación dosis-efecto entre PRL elevada y anovulación. Estudios muestran restauración de ovulación en >80% con cabergolina o bromocriptina cuando PRL >50.',
    recommendations: [
      'Solicita una resonancia de hipófisis si los niveles están persistentemente >40 ng/mL.',
      'El tratamiento con agonistas dopaminérgicos (cabergolina) suele restaurar la fertilidad.',
      'Evita tratamientos hormonales antes de corregir la hiperprolactinemia.',
    ],
  },
  CICLO_IRREGULAR: {
    definition:
      'El ciclo menstrual regular es un marcador indirecto de ovulación. Alteraciones en la duración reflejan disfunciones ovulatorias o luteales que afectan la fecundabilidad. La ovulación óptima ocurre en ciclos de 26–32 días.',
    justification:
      'La fecundabilidad cae en mujeres con ciclos fuera del rango 26–32 días. Los ciclos anovulatorios o con fase lútea corta reducen la ventana fértil o impiden implantación adecuada.',
    recommendations: [
      'Monitorea tus ciclos y registra su duración para facilitar el diagnóstico.',
      'Solicita un perfil hormonal completo (FSH, LH, prolactina, TSH, AMH).',
      'Consulta con un especialista si tus ciclos son mayores de 35 días o muy variables.',
    ],
  },
  TSH_ALTA: {
    definition:
      'La función tiroidea normal es esencial para la ovulación, la receptividad endometrial y el mantenimiento del embarazo. Alteraciones leves de TSH, incluso dentro del rango "normal", pueden afectar la fertilidad, especialmente en mujeres con anticuerpos antitiroideos.',
    justification:
      'La penalización refleja evidencia de que una TSH >2.5 mUI/L en mujeres que buscan embarazo (especialmente con TPO positivos) se asocia con menor tasa de ovulación, mayores pérdidas tempranas y menor tasa de implantación.',
    recommendations: [
      'Optimiza tu TSH por debajo de 2.5 µIU/mL con levotiroxina si es necesario.',
      'Monitorea también los niveles de T4 libre y anticuerpos antitiroideos.',
      'Consulta con un endocrinólogo especializado en fertilidad.',
    ],
  },
  HOMA_ALTO: {
    definition:
      'El índice HOMA-IR es una estimación indirecta de resistencia a la insulina. Se asocia con anovulación, alteración de la receptividad endometrial y mayor tasa de aborto, especialmente en mujeres con SOP.',
    justification:
      'La penalización se basa en la disfunción metabólica, que afecta tanto la ovulación como la calidad endometrial. Estudios de metformina y cambios dietéticos han mostrado mejoría en tasas de embarazo, justificando esta penalización escalonada.',
    recommendations: [
      'Adopta una dieta baja en carbohidratos de alto índice glucémico.',
      'Incluye ejercicio aeróbico y de fuerza 3–5 veces por semana.',
      'Consulta si puedes beneficiarte de metformina u otros sensibilizantes a la insulina.',
    ],
  },
  OBSTRUCCION_TUBARICA: {
    definition:
      'La obstrucción de una o ambas trompas de Falopio impide el encuentro entre óvulo y espermatozoide. Es una causa frecuente de infertilidad.',
    justification:
      'Aunque una trompa permeable permite concepción, la obstrucción unilateral reduce las oportunidades por ciclo y puede indicar enfermedad oculta. Modelos epidemiológicos muestran reducción de fecundabilidad mensual.',
    recommendations: [
      'Solicita una histerosalpingografía (HSG) para diagnóstico.',
      'Si hay obstrucción bilateral, la FIV es el tratamiento de elección.',
      'La cirugía correctiva puede considerarse si la obstrucción es unilateral y la edad lo permite.',
    ],
  },
  DURACION_INFERTILIDAD: {
    definition:
      'A medida que aumenta la duración de la infertilidad, disminuye la probabilidad de embarazo espontáneo. Después de 2 años se considera infertilidad persistente.',
    justification: '',
    recommendations: [
      'No postergues la evaluación completa si llevas más de 12 meses intentando.',
      'Con 3 o más años de infertilidad, el tratamiento activo debe considerarse con mayor urgencia.',
    ],
  },
  CIRUGIA_PELVICA: {
    definition:
      'Las cirugías pélvicas previas pueden causar adherencias que afectan la función tubárica o la movilidad ovárica, dificultando la fecundación.',
    justification: '',
    recommendations: [
      'Solicita estudios de imagen si tienes antecedentes quirúrgicos importantes.',
      'Valora una laparoscopía diagnóstica si hay sospecha de adherencias extensas.',
    ],
  },
  OTB_RECANALIZACION_EXITO: {
    definition:
      'La recanalización tubárica es una opción para restaurar la fertilidad en mujeres con ligadura de trompas previa, especialmente en casos seleccionados. Los criterios de éxito incluyen edad materna joven (<37 años), método de OTB mecánico (clips, anillos, ligaduras con poca resección), longitud tubárica remanente >4 cm, y ausencia de otros factores de infertilidad.',
    justification:
      'Es más costo-efectiva que la FIV si se desean múltiples embarazos.',
    recommendations: [
      'Considera la recanalización si cumples los criterios de edad y método de OTB.',
      'Evalúa la longitud tubárica remanente mediante HSG o laparoscopia.',
      'Asegúrate de que no existan otros factores de infertilidad significativos.',
      'Discute con tu especialista si la recanalización es la mejor opción para tus planes reproductivos.',
    ],
  },
  OTB_RECANALIZACION_BAJO_EXITO: {
    definition:
      'La recanalización tubárica tiene una baja probabilidad de éxito o está contraindicada en ciertos casos. Esto incluye edad materna ≥40 años, cauterización extensa o salpingectomía parcial previa, longitud tubárica remanente <3-4 cm, endometriosis moderada/severa, adherencias pélvicas extensas o alteración espermática significativa.',
    justification: '',
    recommendations: [
      'Si presentas estas condiciones, la FIV suele ser la opción más recomendada.',
      'Consulta con un especialista para evaluar alternativas y evitar procedimientos con baja tasa de éxito.',
    ],
  },
  OTB_RECANALIZACION_ESTUDIOS: {
    definition:
      'Antes de considerar la recanalización tubárica, es fundamental realizar una evaluación completa para determinar la viabilidad y el pronóstico. Los estudios clave incluyen histerosalpingografía (HSG) para evaluar la permeabilidad y longitud tubárica, ultrasonido transvaginal y AMH para valorar la reserva ovárica, espermatograma para descartar factor masculino, e historia quirúrgica detallada del tipo de OTB.',
    justification: '',
    recommendations: [
      'Realiza una HSG para evaluar el estado de tus trompas.',
      'Verifica tu reserva ovárica con AMH y ultrasonido.',
      'Asegúrate de que tu pareja masculina se realice un espermatograma.',
      'Proporciona toda la información posible sobre tu cirugía de ligadura de trompas.',
    ],
  }
};

// ===================================================================
// 🚀 FASE 2C: SISTEMA DE OPTIMIZACIÓN DE CONTENIDO CLÍNICO
// ===================================================================

// 💾 Cache inteligente para contenido clínico
interface ContentCache<T> {
  data: T;
  timestamp: number;
  accessCount: number;
}

class ClinicalContentCache {
  private readonly cache = new Map<string, ContentCache<unknown>>();
  private readonly CACHE_TTL = 10 * 60 * 1000; // 10 minutos
  private readonly MAX_CACHE_SIZE = 50;

  get<T>(key: string): T | null {
    const entry = this.cache.get(key) as ContentCache<T> | undefined;
    
    if (entry && (Date.now() - entry.timestamp) < this.CACHE_TTL) {
      entry.accessCount++;
      return entry.data;
    }
    
    return null;
  }

  set<T>(key: string, data: T): void {
    if (this.cache.size >= this.MAX_CACHE_SIZE) {
      this._cleanupCache();
    }
    
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      accessCount: 1
    });
  }

  private _cleanupCache(): void {
    const entries = Array.from(this.cache.entries());
    entries.sort((a, b) => a[1].accessCount - b[1].accessCount);
    
    const toRemove = Math.floor(entries.length * 0.3);
    for (let i = 0; i < toRemove; i++) {
      const entry = entries[i];
      if (entry) {
        this.cache.delete(entry[0]);
      }
    }
  }
}

// 🌟 Instancia global de cache
const contentCache = new ClinicalContentCache();

// 🚀 FASE 2C: Funciones de acceso optimizadas con lazy loading
export const getClinicalInfoOptimized = (key: keyof typeof clinicalContentLibrary): ClinicalInfo | null => {
  const cacheKey = `clinical_info_${key}`;
  
  // Intentar obtener del cache primero
  let info = contentCache.get<ClinicalInfo>(cacheKey);
  
  if (!info) {
    // Si no está en cache, obtener del objeto original y cachear
    info = clinicalContentLibrary[key] || null;
    if (info) {
      contentCache.set(cacheKey, info);
    }
  }
  
  return info;
};

// 🚀 FASE 2C: Batch loading para múltiples claves (optimización adicional)
export const getClinicalInfoBatch = (keys: (keyof typeof clinicalContentLibrary)[]): Record<string, ClinicalInfo | null> => {
  const result: Record<string, ClinicalInfo | null> = {};
  
  keys.forEach(key => {
    result[key] = getClinicalInfoOptimized(key);
  });
  
  return result;
};

// 🚀 FASE 2C: Preload de contenido más usado
export const preloadCommonContent = (): void => {
  const commonKeys: (keyof typeof clinicalContentLibrary)[] = [
    'IMC_ALTO', 'IMC_BAJO', 'SOP', 'FACTOR_MASCULINO'
  ];
  
  // Precargar en background
  setTimeout(() => {
    getClinicalInfoBatch(commonKeys);
  }, 100);
};
