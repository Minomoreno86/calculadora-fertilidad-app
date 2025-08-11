/**
 * 🩺 ENHANCED MEDICAL CHAT ENGINE V2.0
 * Motor de chat médico conectado REALMENTE con datos de evaluación
 */

import { EvaluationState, Factors } from '@/core/domain/models';
import { PATHOLOGIES_DATABASE } from '../../../../../ai-medical-agent/core/knowledge-base/pathologies';
import { TREATMENTS_DATABASE } from '../../../../../ai-medical-agent/core/knowledge-base/treatments';
// Importaciones de análisis específicos (sin agregador general)
import { 
  analyzeAMHFactors,
  analyzeTSHFactors,
  analyzeProlactinFactors,
  analyzeHOMAFactors
} from '../analysis/hormonalAnalysis';
import { 
  analyzePCOSFactors,
  analyzeBMIFactors,
  analyzeMaleFactorFactors,
  analyzePelvicSurgeryFactors,
  analyzeOTBFactors
} from '../analysis/functionalAnalysis';
import { 
  AnalyzedIntent,
  UrgencyLevel,
  MessageCategory,
  NeuralEnhancedResponse,
  QuickReply,
  ChatAttachment
} from '../types/ChatTypes';

export class EnhancedMedicalChatEngine {
  private evaluation: EvaluationState | null = null;
  private analysisResults: unknown[] = [];

  constructor(evaluation?: EvaluationState) {
    this.evaluation = evaluation || null;
    this.initializeAnalysis();
  }

  /**
   * 🧬 INICIALIZAR ANÁLISIS MÉDICO REAL
   */
  private async initializeAnalysis(): Promise<void> {
    if (!this.evaluation?.factors) return;

    console.log('🧬 [ENHANCED CHAT] Inicializando análisis médico real con factors:', this.evaluation.factors);

    try {
      // 🧠 USAR FUNCIONES DE ANÁLISIS ESPECÍFICAS DIRECTAMENTE
      const factors = this.evaluation.factors;
      this.analysisResults = [];

      // 🧬 EJECUTAR ANÁLISIS ESPECÍFICOS SEGÚN FACTORES PRESENTES
      if (factors.pcos && factors.pcos < 1.0) {
        this.analysisResults.push(...analyzePCOSFactors(factors));
      }
      if (factors.bmi && factors.bmi < 1.0) {
        this.analysisResults.push(...analyzeBMIFactors(factors));
      }
      if (factors.amh && factors.amh < 1.0) {
        this.analysisResults.push(...analyzeAMHFactors(factors));
      }
      if (factors.tsh && factors.tsh < 1.0) {
        this.analysisResults.push(...analyzeTSHFactors(factors));
      }
      if (factors.prolactin && factors.prolactin < 1.0) {
        this.analysisResults.push(...analyzeProlactinFactors(factors));
      }
      if (factors.homa && factors.homa < 1.0) {
        this.analysisResults.push(...analyzeHOMAFactors(factors));
      }
      if (factors.male && factors.male < 1.0) {
        this.analysisResults.push(...analyzeMaleFactorFactors(factors));
      }
      if (factors.pelvicSurgery && factors.pelvicSurgery < 0.98) {
        this.analysisResults.push(...analyzePelvicSurgeryFactors(factors));
      }
      if (factors.otb && factors.otb < 0.98) {
        this.analysisResults.push(...analyzeOTBFactors(factors));
      }

      console.log('🧠 [ENHANCED CHAT] Análisis médico completado:', this.analysisResults.length, 'resultados');
    } catch (error) {
      console.warn('⚠️ [ENHANCED CHAT] Error en análisis médico:', error);
      this.analysisResults = [];
    }
  }

