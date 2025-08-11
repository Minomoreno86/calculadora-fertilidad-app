/**
 * 🛡️ GUARDIA DE AUTENTICACIÓN
 * Componente que maneja la protección de rutas automáticamente
 */

import React from 'react';
import { useSegments, useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute, { GuestOnlyRoute } from './ProtectedRoute';

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * 🛡️ Guardia de Autenticación
 * Decide automáticamente qué tipo de protección aplicar según la ruta
 */
export default function AuthGuard({ children }: AuthGuardProps) {
  const segments = useSegments();
  const { isAuthenticated, isLoading } = useAuth();

  // Rutas que requieren estar NO autenticado (solo para invitados)
  const guestOnlyRoutes = [
    'login',
    'welcome'
  ];

  // Rutas que requieren autenticación
  const protectedRoutes = [
    'calculator',
    'results',
    'config' // Configuración requiere login para guardar preferencias
  ];

  // Rutas públicas (accesibles sin autenticación)
  const publicRoutes = [
    'privacy-policy',
    'terms-of-service',
    'medical-disclaimer',
    'copyright',
    'bibliography',
    'age-rating',
    'customer-support',
    'social-networks'
  ];

  // Obtener la ruta actual
  const currentRoute = segments[segments.length - 1] || 'index';

  // Determinar el tipo de protección necesaria
  const getRouteProtection = () => {
    // Si es una ruta solo para invitados
    if (guestOnlyRoutes.includes(currentRoute)) {
      return 'guest-only';
    }

    // Si es una ruta protegida
    if (protectedRoutes.includes(currentRoute)) {
      return 'protected';
    }

    // Si es una ruta pública
    if (publicRoutes.includes(currentRoute)) {
      return 'public';
    }

    // Por defecto, las rutas desconocidas son públicas
    return 'public';
  };

  const protection = getRouteProtection();

  // Log para debugging
  console.log(`🛡️ AuthGuard: Ruta "${currentRoute}" -> Protección "${protection}"`);

  // Aplicar la protección correspondiente
  switch (protection) {
    case 'guest-only':
      return <GuestOnlyRoute>{children}</GuestOnlyRoute>;
    
    case 'protected':
      return <ProtectedRoute>{children}</ProtectedRoute>;
    
    case 'public':
    default:
      return <>{children}</>;
  }
}

/**
 * 🔍 Hook para obtener información de la ruta actual
 */
export function useRouteInfo() {
  const segments = useSegments();
  const { isAuthenticated, isLoading } = useAuth();
  
  const currentRoute = segments[segments.length - 1] || 'index';
  
  return {
    currentRoute,
    segments,
    isAuthenticated,
    isLoading,
    isProtectedRoute: ['calculator', 'results', 'config'].includes(currentRoute),
    isGuestOnlyRoute: ['login', 'welcome'].includes(currentRoute),
    isPublicRoute: [
      'privacy-policy',
      'terms-of-service', 
      'medical-disclaimer',
      'copyright',
      'bibliography',
      'age-rating',
      'customer-support',
      'social-networks'
    ].includes(currentRoute),
  };
}