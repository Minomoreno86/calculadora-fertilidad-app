/**
 * 🔐 ALMACENAMIENTO HÍBRIDO
 * Sistema de almacenamiento que combina AsyncStorage para datos grandes
 * y SecureStore para datos sensibles
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
// Eliminado Platform no usado
import CryptoJS from 'crypto-js';
import pako from 'pako';
import * as ExpoCrypto from 'expo-crypto';

// Claves para almacenamiento
const STORAGE_KEYS = {
  SESSION_DATA: 'auth_session_data',
  SESSION_KEY_ACTIVE: 'auth_session_key_active',
  SESSION_KEY_PREVIOUS: 'auth_session_key_previous',
  KEY_METADATA: 'auth_session_key_meta',
  BIOMETRIC_ENABLED: 'biometric_enabled',
  LAST_LOGIN: 'last_login',
} as const;

// Opciones de SecureStore
const SECURE_STORE_OPTIONS: SecureStore.SecureStoreOptions = {
  requireAuthentication: false,
  keychainAccessible: SecureStore.WHEN_UNLOCKED
};

// Interfaces
interface UserSession {
  user?: { id?: string; email?: string; role?: string };
  expires_at?: number;
  access_token?: string;
}

interface KeyMetadata {
  activeKeyId: string;
  previousKeyId?: string;
  rotatedAt?: string;
  createdAt: string;
  version: number;
}

interface EncryptedEnvelopeV1 {
  v: 1;
  k: string; // key id
  iv: string; // base64 IV
  ct: string; // base64 ciphertext
  hmac: string; // integrity
  algo: 'AES-256-CBC';
  comp: 'gzip';
}

/**
 * 🔒 Servicio de Almacenamiento Híbrido
 */
export class HybridStorageService {
  // ==========================
  // 🧠 Caché en memoria
  // ==========================
  private static memorySession: UserSession | null = null;
  private static lastLoadTs: number | null = null;
  private static readonly MEMORY_TTL_MS = 5 * 60 * 1000; // 5 min

  // ==========================
  // 🔐 Gestión de Claves
  // ==========================
  private static async generateRawKey(): Promise<string> {
    // Usar solo CryptoJS para evitar dependencia nativa que falla en algunos entornos
    const wa = CryptoJS.lib.WordArray.random(32);
    return CryptoJS.enc.Base64.stringify(wa);
  }

  private static async ensureActiveKey(): Promise<{ keyId: string; key: string }> {
    const activeKey = await SecureStore.getItemAsync(STORAGE_KEYS.SESSION_KEY_ACTIVE, SECURE_STORE_OPTIONS);
    const metaJson = await SecureStore.getItemAsync(STORAGE_KEYS.KEY_METADATA, SECURE_STORE_OPTIONS);
    if (activeKey && metaJson) {
      const meta: KeyMetadata = JSON.parse(metaJson);
      return { keyId: meta.activeKeyId, key: activeKey };
    }
    // Inicializar
    const key = await this.generateRawKey();
    const keyId = 'k_' + Date.now().toString(36);
    const metadata: KeyMetadata = { activeKeyId: keyId, createdAt: new Date().toISOString(), version: 1 };
    await SecureStore.setItemAsync(STORAGE_KEYS.SESSION_KEY_ACTIVE, key, SECURE_STORE_OPTIONS);
    await SecureStore.setItemAsync(STORAGE_KEYS.KEY_METADATA, JSON.stringify(metadata), SECURE_STORE_OPTIONS);
    return { keyId, key };
  }

  static async rotateKey(): Promise<void> {
    try {
      const { keyId: oldKeyId, key: oldKey } = await this.ensureActiveKey();
      const newKey = await this.generateRawKey();
      const newKeyId = 'k_' + Date.now().toString(36);
      const metaJson = await SecureStore.getItemAsync(STORAGE_KEYS.KEY_METADATA, SECURE_STORE_OPTIONS);
      const prevMeta: KeyMetadata | null = metaJson ? JSON.parse(metaJson) : null;
      const newMeta: KeyMetadata = {
        activeKeyId: newKeyId,
        previousKeyId: oldKeyId,
        createdAt: prevMeta?.createdAt || new Date().toISOString(),
        rotatedAt: new Date().toISOString(),
        version: (prevMeta?.version || 1) + 1,
      };
      await SecureStore.setItemAsync(STORAGE_KEYS.SESSION_KEY_PREVIOUS, oldKey, SECURE_STORE_OPTIONS);
      await SecureStore.setItemAsync(STORAGE_KEYS.SESSION_KEY_ACTIVE, newKey, SECURE_STORE_OPTIONS);
      await SecureStore.setItemAsync(STORAGE_KEYS.KEY_METADATA, JSON.stringify(newMeta), SECURE_STORE_OPTIONS);
      console.log('🔑 Clave de sesión rotada');
      // Re-encriptar sesión si existe
      const session = await this.getUserSession(true); // saltar caché
      if (session) {
        await this.saveUserSession(session, { force: true });
      }
    } catch (e) {
      console.error('❌ Error rotando clave:', e);
    }
  }