  /**
   * 🎯 ANÁLISIS DE INTENCIÓN INTELIGENTE
   */
  private analyzeIntent(message: string): AnalyzedIntent {
    const lowerMessage = message.toLowerCase();
    console.log('🔍 [ENHANCED INTENT] Analizando:', lowerMessage);

    // 🚨 URGENCIA MÉDICA
    let urgency: UrgencyLevel = 'low';
    if (lowerMessage.includes('dolor intenso') || lowerMessage.includes('sangrado abundante') || lowerMessage.includes('emergencia')) {
      urgency = 'urgent';
    } else if (lowerMessage.includes('dolor') || lowerMessage.includes('preocup') || lowerMessage.includes('mole')) {
      urgency = 'high';
    } else if (lowerMessage.includes('duda') || lowerMessage.includes('pregunta') || lowerMessage.includes('explica')) {
      urgency = 'medium';
    }

    // 📋 TEMAS ESPECÍFICOS BASADOS EN EVALUACIÓN
    const topics: string[] = [];
    
    // 🧬 ANÁLISIS BASADO EN FACTORES REALES
    if (this.evaluation?.factors) {
      const factors = this.evaluation.factors;
      
      if (lowerMessage.includes('resultado') || lowerMessage.includes('probabilidad') || lowerMessage.includes('%')) {
        topics.push('results');
      }
      
      if ((lowerMessage.includes('pcos') || lowerMessage.includes('ovarios poliquis')) && factors.pcos && factors.pcos < 1.0) {
        topics.push('pcos_specific');
      }
      
      if ((lowerMessage.includes('peso') || lowerMessage.includes('imc') || lowerMessage.includes('obesidad')) && factors.bmi && factors.bmi < 1.0) {
        topics.push('bmi_specific');
      }
      
      if ((lowerMessage.includes('hsg') || lowerMessage.includes('trompas')) && factors.hsg && factors.hsg < 0.95) {
        topics.push('hsg_specific');
      }
      
      if ((lowerMessage.includes('amh') || lowerMessage.includes('reserva')) && factors.amh && factors.amh < 1.0) {
        topics.push('amh_specific');
      }
      
      if ((lowerMessage.includes('tsh') || lowerMessage.includes('tiroides')) && factors.tsh && factors.tsh < 1.0) {
        topics.push('tsh_specific');
      }
      
      if ((lowerMessage.includes('prolactina')) && factors.prolactin && factors.prolactin < 1.0) {
        topics.push('prolactin_specific');
      }
      
      if ((lowerMessage.includes('homa') || lowerMessage.includes('insulina') || lowerMessage.includes('diabetes')) && factors.homa && factors.homa < 1.0) {
        topics.push('homa_specific');
      }
      
      if ((lowerMessage.includes('masculino') || lowerMessage.includes('esperma') || lowerMessage.includes('pareja')) && factors.male && factors.male < 1.0) {
        topics.push('male_specific');
      }
    }

    // 📝 TEMAS GENERALES
    if (lowerMessage.includes('tratamiento') || lowerMessage.includes('opciones') || lowerMessage.includes('que hacer')) {
      topics.push('treatment');
    }
    
    if (lowerMessage.includes('estilo de vida') || lowerMessage.includes('dieta') || lowerMessage.includes('ejercicio')) {
      topics.push('lifestyle');
    }
    
    if (lowerMessage.includes('siguientes pasos') || lowerMessage.includes('que sigue') || lowerMessage.includes('proximo')) {
      topics.push('next_steps');
    }

    // 🏷️ CATEGORÍA
    let category: MessageCategory = 'question';
    if (urgency === 'urgent') category = 'emergency';
    else if (lowerMessage.includes('sintoma') || lowerMessage.includes('dolor')) category = 'symptom';
    else if (lowerMessage.includes('necesito') || lowerMessage.includes('quiero')) category = 'request';

    return {
      urgency,
      topics,
      category,
      confidence: topics.length > 0 ? 0.9 : 0.6
    };
  }

