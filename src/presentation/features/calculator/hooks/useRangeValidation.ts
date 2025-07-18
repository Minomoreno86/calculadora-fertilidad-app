import { useMemo, useRef } from 'react';
import { validateFieldRange, type RangeValidation } from '../utils/rangeValidation';

/**
 * Hook para gestionar validaciones de rango en tiempo real
 * Proporciona validaciones para todos los campos del formulario
 */
export const useRangeValidation = (watchedFields: Record<string, unknown>) => {
  // 📊 ESTABILIZACIÓN: Solo ejecutar si el contenido realmente cambió
  const lastFieldsRef = useRef<string>('{}');
  const watchedFieldsString = JSON.stringify(watchedFields || {});
  
  // Solo logear cuando realmente cambió el contenido
  if (lastFieldsRef.current !== watchedFieldsString) {
    console.log('🔍 useRangeValidation ejecutándose con:', watchedFields); // DEBUG
    lastFieldsRef.current = watchedFieldsString;
  }

  const rangeValidations = useMemo(() => {
    console.log('📊 Recalculando validaciones de rango...'); // DEBUG
    const validations: Record<string, RangeValidation> = {};
    
    // Lista de campos a validar (simplificada para debug)
    const fieldsToValidate = [
      'age',
      'weight', 
      'height'
    ];

    fieldsToValidate.forEach(fieldName => {
      const value = watchedFields[fieldName] as string | number | undefined;
      console.log(`🔍 Validando ${fieldName}: ${value}`); // DEBUG
      const validation = validateFieldRange(fieldName, value);
      validations[fieldName] = validation;
      console.log(`✅ Resultado ${fieldName}:`, validation); // DEBUG
    });

    console.log('📋 Todas las validaciones:', validations); // DEBUG
    return validations;
  }, [watchedFieldsString]); // Usar string estable

  // Función helper para obtener validación de un campo específico
  const getRangeValidation = (fieldName: string): RangeValidation => {
    console.log(`🎯 getRangeValidation(${fieldName}):`, rangeValidations[fieldName]); // DEBUG
    return rangeValidations[fieldName] || { isNormal: true, isWarning: false, isError: false };
  };

  // Estadísticas generales
  const stats = useMemo(() => {
    const validationValues = Object.values(rangeValidations);
    const totalFields = validationValues.length;
    const warningFields = validationValues.filter(v => v.isWarning).length;
    const errorFields = validationValues.filter(v => v.isError).length;
    const normalFields = validationValues.filter(v => v.isNormal).length;

    const result = {
      total: totalFields,
      normal: normalFields,
      warnings: warningFields,
      errors: errorFields,
      hasAnyWarning: warningFields > 0,
      hasAnyError: errorFields > 0,
      allNormal: normalFields === totalFields
    };

    console.log('📊 Estadísticas calculadas:', result); // DEBUG
    return result;
  }, [rangeValidations]);

  return {
    rangeValidations,
    getRangeValidation,
    stats
  };
};