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
    jest.clearAllMocks();

    // Establecemos un comportamiento base NEUTRO (factor de 1.0) para todos los mocks.
    // Esto previene errores 'undefined' si una función no fue exportada correctamente.
    Object.values(mockedFactorEvaluators).forEach(mockFn => {
        if (typeof mockFn === 'function') {
            mockFn.mockReturnValue({ factors: {}, diagnostics: {} });
        }
    });

    // Ahora definimos los retornos específicos que necesitamos
    mockedFactorEvaluators.evaluateAgeBaseline.mockReturnValue({ factors: { baseAgeProbability: 17.5 }, diagnostics: { agePotential: 'Test' } });
  });

  test('debería calcular el pronóstico correctamente para un perfil ideal', () => {
    const result = calculateProbability(baseUserInput);
    // Para un perfil ideal, todos los factores deben ser 1.0, resultando en la probabilidad base.
    expect(result.report.numericPrognosis).toBeCloseTo(17.5);
  });

  test('debería devolver un pronóstico de 0 si existe un factor crítico (OTB)', () => {
    mockedFactorEvaluators.evaluateOtb.mockReturnValue({ factors: { otb: 0.0 } });
    const result = calculateProbability(baseUserInput);
    expect(result.report.numericPrognosis).toBe(0);
  });

  test('debería aplicar múltiples factores de penalización correctamente', () => {
    mockedFactorEvaluators.evaluateImc.mockReturnValue({ factors: { bmi: 0.85 } });
    mockedFactorEvaluators.evaluateTsh.mockReturnValue({ factors: { tsh: 0.8 } });
    
    const result = calculateProbability(baseUserInput);
    
    // El cálculo esperado es: 17.5 (base) * 0.85 (imc) * 0.8 (tsh) = 11.9
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