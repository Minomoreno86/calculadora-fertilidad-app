/**
 * 🧠 SMART MEDICAL CHAT ENGINE V3.0
 * Motor de chat médico inteligente con memoria conversacional y respuestas variadas
 */

import { EvaluationState, Factors } from '@/core/domain/models';
import { PATHOLOGIES_DATABASE } from '../../../../../ai-medical-agent/core/knowledge-base/pathologies';
import { TREATMENTS_DATABASE } from '../../../../../ai-medical-agent/core/knowledge-base/treatments';
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

// 🧠 INTERFAZ DE MEMORIA CONVERSACIONAL AVANZADA
interface ConversationMemory {
  topics: Set<string>;
  questions: string[];
  preferences: {
    style: 'technical' | 'simple' | 'detailed';
    focus: string[];
  };
  medicalContext: {
    factors: string[];
    treatments: string[];
  };
  personalInfo: {
    age?: number;
    stage?: string;
    concerns?: string[];
  };
}

// 🎯 PLANTILLAS DE RESPUESTAS VARIADAS
interface ResponseTemplates {
  greeting: string[];
  results: string[];
  factors: string[];
  treatments: string[];
  lifestyle: string[];
  uncertainty: string[];
  encouragement: string[];
}

export class SmartMedicalChatEngine {
  private evaluation: EvaluationState | null = null;
  private analysisResults: unknown[] = [];
  private conversationMemory: ConversationMemory;
  private responseTemplates: ResponseTemplates;
  private messageCount: number = 0;

  constructor(evaluation?: EvaluationState) {
    console.log('🚀 [SMART CHAT] Constructor iniciado con evaluation:', evaluation ? 'SÍ' : 'NO');
    
    this.evaluation = evaluation || null;
    
    if (this.evaluation) {
      console.log('📊 [SMART CHAT] Evaluation data COMPLETA:', {
        hasInput: !!this.evaluation.input,
        hasFactors: !!this.evaluation.factors,
        hasReport: !!this.evaluation.report,
        age: this.evaluation.input?.age,
        probability: this.evaluation.report?.numericPrognosis,
        factorsCount: this.evaluation.factors ? Object.keys(this.evaluation.factors).length : 0,
        // 🔍 TODAS LAS VARIABLES DISPONIBLES:
        inputData: this.evaluation.input ? Object.keys(this.evaluation.input) : [],
        factorsData: this.evaluation.factors ? Object.keys(this.evaluation.factors) : [],
        reportData: this.evaluation.report ? Object.keys(this.evaluation.report) : [],
        // 🎯 FACTORES ESPECÍFICOS:
        specificFactors: this.evaluation.factors ? {
          age: this.evaluation.factors.age,
          pcos: this.evaluation.factors.pcos,
          bmi: this.evaluation.factors.bmi,
          amh: this.evaluation.factors.amh,
          tsh: this.evaluation.factors.tsh,
          prolactin: this.evaluation.factors.prolactin,
          homa: this.evaluation.factors.homa,
          male: this.evaluation.factors.male,
          hsg: this.evaluation.factors.hsg,
          otb: this.evaluation.factors.otb,
          pelvicSurgery: this.evaluation.factors.pelvicSurgery,
          endometriosis: this.evaluation.factors.endometriosis,
          myoma: this.evaluation.factors.myoma,
          adenomyosis: this.evaluation.factors.adenomyosis,
          polyp: this.evaluation.factors.polyp,
          cycle: this.evaluation.factors.cycle,
          infertilityDuration: this.evaluation.factors.infertilityDuration
        } : {}
      });
    }
    
    this.conversationMemory = {
      topics: new Set(),
      questions: [],
      preferences: {
        style: 'simple',
        focus: []
      },
      medicalContext: {
        factors: [],
        treatments: []
      },
      personalInfo: {}
    };
    
    this.responseTemplates = this.initializeResponseTemplates();
    this.initializePersonalContext();
    
    // 🧬 INICIALIZAR ANÁLISIS ASYNC DE FORMA SEGURA
    this.initializeAnalysis().catch(error => {
      console.warn('⚠️ [SMART CHAT] Error inicializando análisis:', error);
    });
  }

  /**
   * 🎨 INICIALIZAR PLANTILLAS DE RESPUESTAS VARIADAS
   */
  private initializeResponseTemplates(): ResponseTemplates {
    return {
      greeting: [
        "¡Hola! Soy tu especialista en fertilidad virtual. ¿En qué puedo ayudarte hoy?",
        "¡Bienvenida! Estoy aquí para resolver todas tus dudas sobre fertilidad.",
        "¡Hola! Como tu consultora médica especializada, ¿qué te gustaría conocer?",
        "¡Perfecto que estés aquí! ¿Qué aspecto de tu fertilidad quieres que analicemos?"
      ],
      results: [
        "Vamos a analizar juntas tus resultados paso a paso",
        "Perfecto, revisemos lo que nos dicen tus análisis",
        "Excelente pregunta. Veamos qué significan estos números para ti",
        "Te explico de forma clara qué indican tus resultados"
      ],
      factors: [
        "Este factor es importante porque",
        "Lo que esto significa para tu caso específico es",
        "En tu situación particular, esto indica",
        "Basándome en tu perfil médico, este factor"
      ],
      treatments: [
        "Para tu caso específico, las opciones más prometedoras son",
        "Considerando tu situación, te recomendaría",
        "Las alternativas que mejor se adaptan a tu perfil son",
        "Basándome en tu análisis, las mejores opciones incluyen"
      ],
      lifestyle: [
        "Pequeños cambios pueden hacer una gran diferencia",
        "Tu estilo de vida puede potenciar significativamente tus posibilidades",
        "Hay ajustes específicos que pueden optimizar tu fertilidad",
        "Estrategias personalizadas que se adaptan a tu rutina"
      ],
      uncertainty: [
        "Aunque no tengo información específica sobre esto, puedo orientarte hacia",
        "Esta es una excelente pregunta. Te sugiero que consultemos",
        "Para darte la mejor respuesta sobre esto, necesitaríamos",
        "Es importante que profundicemos en este tema. Te recomiendo"
      ],
      encouragement: [
        "Recuerda que cada caso es único y hay múltiples caminos hacia el éxito",
        "Tu proactividad al buscar información es un paso muy positivo",
        "Estás tomando las decisiones correctas para optimizar tu fertilidad",
        "Cada pregunta que haces te acerca más a tu objetivo"
      ]
    };
  }

