import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Alert, RefreshControl, Platform } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Card, Text, IconButton, useTheme, ActivityIndicator, Divider } from 'react-native-paper';
import { useRouter, useFocusEffect } from 'expo-router';
import { api } from '../../lib/api';
import { Attendance } from '../../lib/types';
import StatCard from '../../components/StatCard';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function AttendanceScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [attendance, setAttendance] = useState<Attendance[]>([]);

  const fetchAttendance = useCallback(async () => {
    try {
      const data = await api.getAttendance();
     
      const userId = api.currentUser.id; 
      setAttendance(data.filter(a => a.user_id === userId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    } catch (error) {
      if (Platform.OS === "web") {
        alert("Error: Failed to fetch attendance history");
      }
      else {
        Alert.alert('Error', 'Failed to fetch attendance history');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchAttendance();
    }, [fetchAttendance])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchAttendance();
  };

  const getStatusColor = (item: Attendance) => {
    if (item.status !== 'ABSENT') return colors.outlineVariant;
    if (!item.justification) return '#F44336'; // RED
    if (item.justification.status === 'PENDING') return '#FF9800'; // YELLOW
    if (item.justification.status === 'ACCEPTED') return '#4CAF50'; // GREEN
    if (item.justification.status === 'REJECTED') return '#F44336'; // RED
    return colors.outlineVariant;
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;

  const absences = attendance.filter(a => a.status === 'ABSENT');
  const presentDays = attendance.filter(a => a.status === 'PRESENT').length;
  const lateDays = attendance.filter(a => a.status === 'LATE').length;

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.content}>
        <View style={styles.statsGrid}>
          <StatCard
            title="Present"
            value={presentDays}
            icon="account-check"
            color="#4CAF50"
          />
          
          <StatCard
            title="Absent"
            value={absences.length}
            icon="account-clock"
            color="#F44336"
          />
        </View>

        <Text variant="titleMedium" style={styles.sectionTitle}>Attendance History</Text>

        {attendance.filter(item => item.status ==="ABSENT").map((item) => (
          <Card 
            key={item.id} 
            style={[
              styles.attendanceCard, 
              { borderLeftWidth: 6, borderLeftColor: getStatusColor(item) }
            ]}
          >
            <Card.Content style={styles.cardContent}>
              <View style={styles.infoSection}>
                <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>{new Date(item.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</Text>
                <Text variant="bodyMedium" style={{ color: colors.outline }}>Status: {item.status}</Text>
                {item.justification && (
                  <View style={styles.justificationContainer}>
                    <Text variant="bodySmall" style={{ color: getStatusColor(item), fontWeight: 'bold' }}>
                      Justification: {item.justification.status}
                    </Text>
                    
                  </View>
                )}
              </View>
              
              <View style={styles.actionSection}>
                {item.status === 'ABSENT' && !item.justification && (
                  <IconButton 
                    icon="email-outline" 
                    mode="contained-tonal"
                    onPress={() => router.push({
                      pathname: '/(user)/justify-absence',
                      params: { attendanceId: item.id, date: item.date }
                    })}
                  />
                )}
                {item.status === 'PRESENT' && (
                  <MaterialCommunityIcons name="check-circle" size={24} color="#4CAF50" />
                )}
                {item.status === 'LATE' && (
                  <MaterialCommunityIcons name="clock-alert" size={24} color="#FF9800" />
                )}
                {item.justification && item.justification.status === 'ACCEPTED' && (
                  <MaterialCommunityIcons name="check-decagram" size={24} color="#4CAF50" />
                )}
              </View>
            </Card.Content>
          </Card>
        ))}

        {attendance.length === 0 && (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="calendar-blank" size={48} color={colors.outline} />
            <Text variant="bodyLarge" style={{ color: colors.outline, marginTop: 8 }}>No attendance records found</Text>
          </View>
        )}
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
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sectionTitle: {
    marginVertical: 16,
    fontWeight: 'bold',
  },
  attendanceCard: {
    marginBottom: 12,
    elevation: 1,
    backgroundColor: '#fff',
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoSection: {
    flex: 1,
  },
  actionSection: {
    marginLeft: 16,
  },
  justificationContainer: {
    marginTop: 4,
    paddingTop: 4,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#eee',
  },
  justificationText: {
    fontStyle: 'italic',
    color: '#666',
    marginTop: 2,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 64,
  }
});
