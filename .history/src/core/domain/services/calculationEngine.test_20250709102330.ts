import { calculateProbability } from './calculationEngine';
import { UserInput } from '../models';
import * as factorEvaluators from '../logic/factorEvaluators';

jest.mock('../logic/reportGenerator');
jest.mock('../logic/factorEvaluators');

const mockedFactorEvaluators = factorEvaluators as jest.Mocked<typeof factorEvaluators>;

describe('calculateProbability Engine', () => {

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

  beforeEach(() => {
    // Limpia todas las simulaciones antes de cada prueba.
    jest.clearAllMocks();

    // Establecemos un comportamiento base NEUTRO (factor de 1.0) para todos los mocks.
    // Es más repetitivo, pero es 100% explícito y a prueba de errores.
    mockedFactorEvaluators.evaluateAgeBaseline.mockReturnValue({ factors: { baseAgeProbability: 17.5 }, diagnostics: { agePotential: 'Test' } });
    mockedFactorEvaluators.evaluateImc.mockReturnValue({ factors: { bmi: 1.0 } });
    mockedFactorEvaluators.evaluateMenstrualCycle.mockReturnValue({ factors: { cycle: 1.0 } });
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
    mockedFactorEvaluators.evaluateHOMA.mockReturnValue({ factors: { homa: 1.0 } });
    mockedFactorEvaluators.evaluateInfertilityYears.mockReturnValue({ factors: { infertilityDuration: 1.0 } });
    mockedFactorEvaluators.evaluatePelvicSurgeries.mockReturnValue({ factors: { pelvicSurgery: 1.0 } });
    mockedFactorEvaluators.evaluateMaleFactor.mockReturnValue({ factors: { male: 1.0 } });
  });

  test('debería calcular el pronóstico correctamente para un perfil ideal', () => {
    const result = calculateProbability(baseUserInput);
    // Con todos los factores en 1.0, el resultado debe ser igual a la probabilidad base.
    expect(result.report.numericPrognosis).toBeCloseTo(17.5);
  });

  test('debería devolver un pronóstico de 0 si existe un factor crítico (OTB)', () => {
    // Sobrescribimos el mock solo para este test
    mockedFactorEvaluators.evaluateOtb.mockReturnValue({ factors: { otb: 0.0 } });
    const result = calculateProbability(baseUserInput);
    expect(result.report.numericPrognosis).toBe(0);
  });

  test('debería aplicar múltiples factores de penalización correctamente', () => {
    // Sobrescribimos los mocks solo para este test
    mockedFactorEvaluators.evaluateImc.mockReturnValue({ factors: { bmi: 0.85 } });
    mockedFactorEvaluators.evaluateTsh.mockReturnValue({ factors: { tsh: 0.8 } });
    
    const result = calculateProbability(baseUserInput);
    
    // El cálculo esperado es: 17.5 (base) * 0.85 (imc) * 0.8 (tsh) = 11.9
    expect(result.report.numericPrognosis).toBeCloseTo(11.9);
  });

  test('debería recolectar los datos faltantes de múltiples evaluadores', () => {
    // Sobrescribimos los mocks solo para este test
    mockedFactorEvaluators.evaluateAmh.mockReturnValue({ diagnostics: { missingData: ["Hormona Antimülleriana (AMH)"] } });
    mockedFactorEvaluators.evaluateHsg.mockReturnValue({ diagnostics: { missingData: ["Resultado de HSG"] } });
    
    const result = calculateProbability(baseUserInput);

    expect(result.diagnostics.missingData).toContain("Hormona Antimülleriana (AMH)");
    expect(result.diagnostics.missingData).toContain("Resultado de HSG");
  });
});