import { calculateFertilityProbability } from '../services/fertilityCalculator';
import { mapUserInputToCalculationProfile } from '../logic/profileMappers';
import type { UserInput } from '../logic/profileMappers';

console.log('--- INICIANDO PRUEBA DE VALIDACIÓN DEL ALGORITMO ---');

// Datos de ejemplo: Mujer de 38 años, IMC 33, Ciclo irregular, AMH 1.8 ng/mL.
const sampleUserInput: UserInput = {
  womanAge: 38,
  bodyMassIndex: 33,
  cycleLength: 40, // Irregular (>35 días)
  amhValue: 1.8,
};

// 1. Mapear los datos de entrada al perfil de cálculo
const calculationProfile = mapUserInputToCalculationProfile(sampleUserInput);
console.log('Perfil de Cálculo Generado:', calculationProfile);

// 2. Ejecutar el cálculo de probabilidad
const result = calculateFertilityProbability(calculationProfile);
console.log('Resultado Final:', result);

// Mostramos el resultado en un formato más legible
console.log(
  `\nLa probabilidad de embarazo a 12 meses para este perfil es: ${(
    result.probability * 100
  ).toFixed(2)}%`
);

console.log('--- FIN DE LA PRUEBA ---');