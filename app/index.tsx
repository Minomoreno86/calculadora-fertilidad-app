/**
 * 🏠 REDIRECT TO WELCOME SCREEN - FLUJO PROFESIONAL COMPLETO
 */

import { useEffect } from 'react';
import { router } from 'expo-router';

export default function RootIndex() {
  useEffect(() => {
    // Redirigir automáticamente a welcome para el flujo completo
    router.replace('/(app)/welcome');
  }, []);

  return null; // El contenido real está en el flujo de navegación
}