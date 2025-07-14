// ===================================================================
// 🧠 SISTEMA INTELIGENTE DE VALIDACIÓN CLÍNICA
// ===================================================================

import { useState, useEffect, useCallback, useMemo } from 'react';
import { ClinicalValidators, FieldValidationResult } from '@/core/domain/validation/clinicalValidators';

// 🎯 Tipos para el sistema inteligente
interface FormData {
  age?: number | string;
  height?: number | string;
  weight?: number | string;
  amhValue?: number | string;
  cycleLength?: number | string;
  infertilityDuration?: number | string;
  glucoseValue?: number | string;
  insulinValue?: number | string;
  spermConcentration?: number | string;
  spermProgressiveMotility?: number | string;
  spermNormalMorphology?: number | string;
  cycleRegularity?: 'regular' | 'irregular';
  [key: string]: unknown;
}

export interface ClinicalInsight {
  type: 'critical' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  interpretation: string;
  recommendations: string[];
  urgency: 'low' | 'medium' | 'high' | 'critical';
  medicalContext?: string;
  nextSteps?: string[];
}

interface SmartValidationResult {
  // Estado general
  isValid: boolean;
  canProceed: boolean;
  completionScore: number;
  clinicalScore: number;
  
  // Alertas inteligentes
  criticalAlerts: ClinicalInsight[];
  warnings: ClinicalInsight[];
  recommendations: ClinicalInsight[];
  
  // Interpretación contextual
  ageAssessment?: ClinicalInsight;
  fertilityProfile?: ClinicalInsight;
  metabolicStatus?: ClinicalInsight;
  reproductiveHealth?: ClinicalInsight;
  
  // Progreso inteligente
  missingCriticalData: string[];
  suggestedNextTests: string[];
  
  // Campo específico
  fieldValidations: Map<string, FieldValidationResult>;
}

interface IntelligentValidationOptions {
  enableRealTimeValidation?: boolean;
  includeAdvancedInterpretation?: boolean;
  considerPatientContext?: boolean;
  prioritizeUrgentFindings?: boolean;
}

