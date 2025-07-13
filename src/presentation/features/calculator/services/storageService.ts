// ===================================================================
// 🎯 SERVICIO DE ALMACENAMIENTO - Persistencia de datos del formulario
// ===================================================================

import { FormState } from '../types/calculator.types';

/**
 * Servicio para persistir y recuperar datos del formulario
 */
export class StorageService {
  private static readonly STORAGE_KEY = 'fertility_calculator_form';
  private static readonly BACKUP_KEY = 'fertility_calculator_backup';
  private static readonly VERSION_KEY = 'fertility_calculator_version';
  private static readonly CURRENT_VERSION = '1.0.0';

  /**
   * Guarda el estado del formulario en localStorage
   */
  static saveFormData(formData: FormState): boolean {
    try {
      const dataToSave = {
        version: this.CURRENT_VERSION,
        timestamp: Date.now(),
        data: formData
      };

      // Guardar datos principales
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(dataToSave));
      
      // Crear backup
      const existingData = localStorage.getItem(this.STORAGE_KEY);
      if (existingData) {
        localStorage.setItem(this.BACKUP_KEY, existingData);
      }

      console.log('💾 Datos del formulario guardados correctamente');
      return true;
    } catch (error) {
      console.error('❌ Error guardando datos del formulario:', error);
      return false;
    }
  }

  /**
   * Recupera el estado del formulario desde localStorage
   */
  static loadFormData(): FormState | null {
    try {
      const savedData = localStorage.getItem(this.STORAGE_KEY);
      if (!savedData) {
        console.log('📭 No hay datos guardados del formulario');
        return null;
      }

      const parsed = JSON.parse(savedData);
      
      // Validar versión
      if (parsed.version !== this.CURRENT_VERSION) {
        console.warn('⚠️ Versión de datos incompatible, usando backup o valores por defecto');
        return this.loadBackupData();
      }

      // Validar estructura de datos
      if (!parsed.data || typeof parsed.data !== 'object') {
        console.warn('⚠️ Estructura de datos inválida');
        return null;
      }

      console.log('✅ Datos del formulario cargados correctamente');
      return parsed.data;
    } catch (error) {
      console.error('❌ Error cargando datos del formulario:', error);
      return this.loadBackupData();
    }
  }

  /**
   * Carga datos desde backup
   */
  private static loadBackupData(): FormState | null {
    try {
      const backupData = localStorage.getItem(this.BACKUP_KEY);
      if (!backupData) return null;

      const parsed = JSON.parse(backupData);
      if (parsed.data && typeof parsed.data === 'object') {
        console.log('🔄 Datos recuperados desde backup');
        return parsed.data;
      }
    } catch (error) {
      console.error('❌ Error cargando backup:', error);
    }
    return null;
  }

  /**
   * Limpia los datos guardados
   */
  static clearFormData(): boolean {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      localStorage.removeItem(this.BACKUP_KEY);
      localStorage.removeItem(this.VERSION_KEY);
      console.log('🧹 Datos del formulario limpiados');
      return true;
    } catch (error) {
      console.error('❌ Error limpiando datos:', error);
      return false;
    }
  }

  /**
   * Verifica si hay datos guardados
   */
  static hasStoredData(): boolean {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data !== null && data !== '';
    } catch {
      return false;
    }
  }

  /**
   * Obtiene información sobre los datos guardados
   */
  static getStorageInfo(): {
    hasData: boolean;
    timestamp?: number;
    version?: string;
    size?: number;
  } {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (!data) {
        return { hasData: false };
      }

      const parsed = JSON.parse(data);
      return {
        hasData: true,
        timestamp: parsed.timestamp,
        version: parsed.version,
        size: data.length
      };
    } catch {
      return { hasData: false };
    }
  }

  /**
   * Guarda progreso parcial (auto-save)
   */
  static autoSave(formData: FormState): void {
    // Debounce para evitar demasiadas escrituras
    if (this.autoSaveTimeout) {
      clearTimeout(this.autoSaveTimeout);
    }

    this.autoSaveTimeout = setTimeout(() => {
      this.saveFormData(formData);
    }, 2000); // Auto-save después de 2 segundos de inactividad
  }

  private static autoSaveTimeout: ReturnType<typeof setTimeout> | null = null;

  /**
   * Exporta datos del formulario como JSON
   */
  static exportFormData(formData: FormState): string {
    const exportData = {
      version: this.CURRENT_VERSION,
      exportDate: new Date().toISOString(),
      formData: formData
    };
    return JSON.stringify(exportData, null, 2);
  }

  /**
   * Importa datos del formulario desde JSON
   */
  static importFormData(jsonData: string): FormState | null {
    try {
      const parsed = JSON.parse(jsonData);
      
      if (!parsed.formData || typeof parsed.formData !== 'object') {
        throw new Error('Formato de datos inválido');
      }

      console.log('📥 Datos importados correctamente');
      return parsed.formData;
    } catch (error) {
      console.error('❌ Error importando datos:', error);
      return null;
    }
  }

  /**
   * Obtiene estadísticas de uso del almacenamiento
   */
  static getStorageStats(): {
    totalSize: number;
    availableSpace: number;
    itemCount: number;
  } {
    try {
      let totalSize = 0;
      let itemCount = 0;
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('fertility_calculator')) {
          const value = localStorage.getItem(key);
          if (value) {
            totalSize += value.length;
            itemCount++;
          }
        }
      }

      // Estimar espacio disponible (la mayoría de navegadores tienen ~5-10MB)
      const estimatedAvailable = 5 * 1024 * 1024 - totalSize; // 5MB estimado

      return {
        totalSize,
        availableSpace: Math.max(0, estimatedAvailable),
        itemCount
      };
    } catch {
      return {
        totalSize: 0,
        availableSpace: 0,
        itemCount: 0
      };
    }
  }
}
