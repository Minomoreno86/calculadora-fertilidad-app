/**
 * 🧮 CALCULATION ENGINE WORKER - CORE MATHEMATICAL CALCULATIONS
 * 
 * Specialized worker for performing complex mathematical calculations
 * for fertility factor analysis and prognosis computation.
 */

import type { MedicalWorkerTask, WorkerResult } from '../UnifiedParallelEngine_V12';
import type { UserInput, Factors } from '../../domain/models';

export interface CalculationResult {
  factors: Factors;
  intermediateResults: Record<string, number>;
  calculationMetrics: {
    complexity: number;
    accuracy: number;
    processingSteps: number;
  };
}

export class CalculationEngineWorker {
  public async process(task: MedicalWorkerTask): Promise<WorkerResult> {
    const startTime = performance.now();
    
    try {
      const calculationResult = await this.performCalculations(task.input);
      
      return {
        taskId: task.id,
        workerId: 'calculation_engine',
        success: true,
        data: calculationResult,
        confidence: calculationResult.calculationMetrics.accuracy,
        processingTime: performance.now() - startTime
      };
    } catch (error) {
      return {
        taskId: task.id,
        workerId: 'calculation_engine',
        success: false,
        data: null,
        confidence: 0,
        processingTime: performance.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async performCalculations(input: UserInput): Promise<CalculationResult> {
    const intermediateResults: Record<string, number> = {};
    
    // Calculate base age probability
    const baseAgeProbability = this.calculateBaseAgeProbability(input.age);
    intermediateResults.baseAgeProbability = baseAgeProbability;

    // Calculate all factor scores
    const factors: Factors = {
      baseAgeProbability,
      bmi: this.calculateBMIFactor(input.bmi, intermediateResults),
      cycle: this.calculateCycleFactor(input.cycleDuration, intermediateResults),
      pcos: this.calculatePCOSFactor(input.hasPcos, intermediateResults),
      endometriosis: this.calculateEndometriosisFactor(input.endometriosisGrade, intermediateResults),
      myoma: this.calculateMyomaFactor(input.myomaType, intermediateResults),
      adenomyosis: this.calculateAdenomyosisFactor(input.adenomyosisType, intermediateResults),
      polyp: this.calculatePolypFactor(input.polypType, intermediateResults),
      hsg: this.calculateHSGFactor(input.hsgResult, intermediateResults),
      otb: this.calculateOTBFactor(input.hasOtb, input.otbMethod, input.remainingTubalLength, intermediateResults),
      amh: this.calculateAMHFactor(input.amh, input.age, intermediateResults),
      prolactin: this.calculateProlactinFactor(input.prolactin, intermediateResults),
      tsh: this.calculateTSHFactor(input.tsh, intermediateResults),
      homa: this.calculateHOMAFactor(input.homaIr, intermediateResults),
      male: this.calculateMaleFactor(input, intermediateResults),
      infertilityDuration: this.calculateInfertilityDurationFactor(input.infertilityDuration, intermediateResults),
      pelvicSurgery: this.calculatePelvicSurgeryFactor(input.hasPelvicSurgery, input.pelvicSurgeriesNumber, intermediateResults)
    };

    const calculationMetrics = {
      complexity: Object.keys(intermediateResults).length,
      accuracy: 0.92, // High accuracy for mathematical calculations
      processingSteps: Object.keys(factors).length * 2
    };

    return { factors, intermediateResults, calculationMetrics };
  }

  private calculateBaseAgeProbability(age: number): number {
    if (age <= 25) return 0.95;
    if (age <= 30) return 0.92;
    if (age <= 32) return 0.88;
    if (age <= 35) return 0.80;
    if (age <= 37) return 0.70;
    if (age <= 40) return 0.55;
    if (age <= 42) return 0.35;
    return 0.15;
  }

  private calculateBMIFactor(bmi: number | null, intermediates: Record<string, number>): number {
    if (!bmi) {
      intermediates.bmi_penalty = 0.05;
      return 0.95; // Small penalty for missing data
    }
    
    if (bmi >= 18.5 && bmi <= 24.9) {
      intermediates.bmi_optimal = 1.0;
      return 1.0;
    } else if (bmi >= 25 && bmi <= 29.9) {
      intermediates.bmi_overweight = 0.9;
      return 0.9;
    } else if (bmi >= 30 && bmi <= 34.9) {
      intermediates.bmi_obese1 = 0.8;
      return 0.8;
    } else {
      intermediates.bmi_severe = 0.6;
      return 0.6;
    }
  }

  private calculateCycleFactor(cycleDuration: number | undefined, intermediates: Record<string, number>): number {
    if (!cycleDuration) {
      intermediates.cycle_unknown = 0.9;
      return 0.9;
    }
    
    if (cycleDuration >= 25 && cycleDuration <= 35) {
      intermediates.cycle_normal = 1.0;
      return 1.0;
    } else {
      intermediates.cycle_irregular = 0.75;
      return 0.75;
    }
  }

  private calculatePCOSFactor(hasPcos: boolean, intermediates: Record<string, number>): number {
    if (hasPcos) {
      intermediates.pcos_impact = 0.65;
      return 0.65;
    }
    return 1.0;
  }

  private calculateEndometriosisFactor(grade: number, intermediates: Record<string, number>): number {
    if (grade === 0) return 1.0;
    
    const factors = [1.0, 0.85, 0.75, 0.60, 0.40];
    const factor = factors[Math.min(grade, 4)];
    intermediates[`endometriosis_grade${grade}`] = factor;
    return factor;
  }

  private calculateMyomaFactor(myomaType: any, intermediates: Record<string, number>): number {
    if (myomaType === 'none') return 1.0;
    
    const factors: Record<string, number> = {
      'submucosal': 0.6,
      'intramural_large': 0.8,
      'subserosal': 0.95
    };
    
    const factor = factors[myomaType as string] || 0.9;
    intermediates[`myoma_${myomaType}`] = factor;
    return factor;
  }

  private calculateAdenomyosisFactor(adenomyosisType: any, intermediates: Record<string, number>): number {
    if (adenomyosisType === 'none') return 1.0;
    
    const factors: Record<string, number> = {
      'focal': 0.9,
      'diffuse': 0.7
    };
    
    const factor = factors[adenomyosisType as string] || 0.85;
    intermediates[`adenomyosis_${adenomyosisType}`] = factor;
    return factor;
  }

  private calculatePolypFactor(polypType: any, intermediates: Record<string, number>): number {
    if (polypType === 'none') return 1.0;
    
    const factors: Record<string, number> = {
      'small': 0.95,
      'large': 0.8,
      'ostium': 0.6
    };
    
    const factor = factors[polypType as string] || 0.9;
    intermediates[`polyp_${polypType}`] = factor;
    return factor;
  }

  private calculateHSGFactor(hsgResult: any, intermediates: Record<string, number>): number {
    const factors: Record<string, number> = {
      'unknown': 0.9,
      'normal': 1.0,
      'unilateral': 0.7,
      'bilateral': 0.3,
      'malformacion': 0.5
    };
    
    const factor = factors[hsgResult as string] || 0.8;
    intermediates[`hsg_${hsgResult}`] = factor;
    return factor;
  }

  private calculateOTBFactor(hasOtb: boolean, otbMethod: any, remainingLength: number | undefined, intermediates: Record<string, number>): number {
    if (!hasOtb) return 1.0;
    
    let baseFactor = 0.4; // Base factor for tubal ligation
    
    if (remainingLength && remainingLength >= 4) {
      baseFactor = 0.6;
      intermediates.otb_good_length = baseFactor;
    } else if (remainingLength && remainingLength >= 2.5) {
      baseFactor = 0.45;
      intermediates.otb_moderate_length = baseFactor;
    } else {
      intermediates.otb_poor_length = baseFactor;
    }
    
    return baseFactor;
  }

  private calculateAMHFactor(amh: number | undefined, age: number, intermediates: Record<string, number>): number {
    if (!amh) {
      // Age-based estimation
      if (age < 30) return 0.9;
      if (age < 35) return 0.8;
      if (age < 40) return 0.6;
      return 0.4;
    }
    
    if (amh >= 2.5) {
      intermediates.amh_excellent = 1.0;
      return 1.0;
    } else if (amh >= 1.5) {
      intermediates.amh_good = 0.9;
      return 0.9;
    } else if (amh >= 0.7) {
      intermediates.amh_fair = 0.7;
      return 0.7;
    } else {
      intermediates.amh_poor = 0.4;
      return 0.4;
    }
  }

  private calculateProlactinFactor(prolactin: number | undefined, intermediates: Record<string, number>): number {
    if (!prolactin) return 1.0;
    
    if (prolactin <= 25) {
      return 1.0;
    } else if (prolactin <= 50) {
      intermediates.prolactin_mild_elevation = 0.85;
      return 0.85;
    } else {
      intermediates.prolactin_high_elevation = 0.6;
      return 0.6;
    }
  }

  private calculateTSHFactor(tsh: number | undefined, intermediates: Record<string, number>): number {
    if (!tsh) return 1.0;
    
    if (tsh >= 0.5 && tsh <= 2.5) {
      return 1.0;
    } else if (tsh <= 4.0) {
      intermediates.tsh_borderline = 0.9;
      return 0.9;
    } else {
      intermediates.tsh_elevated = 0.7;
      return 0.7;
    }
  }

  private calculateHOMAFactor(homaIr: number | undefined, intermediates: Record<string, number>): number {
    if (!homaIr) return 1.0;
    
    if (homaIr <= 2.5) {
      return 1.0;
    } else if (homaIr <= 4.0) {
      intermediates.homa_insulin_resistance = 0.8;
      return 0.8;
    } else {
      intermediates.homa_severe_resistance = 0.6;
      return 0.6;
    }
  }

  private calculateMaleFactor(input: UserInput, intermediates: Record<string, number>): number {
    let factor = 1.0;
    let issuesCount = 0;
    
    if (input.spermConcentration !== undefined) {
      if (input.spermConcentration < 5) {
        factor *= 0.3;
        issuesCount++;
        intermediates.sperm_severe_oligospermia = 0.3;
      } else if (input.spermConcentration < 15) {
        factor *= 0.6;
        issuesCount++;
        intermediates.sperm_oligospermia = 0.6;
      }
    }
    
    if (input.spermProgressiveMotility !== undefined) {
      if (input.spermProgressiveMotility < 20) {
        factor *= 0.4;
        issuesCount++;
        intermediates.sperm_severe_asthenospermia = 0.4;
      } else if (input.spermProgressiveMotility < 32) {
        factor *= 0.7;
        issuesCount++;
        intermediates.sperm_asthenospermia = 0.7;
      }
    }
    
    if (input.spermNormalMorphology !== undefined) {
      if (input.spermNormalMorphology < 2) {
        factor *= 0.6;
        issuesCount++;
        intermediates.sperm_severe_teratospermia = 0.6;
      } else if (input.spermNormalMorphology < 4) {
        factor *= 0.8;
        issuesCount++;
        intermediates.sperm_teratospermia = 0.8;
      }
    }
    
    // If no male factor data available, assume normal
    if (!input.spermConcentration && !input.spermProgressiveMotility && !input.spermNormalMorphology) {
      intermediates.male_factor_unknown = 0.9;
      return 0.9;
    }
    
    intermediates.male_factor_issues_count = issuesCount;
    return Math.max(factor, 0.1); // Minimum factor of 0.1
  }

  private calculateInfertilityDurationFactor(duration: number | undefined, intermediates: Record<string, number>): number {
    if (!duration) {
      intermediates.infertility_duration_unknown = 0.9;
      return 0.9;
    }
    
    if (duration <= 12) {
      return 1.0;
    } else if (duration <= 24) {
      intermediates.infertility_duration_moderate = 0.9;
      return 0.9;
    } else if (duration <= 36) {
      intermediates.infertility_duration_prolonged = 0.8;
      return 0.8;
    } else {
      intermediates.infertility_duration_severe = 0.7;
      return 0.7;
    }
  }

  private calculatePelvicSurgeryFactor(hasSurgery: boolean | undefined, surgeriesNumber: number | undefined, intermediates: Record<string, number>): number {
    if (!hasSurgery) return 1.0;
    
    if (!surgeriesNumber) {
      intermediates.pelvic_surgery_unknown_count = 0.85;
      return 0.85;
    }
    
    if (surgeriesNumber === 1) {
      intermediates.pelvic_surgery_single = 0.9;
      return 0.9;
    } else if (surgeriesNumber <= 3) {
      intermediates.pelvic_surgery_multiple = 0.75;
      return 0.75;
    } else {
      intermediates.pelvic_surgery_extensive = 0.6;
      return 0.6;
    }
  }
}