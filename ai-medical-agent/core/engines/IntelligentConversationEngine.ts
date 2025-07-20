/**
 * 💬 SISTEMA CONVERSACIONAL MÉDICO OPTIMIZADO
 * Generación inteligente de respuestas empáticas
 */

import { 
  UserInput, 
  MedicalResponse, 
  OperationResult,
  ClinicalAnalysis,
  SuccessRate
} from '../types/UnifiedTypes';

export class IntelligentConversationEngine {
  private static instance: IntelligentConversationEngine;
  
  private constructor() {}

  public static getInstance(): IntelligentConversationEngine {
    if (!IntelligentConversationEngine.instance) {
      IntelligentConversationEngine.instance = new IntelligentConversationEngine();
    }
    return IntelligentConversationEngine.instance;
  }

  /**
   * 🎯 GENERACIÓN DE RESPUESTA INTELIGENTE
   */
  public async generateResponse(
    userQuery: string,
    userInput: UserInput,
    context: {
      clinicalAnalysis?: ClinicalAnalysis;
      successRates?: SuccessRate[];
      conversationType: 'diagnostic' | 'therapeutic' | 'prognostic' | 'educational' | 'supportive';
    }
  ): Promise<OperationResult<MedicalResponse>> {
    
    try {
      const response = await this.buildContextualResponse(
        userQuery, 
        userInput, 
        context
      );

      return {
        success: true,
        data: response,
        metadata: {
          processingTime: Date.now(),
          confidence: response.confidenceLevel,
          evidenceLevel: 'A'
        }
      };

    } catch (error) {
      return {
        success: false,
        error: {
          code: 'RESPONSE_ERROR',
          message: `Error generando respuesta: ${error}`
        }
      };
    }
  }

  /**
   * 🏗️ CONSTRUCCIÓN DE RESPUESTA CONTEXTUAL
   */
  private async buildContextualResponse(
    userQuery: string,
    userInput: UserInput,
    context: {
      clinicalAnalysis?: ClinicalAnalysis;
      successRates?: SuccessRate[];
      conversationType: 'diagnostic' | 'therapeutic' | 'prognostic' | 'educational' | 'supportive';
    }
  ): Promise<MedicalResponse> {

    switch (context.conversationType) {
      case 'diagnostic':
        return this.generateDiagnosticResponse(userQuery, userInput, context.clinicalAnalysis);
      
      case 'therapeutic':
        return this.generateTherapeuticResponse(userQuery, userInput, context.clinicalAnalysis);
      
      case 'prognostic':
        return this.generatePrognosticResponse(userQuery, userInput, context.successRates);
      
      case 'educational':
        return this.generateEducationalResponse(userQuery, userInput, context.clinicalAnalysis);
      
      case 'supportive':
        return this.generateSupportiveResponse(userQuery, userInput);
      
      default:
        return this.generateGeneralResponse(userQuery, userInput, context);
    }
  }

