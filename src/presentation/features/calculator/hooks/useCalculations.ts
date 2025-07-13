// ===================================================================
// 🚀 FASE 2C: HOOK ESPECIALIZADO PARA CÁLCULOS MATEMÁTICOS
// ===================================================================

import { useMemo, useCallback } from 'react';

interface UseCalculationsReturn {
  calculateBMI: (height: number, weight: number) => number | null;
  calculateHOMA: (glucose: number, insulin: number) => number | null;
  formatBMI: (bmi: number | null) => string;
  formatHOMA: (homa: number | null) => string;
  getBMICategory: (bmi: number) => { category: string; color: string };
  getHOMACategory: (homa: number) => { category: string; color: string };
}

export const useCalculations = (): UseCalculationsReturn => {
  // 🚀 FASE 2C: Memoizar función de cálculo de BMI
  const calculateBMI = useCallback((height: number, weight: number): number | null => {
    if (!height || !weight || height <= 0 || weight <= 0) return null;
    const heightInMeters = height / 100;
    return Math.round((weight / (heightInMeters * heightInMeters)) * 10) / 10;
  }, []);

  // 🚀 FASE 2C: Memoizar función de cálculo de HOMA-IR
  const calculateHOMA = useCallback((glucose: number, insulin: number): number | null => {
    if (!glucose || !insulin || glucose <= 0 || insulin <= 0) return null;
    return Math.round(((glucose * insulin) / 405) * 100) / 100;
  }, []);

  // 🚀 FASE 2C: Funciones de formateo memoizadas
  const formatBMI = useCallback((bmi: number | null): string => {
    if (!bmi) return 'No calculado';
    return `${bmi} kg/m²`;
  }, []);

  const formatHOMA = useCallback((homa: number | null): string => {
    if (!homa) return 'No calculado';
    return homa.toString();
  }, []);

  // 🚀 FASE 2C: Categorización de BMI memoizada
  const getBMICategory = useMemo(() => {
    return (bmi: number) => {
      if (bmi < 18.5) return { category: 'Bajo peso', color: '#FFB800' };
      if (bmi < 25) return { category: 'Normal', color: '#4CAF50' };
      if (bmi < 30) return { category: 'Sobrepeso', color: '#FF9800' };
      return { category: 'Obesidad', color: '#F44336' };
    };
  }, []);

  // 🚀 FASE 2C: Categorización de HOMA memoizada
  const getHOMACategory = useMemo(() => {
    return (homa: number) => {
      if (homa <= 2.5) return { category: 'Normal', color: '#4CAF50' };
      if (homa <= 3.8) return { category: 'Resistencia leve', color: '#FF9800' };
      return { category: 'Resistencia significativa', color: '#F44336' };
    };
  }, []);

  return {
    calculateBMI,
    calculateHOMA,
    formatBMI,
    formatHOMA,
    getBMICategory,
    getHOMACategory
  };
};
