import { calculateFertilityProbability } from '@/core/domain/services/fertilityCalculator';
import { mapUserInputToCalculationProfile } from '@/core/domain/logic/profileMappers';
import type { UserInput } from '@/core/domain/logic/profileMappers';

console.log('--- INICIANDO PRUEBA DE VALIDACIÓN DEL ALGORITMO ---');

const sampleUserInput: UserInput = {
  womanAge: 38,
  bodyMassIndex: 33,
  cycleLength: 40,
  amhValue: 1.8,
};

const calculationProfile = mapUserInputToCalculationProfile(sampleUserInput);
console.log('Perfil de Cálculo Generado:', calculationProfile);

const result = calculateFertilityProbability(calculationProfile);
console.log('Resultado Final:', result);

// --- LÍNEAS CORREGIDAS ---
console.log(
  `\nProbabilidad Anual: ${(result.anualProbability * 100).toFixed(2)}%`
);
console.log(
  `Probabilidad Por Ciclo: ${(result.perCycleProbability * 100).toFixed(2)}%`
);

console.log('--- FIN DE LA PRUEBA ---');
