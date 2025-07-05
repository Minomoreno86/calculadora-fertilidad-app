/**
 * Este archivo contiene la lógica para determinar la probabilidad
 * de concepción basal (P₀) en un periodo de 12 meses, basada
 * únicamente en la edad de la mujer.
 */

// Estructura de datos con los benchmarks de probabilidad acumulada a 12 meses.
const ageProbabilityMap: {
  minAge: number;
  maxAge: number;
  probability: number;
}[] = [
  { minAge: 0, maxAge: 24, probability: 0.71 },   // Usamos el valor de 20-24 para menores de 25
  { minAge: 25, maxAge: 29, probability: 0.79 },
  { minAge: 30, maxAge: 34, probability: 0.78 },
  { minAge: 35, maxAge: 39, probability: 0.67 },
  { minAge: 40, maxAge: 44, probability: 0.56 },
  { minAge: 45, maxAge: Infinity, probability: 0.15 }, // Probabilidad baja para >45, basado en la evidencia cualitativa
];

/**
 * Obtiene la probabilidad basal de embarazo en 12 meses según la edad.
 * @param age La edad de la mujer en años.
 * @returns La probabilidad de concepción como un valor decimal (e.g., 0.79 para 79%).
 */
export const getBaselineProbabilityByAge = (age: number): number => {
  const matchingBracket = ageProbabilityMap.find(
    (bracket) => age >= bracket.minAge && age <= bracket.maxAge
  );

  // Si no se encuentra un rango (no debería ocurrir con la configuración actual),
  // devolvemos un valor seguro y bajo.
  if (!matchingBracket) {
    console.warn(`Edad fuera de rango no manejada: ${age}. Usando probabilidad por defecto.`);
    return 0.1; // Valor conservador
  }

  return matchingBracket.probability;
};