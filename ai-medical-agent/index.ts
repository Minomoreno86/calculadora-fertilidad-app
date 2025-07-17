/**
 * 🤖 AGENTE IA MÉDICO PRINCIPAL - DR. IA FERTILITAS
 * Punto de entrada principal para el sistema de IA médica
 */

import { ClinicalReasoningEngine, UserInput } from './core/reasoning-engine/clinicalReasoningEngine';
import { ConversationEngine, ConversationContext } from './core/conversation-engine/conversationEngine';
import { PATHOLOGIES_DATABASE } from './core/knowledge-base/pathologies';
import { TREATMENTS_DATABASE } from './core/knowledge-base/treatments';

// Re-exportar componentes principales
export { ChatInterface } from './presentation/components/ChatInterface';
export { ClinicalReasoningEngine } from './core/reasoning-engine/clinicalReasoningEngine';
export { ConversationEngine } from './core/conversation-engine/conversationEngine';

// Re-exportar tipos principales
export type { 
  UserInput,
  DiagnosticAnalysis,
  TreatmentPlan,
  SuccessPrediction 
} from './core/reasoning-engine/clinicalReasoningEngine';

export type {
  ConversationContext,
  ConversationMessage,
  AIPersonality
} from './core/conversation-engine/conversationEngine';

/**
 * 🧠 CLASE PRINCIPAL DEL AGENTE IA MÉDICO
 */
export class MedicalAIAgent {
  private reasoningEngine: typeof ClinicalReasoningEngine;
  private conversationEngine: ConversationEngine | null = null;

  constructor() {
    this.reasoningEngine = ClinicalReasoningEngine;
  }

  /**
   * Analiza un caso clínico completo
   */
  analyzeCase(userInput: UserInput) {
    console.log('🤖 Dr. IA Fertilitas iniciando análisis clínico...');
    return this.reasoningEngine.analyzeCase(userInput);
  }

  /**
   * Inicia una conversación médica
   */
  startConversation(userInput: UserInput, personality: string = 'familyDoctor'): ConversationEngine {
    console.log(`🤖 Dr. IA Fertilitas iniciando conversación con personalidad: ${personality}`);
    
    const context: ConversationContext = {
      userInput,
      conversationHistory: [],
      currentPersonality: personality,
      sessionId: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString()
    };

    this.conversationEngine = new ConversationEngine(context);
    console.log(`📝 Sesión iniciada: ${context.sessionId}`);
    
    return this.conversationEngine;
  }

  /**
   * Procesa una consulta médica
   */
  processQuery(query: string, messageType: 'analysis' | 'recommendation' | 'education' | 'followup' = 'analysis') {
    if (!this.conversationEngine) {
      throw new Error('Conversación no iniciada. Llama startConversation() primero.');
    }

    console.log(`🔍 Procesando consulta: "${query.substring(0, 50)}..." (Tipo: ${messageType})`);
    return this.conversationEngine.generateResponse(query, messageType);
  }

  /**
   * Obtiene información de una patología específica
   */
  getPathologyInfo(pathologyId: string) {
    const pathology = PATHOLOGIES_DATABASE[pathologyId];
    if (!pathology) {
      console.warn(`⚠️ Patología no encontrada: ${pathologyId}`);
      return null;
    }
    console.log(`📖 Información de patología obtenida: ${pathology.nameES}`);
    return pathology;
  }

  /**
   * Obtiene información de un tratamiento específico
   */
  getTreatmentInfo(treatmentId: string) {
    const treatment = TREATMENTS_DATABASE[treatmentId];
    if (!treatment) {
      console.warn(`⚠️ Tratamiento no encontrado: ${treatmentId}`);
      return null;
    }
    console.log(`💊 Información de tratamiento obtenida: ${treatment.nameES}`);
    return treatment;
  }

  /**
   * Obtiene estadísticas del agente
   */
  getAgentStats() {
    const stats = {
      pathologies: Object.keys(PATHOLOGIES_DATABASE).length,
      treatments: Object.keys(TREATMENTS_DATABASE).length,
      personalities: 3,
      version: '1.0.0',
      lastUpdate: new Date().toISOString(),
      capabilities: [
        'Análisis clínico completo',
        'Predicción de éxito reproductivo',
        'Recomendaciones de tratamiento escalonado',
        'Conversación médica especializada',
        'Base de conocimiento validada científicamente'
      ]
    };
    
    console.log('📊 Estadísticas del agente:', stats);
    return stats;
  }

