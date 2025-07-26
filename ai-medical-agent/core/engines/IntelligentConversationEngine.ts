/**
 * 💬 SISTEMA CONVERSACIONAL MÉDICO INTELIGENTE V13.1 + NESTED DOMAINS
 * Motor de respuestas contextuales para consultas de fertilidad
 * ✨ Con memoria conversacional, respuestas personalizadas y Nested Domain Intelligence
 * 🧠 NESTED DOMAINS: Especialización jerárquica en dominios médicos
 */

import {
  UnifiedClinicalAnalysis,
  UnifiedMedicalResponse,
  UnifiedSuccessRate,
  UnifiedUserInput
} from '../types/UnifiedTypes';

// Type aliases para mejor legibilidad
type EvidenceLevel = 'A' | 'B' | 'C' | 'D';
type UrgencyLevel = 'low' | 'medium' | 'high';
type WeightCategory = 'bajo_peso' | 'normal' | 'sobrepeso' | 'obesidad' | 'obesidad_severa' | 'peso_mencionado';

// 🧬 NESTED DOMAINS TYPES V13.1
interface NestedDomainInsight {
  domain: string;
  insight: string;
  evidenceLevel: EvidenceLevel;
  clinicalRelevance: number;
}

interface DiagnosticAnalysis {
  primaryDiagnosis: {
    pathology: string;
    pathologyES: string;
    confidence: number;
    evidenceLevel: EvidenceLevel;
    clinicalJustification: string;
  };
  relatedConditions: string[];
  riskStratification: {
    urgencyIndicators: string[];
  };
  treatmentDecisionTree: {
    firstLine: {
      treatment: string;
    };
  };
}

interface PatientContext {
  age?: number;
  diagnosis?: string;
  treatments?: string[];
  concerns?: string[];
  preferences?: string[];
  medicalHistory?: string[];
  currentSymptoms?: string[];
}

// EducationalResource interface was unused - functionality handled by EducationalResourceType

type ResourceType = 'guideline' | 'article' | 'video' | 'support_group';
type CommunicationStyle = 'technical' | 'simple' | 'empathetic';
type InformationDepth = 'basic' | 'detailed' | 'comprehensive';
type EmotionalState = 'anxious' | 'hopeful' | 'frustrated' | 'curious' | 'neutral';
type QueryComplexity = 'simple' | 'moderate' | 'complex';

// Type alias for educational resource structure
type EducationalResourceType = {
  title: string;
  type: ResourceType;
  description: string;
  url?: string;
};

// 🧠 INTERFACES PARA CONTEXTO CONVERSACIONAL + NESTED DOMAINS V13.1

interface ConversationHistory {
  userQueries: string[];
  aiResponses: string[];
  topics: string[];
  timestamp: Date[];
  userIntentions: string[];
  // 🧬 NESTED DOMAINS EXTENSIONS
  activeDomains: string[];
  domainSwitches: number;
  domainConfidences: number[];
}

interface ConversationMemory {
  patientContext: {
    age?: number;
    diagnosis?: string;
    treatments?: string[];
    concerns?: string[];
    preferences?: string[];
  };
  sessionFlow: {
    currentTopic: string;
    previousTopics: string[];
    unansweredQuestions: string[];
    followUpNeeded: boolean;
  };
  personalityProfile: {
    communicationStyle: CommunicationStyle;
    informationDepth: InformationDepth;
    emotionalState: EmotionalState;
  };
  // 🧬 NESTED DOMAINS MEMORY
  domainMemory: {
    preferredDomain: string;
    domainHistory: string[];
    domainSpecificContext: Map<string, Record<string, unknown>>;
    crossDomainInsights: NestedDomainInsight[];
  };
}

interface AnalyzedQuery {
  intent: string;
  entities: string[];
  emotion: string;
  complexity: QueryComplexity;
  isFollowUp: boolean;
  needsClarification: boolean;
  medicalTerms: string[];
}

interface SmartContext {
  clinicalAnalysis?: UnifiedClinicalAnalysis;
  successRates?: UnifiedSuccessRate[];
  conversationType: 'diagnostic' | 'therapeutic' | 'prognostic' | 'educational' | 'supportive' | 'follow_up';
  conversationHistory: ConversationHistory;
  memory: ConversationMemory;
  userInput?: UnifiedUserInput;
}

export class IntelligentConversationEngine {
  private static instance: IntelligentConversationEngine;
  private readonly conversationMemory: Map<string, ConversationMemory> = new Map();
  
  // 🧬 NESTED DOMAINS V13.1 INTEGRATION
  private nestedDomainOrchestrator: import('../nested-domains/SimplifiedNestedDomainOrchestrator').SimplifiedNestedDomainOrchestrator | null = null;
  
  private constructor() {
    // 🧠 Nested Domain Orchestrator will be initialized on first use
  }

  /**
   * 🧬 ENSURE NESTED DOMAINS ARE INITIALIZED
   */
  private async ensureNestedDomainsInitialized(): Promise<void> {
    if (this.nestedDomainOrchestrator === null) {
      await this.initializeNestedDomains();
    }
  }

  public static getInstance(): IntelligentConversationEngine {
    if (!IntelligentConversationEngine.instance) {
      IntelligentConversationEngine.instance = new IntelligentConversationEngine();
    }
    return IntelligentConversationEngine.instance;
  }

  /**
   * 🧬 INITIALIZE NESTED DOMAINS V13.1
   */
  private async initializeNestedDomains(): Promise<void> {
    try {
      const { SimplifiedNestedDomainOrchestrator } = await import('../nested-domains/SimplifiedNestedDomainOrchestrator');
      this.nestedDomainOrchestrator = new SimplifiedNestedDomainOrchestrator();
      console.log('🧬 Nested Domain Orchestrator initialized successfully');
    } catch (error) {
      console.warn('⚠️ Nested Domain Orchestrator not available, using traditional mode:', error);
      this.nestedDomainOrchestrator = null;
    }
  }

  /**
   * 🎯 PROCESAMIENTO PRINCIPAL DE CONVERSACIÓN V13.1 - NESTED DOMAINS INTELLIGENCE
   */
  public async processConversation(
    userQuery: string,
    userInput: UnifiedUserInput,
    context: SmartContext
  ): Promise<UnifiedMedicalResponse> {

    // 🧠 Ensure Nested Domains are initialized
    await this.ensureNestedDomainsInitialized();

    // 🧠 ANALIZAR INTENCIÓN Y CONTEXTO
    const analyzedQuery = this.analyzeUserQuery(userQuery, context);
    
    // ⚖️ ANÁLISIS ESPECÍFICO DE PESO Y METABOLISMO
    const weightAnalysis = this.analyzeWeightAndGenerateRecommendations(userInput, analyzedQuery.medicalTerms);
    
    // 🧬 NESTED DOMAIN CLASSIFICATION V13.1
    const domainInsights = await this.processNestedDomainClassification(userInput, context);
    
    // 💾 ACTUALIZAR MEMORIA CONVERSACIONAL
    this.updateConversationMemory(userQuery, analyzedQuery, context);
    
    // 🔄 GENERAR RESPUESTA CONTEXTUAL + DOMAIN-ENHANCED
    const response = await this.generateContextualResponse(analyzedQuery, context);
    
    // 🧬 ENHANCE RESPONSE WITH INSIGHTS
    this.enhanceResponseWithDomainInsights(response, domainInsights);
    this.enhanceResponseWithWeightRecommendations(response, weightAnalysis);
    
    // 📝 REGISTRAR RESPUESTA EN HISTORIAL
    this.recordResponse(response, context);
    
    return response;
  }

  /**
   * 🧬 PROCESAR CLASIFICACIÓN DE DOMINIOS ANIDADOS
   */
  private async processNestedDomainClassification(
    userInput: UnifiedUserInput, 
    context: SmartContext
  ): Promise<NestedDomainInsight[]> {
    let domainInsights: NestedDomainInsight[] = [];
    
    if (this.nestedDomainOrchestrator && userInput.symptoms && userInput.symptoms.length > 0) {
      try {
        const domainResult = await this.nestedDomainOrchestrator.classifyDomain(
          userInput.symptoms, 
          userInput
        );
        
        if (domainResult?.primaryDomain) {
          console.log(`🧬 Conversation enhanced with domain: ${domainResult.primaryDomain.name} (${domainResult.confidence.toFixed(3)})`);
          
          // Update conversation memory with domain context
          context.conversationHistory.activeDomains.push(domainResult.primaryDomain.name);
          context.conversationHistory.domainConfidences.push(domainResult.confidence);
          
          // Generate domain-specific insights
          domainInsights = [{
            domain: domainResult.primaryDomain.name,
            insight: `Conversación optimizada para especialización en ${domainResult.primaryDomain.name}`,
            evidenceLevel: 'B' as EvidenceLevel,
            clinicalRelevance: domainResult.confidence
          }];
          
          // Store domain context
          context.memory.domainMemory.preferredDomain = domainResult.primaryDomain.name;
          context.memory.domainMemory.domainHistory.push(domainResult.primaryDomain.name);
          context.memory.domainMemory.crossDomainInsights = domainInsights;
        }
      } catch (error) {
        console.warn('⚠️ Domain classification failed, using traditional conversation:', error);
      }
    }
    
    return domainInsights;
  }

