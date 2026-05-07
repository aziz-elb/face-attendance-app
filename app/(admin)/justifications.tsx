import { useLogout } from '@/hooks/useLogout';
import { AppTheme } from '@/lib/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, View } from 'react-native';
import {
  ActivityIndicator,
  Appbar,
  Button,
  Card,
  Chip,
  Divider,
  IconButton,
  Modal,
  Portal,
  Text,
  useTheme
} from 'react-native-paper';
import { api } from '../../lib/api';
import { Attendance, JustificationStatus, User } from '../../lib/types';

export default function JustificationsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [loading, setLoading] = useState(true);
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [users, setUsers] = useState<Record<string, User>>({});
  const [selectedJustification, setSelectedJustification] = useState<Attendance | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const handleLogout = useLogout();

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const fetchData = async () => {
    try {
      setLoading(true);
      const [attendanceData, userData] = await Promise.all([
        api.getAttendance(),
        api.getUsers()
      ]);

      // Filter only those with justifications
      const withJustifications = attendanceData.filter(a => a.justification !== null && !a.justification.isArchived && a.justification.status === 'PENDING');

      // Map users for easy lookup
      const userMap: Record<string, User> = {};
      userData.forEach(u => {
        userMap[u.id] = u;
      });

      setAttendances(withJustifications.sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
      ));


      setUsers(userMap);
    } catch (error) {
      console.error("Error fetching justifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (attendance: Attendance, status: JustificationStatus) => {
    try {
      if (!attendance.justification) return;

      await api.updateAttendance(attendance.id, {
        justification: {
          ...attendance.justification,
          status: status,
          isArchived: status !== 'PENDING'
        }
      });

      // Refresh list and close modal
      setModalVisible(false);
      fetchData();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const STATUS_COLORS = {
    ACCEPTED: '#66BB6A',
    REJECTED: '#CF6679',
    PENDING: '#FFB74D',
    DEFAULT: colors.onSurfaceVariant,
  };

  const getStatusColor = (status: JustificationStatus) => {
    switch (status) {
      case 'ACCEPTED': return STATUS_COLORS.ACCEPTED;
      case 'REJECTED': return STATUS_COLORS.REJECTED;
      case 'PENDING': return STATUS_COLORS.PENDING;
      default: return STATUS_COLORS.DEFAULT;
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
              <Text variant="bodySmall" style={{ opacity: 0.7, marginBottom: 6 }}>
                Date: {item.date}
              </Text>
              <Text variant="bodyMedium" numberOfLines={1} style={styles.messagePreview}>
                "{item.justification?.message.slice(0, 50)}..."
              </Text>
            </View>
            <Button mode="text" onPress={() => {
              setSelectedJustification(item);
              setModalVisible(true);
            }}>View Details</Button>
          </View>
        </Card.Content>
      </Card>
    );
  };

  return (
    <View style={[styles.container]}>
      <Appbar.Header elevated >
        <Appbar.Content title="Justifications" titleStyle={{ fontWeight: 'bold' }} />
        <Appbar.Action icon="archive-clock-outline" onPress={() => router.push('/(admin)/archived-justifications')} />
        <Appbar.Action icon="logout" onPress={handleLogout} />
      </Appbar.Header>

      {loading ? (
        <View style={[styles.center]}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={{ marginTop: 10 }}>Loading justifications...</Text>
        </View>
      ) : attendances.length === 0 ? (
        <View style={[styles.center]}>
          <MaterialCommunityIcons name="file-document-outline" size={64} color={colors.onSurfaceVariant} />
          <Text variant="titleMedium" style={{ color: colors.onSurfaceVariant, marginTop: 16 }}>No justifications found</Text>
        </View>
      ) : (
        <FlatList
          data={attendances}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={[styles.list]}
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
                <Text variant="headlineSmall" style={{ fontWeight: 'bold' }}>Review Justification</Text>
                <IconButton icon="close" onPress={() => setModalVisible(false)} />
              </View>

              <View style={styles.detailRow}>
                <Text variant="labelLarge"> {users[selectedJustification.user_id]?.firstName} {users[selectedJustification.user_id]?.lastName}</Text>
                <Text variant="labelLarge">
                  {selectedJustification.date}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text variant="labelLarge">Current Status:</Text>
                <Chip
                  textStyle={{ fontSize: 10, color: "white" }}
                  style={{ backgroundColor: getStatusColor(selectedJustification.justification?.status || 'PENDING') }}

                >
                  {selectedJustification.justification?.status}
                </Chip>
              </View>

              <Divider style={{ marginVertical: 8 }} />

              <Text variant="labelLarge">Message:</Text>
              <View style={styles.messageContainer}>
                <Text variant="bodyMedium" style={styles.messageText}>
                  {selectedJustification.justification?.message || "No message provided."}
                </Text>
              </View>

              {/* {selectedJustification.justification?.file_path && (
                <View style={{ marginTop: 16 }}>
                  <Text variant="labelLarge">Attached Document:</Text>
                  <TouchableOpacity style={styles.filePlaceholder}>
                    <MaterialCommunityIcons name="file-pdf-box" size={24} color={colors.error} />
                    <Text style={{ marginLeft: 8, color: colors.primary }}>View Attachment</Text>
                  </TouchableOpacity>
                </View>
              )} */}

              <View style={styles.modalActions}>
                <Button
                  mode="contained"
                  onPress={() => handleStatusUpdate(selectedJustification, 'ACCEPTED')}
                  style={[styles.actionBtn, { backgroundColor: STATUS_COLORS.ACCEPTED }]}
                  icon="check-circle"
                >
                  Accept
                </Button>
                <Button
                  mode="contained"
                  onPress={() => handleStatusUpdate(selectedJustification, 'REJECTED')}
                  style={[styles.actionBtn, { backgroundColor: STATUS_COLORS.REJECTED }]}
                  icon="close-circle"
                >
                  Reject
                </Button>
              </View>

              <Button
                mode="outlined"
                onPress={() => handleStatusUpdate(selectedJustification, 'PENDING')}
                style={{ marginTop: 12, borderRadius: 8 }}
              >
                Cancel
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
    backgroundColor: AppTheme.colors.background
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
  },
  filePlaceholder: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: AppTheme.colors.surfaceVariant,
    borderRadius: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: AppTheme.colors.outlineVariant,
    borderStyle: 'dashed',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 12,
  },
  actionBtn: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 6,
  }
});
