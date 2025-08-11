/**
 * 🔒 ALMACENAMIENTO SEGURO (LEGACY PARA TOKENS PEQUEÑOS)
 * La gestión de sesión completa ahora se maneja en HybridStorageService (cifrado + compresión + rotación)
 */

import * as SecureStore from 'expo-secure-store';
import { HybridStorageService } from './hybridStorage';

// Interfaces para tipar la sesión
interface UserSession {
  user?: { id?: string; email?: string; role?: string };
  expires_at?: number;
  access_token?: string;
}

// Claves para almacenamiento seguro
const STORAGE_KEYS = {
  ACCESS_TOKEN: 'supabase_access_token',
  REFRESH_TOKEN: 'supabase_refresh_token',
  USER_SESSION: 'user_session',
  BIOMETRIC_ENABLED: 'biometric_enabled',
  LAST_LOGIN: 'last_login',
} as const;

// Opciones básicas de seguridad para SecureStore
const SECURE_STORE_OPTIONS: SecureStore.SecureStoreOptions = {
  requireAuthentication: false, // Deshabilitamos temporalmente la autenticación biométrica
  keychainAccessible: SecureStore.WHEN_UNLOCKED
};

/**
 * 🔐 Servicio de Almacenamiento Seguro
 * Maneja tokens y datos sensibles de forma segura
 */
// Reemplazo de la clase con métodos estáticos por un objeto literal para evitar el error de parsing sobre 'static'
export const SecureStorageService = {
  /** Guardar token de acceso */
  async saveAccessToken(token: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(
        STORAGE_KEYS.ACCESS_TOKEN,
        token,
        SECURE_STORE_OPTIONS
      );
      console.log('✅ Access token guardado de forma segura');
    } catch (error) {
      console.error('❌ Error guardando access token:', error);
      throw new Error('Error al guardar token de acceso');
    }
  },
  /** Obtener token de acceso */
  async getAccessToken(): Promise<string | null> {
    try {
      const token = await SecureStore.getItemAsync(
        STORAGE_KEYS.ACCESS_TOKEN,
        SECURE_STORE_OPTIONS
      );
      return token;
    } catch (error) {
      console.error('❌ Error obteniendo access token:', error);
      return null;
    }
  },
  /** Guardar refresh token */
  async saveRefreshToken(token: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(
        STORAGE_KEYS.REFRESH_TOKEN,
        token,
        SECURE_STORE_OPTIONS
      );
      console.log('✅ Refresh token guardado de forma segura');
    } catch (error) {
      console.error('❌ Error guardando refresh token:', error);
      throw new Error('Error al guardar token de refresh');
    }
  },
  /** Obtener refresh token */
  async getRefreshToken(): Promise<string | null> {
    try {
      const token = await SecureStore.getItemAsync(
        STORAGE_KEYS.REFRESH_TOKEN,
        SECURE_STORE_OPTIONS
      );
      return token;
    } catch (error) {
      console.error('❌ Error obteniendo refresh token:', error);
      return null;
    }
  },
  /** (DEPRECATED) Guardar sesión completa */
  async saveUserSession(session: UserSession): Promise<void> {
    console.warn('[SecureStorageService] saveUserSession deprecated -> usar HybridStorageService');
    await HybridStorageService.saveUserSession(session);
  },
  /** (DEPRECATED) Obtener sesión completa */
  async getUserSession(): Promise<UserSession | null> {
    console.warn('[SecureStorageService] getUserSession deprecated -> usar HybridStorageService');
    return HybridStorageService.getUserSession();
  },
  /** Verificar expiración de sesión */
  async isSessionExpired(): Promise<boolean> {
    try {
      const lastLoginString = await SecureStore.getItemAsync(
        STORAGE_KEYS.LAST_LOGIN,
        SECURE_STORE_OPTIONS
      );
      if (!lastLoginString) return true;
      const lastLogin = new Date(lastLoginString);
      const now = new Date();
      const hoursDiff = (now.getTime() - lastLogin.getTime()) / (1000 * 60 * 60);
      return hoursDiff > 24; // expira a las 24h
    } catch (error) {
      console.error('❌ Error verificando expiración:', error);
      return true;
    }
  },
  /** Limpiar datos de auth */
  async clearAuthData(): Promise<void> {
    try {
      await Promise.all([
        SecureStore.deleteItemAsync(STORAGE_KEYS.ACCESS_TOKEN),
        SecureStore.deleteItemAsync(STORAGE_KEYS.REFRESH_TOKEN),
        SecureStore.deleteItemAsync(STORAGE_KEYS.USER_SESSION),
        SecureStore.deleteItemAsync(STORAGE_KEYS.LAST_LOGIN),
      ]);
      console.log('✅ Datos de autenticación limpiados');
    } catch (error) {
      console.error('❌ Error limpiando datos:', error);
    }
  },
  /** Disponibilidad SecureStore */
  async isAvailable(): Promise<boolean> {
    try {
      return await SecureStore.isAvailableAsync();
    } catch (error) {
      console.error('❌ SecureStore no disponible:', error);
      return false;
    }
  },
  /** Habilitar biométrico */
  async setBiometricEnabled(enabled: boolean): Promise<void> {
    try {
      await SecureStore.setItemAsync(
        STORAGE_KEYS.BIOMETRIC_ENABLED,
        enabled.toString(),
        SECURE_STORE_OPTIONS
      );
    } catch (error) {
      console.error('❌ Error configurando biométrico:', error);
    }
  },
  /** Verificar biométrico */
  async isBiometricEnabled(): Promise<boolean> {
    try {
      const enabled = await SecureStore.getItemAsync(
        STORAGE_KEYS.BIOMETRIC_ENABLED,
        SECURE_STORE_OPTIONS
      );
      return enabled === 'true';
    } catch (error) {
      console.error('❌ Error verificando biométrico:', error);
      return false;
    }
  }
};

console.log('✅ SecureStorageService inicializado (objeto modo tokens, sesión delegada a HybridStorageService)');