  /**
   * 🔬 RESPUESTA DIAGNÓSTICA
   */
  private generateDiagnosticResponse(
    userQuery: string,
    userInput: UserInput,
    clinicalAnalysis?: ClinicalAnalysis
  ): MedicalResponse {
    
    if (!clinicalAnalysis) {
      return {
        mainMessage: 'Para darte un diagnóstico preciso, necesito más información sobre tu situación.',
        supportingEvidence: ['Análisis clínico pendiente'],
        actionableAdvice: ['Completar evaluación médica'],
        followUpQuestions: ['¿Podrías contarme más sobre tus síntomas?'],
        confidenceLevel: 40,
        responseType: 'diagnostic'
      };
    }

    const diagnosis = clinicalAnalysis.primaryDiagnosis;
    
    let mainMessage = '';
    if (diagnosis.confidence >= 80) {
      mainMessage = `Basándome en tu información, el diagnóstico más probable es **${diagnosis.pathology}** con un ${diagnosis.confidence}% de confianza.`;
    } else if (diagnosis.confidence >= 60) {
      mainMessage = `Tu cuadro clínico sugiere **${diagnosis.pathology}** como posibilidad principal, aunque necesitamos más evaluaciones para confirmarlo.`;
    } else {
      mainMessage = `Hay varios diagnósticos posibles. El más probable es **${diagnosis.pathology}**, pero requiere evaluación especializada.`;
    }

    const supportingEvidence = [
      `Diagnóstico basado en: ${diagnosis.clinicalJustification}`,
      `Nivel de evidencia científica: ${diagnosis.evidenceLevel}`,
      clinicalAnalysis.differentialDiagnoses.length > 0 ? 
        `También consideramos: ${clinicalAnalysis.differentialDiagnoses[0].pathology}` : ''
    ].filter(Boolean);

    const actionableAdvice = [
      'Consulta con especialista en medicina reproductiva',
      'Completa los estudios diagnósticos recomendados',
      'Mantén estilo de vida saludable durante la evaluación'
    ];

    const followUpQuestions = [
      '¿Tienes dudas específicas sobre este diagnóstico?',
      '¿Qué te preocupa más de esta información?',
      '¿Quieres saber sobre las opciones de tratamiento disponibles?'
    ];

    return {
      mainMessage,
      supportingEvidence,
      actionableAdvice,
      emotionalSupport: this.generateEmotionalContext(userInput, 'diagnostic'),
      followUpQuestions,
      confidenceLevel: diagnosis.confidence,
      responseType: 'diagnostic'
    };
  }

  /**
   * 💊 RESPUESTA TERAPÉUTICA
   */
  private generateTherapeuticResponse(
    userQuery: string,
    userInput: UserInput,
    clinicalAnalysis?: ClinicalAnalysis
  ): MedicalResponse {
    
    if (!clinicalAnalysis) {
      return {
        mainMessage: 'Para recomendarte el mejor tratamiento, primero necesito conocer tu diagnóstico.',
        supportingEvidence: ['Evaluación diagnóstica requerida'],
        actionableAdvice: ['Completar análisis clínico primero'],
        followUpQuestions: ['¿Ya tienes un diagnóstico confirmado?'],
        confidenceLevel: 30,
        responseType: 'therapeutic'
      };
    }

    const treatment = clinicalAnalysis.treatmentDecisionTree;
    
    const mainMessage = `Considerando tu diagnóstico, el tratamiento recomendado como primera línea es **${treatment.firstLine.treatment}**. ` +
      `Este enfoque tiene aproximadamente ${treatment.firstLine.successProbability}% de probabilidad de éxito y se implementa en un plazo de ${treatment.firstLine.timeframe}.`;

    const supportingEvidence = [
      `Justificación médica: ${treatment.firstLine.rationale}`,
      `Alternativa si no funciona: ${treatment.secondLine.treatment} (${treatment.secondLine.successProbability}% éxito)`,
      `Opción avanzada: ${treatment.thirdLine.treatment} (${treatment.thirdLine.successProbability}% éxito)`
    ];

    const actionableAdvice = [
      'Programa consulta con especialista para iniciar tratamiento',
      'Optimiza factores de estilo de vida antes de comenzar',
      'Considera apoyo psicológico durante el proceso',
      'Discute costos y logística del tratamiento'
    ];

    return {
      mainMessage,
      supportingEvidence,
      actionableAdvice,
      emotionalSupport: this.generateEmotionalContext(userInput, 'therapeutic'),
      followUpQuestions: [
        '¿Tienes experiencia previa con alguno de estos tratamientos?',
        '¿Qué aspectos del tratamiento te generan más dudas?',
        '¿Quieres saber sobre posibles efectos secundarios?'
      ],
      confidenceLevel: 75,
      responseType: 'therapeutic'
    };
  }

