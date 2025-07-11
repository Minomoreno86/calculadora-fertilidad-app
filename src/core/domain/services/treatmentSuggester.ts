import { EvaluationState, TreatmentSuggestion, OtbMethod } from '../models';

function getMedicalOptimizationSuggestions(factors: Factors): TreatmentSuggestion[] {
  const suggestions: TreatmentSuggestion[] = [];
  if (factors.tsh < 1.0) {
    suggestions.push({
      category: 'Optimización Médica',
      title: 'Optimizar Función Tiroidea',
      details: 'Se recomienda ajustar el nivel de TSH por debajo de 2.5 µIU/mL antes de cualquier tratamiento.',
      source: 'Guía ASRM',
    });
  }
  if (factors.prolactin < 1.0) {
    suggestions.push({
      category: 'Optimización Médica',
      title: 'Corregir Hiperprolactinemia',
      details: 'Normalizar los niveles de prolactina con tratamiento médico es un paso previo fundamental.',
      source: 'Guía ASRM',
    });
  }
  if (factors.homa < 1.0) {
    suggestions.push({
      category: 'Optimización Médica',
      title: 'Manejar Resistencia a la Insulina',
      details: 'Mejorar la sensibilidad a la insulina con dieta, ejercicio y/o metformina puede aumentar el éxito.',
      source: 'Guía ASRM',
    });
  }
  return suggestions;
}

function getOtbRecanalizationSuggestions(input: UserInput, factors: Factors, diagnostics: Diagnostics): TreatmentSuggestion[] {
  const suggestions: TreatmentSuggestion[] = [];

  if (input.hasOtb) {
    console.log('OTB Input:', input);
    // Criterios de éxito para recanalización
    const isGoodCandidate = (
      input.age < 37 &&
      (input.otbMethod === OtbMethod.Clips || input.otbMethod === OtbMethod.Rings || input.otbMethod === OtbMethod.Ligation) &&
      (input.remainingTubalLength === undefined || input.remainingTubalLength > 4) &&
      !input.hasOtherInfertilityFactors
    );
    console.log('isGoodCandidate:', isGoodCandidate);

    // Criterios de baja probabilidad de éxito/contraindicación
    const isPoorCandidate = (
      input.age >= 40 ||
      input.otbMethod === OtbMethod.ExtensiveCauterization ||
      input.otbMethod === OtbMethod.PartialSalpingectomy ||
      (input.remainingTubalLength !== undefined && input.remainingTubalLength < 3) ||
      (input.endometriosisGrade && input.endometriosisGrade >= 2) || // Moderate to severe endometriosis
      (factors.male < 1.0) // Significant male factor
    );
    console.log('isPoorCandidate:', isPoorCandidate);

    if (isGoodCandidate) {
      suggestions.push({
        category: 'Baja Complejidad',
        title: 'Considerar Recanalización Tubárica',
        details: 'Eres una candidata ideal para la recanalización tubárica si cumples con: edad < 37 años, método de OTB (clips, anillos, ligaduras), longitud tubárica remanente > 4 cm (si aplica), y ausencia de otros factores de infertilidad. Discute esta opción con tu especialista.',
        source: 'ASRM Practice Committee',
      });
    } else if (isPoorCandidate) {
      suggestions.push({
        category: 'Alta Complejidad',
        title: 'Fecundación In Vitro (FIV)',
        details: 'Debido a factores desfavorables para la recanalización tubárica, la FIV es el tratamiento más adecuado.',
        source: 'ASRM Practice Committee',
      });
    } else if (input.hasOtb) {
      // If OTB is present but not clearly good or poor candidate, suggest further study
      suggestions.push({
        category: 'Estudio Adicional',
        title: 'Evaluación Detallada para Recanalización Tubárica',
        details: 'Se requiere una evaluación más profunda (HSG, historia quirúrgica) para determinar la viabilidad de la recanalización tubárica.',
        source: 'Recomendación General',
      });
    }
  }
  return suggestions;
}

