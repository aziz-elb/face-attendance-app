import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useState } from 'react';
import { router, useFocusEffect } from 'expo-router';
import { Alert, Platform, RefreshControl, StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { ActivityIndicator, Appbar, Badge, Button, Divider, IconButton, List, Modal, Portal, Surface, Text, useTheme } from 'react-native-paper';
import { api } from '../../lib/api';
import { Notification, User } from '../../lib/types';

export default function NotificationScreen() {
  const { colors } = useTheme();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedNotif, setSelectedNotif] = useState<Notification | null>(null);
  const [visible, setVisible] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  const fetchNotifications = useCallback(async () => {
    try {
      const data = await api.getNotifications();
      const userId = api.currentUser?.id; // Placeholder, should be 
      const users = await api.getUsers();
      setUsers(users);
      setNotifications(data.filter(n => n.recipient_id === userId && n.isArchived === false).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (error) {
      if (Platform.OS === "web") {
        alert("Error: Failed to fetch notifications");
      }
      else {
        Alert.alert('Error', 'Failed to fetch notifications');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchNotifications();
    }, [fetchNotifications])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  const showModal = async (notif: Notification) => {
    setSelectedNotif(notif);
    setVisible(true);

    if (notif.status === 'Unread') {
      try {
        await api.updateNotification(notif.id, { status: 'Read' });
        fetchNotifications();
      } catch (error) {
        console.error("Failed to mark notification as read", error);
      }
    }
  };

  const hideModal = () => {
    setVisible(false);
    setSelectedNotif(null);
  };

  const deleteNotification = async (id: string) => {
    try {
      await api.updateNotification(id, { isArchived: true });
      fetchNotifications();
      if (visible) hideModal();
    } catch (error) {
      if (Platform.OS === "web") {
        alert("Error: Failed to delete notification");
      } else {
        Alert.alert('Error', 'Failed to delete notification');
      }
    }
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
       <Appbar.Header elevated >
        <Appbar.Action icon="arrow-left" onPress={() => router.back()} /> 
        <Appbar.Content title="Notifications" titleStyle={{ fontWeight: 'bold' }} />
      </Appbar.Header>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {notifications.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="bell-off-outline" size={48} color={colors.outline} />
            <Text variant="bodyLarge" style={{ marginTop: 8 }}>No notifications yet</Text>
          </View>
        ) : (
          <Surface style={styles.surface} elevation={1}>
            {notifications.map((notif, index) => (
              <React.Fragment key={notif.id}>
                <List.Item
                  title={notif.content}
                  titleNumberOfLines={1}
                  description={new Date(notif.createdAt).toLocaleString()}
                  titleStyle={[styles.title, notif.status === 'Unread' && { fontWeight: 'bold' }]}
                  left={props => (
                    <View style={styles.iconContainer}>
                      <List.Icon {...props} icon="archive-outline" color={notif.status === 'Unread' ? colors.primary : colors.outline} />
                      {notif.status === 'Unread' && <Badge size={8} style={styles.badge} />}
                    </View>
                  )}
                  right={props => (
                    <IconButton
                      {...props}
                      icon="delete-outline"
                      iconColor={colors.error}
                      onPress={() => deleteNotification(notif.id)}
                    />
                  )}
                  onPress={() => showModal(notif)}
                />
                {index < notifications.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </Surface>
        )}
      </ScrollView>

      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={[styles.modalContent, { backgroundColor: colors.surface }]}
        >
          {selectedNotif && (
            <View>
              <View style={styles.modalHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                  <MaterialCommunityIcons name="bell-ring" size={24} color={colors.primary} />
                  <Text variant="titleLarge" style={styles.modalTitle}>Notification</Text>
                </View>
                <IconButton
                  icon="delete-outline"
                  iconColor={colors.error}
                  onPress={() => deleteNotification(selectedNotif.id)}
                />
              </View>
              <Divider style={styles.modalDivider} />

              <Text variant="bodyLarge" style={styles.fullMessage}>{selectedNotif.content}</Text>
              <View  style={{ justifyContent: 'space-between' , flexDirection: 'row' , gap: 16}}>
                <Text style={{fontWeight: 'bold'}}>
                  From: {users.filter(u => u.id === selectedNotif.sender_id).map(u => u.firstName + ' ' + u.lastName).join(', ')}
                </Text>
                <Text style={styles.modalDate}>
                  {new Date(selectedNotif.createdAt).toLocaleString()}
                </Text>
              </View>

              <Button mode="contained" onPress={hideModal} style={styles.closeButton}>
                Close
              </Button>
            </View>
          )}
        </Modal>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  surface: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 16,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: 10,
    right: 0,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
    opacity: 0.5,
  },
  modalContent: {
    margin: 20,
    padding: 20,
    borderRadius: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  modalTitle: {
    marginLeft: 8,
    fontWeight: 'bold',
  },
  modalDivider: {
    marginBottom: 16,
  },
  fullMessage: {
    lineHeight: 24,
    marginBottom: 20,
  },
  modalDate: {
    opacity: 0.6,
    marginBottom: 20,
    textAlign: 'right',
  },
  closeButton: {
    borderRadius: 8,
  }
});
