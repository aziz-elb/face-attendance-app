import { useLogout } from '@/hooks/useLogout';
import { api } from '@/lib/api';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Appbar, Avatar, Button, Card, Divider, List, Text, useTheme } from 'react-native-paper';

export default function ProfileScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [user, setUser] = useState(api.currentUser);
  const handleLogout = useLogout()

  const fetchUserData = useCallback(async () => {
    if (!api.currentUser?.id) return;
    try {
      const updatedUser = await api.getUser(api.currentUser.id);
      api.currentUser = updatedUser;
      setUser(updatedUser);
    } catch (error) {
      console.error("Failed to refresh user data:", error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchUserData();
    }, [fetchUserData])
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Appbar.Header elevated >
        <Appbar.Content title="Profile" titleStyle={{ fontWeight: 'bold' }} />
        <Appbar.Action icon="logout" onPress={handleLogout} />
      </Appbar.Header>
      <View style={styles.content}>
        <View style={styles.header}>
          <Avatar.Text
            size={100}
            label={(user?.firstName?.charAt(0) || '') + (user?.lastName?.charAt(0) || '')}
            style={{ backgroundColor: colors.primary }}
          />
          <Text variant="headlineSmall" style={styles.name}>{user?.firstName} {user?.lastName}</Text>
          <Text variant="bodyLarge" style={styles.email}>{user?.email}</Text>
        </View>

        <Card style={styles.infoCard}>
          <Card.Content>
            <List.Item
              title="Email"
              description={user?.email || 'No email'}
              left={props => <List.Icon {...props} icon="email" />}
            />
            <Divider />
            <List.Item
              title="Role"
              description={user?.role || 'No role'}
              left={props => <List.Icon {...props} icon="account-tie" />}
            />
            <Divider />
            <List.Item
              title="ID"
              description={user?.id || 'No ID'}
              left={props => <List.Icon {...props} icon="identifier" />}
            />
          </Card.Content>
        </Card>

        <View style={styles.actionContainer}>
          <Text variant="titleMedium" style={styles.sectionTitle}>Account Settings</Text>

          <Card style={[styles.actionCard, { backgroundColor: colors.surface }]} onPress={() => router.push('/(user)/upload-photo')}>
            <Card.Content style={styles.actionContent}>
              <View style={styles.actionLeft}>
                <Avatar.Icon size={40} icon="camera" style={{ backgroundColor: colors.tertiary }} color={colors.onTertiary} />
                <View style={styles.actionText}>
                  <Text variant="bodyLarge" style={{ fontWeight: '600' }}>Add photo</Text>
                  <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant }}>add photo for face recognition</Text>
                </View>
              </View>
              <List.Icon icon="chevron-right" />
            </Card.Content>
          </Card>

          <Card style={[styles.actionCard, { backgroundColor: colors.surface }]} onPress={() => router.push('/(user)/edit-info')}>
            <Card.Content style={styles.actionContent}>
              <View style={styles.actionLeft}>
                <Avatar.Icon size={40} icon="account-edit" style={{ backgroundColor: colors.primaryContainer }} color={colors.primary} />
                <View style={styles.actionText}>
                  <Text variant="bodyLarge" style={{ fontWeight: '600' }}>Edit Personal Info</Text>
                  <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant }}>Update your profile details</Text>
                </View>
              </View>
              <List.Icon icon="chevron-right" />
            </Card.Content>
          </Card>

          <Card style={[styles.actionCard, { backgroundColor: colors.surface }]} onPress={() => router.push('/(user)/change-password')}>
            <Card.Content style={styles.actionContent}>
              <View style={styles.actionLeft}>
                <Avatar.Icon size={40} icon="lock-reset" style={{ backgroundColor: colors.errorContainer }} color={colors.error} />
                <View style={styles.actionText}>
                  <Text variant="bodyLarge" style={{ fontWeight: '600' }}>Change Password</Text>
                  <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant }}>Secure your account</Text>
                </View>
              </View>
              <List.Icon icon="chevron-right" />
            </Card.Content>
          </Card>
        </View>

        <Button
          mode="contained-tonal"
          icon="logout"
          onPress={handleLogout}
          style={styles.logoutButton}
        >
          Logout
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginVertical: 32,
  },
  name: {
    marginTop: 16,
    fontWeight: 'bold',
  },
  email: {
    opacity: 0.6,
  },
  infoCard: {
    marginBottom: 32,
    elevation: 2,
  },
  actionContainer: {
    marginBottom: 32,
  },
  sectionTitle: {
    marginBottom: 16,
    fontWeight: 'bold',
    opacity: 0.7,
  },
  actionCard: {
    marginBottom: 12,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    marginLeft: 16,
  },
  logoutButton: {
    marginBottom: 32,
  }
});
