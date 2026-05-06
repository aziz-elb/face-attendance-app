import React, { useState, useEffect, useCallback } from 'react';
import { router, useFocusEffect } from 'expo-router';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Text, Appbar, List, IconButton, useTheme, ActivityIndicator, Searchbar, Portal, Modal, TextInput, Button, SegmentedButtons } from 'react-native-paper';
import { api } from '../../lib/api';
import { User } from '@/lib/types';

export default function StudentListing() {
  const { colors } = useTheme();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all'); // all, poor, moderate, good
  
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [notifMessage, setNotifMessage] = useState('');
  const [sendingNotif, setSendingNotif] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [allUsers, allAttendance] = await Promise.all([
        api.getUsers(),
        api.getAttendance()
      ]);

      const adminDeptId = api.currentUser?.department?.id || "";
      if(!adminDeptId){
        setLoading(false);
        return;
      }
      const students = allUsers.filter(u => 
        u.role === 'USER' && 
        u.department?.id === adminDeptId
      ).map(u => {
        const userAtt = allAttendance.filter(a => a.user_id === u.id);
        const totalDays = userAtt.length;
        const presentDays = userAtt.filter(a => a.status === 'PRESENT').length;
        // Mock some data if no attendance yet to demonstrate filtering
        const rate = totalDays > 0 ? (presentDays / totalDays) * 100 : Math.floor(Math.random() * 40) + 60; 
        return { ...u, attendanceRate: rate };
      });

      setUsers(students);
    } catch (error) {
      Alert.alert('Error', 'Failed to load students');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  const openNotifModal = (user) => {
    setSelectedUser(user);
    setNotifMessage('');
    setModalVisible(true);
  };

  const sendNotification = async () => {
    if (!notifMessage) return;
    setSendingNotif(true);
    try {
      await api.addNotification({
        recipient_id: selectedUser.id,
        sender_id: api.currentUser.id, 
        content: notifMessage,
      });
      Alert.alert('Success', 'Notification sent');
      setModalVisible(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to send notification');
    } finally {
      setSendingNotif(false);
    }
  };

  const filteredUsers = users.filter((u:User) => {
    const matchesSearch = `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (filter === 'all') return true;
    if (filter === 'poor') return u.attendanceRate  < 70;
    if (filter === 'moderate') return u.attendanceRate >= 70 && u.attendanceRate < 85;
    if (filter === 'good') return u.attendanceRate >= 85;
    return true;
  });

  const getRateColor = (rate) => {
    if (rate >= 85) return '#4CAF50';
    if (rate >= 70) return '#FF9800';
    return '#F44336';
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Appbar.Header elevated>
        <Appbar.Content title="Students" titleStyle={{ fontWeight: 'bold' }} />
        <Appbar.Action icon="logout" onPress={() => router.replace('/(auth)/login')} />
      </Appbar.Header>

      <View style={styles.header}>
        <Searchbar
          placeholder="Search students..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />
        <SegmentedButtons
          value={filter}
          onValueChange={setFilter}
          buttons={[
            { value: 'all', label: 'All' },
            { value: 'poor', label: 'Risk' },
            { value: 'moderate', label: 'At Risk' },
            { value: 'good', label: 'Good' },
          ]}
          style={styles.filterBtns}
        />
      </View>

      {filteredUsers.length === 0 ? (
        <View >
          <Text variant="titleMedium" style={{textAlign: 'center', marginTop: 16}}>No users found</Text>
        </View>
      ) : (
        <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }:any  ) => (
          <List.Item
            title={`${item.firstName} ${item.lastName} ${Math.round(item.attendanceRate)}%`}
            description={`${item.email}`}
            descriptionStyle={{
              fontSize: 12,
              color: '#888',
            }}
            left={props => <List.Icon {...props} icon="account" color={getRateColor(item.attendanceRate)} />}
            right={props => (
              <IconButton 
                icon="message-text-outline" 
                onPress={() => openNotifModal(item)} 
              />
            )}
            style={styles.listItem}
          />
        )}
      />
)}

      <Portal>
        <Modal 
          visible={modalVisible} 
          onDismiss={() => setModalVisible(false)} 
          contentContainerStyle={[styles.modal, { backgroundColor: colors.surface }]}
        >
          <Text variant="headlineSmall" style={styles.modalTitle}>
            Send to {selectedUser?.firstName}
          </Text>
          <TextInput
            label="Message"
            value={notifMessage}
            onChangeText={setNotifMessage}
            mode="outlined"
            multiline
            numberOfLines={4}
            style={styles.input}
          />
          <View style={styles.modalButtons}>
            <Button onPress={() => setModalVisible(false)}>Cancel</Button>
            <Button 
              mode="contained" 
              onPress={sendNotification} 
              loading={sendingNotif}
              disabled={sendingNotif || !notifMessage}
            >
              Send
            </Button>
          </View>
        </Modal>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    elevation: 2,
  },
  searchBar: {
    marginBottom: 12,
  },
  filterBtns: {
    marginBottom: 4,
  },
  listItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modal: {
    padding: 20,
    margin: 20,
    borderRadius: 12,
  },
  modalTitle: {
    marginBottom: 16,
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  }
});