  /**
   * 🔮 RESPUESTA PRONÓSTICA
   */
  private generatePrognosticResponse(
    userQuery: string,
    userInput: UserInput,
    successRates?: SuccessRate[]
  ): MedicalResponse {
    
    if (!successRates || successRates.length === 0) {
      return {
        mainMessage: 'Para darte un pronóstico preciso, necesito calcular tus probabilidades personalizadas.',
        supportingEvidence: ['Cálculo de tasas de éxito pendiente'],
        actionableAdvice: ['Proporcionar información completa para análisis'],
        followUpQuestions: ['¿Tienes resultados de análisis recientes?'],
        confidenceLevel: 35,
        responseType: 'prognostic'
      };
    }

    const bestOption = successRates[0];
    const probPercent = Math.round(bestOption.probabilityPerCycle * 100);
    const prob3Cycles = Math.round(bestOption.probabilityAfter3Cycles * 100);
    
    const mainMessage = `Tu pronóstico es **${this.getPronósticoCualitativo(probPercent)}**. ` +
      `Con ${bestOption.technique}, tienes ${probPercent}% de probabilidad por ciclo, ` +
      `y ${prob3Cycles}% de probabilidad acumulada después de 3 intentos.`;

    const supportingEvidence = [
      `Análisis basado en datos científicos 2024-2025`,
      `Factores considerados: edad (${userInput.age}), duración infertilidad (${userInput.infertilityDuration} meses)`,
      `Técnica más prometedora: ${bestOption.technique}`,
      successRates.length > 1 ? 
        `Segunda opción: ${successRates[1].technique} (${Math.round(successRates[1].probabilityPerCycle * 100)}%)` : ''
    ].filter(Boolean);

    const actionableAdvice = [
      bestOption.recommendation,
      userInput.age >= 35 ? 'No demorar el inicio del tratamiento' : 'Tiempo para optimizar condiciones',
      'Considerar factores económicos y emocionales en la decisión',
      'Mantener expectativas realistas pero positivas'
    ];

    return {
      mainMessage,
      supportingEvidence,
      actionableAdvice,
      emotionalSupport: this.generateEmotionalContext(userInput, 'prognostic', probPercent),
      followUpQuestions: [
        '¿Cómo te sientes con estas probabilidades?',
        '¿Quieres explorar formas de mejorar tus posibilidades?',
        '¿Tienes dudas sobre el proceso del tratamiento recomendado?'
      ],
      confidenceLevel: 80,
      responseType: 'prognostic'
    };
  }

  /**
   * 🎓 RESPUESTA EDUCATIVA
   */
  private generateEducationalResponse(
    userQuery: string,
    userInput: UserInput,
    clinicalAnalysis?: ClinicalAnalysis
  ): MedicalResponse {
    
    // Detectar tema de la pregunta
    const topic = this.detectEducationalTopic(userQuery);
    
    let mainMessage = '';
    let supportingEvidence: string[] = [];
    let actionableAdvice: string[] = [];

    switch (topic) {
      case 'fertilidad_general':
        mainMessage = 'La fertilidad es la capacidad de concebir naturalmente. En mujeres, peak a los 20-30 años, declinando gradualmente después de los 30 y más rápidamente después de los 35.';
        supportingEvidence = [
          'La reserva ovárica disminuye con la edad',
          'Factores modificables: peso, ejercicio, tabaco, estrés',
          'Factores no modificables: edad, genética, anatomía'
        ];
        break;

      case 'tratamientos':
        mainMessage = 'Los tratamientos van desde cambios de estilo de vida hasta técnicas de reproducción asistida, escalando según necesidad.';
        supportingEvidence = [
          'Primera línea: lifestyle, suplementos, timing',
          'Segunda línea: medicamentos, IUI',
          'Tercera línea: FIV, técnicas avanzadas'
        ];
        break;

      case 'diagnostico_especifico':
        if (clinicalAnalysis) {
          mainMessage = `Tu diagnóstico ${clinicalAnalysis.primaryDiagnosis.pathology} significa: ${this.getPathologyEducation(clinicalAnalysis.primaryDiagnosis.pathology)}`;
        } else {
          mainMessage = 'Para educarte específicamente sobre tu diagnóstico, primero necesitamos completar la evaluación.';
        }
        break;

      default:
        mainMessage = 'La medicina reproductiva es un campo complejo pero con muchas opciones exitosas.';
    }

    actionableAdvice = [
      'Busca fuentes médicas confiables para información',
      'Evita compararte con historias en redes sociales',
      'Toma notas de tus dudas para consultas médicas',
      'Considera unirte a grupos de apoyo educativo'
    ];

    return {
      mainMessage,
      supportingEvidence,
      actionableAdvice,
      followUpQuestions: [
        '¿Hay algún término médico que no entiendas?',
        '¿Qué aspecto te gustaría que explique más detalladamente?',
        '¿Tienes preguntas específicas sobre algún procedimiento?'
      ],
      confidenceLevel: 70,
      responseType: 'educational'
    };
  }

