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
  private readonly theme: ThemeInterface;
  private readonly styles: Record<string, ViewStyle | TextStyle>;

  constructor(props: ChatUIComponentsProps) {
    this.theme = props.theme;
    this.styles = this.createStyles(props.theme);
  }

  /**
   * 🎨 CREAR ESTILOS
   */
  private readonly createStyles = (theme: ThemeInterface): Record<string, ViewStyle | TextStyle> => ({
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

    // ACTION CARDS STYLES V14.0
    actionCardsContainer: {
      marginVertical: 16,
      paddingHorizontal: 16,
    },
    actionCardsTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: '#2E3440',
      marginBottom: 12,
    },
    actionCardsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    actionCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: 12,
      padding: 16,
      borderLeftWidth: 4,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      minWidth: '48%',
      maxWidth: '48%',
    },
    actionCardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    actionCardBadge: {
      backgroundColor: '#F0F4F8',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    actionCardCategory: {
      fontSize: 10,
      fontWeight: '500',
      color: '#64748B',
    },
    actionCardTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: '#1E293B',
      marginBottom: 6,
    },
    actionCardDescription: {
      fontSize: 12,
      color: '#64748B',
      lineHeight: 18,
      marginBottom: 8,
    },
    actionCardFooter: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    actionCardTime: {
      fontSize: 11,
      color: '#64748B',
      fontWeight: '500',
    },
    progressContainer: {
      height: 3,
      backgroundColor: '#E2E8F0',
      borderRadius: 2,
      marginTop: 8,
      overflow: 'hidden',
    },
    progressBar: {
      height: '100%',
      backgroundColor: '#10B981',
      borderRadius: 2,
    },

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
   * 🎨 RENDERIZAR ACTION CARDS V14.0 - FASE 1
   */
  renderActionCards = (actionCards: import('../types/ChatTypes').ActionCard[], onActionPress?: (card: import('../types/ChatTypes').ActionCard) => void) => {
    if (!actionCards?.length) return null;

    return (
      <View style={this.styles.actionCardsContainer as ViewStyle}>
        <Text style={this.styles.actionCardsTitle as TextStyle}>
          💡 Acciones recomendadas para ti:
        </Text>
        
        <View style={this.styles.actionCardsGrid as ViewStyle}>
          {actionCards.map((card) => (
            <TouchableOpacity
              key={card.id}
              style={[
                this.styles.actionCard as ViewStyle,
                { borderLeftColor: this.getUrgencyColor(card.urgency) }
              ]}
              onPress={() => onActionPress?.(card)}
            >
              <View style={this.styles.actionCardHeader as ViewStyle}>
                <Ionicons 
                  name={this.getActionIcon(card.action) as keyof typeof Ionicons.glyphMap} 
                  size={24} 
                  color={this.theme.primary} 
                />
                <View style={this.styles.actionCardBadge as ViewStyle}>
                  <Text style={this.styles.actionCardCategory as TextStyle}>
                    {this.getCategoryLabel(card.category)}
                  </Text>
                </View>
              </View>
              
              <Text style={this.styles.actionCardTitle as TextStyle}>
                {card.title}
              </Text>
              
              <Text style={this.styles.actionCardDescription as TextStyle}>
                {card.description}
              </Text>
              
              {card.estimatedTime && (
                <View style={this.styles.actionCardFooter as ViewStyle}>
                  <Ionicons name="time-outline" size={14} color={this.theme.secondary} />
                  <Text style={this.styles.actionCardTime as TextStyle}>
                    {card.estimatedTime}
                  </Text>
                </View>
              )}
              
              {card.progress !== undefined && (
                <View style={this.styles.progressContainer as ViewStyle}>
                  <View style={[
                    this.styles.progressBar as ViewStyle,
                    { width: `${card.progress}%` }
                  ]} />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  /**
   * 🎨 HELPERS PARA ACTION CARDS
   */
  private getActionIcon(action: string): string {
    const icons = {
      schedule: 'calendar',
      track: 'analytics',
      learn: 'school',
      test: 'flask',
      lifestyle: 'leaf'
    };
    return icons[action as keyof typeof icons] || 'ellipse';
  }

  private getCategoryLabel(category: string): string {
    const labels = {
      medical: 'Médico',
      educational: 'Educativo',
      tracking: 'Seguimiento',
      lifestyle: 'Estilo de Vida'
    };
    return labels[category as keyof typeof labels] || category;
  }

  private getUrgencyColor(urgency?: string): string {
    const colors = {
      high: '#FF6B6B',
      medium: '#FFA726',
      low: '#66BB6A'
    };
    return colors[urgency as keyof typeof colors] || colors.low;
  }

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
  private readonly getAttachmentIcon = (type: string): string => {
    switch (type) {
      case 'recommendation': return 'medical';
      case 'study': return 'document-text';
      case 'protocol': return 'list';
      case 'chart': return 'bar-chart';
      default: return 'attach';
    }
  };
}