  /**
   * 🧠 GENERAR RESPUESTA MÉDICA ESPECÍFICA
   */
  public async generateResponse(message: string): Promise<NeuralEnhancedResponse> {
    const intent = this.analyzeIntent(message);
    console.log('🧠 [ENHANCED RESPONSE] Intent:', intent);

    try {
      // 🎯 RESPUESTA ESPECÍFICA BASADA EN DATOS REALES
      if (intent.topics.includes('results')) {
        return this.generateResultsResponse(intent);
      }
      
      if (intent.topics.some(topic => topic.includes('_specific'))) {
        return this.generateFactorSpecificResponse(intent);
      }
      
      if (intent.topics.includes('treatment')) {
        return this.generateTreatmentResponse(intent);
      }
      
      if (intent.topics.includes('lifestyle')) {
        return this.generateLifestyleResponse(intent);
      }
      
      if (intent.topics.includes('next_steps')) {
        return this.generateNextStepsResponse(intent);
      }

      // 🎭 RESPUESTA GENERAL INTELIGENTE
      return this.generateGeneralResponse(intent);
      
    } catch (error) {
      console.error('❌ [ENHANCED RESPONSE] Error:', error);
      return this.generateFallbackResponse();
    }
  }

  /**
   * 📊 RESPUESTA SOBRE RESULTADOS
   */
  private generateResultsResponse(intent: AnalyzedIntent): NeuralEnhancedResponse {
    if (!this.evaluation) {
      return this.generateFallbackResponse();
    }

    const probability = this.evaluation.report?.numericPrognosis || 0;
    const age = this.evaluation.input?.age || 0;

    let response = `📊 **Análisis de tus Resultados de Fertilidad**\n\n`;
    
    response += `🎯 **Tu probabilidad de embarazo actual es del ${probability.toFixed(1)}%**\n\n`;
    
    if (age > 0) {
      response += `📈 **Factores considerados:**\n`;
      response += `• Edad: ${age} años (factor base)\n`;
      
      // 🧬 FACTORES ESPECÍFICOS DETECTADOS
      if (this.evaluation.factors) {
        const factors = this.evaluation.factors;
        
        if (factors.pcos && factors.pcos < 1.0) {
          response += `• Síndrome de Ovarios Poliquísticos: Detectado (factor ${factors.pcos.toFixed(2)})\n`;
        }
        if (factors.bmi && factors.bmi < 1.0) {
          response += `• Índice de Masa Corporal: Requiere atención (factor ${factors.bmi.toFixed(2)})\n`;
        }
        if (factors.hsg && factors.hsg < 0.95) {
          response += `• Histerosalpingografía: Alteraciones estructurales (factor ${factors.hsg.toFixed(2)})\n`;
        }
        if (factors.amh && factors.amh < 1.0) {
          response += `• Reserva Ovárica (AMH): Reducida (factor ${factors.amh.toFixed(2)})\n`;
        }
        if (factors.tsh && factors.tsh < 1.0) {
          response += `• Función Tiroidea: Alterada (factor ${factors.tsh.toFixed(2)})\n`;
        }
      }
    }

    response += `\n💡 **¿Qué significa esto?**\n`;
    if (probability > 0.20) {
      response += `Tienes buenas posibilidades naturales. Te recomiendo optimizar los factores modificables.`;
    } else if (probability > 0.10) {
      response += `Tus posibilidades son moderadas. Es importante abordar los factores identificados.`;
    } else {
      response += `Recomiendo consulta especializada para evaluar opciones de reproducción asistida.`;
    }

    const quickReplies: QuickReply[] = [
      {
        id: 'explain_factors',
        text: '🔍 Explícame los factores específicos',
        action: 'question'
      },
      {
        id: 'treatment_options',
        text: '💊 ¿Qué tratamientos me recomiendas?',
        action: 'request_info'
      },
      {
        id: 'improve_chances',
        text: '📈 ¿Cómo puedo mejorar mis posibilidades?',
        action: 'request_info'
      }
    ];

    return {
      response,
      quickReplies,
      urgencyLevel: probability < 0.05 ? 'high' : 'medium',
      attachments: []
    };
  }

