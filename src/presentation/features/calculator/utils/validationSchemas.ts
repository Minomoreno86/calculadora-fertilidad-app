import { z } from 'zod';
import { MyomaType, AdenomyosisType, PolypType, HsgResult, OtbMethod } from '@/core/domain/models';

// Helper para transformar string a number
const stringToNumber = z.string().transform((val) => {
  const num = parseFloat(val);
  return isNaN(num) ? 0 : num;
});

// Helper para campos enteros que vienen como string desde formularios
const stringToInteger = (val: unknown): number => {
  if (typeof val === 'string') {
    const num = parseInt(val, 10);
    return isNaN(num) ? 0 : num;
  }
  if (typeof val === 'number') {
    return Math.floor(val);
  }
  return 0;
};

// Helper para campos opcionales que pueden ser string vacío
const optionalStringToNumber = z.union([
  z.string().transform((val) => {
    if (val === '' || val === undefined) return undefined;
    const num = parseFloat(val);
    return isNaN(num) ? undefined : num;
  }),
  z.number(),
  z.undefined()
]).optional();

export const formSchema = z.object({
  // ✅ Demografia básica - SIN RESTRICCIONES, solo que sean números válidos
  age: stringToNumber.refine(val => val > 0, 'La edad debe ser mayor que 0'),
  weight: stringToNumber.refine(val => val > 0, 'El peso debe ser mayor que 0'),
  height: stringToNumber.refine(val => val > 0, 'La altura debe ser mayor que 0'),
  
  // ✅ Ginecología básica - SIN RESTRICCIONES, permitir cualquier ciclo
  cycleLength: stringToNumber.refine(val => val > 0, 'La duración del ciclo debe ser mayor que 0'),
  infertilityDuration: stringToNumber.refine(val => val >= 0, 'La duración debe ser 0 o mayor'),
  hasPcos: z.boolean(),
  endometriosisStage: z.preprocess(stringToInteger, z.number().min(0).max(4)),
  myomaType: z.nativeEnum(MyomaType),
  adenomyosisType: z.nativeEnum(AdenomyosisType),
  polypType: z.nativeEnum(PolypType),
  hsgResult: z.nativeEnum(HsgResult),
  hasPelvicSurgery: z.boolean(),
  numberOfPelvicSurgeries: z.preprocess(stringToInteger, z.number().min(0).max(10)),
  hasOtb: z.boolean(),
  otbMethod: z.nativeEnum(OtbMethod),
  hasOtherInfertilityFactors: z.boolean(),
  desireForMultiplePregnancies: z.boolean(),
  
  // ✅ Laboratorio básico - SIN RESTRICCIONES, permitir cualquier valor
  tpoAbPositive: z.boolean(),
  insulinValue: stringToNumber.refine(val => val >= 0, 'La insulina debe ser 0 o mayor'),
  glucoseValue: stringToNumber.refine(val => val >= 0, 'La glucosa debe ser 0 o mayor'),
  semenVolume: optionalStringToNumber,
  
  // 🆕 Laboratorio avanzado - SIN RESTRICCIONES, permitir cualquier valor
  amhValue: optionalStringToNumber,
  tshValue: optionalStringToNumber,
  prolactinValue: optionalStringToNumber,
  
  // 🆕 Factor masculino completo - SIN RESTRICCIONES, permitir cualquier valor
  spermConcentration: optionalStringToNumber,
  spermProgressiveMotility: optionalStringToNumber,
  spermNormalMorphology: optionalStringToNumber,
  
  // 🆕 Ginecología avanzada
  cycleRegularity: z.enum(['regular', 'irregular']).optional(),
});

export type FormData = z.infer<typeof formSchema>;
