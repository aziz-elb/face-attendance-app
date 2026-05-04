import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, RefreshControl } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { List, Text, Surface, useTheme, Divider, Badge, ActivityIndicator } from 'react-native-paper';
import { api } from '../../lib/api';
import { Notification } from '../../lib/types';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function NotificationScreen() {
  const { colors } = useTheme();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const fetchNotifications = async () => {
    try {
      const data = await api.getNotifications();
      const userId = "u_R2zpd"; // Placeholder, should be api.currentUser.id
      setNotifications(data.filter(n => n.recipient_id === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch notifications');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
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
                  description={new Date(notif.createdAt).toLocaleString()}
                  titleStyle={[styles.title, notif.status === 'Unread' && { fontWeight: 'bold' }]}
                  left={props => (
                    <View style={styles.iconContainer}>
                      <List.Icon {...props} icon="bell-ring" color={notif.status === 'Unread' ? colors.primary : colors.outline} />
                      {notif.status === 'Unread' && <Badge size={8} style={styles.badge} />}
                    </View>
                  )}
                  onPress={() => {}}
                />
                {index < notifications.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </Surface>
        )}
      </ScrollView>
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
  }
});
