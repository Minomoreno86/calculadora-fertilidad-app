import { useState, useCallback } from 'react';
import { EvaluationState, Factors, SimulatableFactor, SimulationResult } from '../../../core/domain/models';

export const useFertilitySimulator = (originalReport: EvaluationState | null) => {
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);

  const calculatePrognosis = (factors: Factors): number => {
    const { baseAgeProbability, ...otherFactors } = factors;
    const productOfFactors = Object.values(otherFactors).reduce((acc, factor) => acc * factor, 1);
    return baseAgeProbability * productOfFactors;
  };

  const simulateFactor = useCallback((factorToImprove: SimulatableFactor, explanation: string) => {
    if (!originalReport) return;
    const originalPrognosis = originalReport.report.numericPrognosis;
    const simulatedFactors = { ...originalReport.factors };
    simulatedFactors[factorToImprove] = 1.0;
    const newPrognosis = calculatePrognosis(simulatedFactors);
    setSimulationResult({
      factor: factorToImprove,
      explanation,
      originalPrognosis,
      newPrognosis,
      improvement: newPrognosis - originalPrognosis,
    });
  }, [originalReport]);

  const simulateAllImprovements = useCallback(() => {
    if (!originalReport) return;
    const originalPrognosis = originalReport.report.numericPrognosis;
    const simulatedFactors = { ...originalReport.factors };
    for (const key in simulatedFactors) {
      const factorName = key as keyof Factors;
      if (factorName !== 'baseAgeProbability' && simulatedFactors[factorName] < 1.0) {
        simulatedFactors[factorName] = 1.0;
      }
    }
    const newPrognosis = calculatePrognosis(simulatedFactors);
    setSimulationResult({
      factor: 'all',
      explanation: "todos los factores optimizables",
      originalPrognosis,
      newPrognosis,
      improvement: newPrognosis - originalPrognosis,
    });
  }, [originalReport]);

  return {
    simulationResult,
    simulateFactor,
    simulateAllImprovements,
  };
};