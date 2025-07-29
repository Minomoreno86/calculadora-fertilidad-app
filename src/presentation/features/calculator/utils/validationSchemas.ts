import { z } from 'zod';
import { MyomaType, AdenomyosisType, PolypType, HsgResult, OtbMethod } from '@/core/domain/models';

// Helper para validar string que representa número
const stringNumber = z.string().refine((val) => {
  const num = parseFloat(val);
  return !isNaN(num) && num > 0;
}, 'Debe ser un número válido mayor que 0');

// Helper para string que representa número no negativo
const stringNumberNonNegative = z.string().refine((val) => {
  const num = parseFloat(val);
  return !isNaN(num) && num >= 0;
}, 'Debe ser un número válido mayor o igual a 0');

// Helper para campos enteros
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

// Helper para campos opcionales string
const optionalStringNumber = z.string().optional();

export const formSchema = z.object({
  // ✅ Demografia básica - STRINGS validados como números
  age: stringNumber,
  weight: stringNumber,
  height: stringNumber,
  
  // ✅ Ginecología básica - STRINGS validados como números
  cycleLength: stringNumber,
  infertilityDuration: stringNumberNonNegative,
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
  
  // ✅ Laboratorio básico - STRINGS validados como números
  tpoAbPositive: z.boolean(),
  insulinValue: stringNumberNonNegative,
  glucoseValue: stringNumberNonNegative,
  semenVolume: optionalStringNumber,
  
  // 🆕 Laboratorio avanzado - STRINGS opcionales
  amhValue: optionalStringNumber,
  tshValue: optionalStringNumber,
  prolactinValue: optionalStringNumber,
  
  // 🆕 Factor masculino completo - STRINGS opcionales
  spermConcentration: optionalStringNumber,
  spermProgressiveMotility: optionalStringNumber,
  spermNormalMorphology: optionalStringNumber,
  
  // 🆕 Ginecología avanzada
});

export type FormData = z.infer<typeof formSchema>;
