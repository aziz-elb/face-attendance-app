import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { Appbar, Button, HelperText, Surface, TextInput, useTheme } from 'react-native-paper';
import { api } from '../../lib/api';

export default function AdminChangePassword() {
  const { colors } = useTheme();
  const router = useRouter();
  const user = api.currentUser;

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleUpdate = async () => {
    if (!user) return;

    if (formData.newPassword !== formData.confirmPassword) {
      if (Platform.OS === "web") {
        alert("Error: New passwords do not match");
      }
      else {
        Alert.alert('Error', 'New passwords do not match');
      }
      return;
    }

    if (formData.newPassword.length < 6) {
      if (Platform.OS === "web") {
        alert("Error: Password must be at least 6 characters");
      }
      else {
        Alert.alert('Error', 'Password must be at least 6 characters');
      }
      return;
    }

    setLoading(true);
    try {
      // In a real app, you'd verify currentPassword first. 
      if (user.password !== formData.currentPassword) {
        if (Platform.OS === "web") {
          alert('Error\nIncorrect current password');
          return;
        }
        Alert.alert('Error', 'Incorrect current password');
        return;
      }

      const updatedUser = await api.updateUser(user.id, {
        password: formData.newPassword
      });

      api.currentUser = updatedUser;

      setSuccess('Admin password changed!');
      setTimeout(() => router.replace('/(admin)/profile'), 1000);
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      if (Platform.OS === "web") {
        alert("Error: Failed to change password");
      }
      else {
        Alert.alert('Error', 'Failed to change password');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Appbar.Header elevated >
        <Appbar.Action icon="arrow-left" onPress={() => router.push('/(admin)/profile')} />
        <Appbar.Content title="Change Password" titleStyle={{ fontWeight: 'bold' }} />
      </Appbar.Header>
      <ScrollView contentContainerStyle={styles.content}>
        <Surface style={[styles.surface, { backgroundColor: colors.surface }]} elevation={1}>
          {success ? <HelperText type="info" style={{ color: colors.primary }}>{success}</HelperText> : null}

          <TextInput
            label="Current Password"
            value={formData.currentPassword}
            onChangeText={(val) => setFormData({ ...formData, currentPassword: val })}
            mode="outlined"
            secureTextEntry
            style={styles.input}
          />

          <TextInput
            label="New Admin Password"
            value={formData.newPassword}
            onChangeText={(val) => setFormData({ ...formData, newPassword: val })}
            mode="outlined"
            secureTextEntry
            style={styles.input}
          />

          <TextInput
            label="Confirm New Password"
            value={formData.confirmPassword}
            onChangeText={(val) => setFormData({ ...formData, confirmPassword: val })}
            mode="outlined"
            secureTextEntry
            style={styles.input}
          />

          <Button
            mode="contained"
            onPress={handleUpdate}
            loading={loading}
            style={styles.button}
            disabled={loading}
          >
            Confirm Password Change
          </Button>
        </Surface>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  surface: {
    padding: 20,
    borderRadius: 12,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
    borderRadius: 28,
  }
});
