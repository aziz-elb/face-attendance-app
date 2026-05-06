import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Button, HelperText, Surface, TextInput, useTheme, ActivityIndicator, Appbar } from 'react-native-paper';
import { api } from '../../lib/api';

export default function EditInfoScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const userId = api.currentUser?.id; // Placeholder, should be 

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await api.getUser(userId!);
        setFormData({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        });
      } catch (err) {
        setError('Failed to load user information');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleSave = async () => {
    if (!formData.firstName || !formData.lastName || !formData.email) {
      setError('Please fill in all fields');
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await api.updateUser(userId!, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
      });
      setSuccess('Information updated successfully!');
      router.push('/(user)/profile')
    } catch (err) {
      setError('Failed to update information');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center' }]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
       <Appbar.Header elevated >
        <Appbar.Action icon="arrow-left" onPress={() => router.push('/(user)/profile')} /> 
        <Appbar.Content title="Edit Info" titleStyle={{ fontWeight: 'bold' }} />
      </Appbar.Header>
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
            left={<TextInput.Icon icon="account-outline" />}
          />

          <TextInput
            label="Last Name"
            value={formData.lastName}
            onChangeText={(val) => setFormData({ ...formData, lastName: val })}
            mode="outlined"
            style={styles.input}
            left={<TextInput.Icon icon="account-outline" />}
          />

          <TextInput
            label="Email Address"
            value={formData.email}
            onChangeText={(val) => setFormData({ ...formData, email: val })}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
            left={<TextInput.Icon icon="email-outline" />}
          />

          <Button
            mode="contained"
            onPress={handleSave}
            loading={saving}
            disabled={saving}
            style={styles.button}
          >
            Save Changes
          </Button>

          <Button
            mode="text"
            onPress={() =>  router.replace('/(user)/profile')}
            disabled={saving}
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