  /**
   * 🧬 INICIALIZAR ANÁLISIS MÉDICO CON CONTEXTO PERSONAL
   */
  private async initializeAnalysis(): Promise<void> {
    if (!this.evaluation?.factors) {
      console.log('⚠️ [SMART CHAT] No hay factors disponibles para análisis');
      return;
    }

    const factors = this.evaluation.factors;
    this.analysisResults = [];
    this.conversationMemory.medicalContext.factors = []; // Reset

    console.log('🧬 [SMART CHAT] Inicializando análisis de TODOS los factores disponibles...');

    // 🧬 ANÁLISIS CONTEXTUAL COMPLETO DE TODOS LOS FACTORES
    const factorAnalysis = new Map();
    let analyzedCount = 0;

    // 👤 EDAD (siempre relevante)
    if (factors.age) {
      factorAnalysis.set('age', { value: factors.age, category: this.getAgeCategory(factors.age) });
      this.conversationMemory.medicalContext.factors.push('Edad');
      analyzedCount++;
    }

    // 🫃 PCOS
    if (factors.pcos && factors.pcos < 1.0) {
      try {
        const analysis = analyzePCOSFactors(factors);
        this.analysisResults.push(...analysis);
        factorAnalysis.set('pcos', { severity: this.getPCOSSeverity(factors.pcos), analysis, value: factors.pcos });
        this.conversationMemory.medicalContext.factors.push('PCOS');
        analyzedCount++;
      } catch (error) {
        console.warn('⚠️ [SMART CHAT] Error analizando PCOS:', error);
      }
    }

    // ⚖️ BMI
    if (factors.bmi && factors.bmi < 1.0) {
      try {
        const analysis = analyzeBMIFactors(factors);
        this.analysisResults.push(...analysis);
        factorAnalysis.set('bmi', { category: this.getBMICategory(factors.bmi), analysis, value: factors.bmi });
        this.conversationMemory.medicalContext.factors.push('BMI');
        analyzedCount++;
      } catch (error) {
        console.warn('⚠️ [SMART CHAT] Error analizando BMI:', error);
      }
    }

    // 🧬 AMH (Reserva Ovárica)
    if (factors.amh && factors.amh < 1.0 && factors.amh > 0) {
      try {
        const analysis = analyzeAMHFactors(factors);
        this.analysisResults.push(...analysis);
        factorAnalysis.set('amh', { level: this.getAMHLevel(factors.amh), analysis, value: factors.amh });
        this.conversationMemory.medicalContext.factors.push('Reserva Ovárica');
        analyzedCount++;
      } catch (error) {
        console.warn('⚠️ [SMART CHAT] Error analizando AMH:', error);
      }
    }

    // 🦋 TSH (Tiroides)
    if (factors.tsh && factors.tsh < 1.0 && factors.tsh > 0) {
      try {
        const analysis = analyzeTSHFactors(factors);
        this.analysisResults.push(...analysis);
        factorAnalysis.set('tsh', { status: this.getTSHStatus(factors.tsh), analysis, value: factors.tsh });
        this.conversationMemory.medicalContext.factors.push('Función Tiroidea');
        analyzedCount++;
      } catch (error) {
        console.warn('⚠️ [SMART CHAT] Error analizando TSH:', error);
      }
    }

    // 🥛 PROLACTINA
    if (factors.prolactin && factors.prolactin < 1.0 && factors.prolactin > 0) {
      try {
        const analysis = analyzeProlactinFactors(factors);
        this.analysisResults.push(...analysis);
        factorAnalysis.set('prolactin', { level: this.getProlactinLevel(factors.prolactin), analysis, value: factors.prolactin });
        this.conversationMemory.medicalContext.factors.push('Prolactina');
        analyzedCount++;
      } catch (error) {
        console.warn('⚠️ [SMART CHAT] Error analizando Prolactina:', error);
      }
    }

    // 🍯 HOMA-IR (Resistencia Insulina)
    if (factors.homa && factors.homa < 1.0 && factors.homa > 0) {
      try {
        const analysis = analyzeHOMAFactors(factors);
        this.analysisResults.push(...analysis);
        factorAnalysis.set('homa', { severity: this.getHOMASeverity(factors.homa), analysis, value: factors.homa });
        this.conversationMemory.medicalContext.factors.push('HOMA-IR');
        analyzedCount++;
      } catch (error) {
        console.warn('⚠️ [SMART CHAT] Error analizando HOMA-IR:', error);
      }
    }

    // 👨 FACTOR MASCULINO
    if (factors.male && factors.male < 1.0 && factors.male > 0) {
      try {
        const analysis = analyzeMaleFactorFactors(factors);
        this.analysisResults.push(...analysis);
        factorAnalysis.set('male', { grade: this.getMaleFactorGrade(factors.male), analysis, value: factors.male });
        this.conversationMemory.medicalContext.factors.push('Factor Masculino');
        analyzedCount++;
      } catch (error) {
        console.warn('⚠️ [SMART CHAT] Error analizando Factor Masculino:', error);
      }
    }

    // 🩻 HSG
    if (factors.hsg && factors.hsg < 0.95) {
      factorAnalysis.set('hsg', { category: this.getHSGCategory(factors.hsg), value: factors.hsg });
      this.conversationMemory.medicalContext.factors.push('Histerosalpingografía');
      analyzedCount++;
    }

    // ✂️ OTB
    if (factors.otb && factors.otb < 0.95) {
      factorAnalysis.set('otb', { method: this.getOTBMethod(factors.otb), value: factors.otb });
      this.conversationMemory.medicalContext.factors.push('OTB');
      analyzedCount++;
    }

    // 🔪 CIRUGÍAS PÉLVICAS
    if (factors.pelvicSurgery && factors.pelvicSurgery < 0.95) {
      factorAnalysis.set('pelvicSurgery', { impact: this.getPelvicSurgeryImpact(factors.pelvicSurgery), value: factors.pelvicSurgery });
      this.conversationMemory.medicalContext.factors.push('Cirugías Pélvicas');
      analyzedCount++;
    }

    // 📅 OTROS FACTORES ESTRUCTURALES
    if (factors.endometriosis && factors.endometriosis > 0) {
      factorAnalysis.set('endometriosis', { grade: factors.endometriosis });
      this.conversationMemory.medicalContext.factors.push('Endometriosis');
      analyzedCount++;
    }

    if (factors.myoma && factors.myoma > 0) {
      factorAnalysis.set('myoma', { type: factors.myoma });
      this.conversationMemory.medicalContext.factors.push('Miomatosis');
      analyzedCount++;
    }

    if (factors.adenomyosis && factors.adenomyosis > 0) {
      factorAnalysis.set('adenomyosis', { grade: factors.adenomyosis });
      this.conversationMemory.medicalContext.factors.push('Adenomiosis');
      analyzedCount++;
    }

    if (factors.polyp && factors.polyp > 0) {
      factorAnalysis.set('polyp', { type: factors.polyp });
      this.conversationMemory.medicalContext.factors.push('Pólipos');
      analyzedCount++;
    }

    // 🩸 CICLO MENSTRUAL
    if (factors.cycle && factors.cycle < 1.0) {
      factorAnalysis.set('cycle', { regularity: this.getCycleRegularity(factors.cycle), value: factors.cycle });
      this.conversationMemory.medicalContext.factors.push('Ciclo Irregular');
      analyzedCount++;
    }

    // ⏱️ DURACIÓN INFERTILIDAD
    if (factors.infertilityDuration && factors.infertilityDuration < 1.0) {
      factorAnalysis.set('infertilityDuration', { duration: this.getInfertilityDuration(factors.infertilityDuration), value: factors.infertilityDuration });
      this.conversationMemory.medicalContext.factors.push('Duración Infertilidad');
      analyzedCount++;
    }

    console.log('✅ [SMART CHAT] Análisis contextual completado:', {
      totalFactorsAnalyzed: analyzedCount,
      analysisResults: this.analysisResults.length,
      medicalContextFactors: this.conversationMemory.medicalContext.factors.length,
      factorCategories: Array.from(factorAnalysis.keys())
    });
  }

