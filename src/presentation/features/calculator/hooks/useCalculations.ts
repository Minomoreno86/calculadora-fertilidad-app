// ===================================================================
// 🚀 FASE 2C: HOOK ESPECIALIZADO PARA CÁLCULOS MATEMÁTICOS
// ===================================================================

import React from 'react';

interface UseCalculationsReturn {
  calculateBMI: (height: string | number, weight: string | number) => number | null;
  calculateHOMA: (glucose: string | number, insulin: string | number) => number | null;
  formatBMI: (bmi: number | null) => string;
  formatHOMA: (homa: number | null) => string;
  getBMICategory: (bmi: number) => { category: string; color: string };
  getHOMACategory: (homa: number) => { category: string; color: string };
}

export const useCalculations = (): UseCalculationsReturn => {
  // 🚀 FASE 2C: Memoizar función de cálculo de BMI
  const calculateBMI = React.useCallback((height: string | number, weight: string | number): number | null => {
    const h = typeof height === 'string' ? parseFloat(height) : height;
    const w = typeof weight === 'string' ? parseFloat(weight) : weight;
    
    if (!h || !w || isNaN(h) || isNaN(w) || h <= 0 || w <= 0) return null;
    
    // 🔍 QUANTUM CONSCIOUSNESS BMI FIX: Detectar si altura viene en metros o cm
    const heightInMeters = h > 10 ? h / 100 : h; // Si > 10, asumimos cm y convertimos
    return Math.round((w / (heightInMeters * heightInMeters)) * 10) / 10;
  }, []);

  // 🚀 FASE 2C: Memoizar función de cálculo de HOMA-IR
  const calculateHOMA = React.useCallback((glucose: string | number, insulin: string | number): number | null => {
    const g = typeof glucose === 'string' ? parseFloat(glucose) : glucose;
    const i = typeof insulin === 'string' ? parseFloat(insulin) : insulin;
    
    if (!g || !i || isNaN(g) || isNaN(i) || g <= 0 || i <= 0) return null;
    return Math.round(((g * i) / 405) * 100) / 100;
  }, []);

  // 🚀 FASE 2C: Funciones de formateo memoizadas
  const formatBMI = React.useCallback((bmi: number | null): string => {
    if (!bmi) return 'No calculado';
    return `${bmi} kg/m²`;
  }, []);

  const formatHOMA = React.useCallback((homa: number | null): string => {
    if (!homa) return 'No calculado';
    return homa.toString();
  }, []);

  // 🚀 FASE 2C: Categorización de BMI memoizada
  const getBMICategory = React.useMemo(() => {
    return (bmi: number) => {
      if (bmi < 18.5) return { category: 'Bajo peso', color: '#FFB800' };
      if (bmi < 25) return { category: 'Normal', color: '#4CAF50' };
      if (bmi < 30) return { category: 'Sobrepeso', color: '#FF9800' };
      return { category: 'Obesidad', color: '#F44336' };
    };
  }, []);

  // 🚀 FASE 2C: Categorización de HOMA memoizada
  const getHOMACategory = React.useMemo(() => {
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
