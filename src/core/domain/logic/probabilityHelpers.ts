/**
 * Convierte una probabilidad acumulada anual a una probabilidad mensual constante.
 * Asume que la probabilidad es independiente en cada ciclo.
 * @param annualProbability - La probabilidad acumulada en 12 meses (0 a 1).
 * @returns La probabilidad mensual estimada (0 a 1).
 */
export const convertAnnualToMonthlyProbability = (
  annualProbability: number
): number => {
  // Fórmula: P_mensual = 1 - (1 - P_anual)^(1/12)
  return 1 - Math.pow(1 - annualProbability, 1 / 12);
};