  /**
   * Realiza un diagnóstico automático rápido
   */
  quickDiagnosis(userInput: UserInput): { 
    primaryConcerns: string[]; 
    suggestedTests: string[]; 
    urgencyLevel: 'low' | 'medium' | 'high';
    nextSteps: string[] 
  } {
    const concerns: string[] = [];
    const tests: string[] = [];
    const nextSteps: string[] = [];
    let urgencyLevel: 'low' | 'medium' | 'high' = 'low';

    // Análisis por edad
    if (userInput.age >= 35) {
      concerns.push('Edad materna avanzada (≥35 años)');
      tests.push('AMH - Evaluación de reserva ovárica');
      urgencyLevel = 'medium';
      if (userInput.age >= 40) {
        urgencyLevel = 'high';
        nextSteps.push('Considerar evaluación inmediata');
      }
    }

    // Análisis por duración de infertilidad
    if (userInput.infertilityDuration >= 12) {
      if (userInput.age < 35) {
        concerns.push('Infertilidad primaria/secundaria (≥12 meses)');
      } else {
        concerns.push('Infertilidad con urgencia por edad (≥6 meses recomendado)');
        urgencyLevel = 'high';
      }
    }

    // Análisis de BMI
    if (userInput.bmi) {
      if (userInput.bmi < 18.5) {
        concerns.push('Bajo peso (BMI < 18.5)');
        nextSteps.push('Evaluación nutricional');
      } else if (userInput.bmi >= 30) {
        concerns.push('Obesidad (BMI ≥ 30)');
        tests.push('Perfil metabólico completo');
        nextSteps.push('Programa de reducción de peso');
      }
    }

    // Análisis de laboratorios
    if (!userInput.labs || Object.values(userInput.labs).every(v => v === undefined)) {
      tests.push('Panel hormonal básico (FSH, LH, E2, TSH)');
    } else {
      if (userInput.labs.amh !== undefined && userInput.labs.amh < 1.0) {
        concerns.push('Reserva ovárica disminuida (AMH < 1.0)');
        urgencyLevel = 'high';
      }
    }

    // Factor masculino
    if (!userInput.maleFactors) {
      tests.push('Espermatobioscopia completa');
      nextSteps.push('Evaluación andrológica');
    }

    // Recomendaciones generales
    if (concerns.length === 0) {
      nextSteps.push('Estudio de fertilidad básico');
    }

    return {
      primaryConcerns: concerns.length > 0 ? concerns : ['Evaluación de fertilidad de rutina'],
      suggestedTests: tests,
      urgencyLevel,
      nextSteps
    };
  }
}

/**
 * 🚀 UTILIDADES DE INTEGRACIÓN
 */

// Interfaz para datos del formulario
interface FormData {
  age?: number;
  partnerAge?: number;
  bmi?: number;
  infertilityDuration?: number;
  menstrualCycleLength?: number;
  previousPregnancies?: number;
  previousLosses?: number;
  symptoms?: string[];
  fsh?: number;
  lh?: number;
  estradiol?: number;
  progesterone?: number;
  prolactin?: number;
  tsh?: number;
  amh?: number;
  testosterone?: number;
  maleFactors?: {
    concentration?: number;
    motility?: number;
    morphology?: number;
    volume?: number;
  };
  priorTreatments?: string[];
  preferences?: {
    maxComplexity?: 'low' | 'medium' | 'high';
    budgetRange?: 'low' | 'medium' | 'high';
    timeframe?: 'urgent' | 'normal' | 'flexible';
  };
}

export class MedicalAIIntegration {
  /**
   * Convierte datos del formulario a UserInput para el agente IA
   */
  static convertFormDataToUserInput(formData: FormData): UserInput {
    return {
      age: formData.age || 30,
      partnerAge: formData.partnerAge,
      bmi: formData.bmi || 25,
      infertilityDuration: formData.infertilityDuration || 12,
      menstrualCycleLength: formData.menstrualCycleLength,
      previousPregnancies: formData.previousPregnancies || 0,
      previousLosses: formData.previousLosses || 0,
      symptoms: formData.symptoms || [],
      labs: {
        fsh: formData.fsh,
        lh: formData.lh,
        estradiol: formData.estradiol,
        progesterone: formData.progesterone,
        prolactin: formData.prolactin,
        tsh: formData.tsh,
        amh: formData.amh,
        testosterone: formData.testosterone
      },
      maleFactors: formData.maleFactors ? {
        concentration: formData.maleFactors.concentration,
        motility: formData.maleFactors.motility,
        morphology: formData.maleFactors.morphology,
        volume: formData.maleFactors.volume
      } : undefined,
      priorTreatments: formData.priorTreatments || [],
      preferences: {
        maxComplexity: formData.preferences?.maxComplexity || 'medium',
        budgetRange: formData.preferences?.budgetRange || 'medium',
        timeframe: formData.preferences?.timeframe || 'normal'
      }
    };
  }

