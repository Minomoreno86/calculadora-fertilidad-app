/**
 * 🤖 INTERFAZ DE CHAT MÉDICO - DR. IA FERTILITAS
 * Componente principal de conversación con el agente IA médico
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Animated,
  ActivityIndicator,
  ViewStyle
} from 'react-native';
import { useDynamicTheme } from '@/hooks/useDynamicTheme';
import { 
  ConversationEngine, 
  ConversationContext, 
  ConversationMessage, 
  AI_PERSONALITIES,
  PersonalityManager
} from '../../core/conversation-engine/conversationEngine';
import { UserInput, TreatmentPlan } from '../../core/reasoning-engine/clinicalReasoningEngine';

// Definir tipos para los cálculos
export interface CalculationResults {
  fertilityScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  recommendations: string[];
}

export interface ChatInterfaceProps {
  userInput: UserInput;
  calculationResults?: CalculationResults;
  onTreatmentRecommendation?: (plan: TreatmentPlan) => void;
  personality?: string;
  style?: ViewStyle;
}

export interface MessageBubbleProps {
  message: ConversationMessage;
  isUser: boolean;
  theme: ReturnType<typeof useDynamicTheme>;
}

/**
 * 💬 COMPONENTE BURBUJA DE MENSAJE
 */
const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isUser, theme }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const animatedHeight = useRef(new Animated.Value(0)).current;

  const styles = StyleSheet.create({
    bubbleContainer: {
      flexDirection: 'row',
      marginVertical: 4,
      marginHorizontal: 12,
      justifyContent: isUser ? 'flex-end' : 'flex-start',
    },
    bubble: {
      maxWidth: '80%',
      minWidth: '20%',
      backgroundColor: isUser ? theme.colors.primary : theme.colors.surface,
      borderRadius: 16,
      padding: 12,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    messageText: {
      fontSize: 14,
      lineHeight: 20,
      color: isUser ? theme.colors.white : theme.colors.text,
    },
    timestamp: {
      fontSize: 11,
      color: isUser ? theme.colors.white + '80' : theme.colors.textSecondary,
      marginTop: 4,
      textAlign: 'right',
    },
    messageHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4,
    },
    messageType: {
      fontSize: 10,
      fontWeight: 'bold',
      color: isUser ? theme.colors.white + '90' : theme.colors.primary,
      textTransform: 'uppercase',
    },
    confidence: {
      fontSize: 10,
      color: isUser ? theme.colors.white + '70' : theme.colors.textSecondary,
      marginLeft: 8,
    },
    expandButton: {
      marginTop: 8,
      paddingVertical: 4,
      paddingHorizontal: 8,
      backgroundColor: isUser ? theme.colors.white + '20' : theme.colors.primary + '20',
      borderRadius: 8,
      alignSelf: 'flex-start',
    },
    expandText: {
      fontSize: 12,
      color: isUser ? theme.colors.white : theme.colors.primary,
      fontWeight: 'bold',
    },
    metadata: {
      marginTop: 8,
      padding: 8,
      backgroundColor: isUser ? theme.colors.white + '10' : theme.colors.surface,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: isUser ? theme.colors.white + '20' : theme.colors.border + '40',
    },
    sources: {
      fontSize: 11,
      color: isUser ? theme.colors.white + '80' : theme.colors.textSecondary,
      fontStyle: 'italic',
    }
  });

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('es-EC', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
    Animated.timing(animatedHeight, {
      toValue: isExpanded ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  return (
    <View style={styles.bubbleContainer}>
      <View style={styles.bubble}>
        {/* Header del mensaje */}
        {!isUser && (
          <View style={styles.messageHeader}>
            <Text style={styles.messageType}>
              {message.messageType === 'analysis' ? '📊 ANÁLISIS' :
               message.messageType === 'recommendation' ? '🎯 RECOMENDACIÓN' :
               message.messageType === 'education' ? '📚 EDUCACIÓN' :
               message.messageType === 'followup' ? '🔮 PRONÓSTICO' :
               '💬 CONSULTA'}
            </Text>
            {message.metadata?.confidence && (
              <Text style={styles.confidence}>
                Confianza: {Math.round(message.metadata.confidence * 100)}%
              </Text>
            )}
          </View>
        )}

        {/* Contenido del mensaje */}
        <Text style={styles.messageText}>
          {message.content}
        </Text>

        {/* Timestamp */}
        <Text style={styles.timestamp}>
          {formatTime(message.timestamp)}
        </Text>

        {/* Botón expandir para mensajes del asistente */}
        {!isUser && message.metadata && (message.metadata.sources.length > 0 || message.metadata.relatedTopics.length > 0) && (
          <TouchableOpacity style={styles.expandButton} onPress={toggleExpanded}>
            <Text style={styles.expandText}>
              {isExpanded ? '▲ Menos info' : '▼ Más info'}
            </Text>
          </TouchableOpacity>
        )}

        {/* Metadata expandible */}
        {!isUser && isExpanded && message.metadata && (
          <Animated.View 
            style={[styles.metadata, { opacity: animatedHeight }]}
          >
            {message.metadata.sources.length > 0 && (
              <View>
                <Text style={[styles.sources, { fontWeight: 'bold' }]}>
                  📚 Fuentes científicas:
                </Text>
                {message.metadata.sources.map((source, index) => (
                  <Text key={index} style={styles.sources}>
                    • {source}
                  </Text>
                ))}
              </View>
            )}
            
            {message.metadata.relatedTopics.length > 0 && (
              <View style={{ marginTop: 8 }}>
                <Text style={[styles.sources, { fontWeight: 'bold' }]}>
                  🔗 Temas relacionados:
                </Text>
                <Text style={styles.sources}>
                  {message.metadata.relatedTopics.join(', ')}
                </Text>
              </View>
            )}
          </Animated.View>
        )}
      </View>
    </View>
  );
};

/**
 * 🤖 COMPONENTE PRINCIPAL DEL CHAT
 */
export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  userInput,
  calculationResults: _calculationResults,
  onTreatmentRecommendation,
  personality = 'familyDoctor',
  style
}) => {
  const theme = useDynamicTheme();
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationEngine, setConversationEngine] = useState<ConversationEngine | null>(null);
  const [currentPersonality, setCurrentPersonality] = useState(personality);
  const scrollViewRef = useRef<ScrollView>(null);

  // Inicializar conversación
  useEffect(() => {
    const context: ConversationContext = {
      userInput,
      conversationHistory: [],
      currentPersonality,
      sessionId: `session_${Date.now()}`,
      timestamp: new Date().toISOString()
    };

    const engine = new ConversationEngine(context);
    setConversationEngine(engine);

    // Mensaje de bienvenida
    const welcomeMessage = engine.generateResponse(
      'Hola, necesito ayuda con mis resultados de fertilidad',
      'question'
    );
    setMessages([welcomeMessage]);
  }, [userInput, currentPersonality]);

  // Auto-scroll al final
  useEffect(() => {
    if (scrollViewRef.current && messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!inputText.trim() || !conversationEngine || isLoading) return;

    const userMessage: ConversationMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: inputText,
      timestamp: new Date().toISOString(),
      messageType: 'question'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Determinar tipo de mensaje basado en contenido
      const messageType = determineMessageType(inputText);
      
      // Simular delay para UX más natural
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      
      const response = conversationEngine.generateResponse(inputText, messageType);
      
      setMessages(prev => [...prev, response]);

      // Si es una recomendación de tratamiento, notificar al padre
      if (messageType === 'recommendation' && onTreatmentRecommendation) {
        // Crear un plan de tratamiento básico basado en la respuesta
        const basicTreatmentPlan: TreatmentPlan = {
          recommendedTreatments: [{
            treatment: 'consulta_especialista',
            priority: 1,
            reasoning: 'Basado en análisis de IA médica',
            successRate: { perCycle: 70, cumulative: 90 },
            timeframe: '3-6 meses',
            costs: 'Variable según clínica'
          }],
          alternativeTreatments: [],
          lifestyle: ['Mantener estilo de vida saludable'],
          monitoring: ['Seguimiento médico regular'],
          followUp: ['Evaluación en 3 meses'],
          nextSteps: {
            ifSuccess: 'Continuar con plan establecido',
            ifFailure: ['Reevaluación de estrategia', 'Considerar alternativas']
          }
        };
        onTreatmentRecommendation(basicTreatmentPlan);
      }
    } catch (error) {
      console.error('Error generando respuesta:', error);
      
      const errorMessage: ConversationMessage = {
        id: `error_${Date.now()}`,
        role: 'assistant',
        content: 'Lo siento, hubo un error procesando tu consulta. Por favor, inténtalo nuevamente.',
        timestamp: new Date().toISOString(),
        messageType: 'question'
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const determineMessageType = (text: string): ConversationMessage['messageType'] => {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('analiz') || lowerText.includes('resultado') || lowerText.includes('significa')) {
      return 'analysis';
    }
    if (lowerText.includes('tratamiento') || lowerText.includes('recomend') || lowerText.includes('qué hacer')) {
      return 'recommendation';
    }
    if (lowerText.includes('qué es') || lowerText.includes('explica') || lowerText.includes('cómo')) {
      return 'education';
    }
    if (lowerText.includes('probabilidad') || lowerText.includes('éxito') || lowerText.includes('tiempo')) {
      return 'followup';
    }
    
    return 'question';
  };

  const switchPersonality = (newPersonality: string) => {
    if (conversationEngine && AI_PERSONALITIES[newPersonality]) {
      setCurrentPersonality(newPersonality);
      
      // Crear nueva conversación con personalidad diferente
      const newContext = PersonalityManager.switchPersonality(
        conversationEngine['context'],
        newPersonality
      );
      
      const newEngine = new ConversationEngine(newContext);
      setConversationEngine(newEngine);

      // Mensaje de cambio de personalidad
      const switchMessage: ConversationMessage = {
        id: `switch_${Date.now()}`,
        role: 'assistant',
        content: `👋 ${AI_PERSONALITIES[newPersonality].responseStyle.greeting}`,
        timestamp: new Date().toISOString(),
        messageType: 'question'
      };
      
      setMessages(prev => [...prev, switchMessage]);
    }
  };

  const styles = createStyles(theme);

  return (
    <View style={[styles.container, style]}>
      {/* Header del chat */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>🤖 Dr. IA Fertilitas</Text>
          <Text style={styles.headerSubtitle}>
            {AI_PERSONALITIES[currentPersonality]?.name || 'Asistente Médico IA'}
          </Text>
        </View>
        
        {/* Selector de personalidad */}
        <View style={styles.personalitySelector}>
          {Object.entries(AI_PERSONALITIES).map(([key, persona]) => (
            <TouchableOpacity
              key={key}
              style={[
                styles.personalityButton,
                currentPersonality === key && styles.personalityButtonActive
              ]}
              onPress={() => switchPersonality(key)}
            >
              <Text style={[
                styles.personalityText,
                currentPersonality === key && styles.personalityTextActive
              ]}>
                {persona.name.split(' ').pop()} {/* Solo última palabra */}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Área de mensajes */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            isUser={message.role === 'user'}
            theme={theme}
          />
        ))}
        
        {/* Indicador de carga */}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={theme.colors.primary} />
            <Text style={styles.loadingText}>Dr. IA está analizando...</Text>
          </View>
        )}
      </ScrollView>

      {/* Input de mensaje */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Pregúntame sobre fertilidad, tratamientos, resultados..."
            placeholderTextColor={theme.colors.textSecondary}
            multiline
            maxLength={500}
            editable={!isLoading}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!inputText.trim() || isLoading) && styles.sendButtonDisabled
            ]}
            onPress={sendMessage}
            disabled={!inputText.trim() || isLoading}
          >
            <Text style={styles.sendButtonText}>
              {isLoading ? '⏳' : '📤'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Sugerencias rápidas */}
      <View style={styles.quickSuggestions}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {['📊 Analizar resultados', '🎯 ¿Qué tratamiento?', '📚 ¿Qué es PCOS?', '🔮 Mis probabilidades'].map((suggestion, index) => (
            <TouchableOpacity
              key={index}
              style={styles.suggestionButton}
              onPress={() => setInputText(suggestion.substring(2))}
              disabled={isLoading}
            >
              <Text style={styles.suggestionText}>{suggestion}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const createStyles = (theme: ReturnType<typeof useDynamicTheme>) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 16,
  },
  headerContent: {
    alignItems: 'center',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.white,
  },
  headerSubtitle: {
    fontSize: 12,
    color: theme.colors.white + '80',
    marginTop: 2,
  },
  personalitySelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  personalityButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: theme.colors.white + '20',
    borderWidth: 1,
    borderColor: theme.colors.white + '40',
  },
  personalityButtonActive: {
    backgroundColor: theme.colors.white,
  },
  personalityText: {
    fontSize: 11,
    color: theme.colors.white,
    fontWeight: '500',
  },
  personalityTextActive: {
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  messagesContent: {
    paddingVertical: 12,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  loadingText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border + '40',
    gap: 8,
  },
  textInput: {
    flex: 1,
    maxHeight: 100,
    minHeight: 40,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: theme.colors.text,
    backgroundColor: theme.colors.background,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: theme.colors.border,
  },
  sendButtonText: {
    fontSize: 16,
  },
  quickSuggestions: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: theme.colors.surface,
  },
  suggestionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    backgroundColor: theme.colors.primary + '20',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.primary + '40',
  },
  suggestionText: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: '500',
  },
});

export default ChatInterface;
