import { calculateProbability } from './calculationEngine';
import { UserInput, Report } from '@/core/domain/models';
import * as factorEvaluators from '@/core/domain/logic/factorEvaluators';
import * as reportGenerator from '@/core/domain/logic/reportGenerator';

// Usamos el alias de ruta que configuramos
jest.mock('@/core/domain/logic/factorEvaluators');
jest.mock('@/core/domain/logic/reportGenerator');

// Casteamos los módulos a un tipo que nos permita manipular los mocks
const mockedFactorEvaluators = factorEvaluators as jest.Mocked<typeof factorEvaluators>;
const mockedReportGenerator = reportGenerator as jest.Mocked<typeof reportGenerator>;

describe('calculateProbability Engine', () => {

  // Perfil base de una usuaria para las pruebas.
  const baseUserInput: UserInput = {
    age: 30,
    bmi: 22,
    cycleDuration: 28,
    infertilityDuration: 1,
    hasPcos: false,
    endometriosisGrade: 0,
    myomaType: 'none',
    adenomyosisType: 'none',
    polypType: 'none',
    hsgResult: 'normal',
    hasOtb: false,
    hasPelvicSurgery: false,
    pelvicSurgeriesNumber: 0,
    amh: 2.5,
    prolactin: 15,
    tsh: 2.0,
    tpoAbPositive: false,
    homaIr: 1.5,
    spermConcentration: 40,
    spermProgressiveMotility: 50,
    spermNormalMorphology: 5,
  };

  // Se ejecuta ANTES de cada 'test' para asegurar que las pruebas estén aisladas
  beforeEach(() => {
    jest.clearAllMocks();

    // Establecemos un comportamiento base NEUTRO para todos los mocks.
    mockedFactorEvaluators.evaluateAgeBaseline.mockReturnValue({ factors: { baseAgeProbability: 17.5 } });
    mockedFactorEvaluators.evaluateBmi.mockReturnValue({ factors: { bmi: 1.0 } });
    mockedFactorEvaluators.evaluateCycle.mockReturnValue({ factors: { cycle: 1.0 } });
    mockedFactorEvaluators.evaluatePcos.mockReturnValue({ factors: { pcos: 1.0 } });
    mockedFactorEvaluators.evaluateEndometriosis.mockReturnValue({ factors: { endometriosis: 1.0 } });
    mockedFactorEvaluators.evaluateMyomas.mockReturnValue({ factors: { myoma: 1.0 } });
    mockedFactorEvaluators.evaluateAdenomyosis.mockReturnValue({ factors: { adenomyosis: 1.0 } });
    mockedFactorEvaluators.evaluatePolyps.mockReturnValue({ factors: { polyp: 1.0 } });
    mockedFactorEvaluators.evaluateHsg.mockReturnValue({ factors: { hsg: 1.0 } });
    mockedFactorEvaluators.evaluateOtb.mockReturnValue({ factors: { otb: 1.0 } });
    mockedFactorEvaluators.evaluateAmh.mockReturnValue({ factors: { amh: 1.0 } });
    mockedFactorEvaluators.evaluateProlactin.mockReturnValue({ factors: { prolactin: 1.0 } });
    mockedFactorEvaluators.evaluateTsh.mockReturnValue({ factors: { tsh: 1.0 } });
    mockedFactorEvaluators.evaluateHoma.mockReturnValue({ factors: { homa: 1.0 } });
    mockedFactorEvaluators.evaluateInfertilityDuration.mockReturnValue({ factors: { infertilityDuration: 1.0 } });
    mockedFactorEvaluators.evaluatePelvicSurgeries.mockReturnValue({ factors: { pelvicSurgery: 1.0 } });
    mockedFactorEvaluators.evaluateMaleFactor.mockReturnValue({ factors: { male: 1.0 } });
    
    // Mock para el generador de reportes.
    mockedReportGenerator.generateFinalReport.mockImplementation((numericPrognosis) => {
      return { numericPrognosis } as Report;
    });
  });

  test('debería calcular el pronóstico correctamente para un perfil ideal', () => {
    const result = calculateProbability(baseUserInput);
    expect(result.report.numericPrognosis).toBeCloseTo(17.5);
  });

  test('debería devolver un pronóstico de 0 si existe un factor crítico (OTB)', () => {
    mockedFactorEvaluators.evaluateOtb.mockReturnValue({ factors: { otb: 0.0 } });
    const result = calculateProbability(baseUserInput);
    expect(result.report.numericPrognosis).toBe(0);
  });

  test('debería aplicar múltiples factores de penalización correctamente', () => {
    mockedFactorEvaluators.evaluateBmi.mockReturnValue({ factors: { bmi: 0.85 } });
    mockedFactorEvaluators.evaluateTsh.mockReturnValue({ factors: { tsh: 0.8 } });
    const result = calculateProbability(baseUserInput);
    expect(result.report.numericPrognosis).toBeCloseTo(11.9);
  });

  test('debería recolectar los datos faltantes de múltiples evaluadores', () => {
    mockedFactorEvaluators.evaluateAmh.mockReturnValue({ diagnostics: { missingData: ["Hormona Antimülleriana (AMH)"] } });
    mockedFactorEvaluators.evaluateHsg.mockReturnValue({ diagnostics: { missingData: ["Resultado de HSG"] } });
    const result = calculateProbability(baseUserInput);
    expect(result.diagnostics.missingData).toContain("Hormona Antimülleriana (AMH)");
    expect(result.diagnostics.missingData).toContain("Resultado de HSG");
  });
});