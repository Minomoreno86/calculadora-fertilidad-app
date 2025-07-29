/**
 * Smart Data Mapper V14.0
 * 
 * 🌌 QUANTUM CONSCIOUSNESS SMART MAPPER:
 * - Convierte FormState a SmartFertilityInput
 * - Maneja datos parciales y valores vacíos
 * - Parsing inteligente de strings a números
 * 
 * @author QUANTON - Quantum Consciousness Medical AI V14.0
 * @version 2.0 - Smart Mapper (Consolidated)
 */

import { FormState } from '../../../presentation/features/calculator/types/calculator.types';
import { SmartFertilityInput } from '../models';

/**
 * 🔄 Safe number parsing
 */
function safeParseFloat(value: string | number | undefined): number | undefined {
  if (typeof value === 'number') return value;
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = parseFloat(value.trim());
    return isNaN(parsed) ? undefined : parsed;
  }
  return undefined;
}

/**
 * 🔄 Safe integer parsing
 */
function safeParseInt(value: string | number | undefined): number | undefined {
  if (typeof value === 'number') return Math.round(value);
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = parseInt(value.trim(), 10);
    return isNaN(parsed) ? undefined : parsed;
  }
  return undefined;
}

/**
 * 🌌 MAIN SMART MAPPER FUNCTION
 */
export function mapFormStateToSmartFertility(
  formData: FormState, 
  calculatedBmi?: number | null, 
  calculatedHoma?: number | null
): SmartFertilityInput {
  console.log('🌌 Mapping FormState to SmartFertilityInput:', { formData, calculatedBmi, calculatedHoma });
  
  const input: SmartFertilityInput = {
    // Demographics
    age: safeParseFloat(formData.age),
    bmi: calculatedBmi || undefined,
    
    // Gynecology
    hasPcos: formData.hasPcos || undefined,
    endometriosisStage: formData.endometriosisStage || undefined,
    cycleLength: safeParseFloat(formData.cycleLength),
    // ⚡ FIXED: Conversión años → meses para evaluateInfertilityDuration
    infertilityDuration: safeParseFloat(formData.infertilityDuration) ? 
      safeParseFloat(formData.infertilityDuration) * 12 : undefined,
    
    // Laboratory
    homa: calculatedHoma || undefined,
    amh: safeParseFloat(formData.amhValue),
    tsh: safeParseFloat(formData.tshValue),
    prolactin: safeParseFloat(formData.prolactinValue),
    
    // Male Factor
    spermConcentration: safeParseFloat(formData.spermConcentration),
    spermMotility: safeParseFloat(formData.spermProgressiveMotility),
    spermMorphology: safeParseFloat(formData.spermNormalMorphology),
    
    // Surgery
    hasPelvicSurgery: formData.hasPelvicSurgery || undefined,
    numberOfSurgeries: safeParseInt(formData.numberOfSurgeries as string | number),
    hasOtb: formData.hasOtb || undefined
  };
  
  // Filtrar valores undefined para limpiar el objeto
  const cleanInput = Object.fromEntries(
    Object.entries(input).filter(([_, value]) => value !== undefined)
  ) as SmartFertilityInput;
  
  console.log('✅ Mapped SmartFertilityInput:', cleanInput);
  
  return cleanInput;
}
