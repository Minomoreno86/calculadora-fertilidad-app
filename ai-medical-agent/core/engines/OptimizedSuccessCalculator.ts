/**
 * 📊 CALCULADORA DE TASAS DE ÉXITO OPTIMIZADA
 * Sistema eficiente para predicciones probabilísticas
 */

import { 
  UserInput, 
  SuccessRate, 
  OperationResult,
  ClinicalAnalysis
} from '../types/UnifiedTypes';

export class OptimizedSuccessCalculator {
  private static instance: OptimizedSuccessCalculator;
  
  // Datos base de éxito por técnica y edad (2024-2025)
  private static readonly BASE_SUCCESS_RATES = {
    IUI: {
      '<30': 0.12,
      '30-34': 0.10,
      '35-39': 0.08,
      '40-42': 0.05,
      '>42': 0.03
    },
    IVF: {
      '<30': 0.45,
      '30-34': 0.38,
      '35-39': 0.30,
      '40-42': 0.20,
      '>42': 0.08
    },
    FET: {
      '<30': 0.42,
      '30-34': 0.35,
      '35-39': 0.28,
      '40-42': 0.18,
      '>42': 0.06
    },
    DONOR_EGG: {
      'all_ages': 0.55
    }
  };

  private constructor() {}

  public static getInstance(): OptimizedSuccessCalculator {
    if (!OptimizedSuccessCalculator.instance) {
      OptimizedSuccessCalculator.instance = new OptimizedSuccessCalculator();
    }
    return OptimizedSuccessCalculator.instance;
  }

  /**
   * 🎯 CÁLCULO PRINCIPAL DE TASAS DE ÉXITO
   */
  public async calculateSuccessRates(
    userInput: UserInput,
    clinicalAnalysis?: ClinicalAnalysis
  ): Promise<OperationResult<SuccessRate[]>> {
    const startTime = performance.now();

    try {
      const ageGroup = this.getAgeGroup(userInput.age);
      const successRates: SuccessRate[] = [];

      // 1. IUI (Inseminación Intrauterina)
      const iuiRate = this.calculateIUISuccess(userInput, ageGroup, clinicalAnalysis);
      if (iuiRate.probabilityPerCycle > 0.03) { // Solo si >3%
        successRates.push(iuiRate);
      }

      // 2. FIV (Fertilización in Vitro)
      const ivfRate = this.calculateIVFSuccess(userInput, ageGroup, clinicalAnalysis);
      successRates.push(ivfRate);

      // 3. FET (Transferencia de Embriones Congelados)
      const fetRate = this.calculateFETSuccess(userInput, ageGroup, clinicalAnalysis);
      successRates.push(fetRate);

      // 4. Ovodonación (si está indicada)
      if (this.isOvodonationIndicated(userInput, clinicalAnalysis)) {
        const donorRate = this.calculateDonorEggSuccess(userInput);
        successRates.push(donorRate);
      }

      // Ordenar por probabilidad de éxito
      successRates.sort((a, b) => b.probabilityPerCycle - a.probabilityPerCycle);

      const processingTime = performance.now() - startTime;

      return {
        success: true,
        data: successRates,
        metadata: {
          processingTime,
          confidence: 85,
          evidenceLevel: 'A'
        }
      };

    } catch (error) {
      return {
        success: false,
        error: {
          code: 'CALCULATION_ERROR',
          message: `Error calculando tasas de éxito: ${error}`,
          details: error
        }
      };
    }
  }

