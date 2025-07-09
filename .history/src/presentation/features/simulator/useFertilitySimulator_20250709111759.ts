import { useState, useCallback } from 'react';
import { EvaluationState, Factors, SimulatableFactor } from '@/core/domain/models';

/**
 * Hook para simular cambios en los factores de fertilidad y calcular nuevos pronósticos.
 * @param originalReport El estado de evaluación completo y original del usuario.
 * @returns Un objeto con el pronóstico simulado, su explicación, y las funciones para simular.
 */
export const useFertilitySimulator = (originalReport: EvaluationState | null) => {
  // Estado para el resultado numérico de la simulación
  const [simulatedPrognosis, setSimulatedPrognosis] = useState<number | null>(null);
  // Estado para el texto que explica qué se simuló
  const [simulationExplanation, setSimulationExplanation] = useState<string | null>(null);

  /**
   * Calcula un nuevo pronóstico basado en la mejora de UN SOLO factor.
   * @param factorToImprove El nombre del factor a optimizar.
   * @param explanation El texto que describe la mejora simulada.
   */
  const simulateFactor = useCallback((factorToImprove: SimulatableFactor, explanation: string) => {
    if (!originalReport) return;

    // 1. Copia los factores para no mutar el original.
    const simulatedFactors = { ...originalReport.factors };
    // 2. Optimiza el factor seleccionado.
    simulatedFactors[factorToImprove] = 1.0;

    // 3. Recalcula el pronóstico.
    const { baseAgeProbability, ...otherFactors } = simulatedFactors;
    const productOfFactors = Object.values(otherFactors).reduce((acc, factor) => acc * factor, 1);
    const newPrognosis = baseAgeProbability * productOfFactors;

    // 4. Actualiza el estado con el resultado Y la explicación.
    setSimulatedPrognosis(newPrognosis);
    setSimulationExplanation(explanation);

  }, [originalReport]);

  /**
   * NUEVA FUNCIÓN: Calcula el pronóstico optimizando TODOS los factores mejorables.
   */
  const simulateAllImprovements = useCallback(() => {
    if (!originalReport) return;

    const simulatedFactors = { ...originalReport.factors };

    // Iteramos sobre todos los factores y los optimizamos si son subóptimos.
    for (const key in simulatedFactors) {
      const factorName = key as keyof Factors;
      // No optimizamos la probabilidad base por edad.
      if (factorName !== 'baseAgeProbability' && simulatedFactors[factorName] < 1.0) {
        simulatedFactors[factorName] = 1.0;
      }
    }

    const { baseAgeProbability, ...otherFactors } = simulatedFactors;
    const productOfFactors = Object.values(otherFactors).reduce((acc, factor) => acc * factor, 1);
    const newPrognosis = baseAgeProbability * productOfFactors;

    setSimulatedPrognosis(newPrognosis);
    setSimulationExplanation("todos los factores optimizables");
    
  }, [originalReport]);

  // Se devuelven todas las piezas necesarias para la UI.
  return {
    simulatedPrognosis,
    simulationExplanation,
    simulateFactor,
    simulateAllImprovements,
  };
};