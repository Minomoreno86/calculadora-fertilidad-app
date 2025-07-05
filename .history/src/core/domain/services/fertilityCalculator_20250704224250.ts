import {
  CalculationProfile,
  FertilityResult,
} from '../models/FertilityProfile';
import { PROBABILITY_MODIFIERS } from '../logic/likelihoodRatios';
import { getBaselineProbabilityByAge } from './baselineProbability';

// --- Funciones Auxiliares para Odds ---

const probabilityToOdds = (p: number): number => {
  if (p >= 1) return Infinity;
  return p / (1 - p);
};

const oddsToProbability = (o: number): number => {
  if (o === Infinity) return 1;
  return o / (1 + o);
};

/**
 * Calcula la probabilidad de concepción basado en un perfil clínico.
 * @param profile - El perfil de cálculo con la edad y los factores clínicos.
 * @returns Un objeto con la probabilidad y una explicación.
 */
export const calculateFertilityProbability = (
  profile: CalculationProfile
): FertilityResult => {
  // 1. Obtener Probabilidad Basal (P₀) por edad
  const baselineProbability = getBaselineProbabilityByAge(profile.womanAge);

  // 2. Convertir P₀ a Odds iniciales
  let currentOdds = probabilityToOdds(baselineProbability);

  // 3. Aplicar cada modificador relevante del perfil
  for (const key in profile.factors) {
    // Verificamos que la clave es un factor del perfil y que está activa (es true)
    if (
      Object.prototype.hasOwnProperty.call(profile.factors, key) &&
      profile.factors[key as keyof typeof profile.factors]
    ) {
      // Aplicamos el modificador si existe en nuestro diccionario
      const modifier = PROBABILITY_MODIFIERS[key];
      if (modifier !== undefined) {
        currentOdds *= modifier;
      }
    }
  }

  // 4. Convertir Odds finales a Probabilidad final
  const finalProbability = oddsToProbability(currentOdds);

  return {
    probability: finalProbability,
    explanation: 'El cálculo se ha completado basado en los factores proporcionados.',
  };
};