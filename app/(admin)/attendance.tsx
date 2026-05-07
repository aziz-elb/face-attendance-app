import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, Platform, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Appbar, Button, List, useTheme } from 'react-native-paper';
import { api } from '../../lib/api';
import { useLogout } from '@/hooks/useLogout';
import { Attendance, AttendanceStatus, User } from '../../lib/types';
import { AppTheme } from '@/lib/theme';

export default function MarkAttendance() {
  const { colors } = useTheme();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>({}); // { userId: status }
  const [existingRecords, setExistingRecords] = useState<Attendance[]>([]); // Store today's records
  const handleLogout = useLogout();
  

  const fetchUsers = useCallback(async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const [usersData, attendanceData] = await Promise.all([
        api.getUsers(),
        api.getAttendance()
      ]);

      // Filter only regular users of the SAME department as the admin
      const adminDeptId = api.currentUser?.department?.id;
      const students = usersData.filter(u =>
        u.role === 'USER' &&
        u.department?.id === adminDeptId
      );
      setUsers(students);

      // Get today's attendance records
      const todayRecords = attendanceData.filter(a => a.date === today);
      setExistingRecords(todayRecords);

      // Initialize as PRESENT or with existing status
      const initialAttendance: Record<string, AttendanceStatus> = {};
      students.forEach(u => {
        const record = todayRecords.find(r => r.user_id === u.id);
        initialAttendance[u.id] = record ? record.status : 'PRESENT';
      });
      setAttendance(initialAttendance);
    } catch (error) {
      if (Platform.OS === "web") {
        alert('Error\nFailed to load users')
      } else {
        Alert.alert('Error', 'Failed to load users');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchUsers();
    }, [fetchUsers])
  );

  const toggleStatus = (userId: string) => {
    setAttendance(prev => ({
      ...prev,
      [userId]: prev[userId] === 'PRESENT' ? 'ABSENT' : 'PRESENT'
    }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const promises = Object.entries(attendance).map(([userId, status]) => {
        const existing = existingRecords.find(r => r.user_id === userId);

        if (existing) {
          // Update existing record for today
          return api.updateAttendance(existing.id, { status });
        } else {
          // Create new record for today
          return api.addAttendance({
            user_id: userId,
            date: today,
            status,
            is_justified: false,
            justification: null
          });
        }
      });

      await Promise.all(promises);
      // Refresh to update existingRecords state
      await fetchUsers();
      if (Platform.OS === "web") {
        alert('Success\nAttendance synchronized successfully for today')
      } else {

        Alert.alert('Success', 'Attendance synchronized successfully for today');
      }
    } catch (error) {
      if (Platform.OS === "web") {
        alert('Error\nFailed to save attendance')
      } else {
        Alert.alert('Error', 'Failed to save attendance');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <ActivityIndicator style={styles.loader} />;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Appbar.Header elevated>
        <Appbar.Content title="Attendance" titleStyle={{ fontWeight: 'bold' }} />
        <Appbar.Action icon="logout" onPress={handleLogout} />
      </Appbar.Header>

      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const status = attendance[item.id];
          const isPresent = status === 'PRESENT';
          return (
            <List.Item
              title={`${item.firstName} ${item.lastName}`}
              description={item.email}
              descriptionStyle={{ fontSize: 12, color: colors.onSurfaceVariant }}
              left={props => <List.Icon {...props} icon="account" />}
              right={() => (
                <Button
                  mode="contained"
                  onPress={() => toggleStatus(item.id)}
                  buttonColor={isPresent ? '#66BB6A' : '#CF6679'}
                  style={styles.toggleBtn}
                  labelStyle={{ fontSize: 12, fontWeight: 'bold' }}
                >
                  {isPresent ? 'Present' : 'Absent'}
                </Button>
              )}
              style={styles.listItem}
            />
          );
        }}
      />

      <View style={styles.footer}>
        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={submitting}
          disabled={submitting}
          style={styles.submitBtn}
          icon="check-all"
        >
          Submit Attendance
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loader: {
    flex: 1,
  },
  listItem: {
    borderBottomWidth: 1,
    borderBottomColor: AppTheme.colors.outlineVariant,
  },
  toggleBtn: {
    width: 100,
    justifyContent: 'center',
  },
  footer: {
    padding: 16,
    borderTopColor: AppTheme.colors.outlineVariant,
    backgroundColor: AppTheme.colors.background,
  },
  submitBtn: {
    paddingVertical: 8,
  }
});