  /**
   * 💝 RESPUESTA DE APOYO
   */
  private generateSupportiveResponse(
    userQuery: string,
    userInput: UserInput
  ): MedicalResponse {
    
    const emotionalTone = this.detectEmotionalTone(userQuery);
    
    let mainMessage = '';
    let emotionalSupport = '';

    switch (emotionalTone) {
      case 'anxious':
        mainMessage = 'Entiendo que te sientes ansiosa. La incertidumbre en fertilidad es una de las experiencias más desafiantes que alguien puede vivir.';
        emotionalSupport = 'Tu ansiedad es completamente válida. No hay una forma "correcta" de sentirse en este proceso.';
        break;

      case 'frustrated':
        mainMessage = 'La frustración que sientes es profundamente comprensible. Este proceso puede sentirse injusto y agotador.';
        emotionalSupport = 'Es normal sentir que tu cuerpo no está cooperando con tus deseos más profundos.';
        break;

      case 'hopeful':
        mainMessage = 'Me alegra escuchar esperanza en tus palabras. Esa actitud positiva es una fortaleza real en este proceso.';
        emotionalSupport = 'Mantener la esperanza no es ingenuidad, es fortaleza emocional.';
        break;

      case 'overwhelmed':
        mainMessage = 'Sentirse abrumada es increíblemente común con toda la información médica y decisiones por tomar.';
        emotionalSupport = 'No tienes que procesar todo a la vez. Podemos ir paso a paso, a tu ritmo.';
        break;

      default:
        mainMessage = 'Cualquier emoción que estés sintiendo en este proceso es válida y comprensible.';
        emotionalSupport = 'No estás sola en esto. Tu experiencia emocional importa tanto como la médica.';
    }

    return {
      mainMessage,
      supportingEvidence: [
        'Aproximadamente 85% de mujeres con infertilidad experimentan ansiedad significativa',
        'El apoyo emocional mejora tanto el bienestar como los resultados de tratamientos',
        'Existen recursos especializados en psicología reproductiva'
      ],
      actionableAdvice: [
        'Practica técnicas de mindfulness y respiración',
        'Mantén conexiones sociales que te nutran',
        'Considera apoyo profesional especializado en fertilidad',
        'Establece límites saludables con información en internet',
        'Celebra pequeños pasos y autocuidado diario'
      ],
      emotionalSupport,
      followUpQuestions: [
        '¿Cómo has estado manejando emocionalmente este proceso?',
        '¿Tienes un sistema de apoyo en casa?',
        '¿Hay algo específico que te ayude a sentirte mejor?'
      ],
      confidenceLevel: 85,
      responseType: 'supportive'
    };
  }

  /**
   * 🔧 MÉTODOS UTILITARIOS
   */
  private generateGeneralResponse(
    userQuery: string,
    userInput: UserInput,
    context: any
  ): MedicalResponse {
    return {
      mainMessage: 'Entiendo tu consulta. Para darte la mejor respuesta posible, necesito un poco más de contexto.',
      supportingEvidence: ['Análisis contextual en proceso'],
      actionableAdvice: ['Proporcionar más detalles específicos sobre tu situación'],
      followUpQuestions: ['¿Podrías ser más específica sobre qué aspecto te interesa más?'],
      confidenceLevel: 50,
      responseType: 'educational'
    };
  }