  /**
   * 🧬 RESPUESTA ESPECÍFICA POR FACTOR
   */
  private generateFactorSpecificResponse(intent: AnalyzedIntent): NeuralEnhancedResponse {
    if (!this.evaluation?.factors) {
      return this.generateFallbackResponse();
    }

    const factors = this.evaluation.factors;
    let response = '';
    let quickReplies: QuickReply[] = [];

    // 🧬 PCOS ESPECÍFICO
    if (intent.topics.includes('pcos_specific') && factors.pcos && factors.pcos < 1.0) {
      const pcosAnalysis = analyzePCOSFactors(factors);
      if (pcosAnalysis.length > 0) {
        const analysis = pcosAnalysis[0];
        response = `🫃 **Síndrome de Ovarios Poliquísticos (PCOS)**\n\n`;
        response += `**Análisis:** ${analysis.data.reasoning || 'Análisis en curso'}\n\n`;
        response += `**Recomendaciones:**\n`;
        const treatments = analysis.data.recommendations || [];
        treatments.forEach((treatment, index) => {
          response += `${index + 1}. ${treatment}\n`;
        });
        
        quickReplies = [
          { id: 'pcos_diet', text: '🥗 Dieta para PCOS', action: 'request_info' },
          { id: 'pcos_medication', text: '💊 Medicación para PCOS', action: 'request_info' },
          { id: 'pcos_exercise', text: '🏃‍♀️ Ejercicio para PCOS', action: 'request_info' }
        ];
      }
    }

    // 🧬 BMI ESPECÍFICO
    else if (intent.topics.includes('bmi_specific') && factors.bmi && factors.bmi < 1.0) {
      const bmiAnalysis = analyzeBMIFactors(factors);
      if (bmiAnalysis.length > 0) {
        const analysis = bmiAnalysis[0];
        response = `⚖️ **Índice de Masa Corporal y Fertilidad**\n\n`;
        response += `**Análisis:** ${analysis.data.reasoning || 'Análisis en curso'}\n\n`;
        response += `**Plan de Acción:**\n`;
        const treatments = analysis.data.recommendations || [];
        treatments.forEach((treatment, index) => {
          response += `${index + 1}. ${treatment}\n`;
        });
        
        quickReplies = [
          { id: 'weight_plan', text: '📋 Plan de pérdida de peso', action: 'request_info' },
          { id: 'nutrition_guide', text: '🥙 Guía nutricional', action: 'request_info' },
          { id: 'exercise_plan', text: '💪 Plan de ejercicios', action: 'request_info' }
        ];
      }
    }

    // 🧬 AMH ESPECÍFICO
    else if (intent.topics.includes('amh_specific') && factors.amh && factors.amh < 1.0) {
      const amhAnalysis = analyzeAMHFactors(factors);
      if (amhAnalysis.length > 0) {
        const analysis = amhAnalysis[0];
        response = `🥚 **Reserva Ovárica (AMH)**\n\n`;
        response += `**Análisis:** ${analysis.data.reasoning || 'Análisis en curso'}\n\n`;
        response += `**Opciones de Tratamiento:**\n`;
        const treatments = analysis.data.recommendations || [];
        treatments.forEach((treatment, index) => {
          response += `${index + 1}. ${treatment}\n`;
        });
        
        if (factors.amh < 0.4) {
          response += `\n🎯 **Importante:** Con AMH muy baja, considera seriamente la **ovodonación** como opción principal.`;
        }
        
        quickReplies = [
          { id: 'amh_supplements', text: '💊 Suplementos para AMH', action: 'request_info' },
          { id: 'ivf_options', text: '🧪 Opciones de FIV', action: 'request_info' },
          { id: 'egg_donation', text: '🥚 Ovodonación', action: 'request_info' }
        ];
      }
    }

    // Si no hay respuesta específica, generar respuesta general
    if (!response) {
      return this.generateGeneralResponse(intent);
    }

    return {
      response,
      quickReplies,
      urgencyLevel: intent.urgency,
      attachments: []
    };
  }

