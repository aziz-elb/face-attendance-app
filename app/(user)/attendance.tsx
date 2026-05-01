import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Appbar, List, Surface, Text } from 'react-native-paper';
import StatCard from '../../components/StatCard';

export default function AttendanceScreen() {
  return (
    <View style={styles.container}>
      <Appbar.Header elevated>
        <Appbar.Content title="Attendance History" />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.statsGrid}>
          <StatCard
            title="Total Days"
            value="22"
            icon="calendar-month"
            color="#673AB7"
            subtitle="Current month"
          />
          <StatCard
            title="Avg. Hours"
            value="7.5h"
            icon="timer-outline"
            color="#009688"
            subtitle="Per day"
          />
        </View>

        <Text variant="titleMedium" style={styles.sectionTitle}>Abbsences</Text>

        <Surface style={styles.listSurface} elevation={1}>
          <List.Item
            title="May 01, 2026"
            description="Check-in: 08:30 AM | Check-out: --:--"
            left={props => <List.Icon {...props} icon="check-circle" color="#4CAF50" />}
          />
          <List.Item
            title="April 30, 2026"
            description="Check-in: 08:45 AM | Check-out: 05:00 PM"
            left={props => <List.Icon {...props} icon="check-circle" color="#4CAF50" />}
          />
          <List.Item
            title="April 29, 2026"
            description="Check-in: 09:15 AM | Check-out: 06:10 PM"
            left={props => <List.Icon {...props} icon="clock-alert" color="#FF9800" />}
          />
        </Surface>
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
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sectionTitle: {
    marginVertical: 16,
    marginHorizontal: 8,
    fontWeight: 'bold',
  },
  listSurface: {
    borderRadius: 12,
    backgroundColor: 'white',
    overflow: 'hidden',
  }
});
