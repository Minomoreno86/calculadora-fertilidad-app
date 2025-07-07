/**
 * Este archivo centraliza todos los textos de recomendaciones e insights clínicos,
 * replicando la estructura de 'textos_clinicos.py'.
 */

export const RECOMENDACIONES: Record<string, string> = {
  EDAD_35: "Edad >35a: No demorar la consulta especializada si no hay embarazo en 6 meses.",
  EDAD_38: "Edad >38a: A partir de los 38, el tiempo es un factor crítico. Considerar opciones de tratamiento.",
  EDAD_40: "Edad >40a: Valorar opciones de reproducción asistida como vía principal.",
  EDAD_43: "Edad >43a: La probabilidad de concepción espontánea es extremadamente baja. Se recomienda consultar directamente opciones como la ovodonación.",
  CICLO_IRREGULAR: "Los ciclos irregulares pueden ser un signo de problemas de ovulación y requieren un estudio hormonal para determinar la causa.",
  IMC_BAJO: "IMC: Optimizar nutrición para alcanzar un peso saludable y regularizar la ovulación.",
  IMC_ALTO: "IMC: Iniciar plan de dieta y ejercicio. Una pérdida del 5% del peso puede mejorar significativamente la fertilidad.",
  SOP: "SOP: Consultar sobre inducción de la ovulación (ej. Letrozol) como tratamiento de primera línea.",
  ENDO_LEVE: "Endometriosis Grado I-II: Puede intentarse concepción espontánea/dirigida, valorar tratamiento si no hay éxito.",
  ENDO_SEVERA: "Endometriosis Grado III-IV: Se recomienda valoración directa para FIV, ya que el pronóstico espontáneo es bajo.",
  MIOMA_SUBMUCOSO: "Mioma Submucoso: Se recomienda resección por histeroscopia para mejorar la implantación.",
  MIOMA_INTRAMURAL: "Mioma Intramural Significativo: Discutir con su médico la opción de miomectomía según el caso.",
  MIOMA_SUBSEROSO: "Mioma Subseroso Grande: Generalmente no afecta la fertilidad a menos que sea de un tamaño extremo.",
  ADENO_FOCAL: "Adenomiosis Focal: Valorar tratamiento médico para controlar síntomas y mejorar receptividad.",
  ADENO_DIFUSA: "Adenomiosis Difusa: Se recomienda valoración para FIV, ya que la fertilidad espontánea está muy reducida.",
  POLIPO: "Pólipo Endometrial: Se recomienda resección por histeroscopia (polipectomía) para optimizar la cavidad endometrial.",
  HSG_UNILATERAL: "HSG - Obstrucción Unilateral: Considerar seguimiento folicular para dirigir relaciones al lado permeable.",
  HSG_BILATERAL: "HSG - Obstrucción Bilateral: La concepción espontánea no es viable. Se requiere FIV.",
  HSG_DEFECTO: "HSG - Defecto Uterino: Se requiere histeroscopia para diagnóstico y tratamiento.",
  AMH_BAJA: "AMH - Reserva ovárica disminuida: No demorar consulta y tratamiento con especialista.",
  PRL_ALTA: "Prolactina Elevada: Requiere tratamiento con agonistas dopaminérgicos (ej. Cabergolina) y estudio por endocrinólogo.",
  TSH_ALTA: "TSH no óptima para fertilidad (<2.5): Se recomienda tratamiento de sustitución y control por endocrinólogo.",
  TPO_POSITIVO: "TPO-Ab Positivo: Autoinmunidad tiroidea presente. Requiere seguimiento estricto durante el embarazo por riesgo de aborto.",
  HOMA_ALTO: "HOMA - Resistencia a la insulina: Priorizar cambios en estilo de vida y valorar uso de metformina.",
  FACTOR_MASCULINO: "Factor Masculino: Hallazgos alterados en espermatograma. Se recomienda consulta con Andrólogo/Urólogo."
};

// Podríamos añadir aquí el diccionario de CLINICAL_INSIGHTS si fuera necesario.
// Por ahora, nos centramos en las recomendaciones principales.