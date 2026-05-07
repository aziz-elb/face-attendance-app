import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Appbar, Text, useTheme } from 'react-native-paper';
import StatCard from '../../components/StatCard';
import { api } from '../../lib/api';

export default function UserHome() {
  const router = useRouter();
  const { colors } = useTheme();
  const user = api.currentUser;

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Appbar.Header elevated>
        <Appbar.Content title="Home" titleStyle={{ fontWeight: 'bold' }} />
        <Appbar.Action icon="bell" onPress={() => router.push('/(user)/notification')} />
      </Appbar.Header>

      <View style={styles.content}>
        <View style={styles.welcomeSection}>
          <Text variant="headlineSmall" style={styles.welcomeText}>
            Welcome back{user?.firstName ? `, ${user.firstName}` : ''}!
          </Text>
          <Text variant="bodyMedium" style={{ color: colors.onSurfaceVariant }}>
            Here is your attendance summary
          </Text>
        </View>

        <View style={styles.statsGrid}>
          <StatCard
            title="Present"
            value="18"
            icon="account-check"
            color="#66BB6A"
            subtitle="Days this month"
          />
          <StatCard
            title="Absent"
            value="2"
            icon="account-remove"
            color="#CF6679"
            subtitle="Days this month"
          />
        </View>

        <View style={styles.statsGrid}>
          <StatCard
            title="Late"
            value="3"
            icon="clock-alert"
            color="#FFB74D"
            subtitle="Arrivals"
          />
          <StatCard
            title="Department"
            value={user?.department?.title ?? '—'}
            icon="office-building"
            color={colors.primary}
            subtitle="Current Assignment"
          />
        </View>
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
  welcomeSection: {
    marginBottom: 24,
  },
  welcomeText: {
    fontWeight: 'bold',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
});
