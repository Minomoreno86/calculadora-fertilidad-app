interface ClinicalInfo {
  explanation: string;
  recommendations: string[];
}

export const clinicalContentLibrary: Record<string, ClinicalInfo> = {
  IMC_ALTO: {
    explanation: "El índice de masa corporal (IMC) en rango de sobrepeso/obesidad (IMC > 25) está asociado a una menor tasa de embarazo al afectar la ovulación y la calidad endometrial.",
    recommendations: [
      "Optimiza tu peso hacia un IMC entre 20 y 24.9 antes de intentar embarazo.",
      "Consulta con un nutricionista especializado en fertilidad para ajustar tu alimentación.",
      "La pérdida del 5-10% del peso corporal puede restaurar la ovulación."
    ],
  },
  IMC_BAJO: {
    explanation: "El bajo peso (IMC < 18.5) puede afectar la regularidad de la ovulación y el soporte hormonal necesario para el embarazo.",
    recommendations: [
      "Busca alcanzar un IMC saludable (entre 20 y 24.9) con supervisión profesional.",
      "Consulta con un nutricionista para asegurar un aporte calórico y de nutrientes adecuado."
    ],
  },
  AMH_BAJA: {
    explanation: "La hormona antimülleriana (AMH) es un marcador clave de la reserva ovárica. Valores bajos (<1.0 ng/mL) indican una menor cantidad de óvulos disponibles, lo que reduce la probabilidad de embarazo, especialmente con la edad avanzada.",
    recommendations: [
      "Consulta cuanto antes con un especialista en fertilidad; el tiempo es un factor crítico.",
      "Considera tratamientos como estimulación ovárica temprana o FIV si hay otros factores asociados.",
      "No postergues decisiones reproductivas; opciones como la vitrificación pueden ser consideradas."
    ],
  },
  ENDOMETRIOSIS: {
    explanation: "La endometriosis es una condición inflamatoria donde el tejido endometrial crece fuera del útero. Puede afectar la fertilidad por distorsión anatómica, inflamación pélvica crónica o alteración de la calidad ovocitaria.",
    recommendations: [
      "Si tienes dolor menstrual severo, considera una evaluación laparoscópica.",
      "El tratamiento depende del grado (I a IV); en grados severos puede ser necesario FIV.",
      "Consulta con un equipo multidisciplinario que incluya cirugía y reproducción asistida."
    ],
  },
  MIOMAS: {
    explanation: "Los miomas submucosos y los intramurales de gran tamaño (>4 cm) pueden reducir las tasas de implantación y aumentar el riesgo de pérdida gestacional al alterar la cavidad uterina o su vascularización.",
    recommendations: [
      "Solicita una histeroscopía o una RMN para evaluar la ubicación y tamaño.",
      "Considera miomectomía si el mioma afecta la cavidad o es sintomático.",
      "Retrasa la búsqueda de embarazo hasta después del tratamiento si el mioma es submucoso."
    ],
  },
  POLIPOS: {
    explanation: "Los pólipos son crecimientos benignos en el endometrio que pueden interferir con la implantación del embrión. Su presencia reduce las tasas de embarazo espontáneo y por FIV.",
    recommendations: [
      "Realiza una histerosonografía o histeroscopía diagnóstica para confirmar.",
      "La polipectomía histeroscópica mejora significativamente las tasas de implantación.",
      "Evita iniciar tratamientos de fertilidad hasta resolver este hallazgo."
    ],
  },
  ADENOMIOSIS: {
    explanation: "La adenomiosis es la presencia de tejido endometrial dentro del miometrio. Puede generar inflamación uterina crónica y dificultar la implantación y desarrollo embrionario.",
    recommendations: [
      "Solicita una resonancia magnética si se sospecha por ecografía.",
      "Considera tratamientos médicos (dienogest, agonistas GnRH) antes de intentar FIV.",
      "La planificación del embarazo debe hacerse con vigilancia estrecha y estrategias personalizadas."
    ],
  },
  FACTOR_MASCULINO: {
    explanation: "Alteraciones en la concentración, movilidad o morfología espermática pueden reducir significativamente la probabilidad de fecundación natural. Es un factor presente en hasta el 40% de los casos de infertilidad.",
    recommendations: [
      "Solicita un espermatograma con criterios OMS 2021 y estudios hormonales si es anormal.",
      "Consulta con un andrólogo especializado para descartar varicocele u otras causas tratables.",
      "En casos severos, puede ser necesaria una FIV con ICSI."
    ],
  },
  PRL_ALTA: {
    explanation: "Niveles elevados de prolactina inhiben la ovulación al alterar la secreción hormonal. Puede deberse a estrés, medicamentos o adenomas hipofisarios. Es una causa reversible de infertilidad.",
    recommendations: [
      "Solicita una resonancia de hipófisis si los niveles están persistentemente >40 ng/mL.",
      "El tratamiento con agonistas dopaminérgicos (cabergolina) suele restaurar la fertilidad.",
      "Evita tratamientos hormonales antes de corregir la hiperprolactinemia."
    ],
  },
  CICLO_IRREGULAR: {
    explanation: "Los ciclos menstruales irregulares reflejan una alteración en la ovulación. Son comunes en trastornos hormonales como el SOP o disfunción tiroidea, y reducen la probabilidad de concebir.",
    recommendations: [
      "Monitorea tus ciclos y registra su duración para facilitar el diagnóstico.",
      "Solicita un perfil hormonal completo (FSH, LH, prolactina, TSH, AMH).",
      "Consulta con un especialista si tus ciclos son mayores de 35 días o muy variables."
    ],
  },
  TSH_ALTA: {
    explanation: "Un nivel de TSH superior a 2.5 µIU/mL, incluso dentro del rango normal general, puede afectar la ovulación, la calidad ovocitaria y la implantación.",
    recommendations: [
      "Optimiza tu TSH por debajo de 2.5 µIU/mL con levotiroxina si es necesario.",
      "Monitorea también los niveles de T4 libre y anticuerpos antitiroideos.",
      "Consulta con un endocrinólogo especializado en fertilidad."
    ],
  },
  HOMA_ALTO: {
    explanation: "El índice HOMA-IR > 2.5 sugiere resistencia a la insulina, la cual puede afectar negativamente la ovulación y el ambiente endometrial, y se asocia a menor tasa de implantación.",
    recommendations: [
      "Adopta una dieta baja en carbohidratos de alto índice glucémico.",
      "Incluye ejercicio aeróbico y de fuerza 3–5 veces por semana.",
      "Consulta si puedes beneficiarte de metformina u otros sensibilizantes a la insulina."
    ],
  },
  OBSTRUCCION_TUBARICA: {
    explanation: "La obstrucción de una o ambas trompas de Falopio impide el encuentro entre óvulo y espermatozoide. Es una causa frecuente de infertilidad.",
    recommendations: [
      "Solicita una histerosalpingografía (HSG) para diagnóstico.",
      "Si hay obstrucción bilateral, la FIV es el tratamiento de elección.",
      "La cirugía correctiva puede considerarse si la obstrucción es unilateral y la edad lo permite."
    ],
  },
  DURACION_INFERTILIDAD: {
    explanation: "A medida que aumenta la duración de la infertilidad, disminuye la probabilidad de embarazo espontáneo. Después de 2 años se considera infertilidad persistente.",
    recommendations: [
      "No postergues la evaluación completa si llevas más de 12 meses intentando.",
      "Con 3 o más años de infertilidad, el tratamiento activo debe considerarse con mayor urgencia."
    ],
  },
  CIRUGIA_PELVICA: {
    explanation: "Las cirugías pélvicas previas pueden causar adherencias que afectan la función tubárica o la movilidad ovárica, dificultando la fecundación.",
    recommendations: [
      "Solicita estudios de imagen si tienes antecedentes quirúrgicos importantes.",
      "Valora una laparoscopía diagnóstica si hay sospecha de adherencias extensas."
    ],
  },
};