  /**
   * 👤 INICIALIZAR CONTEXTO PERSONAL
   */
  private initializePersonalContext(): void {
    console.log('🧠 [SMART CHAT] Inicializando contexto personal...');
    
    if (!this.evaluation) {
      console.log('❌ [SMART CHAT] No hay evaluation disponible');
      return;
    }

    const age = this.evaluation.input?.age;
    const stage = this.getLifeStage(age || 0);
    
    console.log('👤 [SMART CHAT] Datos personales:', { age, stage });

    this.conversationMemory.personalInfo = {
      age,
      stage,
      concerns: this.identifyMainConcerns()
    };
    
    console.log('✅ [SMART CHAT] Contexto personal inicializado:', this.conversationMemory.personalInfo);
  }

  /**
   * 🎯 IDENTIFICAR PREOCUPACIONES PRINCIPALES
   */
  private identifyMainConcerns(): string[] {
    const concerns: string[] = [];
    const probability = this.evaluation?.report?.numericPrognosis || 0;

    if (probability < 0.10) {
      concerns.push('Probabilidad baja requiere atención especializada');
    }
    if (this.conversationMemory.medicalContext.factors.includes('PCOS')) {
      concerns.push('Manejo del PCOS');
    }
    if (this.conversationMemory.medicalContext.factors.includes('Reserva Ovárica')) {
      concerns.push('Reserva ovárica reducida');
    }
    if (this.conversationMemory.personalInfo.age && this.conversationMemory.personalInfo.age > 35) {
      concerns.push('Factor edad');
    }

    return concerns;
  }

  /**
   * 🧠 ANÁLISIS DE INTENCIÓN AVANZADO CON MEMORIA
   */
  private analyzeIntent(message: string): AnalyzedIntent {
    const lowerMessage = message.toLowerCase();
    this.messageCount++;
    
    // 📝 GUARDAR EN MEMORIA
    this.conversationMemory.questions.push(lowerMessage);
    
    // 🔍 DETECTAR PATRONES CONVERSACIONALES
    const isFollowUp = this.messageCount > 1;
    const isRepeatedTopic = this.conversationMemory.topics.has(this.extractMainTopic(lowerMessage));
    
    // 🎯 ANÁLISIS CONTEXTUAL DE INTENCIÓN
    let urgency: UrgencyLevel = 'low';
    const topics: string[] = [];
    
    // 🚨 URGENCIA BASADA EN CONTEXTO
    if (lowerMessage.includes('urgente') || lowerMessage.includes('preocupa mucho')) {
      urgency = 'urgent';
    } else if (lowerMessage.includes('dudas') || lowerMessage.includes('no entiendo')) {
      urgency = 'medium';
    }

    // 📊 TEMAS CONTEXTUALES INTELIGENTES
    if (lowerMessage.includes('resultado') || lowerMessage.includes('significa') || lowerMessage.includes('%')) {
      topics.push('results_interpretation');
      this.conversationMemory.topics.add('resultados');
    }
    
    if (lowerMessage.includes('mejorar') || lowerMessage.includes('aumentar') || lowerMessage.includes('optimizar')) {
      topics.push('improvement_strategies');
      this.conversationMemory.topics.add('mejoras');
    }
    
    if (lowerMessage.includes('tratamiento') || lowerMessage.includes('opciones') || lowerMessage.includes('que hacer')) {
      topics.push('treatment_planning');
      this.conversationMemory.topics.add('tratamientos');
    }

    // 🧬 TEMAS ESPECÍFICOS BASADOS EN FACTORES PRESENTES
    this.conversationMemory.medicalContext.factors.forEach(factor => {
      if (lowerMessage.includes(factor.toLowerCase()) || 
          lowerMessage.includes(this.getFactorKeywords(factor))) {
        topics.push(`${factor.toLowerCase()}_specific`);
      }
    });

    return {
      urgency,
      topics,
      category: this.determineCategory(lowerMessage, isFollowUp),
      confidence: topics.length > 0 ? 0.9 : 0.6,
      medicalContext: {
        primaryHypothesis: isRepeatedTopic ? 'follow_up_topic' : undefined,
        clinicalConfidence: topics.length > 0 ? 0.9 : 0.6,
        reasoningAvailable: this.messageCount > 1
      }
    };
  }

