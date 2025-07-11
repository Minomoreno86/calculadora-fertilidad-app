import {
  evaluateAgeBaseline,
  evaluateBmi,
  evaluateCycle,
  evaluatePcos,
  evaluateEndometriosis,
  evaluateMyomas,
  evaluateAdenomyosis,
  evaluatePolyps,
  evaluateHsg,
  evaluateOtb,
  evaluateAmh,
  evaluateProlactin,
  evaluateTsh,
  evaluateHoma,
  evaluateInfertilityDuration,
  evaluatePelvicSurgeries,
  evaluateMaleFactor,
} from './factorEvaluators';
import { MyomaType, AdenomyosisType, PolypType, HsgResult, OtbMethod } from '../models';

describe('Factor Evaluators', () => {
  // Test evaluateAgeBaseline
  describe('evaluateAgeBaseline', () => {
    test('should return max fertility for age <= 24', () => {
      const result = evaluateAgeBaseline(24);
      expect(result.factors?.baseAgeProbability).toBe(25.0);
      expect(result.diagnostics?.agePotential).toBe('Fertilidad máxima');
    });

    test('should return excellent fertility for age 25-29', () => {
      const result = evaluateAgeBaseline(27);
      expect(result.factors?.baseAgeProbability).toBe(22.5);
      expect(result.diagnostics?.agePotential).toBe('Fertilidad excelente');
    });

    test('should return good fertility for age 30-34', () => {
      const result = evaluateAgeBaseline(32);
      expect(result.factors?.baseAgeProbability).toBe(17.5);
      expect(result.diagnostics?.agePotential).toBe('Buena fertilidad');
    });

    test('should return declining fertility for age 35-39', () => {
      const result = evaluateAgeBaseline(37);
      expect(result.factors?.baseAgeProbability).toBe(10.0);
      expect(result.diagnostics?.agePotential).toBe('Fecundidad en descenso');
    });

    test('should return low pregnancy rate for age 40-44', () => {
      const result = evaluateAgeBaseline(42);
      expect(result.factors?.baseAgeProbability).toBe(5.0);
      expect(result.diagnostics?.agePotential).toBe('Baja tasa de embarazo');
    });

    test('should return very low probability for age >= 45', () => {
      const result = evaluateAgeBaseline(45);
      expect(result.factors?.baseAgeProbability).toBe(1.5);
      expect(result.diagnostics?.agePotential).toBe('Probabilidad muy baja');
    });

    test('should return out of range for invalid age', () => {
      const result = evaluateAgeBaseline(0);
      expect(result.factors?.baseAgeProbability).toBe(0);
      expect(result.diagnostics?.agePotential).toBe('Edad fuera de rango clínico');
    });
  });

  // Test evaluateBmi
  describe('evaluateBmi', () => {
    test('should return missing data for null BMI', () => {
      const result = evaluateBmi(null);
      expect(result.diagnostics?.missingData).toContain('Índice de Masa Corporal (IMC)');
    });

    test('should return 0.8 for underweight BMI', () => {
      const result = evaluateBmi(18.0);
      expect(result.factors?.bmi).toBe(0.8);
      expect(result.diagnostics?.bmiComment).toBe('Bajo peso');
    });

    test('should return 1.0 for normal BMI', () => {
      const result = evaluateBmi(22.0);
      expect(result.factors?.bmi).toBe(1.0);
      expect(result.diagnostics?.bmiComment).toBe('Peso normal');
    });

    test('should return 0.85 for overweight/obese BMI', () => {
      const result = evaluateBmi(28.0);
      expect(result.factors?.bmi).toBe(0.85);
      expect(result.diagnostics?.bmiComment).toBe('Sobrepeso/Obesidad');
    });
  });

  // Test evaluateCycle
  describe('evaluateCycle', () => {
    test('should return missing data for undefined cycle duration', () => {
      const result = evaluateCycle(undefined);
      expect(result.diagnostics?.missingData).toContain('Duración del ciclo menstrual');
    });

    test('should return 1.0 for regular cycle', () => {
      const result = evaluateCycle(28);
      expect(result.factors?.cycle).toBe(1.0);
      expect(result.diagnostics?.cycleComment).toBe('Ciclo regular');
    });

    test('should return 0.7 for irregular cycle', () => {
      const result = evaluateCycle(20);
      expect(result.factors?.cycle).toBe(0.7);
      expect(result.diagnostics?.cycleComment).toBe('Ciclo irregular');
    });
  });

  // Test evaluatePcos
  describe('evaluatePcos', () => {
    test('should return 1.0 if no PCOS', () => {
      const result = evaluatePcos(false, 22, 28);
      expect(result.factors?.pcos).toBe(1.0);
    });

    test('should return mild severity for PCOS without other factors', () => {
      const result = evaluatePcos(true, 22, 28);
      expect(result.factors?.pcos).toBe(1.0);
      expect(result.diagnostics?.pcosSeverity).toBe('Leve');
    });

    test('should return moderate severity for PCOS with high BMI', () => {
      const result = evaluatePcos(true, 28, 28);
      expect(result.factors?.pcos).toBe(0.9);
      expect(result.diagnostics?.pcosSeverity).toBe('Moderado');
    });

    test('should return moderate severity for PCOS with long cycle', () => {
      const result = evaluatePcos(true, 22, 38);
      expect(result.factors?.pcos).toBe(0.85);
      expect(result.diagnostics?.pcosSeverity).toBe('Moderado');
    });

    test('should return severe for PCOS with very high BMI', () => {
      const result = evaluatePcos(true, 32, 28);
      expect(result.diagnostics?.pcosSeverity).toBe('Severo');
    });

    test('should return severe for PCOS with very long cycle', () => {
      const result = evaluatePcos(true, 22, 48);
      expect(result.diagnostics?.pcosSeverity).toBe('Severo');
    });
  });

  // Test evaluateEndometriosis
  describe('evaluateEndometriosis', () => {
    test('should return 1.0 for grade 0', () => {
      const result = evaluateEndometriosis(0);
      expect(result.factors?.endometriosis).toBe(1.0);
    });

    test('should return 0.85 for grade 1', () => {
      const result = evaluateEndometriosis(1);
      expect(result.factors?.endometriosis).toBe(0.85);
      expect(result.diagnostics?.endometriosisComment).toBe('Endometriosis leve (Grados I-II)');
    });

    test('should return 0.6 for grade 3', () => {
      const result = evaluateEndometriosis(3);
      expect(result.factors?.endometriosis).toBe(0.6);
      expect(result.diagnostics?.endometriosisComment).toBe('Endometriosis severa (Grados III-IV)');
    });
  });

  // Test evaluateMyomas
  describe('evaluateMyomas', () => {
    test('should return 1.0 for no myomas', () => {
      const result = evaluateMyomas(MyomaType.None);
      expect(result.factors?.myoma).toBe(1.0);
    });

    test('should return 0.3 for submucosal myoma', () => {
      const result = evaluateMyomas(MyomaType.Submucosal);
      expect(result.factors?.myoma).toBe(0.3);
      expect(result.diagnostics?.myomaComment).toBe('Mioma submucoso detectado');
    });

    test('should return 0.6 for large intramural myoma', () => {
      const result = evaluateMyomas(MyomaType.IntramuralLarge);
      expect(result.factors?.myoma).toBe(0.6);
      expect(result.diagnostics?.myomaComment).toBe('Mioma intramural grande detectado');
    });
  });

  // Test evaluateAdenomyosis
  describe('evaluateAdenomyosis', () => {
    test('should return 1.0 for no adenomyosis', () => {
      const result = evaluateAdenomyosis(AdenomyosisType.None);
      expect(result.factors?.adenomyosis).toBe(1.0);
    });

    test('should return 0.8 for focal adenomyosis', () => {
      const result = evaluateAdenomyosis(AdenomyosisType.Focal);
      expect(result.factors?.adenomyosis).toBe(0.8);
      expect(result.diagnostics?.adenomyosisComment).toBe('Adenomiosis focal');
    });

    test('should return 0.5 for diffuse adenomyosis', () => {
      const result = evaluateAdenomyosis(AdenomyosisType.Diffuse);
      expect(result.factors?.adenomyosis).toBe(0.5);
      expect(result.diagnostics?.adenomyosisComment).toBe('Adenomiosis difusa');
    });
  });

  // Test evaluatePolyps
  describe('evaluatePolyps', () => {
    test('should return 1.0 for no polyps', () => {
      const result = evaluatePolyps(PolypType.None);
      expect(result.factors?.polyp).toBe(1.0);
    });

    test('should return 0.85 for small polyp', () => {
      const result = evaluatePolyps(PolypType.Small);
      expect(result.factors?.polyp).toBe(0.85);
      expect(result.diagnostics?.polypComment).toBe('Pólipo endometrial pequeño (< 1 cm)');
    });

    test('should return 0.7 for large polyp', () => {
      const result = evaluatePolyps(PolypType.Large);
      expect(result.factors?.polyp).toBe(0.7);
      expect(result.diagnostics?.polypComment).toBe('Pólipo grande (≥ 1 cm) o múltiples');
    });

    test('should return 0.5 for ostium polyp', () => {
      const result = evaluatePolyps(PolypType.Ostium);
      expect(result.factors?.polyp).toBe(0.5);
      expect(result.diagnostics?.polypComment).toBe('Pólipo sobre ostium tubárico');
    });
  });

  // Test evaluateHsg
  describe('evaluateHsg', () => {
    test('should return 1.0 for normal HSG', () => {
      const result = evaluateHsg(HsgResult.Normal);
      expect(result.factors?.hsg).toBe(1.0);
      expect(result.diagnostics?.hsgComment).toBe('Ambas trompas permeables');
    });

    test('should return 0.7 for unilateral obstruction', () => {
      const result = evaluateHsg(HsgResult.Unilateral);
      expect(result.factors?.hsg).toBe(0.7);
      expect(result.diagnostics?.hsgComment).toBe('Obstrucción tubárica unilateral');
    });

    test('should return 0.0 for bilateral obstruction', () => {
      const result = evaluateHsg(HsgResult.Bilateral);
      expect(result.factors?.hsg).toBe(0.0);
      expect(result.diagnostics?.hsgComment).toBe('Obstrucción tubárica bilateral');
    });

    test('should return 0.3 for malformation', () => {
      const result = evaluateHsg(HsgResult.Malformation);
      expect(result.factors?.hsg).toBe(0.3);
      expect(result.diagnostics?.hsgComment).toBe('Alteración de la cavidad uterina');
    });

    test('should return missing data for unknown HSG', () => {
      const result = evaluateHsg(HsgResult.Unknown);
      expect(result.diagnostics?.missingData).toContain('Resultado de Histerosalpingografía (HSG)');
    });
  });

  // Test evaluateOtb
  describe('evaluateOtb', () => {
    test('should return 1.0 if no OTB', () => {
      const result = evaluateOtb(false);
      expect(result.factors?.otb).toBe(1.0);
      expect(result.diagnostics?.hsgComment).toBe('No se ha realizado ligadura de trompas.');
    });

    test('should return 0.0 if OTB is present', () => {
      const result = evaluateOtb(true);
      expect(result.factors?.otb).toBe(0.0);
      expect(result.diagnostics?.hsgComment).toContain('Edad materna no especificada para evaluación de recanalización.');
    });

    test('should return 0.0 if OTB is present with specific method', () => {
      const result = evaluateOtb(true, 30, OtbMethod.Clips);
      expect(result.factors?.otb).toBe(0.0);
      expect(result.diagnostics?.hsgComment).toContain('Edad materna < 35 años: Ideal para recanalización tubárica.');
      expect(result.diagnostics?.hsgComment).toContain('Método de OTB: Clips, anillos o ligaduras. Mejor pronóstico para recanalización.');
    });
  });

  // Test evaluateAmh
  describe('evaluateAmh', () => {
    test('should return missing data for undefined AMH', () => {
      const result = evaluateAmh(undefined);
      expect(result.diagnostics?.missingData).toContain('Hormona Antimülleriana (AMH)');
    });

    test('should return 0.9 for high AMH', () => {
      const result = evaluateAmh(5.0);
      expect(result.factors?.amh).toBe(0.9);
      expect(result.diagnostics?.ovarianReserve).toBe('Alta reserva ovárica');
    });

    test('should return 1.0 for adequate AMH', () => {
      const result = evaluateAmh(2.5);
      expect(result.factors?.amh).toBe(1.0);
      expect(result.diagnostics?.ovarianReserve).toBe('Reserva ovárica adecuada');
    });

    test('should return 0.85 for slightly decreased AMH', () => {
      const result = evaluateAmh(1.5);
      expect(result.factors?.amh).toBe(0.85);
      expect(result.diagnostics?.ovarianReserve).toBe('Reserva ovárica ligeramente disminuida');
    });

    test('should return 0.6 for low AMH', () => {
      const result = evaluateAmh(0.7);
      expect(result.factors?.amh).toBe(0.6);
      expect(result.diagnostics?.ovarianReserve).toBe('Baja reserva ovárica');
    });

    test('should return 0.3 for very low AMH', () => {
      const result = evaluateAmh(0.2);
      expect(result.factors?.amh).toBe(0.3);
      expect(result.diagnostics?.ovarianReserve).toBe('Reserva ovárica muy baja');
    });
  });

  // Test evaluateProlactin
  describe('evaluateProlactin', () => {
    test('should return missing data for undefined prolactin', () => {
      const result = evaluateProlactin(undefined);
      expect(result.diagnostics?.missingData).toContain('Nivel de Prolactina');
    });

    test('should return 1.0 for normal prolactin', () => {
      const result = evaluateProlactin(10);
      expect(result.factors?.prolactin).toBe(1.0);
    });

    test('should return 0.7 for high prolactin', () => {
      const result = evaluateProlactin(30);
      expect(result.factors?.prolactin).toBe(0.7);
      expect(result.diagnostics?.prolactinComment).toBe('Hiperprolactinemia');
    });
  });

  // Test evaluateTsh
  describe('evaluateTsh', () => {
    test('should return missing data for undefined TSH', () => {
      const result = evaluateTsh(undefined);
      expect(result.diagnostics?.missingData).toContain('Nivel de TSH');
    });

    test('should return 1.0 for normal TSH', () => {
      const result = evaluateTsh(2.0);
      expect(result.factors?.tsh).toBe(1.0);
    });

    test('should return 0.8 for high TSH', () => {
      const result = evaluateTsh(3.0);
      expect(result.factors?.tsh).toBe(0.8);
      expect(result.diagnostics?.tshComment).toBe('TSH no óptima para fertilidad');
    });
  });

  // Test evaluateHoma
  describe('evaluateHoma', () => {
    test('should return 1.0 for undefined HOMA', () => {
      const result = evaluateHoma(undefined);
      expect(result.factors?.homa).toBe(1.0);
    });

    test('should return 1.0 for normal HOMA', () => {
      const result = evaluateHoma(2.0);
      expect(result.factors?.homa).toBe(1.0);
    });

    test('should return 0.95 for mild insulin resistance', () => {
      const result = evaluateHoma(3.0);
      expect(result.factors?.homa).toBe(0.95);
      expect(result.diagnostics?.homaComment).toBe('Resistencia a la insulina leve');
    });

    test('should return 0.9 for significant insulin resistance', () => {
      const result = evaluateHoma(4.5);
      expect(result.factors?.homa).toBe(0.9);
      expect(result.diagnostics?.homaComment).toBe('Resistencia a la insulina significativa');
    });
  });

  // Test evaluateInfertilityDuration
  describe('evaluateInfertilityDuration', () => {
    test('should return 1.0 for undefined duration', () => {
      const result = evaluateInfertilityDuration(undefined);
      expect(result.factors?.infertilityDuration).toBe(1.0);
    });

    test('should return 1.0 for duration < 3 years', () => {
      const result = evaluateInfertilityDuration(2);
      expect(result.factors?.infertilityDuration).toBe(1.0);
    });

    test('should return 0.93 for duration 3-4 years', () => {
      const result = evaluateInfertilityDuration(3);
      expect(result.factors?.infertilityDuration).toBe(0.93);
    });

    test('should return 0.85 for duration >= 5 years', () => {
      const result = evaluateInfertilityDuration(5);
      expect(result.factors?.infertilityDuration).toBe(0.85);
    });
  });

  // Test evaluatePelvicSurgeries
  describe('evaluatePelvicSurgeries', () => {
    test('should return 1.0 for undefined surgeries', () => {
      const result = evaluatePelvicSurgeries(undefined);
      expect(result.factors?.pelvicSurgery).toBe(1.0);
    });

    test('should return 1.0 for 0 surgeries', () => {
      const result = evaluatePelvicSurgeries(0);
      expect(result.factors?.pelvicSurgery).toBe(1.0);
    });

    test('should return 0.95 for 1 surgery', () => {
      const result = evaluatePelvicSurgeries(1);
      expect(result.factors?.pelvicSurgery).toBe(0.95);
    });

    test('should return 0.88 for 2 or more surgeries', () => {
      const result = evaluatePelvicSurgeries(2);
      expect(result.factors?.pelvicSurgery).toBe(0.88);
    });
  });

  // Test evaluateMaleFactor
  describe('evaluateMaleFactor', () => {
    test('should return missing data if all sperm parameters are undefined', () => {
      const result = evaluateMaleFactor({});
      expect(result.diagnostics?.missingData).toContain('Espermatograma completo');
    });

    test('should return 1.0 for normal sperm parameters', () => {
      const result = evaluateMaleFactor({
        spermConcentration: 50,
        spermProgressiveMotility: 60,
        spermNormalMorphology: 10,
      });
      expect(result.factors?.male).toBe(1.0);
      expect(result.diagnostics?.maleFactorDetailed).toBe('Parámetros seminales normales');
    });

    test('should return worst factor for severe oligozoospermia', () => {
      const result = evaluateMaleFactor({
        spermConcentration: 3,
        spermProgressiveMotility: 60,
        spermNormalMorphology: 10,
      });
      expect(result.factors?.male).toBe(0.25);
      expect(result.diagnostics?.maleFactorDetailed).toContain('Oligozoospermia severa');
    });

    test('should return worst factor for severe asthenozoospermia', () => {
      const result = evaluateMaleFactor({
        spermConcentration: 50,
        spermProgressiveMotility: 15,
        spermNormalMorphology: 10,
      });
      expect(result.factors?.male).toBe(0.4);
      expect(result.diagnostics?.maleFactorDetailed).toContain('Astenozoospermia severa');
    });

    test('should return worst factor for teratozoospermia', () => {
      const result = evaluateMaleFactor({
        spermConcentration: 50,
        spermProgressiveMotility: 60,
        spermNormalMorphology: 2,
      });
      expect(result.factors?.male).toBe(0.5);
      expect(result.diagnostics?.maleFactorDetailed).toContain('Teratozoospermia');
    });

    test('should combine multiple diagnoses', () => {
      const result = evaluateMaleFactor({
        spermConcentration: 10,
        spermProgressiveMotility: 25,
        spermNormalMorphology: 2,
      });
      expect(result.factors?.male).toBe(0.5); // Teratozoospermia is worst
      expect(result.diagnostics?.maleFactorDetailed).toContain('Oligozoospermia leve-moderada');
      expect(result.diagnostics?.maleFactorDetailed).toContain('Astenozoospermia leve');
      expect(result.diagnostics?.maleFactorDetailed).toContain('Teratozoospermia');
    });
  });
});
