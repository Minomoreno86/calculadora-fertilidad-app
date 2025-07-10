import { calculateProbability } from './calculationEngine';
import { UserInput, Report, MyomaType, AdenomyosisType, PolypType, HsgResult } from '@/core/domain/models';
import * as factorEvaluators from '@/core/domain/logic/factorEvaluators';
import * as reportGenerator from '@/core/domain/logic/reportGenerator';

// ===================================================================
// Mock Manual Explícito: Tomamos control total sobre la simulación.
// ===================================================================
jest.mock('@/core/domain/logic/factorEvaluators', () => ({
  __esModule: true, // Necesario para la compatibilidad con módulos ES
  evaluateAgeBaseline: jest.fn(),
  evaluateBmi: jest.fn(),
  evaluateCycle: jest.fn(),
  evaluatePcos: jest.fn(),
  evaluateEndometriosis: jest.fn(),
  evaluateMyomas: jest.fn(),
  evaluateAdenomyosis: jest.fn(),
  evaluatePolyps: jest.fn(),
  evaluateHsg: jest.fn(),
  evaluateOtb: jest.fn(),
  evaluateAmh: jest.fn(),
  evaluateProlactin: jest.fn(),
  evaluateTsh: jest.fn(),
  evaluateHoma: jest.fn(),
  evaluateInfertilityDuration: jest.fn(),
  evaluatePelvicSurgeries: jest.fn(),
  evaluateMaleFactor: jest.fn(),
}));

jest.mock('@/core/domain/logic/reportGenerator');

const mockedFactorEvaluators = factorEvaluators as jest.Mocked<typeof factorEvaluators>;
const mockedReportGenerator = reportGenerator as jest.Mocked<typeof reportGenerator>;

describe('calculateProbability Engine', () => {
  const baseUserInput: UserInput = {
    age: 30,
    bmi: 22,
    cycleDuration: 28,
    infertilityDuration: 1,
    hasPcos: false,
    endometriosisGrade: 0,
    myomaType: MyomaType.None,
    adenomyosisType: AdenomyosisType.None,
    polypType: PolypType.None,
    hsgResult: HsgResult.Normal,
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

    // Ahora podemos configurar el valor de retorno de nuestros mocks explícitos con total seguridad.
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

    mockedReportGenerator.generateFinalReport.mockImplementation(
      (numericPrognosis) => ({ numericPrognosis }) as Report,
    );
  });

  // Los tests siguen siendo los mismos, pero ahora se ejecutarán sobre una base sólida.
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
    mockedFactorEvaluators.evaluateAmh.mockReturnValue({
      diagnostics: { missingData: ['Hormona Antimülleriana (AMH)'] },
    });
    mockedFactorEvaluators.evaluateHsg.mockReturnValue({ diagnostics: { missingData: ['Resultado de HSG'] } });
    const result = calculateProbability(baseUserInput);
    expect(result.diagnostics.missingData).toContain('Hormona Antimülleriana (AMH)');
    expect(result.diagnostics.missingData).toContain('Resultado de HSG');
  });

  test('debería manejar valores indefinidos en userInput y aplicar valores por defecto', () => {
    const userInputWithUndefined: UserInput = {
      ...baseUserInput,
      amh: undefined, // Simula un valor no proporcionado
      prolactin: undefined,
      tsh: undefined,
      homaIr: undefined,
      spermConcentration: undefined,
      spermProgressiveMotility: undefined,
      spermNormalMorphology: undefined,
    };

    // Mockear los evaluadores para que devuelvan undefined para los factores y diagnósticos
    // que se espera que sean undefined en el resultado de la evaluación.
    mockedFactorEvaluators.evaluateAmh.mockReturnValue({ factors: { amh: undefined }, diagnostics: { ovarianReserve: undefined } });
    mockedFactorEvaluators.evaluateProlactin.mockReturnValue({ factors: { prolactin: undefined }, diagnostics: { prolactinComment: undefined } });
    mockedFactorEvaluators.evaluateTsh.mockReturnValue({ factors: { tsh: undefined }, diagnostics: { tshComment: undefined } });
    mockedFactorEvaluators.evaluateHoma.mockReturnValue({ factors: { homa: undefined } });
    mockedFactorEvaluators.evaluateMaleFactor.mockReturnValue({ factors: { male: undefined }, diagnostics: { maleFactorDetailed: undefined } });

    const result = calculateProbability(userInputWithUndefined);

    // Verificar que los factores y diagnósticos se inicialicen con los valores por defecto (1.0 para factores, 'No evaluada' o '' para diagnósticos)
    expect(result.factors.amh).toBe(1.0);
    expect(result.factors.prolactin).toBe(1.0);
    expect(result.factors.tsh).toBe(1.0);
    expect(result.factors.homa).toBe(1.0);
    expect(result.factors.male).toBe(1.0);

    expect(result.diagnostics.ovarianReserve).toBe('No evaluada');
    expect(result.diagnostics.prolactinComment).toBe('');
    expect(result.diagnostics.tshComment).toBe('');
    expect(result.diagnostics.maleFactorDetailed).toBe('Normal o sin datos');
  });
});
