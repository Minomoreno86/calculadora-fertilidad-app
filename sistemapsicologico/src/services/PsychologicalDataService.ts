import type { 
  PsychologicalProfile, 
  PSS10Assessment, 
  FertiQoLAssessment, 
  PHQ9FAssessment
} from '../types/psychological';

/**
 * 🔄 SERVICIO DE DATOS PSICOLÓGICOS
 * Maneja persistencia y sincronización de datos psicológicos
 */
export class PsychologicalDataService {
  private static readonly STORAGE_PREFIX = 'fertility_psych_';
  private static readonly API_ENDPOINT = '/api/psychological';

  /**
   * Guarda perfil psicológico completo
   */
  static async saveProfile(profile: PsychologicalProfile): Promise<void> {
    try {
      // Guardar localmente
      const key = `${this.STORAGE_PREFIX}profile_${profile.patientId}`;
      localStorage.setItem(key, JSON.stringify({
        ...profile,
        lastUpdate: new Date().toISOString()
      }));

      // Sincronizar con servidor (si está disponible)
      if (navigator.onLine) {
        await this.syncToServer(profile);
      }
    } catch (error) {
      console.error('Error saving psychological profile:', error);
      throw new Error('No se pudo guardar el perfil psicológico');
    }
  }

  /**
   * Carga perfil psicológico
   */
  static async loadProfile(patientId: string): Promise<PsychologicalProfile | null> {
    try {
      // Intentar cargar del servidor primero
      if (navigator.onLine) {
        const serverProfile = await this.loadFromServer(patientId);
        if (serverProfile) return serverProfile;
      }

      // Cargar localmente como fallback
      const key = `${this.STORAGE_PREFIX}profile_${patientId}`;
      const stored = localStorage.getItem(key);
      
      if (stored) {
        const profile = JSON.parse(stored);
        return {
          ...profile,
          lastUpdate: new Date(profile.lastUpdate)
        };
      }

      return null;
    } catch (error) {
      console.error('Error loading psychological profile:', error);
      return null;
    }
  }

  /**
   * Guarda evaluación PSS-10
   */
  static async savePSS10Assessment(assessment: PSS10Assessment): Promise<void> {
    try {
      const key = `${this.STORAGE_PREFIX}pss10_${assessment.patientId}_${assessment.id}`;
      localStorage.setItem(key, JSON.stringify({
        ...assessment,
        timestamp: assessment.timestamp.toISOString()
      }));

      if (navigator.onLine) {
        await this.syncAssessmentToServer('pss10', assessment);
      }
    } catch (error) {
      console.error('Error saving PSS-10 assessment:', error);
      throw error;
    }
  }

  /**
   * Carga histórico de evaluaciones PSS-10
   */
  static async loadPSS10History(patientId: string): Promise<PSS10Assessment[]> {
    try {
      const pattern = `${this.STORAGE_PREFIX}pss10_${patientId}_`;
      const assessments: PSS10Assessment[] = [];

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(pattern)) {
          const stored = localStorage.getItem(key);
          if (stored) {
            const assessment = JSON.parse(stored);
            assessments.push({
              ...assessment,
              timestamp: new Date(assessment.timestamp)
            });
          }
        }
      }

