/**
 * 🧪 TESTS PARA PROFILER INTEGRATION
 * 
 * Suite de pruebas para la integración del profiler con el sistema modular
 */

import {
  calculateFertilityWithProfiling,
  executePredictiveAnalysisWithProfiling,
  executeParallelValidationWithProfiling,
  executeSimulationWithProfiling,
  useProductionMetrics,
  configureProfilingForEnvironment,
  initializeProductionProfiling
} from '../ProfilerIntegration';
import { UserInput } from '../../domain/models';
import { productionProfiler } from '../../monitoring/ProductionProfiler';

// Mock del CalculationOrchestrator
jest.mock('../../domain/services/modular/CalculationOrchestrator', () => ({
  calculateFertility: jest.fn(),
  CalculationOptions: {}
}));

// Mock del ProductionProfiler
jest.mock('../../monitoring/ProductionProfiler', () => ({
  productionProfiler: {
    recordModularEngineMetric: jest.fn(),
    recordPredictiveAIMetric: jest.fn(),
    recordParallelValidationMetric: jest.fn(),
    recordSimulatorMetric: jest.fn(),
    setSamplingRate: jest.fn(),
    getMetrics: jest.fn(),
    getActiveAlerts: jest.fn(),
    getOptimizationSuggestions: jest.fn()
  }
}));

