import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, ScrollView, TouchableOpacity } from 'react-native';
import { 
  Text, 
  Appbar, 
  Card, 
  Button, 
  Chip, 
  Portal, 
  Modal, 
  useTheme, 
  ActivityIndicator,
  Divider,
  IconButton
} from 'react-native-paper';
import { useRouter } from 'expo-router';
import { api } from '../../lib/api';
import { Attendance, User, JustificationStatus } from '../../lib/types';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function JustificationsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [loading, setLoading] = useState(true);
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [oldAttendances, setOldAttendances] = useState<Attendance[]>([]);
  const [users, setUsers] = useState<Record<string, User>>({});
  const [selectedJustification, setSelectedJustification] = useState<Attendance | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [attendanceData, userData] = await Promise.all([
        api.getAttendance(),
        api.getUsers()
      ]);

      // Filter only those with justifications
      const withJustifications = attendanceData.filter(a => a.justification !== null && a.justification.status === 'PENDING');
      const oldJustifications = attendanceData.filter(a => a.justification !== null && a.justification.status !== 'PENDING');
      
      // Map users for easy lookup
      const userMap: Record<string, User> = {};
      userData.forEach(u => {
        userMap[u.id] = u;
      });

      setAttendances(withJustifications.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      ));

      setOldAttendances(oldJustifications.sort((a, b) => 
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
      
      const updatedAttendance = await api.updateAttendance(attendance.id, {
        justification: {
          ...attendance.justification,
          status: status
        }
      });

      // Update local state
      setAttendances(prev => prev.map(a => a.id === attendance.id ? updatedAttendance : a));
      setModalVisible(false);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const getStatusColor = (status: JustificationStatus) => {
    switch (status) {
      case 'ACCEPTED': return '#4CAF50';
      case 'REJECTED': return '#F44336';
      case 'PENDING': return '#FF9800';
      default: return '#757575';
    }
  };

  const renderItem = ({ item }: { item: Attendance }) => {
    const user = users[item.user_id];
    const status = item.justification?.status || 'PENDING';

    return (
      <Card style={styles.card} onPress={() => {
        setSelectedJustification(item);
        setModalVisible(true);
      }}>
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
            <Chip 
              textStyle={{ color: 'white', fontSize: 10 , margin: 2}} 
              style={{ backgroundColor: getStatusColor(status), height: 24 }}
            >
              {status}
            </Chip>
          </View>
          
          <Text variant="bodyMedium" numberOfLines={2} style={styles.messagePreview}>
            "{item.justification?.message}"
          </Text>
        </Card.Content>
        <Card.Actions>
          <Button mode="text" onPress={() => {
            setSelectedJustification(item);
            setModalVisible(true);
          }}>View Details</Button>
        </Card.Actions>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <Appbar.Header elevated >
        <Appbar.Content title="Justifications" titleStyle={{ fontWeight: 'bold' }} />
        <Appbar.Action icon="refresh" onPress={fetchData} />
      </Appbar.Header>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={{ marginTop: 10 }}>Loading justifications...</Text>
        </View>
      ) : attendances.length === 0 ? (
        <View style={styles.center}>
          <MaterialCommunityIcons name="file-document-outline" size={64} color="#ccc" />
          <Text variant="titleMedium" style={{ color: '#aaa', marginTop: 16 }}>No justifications found</Text>
        </View>
      ) : (
        <FlatList
          data={attendances}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
        />
      )}

      <Text variant="titleMedium" style={{marginLeft: 10}}>Justification history</Text>

      <FlatList
        data={oldAttendances}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />

      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={styles.modalContent}
        >
          {selectedJustification && (
            <ScrollView>
              <View style={styles.modalHeader}>
                <Text variant="headlineSmall" style={{ fontWeight: 'bold' }}>Review Justification</Text>
                <IconButton icon="close" onPress={() => setModalVisible(false)} />
              </View>

              <View style={styles.detailRow}>
                <Text variant="labelLarge">Employee:</Text>
                <Text variant="bodyLarge">
                  {users[selectedJustification.user_id]?.firstName} {users[selectedJustification.user_id]?.lastName}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text variant="labelLarge">Date of Absence:</Text>
                <Text variant="bodyLarge">{selectedJustification.date}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text variant="labelLarge">Current Status:</Text>
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

              {selectedJustification.justification?.file_path && (
                <View style={{ marginTop: 16 }}>
                   <Text variant="labelLarge">Attached Document:</Text>
                   <TouchableOpacity style={styles.filePlaceholder}>
                     <MaterialCommunityIcons name="file-pdf-box" size={24} color={colors.error} />
                     <Text style={{ marginLeft: 8, color: colors.primary }}>View Attachment</Text>
                   </TouchableOpacity>
                </View>
              )}

              <View style={styles.modalActions}>
                <Button 
                  mode="contained" 
                  onPress={() => handleStatusUpdate(selectedJustification, 'ACCEPTED')}
                  style={[styles.actionBtn, { backgroundColor: '#4CAF50' }]}
                  icon="check-circle"
                >
                  Accept
                </Button>
                <Button 
                  mode="contained" 
                  onPress={() => handleStatusUpdate(selectedJustification, 'REJECTED')}
                  style={[styles.actionBtn, { backgroundColor: '#F44336' }]}
                  icon="close-circle"
                >
                  Reject
                </Button>
              </View>
              
              <Button 
                mode="outlined" 
                onPress={() => handleStatusUpdate(selectedJustification, 'PENDING')}
                style={{ marginTop: 12 }}
              >
                Set to Pending
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
    backgroundColor: '#f8f9fa',
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
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  messagePreview: {
    fontStyle: 'italic',
    color: '#666',
  },
  modalContent: {
    backgroundColor: 'white',
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
    backgroundColor: '#f0f0f0',
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
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  actionBtn: {
    flex: 1,
    borderRadius: 8,
  }
});
