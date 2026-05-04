import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Text, Appbar, List, Button, useTheme, ActivityIndicator } from 'react-native-paper';
import { api } from '../../lib/api';

export default function MarkAttendance() {
  const { colors } = useTheme();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [attendance, setAttendance] = useState({}); // { userId: status }

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await api.getUsers();
      // Filter only regular users of the SAME department as the admin
      const adminDeptId = api.currentUser?.department?.id;
      const students = data.filter(u => 
        u.role === 'USER' && 
        u.department?.id === adminDeptId
      );
      setUsers(students);
      
      // Initialize all as PRESENT by default
      const initialAttendance = {};
      students.forEach(u => {
        initialAttendance[u.id] = 'PRESENT';
      });
      setAttendance(initialAttendance);
    } catch (error) {
      Alert.alert('Error', 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = (userId) => {
    setAttendance(prev => ({
      ...prev,
      [userId]: prev[userId] === 'PRESENT' ? 'ABSENT' : 'PRESENT'
    }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const date = new Date().toISOString().split('T')[0];
      const promises = Object.entries(attendance).map(([userId, status]) => 
        api.addAttendance({
          user_id: userId,
          date,
          status,
          is_justified: false,
          justification: null
        })
      );
      
      await Promise.all(promises);
      Alert.alert('Success', 'Attendance saved successfully for today');
    } catch (error) {
      Alert.alert('Error', 'Failed to save attendance');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <ActivityIndicator style={styles.loader} />;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Appbar.Header elevated>
        <Appbar.Content title="Take Attendance" subtitle={new Date().toDateString()} />
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
              left={props => <List.Icon {...props} icon="account" />}
              right={() => (
                <Button 
                  mode="contained" 
                  onPress={() => toggleStatus(item.id)}
                  buttonColor={isPresent ? '#4CAF50' : '#F44336'}
                  style={styles.toggleBtn}
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
    borderBottomColor: '#f0f0f0',
  },
  toggleBtn: {
    width: 100,
    justifyContent: 'center',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  submitBtn: {
    paddingVertical: 8,
  }
});