  /**
   * 💊 RESPUESTA SOBRE TRATAMIENTOS
   */
  private generateTreatmentResponse(intent: AnalyzedIntent): NeuralEnhancedResponse {
    let response = `💊 **Opciones de Tratamiento Personalizadas**\n\n`;

    if (this.analysisResults.length > 0) {
      response += `**Basado en tu análisis médico:**\n\n`;
      
      this.analysisResults.slice(0, 3).forEach((result, index) => {
        response += `**${index + 1}. ${result.data?.condition || 'Condición'}**\n`;
        const treatments = result.data?.recommendations || [];
        if (treatments.length > 0) {
          response += `Tratamientos recomendados:\n`;
          treatments.slice(0, 2).forEach((treatment: string) => {
            response += `• ${treatment}\n`;
          });
        }
        response += `Prioridad: ${result.data?.priority || 'Media'}\n\n`;
      });
    } else {
      response += `**Opciones generales de tratamiento:**\n\n`;
      response += `🌱 **Naturales:**\n• Optimización nutricional\n• Suplementación específica\n• Manejo del estrés\n\n`;
      response += `🧪 **Médicos:**\n• Inducción de ovulación\n• Inseminación artificial\n• Fertilización in vitro\n\n`;
    }

    const quickReplies: QuickReply[] = [
      { id: 'natural_treatment', text: '🌱 Tratamientos naturales', action: 'request_info' },
      { id: 'medical_treatment', text: '🏥 Tratamientos médicos', action: 'request_info' },
      { id: 'specialist_referral', text: '👨‍⚕️ ¿Qué especialista necesito?', action: 'request_info' }
    ];

    return {
      response,
      quickReplies,
      urgencyLevel: 'medium',
      attachments: []
    };
  }

  /**
   * 🌱 RESPUESTA SOBRE ESTILO DE VIDA
   */
  private generateLifestyleResponse(intent: AnalyzedIntent): NeuralEnhancedResponse {
    let response = `🌱 **Recomendaciones de Estilo de Vida para Fertilidad**\n\n`;
    
    response += `**Nutrición Óptima:**\n`;
    response += `• Dieta mediterránea rica en antioxidantes\n`;
    response += `• Ácido fólico 400-800 mcg diarios\n`;
    response += `• Omega-3 y vitamina D\n`;
    response += `• Limitar cafeína y alcohol\n\n`;
    
    response += `**Actividad Física:**\n`;
    response += `• 150 minutos de ejercicio moderado/semana\n`;
    response += `• Yoga o meditación para manejo del estrés\n`;
    response += `• Evitar ejercicio excesivo\n\n`;
    
    response += `**Hábitos de Vida:**\n`;
    response += `• 7-8 horas de sueño de calidad\n`;
    response += `• Manejo del estrés\n`;
    response += `• Evitar tabaco y drogas\n`;
    response += `• Peso corporal saludable\n`;

    // 🧬 PERSONALIZACIÓN BASADA EN FACTORES
    if (this.evaluation?.factors) {
      const factors = this.evaluation.factors;
      response += `\n**Específicamente para ti:**\n`;
      
      if (factors.bmi && factors.bmi < 0.9) {
        response += `• Control de peso: BMI objetivo 18.5-24.9\n`;
      }
      if (factors.pcos && factors.pcos < 1.0) {
        response += `• Dieta baja en índice glucémico para PCOS\n`;
      }
      if (factors.tsh && factors.tsh < 1.0) {
        response += `• Manejo del estrés para función tiroidea\n`;
      }
    }

    const quickReplies: QuickReply[] = [
      { id: 'diet_plan', text: '🥗 Plan nutricional detallado', action: 'request_info' },
      { id: 'supplement_guide', text: '💊 Guía de suplementos', action: 'request_info' },
      { id: 'exercise_routine', text: '🏃‍♀️ Rutina de ejercicios', action: 'request_info' }
    ];

    return {
      response,
      quickReplies,
      urgencyLevel: 'low',
      attachments: []
    };
  }

