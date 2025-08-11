/**
 * 👥 SERVICIO DE ALMACENAMIENTO DE USUARIOS
 * 
 * Gestiona el registro, autenticación y almacenamiento de usuarios
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// ===================================================================
// 🏷️ TIPOS
// ===================================================================

export interface User {
  id: string;
  email: string;
  password: string; // En producción debería estar hasheada
  createdAt: string;
  lastLogin?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
}

// ===================================================================
// 🔑 CONSTANTES
// ===================================================================

const USERS_STORAGE_KEY = '@fertility_app_users';
const CURRENT_USER_KEY = '@fertility_app_current_user';

// ===================================================================
// 🏗️ SERVICIO DE USUARIOS
// ===================================================================

class UserStorageService {
  
  // 📋 Obtener todos los usuarios
  async getAllUsers(): Promise<User[]> {
    try {
      const usersJson = await AsyncStorage.getItem(USERS_STORAGE_KEY);
      return usersJson ? JSON.parse(usersJson) : [];
    } catch (error) {
      console.error('❌ Error obteniendo usuarios:', error);
      return [];
    }
  }

  // 💾 Guardar usuarios
  private async saveUsers(users: User[]): Promise<void> {
    try {
      await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch (error) {
      console.error('❌ Error guardando usuarios:', error);
      throw new Error('No se pudo guardar los usuarios');
    }
  }

  // 🔍 Buscar usuario por email
  async findUserByEmail(email: string): Promise<User | null> {
    try {
      const users = await this.getAllUsers();
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      return user || null;
    } catch (error) {
      console.error('❌ Error buscando usuario:', error);
      return null;
    }
  }

  // 📝 Registrar nuevo usuario
  async registerUser(userData: RegisterData): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      // Verificar si el usuario ya existe
      const existingUser = await this.findUserByEmail(userData.email);
      if (existingUser) {
        return {
          success: false,
          error: 'Este email ya está registrado'
        };
      }

      // Validaciones básicas
      if (!userData.email || !userData.password) {
        return {
          success: false,
          error: 'Email y contraseña son requeridos'
        };
      }

      if (!this.isValidEmail(userData.email)) {
        return {
          success: false,
          error: 'Email no válido'
        };
      }

      if (userData.password.length < 6) {
        return {
          success: false,
          error: 'La contraseña debe tener al menos 6 caracteres'
        };
      }

      // Crear nuevo usuario
      const newUser: User = {
        id: this.generateUserId(),
        email: userData.email.toLowerCase(),
        password: userData.password, // En producción: hash(userData.password)
        createdAt: new Date().toISOString(),
      };

      // Obtener usuarios existentes y agregar el nuevo
      const users = await this.getAllUsers();
      users.push(newUser);
      
      // Guardar usuarios actualizados
      await this.saveUsers(users);

      console.log('✅ Usuario registrado exitosamente:', newUser.email);
      
      return {
        success: true,
        user: newUser
      };

    } catch (error) {
      console.error('❌ Error registrando usuario:', error);
      return {
        success: false,
        error: 'Error interno del servidor'
      };
    }
  }

  // 🔐 Autenticar usuario
  async loginUser(credentials: LoginCredentials): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      // Validaciones básicas
      if (!credentials.email || !credentials.password) {
        return {
          success: false,
          error: 'Email y contraseña son requeridos'
        };
      }

      // Buscar usuario
      const user = await this.findUserByEmail(credentials.email);
      if (!user) {
        return {
          success: false,
          error: 'Usuario no registrado. Por favor, regístrate primero.'
        };
      }

      // Verificar contraseña
      if (user.password !== credentials.password) { // En producción: compareHash(credentials.password, user.password)
        return {
          success: false,
          error: 'Contraseña incorrecta'
        };
      }

      // Actualizar último login
      const users = await this.getAllUsers();
      const userIndex = users.findIndex(u => u.id === user.id);
      if (userIndex !== -1) {
        users[userIndex].lastLogin = new Date().toISOString();
        await this.saveUsers(users);
      }

      console.log('✅ Usuario autenticado exitosamente:', user.email);

      return {
        success: true,
        user: { ...user, lastLogin: new Date().toISOString() }
      };

    } catch (error) {
      console.error('❌ Error autenticando usuario:', error);
      return {
        success: false,
        error: 'Error interno del servidor'
      };
    }
  }

  // 💾 Guardar usuario actual en sesión
  async saveCurrentUser(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('❌ Error guardando usuario actual:', error);
    }
  }

  // 👤 Obtener usuario actual
  async getCurrentUser(): Promise<User | null> {
    try {
      const userJson = await AsyncStorage.getItem(CURRENT_USER_KEY);
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error('❌ Error obteniendo usuario actual:', error);
      return null;
    }
  }

  // 🚪 Cerrar sesión
  async logout(): Promise<void> {
    try {
      await AsyncStorage.removeItem(CURRENT_USER_KEY);
      console.log('👋 Sesión cerrada');
    } catch (error) {
      console.error('❌ Error cerrando sesión:', error);
    }
  }

  // 🗑️ Limpiar todos los usuarios (solo para desarrollo)
  async clearAllUsers(): Promise<void> {
    try {
      await AsyncStorage.removeItem(USERS_STORAGE_KEY);
      await AsyncStorage.removeItem(CURRENT_USER_KEY);
      console.log('🗑️ Todos los usuarios eliminados');
    } catch (error) {
      console.error('❌ Error limpiando usuarios:', error);
    }
  }

  // ===================================================================
  // 🔧 MÉTODOS AUXILIARES
  // ===================================================================

  private generateUserId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // 📊 Obtener estadísticas de usuarios (para desarrollo)
  async getUserStats(): Promise<{ totalUsers: number; users: User[] }> {
    const users = await this.getAllUsers();
    return {
      totalUsers: users.length,
      users: users.map(u => ({
        ...u,
        password: '***' // Ocultar contraseñas en stats
      }))
    };
  }
}

// ===================================================================
// 📤 EXPORTAR INSTANCIA SINGLETON
// ===================================================================

export const userStorageService = new UserStorageService();
export default userStorageService;