  /**
   * 🧬 MEJORAR RESPUESTA CON INSIGHTS DE DOMINIO
   */
  private enhanceResponseWithDomainInsights(
    response: UnifiedMedicalResponse, 
    domainInsights: NestedDomainInsight[]
  ): void {
    if (domainInsights.length > 0) {
      const insight = domainInsights[0];
      
      if (response.recommendations && Array.isArray(response.recommendations)) {
        response.recommendations.push(`🧬 **Especialización de Dominio Activa**: ${insight.domain}`);
        response.recommendations.push(`🎯 **Confianza de Dominio**: ${(insight.clinicalRelevance * 100).toFixed(1)}%`);
      } else if (response.recommendations) {
        if (!response.recommendations.immediate) response.recommendations.immediate = [];
        response.recommendations.immediate.push(`🧬 **Especialización de Dominio Activa**: ${insight.domain}`);
        response.recommendations.immediate.push(`🎯 **Confianza de Dominio**: ${(insight.clinicalRelevance * 100).toFixed(1)}%`);
      }
    }
  }

  /**
   * ⚖️ MEJORAR RESPUESTA CON RECOMENDACIONES DE PESO
   */
  private enhanceResponseWithWeightRecommendations(
    response: UnifiedMedicalResponse,
    weightAnalysis: { weightCategory: WeightCategory; specificRecommendations: string[]; urgencyLevel: UrgencyLevel }
  ): void {
    if (weightAnalysis.specificRecommendations.length > 0) {
      if (response.recommendations && Array.isArray(response.recommendations)) {
        response.recommendations.push(`⚖️ **Optimización de Peso Detectada**: ${weightAnalysis.weightCategory}`);
        response.recommendations.push(...weightAnalysis.specificRecommendations.slice(0, 3));
      } else if (response.recommendations) {
        if (!response.recommendations.lifestyle) response.recommendations.lifestyle = [];
        response.recommendations.lifestyle.push(`⚖️ **Manejo de Peso**: ${weightAnalysis.weightCategory}`);
        response.recommendations.lifestyle.push(...weightAnalysis.specificRecommendations.slice(0, 2));
        
        if (weightAnalysis.urgencyLevel === 'high') {
          if (!response.recommendations.immediate) response.recommendations.immediate = [];
          response.recommendations.immediate.push('🚨 **Prioridad Alta**: Optimización de peso antes de tratamientos de fertilidad');
        }
      }
    }
  }

  /**
   * 🔍 ANÁLISIS INTELIGENTE DE CONSULTA
   */
  private analyzeUserQuery(userQuery: string, context: SmartContext): {
    intent: string;
    entities: string[];
    emotion: string;
    complexity: 'simple' | 'moderate' | 'complex';
    isFollowUp: boolean;
    needsClarification: boolean;
    medicalTerms: string[];
  } {
    const query = userQuery.toLowerCase();
    
    // Detectar intención principal
    let intent: string;
    if (query.includes('diagnóstico') || query.includes('qué tengo') || query.includes('problema')) {
      intent = 'diagnostic';
    } else if (query.includes('tratamiento') || query.includes('qué hacer') || query.includes('opciones')) {
      intent = 'therapeutic';
    } else if (query.includes('probabilidad') || query.includes('éxito') || query.includes('posibilidades')) {
      intent = 'prognostic';
    } else if (query.includes('explicar') || query.includes('entender') || query.includes('significa')) {
      intent = 'educational';
    } else if (query.includes('siento') || query.includes('preocupa') || query.includes('ayuda emocional')) {
      intent = 'supportive';
    } else {
      intent = 'general';
    }
    
    // Detectar entidades médicas
    const medicalTerms = this.extractMedicalTerms(query);
    
    // Detectar estado emocional
    let emotion = 'neutral';
    if (query.includes('preocup') || query.includes('miedo') || query.includes('ansi')) {
      emotion = 'anxious';
    } else if (query.includes('esperanz') || query.includes('optimis') || query.includes('confi')) {
      emotion = 'hopeful';
    } else if (query.includes('frustr') || query.includes('cansad') || query.includes('no entiendo')) {
      emotion = 'frustrated';
    }
    
    // Detectar si es seguimiento
    const isFollowUp = this.isFollowUpQuery(query, context);
    
    // Determinar complejidad de forma clara
    let complexity: 'simple' | 'moderate' | 'complex';
    if (medicalTerms.length > 2) {
      complexity = 'complex';
    } else if (query.length > 100) {
      complexity = 'moderate';
    } else {
      complexity = 'simple';
    }
    
    return {
      intent,
      entities: medicalTerms,
      emotion,
      complexity,
      isFollowUp,
      needsClarification: query.includes('?') && query.split(' ').length < 5,
      medicalTerms
    };
  }

  /**
   * 🧠 GENERAR RESPUESTA CONTEXTUAL INTELIGENTE
   */
  private async generateContextualResponse(
    analyzedQuery: AnalyzedQuery,
    context: SmartContext
  ): Promise<UnifiedMedicalResponse> {
    
    // 🔄 Si es seguimiento, usar contexto previo
    if (analyzedQuery.isFollowUp && context.memory.sessionFlow.currentTopic) {
      return this.generateFollowUpResponse(analyzedQuery, context);
    }

    // 🎯 Respuesta según intención detectada
    switch (analyzedQuery.intent) {
      case 'diagnostic':
        return this.generateEnhancedDiagnosticResponse(analyzedQuery, context);
      
      case 'therapeutic':
        return this.generateEnhancedTherapeuticResponse(analyzedQuery, context);
      
      case 'prognostic':
        return this.generateEnhancedPrognosticResponse(analyzedQuery, context);
      
      case 'educational':
        return this.generateEnhancedEducationalResponse(analyzedQuery, context);
      
      case 'supportive':
        return this.generateEnhancedSupportiveResponse(analyzedQuery, context);
      
      default:
        return this.generateEnhancedGeneralResponse(analyzedQuery, context);
    }
  }

  /**
   * 💾 ACTUALIZAR MEMORIA CONVERSACIONAL
   */
  private updateConversationMemory(userQuery: string, analyzedQuery: AnalyzedQuery, context: SmartContext): void {
    // Actualizar historial
    context.conversationHistory.userQueries.push(userQuery);
    context.conversationHistory.userIntentions.push(analyzedQuery.intent);
    context.conversationHistory.timestamp.push(new Date());
    
    // Actualizar memoria del paciente
    if (analyzedQuery.medicalTerms.length > 0) {
      context.memory.patientContext.concerns = [...(context.memory.patientContext.concerns || []), ...analyzedQuery.medicalTerms];
    }
    
    // Actualizar flujo de sesión
    context.memory.sessionFlow.currentTopic = analyzedQuery.intent;
    context.memory.sessionFlow.previousTopics.push(analyzedQuery.intent);
    
    // Actualizar perfil emocional
    if (analyzedQuery.emotion === 'anxious' || analyzedQuery.emotion === 'hopeful' || 
        analyzedQuery.emotion === 'frustrated' || analyzedQuery.emotion === 'curious') {
      context.memory.personalityProfile.emotionalState = analyzedQuery.emotion;
    }
  }

  /**
   * 📝 REGISTRAR RESPUESTA EN HISTORIAL
   */
  private recordResponse(response: UnifiedMedicalResponse, context: SmartContext): void {
    context.conversationHistory.aiResponses.push(response.primaryInfo);
    context.conversationHistory.topics.push(context.memory.sessionFlow.currentTopic);
  }

  /**
   * 🔍 EXTRAER TÉRMINOS MÉDICOS
   */
  private extractMedicalTerms(query: string): string[] {
    const medicalTerms = [
      'sop', 'pcos', 'endometriosis', 'ovarios', 'útero', 'fertilidad', 'embarazo',
      'ciclo', 'menstruación', 'ovulación', 'fiv', 'inseminación', 'hormona',
      'estrógeno', 'progesterona', 'fsh', 'lh', 'amh', 'reserva ovárica',
      'obesidad', 'sobrepeso', 'imc', 'peso', 'diabete', 'resistencia insulina',
      'metformina', 'ozempic', 'saxenda', 'semaglutida', 'liraglutida', 'orlistat',
      'cirugía bariátrica', 'bypass', 'manga gástrica', 'nutrición', 'dieta',
      'síndrome metabólico', 'hiperinsulinemia', 'glucosa', 'azúcar'
    ];
    
    return medicalTerms.filter(term => query.toLowerCase().includes(term));
  }

