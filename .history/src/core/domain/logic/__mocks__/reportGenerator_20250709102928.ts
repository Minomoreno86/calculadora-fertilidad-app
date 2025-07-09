// Mock del generador de reportes.
// jest is available globally in Jest test environments; no import needed.

// @ts-ignore
export const generateFinalReport = jest.fn(() => ({
  numericPrognosis: 0,
  category: 'BUENO',
  emoji: '🧪',
  prognosisPhrase: 'Frase de prueba',
  benchmarkPhrase: 'Frase benchmark de prueba',
  recommendations: ['Recomendación de prueba'],
  clinicalInsights: [],
}));