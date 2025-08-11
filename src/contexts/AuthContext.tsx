/**
 * 🔐 CONTEXTO DE AUTENTICACIÓN CON SUPABASE
 * Sistema completo y seguro para App Store
 * Características: JWT, Rate Limiting, Almacenamiento Seguro, Auto-refresh
 */

import React from 'react';
import { Session } from '@supabase/supabase-js';
import { AuthService } from '@/services/authService';
import { supabase } from '@/config/supabase';
import { UserMigrationService } from '@/utils/userMigration';

// 🔐 Tipos de autenticación actualizados para Supabase
interface AuthUser {
  id: string;
  email: string;
  name: string;
  phone?: string;
  emailConfirmed: boolean;
  createdAt: string;
  lastSignIn?: string;
}

interface AuthContextType {
  // Estados
  isAuthenticated: boolean;
  user: AuthUser | null;
  session: Session | null;
  isLoading: boolean;
  
  // Métodos de autenticación
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, fullName?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  loginWithApple: () => Promise<{ success: boolean; error?: string }>; // añadido
  
  // Métodos de utilidad
  refreshSession: () => Promise<void>;
  isSessionValid: () => boolean;
}

// 🎯 Contexto de autenticación
const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

// 🔑 Proveedor de autenticación con Supabase
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [user, setUser] = React.useState<AuthUser | null>(null);
  const [session, setSession] = React.useState<Session | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  // 📱 Inicializar y escuchar cambios de autenticación
  React.useEffect(() => {
    initializeAuth();
    
    // Escuchar cambios de autenticación de Supabase
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state changed:', event);
        
        if (event === 'SIGNED_IN' && session) {
          await handleAuthSuccess(session);
        } else if (event === 'SIGNED_OUT') {
          await handleAuthSignOut();
        } else if (event === 'TOKEN_REFRESHED' && session) {
          await handleAuthSuccess(session);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * 🚀 Inicializar autenticación
   */
  const initializeAuth = async () => {
    try {
      console.log('🔄 Inicializando autenticación...');
      
      // 1. Verificar si necesita migración
      const migrationStatus = await UserMigrationService.checkMigrationStatus();
      
      if (migrationStatus.needsMigration) {
        console.log('🔄 Migración de usuarios necesaria...');
        await UserMigrationService.autoMigrate();
      }
      
      // 2. Intentar restaurar sesión desde Supabase
      const result = await AuthService.restoreSession();
      
      if (result.success && result.user && result.session) {
        await handleAuthSuccess(result.session);
      } else {
        await handleAuthSignOut();
      }
    } catch (error) {
      console.error('❌ Error inicializando auth:', error);
      await handleAuthSignOut();
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * ✅ Manejar autenticación exitosa
   */
  const handleAuthSuccess = async (session: Session) => {
    try {
      const authUser: AuthUser = {
        id: session.user.id,
        email: session.user.email || '',
        name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Usuario',
        phone: session.user.phone,
        emailConfirmed: session.user.email_confirmed_at !== null,
        createdAt: session.user.created_at,
        lastSignIn: session.user.last_sign_in_at || undefined,
      };

      setSession(session);
      setUser(authUser);
      setIsAuthenticated(true);
      
      console.log('✅ Usuario autenticado:', authUser.email);
    } catch (error) {
      console.error('❌ Error manejando auth success:', error);
    }
  };

  /**
   * 🚪 Manejar cierre de sesión
   */
  const handleAuthSignOut = async () => {
    setSession(null);
    setUser(null);
    setIsAuthenticated(false);
    console.log('🔐 Sesión cerrada');
  };

  /**
   * 🔑 Login con validación
   */
  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log('🔄 Iniciando login...');
      const result = await AuthService.login(email, password);
      
      if (result.success && result.session) {
        // handleAuthSuccess se llamará automáticamente por el listener
        return { success: true };
      }
      
      return { success: false, error: result.error };
    } catch (error) {
      console.error('❌ Error en login:', error);
      return { success: false, error: 'Error de conexión' };
    }
  };

  /**
   * 📝 Registro con validación
   */
  const register = async (email: string, password: string, fullName?: string): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log('🔄 Iniciando registro...');
      const result = await AuthService.register(email, password, fullName);
      
      if (result.success) {
        return { 
          success: true, 
          error: result.user?.email_confirmed_at ? undefined : 'Revisa tu email para confirmar tu cuenta'
        };
      }
      
      return { success: false, error: result.error };
    } catch (error) {
      console.error('❌ Error en registro:', error);
      return { success: false, error: 'Error de conexión' };
    }
  };

  /**
   * 🚪 Logout seguro
   */
  const logout = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log('🔄 Cerrando sesión...');
      const result = await AuthService.logout();
      
      // handleAuthSignOut se llamará automáticamente por el listener
      return result;
    } catch (error) {
      console.error('❌ Error en logout:', error);
      return { success: false, error: 'Error cerrando sesión' };
    }
  };

  /**
   * 🔄 Reset de contraseña
   */
  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log('🔄 Enviando reset de contraseña...');
      return await AuthService.resetPassword(email);
    } catch (error) {
      console.error('❌ Error en reset:', error);
      return { success: false, error: 'Error enviando email de reset' };
    }
  };

  /**
   *  Login con Apple
   */
  const loginWithApple = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      const result = await AuthService.loginWithApple();
      if (result.success) return { success: true };
      return { success: false, error: result.error };
    } catch (e) {
      console.error('❌ Error login Apple en contexto:', e);
      return { success: false, error: 'Error con Apple Sign In' };
    }
  };

  /**
   * 🔄 Refrescar sesión
   */
  const refreshSession = async (): Promise<void> => {
    try {
      const { data: { session }, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error('❌ Error refrescando sesión:', error);
        await handleAuthSignOut();
        return;
      }

      if (session) {
        await handleAuthSuccess(session);
      }
    } catch (error) {
      console.error('❌ Error inesperado refrescando sesión:', error);
    }
  };

  /**
   * ✅ Verificar si la sesión es válida
   */
  const isSessionValid = (): boolean => {
    if (!session) return false;
    
    const now = new Date().getTime();
    const expiresAt = session.expires_at ? session.expires_at * 1000 : 0;
    
    return now < expiresAt;
  };

  return (
    <AuthContext.Provider value={{
      // Estados
      isAuthenticated,
      user,
      session,
      isLoading,
      
      // Métodos de autenticación
      login,
      register,
      logout,
      resetPassword,
      loginWithApple,
      
      // Métodos de utilidad
      refreshSession,
      isSessionValid,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// 🎯 Hook para usar el contexto de autenticación
export function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
}

console.log('✅ AuthContext con Supabase inicializado');