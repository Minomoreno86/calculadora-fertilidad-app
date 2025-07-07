/**
 * Define las estructuras de datos para el perfil de cálculo y el resultado.
 */

// Perfil de cálculo que se construye a partir de los datos del usuario.
// Contiene todos los posibles factores que modifican la probabilidad.
export interface CalculationProfile {
  womanAge: number;
  factors: {
    amh_low?: boolean;
    bmi_overweight?: boolean;
    bmi_obese?: boolean;
    bmi_underweight?: boolean;
    pcos_untreated?: boolean;
    pcos_letrozole?: boolean;
    endo_stage_1_2?: boolean;
    endo_stage_3_4?: boolean;
    myoma_submucosal_unreated?: boolean;
    myoma_submucosal_treated?: boolean;
    myoma_intramural_large?: boolean;
    myoma_intramural_treated?: boolean; // <-- AÑADIDO
    polyp_unreated?: boolean;
    polyp_multiple_unreated?: boolean;
    polyp_treated?: boolean;
    pelvic_surgery_adhesions?: boolean;
    cycle_irregular?: boolean;
    infertility_duration_1_2_years?: boolean;
    infertility_duration_over_2_years?: boolean;
    adenomyosis_diffuse?: boolean; // <-- AÑADIDO
    adenomyosis_focal?: boolean;   // <-- AÑADIDO
    uterine_malformation?: boolean; // <-- AÑADIDO
    homa_ir_high?: boolean;
    hypothyroidism_untreated?: boolean;
    hypothyroidism_treated?: boolean;
    hyperprolactinemia_untreated?: boolean;
    hyperprolactinemia_treated?: boolean;
    tubal_obstruction_unilateral?: boolean;
    tubal_obstruction_bilateral?: boolean;
    semen_moderate_abnormality?: boolean;
    semen_severe_abnormality?: boolean;
  };
}

// Estructura del resultado final que se entrega
export interface FertilityResult {
  anualProbability: number;      // Probabilidad acumulada a 12 meses
  perCycleProbability: number;   // Probabilidad mensual estimada
  explanation: string;
}