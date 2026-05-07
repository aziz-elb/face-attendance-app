import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Appbar, Avatar, Button, Card, Divider, List, Text, useTheme } from 'react-native-paper';
import { api } from '../../lib/api';
import { useLogout } from '@/hooks/useLogout';

export default function AdminProfile() {
  const { colors } = useTheme();
  const [user, setUser] = useState(api.currentUser);
  const handleLogout = useLogout();

  // Refresh user data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      setUser(api.currentUser);
    }, [])
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Appbar.Header elevated >
        <Appbar.Content title="Profile" titleStyle={{ fontWeight: 'bold' }} />
        <Appbar.Action icon="logout" onPress={handleLogout} />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.profileCard}>
          <Card.Content style={styles.header}>
            <Avatar.Icon size={80} icon="shield-crown" style={{ backgroundColor: colors.primaryContainer }} color={colors.primary} />
            <Text variant="headlineSmall" style={styles.name}>
              {user ? `${user.firstName} ${user.lastName}` : 'Admin User'}
            </Text>
            <Text variant="bodyLarge" style={styles.role}>
              {user?.role || 'Admin'}
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.infoCard}>
          <List.Section>
            <List.Subheader>Personal Information</List.Subheader>
            <List.Item
              title="Email Address"
              description={user?.email || 'N/A'}
              left={props => <List.Icon {...props} icon="email" />}
            />
            <Divider />
            <List.Item
              title="Department"
              description={user?.department?.title || 'No Department assigned'}
              left={props => <List.Icon {...props} icon="office-building" />}
            />
            <Divider />
            <List.Item
              title="Role"
              description={user?.role}
              left={props => <List.Icon {...props} icon="account"  />}
            />
          </List.Section>
        </Card>

        <View style={styles.actionContainer}>

          <Text variant="titleMedium" style={styles.sectionTitle}>Settings</Text>
          <Button
            mode="contained"
            onPress={() => router.push('/(admin)/edit-info')}
            style={styles.button}
            icon="account-edit"
          >
            Edit Profile Info
          </Button>

          <Button
            mode="outlined"
            onPress={() => router.push('/(admin)/change-password')}
            style={styles.button}
            icon="lock-reset"
          >
            Change Password
          </Button>

          <Button
            mode="text"
            onPress={handleLogout}
            style={styles.logoutButton}
            icon="logout"
            textColor={colors.error}
          >
            Sign Out
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  profileCard: {
    marginBottom: 16,
    borderRadius: 16,
    elevation: 2,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  name: {
    marginTop: 12,
    fontWeight: 'bold',
  },
  role: {
    opacity: 0.7,
    marginTop: 4,
  },
  infoCard: {
    marginBottom: 24,
    borderRadius: 16,
    elevation: 1,
  },
  sectionTitle: {
    marginBottom: 8,
    marginTop: 8,
    fontWeight: '600',
    opacity: 0.8,
  },
  actionContainer: {
    gap: 8,
  },
  button: {
    borderRadius: 12,
    paddingVertical: 4,
  },
  logoutButton: {
    marginTop: 16,
  }
});