  private generateEmotionalContext(
    userInput: UserInput, 
    responseType: string, 
    successProbability?: number
  ): string {
    
    if (responseType === 'diagnostic') {
      return 'Recibir un diagnóstico puede generar muchas emociones. Es normal sentir alivio por tener respuestas y también preocupación por el camino ahead.';
    }
    
    if (responseType === 'therapeutic') {
      return 'Comenzar un tratamiento puede ser emocionante y a la vez intimidante. Recuerda que cada paso te acerca más a tu objetivo.';
    }
    
    if (responseType === 'prognostic' && successProbability) {
      if (successProbability >= 30) {
        return 'Estas probabilidades son prometedoras. Mantén un optimismo realista mientras te preparas para el proceso.';
      } else if (successProbability >= 15) {
        return 'Aunque las probabilidades sean moderadas, recuerda que cada caso es único y hay factores que puedes optimizar.';
      } else {
        return 'Sé que estas cifras pueden ser desalentadoras, pero no definen tu historia. Hay opciones y siempre hay esperanza.';
      }
    }
    
    return 'Tu bienestar emocional es tan importante como el físico en este proceso. Cuida ambos aspectos.';
  }

  private getPronósticoCualitativo(probability: number): string {
    if (probability >= 40) return 'muy favorable';
    if (probability >= 25) return 'favorable';
    if (probability >= 15) return 'moderadamente favorable';
    if (probability >= 8) return 'moderado';
    return 'desafiante pero con opciones';
  }

  private detectEducationalTopic(query: string): string {
    const lowercaseQuery = query.toLowerCase();
    
    if (lowercaseQuery.includes('que es') || lowercaseQuery.includes('qué es')) {
      return 'fertilidad_general';
    }
    if (lowercaseQuery.includes('tratamiento') || lowercaseQuery.includes('opciones')) {
      return 'tratamientos';
    }
    if (lowercaseQuery.includes('diagnóstico') || lowercaseQuery.includes('significa')) {
      return 'diagnostico_especifico';
    }
    
    return 'general';
  }

  private detectEmotionalTone(query: string): string {
    const lowercaseQuery = query.toLowerCase();
    
    if (lowercaseQuery.includes('ansiosa') || lowercaseQuery.includes('nerviosa') || lowercaseQuery.includes('preocup')) {
      return 'anxious';
    }
    if (lowercaseQuery.includes('frustrad') || lowercaseQuery.includes('enojad') || lowercaseQuery.includes('harta')) {
      return 'frustrated';
    }
    if (lowercaseQuery.includes('espero') || lowercaseQuery.includes('optimis') || lowercaseQuery.includes('positi')) {
      return 'hopeful';
    }
    if (lowercaseQuery.includes('abrumad') || lowercaseQuery.includes('confund') || lowercaseQuery.includes('no entiendo')) {
      return 'overwhelmed';
    }
    
    return 'neutral';
  }

  private getPathologyEducation(pathology: string): string {
    const educationalContent: { [key: string]: string } = {
      'PCOS': 'Un trastorno hormonal que afecta la ovulación, pero muy tratable con medicamentos y cambios de estilo de vida.',
      'DIMINISHED_OVARIAN_RESERVE': 'Una disminución en la cantidad de óvulos disponibles, lo que puede requerir tratamientos más directos pero aún con buenas opciones.',
      'ENDOMETRIOSIS': 'Una condición donde el tejido del útero crece fuera de él, que puede afectar la fertilidad pero responde bien a tratamientos específicos.',
      'UNEXPLAINED_INFERTILITY': 'Cuando no encontramos una causa específica, lo que significa que tu sistema reproductivo básicamente funciona y hay muchas opciones exitosas.'
    };
    
    return educationalContent[pathology] || 'Una condición médica que tiene tratamientos específicos y opciones de manejo efectivas.';
  }
}

// Exportar instancia singleton
export const conversationEngine = IntelligentConversationEngine.getInstance();
