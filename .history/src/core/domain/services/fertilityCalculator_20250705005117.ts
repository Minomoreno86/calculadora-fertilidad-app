import {
  CalculationProfile,
  FertilityResult,
} from '@/core/domain/models/FertilityProfile';
import { PROBABILITY_MODIFIERS } from '@/core/domain/logic/likelihoodRatios';
import { getBaselineProbabilityByAge } from './baselineProbability';
import { convertAnnualToMonthlyProbability } from '@/core/domain/logic/probabilityHelpers';
// --- MUEVA ESTAS FUNCIONES AQUÍ, AL INICIO DEL ARCHIVO ---
const probabilityToOdds = (p: number): number => {
  if (p >= 1) return Infinity;
  return p / (1 - p);
};

const oddsToProbability = (o: number): number => {
  if (o === Infinity) return 1;
  return o / (1 + o);
};

// --- FUNCIÓN PRINCIPAL ---
export const calculateFertilityProbability = (
  profile: CalculationProfile
): FertilityResult => {
  const baselineProbability = getBaselineProbabilityByAge(profile.womanAge);
  let currentOdds = probabilityToOdds(baselineProbability); // Ahora las encontrará

  for (const key in profile.factors) {
    if (
      Object.prototype.hasOwnProperty.call(profile.factors, key) &&
      profile.factors[key as keyof typeof profile.factors]
    ) {
      const modifier = PROBABILITY_MODIFIERS[key];
      if (modifier !== undefined) {
        currentOdds *= modifier;
      }
    }
  }

  const finalAnnualProbability = oddsToProbability(currentOdds); // Ahora las encontrará
  const finalPerCycleProbability = convertAnnualToMonthlyProbability(
    finalAnnualProbability
  );

  return {
    anualProbability: finalAnnualProbability,
    perCycleProbability: finalPerCycleProbability,
    explanation: 'El cálculo se ha completado.',
  };
};