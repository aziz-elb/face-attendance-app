import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Appbar, useTheme } from 'react-native-paper';
import StatCard from '../../components/StatCard';
import { router } from 'expo-router';
import { useLogout } from '@/hooks/useLogout';

export default function AdminDashboard() {
    const handleLogout = useLogout();
    const { colors } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Appbar.Header elevated>
        <Appbar.Content title="Dashboard" titleStyle={{ fontWeight: 'bold' }} />
        <Appbar.Action icon="logout" onPress={handleLogout} />

      </Appbar.Header>
      
      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="titleLarge" style={styles.sectionTitle}>Global Attendance</Text>
        
        <View style={styles.statsGrid}>
          <StatCard 
            title="Total Users" 
            value="124" 
            icon="account-group" 
            color={colors.primary}
          />
          <StatCard 
            title="Present" 
            value="98" 
            icon="account-check" 
            color="#66BB6A" 
          />
        </View>

        <View style={styles.statsGrid}>
          <StatCard 
            title="Absent" 
            value="26" 
            icon="account-remove" 
            color="#CF6679" 
          />
          <StatCard 
            title="Late" 
            value="12" 
            icon="clock-alert" 
            color="#FFB74D" 
          />
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
  actionSurface: {
    padding: 16,
    borderRadius: 12,
    margin: 8,
  },
  actionButton: {
    marginVertical: 6,
  }
});
