import { useState, useCallback } from 'react';
import { EvaluationState, Factors, SimulatableFactor } from '@/core/domain/models';

/**
 * Hook para simular cambios en los factores de fertilidad y calcular nuevos pronósticos.
 * @param originalReport El estado de evaluación completo y original del usuario.
 * @returns Un objeto con el pronóstico simulado, su explicación, y las funciones para simular.
 */
export const useFertilitySimulator = (originalReport: EvaluationState | null) => {
  const [simulatedPrognosis, setSimulatedPrognosis] = useState<number | null>(null);
  const [potentialPrognosis, setPotentialPrognosis] = useState<number | null>(null); // <-- NUEVO ESTADO
  const [simulationExplanation, setSimulationExplanation] = useState<string | null>(null);

  const calculateMaxPotential = (factors: Factors) => {
    const simulatedFactors = { ...factors };
    for (const key in simulatedFactors) {
      const factorName = key as keyof Factors;
      if (factorName !== 'baseAgeProbability' && simulatedFactors[factorName] < 1.0) {
        simulatedFactors[factorName] = 1.0;
      }
    }
    const { baseAgeProbability, ...otherFactors } = simulatedFactors;
    const productOfFactors = Object.values(otherFactors).reduce((acc, factor) => acc * factor, 1);
    return baseAgeProbability * productOfFactors;
  };

  const simulateFactor = useCallback((factorToImprove: SimulatableFactor, explanation: string) => {
    if (!originalReport) return;

    // Calculamos el impacto de solo este factor
    const singleSimFactors = { ...originalReport.factors };
    singleSimFactors[factorToImprove] = 1.0;
    const { baseAgeProbability, ...otherFactors } = singleSimFactors;
    const productOfFactors = Object.values(otherFactors).reduce((acc, factor) => acc * factor, 1);
    const newSinglePrognosis = baseAgeProbability * productOfFactors;

    // Calculamos el potencial máximo total
    const maxPotential = calculateMaxPotential(originalReport.factors);

    setSimulatedPrognosis(newSinglePrognosis);
    setPotentialPrognosis(maxPotential); // <-- GUARDAMOS EL POTENCIAL MÁXIMO
    setSimulationExplanation(explanation);
  }, [originalReport]);

  const simulateAllImprovements = useCallback(() => {
    if (!originalReport) return;
    const maxPotential = calculateMaxPotential(originalReport.factors);
    setSimulatedPrognosis(maxPotential);
    setPotentialPrognosis(null); // No es necesario mostrar el potencial si ya estamos en el máximo
    setSimulationExplanation("todos los factores optimizables");
  }, [originalReport]);

  return {
    simulatedPrognosis,
    potentialPrognosis, // <-- Exportamos el nuevo estado
    simulationExplanation,
    simulateFactor,
    simulateAllImprovements,
  };
};