  /**
   * 🎨 GENERAR RESPUESTA INTELIGENTE PRINCIPAL
   */
  public async generateResponse(message: string): Promise<NeuralEnhancedResponse> {
    this.messageCount++;
    console.log(`💬 [SMART CHAT] Mensaje #${this.messageCount}: "${message}"`);
    console.log('🔍 [SMART CHAT] Estado evaluation:', {
      hasEvaluation: !!this.evaluation,
      age: this.evaluation?.input?.age,
      probability: this.evaluation?.report?.numericPrognosis,
      factorsCount: this.evaluation?.factors ? Object.keys(this.evaluation.factors).length : 0
    });
    
    const intent = this.analyzeIntent(message);
    console.log('🧩 [SMART CHAT] Intent:', intent.category, intent.topics);
    
    // 🎯 PRIMERA INTERACCIÓN - SALUDO PERSONALIZADO
    if (this.messageCount === 1 && (message.toLowerCase().includes('hola') || message.toLowerCase().includes('hi') || message === '¡Hola!')) {
      console.log('👋 [SMART CHAT] Activando saludo personalizado...');
      return this.generatePersonalizedGreeting();
    }
    
    try {
      // 🎯 ESTRATEGIA DE RESPUESTA BASADA EN CONTEXTO
      if (intent.topics.includes('results_interpretation')) {
        return this.generateResultsInterpretation(intent);
      }
      
      if (intent.topics.includes('improvement_strategies')) {
        return this.generateImprovementStrategies(intent);
      }
      
      if (intent.topics.includes('treatment_planning')) {
        return this.generateTreatmentPlanning(intent);
      }
      
      // 🧬 RESPUESTAS ESPECÍFICAS POR FACTOR
      const specificTopic = intent.topics.find(topic => topic.includes('_specific'));
      if (specificTopic) {
        return this.generateFactorSpecificResponse(specificTopic, intent);
      }
      
      // 🎭 RESPUESTA CONVERSACIONAL ADAPTATIVA
      return this.generateConversationalResponse(intent, message);
      
    } catch (error) {
      console.error('❌ [SMART CHAT] Error:', error);
      return this.generateIntelligentFallback(message);
    }
  }

  /**
   * 📊 GENERAR INTERPRETACIÓN DE RESULTADOS INTELIGENTE
   */
  private generateResultsInterpretation(intent: AnalyzedIntent): NeuralEnhancedResponse {
    const probability = this.evaluation?.report?.numericPrognosis || 0;
    const age = this.evaluation?.input?.age || 0;
    
    // 🎨 SELECCIONAR PLANTILLA VARIADA
    const template = this.getRandomTemplate('results');
    
    let response = `${template}\n\n`;
    response += `🎯 **Tu probabilidad actual: ${probability.toFixed(1)}%**\n\n`;
    
    // 🧠 INTERPRETACIÓN CONTEXTUAL INTELIGENTE
    if (probability > 0.25) {
      response += `✨ **Excelentes noticias**: Tienes probabilidades muy favorables. `;
      response += `A los ${age} años, con estos resultados, estás en una posición prometedora.\n\n`;
      response += `💡 **Mi recomendación**: Enfócate en optimizar los factores modificables mientras mantienes este buen pronóstico.`;
    } else if (probability > 0.15) {
      response += `🌟 **Perspectiva alentadora**: Tus posibilidades son sólidas, especialmente con las estrategias correctas. `;
      response += `Tu edad de ${age} años te permite tiempo para optimización.\n\n`;
      response += `🎯 **Plan sugerido**: Combinar mejoras de estilo de vida con seguimiento médico especializado.`;
    } else if (probability > 0.08) {
      response += `💪 **Desafío manejable**: Aunque requiere atención, hay múltiples caminos para mejorar. `;
      response += `Tu caso tiene factores específicos que podemos abordar estratégicamente.\n\n`;
      response += `🏥 **Recomendación prioritaria**: Consulta especializada para evaluar opciones de reproducción asistida.`;
    } else {
      response += `🎯 **Situación que requiere acción especializada**: Tu caso se beneficiaría significativamente de técnicas avanzadas. `;
      response += `Esto no significa imposibilidad, sino que necesitamos un enfoque más directo.\n\n`;
      response += `🚀 **Plan recomendado**: Evaluación inmediata para FIV u otras técnicas de reproducción asistida.`;
    }

    // 🧬 FACTORES ESPECÍFICOS CONTEXTUALES
    if (this.conversationMemory.medicalContext.factors.length > 0) {
      response += `\n\n📋 **Factores específicos en tu caso:**\n`;
      this.conversationMemory.medicalContext.factors.forEach((factor, index) => {
        response += `${index + 1}. ${factor}: ${this.getFactorExplanation(factor)}\n`;
      });
    }

    const quickReplies: QuickReply[] = [
      { id: 'explain_factors', text: '🔍 Explícame mis factores específicos', action: 'question' },
      { id: 'improvement_plan', text: '📈 ¿Cómo puedo mejorar?', action: 'request_info' },
      { id: 'treatment_options', text: '💊 Opciones de tratamiento', action: 'request_info' },
      { id: 'timeline', text: '⏰ ¿Cuánto tiempo tengo?', action: 'question' }
    ];

    return {
      response,
      quickReplies,
      urgencyLevel: probability < 0.10 ? 'high' : 'medium',
      attachments: []
    };
  }