  /**
   * 🏥 CÁLCULO IUI
   */
  private calculateIUISuccess(
    userInput: UserInput, 
    ageGroup: string, 
    clinicalAnalysis?: ClinicalAnalysis
  ): SuccessRate {
    let baseRate = OptimizedSuccessCalculator.BASE_SUCCESS_RATES.IUI[ageGroup as keyof typeof OptimizedSuccessCalculator.BASE_SUCCESS_RATES.IUI] || 0.05;

    // Ajustes por factores específicos
    let adjustment = 1.0;

    // BMI
    if (userInput.bmi) {
      if (userInput.bmi < 18.5 || userInput.bmi > 30) {
        adjustment *= 0.8; // -20%
      } else if (userInput.bmi > 25) {
        adjustment *= 0.9; // -10%
      }
    }

    // Duración de infertilidad
    if (userInput.infertilityDuration >= 24) {
      adjustment *= 0.85; // -15%
    }

    // Factores del diagnóstico
    if (clinicalAnalysis?.primaryDiagnosis.pathology.includes('PCOS')) {
      adjustment *= 1.1; // +10% con estimulación apropiada
    }
    if (clinicalAnalysis?.primaryDiagnosis.pathology.includes('DIMINISHED_OVARIAN_RESERVE')) {
      adjustment *= 0.7; // -30%
    }

    // AMH
    if (userInput.labs?.amh) {
      if (userInput.labs.amh < 1.0) adjustment *= 0.8;
      if (userInput.labs.amh < 0.5) adjustment *= 0.6;
    }

    // Factor masculino
    if (userInput.partner?.spermAnalysis) {
      const sa = userInput.partner.spermAnalysis;
      if (sa.concentration && sa.concentration < 15) adjustment *= 0.8;
      if (sa.motility && sa.motility < 40) adjustment *= 0.8;
    }

    const finalRate = Math.max(0.01, baseRate * adjustment); // Mínimo 1%

    return {
      technique: 'IUI - Inseminación Intrauterina',
      probabilityPerCycle: finalRate,
      probabilityAfter3Cycles: 1 - Math.pow(1 - finalRate, 3),
      probabilityAfter6Cycles: 1 - Math.pow(1 - finalRate, 6),
      recommendation: this.generateIUIRecommendation(finalRate, userInput.age),
      costEffectiveness: finalRate > 0.08 ? 'high' : finalRate > 0.05 ? 'medium' : 'low',
      evidenceQuality: 'A'
    };
  }

  /**
   * 🧪 CÁLCULO FIV
   */
  private calculateIVFSuccess(
    userInput: UserInput, 
    ageGroup: string, 
    clinicalAnalysis?: ClinicalAnalysis
  ): SuccessRate {
    let baseRate = OptimizedSuccessCalculator.BASE_SUCCESS_RATES.IVF[ageGroup as keyof typeof OptimizedSuccessCalculator.BASE_SUCCESS_RATES.IVF] || 0.15;

    let adjustment = 1.0;

    // BMI
    if (userInput.bmi) {
      if (userInput.bmi < 18.5 || userInput.bmi > 35) {
        adjustment *= 0.75;
      } else if (userInput.bmi > 30) {
        adjustment *= 0.85;
      }
    }

    // AMH (factor crítico en FIV)
    if (userInput.labs?.amh) {
      if (userInput.labs.amh >= 2.5) adjustment *= 1.15; // +15%
      else if (userInput.labs.amh < 1.0) adjustment *= 0.8; // -20%
      else if (userInput.labs.amh < 0.5) adjustment *= 0.6; // -40%
    }

    // Diagnóstico principal
    if (clinicalAnalysis?.primaryDiagnosis.pathology.includes('TUBAL_FACTOR')) {
      adjustment *= 1.1; // FIV ideal para factor tubárico
    }
    if (clinicalAnalysis?.primaryDiagnosis.pathology.includes('ENDOMETRIOSIS_SEVERE')) {
      adjustment *= 0.85;
    }

    const finalRate = Math.max(0.05, baseRate * adjustment);

    return {
      technique: 'FIV - Fertilización In Vitro',
      probabilityPerCycle: finalRate,
      probabilityAfter3Cycles: 1 - Math.pow(1 - finalRate, 3),
      probabilityAfter6Cycles: 1 - Math.pow(1 - finalRate, 6),
      recommendation: this.generateIVFRecommendation(finalRate, userInput.age),
      costEffectiveness: finalRate > 0.25 ? 'high' : finalRate > 0.15 ? 'medium' : 'low',
      evidenceQuality: 'A'
    };
  }

