import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Avatar, Button, Card, Divider, List, Text, useTheme } from 'react-native-paper';

export default function ProfileScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Avatar.Text size={100} label="AE" style={{ backgroundColor: colors.primary }} />
          <Text variant="headlineSmall" style={styles.name}>Ahmed Kadiri</Text>
          <Text variant="bodyLarge" style={styles.email}>ahmed@gmail.com</Text>
        </View>

        <Card style={styles.infoCard}>
          <Card.Content>
            <List.Item
              title="Department"
              description="Marketing"
              left={props => <List.Icon {...props} icon="domain" />}
            />
            <Divider />
            <List.Item
              title="Role"
              description="Full-time Employee"
              left={props => <List.Icon {...props} icon="account-tie" />}
            />
            <Divider />
            <List.Item
              title="Employee ID"
              description="u_R2zpd"
              left={props => <List.Icon {...props} icon="identifier" />}
            />
          </Card.Content>
        </Card>

        <View style={styles.actionContainer}>
          <Text variant="titleMedium" style={styles.sectionTitle}>Account Settings</Text>
          
          <Card style={styles.actionCard} onPress={() => router.push('/(user)/edit-info')}>
            <Card.Content style={styles.actionContent}>
              <View style={styles.actionLeft}>
                <Avatar.Icon size={40} icon="account-edit" style={{ backgroundColor: colors.primaryContainer }} color={colors.primary} />
                <View style={styles.actionText}>
                  <Text variant="bodyLarge" style={{ fontWeight: '600' }}>Edit Personal Info</Text>
                  <Text variant="bodySmall" style={{ color: colors.outline }}>Update your profile details</Text>
                </View>
              </View>
              <List.Icon icon="chevron-right" />
            </Card.Content>
          </Card>

          <Card style={styles.actionCard} onPress={() => router.push('/(user)/change-password')}>
            <Card.Content style={styles.actionContent}>
              <View style={styles.actionLeft}>
                <Avatar.Icon size={40} icon="lock-reset" style={{ backgroundColor: colors.errorContainer }} color={colors.error} />
                <View style={styles.actionText}>
                  <Text variant="bodyLarge" style={{ fontWeight: '600' }}>Change Password</Text>
                  <Text variant="bodySmall" style={{ color: colors.outline }}>Secure your account</Text>
                </View>
              </View>
              <List.Icon icon="chevron-right" />
            </Card.Content>
          </Card>
        </View>

        <Button 
          mode="contained-tonal" 
          icon="logout" 
          onPress={() => router.replace('/(auth)/login')}
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
    backgroundColor: '#fff',
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