  /**
   * 📈 GENERAR ESTRATEGIAS DE MEJORA PERSONALIZADAS
   */
  private generateImprovementStrategies(intent: AnalyzedIntent): NeuralEnhancedResponse {
    const template = this.getRandomTemplate('lifestyle');
    let response = `${template}\n\n`;
    
    // 🧬 ESTRATEGIAS ESPECÍFICAS POR FACTOR
    const strategies: string[] = [];
    
    if (this.conversationMemory.medicalContext.factors.includes('BMI')) {
      strategies.push('🏃‍♀️ **Control de peso**: Plan nutricional antiinflamatorio + ejercicio moderado 150min/semana');
    }
    
    if (this.conversationMemory.medicalContext.factors.includes('PCOS')) {
      strategies.push('🥗 **Manejo PCOS**: Dieta baja en índice glucémico + inositol + ejercicio resistencia');
    }
    
    if (this.conversationMemory.medicalContext.factors.includes('Reserva Ovárica')) {
      strategies.push('💊 **Soporte ovárico**: CoQ10 + vitamina D + reducción estrés + sueño 7-8h');
    }
    
    if (this.conversationMemory.medicalContext.factors.includes('Función Tiroidea')) {
      strategies.push('🩺 **Optimización tiroidea**: Seguimiento TSH <2.5 + selenio + yodo moderado');
    }

    // 🌟 ESTRATEGIAS GENERALES PERSONALIZADAS
    strategies.push('🧘‍♀️ **Manejo del estrés**: Técnicas de relajación específicas para fertilidad');
    strategies.push('🥬 **Nutrición fertil**: Folato + omega-3 + antioxidantes + dieta mediterránea');
    strategies.push('💑 **Timing óptimo**: Relaciones en ventana fértil + seguimiento ovulación');

    response += strategies.join('\n\n');
    
    // 🎯 PRIORIZACIÓN INTELIGENTE
    response += `\n\n🎯 **Tu prioridad #1**: `;
    if (this.conversationMemory.medicalContext.factors.includes('BMI')) {
      response += `Control de peso - puede mejorar significativamente tu pronóstico`;
    } else if (this.conversationMemory.medicalContext.factors.includes('PCOS')) {
      response += `Manejo integral del PCOS - es tu factor más modificable`;
    } else {
      response += `Optimización del estilo de vida integral - múltiples beneficios sinérgicos`;
    }

    const quickReplies: QuickReply[] = [
      { id: 'detailed_plan', text: '📋 Plan detallado paso a paso', action: 'request_info' },
      { id: 'supplements', text: '💊 Suplementos específicos', action: 'request_info' },
      { id: 'diet_plan', text: '🥗 Dieta personalizada', action: 'request_info' },
      { id: 'exercise_routine', text: '🏃‍♀️ Rutina de ejercicios', action: 'request_info' }
    ];

    return {
      response,
      quickReplies,
      urgencyLevel: 'medium',
      attachments: []
    };
  }

  /**
   * 🎭 RESPUESTA FALLBACK INTELIGENTE CON VARIEDAD
   */
  private generateIntelligentFallback(message: string): NeuralEnhancedResponse {
    const uncertaintyTemplate = this.getRandomTemplate('uncertainty');
    const encouragementTemplate = this.getRandomTemplate('encouragement');
    
    let response = `${uncertaintyTemplate} un especialista en reproducción asistida.\n\n`;
    response += `${encouragementTemplate}\n\n`;
    
    // 🎯 REDIRIGIR A TEMAS CONOCIDOS
    response += `💡 **Mientras tanto, puedo ayudarte con:**\n`;
    response += `• Interpretar tus resultados actuales\n`;
    response += `• Estrategias de mejora específicas\n`;
    response += `• Opciones de tratamiento disponibles\n`;
    response += `• Cambios de estilo de vida efectivos`;

    const quickReplies: QuickReply[] = [
      { id: 'my_results', text: '📊 Mis resultados actuales', action: 'question' },
      { id: 'improve_chances', text: '📈 Cómo mejorar', action: 'request_info' },
      { id: 'specialist_help', text: '👨‍⚕️ Necesito especialista', action: 'request_info' }
    ];

    return {
      response,
      quickReplies,
      urgencyLevel: 'low',
      attachments: []
    };
  }

  // 🎨 MÉTODOS AUXILIARES PARA VARIEDAD Y CONTEXTO
  private getRandomTemplate(category: keyof ResponseTemplates): string {
    const templates = this.responseTemplates[category];
    return templates[Math.floor(Math.random() * templates.length)];
  }

  /**
   * 🔧 MÉTODOS HELPER PARA ANÁLISIS COMPLETO DE VARIABLES
   */
  
  /**
   * 👤 OBTENER CATEGORÍA DE EDAD
   */
  private getAgeCategory(age: number): string {
    if (age < 25) return 'Muy joven';
    if (age < 30) return 'Joven';  
    if (age < 35) return 'Óptima';
    if (age < 40) return 'Avanzada';
    return 'Muy avanzada';
  }

  /**
   * 🥛 OBTENER NIVEL DE PROLACTINA
   */
  private getProlactinLevel(factor: number): string {
    if (factor <= 0.3) return 'Severa';
    if (factor <= 0.5) return 'Moderada-Severa';  
    if (factor <= 0.7) return 'Moderada';
    if (factor <= 0.85) return 'Leve';
    return 'Normal';
  }

  /**
   * 🍯 OBTENER SEVERIDAD HOMA
   */
  private getHOMASeverity(factor: number): string {
    if (factor <= 0.2) return 'Severa';
    if (factor <= 0.4) return 'Significativa';
    if (factor <= 0.6) return 'Moderada'; 
    if (factor <= 0.8) return 'Leve';
    return 'Normal';
  }

  /**
   * 🩻 OBTENER CATEGORÍA HSG
   */
  private getHSGCategory(factor: number): string {
    if (factor <= 0.1) return 'Bilateral';
    if (factor <= 0.3) return 'Malformación';
    if (factor <= 0.8) return 'Unilateral';
    return 'Normal';
  }

  /**
   * ✂️ OBTENER MÉTODO OTB
   */
  private getOTBMethod(factor: number): string {
    if (factor <= 0.05) return 'Cauterización Extensa';
    if (factor <= 0.08) return 'Salpingectomía Parcial';
    if (factor <= 0.1) return 'Clips';
    if (factor <= 0.12) return 'Anillos';
    if (factor <= 0.75) return 'Ligadura';
    return 'Desconocido';
  }

  /**
   * 🔪 OBTENER IMPACTO CIRUGÍAS PÉLVICAS
   */
  private getPelvicSurgeryImpact(factor: number): string {
    if (factor <= 0.7) return 'Alto impacto';
    if (factor <= 0.85) return 'Moderado impacto';
    if (factor <= 0.95) return 'Bajo impacto';
    return 'Sin impacto';
  }

