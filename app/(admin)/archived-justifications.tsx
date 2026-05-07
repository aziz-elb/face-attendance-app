import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, ScrollView, TouchableOpacity } from 'react-native';
import { 
  Text, 
  Appbar, 
  Card, 
  Chip, 
  Portal, 
  Modal, 
  useTheme, 
  ActivityIndicator,
  Divider,
  IconButton,
  Button
} from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { api } from '../../lib/api';
import { Attendance, User, JustificationStatus } from '../../lib/types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AppTheme } from '@/lib/theme';

export default function ArchivedJustificationsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [loading, setLoading] = useState(true);
  const [archivedAttendances, setArchivedAttendances] = useState<Attendance[]>([]);
  const [users, setUsers] = useState<Record<string, User>>({});
  const [selectedJustification, setSelectedJustification] = useState<Attendance | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [attendanceData, userData] = await Promise.all([
        api.getAttendance(),
        api.getUsers()
      ]);

      // Filter only those with justifications and are archived
      const archived = attendanceData.filter(a => a.justification !== null && a.justification.isArchived);
      
      // Map users for easy lookup
      const userMap: Record<string, User> = {};
      userData.forEach(u => {
        userMap[u.id] = u;
      });

      setArchivedAttendances(archived.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      ));

      setUsers(userMap);
    } catch (error) {
      console.error("Error fetching archived justifications:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  const handleUnarchive = async (attendance: Attendance) => {
    try {
      if (!attendance.justification) return;
      
      await api.updateAttendance(attendance.id, {
        justification: {
          ...attendance.justification,
          isArchived: false,
          status: 'PENDING'
        }
      });

      setModalVisible(false);
      fetchData();
    } catch (error) {
      console.error("Error unarchiving justification:", error);
    }
  };

  const STATUS_COLORS = {
    ACCEPTED: '#66BB6A',
    REJECTED: '#CF6679',
    PENDING:  '#FFB74D',
    DEFAULT:  colors.onSurfaceVariant,
  };

  const getStatusColor = (status: JustificationStatus) => {
    switch (status) {
      case 'ACCEPTED': return STATUS_COLORS.ACCEPTED;
      case 'REJECTED': return STATUS_COLORS.REJECTED;
      case 'PENDING':  return STATUS_COLORS.PENDING;
      default:         return STATUS_COLORS.DEFAULT;
    }
  };

  const renderItem = ({ item }: { item: Attendance }) => {
    const user = users[item.user_id];
    const status = item.justification?.status || 'PENDING';

    return (
      <Card 
        style={[styles.card, { borderLeftWidth: 6, borderLeftColor: getStatusColor(status) }]} 
        onPress={() => {
          setSelectedJustification(item);
          setModalVisible(true);
        }}
      >
        <Card.Content>
          <View style={styles.cardHeader}>
            <View>
              <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>
                {user ? `${user.firstName} ${user.lastName}` : 'Unknown User'}
              </Text>
              <Text variant="bodySmall" style={{ opacity: 0.7 }}>
                Date: {item.date}
              </Text>
            </View>
          </View>
          
          <Text variant="bodyMedium" numberOfLines={2} style={styles.messagePreview}>
            "{item.justification?.message}"
          </Text>
        </Card.Content>
      </Card>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Appbar.Header elevated>
        <Appbar.BackAction onPress={() => router.replace('/(admin)/justifications')} />
        <Appbar.Content title="Archived Justifications" titleStyle={{ fontWeight: 'bold' }} />
        <Appbar.Action icon="refresh" onPress={fetchData} />
      </Appbar.Header>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={{ marginTop: 10 }}>Loading archives...</Text>
        </View>
      ) : archivedAttendances.length === 0 ? (
        <View style={styles.center}>
          <MaterialCommunityIcons name="archive-outline" size={64} color={colors.onSurfaceVariant} />
          <Text variant="titleMedium" style={{ color: colors.onSurfaceVariant, marginTop: 16 }}>No archived justifications</Text>
        </View>
      ) : (
        <FlatList
          data={archivedAttendances}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
        />
      )}

      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={[styles.modalContent, { backgroundColor: colors.surface }]}
        >
          {selectedJustification && (
            <ScrollView>
              <View style={styles.modalHeader}>
                <Text variant="headlineSmall" style={{ fontWeight: 'bold' }}>Archived Record</Text>
                <IconButton icon="close" onPress={() => setModalVisible(false)} />
              </View>

              <View style={styles.detailRow}>
                <Text variant="labelLarge">Employee:</Text>
                <Text variant="bodyLarge">
                  {users[selectedJustification.user_id]?.firstName} {users[selectedJustification.user_id]?.lastName}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text variant="labelLarge">Date:</Text>
                <Text variant="bodyLarge">{selectedJustification.date}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text variant="labelLarge">Final Status:</Text>
                <Chip 
                  style={{ backgroundColor: getStatusColor(selectedJustification.justification?.status || 'PENDING') }}
                  textStyle={{ color: 'white' }}
                >
                  {selectedJustification.justification?.status}
                </Chip>
              </View>

              <Divider style={{ marginVertical: 16 }} />

              <Text variant="labelLarge">Reason / Message:</Text>
              <View style={styles.messageContainer}>
                <Text variant="bodyMedium" style={styles.messageText}>
                  {selectedJustification.justification?.message || "No message provided."}
                </Text>
              </View>

              <Button 
                mode="contained-tonal" 
                onPress={() => handleUnarchive(selectedJustification)}
                style={{ marginTop: 24 }}
                icon="archive-arrow-up"
              >
                Unarchive & Reset to Pending
              </Button>
            </ScrollView>
          )}
        </Modal>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  list: {
    padding: 12,
  },
  card: {
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  messagePreview: {
    fontStyle: 'italic',
  },
  modalContent: {
    padding: 20,
    margin: 20,
    borderRadius: 16,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  messageContainer: {
    backgroundColor: AppTheme.colors.surfaceVariant,
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  messageText: {
    lineHeight: 20,
  }
});