      return assessments.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    } catch (error) {
      console.error('Error loading PSS-10 history:', error);
      return [];
    }
  }

  /**
   * Guarda evaluación FertiQoL
   */
  static async saveFertiQoLAssessment(assessment: FertiQoLAssessment): Promise<void> {
    try {
      const key = `${this.STORAGE_PREFIX}fertiqol_${assessment.patientId}_${assessment.id}`;
      localStorage.setItem(key, JSON.stringify({
        ...assessment,
        timestamp: assessment.timestamp.toISOString()
      }));

      if (navigator.onLine) {
        await this.syncAssessmentToServer('fertiqol', assessment);
      }
    } catch (error) {
      console.error('Error saving FertiQoL assessment:', error);
      throw error;
    }
  }

  /**
   * Guarda evaluación PHQ-9F
   */
  static async savePHQ9FAssessment(assessment: PHQ9FAssessment): Promise<void> {
    try {
      const key = `${this.STORAGE_PREFIX}phq9f_${assessment.patientId}_${assessment.id}`;
      localStorage.setItem(key, JSON.stringify({
        ...assessment,
        timestamp: assessment.timestamp.toISOString()
      }));

      if (navigator.onLine) {
        await this.syncAssessmentToServer('phq9f', assessment);
      }
    } catch (error) {
      console.error('Error saving PHQ-9F assessment:', error);
      throw error;
    }
  }

  /**
   * Registra progreso de intervención
   */
  static async recordInterventionProgress(
    patientId: string,
    interventionType: string,
    progress: {
      completed: boolean;
      duration?: number;
      notes?: string;
      effectiveness?: number;
    }
  ): Promise<void> {
    try {
      const key = `${this.STORAGE_PREFIX}intervention_${patientId}`;
      const existing = localStorage.getItem(key);
      const interventions = existing ? JSON.parse(existing) : {};

      interventions[interventionType] = {
        ...progress,
        timestamp: new Date().toISOString(),
        lastUpdate: new Date().toISOString()
      };

      localStorage.setItem(key, JSON.stringify(interventions));

      if (navigator.onLine) {
        await this.syncInterventionProgress(patientId, interventionType, progress);
      }
    } catch (error) {
      console.error('Error recording intervention progress:', error);
      throw error;
    }
  }

  /**
   * Carga progreso de intervenciones
   */
  static async loadInterventionProgress(patientId: string): Promise<Record<string, unknown>> {
    try {
      const key = `${this.STORAGE_PREFIX}intervention_${patientId}`;
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Error loading intervention progress:', error);
      return {};
    }
  }

  /**
   * Exporta datos para backup
   */
  static async exportData(patientId: string): Promise<string> {
    try {
      const data = {
        profile: await this.loadProfile(patientId),
        pss10History: await this.loadPSS10History(patientId),
        interventionProgress: await this.loadInterventionProgress(patientId),
        exportDate: new Date().toISOString(),
        version: '1.0.0'
      };

      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error('Error exporting psychological data:', error);
      throw error;
    }
  }

  /**
   * Importa datos desde backup
   */
  static async importData(jsonData: string): Promise<void> {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.profile) {
        await this.saveProfile(data.profile);
      }

      if (data.pss10History) {
        for (const assessment of data.pss10History) {
          await this.savePSS10Assessment(assessment);
        }
      }

      // TODO: Importar otros tipos de datos
    } catch (error) {
      console.error('Error importing psychological data:', error);
      throw error;
    }
  }

  /**
   * Limpia datos antiguos (más de 1 año)
   */
  static async cleanupOldData(): Promise<void> {
    try {
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

      const keysToRemove: string[] = [];

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(this.STORAGE_PREFIX)) {
          const stored = localStorage.getItem(key);
          if (stored) {
            const data = JSON.parse(stored);
            const timestamp = new Date(data.timestamp || data.lastUpdate);
            
            if (timestamp < oneYearAgo) {
              keysToRemove.push(key);
            }
          }
        }
      }

      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      console.log(`Cleaned up ${keysToRemove.length} old psychological data entries`);
    } catch (error) {
      console.error('Error cleaning up old data:', error);
    }
  }

  // MÉTODOS PRIVADOS PARA SINCRONIZACIÓN CON SERVIDOR

  private static async syncToServer(profile: PsychologicalProfile): Promise<void> {
    try {
      const response = await fetch(`${this.API_ENDPOINT}/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify(profile)
      });

      if (!response.ok) {
        throw new Error(`Server sync failed: ${response.statusText}`);
      }
    } catch (error) {
      // No lanzar error - permitir funcionamiento offline
      console.warn('Could not sync to server:', error);
    }
  }

  private static async loadFromServer(patientId: string): Promise<PsychologicalProfile | null> {
    try {
      const response = await fetch(`${this.API_ENDPOINT}/profile/${patientId}`, {
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      });

      if (response.ok) {
        return await response.json();
      }
      
      return null;
    } catch (error) {
      console.warn('Could not load from server:', error);
      return null;
    }
  }

  private static async syncAssessmentToServer(type: string, assessment: PSS10Assessment | FertiQoLAssessment | PHQ9FAssessment): Promise<void> {
    try {
      await fetch(`${this.API_ENDPOINT}/assessment/${type}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify(assessment)
      });
    } catch (error) {
      console.warn('Could not sync assessment to server:', error);
    }
  }

  private static async syncInterventionProgress(
    patientId: string, 
    interventionType: string, 
    progress: Record<string, unknown>
  ): Promise<void> {
    try {
      await fetch(`${this.API_ENDPOINT}/intervention-progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify({
          patientId,
          interventionType,
          progress
        })
      });
    } catch (error) {
      console.warn('Could not sync intervention progress to server:', error);
    }
  }

  private static getAuthToken(): string {
    // TODO: Implementar sistema de autenticación real
    return 'demo-token';
  }
}
