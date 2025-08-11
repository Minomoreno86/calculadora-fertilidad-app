/**
 * 🔐 CONFIGURACIÓN SUPABASE
 * Sistema de autenticación seguro para App Store
 */

import 'react-native-get-random-values';
import * as ExpoCrypto from 'expo-crypto';

interface CryptoLike { getRandomValues: (array: Uint8Array) => Uint8Array }

const g = global as unknown as { crypto?: CryptoLike };
if (!g.crypto || typeof g.crypto.getRandomValues !== 'function') {
  g.crypto = {
    getRandomValues: (arr: Uint8Array) => {
      const bytes = ExpoCrypto.getRandomBytes(arr.length);
      arr.set(bytes);
      return arr;
    }
  };
  console.log('🔐 crypto.getRandomValues polyfill listo');
}

import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

// ⚠️ CONFIGURACIÓN REQUERIDA
// 1. Ve a https://supabase.com
// 2. Crea un nuevo proyecto
// 3. Ve a Settings > API
// 4. Copia tu Project URL y anon key

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://vlabatqferjzejissrbs.supabase.co';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZsYWJhdHFmZXJqemVqaXNzcmJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0OTgwNzAsImV4cCI6MjA3MDA3NDA3MH0._2yObKcEDHGHOLAPxb8qOVj20QGAGKjKMHl3Gpgdk44';

// Validación de configuración
if (SUPABASE_URL.includes('tu-proyecto') || SUPABASE_ANON_KEY.includes('tu-anon-key')) {
  console.error('🔴 SUPABASE NO CONFIGURADO - Ve a src/config/supabase.ts');
}

// Cliente Supabase optimizado para React Native
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    // Configuración para React Native
    storage: undefined, // Usaremos nuestro storage personalizado
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
  // Configuración de red optimizada
  global: {
    headers: {
      'X-Client-Info': `calculadora-fertilidad-${Platform.OS}`,
    },
  },
});

// Configuración de tipos para TypeScript
export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthSession {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  user: {
    id: string;
    email: string;
    phone?: string;
    created_at: string;
  };
}

// Estados de autenticación
export type AuthState = 'loading' | 'authenticated' | 'unauthenticated';

// Configuración de seguridad
export const AUTH_CONFIG = {
  // Tiempo de expiración de sesión (24 horas)
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000,
  
  // Reintentos automáticos
  MAX_RETRIES: 3,
  
  // Rate limiting local (previene spam)
  RATE_LIMIT_ATTEMPTS: 5,
  RATE_LIMIT_WINDOW: 15 * 60 * 1000, // 15 minutos
  
  // Configuración de contraseñas
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REQUIRE_UPPERCASE: true,
  PASSWORD_REQUIRE_LOWERCASE: true,
  PASSWORD_REQUIRE_NUMBERS: true,
  PASSWORD_REQUIRE_SPECIAL: false,
} as const;

console.log('✅ Supabase configurado correctamente');