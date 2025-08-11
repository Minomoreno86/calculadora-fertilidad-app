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

import React from 'react';
import {
  Platform,
  ScrollView,
  TouchableOpacity,
  View
} from 'react-native';

// Safe imports for optional React Native components
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let Animated: unknown;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let KeyboardAvoidingView: unknown;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let TextInput: unknown;

try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const RNComponents = require('react-native');
  Animated = RNComponents.Animated || { 
    Value: class { constructor() {} },
    loop: () => ({ start: () => {} }),
    sequence: () => ({}),
    timing: () => ({})
  };
  KeyboardAvoidingView = RNComponents.KeyboardAvoidingView || View;
  const FallbackTextInput = () => null;
  FallbackTextInput.displayName = 'FallbackTextInput';
  TextInput = RNComponents.TextInput || FallbackTextInput;
} catch {
  Animated = { 
    Value: class { constructor() {} },
    loop: () => ({ start: () => {} }),
    sequence: () => ({}),
    timing: () => ({})
  };
  KeyboardAvoidingView = View;
  const FallbackTextInput = () => null;
  FallbackTextInput.displayName = 'FallbackTextInput';
  TextInput = FallbackTextInput;
}

import { Ionicons } from '@expo/vector-icons';
import Text from '../../../components/common/Text';

// 🧠 IMPORTACIONES MODULARES V13.0 SÚPER MEJORADAS
import { SmartMedicalChatEngine } from '../engines/SmartMedicalChatEngine';
import { ChatUIComponents } from './ChatUIComponents';
import { 
  AIChatProps, 
  ChatMessage, 
  QuickReply, 
  ThemeInterface 
} from '../types/ChatTypes';

// 🎨 TEMA MÉDICO PROFESIONAL MEJORADO
const defaultTheme: ThemeInterface = {
  primary: '#0066CC',       // ✅ Azul médico profesional
  secondary: '#6B7280',     // ✅ Gris elegante
  background: '#F8FAFC',    // ✅ Fondo más limpio
  border: '#E5E7EB',        // ✅ Bordes suaves
  textSecondary: '#6B7280', // ✅ Texto secundario legible
  gradient: ['#0066CC', '#0052A3'], // ✅ Gradiente profesional
  success: '#10B981',       // ✅ Verde médico
  warning: '#F59E0B',       // ✅ Amarillo médico
  error: '#EF4444'          // ✅ Rojo médico
};