  /**
   * ❄️ CÁLCULO FET
   */
  private calculateFETSuccess(
    userInput: UserInput, 
    ageGroup: string, 
    clinicalAnalysis?: ClinicalAnalysis
  ): SuccessRate {
    let baseRate = OptimizedSuccessCalculator.BASE_SUCCESS_RATES.FET[ageGroup as keyof typeof OptimizedSuccessCalculator.BASE_SUCCESS_RATES.FET] || 0.12;

    let adjustment = 1.0;

    // Las tasas FET son generalmente ligeramente menores que fresh IVF
    adjustment *= 0.95;

    // Factores endometriales
    if (clinicalAnalysis?.primaryDiagnosis.pathology.includes('ENDOMETRIOSIS')) {
      adjustment *= 0.9; // Impacto en receptividad endometrial
    }

    // BMI tiene menos impacto en FET
    if (userInput.bmi && userInput.bmi > 35) {
      adjustment *= 0.9;
    }

    const finalRate = Math.max(0.03, baseRate * adjustment);

    return {
      technique: 'FET - Transferencia Embriones Congelados',
      probabilityPerCycle: finalRate,
      probabilityAfter3Cycles: 1 - Math.pow(1 - finalRate, 3),
      probabilityAfter6Cycles: 1 - Math.pow(1 - finalRate, 6),
      recommendation: 'Opción cuando hay embriones congelados de calidad',
      costEffectiveness: finalRate > 0.20 ? 'high' : 'medium',
      evidenceQuality: 'A'
    };
  }

  /**
   * 🥚 CÁLCULO OVODONACIÓN
   */
  private calculateDonorEggSuccess(userInput: UserInput): SuccessRate {
    let baseRate = OptimizedSuccessCalculator.BASE_SUCCESS_RATES.DONOR_EGG.all_ages;
    
    let adjustment = 1.0;

    // Factores uterinos
    if (userInput.age > 45) adjustment *= 0.9;
    if (userInput.bmi && userInput.bmi > 35) adjustment *= 0.9;

    const finalRate = baseRate * adjustment;

    return {
      technique: 'Ovodonación',
      probabilityPerCycle: finalRate,
      probabilityAfter3Cycles: 1 - Math.pow(1 - finalRate, 3),
      probabilityAfter6Cycles: 1 - Math.pow(1 - finalRate, 6),
      recommendation: 'Excelente opción cuando la calidad ovocitaria es el factor limitante',
      costEffectiveness: 'high',
      evidenceQuality: 'A'
    };
  }

  /**
   * 🔧 MÉTODOS UTILITARIOS
   */
  private getAgeGroup(age: number): string {
    if (age < 30) return '<30';
    if (age <= 34) return '30-34';
    if (age <= 39) return '35-39';
    if (age <= 42) return '40-42';
    return '>42';
  }

  private isOvodonationIndicated(userInput: UserInput, clinicalAnalysis?: ClinicalAnalysis): boolean {
    // Indicaciones claras para ovodonación
    if (userInput.age >= 43) return true;
    if (userInput.labs?.amh && userInput.labs.amh < 0.3) return true;
    if (userInput.labs?.fsh && userInput.labs.fsh > 20) return true;
    if (clinicalAnalysis?.riskStratification.level === 'critical') return true;
    
    return false;
  }

  private generateIUIRecommendation(rate: number, age: number): string {
    if (rate < 0.05) return 'IUI no recomendada - considerar FIV directamente';
    if (age >= 38) return 'Máximo 3 ciclos IUI antes de FIV';
    if (rate > 0.10) return 'Opción válida - intentar 3-6 ciclos';
    return 'Considerar después de optimización lifestyle';
  }

  private generateIVFRecommendation(rate: number, age: number): string {
    if (age >= 40) return 'Primera línea por factor edad';
    if (rate > 0.30) return 'Excelente pronóstico - alta probabilidad éxito';
    if (rate > 0.20) return 'Buen pronóstico - opción recomendada';
    return 'Opción disponible - discutir alternativas';
  }
}

// Exportar instancia singleton
export const successCalculator = OptimizedSuccessCalculator.getInstance();
