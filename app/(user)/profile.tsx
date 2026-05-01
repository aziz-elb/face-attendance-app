import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Appbar, Avatar, Button, Card, Divider, List, Text, useTheme } from 'react-native-paper';

export default function ProfileScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Appbar.Header elevated>
        <Appbar.Content title="Profile" />
        <Appbar.Action icon="logout" onPress={() => router.replace('/(auth)/login')} />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Avatar.Text size={80} label="AE" style={{ backgroundColor: colors.primary }} />
          <Text variant="headlineSmall" style={styles.name}>Aziz Elb</Text>
          <Text variant="bodyMedium" style={styles.email}>aziz@gmail.com</Text>
        </View>

        <Card style={styles.infoCard}>
          <Card.Content>
            <List.Item
              title="Employee ID"
              description="EMP-2026-001"
              left={props => <List.Icon {...props} icon="identifier" />}
            />
            <Divider />
            <List.Item
              title="Department"
              description="Computer Science"
              left={props => <List.Icon {...props} icon="domain" />}
            />
            <Divider />
            <List.Item
              title="Role"
              description="Software Engineer"
              left={props => <List.Icon {...props} icon="account-tie" />}
            />
          </Card.Content>
        </Card>

        <View style={styles.actions}>
          <Button
            mode="contained"
            onPress={() => router.push('/(user)/edit-info')}
            style={styles.button}
            icon="account-edit"
          >
            Edit Information
          </Button>

          <Button
            mode="outlined"
            onPress={() => router.push('/(user)/change-password')}
            style={styles.button}
            icon="lock-reset"
          >
            Change Password
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginVertical: 24,
  },
  name: {
    marginTop: 12,
    fontWeight: 'bold',
  },
  email: {
    opacity: 0.6,
  },
  infoCard: {
    marginBottom: 24,
    backgroundColor: 'white',
  },
  actions: {
    gap: 12,
  },
  button: {
    paddingVertical: 4,
  }
});
