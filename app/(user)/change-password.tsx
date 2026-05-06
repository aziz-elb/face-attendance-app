import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Button, HelperText, Surface, TextInput, useTheme } from 'react-native-paper';
import { api } from '../../lib/api';

export default function ChangePasswordScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPass, setShowPass] = useState(false);

  const userId = api.currentUser?.id; // Placeholder, should be 

  const handleUpdate = async () => {
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // 1. Fetch user to verify current password
      const user = await api.getUser(userId!);

      if (user.password !== formData.currentPassword) {
        setError('Current password is incorrect');
        setLoading(false);
        return;
      }

      // 2. Update password
      await api.updateUser(userId!, {
        password: formData.newPassword
      });

      setSuccess('Password updated successfully!');
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
      

      router.push('/(user)/profile')
    } catch (err) {
      setError('Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Surface style={styles.surface} elevation={1}>
          {error ? <HelperText type="error">{error}</HelperText> : null}
          {success ? <HelperText type="info" style={{ color: colors.primary }}>{success}</HelperText> : null}

          <TextInput
            label="Current Password"
            value={formData.currentPassword}
            onChangeText={(val) => setFormData({ ...formData, currentPassword: val })}
            mode="outlined"
            secureTextEntry={!showPass}
            style={styles.input}
            left={<TextInput.Icon icon="lock-outline" />}
          />

          <TextInput
            label="New Password"
            value={formData.newPassword}
            onChangeText={(val) => setFormData({ ...formData, newPassword: val })}
            mode="outlined"
            secureTextEntry={!showPass}
            style={styles.input}
            left={<TextInput.Icon icon="lock-reset" />}
            right={
              <TextInput.Icon
                icon={showPass ? "eye-off" : "eye"}
                onPress={() => setShowPass(!showPass)}
              />
            }
          />

          <TextInput
            label="Confirm New Password"
            value={formData.confirmPassword}
            onChangeText={(val) => setFormData({ ...formData, confirmPassword: val })}
            mode="outlined"
            secureTextEntry={!showPass}
            style={styles.input}
            left={<TextInput.Icon icon="lock-check" />}
          />

          <Button
            mode="contained"
            onPress={handleUpdate}
            loading={loading}
            disabled={loading}
            style={styles.button}
          >
            Update Password
          </Button>

          <Button
            mode="text"
            onPress={() => router.replace('/(user)/profile')}
            disabled={loading}
            style={styles.cancelButton}
          >
            Cancel
          </Button>
        </Surface>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  surface: {
    padding: 20,
    borderRadius: 12,
    backgroundColor: 'white',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
  cancelButton: {
    marginTop: 8,
  }
});
