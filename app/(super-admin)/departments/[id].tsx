import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, IconButton, List, Modal, Portal, Searchbar, Text, useTheme, Appbar } from 'react-native-paper';
import { api } from '../../../lib/api';
import { Department, User } from '../../../lib/types';
import { AppTheme } from '@/lib/theme';

export default function ManageDepartmentUsers() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
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
      const [users, depts] = await Promise.all([
        api.getUsers(),
        api.getDepartments()
      ]);
      
      const dept = depts.find(d => String(d.id) === String(id));
      setCurrentDept(dept || null);

      if (dept) {
        // Filter users already in this department
        setDeptUsers(users.filter(u => String(u.department) === String(id)));
        // Filter users NOT in this department and NOT SUPER_ADMIN
        setAllUsers(users.filter(u => String(u.department) !== String(id) && u.role !== 'SUPER_ADMIN'));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load department data');
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
        department: String(currentDept.id)
      });
      await fetchData();
      setVisible(false);
      setSearchQuery('');
    } catch (error) {
      Alert.alert('Error', 'Failed to add user to department');
    }
  };

  const removeUserFromDept = async (userId: string) => {
    try {
      await api.updateUser(userId, { department: "" });
      await fetchData();
    } catch (error) {
      Alert.alert('Error', 'Failed to remove user from department');
    }
  };

  const filteredUsers = allUsers.filter(u => 
    `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading && !currentDept) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Appbar.Header elevated>
        <Appbar.BackAction onPress={() => router.replace('/(super-admin)/departments')} />
        <Appbar.Content 
          title={currentDept ? `Manage: ${currentDept.title}` : 'Department Users'} 
          titleStyle={styles.headerTitle}
        />
      </Appbar.Header>

      <View style={styles.content}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Department Members ({deptUsers.length})
        </Text>

        <FlatList
          data={deptUsers}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No users in this department</Text>
            </View>
          }
          renderItem={({ item }) => (
            <List.Item
              title={`${item.firstName} ${item.lastName}`}
              description={item.email}
              left={props => <List.Icon {...props} icon="account" />}
              right={props => (
                <IconButton
                  icon="account-remove"
                  iconColor={colors.error}
                  onPress={() => removeUserFromDept(item.id)}
                />
              )}
              titleStyle={{ fontWeight: '600' }}
              style={styles.listItem}
            />
          )}
          contentContainerStyle={deptUsers.length === 0 && { flex: 1 }}
        />

        <Button
          mode="contained"
          onPress={() => setVisible(true)}
          style={styles.addBtn}
          icon="plus"
          contentStyle={{ height: 48 }}
        >
          Add Member
        </Button>
      </View>

      <Portal>
        <Modal
          visible={visible}
          onDismiss={() => setVisible(false)}
          contentContainerStyle={[styles.modal, { backgroundColor: colors.surface }]}
        >
          <Text variant="headlineSmall" style={styles.modalTitle}>Add Member</Text>
          <Searchbar
            placeholder="Search all users..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchBar}
            
          />
          <FlatList
            data={filteredUsers}
            keyExtractor={(item) => item.id}
            style={{ maxHeight: 400 }}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No available users found</Text>
            }
            renderItem={({ item }) => (
              <List.Item
                title={`${item.firstName} ${item.lastName}`}
                description={`${item.email}`}
                descriptionStyle={{ fontSize: 12 }}
                onPress={() => addUserToDept(item.id)}
                left={props => <List.Icon {...props} icon="account-plus" color={item.role === 'ADMIN' ? colors.tertiary : colors.primary} />}
                right={props => <IconButton icon="chevron-right" />}
                style={styles.modalItem}
              />
            )}
          />
          <Button onPress={() => setVisible(false)} style={styles.closeBtn}>
            Cancel
          </Button>
        </Modal>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  headerTitle: {
    fontWeight: 'bold',
  },
  sectionTitle: {
    marginBottom: 12,
    opacity: 0.7,
    fontWeight: 'bold',
  },
  listItem: {
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  modalItem: {
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.5,
  },
  addBtn: {
    marginTop: 16,
    borderRadius: 8,
  },
  modal: {
    padding: 20,
    margin: 20,
    borderRadius: 16,
    maxHeight: '80%',
  },
  modalTitle: {
    marginBottom: 16,
    fontWeight: 'bold',
  },
  searchBar: {
    marginBottom: 12,
    elevation: 0,
    backgroundColor: 'transparent',
  },
  closeBtn: {
    marginTop: 16,
  }
});

