/**
 * Modelo de datos para el perfil de fertilidad y el resultado del cálculo.
 */

// Este es el perfil que la UI deberá construir para pasarlo al calculador.
// Las claves opcionales corresponden a los modificadores que tenemos.
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
    myoma_subserosal_large?: boolean;
    polyp_unreated?: boolean;
    polyp_multiple_unreated?: boolean;
    polyp_treated?: boolean;
    pelvic_surgery_adhesions?: boolean;
    pelvic_surgery_adhesiolysis?: boolean;
    cycle_irregular?: boolean;
    infertility_duration_1_2_years?: boolean;
    infertility_duration_over_2_years?: boolean;
    homa_ir_high?: boolean;
    hypothyroidism_untreated?: boolean;
    hypothyroidism_treated?: boolean;
    hyperprolactinemia_untreated?: boolean;
    hyperprolactinemia_treated?: boolean;
    tubal_obstruction_unilateral?: boolean;
    semen_moderate_abnormality?: boolean;
    semen_severe_abnormality?: boolean;
  };
}

export interface FertilityResult {
  probability: number; // Un valor entre 0 y 1
  explanation: string; // Un texto explicando los factores clave (a implementar)
}