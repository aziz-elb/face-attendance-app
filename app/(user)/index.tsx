import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Appbar, Text, useTheme } from 'react-native-paper';
import StatCard from '../../components/StatCard';

export default function UserHome() {
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Appbar.Header elevated>
        <Appbar.Content title="Face Attendance" subtitle="Overview" />
        <Appbar.Action icon="bell-outline" onPress={() => router.push('/(user)/notification')} />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="titleLarge" style={styles.sectionTitle}>Dashboard Statistics</Text>

        <View style={styles.statsGrid}>
          <StatCard
            title="Present"
            value="18"
            icon="account-check"
            color="#4CAF50"
            subtitle="Days this month"
          />
          <StatCard
            title="Absent"
            value="2"
            icon="account-remove"
            color="#F44336"
            subtitle="Days this month"
          />
        </View>

        <View style={styles.statsGrid}>
          <StatCard
            title="Late"
            value="3"
            icon="clock-alert"
            color="#FF9800"
            subtitle="Arrivals"
          />
          <StatCard
            title="Department"
            value="IT"
            icon="domain"
            color="#2196F3"
            subtitle="Computer Science"
          />
        </View>

        <Text variant="titleMedium" style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.placeholderCard}>
          <Text variant="bodyMedium">Check-in at 08:30 AM (Today)</Text>
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
    padding: 12,
  },
  sectionTitle: {
    marginVertical: 16,
    marginHorizontal: 8,
    fontWeight: 'bold',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  placeholderCard: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    margin: 8,
    elevation: 1,
  }
});
