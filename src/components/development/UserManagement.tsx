/**
 * 👥 COMPONENTE DE GESTIÓN DE USUARIOS
 * 
 * Para desarrollo y testing - permite ver usuarios registrados
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { userStorageService, User } from '@/services/userStorageService';
import { useTheme } from '@/contexts/ThemeContext';

interface UserManagementProps {
  visible: boolean;
  onClose: () => void;
}

export default function UserManagement({ visible, onClose }: UserManagementProps) {
  const { isDark } = useTheme();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      loadUsers();
    }
  }, [visible]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const stats = await userStorageService.getUserStats();
      setUsers(stats.users as User[]);
    } catch (error) {
      console.error('Error cargando usuarios:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearAllUsers = () => {
    Alert.alert(
      '⚠️ Confirmar',
      '¿Estás seguro de que quieres eliminar todos los usuarios?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            await userStorageService.clearAllUsers();
            setUsers([]);
            Alert.alert('✅', 'Todos los usuarios eliminados');
          },
        },
      ]
    );
  };

  if (!visible) return null;

  return (
    <View style={[styles.overlay, isDark && styles.overlayDark]}>
      <View style={[styles.container, isDark && styles.containerDark]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, isDark && styles.textDark]}>
            👥 Usuarios Registrados
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={isDark ? 'white' : 'black'} />
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.stats}>
          <Text style={[styles.statsText, isDark && styles.textDark]}>
            Total de usuarios: {users.length}
          </Text>
        </View>

        {/* Users List */}
        <ScrollView style={styles.usersList}>
          {users.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons 
                name="people-outline" 
                size={48} 
                color={isDark ? '#666' : '#ccc'} 
              />
              <Text style={[styles.emptyText, isDark && styles.textDark]}>
                No hay usuarios registrados
              </Text>
            </View>
          ) : (
            users.map((user, index) => (
              <View key={user.id} style={[styles.userCard, isDark && styles.userCardDark]}>
                <View style={styles.userInfo}>
                  <Text style={[styles.userEmail, isDark && styles.textDark]}>
                    📧 {user.email}
                  </Text>
                  <Text style={[styles.userDetails, isDark && styles.textSecondaryDark]}>
                    🆔 {user.id}
                  </Text>
                  <Text style={[styles.userDetails, isDark && styles.textSecondaryDark]}>
                    📅 Creado: {new Date(user.createdAt).toLocaleDateString()}
                  </Text>
                  {user.lastLogin && (
                    <Text style={[styles.userDetails, isDark && styles.textSecondaryDark]}>
                      🔐 Último login: {new Date(user.lastLogin).toLocaleDateString()}
                    </Text>
                  )}
                </View>
              </View>
            ))
          )}
        </ScrollView>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.refreshButton]}
            onPress={loadUsers}
            disabled={loading}
          >
            <Ionicons name="refresh" size={20} color="white" />
            <Text style={styles.actionButtonText}>
              {loading ? 'Cargando...' : 'Actualizar'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.clearButton]}
            onPress={clearAllUsers}
            disabled={loading}
          >
            <Ionicons name="trash" size={20} color="white" />
            <Text style={styles.actionButtonText}>Limpiar Todo</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  overlayDark: {
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  container: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    margin: 20,
    maxHeight: '80%',
    width: '90%',
  },
  containerDark: {
    backgroundColor: '#1e1e1e',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 8,
  },
  stats: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  statsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  usersList: {
    flex: 1,
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
  },
  userCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  userCardDark: {
    backgroundColor: '#2a2a2a',
    borderColor: '#333',
  },
  userInfo: {
    gap: 4,
  },
  userEmail: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  userDetails: {
    fontSize: 14,
    color: '#666',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  refreshButton: {
    backgroundColor: '#007AFF',
  },
  clearButton: {
    backgroundColor: '#FF3B30',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  textDark: {
    color: '#fff',
  },
  textSecondaryDark: {
    color: '#aaa',
  },
});