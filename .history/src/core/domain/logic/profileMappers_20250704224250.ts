import { CalculationProfile } from '../models/FertilityProfile';

// Definición única y completa de la interfaz para los datos de la UI.
export interface UserInput {
  womanAge: number;
  bodyMassIndex?: number;
  cycleLength?: number; // en días
  infertilityDuration?: number; // en años
  semenConcentration?: number; // en Millones/mL
  amhValue?: number; // en ng/mL
  // Aquí irían los booleanos directos como 'hasPCOS', 'hasEndo', etc.
}

type Factors = CalculationProfile['factors'];

// --- Mappers individuales ---

const mapBmiToFactors = (imc?: number): Partial<Factors> => {
  if (imc === undefined) return {};
  if (imc >= 30) return { bmi_obese: true };
  if (imc >= 25) return { bmi_overweight: true };
  if (imc < 18.5) return { bmi_underweight: true };
  return {};
};

const mapCycleToFactors = (cycleLength?: number): Partial<Factors> => {
  if (cycleLength === undefined) return {};
  if (cycleLength <= 24 || cycleLength > 35) {
    return { cycle_irregular: true };
  }
  return {};
};

const mapInfertilityDurationToFactors = (
  years?: number
): Partial<Factors> => {
  if (years === undefined) return {};
  if (years > 2) return { infertility_duration_over_2_years: true };
  if (years >= 1) return { infertility_duration_1_2_years: true };
  return {};
};

const mapSemenAnalysisToFactors = (
  concentration?: number
): Partial<Factors> => {
  if (concentration === undefined) return {};
  // Basado en la tabla: <5M es grave, 10-20M es moderado.
  // Usamos <5M como umbral para 'grave'.
  if (concentration < 5) return { semen_severe_abnormality: true };
  // Usamos <16M (límite de OMS 2021) para 'moderado'.
  if (concentration < 16) return { semen_moderate_abnormality: true };
  return {};
};

const mapAmhToFactors = (amh?: number): Partial<Factors> => {
  if (amh === undefined) return {};
  if (amh < 1.0) return { amh_low: true };
  return {};
};

// --- Orquestador Principal ---

/**
 * Mapea los datos crudos del usuario al formato requerido por el calculador.
 * @param userInput - Objeto con los datos del formulario de la UI.
 * @returns Un objeto CalculationProfile listo para el cálculo.
 */
export const mapUserInputToCalculationProfile = (
  userInput: UserInput
): CalculationProfile => {
  // Aquí se podrían añadir los factores booleanos directamente desde userInput
  const directFactors: Partial<Factors> = {
    // Ejemplo: pcos_untreated: userInput.hasPCOS ...
  };

  const calculationProfile: CalculationProfile = {
    womanAge: userInput.womanAge,
    factors: {
      ...directFactors,
      ...mapBmiToFactors(userInput.bodyMassIndex),
      ...mapCycleToFactors(userInput.cycleLength),
      ...mapInfertilityDurationToFactors(userInput.infertilityDuration),
      ...mapSemenAnalysisToFactors(userInput.semenConcentration),
      ...mapAmhToFactors(userInput.amhValue),
    },
  };

  return calculationProfile;
};