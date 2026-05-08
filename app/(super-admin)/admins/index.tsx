import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Platform, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Appbar, Button, FAB, IconButton, List, Modal, Portal, Text, TextInput, useTheme } from 'react-native-paper';
import { api } from '../../../lib/api';
import { User } from '../../../lib/types';

export default function AdminManagementPage() {
  const { colors } = useTheme();
  const [admins, setAdmins] = useState<User[]>([]);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [editingAdmin, setEditingAdmin] = useState<User | null>(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const fetchAdmins = async () => {
    try {
      const users = await api.getUsers();
      setAdmins(users.filter(u => u.role === 'ADMIN'));
    } catch (error) {
      if(Platform.OS === "web"){
        alert("Error: Failed to fetch admins");
      }
      else{
        Alert.alert('Error', 'Failed to fetch admins');
      }
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const showModal = (admin:User | null = null) => {
    if (admin) {
      setEditingAdmin(admin);
      setFormData({
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        password: admin.password || "",
      });
    } else {
      setEditingAdmin(null);
      setFormData({ firstName: '', lastName: '', email: '', password: '' });
    }
    setVisible(true);
  };

  const hideModal = () => setVisible(false);

  const handleSave = async () => {
    if (!formData.email || !formData.firstName || !formData.lastName || !formData.password) {
      if(Platform.OS === "web"){
        alert("Error: Please fill all fields");
        return;
      }
      else{
        Alert.alert('Error', 'Please fill all fields');
        return;
      }
    }
    setLoading(true);
    try {
      if (editingAdmin) {
        await api.updateUser(editingAdmin.id, formData);
      } else {
        await api.signup({ ...formData, role: 'ADMIN' , isActive: true });
      }
      fetchAdmins();
      hideModal();
    } catch (error) {
      if(Platform.OS === "web"){
        alert("Error: Failed to save admin");
      }
      else{
        Alert.alert('Error', 'Failed to save admin');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id:any) => {
    // Logique pour le Web
    if (Platform.OS === "web") {
      const confirmed = window.confirm("Delete Admin: Delete this admin account?");
      if (confirmed) {
        processDelete(id);
      }
      return; // On arrête la fonction ici pour le web
    }

    // Logique pour Mobile (iOS/Android)
    Alert.alert('Delete Admin', 'Delete this admin account?', [
      { text: 'Cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => processDelete(id)
      }
    ]);
  };

  // Petite fonction utilitaire pour éviter de répéter le code de suppression
  const processDelete = async (id:any) => {
    try {
      await api.deleteUser(id);
      fetchAdmins();
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  };

  if (fetchLoading) return <ActivityIndicator style={{ flex: 1 }} />;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Appbar.Header elevated>
        <Appbar.Content title="Admins" titleStyle={{ fontWeight: 'bold' }} />
      </Appbar.Header>
      
      <FlatList
        data={admins}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <List.Item
            title={`${item.firstName} ${item.lastName}`}
            description={`${item.email}${item.department ? ` • ${item.department.title}` : ''}`}
            left={props => <List.Icon {...props} icon="shield-account" />}
            right={props => (
              <View style={styles.actions}>
                <IconButton icon="pencil" onPress={() => showModal(item)} />
                <IconButton icon="delete" iconColor={colors.error} onPress={() => handleDelete(item.id)} />
              </View>
            )}
            style={styles.listItem}
          />
        )}
      />

      <Portal>
        <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={[styles.modal, { backgroundColor: colors.surface }]}>
          <Text variant="headlineSmall" style={styles.modalTitle}>
            {editingAdmin ? 'Edit Admin' : 'Add Admin'}
          </Text>
          <TextInput
            label="First Name"
            value={formData.firstName}
            onChangeText={(v) => setFormData({ ...formData, firstName: v })}
            mode="outlined"
            style={styles.input}
            
          />
          <TextInput
            label="Last Name"
            value={formData.lastName}
            onChangeText={(v) => setFormData({ ...formData, lastName: v })}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="Email"
            value={formData.email}
            onChangeText={(v) => setFormData({ ...formData, email: v })}
            mode="outlined"
            keyboardType="email-address"
            style={styles.input}
          />
          {!editingAdmin && (
            <TextInput
              label="Password"
              value={formData.password}
              onChangeText={(v) => setFormData({ ...formData, password: v })}
              mode="outlined"
              secureTextEntry
              style={styles.input}
            />
          )}
          <View style={styles.modalButtons}>
            <Button onPress={hideModal}>Cancel</Button>
            <Button mode="contained" onPress={handleSave} loading={loading} style={styles.saveBtn}>
              Save
            </Button>
          </View>
        </Modal>
      </Portal>

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: colors.primaryContainer }]}
        onPress={() => showModal()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  actions: {
    flexDirection: 'row',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  modal: {
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  modalTitle: {
    marginBottom: 16,
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 12,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  saveBtn: {
    marginLeft: 8,
  }
});
