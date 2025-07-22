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

  // 🚀 CONSOLIDACIÓN: Métricas de benchmark integradas
  benchmarkMetrics: {
    performanceReport: PerformanceReport;
    isOptimal: boolean;
    needsImprovement: boolean;
    getBenchmarkData: () => PerformanceReport;
    completionRate: number;
    qualityScore: number;
    recommendation: string;
  };
}

// Tipos para benchmark
interface PerformanceReport {
  renderCount: number;
  totalMeasurements: number;
  averageTime: number;
  lastMeasurement: number;
  operations: Array<{
    name: string;
    duration: number;
    timestamp: number;
  }>;
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
        'spermConcentration', 'spermProgressiveMotility', 'spermNormalMorphology', 'spermVolume'
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

  // 🚀 CONSOLIDACIÓN: Calcular métricas de benchmark
  const benchmarkMetrics = useMemo(() => {
    return generateBenchmarkMetrics(formData);
  }, [formData]);

  return {
    progress,
    getSectionProgress,
    isSectionComplete,
    benchmarkMetrics,
  };
};

// ===================================================================
// 🚀 FUNCIONES DE BENCHMARK CONSOLIDADAS (de useBenchmark.ts)
// ===================================================================

function generateBenchmarkMetrics(formData: Record<string, unknown>) {
  const startTime = performance.now();
  
  // 📊 Métricas básicas de completitud
  const totalFields = Object.keys(formData).length;
  const completedFields = Object.values(formData).filter(value => 
    value !== '' && value !== null && value !== undefined
  ).length;
  
  const completionRate = Math.round((completedFields / totalFields) * 100);
  
  // 🎯 Benchmark de calidad de datos
  const criticalFields = ['age', 'weight', 'height', 'cycleLength', 'infertilityDuration'];
  const criticalCompleted = criticalFields.filter(field => 
    formData[field] && formData[field] !== ''
  ).length;
  
  const qualityScore = Math.round((criticalCompleted / criticalFields.length) * 100);
  
  // ⚡ Métricas de rendimiento
  const benchmarkTime = performance.now() - startTime;
  
  const performanceReport: PerformanceReport = {
    renderCount: 1,
    totalMeasurements: 1,
    averageTime: benchmarkTime,
    lastMeasurement: benchmarkTime,
    operations: [{
      name: 'benchmark_calculation',
      duration: benchmarkTime,
      timestamp: Date.now()
    }]
  };
  
  return {
    performanceReport,
    isOptimal: completionRate >= 80 && qualityScore >= 90,
    needsImprovement: qualityScore < 70,
    getBenchmarkData: () => performanceReport,
    completionRate,
    qualityScore,
    recommendation: generateRecommendation(completionRate, qualityScore)
  };
}

function generateRecommendation(completion: number, quality: number): string {
  if (quality < 50) {
    return 'Completar datos críticos: edad, peso, altura, duración del ciclo';
  }
  if (completion < 70) {
    return 'Agregar más información para mejorar precisión del cálculo';
  }
  if (quality >= 90 && completion >= 80) {
    return 'Datos completos y de alta calidad para cálculo preciso';
  }
  return 'Considerar completar información adicional';
}
