/**
 * 🔐 SERVICIO DE AUTENTICACIÓN SUPABASE
 * Sistema completo y seguro para App Store
 * Incluye: Login, Registro, Reset, Rate Limiting, Validaciones
 */

import { supabase, AUTH_CONFIG } from '@/config/supabase';
import { SecureStorageService } from './secureStorage';
import { HybridStorageService } from './hybridStorage';
import { AuthError, User, Session } from '@supabase/supabase-js';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as ExpoCrypto from 'expo-crypto';

// Rate limiting local (previene spam)
interface RateLimitData {
  attempts: number;
  lastAttempt: number;
  blockedUntil?: number;
}

/**
 * 🔒 Servicio de Autenticación Completo
 */
export class AuthService {
  private static rateLimitData: Map<string, RateLimitData> = new Map();

  /**
   * 🚀 REGISTRO DE USUARIO
   */
  static async register(email: string, password: string, fullName?: string): Promise<{
    success: boolean;
    user?: User;
    error?: string;
  }> {
    try {
      console.log('🔄 Iniciando registro de usuario:', email);

      // Validar email
      if (!this.isValidEmail(email)) {
        return { success: false, error: 'Email inválido' };
      }

      // Validar contraseña
      const passwordValidation = this.validatePassword(password);
      if (!passwordValidation.isValid) {
        return { success: false, error: passwordValidation.error };
      }

      // Verificar rate limiting
      if (this.isRateLimited(email)) {
        return { success: false, error: 'Demasiados intentos. Intenta más tarde.' };
      }

      // Registrar en Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName || email.split('@')[0],
            app_version: '1.0.0',
            platform: 'mobile',
          }
        }
      });

      if (error) {
        console.error('❌ Error en registro:', error);
        this.recordFailedAttempt(email);
        return { 
          success: false, 
          error: this.getHumanReadableError(error) 
        };
      }

      if (data.user) {
        console.log('✅ Usuario registrado exitosamente');
        
        // Limpiar rate limiting en éxito
        this.clearRateLimit(email);
        
        // Guardar sesión si está confirmada
        if (data.session) {
          await this.saveSession(data.session);
        }

        return { 
          success: true, 
          user: data.user 
        };
      }

      return { success: false, error: 'Error desconocido en registro' };

    } catch (error) {
      console.error('❌ Error inesperado en registro:', error);
      return { 
        success: false, 
        error: 'Error de conexión. Verifica tu internet.' 
      };
    }
  }

  /**
   * 🔑 LOGIN DE USUARIO
   */
  static async login(email: string, password: string): Promise<{
    success: boolean;
    user?: User;
    session?: Session;
    error?: string;
  }> {
    try {
      console.log('🔄 Iniciando login:', email);

      // Validar email
      if (!this.isValidEmail(email)) {
        return { success: false, error: 'Email inválido' };
      }

      // Verificar rate limiting
      if (this.isRateLimited(email)) {
        return { success: false, error: 'Demasiados intentos. Intenta más tarde.' };
      }

      // Login en Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('❌ Error en login:', error);
        this.recordFailedAttempt(email);
        return { 
          success: false, 
          error: this.getHumanReadableError(error) 
        };
      }

      if (data.user && data.session) {
        console.log('✅ Login exitoso');
        
        // Limpiar rate limiting en éxito
        this.clearRateLimit(email);
        
        // Guardar sesión de forma segura
        await this.saveSession(data.session);

        return { 
          success: true, 
          user: data.user,
          session: data.session 
        };
      }

      return { success: false, error: 'Credenciales inválidas' };

    } catch (error) {
      console.error('❌ Error inesperado en login:', error);
      return { 
        success: false, 
        error: 'Error de conexión. Verifica tu internet.' 
      };
    }
  }

  /**
   *  LOGIN CON APPLE ID
   */
  static async loginWithApple(): Promise<{
    success: boolean;
    user?: User;
    session?: Session;
    error?: string;
  }> {
    try {
      const available = await AppleAuthentication.isAvailableAsync();
      if (!available) {
        return { success: false, error: 'Apple Sign In no disponible en este dispositivo' };
      }

      // Nonce seguro (32 bytes -> hex corto)
      // Generar nonce aleatorio
      // 1. Generar nonce aleatorio
      const bytes = await ExpoCrypto.getRandomBytesAsync(32);
      const rawNonce = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
      
      // 2. Hash SHA256 del nonce para Apple
      const hashedNonce = await ExpoCrypto.digestStringAsync(
        ExpoCrypto.CryptoDigestAlgorithm.SHA256,
        rawNonce
      );

      console.log('🔑 Apple Sign In - Nonce Flow:', {
        rawNonce: rawNonce.substring(0, 10) + '...',
        hashedNonce: hashedNonce.substring(0, 10) + '...'
      });

      // 3. Obtener credencial de Apple usando el nonce hasheado
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL
        ],
        nonce: hashedNonce
      });

      if (!credential.identityToken) {
        return { success: false, error: 'No se recibió identity token de Apple' };
      }

      // 4. Sign in con Supabase usando el nonce original
      // 4. Sign in con Supabase usando el token y nonce original
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'apple',
        token: credential.identityToken,
        nonce: rawNonce // MUST be the original unhashed nonce
      });

      if (error) {
        console.error('❌ Error Apple SignIn Supabase:', error);
        console.log('🔍 Debug - Token:', credential.identityToken.substring(0, 50) + '...');
        console.log('🔍 Debug - Nonce Flow:', {
          rawNonce: rawNonce.substring(0, 10) + '...',
          hashedNonce: hashedNonce.substring(0, 10) + '...'
        });
        
        // Mensajes específicos
        if (/nonce/i.test(error.message)) {
          return { success: false, error: 'Nonce mismatch: revisa configuración y evita transformar el nonce' };
        }
        if (/audience|domain|email/i.test(error.message)) {
          console.error('🔍 Apple Sign In configuration error:', {
            error,
            expectedAudience: 'com.calculadorafertilidad.app',
            serviceId: 'YU8L44V647.com.calculadorafertilidad.app',
            details: error.message
          });
          return { 
            success: false, 
            error: 'Error de configuración de Apple Sign In. Por favor, verifica la configuración del dominio y Service ID.' 
          };
        }
        if (/issuer/i.test(error.message)) {
          return { success: false, error: 'Proveedor Apple no habilitado en Supabase' };
        }
        return { success: false, error: this.getHumanReadableError(error) };
      }

      if (data?.session && data.user) {
        await this.saveSession(data.session);
        return { success: true, user: data.user, session: data.session };
      }

      return { success: false, error: 'No se pudo completar login con Apple' };

    } catch (err) {
      const e = err as { code?: string; message?: string };
      if (e?.code === 'ERR_REQUEST_CANCELED') {
        return { success: false, error: 'Cancelado por el usuario' };
      }
      console.error('❌ Error inesperado Apple SignIn:', e);
      return { success: false, error: e?.message || 'Error iniciando sesión con Apple' };
    }
  }

  /**
   * 🔄 LOGOUT SEGURO
   */
  static async logout(): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('🔄 Cerrando sesión...');

      // Logout en Supabase
      const { error } = await supabase.auth.signOut();

      // Limpiar almacenamiento local siempre (incluso si hay error)
      await SecureStorageService.clearAuthData();

      if (error) {
        console.error('❌ Error en logout:', error);
        // Aún consideramos éxito si limpiamos local
        return { success: true };
      }

      console.log('✅ Logout exitoso');
      return { success: true };

    } catch (error) {
      console.error('❌ Error inesperado en logout:', error);
      // Limpiar local de todos modos
      await SecureStorageService.clearAuthData();
      return { success: true };
    }
  }

  /**
   * 🔄 RESET DE CONTRASEÑA
   */
  static async resetPassword(email: string): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      console.log('🔄 Enviando reset de contraseña:', email);

      // Validar email
      if (!this.isValidEmail(email)) {
        return { success: false, error: 'Email inválido' };
      }

      // Verificar rate limiting
      if (this.isRateLimited(email)) {
        return { success: false, error: 'Demasiados intentos. Intenta más tarde.' };
      }

      // Enviar reset en Supabase
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'https://tu-app.com/reset-password', // Cambiar por tu URL
      });

      if (error) {
        console.error('❌ Error en reset:', error);
        this.recordFailedAttempt(email);
        return { 
          success: false, 
          error: this.getHumanReadableError(error) 
        };
      }

      console.log('✅ Email de reset enviado');
      this.clearRateLimit(email);
      
      return { success: true };

    } catch (error) {
      console.error('❌ Error inesperado en reset:', error);
      return { 
        success: false, 
        error: 'Error de conexión. Verifica tu internet.' 
      };
    }
  }

  /**
   * 👤 OBTENER USUARIO ACTUAL
   */
  static async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    } catch (error) {
      console.error('❌ Error obteniendo usuario:', error);
      return null;
    }
  }

  /**
   * 🔄 OBTENER SESIÓN ACTUAL
   */
  static async getCurrentSession(): Promise<Session | null> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    } catch (error) {
      console.error('❌ Error obteniendo sesión:', error);
      return null;
    }
  }

  /**
   * 🔄 RESTAURAR SESIÓN DESDE STORAGE
   */
  static async restoreSession(): Promise<{
    success: boolean;
    user?: User;
    session?: Session;
  }> {
    try {
      console.log('🔄 Restaurando sesión...');

      // Verificar si la sesión ha expirado
      const isExpired = await SecureStorageService.isSessionExpired();
      if (isExpired) {
        console.log('⏰ Sesión expirada');
        await SecureStorageService.clearAuthData();
        return { success: false };
      }

      // Intentar obtener sesión de Supabase
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error || !session) {
        console.log('❌ No hay sesión válida');
        await SecureStorageService.clearAuthData();
        return { success: false };
      }

      console.log('✅ Sesión restaurada');
      return { 
        success: true, 
        user: session.user,
        session 
      };

    } catch (error) {
      console.error('❌ Error restaurando sesión:', error);
      await SecureStorageService.clearAuthData();
      return { success: false };
    }
  }

  /**
   * 💾 GUARDAR SESIÓN DE FORMA SEGURA
   */
  private static async saveSession(session: Session): Promise<void> {
    try {
      await Promise.all([
        SecureStorageService.saveAccessToken(session.access_token),
        SecureStorageService.saveRefreshToken(session.refresh_token),
        HybridStorageService.saveUserSession(session),
      ]);
    } catch (error) {
      console.error('❌ Error guardando sesión:', error);
    }
  }

  /**
   * ✅ VALIDAR EMAIL
   */
  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * 🔒 VALIDAR CONTRASEÑA
   */
  private static validatePassword(password: string): {
    isValid: boolean;
    error?: string;
  } {
    if (password.length < AUTH_CONFIG.PASSWORD_MIN_LENGTH) {
      return { 
        isValid: false, 
        error: `La contraseña debe tener al menos ${AUTH_CONFIG.PASSWORD_MIN_LENGTH} caracteres` 
      };
    }

    if (AUTH_CONFIG.PASSWORD_REQUIRE_UPPERCASE && !/[A-Z]/.test(password)) {
      return { 
        isValid: false, 
        error: 'La contraseña debe contener al menos una mayúscula' 
      };
    }

    if (AUTH_CONFIG.PASSWORD_REQUIRE_LOWERCASE && !/[a-z]/.test(password)) {
      return { 
        isValid: false, 
        error: 'La contraseña debe contener al menos una minúscula' 
      };
    }

    if (AUTH_CONFIG.PASSWORD_REQUIRE_NUMBERS && !/\d/.test(password)) {
      return { 
        isValid: false, 
        error: 'La contraseña debe contener al menos un número' 
      };
    }

    return { isValid: true };
  }

  /**
   * ⚡ VERIFICAR RATE LIMITING
   */
  private static isRateLimited(identifier: string): boolean {
    const data = this.rateLimitData.get(identifier);
    if (!data) return false;

    const now = Date.now();

    // Si está bloqueado temporalmente
    if (data.blockedUntil && now < data.blockedUntil) {
      return true;
    }

    // Si ha pasado la ventana de tiempo, resetear
    if (now - data.lastAttempt > AUTH_CONFIG.RATE_LIMIT_WINDOW) {
      this.rateLimitData.delete(identifier);
      return false;
    }

    // Verificar límite de intentos
    return data.attempts >= AUTH_CONFIG.RATE_LIMIT_ATTEMPTS;
  }

  /**
   * 📝 REGISTRAR INTENTO FALLIDO
   */
  private static recordFailedAttempt(identifier: string): void {
    const now = Date.now();
    const existing = this.rateLimitData.get(identifier);

    if (!existing) {
      this.rateLimitData.set(identifier, {
        attempts: 1,
        lastAttempt: now,
      });
      return;
    }

    // Si ha pasado la ventana, resetear
    if (now - existing.lastAttempt > AUTH_CONFIG.RATE_LIMIT_WINDOW) {
      this.rateLimitData.set(identifier, {
        attempts: 1,
        lastAttempt: now,
      });
      return;
    }

    // Incrementar intentos
    existing.attempts += 1;
    existing.lastAttempt = now;

    // Si excede el límite, bloquear temporalmente
    if (existing.attempts >= AUTH_CONFIG.RATE_LIMIT_ATTEMPTS) {
      existing.blockedUntil = now + AUTH_CONFIG.RATE_LIMIT_WINDOW;
    }
  }

  /**
   * 🧹 LIMPIAR RATE LIMITING
   */
  private static clearRateLimit(identifier: string): void {
    this.rateLimitData.delete(identifier);
  }

  /**
   * 📝 ERRORES LEGIBLES PARA USUARIO
   */
  private static getHumanReadableError(error: AuthError): string {
    switch (error.message) {
      case 'Invalid login credentials':
        return 'Email o contraseña incorrectos';
      case 'Email not confirmed':
        return 'Por favor confirma tu email antes de iniciar sesión';
      case 'User already registered':
        return 'Este email ya está registrado';
      case 'Password should be at least 6 characters':
        return 'La contraseña debe tener al menos 6 caracteres';
      case 'Unable to validate email address: invalid format':
        return 'Formato de email inválido';
      case 'Signup is disabled':
        return 'El registro está temporalmente deshabilitado';
      default:
        return error.message || 'Error desconocido';
    }
  }
}

console.log('✅ AuthService inicializado con Supabase');