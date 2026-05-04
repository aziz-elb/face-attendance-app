import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import { Text, List, Button, Portal, Modal, Searchbar, useTheme, IconButton, ActivityIndicator } from 'react-native-paper';
import { useLocalSearchParams, router } from 'expo-router';
import { api } from '../../../lib/api';
import { User, Department } from '../../../lib/types';

export default function ManageDepartmentUsers() {
  const { id } = useLocalSearchParams();
  const { colors } = useTheme();
  const [deptUsers, setDeptUsers] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [visible, setVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentDept, setCurrentDept] = useState<Department | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const users = await api.getUsers();
      const depts = await api.getDepartments();
      const dept = depts.find(d => String(d.id) === String(id));
      setCurrentDept(dept || null);

      // Filter users already in this department
      setDeptUsers(users.filter(u => u.department && String(u.department.id) === String(id)));
      // Filter users NOT in this department
      setAllUsers(users.filter(u => !u.department || String(u.department.id) !== String(id)));
    } catch (error) {
      Alert.alert('Error', 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const addUserToDept = async (userId: string) => {
    if (!currentDept) return;
    try {
      await api.updateUser(userId, { 
        department: { id: currentDept.id, title: currentDept.title } 
      });
      fetchData();
      setVisible(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to add user');
    }
  };

  const removeUserFromDept = async (userId: string) => {
    try {
      await api.updateUser(userId, { department: null });
      fetchData();
    } catch (error) {
      Alert.alert('Error', 'Failed to remove user');
    }
  };

  const filteredUsers = allUsers.filter(u => 
    `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <IconButton icon="arrow-left" onPress={() => router.back()} />
        <Text variant="headlineSmall" style={styles.title}>Department Users</Text>
      </View>

      <FlatList
        data={deptUsers}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text style={styles.emptyText}>No users in this department</Text>}
        renderItem={({ item }) => (
          <List.Item
            title={`${item.firstName} ${item.lastName}`}
            description={`${item.role} - ${item.email}`}
            left={props => <List.Icon {...props} icon="account" />}
            right={props => (
              <IconButton 
                icon="account-remove" 
                iconColor={colors.error} 
                onPress={() => removeUserFromDept(item.id)} 
              />
            )}
            style={styles.listItem}
          />
        )}
      />

      <Button 
        mode="contained" 
        onPress={() => setVisible(true)} 
        style={styles.addBtn}
        icon="plus"
      >
        Add User to Department
      </Button>

      <Portal>
        <Modal 
          visible={visible} 
          onDismiss={() => setVisible(false)} 
          contentContainerStyle={[styles.modal, { backgroundColor: colors.surface }]}
        >
          <Text variant="headlineSmall" style={styles.modalTitle}>Add User</Text>
          <Searchbar
            placeholder="Search users..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchBar}
          />
          <FlatList
            data={filteredUsers}
            keyExtractor={(item) => item.id.toString()}
            style={{ maxHeight: 300 }}
            renderItem={({ item }) => (
              <List.Item
                title={`${item.firstName} ${item.lastName}`}
                description={item.email}
                onPress={() => addUserToDept(item.id)}
                right={props => <List.Icon {...props} icon="plus" />}
              />
            )}
          />
          <Button onPress={() => setVisible(false)} style={styles.closeBtn}>Close</Button>
        </Modal>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontWeight: 'bold',
  },
  listItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    opacity: 0.6,
  },
  addBtn: {
    marginVertical: 16,
  },
  modal: {
    padding: 20,
    margin: 20,
    borderRadius: 8,
    maxHeight: '80%',
  },
  modalTitle: {
    marginBottom: 16,
    fontWeight: 'bold',
  },
  searchBar: {
    marginBottom: 8,
  },
  closeBtn: {
    marginTop: 16,
  }
});
