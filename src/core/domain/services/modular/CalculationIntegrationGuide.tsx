/**
 * 🔗 GUÍA DE INTEGRACIÓN: CALCULATION ORCHESTRATOR
 * 
 * Esta guía muestra cómo integrar el CalculationOrchestrator con otros
 * componentes del sistema de manera efectiva y robusta.
 */

// ===================================================================
// 📋 IMPORTS PRINCIPALES
// ===================================================================

import React, { useState, useEffect, useCallback } from 'react';
import { Alert, View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { UserInput, CalculationResult } from '../../models';
import { 
  calculateFertility,
  calculateFertilityWithRetry,
  getSystemHealthReport,
  optimizeModularSystem,
  getSystemStats,
  CalculationOptions
} from './CalculationOrchestrator';

// ===================================================================
// 🎯 HOOK PERSONALIZADO PARA CALCULATION ORCHESTRATOR
// ===================================================================

/**
 * Hook personalizado que encapsula la lógica del CalculationOrchestrator
 * para uso en componentes React Native
 */
export function useCalculationOrchestrator() {
  const [isCalculating, setIsCalculating] = useState(false);
  const [lastResult, setLastResult] = useState<CalculationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [systemHealth, setSystemHealth] = useState<'OK' | 'WARNING' | 'ERROR'>('OK');

  // Función principal de cálculo
  const calculate = useCallback(async (
    input: UserInput,
    options?: CalculationOptions
  ): Promise<CalculationResult | null> => {
    try {
      setIsCalculating(true);
      setError(null);

      // Configurar opciones por defecto
      const defaultOptions: CalculationOptions = {
        enableProfiling: true,
        useCache: true,
        userId: 'app_user',
        minConfidenceLevel: 0.7,
        ...options
      };

      // Ejecutar cálculo con retry automático
      const result = await calculateFertilityWithRetry(input, defaultOptions, 3);
      
      setLastResult(result);
      return result;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error en cálculo:', err);
      return null;

    } finally {
      setIsCalculating(false);
    }
  }, []);

  // Función para verificar salud del sistema
  const checkSystemHealth = useCallback(() => {
    try {
      const health = getSystemHealthReport();
      setSystemHealth(health.overall);
      
      // Optimizar automáticamente si es necesario
      if (health.overall === 'WARNING' && health.recommendations.length > 0) {
        optimizeModularSystem();
      }
      
      return health;
    } catch (err) {
      setSystemHealth('ERROR');
      console.error('Error verificando salud:', err);
      return null;
    }
  }, []);

  // Verificar salud del sistema automáticamente
  useEffect(() => {
    const interval = setInterval(checkSystemHealth, 60000); // Cada minuto
    return () => clearInterval(interval);
  }, [checkSystemHealth]);

  return {
    calculate,
    isCalculating,
    lastResult,
    error,
    systemHealth,
    checkSystemHealth
  };
}

// ===================================================================
// 🎯 COMPONENTE DE INTERFAZ PARA CÁLCULO
// ===================================================================

interface CalculatorInterfaceProps {
  userInput: UserInput;
  onResultReady: (result: CalculationResult) => void;
  onError: (error: string) => void;
}

/**
 * Componente que integra el CalculationOrchestrator con la UI
 */
export const CalculatorInterface: React.FC<CalculatorInterfaceProps> = ({
  userInput,
  onResultReady,
  onError
}) => {
  const {
    calculate,
    isCalculating,
    lastResult,
    error,
    systemHealth,
    checkSystemHealth
  } = useCalculationOrchestrator();

  // Manejar cálculo
  const handleCalculate = async () => {
    const result = await calculate(userInput, {
      enableProfiling: true,
      useCache: true,
      userId: 'interface_user'
    });

    if (result) {
      onResultReady(result);
    } else if (error) {
      onError(error);
    }
  };

  // Mostrar indicador de salud
  const getHealthColor = () => {
    switch (systemHealth) {
      case 'OK': return '#4CAF50';
      case 'WARNING': return '#FF9800';
      case 'ERROR': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  return (
    <View style={styles.container}>
      {/* Indicador de estado del sistema */}
      <View style={styles.healthIndicator}>
        <View 
          style={[
            styles.healthDot, 
            { backgroundColor: getHealthColor() }
          ]} 
        />
        <Text style={styles.healthText}>
          Sistema: {systemHealth}
        </Text>
        <TouchableOpacity
          style={styles.checkButton}
          onPress={checkSystemHealth}
        >
          <Text style={styles.checkButtonText}>🔍</Text>
        </TouchableOpacity>
      </View>

      {/* Botón de cálculo */}
      <TouchableOpacity
        style={[
          styles.calculateButton,
          isCalculating && styles.calculateButtonDisabled
        ]}
        onPress={handleCalculate}
        disabled={isCalculating}
      >
        <Text style={styles.calculateButtonText}>
          {isCalculating ? 'Calculando...' : 'Calcular Fertilidad'}
        </Text>
      </TouchableOpacity>

      {/* Mostrar error si existe */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>❌ {error}</Text>
        </View>
      )}

      {/* Mostrar resultado si existe */}
      {lastResult && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>📊 Último Resultado</Text>
          <Text style={styles.resultText}>
            Pronóstico: {lastResult.evaluation.report.numericPrognosis.toFixed(1)}%
          </Text>
          <Text style={styles.resultText}>
            Categoría: {lastResult.evaluation.report.category}
          </Text>
          <Text style={styles.resultText}>
            Engine: {lastResult.metadata.engineUsed}
          </Text>
          <Text style={styles.resultText}>
            Tiempo: {lastResult.metadata.totalExecutionTime.toFixed(2)}ms
          </Text>
          {lastResult.metadata.cacheHit && (
            <Text style={styles.cacheHitText}>💾 Cache Hit</Text>
          )}
        </View>
      )}
    </View>
  );
};

// ===================================================================
// 🎯 SERVICIO DE INTEGRACIÓN CON CONTEXTO
// ===================================================================

/**
 * Servicio que actúa como bridge entre el CalculationOrchestrator
 * y el sistema de contexto/estado de la aplicación
 */
export class CalculationService {
  private static instance: CalculationService;
  private subscribers: ((result: CalculationResult) => void)[] = [];
  private errorHandlers: ((error: string) => void)[] = [];

  static getInstance(): CalculationService {
    if (!CalculationService.instance) {
      CalculationService.instance = new CalculationService();
    }
    return CalculationService.instance;
  }

  /**
   * Suscribirse a resultados de cálculo
   */
  subscribe(callback: (result: CalculationResult) => void): () => void {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  /**
   * Suscribirse a errores de cálculo
   */
  onError(callback: (error: string) => void): () => void {
    this.errorHandlers.push(callback);
    return () => {
      this.errorHandlers = this.errorHandlers.filter(handler => handler !== callback);
    };
  }

  /**
   * Ejecutar cálculo y notificar a suscriptores
   */
  async calculateAndNotify(
    input: UserInput,
    options?: CalculationOptions
  ): Promise<void> {
    try {
      const result = await calculateFertilityWithRetry(input, options, 3);
      
      // Notificar a todos los suscriptores
      this.subscribers.forEach(callback => {
        try {
          callback(result);
        } catch (err) {
          console.error('Error en callback de suscriptor:', err);
        }
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      
      // Notificar a manejadores de error
      this.errorHandlers.forEach(handler => {
        try {
          handler(errorMessage);
        } catch (err) {
          console.error('Error en handler de error:', err);
        }
      });
    }
  }

  /**
   * Verificar y reportar salud del sistema
   */
  getSystemStatus(): {
    health: 'OK' | 'WARNING' | 'ERROR';
    recommendations: string[];
    metrics: any;
  } {
    try {
      const health = getSystemHealthReport();
      const stats = getSystemStats();
      
      return {
        health: health.overall,
        recommendations: health.recommendations,
        metrics: {
          totalRequests: health.metrics.totalRequests,
          successRate: health.metrics.successRate,
          averageTime: health.metrics.averageResponseTime,
          cacheEfficiency: health.metrics.cacheEfficiency
        }
      };
    } catch (error) {
      return {
        health: 'ERROR',
        recommendations: ['Error al obtener estado del sistema'],
        metrics: {}
      };
    }
  }
}

// ===================================================================
// 🎯 UTILS PARA MANEJO DE ERRORES
// ===================================================================

/**
 * Manejo centralizado de errores del CalculationOrchestrator
 */
export class CalculationErrorHandler {
  /**
   * Procesar y categorizar errores del orchestrator
   */
  static handleError(error: any): {
    type: 'NETWORK' | 'VALIDATION' | 'CALCULATION' | 'SYSTEM' | 'UNKNOWN';
    message: string;
    recovery?: string;
  } {
    const errorMessage = error?.message || error?.toString() || 'Error desconocido';
    
    // Categorizar por tipo de error
    if (errorMessage.includes('Network')) {
      return {
        type: 'NETWORK',
        message: 'Error de conexión',
        recovery: 'Verificar conectividad e intentar nuevamente'
      };
    }
    
    if (errorMessage.includes('validation') || errorMessage.includes('invalid')) {
      return {
        type: 'VALIDATION',
        message: 'Datos de entrada inválidos',
        recovery: 'Revisar los datos ingresados'
      };
    }
    
    if (errorMessage.includes('calculation') || errorMessage.includes('engine')) {
      return {
        type: 'CALCULATION',
        message: 'Error en el cálculo',
        recovery: 'Intentar con datos diferentes'
      };
    }
    
    if (errorMessage.includes('system') || errorMessage.includes('orchestrator')) {
      return {
        type: 'SYSTEM',
        message: 'Error del sistema',
        recovery: 'Reiniciar la aplicación'
      };
    }
    
    return {
      type: 'UNKNOWN',
      message: errorMessage,
      recovery: 'Contactar soporte técnico'
    };
  }

  /**
   * Mostrar error al usuario de manera amigable
   */
  static showUserFriendlyError(error: any): void {
    const handled = CalculationErrorHandler.handleError(error);
    
    Alert.alert(
      'Error en Cálculo',
      `${handled.message}\n\n${handled.recovery || ''}`,
      [
        { text: 'Entendido', style: 'default' },
        { text: 'Reintentar', style: 'cancel' }
      ]
    );
  }
}

// ===================================================================
// 🎯 ESTILOS
// ===================================================================

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    margin: 8
  },
  healthIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 8,
    backgroundColor: '#ffffff',
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1
  },
  healthDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8
  },
  healthText: {
    flex: 1,
    fontSize: 14,
    color: '#333'
  },
  checkButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center'
  },
  checkButtonText: {
    fontSize: 16
  },
  calculateButton: {
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16
  },
  calculateButtonDisabled: {
    backgroundColor: '#cccccc'
  },
  calculateButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600'
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 6,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#f44336'
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 14
  },
  resultContainer: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333'
  },
  resultText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4
  },
  cacheHitText: {
    fontSize: 12,
    color: '#4CAF50',
    marginTop: 4,
    fontStyle: 'italic'
  }
});

// ===================================================================
// 🎯 EXPORTS
// ===================================================================

export {
  useCalculationOrchestrator,
  CalculationService,
  CalculationErrorHandler
};
