// Mock de los evaluadores. Devolvemos valores neutros por defecto.
/* eslint-disable @typescript-eslint/no-var-requires */
// @ts-ignore
declare const jest: any;

export const evaluateAgeBaseline = jest.fn(() => ({ factors: { baseAgeProbability: 20.0 }, diagnostics: { agePotential: 'Test Age' } }));
export const evaluateImc = jest.fn(() => ({ factors: { bmi: 1.0 }, diagnostics: { bmiComment: 'Test BMI' } }));
// ...puedes añadir mocks para las otras funciones si una prueba específica lo necesita.
// Por ahora, Jest creará mocks automáticos vacíos para el resto.