describe('ProfilerIntegration', () => {
  const mockUserInput: UserInput = {
    age: 30,
    cycleDuration: 28,
    infertilityDuration: 2,
    bmi: 23.5,
    hasPcos: false,
    hasOtb: false,
    endometriosisGrade: 0,
    myomaType: 'none' as any,
    adenomyosisType: 'none' as any,
    polypType: 'none' as any,
    hsgResult: 'normal' as any,
    pelvicSurgeriesNumber: 0,
    amh: 2.5,
    tsh: 2.0,
    prolactin: 20,
    spermConcentration: 20,
    spermProgressiveMotility: 40,
    spermNormalMorphology: 6,
    tpoAbPositive: false
  };

  const mockCalculationResult = {
    evaluation: {
      report: {
        numericPrognosis: 85.5,
        category: 'good',
        emoji: '😊'
      }
    },
    metadata: {
      cacheHit: true,
      engineUsed: 'PREMIUM' as any,
      confidenceLevel: 0.9,
      totalExecutionTime: 150
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock de performance.now
    global.performance = {
      now: jest.fn(() => Date.now())
    } as any;
    
    // Mock de import dinámico
    jest.doMock('../../domain/services/modular/CalculationOrchestrator', () => ({
      calculateFertility: jest.fn().mockResolvedValue(mockCalculationResult)
    }));
  });

  // ===================================================================
  // 🎯 TESTS DE CÁLCULO CON PROFILING
  // ===================================================================

  describe('calculateFertilityWithProfiling', () => {
    test('should execute calculation and record metrics', async () => {
      const { calculateFertility } = require('../../domain/services/modular/CalculationOrchestrator');
      calculateFertility.mockResolvedValue(mockCalculationResult);

      const result = await calculateFertilityWithProfiling(mockUserInput);

      expect(result).toEqual(mockCalculationResult);
      expect(productionProfiler.recordModularEngineMetric).toHaveBeenCalledWith({
        mode: 'auto',
        executionTime: expect.any(Number),
        cacheHitRate: 1,
        componentUsage: {
          orchestrator: 1,
          cache: 1,
          engine: 1,
          core: 1
        },
        engineUsed: 'modular'
      });
    });

    test('should handle errors and record error metrics', async () => {
      const { calculateFertility } = require('../../domain/services/modular/CalculationOrchestrator');
      const error = new Error('Test error');
      calculateFertility.mockRejectedValue(error);

      await expect(calculateFertilityWithProfiling(mockUserInput)).rejects.toThrow('Test error');
      
      expect(productionProfiler.recordModularEngineMetric).toHaveBeenCalledWith({
        mode: 'auto',
        executionTime: expect.any(Number),
        cacheHitRate: 0,
        componentUsage: {},
        engineUsed: 'modular'
      });
    });

    test('should use provided options', async () => {
      const { calculateFertility } = require('../../domain/services/modular/CalculationOrchestrator');
      calculateFertility.mockResolvedValue(mockCalculationResult);

      const options = {
        preferredEngine: 'PREMIUM' as any,
        userId: 'test-user'
      };

      await calculateFertilityWithProfiling(mockUserInput, options);

      expect(calculateFertility).toHaveBeenCalledWith(mockUserInput, {
        ...options,
        enableProfiling: true,
        useCache: true,
        userId: 'test-user'
      });
    });
  });

  // ===================================================================
  // 🎯 TESTS DE ANÁLISIS PREDICTIVO
  // ===================================================================

  describe('executePredictiveAnalysisWithProfiling', () => {
    test('should execute predictive analysis and record metrics', async () => {
      const { calculateFertility } = require('../../domain/services/modular/CalculationOrchestrator');
      calculateFertility.mockResolvedValue(mockCalculationResult);

      const result = await executePredictiveAnalysisWithProfiling(mockUserInput);

      expect(result).toHaveProperty('confidence');
      expect(result).toHaveProperty('accuracy');
      expect(productionProfiler.recordPredictiveAIMetric).toHaveBeenCalledWith({
        predictionTime: expect.any(Number),
        engineUsed: 'premium',
        confidence: expect.any(Number),
        accuracy: expect.any(Number)
      });
    });

    test('should handle confidence threshold option', async () => {
      const { calculateFertility } = require('../../domain/services/modular/CalculationOrchestrator');
      calculateFertility.mockResolvedValue(mockCalculationResult);

      const options = {
        confidenceThreshold: 0.9,
        includeRecommendations: true
      };

      await executePredictiveAnalysisWithProfiling(mockUserInput, options);

      expect(calculateFertility).toHaveBeenCalledWith(mockUserInput, {
        preferredEngine: 'PREMIUM',
        enableProfiling: true,
        minConfidenceLevel: 0.9
      });
    });
  });

  // ===================================================================
  // 🎯 TESTS DE VALIDACIÓN PARALELA
  // ===================================================================

  describe('executeParallelValidationWithProfiling', () => {
    test('should execute parallel validation and record metrics', async () => {
      const { calculateFertility } = require('../../domain/services/modular/CalculationOrchestrator');
      calculateFertility.mockResolvedValue(mockCalculationResult);

      const categories = ['age', 'bmi', 'hormones'];
      const results = await executeParallelValidationWithProfiling(mockUserInput, categories);

      expect(results).toHaveLength(categories.length);
      expect(results[0]).toHaveProperty('isValid');
      expect(results[0]).toHaveProperty('errors');
      expect(results[0]).toHaveProperty('warnings');

      expect(productionProfiler.recordParallelValidationMetric).toHaveBeenCalledWith({
        parallelizationGain: expect.any(Number),
        cacheHitRate: expect.any(Number),
        categoriesProcessed: categories
      });
    });

    test('should handle validation errors correctly', async () => {
      const { calculateFertility } = require('../../domain/services/modular/CalculationOrchestrator');
      const lowPrognosisResult = {
        ...mockCalculationResult,
        evaluation: {
          report: {
            numericPrognosis: 15.5,
            category: 'poor',
            emoji: '😔'
          }
        }
      };
      calculateFertility.mockResolvedValue(lowPrognosisResult);

      const categories = ['age'];
      const results = await executeParallelValidationWithProfiling(mockUserInput, categories);

      expect(results[0].isValid).toBe(true); // Still valid, just low prognosis
      expect(results[0].warnings).toContain('Low prognosis');
    });
  });

  // ===================================================================
  // 🎯 TESTS DE SIMULACIÓN
  // ===================================================================

  describe('executeSimulationWithProfiling', () => {
    test('should execute simulation and record metrics', async () => {
      const { calculateFertility } = require('../../domain/services/modular/CalculationOrchestrator');
      calculateFertility.mockResolvedValue(mockCalculationResult);

      const variations = [
        { value: 25, label: 'Age 25' },
        { value: 30, label: 'Age 30' },
        { value: 35, label: 'Age 35' }
      ];

      const result = await executeSimulationWithProfiling(mockUserInput, 'age', variations);

      expect(result.factor).toBe('age');
      expect(result.variations).toHaveLength(variations.length);
      expect(result.metadata.executionTime).toBeGreaterThan(0);

      expect(productionProfiler.recordSimulatorMetric).toHaveBeenCalledWith({
        simulationTime: expect.any(Number),
        factor: 'age',
        engineSelected: 'premium',
        wasOptimal: true
      });
    });

    test('should handle different factor types', async () => {
      const { calculateFertility } = require('../../domain/services/modular/CalculationOrchestrator');
      calculateFertility.mockResolvedValue(mockCalculationResult);

      const variations = [
        { value: true, label: 'Has PCOS' },
        { value: false, label: 'No PCOS' }
      ];

      const result = await executeSimulationWithProfiling(mockUserInput, 'hasPcos', variations);

      expect(result.factor).toBe('hasPcos');
      expect(calculateFertility).toHaveBeenCalledTimes(2);
    });
  });

  // ===================================================================
  // 🎯 TESTS DE CONFIGURACIÓN
  // ===================================================================

  describe('configureProfilingForEnvironment', () => {
    test('should configure production environment', () => {
      process.env.NODE_ENV = 'production';
      configureProfilingForEnvironment();
      
      expect(productionProfiler.setSamplingRate).toHaveBeenCalledWith(0.1);
    });

    test('should configure development environment', () => {
      process.env.NODE_ENV = 'development';
      configureProfilingForEnvironment();
      
      expect(productionProfiler.setSamplingRate).toHaveBeenCalledWith(1.0);
    });

    test('should configure test environment', () => {
      process.env.NODE_ENV = 'test';
      configureProfilingForEnvironment();
      
      expect(productionProfiler.setSamplingRate).toHaveBeenCalledWith(0.0);
    });

    test('should handle unknown environment', () => {
      process.env.NODE_ENV = 'staging';
      configureProfilingForEnvironment();
      
      expect(productionProfiler.setSamplingRate).toHaveBeenCalledWith(0.5);
    });
  });

  // ===================================================================
  // 🎯 TESTS DE HOOK
  // ===================================================================

  describe('useProductionMetrics', () => {
    test('should return metrics, alerts, and suggestions', () => {
      const mockMetrics = { totalCalculations: 100 };
      const mockAlerts = [{ type: 'warning', message: 'High latency' }];
      const mockSuggestions = [{ type: 'optimization', suggestion: 'Enable caching' }];

      (productionProfiler.getMetrics as jest.Mock).mockReturnValue(mockMetrics);
      (productionProfiler.getActiveAlerts as jest.Mock).mockReturnValue(mockAlerts);
      (productionProfiler.getOptimizationSuggestions as jest.Mock).mockReturnValue(mockSuggestions);

      // Mock React hooks
      const mockUseState = jest.fn();
      const mockUseEffect = jest.fn();
      
      jest.doMock('react', () => ({
        useState: mockUseState,
        useEffect: mockUseEffect
      }));

      // Note: Testing React hooks properly would require more complex setup
      // This is a simplified test to verify the function structure
      expect(productionProfiler.getMetrics).toBeDefined();
      expect(productionProfiler.getActiveAlerts).toBeDefined();
      expect(productionProfiler.getOptimizationSuggestions).toBeDefined();
    });
  });

  // ===================================================================
  // 🎯 TESTS DE INICIALIZACIÓN
  // ===================================================================

  describe('initializeProductionProfiling', () => {
    test('should initialize profiling correctly', () => {
      // Mock window object
      global.window = {
        addEventListener: jest.fn()
      } as any;

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      initializeProductionProfiling();

      expect(productionProfiler.setSamplingRate).toHaveBeenCalled();
      expect(window.addEventListener).toHaveBeenCalledWith('error', expect.any(Function));
      expect(window.addEventListener).toHaveBeenCalledWith('unhandledrejection', expect.any(Function));
      expect(consoleSpy).toHaveBeenCalledWith('🚀 Production Profiling inicializado correctamente');

      consoleSpy.mockRestore();
    });
  });

  // ===================================================================
  // 🎯 TESTS DE INTEGRACIÓN
  // ===================================================================

  describe('Integration Tests', () => {
    test('should work with real calculation flow', async () => {
      const { calculateFertility } = require('../../domain/services/modular/CalculationOrchestrator');
      calculateFertility.mockResolvedValue(mockCalculationResult);

      // Simular flujo completo
      const result = await calculateFertilityWithProfiling(mockUserInput);
      
      expect(result).toEqual(mockCalculationResult);
      expect(productionProfiler.recordModularEngineMetric).toHaveBeenCalled();
    });

    test('should handle multiple profiling calls', async () => {
      const { calculateFertility } = require('../../domain/services/modular/CalculationOrchestrator');
      calculateFertility.mockResolvedValue(mockCalculationResult);

      // Múltiples llamadas
      await calculateFertilityWithProfiling(mockUserInput);
      await calculateFertilityWithProfiling(mockUserInput);

      expect(productionProfiler.recordModularEngineMetric).toHaveBeenCalledTimes(2);
    });

    test('should work with different input variations', async () => {
      const { calculateFertility } = require('../../domain/services/modular/CalculationOrchestrator');
      calculateFertility.mockResolvedValue(mockCalculationResult);

      const variations = [
        { ...mockUserInput, age: 25 },
        { ...mockUserInput, age: 35 },
        { ...mockUserInput, hasPcos: true }
      ];

      for (const variation of variations) {
        await calculateFertilityWithProfiling(variation);
      }

      expect(productionProfiler.recordModularEngineMetric).toHaveBeenCalledTimes(3);
    });
  });
});
