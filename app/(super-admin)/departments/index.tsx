import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Platform, StyleSheet, View } from 'react-native';
import { Appbar, Button, FAB, IconButton, List, Modal, Portal, Text, TextInput, useTheme } from 'react-native-paper';
import { api } from '../../../lib/api';
import { Department } from '../../../lib/types';

export default function DepartmentsPage() {
  const { colors } = useTheme();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [code, setCode] = useState('');

  const fetchDepartments = async () => {
    try {
      const data = await api.getDepartments();
      setDepartments(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch departments');
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const showModal = (dept: Department | null = null) => {
    if (dept) {
      setEditingDept(dept);
      setTitle(dept.title);
      setDescription(dept.description);
      setCode(dept.code || '');
    } else {
      setEditingDept(null);
      setTitle('');
      setDescription('');
      setCode('');
    }
    setVisible(true);
  };

  const hideModal = () => setVisible(false);

  const handleSave = async () => {
    if (!title || !code) {
      if (Platform.OS === "web") {
        alert("Error: Please fill required fields");
        return;
      }
      else {
        Alert.alert('Error', 'Title and Code are required');
        return;
      }
    }
    setLoading(true);
    try {
      if (editingDept) {
        await api.updateDepartment(editingDept.id, { title, description, code });
      } else {
        await api.addDepartment({ title, description, code });
      }
      fetchDepartments();
      hideModal();
    } catch (error) {
      if (Platform.OS === "web") {
        alert("Error: Failed to save department");
      }
      else {
        Alert.alert('Error', 'Failed to save department');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: any) => {
    const message = 'Are you sure you want to delete this department?';
    const title = 'Delete Department';

    // --- LOGIQUE WEB ---
    if (Platform.OS === 'web') {
      if (window.confirm(`${title}\n\n${message}`)) {
        await executeDelete(id);
      }
      return;
    }

    // --- LOGIQUE MOBILE (iOS/Android) ---
    Alert.alert(title, message, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => executeDelete(id)
      }
    ]);
  };

  // Fonction utilitaire pour éviter la répétition du try/catch
  const executeDelete = async (id: any) => {
    try {
      await api.deleteDepartment(id);
      fetchDepartments();
    } catch (error) {
      const errorMsg = 'Failed to delete';
      if (Platform.OS === 'web') {
        window.alert(errorMsg);
      } else {
        Alert.alert('Error', errorMsg);
      }
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Appbar.Header elevated>
        <Appbar.Content title="Departments" titleStyle={{ fontWeight: 'bold' }} />
      </Appbar.Header>

      <FlatList
        data={departments}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <List.Item
            title={`${item.title} (${item.code})`}
            description={item.description}
            left={props => <List.Icon {...props} icon="office-building" />}
            right={props => (
              <View style={styles.actions}>
                <IconButton icon="account-plus" onPress={() => router.push(`/(super-admin)/departments/${item.id}`)} />
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
            {editingDept ? 'Edit Department' : 'Add Department'}
          </Text>
          <TextInput
            label="Title"
            value={title}
            onChangeText={setTitle}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="Code"
            value={code}
            onChangeText={setCode}
            mode="outlined"
            style={styles.input}
            placeholder="e.g. CS-01"
          />
          <TextInput
            label="Description"
            value={description}
            onChangeText={setDescription}
            mode="outlined"
            multiline
            numberOfLines={3}
            style={styles.input}
          />
          <View style={styles.modalButtons}>
            <Button onPress={hideModal} style={styles.button}>Cancel</Button>
            <Button mode="contained" onPress={handleSave} loading={loading} style={styles.button}>
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
  button: {
    marginLeft: 8,
  }
});