  /**
   * 📊 DETECTAR TÉRMINOS RELACIONADOS CON PESO Y METABOLISMO
   */
  private detectWeightTerms(input: string): string[] {
    const weightPatterns = [
      /\b(?:peso|sobrepeso|obesidad|obesa?|delgad[ao]s?|flac[ao]s?)\b/gi,
      /\b(?:IMC|índice\s+de\s+masa\s+corporal|masa\s+corporal)\b/gi,
      /\b(?:kilo|kilogramo|kg|libra|lb)\b/gi,
      /\b(?:dieta|alimentación|nutrición|nutricional)\b/gi,
      /\b(?:ejercicio|actividad\s+física|sedentario|gym|gimnasio)\b/gi,
      /\b(?:metformina|liraglutida|semaglutida|orlistat|saxenda|ozempic)\b/gi,
      /\b(?:bariátrica|bypass|manga\s+gástrica|cirugía\s+de\s+peso)\b/gi,
      /\b(?:resistencia\s+(?:a\s+)?la\s+insulina|hiperinsulinemia)\b/gi,
      /\b(?:síndrome\s+metabólico|diabetes|glucosa|azúcar)\b/gi
    ];

    const detectedTerms: string[] = [];
    
    weightPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(input)) !== null) {
        detectedTerms.push(match[0].toLowerCase());
        if (!pattern.global) break; // Evitar loop infinito si no es global
      }
    });

    return [...new Set(detectedTerms)]; // Eliminar duplicados
  }

  /**
   * 🔄 DETECTAR SI ES CONSULTA DE SEGUIMIENTO
   */
  private isFollowUpQuery(query: string, context: SmartContext): boolean {
    const followUpIndicators = ['también', 'además', 'y qué', 'pero', 'y si', 'entonces'];
    const hasIndicator = followUpIndicators.some(indicator => query.toLowerCase().includes(indicator));
    const hasHistory = context.conversationHistory.userQueries.length > 0;
    
    return hasIndicator && hasHistory;
  }

  /**
   * 🔄 GENERAR RESPUESTA DE SEGUIMIENTO
   */
  private generateFollowUpResponse(analyzedQuery: AnalyzedQuery, context: SmartContext): UnifiedMedicalResponse {
    const previousTopic = context.memory.sessionFlow.currentTopic;
    const previousQueries = context.conversationHistory.userQueries.slice(-3);
    
    return {
      primaryInfo: `Continuando con tu consulta sobre ${previousTopic}, entiendo que quieres profundizar más.`,
      detailedExplanation: `Basándome en nuestras conversaciones previas donde preguntaste "${previousQueries[previousQueries.length - 1]}", te proporciono información adicional específica.`,
      recommendations: {
        immediate: [`Profundizar en aspectos específicos de ${previousTopic}`],
        shortTerm: ['Aclarar dudas pendientes de la conversación'],
        longTerm: ['Seguimiento continuo del tema'],
        lifestyle: ['Aplicar información discutida previamente'],
        medical: ['Consulta especializada si es necesario']
      },
      relatedConditions: context.memory.patientContext.concerns || [],
      treatmentOptions: [],
      evidenceLevel: 'B',
      confidenceLevel: 80,
      followUpQuestions: [
        '¿Hay algún aspecto específico que no quedó claro?',
        '¿Te gustaría que profundice en algún punto particular?',
        '¿Tienes dudas adicionales sobre este tema?'
      ],
      redFlags: [],
      educationalResources: [],
      followUp: {
        recommended: true,
        timeframe: 'Inmediato',
        purpose: 'Continuación de conversación activa'
      }
    };
  }


  // 🛠️ MÉTODOS AUXILIARES PARA PERSONALIZACIÓN

  /**
   * 💬 PERSONALIZAR MENSAJE SEGÚN ESTADO EMOCIONAL
   */
  private personalizeMessage(baseMessage: string, emotionalState: string): string {
    switch (emotionalState) {
      case 'anxious':
        return `Entiendo tu preocupación. ${baseMessage}, y quiero asegurarte que estamos aquí para apoyarte.`;
      case 'hopeful':
        return `Me alegra ver tu actitud positiva. ${baseMessage} y exploraremos todas las opciones juntos.`;
      case 'frustrated':
        return `Comprendo tu frustración, es normal sentirse así. ${baseMessage} de manera clara y directa.`;
      default:
        return `${baseMessage}, trabajemos juntos para encontrar las mejores opciones.`;
    }
  }

  /**
   * 🤗 GENERAR APERTURA EMPÁTICA
   */
  private getEmpatheticOpening(emotionalState: string): string {
    switch (emotionalState) {
      case 'anxious':
        return 'Comprendo tu preocupación, y quiero darte tranquilidad.';
      case 'hopeful':
        return 'Me alegra tu actitud positiva hacia el proceso.';
      case 'frustrated':
        return 'Entiendo que este proceso puede ser frustrante.';
      default:
        return 'Basándome en tu consulta,';
    }
  }

  /**
   * 🔗 OBTENER CONDICIONES RELACIONADAS DESDE TÉRMINOS
   */
  private getRelatedConditionsFromTerms(medicalTerms: string[]): string[] {
    const relationMap: Record<string, string[]> = {
      'sop': ['Resistencia a la insulina', 'Síndrome metabólico'],
      'endometriosis': ['Adenomiosis', 'Adherencias pélvicas'],
      'fertilidad': ['Calidad ovocitaria', 'Reserva ovárica'],
      'hormona': ['Desequilibrio hormonal', 'Función tiroidea'],
      'obesidad': ['Resistencia a la insulina', 'Síndrome metabólico', 'Diabetes tipo 2', 'Anovulación crónica'],
      'sobrepeso': ['Alteraciones hormonales', 'Resistencia insulínica leve', 'Riesgo cardiovascular'],
      'peso': ['Alteraciones del eje reproductivo', 'Desequilibrios metabólicos'],
      'imc': ['Evaluación nutricional integral', 'Optimización metabólica'],
      'diabete': ['Resistencia a la insulina', 'Síndrome metabólico', 'Complicaciones vasculares'],
      'metformina': ['Resistencia a la insulina', 'SOP con componente metabólico'],
      'ozempic': ['Diabetes tipo 2', 'Obesidad', 'Pérdida de peso farmacológica'],
      'saxenda': ['Obesidad', 'Tratamiento farmacológico pérdida peso'],
      'semaglutida': ['Control glucémico', 'Pérdida de peso significativa'],
      'liraglutida': ['Diabetes y obesidad', 'Agonistas GLP-1']
    };
    
    const related: string[] = [];
    medicalTerms.forEach(term => {
      if (relationMap[term]) {
        related.push(...relationMap[term]);
      }
    });
    
    return related.length > 0 ? related : ['Evaluación integral de fertilidad'];
  }

  /**
   * ⚖️ DETECTAR PROBLEMAS DE PESO Y GENERAR RECOMENDACIONES ESPECÍFICAS
   */
  private analyzeWeightAndGenerateRecommendations(userInput: UnifiedUserInput, medicalTerms: string[]): {
    weightCategory: WeightCategory;
    specificRecommendations: string[];
    urgencyLevel: UrgencyLevel;
  } {
    // Detectar problemas de peso desde input del usuario o términos médicos
    const hasObesityTerms = medicalTerms.some(term => 
      ['obesidad', 'sobrepeso', 'imc', 'peso'].includes(term)
    );
    
    const bmi = userInput.bmi;
    let weightCategory: WeightCategory = 'normal';
    let specificRecommendations: string[] = [];
    let urgencyLevel: UrgencyLevel = 'low';
    
    if (bmi) {
      if (bmi < 18.5) {
        weightCategory = 'bajo_peso';
        urgencyLevel = 'medium';
        specificRecommendations = this.getLifestyleRecommendations('bajo_peso');
      } else if (bmi >= 25 && bmi < 30) {
        weightCategory = 'sobrepeso';
        urgencyLevel = 'medium';
        specificRecommendations = [
          'Pérdida de peso moderada 5-7% para optimizar fertilidad',
          'Dieta mediterránea con déficit calórico moderado (300-500 kcal/día)',
          'Ejercicio aeróbico 150 min/semana + entrenamiento fuerza',
          'Evaluación resistencia insulínica con HOMA-IR',
          'Control metabólico antes de iniciar tratamientos de fertilidad'
        ];
      } else if (bmi >= 30 && bmi < 35) {
        weightCategory = 'obesidad';
        urgencyLevel = 'high';
        specificRecommendations = this.getLifestyleRecommendations('obesidad');
      } else if (bmi >= 35) {
        weightCategory = 'obesidad_severa';
        urgencyLevel = 'high';
        specificRecommendations = this.getLifestyleRecommendations('obesidad_severa');
      }
    } else if (hasObesityTerms) {
      // Si no tenemos BMI pero mencionan peso, dar recomendaciones generales
      weightCategory = 'peso_mencionado';
      urgencyLevel = 'medium';
      specificRecommendations = [
        'Evaluación nutricional integral con cálculo de IMC',
        'Optimización del peso corporal según rango saludable (IMC 18.5-24.9)',
        'Análisis de composición corporal y metabolismo basal',
        'Plan nutricional personalizado según objetivos reproductivos',
        'Evaluación de factores metabólicos que afectan fertilidad'
      ];
    }
    
    return {
      weightCategory,
      specificRecommendations,
      urgencyLevel
    };
  }

  /**
   * 📝 GENERAR PREGUNTAS PERSONALIZADAS
   */
  private generatePersonalizedQuestions(analyzedQuery: AnalyzedQuery, context: string): string[] {
    const baseQuestions: Record<string, string[]> = {
      diagnostic: [
        '¿Cuándo comenzaron tus síntomas principales?',
        '¿Has notado patrones específicos en tu ciclo?',
        '¿Hay antecedentes familiares de problemas de fertilidad?'
      ],
      therapeutic: [
        '¿Has probado algún tratamiento anteriormente?',
        '¿Cuáles son tus principales preocupaciones sobre el tratamiento?',
        '¿Tienes preferencias sobre tipos de tratamiento?'
      ]
    };
    
    const questions = baseQuestions[context] || baseQuestions.diagnostic;
    
    // Personalizar según términos médicos mencionados
    if (analyzedQuery.medicalTerms.includes('sop')) {
      questions.push('¿Has observado irregularidades menstruales específicas?');
    }
    if (analyzedQuery.medicalTerms.includes('endometriosis')) {
      questions.push('¿Experimentas dolor pélvico intenso durante la menstruación?');
    }
    
    return questions.slice(0, 3); // Máximo 3 preguntas
  }

  /**
   * 📖 GENERAR EXPLICACIÓN PERSONALIZADA
   */
  private generatePersonalizedExplanation(
    diagnosis: DiagnosticAnalysis['primaryDiagnosis'], 
    patientContext: PatientContext, 
    complexity: string
  ): string {
    const baseExplanation = diagnosis.clinicalJustification || 'Análisis basado en la información proporcionada.';
    
    if (complexity === 'simple') {
      return `En términos sencillos: ${baseExplanation} Este diagnóstico tiene un ${diagnosis.confidence}% de confianza.`;
    } else if (complexity === 'complex') {
      return `Análisis clínico detallado: ${baseExplanation} La evidencia científica respalda este diagnóstico con un nivel de confianza del ${diagnosis.confidence}%, considerando factores específicos de tu caso.`;
    }
    
    return `${baseExplanation} Este diagnóstico se basa en evidencia clínica con ${diagnosis.confidence}% de confianza.`;
  }

  /**
   * 🏃‍♀️ OBTENER RECOMENDACIONES DE ESTILO DE VIDA
   */
  private getLifestyleRecommendations(pathology: string): string[] {
    const recommendations: Record<string, string[]> = {
      'sop': ['Dieta baja en índice glucémico', 'Ejercicio regular de intensidad moderada', 'Control de peso'],
      'endometriosis': ['Dieta antiinflamatoria', 'Técnicas de manejo del dolor', 'Ejercicio adaptado'],
      'obesidad': [
        'Pérdida de peso dirigida 5-10% del peso corporal total',
        'Dieta hipocalórica supervisada con déficit 500-750 kcal/día',
        'Ejercicio aeróbico 150-300 min/semana + resistencia 2x/semana',
        'Considerar tratamientos farmacológicos: Liraglutida (Saxenda) 7-10% pérdida, Semaglutida (Ozempic/Wegovy) 12-15% pérdida',
        'Evaluación metabólica con HOMA-IR, glucosa, insulina basal',
        'Metformina si resistencia insulínica confirmada (HOMA-IR >2.5)',
        'Apoyo multidisciplinario: nutrición, endocrinología, psicología'
      ],
      'obesidad_severa': [
        'Pérdida de peso sustancial ≥10% es prioridad absoluta antes de tratamientos',
        'Evaluación para cirugía bariátrica si IMC ≥40 o ≥35 con comorbilidades',
        'Agonistas GLP-1: Semaglutida (Wegovy) como primera línea farmacológica',
        'Orlistat como opción adicional (pérdida modesta 5-7%)',
        'Plan nutricional intensivo con seguimiento semanal',
        'Ejercicio supervisado y progresivo según tolerancia',
        'Manejo integral de resistencia insulínica con metformina + mio-inositol',
        'Preparación metabólica 3-6 meses antes de TRA'
      ],
      'bajo_peso': [
        'Ganancia de peso gradual hasta IMC 18.5-24.9',
        'Aumento ingesta calórica supervisada +300-500 kcal/día',
        'Evitar ejercicio excesivo que pueda suprimir ovulación',
        'Evaluación trastornos alimentarios si aplica',
        'Suplementación nutricional específica'
      ],
      'default': ['Alimentación balanceada', 'Ejercicio regular', 'Manejo del estrés', 'Sueño adecuado']
    };
    
    return recommendations[pathology] || recommendations.default;
  }

  /**
   * 📚 OBTENER RECURSOS EDUCATIVOS
   */
  private getEducationalResources(pathology: string): EducationalResourceType[] {
    return [
      {
        title: `Guía completa sobre ${pathology}`,
        type: 'guideline',
        description: 'Información médica actualizada y basada en evidencia'
      },
      {
        title: 'Recursos de apoyo para fertilidad',
        type: 'support_group',
        description: 'Comunidades y recursos de apoyo especializados'
      }
    ];
  }

  // 🎯 MÉTODOS MEJORADOS PARA OTROS TIPOS DE RESPUESTA

  /**
   * 💊 RESPUESTA TERAPÉUTICA MEJORADA
   */
  private generateEnhancedTherapeuticResponse(
    analyzedQuery: AnalyzedQuery,
    context: SmartContext
  ): UnifiedMedicalResponse {
    const clinicalAnalysis = context.clinicalAnalysis;
    const userInput = context.userInput;
    
    if (!clinicalAnalysis) {
      return this.generateTherapeuticResponseWithoutDiagnosis(analyzedQuery, context, userInput);
    }

    return this.generateTherapeuticResponseWithDiagnosis(analyzedQuery, context, clinicalAnalysis, userInput);
  }

  /**
   * 💊 GENERAR RESPUESTA TERAPÉUTICA SIN DIAGNÓSTICO
   */
  private generateTherapeuticResponseWithoutDiagnosis(
    analyzedQuery: AnalyzedQuery,
    context: SmartContext,
    userInput?: UnifiedUserInput
  ): UnifiedMedicalResponse {
    const emotionalState = context.memory.personalityProfile.emotionalState;
    const weightAnalysis = userInput ? this.analyzeWeightAndGenerateRecommendations(userInput, analyzedQuery.medicalTerms) : null;
    
    const baseRecommendations = this.buildBaseRecommendationsWithoutDiagnosis(weightAnalysis);
    const weightAnalysisText = weightAnalysis ? ` He detectado aspectos relacionados con ${weightAnalysis.weightCategory} que requieren atención especializada.` : '';
    
    return {
      primaryInfo: this.personalizeMessage('Para recomendarte el mejor tratamiento', emotionalState),
      detailedExplanation: `Considerando que mencionas "${analyzedQuery.medicalTerms.join(', ')}", necesito más información sobre tu diagnóstico para sugerir el plan terapéutico más apropiado.${weightAnalysisText}`,
      recommendations: baseRecommendations,
      relatedConditions: this.getRelatedConditionsFromTerms(analyzedQuery.medicalTerms),
      treatmentOptions: [],
      evidenceLevel: 'C',
      confidenceLevel: 50,
      followUpQuestions: this.generatePersonalizedQuestions(analyzedQuery, 'therapeutic'),
      redFlags: weightAnalysis?.urgencyLevel === 'high' ? ['Optimización de peso urgente antes de tratamientos'] : [],
      educationalResources: [],
      followUp: {
        recommended: true,
        timeframe: '2-3 semanas',
        purpose: 'Establecimiento de plan terapéutico basado en diagnóstico'
      }
    };
  }

  /**
   * 💊 GENERAR RESPUESTA TERAPÉUTICA CON DIAGNÓSTICO
   */
  private generateTherapeuticResponseWithDiagnosis(
    analyzedQuery: AnalyzedQuery,
    context: SmartContext,
    clinicalAnalysis: UnifiedClinicalAnalysis,
    userInput?: UnifiedUserInput
  ): UnifiedMedicalResponse {
    const emotionalState = context.memory.personalityProfile.emotionalState;
    const treatment = clinicalAnalysis.treatmentDecisionTree;
    const weightAnalysis = userInput ? this.analyzeWeightAndGenerateRecommendations(userInput, analyzedQuery.medicalTerms) : null;
    
    const recommendations = this.buildRecommendationsWithDiagnosis(clinicalAnalysis, weightAnalysis);
    const weightOptimizationText = weightAnalysis ? ` He identificado aspectos de ${weightAnalysis.weightCategory} que optimizaremos paralelamente.` : '';
    
    return {
      primaryInfo: `${this.getEmpatheticOpening(emotionalState)} El tratamiento recomendado es: ${treatment.firstLine.treatment}`,
      detailedExplanation: `Basándome en tu diagnóstico específico y considerando tu perfil personal, esta opción terapéutica ofrece la mejor combinación de efectividad y seguridad para tu caso particular.${weightOptimizationText}`,
      recommendations,
      relatedConditions: clinicalAnalysis.relatedConditions,
      treatmentOptions: this.buildTreatmentOptions(treatment, weightAnalysis),
      evidenceLevel: 'A',
      confidenceLevel: 85,
      followUpQuestions: this.generatePersonalizedQuestions(analyzedQuery, 'therapeutic'),
      redFlags: weightAnalysis?.urgencyLevel === 'high' ? ['Optimización de peso prioritaria antes de tratamientos'] : [],
      educationalResources: this.getEducationalResources(treatment.firstLine.treatment),
      followUp: {
        recommended: true,
        timeframe: '2-4 semanas',
        purpose: 'Inicio de tratamiento y evaluación de respuesta inicial'
      }
    };
  }

  /**
   * 🛠️ CONSTRUIR RECOMENDACIONES BASE SIN DIAGNÓSTICO
   */
  private buildBaseRecommendationsWithoutDiagnosis(
    weightAnalysis: { weightCategory: WeightCategory; specificRecommendations: string[]; urgencyLevel: UrgencyLevel } | null
  ) {
    const baseRecommendations = {
      immediate: ['Obtener diagnóstico médico completo y preciso'],
      shortTerm: ['Consulta con especialista en medicina reproductiva'],
      longTerm: ['Desarrollo de plan de tratamiento integral personalizado'],
      lifestyle: ['Optimización de factores que influyen en el tratamiento'],
      medical: ['Evaluación médica completa previa al tratamiento']
    };

    if (weightAnalysis?.specificRecommendations.length) {
      if (weightAnalysis.urgencyLevel === 'high') {
        baseRecommendations.immediate.unshift('🚨 Optimización de peso prioritaria antes de tratamientos');
      }
      baseRecommendations.lifestyle.push(...weightAnalysis.specificRecommendations.slice(0, 2));
      
      if (weightAnalysis.weightCategory === 'obesidad_severa') {
        baseRecommendations.medical.push('Evaluación para cirugía bariátrica si IMC ≥40');
        baseRecommendations.medical.push('Consulta endocrinología para agonistas GLP-1 (Semaglutida/Liraglutida)');
      }
    }

    return baseRecommendations;
  }

  /**
   * 🛠️ CONSTRUIR RECOMENDACIONES CON DIAGNÓSTICO
   */
  private buildRecommendationsWithDiagnosis(
    clinicalAnalysis: UnifiedClinicalAnalysis,
    weightAnalysis: { weightCategory: WeightCategory; specificRecommendations: string[]; urgencyLevel: UrgencyLevel } | null
  ) {
    const treatment = clinicalAnalysis.treatmentDecisionTree;
    let lifestyleRecommendations = this.getLifestyleRecommendations(clinicalAnalysis.primaryDiagnosis.pathology);
    
    if (weightAnalysis?.specificRecommendations.length) {
      lifestyleRecommendations = [...lifestyleRecommendations, ...weightAnalysis.specificRecommendations.slice(0, 2)];
    }
    
    return {
      immediate: [`Iniciar preparación para ${treatment.firstLine.treatment}`].concat(
        weightAnalysis?.urgencyLevel === 'high' ? ['🚨 Optimización de peso prioritaria'] : []
      ),
      shortTerm: ['Seguimiento semanal durante las primeras 4 semanas'],
      longTerm: ['Evaluación de respuesta y ajustes cada 2-3 meses'],
      lifestyle: lifestyleRecommendations,
      medical: ['Monitoreo médico especializado y seguimiento de parámetros'].concat(
        weightAnalysis?.weightCategory === 'obesidad_severa' ? 
        ['Consulta endocrinología para agonistas GLP-1', 'Evaluación cirugía bariátrica si indicada'] : []
      )
    };
  }

  /**
   * 🛠️ CONSTRUIR OPCIONES DE TRATAMIENTO
   */
  private buildTreatmentOptions(
    treatment: { firstLine: { treatment: string } },
    weightAnalysis: { weightCategory: WeightCategory; specificRecommendations: string[]; urgencyLevel: UrgencyLevel } | null
  ) {
    return [
      {
        treatment: treatment.firstLine.treatment,
        appropriateness: 90,
        timing: 'Inicio recomendado en próximo ciclo menstrual',
        considerations: ['Opción de primera línea basada en evidencia científica', 'Personalizada según tu perfil clínico'].concat(
          weightAnalysis ? [`Considerando optimización de ${weightAnalysis.weightCategory}`] : []
        )
      }
    ];
  }

  /**
   * 🔮 RESPUESTA PRONÓSTICA MEJORADA
   */
  private generateEnhancedPrognosticResponse(
    analyzedQuery: AnalyzedQuery,
    context: SmartContext
  ): UnifiedMedicalResponse {
    const successRates = context.successRates;
    const emotionalState = context.memory.personalityProfile.emotionalState;
    
    if (!successRates || successRates.length === 0) {
      return {
        primaryInfo: this.personalizeMessage('Para darte un pronóstico preciso y personalizado', emotionalState),
        detailedExplanation: `Entiendo tu interés en conocer las probabilidades de éxito. Para calcular un pronóstico específico para tu caso, necesito analizar múltiples factores individuales que influyen en las tasas de éxito.`,
        recommendations: {
          immediate: ['Evaluación integral para cálculo de probabilidades personalizadas'],
          shortTerm: ['Análisis de factores pronósticos específicos'],
          longTerm: ['Desarrollo de estrategia optimizada según pronóstico'],
          lifestyle: ['Optimización de factores modificables que influyen en el éxito'],
          medical: ['Estudios predictivos especializados']
        },
        relatedConditions: ['Factores que influyen en el pronóstico de fertilidad'],
        treatmentOptions: [],
        evidenceLevel: 'C',
        confidenceLevel: 40,
        followUpQuestions: [
          '¿Qué aspectos específicos del pronóstico te preocupan más?',
          '¿Has considerado algún tratamiento en particular?',
          '¿Te gustaría conocer estrategias para optimizar tus probabilidades?'
        ],
        redFlags: [],
        educationalResources: [],
        followUp: {
          recommended: true,
          timeframe: '1-2 semanas',
          purpose: 'Análisis detallado para pronóstico personalizado'
        }
      };
    }

    const bestOption = successRates.reduce((best, current) => 
      current.confidence > best.confidence ? current : best,
      successRates[0]
    );

    const perCycleMatch = /(\d+)%/.exec(bestOption.successRate.perCycle);
    const probPercent = perCycleMatch ? parseInt(perCycleMatch[1], 10) : 0;
    
    return {
      primaryInfo: `${this.getEmpatheticOpening(emotionalState)} Tu probabilidad de éxito con ${bestOption.technique} es del ${bestOption.successRate.perCycle} por ciclo`,
      detailedExplanation: `Basándome en tu perfil clínico específico y en datos de estudios similares, esta técnica muestra las mejores probabilidades para tu caso. Es importante recordar que estos porcentajes son estimaciones basadas en evidencia científica y pueden variar según múltiples factores individuales.`,
      recommendations: {
        immediate: [`Considerar planificación detallada para ${bestOption.technique}`],
        shortTerm: ['Preparación física y emocional óptima (6-8 semanas)'],
        longTerm: ['Estrategia de múltiples ciclos si es necesario'],
        lifestyle: ['Optimización integral de factores que influyen en el éxito'],
        medical: ['Seguimiento especializado y monitoreo predictivo']
      },
      relatedConditions: ['Factores que potencian las probabilidades de éxito'],
      treatmentOptions: [
        {
          treatment: bestOption.technique,
          appropriateness: probPercent,
          timing: 'Inicio óptimo en próximo ciclo tras preparación',
          considerations: [
            `Nivel de confianza científica: ${bestOption.confidence}%`,
            'Opción con mejor pronóstico según tu perfil específico',
            'Probabilidad acumulada mejora con múltiples ciclos'
          ]
        }
      ],
      evidenceLevel: bestOption.evidenceLevel as EvidenceLevel,
      confidenceLevel: bestOption.confidence,
      followUpQuestions: [
        '¿Te gustaría discutir estrategias específicas para optimizar estas probabilidades?',
        '¿Tienes preguntas sobre la preparación para el tratamiento?',
        '¿Te interesa conocer sobre opciones de apoyo durante el proceso?'
      ],
      redFlags: [],
      educationalResources: this.getEducationalResources(bestOption.technique),
      followUp: {
        recommended: true,
        timeframe: '1-3 semanas',
        purpose: 'Preparación y optimización pre-tratamiento'
      }
    };
  }

  /**
   * 📚 RESPUESTA EDUCACIONAL MEJORADA
   */
  private generateEnhancedEducationalResponse(
    analyzedQuery: AnalyzedQuery,
    context: SmartContext
  ): UnifiedMedicalResponse {
    const emotionalState = context.memory.personalityProfile.emotionalState;
    const complexity = analyzedQuery.complexity;
    
    return {
      primaryInfo: this.personalizeMessage('Mi objetivo es ayudarte a comprender completamente tu situación', emotionalState),
      detailedExplanation: this.generateEducationalContent(analyzedQuery.medicalTerms, complexity),
      recommendations: {
        immediate: ['Acceso a fuentes médicas confiables y actualizadas'],
        shortTerm: ['Educación progresiva sobre aspectos específicos de tu caso'],
        longTerm: ['Desarrollo de conocimiento sólido para toma de decisiones'],
        lifestyle: ['Aplicación práctica de conocimientos en el día a día'],
        medical: ['Discusión educativa detallada con especialista']
      },
      relatedConditions: this.getRelatedConditionsFromTerms(analyzedQuery.medicalTerms),
      treatmentOptions: [],
      evidenceLevel: 'A',
      confidenceLevel: 95,
      followUpQuestions: this.generateEducationalQuestions(analyzedQuery.medicalTerms),
      redFlags: [],
      educationalResources: this.getComprehensiveEducationalResources(analyzedQuery.medicalTerms),
      followUp: {
        recommended: true,
        timeframe: 'Educación continua',
        purpose: 'Fortalecimiento del conocimiento médico personalizado'
      }
    };
  }

  /**
   * 💝 RESPUESTA DE APOYO EMOCIONAL MEJORADA
   */
  private generateEnhancedSupportiveResponse(
    analyzedQuery: AnalyzedQuery,
    context: SmartContext
  ): UnifiedMedicalResponse {
    const emotionalState = context.memory.personalityProfile.emotionalState;
    
    return {
      primaryInfo: this.getEmpatheticOpening(emotionalState),
      detailedExplanation: this.generateEmotionalSupport(emotionalState, analyzedQuery),
      recommendations: {
        immediate: ['Reconocimiento y validación de todas tus emociones'],
        shortTerm: ['Conexión con recursos de apoyo especializados'],
        longTerm: ['Desarrollo de estrategias de afrontamiento personalizadas'],
        lifestyle: ['Técnicas de bienestar emocional y manejo del estrés'],
        medical: ['Evaluación de necesidad de apoyo psicológico profesional']
      },
      relatedConditions: ['Bienestar emocional durante el proceso de fertilidad'],
      treatmentOptions: [],
      evidenceLevel: 'B',
      confidenceLevel: 85,
      followUpQuestions: this.generateEmotionalQuestions(emotionalState),
      redFlags: [],
      educationalResources: this.getEmotionalSupportResources(),
      followUp: {
        recommended: true,
        timeframe: 'Según necesidad personal',
        purpose: 'Apoyo emocional continuo y personalizado'
      }
    };
  }

  /**
   * 🌐 RESPUESTA GENERAL MEJORADA
   */
  private generateEnhancedGeneralResponse(
    analyzedQuery: AnalyzedQuery,
    context: SmartContext
  ): UnifiedMedicalResponse {
    const emotionalState = context.memory.personalityProfile.emotionalState;
    
    return {
      primaryInfo: `${this.getEmpatheticOpening(emotionalState)} Soy tu asistente médico especializado en fertilidad y salud reproductiva.`,
      detailedExplanation: `Estoy aquí para proporcionarte información médica precisa, actualizada y completamente personalizada. Basándome en que mencionas "${analyzedQuery.medicalTerms.join(', ')}", puedo ayudarte de manera más específica si me das más detalles.`,
      recommendations: {
        immediate: ['Especificar tu consulta para respuesta más personalizada'],
        shortTerm: ['Análisis detallado de tu situación particular'],
        longTerm: ['Desarrollo de plan de acción médico integral'],
        lifestyle: ['Consideración de factores integrales de salud reproductiva'],
        medical: ['Evaluación médica especializada según tus necesidades']
      },
      relatedConditions: this.getRelatedConditionsFromTerms(analyzedQuery.medicalTerms),
      treatmentOptions: [],
      evidenceLevel: 'C',
      confidenceLevel: 70,
      followUpQuestions: this.generatePersonalizedQuestions(analyzedQuery, 'general'),
      redFlags: [],
      educationalResources: this.getEducationalResources('fertilidad general'),
      followUp: {
        recommended: true,
        timeframe: '1 semana',
        purpose: 'Seguimiento personalizado según información específica'
      }
    };
  }

  // 🛠️ MÉTODOS AUXILIARES ADICIONALES

  /**
   * 📖 GENERAR CONTENIDO EDUCACIONAL
   */
  private generateEducationalContent(medicalTerms: string[], complexity: string): string {
    if (medicalTerms.length === 0) {
      return 'La información médica precisa es fundamental para tomar decisiones informadas sobre tu salud reproductiva.';
    }

    const term = medicalTerms[0];
    const educationalMap: Record<string, Record<string, string>> = {
      'sop': {
        simple: 'El SOP es una condición hormonal que afecta los ovarios. Puede causar ciclos irregulares y dificultar el embarazo.',
        complex: 'El Síndrome de Ovarios Poliquísticos es un trastorno endocrino-metabólico caracterizado por hiperandrogenismo, disfunción ovulatoria y morfología ovárica poliquística.'
      },
      'endometriosis': {
        simple: 'La endometriosis ocurre cuando el tejido que reviste el útero crece fuera de él, causando dolor y problemas de fertilidad.',
        complex: 'La endometriosis es una enfermedad ginecológica benigna caracterizada por la presencia de glándulas y estroma endometrial fuera de la cavidad uterina.'
      }
    };

    const content = educationalMap[term]?.[complexity] || 
                   `Te explico sobre ${term} de manera que puedas comprenderlo completamente y tomar decisiones informadas.`;
    
    return content;
  }

  /**
   * ❓ GENERAR PREGUNTAS EDUCACIONALES
   */
  private generateEducationalQuestions(medicalTerms: string[]): string[] {
    const baseQuestions = [
      '¿Qué aspectos específicos te gustaría comprender mejor?',
      '¿Hay términos médicos que no te quedan claros?',
      '¿Te gustaría recursos adicionales sobre algún tema en particular?'
    ];

    if (medicalTerms.includes('sop')) {
      baseQuestions.push('¿Te gustaría saber más sobre el manejo del SOP?');
    }
    if (medicalTerms.includes('endometriosis')) {
      baseQuestions.push('¿Te gustaría información sobre opciones de tratamiento para endometriosis?');
    }

    return baseQuestions.slice(0, 3);
  }

  /**
   * 📚 OBTENER RECURSOS EDUCATIVOS COMPLETOS
   */
  private getComprehensiveEducationalResources(medicalTerms: string[]): EducationalResourceType[] {
    const resources: EducationalResourceType[] = [
      {
        title: 'Biblioteca médica de fertilidad',
        type: 'article',
        description: 'Acceso a información médica actualizada y confiable'
      }
    ];

    medicalTerms.forEach(term => {
      resources.push({
        title: `Guía especializada: ${term}`,
        type: 'guideline',
        description: `Información detallada y basada en evidencia sobre ${term}`
      });
    });

    return resources;
  }

  /**
   * 💙 GENERAR APERTURA DE APOYO EMOCIONAL
   */
  private getEmotionalSupportOpening(emotionalState: string): string {
    switch (emotionalState) {
      case 'anxious':
        return 'Entiendo perfectamente tu ansiedad. Es una reacción completamente normal en este proceso.';
      case 'frustrated':
        return 'Comprendo profundamente tu frustración. Este proceso puede ser muy desafiante emocionalmente.';
      case 'hopeful':
        return 'Me alegra mucho ver tu esperanza y actitud positiva. Es una fortaleza muy valiosa.';
      default:
        return 'Estoy aquí para apoyarte emocionalmente en este proceso tan importante.';
    }
  }

  /**
   * 🤗 GENERAR APOYO EMOCIONAL PERSONALIZADO
   */
  private generateEmotionalSupport(emotionalState: string, _analyzedQuery: AnalyzedQuery): string {
    const baseSupport = 'La experiencia de la infertilidad involucra una amplia gama de emociones complejas, y es completamente normal sentir lo que sientes.';
    
    switch (emotionalState) {
      case 'anxious':
        return `${baseSupport} La ansiedad que experimentas es muy común. Muchas personas pasan por sentimientos similares, y existen estrategias efectivas para manejarla.`;
      case 'frustrated':
        return `${baseSupport} Tu frustración es completamente válida. Este proceso puede ser muy desafiante, y es importante reconocer estos sentimientos.`;
      case 'hopeful':
        return `${baseSupport} Tu esperanza es una fortaleza increíble que te ayudará durante todo este proceso.`;
      default:
        return `${baseSupport} Cada persona vive este proceso de manera única, y todas las emociones son válidas.`;
    }
  }

  /**
   * ❓ GENERAR PREGUNTAS EMOCIONALES
   */
  private generateEmotionalQuestions(emotionalState: string): string[] {
    const baseQuestions = [
      '¿Cómo te sientes con la información que has recibido hasta ahora?',
      '¿Hay algo específico que te está generando más preocupación?',
      '¿Te sientes con suficiente apoyo en tu entorno personal?'
    ];

    switch (emotionalState) {
      case 'anxious':
        baseQuestions.push('¿Te gustaría conocer técnicas específicas para manejar la ansiedad?');
        break;
      case 'frustrated':
        baseQuestions.push('¿Qué aspectos del proceso te resultan más frustrantes?');
        break;
      case 'hopeful':
        baseQuestions.push('¿Cómo podemos mantener y fortalecer esa esperanza?');
        break;
    }

    return baseQuestions.slice(0, 3);
  }

  /**
   * 💙 OBTENER RECURSOS DE APOYO EMOCIONAL
  /**
   * 💙 OBTENER RECURSOS DE APOYO EMOCIONAL
   */
  private getEmotionalSupportResources(): EducationalResourceType[] {
    return [
      {
        title: 'Grupos de apoyo especializados en fertilidad',
        type: 'support_group',
        description: 'Conexión con otras personas que comparten experiencias similares'
      },
      {
        title: 'Técnicas de bienestar emocional',
        type: 'article',
        description: 'Estrategias prácticas para el manejo emocional durante el proceso'
      },
      {
        title: 'Apoyo psicológico especializado',
        type: 'article',
        description: 'Profesionales especializados en salud mental y fertilidad'
      }
    ];
  }

  // ⚡ MÉTODO DE COMPATIBILIDAD (mantener API anterior)
  public async processConversationLegacy(
    userQuery: string,
    userInput: UnifiedUserInput,
    context: {
      clinicalAnalysis?: UnifiedClinicalAnalysis;
      successRates?: UnifiedSuccessRate[];
      conversationType: 'diagnostic' | 'therapeutic' | 'prognostic' | 'educational' | 'supportive';
    }
  ): Promise<UnifiedMedicalResponse> {
    
    // Convertir contexto legacy a SmartContext
    const smartContext: SmartContext = {
      clinicalAnalysis: context.clinicalAnalysis,
      successRates: context.successRates,
      conversationType: context.conversationType,
      conversationHistory: {
        userQueries: [],
        aiResponses: [],
        topics: [],
        timestamp: [],
        userIntentions: [],
        // 🧬 NESTED DOMAINS INITIALIZATION
        activeDomains: [],
        domainSwitches: 0,
        domainConfidences: []
      },
      memory: {
        patientContext: {},
        sessionFlow: {
          currentTopic: context.conversationType,
          previousTopics: [],
          unansweredQuestions: [],
          followUpNeeded: false
        },
        personalityProfile: {
          communicationStyle: 'simple',
          informationDepth: 'detailed',
          emotionalState: 'neutral'
        },
        // 🧬 NESTED DOMAINS MEMORY INITIALIZATION
        domainMemory: {
          preferredDomain: 'general',
          domainHistory: [],
          domainSpecificContext: new Map(),
          crossDomainInsights: []
        }
      },
      userInput
    };

    return this.processConversation(userQuery, userInput, smartContext);
  }

  /**
   * 🔬 RESPUESTA DIAGNÓSTICA MEJORADA
   */
  private generateEnhancedDiagnosticResponse(
    analyzedQuery: AnalyzedQuery,
    context: SmartContext
  ): UnifiedMedicalResponse {
    const clinicalAnalysis = context.clinicalAnalysis;
    const patientContext = context.memory.patientContext;
    const emotionalState = context.memory.personalityProfile.emotionalState;
    
    if (!clinicalAnalysis) {
      return {
        primaryInfo: this.personalizeMessage('Para darte un diagnóstico preciso', emotionalState),
        detailedExplanation: `Basándome en que mencionas "${analyzedQuery.medicalTerms.join(', ')}", necesito información más específica sobre tu situación para realizar un análisis clínico completo.`,
        recommendations: {
          immediate: ['Recopilar información médica detallada sobre síntomas específicos'],
          shortTerm: ['Programar consulta con especialista en fertilidad'],
          longTerm: ['Desarrollar plan diagnóstico personalizado según hallazgos'],
          lifestyle: ['Llevar registro de síntomas y ciclos para facilitar diagnóstico'],
          medical: ['Estudios hormonales básicos y evaluación ginecológica']
        },
        relatedConditions: this.getRelatedConditionsFromTerms(analyzedQuery.medicalTerms),
        treatmentOptions: [],
        evidenceLevel: 'C',
        confidenceLevel: 60,
        followUpQuestions: this.generatePersonalizedQuestions(analyzedQuery, 'diagnostic'),
        redFlags: [],
        educationalResources: [],
        followUp: {
          recommended: true,
          timeframe: '1-2 semanas',
          purpose: 'Recopilación de información clínica completa'
        }
      };
    }

    const diagnosis = clinicalAnalysis.primaryDiagnosis;
    
    return {
      primaryInfo: `${this.getEmpatheticOpening(emotionalState)} He identificado: ${diagnosis.pathologyES}`,
      detailedExplanation: this.generatePersonalizedExplanation(diagnosis, patientContext, analyzedQuery.complexity),
      recommendations: {
        immediate: [`Confirmación diagnóstica con especialista`],
        shortTerm: ['Seguimiento médico especializado cada 4-6 semanas'],
        longTerm: ['Plan de tratamiento integral personalizado'],
        lifestyle: this.getLifestyleRecommendations(diagnosis.pathology),
        medical: [`Estudios complementarios específicos para ${diagnosis.pathologyES}`]
      },
      relatedConditions: clinicalAnalysis.relatedConditions,
      treatmentOptions: [],
      evidenceLevel: diagnosis.evidenceLevel,
      confidenceLevel: diagnosis.confidence,
      followUpQuestions: this.generatePersonalizedQuestions(analyzedQuery, 'diagnostic'),
      redFlags: clinicalAnalysis.riskStratification.urgencyIndicators,
      educationalResources: this.getEducationalResources(diagnosis.pathology),
      followUp: {
        recommended: true,
        timeframe: '2-3 semanas',
        purpose: 'Seguimiento diagnóstico y plan terapéutico'
      }
    };
  }

  /**
   * 💊 RESPUESTA TERAPÉUTICA
   */
  private generateTherapeuticResponse(
    _userQuery: string,
    _userInput: UnifiedUserInput,
    clinicalAnalysis?: UnifiedClinicalAnalysis
  ): UnifiedMedicalResponse {
    
    if (!clinicalAnalysis) {
      return {
        primaryInfo: 'Para recomendarte el mejor tratamiento, primero necesito conocer tu diagnóstico específico.',
        detailedExplanation: 'El plan terapéutico debe fundamentarse en un diagnóstico clínico preciso y personalizado.',
        recommendations: {
          immediate: ['Obtener diagnóstico médico preciso'],
          shortTerm: ['Consulta con especialista en fertilidad'],
          longTerm: ['Desarrollo de plan de tratamiento personalizado'],
          lifestyle: ['Mantenimiento de hábitos saludables'],
          medical: ['Evaluación médica completa y detallada']
        },
        relatedConditions: ['Diagnóstico médico pendiente'],
        treatmentOptions: [],
        evidenceLevel: 'C',
        confidenceLevel: 40,
        followUpQuestions: [
          '¿Tienes algún diagnóstico médico previo?',
          '¿Has probado algún tratamiento anteriormente?',
          '¿Cuáles son tus principales preocupaciones sobre el tratamiento?'
        ],
        redFlags: [],
        educationalResources: [],
        followUp: {
          recommended: true,
          timeframe: '2-3 semanas',
          purpose: 'Obtención de diagnóstico para plan terapéutico'
        }
      };
    }

    const treatment = clinicalAnalysis.treatmentDecisionTree;
    
    return {
      primaryInfo: `Tratamiento recomendado: ${treatment.firstLine.treatment}`,
      detailedExplanation: `Basándome en tu diagnóstico de ${clinicalAnalysis.primaryDiagnosis.pathology}, esta es la primera línea de tratamiento con mayor probabilidad de éxito según la evidencia médica actual.`,
      recommendations: {
        immediate: [treatment.firstLine.treatment],
        shortTerm: ['Seguimiento de la respuesta al tratamiento'],
        longTerm: ['Evaluación continua de resultados y ajustes'],
        lifestyle: ['Apoyo nutricional y actividad física adecuada'],
        medical: ['Monitoreo médico regular y específico']
      },
      relatedConditions: clinicalAnalysis.relatedConditions,
      treatmentOptions: [
        {
          treatment: treatment.firstLine.treatment,
          appropriateness: 90,
          timing: 'Iniciación inmediata recomendada',
          considerations: ['Primera línea de tratamiento estándar', 'Basado en evidencia científica']
        }
      ],
      evidenceLevel: 'A',
      confidenceLevel: 85,
      followUpQuestions: [
        '¿Tienes experiencia previa con tratamientos de fertilidad?',
        '¿Qué aspectos del tratamiento te generan más dudas o preocupaciones?',
        '¿Hay factores específicos que debería considerar en tu caso?'
      ],
      redFlags: [],
      educationalResources: [],
      followUp: {
        recommended: true,
        timeframe: '4-6 semanas',
        purpose: 'Evaluación de respuesta al tratamiento y ajustes'
      }
    };
  }

  /**
   * 🔮 RESPUESTA PRONÓSTICA
   */
  private generatePrognosticResponse(
    _userQuery: string,
    _userInput: UnifiedUserInput,
    successRates?: UnifiedSuccessRate[]
  ): UnifiedMedicalResponse {
    
    if (!successRates || successRates.length === 0) {
      return {
        primaryInfo: 'Para proporcionarte un pronóstico preciso, necesito calcular tus probabilidades de éxito personalizadas.',
        detailedExplanation: 'El pronóstico depende de múltiples factores individuales que requieren análisis detallado y personalizado.',
        recommendations: {
          immediate: ['Evaluación personalizada completa'],
          shortTerm: ['Cálculo de probabilidades específicas'],
          longTerm: ['Desarrollo de plan de seguimiento'],
          lifestyle: ['Optimización de factores modificables'],
          medical: ['Estudios predictivos y análisis de riesgo']
        },
        relatedConditions: ['Análisis de factores pronósticos pendiente'],
        treatmentOptions: [],
        evidenceLevel: 'C',
        confidenceLevel: 30,
        followUpQuestions: [
          '¿Qué tratamientos de fertilidad estás considerando?',
          '¿Cuáles son tus expectativas sobre las probabilidades de éxito?',
          '¿Hay factores específicos que te preocupan sobre el pronóstico?'
        ],
        redFlags: [],
        educationalResources: [],
        followUp: {
          recommended: true,
          timeframe: '1-2 semanas',
          purpose: 'Análisis detallado de probabilidades personalizadas'
        }
      };
    }

    const bestOption = successRates.reduce((best, current) => 
      current.confidence > best.confidence ? current : best,
      successRates[0] // valor inicial
    );

    const perCycleMatch = /(\d+)%/.exec(bestOption.successRate.perCycle);
    const probPercent = perCycleMatch ? parseInt(perCycleMatch[1], 10) : 0;
    
    return {
      primaryInfo: `Tu probabilidad de éxito con ${bestOption.technique} es del ${bestOption.successRate.perCycle} por ciclo`,
      detailedExplanation: `Según tu perfil médico personalizado, esta opción terapéutica muestra el mayor índice de probabilidad de éxito. La probabilidad acumulada tras 3 ciclos consecutivos es del ${bestOption.successRate.cumulative}.`,
      recommendations: {
        immediate: [`Considerar iniciar tratamiento con ${bestOption.technique}`],
        shortTerm: ['Preparación óptima para el tratamiento'],
        longTerm: ['Planificación de múltiples ciclos si es necesario'],
        lifestyle: ['Optimización de todos los factores que influyen en el éxito'],
        medical: ['Seguimiento especializado y monitoreo continuo']
      },
      relatedConditions: ['Factores que influyen positivamente en el éxito del tratamiento'],
      treatmentOptions: [
        {
          treatment: bestOption.technique,
          appropriateness: probPercent,
          timing: 'Inicio en próximo ciclo recomendado',
          considerations: [
            `Nivel de confianza: ${bestOption.confidence}%`,
            'Opción con mayor probabilidad de éxito según tu perfil'
          ]
        }
      ],
      evidenceLevel: bestOption.evidenceLevel as EvidenceLevel,
      confidenceLevel: bestOption.confidence,
      followUpQuestions: [
        '¿Qué factores específicos sobre el pronóstico te preocupan más?',
        '¿Te gustaría discutir estrategias para optimizar tus probabilidades de éxito?',
        '¿Tienes preguntas sobre el plan de múltiples ciclos?'
      ],
      redFlags: [],
      educationalResources: [],
      followUp: {
        recommended: true,
        timeframe: '2-4 semanas',
        purpose: 'Preparación y optimización para el tratamiento'
      }
    };
  }

  /**
   * 📚 RESPUESTA EDUCACIONAL
   */
  private generateEducationalResponse(
    _userQuery: string,
    _userInput: UnifiedUserInput,
    clinicalAnalysis?: UnifiedClinicalAnalysis
  ): UnifiedMedicalResponse {
    
    return {
      primaryInfo: 'Mi objetivo es ayudarte a comprender mejor tu situación médica y todas las opciones disponibles.',
      detailedExplanation: 'La información médica precisa y actualizada es fundamental para que puedas tomar decisiones informadas sobre tu salud reproductiva.',
      recommendations: {
        immediate: ['Acceso a información médica confiable y actualizada'],
        shortTerm: ['Consulta de fuentes especializadas en fertilidad'],
        longTerm: ['Educación continua en salud reproductiva'],
        lifestyle: ['Adopción de hábitos saludables basados en evidencia científica'],
        medical: ['Discusión detallada con especialista sobre dudas específicas']
      },
      relatedConditions: clinicalAnalysis?.relatedConditions || ['Factores relacionados con la fertilidad'],
      treatmentOptions: [],
      evidenceLevel: 'A',
      confidenceLevel: 90,
      followUpQuestions: [
        '¿Qué aspectos específicos de la fertilidad quieres conocer mejor?',
        '¿Tienes dudas sobre algún término médico o procedimiento?',
        '¿Te gustaría información sobre recursos educativos adicionales?'
      ],
      redFlags: [],
      educationalResources: [
        {
          title: 'Guías clínicas de fertilidad basadas en evidencia',
          type: 'guideline',
          description: 'Información médica actualizada y confiable sobre tratamientos de fertilidad'
        },
        {
          title: 'Recursos educativos sobre salud reproductiva',
          type: 'article',
          description: 'Artículos científicos y educativos sobre factores que influyen en la fertilidad'
        }
      ],
      followUp: {
        recommended: true,
        timeframe: 'Educación continua',
        purpose: 'Mantenimiento de información médica actualizada'
      }
    };
  }

  /**
   * 💝 RESPUESTA DE APOYO EMOCIONAL
   */
  private generateSupportiveResponse(
    _userQuery: string,
    _userInput: UnifiedUserInput
  ): UnifiedMedicalResponse {
    
    return {
      primaryInfo: 'Estoy aquí para apoyarte en este proceso. La experiencia de la infertilidad puede ser emocionalmente muy desafiante.',
      detailedExplanation: 'Es completamente normal y esperado sentir una amplia gama de emociones durante este proceso. No estás sola en esta experiencia.',
      recommendations: {
        immediate: ['Reconocer y validar todas tus emociones como normales'],
        shortTerm: ['Considerar buscar apoyo profesional especializado si lo sientes necesario'],
        longTerm: ['Desarrollar estrategias personalizadas de afrontamiento emocional'],
        lifestyle: ['Incorporar técnicas efectivas de manejo del estrés y relajación'],
        medical: ['Evaluar la necesidad de apoyo psicológico especializado en fertilidad']
      },
      relatedConditions: ['Impacto emocional y psicológico de la experiencia de fertilidad'],
      treatmentOptions: [],
      evidenceLevel: 'B',
      confidenceLevel: 70,
      followUpQuestions: [
        '¿Cómo te sientes emocionalmente con toda la información que has recibido?',
        '¿Hay algo específico que te esté generando más preocupación o ansiedad?',
        '¿Te sientes con suficiente apoyo emocional en tu entorno personal?'
      ],
      redFlags: [],
      educationalResources: [
        {
          title: 'Grupos de apoyo especializados en fertilidad',
          type: 'support_group',
          description: 'Conexión con otras personas que están pasando por experiencias similares'
        },
        {
          title: 'Recursos de bienestar emocional',
          type: 'article',
          description: 'Técnicas y estrategias para el manejo emocional durante el proceso de fertilidad'
        }
      ],
      followUp: {
        recommended: true,
        timeframe: 'Según necesidad personal',
        purpose: 'Apoyo emocional continuo y personalizado'
      }
    };
  }

  /**
   * 🌐 RESPUESTA GENERAL
   */
  private generateGeneralResponse(
    _userQuery: string,
    _userInput: UnifiedUserInput
  ): UnifiedMedicalResponse {
    
    return {
      primaryInfo: 'Soy tu asistente médico especializado en fertilidad y salud reproductiva.',
      detailedExplanation: 'Mi objetivo principal es proporcionarte información médica precisa, actualizada y personalizada para apoyarte en tu proceso de fertilidad.',
      recommendations: {
        immediate: ['Proporcionar más detalles específicos sobre tu consulta'],
        shortTerm: ['Análisis personalizado de tu situación particular'],
        longTerm: ['Desarrollo de plan de acción específico y detallado'],
        lifestyle: ['Consideración de factores generales de salud reproductiva'],
        medical: ['Evaluación médica especializada según sea necesario']
      },
      relatedConditions: ['Por determinar según información específica'],
      treatmentOptions: [],
      evidenceLevel: 'C',
      confidenceLevel: 60,
      followUpQuestions: [
        '¿Podrías proporcionarme más detalles específicos sobre tu consulta?',
        '¿Qué aspecto de la fertilidad o salud reproductiva te interesa más?',
        '¿Hay alguna preocupación particular que te gustaría abordar?'
      ],
      redFlags: [],
      educationalResources: [],
      followUp: {
        recommended: true,
        timeframe: '1 semana',
        purpose: 'Seguimiento personalizado según información específica'
      }
    };
  }
}

// Exportar instancia singleton optimizada
export const conversationEngine = IntelligentConversationEngine.getInstance();