  /**
   * 🩸 OBTENER REGULARIDAD CICLO
   */
  private getCycleRegularity(factor: number): string {
    if (factor <= 0.6) return 'Muy irregular';
    if (factor <= 0.8) return 'Irregular';
    return 'Ligeramente irregular';
  }

  /**
   * ⏱️ OBTENER DURACIÓN INFERTILIDAD
   */
  private getInfertilityDuration(factor: number): string {
    if (factor <= 0.5) return 'Muy prolongada (>5 años)';
    if (factor <= 0.75) return 'Prolongada (3-5 años)';
    if (factor <= 0.9) return 'Moderada (2-3 años)';
    return 'Reciente (1-2 años)';
  }

  private getPCOSSeverity(factor: number): string {
    if (factor <= 0.6) return 'severo';
    if (factor <= 0.75) return 'moderado';
    return 'leve';
  }

  private getBMICategory(factor: number): string {
    if (factor <= 0.7) return 'obesidad significativa';
    if (factor <= 0.9) return 'sobrepeso';
    return 'límite superior';
  }

  private getAMHLevel(factor: number): string {
    if (factor <= 0.3) return 'muy baja';
    if (factor <= 0.6) return 'baja';
    return 'reducida';
  }

  private getTSHStatus(factor: number): string {
    if (factor <= 0.4) return 'hipotiroidismo severo';
    return 'alteración tiroidea';
  }

  private getMaleFactorGrade(factor: number): string {
    if (factor <= 0.3) return 'severo (azoospermia)';
    if (factor <= 0.6) return 'moderado (OAT)';
    return 'leve';
  }

  private getLifeStage(age: number): string {
    if (age <= 30) return 'fertilidad óptima';
    if (age <= 35) return 'ventana favorable';
    if (age <= 40) return 'edad avanzada';
    return 'muy avanzada';
  }

  private extractMainTopic(message: string): string {
    if (message.includes('resultado')) return 'resultados';
    if (message.includes('tratamiento')) return 'tratamientos';
    if (message.includes('mejorar')) return 'mejoras';
    return 'general';
  }

  private determineCategory(message: string, isFollowUp: boolean): MessageCategory {
    if (message.includes('urgente') || message.includes('dolor')) return 'emergency';
    if (message.includes('síntoma')) return 'symptom';
    if (message.includes('necesito') || message.includes('quiero')) return 'request';
    return 'question';
  }

  private getFactorKeywords(factor: string): string {
    const keywords: Record<string, string> = {
      'PCOS': 'ovarios poliquísticos',
      'BMI': 'peso imc obesidad',
      'Reserva Ovárica': 'amh reserva ovárica',
      'Función Tiroidea': 'tsh tiroides',
      'Factor Masculino': 'esperma masculino pareja'
    };
    return keywords[factor] || '';
  }

  private getFactorExplanation(factor: string): string {
    const explanations: Record<string, string> = {
      'PCOS': 'Requiere manejo integral del síndrome',
      'BMI': 'Impacta significativamente la fertilidad',
      'Reserva Ovárica': 'Niveles reducidos requieren atención',
      'Función Tiroidea': 'Alteración hormonal que afecta ovulación',
      'Factor Masculino': 'Alteraciones en parámetros seminales'
    };
    return explanations[factor] || 'Factor que requiere evaluación';
  }

  /**
   * 💊 PLANIFICACIÓN DE TRATAMIENTOS INTELIGENTE
   */
  private generateTreatmentPlanning(intent: AnalyzedIntent): NeuralEnhancedResponse {
    const probability = this.evaluation?.report?.numericPrognosis || 0;
    const template = this.getRandomTemplate('treatments');
    
    let response = `${template}:\n\n`;
    
    // 🎯 ESTRATEGIA BASADA EN PROBABILIDAD Y FACTORES
    if (probability > 0.20) {
      response += `🌿 **Enfoque Inicial: Optimización Natural (3-6 meses)**\n\n`;
      response += `**Nivel 1 - Mejoras Inmediatas:**\n`;
      response += `• 📊 Seguimiento ovulación con apps especializadas\n`;
      response += `• 🥗 Dieta antiinflamatoria mediterránea\n`;
      response += `• 💊 Suplementación básica (ácido fólico, vitamina D)\n`;
      response += `• 🧘‍♀️ Manejo del estrés (yoga, meditación)\n\n`;
      
      response += `**Si no hay éxito en 6 meses:**\n`;
      response += `• 🏥 Consulta especialista reproducción\n`;
      response += `• 🧪 Estudios hormonales complementarios\n`;
      response += `• 💉 Considerar inducción ovulación\n`;
    } else if (probability > 0.10) {
      response += `⚡ **Enfoque Combinado: Natural + Médico (inmediato)**\n\n`;
      response += `**Acciones Inmediatas:**\n`;
      response += `• 👨‍⚕️ Consulta especialista reproducción (prioritaria)\n`;
      response += `• 🧪 Panel hormonal completo + HSG\n`;
      response += `• 💊 Protocolo suplementación avanzada\n`;
      response += `• 📋 Optimización factores modificables\n\n`;
      
      response += `**Opciones Médicas Probables:**\n`;
      response += `• 💉 Inducción ovulación + IUI\n`;
      response += `• 🧪 FIV si factores complejos\n`;
      response += `• 🎯 Tratamientos específicos según diagnóstico\n`;
    } else {
      response += `🚀 **Enfoque Especializado: Reproducción Asistida (urgente)**\n\n`;
      response += `**Plan Prioritario:**\n`;
      response += `• 🏥 Cita INMEDIATA centro FIV reconocido\n`;
      response += `• 🧪 Estudios pre-FIV completos\n`;
      response += `• 💉 Protocolo estimulación ovárica\n`;
      response += `• 🥚 Evaluación ovodonación si AMH <0.4\n\n`;
      
      response += `**Preparación Paralela:**\n`;
      response += `• 💪 Optimización física inmediata\n`;
      response += `• 🧠 Preparación psicológica especializada\n`;
      response += `• 💰 Planificación financiera tratamientos\n`;
    }

    // 🧬 TRATAMIENTOS ESPECÍFICOS POR FACTORES PRESENTES
    if (this.conversationMemory.medicalContext.factors.length > 0) {
      response += `\n**🧬 Tratamientos Específicos para tus Factores:**\n`;
      
      if (this.conversationMemory.medicalContext.factors.includes('PCOS')) {
        response += `• **PCOS**: Metformina + inositol, dieta baja IG, ejercicio resistencia\n`;
      }
      if (this.conversationMemory.medicalContext.factors.includes('BMI')) {
        response += `• **Peso**: Plan nutricional supervisado, objetivo BMI 20-25\n`;
      }
      if (this.conversationMemory.medicalContext.factors.includes('Función Tiroidea')) {
        response += `• **Tiroides**: Levotiroxina, objetivo TSH <2.5 mUI/L\n`;
      }
      if (this.conversationMemory.medicalContext.factors.includes('Factor Masculino')) {
        response += `• **Factor Masculino**: Evaluación urológica, ICSI si severo\n`;
      }
    }

    const quickReplies: QuickReply[] = [
      { id: 'specialist_referral', text: '👨‍⚕️ ¿Qué especialista necesito?', action: 'request_info' },
      { id: 'treatment_costs', text: '💰 Costos y seguros', action: 'request_info' },
      { id: 'success_rates', text: '📊 Tasas de éxito', action: 'question' },
      { id: 'timeline_treatment', text: '⏰ Tiempo de tratamiento', action: 'question' }
    ];

    return {
      response,
      quickReplies,
      urgencyLevel: probability < 0.10 ? 'high' : 'medium',
      attachments: []
    };
  }