  // ==========================
  // 🧬 Utilidades base64 / bytes
  // ==========================
  private static bytesToBase64(bytes: Uint8Array): string {
    if (typeof Buffer !== 'undefined') {
      try { return Buffer.from(bytes).toString('base64'); } catch { /* fallback to manual */ }
    }
    let binary = '';
    for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
    if (typeof btoa !== 'undefined') return btoa(binary);
    // Polyfill simple
    return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Latin1.parse(binary));
  }
  private static base64ToBytes(b64: string): Uint8Array {
    let binary: string;
    if (typeof atob !== 'undefined') {
      binary = atob(b64);
    } else if (typeof Buffer !== 'undefined') {
      binary = Buffer.from(b64, 'base64').toString('binary');
    } else {
      const words = CryptoJS.enc.Base64.parse(b64);
      binary = CryptoJS.enc.Latin1.stringify(words);
    }
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes;
  }

  // ==========================
  // 🗜️ Compresión
  // ==========================
  private static compress(data: string): string {
    const gz = pako.gzip(data);
    return this.bytesToBase64(gz);
  }
  private static decompress(b64: string): string {
    const bytes = this.base64ToBytes(b64);
    const ungz = pako.ungzip(bytes, { to: 'string' });
    return ungz as string;
  }

  // ==========================
  // 🔒 Cifrado AES + HMAC
  // ==========================
  private static async encrypt(plain: string, keyB64: string, keyId: string): Promise<EncryptedEnvelopeV1> {
    // IV seguro usando expo-crypto; fallback a Math.random si falla
    let ivBytes = new Uint8Array(16);
    try {
      const rnd = await ExpoCrypto.getRandomBytes(16);
      ivBytes.set(rnd);
    } catch (e) {
      console.warn('⚠️ Fallback IV random (expo-crypto falló):', e);
      for (let i = 0; i < ivBytes.length; i++) ivBytes[i] = (Math.random() * 256) | 0;
    }
    const ivHex = Array.from(ivBytes).map(b => b.toString(16).padStart(2, '0')).join('');
    const iv = CryptoJS.enc.Hex.parse(ivHex);
    const keyWords = CryptoJS.enc.Base64.parse(keyB64);
    const encrypted = CryptoJS.AES.encrypt(plain, keyWords, { iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
    const ivB64 = CryptoJS.enc.Base64.stringify(iv);
    const ctB64 = encrypted.ciphertext.toString(CryptoJS.enc.Base64);
    const hmac = CryptoJS.HmacSHA256(ivB64 + ':' + ctB64, keyWords).toString(CryptoJS.enc.Hex);
    return { v: 1, k: keyId, iv: ivB64, ct: ctB64, hmac, algo: 'AES-256-CBC', comp: 'gzip' };
  }
  private static decrypt(env: EncryptedEnvelopeV1, keyB64: string): string | null {
    try {
      const keyWords = CryptoJS.enc.Base64.parse(keyB64);
      const calcHmac = CryptoJS.HmacSHA256(env.iv + ':' + env.ct, keyWords).toString(CryptoJS.enc.Hex);
      if (calcHmac !== env.hmac) {
        console.warn('⚠️ HMAC inválido, posible manipulación.');
        return null;
      }
      const iv = CryptoJS.enc.Base64.parse(env.iv);
      const ctWords = CryptoJS.enc.Base64.parse(env.ct);
      const cipherParams = CryptoJS.lib.CipherParams.create({ ciphertext: ctWords });
      const decrypted = CryptoJS.AES.decrypt(cipherParams, keyWords, { iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
      return decrypted.toString(CryptoJS.enc.Utf8);
    } catch (e) {
      console.error('❌ Error descifrando:', e);
      return null;
    }
  }

  // ==========================
  // 💾 Guardar sesión
  // ==========================
  static async saveUserSession(session: UserSession, options: { force?: boolean } = {}): Promise<void> {
    try {
      if (!options.force && this.memorySession) this.memorySession = session; // actualizar caché
      const { keyId, key } = await this.ensureActiveKey();
      const json = JSON.stringify(session);
      const compressed = this.compress(json);
      const envelope = await this.encrypt(compressed, key, keyId);
      await AsyncStorage.setItem(STORAGE_KEYS.SESSION_DATA, JSON.stringify(envelope));
      await SecureStore.setItemAsync(STORAGE_KEYS.LAST_LOGIN, new Date().toISOString(), SECURE_STORE_OPTIONS);
      this.memorySession = session;
      this.lastLoadTs = Date.now();
      console.log('✅ Sesión guardada (cifrada + comprimida)');
    } catch (e) {
      console.error('❌ Error guardando sesión:', e);
      throw new Error('Error al guardar la sesión');
    }
  }

  // ==========================
  // 📥 Obtener sesión
  // ==========================
  static async getUserSession(skipMemory = false): Promise<UserSession | null> {
    try {
      if (!skipMemory && this.memorySession && this.lastLoadTs && (Date.now() - this.lastLoadTs) < this.MEMORY_TTL_MS) {
        return this.memorySession;
      }
      const envelopeStr = await AsyncStorage.getItem(STORAGE_KEYS.SESSION_DATA);
      if (!envelopeStr) return null;
      const env: EncryptedEnvelopeV1 = JSON.parse(envelopeStr);
      if (env.v !== 1) {
        console.warn('⚠️ Versión de sobre desconocida');
        return null;
      }
      // Intentar con clave activa luego con previa
      const { key } = await this.ensureActiveKey();
      let decrypted = this.decrypt(env, key);
      if (!decrypted) {
        const prevKey = await SecureStore.getItemAsync(STORAGE_KEYS.SESSION_KEY_PREVIOUS, SECURE_STORE_OPTIONS);
        if (prevKey) decrypted = this.decrypt(env, prevKey);
      }
      if (!decrypted) return null;
      const decompressed = this.decompress(decrypted);
      const session: UserSession = JSON.parse(decompressed);
      this.memorySession = session;
      this.lastLoadTs = Date.now();
      return session;
    } catch (e) {
      console.error('❌ Error obteniendo sesión:', e);
      return null;
    }
  }

  // ==========================
  // ⏰ Expiración
  // ==========================
  static async isSessionExpired(): Promise<boolean> {
    try {
      const last = await SecureStore.getItemAsync(STORAGE_KEYS.LAST_LOGIN, SECURE_STORE_OPTIONS);
      if (!last) return true;
      const diffH = (Date.now() - new Date(last).getTime()) / 36e5;
      return diffH > 24;
    } catch { return true; }
  }

  // ==========================
  // 🧹 Limpieza
  // ==========================
  static async clearSession(): Promise<void> {
    try {
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.SESSION_DATA),
        SecureStore.deleteItemAsync(STORAGE_KEYS.SESSION_KEY_ACTIVE),
        SecureStore.deleteItemAsync(STORAGE_KEYS.SESSION_KEY_PREVIOUS),
        SecureStore.deleteItemAsync(STORAGE_KEYS.KEY_METADATA),
        SecureStore.deleteItemAsync(STORAGE_KEYS.LAST_LOGIN),
      ]);
      this.memorySession = null;
      this.lastLoadTs = null;
      console.log('✅ Sesión eliminada');
    } catch (e) {
      console.error('❌ Error limpiando sesión:', e);
    }
  }

  // ==========================
  // 🔐 Biometría
  // ==========================
  static async setBiometricEnabled(enabled: boolean): Promise<void> {
    try {
      await SecureStore.setItemAsync(STORAGE_KEYS.BIOMETRIC_ENABLED, enabled.toString(), SECURE_STORE_OPTIONS);
    } catch (e) { console.error('❌ Error biometría:', e); }
  }
  static async isBiometricEnabled(): Promise<boolean> {
    try {
      const v = await SecureStore.getItemAsync(STORAGE_KEYS.BIOMETRIC_ENABLED, SECURE_STORE_OPTIONS);
      return v === 'true';
    } catch { return false; }
  }
}

console.log('✅ HybridStorageService actualizado (AES+gzip+rotación)');
