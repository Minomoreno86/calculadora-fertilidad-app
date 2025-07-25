/**
 * 🎨 NEURAL CHAT UI COMPONENTS V13.0
 * Componentes de interfaz para el chat médico
 */

import React from 'react';
import { View, Text, TouchableOpacity, Animated, ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ChatMessage, QuickReply, ChatAttachment, ThemeInterface } from '../types/ChatTypes';

interface ChatUIComponentsProps {
  theme: ThemeInterface;
  styles?: Record<string, ViewStyle | TextStyle>;
}

export class ChatUIComponents {
  private theme: ThemeInterface;
  private styles: Record<string, ViewStyle | TextStyle>;

  constructor(props: ChatUIComponentsProps) {
    this.theme = props.theme;
    this.styles = this.createStyles(props.theme);
  }

  /**
   * 🎨 CREAR ESTILOS
   */
  private createStyles = (theme: ThemeInterface): Record<string, ViewStyle | TextStyle> => ({
    messageContainer: {
      flexDirection: 'row',
      marginVertical: 4,
      alignItems: 'flex-end'
    } as ViewStyle,
    userMessage: {
      justifyContent: 'flex-end'
    } as ViewStyle,
    aiMessage: {
      justifyContent: 'flex-start'
    } as ViewStyle,
    aiAvatar: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: theme.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 8
    } as ViewStyle,
    userAvatar: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: theme.background,
      borderWidth: 2,
      borderColor: theme.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 8
    } as ViewStyle,
    messageBubble: {
      maxWidth: '75%' as const,
      borderRadius: 16,
      paddingHorizontal: 12,
      paddingVertical: 8
    } as ViewStyle,
    userBubble: {
      backgroundColor: theme.primary
    } as ViewStyle,
    aiBubble: {
      backgroundColor: 'white',
      borderWidth: 1,
      borderColor: theme.border || theme.secondary
    } as ViewStyle,
    messageText: {
      fontSize: 16,
      lineHeight: 20
    } as TextStyle,
    userText: {
      color: 'white'
    } as TextStyle,
    aiText: {
      color: '#000'
    } as TextStyle,
    messageTime: {
      fontSize: 11,
      marginTop: 4
    } as TextStyle,
    userTime: {
      color: 'rgba(255, 255, 255, 0.7)'
    } as TextStyle,
    aiTime: {
      color: theme.textSecondary || theme.secondary
    } as TextStyle,
    quickRepliesContainer: {
      marginTop: 8,
      marginLeft: 40
    } as ViewStyle,
    quickRepliesTitle: {
      fontSize: 12,
      color: theme.textSecondary || theme.secondary,
      marginBottom: 8
    } as TextStyle,
    quickReplyButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'white',
      borderWidth: 1,
      borderColor: theme.border || theme.secondary,
      borderRadius: 20,
      paddingHorizontal: 12,
      paddingVertical: 8,
      marginBottom: 6,
      alignSelf: 'flex-start'
    } as ViewStyle,
    quickReplyText: {
      fontSize: 14,
      color: theme.primary,
      marginRight: 6
    } as TextStyle,
    attachmentsContainer: {
      marginTop: 8,
      marginLeft: 40
    } as ViewStyle,
    attachmentCard: {
      backgroundColor: 'white',
      borderWidth: 1,
      borderColor: theme.border || theme.secondary,
      borderRadius: 12,
      padding: 12,
      marginBottom: 8
    } as ViewStyle,
    attachmentHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8
    } as ViewStyle,
    attachmentTitle: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#000',
      marginLeft: 8
    } as TextStyle,
    attachmentPreview: {
      fontSize: 12,
      color: theme.textSecondary || theme.secondary,
      marginBottom: 8
    } as TextStyle,
    attachmentButton: {
      backgroundColor: theme.primary,
      borderRadius: 6,
      paddingHorizontal: 12,
      paddingVertical: 6,
      alignSelf: 'flex-start'
    } as ViewStyle,
    attachmentButtonText: {
      fontSize: 12,
      color: 'white',
      fontWeight: 'bold'
    } as TextStyle,
    typingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4
    } as ViewStyle,
    typingDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: theme.textSecondary || theme.secondary,
      marginHorizontal: 2
    } as ViewStyle,
    typingText: {
      fontSize: 12,
      color: theme.textSecondary || theme.secondary,
      fontStyle: 'italic'
    } as TextStyle
  });

  /**
   * 💬 RENDERIZAR MENSAJE
   */
  renderMessage = (message: ChatMessage) => {
    const isUser = message.type === 'user';
    
    return (
      <View
        key={message.id}
        style={[
          this.styles.messageContainer as ViewStyle,
          isUser ? this.styles.userMessage as ViewStyle : this.styles.aiMessage as ViewStyle
        ]}
      >
        {!isUser && (
          <View style={this.styles.aiAvatar as ViewStyle}>
            <Ionicons name="medical" size={16} color="white" />
          </View>
        )}
        
        <View style={[
          this.styles.messageBubble as ViewStyle,
          isUser ? this.styles.userBubble as ViewStyle : this.styles.aiBubble as ViewStyle
        ]}>
          <Text style={[
            this.styles.messageText as TextStyle,
            isUser ? this.styles.userText as TextStyle : this.styles.aiText as TextStyle
          ]}>
            {message.message}
          </Text>
          
          <Text style={[
            this.styles.messageTime as TextStyle,
            isUser ? this.styles.userTime as TextStyle : this.styles.aiTime as TextStyle
          ]}>
            {message.timestamp.toLocaleTimeString('es-ES', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </Text>
        </View>
        
        {isUser && (
          <View style={this.styles.userAvatar as ViewStyle}>
            <Ionicons name="person" size={16} color={this.theme.primary} />
          </View>
        )}
      </View>
    );
  };

  /**
   * ⚡ RENDERIZAR RESPUESTAS RÁPIDAS
   */
  renderQuickReplies = (quickReplies: QuickReply[], onQuickReply: (reply: QuickReply) => void) => {
    return (
      <View style={this.styles.quickRepliesContainer as ViewStyle}>
        <Text style={this.styles.quickRepliesTitle as TextStyle}>Respuestas sugeridas:</Text>
        {quickReplies.map((reply) => (
          <TouchableOpacity
            key={reply.id}
            style={this.styles.quickReplyButton as ViewStyle}
            onPress={() => onQuickReply(reply)}
          >
            <Text style={this.styles.quickReplyText as TextStyle}>{reply.text}</Text>
            <Ionicons name="arrow-forward" size={14} color={this.theme.primary} />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  /**
   * 📎 RENDERIZAR ADJUNTOS
   */
  renderAttachments = (attachments: ChatAttachment[]) => {
    return (
      <View style={this.styles.attachmentsContainer as ViewStyle}>
        {attachments.map((attachment, index) => (
          <View key={`${attachment.type}-${index}`} style={this.styles.attachmentCard as ViewStyle}>
            <View style={this.styles.attachmentHeader as ViewStyle}>
              <Ionicons 
                name={this.getAttachmentIcon(attachment.type) as keyof typeof Ionicons.glyphMap} 
                size={20} 
                color={this.theme.primary} 
              />
              <Text style={this.styles.attachmentTitle as TextStyle}>{attachment.title}</Text>
            </View>
            
            {attachment.preview && (
              <Text style={this.styles.attachmentPreview as TextStyle}>{attachment.preview}</Text>
            )}
            
            <TouchableOpacity style={this.styles.attachmentButton as ViewStyle}>
              <Text style={this.styles.attachmentButtonText as TextStyle}>Ver detalles</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    );
  };

  /**
   * ⌨️ RENDERIZAR INDICADOR DE ESCRITURA
   */
  renderTypingIndicator = (typingAnimation: Animated.Value) => {
    return (
      <View style={this.styles.messageContainer as ViewStyle}>
        <View style={this.styles.aiAvatar as ViewStyle}>
          <Ionicons name="medical" size={16} color="white" />
        </View>
        
        <View style={[this.styles.messageBubble as ViewStyle, this.styles.aiBubble as ViewStyle]}>
          <View style={this.styles.typingContainer as ViewStyle}>
            {[0, 1, 2].map((index) => (
              <Animated.View
                key={index}
                style={[
                  this.styles.typingDot as ViewStyle,
                  {
                    opacity: typingAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.3, 1]
                    }),
                    transform: [{
                      scale: typingAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.8, 1.2]
                      })
                    }]
                  }
                ]}
              />
            ))}
          </View>
          <Text style={this.styles.typingText as TextStyle}>Analizando tu consulta...</Text>
        </View>
      </View>
    );
  };

  /**
   * 🎯 OBTENER ICONO DE ADJUNTO
   */
  private getAttachmentIcon = (type: string): string => {
    switch (type) {
      case 'recommendation': return 'medical';
      case 'study': return 'document-text';
      case 'protocol': return 'list';
      case 'chart': return 'bar-chart';
      default: return 'attach';
    }
  };
}
