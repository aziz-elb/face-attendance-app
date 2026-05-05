import { router, useFocusEffect } from 'expo-router';
import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Platform, Alert } from 'react-native';
import { Avatar, Button, Card, Divider, List, Text, Appbar, useTheme } from 'react-native-paper';
import { api } from '../../lib/api';

export default function SuperAdminProfile() {
  const { colors } = useTheme();
  const [user, setUser] = useState(api.currentUser);

  // Refresh user data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      setUser(api.currentUser);
    }, [])
  );

  // Fallback mock data if user is not available
  const adminInfo = user || {
    firstName: 'Super',
    lastName: 'Admin',
    email: 'super@demo.com',
    role: 'Super Administrator' as any
  };

  const handleLogout = () => {
    if (Platform.OS === "android") {
      Alert.alert('Logout', 'Are you sure you want to logout?', [
        { text: 'Cancel' },
        { text: 'Logout', onPress: () => router.replace('/(auth)/login') }
      ]);
    } else {
  
      router.replace('/(auth)/login');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.profileCard}>
          <Card.Content style={styles.headerContent}>
            <Avatar.Icon 
              size={80} 
              icon="account-tie" 
              style={{ backgroundColor: colors.primaryContainer }} 
              color={colors.primary} 
            />
            <Text variant="headlineSmall" style={styles.name}>
              {adminInfo.firstName} {adminInfo.lastName}
            </Text>
            <Text variant="bodyLarge" style={styles.role}>
              {adminInfo.role || 'Super Administrator'}
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.infoCard}>
          <List.Section>
            <List.Subheader>Account Information</List.Subheader>
            <List.Item
              title="Full Name"
              description={`${adminInfo.firstName} ${adminInfo.lastName}`}
              left={props => <List.Icon {...props} icon="account-details" />}
            />
            <Divider />
            <List.Item
              title="Email Address"
              description={adminInfo.email}
              left={props => <List.Icon {...props} icon="email" />}
            />
            <Divider />
            <List.Item
              title="Security"
              description="Change account password"
              left={props => <List.Icon {...props} icon="lock-outline" />}
              onPress={() => router.push('/(super-admin)/change-password')}
              right={props => <List.Icon {...props} icon="chevron-right" />}
            />
          </List.Section>
        </Card>

        <View style={styles.actionContainer}>
          <Text variant="titleMedium" style={styles.sectionTitle}>Settings</Text>
          <Button 
            mode="contained" 
            onPress={() => router.push('/(super-admin)/edit-info')} 
            style={styles.button}
            icon="account-edit"
          >
            Edit Profile Info
          </Button>
          
          <Button 
            mode="outlined" 
            onPress={() => router.push('/(super-admin)/change-password')} 
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
    backgroundColor: '#f5f5f5',
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
  headerContent: {
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
