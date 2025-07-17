import type { AutoimmuneDisease } from '../types/autoimmune';

// Base de datos de 15 enfermedades autoinmunes con mayor impacto en fertilidad
export const AUTOIMMUNE_DISEASES: AutoimmuneDisease[] = [
  {
    id: 'sle',
    name: 'Lupus Eritematoso Sistémico',
    category: 'systemic',
    fertilityImpact: 'high',
    affectedOrgans: ['reproductive', 'renal', 'vascular', 'hematological'],
    prevalenceInWomen: 90,
    typicalOnsetAge: 25,
    description: 'Enfermedad autoinmune sistémica que puede afectar múltiples órganos. Impacto significativo en fertilidad debido a compromiso renal, vascular y hematológico.'
  },
  {
    id: 'ra',
    name: 'Artritis Reumatoide',
    category: 'systemic',
    fertilityImpact: 'moderate',
    affectedOrgans: ['vascular', 'pulmonary'],
    prevalenceInWomen: 75,
    typicalOnsetAge: 30,
    description: 'Artritis inflamatoria crónica. Medicamentos como MTX pueden afectar fertilidad. Mejora frecuente durante embarazo.'
  },
  {
    id: 'aps',
    name: 'Síndrome Antifosfolípido',
    category: 'hematological',
    fertilityImpact: 'severe',
    affectedOrgans: ['reproductive', 'vascular', 'hematological'],
    prevalenceInWomen: 85,
    typicalOnsetAge: 28,
    description: 'Trastorno autoinmune protrombótico. Alto riesgo de pérdida gestacional recurrente y complicaciones obstétricas.'
  },
  {
    id: 'hashimoto',
    name: 'Tiroiditis de Hashimoto',
    category: 'endocrine',
    fertilityImpact: 'moderate',
    affectedOrgans: ['endocrine', 'reproductive'],
    prevalenceInWomen: 85,
    typicalOnsetAge: 35,
    description: 'Causa más común de hipotiroidismo. Puede causar disfunción ovulatoria y aumentar riesgo de aborto.'
  },
  {
    id: 'graves',
    name: 'Enfermedad de Graves',
    category: 'endocrine',
    fertilityImpact: 'moderate',
    affectedOrgans: ['endocrine', 'reproductive', 'cardiac'],
    prevalenceInWomen: 80,
    typicalOnsetAge: 30,
    description: 'Hipertiroidismo autoinmune. Puede causar irregularidades menstruales y complicaciones durante embarazo.'
  },
  {
    id: 'dm1',
    name: 'Diabetes Mellitus Tipo 1',
    category: 'endocrine',
    fertilityImpact: 'high',
    affectedOrgans: ['endocrine', 'vascular', 'renal'],
    prevalenceInWomen: 50,
    typicalOnsetAge: 20,
    description: 'Diabetes autoinmune. Requiere control glucémico estricto preconcepcional para reducir malformaciones.'
  },
  {
    id: 'ssc',
    name: 'Esclerosis Sistémica',
    category: 'systemic',
    fertilityImpact: 'high',
    affectedOrgans: ['reproductive', 'vascular', 'pulmonary', 'renal'],
    prevalenceInWomen: 85,
    typicalOnsetAge: 35,
    description: 'Enfermedad del tejido conectivo. Riesgo de crisis renal y complicaciones pulmonares durante embarazo.'
  },
  {
    id: 'sjögren',
    name: 'Síndrome de Sjögren',
    category: 'systemic',
    fertilityImpact: 'moderate',
    affectedOrgans: ['reproductive', 'hepatic'],
    prevalenceInWomen: 95,
    typicalOnsetAge: 40,
    description: 'Síndrome autoinmune que afecta glándulas exocrinas. Riesgo de bloqueo cardíaco congénito.'
  },
  {
    id: 'crohn',
    name: 'Enfermedad de Crohn',
    category: 'gastrointestinal',
    fertilityImpact: 'moderate',
    affectedOrgans: ['gastrointestinal', 'hepatic'],
    prevalenceInWomen: 60,
    typicalOnsetAge: 25,
    description: 'Enfermedad inflamatoria intestinal. Puede afectar absorción de nutrientes y requerir ajuste de medicación.'
  },
  {
    id: 'uc',
    name: 'Colitis Ulcerosa',
    category: 'gastrointestinal',
    fertilityImpact: 'low',
    affectedOrgans: ['gastrointestinal'],
    prevalenceInWomen: 55,
    typicalOnsetAge: 28,
    description: 'Enfermedad inflamatoria intestinal. Menor impacto en fertilidad que Crohn, pero requiere monitoreo.'
  },
  {
    id: 'celiac',
    name: 'Enfermedad Celíaca',
    category: 'gastrointestinal',
    fertilityImpact: 'moderate',
    affectedOrgans: ['gastrointestinal', 'endocrine'],
    prevalenceInWomen: 75,
    typicalOnsetAge: 30,
    description: 'Enteropatía autoinmune. Malabsorción puede causar deficiencias nutricionales que afectan fertilidad.'
  },
  {
    id: 'ms',
    name: 'Esclerosis Múltiple',
    category: 'neurological',
    fertilityImpact: 'moderate',
    affectedOrgans: ['neurological'],
    prevalenceInWomen: 75,
    typicalOnsetAge: 28,
    description: 'Enfermedad desmielinizante. Mejora durante embarazo, pero riesgo de recaída postparto.'
  },
  {
    id: 'mg',
    name: 'Miastenia Gravis',
    category: 'neurological',
    fertilityImpact: 'moderate',
    affectedOrgans: ['neurological', 'pulmonary'],
    prevalenceInWomen: 65,
    typicalOnsetAge: 25,
    description: 'Trastorno neuromuscular autoinmune. Riesgo de crisis miasténica durante embarazo y parto.'
  },
  {
    id: 'addison',
    name: 'Enfermedad de Addison',
    category: 'endocrine',
    fertilityImpact: 'high',
    affectedOrgans: ['endocrine', 'reproductive'],
    prevalenceInWomen: 60,
    typicalOnsetAge: 30,
    description: 'Insuficiencia suprarrenal autoinmune. Requiere ajuste de corticoides durante embarazo.'
  },
  {
    id: 'itp',
    name: 'Púrpura Trombocitopénica Inmune',
    category: 'hematological',
    fertilityImpact: 'moderate',
    affectedOrgans: ['hematological'],
    prevalenceInWomen: 70,
    typicalOnsetAge: 25,
    description: 'Trombocitopenia autoinmune. Riesgo de hemorragia durante parto, requiere manejo especializado.'
  }
];

// Función para buscar enfermedades por criterios
export const findDiseasesByCategory = (category: string) => {
  return AUTOIMMUNE_DISEASES.filter(disease => disease.category === category);
};

export const findDiseasesByFertilityImpact = (impact: string) => {
  return AUTOIMMUNE_DISEASES.filter(disease => disease.fertilityImpact === impact);
};

export const findDiseaseById = (id: string) => {
  return AUTOIMMUNE_DISEASES.find(disease => disease.id === id);
};

export const getHighRiskDiseases = () => {
  return AUTOIMMUNE_DISEASES.filter(disease => 
    disease.fertilityImpact === 'high' || disease.fertilityImpact === 'severe'
  );
};
