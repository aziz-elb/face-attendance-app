import { Link, router, useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, Platform, StyleSheet, Text, View } from 'react-native';
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
      const adminDeptId = api.currentUser?.department || "";

      if (!adminDeptId) {
        setLoading(false);
        return;
      }

      const [usersData, attendanceData] = await Promise.all([
        api.getUsersByDepartment(adminDeptId),
        api.getAttendance()
      ]);

      // Filter only regular users
      const students = usersData.filter(u => u.role === 'USER');
      setUsers(students);

      // Get today's attendance records - handle date comparison carefully
      const todayRecords = (attendanceData || []).filter(a => {
        if (!a.date) return false;
        // Compare only YYYY-MM-DD part
        return a.date.split('T')[0] === today;
      });
      setExistingRecords(todayRecords);

      // Initialize with existing status or PRESENT
      const initialAttendance: Record<string, AttendanceStatus> = {};
      students.forEach(u => {
        const record = todayRecords.find(r => r.user_id === u.id);
        initialAttendance[u.id] = record ? record.status : 'PRESENT';
      });
      setAttendance(initialAttendance);
    } catch (error) {
      console.error("Fetch users error:", error);
      if (Platform.OS === "web") {
        alert('Error: Failed to load data. Please check your connection.');
      } else {
        Alert.alert('Error', 'Failed to load data');
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
      const records = Object.entries(attendance).map(([userId, status]) => ({
        user_id: userId,
        status: status
      }));

      await api.syncAttendance(today, records);

      // Refresh to update existingRecords state
      await fetchUsers();

      const successMsg = 'Attendance synchronized successfully for today';
      if (Platform.OS === "web") {
        alert('Success: ' + successMsg);
      } else {
        Alert.alert('Success', successMsg);
      }
    } catch (error) {
      console.error("Submit attendance error:", error);
      const errorMsg = 'Failed to save attendance';
      if (Platform.OS === "web") {
        alert('Error: ' + errorMsg);
      } else {
        Alert.alert('Error', errorMsg);
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
        <Text style={{ fontWeight: 'bold', color: colors.primary, fontSize: 16 }}>
          {String(new Date().toLocaleDateString())}
        </Text>
        <Appbar.Action icon="logout" onPress={handleLogout} />
      </Appbar.Header>

      <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: AppTheme.colors.outlineVariant, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        
        <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' , justifyContent: 'space-between' , width: '100%' }}>
          <Button 
            icon="camera-account" 
            mode="contained-tonal" 
            onPress={() => router.push('/(admin)/mark-attendance')}
            style={{ marginTop: 4 }}
          >
            Face Scan
          </Button>
          <Button 
            icon="history" 
            onPress={() => router.push('/(admin)/attendance-today')} 
            style={{ marginTop: 4 }}
          >
            History
          </Button>
        </View>
      </View>

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
