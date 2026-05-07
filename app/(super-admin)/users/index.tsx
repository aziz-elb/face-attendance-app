import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Platform, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Appbar, Divider, List, Searchbar, Switch, Text, useTheme } from 'react-native-paper';
import { api } from '../../../lib/api';
import { User } from '../../../lib/types';
import { router } from 'expo-router';
import { useLogout } from '@/hooks/useLogout';

export default function UserManagementPage() {
  const { colors } = useTheme();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const handleLogout = useLogout();

  const fetchUsers = async () => {
    try {
      const data = await api.getUsers();
      // Show all users except Super Admin maybe? Or just role USER as requested.
      // The request says "Users Pages", usually means regular users.
      setUsers(data.filter(u => u.role === 'USER'));
    } catch (error) {
      if (Platform.OS === "web") {
        alert("Error: Failed to fetch users");
      }
      else {
        Alert.alert('Error', 'Failed to fetch users');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleStatus = async (user: User) => {
    try {
      const newStatus = !user.isActive;
      await api.updateUser(user.id, { isActive: newStatus });
      fetchUsers();
    } catch (error) {
      if (Platform.OS === "web") {
        alert("Error: Failed to update status");
      }
      else {
        Alert.alert('Error', 'Failed to update status');
      }
    }
  };

  const filteredUsers = users.filter(u =>
    `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Appbar.Header elevated>
        <Appbar.Content title="Users" titleStyle={{ fontWeight: 'bold' }} />
        <Appbar.Action icon="logout" onPress={handleLogout} />

      </Appbar.Header>

      <Searchbar
        placeholder="Search users..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />

      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.userCard, { backgroundColor: colors.background }]}>
            <List.Item
              title={`${item.firstName} ${item.lastName}`}
              description={`${item.email}`}
              descriptionStyle={{ fontSize: 10 }}
              left={props => <List.Icon {...props} icon="account" />}
              right={props => (
                <View style={styles.rightActions}>
                  <Text variant="bodySmall" style={{ marginRight: 8, color: colors.onSecondaryContainer }}>
                    {item.isActive ? 'Active' : 'Inactive'}
                  </Text>
                  <Switch
                    value={item.isActive}
                    onValueChange={() => toggleStatus(item)}
                  />
                </View>
              )}
            />
            <Divider />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBar: {
    margin: 16,
    elevation: 4,
  },
  userCard: {
    backgroundColor: '#fff',
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  resetBtn: {
    borderColor: '#ff9800',
  }
});
