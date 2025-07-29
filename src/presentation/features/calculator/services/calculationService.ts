// ===================================================================
// 🎯 SERVICIO DE CÁLCULO V4.0 - CONSOLIDADO CON MODULAR ENGINE
// ===================================================================

import { ModularFertilityEngine } from '../../../../core/domain/services/modular';
import { mapFormStateToUserInput } from '../utils/dataMapper';
import { FormState, CalculationResult } from '../types/calculator.types';

/**
 * Servicio para realizar cálculos de probabilidad de fertilidad V4.0
 * CONSOLIDADO - Usa ModularFertilityEngine unificado para App Store
 */
export class CalculationService {
  
  /**
   * Ejecuta el cálculo de probabilidad con UnifiedEngine
   */
  static async executeCalculation(
    formData: FormState,
    calculatedBmi: number | null,
    calculatedHoma: number | null
  ): Promise<CalculationResult> {
    const startTime = performance.now();
    
    try {
      // 🔍 Validar datos de entrada
      const validationResult = this.validateCalculationInput(formData, calculatedBmi, calculatedHoma);
      if (!validationResult.isValid) {
        return {
          success: false,
          error: validationResult.error
        };
      }

      // 🔄 Convertir FormState (strings) a datos numéricos para el motor
      const convertedFormData = _convertFormStateForMapping(formData);
      
      // 🔄 Mapear datos del formulario a UserInput
      const userInput = mapFormStateToUserInput(convertedFormData as unknown as FormState, calculatedBmi, calculatedHoma);
      
      // ⚡ Ejecutar cálculo con ModularFertilityEngine V4.0 (CONSOLIDADO)
      const modularEngine = new ModularFertilityEngine();
      const evaluation = await modularEngine.calculate(userInput);
      
      const executionTime = performance.now() - startTime;
      
      // Extraer métricas del resultado modular
      const metrics = {
        totalCalculationTime: executionTime,
        engineMode: 'modular',
        complexity: 'optimized'
      };
      
      return {
        success: true,
        data: {
          evaluation,
          report: evaluation.report
        },
        performance: {
          executionTime,
          cacheHit: false // El motor maneja esto internamente
        }
      };
      
    } catch (error) {
      const executionTime = performance.now() - startTime;
      
      console.error('🚨 Error en CalculationService:', error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido en el cálculo',
        performance: {
          executionTime,
          cacheHit: false
        }
      };
    }
  }

  /**
   * Valida que los datos de entrada sean suficientes para el cálculo
   */
  private static validateCalculationInput(
    formData: FormState,
    calculatedBmi: number | null,
    _calculatedHoma: number | null
  ): { isValid: boolean; error?: string } {
    
    // Validar campos básicos obligatorios
    const requiredFields = ['age', 'weight', 'height', 'cycleLength', 'infertilityDuration'];
    
    for (const field of requiredFields) {
      const value = formData[field as keyof FormState];
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        return {
          isValid: false,
          error: `Campo obligatorio faltante: ${field}`
        };
      }
      
      if (typeof value === 'string') {
        const numValue = parseFloat(value);
        if (isNaN(numValue) || numValue <= 0) {
          return {
            isValid: false,
            error: `Valor inválido en campo: ${field}`
          };
        }
      }
    }

    // Validar BMI calculado
    if (!calculatedBmi || isNaN(calculatedBmi) || calculatedBmi <= 0) {
      return {
        isValid: false,
        error: 'BMI inválido - verificar peso y altura'
      };
    }

    // Validaciones de rango
    const age = parseFloat(formData.age);
    if (age < 15 || age > 55) {
      return {
        isValid: false,
        error: 'Edad fuera de rango válido (15-55 años)'
      };
    }

    const cycleLength = parseFloat(formData.cycleLength);
    if (cycleLength < 15 || cycleLength > 90) {
      return {
        isValid: false,
        error: 'Duración de ciclo fuera de rango válido (15-90 días)'
      };
    }

    return { isValid: true };
  }

  /**
   * Obtiene estadísticas del servicio
   */
  static getServiceStats() {
    return {
      version: '1.0.0',
      lastUpdate: new Date().toISOString(),
      features: [
        'Validación de entrada',
        'Mapeo de datos',
        'Manejo de errores',
        'Métricas de rendimiento'
      ]
    };
  }

  /**
   * Valida si el formulario está listo para cálculo
   */
  static isReadyForCalculation(
    formData: FormState,
    calculatedBmi: number | null
  ): { ready: boolean; missingFields?: string[] } {
    const validation = this.validateCalculationInput(formData, calculatedBmi, null);
    
    if (validation.isValid) {
      return { ready: true };
    }

    // Extraer campos faltantes del mensaje de error
    const missingFields: string[] = [];
    if (validation.error?.includes('Campo obligatorio faltante')) {
      const field = validation.error.split(': ')[1];
      if (field) missingFields.push(field);
    }

    return {
      ready: false,
      missingFields: missingFields.length > 0 ? missingFields : ['Datos insuficientes']
    };
  }
}

// 🔧 HELPER: Convertir FormState (strings) a formato numerico para dataMapper
function _convertFormStateForMapping(formData: FormState) {
  const safeParseNumber = (value: string | number | undefined): number | string => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      // ❌ FIX: NO convertir strings vacíos a 0, mantenerlos como string vacío
      if (value.trim() === '') return value; // Mantener string vacío
      const parsed = parseFloat(value);
      return isNaN(parsed) ? value : parsed; // Retornar valor original si no es número válido
    }
    return value || '';
  };

  // Retornar objeto compatible con OriginalFormState simplificado
  return {
    ...formData,
    age: safeParseNumber(formData.age),
    cycleLength: safeParseNumber(formData.cycleLength),
    // 🔄 MANTENER infertilityDuration como string para conversión años→meses en DataMapper
    infertilityDuration: formData.infertilityDuration, // No convertir aquí, let DataMapper handle años→meses
    endometriosisStage: safeParseNumber(formData.endometriosisStage),
    amhValue: safeParseNumber(formData.amhValue),
    tshValue: safeParseNumber(formData.tshValue),
    prolactinValue: safeParseNumber(formData.prolactinValue),
    spermConcentration: safeParseNumber(formData.spermConcentration),
    spermProgressiveMotility: safeParseNumber(formData.spermProgressiveMotility),
    spermNormalMorphology: safeParseNumber(formData.spermNormalMorphology),
    glucoseValue: safeParseNumber(formData.glucoseValue),
    insulinValue: safeParseNumber(formData.insulinValue)
  };
}
