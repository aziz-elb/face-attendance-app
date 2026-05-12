import React, { useCallback, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Appbar, useTheme, ActivityIndicator } from 'react-native-paper';
import StatCard from '../../components/StatCard';
import { useLogout } from '@/hooks/useLogout';
import { api } from '@/lib/api';
import { useFocusEffect } from 'expo-router';

export default function AdminDashboard() {
  const handleLogout = useLogout();
  const { colors } = useTheme();
  
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    present: 0,
    absent: 0,
    late: 0
  });

  const loadStats = useCallback(async () => {
    setLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const adminDeptId = api.currentUser?.department || "";
      
      if (!adminDeptId) return;

      const [deptUsers, todayAttendance] = await Promise.all([
        api.getUsersByDepartment(adminDeptId),
        api.getAttendance(undefined, today)
      ]);

      const studentIds = new Set(deptUsers.filter(u => u.role === 'USER').map(u => u.id));
      const relevantAttendance = todayAttendance.filter(a => studentIds.has(a.user_id));

      setStats({
        total: studentIds.size,
        present: relevantAttendance.filter(a => a.status === 'PRESENT').length,
        absent: relevantAttendance.filter(a => a.status === 'ABSENT').length,
        late: relevantAttendance.filter(a => a.status === 'LATE').length
      });
    } catch (error) {
      console.error("Dashboard load error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadStats();
    }, [loadStats])
  );

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Appbar.Header elevated>
        <Appbar.Content title="Dashboard" titleStyle={{ fontWeight: 'bold' }} />
        <Appbar.Action icon="logout" onPress={handleLogout} />
      </Appbar.Header>
      
      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="titleLarge" style={styles.sectionTitle}>Department Overview (Today)</Text>
        
        <View style={styles.statsGrid}>
          <StatCard 
            title="Total Students" 
            value={String(stats.total)} 
            icon="account-group" 
            color={colors.primary}
          />
          <StatCard 
            title="Present" 
            value={String(stats.present)} 
            icon="account-check" 
            color="#66BB6A" 
          />
        </View>

        <View style={styles.statsGrid}>
          <StatCard 
            title="Absent" 
            value={String(stats.absent)} 
            icon="account-remove" 
            color="#CF6679" 
          />
          <StatCard 
            title="Late" 
            value={String(stats.late)} 
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