  /**
   * 🧬 RESPUESTA ESPECÍFICA POR FACTOR CON CONTEXTO
   */
  private generateFactorSpecificResponse(topic: string, intent: AnalyzedIntent): NeuralEnhancedResponse {
    const factorName = topic.replace('_specific', '');
    const template = this.getRandomTemplate('factors');
    
    // 🎯 RESPUESTAS ESPECÍFICAS INTELIGENTES
    if (factorName === 'pcos') {
      return this.generatePCOSSpecificResponse(template);
    } else if (factorName === 'bmi') {
      return this.generateBMISpecificResponse(template);
    } else if (factorName === 'reserva ovárica') {
      return this.generateAMHSpecificResponse(template);
    } else if (factorName === 'función tiroidea') {
      return this.generateTSHSpecificResponse(template);
    } else if (factorName === 'factor masculino') {
      return this.generateMaleFactorSpecificResponse(template);
    }

    return this.generateIntelligentFallback('');
  }

  /**
   * 🫃 RESPUESTA ESPECÍFICA PCOS
   */
  private generatePCOSSpecificResponse(template: string): NeuralEnhancedResponse {
    const factors = this.evaluation?.factors;
    const pcosLevel = factors?.pcos || 1.0;
    const severity = this.getPCOSSeverity(pcosLevel);
    
    let response = `${template} **afecta múltiples aspectos de tu fertilidad**:\n\n`;
    response += `🫃 **Tu PCOS es de tipo ${severity}** (factor: ${pcosLevel.toFixed(2)})\n\n`;
    
    response += `**🧬 Cómo impacta tu fertilidad:**\n`;
    response += `• 🥚 **Ovulación**: Puede ser irregular o ausente\n`;
    response += `• 🍯 **Resistencia insulina**: Afecta calidad ovocitaria\n`;
    response += `• ⚖️ **Peso**: Complica manejo hormonal\n`;
    response += `• 🧪 **Hormonas**: Desequilibrio andrógenos/estrógenos\n\n`;
    
    response += `**💊 Plan de Tratamiento Integral:**\n`;
    response += `**Nivel 1 - Cambios Estilo de Vida (inmediato):**\n`;
    response += `• 🥗 Dieta antiinflamatoria baja en carbohidratos refinados\n`;
    response += `• 🏃‍♀️ Ejercicio combinado: cardio + resistencia 5x/semana\n`;
    response += `• 😴 Sueño reparador 7-8 horas (crucial para hormonas)\n\n`;
    
    response += `**Nivel 2 - Suplementación Específica:**\n`;
    response += `• 💊 Inositol 2-4g/día (mejora ovulación 70% casos)\n`;
    response += `• 🧪 Omega-3 + vitamina D + cromo\n`;
    response += `• 🌿 Canela + té verde (sensibilidad insulina)\n\n`;
    
    if (severity === 'severo') {
      response += `**Nivel 3 - Tratamiento Médico (recomendado):**\n`;
      response += `• 💉 Metformina 500-1000mg (resistencia insulina)\n`;
      response += `• 🏥 Inducción ovulación con letrozol/clomifeno\n`;
      response += `• 🧪 FIV si no hay respuesta en 6 meses\n`;
    }

    const quickReplies: QuickReply[] = [
      { id: 'pcos_diet', text: '🥗 Dieta específica PCOS', action: 'request_info' },
      { id: 'pcos_supplements', text: '💊 Suplementos recomendados', action: 'request_info' },
      { id: 'pcos_ovulation', text: '🥚 ¿Cómo sé si ovulo?', action: 'question' },
      { id: 'pcos_weight', text: '⚖️ Control de peso', action: 'request_info' }
    ];

    return {
      response,
      quickReplies,
      urgencyLevel: severity === 'severo' ? 'high' : 'medium',
      attachments: []
    };
  }

