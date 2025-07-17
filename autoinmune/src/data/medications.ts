import type { Medication } from '../types/autoimmune';

// Base de datos de medicamentos comunes en enfermedades autoinmunes
export const AUTOIMMUNE_MEDICATIONS: Medication[] = [
  {
    id: 'mtx',
    name: 'Metotrexato',
    genericName: 'methotrexate',
    category: 'dmard-conventional',
    pregnancyCategory: 'X',
    fertilityRisk: {
      ovarianReserve: 'moderate',
      menstrualCycle: 'mild',
      implantation: 'moderate',
      earlyPregnancy: 'severe'
    },
    teratogenicity: {
      level: 'major',
      affectedSystems: ['neural', 'cardiac', 'limb'],
      criticalPeriods: ['4-12 semanas'],
      description: 'Antagonista del ácido fólico, alto riesgo teratogénico'
    },
    washoutPeriod: 90,
    alternatives: ['SSZ', 'HCQ'],
    monitoringRequired: ['CBC', 'LFTs', 'folate']
  },
  {
    id: 'hcq',
    name: 'Hidroxicloroquina',
    genericName: 'hydroxychloroquine',
    category: 'dmard-conventional',
    pregnancyCategory: 'C',
    fertilityRisk: {
      ovarianReserve: 'none',
      menstrualCycle: 'none',
      implantation: 'none',
      earlyPregnancy: 'none'
    },
    teratogenicity: {
      level: 'none',
      affectedSystems: [],
      criticalPeriods: [],
      description: 'Seguro durante embarazo, se recomienda continuar'
    },
    washoutPeriod: 0,
    alternatives: [],
    monitoringRequired: ['ophthalmology', 'CBC']
  },
  {
    id: 'ssz',
    name: 'Sulfasalazina',
    genericName: 'sulfasalazine',
    category: 'dmard-conventional',
    pregnancyCategory: 'B',
    fertilityRisk: {
      ovarianReserve: 'none',
      menstrualCycle: 'none',
      implantation: 'none',
      earlyPregnancy: 'none'
    },
    teratogenicity: {
      level: 'low',
      affectedSystems: [],
      criticalPeriods: [],
      description: 'Generalmente seguro, suplementar folato'
    },
    washoutPeriod: 0,
    alternatives: ['HCQ'],
    monitoringRequired: ['CBC', 'LFTs', 'folate']
  },
  {
    id: 'aza',
    name: 'Azatioprina',
    genericName: 'azathioprine',
    category: 'immunosuppressant',
    pregnancyCategory: 'D',
    fertilityRisk: {
      ovarianReserve: 'mild',
      menstrualCycle: 'none',
      implantation: 'mild',
      earlyPregnancy: 'mild'
    },
    teratogenicity: {
      level: 'low',
      affectedSystems: ['immune'],
      criticalPeriods: ['primer trimestre'],
      description: 'Riesgo bajo, monitoreo cercano requerido'
    },
    washoutPeriod: 30,
    alternatives: ['HCQ', 'prednisolone'],
    monitoringRequired: ['CBC', 'LFTs', 'TPMT']
  },
  {
    id: 'mmf',
    name: 'Micofenolato Mofetil',
    genericName: 'mycophenolate mofetil',
    category: 'immunosuppressant',
    pregnancyCategory: 'D',
    fertilityRisk: {
      ovarianReserve: 'mild',
      menstrualCycle: 'none',
      implantation: 'moderate',
      earlyPregnancy: 'severe'
    },
    teratogenicity: {
      level: 'moderate',
      affectedSystems: ['facial', 'cardiac', 'limb'],
      criticalPeriods: ['6-10 semanas'],
      description: 'Riesgo moderado de malformaciones, discontinuar antes de concepción'
    },
    washoutPeriod: 42,
    alternatives: ['AZA', 'prednisolone'],
    monitoringRequired: ['CBC', 'pregnancy test']
  },
  {
    id: 'prednisolone',
    name: 'Prednisolona',
    genericName: 'prednisolone',
    category: 'corticosteroid',
    pregnancyCategory: 'B',
    fertilityRisk: {
      ovarianReserve: 'none',
      menstrualCycle: 'mild',
      implantation: 'none',
      earlyPregnancy: 'none'
    },
    teratogenicity: {
      level: 'low',
      affectedSystems: ['palatine'],
      criticalPeriods: ['primer trimestre'],
      description: 'Riesgo muy bajo, seguro durante embarazo'
    },
    washoutPeriod: 0,
    alternatives: [],
    monitoringRequired: ['glucose', 'blood pressure', 'bone density']
  },
  {
    id: 'adalimumab',
    name: 'Adalimumab',
    genericName: 'adalimumab',
    category: 'dmard-biologic',
    pregnancyCategory: 'B',
    fertilityRisk: {
      ovarianReserve: 'none',
      menstrualCycle: 'none',
      implantation: 'none',
      earlyPregnancy: 'none'
    },
    teratogenicity: {
      level: 'low',
      affectedSystems: ['immune'],
      criticalPeriods: ['segundo/tercer trimestre'],
      description: 'Seguro en primer trimestre, considerar discontinuar en segundo'
    },
    washoutPeriod: 0,
    alternatives: ['prednisolone', 'SSZ'],
    monitoringRequired: ['infections', 'CBC', 'tuberculosis screening']
  },
  {
    id: 'etanercept',
    name: 'Etanercept',
    genericName: 'etanercept',
    category: 'dmard-biologic',
    pregnancyCategory: 'B',
    fertilityRisk: {
      ovarianReserve: 'none',
      menstrualCycle: 'none',
      implantation: 'none',
      earlyPregnancy: 'none'
    },
    teratogenicity: {
      level: 'low',
      affectedSystems: ['immune'],
      criticalPeriods: ['segundo/tercer trimestre'],
      description: 'Similar a adalimumab, vida media más corta'
    },
    washoutPeriod: 0,
    alternatives: ['prednisolone', 'SSZ'],
    monitoringRequired: ['infections', 'CBC', 'tuberculosis screening']
  },
  {
    id: 'rituximab',
    name: 'Rituximab',
    genericName: 'rituximab',
    category: 'dmard-biologic',
    pregnancyCategory: 'C',
    fertilityRisk: {
      ovarianReserve: 'mild',
      menstrualCycle: 'none',
      implantation: 'mild',
      earlyPregnancy: 'moderate'
    },
    teratogenicity: {
      level: 'moderate',
      affectedSystems: ['immune', 'hematological'],
      criticalPeriods: ['todo el embarazo'],
      description: 'Depleción de células B, riesgo de inmunodeficiencia neonatal'
    },
    washoutPeriod: 180,
    alternatives: ['prednisolone', 'AZA'],
    monitoringRequired: ['infections', 'immunoglobulins', 'hepatitis B']
  },
  {
    id: 'cyclophosphamide',
    name: 'Ciclofosfamida',
    genericName: 'cyclophosphamide',
    category: 'immunosuppressant',
    pregnancyCategory: 'D',
    fertilityRisk: {
      ovarianReserve: 'severe',
      menstrualCycle: 'severe',
      implantation: 'severe',
      earlyPregnancy: 'severe'
    },
    teratogenicity: {
      level: 'major',
      affectedSystems: ['limb', 'cardiac', 'urogenital'],
      criticalPeriods: ['todo el embarazo'],
      description: 'Alto riesgo de infertilidad permanente y teratogenicidad'
    },
    washoutPeriod: 90,
    alternatives: ['MMF', 'rituximab'],
    monitoringRequired: ['CBC', 'ovarian function', 'urine', 'fertility preservation']
  },
  {
    id: 'levothyroxine',
    name: 'Levotiroxina',
    genericName: 'levothyroxine',
    category: 'hormone',
    pregnancyCategory: 'A',
    fertilityRisk: {
      ovarianReserve: 'none',
      menstrualCycle: 'none',
      implantation: 'none',
      earlyPregnancy: 'none'
    },
    teratogenicity: {
      level: 'none',
      affectedSystems: [],
      criticalPeriods: [],
      description: 'Esencial durante embarazo, aumentar dosis 25-30%'
    },
    washoutPeriod: 0,
    alternatives: [],
    monitoringRequired: ['TSH', 'T4 libre']
  },
  {
    id: 'insulin',
    name: 'Insulina',
    genericName: 'insulin',
    category: 'hormone',
    pregnancyCategory: 'B',
    fertilityRisk: {
      ovarianReserve: 'none',
      menstrualCycle: 'none',
      implantation: 'none',
      earlyPregnancy: 'none'
    },
    teratogenicity: {
      level: 'none',
      affectedSystems: [],
      criticalPeriods: [],
      description: 'Seguro y necesario, preferir insulina humana'
    },
    washoutPeriod: 0,
    alternatives: [],
    monitoringRequired: ['glucose', 'HbA1c', 'ketones']
  }
];

// Funciones de utilidad
export const findMedicationById = (id: string) => {
  return AUTOIMMUNE_MEDICATIONS.find(med => med.id === id);
};

export const getMedicationsByCategory = (category: string) => {
  return AUTOIMMUNE_MEDICATIONS.filter(med => med.category === category);
};

export const getTeratogenicMedications = () => {
  return AUTOIMMUNE_MEDICATIONS.filter(med => 
    med.teratogenicity.level === 'moderate' || 
    med.teratogenicity.level === 'major'
  );
};

export const getSafeMedicationsDuringPregnancy = () => {
  return AUTOIMMUNE_MEDICATIONS.filter(med => 
    med.pregnancyCategory === 'A' || 
    med.pregnancyCategory === 'B' ||
    (med.pregnancyCategory === 'C' && med.teratogenicity.level === 'none')
  );
};

export const getMedicationsRequiringWashout = () => {
  return AUTOIMMUNE_MEDICATIONS.filter(med => med.washoutPeriod && med.washoutPeriod > 0);
};