  /**
   * Valida si los datos son suficientes para análisis IA
   */
  static validateForAIAnalysis(userInput: UserInput): { isValid: boolean; missingFields: string[]; completeness: number } {
    const missingFields: string[] = [];
    let fieldsPresent = 0;
    let totalFields = 0;

    // Validaciones críticas
    totalFields += 2;
    if (!userInput.age || userInput.age < 18 || userInput.age > 50) {
      missingFields.push('age');
    } else {
      fieldsPresent++;
    }

    if (!userInput.infertilityDuration || userInput.infertilityDuration < 1) {
      missingFields.push('infertilityDuration');
    } else {
      fieldsPresent++;
    }

    // Validaciones clínicas opcionales
    totalFields += 4;
    const hasLabData = userInput.labs && Object.values(userInput.labs).some(v => v !== undefined && v !== null);
    const hasMaleData = userInput.maleFactors && Object.values(userInput.maleFactors).some(v => v !== undefined && v !== null);
    const hasSymptoms = userInput.symptoms && userInput.symptoms.length > 0;
    const hasBMI = userInput.bmi && userInput.bmi > 0;

    if (hasLabData) fieldsPresent++;
    if (hasMaleData) fieldsPresent++;
    if (hasSymptoms) fieldsPresent++;
    if (hasBMI) fieldsPresent++;

    // Requerir al menos algunos datos clínicos
    if (!hasLabData && !hasMaleData && !hasSymptoms) {
      missingFields.push('clinicalData');
    }

    const completeness = Math.round((fieldsPresent / totalFields) * 100);

    return {
      isValid: missingFields.length === 0 && completeness >= 50,
      missingFields,
      completeness
    };
  }

  /**
   * Genera resumen para mostrar en UI
   */
  static generateCaseSummary(userInput: UserInput): string {
    const age = userInput.age;
    const duration = userInput.infertilityDuration;
    const hasLabs = userInput.labs && Object.values(userInput.labs).some(v => v !== undefined && v !== null);
    const hasMale = userInput.maleFactors && Object.values(userInput.maleFactors).some(v => v !== undefined && v !== null);
    const bmi = userInput.bmi;

    let summary = `👥 Mujer de ${age} años con ${duration} meses de infertilidad`;
    
    if (bmi) {
      const bmiCategory = bmi < 18.5 ? 'bajo peso' : 
                         bmi <= 24.9 ? 'peso normal' : 
                         bmi <= 29.9 ? 'sobrepeso' : 'obesidad';
      summary += `, BMI ${bmi.toFixed(1)} (${bmiCategory})`;
    }
    
    summary += '.';
    
    if (hasLabs) summary += ' 🧪 Estudios hormonales disponibles.';
    if (hasMale) summary += ' 👨 Evaluación factor masculino incluida.';
    if (userInput.symptoms && userInput.symptoms.length > 0) {
      summary += ` 📋 ${userInput.symptoms.length} síntoma(s) reportado(s).`;
    }
    if (userInput.priorTreatments && userInput.priorTreatments.length > 0) {
      summary += ` 💊 ${userInput.priorTreatments.length} tratamiento(s) previo(s).`;
    }

    return summary;
  }

  /**
   * Obtiene lista de patologías disponibles por categoría
   */
  static getAvailablePathologies(category?: 'female' | 'male' | 'couple' | 'unexplained') {
    const pathologies = Object.values(PATHOLOGIES_DATABASE);
    
    if (category) {
      return pathologies
        .filter(p => p.category === category)
        .map(p => ({ id: p.id, name: p.nameES, category: p.category }));
    }
    
    return pathologies.map(p => ({ id: p.id, name: p.nameES, category: p.category }));
  }

  /**
   * Obtiene lista de tratamientos disponibles por nivel
   */
  static getAvailableTreatments(level?: 'level1' | 'level2' | 'level3') {
    const treatments = Object.values(TREATMENTS_DATABASE);
    
    if (level) {
      return treatments
        .filter(t => t.category === level)
        .map(t => ({ id: t.id, name: t.nameES, category: t.category, complexity: t.complexity }));
    }
    
    return treatments.map(t => ({ id: t.id, name: t.nameES, category: t.category, complexity: t.complexity }));
  }
}

// Instancia singleton del agente principal
export const medicalAIAgent = new MedicalAIAgent();

export default MedicalAIAgent;
