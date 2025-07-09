import { useState, useCallback } from 'react';
import { EvaluationState, Report, Factors } from '@/core/domain/models';

// Define los factores que son "mejorables" por el usuario, excluyendo la probabilidad base por edad.
export type SimulatableFactor = keyof Omit<Factors, 'baseAgeProbability'>;

/**
 * Hook para simular cambios en los factores de fertilidad y calcular nuevos pronósticos.
 * @param originalReport El estado de evaluación completo y original del usuario.
 * @returns Un objeto con el pronóstico simulado y la función para ejecutar la simulación.
 */
export const useFertilitySimulator = (originalReport: EvaluationState | null) => {
  const [simulatedPrognosis, setSimulatedPrognosis] = useState<number | null>(null);

  /**
   * Calcula un nuevo pronóstico basado en la mejora de un solo factor a su valor óptimo (1.0).
   */
  const simulateFactor = useCallback((factorToImprove: SimulatableFactor) => {
    // Si no hay un informe original, no se puede hacer nada.
    if (!originalReport) {
      setSimulatedPrognosis(null);
      return;
    }

    // 1. Copia los factores originales para no mutar el estado original.
    const simulatedFactors = { ...originalReport.factors };

    // 2. Mejora el factor seleccionado a su valor óptimo.
    simulatedFactors[factorToImprove] = 1.0;

    // 3. Recalcula el producto de todos los factores, excepto la probabilidad base.
    const { baseAgeProbability, ...otherFactors } = simulatedFactors;
    const productOfFactors = Object.values(otherFactors).reduce(
      (acc, factor) => acc * factor,
      1
    );

    // 4. Calcula y actualiza el estado con el nuevo pronóstico.
    const newPrognosis = baseAgeProbability * productOfFactors;
    setSimulatedPrognosis(newPrognosis);

  }, [originalReport]); // La función se recalcula solo si el informe original cambia.

  return {
    simulatedPrognosis,
    simulateFactor,
  };
};