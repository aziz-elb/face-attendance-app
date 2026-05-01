import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
import { Button, HelperText, Surface, TextInput, useTheme } from 'react-native-paper';

export default function EditInfoScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  // Mock initial data - in a real app this would come from a state manager or context
  const [formData, setFormData] = useState({
    firstName: 'Aziz',
    lastName: 'Elb',
    email: 'aziz@gmail.com',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSave = async () => {
    if (!formData.firstName || !formData.lastName || !formData.email) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess('Information updated successfully!');
      setTimeout(() => router.back(), 1500);
    } catch (err) {
      setError('Failed to update information');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Surface style={styles.surface} elevation={1}>
          {error ? <HelperText type="error">{error}</HelperText> : null}
          {success ? <HelperText type="info" style={{ color: colors.primary }}>{success}</HelperText> : null}

          <TextInput
            label="First Name"
            value={formData.firstName}
            onChangeText={(val) => setFormData({ ...formData, firstName: val })}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Last Name"
            value={formData.lastName}
            onChangeText={(val) => setFormData({ ...formData, lastName: val })}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Email"
            value={formData.email}
            onChangeText={(val) => setFormData({ ...formData, email: val })}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
            left={<TextInput.Icon icon="email" />}
          />

          <Button
            mode="contained"
            onPress={handleSave}
            loading={loading}
            disabled={loading}
            style={styles.button}
          >
            Save Changes
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
    backgroundColor: '#f8f9fa',
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
