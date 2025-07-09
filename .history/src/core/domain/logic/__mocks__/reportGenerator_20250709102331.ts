// Mock del generador de reportes.
import { jest } from '@jest/globals';

export const generateFinalReport = jest.fn(() => ({
  numericPrognosis: 0,
  category: 'BUENO',
  emoji: '🧪',
  prognosisPhrase: 'Frase de prueba',
  benchmarkPhrase: 'Frase benchmark de prueba',
  recommendations: ['Recomendación de prueba'],
  clinicalInsights: [],
}));