import { z } from 'zod';
import { MyomaType, AdenomyosisType, PolypType, HsgResult, OtbMethod } from '@/core/domain/models';

const preprocessNumberInput = (value: unknown): number | undefined => {
  if (typeof value === 'string') {
    const sanitized = value.replace(',', '.');
    const num = parseFloat(sanitized);
    return isNaN(num) ? undefined : num;
  }
  if (typeof value === 'number') {
    return value;
  }
  return undefined;
};

export const premiumFormSchema = z.object({
  age: z.coerce.number().min(1, 'La edad es obligatoria'),
  weight: z.preprocess(preprocessNumberInput, z.coerce.number().min(1, 'El peso es obligatorio')),
  height: z.preprocess(preprocessNumberInput, z.coerce.number().min(1, 'La altura es obligatoria')),
  cycleDuration: z.preprocess(preprocessNumberInput, z.coerce.number().optional()),
  infertilityDuration: z.preprocess(preprocessNumberInput, z.coerce.number().optional()),
  hasPcos: z.boolean(),
  endometriosisGrade: z.coerce.number(),
  myomaType: z.nativeEnum(MyomaType),
  adenomyosisType: z.nativeEnum(AdenomyosisType),
  polypType: z.nativeEnum(PolypType),
  hsgResult: z.nativeEnum(HsgResult),
  hasPelvicSurgery: z.boolean(),
  numberOfPelvicSurgeries: z.preprocess(preprocessNumberInput, z.coerce.number().optional()),
  hasOtb: z.boolean(),
  otbMethod: z.nativeEnum(OtbMethod).optional(),
  remainingTubalLength: z.preprocess(preprocessNumberInput, z.coerce.number().optional()),
  hasOtherInfertilityFactors: z.boolean().optional(),
  desireForMultiplePregnancies: z.boolean().optional(),
  amh: z.preprocess(preprocessNumberInput, z.coerce.number().optional()),
  tsh: z.preprocess(preprocessNumberInput, z.coerce.number().optional()),
  prolactin: z.preprocess(preprocessNumberInput, z.coerce.number().optional()),
  tpoAbPositive: z.boolean(),
  insulin: z.preprocess(preprocessNumberInput, z.coerce.number().optional()),
  glucose: z.preprocess(preprocessNumberInput, z.coerce.number().optional()),
  spermConcentration: z.preprocess(preprocessNumberInput, z.coerce.number().optional()),
  spermProgressiveMotility: z.preprocess(preprocessNumberInput, z.coerce.number().optional()),
  spermNormalMorphology: z.preprocess(preprocessNumberInput, z.coerce.number().optional()),
  semenVolume: z.preprocess(preprocessNumberInput, z.coerce.number().optional()),
});
