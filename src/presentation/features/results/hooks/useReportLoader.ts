// src/presentation/features/results/hooks/useReportLoader.ts
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EvaluationState } from '@/core/domain/models'; // Importa EvaluationState desde tus modelos

/**
 * Hook personalizado para cargar un informe de evaluación desde AsyncStorage.
 * @param reportKey La clave bajo la cual el informe está almacenado en AsyncStorage.
 * @returns Un objeto con el estado de la evaluación, el estado de carga y un posible error.
 */
export const useReportLoader = (reportKey?: string | string[]): {
  evaluation: EvaluationState | null;
  loading: boolean;
  error: string | null;
  isPremiumReport: boolean;
} => {
  const [evaluation, setEvaluation] = useState<EvaluationState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    const fetchReport = async () => {
      if (!reportKey) {
        setLoading(false);
        setError('No se proporcionó la clave del informe.');
        setIsPremium(false);
        console.warn('useReportLoader: No reportKey found.');
        return;
      }

      // Determinar la clave a usar (si es array, tomar la primera)
      const key = Array.isArray(reportKey) ? reportKey[0] : reportKey;
      const premium = key.startsWith('premium_report_');
      setIsPremium(premium);

      try {
        setLoading(true);
        setError(null); // Limpiar errores previos

        const storedReport = await AsyncStorage.getItem(key);
        if (storedReport) {
          setEvaluation(JSON.parse(storedReport));
        } else {
          setError('No se encontró el informe para la clave proporcionada.');
          console.warn('useReportLoader: No report found for key:', key);
        }
      } catch (e: unknown) {
        console.error('useReportLoader: Error fetching or parsing evaluation report:', e);
        const errorMessage =
          e instanceof Error && typeof e.message === 'string'
            ? e.message
            : 'Error desconocido.';
        setError('Ocurrió un error al cargar el informe: ' + errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [reportKey]); // El efecto se vuelve a ejecutar si la clave del informe cambia

  return { evaluation, loading, error, isPremiumReport: isPremium };
};