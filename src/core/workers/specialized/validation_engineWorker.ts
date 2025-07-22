/**
 * ✅ VALIDATION ENGINE WORKER - INPUT VALIDATION AND SANITIZATION
 * 
 * Specialized worker for comprehensive input validation, data sanitization,
 * and clinical range checking for fertility calculator inputs.
 */

import type { MedicalWorkerTask, WorkerResult } from '../UnifiedParallelEngine_V12';
import type { UserInput } from '../../domain/models';

export interface ValidationResult {
  isValid: boolean;
  sanitizedInput: UserInput;
  warnings: ValidationWarning[];
  errors: ValidationError[];
  completenessScore: number;
  recommendedTests: string[];
}

export interface ValidationWarning {
  field: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
  suggestion: string;
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
  isBlocking: boolean;
}

export class ValidationEngineWorker {
  private validationRules: Map<string, any>;

  constructor() {
    this.validationRules = new Map();
    this.initializeValidationRules();
  }

  public async process(task: MedicalWorkerTask): Promise<WorkerResult> {
    const startTime = performance.now();
    
    try {
      const validationResult = await this.performValidation(task.input);
      
      return {
        taskId: task.id,
        workerId: 'validation_engine',
        success: true,
        data: validationResult,
        confidence: validationResult.isValid ? 0.95 : 0.7,
        processingTime: performance.now() - startTime,
        recommendations: validationResult.recommendedTests
      };
    } catch (error) {
      return {
        taskId: task.id,
        workerId: 'validation_engine',
        success: false,
        data: null,
        confidence: 0,
        processingTime: performance.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async performValidation(input: UserInput): Promise<ValidationResult> {
    const warnings: ValidationWarning[] = [];
    const errors: ValidationError[] = [];
    const sanitizedInput = { ...input };

    // Validate and sanitize each field
    this.validateAge(sanitizedInput, warnings, errors);
    this.validateBMI(sanitizedInput, warnings, errors);
    this.validateCycleDuration(sanitizedInput, warnings, errors);
    this.validateInfertilityDuration(sanitizedInput, warnings, errors);
    this.validateHormonalValues(sanitizedInput, warnings, errors);
    this.validateMaleFactorValues(sanitizedInput, warnings, errors);
    this.validateConsistency(sanitizedInput, warnings, errors);

    // Calculate completeness score
    const completenessScore = this.calculateCompletenessScore(sanitizedInput);

    // Generate recommended tests based on missing data
    const recommendedTests = this.generateRecommendedTests(sanitizedInput, warnings);

    const isValid = errors.filter(e => e.isBlocking).length === 0;

    return {
      isValid,
      sanitizedInput,
      warnings,
      errors,
      completenessScore,
      recommendedTests
    };
  }

  private validateAge(input: UserInput, warnings: ValidationWarning[], errors: ValidationError[]): void {
    if (!input.age || input.age < 18 || input.age > 50) {
      errors.push({
        field: 'age',
        message: 'Edad debe estar entre 18 y 50 años',
        code: 'AGE_OUT_OF_RANGE',
        isBlocking: true
      });
      return;
    }

    // Sanitize age
    input.age = Math.round(input.age);

    // Age-related warnings
    if (input.age >= 35) {
      warnings.push({
        field: 'age',
        message: 'Edad materna avanzada (≥35 años)',
        severity: input.age >= 40 ? 'high' : 'medium',
        suggestion: 'Considerar evaluación urgente de fertilidad'
      });
    }
  }

  private validateBMI(input: UserInput, warnings: ValidationWarning[], errors: ValidationError[]): void {
    if (input.bmi !== null) {
      if (input.bmi < 15 || input.bmi > 60) {
        errors.push({
          field: 'bmi',
          message: 'IMC fuera de rango válido (15-60)',
          code: 'BMI_OUT_OF_RANGE',
          isBlocking: false
        });
        input.bmi = null; // Sanitize invalid BMI
        return;
      }

      // BMI warnings
      if (input.bmi < 18.5) {
        warnings.push({
          field: 'bmi',
          message: 'Bajo peso (IMC < 18.5)',
          severity: 'medium',
          suggestion: 'Evaluación nutricional recomendada'
        });
      } else if (input.bmi >= 30) {
        warnings.push({
          field: 'bmi',
          message: 'Obesidad (IMC ≥ 30)',
          severity: 'high',
          suggestion: 'Control de peso antes de tratamientos de fertilidad'
        });
      } else if (input.bmi >= 25) {
        warnings.push({
          field: 'bmi',
          message: 'Sobrepeso (IMC 25-29.9)',
          severity: 'low',
          suggestion: 'Optimización del peso recomendada'
        });
      }
    } else {
      warnings.push({
        field: 'bmi',
        message: 'IMC no proporcionado',
        severity: 'low',
        suggestion: 'Calcular IMC para evaluación completa'
      });
    }
  }

  private validateCycleDuration(input: UserInput, warnings: ValidationWarning[], errors: ValidationError[]): void {
    if (input.cycleDuration !== undefined) {
      if (input.cycleDuration < 14 || input.cycleDuration > 90) {
        errors.push({
          field: 'cycleDuration',
          message: 'Duración del ciclo fuera de rango (14-90 días)',
          code: 'CYCLE_OUT_OF_RANGE',
          isBlocking: false
        });
        input.cycleDuration = undefined;
        return;
      }

      // Cycle duration warnings
      if (input.cycleDuration < 21 || input.cycleDuration > 35) {
        warnings.push({
          field: 'cycleDuration',
          message: 'Ciclo menstrual irregular',
          severity: 'medium',
          suggestion: 'Evaluación hormonal para descartar anovulación'
        });
      }
    }
  }

  private validateInfertilityDuration(input: UserInput, warnings: ValidationWarning[], errors: ValidationError[]): void {
    if (input.infertilityDuration !== undefined) {
      if (input.infertilityDuration < 0 || input.infertilityDuration > 240) {
        errors.push({
          field: 'infertilityDuration',
          message: 'Duración de infertilidad fuera de rango (0-240 meses)',
          code: 'INFERTILITY_DURATION_OUT_OF_RANGE',
          isBlocking: false
        });
        input.infertilityDuration = undefined;
        return;
      }

      // Duration warnings
      if (input.infertilityDuration > 36) {
        warnings.push({
          field: 'infertilityDuration',
          message: 'Infertilidad prolongada (>3 años)',
          severity: 'high',
          suggestion: 'Evaluación especializada urgente'
        });
      }
    }
  }

  private validateHormonalValues(input: UserInput, warnings: ValidationWarning[], errors: ValidationError[]): void {
    // AMH validation
    if (input.amh !== undefined) {
      if (input.amh < 0 || input.amh > 20) {
        errors.push({
          field: 'amh',
          message: 'Valor de AMH fuera de rango (0-20 ng/mL)',
          code: 'AMH_OUT_OF_RANGE',
          isBlocking: false
        });
        input.amh = undefined;
      } else if (input.amh < 0.7) {
        warnings.push({
          field: 'amh',
          message: 'AMH muy baja - reserva ovárica comprometida',
          severity: 'high',
          suggestion: 'Tratamiento urgente de fertilidad'
        });
      }
    }

    // Prolactin validation
    if (input.prolactin !== undefined) {
      if (input.prolactin < 0 || input.prolactin > 500) {
        errors.push({
          field: 'prolactin',
          message: 'Valor de prolactina fuera de rango (0-500 ng/mL)',
          code: 'PROLACTIN_OUT_OF_RANGE',
          isBlocking: false
        });
        input.prolactin = undefined;
      } else if (input.prolactin > 25) {
        warnings.push({
          field: 'prolactin',
          message: 'Prolactina elevada',
          severity: 'medium',
          suggestion: 'Evaluación de hiperprolactinemia'
        });
      }
    }

    // TSH validation
    if (input.tsh !== undefined) {
      if (input.tsh < 0 || input.tsh > 50) {
        errors.push({
          field: 'tsh',
          message: 'Valor de TSH fuera de rango (0-50 mIU/L)',
          code: 'TSH_OUT_OF_RANGE',
          isBlocking: false
        });
        input.tsh = undefined;
      } else if (input.tsh > 4.5) {
        warnings.push({
          field: 'tsh',
          message: 'TSH elevada - hipotiroidismo',
          severity: 'medium',
          suggestion: 'Evaluación tiroidea completa'
        });
      }
    }

    // HOMA-IR validation
    if (input.homaIr !== undefined) {
      if (input.homaIr < 0 || input.homaIr > 20) {
        errors.push({
          field: 'homaIr',
          message: 'Valor de HOMA-IR fuera de rango (0-20)',
          code: 'HOMA_OUT_OF_RANGE',
          isBlocking: false
        });
        input.homaIr = undefined;
      } else if (input.homaIr > 2.5) {
        warnings.push({
          field: 'homaIr',
          message: 'HOMA-IR elevado - resistencia a insulina',
          severity: 'medium',
          suggestion: 'Manejo de resistencia a insulina'
        });
      }
    }
  }

  private validateMaleFactorValues(input: UserInput, warnings: ValidationWarning[], errors: ValidationError[]): void {
    // Sperm concentration validation
    if (input.spermConcentration !== undefined) {
      if (input.spermConcentration < 0 || input.spermConcentration > 1000) {
        errors.push({
          field: 'spermConcentration',
          message: 'Concentración espermática fuera de rango (0-1000 M/mL)',
          code: 'SPERM_CONCENTRATION_OUT_OF_RANGE',
          isBlocking: false
        });
        input.spermConcentration = undefined;
      } else if (input.spermConcentration < 15) {
        warnings.push({
          field: 'spermConcentration',
          message: 'Oligospermia (concentración < 15 M/mL)',
          severity: 'medium',
          suggestion: 'Evaluación andrológica'
        });
      }
    }

    // Progressive motility validation
    if (input.spermProgressiveMotility !== undefined) {
      if (input.spermProgressiveMotility < 0 || input.spermProgressiveMotility > 100) {
        errors.push({
          field: 'spermProgressiveMotility',
          message: 'Motilidad progresiva fuera de rango (0-100%)',
          code: 'SPERM_MOTILITY_OUT_OF_RANGE',
          isBlocking: false
        });
        input.spermProgressiveMotility = undefined;
      } else if (input.spermProgressiveMotility < 32) {
        warnings.push({
          field: 'spermProgressiveMotility',
          message: 'Astenospermia (motilidad < 32%)',
          severity: 'medium',
          suggestion: 'Evaluación andrológica especializada'
        });
      }
    }

    // Normal morphology validation
    if (input.spermNormalMorphology !== undefined) {
      if (input.spermNormalMorphology < 0 || input.spermNormalMorphology > 100) {
        errors.push({
          field: 'spermNormalMorphology',
          message: 'Morfología normal fuera de rango (0-100%)',
          code: 'SPERM_MORPHOLOGY_OUT_OF_RANGE',
          isBlocking: false
        });
        input.spermNormalMorphology = undefined;
      } else if (input.spermNormalMorphology < 4) {
        warnings.push({
          field: 'spermNormalMorphology',
          message: 'Teratospermia (morfología < 4%)',
          severity: 'medium',
          suggestion: 'Análisis de fragmentación de ADN espermático'
        });
      }
    }

    // Semen volume validation
    if (input.semenVolume !== undefined) {
      if (input.semenVolume < 0 || input.semenVolume > 20) {
        errors.push({
          field: 'semenVolume',
          message: 'Volumen seminal fuera de rango (0-20 mL)',
          code: 'SEMEN_VOLUME_OUT_OF_RANGE',
          isBlocking: false
        });
        input.semenVolume = undefined;
      } else if (input.semenVolume < 1.5) {
        warnings.push({
          field: 'semenVolume',
          message: 'Hipospermia (volumen < 1.5 mL)',
          severity: 'low',
          suggestion: 'Evaluación de glándulas accesorias'
        });
      }
    }
  }

  private validateConsistency(input: UserInput, warnings: ValidationWarning[], errors: ValidationError[]): void {
    // Check consistency between age and AMH
    if (input.age && input.amh) {
      if (input.age < 30 && input.amh < 1.0) {
        warnings.push({
          field: 'consistency',
          message: 'AMH muy baja para la edad',
          severity: 'high',
          suggestion: 'Confirmar valores y considerar causas secundarias'
        });
      } else if (input.age > 40 && input.amh > 4.0) {
        warnings.push({
          field: 'consistency',
          message: 'AMH muy alta para la edad',
          severity: 'medium',
          suggestion: 'Descartar PCOS u otras causas de AMH elevada'
        });
      }
    }

    // Check consistency between PCOS and cycle duration
    if (input.hasPcos && input.cycleDuration && input.cycleDuration >= 21 && input.cycleDuration <= 35) {
      warnings.push({
        field: 'consistency',
        message: 'Ciclo regular con diagnóstico de PCOS',
        severity: 'low',
        suggestion: 'Verificar diagnóstico de PCOS'
      });
    }

    // Check consistency between endometriosis grade and age
    if (input.endometriosisGrade > 3 && input.age < 25) {
      warnings.push({
        field: 'consistency',
        message: 'Endometriosis severa en edad joven',
        severity: 'medium',
        suggestion: 'Confirmar estadificación quirúrgica'
      });
    }
  }

  private calculateCompletenessScore(input: UserInput): number {
    const totalFields = 23; // Total number of input fields
    let filledFields = 0;

    // Count filled required fields
    if (input.age) filledFields++;
    if (input.bmi !== null) filledFields++;
    if (input.cycleDuration !== undefined) filledFields++;
    if (input.infertilityDuration !== undefined) filledFields++;
    if (typeof input.hasPcos === 'boolean') filledFields++;
    if (input.endometriosisGrade !== undefined) filledFields++;
    if (input.amh !== undefined) filledFields++;
    if (input.prolactin !== undefined) filledFields++;
    if (input.tsh !== undefined) filledFields++;
    if (input.homaIr !== undefined) filledFields++;
    if (input.spermConcentration !== undefined) filledFields++;
    if (input.spermProgressiveMotility !== undefined) filledFields++;
    if (input.spermNormalMorphology !== undefined) filledFields++;
    if (input.semenVolume !== undefined) filledFields++;
    
    // Add other fields
    filledFields += 9; // Other boolean and enum fields that are typically filled

    return Math.round((filledFields / totalFields) * 100) / 100;
  }

  private generateRecommendedTests(input: UserInput, warnings: ValidationWarning[]): string[] {
    const tests = new Set<string>();

    // Basic fertility panel
    if (!input.amh) tests.add('Hormona Antimülleriana (AMH)');
    if (!input.spermConcentration) tests.add('Espermiograma completo');

    // Based on warnings
    warnings.forEach(warning => {
      switch (warning.field) {
        case 'age':
          if (input.age >= 35) tests.add('Evaluación de reserva ovárica completa');
          break;
        case 'cycleDuration':
          tests.add('Perfil hormonal completo (FSH, LH, Estradiol)');
          break;
        case 'prolactin':
          tests.add('Resonancia magnética de hipófisis');
          break;
        case 'tsh':
          tests.add('Perfil tiroideo completo (T3, T4, TPOAb)');
          break;
        case 'homaIr':
          tests.add('Curva de glucosa e insulina');
          break;
      }
    });

    // Condition-specific tests
    if (input.hasPcos) {
      tests.add('Ecografía transvaginal');
      tests.add('Perfil metabólico completo');
    }

    if (input.endometriosisGrade > 0) {
      tests.add('CA-125 sérico');
      tests.add('Resonancia magnética pélvica');
    }

    return Array.from(tests);
  }

  private initializeValidationRules(): void {
    this.validationRules.set('age', { min: 18, max: 50, required: true });
    this.validationRules.set('bmi', { min: 15, max: 60, required: false });
    this.validationRules.set('amh', { min: 0, max: 20, required: false });
    this.validationRules.set('prolactin', { min: 0, max: 500, required: false });
    this.validationRules.set('tsh', { min: 0, max: 50, required: false });
    this.validationRules.set('spermConcentration', { min: 0, max: 1000, required: false });
  }
}
