import { useState, useCallback } from 'react';
import { EvaluationState, Factors, SimulatableFactor } from '@/core/domain/models';

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

  /**
   * Calcula el pronóstico numérico basado en un conjunto de factores.
   * @param factors - Objeto con los factores de fertilidad.
   * @returns El pronóstico numérico (probabilidad).
   */
  const calculatePrognosis = (factors: Factors): number => {
    // Excluye la probabilidad base por edad y el factor OTB (que es bloqueante)
    const { baseAgeProbability, otb, ...otherFactors } = factors;

    if (otb === 0) return 0; // Si hay OTB, el pronóstico espontáneo es 0

    const productOfFactors = Object.values(otherFactors).reduce((acc, factor) => acc * factor, 1);
    return baseAgeProbability * productOfFactors;
  };

  /**
   * Simula la mejora de un único factor de fertilidad.
   * @param factorToImprove - El factor a optimizar (ej. 'bmi', 'tsh').
   * @param explanation - El texto que describe la mejora (ej. "un IMC óptimo").
   */
  const simulateFactor = useCallback(
    (factorToImprove: SimulatableFactor, explanation: string) => {
      if (!originalEvaluation) return;

      const originalPrognosis = originalEvaluation.report.numericPrognosis;
      const simulatedFactors = { ...originalEvaluation.factors };

      // Optimiza el factor seleccionado a su valor ideal (1.0)
      simulatedFactors[factorToImprove] = 1.0;

      const newPrognosis = calculatePrognosis(simulatedFactors);

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
    for (const key in simulatedFactors) {
      const factorName = key as keyof Factors;
      if (factorName !== 'baseAgeProbability' && factorName !== 'otb' && simulatedFactors[factorName] < 1.0) {
        simulatedFactors[factorName] = 1.0;
      }
    }

    const newPrognosis = calculatePrognosis(simulatedFactors);

    setSimulationResult({
      factor: 'all',
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
