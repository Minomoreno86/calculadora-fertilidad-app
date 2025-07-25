/**
 * ✅ VALIDADOR ROBUSTO - VERSION 3.0
 * Sistema de validación y sanitización médica avanzada
 * Garantiza la integridad y calidad de los datos de entrada
 */

import { UserInput } from '../types/UnifiedTypes';

// 🧠 Neural Type Safety Enhancement
type UnknownInput = Record<string, unknown>;
type LabValues = Record<string, number>;
type PartnerInfo = Record<string, unknown>;
type MenstrualInfo = Record<string, unknown>;

/**
 * 🧬 FACTORES DE RIESGO DERIVADOS
 */
interface DerivedRiskFactors {
  ageRisk: 'low' | 'moderate' | 'high';
  bmiRisk: 'underweight' | 'normal' | 'overweight' | 'obese';
  ovarianReserveRisk: 'low' | 'normal' | 'high' | 'unknown';
  timeUrgency: 'low' | 'moderate' | 'high';
}

/**
 * 🔬 ENTRADA ENRIQUECIDA
 */
interface EnrichedUserInput extends UserInput {
  derivedRiskFactors?: DerivedRiskFactors;
}

/**
 * 📊 RESULTADO DE VALIDACIÓN
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
  confidence: number; // 0-100
  completenessScore: number; // 0-100
}

/**
 * 🎛️ OPCIONES DE VALIDACIÓN
 */
interface ValidationOptions {
  strict?: boolean;
  autoFix?: boolean;
  allowPartial?: boolean;
  medicalContext?: 'fertility' | 'general' | 'reproductive_endocrinology';
}

/**
 * 🔍 REGLAS MÉDICAS ESPECÍFICAS
 */
interface MedicalValidationRule {
  field: string;
  validator: (value: unknown, context: UserInput) => ValidationError | null;
  severity: 'error' | 'warning' | 'info';
  description: string;
}

interface ValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
  suggestion?: string;
  autoFixable?: boolean;
}

/**
 * 🛡️ VALIDADOR PRINCIPAL
 */
export class RobustValidator {
  private readonly medicalRules: MedicalValidationRule[] = [];
  
  constructor() {
    this.initializeMedicalRules();
  }
  
  /**
   * 🎯 VALIDACIÓN Y SANITIZACIÓN COMPLETA
   */
  async validateAndSanitize(
    input: UnknownInput, 
    options: ValidationOptions = {}
  ): Promise<EnrichedUserInput> {
    
    console.log('🔍 Iniciando validación robusta...');
    
    // 1️⃣ VALIDACIÓN DE ESQUEMA BÁSICO
    const schemaValidation = this.validateSchema(input);
    if (!schemaValidation.isValid && options.strict) {
      throw new Error(`Validación de esquema falló: ${schemaValidation.errors.join(', ')}`);
    }
    
    // 2️⃣ SANITIZACIÓN
    const sanitizedInput = await this.sanitizeInput(input);
    
    // 3️⃣ VALIDACIÓN MÉDICA ESPECÍFICA
    await this.validateMedicalConstraints(sanitizedInput, options);
    
    // 4️⃣ ENRIQUECIMIENTO DE DATOS
    const enrichedInput = await this.enrichData(sanitizedInput);
    
    // 5️⃣ VALIDACIÓN FINAL
    const finalValidation = this.performFinalValidation(enrichedInput);
    
    if (!finalValidation.isValid && options.strict) {
      throw new Error(`Validación médica falló: ${finalValidation.errors.join(', ')}`);
    }
    
    // Log de resultados
    console.log('✅ Validación completada:', {
      errores: finalValidation.errors.length,
      advertencias: finalValidation.warnings.length,
      completitud: finalValidation.completenessScore,
      confianza: finalValidation.confidence
    });
    
    return enrichedInput;
  }
  
