/**
 * Utilities para detectar valores fuera de rangos normales
 * y aplicar estilos visuales apropiados
 */

export interface RangeValidation {
  isNormal: boolean;
  isWarning: boolean;
  isError: boolean;
  message?: string;
}

export const validateFieldRange = (
  fieldName: string, 
  value: string | number | undefined
): RangeValidation => {
  console.log(`🔍 Validando campo ${fieldName} con valor: ${value}`); // DEBUG

  if (!value || (typeof value === 'string' && value.trim() === '')) {
    console.log(`❌ Valor vacío para ${fieldName}`); // DEBUG
    return { isNormal: true, isWarning: false, isError: false };
  }

  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(numValue)) {
    console.log(`❌ Valor no numérico para ${fieldName}: ${value}`); // DEBUG
    return { isNormal: true, isWarning: false, isError: false };
  }

  console.log(`✅ Procesando ${fieldName} = ${numValue}`); // DEBUG

  switch (fieldName) {
    case 'age':
      if (numValue < 15) {
        console.log(`🔴 EDAD ERROR: ${numValue} < 15`); // DEBUG
        return { 
          isNormal: false, 
          isWarning: false, 
          isError: true, 
          message: 'Edad muy joven para embarazo' 
        };
      } else if (numValue >= 15 && numValue < 18) {
        console.log(`🟠 EDAD WARNING: ${numValue} entre 15-17`); // DEBUG
        return { 
          isNormal: false, 
          isWarning: true, 
          isError: false, 
          message: 'Edad adolescente - requiere evaluación especializada' 
        };
      } else if (numValue >= 35 && numValue <= 39) {
        console.log(`🟠 EDAD WARNING: ${numValue} entre 35-39`); // DEBUG
        return { 
          isNormal: false, 
          isWarning: true, 
          isError: false, 
          message: 'Edad materna avanzada - evaluar reserva ovárica' 
        };
      } else if (numValue >= 40) {
        console.log(`🔴 EDAD ERROR: ${numValue} >= 40`); // DEBUG
        return { 
          isNormal: false, 
          isWarning: false, 
          isError: true, 
          message: 'Edad muy avanzada - considerar ovodonación' 
        };
      }
      console.log(`✅ EDAD NORMAL: ${numValue}`); // DEBUG
      return { isNormal: true, isWarning: false, isError: false };

    case 'weight':
      if (numValue < 35) {
        console.log(`🟠 PESO WARNING: ${numValue} < 35`); // DEBUG
        return { 
          isNormal: false, 
          isWarning: true, 
          isError: false, 
          message: 'Peso muy bajo' 
        };
      } else if (numValue > 150) {
        console.log(`🟠 PESO WARNING: ${numValue} > 150`); // DEBUG
        return { 
          isNormal: false, 
          isWarning: true, 
          isError: false, 
          message: 'Peso muy alto' 
        };
      }
      console.log(`✅ PESO NORMAL: ${numValue}`); // DEBUG
      return { isNormal: true, isWarning: false, isError: false };

    case 'height':
      if (numValue < 140) {
        console.log(`🟠 ALTURA WARNING: ${numValue} < 140`); // DEBUG
        return { 
          isNormal: false, 
          isWarning: true, 
          isError: false, 
          message: 'Estatura baja' 
        };
      } else if (numValue > 200) {
        console.log(`🟠 ALTURA WARNING: ${numValue} > 200`); // DEBUG
        return { 
          isNormal: false, 
          isWarning: true, 
          isError: false, 
          message: 'Estatura muy alta' 
        };
      }
      console.log(`✅ ALTURA NORMAL: ${numValue}`); // DEBUG
      return { isNormal: true, isWarning: false, isError: false };

    default:
      console.log(`❓ Campo no reconocido: ${fieldName}`); // DEBUG
      return { isNormal: true, isWarning: false, isError: false };
  }
};