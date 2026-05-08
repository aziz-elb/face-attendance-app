import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Text, useTheme } from 'react-native-paper';
import StatCard from '../../components/StatCard';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function UserHome() {
  const router = useRouter();
  const { colors } = useTheme();

  return (
    
      <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.content}>
          <View style={styles.welcomeSection}>
            <Text variant="headlineSmall" style={styles.welcomeText}>Welcome back!</Text>
            <Text variant="bodyMedium" style={{ color: colors.outline }}>Here is your attendance summary</Text>
          </View>

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
              value="Marketing"
              icon="office-building"
              color="#6200ee"
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
  recentActivityCard: {
    marginTop: 16,
    elevation: 2,
  }
});
