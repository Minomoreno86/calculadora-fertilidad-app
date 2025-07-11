import { useState, useCallback } from 'react';
import { EvaluationState, Factors, SimulatableFactor } from '@/core/domain/models';

export const ALL_FACTORS_SIMULATION_KEY = 'all';

import { calculateProbabilityFromFactors } from '@/core/domain/services/calculationEngine';

// Definición explícita del tipo para el resultado de la simulación
export interface SimulationResult {
  factor: SimulatableFactor | 'all';
  explanation: string;
  originalPrognosis: number;
  newPrognosis: number;
  improvement: number;
}

/**
 * Hook personalizado para manejar la lógica de simulación de fertilidad.
 * @param originalEvaluation - El estado de evaluación original sobre el que se ejecutarán las simulaciones.
 */
export const useFertilitySimulator = (originalEvaluation: EvaluationState | null) => {
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);

  const simulateFactor = useCallback(
    (factorToImprove: SimulatableFactor, explanation: string) => {
      if (!originalEvaluation) return;

      const originalPrognosis = originalEvaluation.report.numericPrognosis;
      const simulatedFactors = { ...originalEvaluation.factors };

      // Optimiza el factor seleccionado a su valor ideal (1.0)
      simulatedFactors[factorToImprove] = 1.0;

      const newPrognosis = calculateProbabilityFromFactors(simulatedFactors);

      setSimulationResult({
        factor: factorToImprove,
        explanation,
        originalPrognosis,
        newPrognosis,
        improvement: newPrognosis - originalPrognosis,
      });
    },
    [originalEvaluation],
  );

  /**
   * Simula la mejora de todos los factores subóptimos simultáneamente.
   */
  const simulateAllImprovements = useCallback(() => {
    if (!originalEvaluation) return;

    const originalPrognosis = originalEvaluation.report.numericPrognosis;
    const simulatedFactors = { ...originalEvaluation.factors };

    // Itera y optimiza todos los factores que no son perfectos (valor < 1.0)
    (Object.keys(simulatedFactors) as Array<keyof Factors>).forEach(key => {
      if (key !== 'baseAgeProbability' && key !== 'otb' && simulatedFactors[key] < 1.0) {
        simulatedFactors[key] = 1.0;
      }
    });

    const newPrognosis = calculateProbabilityFromFactors(simulatedFactors);

    setSimulationResult({
      factor: ALL_FACTORS_SIMULATION_KEY,
      explanation: 'todos los factores optimizables',
      originalPrognosis,
      newPrognosis,
      improvement: newPrognosis - originalPrognosis,
    });
  }, [originalEvaluation]);

  return {
    simulationResult,
    simulateFactor,
    simulateAllImprovements,
  };
};
