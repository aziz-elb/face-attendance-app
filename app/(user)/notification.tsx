import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { List, Text, Surface, useTheme, Divider, Badge } from 'react-native-paper';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'attendance' | 'system' | 'alert';
  isRead: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'Attendance Success',
    message: 'Your check-in at 08:30 AM has been successfully recorded.',
    time: '2 hours ago',
    type: 'attendance',
    isRead: false,
  },
  {
    id: '2',
    title: 'Department Update',
    message: 'A new meeting has been scheduled for the Computer Science department.',
    time: '5 hours ago',
    type: 'system',
    isRead: false,
  },
  {
    id: '3',
    title: 'Late Arrival',
    message: 'You were marked late for your shift yesterday.',
    time: '1 day ago',
    type: 'alert',
    isRead: true,
  },
  {
    id: '4',
    title: 'Welcome!',
    message: 'Welcome to the Face Attendance app. Complete your profile to get started.',
    time: '2 days ago',
    type: 'system',
    isRead: true,
  },
];

export default function NotificationScreen() {
  const { colors } = useTheme();

  const getIcon = (type: string) => {
    switch (type) {
      case 'attendance': return 'calendar-check';
      case 'alert': return 'alert-circle';
      default: return 'bell';
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'attendance': return '#4CAF50';
      case 'alert': return '#F44336';
      default: return colors.primary;
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {MOCK_NOTIFICATIONS.length === 0 ? (
          <View style={styles.emptyState}>
            <List.Icon icon="bell-off-outline" color={colors.outline} />
            <Text variant="bodyLarge">No notifications yet</Text>
          </View>
        ) : (
          <Surface style={styles.surface} elevation={1}>
            {MOCK_NOTIFICATIONS.map((notif, index) => (
              <React.Fragment key={notif.id}>
                <List.Item
                  title={notif.title}
                  description={notif.message}
                  titleStyle={[styles.title, !notif.isRead && { fontWeight: 'bold' }]}
                  descriptionStyle={styles.description}
                  left={props => (
                    <View style={styles.iconContainer}>
                      <List.Icon {...props} icon={getIcon(notif.type)} color={getIconColor(notif.type)} />
                      {!notif.isRead && <Badge size={8} style={styles.badge} />}
                    </View>
                  )}
                  right={() => (
                    <Text variant="bodySmall" style={styles.time}>{notif.time}</Text>
                  )}
                  onPress={() => {}}
                />
                {index < MOCK_NOTIFICATIONS.length - 1 && <Divider />}
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
  },
  title: {
    fontSize: 16,
  },
  description: {
    marginTop: 4,
  },
  time: {
    alignSelf: 'center',
    opacity: 0.5,
    marginRight: 8,
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
