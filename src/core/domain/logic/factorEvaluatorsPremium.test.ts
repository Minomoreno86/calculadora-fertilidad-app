// src/core/domain/logic/factorEvaluatorsPremium.test.ts (ejemplo)
import { evaluateAgePremium, evaluateBmiPremium } from './factorEvaluatorsPremium';
import { MyomaType } from '../models'; // Necesitarás importar todos los enums relevantes para tus tests

describe('factorEvaluatorsPremium', () => {
  // Test para evaluateAgePremium
  test('evaluateAgePremium debería asignar el factor correcto para 32 años', () => {
    const result = evaluateAgePremium(32);
    expect(result.factors?.baseAgeProbability).toBe(17.5); // Probabilidad base para 30-34
    expect(result.diagnostics?.agePotential).toBe('Buena fertilidad');
  });

  test('evaluateAgePremium debería asignar el factor correcto para 41 años', () => {
    const result = evaluateAgePremium(41);
    expect(result.factors?.baseAgeProbability).toBe(3.5); // Muy alto riesgo para 41-42
    expect(result.diagnostics?.agePotential).toBe('Baja probabilidad de embarazo');
  });

  // Test para evaluateBmiPremium
  test('evaluateBmiPremium debería asignar el factor 1.0 para IMC normal', () => {
    const result = evaluateBmiPremium(22);
    expect(result.factors?.bmi).toBe(1.0);
    expect(result.diagnostics?.bmiComment).toBe('Peso normal');
  });

  test('evaluateBmiPremium debería asignar el factor 0.4 para Obesidad Clase III', () => {
    const result = evaluateBmiPremium(42);
    expect(result.factors?.bmi).toBe(0.4);
    expect(result.diagnostics?.bmiComment).toBe('Obesidad Clase III');
  });

  // ... (Repite para cada función de evaluación con diferentes escenarios)
});