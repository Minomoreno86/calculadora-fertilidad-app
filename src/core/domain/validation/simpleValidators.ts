/**
 * Versión minimalista de validadores clínicos
 * Solo funciones básicas para evitar errores de render
 */

export interface BasicValidationResult {
  isValid: boolean;
  message: string;
  type: 'success' | 'warning' | 'error';
}

export interface FormData {
  age?: number;
  height?: number;
  weight?: number;
  amh?: number;
  glucose?: number;
  insulin?: number;
  infertilityDuration?: number;
  [key: string]: unknown;
}

export class SimpleValidators {
  
  /**
   * Validación básica de edad
   */
  static validateAge(age?: number): BasicValidationResult {
    if (!age || age < 18 || age > 50) {
      return {
        isValid: false,
        message: 'Edad debe estar entre 18-50 años',
        type: 'error'
      };
    }
    
    if (age >= 35) {
      return {
        isValid: true,
        message: `Edad ${age} años - Considerar evaluación prioritaria`,
        type: 'warning'
      };
    }
    
    return {
      isValid: true,
      message: `Edad ${age} años - Rango óptimo para fertilidad`,
      type: 'success'
    };
  }

  /**
   * Validación básica de BMI
   */
  static validateBMI(height?: number, weight?: number): BasicValidationResult {
    if (!height || !weight || height < 140 || weight < 35) {
      return {
        isValid: false,
        message: 'Datos de altura y peso requeridos',
        type: 'error'
      };
    }

    // Calcular BMI usando fórmula estándar consistente
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    
    if (bmi < 18.5) {
      return {
        isValid: true,
        message: `BMI ${bmi.toFixed(1)} - Bajo peso puede afectar fertilidad`,
        type: 'warning'
      };
    } else if (bmi > 30) {
      return {
        isValid: true,
        message: `BMI ${bmi.toFixed(1)} - Sobrepeso puede reducir fertilidad`,
        type: 'warning'
      };
    }
    
    return {
      isValid: true,
      message: `BMI ${bmi.toFixed(1)} - Peso saludable para fertilidad`,
      type: 'success'
    };
  }

  /**
   * Validación básica de completitud
   */
  static validateCompleteness(formData: FormData | null | undefined): {
    percentage: number;
    canCalculate: boolean;
    message: string;
  } {
    if (!formData || typeof formData !== 'object') {
      return {
        percentage: 0,
        canCalculate: false,
        message: 'Sin datos del formulario'
      };
    }

    const requiredFields: (keyof FormData)[] = ['age', 'height', 'weight'];
    const optionalFields: (keyof FormData)[] = ['amh', 'glucose', 'insulin', 'infertilityDuration'];
    
    const requiredCount = requiredFields.filter(field => {
      const value = formData[field];
      return typeof value === 'number' && value > 0;
    }).length;
    
    const optionalCount = optionalFields.filter(field => {
      const value = formData[field];
      return typeof value === 'number' && value > 0;
    }).length;
    
    const percentage = Math.round(
      (requiredCount / requiredFields.length) * 60 + 
      (optionalCount / optionalFields.length) * 40
    );
    
    const canCalculate = requiredCount === requiredFields.length;
    
    return {
      percentage,
      canCalculate,
      message: canCalculate 
        ? `Formulario completo al ${percentage}%`
        : `Completa campos básicos (${requiredCount}/${requiredFields.length})`
    };
  }
}