import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { Avatar, Button, Card, Divider, List, Modal, Portal, Text, TextInput, useTheme } from 'react-native-paper';

export default function SuperAdminProfile() {
  const { colors } = useTheme();
  const [visible, setVisible] = useState(false);
  const [modalType, setModalType] = useState(''); // 'info' or 'password'

  // Mock data for current super admin
  const [adminInfo, setAdminInfo] = useState({
    firstName: 'Super',
    lastName: 'Admin',
    email: 'super@demo.com',
  });

  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const showModal = (type:any) => {
    setModalType(type);
    setVisible(true);
  };

  const hideModal = () => {
    setVisible(false);
    setPasswords({ current: '', new: '', confirm: '' });
  };

  const handleUpdateInfo = () => {
    // Logic to update info via API
    Alert.alert('Success', 'Information updated successfully');
    hideModal();
  };

  const handleChangePassword = () => {
    if (passwords.new !== passwords.confirm) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    // Logic to change password via API
    Alert.alert('Success', 'Password changed successfully');
    hideModal();
  };

  const handleLogout = () => {
    if (Platform.OS == "android") {
      Alert.alert('Logout', 'Are you sure you want to logout?', [
        { text: 'Cancel' },
        { text: 'Logout', onPress: () => router.replace('/(auth)/login') }
      ]);
    } else {
      router.replace('/(auth)/login');
    }

  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <Avatar.Icon size={80} icon="account-tie" style={styles.avatar} />
        <Text variant="headlineMedium" style={styles.userName}>
          {adminInfo.firstName} {adminInfo.lastName}
        </Text>
        <Text variant="bodyLarge" style={styles.userRole}>Super Administrator</Text>
      </View>

      <View style={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <List.Section>
              <List.Subheader>Account Information</List.Subheader>
              <List.Item
                title="Full Name"
                description={`${adminInfo.firstName} ${adminInfo.lastName}`}
                left={props => <List.Icon {...props} icon="account-details" />}
                onPress={() => showModal('info')}
              />
              <Divider />
              <List.Item
                title="Email Address"
                description={adminInfo.email}
                left={props => <List.Icon {...props} icon="email" />}
                onPress={() => showModal('info')}
              />
              <Divider />
              <List.Item
                title="Security"
                description="Change account password"
                left={props => <List.Icon {...props} icon="lock-outline" />}
                onPress={() => showModal('password')}
              />
            </List.Section>
          </Card.Content>
        </Card>

        <Button
          mode="outlined"
          onPress={handleLogout}
          style={styles.logoutBtn}
          icon="logout"
          textColor={colors.error}
        >
          Logout
        </Button>
      </View>

      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={[styles.modal, { backgroundColor: colors.surface }]}
        >
          {modalType === 'info' ? (
            <>
              <Text variant="headlineSmall" style={styles.modalTitle}>Update Information</Text>
              <TextInput
                label="First Name"
                value={adminInfo.firstName}
                onChangeText={(v) => setAdminInfo({ ...adminInfo, firstName: v })}
                mode="outlined"
                style={styles.input}
              />
              <TextInput
                label="Last Name"
                value={adminInfo.lastName}
                onChangeText={(v) => setAdminInfo({ ...adminInfo, lastName: v })}
                mode="outlined"
                style={styles.input}
              />
              <Button mode="contained" onPress={handleUpdateInfo} style={styles.modalActionBtn}>
                Update
              </Button>
            </>
          ) : (
            <>
              <Text variant="headlineSmall" style={styles.modalTitle}>Change Password</Text>
              <TextInput
                label="Current Password"
                secureTextEntry
                mode="outlined"
                value={passwords.current}
                onChangeText={(v) => setPasswords({ ...passwords, current: v })}
                style={styles.input}
              />
              <TextInput
                label="New Password"
                secureTextEntry
                mode="outlined"
                value={passwords.new}
                onChangeText={(v) => setPasswords({ ...passwords, new: v })}
                style={styles.input}
              />
              <TextInput
                label="Confirm New Password"
                secureTextEntry
                mode="outlined"
                value={passwords.confirm}
                onChangeText={(v) => setPasswords({ ...passwords, confirm: v })}
                style={styles.input}
              />
              <Button mode="contained" onPress={handleChangePassword} style={styles.modalActionBtn}>
                Change Password
              </Button>
            </>
          )}
          <Button onPress={hideModal} style={{ marginTop: 8 }}>Cancel</Button>
        </Modal>
      </Portal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 32,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 4,
  },
  avatar: {
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  userName: {
    color: '#fff',
    fontWeight: 'bold',
  },
  userRole: {
    color: 'rgba(255,255,255,0.8)',
  },
  content: {
    padding: 16,
    marginTop: -20,
  },
  card: {
    borderRadius: 15,
    elevation: 4,
    backgroundColor: '#fff',
  },
  logoutBtn: {
    marginTop: 24,
    borderColor: '#ff5252',
  },
  modal: {
    padding: 20,
    margin: 20,
    borderRadius: 12,
  },
  modalTitle: {
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    marginBottom: 12,
  },
  modalActionBtn: {
    marginTop: 8,
  }
});