  /**
   * 🎭 RESPUESTA CONVERSACIONAL ADAPTATIVA
   */
  private generateConversationalResponse(intent: AnalyzedIntent, message: string): NeuralEnhancedResponse {
    const isFirstMessage = this.messageCount === 1;
    const isGreeting = message.toLowerCase().includes('hola') || 
                      message.toLowerCase().includes('buenos') || 
                      message.toLowerCase().includes('buenas');
    
    if (isGreeting || isFirstMessage) {
      return this.generatePersonalizedGreeting();
    }

    // 🧠 RESPUESTA CONTEXTUAL BASADA EN HISTORIAL
    if (intent.medicalContext?.primaryHypothesis === 'follow_up_topic') {
      return this.generateFollowUpResponse(message);
    }

    // 🎯 RESPUESTA GENERAL INTELIGENTE
    const probability = this.evaluation?.report?.numericPrognosis || 0;
    const encouragement = this.getRandomTemplate('encouragement');
    
    let response = `${encouragement}\n\n`;
    response += `🧠 **Basándome en tu perfil médico**, puedo ayudarte con:\n\n`;
    
    response += `📊 **Interpretación completa** de tu ${probability.toFixed(1)}% probabilidad\n`;
    response += `🎯 **Estrategias personalizadas** para optimizar tu fertilidad\n`;
    response += `💊 **Opciones de tratamiento** específicas para tu caso\n`;
    response += `🌱 **Cambios de estilo de vida** con mayor impacto\n`;
    
    if (this.conversationMemory.medicalContext.factors.length > 0) {
      response += `\n🧬 **Análisis específico** de tus factores: ${this.conversationMemory.medicalContext.factors.join(', ')}\n`;
    }

    const quickReplies: QuickReply[] = [
      { id: 'my_results', text: '📊 Explicar mis resultados', action: 'question' },
      { id: 'best_options', text: '🎯 Mejores opciones para mí', action: 'request_info' },
      { id: 'specific_factors', text: '🧬 Mis factores específicos', action: 'question' },
      { id: 'next_steps', text: '🗓️ ¿Qué hago ahora?', action: 'request_info' }
    ];

    return {
      response,
      quickReplies,
      urgencyLevel: 'low',
      attachments: []
    };
  }

  /**
   * 👋 SALUDO PERSONALIZADO INTELIGENTE
   */
  private generatePersonalizedGreeting(): NeuralEnhancedResponse {
    console.log('👋 [SMART CHAT] Generando saludo personalizado...');
    
    const greeting = this.getRandomTemplate('greeting');
    const age = this.conversationMemory.personalInfo.age;
    const stage = this.conversationMemory.personalInfo.stage;
    const probability = this.evaluation?.report?.numericPrognosis || 0;
    
    console.log('📊 [SMART CHAT] Datos para saludo:', {
      age,
      stage,
      probability,
      probabilityType: typeof probability,
      factorsCount: this.conversationMemory.medicalContext.factors.length,
      greeting,
      // 🔍 COMPARACIÓN CON RESULTSDISPLAY:
      evaluationReport: this.evaluation?.report ? {
        numericPrognosis: this.evaluation.report.numericPrognosis,
        category: this.evaluation.report.category,
        prognosisPhrase: this.evaluation.report.prognosisPhrase
      } : 'No disponible'
    });
    
    let response = `${greeting}\n\n`;
    
    if (age && stage) {
      response += `👤 **Tu perfil**: ${age} años (${stage})\n`;
      console.log('✅ [SMART CHAT] Agregando perfil personal');
    } else {
      console.log('⚠️ [SMART CHAT] No hay datos de edad/stage:', { age, stage });
    }
    
    // 🔧 USAR EXACTAMENTE EL MISMO FORMATO QUE PROGNOSISCARD.TSX
    const formattedProbability = probability.toFixed(1);
    
    console.log('🔍 [SMART CHAT] Formato probabilidad CORREGIDO:', {
      probabilityRaw: probability,
      formattedProbability,
      format: 'probability.toFixed(1) - same as PrognosisCard'
    });
    
    response += `📊 **Tu probabilidad actual**: ${formattedProbability}%\n`;
    
    if (this.conversationMemory.medicalContext.factors.length > 0) {
      response += `🧬 **Factores identificados**: ${this.conversationMemory.medicalContext.factors.length} aspectos específicos\n`;
    }
    
    response += `\n💡 **Tengo información detallada sobre:**\n`;
    response += `• 📋 63+ condiciones médicas especializadas\n`;
    response += `• 💊 35+ protocolos de tratamiento actualizados\n`;
    response += `• 🎯 Estrategias personalizadas para tu caso específico\n`;
    response += `• 📈 Opciones para optimizar tu pronóstico\n`;
    
    response += `\n¿Por dónde te gustaría empezar? 🌟`;

    const quickReplies: QuickReply[] = [
      { id: 'understand_results', text: '📊 Entender mis resultados', action: 'question' },
      { id: 'improvement_options', text: '📈 Opciones de mejora', action: 'request_info' },
      { id: 'treatment_plan', text: '💊 Plan de tratamiento', action: 'request_info' },
      { id: 'lifestyle_changes', text: '🌱 Cambios de estilo de vida', action: 'request_info' }
    ];

    return {
      response,
      quickReplies,
      urgencyLevel: 'low',
      attachments: []
    };
  }

  /**
   * 🔄 RESPUESTA DE SEGUIMIENTO
   */
  private generateFollowUpResponse(message: string): NeuralEnhancedResponse {
    const response = `Perfecto, continuemos profundizando en este tema que te interesa. 
    
    Noto que es importante para ti, así que vamos a explorarlo desde diferentes ángulos para que tengas una comprensión completa.
    
    ¿Hay algún aspecto específico que te gustaría que abordemos con más detalle?`;

    const quickReplies: QuickReply[] = [
      { id: 'more_detail', text: '🔍 Más detalles', action: 'question' },
      { id: 'practical_steps', text: '📋 Pasos prácticos', action: 'request_info' },
      { id: 'other_topic', text: '💭 Otro tema', action: 'question' }
    ];

    return {
      response,
      quickReplies,
      urgencyLevel: 'low',
      attachments: []
    };
  }

  // Métodos auxiliares adicionales para casos específicos
  private generateBMISpecificResponse(template: string): NeuralEnhancedResponse {
    return this.generateIntelligentFallback('BMI específico en desarrollo...');
  }

  private generateAMHSpecificResponse(template: string): NeuralEnhancedResponse {
    return this.generateIntelligentFallback('AMH específico en desarrollo...');
  }

  private generateTSHSpecificResponse(template: string): NeuralEnhancedResponse {
    return this.generateIntelligentFallback('TSH específico en desarrollo...');
  }

  private generateMaleFactorSpecificResponse(template: string): NeuralEnhancedResponse {
    return this.generateIntelligentFallback('Factor masculino específico en desarrollo...');
  }
}