import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Appbar, Text, useTheme, ActivityIndicator } from 'react-native-paper';
import StatCard from '../../components/StatCard';
import { api } from '../../lib/api';
import { Attendance } from '../../lib/types';

export default function UserHome() {
  const router = useRouter();
  const { colors } = useTheme();
  const user = api.currentUser;

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    present: 0,
    absent: 0,
    late: 0,
    departmentTitle: '—'
  });

  useEffect(() => {
    const loadStats = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const [attendance, departments] = await Promise.all([
          api.getAttendance(user.id),
          api.getDepartments()
        ]);

        const dept = departments.find(d => String(d.id) === String(user.department));
        
        setStats({
          present: attendance.filter(a => a.status === 'PRESENT').length,
          absent: attendance.filter(a => a.status === 'ABSENT').length,
          late: attendance.filter(a => a.status === 'LATE').length,
          departmentTitle: dept?.title || '—'
        });
      } catch (error) {
        console.error("Failed to load user stats", error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [user]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

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
            value={String(stats.present)}
            icon="account-check"
            color="#66BB6A"
            subtitle="Total records"
          />
          <StatCard
            title="Absent"
            value={String(stats.absent)}
            icon="account-remove"
            color="#CF6679"
            subtitle="Total records"
          />
        </View>

        <View style={styles.statsGrid}>
          <StatCard
            title="Late"
            value={String(stats.late)}
            icon="clock-alert"
            color="#FFB74D"
            subtitle="Arrivals"
          />
          <StatCard
            title="Department"
            value={stats.departmentTitle}
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
