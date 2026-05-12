import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet, View, Alert } from 'react-native';
import { ActivityIndicator, Appbar, List, Text, useTheme, Chip, Searchbar } from 'react-native-paper';
import { api } from '../../lib/api';
import { Attendance, User } from '../../lib/types';
import { AppTheme } from '@/lib/theme';

interface AttendanceWithUser extends Attendance {
  user?: User;
}

export default function AttendanceToday() {
  const { colors } = useTheme();
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState<AttendanceWithUser[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const adminDeptId = api.currentUser?.department || "";
      
      if (!adminDeptId) {
        setLoading(false);
        return;
      }

      // 1. Get all users of this department
      const deptUsers = await api.getUsersByDepartment(adminDeptId);
      
      // 2. Get today's attendance
      const attendanceData = await api.getAttendance(undefined, today);

      // 3. Combine them to show who is present/absent from the department
      const combined: AttendanceWithUser[] = deptUsers
        .filter(u => u.role === 'USER')
        .map(user => {
          const record = attendanceData.find(a => a.user_id === user.id);
          return {
            ...(record || { 
              id: `temp-${user.id}`, 
              user_id: user.id, 
              status: 'NOT_MARKED' as any, 
              date: today,
              is_justified: false,
              justification: null,
              createdAt: ''
            }),
            user
          };
        });

      setRecords(combined);
    } catch (error) {
      console.error("Error fetching today history:", error);
      Alert.alert('Error', 'Failed to load today\'s attendance history');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredRecords = records.filter(r => {
    const fullName = `${r.user?.firstName} ${r.user?.lastName}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase()) || r.user?.email.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'PRESENT':
        return <Chip style={{ backgroundColor: 'rgba(102, 187, 106, 0.15)' }} textStyle={{ color: '#66BB6A' }}>Present</Chip>;
      case 'ABSENT':
        return <Chip style={{ backgroundColor: 'rgba(207, 102, 121, 0.15)' }} textStyle={{ color: colors.error }}>Absent</Chip>;
      default:
        return <Chip style={{ backgroundColor: colors.surfaceVariant }} textStyle={{ color: colors.onSurfaceVariant }}>Not Marked</Chip>;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Appbar.Header elevated>
        <Appbar.BackAction onPress={() => router.replace('/(admin)/attendance')} />
        <Appbar.Content title="Today's History" titleStyle={{ fontWeight: 'bold' }} />
        <Appbar.Action icon="refresh" onPress={fetchData} />
      </Appbar.Header>

      <View style={[styles.header]}>
        <Text variant="titleMedium" style={[styles.dateText, { color: colors.primary }]}>
          {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </Text>
        <Searchbar
          placeholder="Search students..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={[styles.searchBar]}
          mode="bar"
        />
      </View>

      {loading ? (
        <ActivityIndicator style={styles.loader} />
      ) : (
        <FlatList
          data={filteredRecords}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <List.Item
              title={`${item.user?.firstName} ${item.user?.lastName}`}
              description={item.user?.email}
              left={props => <List.Icon {...props} icon="account" />}
              right={() => <View style={styles.chipContainer}>{getStatusChip(item.status)}</View>}
              style={[styles.listItem]}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text variant="bodyLarge">No records found for today</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    
  },
  dateText: {
    marginBottom: 12,
    fontWeight: 'bold',
  },
  searchBar: {
    elevation: 0,
  },
  loader: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  listItem: {
   
  },
  chipContainer: {
    justifyContent: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  }
});