  /**
   * 📋 VALIDACIÓN DE ESQUEMA
   */
  private validateSchema(input: UnknownInput): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];
    
    // Campos obligatorios
    if (!input.age || typeof input.age !== 'number') {
      errors.push('Campo "age" es obligatorio y debe ser numérico');
    }
    
    if (!input.infertilityDuration || typeof input.infertilityDuration !== 'number') {
      errors.push('Campo "infertilityDuration" es obligatorio y debe ser numérico');
    }
    
    // Validar tipos de campos opcionales
    if (input.bmi !== undefined && typeof input.bmi !== 'number') {
      errors.push('Campo "bmi" debe ser numérico');
    }
    
    if (input.labs && typeof input.labs !== 'object') {
      errors.push('Campo "labs" debe ser un objeto');
    }
    
    // Calcular completitud
    const totalFields = 20; // Número total de campos posibles
    const providedFields = this.countProvidedFields(input);
    const completenessScore = Math.round((providedFields / totalFields) * 100);
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions,
      confidence: errors.length === 0 ? 90 : 50,
      completenessScore
    };
  }
  
  /**
   * 🧹 SANITIZACIÓN DE ENTRADA
   */
  private async sanitizeInput(input: UnknownInput): Promise<UserInput> {
    const sanitized = { ...input } as Record<string, unknown>;
    
    // Sanitizar edad
    if (sanitized.age && typeof sanitized.age === 'number') {
      sanitized.age = Math.round(Math.max(18, Math.min(60, sanitized.age)));
    }
    
    // Sanitizar BMI
    if (sanitized.bmi && typeof sanitized.bmi === 'number') {
      sanitized.bmi = Math.round(Math.max(15, Math.min(60, sanitized.bmi)) * 10) / 10;
    }
    
    // Sanitizar duración de infertilidad
    if (sanitized.infertilityDuration && typeof sanitized.infertilityDuration === 'number') {
      sanitized.infertilityDuration = Math.max(1, Math.min(240, sanitized.infertilityDuration));
    }
    
    // Sanitizar labs
    if (sanitized.labs && typeof sanitized.labs === 'object') {
      sanitized.labs = this.sanitizeLabs(sanitized.labs as LabValues);
    }
    
    // Sanitizar arrays
    if (sanitized.medicalHistory && Array.isArray(sanitized.medicalHistory)) {
      sanitized.medicalHistory = this.sanitizeStringArray(sanitized.medicalHistory);
    }
    
    if (sanitized.symptoms && Array.isArray(sanitized.symptoms)) {
      sanitized.symptoms = this.sanitizeStringArray(sanitized.symptoms);
    }
    
    // Sanitizar información de pareja
    if (sanitized.partner && typeof sanitized.partner === 'object') {
      sanitized.partner = this.sanitizePartnerInfo(sanitized.partner as PartnerInfo);
    }
    
    return sanitized as unknown as UserInput;
  }
  
  /**
   * 🏥 VALIDACIÓN DE RESTRICCIONES MÉDICAS
   */
  private async validateMedicalConstraints(
    input: UserInput, 
    _options: ValidationOptions
  ): Promise<ValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];
    
    // Aplicar reglas médicas
    for (const rule of this.medicalRules) {
      const fieldValue = this.getFieldValue(input as unknown as UnknownInput, rule.field);
      const validationError = rule.validator(fieldValue, input);
      
      if (validationError) {
        switch (validationError.severity) {
          case 'error':
            errors.push(validationError.message);
            break;
          case 'warning':
            warnings.push(validationError.message);
            break;
          case 'info':
            suggestions.push(validationError.message);
            break;
        }
      }
    }
    
    // Validaciones específicas de fertilidad
    this.validateFertilitySpecific(input, errors, warnings, suggestions);
    
    // Calcular confianza
    const confidence = this.calculateConfidence(input, errors, warnings);
    const completenessScore = this.calculateCompleteness(input as unknown as UserInput);
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions,
      confidence,
      completenessScore
    };
  }
  
  /**
   * 📈 ENRIQUECIMIENTO DE DATOS
   */
  private async enrichData(input: UserInput): Promise<EnrichedUserInput> {
    const enriched: EnrichedUserInput = { ...input };
    
    // Calcular BMI si tenemos altura y peso
    if (enriched.height && enriched.weight && !enriched.bmi) {
      const heightInMeters = enriched.height / 100;
      enriched.bmi = Math.round((enriched.weight / (heightInMeters * heightInMeters)) * 10) / 10;
    }
    
    // Enriquecer información menstrual
    if (enriched.menstrualInfo) {
      enriched.menstrualInfo = this.enrichMenstrualInfo(enriched.menstrualInfo);
    }
    
    // Calcular factores de riesgo derivados
    enriched.derivedRiskFactors = this.calculateDerivedRiskFactors(enriched);
    
    return enriched;
  }
  
  /**
   * ✅ VALIDACIÓN FINAL
   */
  private performFinalValidation(input: EnrichedUserInput): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];
    
    // Consistencia de datos
    this.validateDataConsistency(input, errors, warnings);
    
    // Plausibilidad médica
    this.validateMedicalPlausibility(input, warnings, suggestions);
    
    // Completitud para análisis específico
    this.validateAnalysisReadiness(input, warnings, suggestions);
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions,
      confidence: this.calculateFinalConfidence(input, errors, warnings),
      completenessScore: this.calculateCompleteness(input)
    };
  }
  
  /**
   * 🔧 MÉTODOS PRIVADOS DE VALIDACIÓN
   */
  
  private initializeMedicalRules(): void {
    // Reglas para edad
    this.medicalRules.push({
      field: 'age',
      validator: (age: unknown) => {
        const ageNum = Number(age);
        if (ageNum < 18) return { field: 'age', message: 'Edad mínima para análisis: 18 años', severity: 'error' };
        if (ageNum > 50) return { field: 'age', message: 'Edad máxima recomendada: 50 años', severity: 'warning' };
        if (ageNum > 42) return { field: 'age', message: 'Edad reproductiva avanzada, considerar urgencia', severity: 'warning' };
        return null;
      },
      severity: 'error',
      description: 'Validación de rango de edad reproductiva'
    });
    
    // Reglas para BMI
    this.medicalRules.push({
      field: 'bmi',
      validator: (bmi: unknown) => {
        if (!bmi) return null;
        const bmiNum = Number(bmi);
        if (bmiNum < 16) return { field: 'bmi', message: 'BMI extremadamente bajo puede afectar fertilidad', severity: 'warning' };
        if (bmiNum > 40) return { field: 'bmi', message: 'BMI muy alto puede complicar tratamientos', severity: 'warning' };
        return null;
      },
      severity: 'warning',
      description: 'Validación de BMI para tratamientos de fertilidad'
    });
    
    // Reglas para AMH
    this.medicalRules.push({
      field: 'labs.amh',
      validator: (amh: unknown) => {
        if (!amh) return null;
        const amhNum = Number(amh);
        if (amhNum < 0) return { field: 'labs.amh', message: 'Valor AMH no puede ser negativo', severity: 'error' };
        if (amhNum > 20) return { field: 'labs.amh', message: 'Valor AMH extremadamente alto, verificar unidades', severity: 'warning' };
        if (amhNum < 0.5) return { field: 'labs.amh', message: 'AMH muy baja, sugiere reserva ovárica disminuida', severity: 'warning' };
        return null;
      },
      severity: 'warning',
      description: 'Validación de valores AMH'
    });
    
    // Más reglas médicas específicas...
    this.addMoreMedicalRules();
  }
  
  private addMoreMedicalRules(): void {
    // Reglas para FSH
    this.medicalRules.push({
      field: 'labs.fsh',
      validator: (fsh: unknown) => {
        if (!fsh) return null;
        const fshNum = Number(fsh);
        if (fshNum < 0) return { field: 'labs.fsh', message: 'FSH no puede ser negativo', severity: 'error' };
        if (fshNum > 40) return { field: 'labs.fsh', message: 'FSH muy elevada, posible menopausia prematura', severity: 'warning' };
        return null;
      },
      severity: 'warning',
      description: 'Validación de FSH basal'
    });
    
    // Reglas para duración de infertilidad
    this.medicalRules.push({
      field: 'infertilityDuration',
      validator: (duration: unknown, context: UserInput) => {
        const durationNum = Number(duration);
        if (durationNum > 120 && context.age < 35) {
          return { field: 'infertilityDuration', message: 'Infertilidad prolongada en edad joven, investigar causas', severity: 'warning' };
        }
        if (durationNum > 60 && context.age >= 35) {
          return { field: 'infertilityDuration', message: 'Infertilidad prolongada en edad avanzada, considerar tratamiento urgente', severity: 'warning' };
        }
        return null;
      },
      severity: 'warning',
      description: 'Validación de duración de infertilidad vs edad'
    });
  }
  
  private validateFertilitySpecific(
    input: UserInput,
    errors: string[],
    warnings: string[],
    suggestions: string[]
  ): void {
    
    // Edad vs urgencia
    if (input.age >= 40 && input.infertilityDuration >= 6) {
      warnings.push('Edad y duración sugieren evaluación urgente');
    }
    
    // Reserva ovárica vs edad
    if (input.labs?.amh && input.labs.amh < 1.0 && input.age < 35) {
      warnings.push('Reserva ovárica baja para la edad, considerar causas secundarias');
    }
    
    // Análisis de esperma
    if (input.partner?.spermAnalysis) {
      const sa = input.partner.spermAnalysis;
      if (sa.concentration && sa.concentration < 15) {
        warnings.push('Concentración espermática baja detectada');
      }
      if (sa.motility && sa.motility < 40) {
        warnings.push('Motilidad espermática reducida');
      }
    }
    
    // Sugerencias de completitud
    if (!input.labs?.amh) {
      suggestions.push('Considerar solicitar AMH para evaluación de reserva ovárica');
    }
    
    if (!input.partner) {
      suggestions.push('Incluir evaluación del factor masculino');
    }
  }
  
  private validateDataConsistency(
    input: EnrichedUserInput,
    errors: string[],
    warnings: string[]
  ): void {
    
    // BMI vs peso/altura
    if (input.bmi && input.height && input.weight) {
      const calculatedBMI = input.weight / ((input.height / 100) ** 2);
      const difference = Math.abs(input.bmi - calculatedBMI);
      if (difference > 2) {
        warnings.push('BMI informado no coincide con peso/altura');
      }
    }
    
    // Edad vs menopausia
    if (input.age > 45 && input.menstrualInfo?.cycleRegularity === 'regular') {
      warnings.push('Verificar status menopáusico en edad avanzada');
    }
    
    // Labs vs síntomas
    if (input.labs?.amh && input.labs.amh > 5 && 
        input.symptoms?.includes('irregular cycles')) {
      warnings.push('AMH elevada con ciclos irregulares sugiere PCOS');
    }
  }
  
  private validateMedicalPlausibility(
    input: EnrichedUserInput,
    warnings: string[],
    suggestions: string[]
  ): void {
    
    // Plausibilidad de valores de laboratorio
    if (input.labs?.amh && input.labs?.fsh) {
      if (input.labs.amh < 0.5 && input.labs.fsh < 10) {
        warnings.push('AMH baja con FSH normal - verificar resultados');
      }
    }
    
    // Plausibilidad clínica
    if (input.age < 25 && input.infertilityDuration > 24) {
      suggestions.push('Infertilidad prolongada en edad muy joven - investigar causas estructurales');
    }
  }
  
  private validateAnalysisReadiness(
    input: EnrichedUserInput,
    warnings: string[],
    suggestions: string[]
  ): void {
    
    let readinessScore = 0;
    const requiredFields = ['age', 'infertilityDuration'];
    const optimalFields = ['bmi', 'labs.amh', 'labs.fsh', 'partner'];
    
    requiredFields.forEach(field => {
      if (this.getFieldValue(input as unknown as UnknownInput, field)) readinessScore += 25;
    });
    
    optimalFields.forEach(field => {
      if (this.getFieldValue(input as unknown as UnknownInput, field)) readinessScore += 12.5;
    });
    
    if (readinessScore < 70) {
      warnings.push('Información incompleta puede limitar precisión del análisis');
    }
    
    if (readinessScore < 50) {
      suggestions.push('Se recomienda completar evaluación básica antes del análisis');
    }
  }
  
  /**
   * 🧮 MÉTODOS DE CÁLCULO Y UTILIDAD
   */
  
  private countProvidedFields(input: UnknownInput): number {
    let count = 0;
    
    if (input.age) count++;
    if (input.infertilityDuration) count++;
    if (input.bmi) count++;
    if (input.medicalHistory && Array.isArray(input.medicalHistory) && input.medicalHistory.length) count++;
    if (input.symptoms && Array.isArray(input.symptoms) && input.symptoms.length) count++;
    if (input.labs && typeof input.labs === 'object' && (input.labs as LabValues)?.amh) count++;
    if (input.labs && typeof input.labs === 'object' && (input.labs as LabValues)?.fsh) count++;
    if (input.partner) count++;
    // ... más campos
    
    return count;
  }
  
  private calculateConfidence(
    input: UserInput, 
    errors: string[], 
    warnings: string[]
  ): number {
    let confidence = 100;
    
    confidence -= errors.length * 20;
    confidence -= warnings.length * 5;
    
    // Bonificaciones por completitud
    if (input.labs?.amh) confidence += 5;
    if (input.labs?.fsh) confidence += 5;
    if (input.partner) confidence += 5;
    
    return Math.max(0, Math.min(100, confidence));
  }
  
  private calculateCompleteness(input: UserInput): number {
    const totalPossibleFields = 25;
    const providedFields = this.countProvidedFields(input as unknown as UnknownInput);
    return Math.round((providedFields / totalPossibleFields) * 100);
  }
  
  private calculateFinalConfidence(
    input: UserInput,
    errors: string[],
    warnings: string[]
  ): number {
    const baseConfidence = this.calculateConfidence(input, errors, warnings);
    const completenessBonus = this.calculateCompleteness(input) * 0.1;
    
    return Math.min(100, Math.round(baseConfidence + completenessBonus));
  }
  
  private getFieldValue(obj: UnknownInput, path: string): unknown {
    return path.split('.').reduce((current: unknown, key) => {
      if (current && typeof current === 'object') {
        return (current as Record<string, unknown>)[key];
      }
      return undefined;
    }, obj);
  }
  
  private sanitizeLabs(labs: LabValues): LabValues {
    const sanitized = { ...labs };
    
    // Sanitizar valores numéricos de labs
    if (sanitized.amh) sanitized.amh = Math.max(0, Math.min(50, sanitized.amh));
    if (sanitized.fsh) sanitized.fsh = Math.max(0, Math.min(100, sanitized.fsh));
    if (sanitized.lh) sanitized.lh = Math.max(0, Math.min(100, sanitized.lh));
    if (sanitized.estradiol) sanitized.estradiol = Math.max(0, Math.min(1000, sanitized.estradiol));
    
    return sanitized;
  }
  
  private sanitizeStringArray(arr: unknown[]): string[] {
    if (!Array.isArray(arr)) return [];
    
    return arr
      .filter(item => typeof item === 'string')
      .map(item => item.trim())
      .filter(item => item.length > 0)
      .slice(0, 10); // Máximo 10 elementos
  }
  
  private sanitizePartnerInfo(partner: PartnerInfo): PartnerInfo {
    const sanitized = { ...partner };
    
    if (sanitized.age && typeof sanitized.age === 'number') {
      sanitized.age = Math.max(18, Math.min(80, sanitized.age));
    }
    
    if (sanitized.spermAnalysis && typeof sanitized.spermAnalysis === 'object') {
      const sa = { ...sanitized.spermAnalysis } as Record<string, unknown>;
      if (sa.concentration && typeof sa.concentration === 'number') sa.concentration = Math.max(0, sa.concentration);
      if (sa.motility && typeof sa.motility === 'number') sa.motility = Math.max(0, Math.min(100, sa.motility));
      if (sa.morphology && typeof sa.morphology === 'number') sa.morphology = Math.max(0, Math.min(100, sa.morphology));
      sanitized.spermAnalysis = sa;
    }
    
    return sanitized;
  }
  
  private enrichMenstrualInfo(menstrualInfo: MenstrualInfo): MenstrualInfo {
    const enriched = { ...menstrualInfo };
    
    // Calcular regularidad basada en longitud de ciclo
    if (enriched.cycleLength && typeof enriched.cycleLength === 'number' && !enriched.cycleRegularity) {
      if (enriched.cycleLength >= 21 && enriched.cycleLength <= 35) {
        enriched.cycleRegularity = 'regular';
      } else {
        enriched.cycleRegularity = 'irregular';
      }
    }
    
    return enriched;
  }
  
  private calculateDerivedRiskFactors(input: UserInput): DerivedRiskFactors {
    const factors: DerivedRiskFactors = {
      ageRisk: 'low',
      bmiRisk: 'normal',
      ovarianReserveRisk: 'unknown',
      timeUrgency: 'low'
    };
    
    // Riesgo por edad
    if (input.age >= 40) factors.ageRisk = 'high';
    else if (input.age >= 35) factors.ageRisk = 'moderate';
    
    // Riesgo por BMI
    if (input.bmi) {
      if (input.bmi < 18.5) factors.bmiRisk = 'underweight';
      else if (input.bmi >= 30) factors.bmiRisk = 'obese';
      else if (input.bmi >= 25) factors.bmiRisk = 'overweight';
    }
    
    // Riesgo por reserva ovárica
    if (input.labs?.amh) {
      if (input.labs.amh < 1.0) factors.ovarianReserveRisk = 'low';
      else if (input.labs.amh > 3.0) factors.ovarianReserveRisk = 'high';
      else factors.ovarianReserveRisk = 'normal';
    }
    
    // Urgencia temporal
    if (input.age >= 40 || input.infertilityDuration >= 24) {
      factors.timeUrgency = 'high';
    } else if (input.age >= 35 || input.infertilityDuration >= 12) {
      factors.timeUrgency = 'moderate';
    }
    
    return factors;
  }
}

export default RobustValidator;
