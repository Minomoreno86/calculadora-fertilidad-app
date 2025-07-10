import { EvaluationState, TreatmentSuggestion } from '../models';

function getMedicalOptimizationSuggestions(factors: any): TreatmentSuggestion[] {
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

function getHighComplexitySuggestions(input: any, factors: any, diagnostics: any): TreatmentSuggestion[] {
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

function getLowComplexitySuggestions(input: any, factors: any, diagnostics: any): TreatmentSuggestion[] {
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

  suggestions = suggestions.concat(getMedicalOptimizationSuggestions(factors));
  const highComplexity = getHighComplexitySuggestions(input, factors, diagnostics);
  suggestions = suggestions.concat(highComplexity);

  // --- REGLAS DE BAJA COMPLEJIDAD (se añaden si no hay indicación clara de FIV) ---
  if (highComplexity.length === 0) {
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