const AIChat: React.FC<AIChatProps> = ({ 
  evaluation, 
  onRecommendationGenerated
}) => {
  // 🔄 ESTADOS DEL COMPONENTE
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [inputText, setInputText] = React.useState('');
  const [isTyping, setIsTyping] = React.useState(false);
  
  // 🧠 MOTORES Y COMPONENTES SÚPER INTELIGENTES
  const [chatEngine] = React.useState(() => new SmartMedicalChatEngine(evaluation));
  const [styles] = React.useState(() => createStyles(defaultTheme));
  const [uiComponents] = React.useState(() => new ChatUIComponents({ 
    theme: defaultTheme, 
    styles: createStyles(defaultTheme)
  }));

  // 🎯 REFERENCIAS
  const scrollViewRef = React.useRef<typeof ScrollView>(null);
  const inputRef = React.useRef<typeof TextInput>(null);
  const typingAnimation = React.useRef(new Animated.Value(0)).current;

  /**
   * 🎬 INICIALIZAR CHAT INTELIGENTE
   */
  const initializeChat = React.useCallback(async (): Promise<void> => {
    try {
      // 🧠 USAR EL MOTOR INTELIGENTE PARA SALUDO PERSONALIZADO
      const welcomeResponse = await chatEngine.generateResponse('¡Hola!');
      
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        type: 'ai',
        message: welcomeResponse.response,
        timestamp: new Date(),
        quickReplies: welcomeResponse.quickReplies
      };

      setMessages([welcomeMessage]);
    } catch (error) {
      console.error('❌ [CHAT INIT] Error inicializando chat:', error);
      
      // 🛡️ FALLBACK SEGURO
      const fallbackMessage: ChatMessage = {
        id: 'welcome-fallback',
        type: 'ai', 
        message: `🩺 **Dr. IA - Tu Especialista en Fertilidad**\n\n¡Hola! Estoy aquí para ayudarte con tu consulta de fertilidad. ¿En qué puedo asistirte hoy?`,
        timestamp: new Date(),
        quickReplies: [
          { id: 'help_results', text: '📊 Mis resultados', action: 'question' },
          { id: 'help_improve', text: '📈 Cómo mejorar', action: 'request_info' },
          { id: 'help_treatment', text: '💊 Tratamientos', action: 'request_info' }
        ]
      };
      
      setMessages([fallbackMessage]);
    }
  }, [chatEngine]);

  /**
   * 🎭 ANIMACIÓN DE ESCRITURA
   */
  const startTypingAnimation = React.useCallback((): void => {
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
  const scrollToBottom = React.useCallback((): void => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, []);

  /**
   * 📨 ENVIAR MENSAJE
   */
  const sendMessage = React.useCallback(async (message: string): Promise<void> => {
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
   * ⚡ MANEJAR RESPUESTA RÁPIDA MEJORADA
   */
  const handleQuickReply = React.useCallback((reply: QuickReply): void => {
    // 🎯 FEEDBACK VISUAL INMEDIATO
    setIsTyping(true);
    
    // 🎨 SIMULAR INTERACCIÓN MÁS NATURAL
    setTimeout(() => {
      sendMessage(reply.text);
    }, 200); // Pequeño delay para que se vea el typing
  }, [sendMessage]);

  /**
   * 🎯 FUNCIONES AUXILIARES PARA MEJOR UX
   */
  const handleInputFocus = React.useCallback((): void => {
    // 🔝 SCROLL AUTOMÁTICO AL ENFOCAR INPUT
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 300);
  }, []);

  const handleSendWithFeedback = React.useCallback((text: string): void => {
    if (text.trim()) {
      // 🎨 LIMPIAR INPUT INMEDIATAMENTE PARA MEJOR UX
      setInputText('');
      sendMessage(text.trim());
    }
  }, [sendMessage]);

  // 🚀 EFECTOS
  React.useEffect(() => {
    initializeChat();
    startTypingAnimation();
  }, [initializeChat, startTypingAnimation]);

  React.useEffect(() => {
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

      {/* 🎨 INPUT MEJORADO CON MEJOR UX */}
      <View style={styles.inputContainer}>
        <TextInput
          ref={inputRef}
          style={styles.textInput}
          placeholder="💬 Pregúntame sobre tu fertilidad..."
          placeholderTextColor={defaultTheme.secondary}
          value={inputText}
          onChangeText={setInputText}
          onFocus={handleInputFocus}
          multiline
          maxLength={500}
          returnKeyType="send"
          onSubmitEditing={() => handleSendWithFeedback(inputText)}
          blurOnSubmit={false}
          // 🎯 MEJORAR ACCESIBILIDAD
          accessibilityLabel="Campo de texto para consulta médica"
          accessibilityHint="Escribe tu pregunta sobre fertilidad aquí"
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            { 
              backgroundColor: inputText.trim() ? defaultTheme.primary : defaultTheme.border,
              // 🎨 EFECTOS VISUALES MEJORADOS
              transform: [{ scale: inputText.trim() ? 1.05 : 1 }],
              shadowOpacity: inputText.trim() ? 0.3 : 0.1
            }
          ]}
          onPress={() => handleSendWithFeedback(inputText)}
          disabled={!inputText.trim() || isTyping}
          activeOpacity={0.8}
          // 🎯 MEJORAR ACCESIBILIDAD
          accessibilityLabel="Enviar mensaje"
          accessibilityRole="button"
        >
          <Ionicons 
            name={isTyping ? "hourglass-outline" : "send"} 
            size={20} 
            color={inputText.trim() ? "white" : defaultTheme.textSecondary} 
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

// 🎨 ESTILOS MODERNOS Y PROFESIONALES MEJORADOS
const createStyles = (theme: ThemeInterface) => ({
  container: {
    flex: 1,
    backgroundColor: theme.background
  },
  chatHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    padding: 20,                    // ✅ Más padding
    paddingTop: 50,                 // ✅ Safe area para notch
    backgroundColor: theme.primary,
    borderBottomWidth: 0,           // ✅ Sin borde, más limpio
    shadowColor: '#000',            // ✅ Sombra elegante
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8
  },
  headerAvatar: {
    width: 48,                      // ✅ Avatar más grande
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginRight: 16,                // ✅ Más separación
    borderWidth: 2,                 // ✅ Borde elegante
    borderColor: 'rgba(255, 255, 255, 0.3)'
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
    padding: 20,                    // ✅ Más padding
    paddingBottom: 30,              // ✅ Safe area para home indicator
    backgroundColor: 'white',
    borderTopWidth: 0,              // ✅ Sin borde superior
    shadowColor: '#000',            // ✅ Sombra superior elegante
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8
  },
  textInput: {
    flex: 1,
    borderWidth: 2,                 // ✅ Borde más grueso
    borderColor: theme.border,
    borderRadius: 25,               // ✅ Más redondeado
    paddingHorizontal: 20,          // ✅ Más padding horizontal
    paddingVertical: 14,            // ✅ Más padding vertical
    marginRight: 12,                // ✅ Más separación
    maxHeight: 120,                 // ✅ Altura máxima mayor
    fontSize: 16,
    backgroundColor: '#FAFAFA',     // ✅ Fondo sutil
    shadowColor: '#000',            // ✅ Sombra interna sutil
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1
  },
  sendButton: {
    width: 50,                      // ✅ Botón más grande
    height: 50,
    borderRadius: 25,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    shadowColor: '#000',            // ✅ Sombra para el botón
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4
  }
});

export default AIChat;