function getHighComplexitySuggestions(input: UserInput, factors: Factors, diagnostics: Diagnostics): TreatmentSuggestion[] {
  const suggestions: TreatmentSuggestion[] = [];
  if (diagnostics.hsgComment.includes('bilateral')) {
    suggestions.push({
      category: 'Alta Complejidad',
      title: 'Fecundación In Vitro (FIV)',
      details: 'Debido a la obstrucción tubárica bilateral, la FIV es el tratamiento indicado para lograr el embarazo.',
      source: 'Guía ASRM',
    });
  }
  if (input.age >= 38 || factors.amh < 0.8) {
    suggestions.push({
      category: 'Alta Complejidad',
      title: 'Considerar Fecundación In Vitro (FIV)',
      details: 'Por la edad o la reserva ovárica, la FIV puede ofrecer las mejores probabilidades por intento.',
      source: 'Guía ASRM/ESHRE',
    });
  }
  const { semenVolume, spermConcentration, spermProgressiveMotility } = input;
  if (semenVolume && spermConcentration && spermProgressiveMotility) {
    const tmsc = semenVolume * spermConcentration * (spermProgressiveMotility / 100);
    if (tmsc < 5) {
      suggestions.push({
        category: 'Alta Complejidad',
        title: 'FIV con ICSI',
        details: `El recuento de espermatozoides móviles (~${tmsc.toFixed(1)}M) es bajo, indicando que la ICSI es la técnica más efectiva.`,
        source: 'Guía ASRM 2024',
      });
    }
  }
  return suggestions;
}

function getLowComplexitySuggestions(input: UserInput, factors: Factors, diagnostics: Diagnostics): TreatmentSuggestion[] {
  const suggestions: TreatmentSuggestion[] = [];
  if (input.age < 38 && diagnostics.hsgComment.includes('unilateral')) {
    suggestions.push({
      category: 'Baja Complejidad',
      title: 'Inseminación Intrauterina (IIU)',
      details:
        'Con una trompa permeable y edad favorable, la IIU con estimulación ovárica es una buena primera opción.',
      source: 'Guía ESHRE',
    });
  } else if (input.age < 35 && (input.infertilityDuration ?? 0) < 2 && factors.cycle > 0.9 && factors.male > 0.9) {
    suggestions.push({
      category: 'Baja Complejidad',
      title: 'Coito Programado',
      details: 'Dado el buen pronóstico general, se puede iniciar con coito programado y monitoreo ovulatorio.',
      source: 'Guía ASRM',
    });
  }
  return suggestions;
}

export function suggestTreatments(evaluation: EvaluationState): TreatmentSuggestion[] {
  const { input, factors, diagnostics } = evaluation;
  let suggestions: TreatmentSuggestion[] = [];

  // Evaluar sugerencias de recanalización tubárica primero
  const otbSuggestions = getOtbRecanalizationSuggestions(input, factors, diagnostics);
  suggestions = suggestions.concat(otbSuggestions);

  // Si se sugiere recanalización, no sugerir FIV por obstrucción tubárica bilateral
  const isOtbRecanalizationSuggested = otbSuggestions.some(s => s.title === 'Considerar Recanalización Tubárica');

  const highComplexity = getHighComplexitySuggestions(input, factors, diagnostics);
  // Filtrar FIV por obstrucción tubárica bilateral si se sugiere recanalización
  const filteredHighComplexity = isOtbRecanalizationSuggested
    ? highComplexity.filter(s => !(s.title === 'Fecundación In Vitro (FIV)' && s.details.includes('obstrucción tubárica bilateral')))
    : highComplexity;
  suggestions = suggestions.concat(filteredHighComplexity);

  // --- REGLAS DE BAJA COMPLEJIDAD (se añaden si no hay indicación clara de FIV o recanalización) ---
  if (filteredHighComplexity.length === 0 && !isOtbRecanalizationSuggested) {
    suggestions = suggestions.concat(getLowComplexitySuggestions(input, factors, diagnostics));
  }

  // --- REGLA POR DEFECTO ---
  if (suggestions.length === 0) {
    suggestions.push({
      category: 'Estudio Adicional',
      title: 'Consulta con Especialista',
      details:
        'Tu caso tiene múltiples factores o no presenta una causa clara. Se recomienda una consulta especializada para definir el mejor plan.',
      source: 'Recomendación General',
    });
  }

  return suggestions;
}
