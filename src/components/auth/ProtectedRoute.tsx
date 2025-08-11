/**
 * 🛡️ COMPONENTE DE PROTECCIÓN DE RUTAS
 * Middleware para proteger rutas que requieren autenticación
 */

import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useDynamicTheme } from '@/hooks/useDynamicTheme';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
  showLoadingScreen?: boolean;
}

/**
 * 🛡️ Componente de Protección de Rutas
 * 
 * @param children - Componentes hijos a renderizar si está autenticado
 * @param requireAuth - Si requiere autenticación (default: true)
 * @param redirectTo - Ruta a la que redirigir si no está autenticado
 * @param showLoadingScreen - Mostrar pantalla de carga personalizada
 */
export default function ProtectedRoute({ 
  children, 
  requireAuth = true,
  redirectTo = '/(app)/login',
  showLoadingScreen = true 
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user, isSessionValid } = useAuth();
  const theme = useDynamicTheme();

  useEffect(() => {
    // Si no se requiere autenticación, permitir acceso
    if (!requireAuth) return;

    // Si está cargando, esperar
    if (isLoading) return;

    // Si no está autenticado, redirigir
    if (!isAuthenticated) {
      console.log('🛡️ Ruta protegida: Usuario no autenticado, redirigiendo...');
      router.replace(redirectTo);
      return;
    }

    // Verificar si la sesión es válida
    if (!isSessionValid()) {
      console.log('🛡️ Ruta protegida: Sesión expirada, redirigiendo...');
      router.replace(redirectTo);
      return;
    }

    console.log('✅ Ruta protegida: Acceso autorizado para', user?.email);
  }, [isAuthenticated, isLoading, requireAuth, redirectTo, user, isSessionValid]);

  // Si no se requiere autenticación, renderizar directamente
  if (!requireAuth) {
    return <>{children}</>;
  }

  // Si está cargando, mostrar pantalla de carga
  if (isLoading) {
    if (!showLoadingScreen) {
      return <ActivityIndicator size="large" color={theme.colors.primary} />;
    }

    return (
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.secondary]}
        style={styles.loadingContainer}
      >
        <View style={styles.loadingContent}>
          <Ionicons 
            name="shield-checkmark" 
            size={60} 
            color="white" 
            style={styles.loadingIcon}
          />
          <Text style={styles.loadingTitle}>🔐 Verificando Acceso</Text>
          <Text style={styles.loadingSubtitle}>
            Validando tu sesión segura...
          </Text>
          <ActivityIndicator 
            size="large" 
            color="white" 
            style={styles.loadingSpinner}
          />
        </View>
      </LinearGradient>
    );
  }

  // Si no está autenticado o la sesión no es válida, no renderizar nada
  // (la redirección se maneja en useEffect)
  if (!isAuthenticated || !isSessionValid()) {
    return null;
  }

  // Si está autenticado y la sesión es válida, renderizar los hijos
  return <>{children}</>;
}

/**
 * 🛡️ Hook para verificar autenticación en componentes
 */
export function useRequireAuth() {
  const { isAuthenticated, isLoading, user } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      console.log('🛡️ Hook requireAuth: Redirigiendo a login');
      router.replace('/(app)/login');
    }
  }, [isAuthenticated, isLoading]);

  return {
    isAuthenticated,
    isLoading,
    user,
    isReady: !isLoading && isAuthenticated,
  };
}

/**
 * 🔓 Componente para rutas que requieren estar NO autenticado
 * (como login, registro)
 */
export function GuestOnlyRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      console.log('🔓 Ruta de invitado: Usuario autenticado, redirigiendo a calculadora');
      router.replace('/(app)/calculator');
    }
  }, [isAuthenticated, isLoading]);

  // Si está cargando, mostrar spinner simple
  if (isLoading) {
    return (
      <View style={styles.simpleLoadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  // Si está autenticado, no renderizar (se redirige)
  if (isAuthenticated) {
    return null;
  }

  // Si no está autenticado, renderizar los hijos
  return <>{children}</>;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    alignItems: 'center',
    padding: 40,
  },
  loadingIcon: {
    marginBottom: 20,
  },
  loadingTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    textAlign: 'center',
  },
  loadingSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 30,
  },
  loadingSpinner: {
    marginTop: 10,
  },
  simpleLoadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
});