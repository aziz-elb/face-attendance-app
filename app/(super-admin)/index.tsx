import StatCard from '@/components/StatCard';
import { useLogout } from '@/hooks/useLogout';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Appbar, Card, Surface, Text, useTheme, ActivityIndicator } from 'react-native-paper';
import { api } from '@/lib/api';

export default function SuperAdminDashboard() {
  const handleLogout = useLogout();
  const { colors } = useTheme();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    students: 0,
    departments: 0,
    admins: 0,
    superAdmins: 0
  });

  const loadStats = useCallback(async () => {
    setLoading(true);
    try {
      const [allUsers, allDepartments] = await Promise.all([
        api.getUsers(),
        api.getDepartments()
      ]);

      setStats({
        students: allUsers.filter(u => u.role === 'USER').length,
        departments: allDepartments.length,
        admins: allUsers.filter(u => u.role === 'ADMIN').length,
        superAdmins: allUsers.filter(u => u.role === 'SUPER_ADMIN').length
      });
    } catch (error) {
      console.error("Super admin dashboard load error:", error);
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
        <Text variant="titleLarge" style={styles.sectionTitle}>Global Overview</Text>

        <View style={styles.statsGrid}>
          <StatCard
            title="Students"
            value={String(stats.students)}
            icon="account-group"
            color={colors.primary}
          />
          <StatCard
            title="Departments"
            value={String(stats.departments)}
            icon="office-building"
            color="#66BB6A"
          />
        </View>

        <View style={styles.statsGrid}>
          <StatCard
            title="Admins"
            value={String(stats.admins)}
            icon="account-tie"
            color="#CF6679"
          />
          <StatCard
            title="Super Admins"
            value={String(stats.superAdmins)}
            icon="account-lock"
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
  },
  card: {
    borderRadius: 8,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  iconContainer: {
    padding: 8,
    borderRadius: 8,
  },
});
