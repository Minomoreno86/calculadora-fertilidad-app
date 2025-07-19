// ===================================================================
// 🎯 INTEGRADOR SIMPLIFICADO DE VALIDACIÓN INTELIGENTE (TEMPORAL)
// ===================================================================

import React from 'react';
import { View } from 'react-native';
import Text from '@/presentation/components/common/Text';
import Box from '@/presentation/components/common/Box';
import { useSimpleValidation } from '@/core/domain/validation/useSimpleValidation';

interface SimpleValidationProps {
  formData: any;
  onValidationChange?: (isValid: boolean, canProceed: boolean) => void;
  onActionRequired?: (insight: any) => void;
  showInlineAlerts?: boolean;
  style?: any;
}

const SimpleValidationIntegrator: React.FC<SimpleValidationProps> = ({ 
  formData, 
  onValidationChange,
  style 
}) => {
  // Usar validación simple corregida
  const validation = useSimpleValidation(formData);

  // Notificar cambios
  React.useEffect(() => {
    if (onValidationChange) {
      onValidationChange(!validation.hasErrors, !validation.hasErrors);
    }
  }, [validation, onValidationChange]);

  if (!formData || Object.keys(formData).length === 0) {
    return (
      <Box style={[{ 
        backgroundColor: '#F0F9FF', 
        borderRadius: 8, 
        padding: 12, 
        margin: 8,
        borderLeftWidth: 4,
        borderLeftColor: '#3B82F6'
      }, style]}>
        <Text variant="body" style={{ color: '#1E40AF' }}>
          💡 Completa los datos para ver validaciones inteligentes
        </Text>
      </Box>
    );
  }

  const getStatusColor = () => {
    if (validation.hasErrors) return '#DC2626';
    if (validation.hasWarnings) return '#F59E0B';
    return '#10B981';
  };

  const getStatusBackground = () => {
    if (validation.hasErrors) return '#FEF2F2';
    if (validation.hasWarnings) return '#FFFBEB';
    return '#F0FDF4';
  };

  const getStatusIcon = () => {
    if (validation.hasErrors) return '⚠️';
    if (validation.hasWarnings) return '⚡';
    return '✅';
  };

  const getStatusMessage = () => {
    if (validation.hasErrors) return 'Datos requeridos pendientes';
    if (validation.hasWarnings) return 'Atención médica recomendada';
    return 'Datos en rangos normales';
  };

  return (
    <Box style={[{ 
      backgroundColor: getStatusBackground(), 
      borderRadius: 12, 
      padding: 16, 
      margin: 8,
      borderLeftWidth: 4,
      borderLeftColor: getStatusColor()
    }, style]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
        <Text style={{ fontSize: 20, marginRight: 8 }}>
          {getStatusIcon()}
        </Text>
        <Text variant="h3" style={{ 
          color: getStatusColor(), 
          fontWeight: '600',
          flex: 1
        }}>
          Validación Clínica: {getStatusMessage()}
        </Text>
      </View>

      <Text variant="body" style={{ 
        color: getStatusColor(), 
        marginBottom: 8 
      }}>
        Puntuación general: {validation.overallScore}% completado
      </Text>

      {validation.allValidations.length > 0 && (
        <View style={{ marginTop: 8 }}>
          <Text variant="bodyBold" style={{ 
            color: getStatusColor(), 
            marginBottom: 4 
          }}>
            Análisis de campos:
          </Text>
          {validation.allValidations.map((val, index) => (
            <Text 
              key={`validation-${index}`}
              variant="small" 
              style={{ 
                color: getStatusColor(), 
                marginBottom: 2,
                paddingLeft: 8 
              }}
            >
              • {val.message}
            </Text>
          ))}
        </View>
      )}
    </Box>
  );
};

export default SimpleValidationIntegrator;
