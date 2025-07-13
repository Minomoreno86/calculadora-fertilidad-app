// ===================================================================
// 🚀 FASE 2C: HOOK ESPECIALIZADO PARA GESTIÓN DE PROGRESO
// ===================================================================

import { useMemo } from 'react';

interface FormProgress {
  completedSections: number;
  totalSections: number;
  progressPercentage: number;
  missingSections: string[];
  isReadyToSubmit: boolean;
}

interface UseFormProgressProps {
  formData: Record<string, unknown>;
}

interface UseFormProgressReturn {
  progress: FormProgress;
  getSectionProgress: (sectionName: string) => number;
  isSectionComplete: (sectionName: string) => boolean;
}

export const useFormProgress = ({ formData }: UseFormProgressProps): UseFormProgressReturn => {
  // 🚀 FASE 2C: Definir secciones y sus campos requeridos
  const sections = useMemo(() => ({
    demographics: {
      name: 'Datos Demográficos',
      requiredFields: ['age', 'height', 'weight'],
      optionalFields: ['cycleDuration']
    },
    gynecology: {
      name: 'Historia Ginecológica',
      requiredFields: ['hasPcos'],
      optionalFields: [
        'endometriosisGrade', 'myomaType', 'adenomyosisType', 
        'polypType', 'hsgResult', 'hasOtb', 'hasPelvicSurgery'
      ]
    },
    laboratory: {
      name: 'Exámenes de Laboratorio',
      requiredFields: [],
      optionalFields: [
        'amh', 'prolactin', 'tsh', 'fastingGlucose', 'fastingInsulin'
      ]
    },
    maleFactor: {
      name: 'Factor Masculino',
      requiredFields: [],
      optionalFields: [
        'spermConcentration', 'spermProgressiveMotility', 'spermNormalMorphology'
      ]
    }
  }), []);

  // 🚀 FASE 2C: Calcular progreso por sección
  const getSectionProgress = useMemo(() => {
    return (sectionName: string): number => {
      const section = sections[sectionName as keyof typeof sections];
      if (!section) return 0;

      const allFields = [...section.requiredFields, ...section.optionalFields];
      if (allFields.length === 0) return 100;

      const completedFields = allFields.filter(field => {
        const value = formData[field];
        return value !== undefined && value !== null && value !== '';
      }).length;

      return Math.round((completedFields / allFields.length) * 100);
    };
  }, [formData, sections]);

  const isSectionComplete = useMemo(() => {
    return (sectionName: string): boolean => {
      const section = sections[sectionName as keyof typeof sections];
      if (!section) return false;

      // Una sección está completa si todos los campos requeridos están llenos
      return section.requiredFields.every(field => {
        const value = formData[field];
        return value !== undefined && value !== null && value !== '';
      });
    };
  }, [formData, sections]);

  // 🚀 FASE 2C: Calcular progreso general
  const progress = useMemo((): FormProgress => {
    const sectionNames = Object.keys(sections);
    const completedSections = sectionNames.filter(name => isSectionComplete(name)).length;
    const totalSections = sectionNames.length;
    
    const progressPercentage = totalSections > 0 
      ? Math.round((completedSections / totalSections) * 100)
      : 0;

    const missingSections = sectionNames
      .filter(name => !isSectionComplete(name))
      .map(name => sections[name as keyof typeof sections].name);

    // Consideramos que está listo si al menos los datos demográficos están completos
    const isReadyToSubmit = isSectionComplete('demographics');

    return {
      completedSections,
      totalSections,
      progressPercentage,
      missingSections,
      isReadyToSubmit
    };
  }, [sections, isSectionComplete]);

  return {
    progress,
    getSectionProgress,
    isSectionComplete
  };
};
