/**
 * 🤖💬 AI CHAT REFACTORIZADO V13.0 - SISTEMA MODULAR LIMPIO
 * 
 * Funcionalidades implementadas:
 * ✅ Chat en tiempo real con IA médica
 * ✅ Contexto conversacional persistente
 * ✅ Respuestas rápidas predefinidas
 * ✅ Historial de conversación
 * ✅ Typing indicators y estados
 * ✅ Integración con datos de fertilidad
 * 🧠 Neural Enhancement V13.0
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Text from '../../../components/common/Text';

// 🧠 IMPORTACIONES MODULARES V13.0
import { MedicalAIChatEngine } from '../engines/MedicalChatEngine';
import { ChatUIComponents } from './ChatUIComponents';
import { 
  AIChatProps, 
  ChatMessage, 
  QuickReply, 
  ThemeInterface 
} from '../types/ChatTypes';

// 🎨 TEMA POR DEFECTO
const defaultTheme: ThemeInterface = {
  primary: '#007AFF',
  secondary: '#8E8E93',
  background: '#F2F2F7',
  border: '#C7C7CC',
  textSecondary: '#8E8E93'
};

const AIChat: React.FC<AIChatProps> = ({ 
  evaluation, 
  onRecommendationGenerated
}) => {
  // 🔄 ESTADOS DEL COMPONENTE
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // 🧠 MOTORES Y COMPONENTES
  const [chatEngine] = useState(() => new MedicalAIChatEngine(evaluation));
  const [styles] = useState(() => createStyles(defaultTheme));
  const [uiComponents] = useState(() => new ChatUIComponents({ 
    theme: defaultTheme, 
    styles: createStyles(defaultTheme)
  }));

  // 🎯 REFERENCIAS
  const scrollViewRef = useRef<ScrollView>(null);
  const inputRef = useRef<TextInput>(null);
  const typingAnimation = useRef(new Animated.Value(0)).current;

  /**
   * 🎬 INICIALIZAR CHAT
   */
  const initializeChat = useCallback((): void => {
    const welcomeMessage: ChatMessage = {
      id: 'welcome',
      type: 'ai',
      message: `¡Hola! Soy el Dr. IA, especialista en fertilidad. He analizado tu evaluación y estoy aquí para resolver tus dudas.\n\n¿En qué puedo ayudarte hoy?`,
      timestamp: new Date(),
      quickReplies: [
        {
          id: 'explain_results',
          text: 'Explícame mis resultados',
          action: 'question'
        },
        {
          id: 'treatment_options',
          text: '¿Qué opciones de tratamiento tengo?',
          action: 'request_info'
        },
        {
          id: 'lifestyle_tips',
          text: 'Consejos de estilo de vida',
          action: 'request_info'
        }
      ]
    };

    setMessages([welcomeMessage]);
  }, []);

  /**
   * 🎭 ANIMACIÓN DE ESCRITURA
   */
  const startTypingAnimation = useCallback((): void => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(typingAnimation, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true
        }),
        Animated.timing(typingAnimation, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true
        })
      ])
    ).start();
  }, [typingAnimation]);

  /**
   * 📜 SCROLL AL FINAL
   */
  const scrollToBottom = useCallback((): void => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, []);

  /**
   * 📨 ENVIAR MENSAJE
   */
  const sendMessage = useCallback(async (message: string): Promise<void> => {
    if (!message.trim() || isTyping) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      message: message.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      // 🧠 GENERAR RESPUESTA NEURAL V13.0
      const response = await chatEngine.generateResponse(message);
      
      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        type: 'ai',
        message: response.response,
        timestamp: new Date(),
        quickReplies: response.quickReplies,
        attachments: response.attachments
      };

      setTimeout(() => {
        setMessages(prev => [...prev, aiMessage]);
        setIsTyping(false);
        
        if (onRecommendationGenerated && response.attachments?.length && response.attachments[0]) {
          onRecommendationGenerated(response.attachments[0].data);
        }
      }, 1500);

    } catch (error) {
      console.error('❌ [CHAT] Error al generar respuesta:', error);
      
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        type: 'ai',
        message: 'Disculpa, hubo un error al procesar tu consulta. Por favor, inténtalo de nuevo.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
      setIsTyping(false);
    }
  }, [chatEngine, isTyping, onRecommendationGenerated]);

  /**
   * ⚡ MANEJAR RESPUESTA RÁPIDA
   */
  const handleQuickReply = useCallback((reply: QuickReply): void => {
    sendMessage(reply.text);
  }, [sendMessage]);

  // 🚀 EFECTOS
  useEffect(() => {
    initializeChat();
    startTypingAnimation();
  }, [initializeChat, startTypingAnimation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {/* Header del Chat */}
      <View style={styles.chatHeader}>
        <View style={styles.headerAvatar}>
          <Ionicons name="medical" size={24} color="white" />
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>Dr. IA - Especialista en Fertilidad</Text>
          <Text style={styles.headerStatus}>● En línea - Respondiendo consultas</Text>
        </View>
      </View>

      {/* Mensajes */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((message) => (
          <View key={message.id}>
            {uiComponents.renderMessage(message)}
            
            {/* Quick Replies */}
            {message.type === 'ai' && 
             message.quickReplies && 
             message.id === messages[messages.length - 1]?.id && 
             !isTyping && 
             uiComponents.renderQuickReplies(message.quickReplies, handleQuickReply)}
            
            {/* Attachments */}
            {message.attachments && uiComponents.renderAttachments(message.attachments)}
          </View>
        ))}
        
        {isTyping && uiComponents.renderTypingIndicator(typingAnimation)}
      </ScrollView>

      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput
          ref={inputRef}
          style={styles.textInput}
          placeholder="Escribe tu consulta médica..."
          placeholderTextColor={defaultTheme.secondary}
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={500}
          onSubmitEditing={() => sendMessage(inputText)}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            { backgroundColor: inputText.trim() ? defaultTheme.primary : defaultTheme.border }
          ]}
          onPress={() => sendMessage(inputText)}
          disabled={!inputText.trim() || isTyping}
        >
          <Ionicons 
            name="send" 
            size={20} 
            color={inputText.trim() ? "white" : defaultTheme.textSecondary} 
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

// 🎨 ESTILOS OPTIMIZADOS
const createStyles = (theme: ThemeInterface) => ({
  container: {
    flex: 1,
    backgroundColor: theme.background
  },
  chatHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    padding: 16,
    backgroundColor: theme.primary,
    borderBottomWidth: 1,
    borderBottomColor: theme.border
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginRight: 12
  },
  headerInfo: {
    flex: 1
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    color: 'white'
  },
  headerStatus: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)'
  },
  messagesContainer: {
    flex: 1
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 20
  },
  inputContainer: {
    flexDirection: 'row' as const,
    alignItems: 'flex-end' as const,
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: theme.border
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 8,
    maxHeight: 100,
    fontSize: 16
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center' as const,
    alignItems: 'center' as const
  }
});

export default AIChat;
