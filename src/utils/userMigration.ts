/**
 * 🔄 MIGRACIÓN DE USUARIOS EXISTENTES
 * Herramienta para migrar usuarios del sistema anterior a Supabase
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthService } from '@/services/authService';
import { SecureStorageService } from '@/services/secureStorage';

interface LegacyUser {
  id: string;
  email: string;
  name: string;
  type: 'login' | 'register' | 'guest';
  loginDate: string;
  // Otros campos del sistema anterior
}

interface MigrationResult {
  success: boolean;
  migratedUsers: number;
  errors: string[];
  skippedUsers: number;
}

/**
 * 🔄 Servicio de Migración de Usuarios
 */
export class UserMigrationService {
  
  /**
   * 🚀 Migrar todos los usuarios existentes a Supabase
   */
  static async migrateAllUsers(): Promise<MigrationResult> {
    const result: MigrationResult = {
      success: false,
      migratedUsers: 0,
      errors: [],
      skippedUsers: 0,
    };

    try {
      console.log('🔄 Iniciando migración de usuarios...');

      // 1. Obtener usuarios del sistema anterior
      const legacyUsers = await this.getLegacyUsers();
      
      if (legacyUsers.length === 0) {
        console.log('✅ No hay usuarios para migrar');
        result.success = true;
        return result;
      }

      console.log(`📊 Encontrados ${legacyUsers.length} usuarios para migrar`);

      // 2. Migrar cada usuario
      for (const legacyUser of legacyUsers) {
        try {
          await this.migrateSingleUser(legacyUser);
          result.migratedUsers++;
          console.log(`✅ Usuario migrado: ${legacyUser.email}`);
        } catch (error) {
          const errorMsg = `Error migrando ${legacyUser.email}: ${error}`;
          result.errors.push(errorMsg);
          console.error(`❌ ${errorMsg}`);
        }
      }

      // 3. Limpiar datos antiguos después de migración exitosa
      if (result.errors.length === 0) {
        await this.cleanupLegacyData();
        console.log('🧹 Datos antiguos limpiados');
      }

      result.success = result.migratedUsers > 0 && result.errors.length === 0;
      
      console.log(`✅ Migración completada: ${result.migratedUsers} usuarios migrados`);
      return result;

    } catch (error) {
      console.error('❌ Error en migración general:', error);
      result.errors.push(`Error general: ${error}`);
      return result;
    }
  }

  /**
   * 📋 Obtener usuarios del sistema anterior
   */
  private static async getLegacyUsers(): Promise<LegacyUser[]> {
    try {
      const users: LegacyUser[] = [];

      // Intentar obtener usuario actual de AsyncStorage
      const storedAuth = await AsyncStorage.getItem('user_auth');
      if (storedAuth) {
        const userData = JSON.parse(storedAuth);
        users.push(userData);
      }

      // Intentar obtener usuarios del userStorageService (si existe)
      try {
        const { userStorageService } = await import('@/services/userStorageService');
        const allUsers = await userStorageService.getAllUsers();
        
        if (allUsers && Array.isArray(allUsers)) {
          users.push(...allUsers.map(user => ({
            id: user.id,
            email: user.email,
            name: user.name || user.email.split('@')[0],
            type: 'register' as const,
            loginDate: user.lastLogin || new Date().toISOString(),
          })));
        }
      } catch (error) {
        console.log('ℹ️ userStorageService no disponible:', error);
      }

      // Eliminar duplicados por email
      const uniqueUsers = users.filter((user, index, self) => 
        index === self.findIndex(u => u.email === user.email)
      );

      return uniqueUsers;
    } catch (error) {
      console.error('❌ Error obteniendo usuarios legacy:', error);
      return [];
    }
  }

  /**
   * 👤 Migrar un usuario individual
   */
  private static async migrateSingleUser(legacyUser: LegacyUser): Promise<void> {
    try {
      // Saltar usuarios invitados
      if (legacyUser.type === 'guest' || legacyUser.email.includes('guest') || legacyUser.email.includes('invitado')) {
        console.log(`⏭️ Saltando usuario invitado: ${legacyUser.email}`);
        return;
      }

      // Generar contraseña temporal para migración
      const tempPassword = this.generateTempPassword();
      
      // Registrar usuario en Supabase
      const result = await AuthService.register(
        legacyUser.email,
        tempPassword,
        legacyUser.name
      );

      if (!result.success) {
        // Si el usuario ya existe, no es un error crítico
        if (result.error?.includes('already registered') || result.error?.includes('ya está registrado')) {
          console.log(`ℹ️ Usuario ya existe en Supabase: ${legacyUser.email}`);
          return;
        }
        throw new Error(result.error || 'Error desconocido en registro');
      }

      console.log(`✅ Usuario registrado en Supabase: ${legacyUser.email}`);
      
      // Nota: El usuario necesitará hacer reset de contraseña para establecer una nueva
      
    } catch (error) {
      throw new Error(`Migración fallida para ${legacyUser.email}: ${error}`);
    }
  }

  /**
   * 🔑 Generar contraseña temporal segura
   */
  private static generateTempPassword(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    
    // Asegurar al menos una mayúscula, minúscula, número y símbolo
    password += 'A'; // Mayúscula
    password += 'a'; // Minúscula  
    password += '1'; // Número
    password += '!'; // Símbolo
    
    // Completar hasta 12 caracteres
    for (let i = 4; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    // Mezclar caracteres
    return password.split('').sort(() => 0.5 - Math.random()).join('');
  }

  /**
   * 🧹 Limpiar datos del sistema anterior
   */
  private static async cleanupLegacyData(): Promise<void> {
    try {
      // Limpiar AsyncStorage
      await AsyncStorage.removeItem('user_auth');
      
      // Limpiar otros datos legacy si existen
      const legacyKeys = [
        'user_data',
        'user_session',
        'auth_token',
        'user_preferences',
      ];
      
      for (const key of legacyKeys) {
        try {
          await AsyncStorage.removeItem(key);
        } catch (error) {
          console.log(`ℹ️ Clave ${key} no encontrada`);
        }
      }
      
      console.log('🧹 Datos legacy limpiados');
    } catch (error) {
      console.error('❌ Error limpiando datos legacy:', error);
    }
  }

  /**
   * 📊 Verificar estado de migración
   */
  static async checkMigrationStatus(): Promise<{
    needsMigration: boolean;
    legacyUsersCount: number;
    hasSupabaseAuth: boolean;
  }> {
    try {
      const legacyUsers = await this.getLegacyUsers();
      const currentSession = await AuthService.getCurrentSession();
      
      return {
        needsMigration: legacyUsers.length > 0 && !currentSession,
        legacyUsersCount: legacyUsers.length,
        hasSupabaseAuth: !!currentSession,
      };
    } catch (error) {
      console.error('❌ Error verificando migración:', error);
      return {
        needsMigration: false,
        legacyUsersCount: 0,
        hasSupabaseAuth: false,
      };
    }
  }

  /**
   * 🔄 Migración automática en background
   */
  static async autoMigrate(): Promise<boolean> {
    try {
      const status = await this.checkMigrationStatus();
      
      if (!status.needsMigration) {
        console.log('ℹ️ No se necesita migración automática');
        return true;
      }

      console.log('🔄 Iniciando migración automática...');
      const result = await this.migrateAllUsers();
      
      if (result.success) {
        console.log('✅ Migración automática completada');
        return true;
      } else {
        console.error('❌ Migración automática falló:', result.errors);
        return false;
      }
    } catch (error) {
      console.error('❌ Error en migración automática:', error);
      return false;
    }
  }
}

console.log('✅ UserMigrationService inicializado');