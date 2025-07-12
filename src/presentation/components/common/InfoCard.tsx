import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/config/theme';
import Text from './Text';

type InfoCardType = 'info' | 'tip' | 'warning' | 'success';

interface InfoCardProps {
  type?: InfoCardType;
  title?: string;
  message: string;
  iconName?: keyof typeof Ionicons.glyphMap;
}

export const InfoCard = ({ 
  type = 'info', 
  title, 
  message, 
  iconName 
}: InfoCardProps) => {
  const getTypeConfig = () => {
    switch (type) {
      case 'tip':
        return {
          backgroundColor: '#F0F9FF',
          borderColor: theme.colors.info,
          iconColor: theme.colors.info,
          defaultIcon: 'bulb-outline' as keyof typeof Ionicons.glyphMap,
        };
      case 'warning':
        return {
          backgroundColor: '#FFFBEB',
          borderColor: theme.colors.warning,
          iconColor: theme.colors.warning,
          defaultIcon: 'warning-outline' as keyof typeof Ionicons.glyphMap,
        };
      case 'success':
        return {
          backgroundColor: '#F0FDF4',
          borderColor: theme.colors.success,
          iconColor: theme.colors.success,
          defaultIcon: 'checkmark-circle-outline' as keyof typeof Ionicons.glyphMap,
        };
      default:
        return {
          backgroundColor: '#F8FAFC',
          borderColor: theme.colors.info,
          iconColor: theme.colors.info,
          defaultIcon: 'information-circle-outline' as keyof typeof Ionicons.glyphMap,
        };
    }
  };

  const config = getTypeConfig();

  return (
    <View style={[
      styles.container,
      {
        backgroundColor: config.backgroundColor,
        borderColor: config.borderColor,
      }
    ]}>
      <View style={styles.iconContainer}>
        <Ionicons
          name={iconName || config.defaultIcon}
          size={20}
          color={config.iconColor}
        />
      </View>
      <View style={styles.content}>
        {title && (
          <Text variant="label" style={[styles.title, { color: config.iconColor }]}>
            {title}
          </Text>
        )}
        <Text variant="body" style={styles.message}>
          {message}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.s,
    borderWidth: 1,
    marginVertical: theme.spacing.s,
  },
  iconContainer: {
    marginRight: theme.spacing.s,
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  title: {
    marginBottom: theme.spacing.xs,
    fontWeight: '600',
  },
  message: {
    lineHeight: 20,
  },
});