  /**
   * 🗓️ RESPUESTA SOBRE PRÓXIMOS PASOS
   */
  private generateNextStepsResponse(intent: AnalyzedIntent): NeuralEnhancedResponse {
    let response = `🗓️ **Próximos Pasos Recomendados**\n\n`;

    const probability = this.evaluation?.report?.numericPrognosis || 0;

    if (probability > 0.20) {
      response += `**Enfoque: Optimización Natural (3-6 meses)**\n\n`;
      response += `1. 📋 Implementar cambios de estilo de vida\n`;
      response += `2. 🧪 Monitoreo de ovulación\n`;
      response += `3. 👨‍⚕️ Consulta ginecológica de seguimiento\n`;
      response += `4. 🔄 Re-evaluación en 3 meses\n`;
    } else if (probability > 0.10) {
      response += `**Enfoque: Consulta Especializada Urgente**\n\n`;
      response += `1. 👨‍⚕️ Cita con especialista en reproducción\n`;
      response += `2. 🧪 Estudios complementarios específicos\n`;
      response += `3. 💊 Evaluación de tratamientos médicos\n`;
      response += `4. 📋 Plan de tratamiento personalizado\n`;
    } else {
      response += `**Enfoque: Reproducción Asistida**\n\n`;
      response += `1. 🏥 Consulta URGENTE con especialista en FIV\n`;
      response += `2. 🧪 Estudios pre-FIV completos\n`;
      response += `3. 💉 Protocolo de estimulación ovárica\n`;
      response += `4. 🥚 Consideración de ovodonación si aplica\n`;
    }

    // 🧬 PASOS ESPECÍFICOS BASADOS EN FACTORES
    if (this.analysisResults.length > 0) {
      response += `\n**Prioridades específicas para ti:**\n`;
      this.analysisResults.slice(0, 2).forEach((result, index) => {
        if (result.data?.priority === 'high') {
          response += `• ${result.data?.condition || 'Factor crítico'}: Atención inmediata\n`;
        }
      });
    }

    const quickReplies: QuickReply[] = [
      { id: 'book_appointment', text: '📅 ¿Cómo programar cita?', action: 'request_info' },
      { id: 'urgent_care', text: '🚨 ¿Es urgente mi caso?', action: 'question' },
      { id: 'cost_info', text: '💰 Información sobre costos', action: 'request_info' }
    ];

    return {
      response,
      quickReplies,
      urgencyLevel: probability < 0.10 ? 'high' : 'medium',
      attachments: []
    };
  }

  /**
   * 🎭 RESPUESTA GENERAL INTELIGENTE
   */
  private generateGeneralResponse(intent: AnalyzedIntent): NeuralEnhancedResponse {
    let response = `🩺 **Dr. IA - Consulta Especializada**\n\n`;
    
    if (this.evaluation) {
      const probability = this.evaluation.report?.numericPrognosis || 0;
      response += `Basado en tu evaluación (${probability.toFixed(1)}% probabilidad), `;
      
      if (probability > 0.15) {
        response += `tienes buenas posibilidades naturales. Te ayudo a optimizar tus factores de fertilidad.`;
      } else {
        response += `recomiendo una evaluación especializada para identificar las mejores opciones de tratamiento.`;
      }
    } else {
      response += `Estoy aquí para ayudarte con todas tus consultas sobre fertilidad y reproducción asistida.`;
    }

    response += `\n\n¿En qué aspecto específico te gustaría que profundicemos?`;

    const quickReplies: QuickReply[] = [
      { id: 'explain_results', text: '📊 Explícame mis resultados', action: 'question' },
      { id: 'treatment_options', text: '💊 Opciones de tratamiento', action: 'request_info' },
      { id: 'lifestyle_tips', text: '🌱 Consejos de estilo de vida', action: 'request_info' },
      { id: 'next_steps', text: '🗓️ Próximos pasos', action: 'request_info' }
    ];

    return {
      response,
      quickReplies,
      urgencyLevel: intent.urgency,
      attachments: []
    };
  }

  /**
   * 🛡️ RESPUESTA DE FALLBACK
   */
  private generateFallbackResponse(): NeuralEnhancedResponse {
    return {
      response: `🩺 Disculpa, estoy procesando tu consulta. ¿Podrías ser más específico sobre qué aspecto de tu fertilidad te gustaría que analicemos?`,
      quickReplies: [
        { id: 'results_help', text: '📊 Ayuda con resultados', action: 'question' },
        { id: 'general_question', text: '❓ Pregunta general', action: 'question' }
      ],
      urgencyLevel: 'low',
      attachments: []
    };
  }
}