// 🧠 Hook principal del sistema inteligente
export const useIntelligentClinicalValidation = (
  formData: FormData,
  options: IntelligentValidationOptions = {}
) => {
  const {
    enableRealTimeValidation = true
    // Opciones para futuras mejoras
  } = options;

  const [validationResult, setValidationResult] = useState<SmartValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  // 🔄 Conversión inteligente de datos
  const sanitizedData = useMemo(() => {
    const safeParseNumber = (value: unknown): number | undefined => {
      if (typeof value === 'number') return value;
      if (typeof value === 'string') {
        const parsed = parseFloat(value);
        return isNaN(parsed) ? undefined : parsed;
      }
      return undefined;
    };

    return {
      age: safeParseNumber(formData.age),
      height: safeParseNumber(formData.height),
      weight: safeParseNumber(formData.weight),
      amh: safeParseNumber(formData.amhValue),
      timeToConception: safeParseNumber(formData.infertilityDuration),
      glucose: safeParseNumber(formData.glucoseValue),
      insulin: safeParseNumber(formData.insulinValue),
      spermConcentration: safeParseNumber(formData.spermConcentration),
      spermProgressiveMotility: safeParseNumber(formData.spermProgressiveMotility),
      spermNormalMorphology: safeParseNumber(formData.spermNormalMorphology),
      cycleLength: safeParseNumber(formData.cycleLength),
      cycleRegularity: formData.cycleRegularity
    };
  }, [formData]);

  // 🎯 Generador de insights clínicos inteligentes
  const generateClinicalInsights = useCallback((
    fieldValidations: FieldValidationResult[]
  ): ClinicalInsight[] => {
    const insights: ClinicalInsight[] = [];

    // 🧬 Análisis de edad y fertilidad
    const ageValidation = fieldValidations.find(fv => fv.fieldName === 'age');
    if (ageValidation && sanitizedData.age) {
      const age = sanitizedData.age;
      
      if (age >= 42) {
        insights.push({
          type: 'critical',
          title: 'Edad Reproductiva Crítica',
          message: `A los ${age} años, la fertilidad está severamente comprometida`,
          interpretation: 'Las tasas de éxito con óvulos propios son extremadamente bajas (<5%). La reserva ovárica está típicamente agotada.',
          recommendations: [
            'Evaluación inmediata con especialista en medicina reproductiva',
            'Considerar donación de óvulos como primera opción',
            'Discutir realísticamente las expectativas de tratamiento',
            'Evaluación psicológica para apoyo emocional'
          ],
          urgency: 'critical',
          medicalContext: 'Edad materna muy avanzada según clasificación ASRM',
          nextSteps: [
            'AMH, FSH, AFC para confirmar reserva ovárica',
            'Consulta con psicólogo especializado en fertilidad',
            'Evaluación cardiometabólica pre-tratamiento'
          ]
        });
      } else if (age >= 40) {
        insights.push({
          type: 'warning',
          title: 'Edad Materna Avanzada',
          message: `A los ${age} años, la ventana de fertilidad se estrecha rápidamente`,
          interpretation: 'Declive acelerado de la calidad ovocitaria y reserva ovárica. Mayor riesgo de aneuploidías.',
          recommendations: [
            'Tratamiento prioritario sin demoras',
            'Considerar FIV con DGP para reducir riesgo de aneuploidías',
            'Evaluación completa de reserva ovárica',
            'Discutir opciones de preservación de fertilidad'
          ],
          urgency: 'high',
          medicalContext: 'Edad materna avanzada - Ventana terapéutica limitada',
          nextSteps: [
            'AMH, FSH basal, AFC',
            'Cariotipo de pareja',
            'Consulta genética si indicado'
          ]
        });
      } else if (age >= 35) {
        insights.push({
          type: 'warning',
          title: 'Inicio del Declive Reproductivo',
          message: `A los ${age} años, la fertilidad comienza a declinar`,
          interpretation: 'Reducción gradual de la reserva ovárica y calidad ovocitaria. Aumento del riesgo de aborto.',
          recommendations: [
            'Evaluación reproductiva sin postergación',
            'Optimización del estilo de vida',
            'Considerar preservación de fertilidad si se desea postergar',
            'Evaluación de pareja masculina simultánea'
          ],
          urgency: 'medium',
          medicalContext: 'Inicio de declive relacionado con edad',
          nextSteps: [
            'Evaluación básica de fertilidad',
            'Ácido fólico y optimización nutricional',
            'Evaluación de pareja masculina'
          ]
        });
      } else {
        insights.push({
          type: 'success',
          title: 'Edad Reproductiva Óptima',
          message: `A los ${age} años, se encuentra en el período de mayor fertilidad`,
          interpretation: 'Reserva ovárica y calidad ovocitaria en niveles óptimos. Menores riesgos reproductivos.',
          recommendations: [
            'Mantener estilo de vida saludable',
            'Ácido fólico preconcepcional',
            'Evaluación básica si infertilidad >1 año',
            'Aprovecha esta ventana de fertilidad óptima'
          ],
          urgency: 'low',
          medicalContext: 'Edad reproductiva ideal',
          nextSteps: [
            'Suplementación preconcepcional',
            'Seguimiento rutinario ginecológico',
            'Evaluación solo si indicado clínicamente'
          ]
        });
      }
    }

    // 🏋️ Análisis metabólico
    const bmiValidation = fieldValidations.find(fv => fv.fieldName === 'bmi');
    if (bmiValidation && sanitizedData.height && sanitizedData.weight) {
      const heightInM = sanitizedData.height / 100;
      const bmi = sanitizedData.weight / (heightInM * heightInM);

      if (bmi >= 35) {
        insights.push({
          type: 'critical',
          title: 'Obesidad Severa - Impacto Crítico',
          message: `BMI ${bmi.toFixed(1)} indica obesidad severa`,
          interpretation: 'Riesgo muy alto de complicaciones reproductivas, maternas y fetales. Respuesta subóptima a tratamientos.',
          recommendations: [
            'Pérdida de peso mandatoria antes de cualquier tratamiento',
            'Considerar cirugía bariátrica',
            'Manejo multidisciplinario (endocrinología, nutrición)',
            'Evaluación cardiometabólica completa'
          ],
          urgency: 'critical',
          medicalContext: 'Obesidad mórbida - Contraindicación relativa para TRA',
          nextSteps: [
            'Evaluación endocrinológica',
            'Programa de pérdida de peso supervisado',
            'Screening de comorbilidades'
          ]
        });
      } else if (bmi >= 30) {
        insights.push({
          type: 'warning',
          title: 'Obesidad - Impacto Significativo',
          message: `BMI ${bmi.toFixed(1)} indica obesidad`,
          interpretation: 'Reducción significativa en tasas de embarazo y aumento de complicaciones gestacionales.',
          recommendations: [
            'Pérdida de peso de 10-15% antes del tratamiento',
            'Modificación del estilo de vida',
            'Evaluación de resistencia a insulina',
            'Apoyo nutricional especializado'
          ],
          urgency: 'high',
          medicalContext: 'Obesidad grado I-II',
          nextSteps: [
            'HOMA-IR, perfil lipídico',
            'Plan nutricional personalizado',
            'Actividad física supervisada'
          ]
        });
      } else if (bmi < 18.5) {
        insights.push({
          type: 'warning',
          title: 'Bajo Peso - Riesgo de Anovulación',
          message: `BMI ${bmi.toFixed(1)} indica bajo peso`,
          interpretation: 'El bajo peso puede suprimir el eje hipotálamo-hipófiso-ovárico causando anovulación.',
          recommendations: [
            'Ganancia de peso controlada',
            'Evaluación nutricional especializada',
            'Descartar trastornos alimentarios',
            'Monitoreo de ovulación'
          ],
          urgency: 'medium',
          medicalContext: 'Bajo peso con posible impacto reproductivo',
          nextSteps: [
            'Evaluación nutricional',
            'Perfil hormonal reproductivo',
            'Monitoreo folicular'
          ]
        });
      } else {
        insights.push({
          type: 'success',
          title: 'Peso Optimal para Fertilidad',
          message: `BMI ${bmi.toFixed(1)} está en rango ideal`,
          interpretation: 'Peso óptimo para maximizar las tasas de éxito reproductivo y minimizar complicaciones.',
          recommendations: [
            'Mantener peso actual',
            'Alimentación balanceada',
            'Ejercicio regular moderado',
            'Continuar con estilo de vida saludable'
          ],
          urgency: 'low',
          medicalContext: 'BMI en rango óptimo para reproducción',
          nextSteps: [
            'Mantener hábitos actuales',
            'Suplementación preconcepcional'
          ]
        });
      }
    }

    // 🧬 Análisis de reserva ovárica
    const amhValidation = fieldValidations.find(fv => fv.fieldName === 'amh');
    if (amhValidation && sanitizedData.amh && sanitizedData.age) {
      const amh = sanitizedData.amh;
      const age = sanitizedData.age;

      if (amh < 0.7) {
        insights.push({
          type: 'critical',
          title: 'Reserva Ovárica Severamente Disminuida',
          message: `AMH ${amh.toFixed(2)} ng/mL indica reserva muy baja`,
          interpretation: 'Reserva ovárica críticamente comprometida. Respuesta pobre esperada a estimulación.',
          recommendations: [
            'Tratamiento inmediato sin demoras',
            'Protocolos de estimulación agresivos',
            'Considerar acumulación de óvulos',
            'Discutir donación de óvulos como backup'
          ],
          urgency: 'critical',
          medicalContext: 'Baja reserva ovárica - Ventana terapéutica muy limitada',
          nextSteps: [
            'Inicio inmediato de tratamiento',
            'FSH, LH, estradiol basal',
            'Conteo de folículos antrales'
          ]
        });
      } else if (amh < 1.2) {
        insights.push({
          type: 'warning',
          title: 'Reserva Ovárica Disminuida',
          message: `AMH ${amh.toFixed(2)} ng/mL indica reserva baja para la edad`,
          interpretation: 'Reserva ovárica menor a lo esperado para la edad. Posible respuesta subóptima a tratamientos.',
          recommendations: [
            'Tratamiento prioritario',
            'Protocolos de estimulación modificados',
            'Considerar suplementación con CoQ10',
            'Optimizar estilo de vida'
          ],
          urgency: 'high',
          medicalContext: 'Baja reserva ovárica relativa a la edad',
          nextSteps: [
            'Evaluación reproductiva completa',
            'Protocolo de estimulación personalizado',
            'Monitoreo estrecho'
          ]
        });
      } else if (amh > 6.0 && age < 35) {
        insights.push({
          type: 'warning',
          title: 'AMH Muy Elevado - Riesgo de SHO',
          message: `AMH ${amh.toFixed(2)} ng/mL es muy alto`,
          interpretation: 'Riesgo elevado de síndrome de hiperestimulación ovárica. Posible PCOS subclínico.',
          recommendations: [
            'Protocolos de estimulación suave',
            'Monitoreo estrecho durante estimulación',
            'Evaluación para PCOS',
            'Considerar agonistas de GnRH para trigger'
          ],
          urgency: 'medium',
          medicalContext: 'AMH elevado con riesgo de SHO',
          nextSteps: [
            'Screening para PCOS',
            'Protocolo de estimulación modificado',
            'Consentimiento informado sobre SHO'
          ]
        });
      } else {
        insights.push({
          type: 'success',
          title: 'Reserva Ovárica Normal',
          message: `AMH ${amh.toFixed(2)} ng/mL está en rango normal para la edad`,
          interpretation: 'Reserva ovárica adecuada para la edad. Buena respuesta esperada a tratamientos.',
          recommendations: [
            'Continuar con plan de tratamiento estándar',
            'Protocolos de estimulación convencionales',
            'Mantener estilo de vida saludable',
            'Monitoreo de rutina'
          ],
          urgency: 'low',
          medicalContext: 'Reserva ovárica apropiada para la edad',
          nextSteps: [
            'Protocolos estándar de tratamiento',
            'Seguimiento rutinario'
          ]
        });
      }
    }

    return insights;
  }, [sanitizedData]);

  // 🔄 Validación inteligente principal
  const performIntelligentValidation = useCallback(async () => {
    if (!enableRealTimeValidation) return;

    setIsValidating(true);

    try {
      // 1. Validación clínica base
      const validation = ClinicalValidators.validateCompleteForm(sanitizedData);
      
      // 2. Generación de insights inteligentes
      const insights = generateClinicalInsights(validation.fieldValidations);
      
      // 3. Clasificación y priorización
      const criticalAlerts = insights.filter(i => i.type === 'critical');
      const warnings = insights.filter(i => i.type === 'warning');
      const recommendations = insights.filter(i => i.type === 'info' || i.type === 'success');

      // 4. Análisis contextual
      const ageAssessment = insights.find(i => i.title.includes('Edad'));
      const metabolicStatus = insights.find(i => i.title.includes('BMI') || i.title.includes('Peso'));
      const reproductiveHealth = insights.find(i => i.title.includes('AMH') || i.title.includes('Reserva'));

      // 5. Evaluación de completitud
      const criticalFields = ['age', 'height', 'weight'] as const;
      const missingCriticalData = criticalFields.filter(field => !sanitizedData[field]);
      
      const suggestedNextTests = [];
      if (!sanitizedData.amh && sanitizedData.age && sanitizedData.age >= 30) {
        suggestedNextTests.push('AMH (Hormona Antimülleriana)');
      }
      if (!sanitizedData.glucose && !sanitizedData.insulin) {
        suggestedNextTests.push('HOMA-IR (Resistencia a insulina)');
      }

      // 6. Resultado final
      const result: SmartValidationResult = {
        isValid: validation.overallValidation.isValid,
        canProceed: validation.canProceedWithCalculation,
        completionScore: validation.completionScore,
        clinicalScore: validation.overallValidation.clinicalScore,
        
        criticalAlerts,
        warnings,
        recommendations,
        
        ageAssessment,
        metabolicStatus,
        reproductiveHealth,
        
        missingCriticalData,
        suggestedNextTests,
        
        fieldValidations: new Map(
          validation.fieldValidations.map(fv => [fv.fieldName, fv])
        )
      };

      setValidationResult(result);

    } catch (error) {
      console.error('Error en validación inteligente:', error);
      setValidationResult(null);
    } finally {
      setIsValidating(false);
    }
  }, [sanitizedData, enableRealTimeValidation, generateClinicalInsights]);

  // 🔄 Ejecutar validación cuando cambien los datos
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performIntelligentValidation();
    }, 300); // Debounce de 300ms

    return () => clearTimeout(timeoutId);
  }, [performIntelligentValidation]);

  // 🎯 Funciones de utilidad
  const getCriticalAlerts = useCallback(() => {
    return validationResult?.criticalAlerts || [];
  }, [validationResult]);

  const getWarnings = useCallback(() => {
    return validationResult?.warnings || [];
  }, [validationResult]);

  const getFieldInsight = useCallback((fieldName: string) => {
    return validationResult?.fieldValidations.get(fieldName);
  }, [validationResult]);

  const canProceedWithTreatment = useCallback(() => {
    if (!validationResult) return false;
    return validationResult.canProceed && validationResult.criticalAlerts.length === 0;
  }, [validationResult]);

  const getUrgencyLevel = useCallback((): 'low' | 'medium' | 'high' | 'critical' => {
    if (!validationResult) return 'low';
    
    if (validationResult.criticalAlerts.length > 0) return 'critical';
    if (validationResult.warnings.some(w => w.urgency === 'high')) return 'high';
    if (validationResult.warnings.length > 0) return 'medium';
    return 'low';
  }, [validationResult]);

  return {
    // Estado principal
    validationResult,
    isValidating,
    
    // Funciones de acceso
    getCriticalAlerts,
    getWarnings,
    getFieldInsight,
    canProceedWithTreatment,
    getUrgencyLevel,
    
    // Funciones de control
    revalidate: performIntelligentValidation,
    
    // Datos procesados
    sanitizedData
  };
};
