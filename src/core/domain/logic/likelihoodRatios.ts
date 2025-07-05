/**
 * Este archivo centraliza los modificadores de probabilidad (Likelihood Ratios o equivalentes)
 * para cada factor clínico. Estos valores se multiplicarán por los odds basales
 * para ajustar la probabilidad final.
 */

// La probabilidad basal de referencia para calcular los modificadores,
// según la tabla proporcionada (edad 30-34 años).
const BASELINE_PROBABILITY_FOR_MODIFIERS = 0.78;

export const PROBABILITY_MODIFIERS: Record<string, number> = {
  // --- Factores Demográficos ---
  amh_low: 0.60 / BASELINE_PROBABILITY_FOR_MODIFIERS, // AMH < 1 ng/mL
  bmi_overweight: 0.69 / BASELINE_PROBABILITY_FOR_MODIFIERS, // IMC 25-29.9
  bmi_obese: 0.56 / BASELINE_PROBABILITY_FOR_MODIFIERS, // IMC >= 30
  bmi_underweight: 0.70 / BASELINE_PROBABILITY_FOR_MODIFIERS, // IMC < 18.5

  // --- Historia Gineco-obstétrica ---
  pcos_untreated: 0.25 / BASELINE_PROBABILITY_FOR_MODIFIERS,
  pcos_letrozole: 0.60 / BASELINE_PROBABILITY_FOR_MODIFIERS,
  endo_stage_1_2: 0.50 / BASELINE_PROBABILITY_FOR_MODIFIERS,
  endo_stage_3_4: 0.30 / BASELINE_PROBABILITY_FOR_MODIFIERS,
  myoma_submucosal_unreated: 0.28 / BASELINE_PROBABILITY_FOR_MODIFIERS,
  myoma_submucosal_treated: 0.63 / BASELINE_PROBABILITY_FOR_MODIFIERS,
  myoma_intramural_large: 0.40 / BASELINE_PROBABILITY_FOR_MODIFIERS,
  myoma_subserosal_large: 0.70 / BASELINE_PROBABILITY_FOR_MODIFIERS,
  polyp_unreated: 0.50 / BASELINE_PROBABILITY_FOR_MODIFIERS, // Asumimos único como base
  polyp_multiple_unreated: 0.30 / BASELINE_PROBABILITY_FOR_MODIFIERS,
  polyp_treated: 0.70 / BASELINE_PROBABILITY_FOR_MODIFIERS,
  pelvic_surgery_adhesions: 0.39 / BASELINE_PROBABILITY_FOR_MODIFIERS,
  pelvic_surgery_adhesiolysis: 0.75 / BASELINE_PROBABILITY_FOR_MODIFIERS,
  cycle_irregular: 0.39 / BASELINE_PROBABILITY_FOR_MODIFIERS, // ≤24d o >35d
  infertility_duration_1_2_years: 0.26 / BASELINE_PROBABILITY_FOR_MODIFIERS,
  infertility_duration_over_2_years: 0.13 / BASELINE_PROBABILITY_FOR_MODIFIERS,

  // --- Laboratorio ---
  homa_ir_high: 0.48 / BASELINE_PROBABILITY_FOR_MODIFIERS, // HOMA-IR >= 2.5
  hypothyroidism_untreated: 0.55 / BASELINE_PROBABILITY_FOR_MODIFIERS, // TSH > 4
  hypothyroidism_treated: 0.78 / BASELINE_PROBABILITY_FOR_MODIFIERS, // Vuelve a la normalidad
  hyperprolactinemia_untreated: 0.05 / BASELINE_PROBABILITY_FOR_MODIFIERS,
  hyperprolactinemia_treated: 0.73 / BASELINE_PROBABILITY_FOR_MODIFIERS,
  
  // --- Evaluación Tubárica ---
  tubal_obstruction_unilateral: 0.66 / BASELINE_PROBABILITY_FOR_MODIFIERS,
  
  // --- Factor Masculino ---
  semen_moderate_abnormality: 0.40 / BASELINE_PROBABILITY_FOR_MODIFIERS,
  semen_severe_abnormality: 0.05 / BASELINE_PROBABILITY_FOR_MODIFIERS,
};